import copy
import datetime
import hashlib
import json
import subprocess
import zipfile
from pathlib import Path

ROOT = Path(__file__).parent
OUT = ROOT / 'corrections'
OUT.mkdir(exist_ok=True)
BASE = 'docs/qa/hub-ressources/glossaire-cac-lot-1-sources'
PACK = ROOT / 'docs/strategy/site-v3/glossaire-cac-lot-1.json'
ORIGINAL = Path('/Users/kevinkitanga/.hermes/kanban/attachments/t_33e01ca3/glossaire-cac-lot-1.json')
results = {}
def run(name, args, expected=0):
    result = subprocess.run(args, cwd=ROOT, capture_output=True, text=True)
    (OUT / (name + '.log')).write_text(result.stdout + result.stderr)
    results[name] = {'command': args, 'exitCode': result.returncode, 'expectedExitCode': expected, 'pass': result.returncode == expected}
    assert result.returncode == expected, (name, result.stdout, result.stderr)
    return result.stdout

run('regression-before', ['python3', 'tests-corrections.py', str(ORIGINAL)], 1)
run('regression-after', ['python3', 'tests-corrections.py'])
validation = json.loads(run('validation', ['node', BASE + '/validate.mjs']))
run('mutations', ['node', BASE + '/mutations.mjs'])
run('tests-dila', ['node', '--test', 'tests/scripts/dila-source-copy.test.mjs'])
run('shape-check', ['/Users/kevinkitanga/dev/interne/memlia-landing/node_modules/.bin/tsc', '--ignoreConfig', '--noEmit', '--skipLibCheck', '--strict', '--target', 'ES2022', '--moduleResolution', 'bundler', '--module', 'ESNext', BASE + '/shape-check.ts'])
pack = json.loads(PACK.read_text())
original = json.loads(ORIGINAL.read_text())
for defect, unit_id in [('D1', 'audit-legal-context-dila-l821-53'), ('D2', 'h2a-commonConfusion-h2a-presentation'), ('D3', 'cncc-context-cncc-representation')]:
    mutated = copy.deepcopy(pack)
    old = next(u for u in original['evidence']['units'] if u['id'] == unit_id)
    mutated['evidence']['units'] = [old if u['id'] == unit_id else u for u in mutated['evidence']['units']]
    candidate = OUT / ('mutation-' + defect + '.json')
    candidate.write_text(json.dumps(mutated, ensure_ascii=False))
    run('remerged-' + defect, ['python3', 'tests-corrections.py', str(candidate)], 1)
    candidate.unlink()

selected = {
    'D1': ['audit-legal-context-dila-l821-53', 'audit-legal-context-h2a-nep-200'],
    'D2': ['h2a-commonConfusion-h2a-presentation', 'h2a-commonConfusion-cncc-representation', 'h2a-commonConfusion-synthese-memlia'],
    'D3': ['cncc-context-cncc-representation', 'cncc-context-frontiere-memlia'],
}
units = {u['id']: u for u in pack['evidence']['units']}
table = []
for defect, ids in selected.items():
    table.append({'defect': defect, 'publicFieldUnchanged': True, 'claims': [units[i] for i in ids]})
(OUT / 'SOUS-AFFIRMATIONS.json').write_text(json.dumps(table, ensure_ascii=False, indent=2) + '\n')
lines = ['# Sous-affirmations D1–D3', '', 'Propositions de rattachement pour réexamen métier, pas un verdict d’auteur.', '', '| Défaut | Sous-affirmation | Sujet | Source/statut | Citation |', '|---|---|---|---|---|']
for item in table:
    for u in item['claims']:
        lines.append('| ' + ' | '.join([item['defect'], u['text'], u.get('claimSubject', u['entryId']), u['sourceId'] or u['evidenceStatus'], ', '.join(c['locator'] for c in u['citations']) or 'Sans citation institutionnelle']) + ' |')
lines += ['', 'D1 : assemblage certification + « ; » + objet NEP = première phrase publique. D2 : les fragments portent un sujet explicite ; la phrase comparative est une synthèse éditoriale renvoyant aux deux unités factuelles, non une citation H2A. D3 : assemblage représentation + frontière = champ public intégral.', '', 'unitText conserve le champ public pour le localiser, sans l’attribuer en totalité à la source. Les métadonnées evidenceStatus, claimSubject et basedOnUnitIds servent la reprise locale et doivent être conservées ou traduites lors de l’intégration Ressources.', '', 'Dix entrées et dates inchangées ; réserve A4 et absence de consolidation garantie conservées. Aucun PASS métier d’auteur, aucun manifeste global intégré, aucune publication.']
(OUT / 'SOUS-AFFIRMATIONS.md').write_text('\n'.join(lines) + '\n')
verification = {'verifiedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'task': 't_79f71254', 'reviewTask': 't_ada6a80c', 'reviewScope': ['D1', 'D2', 'D3'], 'businessVerdict': None, 'publication': False, 'controls': results, 'validation': validation, 'publicEntriesUnchanged': pack['entries'] == original['entries'], 'sourceMetadataUnchanged': pack['evidence']['sources'] == original['evidence']['sources'], 'units': len(pack['evidence']['units']), 'packageSha256': hashlib.sha256(PACK.read_bytes()).hexdigest()}
(OUT / 'CONTROLES.json').write_text(json.dumps(verification, ensure_ascii=False, indent=2) + '\n')
(ROOT / BASE / 'validation-result.json').write_text(json.dumps(validation, ensure_ascii=False, indent=2) + '\n')
(ROOT / BASE / 'tests-dila.log').write_text((OUT / 'tests-dila.log').read_text())
print(json.dumps(verification, ensure_ascii=False, indent=2))
