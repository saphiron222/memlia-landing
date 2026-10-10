# Reprise des conflits avec main — PR159

Le workflow `pull_request` ne démarrait pas parce que la branche était en conflit avec main. Les sept conflits ont été reproduits par une fusion locale, dans une copie isolée de la branche CSV.

## Résolution

- Intégration de main, en conservant ses changements de couverture des logiciels et du renderer guides.
- Conservation de toutes les mesures d’autocomplétion de main ; ajout de la mesure CSV existante et de sa provenance, sans nouvelle mesure ni déplacement des dates historiques.
- Utilisation de main comme base des fichiers générés du glossaire et du registre lastmod, puis `npm run regen:generated` sur le rendu combiné. La revue métier existante est conservée par le mécanisme officiel ; aucune nouvelle revue.
- Aucun changement du produit CSV ni du test réseau corrigé. Les captures régénérées par les tests ne remplacent pas les preuves historiques.

## Vérification locale

- `npm run regen:generated` : succès ; registre de 41 pages à jour, audit ressource QA PASS.
- `node --test tests/scripts/fusion-csv.test.mjs` : 9 tests PASS.
- `npm run check` : 0 erreur, 0 warning, 15 hints.
- `npx playwright test tests/browser/outils.spec.ts tests/browser/fusion-csv.spec.ts` : 35 tests PASS, dont la garde réseau/stockage commune et les six largeurs CSV. Le build préalable exécute aussi 150 tests de preuve, tous PASS.
- `npm run build` : succès, y compris audits et contrôle des fichiers générés.

La CI distante doit être suivie sur le nouveau commit de cette même PR par la carte platform dédiée. Cette reprise n’autorise ni fusion ni publication et ne remplace pas la QA déjà prévue.
