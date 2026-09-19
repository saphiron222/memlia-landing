"""Oracle de la cadence éditoriale : 4 articles lun-jeu + 1 Cicatrice le samedi."""
from copy import deepcopy
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "docs/strategy/site-v3/build-cluster-plan.py"
SPEC = spec_from_file_location("build_cluster_plan", SCRIPT)
assert SPEC and SPEC.loader
PLAN = module_from_spec(SPEC)
SPEC.loader.exec_module(PLAN)


def construire_et_verifier():
    donnees = PLAN.construire()
    erreurs, entrants, par_semaine = PLAN.verifier(*donnees)
    return donnees, erreurs, entrants, par_semaine


class EditorialCadenceProof(unittest.TestCase):
    def test_cicatrice_du_samedi_ne_consomme_pas_le_plafond_des_quatre(self):
        donnees, erreurs, _, par_semaine = construire_et_verifier()
        self.assertEqual(erreurs, [])
        self.assertEqual(par_semaine[(2026, 38)], 4)
        satellites = donnees[4]
        cicatrices = sorted((e for e in satellites if e.get("serie") == "cicatrices"), key=lambda e: e["date"])
        self.assertEqual([e["date"] for e in cicatrices], ["2026-09-19", "2026-09-26", "2026-10-03"])
        self.assertEqual([e["statut"] for e in cicatrices], ["published", "planned", "planned"])

    def test_cicatrice_hors_samedi_rougit(self):
        donnees, _, _, _ = construire_et_verifier()
        donnees = deepcopy(donnees)
        cicatrice = next(e for e in donnees[4] if e.get("serie") == "cicatrices")
        cicatrice["date"] = "2026-09-18"
        erreurs, _, _ = PLAN.verifier(*donnees)
        self.assertTrue(any("cicatrice hors samedi" in erreur for erreur in erreurs), erreurs)

    def test_deuxieme_cicatrice_de_la_meme_semaine_iso_rougit(self):
        donnees, _, _, _ = construire_et_verifier()
        donnees = deepcopy(donnees)
        cicatrices = [e for e in donnees[4] if e.get("serie") == "cicatrices"]
        cicatrices[1]["date"] = "2026-09-19"
        erreurs, _, _ = PLAN.verifier(*donnees)
        self.assertTrue(any("plus d’une cicatrice" in erreur for erreur in erreurs), erreurs)


if __name__ == "__main__":
    unittest.main(verbosity=2)
