"""Les fixtures reconstruisent leur scénario même sous un jour Python ultérieur."""
from datetime import date, timedelta
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch
import json
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
                    # La restauration laisse l'horloge extérieure et le garde actifs.
                    # Injecter une réservation échue : le stock vivant peut avoir été
                    # légitimement replanifié depuis l'écriture de ce test.
                    self.assertEqual(module.PLAN.date.today(), jour)
                    source = module.PLAN.BACKLOG
                    backlog = json.loads(source.read_text(encoding='utf-8'))
                    publies = module.PLAN.etat_publie()
                    cible = next(e for e in backlog if not e.get('serie')
                                 and e['slug'] not in publies
                                 and e['slug'] not in module.PLAN.BRIEFS_IA_MANDATES)
                    echue = jour - timedelta(days=1)
                    dates_publiees = {p['date'] for p in publies.values()}
                    while echue.isoformat() in dates_publiees:
                        echue -= timedelta(days=1)
                    # En 2030, d'autres réservations réelles ont aussi expiré :
                    # isoler celle du scénario pour identifier le refus attendu.
                    for entree in backlog:
                        if entree['slug'] not in publies and not entree.get('serie'):
                            entree.pop('datePlanifiee', None)
                    cible['datePlanifiee'] = echue.isoformat()
                    with TemporaryDirectory() as dossier:
                        fixture = Path(dossier) / 'backlog.json'
                        fixture.write_text(json.dumps(backlog), encoding='utf-8')
                        with patch.object(module.PLAN, 'BACKLOG', fixture), \
                                self.assertRaisesRegex(SystemExit, f"date planifiée échue : {cible['slug']}"):
                            module.PLAN.construire()
                    self.assertEqual(module.PLAN.BACKLOG, source)
