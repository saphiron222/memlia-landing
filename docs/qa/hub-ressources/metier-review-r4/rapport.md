# Revue métier IA R4 — Hub Ressources et Glossaire

16 septembre 2026. Revue du candidat corrigé, après le FAIL de la revue R3 et la fermeture de son unique défaut.

**VERDICT : AI_REVIEW_PASS, avec deux réserves inscrites.**

Le reviewer est un agent, pas un professionnel diplômé de la paie ou du droit social. Ce verdict établit que chaque affirmation sensible est tracée jusqu'à une source primaire relue le jour même. Il ne vaut pas attestation juridique, et le contenu reste publié comme non attesté.

## Ce que ce verdict couvre exactement

Le contrat exige `AI_REVIEW_PASS` pour la **matière sensible**, c'est-à-dire les affirmations de paie, de DSN et de droit qu'un cabinet pourrait prendre pour argent comptant. C'est cette dimension que le verdict tranche, et elle seule.

| Condition du contrat | État |
|---|---|
| Aucun défaut P0 | 0 |
| Aucun défaut P1 | 0, après fermeture de P1-R3-01 |
| Aucune affirmation sensible en portée ND | 0 ; les 25 sont soutenues |
| Score qualité au-dessus du seuil | 100 normalisé, seuil 90 |
| Build et gates requis | verts hors ce bloc, dont l'absence produit les 59 diagnostics restants |

## Fermeture de P1-R3-01

La revue R3 avait relevé qu'entre le 14 et le 16 septembre, la CNIL avait remplacé « Sauf exception (par exemple, lorsqu'un dispositif de contrôle est imposé par la loi) » par « Pour être licite (c'est-à-dire autorisé par la loi) », cessant de concéder une exception aux tests de justification et de proportionnalité. Le résumé du Hub gardait « Sauf exception légale ».

Vérifications après correction :

- le résumé dit désormais « Pour être licite, un dispositif de contrôle de l'activité du personnel doit être justifié et proportionné » ;
- la chaîne « Sauf exception » n'apparaît plus ni dans la source de la surface, ni dans la page rendue ;
- les trois citations d'autorité de cette source sont présentes mot pour mot dans la page CNIL du 16 septembre ;
- l'instantané est rescellé sur cette page, avec une note qui date le changement et conserve l'ancienne formulation pour mémoire ;
- les deux autres affirmations de ce résumé, sur l'information préalable des personnes et sur la consultation du CSE, sont inchangées et toujours soutenues.

## Les 25 affirmations sensibles

Toutes soutenues par leur source primaire, rouverte le 16 septembre. Neuf sources externes, toutes officielles de premier niveau, toutes en HTTP 200. Vingt-six des vingt-huit passages cités sont retrouvés mot pour mot ; le vingt-septième est l'écart corrigé ci-dessus, et le vingt-huitième était un artefact d'aplatissement de liste sans conséquence sur le sens, documenté dans le rapport R3.

## Réserve n° 1 — la grille qualité est affirmée, pas mesurée

La revue technique a établi que le script de scellement écrit `PASS` pour les six critères non-SERP sans qu'aucun chemin mène à `FAIL`. Le score de 100 traduit donc « le build est passé », pas sept évaluations distinctes.

Cette revue ne conteste pas les cinq critères techniquement vérifiables. Elle conteste `information-gain-proof` : établir un gain d'information demande de comparer à ce qui existe déjà, et aucune comparaison n'a été produite. **Ce critère n'est pas établi.**

Il ne s'agit pas d'un défaut de la matière sensible, et cette réserve ne retient donc pas le verdict. Elle est inscrite pour que personne ne lise le 100 comme un score éditorial mesuré.

## Réserve n° 2 — le SERP reste non déterminé

Aucune donnée fournisseur n'est disponible. Le critère `serp-format-rankability`, qui pèse quinze points, reste non déterminé, et la normalisation du score sur les points mesurables est la règle documentée du contrat. Le brut acquis est de 85 sur 100.

## Ce que cette revue n'a pas fait

Aucune attestation par un professionnel de la paie ou du droit social. Aucune nouvelle collecte au-delà de la relecture des neuf sources. Aucun push, preview ni publication : le scellement et la release appartiennent aux cartes suivantes.
