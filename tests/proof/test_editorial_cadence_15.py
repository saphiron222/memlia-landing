"""Cadence D9 : plafond commun EC/CAC, trois par jour ouvré."""
from collections import Counter
from datetime import date
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
import json
import unittest
from editorial_clock import jour_fixe

ROOT = Path(__file__).resolve().parents[2]
SPEC = spec_from_file_location('cadence15', ROOT / 'docs/strategy/site-v3/build-cluster-plan.py')
assert SPEC and SPEC.loader
PLAN = module_from_spec(SPEC)
SPEC.loader.exec_module(PLAN)


class CalendrierVivant(unittest.TestCase):
    def test_circularisation_manquee_ne_devient_pas_une_nouvelle_reservation(self):
        backlog = json.loads(PLAN.BACKLOG.read_text(encoding='utf-8'))
        target = next(e for e in backlog if e['slug'] == 'cac-circularisation-campagne')
        self.assertEqual(target.get('dateManquee'), '2026-10-09')
        self.assertNotIn('datePlanifiee', target)
        data = PLAN.construire()
        entries = [data[3]] + data[4]
        scheduled = next(e for e in entries if e['slug'] == target['slug'])
        self.assertEqual(scheduled['statut'], 'a-replanifier')
        self.assertGreaterEqual(scheduled['date'], date.today().isoformat())
        self.assertEqual({e['slug']: e['datePlanifiee'] for e in backlog
                          if e.get('profession') == 'cac' and e.get('datePlanifiee')}, {
            'cac-ecritures-journal-criteres': '2026-10-12',
            'cac-contributions-dossier-preservation': '2026-10-13',
            'automatiser-un-cabinet-cac-la-carte-des-taches': '2026-10-14',
        })


class Cadence15(unittest.TestCase):
    def setUp(self):
        self.enterContext(jour_fixe(PLAN, date(2026, 10, 9)))

    def test_trois_reservations_du_meme_jour_peuvent_changer_d_ordre(self):
        entries = [dict(slug='precedent', pole='a', format='x', date='2026-10-12', statut='published')]
        entries += [dict(slug=f'fixe-{i}', pole=p, format=f, date='2026-10-13',
                         datePlanifiee='2026-10-13', statut='planned')
                    for i, (p, f) in enumerate([('a', 'y'), ('b', 'x'), ('c', 'z')])]
        PLAN.alterner(entries)
        self.assertEqual(PLAN.verifier_alternance(entries), [])
        self.assertEqual(sorted(e['date'] for e in entries), ['2026-10-12'] + ['2026-10-13'] * 3)

    def test_semaine_complete_et_samedi_independant(self):
        entries = [dict(slug=f'angle-{i:02}', pole=str(i % 2), format=str(i % 2),
                        profession='ec' if i % 2 else 'cac', priorite=1, rang_famille=i)
                   for i in range(16)]
        entries.append(dict(slug='cicatrice', serie='cicatrices', priorite=1, rang_famille=0))
        PLAN.planifier(entries, {}, aujourd_hui=date(2026, 10, 12))
        counts = Counter(e['date'] for e in entries if not e.get('serie'))
        self.assertEqual(counts, {f'2026-10-{d}': 3 for d in range(12, 17)} | {'2026-10-19': 1})
        self.assertEqual(entries[-1]['date'], '2026-10-17')
        self.assertEqual(PLAN.verifier_alternance(entries), [])

    def test_weekend_reserve_refuse(self):
        for day in ('2026-10-10', '2026-10-11'):
            with self.subTest(day=day), self.assertRaisesRegex(SystemExit, 'lundi-vendredi'):
                PLAN.planifier([dict(slug='reserve', pole='a', format='a', priorite=1,
                                    rang_famille=0, datePlanifiee=day)], {}, aujourd_hui=date(2026, 10, 6))

    def test_reservation_partage_le_plafond_ec_cac(self):
        entries = [dict(slug=f'angle-{i:02}', pole=str(i % 2), format=str(i % 2),
                        priorite=1, rang_famille=i) for i in range(4)]
        entries[0]['datePlanifiee'] = '2026-10-09'
        PLAN.planifier(entries, {}, aujourd_hui=date(2026, 10, 9))
        self.assertEqual(Counter(e['date'] for e in entries), {'2026-10-09': 3, '2026-10-12': 1})


class CalendrierReservations(unittest.TestCase):
    def test_calendrier_vivant_et_reservations_cac(self):
        data = PLAN.construire()
        self.assertEqual(PLAN.verifier(*data)[0], [])
        entries = [data[3]] + data[4]
        cac = [e for e in entries if e.get('profession') == 'cac'
               and (e.get('datePlanifiee') or e.get('dateManquee'))]
        self.assertGreaterEqual(len(cac), 6)
        for e in cac:
            if e.get('datePlanifiee'):
                self.assertEqual(e['date'], e['datePlanifiee'])
            else:
                self.assertLess(e['dateManquee'], PLAN.date.today().isoformat())
                self.assertEqual(e['statut'], 'a-replanifier')
                self.assertGreaterEqual(e['date'], PLAN.date.today().isoformat())
        ia = next(e for e in entries if e['slug'] == 'ia-cabinet-comptable')
        self.assertEqual(ia['dateManquee'], '2026-09-29')
        self.assertGreaterEqual(ia['date'], PLAN.date.today().isoformat())
