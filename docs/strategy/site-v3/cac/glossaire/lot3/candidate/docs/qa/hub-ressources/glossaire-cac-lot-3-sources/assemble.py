"""Assembler le lot candidat depuis les copies attestées ; aucun verdict métier."""
import datetime
import hashlib
import json
import re
import subprocess
from pathlib import Path
from zoneinfo import ZoneInfo

BASE = Path('docs/qa/hub-ressources/glossaire-cac-lot-3-sources')
PACKAGE = Path('docs/strategy/site-v3/glossaire-cac-lot-3.json')
sha = lambda b: hashlib.sha256(b).hexdigest()
now = lambda: datetime.datetime.now(datetime.timezone.utc).isoformat()
day = lambda t: datetime.datetime.fromisoformat(t).astimezone(ZoneInfo('Europe/Paris')).date().isoformat()

def save(path, value):
    Path(path).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')

# Copies HTTP réellement ouvertes : les horodatages ne sont pas régénérés.
evidence = json.loads((BASE / 'captures.json').read_text())
sources = {}
for sid, item in evidence.items():
    lines = Path(item['snapshotPath']).read_text().splitlines()
    start = next(i for i, line in enumerate(lines) if line.startswith('Homologuée'))
    item['versionAttestation'] = ' '.join(lines[start:start+3])
    item['applicabilityNote'] = ('NEP 330 révisée : exercices ouverts à compter du 19 novembre 2024 ; vérifier le cadre de la mission.' if sid == 'h2a-nep-330' else 'Version homologuée attestée par H2A ; vérifier le cadre propre à la mission.')
    sources[sid] = {'id': sid, 'publisher': 'H2A', 'title': next(line for line in lines if line.startswith('NEP ')), 'url': item['requestedUrl'], 'checkedAt': day(item['retrievedAt'])}

for number in [73, 74, 76, 77, 78]:
    sid = f'dila-a821-{number}'
    path = BASE / f'{sid}.json'
    data = json.loads(path.read_text())
    textpath = BASE / f'{sid}.txt'
    assert textpath.read_text() == data['text']
    retrieved = data['provenance']['retrieved_at']
    sources[sid] = {'id': sid, 'publisher': 'Légifrance — DILA/DINUM', 'title': f'Code de commerce, A.821-{number}', 'url': data['url'], 'checkedAt': day(retrieved)}
    evidence[sid] = {'accessMode': 'dila-copy', 'httpStatus': None, 'requestedUrl': data['url'], 'finalUrl': data['url'], 'upstreamUrl': data['url'], 'retrievedAt': retrieved, 'dilaCopyPath': str(path), 'dilaCopySha256': sha(path.read_bytes()), 'snapshotPath': str(textpath), 'contentSha256': sha(textpath.read_bytes()), 'version': data['id'], 'versionDate': data['valid_from'], 'validToExclusive': data['valid_to_exclusive'], 'warning': data['warning'], 'official': True, 'level': 'tier-1', 'provenance': 'DILA LEGI via dérivé DINUM A4'}

# Accès public et frontmatter publié vérifiés séparément.
link_checks = []
link_specs = [('verifier-reponse-ia-comptabilite', 'vérifier une réponse IA en comptabilité, méthode EC'), ('ia-comptabilite-confidentialite-donnees', 'préparer des données confidentielles pour une IA, contexte EC')]
links = []
for slug, label in link_specs:
    sourcepath = Path(f'src/content/blog/{slug}.md')
    assert 'brouillon: false' in sourcepath.read_text()
    href = f'/blog/{slug}'
    url = 'https://memlia.fr' + href
    result = subprocess.run(['curl', '--silent', '--show-error', '--fail', '--location', '--max-time', '45', '--user-agent', 'Mozilla/5.0 MemliaSourceVerifier/1.0', '--write-out', '\n%{json}', url], check=True, capture_output=True)
    raw, metadata = result.stdout.rsplit(b'\n', 1)
    metadata = json.loads(metadata)
    assert metadata['http_code'] == 200 and re.search(rb'<article[\s>]', raw)
    path = BASE / f'link-{slug}.html'
    path.write_bytes(raw)
    link_checks.append({'href': href, 'url': url, 'finalUrl': metadata['url_effective'], 'httpStatus': metadata['http_code'], 'inMain': True, 'hasArticleBody': True, 'checkedAt': now(), 'snapshotPath': str(path), 'sha256': sha(raw), 'sourcePath': str(sourcepath)})
    links.append({'label': label, 'href': href})

