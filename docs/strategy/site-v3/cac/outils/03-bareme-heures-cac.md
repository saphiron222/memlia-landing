# 03 — Barème d'heures CAC

## Décision produit et intention
Signataire/chef de mission calculant la tranche de référence et documentant le budget, sans confondre barème, temps réel et honoraires. Catégorie calculer ; route /outils-comptables-gratuits/bareme-heures-cac ; primaire « barème heures commissaire aux comptes », 1 suggestion C2 ; C1 V049/V050/V059–V061, priorité 93. Contrat commun OUTILS-CAC-CADRAGE.md applicable.

## Contrat exécutable et données réglementaires
Saisie séparée total bilan, produits d'exploitation HT, produits financiers HT, période ; montants décimaux exacts non négatifs, base = somme. Questionnaire d'applicabilité en amont couvrant chaque exclusion de l'article officiel actuel et cas de dérogation ; « inconnu » reste inconnu et arrête la restitution d'une fourchette applicable. Toutes les tranches, leurs bornes inclusives/exclusives et heures sont transcrites depuis D.821-188 actuel, avec extrait exact/version conservés dans données internes. Ne pas compléter une tranche depuis la note historique.
Majorations/dérogations : ne calculer une majoration d'alerte qu'après lecture actuelle de D.821-189 et choix explicite de l'utilisateur ; taux saisi borné par le texte, jamais maximum appliqué automatiquement. Exclusions et procédure de dérogation vérifiées respectivement contre R.821-194 et D.821-190 ou leurs successeurs éventuels. Au-dessus de la dernière tranche ou hors champ → « barème non évalué dans ce cas » avec raison, aucune extrapolation. Budget utilisateur dans colonne distincte facultative ; aucune formule d'honoraires ou prix/horaire.
Sortie : décomposition de base, tranche retenue et comparaison à bornes, fourchette, hypothèses/exclusions, budget saisi distinct, source officielle compacte. CSV, JSON de reprise et rapport imprimable + fiche outil. Champs juridiques accompagnés d'une explication compréhensible, date réelle de mise à jour de la grille visible. Maintenir grille versionnée (pas fetch juridique à l'usage). Si les textes ouverts ne permettent pas de couvrir un cas, arrêter ce cas au lieu de deviner.

## SEO et corps statique
H1/OG : « Barème d'heures du commissaire aux comptes : calcul et limites ».
Title : « Barème heures commissaire aux comptes | Memlia ».
Description : « Calculez la base et la tranche du barème d'heures CAC, vérifiez les exclusions et exportez les hypothèses. Distinguez barème et budget de mission. »
Plan ~750 mots : réponse (80), base de calcul (100), tranche et résultat (100), exclusions (140), alerte/dérogation (100), budget versus réalisé (100), exemple fictif/FAQ/sources (130). Aucun tarif universel ni estimation de charge d'audit au-delà du texte.
Concurrence C2 : Axens/Houdart apparaissent sur barème avec références anciennes dans extraits, sans audit complet ni essai. Gain visé = questionnaire d'applicabilité et feuille de calcul d'hypothèses exportable ; pas « seul calculateur à jour ». Sources à ouvrir : Légifrance ou copie officielle LEGI datée du référentiel juridique local (plan A4) ; conserver extraits exacts et liens publics. Ces références candidates ne sont pas ici validées comme droit applicable.

## Frontière
Se prépare seul : somme/base et lecture de la grille sourcée. Attend validation : champ d'application, entrées, majoration demandée et budget. Reste humain : plan/programme de travail, adéquation du budget à mission et démarches de dérogation. CTA /contact après calcul. Pas de rapport « conforme ».

## Cas d'acceptation dev et metier
1. Chaque tranche : borne exacte et valeurs de part et d'autre au centime ; attentes transcrites séparément depuis texte officiel, pas depuis fonction testée.
2. Bilan fictif 100 000, produits exploitation 150 000 et financiers 10 000 → base 260 000 ; fourchette attendue fixée seulement après source.
3. Exclusion confirmée → aucune fourchette applicable ; réponse inconnue → résultat suspendu.
4. Dernière borne dépassée → aucun prolongement linéaire ni fourchette forcée.
5. Alerte non choisie → grille de base seule ; taux hors plafond sourcé → refus.
6. Valeur négative, unité k€ versus €, nombre ambigu → refus ou conversion explicitement confirmée, pas coercition.
7. Budget différent de la fourchette → deux valeurs distinctes ; aucune conclusion automatique de conformité.
8. JSON de reprise, CSV sécurisé, version de grille dans rapport ; aucun appel réseau/stockage de données à l'usage.

## Design, maillage et livraison
Scène propre : base décomposée, tranche et colonne budget distincte ; fourchette générée seulement quand la source est fixée. Entrants hub (« Calculer le barème d'heures CAC »), pilier CAC, /blog/cac-bareme-budget-realise ; alternatives /methode et /garanties avec passages précis sur calcul traçable et absence de tarif universel. Sortants source officielle, hub ; article quand publié. J+7/J+28 sans montant de mission collecté.
Revue unique metier, car règle juridique au cœur du résultat, à la place de QA ; inclure tests techniques dev et captures dans sa transmission. La publication attend ce PASS et la CI, pas une deuxième revue. Grille complète actuelle et cas limites = fini indispensable ; aucun chiffre de la note initiale livré sans vérification.
