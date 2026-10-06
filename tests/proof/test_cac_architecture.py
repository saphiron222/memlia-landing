"""CAC architecture: profession compatibility, evidence, intent ownership and graph."""
import importlib.util
import json
import unittest
from copy import deepcopy
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
HERE = ROOT / 'docs/strategy/site-v3'


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    assert spec is not None and spec.loader is not None
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


PLAN = module('cac_plan', HERE / 'build-cluster-plan.py')
CAC = module('cac_arch', HERE / 'build_cac_architecture.py')


class CacArchitecture(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.source = json.loads(CAC.SOURCE.read_text())
        cls.backlog = json.loads(PLAN.BACKLOG.read_text())
        cls.poles, cls.families = PLAN.taxonomie()
        cls.arch = CAC.resolve()

    def test_parser_default_ec_and_explicit_cac(self):
        with TemporaryDirectory() as directory:
            file = Path(directory) / 'familles.ts'
            file.write_text("'certification': { libelle: 'Certification', couleur: '#0e7490' }\n"
                            "f('old', 'Ancien', 'certification', 'Compatible')\n"
                            "f('closed', 'Fermé', 'certification', 'Compatible', false)\n"
                            "f('explicit-ec', 'EC', 'certification', 'Explicite', true, 'ec')\n"
                            "f('new', 'CAC', 'certification', 'Explicite', true, 'cac')")
            with patch.object(PLAN, 'TAXONOMIE', file):
                poles, families = PLAN.taxonomie()
            self.assertEqual(len(families), 4)
            self.assertEqual(families['old']['profession'], 'ec')
            self.assertEqual(families['explicit-ec']['profession'], 'ec')
            self.assertFalse(families['closed']['active'])
            self.assertEqual(families['new']['profession'], 'cac')

    def test_five_poles_legacy_and_conditional_durability(self):
        wanted = {'certification', 'interventions-legales', 'sacc', 'durabilite', 'administration'}
        self.assertEqual({f['pole'] for f in self.families.values() if f['profession'] == 'cac'}, wanted)
        self.assertTrue(wanted <= set(self.poles))
        self.assertFalse(self.families['audit-legal']['active'])
        self.assertEqual(self.families['audit-legal']['profession'], 'ec')
        durability = [f for f in self.families.values() if f['pole'] == 'durabilite']
        self.assertEqual(len(durability), 3)
        self.assertTrue(all(not f['active'] for f in durability))
        self.assertTrue(all('Conditionnelle' in f['description'] for f in durability))

    def test_four_real_angles_per_active_family(self):
        self.assertEqual(self.arch['meta']['activeFamilies'], 8)
        self.assertEqual(self.arch['meta']['articles'], 32)
        for fid in self.source['familyDecisions']:
            members = [p for p in self.arch['pages'] if p['family'] == fid and p['type'] == 'article']
            self.assertEqual(len(members), 4)
            self.assertEqual(len({p['angle'] for p in members}), 4)
            self.assertEqual(len({p['purpose'] for p in members}), 4)
        self.assertEqual(sum(p['type'] == 'pilier' for p in self.arch['pages']), 1)

    def test_reject_missing_angle_and_arbitrary_pillar_exemption(self):
        backlog = deepcopy(self.backlog)
        entry = next(e for e in backlog if e.get('angle'))
        backlog.remove(entry)
        with self.assertRaisesRegex(ValueError, 'four distinct'):
            CAC.resolve(backlog=backlog)
        backlog = deepcopy(self.backlog)
        next(e for e in backlog if e.get('angle'))['architectureRole'] = 'pillar'
        with self.assertRaisesRegex(ValueError, 'arbitrary architectureRole'):
            CAC.resolve(backlog=backlog)

    def test_reject_entire_cac_stock_removed(self):
        ec = [e for e in self.backlog if e.get('profession', 'ec') == 'ec']
        with self.assertRaisesRegex(ValueError, 'four distinct'):
            CAC.resolve(backlog=ec)

    def test_inactive_families_cannot_enter_backlog(self):
        backlog = deepcopy(self.backlog)
        next(e for e in backlog if e.get('angle'))['famille'] = 'cac-procedures-convenues'
        with self.assertRaisesRegex(ValueError, 'inactive CAC family'):
            CAC.resolve(backlog=backlog)
        used = {e['famille'] for e in self.backlog}
        self.assertTrue(all(fid not in used for fid, f in self.families.items() if not f['active']))

    def test_active_families_have_exact_c1_c2_references(self):
        source = deepcopy(self.source)
        source['familyDecisions']['cac-fec-reception']['terrain'] = ['V043']
        with self.assertRaisesRegex(ValueError, 'no C1 gesture'):
            CAC.resolve(source=source)
        source = deepcopy(self.source)
        source['familyDecisions']['cac-fec-reception']['queries'] = ['requête jamais mesurée']
        with self.assertRaisesRegex(ValueError, 'no valid C2'):
            CAC.resolve(source=source)

    def test_no_invented_measurement_and_zero_is_not_unmeasured(self):
        pages = self.arch['pages']
        self.assertTrue(any(p['measure']['state'] == 'mesuree' and p['measure']['suggestions'] == 0 for p in pages))
        self.assertTrue(any(p['measure']['state'] == 'non-mesuree' and p['measure']['suggestions'] is None for p in pages))
        self.assertTrue(all(p['measure']['volumeMensuel'] is None for p in pages))
        backlog = deepcopy(self.backlog)
        next(e for e in backlog if e.get('angle') == 'constat-reception')['demande']['requete'] = 99
        with self.assertRaisesRegex(ValueError, 'measurement drift'):
            CAC.resolve(backlog=backlog)

    def test_unique_queries_cross_hubs_blog_and_current_owners(self):
        pages = self.arch['pages']
        self.assertEqual(len({CAC.key(p['query']) for p in pages}), len(pages))
        source = deepcopy(self.source)
        source['pages'][0]['query'] = ' AUTOMATISATION  IA CABINET COMPTABLE '
        with self.assertRaisesRegex(ValueError, 'historical owners'):
            CAC.resolve(source=source)
        source = deepcopy(self.source)
        source['pages'][0]['query'] = 'circularisation commissaire aux comptes'
        with self.assertRaisesRegex(ValueError, 'query collision'):
            CAC.resolve(source=source)

    def test_no_integration_activated_on_brand_suggestions(self):
        self.assertEqual(len(self.arch['deferredGuides']), 4)
        self.assertFalse(any(p['url'].startswith('/integrations/') for p in self.arch['pages']))
        source = deepcopy(self.source)
        source['pages'].append({'id': 'guide-caseware', 'url': '/integrations/caseware',
                                'query': 'caseware audit', 'type': 'guide',
                                'family': 'cac-dossier-de-travail', 'state': 'retenue-non-publiee'})
        # Even a 10-suggestion brand query cannot become a task/software guide.
        with self.assertRaisesRegex(ValueError, 'own-query|orphan'):
            CAC.resolve(source=source)

    def test_graph_is_closed_reciprocal_and_contextual(self):
        pages = {p['url']: p for p in self.arch['pages']}
        links = self.arch['links']
        pairs = {(l['from'], l['to']) for l in links}
        self.assertEqual(len(pairs), len(links))
        for link in links:
            self.assertIn(link['from'], pages)
            self.assertIn(link['to'], pages)
            self.assertNotEqual(link['from'], link['to'])
            self.assertTrue(link['context'])
            self.assertEqual(link['state'], 'projete-non-publie')
        for p in pages.values():
            self.assertEqual(p['incoming'], [l for l in links if l['to'] == p['url']])
            self.assertEqual(p['outgoing'], [l for l in links if l['from'] == p['url']])
            self.assertTrue(p['incoming'] and p['outgoing'])
            if p['type'] in ('service', 'outil', 'outil-existant'):
                self.assertGreaterEqual(len(p['incoming']), 3)
                for l in p['incoming']:
                    origin = pages[l['from']]
                    self.assertTrue(origin['type'] == 'pilier' or origin['family'] == p['family']
                                    or (origin['id'] == 'hub-outils' and p['type'] in ('outil', 'outil-existant')))
                if p['type'] in ('outil', 'outil-existant'):
                    self.assertTrue(any(pages[l['from']]['id'] == 'hub-outils' for l in p['incoming']))

    def test_reject_artificial_cross_family_link(self):
        source = deepcopy(self.source)
        page = next(p for p in source['pages'] if p['type'] == 'service')
        page['contextFrom'][0] = 'cac-calendrier-mandats'
        with self.assertRaisesRegex(ValueError, 'unrelated family'):
            CAC.resolve(source=source)

    def test_existing_tools_reused_and_public_contract_untouched(self):
        tools = [p for p in self.arch['pages'] if p['type'] == 'outil-existant']
        self.assertEqual({p['url'] for p in tools}, {
            '/outils-comptables-gratuits/verificateur-fec-local',
            '/outils-comptables-gratuits/preparer-pseudonymiser-fichier-csv-fec'})
        existing = json.loads((ROOT / 'config/page-intent-contract.json').read_text())['pages']
        for p in self.arch['pages']:
            self.assertEqual(p['profession'], 'cac')
            self.assertEqual(p['owner'], p['url'])
            self.assertTrue(p['family'] and p['terrain'] and p['measure'])
            if p['state'] == 'retenue-non-publiee':
                self.assertNotIn(p['url'], existing)
            else:
                self.assertEqual(p['query'], existing[p['url']]['query'])

    def test_generated_artifact_matches_sources(self):
        promoted = next(p for p in self.source['pages'] if p['id'] == 'outil-circu')
        self.assertIn(promoted['state'], ('construite-en-revue', 'publiee'))
        invalid = deepcopy(self.source)
        next(p for p in invalid['pages'] if p['id'] == 'outil-circu')['query'] = 'une autre intention'
        with self.assertRaisesRegex(ValueError, 'owner drift'):
            CAC.resolve(source=invalid)
        self.assertEqual(json.loads(CAC.OUTPUT.read_text()), self.arch)
        plan = json.loads((HERE / 'cluster-plan.json').read_text())
        posts = [p for c in plan['clusters'] for p in c['posts']]
        cac = [p for p in posts if p['profession'] == 'cac']
        self.assertEqual(len(cac), 33)
        self.assertTrue(all(p['volume'] is None for p in cac))
        self.assertEqual({p['family'] for p in cac}, set(self.source['familyDecisions']))
        pillar = next(p for p in cac if p['architectureRole'] == 'pillar')['slug']
        for p in cac:
            if p['slug'] != pillar:
                self.assertTrue(any(l['from'] == p['slug'] and l['to'] == pillar for l in plan['links']))

    def test_scheduler_pruning_includes_fixed_slots(self):
        # Free majority A is feasible because fixed B separates it; do not prune
        # on the free stock alone. No quotas or exception policy are changed.
        entries = [
            {'slug': 'a1', 'pole': 'A', 'format': 'x', 'date': '2026-10-06', 'statut': 'planned'},
            {'slug': 'b', 'pole': 'B', 'format': 'y', 'date': '2026-10-07', 'datePlanifiee': '2026-10-07', 'statut': 'planned'},
            {'slug': 'a2', 'pole': 'A', 'format': 'x', 'date': '2026-10-08', 'statut': 'planned'}]
        PLAN.alterner(entries)
        self.assertEqual(PLAN.verifier_alternance(entries), [])
        self.assertEqual((PLAN.PAR_JOUR_MAX, PLAN.PAR_SEMAINE_MAX, PLAN.JOURS_DE_PUBLICATION), (2, 4, (0, 1, 2, 3)))


if __name__ == '__main__':
    unittest.main()
