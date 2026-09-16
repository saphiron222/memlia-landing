#!/usr/bin/env python3
"""Source unique du plan de cluster v3 : génère cluster-plan.json, cluster-plan.md et cluster-map.html,
et vérifie les invariants (unicité, énumérations du schéma du blog, maillage, répartition mensuelle).

Usage, depuis la racine du dépôt :
    python3 docs/strategy/site-v3/build-cluster-plan.py            # régénère
    python3 docs/strategy/site-v3/build-cluster-plan.py --check    # régénère et échoue si un invariant casse
"""
import json
import re
import sys
from pathlib import Path

ICI = Path(__file__).resolve().parent
GABARIT = Path.home() / '.claude/skills/seo-cluster/templates/cluster-map.html'
SCHEMA = ICI.parents[2] / 'src/content.config.ts'

CLUSTERS = {
    'methode-decision-humaine': ('Méthode et décision humaine', '#27b657'),
    'production-comptable': ('Production comptable', '#1c8a41'),
    'facturation-recouvrement': ('Facturation et recouvrement', '#b5651d'),
    'administratif-secretariat': ('Administration et secrétariat', '#6d28d9'),
    'portefeuille-echeances': ('Portefeuille et échéances', '#0e7490'),
    'numerique-it-data': ('Numérique, IT et data', '#1d4ed8'),
    'excel-outils-existants': ('Excel et outils existants', '#a16207'),
    'paie-social': ('Paie et social', '#be123c'),
    'juridique-fiscal': ('Juridique et fiscal', '#4b5563'),
    'rh-formation': ('RH et formation', '#9d174d'),
}
DORMANT = {'audit-cac': 'aucun besoin documenté, aucun module : ne pas ouvrir'}
GABARIT_PAR_FORMAT = {'pillar-page': 'ultimate-guide', 'how-to-guide': 'how-to', 'faq-knowledge': 'explainer', 'listicle-checklist': 'listicle'}
MOIS = ['octobre 2026', 'novembre 2026', 'décembre 2026', 'janvier 2027', 'février 2027', 'mars 2027',
        'avril 2027', 'mai 2027', 'juin 2027', 'juillet 2027', 'août 2027', 'septembre 2027']

PILIER = dict(n=1, mois=1, slug='automatiser-un-cabinet-comptable-la-carte-des-taches',
              titre='Automatiser un cabinet comptable : la carte des tâches', requete='automatisation cabinet comptable',
              cluster='methode-decision-humaine', role='direction-associes', format='pillar-page', mots=3200,
              secondaires=['automatiser cabinet expertise comptable', 'tâches répétitives cabinet comptable', 'automatisation sans changer de logiciel'],
              glossaire=['Automatisation', 'Flux de travail', 'Proposition puis validation', 'Recette', 'Supervision humaine'])

