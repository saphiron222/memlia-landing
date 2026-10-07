# Recette clavier des tableaux — A11Y-01

Périmètre H1 : les 21 routes de `tests/browser/table-keyboard.routes.json` (5 services et 16 articles), dans Chromium et WebKit à 320, 375 et 1440 pixels.

## Rejouer

Après `npm ci` et `npx playwright install chromium webkit` :

    npx playwright test --config=playwright.tables.config.ts

Pour un serveur déjà construit, fournir `QA_URL`. Pour contrôler le site public après fusion :

    QA_URL=https://memlia.fr npx playwright test --config=playwright.tables.config.ts

Les résultats JSON sont dans `.qa/table-keyboard.json`. Chaque cas conserve une capture `table-focus.png` dans `.qa/table-results`. Les tests Chromium font également partie de `npm run test`, sans retirer de contrôle existant.

Avant toute assertion de focus visible et toute capture, l'oracle attend une intersection d'au moins 24 pixels dans chaque axe avec le viewport, une opacité cumulée des ancêtres d'au moins 0,99, leur visibilité et la stabilisation de la position sur 250 ms. Il utilise uniquement Tab : aucun focus forcé ni CSS de production neutralisé. Deux fixtures négatives (ancêtre transparent et tableau hors viewport) empêchent de valider le seul style calculé du contour. Avant la touche suivante, le parcours observe aussi le viewport et tous les ancêtres défilants sur des frames consécutives : au moins 750 ms d'observation et 350 ms sans mouvement. Cela évite de confondre une cible fixe avec un document stabilisé ; une fixture de scroll natif reproduit ce faux positif. Cette attente s'applique également après Maj+Tab, sans imposer la visibilité d'un lien interne à un tableau défilé ; l'oracle strict reste appliqué à chaque focus du conteneur. Le délai par route est de 180 s. Chaque retour conserve ses coordonnées dans une pièce JSON, et le premier retour une capture `table-return.png`.

## Recette manuelle publique

1. Ouvrir une route de la liste dans Chromium puis Safari, aux trois largeurs.
2. Utiliser uniquement Tab jusqu'au tableau. Le conteneur est annoncé « Tableau N : [titre de section ou légende] » et entouré d'un trait vert foncé de 3 pixels. Pas de clic préalable.
3. Si le tableau dépasse son conteneur, appuyer sur Flèche droite jusqu'à voir la dernière colonne. Flèche gauche permet le retour. Aucune colonne n'est supprimée. À 1440 pixels, un tableau qui tient intégralement n'a pas besoin de défiler.
4. Tab quitte le conteneur ; Maj+Tab y revient. Les liens éventuels à l'intérieur conservent leur propre fonctionnement clavier. Les flèches verticales et les touches avec modificateurs ne sont pas interceptées.
5. Le document entier ne doit pas déborder horizontalement. Le contrôle axe `scrollable-region-focusable` doit rendre zéro violation.

## Choix de rendu

`ScrollableTables.astro` habille les tableaux du corps partagé des services et articles au rendu, y compris les tableaux HTML. Le parseur HTML déjà présent fournit des positions : seuls les conteneurs sont insérés, le contenu HTML intérieur et les contenus éditoriaux scellés restent inchangés. Les tables, en-têtes et cellules conservent leur sémantique native. Le nom vient de la légende ou du dernier titre et inclut un numéro.

Le défilement est porté par le conteneur, pas la table. Le test a montré que le focus seul ne suffit pas dans WebKit : un gestionnaire limité aux deux flèches horizontales sur le conteneur focalisé assure le défilement. Sans JavaScript, le contenu reste entier et le conteneur nommé/focusable ; la garantie des flèches dans WebKit nécessite ce script local.

Les surfaces générées ont été régénérées avec `npm run regen:generated`. Aucune recette, revue de fond ou source d'article n'est modifiée ; les circuits de publication du blog et des services restent en place.
