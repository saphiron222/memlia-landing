# D1 — intégration de main, 07/10/2026

La revue indépendante PASS `accueil-professions.md` est conservée. Intégration de main e6f31468 sans modification du fond : agrandissements des preuves H3 conservés et calcul dynamique des familles/pôles EC déplacé dans `src/data/accueil/ec.ts`.

Vérification réelle : deux builds Astro séparés (main avant extraction et candidat intégré) produisent un `dist/index.html` strictement identique, SHA-256 `121366773c7a216908e6be6feac0387d556507e0e54cca297a0a01758713572c`. Le témoin HTML est mis à jour depuis le build main indépendant, pas depuis un rendu supposé. Le test multi-instance écarte les scripts partagés imbriqués qu’Astro n’émet qu’une fois.

- Tests accueil : 5 PASS, dont build des onze sections avec contenu injecté.
- Non-régression ajoutée pour compteurs dynamiques et agrandissements : échec observé avant correction, PASS ensuite.
- `npm run regen:generated` : code 0 ; registre à jour et audit Ressources QA PASS.
- `npm run check` : code 0.
- Build complet : code 1, panne indépendante dans `tests/scripts/blog-intent-preservation.test.mjs:17` (fixture matérialisée au jour réel après expiration du relevé). Une reprise ciblée confirme la panne.

La réparation est déjà prise en charge par t_f0ec22d6 / PR152. Ne pas dupliquer son correctif ; récupérer main après sa livraison, régénérer les dérivés, rejouer le build puis obtenir CI verte avant fusion de PR113. Aucune fusion ou publication D1 revendiquée ici.

## Reprise après PR152

Main `819f64614f5dc58e700229362d0d3b5f162b4ec6` intégré sans conflit de sources ; seuls les six dérivés listés au runbook ont été repris depuis main puis régénérés. Les sources de couverture logiciels et les réparations de fixture/popup de main sont conservées.

- `npm run regen:generated`, `npm run build` et `npm run check` : codes 0.
- Tests accueil ciblés : 5 PASS, y compris HTML complet identique au témoin EC et compteurs dynamiques.
- `git diff --check` : code 0.
- Revue indépendante initiale conservée ; aucune modification de copy ni nouvelle route CAC.

La fusion reste conditionnée à la CI verte du candidat poussé ; le constat de production est fourni dans le handoff de livraison.
