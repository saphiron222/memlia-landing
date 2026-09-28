"""Oracle de la cadence éditoriale : 4 articles lun-jeu + 1 Cicatrice le samedi."""
from copy import deepcopy
from datetime import date
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
from unittest.mock import patch
from tempfile import TemporaryDirectory
import json
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
    def lot_w39(self, dates=None, cicatrice="tests-verts-et-regle-des-trois-passes", deja_inscrite=False, ancien_modifications=None, titre_publie=None, titre_inscrit=None):
        dates = dates or {"prompt-chatgpt-expert-comptable": "2026-09-28", "logiciel-ia-comptabilite": "2026-09-28", cicatrice: "2026-09-28"}
        with TemporaryDirectory() as directory:
            backlog = json.loads(PLAN.BACKLOG.read_text())
            original = next(e for e in backlog if e["slug"] == "trois-bugs-que-des-tests-verts-n-ont-pas-vus")
            entry = deepcopy(original)
            entry.update(slug=cicatrice, titre="Pourquoi des tests verts manquent des défauts : la règle des trois passes", requete="pourquoi des tests verts peuvent manquer des défauts", famille="ia-generative-agents", date=None)
            if ancien_modifications:
                original.update(ancien_modifications)
            if deja_inscrite:
                backlog.remove(original)
                entry["date"] = "2026-09-26"
                if titre_inscrit is not None:
                    entry["titre"] = titre_inscrit
                backlog.append(entry)
            elif cicatrice != "tests-verts-et-regle-des-trois-passes":
                backlog.append(entry)
            path = Path(directory) / "backlog.json"
            path.write_text(json.dumps(backlog))
            publies = PLAN.etat_publie()
            for slug, value in dates.items():
                original_entry = next((e for e in backlog if e["slug"] == slug), entry)
                publies[slug] = {"date": value, "titre": original_entry["titre"], "requete": original_entry["requete"], "famille": original_entry["famille"], "format": original_entry["format"]}
            if titre_publie is not None:
                publies["tests-verts-et-regle-des-trois-passes"]["titre"] = titre_publie
            with patch.object(PLAN, "BACKLOG", path), patch.object(PLAN, "etat_publie", return_value=publies):
                return PLAN.construire()

    def test_rattrapage_w39_ne_deplace_pas_le_plan_et_est_borne(self):
        donnees = self.lot_w39(deja_inscrite=True)
        erreurs, _, par_semaine = PLAN.verifier(*donnees)
        self.assertEqual(erreurs, [])
        self.assertEqual(par_semaine[(2026, 39)], 4)
        self.assertEqual({e["slug"]: e["datePlanifiee"] for e in donnees[4] if e["slug"] in {"prompt-chatgpt-expert-comptable", "logiciel-ia-comptabilite"}}, {"prompt-chatgpt-expert-comptable": "2026-09-22", "logiciel-ia-comptabilite": "2026-09-24"})
        self.assertEqual(next(e for e in donnees[4] if e["slug"] == "tests-verts-et-regle-des-trois-passes")["date"], "2026-09-28")
        for slug in ("prompt-chatgpt-expert-comptable", "logiciel-ia-comptabilite", "tests-verts-et-regle-des-trois-passes"):
            with self.subTest(slug=slug):
                mutant = deepcopy(donnees)
                next(e for e in mutant[4] if e["slug"] == slug)["date"] = "2026-09-29"
                self.assertTrue(PLAN.verifier(*mutant)[0])
        mutant = deepcopy(donnees)
        cicatrice_suivante = next(e for e in mutant[4] if e.get("serie") == "cicatrices" and e["date"] == "2026-10-03")
        cicatrice_suivante["date"] = "2026-09-26"
        self.assertTrue(any("plus d’une cicatrice" in e for e in PLAN.verifier(*mutant)[0]))
        mutant = deepcopy(donnees)
        ordinaire_suivant = next(e for e in mutant[4] if e.get("serie") != "cicatrices" and e["date"] == "2026-09-29" and e.get("statut") == "planned")
        ordinaire_suivant["date"] = "2026-09-23"
        self.assertTrue(any("plus de quatre articles" in e for e in PLAN.verifier(*mutant)[0]))

    def test_rattrapage_refuse_autre_sujet_et_deuxieme_cicatrice(self):
        for dates in ({"prompt-chatgpt-expert-comptable": "2026-09-28", "logiciel-ia-comptabilite": "2026-09-28", "tests-verts-et-regle-des-trois-passes": "2026-09-28", "trois-bugs-que-des-tests-verts-n-ont-pas-vus": "2026-09-28"},
                      {"prompt-chatgpt-expert-comptable": "2026-09-28", "logiciel-ia-comptabilite": "2026-09-28", "tests-verts-et-regle-des-trois-passes": "2026-09-28", "ia-cabinet-comptable": "2026-09-28"}):
            with self.subTest(dates=dates):
                with self.assertRaises(SystemExit):
                    donnees = self.lot_w39(dates)
                    self.assertTrue(PLAN.verifier(*donnees)[0])

    def test_ancien_slug_non_publie_est_remplace_sans_doubler_la_cicatrice(self):
        donnees = self.lot_w39()
        self.assertEqual(PLAN.verifier(*donnees)[0], [])
        self.assertNotIn("trois-bugs-que-des-tests-verts-n-ont-pas-vus", {e["slug"] for e in donnees[4]})

    def test_titre_signe_w39_refuse_les_mutations_independantes(self):
        autre_titre = "Titre inédit non signé pour les trois passes"
        for modifications, titre_publie in (({"titre": autre_titre}, None), ({}, autre_titre)):
            with self.subTest(modifications=modifications, titre_publie=titre_publie):
                with self.assertRaisesRegex(SystemExit, "titre.*W39|W39.*titre"):
                    self.lot_w39(ancien_modifications=modifications, titre_publie=titre_publie)
        with self.assertRaisesRegex(SystemExit, "titre.*W39|W39.*titre"):
            self.lot_w39(deja_inscrite=True, titre_inscrit=autre_titre, titre_publie=autre_titre)

    def test_date_explicite_cicatrice_non_publiee_ne_se_replanifie_pas(self):
        for mauvaise_date in ("2026-09-27", "2026-10-03"):
            with self.subTest(date=mauvaise_date):
                with self.assertRaises(SystemExit):
                    self.lot_w39(ancien_modifications={"date": mauvaise_date})
        with self.assertRaisesRegex(SystemExit, "cicatrice.*samedi"):
            backlog = json.loads(PLAN.BACKLOG.read_text())
            next(e for e in backlog if e["slug"] == "trois-bugs-que-des-tests-verts-n-ont-pas-vus")["date"] = "2026-09-27"
            with TemporaryDirectory() as directory:
                path = Path(directory) / "backlog.json"
                path.write_text(json.dumps(backlog))
                with patch.object(PLAN, "BACKLOG", path), patch.object(PLAN, "etat_publie", return_value={}):
                    PLAN.construire()

    def test_cicatrice_du_samedi_ne_consomme_pas_le_plafond_des_quatre(self):
        donnees, erreurs, _, par_semaine = construire_et_verifier()
        self.assertEqual(erreurs, [])
        self.assertEqual(par_semaine[(2026, 38)], 4)
        satellites = donnees[4]
        cicatrices = sorted((e for e in satellites if e.get("serie") == "cicatrices"), key=lambda e: e["date"])
        dates = [date.fromisoformat(e["date"]) for e in cicatrices]
        self.assertGreaterEqual(len(dates), 8)
        self.assertEqual(dates[0].isoformat(), "2026-09-19")
        self.assertTrue(all((b - a).days == 7 for a, b in zip(dates, dates[1:])), dates)
        self.assertEqual(cicatrices[0]["statut"], "published")
        self.assertTrue(all(e["statut"] == "planned" for e in cicatrices[1:]), cicatrices)

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