# (n, mois, slug, titre, requête primaire, cluster, rôle, format, secondaires, ancres de glossaire)
SATELLITES = [
    (2, 1, 'automatiser-la-relance-des-pieces-clients', 'Automatiser la relance des pièces clients', 'relance pièces manquantes cabinet comptable', 'production-comptable', 'collaborateurs-comptables', 'how-to-guide', ['collecte de pièces comptables automatisée', 'relance documents clients expert-comptable'], ['Relance de pièces', 'Déclencheur', 'Exception', 'Pré-comptabilité']),
    (3, 2, 'controler-la-completude-d-un-dossier-client', 'Contrôler la complétude d’un dossier client', 'pièces manquantes dossier comptable checklist', 'production-comptable', 'assistants-comptables', 'listicle-checklist', ['checklist pièces comptables client', 'liste des pièces à fournir expert-comptable'], ['Complétude du dossier', 'File d’anomalies']),
    (4, 2, 'automatiser-les-relances-d-honoraires-impayes', 'Automatiser les relances d’honoraires impayés', 'relance impayés cabinet comptable', 'facturation-recouvrement', 'facturation-recouvrement', 'how-to-guide', ['relance honoraires expert-comptable', 'recouvrement honoraires cabinet'], ['Déclencheur', 'Prélèvement SEPA et rejet', 'Recouvrement amiable']),
    (5, 2, 'trier-la-boite-mail-du-cabinet-par-client-et-priorite', 'Trier la boîte mail du cabinet par client et par priorité', 'gestion boîte mail cabinet expertise comptable', 'administratif-secretariat', 'direction-associes', 'how-to-guide', ['tri automatique courriels cabinet comptable', 'boîte mail saturée expert-comptable'], ['IA générative', 'Génération augmentée par recherche', 'Donnée personnelle']),
    (6, 3, 'choisir-la-premiere-tache-a-automatiser', 'Choisir la première tâche à automatiser', 'quelle tâche automatiser cabinet comptable', 'methode-decision-humaine', 'direction-associes', 'how-to-guide', ['tâches répétitives cabinet comptable', 'automatisation cabinet comptable par où commencer'], ['Flux de travail', 'Règle de cabinet', 'Proposition puis validation']),
    (7, 3, 'ia-generative-au-cabinet-ce-qu-elle-prepare-ce-qu-elle-ne-decide-pas', 'L’IA générative au cabinet : ce qu’elle prépare, ce qu’elle ne décide pas', 'IA cabinet expertise comptable', 'numerique-it-data', 'direction-associes', 'faq-knowledge', ['intelligence artificielle expert-comptable', 'IA générative cabinet comptable limites'], ['Système d’IA', 'IA générative', 'Grand modèle de langage', 'Hallucination']),
    (8, 3, 'automatiser-sans-changer-de-logiciel', 'Automatiser sans changer de logiciel', 'automatiser cabinet comptable sans changer de logiciel', 'excel-outils-existants', 'direction-associes', 'how-to-guide', ['automatiser Excel cabinet comptable', 'automatisation logiciel comptable sans API'], ['Automatisation', 'Connecteur et API', 'Automatisation robotisée des processus']),
    (9, 3, 'detecter-les-rejets-de-prelevement-et-proposer-un-echeancier', 'Détecter les rejets de prélèvement et proposer un échéancier', 'rejet de prélèvement honoraires cabinet', 'facturation-recouvrement', 'facturation-recouvrement', 'how-to-guide', ['rejet prélèvement SEPA motif', 'échéancier de rattrapage honoraires'], ['Prélèvement SEPA et rejet', 'Proposition puis validation']),
    (10, 4, 'automatiser-la-saisie-comptable-ce-qui-reste-a-verifier', 'Automatiser la saisie comptable : ce qui reste à vérifier', 'automatisation saisie comptable OCR', 'production-comptable', 'collaborateurs-comptables', 'how-to-guide', ['saisie comptable automatique cabinet', 'OCR factures expert-comptable'], ['Reconnaissance optique de caractères', 'Extraction de données', 'Reliquat d’exceptions']),
    (11, 4, 'lettrage-automatique-regles-et-cas-de-refus', 'Lettrage automatique : règles et cas de refus', 'lettrage automatique comptable', 'production-comptable', 'collaborateurs-comptables', 'how-to-guide', ['lettrage comptable automatisé', 'règles de lettrage'], ['Lettrage comptable', 'Cas de refus', 'Clé de rapprochement']),
    (12, 4, 'suivre-les-echeances-fiscales-d-un-portefeuille', 'Suivre les échéances fiscales d’un portefeuille', 'suivi échéances fiscales cabinet comptable', 'portefeuille-echeances', 'chefs-mission-portefeuille', 'how-to-guide', ['calendrier fiscal cabinet comptable suivi', 'échéances déclarations clients tableau'], ['Seuil d’alerte', 'Agrégat non nominatif']),
    (13, 5, 'rapprochement-bancaire-automatise-les-ecarts-a-remonter', 'Rapprochement bancaire automatisé : les écarts à remonter', 'rapprochement bancaire automatique', 'production-comptable', 'collaborateurs-comptables', 'how-to-guide', ['rapprochement bancaire automatisé cabinet', 'écarts de rapprochement bancaire'], ['Rapprochement bancaire', 'Clé de rapprochement', 'File d’anomalies']),
    (14, 5, 'facture-electronique-ce-que-change-la-collecte-des-pieces', 'Facture électronique : ce que change la collecte des pièces', 'facture électronique cabinet comptable collecte', 'production-comptable', 'chefs-mission-portefeuille', 'faq-knowledge', ['facturation électronique expert-comptable', 'plateforme agréée facture électronique cabinet'], ['Facture électronique et plateforme agréée', 'Extraction de données']),
    (15, 5, 'suivre-le-renouvellement-des-lettres-de-mission', 'Suivre le renouvellement des lettres de mission', 'lettre de mission renouvellement suivi', 'administratif-secretariat', 'administratif-secretariat', 'how-to-guide', ['lettre de mission expert-comptable échéance', 'suivi lettres de mission cabinet'], ['Lettre de mission', 'Déclencheur']),
    (16, 6, 'automatiser-l-entree-en-relation-d-un-nouveau-client', 'Automatiser l’entrée en relation d’un nouveau client', 'onboarding client cabinet comptable', 'administratif-secretariat', 'administratif-secretariat', 'listicle-checklist', ['checklist nouveau client expert-comptable', 'entrée en relation cabinet comptable pièces'], ['Lettre de mission', 'Complétude du dossier']),
    (17, 6, 'agent-ia-ou-assistant-ia-la-difference-pour-un-cabinet', 'Agent IA ou assistant IA : la différence pour un cabinet', 'agent IA cabinet comptable', 'numerique-it-data', 'numerique-it-data', 'faq-knowledge', ['agent IA expert-comptable', 'assistant IA cabinet comptable'], ['Agent IA', 'Génération augmentée par recherche', 'Supervision humaine']),
    (18, 6, 'ne-pas-facturer-deux-fois-un-acte-hors-forfait', 'Ne pas facturer deux fois un acte hors forfait', 'facturation actes hors forfait cabinet comptable', 'facturation-recouvrement', 'facturation-recouvrement', 'how-to-guide', ['double facturation cabinet comptable', 'honoraires hors forfait facturation'], ['Honoraires mensualisés et actes hors forfait', 'Idempotence']),
    (19, 7, 'tableau-de-bord-de-production-sans-classer-les-personnes', 'Un tableau de bord de production sans classer les personnes', 'tableau de bord cabinet comptable suivi dossiers', 'portefeuille-echeances', 'direction-associes', 'how-to-guide', ['pilotage production cabinet comptable', 'indicateurs cabinet comptable dossiers'], ['Agrégat non nominatif', 'Seuil d’alerte']),
    (20, 7, 'automatiser-les-controles-repetitifs-de-la-revision-par-cycles', 'Automatiser les contrôles répétitifs de la révision par cycles', 'révision comptable par cycles contrôles', 'production-comptable', 'chefs-mission-portefeuille', 'listicle-checklist', ['checklist révision comptable', 'révision des comptes automatisée'], ['Révision comptable', 'Contrôle de cohérence']),
    (21, 7, 'preparer-la-tva-les-controles-avant-declaration', 'Préparer la TVA : les contrôles avant déclaration', 'contrôle TVA avant déclaration cabinet', 'juridique-fiscal', 'juridique-fiscal', 'how-to-guide', ['contrôle de cohérence TVA CA3', 'préparation déclaration TVA cabinet comptable'], ['Contrôle de cohérence', 'Validation humaine']),
    (22, 8, 'collecter-les-variables-de-paie-sans-relancer-a-la-main', 'Collecter les variables de paie sans relancer à la main', 'collecte variables de paie clients cabinet', 'paie-social', 'paie-responsables-sociaux', 'how-to-guide', ['variables de paie collecte automatisée', 'relance variables de paie clients'], ['Contrôle avant DSN', 'Relance de pièces']),
    (23, 8, 'ce-qu-un-jeu-d-essai-fictif-prouve-et-ne-prouve-pas', 'Ce qu’un jeu d’essai fictif prouve, et ne prouve pas', 'jeu de test automatisation comptable', 'methode-decision-humaine', 'direction-associes', 'faq-knowledge', ['jeu d’essai fictif comptabilité', 'données fictives test automatisation'], ['Jeu d’essai fictif', 'Recette', 'Anonymisation']),
    (24, 8, 'reperer-un-dossier-facture-sous-son-tarif', 'Repérer un dossier facturé sous son tarif', 'sous-facturation cabinet expertise comptable', 'facturation-recouvrement', 'direction-associes', 'how-to-guide', ['sous-facturation expert-comptable', 'écart tarif honoraires encaissés'], ['Seuil d’alerte', 'Honoraires mensualisés et actes hors forfait']),
    (25, 9, 'importer-un-export-logiciel-dans-excel-sans-ressaisie', 'Importer un export logiciel dans Excel sans ressaisie', 'import export logiciel comptable Excel', 'excel-outils-existants', 'assistants-comptables', 'how-to-guide', ['import CSV logiciel comptable Excel', 'export logiciel comptable vers Excel automatique'], ['Export logiciel et import CSV', 'Idempotence', 'Schéma de données']),
    (26, 9, 'rgpd-et-ia-au-cabinet-sous-traitance-et-secret-professionnel', 'RGPD et IA au cabinet : sous-traitance et secret professionnel', 'IA RGPD cabinet expertise comptable', 'numerique-it-data', 'direction-associes', 'faq-knowledge', ['IA secret professionnel expert-comptable', 'sous-traitant RGPD outil IA cabinet'], ['Sous-traitant (RGPD)', 'Modèle local', 'Minimisation des données']),
    (27, 9, 'suivre-l-envoi-des-plaquettes-de-bilan', 'Suivre l’envoi des plaquettes de bilan', 'plaquette de bilan suivi envoi clients', 'administratif-secretariat', 'administratif-secretariat', 'how-to-guide', ['plaquette bilan cabinet comptable envoi', 'suivi remise bilan clients'], ['Déclencheur', 'Traçabilité']),
    (28, 10, 'cloture-annuelle-automatiser-les-controles-repetitifs', 'Clôture annuelle : automatiser les contrôles répétitifs', 'clôture comptable cabinet automatisation', 'production-comptable', 'chefs-mission-portefeuille', 'listicle-checklist', ['checklist clôture comptable cabinet', 'clôture des comptes automatisée'], ['Révision comptable', 'File d’anomalies']),
    (29, 10, 'notes-de-frais-clients-traiter-sans-ressaisie', 'Notes de frais clients : traiter sans ressaisie', 'notes de frais cabinet comptable automatisation', 'production-comptable', 'assistants-comptables', 'how-to-guide', ['notes de frais OCR cabinet', 'traitement notes de frais expert-comptable'], ['Reconnaissance optique de caractères', 'Reliquat d’exceptions']),
    (30, 10, 'ai-act-ce-qu-un-cabinet-de-dix-personnes-doit-faire', 'AI Act : ce qu’un cabinet de dix personnes doit faire', 'AI Act cabinet comptable obligations', 'numerique-it-data', 'direction-associes', 'faq-knowledge', ['règlement IA cabinet expertise comptable', 'AI Act obligations PME'], ['Système d’IA', 'Supervision humaine', 'Maîtrise de l’IA']),
    (31, 11, 'approbation-des-comptes-preparer-le-secretariat-juridique-annuel', 'Approbation des comptes : préparer le secrétariat juridique annuel', 'approbation des comptes AG cabinet automatisation', 'juridique-fiscal', 'juridique-fiscal', 'how-to-guide', ['secrétariat juridique annuel cabinet comptable', 'assemblée générale approbation des comptes préparation'], ['Déclencheur', 'Validation humaine']),
    (32, 11, 'mesurer-le-temps-reellement-gagne-par-une-automatisation', 'Mesurer le temps réellement gagné par une automatisation', 'ROI automatisation cabinet comptable', 'methode-decision-humaine', 'direction-associes', 'how-to-guide', ['retour sur investissement automatisation cabinet', 'temps gagné automatisation expert-comptable'], ['Jeu d’essai fictif', 'Reliquat d’exceptions']),
    (33, 11, 'ce-qu-il-ne-faut-pas-automatiser-dans-un-cabinet', 'Ce qu’il ne faut pas automatiser dans un cabinet', 'tâches à ne pas automatiser cabinet comptable', 'methode-decision-humaine', 'direction-associes', 'faq-knowledge', ['limites automatisation expert-comptable', 'jugement professionnel automatisation'], ['Cas de refus', 'Supervision humaine', 'Agent IA']),
    (34, 12, 'suivre-la-liasse-edi-tdfc-et-ses-rejets', 'Suivre la liasse EDI-TDFC et ses rejets', 'liasse EDI TDFC rejet suivi', 'portefeuille-echeances', 'chefs-mission-portefeuille', 'how-to-guide', ['rejet EDI-TDFC motif', 'suivi télétransmission liasse fiscale cabinet'], ['Traçabilité', 'File d’anomalies']),
    (35, 12, 'synthese-de-remuneration-d-un-salarie-sans-la-reconstruire', 'La synthèse de rémunération d’un salarié, sans la reconstruire', 'synthèse rémunération salarié cabinet', 'rh-formation', 'rh-recrutement-formation', 'how-to-guide', ['synthèse de rémunération annuelle salarié', 'récapitulatif rémunération salarié Excel'], ['Proposition puis validation', 'Donnée personnelle']),
    (36, 12, 'ce-qu-excel-tient-et-ce-qu-il-ne-tient-plus', 'Ce qu’Excel tient, et ce qu’il ne tient plus', 'limites Excel cabinet comptable', 'excel-outils-existants', 'direction-associes', 'faq-knowledge', ['Excel cabinet comptable limites', 'quand quitter Excel cabinet'], ['Export logiciel et import CSV', 'Schéma de données']),
]

