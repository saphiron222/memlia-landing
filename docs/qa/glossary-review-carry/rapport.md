# Report de la campagne métier lors du rescellement

Carte : t_4011e030. Validation locale : 4 octobre 2026.

## Cause et correction

`seal-resource-surfaces.mjs` reconstruisait le manifeste depuis un fixture, reportait
`businessReview` mais réinitialisait `sensitiveMatter.checkedAt` au 16 septembre.
Les deux verdicts du 4 octobre devenaient artificiellement postérieurs à leur campagne.
Le report est isolé dans `scripts/lib/resource-review-carry.mjs` et conserve maintenant
la date du manifeste précédent, sans la déduire des verdicts ni de l'heure d'exécution.
Les statuts, verdicts, anciennes empreintes et défauts P0/P1/blocage sont inchangés.
Une revue absente/PENDING n'est pas promue ; une date manquante n'est pas inventée.

## Exécutions

- Deux tests de contrat ajoutés dans `tests/scripts/resource-review-carry.test.mjs`.
  Avec le report historique extrait sans correction : 0 PASS, 2 FAIL, dont
  `2026-09-16T21:09:13+01:00` au lieu de la campagne du 4 octobre.
  Après correction : 2 PASS ; avec la suite resource-pipeline : 38 PASS, 0 FAIL.
- Scellement réel exécuté avec les sources et le manifeste de main : code 0,
  campagne avant/après `2026-10-04T02:49:45.632Z`, bloc sensible et défauts identiques.
  Audit après scellement : aucun défaut de chronologie, mais FAIL attendu car la revue
  reste attachée à l'ancien candidat. Le seul motif est « La revue IA ne correspond
  pas au candidat exact ». Le garde de réaffirmation n'est donc pas contourné.
  Les quatre fichiers générés ont ensuite été restaurés aux octets précédents ;
  aucun manifeste ni preuve métier n'est livré par ce correctif.
- `npm run build` : code 0, y compris l'audit Ressources QA et les tests Node.
- `npm run check` : code 0, 333 fichiers, 0 erreur, 0 warning, 8 hints.
- Premier lancement de la suite resource-pipeline avant build : un échec car
  `dist/glossaire.html` n'existait pas encore ; rejeu après build : 38 PASS.

## Limites de livraison

Une seule revue QA technique est requise sur la PR du correctif. Aucun contenu public
n'est modifié et aucune nouvelle revue métier n'est accordée. Le rescellement ne fait
pas la réaffirmation : cette étape reste explicite et soumise à ses contrôles.
La CI `Repository gates` doit passer avant intégration. Aucune fusion ni preuve de
production n'est revendiquée dans cette phase d'implémentation.
