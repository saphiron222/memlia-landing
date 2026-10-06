# 02 — Seuil de signification et planification documentés

## Décision produit et intention
Signataire/chef de mission voulant calculer des paramètres qu'il a choisis et en garder la justification. Catégorie calculer ; route /outils-comptables-gratuits/seuil-signification-audit ; primaire « seuil de signification audit calcul », 2 suggestions C2, planification 5 sur son amorce voisine. C1 V008–V010 ; priorité 94. Pas un calculateur des seuils légaux de nomination. Contrat commun OUTILS-CAC-CADRAGE.md applicable.

## Contrat exécutable
Saisie de base nommée et montant en euros, période, source/référence de la base, pourcentage choisi sans valeur par défaut, justification libre. Signification = base positive × taux /100, décimaux exacts arrondis au centime seulement en restitution (convention affichée). Bases possibles saisies par utilisateur, aucune recommandation pour association/holding. Base nulle/négative ou taux absent → pas de résultat conseillé ; inviter à choisir une base exploitable, pas appliquer valeur absolue silencieuse. Taux doit être >0 et ≤100, cette borne est validation arithmétique et non fourchette métier.
Planification facultative : montant choisi directement ou taux choisi appliqué au seuil de signification, mode explicite. Montant de planification > seuil de signification → incohérence à résoudre avant export final ; pas de ratio normatif proposé. Plusieurs scénarios comparables, choix retenu explicite, autres scénarios identifiés non retenus. Pas de conclusion « seuil adapté » ni avis d'audit. Champs de justification et références séparés des nombres calculés, conservés si calcul actualisé ; mention de changement des entrées depuis validation.
Exports CSV de scénarios, JSON de reprise, fiche imprimable base/taux/calcul/mode planification/scénario retenu/justification/version. Calcul exploratoire possible sans justification ; export pour dossier porte un état brouillon si justification ou choix absent, jamais validé implicitement.

## SEO et corps statique
H1/OG : « Seuil de signification en audit : calcul et justification ».
Title : « Seuil de signification audit : calcul motivé | Memlia ».
Description : « Calculez les seuils de signification et de planification avec vos propres paramètres. Comparez les scénarios et exportez leur justification. »
Plan ~600 mots : réponse et distinction nomination/signification (80), base et taux choisis (100), scénarios (100), planification (100), cas fictif et export (120), limites/FAQ/sources (100). Termes : seuil de planification, base, justification, scénario, caractère significatif. Pas de pourcentage forcé dans les titres.
Source officielle à rouvrir NEP320 en vigueur via référentiel H2A ; la page CNCC /docs/nep-320 peut être une archive, suivre son remplacement. Aucune grille de taux déduite d'un blog. C2 décrit des contenus étudiants et documentation Caseware géographiquement limitée : aucune supériorité à un moteur testé revendiquée. Gain : calcul exact avec justification/reprise, pas « taux de marché ».

## Frontière
Se prépare seul : calculs et comparaison sur paramètres. Attend validation : base, taux, scénario retenu, justification. Reste humain : appréciation du caractère significatif et de l'adéquation des seuils. Vers service revue analytique seulement si route publiée, puis CTA /contact.

## Cas d'acceptation dev
1. Base fictive 1 000 000 et taux saisi 1 → 10 000 ; planification au taux saisi 70 du seuil → 7 000 ; ces taux sont uniquement des données de test.
2. Taux vide → aucun taux rempli par outil ni export final implicitement approuvé.
3. Base 0 ou -100 → refus expliqué, pas résultat zéro/positif par coercition.
4. Base 1 234,56 à taux 1,25 → résultat 15,43 avec arrondi explicite ; pas montant flottant parasite.
5. Planification saisie 11 000 pour signification 10 000 → incohérence visible et export final arrêté.
6. Deux scénarios, aucun retenu → document brouillon ; choix utilisateur → résultat retenu distinct.
7. Changer base après commentaire → commentaire préservé et validation à reprendre, pas effacement.
8. JSON de reprise → bases/scénarios/commentaires/états identiques ; CSV sécurisé, réseau et stockage testés.

## Design, maillage et mesure
Scène HTML propre : deux scénarios fictifs, paramètres saisis et commentaire séparé des calculs ; ne pas montrer un taux recommandé. Entrants hub (« Calculer et documenter les seuils d'audit »), pilier CAC, /blog/cac-seuil-signification-justification ; alternatives disponibles /methode et /garanties avec passage précis sur calcul à paramètres humains. Sortants hub et sources ; glossaire#seuil-planification-audit seulement si ancre présente. J+7/J+28 usage/reprise/export et demande qualifiée sans paramètres collectés. QA indépendante unique sur produit borné, aucune interprétation juridique nouvelle.
