"""Les briefs IA du 03/10 étendent le stock, pas les plafonds ni les publications."""
from copy import deepcopy
from datetime import date, timedelta
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
from unittest.mock import patch
import unittest
from editorial_clock import jour_fixe

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
    def setUp(self):
        self.enterContext(jour_fixe(PLAN, date(2026, 10, 3)))
        # Oracle du stock du 03/10, avec dates synthétiques futures : pas le mandat
        # de livraison du 05/10, exercé séparément par test_ia_catchup.py.
        # Le lot entier est synthétique ici, même après sa publication réelle ;
        # ses dates et quotas W40 sont exercés par test_ia_catchup.py. La lecture
        # réelle précède le patch : la garde origin/main reste exécutée.
        stock = PLAN.construire()
        archives = stock[2]
        entrees = {e['slug']: e for e in [stock[3]] + stock[4]}
        for slug, archive in PLAN.etat_publie().items():
            self.assertEqual(entrees[slug]['date'], archive['date'])
            self.assertEqual(entrees[slug]['statut'], 'published')
        for slug in BRIEFS:
            archives.pop(slug, None)
        publication = patch.object(PLAN, 'etat_publie', return_value=archives)
        publication.start()
        self.addCleanup(publication.stop)
        precedent = max((e for e in [stock[3]] + stock[4]
                         if not e.get('serie') and e['slug'] not in BRIEFS),
                        key=lambda e: (e['date'], e.get('_ordre_calendrier', 0)))
        jour = date.fromisoformat(precedent['date']) + timedelta(days=7)
        # La liste des satellites suit les familles, pas l'ordre des dates.
        # Réserver dans l'ordre réellement vérifié par verifier_alternance.
        for e in sorted(stock[4], key=lambda e: (e['date'], e.get('_ordre_calendrier', 0))):
            if e['slug'] in BRIEFS:
                self.reserver(e, precedent, jour)
                precedent = e
                jour += timedelta(days=7)
        source = patch.object(PLAN, 'construire', side_effect=lambda: deepcopy(stock))
        source.start()
        self.addCleanup(source.stop)
        cadrage = patch.object(PLAN, 'lire_rattrapage_ia', return_value=None)
        cadrage.start()
        self.addCleanup(cadrage.stop)

    def reserver(self, e, precedent, jour):
        for champ in ('datePlanifiee', 'dateManquee', 'exceptionAlternance', 'date'):
            e.pop(champ, None)
        e.update(date=jour.isoformat(), datePlanifiee=jour.isoformat(), statut='planned')
        exceptions = {champ: {'date': e['date'], 'raison': 'Intention distincte du brief mandaté'}
                      for champ in ('pole', 'format') if e[champ] == precedent[champ]}
        if exceptions:
            e['exceptionAlternance'] = exceptions

    def verifier_stock(self, ajouts):
        donnees = PLAN.construire()
        poles, familles, publies, pilier, satellites, liens, par_famille = donnees
        modele = next(e for e in satellites if e['slug'] == 'prompt-chatgpt-expert-comptable')
        precedent = max((e for e in [pilier] + satellites if not e.get('serie')),
                        key=lambda e: (e['date'], e.get('_ordre_calendrier', 0)))
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
            e.update(slug=slug, famille=famille, pole=familles[famille]['pole'],
                     requete=slug.replace('-', ' '), titre=slug.replace('-', ' ').capitalize(),
                     priorite=3)
            self.reserver(e, precedent, jour)
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
