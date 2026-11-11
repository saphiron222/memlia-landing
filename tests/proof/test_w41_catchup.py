"""Réservations W41 : le quota n'atteste jamais une publication."""
from datetime import date
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
import unittest
from editorial_clock import jour_fixe

ROOT = Path(__file__).resolve().parents[2]
SPEC = spec_from_file_location('w41_plan', ROOT / 'docs/strategy/site-v3/build-cluster-plan.py')
assert SPEC and SPEC.loader
PLAN = module_from_spec(SPEC)
SPEC.loader.exec_module(PLAN)
SLUG = 'checklist-avant-le-depot-mensuel-de-la-dsn'
DAY = date(2026, 10, 12)


def entree(slug=SLUG, jour='2026-10-12'):
    return dict(slug=slug, pole='a', famille='f', format='how-to-guide', priorite=1,
                rang_famille=0, datePlanifiee=jour)


class W41CatchupProof(unittest.TestCase):
    def setUp(self):
        horloge = jour_fixe(PLAN, DAY)
        horloge.start()
        self.addCleanup(horloge.stop)

    def test_quatrieme_retard_et_capacite_normale(self):
        publies = {f'autre-{i}': {'date': DAY.isoformat()} for i in range(3)}
        candidats = [entree()]
        PLAN.planifier(candidats, publies, aujourd_hui=DAY)
        self.assertEqual((candidats[0]['date'], candidats[0]['statut']), (DAY.isoformat(), 'planned'))
        autre = [entree('hors-lot')]
        PLAN.planifier(autre, publies, aujourd_hui=DAY)
        self.assertEqual(autre[0]['statut'], 'a-replanifier')
        publies[SLUG] = {'date': DAY.isoformat()}
        del publies['autre-2']
        autre = [entree('hors-lot')]
        PLAN.planifier(autre, publies, aujourd_hui=DAY)
        self.assertEqual(autre[0]['statut'], 'planned')

    def test_future_antidate_et_serie(self):
        with self.assertRaises(SystemExit):
            PLAN.planifier([entree(jour='2026-10-11')], {}, aujourd_hui=DAY)
        # Une réservation future garde la règle normale, sans bénéficier du rattrapage.
        futur = [entree(jour='2026-10-13')]
        PLAN.planifier(futur, {f'autre-{i}': {'date': '2026-10-13'} for i in range(3)}, aujourd_hui=DAY)
        self.assertEqual(futur[0]['statut'], 'a-replanifier')
        with self.assertRaises(SystemExit):
            PLAN.planifier([dict(entree(), serie='cicatrices', date=DAY.isoformat())], {}, aujourd_hui=DAY)

    def test_reservation_echue_ne_devient_pas_archive(self):
        with self.assertRaisesRegex(SystemExit, 'échue|jour réel'):
            PLAN.planifier([entree()], {}, aujourd_hui=date(2026, 10, 13))
        candidats = [entree()]
        PLAN.planifier(candidats, {SLUG: {'date': DAY.isoformat()}}, aujourd_hui=date(2026, 10, 13))
        self.assertEqual(candidats[0]['statut'], 'published')


if __name__ == '__main__':
    unittest.main()
