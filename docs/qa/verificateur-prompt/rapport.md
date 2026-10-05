# Vérificateur de prompt IA — livraison d’implémentation

Résultat : une consigne existante devient cinq constats expliqués, sans score ni modèle. Schéma 1 partagé avec le moteur 01 ; celui-ci garde son assemblage et son contrôle strict inchangés.

## Décisions et limites
Heuristiques françaises par phrase, conservatrices devant négations et mentions ambiguës. « Détecté » est un signal textuel, pas une compréhension ni une garantie. La suggestion ajoute des pistes à compléter ; elle ne réécrit pas le sens. Original analysé immuable, proposition éditable ; confirmation avant remplacement, modification de saisie invalide copie/rapport sans effacement. Export UTF-8 avec les deux versions, choix humain, constats de l’original et cas d’essai. Refus : absence de confirmation, vide, >10 000 caractères, coordonnées/identifiants explicites ; pas anonymisation universelle. Proposition contrôlée jusqu’à 15 000 caractères avant copie/export, sans tronquer sa fin.

## Preuves exécutées
- Tests écrits avant moteur : échec module absent ; ajout des négations « ne relit rien » : échec observé puis correction.
- 7 tests moteur 07 et 4 tests du moteur 01 : PASS.
- npm run check : 0 erreur, 0 avertissement, huit hints préexistants.
- npm run build : PASS, 130 tests Python et 658 tests scripts ; audit Ressources PASS. Scellement/reaffirmation du glossaire dus au footer généré, aucune nouvelle revue ni modification métier.
- Chromium : 20 parcours 01/07 PASS ; 10 parcours 07 rejoués après correction finale, PASS. Six largeurs 320/375/768/1024/1440/1920, zéro débordement, cibles >=44 px ; copies des deux versions et rapport exact, refus, édition, annulation, injection rendue texte et repli presse-papiers.
- Après chargement : aucun réseau pendant saisie/analyse/copie/export ; localStorage/sessionStorage/IndexedDB/cookies vides dans le contexte du test.
- node scripts/audit-verificateur-prompt.mjs : PASS (DOM, H1, canonical, schema WebPage/WebApplication/BreadcrumbList, sitemap, médias et destinations, trois entrants).
- Lighthouse 13.4.1 local : mobile 99/100/100/100, desktop 100/100/100/100. Collecteur robots HTTP hors document documenté, audit natif inchangé. Aucune mesure publique revendiquée.
- Scène dédiée HTML/CSS/contrat : 1600×900, 47 Ko ; OG 1200×630, renderer --adopt puis --check PASS. Validation visuelle de la scène et captures mobile/desktop ; capture mobile refaite depuis scroll top pour retirer l’artefact de header fixe.

## SEO/Blog et maillage
Colonne 07 des 64 compétences reprise dans matrice-livraison-07.json : contrats applicables exécutés de manière ciblée, N/A conservés motivés, instruments locaux alternatifs nommés ; mesures externes ND. Intention primaire « vérificateur prompt ia » distincte de fabrication 01/06 et méthode blog ; pas nouvelle page de filtre ni Article/BlogPosting fictif. Hub/footer générés, lien contextuel depuis 01. Le générateur générique 06 n’est pas public dans la base : troisième entrant remplacé explicitement par /methode, passage « consigne déjà écrite ». Le retour fonctionnel vers 01 ouvre son catalogue public sans transférer de texte ; zéro stockage temporaire inventé. Un préremplissage libre vers 06 attend sa livraison : aucun href vers 404.

## Reprise QA/publication
Une revue QA indépendante à effectuer avant intégration. Rejouer tests et audit sur le candidat ; puis CI verte, fusion, Cloudflare réussi, GET sans query et sans cache, scénarios sur domaine/déploiement, liens entrants/sitemap/hub/footer et médias. Consigner URL publique, déploiement et rapport ; production et indexation ND à ce stade. Mesures J+7/J+28 : clics, impressions, indexation, conversions et citations ND tant qu’aucun instrument ne les a observés.

Retour arrière : PR de revert de la livraison, puis déploiement Cloudflare précédent. Aucun rollback exécuté.

Dette existante : npm ci signale 3 vulnérabilités (1 moderate, 2 high), hors mandat ; PR66 existante dédiée.