# Paragraphes exacts, sans normalisation ni retouche des erreurs du texte officiel.
headings = ['Introduction', 'Définition', 'Définitions', 'Caractère probant', 'Assertions et collecte des éléments', 'Techniques de contrôle', 'Caractéristiques de la demande de confirmation des tiers', 'Mise en œuvre de la demande de confirmation des tiers', 'Evaluation des résultats de la demande de confirmation des tiers', 'Mise en oeuvre des procédures analytiques', 'Mise en œuvre des procédures analytiques', 'Méthodes de sélection d’éléments à contrôler', "Méthodes de sélection d'éléments à contrôler", 'Sélection de tous les éléments', 'Sélection d’éléments spécifiques', "Sélection d'éléments spécifiques", 'Sondages', 'Analyse des résultats des contrôles et conséquences sur l’audit', "Analyse des résultats des contrôles et conséquences sur l'audit", 'Réponse à l’évaluation du risque d’anomalies significatives au niveau des comptes pris dans leur ensemble', 'Réponse à l’évaluation du risque d’anomalies significatives au niveau des assertions', 'Tests sur les contrôles', 'Procédures de substance en réponse au risque d’anomalies significatives au niveau des assertions', 'Autres procédures de substance à mettre en oeuvre', 'Evaluation du caractère suffisant et approprié des éléments collectés', 'Recours à des outils et techniques automatisés', 'Documentation', 'Remonter en haut de page']

def paragraph(sid, number):
    text = Path(evidence[sid]['snapshotPath']).read_text()
    # H2A imprime 01 sous la forme 0l pour la NEP 500, conservée à l’identique.
    pattern = rf'(?m)^\s*0?{int(number)}\.'
    if number == '01':
        pattern = r'(?m)^\s*(?:01|1|0l|l)\.'
    match = re.search(pattern, text)
    assert match, (sid, number)
    start = match.start()
    while text[start].isspace():
        start += 1
    next_match = re.search(r'(?m)^\s*\d{1,2}\.', text[match.end():])
    end = match.end() + next_match.start() if next_match else len(text)
    quote = text[start:end].rstrip()
    lines = quote.splitlines()
    while lines and lines[-1].strip() in headings:
        lines.pop()
    quote = '\n'.join(lines).rstrip()
    assert len(quote) >= 40 and quote in text
    return {'text': quote, 'locator': f'{sid}:paragraphe-{number}:ligne-{text[:start].count(chr(10))+1}'}

