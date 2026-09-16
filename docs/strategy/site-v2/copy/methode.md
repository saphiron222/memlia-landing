# `/methode` — copy

**Title** : Comment se déroule une mission Memlia | Méthode
**Description** : Observer le geste réel, écrire la règle dans vos mots, éprouver sur des cas qui doivent échouer, livrer après recette. Les quatre étapes d'une automatisation vérifiable.
**OG alt** : Quatre étapes se succèdent, de l'observation du geste à la validation par le cabinet.

## Hero

**H1** : On commence par observer. On livre après vérification.

De la tâche répétitive au résultat préparé, chaque étape nomme ses règles et ses limites. Les cas qui doivent s'arrêter sont testés autant que ceux qui doivent aboutir.

Action principale : **Décrire votre tâche** → `/contact`
Action secondaire : **Examiner les garanties** → `/garanties`

## Étape 1 — Observer

Nous regardons le geste tel qu'il se fait, pas tel qu'il devrait se faire.

Quels fichiers arrivent, dans quel ordre, avec quelles irrégularités. Où la personne hésite. Ce qu'elle vérifie machinalement sans l'avoir jamais écrit. Combien de fois par mois le cas « normal » n'est pas le cas normal.

Cette étape produit une description du travail réel. Elle dure ce qu'elle doit durer : une tâche mal observée donne une automatisation qui marche en démonstration et échoue au premier dossier atypique.

## Étape 2 — Cadrer

Nous écrivons la règle avec vous, dans le vocabulaire du cabinet.

Ce document dit trois choses : ce qui doit se produire, ce qui constitue une exception, et ce qui doit faire arrêter le traitement. Il fixe aussi le périmètre — ce que l'automatisation touche, et ce qu'elle ne touchera jamais.

C'est ici que la plupart des projets se jouent. Une règle qu'on ne sait pas énoncer ne s'automatise pas : elle se discute d'abord. Si le cadrage révèle que la tâche n'est pas automatisable en l'état, nous le disons à ce moment, pas après le développement.

## Étape 3 — Éprouver

Nous construisons un jeu d'essai **entièrement fictif**, qui ressemble à vos fichiers sans en être.

Il contient les cas qui doivent aboutir, et surtout ceux qui doivent échouer : la donnée manquante, l'exception non prévue, le format inattendu, le mois de reprise. Pour chacun, nous vérifions que l'automatisation fait ce qu'elle doit — y compris s'arrêter.

**Un refus attendu qui ne se produit pas est un défaut**, au même titre qu'un résultat faux. C'est la raison pour laquelle nous testons les échecs autant que les succès.

Aucune donnée réelle de votre cabinet n'entre dans cette étape.

## Étape 4 — Faire valider

La recette se joue chez vous, sur vos fichiers, avec les personnes qui feront le travail.

Nous passons les cas convenus, ceux qui aboutissent et ceux qui s'arrêtent. Le résultat n'est accepté que si la personne qui utilisera l'automatisation confirme qu'elle lit ce qu'elle attend.

Ensuite seulement la mission est livrée, avec son périmètre écrit et ses conditions de maintenance.

## Ce que cette méthode coûte, et ce qu'elle évite

Elle est plus lente qu'une démonstration. Le cadrage prend du temps, le jeu d'essai aussi, et nous préférons dire non au cadrage plutôt qu'après.

Elle évite la situation inverse : une automatisation livrée vite, qui produit des résultats plausibles, et dont personne ne sait dire quand elle se trompe. Cette situation-là coûte plus cher que le geste manuel, parce qu'elle oblige à tout revérifier.

## Ce qui vient ensuite

**Décrire votre tâche** → `/contact`

Pour savoir ce que le service livre concrètement : [l'automatisation sur mesure](/automatisation-cabinet-comptable).
Pour savoir ce que nous refusons : [les garanties](/garanties).
Pour savoir qui porte ce travail : [à propos](/a-propos).
