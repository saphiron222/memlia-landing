# Stabilisation des polices et de l’index — PERF-01

Périmètre : `/glossaire`, `/integrations/bulletin-de-paie-silae`, `/integrations/saisie-comptable-sage`.

## Cause et correction

Les tokens plaçaient Georgia et les familles système avant les faces à métriques ajustées. Ajouter le fallback après `var(--police-display)` ou `var(--police-corps)` ne suffisait donc pas : le navigateur utilisait déjà un repli non ajusté. Les faces ajustées sont désormais secondes dans les tokens, avant les replis génériques. Fraunces/Hanken, leurs fichiers, préchargements et `font-display: swap` restent inchangés.

Les faces locales sont explicites par graisse/style : Georgia Bold pour les titres, Georgia Italic/Bold Italic pour ne pas synthétiser un gras italique à partir du titre ; Arial normal pour Hanken 400/500 et Arial Bold pour 600. Les largeurs ont été comparées dans Chromium, canvas 100 px, avec le titre et le chapeau du glossaire (italiques : phrase de positionnement). `size-adjust` est le ratio de largeur cible/repli ; les métriques verticales cible (Fraunces 98/26, Hanken 100/30 à 100 px) sont divisées par ce ratio, sans interligne ajouté. Ces ajustements limitent les écarts : ils ne rendent pas toutes les largeurs de glyphes identiques.

La recherche cachée du glossaire conserve sa grille avant activation JavaScript. Elle est invisible et non interactive tant que le script n’a pas retiré `hidden`, mais occupe déjà sa place : l’index ne descend plus à l’activation. Sans JS, les définitions et l’index restent utilisables ; l’emplacement de recherche demeure vide.

Hypothèse de plateforme : Georgia/Arial locaux disponibles (banc Chromium macOS, également polices usuelles Windows). Sinon les familles génériques restent disponibles ; les mesures de ce banc ne prouvent pas le CLS sur tous les OS.

Depuis le 08/10/2026, la CI tourne sur Linux (ubuntu-latest). Les sondes de faces locales sont indépendantes du site : quand Georgia/Arial sont disponibles, le repli du site doit se charger ; leur absence est annotée comme diagnostic. Elle n'exempte jamais les douze cas des seuils CLS ≤ 0,1 et déplacement ≤ 2 px. Un mauvais repli doit faire échouer la CI, même sur un OS dépourvu de ces polices. Les huit échecs de PR176 à 320–412 px restent un signal navigateur à traiter séparément de la parallélisation. Le correctif produit Linux/Android appartient à la branche existante `site/replis-polices-linux-android` (PR183), pas à la migration CI ; sa disponibilité ne vaut pas preuve géométrique. Tant que ces contrats restaurés ne passent pas sur Ubuntu, la migration ne peut pas être approuvée ni fusionnée.

La régression unitaire `node --test tests/scripts/font-cls-contract.test.mjs` exécute les vrais callbacks Playwright avec des valeurs injectées : CLS 0,8 ou déplacement 100 px doivent être rejetés avec et sans polices OS ; les limites 0,1 et 2 px restent acceptées. Elle est découverte par `npm run test:scripts` dans la porte de build. Ce banc ne mesure aucune page et ne remplace pas les treize cas Chromium sur Ubuntu dans Repository gates. Les mesures historiques ci-dessous restent celles de leur banc macOS, pas une preuve Linux.

## Régression navigateur

`npx playwright test tests/browser/font-cls.spec.ts`

Treize cas : polices retenues 1,5 s, trois routes à 320/375/412/1440 px, CLS de fenêtre ≤ 0,1, index/chapeau déplacé de ≤ 2 px, absence de débordement horizontal et recherche opérationnelle ; plus activation JS retardée du glossaire. Les captures fallback/finales et les sources de layout-shift sont conservées dans `.qa/`.

Avant correction, la régression géométrique échouait à 320 et 375 px : déplacement de l’index de 32,625 px. Après correction : 13/13 verts. Les neuf captures finales communes à 320/375/1440 sont pixel-identiques avant/après (comparaison des buffers RGB avec sharp).

## Mesures de laboratoire reproductibles

Serveur construit puis `npm run preview -- --host=127.0.0.1 --port=4377`.

`node scripts/measure-font-cls.mjs http://127.0.0.1:4377 .qa/font-cls/after`

Le script lance un Chrome neuf par mesure, trois runs séquentiels par route, Lighthouse 13.4.1 verrouillé par package-lock, profil mobile et paramètres par défaut identiques. Il conserve les rapports entiers, les paramètres, CLS/LCP individuels et les médianes.

| Route | CLS médian avant | après | LCP médian avant (ms) | après (ms) |
|---|---:|---:|---:|---:|
| /glossaire | 0 | 0 | 1654,1452 | 1666,3503 |
| /integrations/bulletin-de-paie-silae | 0 | 0 | 1955,4424 | 1961,7167 |
| /integrations/saisie-comptable-sage | 0 | 0 | 1953,2238 | 1955,1989 |

Le serveur local rapide ne reproduit pas les CLS > 0,1 du relevé public d’origine. Aucun gain Lighthouse local de CLS n’est donc revendiqué : la preuve de correction est la régression à polices retardées, avec composition finale inchangée. Les petites différences LCP ne démontrent pas un effet causal.

Pour les mesures publiques, employer le même script avec `https://memlia.fr` avant/après livraison ; confirmer d’abord que la CSS publique contient les tokens corrigés. Les rapports publics doivent être distingués des rapports locaux. Aucune donnée terrain CrUX, RUM ou INP n’est collectée ici ; aucune reprise du chantier Web Analytics.

Avant livraison, trois runs publics par route ont été collectés avec ce même Lighthouse 13.4.1 : glossaire CLS médian 0,1048776 / LCP 3082,38274 ms ; bulletin Silae CLS 0 / LCP 2955,18104 ms ; saisie Sage CLS 0 / LCP 2165,74777 ms. Le dépassement public du glossaire est donc reproduit, pas ceux des deux intégrations dans cette reprise. Le relevé après livraison relève du passage QA/publication et ne doit pas être déduit de la mesure locale.

Les registres générés sont rafraîchis par `npm run regen:generated` : dates/rendus du sitemap, manifeste du glossaire et réaffirmation de sa revue métier inchangée. Ce rafraîchissement ne constitue pas une nouvelle revue de fond. En cas de conflit sur ces fichiers, régénérer plutôt que fusionner leurs valeurs à la main.
