import json
import sys
import unittest
import zipfile
from pathlib import Path

ROOT = Path(__file__).parent
PACK = Path(sys.argv.pop(1)) if len(sys.argv) > 1 else ROOT / 'docs/strategy/site-v3/glossaire-cac-lot-1.json'
ARCHIVE = Path('/Users/kevinkitanga/.hermes/kanban/attachments/t_33e01ca3/glossaire-cac-lot-1.zip')
OLD_IDS = ['audit-legal-context-dila-l821-53', 'h2a-commonConfusion-h2a-presentation', 'cncc-context-cncc-representation']

class Corrections(unittest.TestCase):
    def setUp(self):
        self.pack = json.loads(PACK.read_text())
        self.units = {u['id']: u for u in self.pack['evidence']['units']}
        with zipfile.ZipFile(ARCHIVE) as z:
            self.original = json.loads(z.read('docs/strategy/site-v3/glossaire-cac-lot-1.json'))

    def test_d1_certification_and_audit_separated(self):
        a = self.units['audit-legal-context-dila-l821-53']
        b = self.units['audit-legal-context-h2a-nep-200']
        self.assertEqual(a['text'] + ' ; ' + b['text'], self.original['evidence']['units'][next(i for i,u in enumerate(self.original['evidence']['units']) if u['id'] == a['id'])]['text'])
        self.assertEqual(a['sourceId'], 'dila-l821-53')
        self.assertEqual(b['sourceId'], 'h2a-nep-200')
        self.assertEqual(b['citations'][0]['locator'], 'h2a-nep-200:ligne-68')
        self.assertTrue(b['citations'][0]['text'].startswith('03.'))

    def test_d2_roles_and_editorial_synthesis_separated(self):
        a = self.units['h2a-commonConfusion-h2a-presentation']
        b = self.units['h2a-commonConfusion-cncc-representation']
        c = self.units['h2a-commonConfusion-synthese-memlia']
        self.assertEqual((a['text'], a['claimSubject'], a['sourceId']), ('l’autorité de supervision', 'H2A', 'h2a-presentation'))
        self.assertEqual((b['text'], b['claimSubject'], b['sourceId']), ('l’instance représentative de la profession', 'CNCC', 'cncc-representation'))
        self.assertEqual(c['sourceId'], None)
        self.assertEqual(c['type'], 'methode-memlia')
        self.assertEqual(c['citations'], [])
        self.assertEqual(c['basedOnUnitIds'], [a['id'], b['id']])
        self.assertEqual(c['evidenceStatus'], 'synthese-editoriale')

    def test_d3_representation_and_editorial_boundary_separated(self):
        a = self.units['cncc-context-cncc-representation']
        b = self.units['cncc-context-frontiere-memlia']
        self.assertEqual(a['text'] + ' ' + b['text'], a['unitText'])
        self.assertEqual(a['sourceId'], 'cncc-representation')
        self.assertEqual(b['sourceId'], None)
        self.assertEqual(b['citations'], [])
        self.assertEqual(b['type'], 'methode-memlia')
        self.assertEqual(b['evidenceStatus'], 'frontiere-editoriale')
        self.assertIn('sans obligation normative autonome', b['regime'])

    def test_public_and_other_evidence_unchanged(self):
        for key in self.pack:
            if key != 'evidence':
                self.assertEqual(self.pack[key], self.original[key], key)
        self.assertEqual(self.pack['evidence']['sources'], self.original['evidence']['sources'])
        for unit in self.original['evidence']['units']:
            if unit['id'] not in OLD_IDS:
                self.assertEqual(self.units[unit['id']], unit)
        self.assertEqual(len(self.units), len(self.pack['evidence']['units']))
        self.assertTrue(all(u['businessVerdict'] is None for u in self.units.values()))
        with zipfile.ZipFile(ARCHIVE) as z:
            for name in z.namelist():
                if name.endswith(('.txt', '.html')) or name.endswith('captures.json') or '/dila-' in name:
                    self.assertEqual((ROOT/name).read_bytes(), z.read(name), name)

    def test_citations_and_locators_exact(self):
        for unit in self.units.values():
            if unit['sourceId']:
                lines = (ROOT/self.pack['evidence']['sources'][unit['sourceId']]['snapshotPath']).read_text().splitlines()
                for citation in unit['citations']:
                    line = int(citation['locator'].split(':ligne-')[1])
                    self.assertIn(citation['text'], lines[line-1], unit['id'])

if __name__ == '__main__':
    unittest.main(verbosity=2)