PUBLIES = [
    ('controler-les-bulletins-de-paie-avant-la-dsn', 'Contrôler les bulletins de paie avant la DSN', 'contrôle bulletin de paie avant DSN', 'paie-social', 'paie-responsables-sociaux', 'how-to-guide'),
    ('suivre-la-production-sociale-dans-excel', 'Suivre la production sociale dans Excel', 'suivi production sociale cabinet comptable Excel', 'paie-social', 'direction-associes', 'how-to-guide'),
    ('comprendre-les-comptes-rendus-metier-dsn', 'Comprendre les comptes rendus métier DSN', 'compte rendu métier DSN', 'paie-social', 'paie-responsables-sociaux', 'how-to-guide'),
]

# Liens entre familles (from → to), justifiés par un enchaînement réel de tâches ; 0 à 1 par article.
CROSS = [
    ('automatiser-la-relance-des-pieces-clients', 'automatiser-les-relances-d-honoraires-impayes', 'relancer des honoraires'),
    ('trier-la-boite-mail-du-cabinet-par-client-et-priorite', 'automatiser-la-relance-des-pieces-clients', 'relance des pièces clients'),
    ('controler-la-completude-d-un-dossier-client', 'facture-electronique-ce-que-change-la-collecte-des-pieces', 'facture électronique'),
    ('choisir-la-premiere-tache-a-automatiser', 'automatiser-la-relance-des-pieces-clients', 'relance des pièces clients'),
    ('automatiser-la-saisie-comptable-ce-qui-reste-a-verifier', 'ia-generative-au-cabinet-ce-qu-elle-prepare-ce-qu-elle-ne-decide-pas', 'IA générative au cabinet'),
    ('suivre-les-echeances-fiscales-d-un-portefeuille', 'preparer-la-tva-les-controles-avant-declaration', 'contrôles avant déclaration de TVA'),
    ('tableau-de-bord-de-production-sans-classer-les-personnes', 'suivre-la-production-sociale-dans-excel', 'suivi de production sociale'),
    ('collecter-les-variables-de-paie-sans-relancer-a-la-main', 'synthese-de-remuneration-d-un-salarie-sans-la-reconstruire', 'synthèse de rémunération'),
    ('automatiser-sans-changer-de-logiciel', 'synthese-de-remuneration-d-un-salarie-sans-la-reconstruire', 'complément Excel de synthèse'),
    ('suivre-la-production-sociale-dans-excel', 'synthese-de-remuneration-d-un-salarie-sans-la-reconstruire', 'synthèse de rémunération'),
    ('ce-qu-il-ne-faut-pas-automatiser-dans-un-cabinet', 'rgpd-et-ia-au-cabinet-sous-traitance-et-secret-professionnel', 'RGPD et IA au cabinet'),
    ('ce-qu-excel-tient-et-ce-qu-il-ne-tient-plus', 'tableau-de-bord-de-production-sans-classer-les-personnes', 'tableau de bord de production'),
    ('approbation-des-comptes-preparer-le-secretariat-juridique-annuel', 'suivre-l-envoi-des-plaquettes-de-bilan', 'envoi des plaquettes de bilan'),
    ('suivre-l-envoi-des-plaquettes-de-bilan', 'approbation-des-comptes-preparer-le-secretariat-juridique-annuel', 'approbation des comptes'),
    ('agent-ia-ou-assistant-ia-la-difference-pour-un-cabinet', 'trier-la-boite-mail-du-cabinet-par-client-et-priorite', 'tri de la boîte mail'),
]