nep_article = {'330': 73, '500': 74, '505': 76, '520': 77, '530': 78}
draft = json.loads((BASE / 'draft.json').read_text())
entries, units = [], []
for d in draft:
    sid_list = [sid for n in d['norms'] for sid in [f'h2a-nep-{n}', f'dila-a821-{nep_article[n]}']]
    entry = {k: d[k] for k in ['term', 'anchor', 'definition', 'context', 'exampleFictitious', 'commonConfusion', 'automationBoundary', 'relatedTerms']}
    entry.update({'id': d['anchor'], 'nature': 'Professionnelle', 'owner': 'Pôle audit CAC', 'author': 'Memlia', 'editorialReviewer': 'Équipe éditoriale Memlia', 'businessReviewer': None, 'reviewedAt': None, 'sourceCheckedAt': day(now()), 'nextReviewAt': '2027-03-13', 'sourceIds': sid_list, 'routeDecision': 'anchor', 'status': 'preview-only', 'internalLinks': links, 'motsSources': {sid: d.get('sourceWords', {}).get(n, d.get('sourceWord')) for n in d['norms'] for sid in [f'h2a-nep-{n}', f'dila-a821-{nep_article[n]}']}})
    entries.append(entry)
    for n, fields in d['norms'].items():
        for field, numbers in fields.items():
            claim = entry[field]
            # Les alias sont des conventions de présentation, pas des définitions normatives autonomes.
            if field == 'definition' and d['anchor'] in ['confirmation-tiers-audit', 'procedures-analytiques']:
                normative, convention = claim.split('. ', 1)
                claim = normative + '.'
                units.append({'id': f'{entry["id"]}-alias-memlia', 'entryId': entry['id'], 'field': field, 'text': convention, 'unitText': entry[field], 'sourceId': None, 'type': 'methode-memlia', 'applicability': 'Présentation du glossaire Memlia.', 'regime': 'Alias de pratique, pas une définition juridique distincte.', 'exceptions': 'Lire le terme normatif et la procédure dans leur cadre de mission.', 'citations': [], 'businessVerdict': None})
            if field == 'definition' and d['anchor'] in ['tests-procedures', 'controles-substance']:
                units.append({'id': f'{entry["id"]}-terminologie-memlia', 'entryId': entry['id'], 'field': field, 'text': entry[field], 'unitText': entry[field], 'sourceId': None, 'type': 'methode-memlia', 'applicability': 'Rapprochement du terme de pratique avec la norme révisée.', 'regime': 'Convention terminologique Memlia ; les libellés normatifs sont cités séparément.', 'exceptions': 'La revue doit apprécier le rapprochement des termes dans ce contexte.', 'citations': [], 'businessVerdict': None})
            for sid in [f'h2a-nep-{n}', f'dila-a821-{nep_article[n]}']:
                units.append({'id': f'{entry["id"]}-{field}-{sid}', 'entryId': entry['id'], 'field': field, 'text': claim, 'unitText': entry[field], 'sourceId': sid, 'type': 'legal-reglementaire', 'applicability': 'Audit des comptes en France ; pour la NEP 330 révisée, missions relatives aux exercices ouverts à compter du 19 novembre 2024. Vérifier le cadre de la mission.', 'regime': f'NEP {n}, version homologuée attestée et article A.821-{nep_article[n]} ; réserve A4 sur la consolidation locale.', 'exceptions': 'La citation ne remplace pas la lecture de la norme ; jugement et appréciation du caractère probant réservés au CAC.', 'citations': [paragraph(sid, number) for number in numbers], 'businessVerdict': None})
    for field in ['exampleFictitious', 'automationBoundary']:
        units.append({'id': f'{entry["id"]}-{field}-memlia', 'entryId': entry['id'], 'field': field, 'text': entry[field], 'unitText': entry[field], 'sourceId': None, 'type': 'methode-memlia', 'applicability': 'Exemple fictif et préparation selon la règle écrite du cabinet.', 'regime': 'Méthode Memlia, sans portée normative propre ni preuve d’intégration livrée.', 'exceptions': 'Le CAC garde le choix des diligences, les appréciations et conclusions ; les saisies humaines restent intactes.', 'citations': [], 'businessVerdict': None})

