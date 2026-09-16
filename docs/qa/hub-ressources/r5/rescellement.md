# RESSOURCES-FRESHNESS-R5 — rescellement de l'autorité Blog sur la production du 16/09

Carte `t_838d2b17`. Branche `site/ressources-r3`, base `main` au commit `de3d821`.

**PASS mécanique. Revue métier toujours PENDING, aucune publication autorisée par cette carte.**

## Pourquoi ce rescellement

Le candidat Ressources `ab90486` était scellé sur les octets publiés au commit `939464c`. Le 16 septembre, la release de l'article 3 a mis en ligne un troisième article et ajouté un paragraphe de lien contextuel dans l'article sur le contrôle des bulletins. L'autorité enregistrée par le candidat est donc devenue périmée, et ses garde-fous l'ont signalé. Ce n'est pas un défaut du candidat : c'est son mécanisme qui fonctionne.

La doctrine du candidat lui-même tranche le sens de la correction : la production courante est la source de vérité, et l'autorité la suit. Elle ne régresse jamais vers un état antérieur.

## Ce qui a été fait

**Fusion.** Cinq conflits entre la lignée du candidat et celle de `main`, tous résolus en préservant les deux intentions :

| Fichier | Résolution |
|---|---|
| `package.json` | chaîne de build du candidat retenue ; `test:scripts`, ajouté par `main` après l'ancêtre commun, remplace les deux sous-ensembles qu'il subsume ; `test:indexability` conservé |
| `src/layouts/Article.astro`, `src/layouts/Base.astro` | gabarits du candidat retenus : ils supersèdent l'image sociale simple de `main` et apportent le mécanisme de preview |
| `tests/proof/test_build.py` | 9 AVIF et 12 WebP, composition dérivée puis mesurée : trois couvertures en trois largeurs et deux formats, plus une image sociale par article |
| `.claude/tasks/context_session_1.md` | union des deux historiques |

**Conformité de l'article 3.** Le contrat de la collection rend `imageOg` obligatoire pour les articles du pipeline. L'article 3 ne le déclarait pas : sans cela, la validation de contenu échouait. Il le déclare désormais comme ses deux aînés, et son image sociale, déjà produite dans son dossier de preuves, est publiée dans `public/images`.

**Conséquence visible, à ne pas passer sous silence :** son image sociale passe d'un recadrage 1200 × 675 de la couverture à l'image dédiée 1200 × 630. Les trois articles partagent maintenant la même convention. Ce changement d'octets par rapport à ce qui est en ligne doit figurer dans les notes de la release Ressources.

**Réadoption.** Le dépôt fournit `scripts/migrate-published-blog.mjs`, prévu exactement pour cette opération. Les constantes d'autorité ont été re-pointées sur le commit `de3d821c2935c35032f2417379392828f43bf84e`, puis la migration a été rejouée : elle vérifie les octets de chaque article contre l'objet Git du commit d'autorité avant de resceller. Résultat : 121 fichiers scellés pour le premier article, 126 pour le second, preuves héritées toujours datées du 13 septembre, aucune nouvelle collecte réseau, aucune publication autorisée.

Un premier essai de repointage à la main a été abandonné au profit de ce mécanisme : le reçu d'adoption scelle aussi l'inventaire des fichiers du dossier, et une retouche manuelle le fait diverger.

**Article 3 épinglé en article préservé.** L'audit Blog exige un dossier au format `manifest.json` et `skills.json`. L'article 3 a été produit par la chaîne blog antérieure : son dossier existe et a été vérifié, mais il ne suit pas ce format. Il est donc inscrit dans `editorial/legacy-baseline.json`, le mécanisme prévu pour les articles antérieurs au contrat. Cet épinglage ne lui prête aucune preuve qu'il n'a pas : il garantit seulement que toute modification silencieuse serait détectée. Sa migration vers le format du pipeline reste à faire.

**Surfaces rescellées.** Le rendu de `/ressources` a changé avec la fusion. Les manifestes H et T ont été rescellés depuis un build frais par `resource:seal-surfaces`.

**Attendus de test alignés sur la composition réelle.** Le hub liste maintenant quatre entrées : les trois articles publiés et le glossaire. L'article 3 y est entré tout seul, parce que `projectPublicResources` dérive sa fiche de son frontmatter dès qu'il porte une version de pipeline, une tâche et un rôle documenté. Le filtre par rôle rend deux ressources et non trois : le rôle affiché par le hub est un axe de découverte curaté, et `ARTICLE_DISCOVERY` place volontairement le suivi de production sociale sous un autre axe. Ces deux nombres sont nommés dans le test et commentés, plutôt qu'écrits en dur.

## Mesures

| Contrôle | Résultat |
|---|---|
| `npm run check` | 111 fichiers, 0 erreur |
| `python3 -m unittest discover -s tests/proof` | 63 / 63 |
| `node --test tests/scripts/*.test.mjs` | 133 / 133 |
| `npm run blog:audit` | 0 erreur, trois articles, l'article 3 en préservé |
| `npm run build:site` | PASS |
| `npm run build` | code 1, exactement 59 diagnostics, **tous** rattachés à la revue métier absente ; 0 sortie de build, 0 liaison, 0 orpheline |
| `npx playwright test` | 98 / 98 |
| Écran, `/ressources` et `/glossaire` à 375 et 1440 | 200, un seul `h1`, aucun débordement ; « Ressources » visible dans la nav mobile sans ouvrir le menu |

## Témoin négatif

Une ligne de poison ajoutée à un article publié fait rougir l'autorité : validation à `false`, 51 erreurs, la première étant le refus des octets non autorisés par la production courante ; deux suites Python tombent. Après restauration de la source, la validation repasse à `true` avec zéro erreur. Le garde-fou a été re-pointé, pas affaibli.

## Ce que cette carte ne prouve pas

Aucune revue métier n'a été produite. Le rouge résiduel du build est exactement celui qui l'attend. Aucun `AI_REVIEW_PASS` n'a été fabriqué, aucune source n'a été reconsultée, aucune date de collecte n'a été modifiée.

## Observation transmise à la revue technique

Les deux manifestes portent `quality.rule` décrivant une somme sans redistribution des valeurs non déterminées, alors que le score recalculé vaut 100 pour 85 points acquis sur 85 mesurables, soit 85 sur 100 en brut. Le libellé et la normalisation doivent être réconciliés avant le scellement, sans convertir ce 100 normalisé en verdict métier.

Autre point relevé au passage, non corrigé : `editorial/legacy-baseline.json` contient encore, pour les deux premiers articles, des empreintes antérieures à leur migration en dossiers de pipeline. Ces entrées ne sont plus atteintes, puisqu'un article doté d'un dossier complet ne passe jamais par la branche de préservation. Signalé, pas supprimé.
