# Images générées : parts de couleurs observées, jamais conformes

## Contrat

La constitution §4 classe les écarts de teinte comme cosmétiques. La forge conserve le brief épinglé et séparable, la mesure RGB au plus proche (tolérance 45), les parts exactes à largeur 320, les objectifs par rôle et les écarts. Pour une image générée avec brief mesurable, `palette.statut` est désormais `OBSERVATION` et `palette.contrat` vaut `observation-image-generee`. Les écarts ne rejoignent plus les erreurs de matérialisation. Ils ne deviennent ni PASS, ni parts corrigées, ni score visuel.

Le régime HTML conserve sa mesure native et sa provenance explicite. Les défauts de brief restent FAIL pour une recette depuis le 19/09 et DETTE pour les recettes antérieures. Aucun contrôle de provenance, intégrité, dimensions, dérivés, alt, variation visuelle, revue indépendante ou P0 n'est retiré. Aucun article, avis métier ni recette de publication n'est modifié.

## Témoin exact

`tests/fixtures/openai-onboarding/image-source.png` est la copie exacte du PNG joint au travail t_67cb2d6a. Son SHA-256, comparé à la source sans la modifier, est `399ca91fd64054e5d940e611915eff4f3dc9a86e763add6bb8dcf302781af59f`. `provenance.json` conserve les informations et le prompt réellement disponibles : fournisseur OpenAI, identifiant natif, date ; modèle non communiqué, crédits inconnus (`null`). Aucun achat ni régénération.

Le scénario Forge utilise ce PNG et sa provenance sur un article de test, avec sources et revue explicitement fictives. Il ne remplace pas la revue métier ni la revue visuelle du candidat réel. Les deux verts restent exactement à zéro dans le master matérialisé et sont archivés comme OBSERVATION. Le crème est aussi sous son objectif : 0.09595486111111111 pour 0.1. La mesure diffère de la pièce jointe initiale parce que celle-ci lisait le PNG source avant normalisation ; ce scénario lit le master de la forge après resize/crop 1920×1080, puis mesure à 320. Aucun résultat n'est substitué. Le rapport `reproduction.json` conserve les valeurs effectives et les empreintes distinctes source/master.

Sans revue, le score reste `null` et le gate refuse. Avec la grille de fixture complète, le vrai gate de preview accepte. Les mutations de provenance (identifiant absent), alt non descriptif, P0 et master uniforme le referment. La suite existante continue de vérifier l'intégrité, les dimensions/dérivés et les critères visuels.

## Régression

Le test de palette modifié a été rouge sur main non corrigé : la matérialisation renvoyait encore le refus du graphite mesuré à zéro. Après correctif, ce scénario devient vert sans perdre le refus d'un brief sans hex. Le témoin exact OpenAI est rejoué par :

    node --test --test-name-pattern='PNG OpenAI réel' tests/scripts/blog-forge.test.mjs

La qualification ciblée et les régressions du scellement PR249 se rejouent par :

    node --test tests/scripts/palette.test.mjs tests/scripts/blog-forge.test.mjs tests/scripts/blog-pipeline.test.mjs tests/scripts/blog-pipeline-hardening.test.mjs tests/scripts/blog-cac-sealing.test.mjs

Sur main intégrant PR248 et PR249 (`21d750ac`), les cinq suites ciblées rendent 126 tests PASS, zéro FAIL et zéro ignoré. `git diff --check` est propre. Main PR248 et PR249 ont été intégrées normalement avant livraison. Une seule revue QA indépendante porte sur le correctif infrastructure ; aucun avis métier supplémentaire n'est requis. La construction complète et les tests navigateur restent à la CI Repository gates. Les publications restent indépendantes et conservent leurs autres portes.
