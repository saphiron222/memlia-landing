# Lot CAC 1 — reprise D1–D3

Livraison d’auteur de t_79f71254 pour le réexamen limité sur t_ada6a80c. Ce paquet remplace le candidat de t_33e01ca3 ; le rapport métier initial reste la référence des défauts, pas une approbation de ce candidat corrigé.

## Résultat

D1 : certification et objet de l’audit séparés, avec L.821-53 et NEP 200 §03 ligne 68.
D2 : supervision H2A et représentation CNCC séparées, sujet explicite de chaque fragment ; distinction comparative conservée comme synthèse éditoriale renvoyant aux deux preuves.
D3 : représentation institutionnelle sourcée ; phrase doctrine/norme conservée comme frontière éditoriale, sans attribution à la page de représentation ni obligation normative autonome.

Les dix entrées publiques, les onze sources, leurs dates et les 53 unités non visées sont strictement identiques au paquet initial. Trois unités sont restreintes et quatre ajoutées : 60 unités au total. Les copies HTML, textes, exports DILA et captures.json sont conservés à l’identique. Aucun verdict métier d’auteur : businessVerdict, businessReviewer et reviewedAt restent nuls.

## Pièces

- docs/strategy/site-v3/glossaire-cac-lot-1.json : candidat corrigé.
- docs/qa/hub-ressources/glossaire-cac-lot-1-sources/ : copies durables et contrôles du lot.
- corrections/SOUS-AFFIRMATIONS.md et .json : table des sept sous-affirmations, statuts et citations.
- corrections/CONTROLES.json et journaux : tests réellement exécutés.
- LIVRAISON.json : contrôle du paquet et de l’archive, livré séparément de celle-ci.
- tests-corrections.py : cinq tests ciblés, citations avec numéros de lignes et comparaison au paquet durable initial.
- replay-controls.py : rejeu de l’échec initial, des contrôles positifs et des trois remutations D1–D3.

Des copies en lecture seule du validateur DILA, de sa fixture, de ses tests et du glossaire courant sont incluses pour rejouer le validateur ; elles ne sont pas des modifications à intégrer au dépôt. Elles proviennent d’origin/main b896a3a37f6a4fbf902d7889fdaf184711d6c573, lu le 11/10. Le candidat conserve sa date réelle de préparation initiale ; aucune copie n’a été redatée.

## Contrôles

Tests D1–D3 : trois échecs constatés sur l’ancien candidat, puis cinq tests verts sur le corrigé. Les trois réintroductions des rattachements partiels sont refusées. Validateur du lot vert sur 10 entrées, 11 sources, 60 unités, 2 liens et les 55 ancres existantes du main courant. Les sept mutations initiales restent refusées. Cinq tests DILA verts et vérification de forme TypeScript ciblée verte. Ce sont des contrôles techniques, pas un verdict de soutien sémantique indépendant.

Le premier essai DILA dans l’archive partielle a signalé sa fixture manquante ; celle-ci a été extraite du même main, puis la suite a été rejouée avec succès. Aucun correctif produit n’était nécessaire.

## Limites inchangées

A4 demeure un dérivé DINUM sans garantie de consolidation à jour ; aucune ouverture Légifrance n’est revendiquée. La collecte DILA du 06/10 conserve sa fenêtre jusqu’au 13/10 inclus ; renouveler par le circuit autorisé après cette date, sans redater. Le texte CNCC est celui extrait par web_extract, pas celui des coquilles JavaScript HTML. SACC reste du vocabulaire et ne rouvre aucune famille en réserve.

Pas de commit, push, manifeste global intégré, build complet ni publication. La revue métier existante décide de la levée de D1–D3 ; aucune nouvelle revue générale n’est demandée. L’intégration groupée doit conserver les unités additionnelles et traduire explicitement leurs statuts locaux, en distinguant text (sous-affirmation) de unitText (champ complet servant d’emplacement). Elle reste responsable de la compatibilité des dates, des contrôles Ressources, de la CI et de la publication.
