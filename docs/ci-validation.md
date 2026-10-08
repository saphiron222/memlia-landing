# Validation des PR sans builds redondants

Le 8 octobre 2026, le workflow courant utilise les runners GitHub publics `ubuntu-latest`, pas `mac-kevin`. Le dépôt est public ; aucune capacité payante ni automatisation supplémentaire n'est ajoutée.

- La concurrence reste limitée au numéro de PR : un push remplace sa validation précédente. Le workflow ne reçoit pas les pushes de main.
- Les événements `opened`, `synchronize`, `reopened` et `ready_for_review` sont pris en charge. En brouillon, tous les jobs sont sautés : GitHub peut créer une entrée skipped, mais aucun runner ne construit ni ne teste le site. La conversion en PR prête déclenche les portes.
- `portes` construit et valide le site une fois, puis partage `dist/` comme artefact `validated-site` du run courant, conservé un jour. Les fichiers cachés sont inclus ; une sortie absente échoue.
- Les deux matrices de quatre parts restent parallèles entre elles, mais attendent désormais cet artefact. Chaque part utilise `PLAYWRIGHT_PREBUILT=1` : Playwright lance seulement Astro preview, sans `build:site`. Les tests de forges qui construisent leurs propres jeux d'essai restent inchangés.
- La QA locale construit toujours par défaut. Pour réutiliser volontairement une sortie déjà construite : `PLAYWRIGHT_PREBUILT=1 npm run test -- <test ciblé>`. Une sortie absente fait échouer le serveur ; aucun ancien serveur n'est réutilisé. `QA_URL` conserve son comportement distant.
- `Repository gates` attend toutes les portes et exige success pour chacune, même en cas d'échec/annulation en amont. Il ne s'exécute pas sur un brouillon.

## Vérification

`node --test tests/scripts/ci-single-build.test.mjs tests/scripts/ci-parallele.test.mjs tests/scripts/ci-budget.test.mjs tests/scripts/playwright-foreground.test.mjs`

Les deux régressions nouvelles échouent avant le correctif (artefact absent, événement ready_for_review absent), puis passent avec import réel de la configuration Playwright. Le test existant conserve la preuve de propriété du processus Astro.

Recette réelle du 8 octobre : PR211 créée en brouillon, run 37837552857 terminé skipped ; quatre jobs skipped, aucun runner assigné et aucune étape exécutée. Le passage ready_for_review, sans push, a déclenché le run 37837581705.

Comparer deux runs complets avant/après avec les dates de début/fin des jobs GitHub : temps mural (début du premier job jusqu'à fin du dernier) et somme des durées des jobs. L'attente de l'artefact peut augmenter le temps mural ; l'objectif de cette modification est d'éliminer huit builds redondants, pas de promettre une accélération non mesurée. Les mesures et les preuves brouillon/annulation sont consignées dans la PR.
