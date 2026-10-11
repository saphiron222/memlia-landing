"""F4 : deux suppléments bornés, sans remplacer les quatre gestes par famille."""
from collections import Counter
from copy import deepcopy
from datetime import date
import json
import unittest
from editorial_clock import jour_fixe
from test_cac_architecture import CAC, PLAN

EXPECTED = {
    'cac-appreciation-outil-automatise': ('appréciation outils automatisés audit', '2026-10-20', 'how-to-guide'),
    'cac-dossier-constitution-soixante-jours': ('archivage dossier audit 60 jours', '2026-10-21', 'listicle-checklist'),
}


class SupplementsF4(unittest.TestCase):
    def setUp(self):
        self.backlog = json.loads(PLAN.BACKLOG.read_text())
        self.enterContext(jour_fixe(PLAN, date(2026, 10, 10)))

    def test_deux_supplements_et_stock_initial_intact(self):
        supplements = [e for e in self.backlog if e.get('supplementMandate')]
        self.assertEqual({e['slug'] for e in supplements}, set(EXPECTED))
        base = [e for e in self.backlog if e.get('profession') == 'cac'
                and not e.get('architectureRole') and not e.get('supplementMandate')]
        self.assertEqual(len(base), 32)
        self.assertEqual(set(Counter(e['famille'] for e in base).values()), {4})
        arch = CAC.resolve()
        self.assertEqual(arch['meta']['articles'], 32)
        self.assertEqual(arch['meta']['supplements'], 2)
        for e in supplements:
            query, day, fmt = EXPECTED[e['slug']]
            self.assertEqual((e['requete'], e['datePlanifiee'], e['format']), (query, day, fmt))
            self.assertEqual((e['profession'], e['famille'], e['role'], e['intent'], e['priorite']),
                             ('cac', 'cac-dossier-de-travail', 'audit-cac', 'executer', 3))
            self.assertEqual(e['demande']['mesureeLe'], '2026-10-09')
            self.assertEqual(e['demande']['requete'], 0)
            page = next(p for p in arch['pages'] if p['id'] == e['slug'])
            self.assertEqual(page['type'], 'supplement')
            self.assertEqual(page['measure']['state'], 'mesuree')
            self.assertEqual(page['measure']['suggestions'], 0)
            self.assertIsNone(page['measure']['volumeMensuel'])
            self.assertTrue(page['incoming'] and page['outgoing'])

    def test_refus_doublon_arbitraire_et_mauvaise_famille(self):
        entry = next((e for e in self.backlog if e.get('supplementMandate')), None)
        self.assertIsNotNone(entry)
        assert entry is not None
        for kind in ('duplicate', 'arbitrary', 'family', 'unmarked', 'measure', 'date', 'format', 'intent', 'priority'):
            with self.subTest(kind=kind):
                backlog = deepcopy(self.backlog)
                e = next(e for e in backlog if e['slug'] == entry['slug'])
                if kind == 'duplicate':
                    backlog.append(deepcopy(e))
                elif kind == 'arbitrary':
                    e['slug'] = 'cac-supplement-arbitraire'
                elif kind == 'family':
                    e['famille'] = 'cac-fec-reception'
                elif kind == 'unmarked':
                    del e['supplementMandate']
                elif kind == 'measure':
                    e['demande']['mesureeLe'] = '2026-10-05'
                elif kind == 'date':
                    e['datePlanifiee'] = '2026-10-22'
                elif kind == 'format':
                    e['format'] = 'tutorial'
                elif kind == 'intent':
                    e['intent'] = 'comprendre'
                else:
                    e['priorite'] = 1
                with self.assertRaises(ValueError):
                    CAC.resolve(backlog=backlog)
                if kind != 'measure':
                    self.assertTrue(PLAN.verifier_supplements_cac(backlog))

    def test_calendrier_plafonds_alternance_et_preservation(self):
        data = PLAN.construire()
        self.assertEqual(PLAN.verifier(*data)[0], [])
        entries = [data[3]] + data[4]
        by_slug = {e['slug']: e for e in entries}
        for slug, (_, day, _) in EXPECTED.items():
            self.assertEqual(by_slug[slug]['date'], day)
        contribution = by_slug['cac-contributions-dossier-preservation']
        self.assertEqual(contribution['date'], '2026-10-23')
        self.assertEqual(contribution['requete'], 'dossier cac contributions sans écraser saisies')
        self.assertEqual(contribution['angle'], 'fusion-contributions')
        self.assertEqual(contribution['intent'], 'reduire-risque')
        self.assertIn('sans écraser les saisies', contribution['titre'])
        ordinary = [e for e in entries if not e.get('serie') and e['date'] >= '2026-10-12']
        self.assertLessEqual(max(Counter(e['date'] for e in ordinary).values()), 3)
        self.assertLessEqual(max(Counter(date.fromisoformat(e['date']).isocalendar()[:2]
                                        for e in ordinary).values()), 15)
        self.assertEqual(PLAN.verifier_alternance(entries), [])
        self.assertEqual((PLAN.PAR_JOUR_MAX, PLAN.PAR_SEMAINE_MAX), (3, 15))


if __name__ == '__main__':
    unittest.main()
