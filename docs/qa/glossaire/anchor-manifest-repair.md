# Raccordement du manifeste après correction du filtre — 8 octobre 2026

Carte plateforme : t_c9b017cd. Candidat : PR203, branche fix/glossary-filter-anchor-current. La revue QA unique et la recette production appartiennent à t_200d4451 ; cette réparation ne les remplace pas.

## Cause et mesure réelle

Le run 37808979220 échoue dans le test « la QA du candidat courant ne réclame ni preview, ni GO, ni release » : le HTML référence le nouvel actif du filtre, mais le manifeste décrit encore l'ancien rendu. Les 160 preuves précédentes passent ; les tests navigateur ne démarrent pas.

Une collecte temporaire dans le job navigateur part 1 du run 37811786796 a livré l'artefact glossary-render (11566220960), produit sur b02e13f6ded21831646d83a4570acf7535f187c7. Il contient le vrai dist/glossaire.html : 320926 octets, SHA-256 bcf1f91808af919eeb0e4ba248fd42062089ea430ba51f2570adc393fb1b8afd. La collecte est retirée du candidat final. Aucun build complet n'a été lancé sur le Mac.

Pendant cette collecte, PR164 a intégré main 37c76542 et modifié le chrome partagé. GitHub a suspendu la CI de PR203 à cause des conflits de fichiers générés. Main a été intégré sans écrasement du produit ; une seconde collecte courte a produit le rendu combiné : run 37814005906, job 113437820512 SUCCESS, artefact integrated-glossary-render 11566551469, candidat f9741a4e3e391332c2015370e8527ac6409d5237. Le HTML final mesure 321115 octets, SHA-256 8d7824194d59d429a6a4688ea336f362ba41b820eb504d81860f84a47f0c592e. Le registre lastmod conserve toutes les surfaces de main et actualise seulement /glossaire. Les deux collectes temporaires sont retirées.

Le reçu anchor-ci-render-receipt.json conserve cette seconde provenance et les dates du step qui exécute les deux commandes avec sortie zéro. Son PASS concerne uniquement le rendu et le retrait des briefs ; il ne préjuge pas du verdict Repository gates final.

## Correction et garde-fous

Seuls le raccordement au HTML, son reçu, les empreintes dérivées du candidat et les projections machine ont été actualisés. Le mécanisme existant scripts/reaffirm-resource-review.mjs a revérifié la présence des affirmations rendues et l'intégrité des copies officielles avant de reporter la revue ; aucune nouvelle appréciation métier.

Comparaison exécutable avant/après avec main intégré : toute la matière claimsEvidence hors liens techniques de revue est identique, les 27 verdicts et leurs dates sont identiques, sourceBundle/assetBundle/configBundle sont identiques. src/pages/glossaire.astro et src/data/glossary.ts sont inchangés depuis a55805e8 ; le workflow est identique à main.

Test ciblé reproduit rouge sur le HTML téléchargé, puis vert après raccordement. Suite resource-pipeline.test.mjs : 36 tests PASS, zéro FAIL. resource:audit:qa : PASS, une surface découverte et reliée, aucune erreur. Les références historiques de revue et l'ancre de matière sont conservées.

## Livraison

Le verdict Repository gates du candidat final est consigné sur la carte avec son run. Pas de fusion ni de déploiement par cette carte : t_200d4451 reprend la revue QA unique et la vérification production après réception du résultat.
