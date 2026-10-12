"""Contrôles documentaires locaux indépendants F4, sans modifier le candidat."""
from pathlib import Path
from html.parser import HTMLParser
from datetime import datetime
import hashlib
import json
import sqlite3
from typing import Any

ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent
SLUGS = ['automatiser-un-cabinet-cac-la-carte-des-taches', 'cac-reception-fec-constat']

class Texte(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.skip = 0
    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style', 'svg'): self.skip += 1
        if not self.skip and tag in ('p', 'li', 'h1', 'h2', 'h3', 'br'): self.parts.append('\n')
    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'svg'): self.skip -= 1
        if not self.skip and tag in ('p', 'li', 'h1', 'h2', 'h3'): self.parts.append('\n')
    def handle_data(self, data):
        if not self.skip: self.parts.append(data)

def extraire(html):
    parser = Texte()
    parser.feed(html)
    text = '\n'.join(' '.join(line.split()) for line in ''.join(parser.parts).splitlines() if line.strip())
    return text[text.index('NEP '):text.index('Remonter en haut de page')]

results = {'checked_at': datetime.now().astimezone().isoformat(), 'sources': [], 'candidates': [], 'images': []}
for slug in SLUGS:
    recette = ROOT/'editorial/recettes'/slug
    r = json.loads((recette/'recette.json').read_text())
    for source in r['sources']:
        base = ROOT/'editorial/articles'/slug/'preuves/sources'
        metadata = json.loads((base/(source['id']+'.json')).read_text())
        copy = base/(source['id']+'.source.txt')
        digest = hashlib.sha256(copy.read_bytes()).hexdigest()
        assert digest == metadata['contentSha256'], copy
        assert metadata['httpStatus'] == 200 and metadata['checkedAt'] == '2026-10-11'
        text = extraire(copy.read_text())
        (OUT/(slug+'-'+source['id']+'-texte.txt')).write_text(text+'\n')
        results['sources'].append({'path': str(copy.relative_to(ROOT)), 'metadata': str((base/(source['id']+'.json')).relative_to(ROOT)), 'hash_verified': True, 'httpStatus_recorded': metadata['httpStatus'], 'checkedAt_recorded': metadata['checkedAt'], 'url': metadata['finalUrl']})
    p = json.loads((recette/'preuves/claims-preflight.json').read_text())
    assert not p['erreurs']
    results['candidates'].append({'slug': slug, 'body_sha256': hashlib.sha256((recette/'corps.md').read_bytes()).hexdigest(), 'declared_claims': len(p['claims']['claims']), 'preflight_errors': p['erreurs'], 'uncovered_nep_units': [u for u in p['claims']['contentUnits'] if 'paragraphe' in u['text'] and not u['claimIds']]})
    prov = json.loads((recette/'preuves/couverture-provenance.json').read_text())
    assert hashlib.sha256((recette/'preuves/couverture-originale.png').read_bytes()).hexdigest() == prov['outputSha256']
    assert hashlib.sha256((ROOT/prov['source']).read_bytes()).hexdigest() == prov['sourceSha256']
    results['images'].append({'slug': slug, 'frame': prov['frame'], 'hashes_verified': True, 'aiGeneration_recorded': prov['aiGeneration'], 'credits_recorded': prov['credits']})

# Exécuter le banc lu sans son écriture finale dans le workspace de l'auteur.
source = (ROOT.parent/'rejeu_f4.py').read_text()
namespace: dict[str, Any] = {'__file__': str(ROOT.parent/'rejeu_f4.py')}
exec(compile(source.split('(ROOT/\'rejeu-f4-resultats.json\')')[0], str(ROOT.parent/'rejeu_f4.py'), 'exec'), namespace)
rejeu = namespace['resultat']
expected = json.loads((ROOT.parent/'rejeu-f4-resultats.json').read_text())
assert rejeu == expected
assert all(p['saisie'] == 'commentaire du senior' for p in rejeu['pilier'][:3])
assert rejeu['pilier'][-1]['saisie'] == 'commentaire corrigé'
assert all(p['opinion'] is None for p in rejeu['fec'])
(OUT/'rejeu-independant.json').write_text(json.dumps(rejeu, ensure_ascii=False, indent=2)+'\n')
results['rejeu'] = {'cases': len(rejeu['pilier'])+len(rejeu['fec']), 'matches_author_receipt': True, 'all_four_inputs_preserved': True, 'fec_opinion': None, 'scope': 'Banc éditorial JSON ; aucune intégration produit ni validation du format FEC.'}

ref = Path.home()/'hermes/referentiel-juridique'
db = sqlite3.connect('file:'+str(ref/'articles.sqlite')+'?mode=ro', uri=True)
schema = db.execute('select name, sql from sqlite_master where type=?', ('table',)).fetchall()
(OUT/'schema-legi.txt').write_text('\n'.join(str(s) for s in schema)+'\n')
jorf = json.loads((ref/'sources/jorf-nep/JORFTEXT000050510512.json').read_text())
for a in jorf['articles']:
    if 'NEP-315.' in a['text'] or 'NEP-330.' in a['text']:
        (OUT/('jorf-2024-article-'+a['number']+'.txt')).write_text(a['text']+'\n')
        print('JORF', a['number'], a['id'], len(a['text']))
jorf2023 = json.loads((ref/'sources/jorf-nep/JORFTEXT000048735742.json').read_text())
for a in jorf2023['articles']:
    if any(marker in a['text'] for marker in ['NEP-230', 'NEP-500', 'NEP-505']):
        text = a['text']
        paragraphs = []
        for marker in ['NEP-230', 'NEP-500', 'NEP-505']:
            if marker in text:
                start = text.index(marker)
                end = text.find('NEP-', start+len(marker))
                paragraphs.append(text[start:end if end != -1 else len(text)])
        (OUT/('jorf-2023-article-'+a['number']+'.txt')).write_text('\n'.join(paragraphs)+'\n')
        print('JORF2023', a['number'], a['id'], len(text), 'extraits', len('\n'.join(paragraphs)))
(OUT/'controles-locaux.json').write_text(json.dumps(results, ensure_ascii=False, indent=2)+'\n')
print(json.dumps(results, ensure_ascii=False, indent=2))
print('SQLite schema', schema)
