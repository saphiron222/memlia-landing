# QAD-AI — Contrat de revue métier IA indépendante

Date : 2026-09-14

Carte : `t_9dfa3cae`

Parent technique : `861b8cd9c90bf19e32da8b02bcf1e8e94382d5e9`

## Verdict

**Le contrat technique v2 est prêt ; le candidat éditorial courant reste volontairement FAIL.**

La matière sensible exige désormais une revue `AI_REVIEW_PASS` produite par le profil IA interne `metier`. Le reviewer est identifié par une carte Kanban, déclare le rôle interne `reviewer-metier-memlia` et ne se présente jamais comme humain ou professionnel. La revue aval est portée par `t_dcd8a18e` ; elle ne sera libérée qu’après ce commit.

`AI_REVIEW_PASS` est un contrôle interne. Kevin reste l’unique gate humain avant preview et publication.

## Contrat fermé

Le manifeste `resource-manifest-v1` passe à `contractRevision: 2`. Une revue sensible n’est recevable que si elle relie simultanément :

- le profil exact `metier`, une identité de carte au format `t_<8 hex>` et la séparation déclarée de l’auteur, du reviewer éditorial et du classificateur de source ;
- le SHA-256 du candidat revu, recalculé après retrait du bloc de revue afin d’éviter une dépendance circulaire ;
- exactement une ligne par couple claim/source sensible ;
- les identifiants de citations correspondant à la source, le SHA-256 de son contenu, une date valide et un raisonnement non vide ;
- un fichier de preuve local dont le SHA-256 et le contenu JSON canonique correspondent exactement au bloc de revue.

Seul le verdict `soutient` ouvre un couple claim/source. `soutient_partiellement`, `contredit`, `hors_sujet` et `ND` ferment le gate. Une source officielle absente, postérieure à la revue, consultée un autre jour ou plus de 24 heures auparavant reste refusée.

Le modèle `editorial/templates/business-review-evidence.json` est fail-closed : son état initial est `FAIL` avec un verdict `ND`.

## Ce qui aurait rougi

La suite Node injecte notamment les fautes suivantes et exige leur refus :

| Témoin | Signal attendu |
|---|---|
| revue absente ou type `human` | agent IA requis |
| reviewer égal à l’auteur | séparation refusée |
| profil différent de `metier` | profil refusé |
| identité sans format Kanban | traçabilité refusée |
| rôle professionnel inventé | rôle interne refusé |
| hash du sujet divergent | candidat exact refusé |
| ancien statut `PASS` | `AI_REVIEW_PASS` requis |
| preuve absente ou hash divergent | preuve refusée |
| citation absente de la matrice | verdict non traçable |
| source absente ou périmée | source primaire/fraîcheur refusée |
| ligne claim/source absente ou dupliquée | matrice exhaustive refusée |
| `contractRevision: 1` | contrat historique refusé |

## Recalcul indépendant

`tests/proof/test_resource_ai_review.py` n’importe pas le validateur Node. Il reconstruit en Python standard la projection du candidat, calcule son JSON canonique et son SHA-256, relit les octets de la preuve, recalcule son SHA-256 et rapproche indépendamment tous les couples claim/source, citations et empreintes de sources.

Résultat frais : **1/1 PASS**.

## Vérification exécutée

| Contrôle | Résultat frais |
|---|---|
| `node --test tests/scripts/resource-pipeline.test.mjs` | PASS — 33/33 |
| `python3 -m unittest discover -s tests/proof -p 'test_resource_ai_review.py' -v` | PASS — 1/1 |
| `npm run check` | PASS — 100 fichiers, 0 erreur, 0 warning, 1 hint hérité |
| `npm run build:site` | PASS — 9 pages ; Python 52/52 ; Node 4/4 + 55/55 + 1/1 + 33/33 |
| `QA_URL=http://127.0.0.1:4387 npm run test` | PASS — Playwright 98/98 |
| `npm run resource:audit:qa` | exit 1 attendu — 2 manifestes découverts, 0 PASS, 2 FAIL, 32 erreurs chacun |
| `git diff --check` | PASS |

L’audit QA courant compte **14 refus directement liés à la revue IA** sur les deux manifestes. Il conserve aussi les défauts métier antérieurs : sources officielles, contrôles SERP/GSC, score, P0/P1 et gates non joués. Le correctif ne fabrique donc aucun vert.

## Écran et périmètre

Aucun fichier de rendu, définition, claim, article, image ou média n’est modifié. Le contrôle de pathspec sur `src/data/glossary.ts`, les pages Ressources/Glossaire, `src/content/blog` et les actifs publics rend une portée vide. La passe écran n’est donc pas applicable à ce changement de contrat ; la suite Playwright complète reste verte sur le build courant.

## Preuves locales

- `.qa/resources/ai-review-contract/check.log`
- `.qa/resources/ai-review-contract/build-site.log`
- `.qa/resources/ai-review-contract/node-tests.log`
- `.qa/resources/ai-review-contract/python-tests.log`
- `.qa/resources/ai-review-contract/qa-audit.log`
- `.qa/resources/ai-review-contract/qa-audit.json`

Ces journaux sont des artefacts locaux ; le présent rapport est la preuve versionnée.

## Limites et interdits

- Le schéma vérifie le format de l’identité Kanban ; l’existence et l’état réel de la carte restent vérifiés par l’orchestrateur au lancement de la revue.
- Cette carte ne rend aucun verdict sur les 23 définitions et ne vaut pas `AI_REVIEW_PASS`.
- Aucun contenu sensible, source, score, GO ou résultat de gate n’a été inventé.
- Aucun push, preview distante, production, publication, cron ou envoi externe n’a été effectué.
