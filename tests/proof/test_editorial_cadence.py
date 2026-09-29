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
        self.assertEqual({e["slug"]: e["dateManquee"] for e in donnees[4] if e["slug"] in {"prompt-chatgpt-expert-comptable", "logiciel-ia-comptabilite"}}, {"prompt-chatgpt-expert-comptable": "2026-09-22", "logiciel-ia-comptabilite": "2026-09-24"})
        self.assertEqual(next(e for e in donnees[4] if e["slug"] == "tests-verts-et-regle-des-trois-passes")["date"], "2026-09-28")
        for slug in ("prompt-chatgpt-expert-comptable", "logiciel-ia-comptabilite", "tests-verts-et-regle-des-trois-passes"):
            with self.subTest(slug=slug):
                mutant = deepcopy(donnees)
                next(e for e in mutant[4] if e["slug"] == slug)["date"] = "2026-09-30"
                self.assertTrue(PLAN.verifier(*mutant)[0])
        mutant = deepcopy(donnees)
        cicatrice_suivante = next(e for e in mutant[4] if e.get("serie") == "cicatrices" and e["date"] == "2026-10-03")
        cicatrice_suivante["date"] = "2026-09-26"
        self.assertTrue(any("plus d’une cicatrice" in e for e in PLAN.verifier(*mutant)[0]))
        mutant = deepcopy(donnees)
        ordinaire_suivant = next(e for e in mutant[4] if e.get("serie") != "cicatrices" and e["date"] == "2026-09-29" and e.get("statut") == "planned")
        ordinaire_suivant["date"] = "2026-09-23"
        self.assertTrue(any("plus de quatre articles" in e for e in PLAN.verifier(*mutant)[0]))

    def test_rattrapage_reel_du_29_conserve_les_creneaux_w39(self):
        donnees = self.lot_w39(dates={slug: "2026-09-29" for slug in (
            "prompt-chatgpt-expert-comptable", "logiciel-ia-comptabilite",
            "tests-verts-et-regle-des-trois-passes")}, deja_inscrite=True)
        erreurs, _, semaine = PLAN.verifier(*donnees)
        self.assertEqual(erreurs, [])
        self.assertEqual(semaine[(2026, 39)], 4)
        self.assertEqual({e['date'] for e in donnees[4] if e['slug'] in PLAN.RATTRAPAGE_W39}, {'2026-09-29'})
        self.assertFalse([e for e in [donnees[3]] + donnees[4] if e.get('statut') == 'planned' and e['date'] == '2026-09-29'])
        mutant = deepcopy(donnees)
        suivant = next(e for e in mutant[4] if e.get('statut') == 'planned')
        suivant['date'] = '2026-09-29'
        self.assertTrue(any('jour réel' in erreur for erreur in PLAN.verifier(*mutant)[0]))
        for mauvaise_date in ('2026-09-25', '2026-09-30'):
            with self.subTest(date=mauvaise_date):
                with self.assertRaises(SystemExit):
                    self.lot_w39(dates={slug: mauvaise_date for slug in PLAN.RATTRAPAGE_W39}, deja_inscrite=True)

    def test_une_publication_w40_sur_son_creneau_du_29_depasse_le_quota_reel(self):
        donnees = self.lot_w39(deja_inscrite=True)
        article = next(e for e in donnees[4] if e.get('serie') != 'cicatrices'
                       and e.get('statut') == 'planned' and e['date'] == '2026-09-29')
        dates = {slug: '2026-09-29' for slug in PLAN.RATTRAPAGE_W39}
        dates[article['slug']] = '2026-09-29'
        scenario = self.lot_w39(dates=dates, deja_inscrite=True)
        self.assertTrue(any('jour réel' in erreur for erreur in PLAN.verifier(*scenario)[0]))
        self.assertEqual(next(e for e in scenario[4] if e['slug'] == article['slug'])['date'], '2026-09-29')

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
    def test_methode_generee_borne_les_signaux_et_compte_les_poles_actifs(self):
        donnees, erreurs, entrants, _ = construire_et_verifier()
        self.assertEqual(erreurs, [])
        with TemporaryDirectory() as dossier, patch.object(PLAN, 'ICI', Path(dossier)):
            data = PLAN.ecrire_json(donnees[0], donnees[1], donnees[3], donnees[4], donnees[5], entrants)
            PLAN.ecrire_md(data, donnees[1])
            import json
            relu = json.loads((Path(dossier) / 'cluster-plan.json').read_text(encoding='utf-8'))
            texte = (Path(dossier) / 'cluster-plan.md').read_text(encoding='utf-8')
        methode = relu['methode']
        self.assertIn(f"{relu['meta']['totalFamilies']} familles et {relu['meta']['totalClusters']} pôles actifs", methode)
        self.assertIn('12 pôles dans la taxonomie', methode)
        self.assertIn('704 amorces', methode)
        self.assertIn('59 pages de résultats DataForSEO ont été relevées par famille, pas par angle', methode)
        self.assertIn('sans mesurer la demande ni le volume de chaque angle', methode)
        self.assertIn('Aucune suggestion relevée ne prouve une absence de demande', methode)
        self.assertNotIn('demande mesurée par angle', methode)
        self.assertIn('P1 du backlog, publiées comprises', methode)
        self.assertIn('questions identiques à la SERP par famille du 19/09', methode)
        self.assertIn('requête primaire à zéro le 21/09', methode)
        self.assertIn('secondaires non mesurées', methode)
        self.assertNotIn('deux formulations à zéro', methode)
        self.assertIn(methode, texte)

    def test_exemple_crm_dsn_et_consigne_restent_bornes_au_releve(self):
        import json
        releve = json.loads((PLAN.ICI / 'mesures/questions-2026-09-19.json').read_text(encoding='utf-8'))
        suggestions = releve['autocompletion']['crm dsn']
        strategie = (PLAN.ICI / 'SEO-STRATEGY.md').read_text(encoding='utf-8')
        exemple = next(ligne for ligne in strategie.splitlines() if ligne.startswith('4. **Certaines formulations de métier'))
        self.assertEqual(len(suggestions), 10)
        for code in ('120', '119', '124', '121', '34'):
            self.assertIn(f'dsn crm {code}', suggestions)
            self.assertIn(code, exemple)
        self.assertNotIn('114', exemple)
        self.assertIn('non une mesure de volume Ads, de demande ou d\'audience cabinet', exemple)
        roadmap = (PLAN.ICI / 'IMPLEMENTATION-ROADMAP.md').read_text(encoding='utf-8')
        self.assertNotIn('angles sans demande', roadmap)
        self.assertIn('Confronter SERP, intention cabinet et Search Console avant', roadmap)

    def test_calendrier_p3_mesures_ne_conclut_pas_a_une_absence_de_demande(self):
        import json
        backlog = json.loads(PLAN.BACKLOG.read_text(encoding='utf-8'))
        p3 = [e for e in backlog if e['priorite'] == 3 and e.get('demande', {}).get('mesureeLe')]
        self.assertEqual(len(p3), 201)
        donnees, erreurs, _, _ = construire_et_verifier()
        self.assertEqual(erreurs, [])
        with TemporaryDirectory() as dossier, patch.object(PLAN, 'ICI', Path(dossier)):
            PLAN.ecrire_calendrier(donnees[3], donnees[4], donnees[1], donnees[0])
            regle = (Path(dossier) / 'CONTENT-CALENDAR.md').read_text(encoding='utf-8').splitlines()[6]
        self.assertIn('3 : aucune suggestion relevée sur les formulations testées', regle)
        self.assertIn("sauf l'angle IA publié conservé en P1", regle)
        self.assertIn('ne permet de conclure ni au volume de recherche, ni à la demande, ni à l’audience', regle)
        self.assertNotIn('aucune demande mesurée', regle)

    def test_priorite_un_exige_un_signal_et_non_seulement_une_date(self):
        donnees, erreurs, _, _ = construire_et_verifier()
        self.assertEqual(erreurs, [])
        slug = 'rapprochement-bancaire-automatise-les-ecarts-a-remonter'
        for requete, secondaires in ((None, None), (0, None), (None, 1)):
            essai = deepcopy(donnees)
            angle = next(e for e in essai[4] if e['slug'] == slug)
            angle['demande'] = {**angle['demande'], 'requete': requete, 'secondaires': secondaires}
            with self.subTest(requete=requete, secondaires=secondaires):
                erreurs, _, _ = PLAN.verifier(*essai)
                self.assertTrue(any('priorité 1 sans signal mesuré' in erreur for erreur in erreurs), erreurs)
        # La page historique datée avec SERP et primaire vide reste licite.
        historique = next(e for e in donnees[4] if e['slug'] ==
                         'intelligence-artificielle-metier-comptable-ce-qu-elle-prepare-ce-qui-reste-humain')
        self.assertEqual(historique['demande']['requete'], 0)
        self.assertTrue(historique['demande']['questions'])
        essai = deepcopy(donnees)
        angle = next(e for e in essai[4] if e['slug'] == slug)
        angle['demande'] = {**historique['demande']}
        erreurs, _, _ = PLAN.verifier(*essai)
        self.assertTrue(any('priorité 1 sans signal mesuré' in erreur for erreur in erreurs), erreurs)

    def test_ia_publiee_exige_sa_serp_historique_exacte_sans_modifier_la_publication(self):
        donnees, erreurs, _, _ = construire_et_verifier()
        self.assertEqual(erreurs, [])
        slug = 'intelligence-artificielle-metier-comptable-ce-qu-elle-prepare-ce-qui-reste-humain'
        original = next(e for e in donnees[4] if e['slug'] == slug)
        self.assertEqual(original['statut'], 'published')
        mesure = json.loads((PLAN.ICI / 'mesures/questions-2026-09-19.json').read_text(encoding='utf-8'))
        primaire = json.loads((PLAN.ICI / 'mesures/titres-intent-2026-09-21.json').read_text(encoding='utf-8'))
        serp = mesure['serp']["former l'équipe à l'IA cabinet comptable"]
        questions = serp['questions']
        self.assertEqual(original['demande']['questions'], questions)
        self.assertEqual(original['demande']['mesureeLe'], primaire['measuredAt'][:10])
        self.assertEqual(original['demande']['requete'], len(primaire['autocompletion'][original['requete']]))
        self.assertIsNone(original['demande']['secondaires'])
        self.assertEqual(original['demande']['serpFamille'], {
            'mesureeLe': mesure['jour'], 'amorce': "former l'équipe à l'IA cabinet comptable",
            'famille': serp['famille']})
        self.assertEqual(original['demande']['apercuIa'], serp['apercuIa'])
        for mutation in ({'mesureeLe': None}, {'mesureeLe': '2026-09-19'},
                         {'questions': []}, {'questions': ['question inventée']},
                         {'requete': None}, {'secondaires': 0},
                         {'requete': 2}, {'requete': 2, 'questions': []},
                         {'requete': 2, 'questions': ['question inventée']},
                         {'requete': 2, 'mesureeLe': '2026-09-19'},
                         {'serpFamille': None},
                         {'serpFamille': {'mesureeLe': '2026-09-19', 'amorce': 'autre amorce', 'famille': serp['famille']}},
                         {'apercuIa': False}):
            essai = deepcopy(donnees)
            angle = next(e for e in essai[4] if e['slug'] == slug)
            angle['demande'].update(mutation)
            with self.subTest(mutation=mutation):
                erreurs, _, _ = PLAN.verifier(*essai)
                self.assertTrue(any('priorité 1 sans signal mesuré' in erreur for erreur in erreurs), erreurs)
                self.assertEqual(angle['statut'], 'published')
                self.assertEqual(angle['date'], original['date'])
        essai = deepcopy(donnees)
        angle = next(e for e in essai[4] if e['slug'] == slug)
        angle['statut'] = 'planned'
        erreurs, _, _ = PLAN.verifier(*essai)
        self.assertTrue(any('priorité 1 sans signal mesuré' in erreur for erreur in erreurs), erreurs)

        # Une autre P1 déjà publiée n'est pas dispensée par le court-circuit historique.
        autre = next(e for e in donnees[4] if e['statut'] == 'published' and
                     e['priorite'] == 1 and e['slug'] != slug and not e.get('historique') and e.get('demande'))
        essai = deepcopy(donnees)
        angle = next(e for e in essai[4] if e['slug'] == autre['slug'])
        angle['demande']['requete'] = None
        erreurs, _, _ = PLAN.verifier(*essai)
        self.assertTrue(any('priorité 1 sans signal mesuré' in erreur for erreur in erreurs), erreurs)

    def test_ia_sources_mutantes_sont_refusees_sans_changer_le_backlog(self):
        donnees, erreurs, _, _ = construire_et_verifier()
        self.assertEqual(erreurs, [])
        original_read = Path.read_text
        amorce = "former l'équipe à l'IA cabinet comptable"
        requete = 'métier comptable intelligence artificielle compétences'
        for nom, champ, valeur in (
            ('questions-2026-09-19.json', 'jour', '2026-09-21'),
            ('questions-2026-09-19.json', 'famille', 'autre-famille'),
            ('questions-2026-09-19.json', 'apercuIa', False),
            ('titres-intent-2026-09-21.json', 'measuredAt', '2026-09-19T00:39:45.351Z'),
            ('titres-intent-2026-09-21.json', 'suggestions', ['faux primaire']),
            ('titres-intent-2026-09-21.json', 'absence', None),
            ('titres-intent-2026-09-21.json', 'secondaire', ['suggestion secondaire']),
        ):
            source = PLAN.ICI / 'mesures' / nom
            mesure = json.loads(original_read(source, encoding='utf-8'))
            if champ in ('jour', 'measuredAt'):
                mesure[champ] = valeur
            elif champ in ('famille', 'apercuIa'):
                mesure['serp'][amorce][champ] = valeur
            elif champ == 'suggestions':
                mesure['autocompletion'][requete] = valeur
            elif champ == 'secondaire':
                mesure['autocompletion']['intelligence artificielle cabinet comptable'] = valeur
            else:
                del mesure['autocompletion'][requete]

            def lire(chemin, *args, **kwargs):
                return (json.dumps(mesure, ensure_ascii=False) if chemin == source
                        else original_read(chemin, *args, **kwargs))

            with self.subTest(source=nom, mutation=champ), patch.object(Path, 'read_text', autospec=True, side_effect=lire):
                erreurs, _, _ = PLAN.verifier(*donnees)
                self.assertTrue(any('priorité 1 sans signal mesuré' in erreur for erreur in erreurs), erreurs)

    def test_pilier_publie_exige_sa_mesure_primaire_source(self):
        import json
        donnees, erreurs, _, _ = construire_et_verifier()
        self.assertEqual(erreurs, [])
        pilier = donnees[3]
        self.assertEqual(pilier['statut'], 'published')
        cache = json.loads((PLAN.ICI / 'mesures/autocompletion-cache.json').read_text(encoding='utf-8'))
        source = cache[pilier['requete']]
        self.assertEqual(pilier['demande']['requete'], len(source['suggestions']))
        self.assertEqual(pilier['demande']['mesureeLe'], source['le'])
        for mutation in (None, {'mesureeLe': None}, {'requete': None},
                         {'requete': len(source['suggestions']) + 1}, {'mesureeLe': '2026-09-21'}):
            essai = deepcopy(donnees)
            essai[3]['demande'] = mutation
            with self.subTest(mutation=mutation):
                erreurs, _, _ = PLAN.verifier(*essai)
                self.assertTrue(any('priorité 1 sans signal mesuré' in erreur for erreur in erreurs), erreurs)

    def test_planifier_repartit_les_creneaux_autour_d_une_date_fixe(self):
        entries = [dict(slug=str(i), famille='f', pole=p, format=p, priorite=1, rang_famille=i)
                   for i, p in enumerate(('a', 'a', 'a', 'b', 'b'))]
        entries[3]['datePlanifiee'] = '2026-09-29'
        # Oracle indépendant : les mêmes cinq créneaux, plafonds respectés,
        # alternance valide sans déplacer la date fixée ni ajouter d'exception.
        oracle = deepcopy(entries)
        for entry, day in zip(oracle, ('2026-09-28', '2026-09-29', '2026-10-05',
                                       '2026-09-29', '2026-09-30')):
            entry['date'] = day
            entry['statut'] = 'planned'
        for index, entry in enumerate(sorted(oracle, key=lambda e: (e['date'], e['pole'] == 'a'))):
            entry['_ordre_calendrier'] = index
        self.assertEqual(PLAN.verifier_alternance(oracle), [])
        self.assertEqual(oracle[3]['date'], '2026-09-29')

        PLAN.planifier(entries, {}, aujourd_hui=date(2026, 9, 28))
        ordered = sorted(entries, key=lambda e: (e['date'], e['_ordre_calendrier']))
        self.assertEqual([e['pole'] for e in ordered], ['a', 'b', 'a', 'b', 'a'])
        self.assertEqual(entries[3]['date'], '2026-09-29')
        self.assertEqual(PLAN.verifier_alternance(entries), [])
        self.assertEqual(sorted(e['date'] for e in entries), sorted(e['date'] for e in oracle))

    def test_date_fixe_intercalee_ne_rejette_pas_stock_alternable(self):
        entries = [dict(slug=str(i), famille='f', pole=p, format=p, priorite=1, rang_famille=i)
                   for i, p in enumerate(('a', 'a', 'a', 'b', 'b'))]
        entries[1]['slug'], entries[3]['slug'] = entries[3]['slug'], entries[1]['slug']
        entries[3]['datePlanifiee'] = '2026-09-29'
        for i, day in enumerate(('2026-09-28', '2026-09-30', '2026-09-29', '2026-09-29', '2026-10-05')):
            entries[i]['date'] = day
            entries[i]['statut'] = 'planned'
        PLAN.alterner(entries)
        ordered = sorted(entries, key=lambda e: e['_ordre_calendrier'])
        self.assertEqual([e['pole'] for e in ordered], ['a', 'b', 'a', 'b', 'a'])
        self.assertEqual(entries[3]['date'], '2026-09-29')
        self.assertEqual(PLAN.verifier_alternance(entries), [])

    def test_creneaux_echus_sont_traces_sans_rester_planifies(self):
        entries = [dict(slug='ancien', famille='f', pole='a', format='how-to-guide', priorite=1,
                        rang_famille=0, dateManquee='2026-09-22'),
                   dict(slug='nouveau', famille='f', pole='b', format='faq-knowledge', priorite=1,
                        rang_famille=1)]
        with patch.object(PLAN, 'PREMIER_JOUR', date(2026, 9, 17)):
            PLAN.planifier(entries, {}, aujourd_hui=date(2026, 9, 28))
        self.assertTrue(all(str(e['date']) >= '2026-09-28' for e in entries))
        self.assertEqual(entries[0]['dateManquee'], '2026-09-22')
        self.assertEqual(entries[0]['statut'], 'a-replanifier')
        self.assertEqual(PLAN.verifier_alternance(entries), [])

    def test_date_figee_echue_est_refusee_avant_planification(self):
        entries = [dict(slug='ancien', famille='f', pole='a', format='how-to-guide', priorite=1,
                        rang_famille=0, datePlanifiee='2026-09-22')]
        with self.assertRaisesRegex(SystemExit, 'date planifiée échue'):
            PLAN.planifier(entries, {}, aujourd_hui=date(2026, 9, 28))

    def test_dates_figees_et_priorites_du_backlog_sont_inchangees(self):
        import json
        backlog = json.loads(PLAN.BACKLOG.read_text(encoding='utf-8'))
        donnees, erreurs, _, _ = construire_et_verifier()
        self.assertEqual(erreurs, [])
        plan = {e['slug']: e for e in [donnees[3]] + donnees[4]}
        for entry in backlog:
            if entry.get('datePlanifiee'):
                self.assertEqual(plan[entry['slug']]['date'], entry['datePlanifiee'])
            self.assertEqual(plan[entry['slug']]['priorite'], entry['priorite'])
        for slug, published in donnees[2].items():
            self.assertEqual(plan[slug]['date'], published['date'])

    def test_alternance_sur_creneaux_non_figes(self):
        entries = [dict(slug=str(i), famille='f', pole=p, format=f, priorite=1, rang_famille=i)
                   for i, (p, f) in enumerate([('a', 'how-to-guide'), ('a', 'how-to-guide'),
                                                 ('b', 'faq-knowledge'), ('b', 'listicle-checklist')])]
        with patch.object(PLAN, 'PREMIER_JOUR', date(2026, 9, 28)):
            PLAN.planifier(entries, {})
        ordered = sorted(entries, key=lambda e: (e['date'], e['slug']))
        for before, after in zip(ordered, ordered[1:]):
            self.assertNotEqual(before['pole'], after['pole'])
            self.assertNotEqual(before['format'], after['format'])

    def test_exception_non_ancree_est_acceptee_par_le_planificateur_et_le_verificateur(self):
        for field, values in (('pole', [('a', 'how-to-guide'), ('a', 'faq-knowledge')]),
                              ('format', [('a', 'how-to-guide'), ('b', 'how-to-guide')])):
            with self.subTest(field=field):
                entries = [dict(slug=str(i), famille='f', pole=p, format=f, priorite=1, rang_famille=i)
                           for i, (p, f) in enumerate(values)]
                entries[1]['exceptionAlternance'] = {field: {'date': '2026-09-29', 'raison': 'stock factuel borné'}}
                with patch.object(PLAN, 'PREMIER_JOUR', date(2026, 9, 28)):
                    PLAN.planifier(entries, {})
                self.assertEqual(entries[1]['date'], '2026-09-29')
                self.assertEqual(PLAN.verifier_alternance(entries), [])

    def test_exception_invalide_ne_passe_pas(self):
        for exception in ({'pole': {'raison': 'preuve'}},
                          {'pole': {'date': '2026-09-18'}},
                          {'autre': {'date': '2026-09-18', 'raison': 'preuve'}},
                          {'format': {'date': '2026-09-19', 'raison': 'preuve'}}):
            with self.subTest(exception=exception):
                entries = [dict(slug='0', famille='f', pole='a', format='how-to-guide', priorite=1, rang_famille=0),
                           dict(slug='1', famille='f', pole='a', format='faq-knowledge', priorite=1,
                                rang_famille=1, exceptionAlternance=exception)]
                with self.assertRaises(SystemExit):
                    PLAN.planifier(entries, {})

    def test_cicatrice_ne_justifie_pas_une_exception_sans_stock(self):
        entries = [dict(slug='c', serie='cicatrices', priorite=1, rang_famille=0,
                        exceptionAlternance={'pole': {'date': '2026-09-19', 'raison': 'stock absent'}})]
        with self.assertRaises(SystemExit):
            PLAN.planifier(entries, {})

    def test_exception_sur_mauvais_champ_ne_couvre_pas_une_rupture_de_pole(self):
        entries = [dict(slug=str(i), famille='f', pole=p, format=f, priorite=1, rang_famille=i)
                   for i, (p, f) in enumerate([('a', 'how-to-guide'), ('a', 'faq-knowledge')])]
        entries[1]['exceptionAlternance'] = {'format': {'date': '2026-09-29', 'raison': 'motif'}}
        with patch.object(PLAN, 'PREMIER_JOUR', date(2026, 9, 28)):
            with self.assertRaises(SystemExit):
                PLAN.planifier(entries, {})

    def test_cicatrice_du_samedi_ne_consomme_pas_le_plafond_des_quatre(self):
        donnees, erreurs, _, par_semaine = construire_et_verifier()
        self.assertEqual(erreurs, [])
        self.assertEqual(par_semaine[(2026, 38)], 4)
        satellites = donnees[4]
        cicatrices = sorted((e for e in satellites if e.get("serie") == "cicatrices"), key=lambda e: e["date"])
        dates = [date.fromisoformat(e["date"]) for e in cicatrices]
        self.assertGreaterEqual(len(dates), 8)
        self.assertEqual(dates[0].isoformat(), "2026-09-19")
        creneaux = [date.fromisoformat(PLAN.creneau(e)) for e in cicatrices]
        self.assertTrue(all((b - a).days == 7 for a, b in zip(creneaux, creneaux[1:])), creneaux)
        if "tests-verts-et-regle-des-trois-passes" in {e["slug"] for e in cicatrices}:
            self.assertIn(date(2026, 9, 28), dates)
        self.assertEqual(cicatrices[0]["statut"], "published")
        self.assertTrue(all(e["statut"] == ("published" if e["slug"] == "tests-verts-et-regle-des-trois-passes" else "manque" if e['date'] < date.today().isoformat() else "planned") for e in cicatrices[1:]), cicatrices)

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
        cicatrices[1]["date"] = "2026-09-26"
        erreurs, _, _ = PLAN.verifier(*donnees)
        self.assertTrue(any("plus d’une cicatrice" in erreur for erreur in erreurs), erreurs)

    def test_une_cicatrice_future_manquante_rougit_la_cadence(self):
        donnees, _, _, _ = construire_et_verifier()
        donnees = deepcopy(donnees)
        cicatrices = sorted((e for e in donnees[4] if e.get("serie") == "cicatrices"), key=lambda e: PLAN.creneau(e))
        cicatrices[2]["date"] = "2026-10-10"
        erreurs, _, _ = PLAN.verifier(*donnees)
        self.assertTrue(any("cadence hebdomadaire" in erreur for erreur in erreurs), erreurs)


if __name__ == "__main__":
    unittest.main(verbosity=2)
