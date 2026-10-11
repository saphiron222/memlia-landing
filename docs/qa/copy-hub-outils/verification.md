# Hub outils gratuits — préparation de revue QA

Carte : t_10e46219. Route : /outils-comptables-gratuits.
Base : origin/main 6037f49c (08/10/2026).

## Décision et périmètre

L’usage passe avant la vente. H1, catégories, ordre, descriptions et destinations existantes conservés. Les 16 cartes montrent entrée, résultat et une limite déjà publiée dans le registre ; celle du rapprochement porte sur les opérations non effectuées plutôt que sur le contenu du classeur. Chaque action nomme le résultat accessible. La gratuité sans inscription reste explicite.

Le hub ne promet plus un traitement local uniforme ni un refus de résultat pour tous les cas hors règle. Les descriptions locales propres aux outils sont conservées, avec des parcours réseau/stockage rejoués. Aucun moteur, prompt, gabarit individuel ou texte réglementaire nouveau n’est ajouté.

Le titre de circularisation du hub ne promet plus un classeur Excel : la carte annonce lettres, CSV et JSON, réellement obtenus dans le test de campagne. Le titre individuel reste hors périmètre. Le JSON-LD ItemList reprend le titre visible de la carte.

AppelFinal canonique réutilisé après les 16 outils : règle écrite, prise en charge entière dans les outils existants, décision au cabinet ; « Confier une première tâche » vers /contact. CSS, preuves visuelles, canonical et maillage inchangés. Les empreintes des pages changent aussi avec le bundle CSS partagé du composant ajouté ; données dérivées régénérées, fond du glossaire inchangé.

## Exécution réelle

- npm ci : PASS.
- npm run regen:generated : PASS après le dernier changement.
- npm run build : PASS (build-final.log). Un premier refus demandait que la description commence par « Des outils gratuits » ; reformulation à sens inchangé, contrôle intact.
- Python test_positioning.py : 8 PASS.
- Playwright outils.spec.ts + positioning.spec.ts : 26 PASS.
- Suites charte IA, pseudonymisation, prompt IA, prompt comptable, vérificateur de prompt, ROI, bibliothèque, maturité, tools-d : 126 PASS et 1 timeout sans JS. Reprise ciblée bibliothèque sans JS : 1 PASS en 3 secondes (timeout augmenté à 60 secondes, aucune modification produit).
- Suites barème CAC, signification, circularisation, FEC : 38 PASS. Calculs, refus, lettres, rapports, copies et exports réellement exercés.
- Après le changement du titre circularisation : hub et six largeurs 320/375/768/1024/1440/1920 : 7 PASS.
- Captures pleines pages 375 et 1440, comparaison avant/candidat : pas de troncature ni de débordement constaté ; catégories et langage visuel conservés, appel final placé après les outils.
- git diff --check : PASS.

## Base et suivi

Base fonctionnelle relevée sur memlia.fr le 08/10/2026 : 16 outils ; H1 identique ; pas d’appel final dédié ; pas de débordement à 375 et 1440. Le candidat conserve les 16 destinations et rend visibles limites et actions spécifiques. Le relevé et les quatre captures sont joints à la carte.

Aucune base de trafic, d’usage ou de conversion n’a été extraite ici ; aucune hausse n’est revendiquée. Le rang H2 reste une hypothèse qualitative.

Après PASS unique QA, intégrer/publier via dev en conservant ce verdict ; vérifier CI et HTML réellement servi (actions, limites, liens, canonical et résultats de parcours), puis consigner la date effective. J+7 et J+28 doivent partir de cette date de publication, pas de la préparation : relever impressions/clics Search Console du hub, accès outil et résultats/export lorsque la mesure H3 permet un relevé fiable, demandes qualifiées attribuables seulement avec preuve. À défaut d’accès, noter « non disponible », pas zéro. Ces suivis sont à organiser dans la carte de publication après PASS, pour éviter une date fictive.

## Hotspots

src/data/pages-lastmod.json et sceaux dérivés du glossaire : en cas de conflit, reprendre main puis npm run regen:generated ; pas de fusion manuelle des empreintes ni seconde revue de fond.
