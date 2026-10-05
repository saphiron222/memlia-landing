"""Le lot IA W40 garde ses dates réelles sans consommer les sujets W41."""
from copy import deepcopy
from datetime import date
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
from unittest.mock import patch
import unittest

ROOT = Path(__file__).resolve().parents[2]
SPEC = spec_from_file_location('ia_plan', ROOT / 'docs/strategy/site-v3/build-cluster-plan.py')
assert SPEC and SPEC.loader
PLAN = module_from_spec(SPEC)
SPEC.loader.exec_module(PLAN)
SLUG = 'automatiser-avec-ia-sans-changer-logiciel'
PUBLIES = {
    'utiliser-chatgpt-cabinet-comptable': {'date': '2026-10-04'},
    'verifier-reponse-ia-comptabilite': {'date': '2026-10-05'},
    'ia-comptabilite-confidentialite-donnees': {'date': '2026-10-05'},
}


def entree(slug=SLUG, jour='2026-10-05'):
    return dict(slug=slug, pole='a', famille='f', format='how-to-guide', priorite=1,
                rang_famille=0, datePlanifiee=jour)


class IACatchupProof(unittest.TestCase):
    def test_troisieme_publication_et_quatre_sujets_courants(self):
        entrees = [entree()] + [dict(slug=f'nouveau-{i}', pole=f'p{i}', famille='f',
                                    format=f'format-{i}', priorite=1, rang_famille=i)
                               for i in range(4)]
        PLAN.planifier(entrees, deepcopy(PUBLIES), aujourd_hui=date(2026, 10, 5))
        self.assertEqual((entrees[0]['date'], entrees[0]['statut']), ('2026-10-05', 'planned'))
        self.assertTrue(all(PLAN.semaine_iso(date.fromisoformat(e['date'])) == (2026, 41)
                            for e in entrees[1:]))
        self.assertTrue(all(e['date'] != '2026-10-05' for e in entrees[1:]))

    def test_date_mutante_et_jour_elargi_refuses(self):
        with self.assertRaisesRegex(SystemExit, 'rattrapage IA hors'):
            PLAN.planifier([entree(jour='2026-10-06')], deepcopy(PUBLIES), aujourd_hui=date(2026, 10, 5))
        with self.assertRaisesRegex(SystemExit, 'rattrapage IA hors'):
            mutant = deepcopy(PUBLIES)
            mutant['verifier-reponse-ia-comptabilite']['date'] = '2026-10-06'
            PLAN.planifier([entree()], mutant, aujourd_hui=date(2026, 10, 5))
        autres = deepcopy(PUBLIES)
        autres['autre'] = {'date': '2026-10-05'}
        entrees = [entree()]
        PLAN.planifier(entrees, autres, aujourd_hui=date(2026, 10, 5))
        self.assertEqual(entrees[0]['statut'], 'a-replanifier')

    def test_plafond_hebdomadaire_w40_et_cadence_ordinaire(self):
        publies = deepcopy(PUBLIES)
        publies['logiciel-ia-comptabilite'] = {'date': '2026-09-29'}
        publies['prompt-chatgpt-expert-comptable'] = {'date': '2026-09-29'}
        candidats = [entree()]
        PLAN.planifier(candidats, publies, aujourd_hui=date(2026, 10, 5))
        self.assertEqual(candidats[0]['statut'], 'planned')
        entrees = [entree('autre-sujet')]
        PLAN.planifier(entrees, deepcopy(PUBLIES), aujourd_hui=date(2026, 10, 5))
        self.assertEqual(entrees[0]['statut'], 'a-replanifier')

    def test_regle_elargie_refusee_par_le_meme_validateur_node(self):
        regle = PLAN.lire_rattrapage_ia()
        self.assertEqual(regle['semaineEditoriale'], '2026-W40')
        self.assertEqual(PLAN.semaine_editoriale_ia(regle, SLUG, '2026-10-05'), (2026, 40))
        self.assertEqual(PLAN.semaine_editoriale_ia(regle, 'autre', '2026-10-05'), (2026, 41))


if __name__ == '__main__':
    unittest.main()
