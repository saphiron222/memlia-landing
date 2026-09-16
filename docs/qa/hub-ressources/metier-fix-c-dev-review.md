# Revue technique du candidat Ressources v3

Carte `t_8f07fd85`. 16 septembre 2026. Branche `site/ressources-r3`, base `main` au commit `de3d821`.

**Verdict : candidat techniquement propre, MAIS la grille qualité affirme ses résultats au lieu de les mesurer.** Le candidat ne peut pas publier sans la revue métier, et c'est heureux : c'est la seule chose qui l'en empêche.

## Point contractuel tranché

L'adoption avait signalé une contradiction : les deux manifestes déclarent un score de 100 alors que six critères sur sept totalisent 85 points bruts, et que la règle écrite disait « somme sans redistribution ND ».

**Ce n'est pas le calcul qui était faux, c'est son libellé.** Le validateur implémente une normalisation délibérée et gardée par deux conditions : l'adaptateur doit être H ou T, et la recherche SERP doit être explicitement déclarée non décisive avec un résultat ND. Dans ce cas, et seulement dans ce cas, le score est normalisé sur les points réellement mesurables. Une garde supplémentaire interdit d'attribuer le moindre point à un critère SERP déclaré ND.

Les deux manifestes remplissent bien ces conditions : adaptateur H, `requiredDecision` à faux, `gateResult` à ND, avec un motif documenté — le SERP bureau du Hub était indisponible après deux tentatives.

**Correction appliquée :** la règle décrit désormais le calcul réellement exécuté, nomme la condition qui déclenche la normalisation, et dit explicitement que le brut est de 85 sur 100. Le 100 ne peut plus être lu comme cent points acquis.

Le schéma du manifeste est fermé et ne permet pas d'ajouter un champ de score brut à côté du score normalisé. **Recommandation pour une future révision du contrat :** ajouter `rawScore` et `measurableWeight`, pour qu'un lecteur n'ait pas à déduire le brut de la prose de la règle.

## Constat principal — la grille n'est pas mesurée

`scripts/seal-resource-surfaces.mjs` construit la grille ainsi : chaque critère reçoit `PASS`, sauf celui du SERP qui reçoit `ND`. Il n'existe aucun chemin par lequel un critère puisse recevoir `FAIL`. La même chose vaut pour les cinq premières portes, forcées à `PASS`.

L'observation attachée à chaque ligne est honnête sur sa base : « contrôle déterministe du candidat v3 rejoué avec `npm run build:site` ». Mais un build qui passe n'établit pas la satisfaction d'une intention de recherche, la qualité des sources au regard de l'expérience et de l'autorité, le gain d'information, la citabilité par une IA ni la conversion contextuelle. Cinq des six critères déclarés `PASS` sont des jugements éditoriaux qu'aucune commande ne peut rendre.

**Conséquence :** le score qualité ne peut structurellement pas descendre. Pris isolément, c'est un vert qui ne prouve rien.

**Ce qui empêche malgré tout une publication abusive :** la porte de publication exige en plus un bloc `businessReview` portant un verdict explicite. Il est absent, et les 59 diagnostics du build le disent. Le candidat est donc bloqué par le bon mécanisme, pas par le score.

**Tâche transmise à la revue métier `t_e9292ec4` :** établir sur preuve chacun des six critères déclarés `PASS`, et ne pas hériter de leur valeur actuelle. Un critère qu'elle ne peut pas établir doit passer ND ou FAIL, pas rester PASS par défaut.

## Corrections mécaniques appliquées

**Le score était écrit en dur.** `seal-resource-surfaces.mjs` assignait `recalculatedScore = 100` comme constante, sans regarder la grille qu'il venait pourtant d'écrire. Une constante ne peut pas rougir. Le score est désormais calculé depuis la grille, avec la même formule que le validateur.

Témoin de la correction, sur la formule isolée : la grille réelle rend 100 ; un `FAIL` sur les sources donnerait 76 ; un `FAIL` sur le SEO technique donnerait 88. Les deux sont sous le seuil de 90. La formule calcule donc réellement — ce qui ne change rien au fait que ses entrées, elles, restent affirmées.

## Défaut signalé, non corrigé

`seal-resource-surfaces.mjs` réécrit aussi `p0 = []`, `p1 = []` et `blocking = false` sans condition. Aujourd'hui c'est sans conséquence, ces listes étant vides. Mais un rescellement joué après une revue métier ayant relevé des P1 les effacerait en silence. Le correctif tient en une ligne — ne réinitialiser que si aucune revue n'a rien inscrit — mais il touche la sémantique du scellement et revient à la carte qui en est propriétaire.

Signalé également, sans correction : `editorial/legacy-baseline.json` conserve pour les deux premiers articles des empreintes antérieures à leur migration. Ces entrées ne sont plus atteintes.

## Vérifications

| Contrôle | Résultat |
|---|---|
| `npm run check` | 112 fichiers, 0 erreur |
| Suite Python | 63 / 63 |
| Suite Node | 133 / 133 |
| `npm run build` | code 1, exactement 59 diagnostics, tous la revue métier absente |
| `npx playwright test` | 98 / 98 |
| `effectiveDate` contractuel | absent des manifestes et du candidat |
| Articles publiés | trois, byte-identiques à l'autorité `de3d821` |
| Écran `/ressources` et `/glossaire` | 375 et 1440, un seul `h1`, aucun débordement |

## Ce que cette revue ne fait pas

Elle ne rend aucun verdict métier et ne fabrique aucun `AI_REVIEW_PASS`. Elle ne juge pas le fond paie et social. Elle n'autorise ni preview, ni publication, ni push.
