# Raccordement du manifeste après correction du filtre — 8 octobre 2026

Carte plateforme : t_c9b017cd. Candidat : PR203, branche fix/glossary-filter-anchor-current. La revue QA unique et la recette production appartiennent à t_200d4451 ; cette réparation ne les remplace pas.

## Cause et mesure réelle

Le run 37808979220 échoue dans le test « la QA du candidat courant ne réclame ni preview, ni GO, ni release » : le HTML référence le nouvel actif du filtre, mais le manifeste décrit encore l'ancien rendu. Les 160 preuves précédentes passent ; les tests navigateur ne démarrent pas.

Une collecte temporaire dans le job navigateur part 1 du run 37811786796 a livré l'artefact glossary-render (11566220960), produit sur b02e13f6ded21831646d83a4570acf7535f187c7. Il contient le vrai dist/glossaire.html : 320926 octets, SHA-256 bcf1f91808af919eeb0e4ba248fd42062089ea430ba51f2570adc393fb1b8afd. La collecte est retirée du candidat final. Aucun build complet n'a été lancé sur le Mac.

Le reçu anchor-ci-render-receipt.json conserve la provenance et explique les bornes temporelles observées dans le journal. Son PASS concerne uniquement le rendu et le retrait des briefs : le run de collecte a échoué plus tard sur le manifeste encore périmé, et ne constitue pas une CI verte.

## Correction et garde-fous

Seuls le raccordement au HTML, son reçu, les empreintes dérivées du candidat et les projections machine ont été actualisés. Le mécanisme existant scripts/reaffirm-resource-review.mjs a revérifié la présence des affirmations rendues et l'intégrité des copies officielles avant de reporter la revue ; aucune nouvelle appréciation métier.

Comparaison exécutable avant/après avec a55805e8 : toute la matière claimsEvidence hors liens techniques de revue est identique, les 27 verdicts et leurs dates sont identiques, sourceBundle/assetBundle/configBundle sont identiques. src/pages/glossaire.astro, src/data/glossary.ts et le workflow sont inchangés par cette réparation.

Test ciblé reproduit rouge sur le HTML téléchargé, puis vert après raccordement. Suite resource-pipeline.test.mjs : 36 tests PASS, zéro FAIL. resource:audit:qa : PASS, une surface découverte et reliée, aucune erreur. Les références historiques de revue et l'ancre de matière sont conservées.

## Livraison

Le verdict Repository gates du candidat final est consigné sur la carte avec son run. Pas de fusion ni de déploiement par cette carte : t_200d4451 reprend la revue QA unique et la vérification production après réception du résultat.