def enum_du_schema(nom):
    texte = SCHEMA.read_text(encoding='utf-8')
    m = re.search(nom + r"\s*:\s*z(?:\s*\.\s*array\(\s*z)?\s*\.\s*enum\(\[([^\]]+)\]", texte)
    if not m:
        raise SystemExit(f'énumération {nom} introuvable dans {SCHEMA}')
    return {v.strip().strip("'\"") for v in m.group(1).split(',') if v.strip()}


def construire():
    posts = []
    for (n, mois, slug, titre, req, cl, role, fmt, sec, glo) in SATELLITES:
        posts.append(dict(n=n, mois=mois, slug=slug, titre=titre, requete=req, cluster=cl, role=role, format=fmt,
                          gabarit=GABARIT_PAR_FORMAT[fmt], mots=1500, secondaires=sec, glossaire=glo, statut='planned',
                          url=f'/blog/{slug}', vague=(mois - 1) // 3 + 1))
    for (slug, titre, req, cl, role, fmt) in PUBLIES:
        posts.append(dict(n=None, mois=None, slug=slug, titre=titre, requete=req, cluster=cl, role=role, format=fmt,
                          gabarit=GABARIT_PAR_FORMAT[fmt], mots=None, secondaires=[], glossaire=[], statut='published',
                          url=f'/blog/{slug}', vague=0))
    pilier = dict(PILIER, gabarit='ultimate-guide', statut='planned', url=f"/blog/{PILIER['slug']}", vague=1)

    liens = []
    for p in posts:
        liens.append(dict(de=p['slug'], vers=pilier['slug'], type='pilier', ancre='automatiser une tâche du cabinet'))
        liens.append(dict(de=pilier['slug'], vers=p['slug'], type='pilier', ancre=p['titre']))
    par_cluster = {}
    for p in posts:
        par_cluster.setdefault(p['cluster'], []).append(p)
    for cl, membres in par_cluster.items():
        ordre = sorted(membres, key=lambda p: (p['statut'] != 'published', p['n'] or 0))
        k = len(ordre)
        for i, p in enumerate(ordre):
            for d in (1, 2):
                if k >= 3 or (k == 2 and d == 1):
                    cible = ordre[(i + d) % k]
                    if cible['slug'] != p['slug']:
                        liens.append(dict(de=p['slug'], vers=cible['slug'], type='cluster', ancre=cible['requete']))
    for de, vers, ancre in CROSS:
        liens.append(dict(de=de, vers=vers, type='inter-familles', ancre=ancre))
    return pilier, posts, liens, par_cluster


def verifier(pilier, posts, liens, par_cluster):
    erreurs = []
    tous = [pilier] + posts
    slugs = [p['slug'] for p in tous]
    if len(slugs) != len(set(slugs)):
        erreurs.append('slugs en double')
    reqs = [p['requete'].lower() for p in tous]
    if len(reqs) != len(set(reqs)):
        erreurs.append('requêtes primaires en double (cannibalisation)')
    clusters_ok = enum_du_schema('cluster')
    roles_ok = enum_du_schema('rolePrincipal')
    formats_ok = enum_du_schema('format')
    for p in tous:
        if p['cluster'] not in clusters_ok:
            erreurs.append(f"cluster hors schéma : {p['cluster']} ({p['slug']})")
        if p['role'] not in roles_ok:
            erreurs.append(f"rôle hors schéma : {p['role']} ({p['slug']})")
        if p['format'] not in formats_ok:
            erreurs.append(f"format hors schéma : {p['format']} ({p['slug']})")
    for cl in DORMANT:
        if cl in par_cluster:
            erreurs.append(f'cluster dormant utilisé : {cl}')
    par_mois = {}
    for p in [pilier] + [q for q in posts if q['statut'] == 'planned']:
        par_mois[p['mois']] = par_mois.get(p['mois'], 0) + 1
    attendu = {m: (2 if m == 1 else 4 if m == 3 else 3) for m in range(1, 13)}  # 36 articles : 2 en M1, 4 en M3, 3 ailleurs
    if par_mois != attendu:
        erreurs.append(f'répartition mensuelle {par_mois} ≠ attendue {attendu}')
    entrants = {s: 0 for s in slugs}
    sortants_inter = {s: 0 for s in slugs}
    for l in liens:
        if l['vers'] not in entrants or l['de'] not in entrants:
            erreurs.append(f"lien vers un slug inconnu : {l}")
            continue
        entrants[l['vers']] += 1
        if l['type'] == 'inter-familles':
            sortants_inter[l['de']] += 1
    for p in posts:
        if entrants[p['slug']] < 3:
            erreurs.append(f"moins de trois liens entrants : {p['slug']} ({entrants[p['slug']]})")
        if sortants_inter[p['slug']] > 1:
            erreurs.append(f"plus d'un lien inter-familles sortant : {p['slug']}")
        if not any(l['de'] == p['slug'] and l['vers'] == pilier['slug'] for l in liens):
            erreurs.append(f"pas de lien vers le pilier : {p['slug']}")
        if not any(l['de'] == pilier['slug'] and l['vers'] == p['slug'] for l in liens):
            erreurs.append(f"le pilier n'y renvoie pas : {p['slug']}")
    return erreurs, entrants


def ecrire_json(pilier, posts, liens, par_cluster, entrants):
    data = dict(
        version=1, date='2026-09-16', seed='automatisation cabinet comptable',
        methode='expansion WebSearch (14 relevés, France/fr), recouvrement SERP qualitatif (1 à 2 domaines partagés entre familles : interlier, jamais fusionner), hub-and-spoke ; volumes ND sauf deux requêtes à 10/mois (DataForSEO, 12/09/2026)',
        pillar=dict(title=pilier['titre'], keyword=pilier['requete'], volume=10, template=pilier['gabarit'], wordCount=pilier['mots'], url=pilier['url'], slug=pilier['slug'], cluster=pilier['cluster'], role=pilier['role'], format=pilier['format'], secondaryKeywords=pilier['secondaires'], glossary=pilier['glossaire'], month=pilier['mois'], status='planned'),
        clusters=[dict(id=cl, name=CLUSTERS[cl][0], color=CLUSTERS[cl][1], posts=[
            dict(n=p['n'], title=p['titre'], keyword=p['requete'], volume=None, template=p['gabarit'], format=p['format'], wordCount=p['mots'], url=p['url'], slug=p['slug'], role=p['role'], month=p['mois'], monthLabel=MOIS[p['mois'] - 1] if p['mois'] else None, wave=p['vague'], secondaryKeywords=p['secondaires'], glossary=p['glossaire'], status=p['statut'], incomingLinks=entrants[p['slug']])
            for p in sorted(par_cluster[cl], key=lambda q: (q['statut'] != 'published', q['n'] or 0))]) for cl in CLUSTERS if cl in par_cluster],
        dormantClusters=DORMANT,
        links=[dict(**{'from': l['de'], 'to': l['vers'], 'type': l['type'], 'anchor': l['ancre']}) for l in liens],
        meta=dict(totalPosts=len(posts), plannedPosts=sum(1 for p in posts if p['statut'] == 'planned'), publishedPosts=sum(1 for p in posts if p['statut'] == 'published'), totalClusters=len(par_cluster), totalLinks=len(liens), estimatedWords=pilier['mots'] + sum(p['mots'] or 0 for p in posts)),
    )
    (ICI / 'cluster-plan.json').write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    return data


def ecrire_md(data, entrants, liens):
    L = ['# Plan de cluster v3 — « automatisation cabinet comptable »', '',
         f"Généré le {data['date']} par `build-cluster-plan.py` (source unique). {data['meta']['plannedPosts']} articles planifiés + {data['meta']['publishedPosts']} publiés, {data['meta']['totalClusters']} familles actives, {data['meta']['totalLinks']} liens planifiés, {data['meta']['estimatedWords']} mots estimés.", '',
         '## Méthode', '', data['methode'] + '.', '',
         'Seuils du skill `seo-cluster` (7-10 URL partagées : fusion ; 4-6 : même cluster ; 2-3 : interlier ; 0-1 : séparer) appliqués aux relevés : aucune paire entre familles ne dépasse 2 domaines partagés, les seuls récurrents étant un éditeur de gestion de cabinet et une agence n8n. Les familles sont donc des clusters distincts, interliés par le pilier. À l’intérieur d’une famille, les requêtes voisines (« relance pièces manquantes » / « collecte de pièces ») partagent 3 à 5 domaines : même cluster, articles distincts avec requêtes primaires distinctes.', '',
         '## Pilier', '',
         f"- **{data['pillar']['title']}** — `{data['pillar']['url']}` — requête « {data['pillar']['keyword']} » (10/mois, seule requête de catégorie chiffrée) — {data['pillar']['wordCount']} mots — {MOIS[data['pillar']['month'] - 1]}.", '',
         '## Familles et satellites', '']
    for c in data['clusters']:
        L += [f"### {c['name']} (`{c['id']}`)", '', '| # | Mois | Article | Requête primaire | Format | Rôle | Entrants | Statut |', '|---|---|---|---|---|---|---|---|']
        for p in c['posts']:
            L.append(f"| {p['n'] or '—'} | {p['monthLabel'] or 'publié'} | [{p['title']}]({p['url']}) | {p['keyword']} | {p['format']} | {p['role']} | {p['incomingLinks']} | {p['status']} |")
        L.append('')
    L += ['### Famille dormante', '']
    for cl, raison in data['dormantClusters'].items():
        L.append(f'- `{cl}` : {raison}.')
    L += ['', '## Liens inter-familles (0 à 1 par article, enchaînement réel de tâches)', '', '| De | Vers | Ancre |', '|---|---|---|']
    for l in liens:
        if l['type'] == 'inter-familles':
            L.append(f"| {l['de']} | {l['vers']} | {l['ancre']} |")
    L += ['', '## Règles de maillage vérifiées', '',
          '- chaque satellite renvoie au pilier et le pilier renvoie à chaque satellite (obligatoire) ;',
          '- 2 liens vers les satellites suivants de la même famille (cycliques) ;',
          '- au plus 1 lien inter-familles sortant ;',
          '- au moins 3 liens entrants par article, aucune orpheline ;',
          '- les liens depuis les trois articles publiés se posent à la maintenance (une ligne, réadoption du dossier scellé).', '',
          '## Ancres de glossaire par article', '', '| Article | Termes |', '|---|---|']
    L.append(f"| {data['pillar']['slug']} | {', '.join(data['pillar']['glossary'])} |")
    for c in data['clusters']:
        for p in c['posts']:
            if p['glossary']:
                L.append(f"| {p['slug']} | {', '.join(p['glossary'])} |")
    (ICI / 'cluster-plan.md').write_text('\n'.join(L) + '\n', encoding='utf-8')


def ecrire_html(data):
    gabarit = GABARIT.read_text(encoding='utf-8')
    debut = gabarit.index('const CLUSTER_DATA = {')
    fin = gabarit.index('\n    };', debut) + len('\n    };')
    cd = dict(pillar=data['pillar'], clusters=[dict(name=c['name'], color=c['color'], posts=c['posts']) for c in data['clusters']], links=data['links'], meta=data['meta'])
    html = gabarit[:debut] + 'const CLUSTER_DATA = ' + json.dumps(cd, ensure_ascii=False) + ';' + gabarit[fin:]
    html = html.replace('<title>', '<title>Memlia v3 — ', 1)
    (ICI / 'cluster-map.html').write_text(html, encoding='utf-8')


if __name__ == '__main__':
    pilier, posts, liens, par_cluster = construire()
    erreurs, entrants = verifier(pilier, posts, liens, par_cluster)
    data = ecrire_json(pilier, posts, liens, par_cluster, entrants)
    ecrire_md(data, entrants, liens)
    ecrire_html(data)
    print(f"cluster-plan : {data['meta']['plannedPosts']} planifiés + {data['meta']['publishedPosts']} publiés, {data['meta']['totalClusters']} familles, {data['meta']['totalLinks']} liens ; entrants min = {min(entrants[p['slug']] for p in posts)}, max = {max(entrants[p['slug']] for p in posts)}")
    for e in erreurs:
        print('ERREUR :', e)
    if erreurs and '--check' in sys.argv:
        sys.exit(1)
    print('invariants : OK' if not erreurs else f'{len(erreurs)} erreur(s)')