future = [
    ('/blog/automatiser-un-cabinet-cac-la-carte-des-taches', [e['id'] for e in entries]),
    ('/blog/cac-circularisation-campagne', ['confirmation-tiers-audit']),
    ('/blog/cac-circularisation-ouverte-fermee', ['confirmation-tiers-audit']),
    ('/blog/cac-circularisation-reponse-rapprochement', ['confirmation-tiers-audit', 'caractere-probant']),
    ('/blog/cac-circularisation-alternatives', ['procedures-alternatives-audit']),
    ('/blog/cac-revue-analytique-exemple', ['procedures-analytiques']),
    ('/blog/cac-revue-analytique-procedures', ['procedures-analytiques', 'controles-substance']),
    ('/blog/cac-revue-ecritures-limites-population', ['population-audit', 'sondage-audit', 'selection-elements-specifiques']),
    ('/outils-comptables-gratuits/suivi-circularisation', ['confirmation-tiers-audit', 'procedures-alternatives-audit']),
    ('/outils-comptables-gratuits/revue-analytique-excel', ['procedures-analytiques']),
]
architecture = Path('docs/strategy/site-v3/cac/ARCHITECTURE-CAC.md').read_text()
for href, ids in future:
    assert href in architecture
    if href.startswith('/blog/'):
        assert not Path('src/content' + href + '.md').exists()
existing = re.findall(r"anchor: '([^']+)'", Path('src/data/glossary.ts').read_text())
assert not set(existing) & {e['anchor'] for e in entries}
pack = {'schemaVersion': 1, 'lot': 'cac-audit-3', 'canonical': '/glossaire', 'preparedAt': now(), 'baselineMain': 'f9b65c7d5a40d6ec6ccf17a3c8dee8f6f93eb73f', 'entries': entries, 'sources': sources, 'evidence': {'sources': evidence, 'units': units}, 'linkChecks': link_checks, 'deferredLinks': [{'entryIds': ids, 'href': href, 'reason': 'Destination ARCHITECTURE-CAC différée ; conserver le propriétaire C3 existant, promouvoir seulement après vérification de publication.'} for href, ids in future], 'aliases': {'circularisation': 'confirmation-tiers-audit', 'revue analytique': 'procedures-analytiques', 'tests sur les contrôles': 'tests-procedures', 'procédures de substance': 'controles-substance'}, 'compatibility': {'entryShape': 'GlossaryEntry', 'sourceShape': 'GlossarySource', 'dateExtensionRequired': [day(now())], 'note': 'Ajouter la date réelle à sourceCheckedAt à l’intégration groupée ; conserver les dates de collecte DILA. Paquet séparé, pas un manifeste global.', 'globalFilesModified': False}, 'review': {'status': 'pending', 'taskId': 't_f87ddaa1', 'publicationAuthorized': False}}
save(PACKAGE, pack)
excerpts = ['# Extraits exacts, lot CAC 3', '', 'Rattachements proposés par l’auteur ; aucun verdict métier acquis.', '']
for unit in units:
    excerpts.extend([f'## {unit["id"]}', '', unit['text'], ''])
    for citation in unit['citations']:
        excerpts.extend([f'Localisation : {citation["locator"]}', '', citation['text'], ''])
(BASE / 'extraits.md').write_text('\n'.join(excerpts) + '\n')
shape = "import type { GlossaryEntry, GlossarySource } from '../../../../src/data/glossary';\ntype CandidateEntry = Omit<GlossaryEntry, 'sourceCheckedAt'> & { sourceCheckedAt: GlossaryEntry['sourceCheckedAt'] | '2026-10-11' };\nconst data = " + json.dumps({'entries': entries, 'sources': sources}, ensure_ascii=False, indent=2) + " as const;\nconst entries: CandidateEntry[] = data.entries.map(e => ({ ...e, relatedTerms: [...e.relatedTerms], internalLinks: [...e.internalLinks], sourceIds: [...e.sourceIds] }));\nconst sources: Record<string, GlossarySource> = data.sources;\nvoid entries; void sources;\n"
(BASE / 'shape-check.ts').write_text(shape)
print(json.dumps({'entries': len(entries), 'sources': len(sources), 'units': len(units), 'links': len(links), 'existingAnchors': len(existing), 'deferredLinks': len(future)}, indent=2))
