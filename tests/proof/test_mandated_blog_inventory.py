"""Les briefs IA du 03/10 étendent le stock, pas les plafonds ni les publications."""
from copy import deepcopy
from datetime import date, timedelta
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
from unittest.mock import patch
import unittest

ROOT = Path(__file__).resolve().parents[2]
SPEC = spec_from_file_location('mandated_plan', ROOT / 'docs/strategy/site-v3/build-cluster-plan.py')
assert SPEC and SPEC.loader
PLAN = module_from_spec(SPEC)
SPEC.loader.exec_module(PLAN)
BRIEFS = {
    'utiliser-chatgpt-cabinet-comptable': 'ia-generative-agents',
    'verifier-reponse-ia-comptabilite': 'ia-generative-agents',
    'ia-comptabilite-confidentialite-donnees': 'rgpd-secret-securite',
    'automatiser-avec-ia-sans-changer-logiciel': 'ia-generative-agents',
}


class MandatedInventory(unittest.TestCase):
    def verifier_stock(self, ajouts):
        donnees = PLAN.construire()
        poles, familles, publies, pilier, satellites, liens, par_famille = donnees
        modele = next(e for e in satellites if e['slug'] == 'prompt-chatgpt-expert-comptable')
        precedent = max((e for e in [pilier] + satellites if not e.get('serie')), key=lambda e: e['date'])
        jour = date.fromisoformat(precedent['date']) + timedelta(days=7)
        for slug, famille in ajouts.items():
            existant = next((e for e in satellites if e['slug'] == slug), None)
            if existant is not None:
                # Présent, même publié : ne pas fabriquer une seconde réservation.
                # Une mauvaise famille reste une mutation réelle à refuser.
                if existant['famille'] != famille:
                    par_famille[existant['famille']].remove(existant)
                    existant.update(famille=famille, pole=familles[famille]['pole'])
                    par_famille[famille].append(existant)
                continue
            e = deepcopy(modele)
            for champ in ('datePlanifiee', 'dateManquee', 'exceptionAlternance', 'date'):
                e.pop(champ, None)
            e.update(slug=slug, famille=famille, pole=familles[famille]['pole'],
                     requete=slug.replace('-', ' '), titre=slug.replace('-', ' ').capitalize(),
                     priorite=3, date=jour.isoformat(), datePlanifiee=jour.isoformat(), statut='planned')
            exceptions = {champ: {'date': e['date'], 'raison': 'Intention distincte du brief mandaté'}
                          for champ in ('pole', 'format') if e[champ] == precedent[champ]}
            if exceptions:
                e['exceptionAlternance'] = exceptions
            satellites.append(e)
            par_famille[famille].append(e)
            for cible in [pilier] + par_famille[famille][:2]:
                liens.append({'de': cible['slug'], 'vers': slug})
            precedent = e
            jour += timedelta(days=7)
        erreurs, _, _ = PLAN.verifier(*donnees)
        return donnees, erreurs

    def test_quatre_briefs_seuls_et_ensemble_conservent_historiques_et_quotas(self):
        archives = PLAN.etat_publie()
        for ajouts in [{slug: famille} for slug, famille in BRIEFS.items()] + [BRIEFS]:
            with self.subTest(slugs=list(ajouts)):
                donnees, erreurs = self.verifier_stock(ajouts)
                self.assertEqual(erreurs, [])
                self.assertEqual(donnees[2], archives)
                entrees = {e['slug']: e for e in [donnees[3]] + donnees[4]}
                self.assertEqual(len(entrees), len(donnees[4]) + 1)
                for slug, famille in ajouts.items():
                    self.assertEqual(entrees[slug]['famille'], famille)
                    self.assertEqual(entrees[slug]['statut'], 'published' if slug in archives else 'planned')
                for slug, archive in archives.items():
                    self.assertEqual(entrees[slug]['date'], archive['date'])

    def test_extension_ne_libere_pas_un_angle_arbitraire_ou_une_mauvaise_famille(self):
        for ajouts in [dict(BRIEFS, **{'cinquieme-angle-ia-non-mandate': 'ia-generative-agents'}),
                       {'utiliser-chatgpt-cabinet-comptable': 'rgpd-secret-securite'}]:
            with self.subTest(ajouts=ajouts):
                _, erreurs = self.verifier_stock(ajouts)
                self.assertTrue(any('angles au lieu' in e or 'famille du brief' in e for e in erreurs), erreurs)

    def test_ajout_repete_conserve_exactement_les_reservations_presentes(self):
        donnees, erreurs = self.verifier_stock(BRIEFS)
        self.assertEqual(erreurs, [])
        with patch.object(PLAN, 'construire', side_effect=lambda: deepcopy(donnees)):
            relu, erreurs = self.verifier_stock(BRIEFS)
        self.assertEqual(erreurs, [])
        self.assertEqual(relu, donnees)

    def test_un_vrai_doublon_reste_refuse(self):
        donnees, erreurs = self.verifier_stock(BRIEFS)
        self.assertEqual(erreurs, [])
        donnees[4].append(deepcopy(next(e for e in donnees[4] if e['slug'] in BRIEFS)))
        self.assertIn('slugs en double', PLAN.verifier(*donnees)[0])


if __name__ == '__main__':
    unittest.main()
