"""Les fixtures reconstruisent leur scénario même sous un jour Python ultérieur."""
from datetime import date
from unittest.mock import patch
import unittest

import test_editorial_cadence as cadence
import test_editorial_cadence_15 as cadence15
import test_mandated_blog_inventory as inventory


class EditorialFixtureClock(unittest.TestCase):
    def test_reconstruction_sous_horloges_python_ulterieures(self):
        for jour in (date(2026, 10, 16), date(2030, 1, 1)):
            class JourUlterieur(date):
                @classmethod
                def today(cls):
                    return jour

            for module, classe in (
                (cadence, cadence.EditorialCadenceProof),
                (cadence15, cadence15.Cadence15),
                (inventory, inventory.MandatedInventory),
            ):
                with self.subTest(jour=jour, scenario=module.__name__), \
                        patch('datetime.date', JourUlterieur), \
                        patch.object(module, 'date', JourUlterieur), \
                        patch.object(module.PLAN, 'date', JourUlterieur):
                    resultat = unittest.TestResult()
                    suite = unittest.defaultTestLoader.loadTestsFromTestCase(classe)
                    attendus = suite.countTestCases()
                    suite.run(resultat)
                    self.assertEqual(resultat.testsRun, attendus)
                    self.assertEqual(resultat.skipped, [])
                    self.assertEqual(resultat.errors + resultat.failures, [])
                    # La restauration de la fixture laisse le garde réel actif.
                    with self.assertRaisesRegex(SystemExit, 'date planifiée échue'):
                        module.PLAN.construire()
