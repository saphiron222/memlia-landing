# PR51 — budget de Repository gates

## Diagnostic et décision

La tentative 2 du run 37238384216 sur af73c559 a commencé le 4 octobre 2026 à 22:32:43 UTC et a été annulée à 23:02:58 UTC. Tous les contrôles précédant les contrats navigateur sont SUCCESS. Le build déterministe dure de 22:38:21 à 22:46:43 ; Playwright commence ensuite son propre `build:site`, puis annonce 298 tests à 22:54:15. L'exécution progresse encore à l'annulation (294 parcours rapportés). Ce n'est pas un verdict de test rouge.

Correction minimale : limite globale de 30 à 60 minutes dans `.github/workflows/pr-validation.yml`. Aucun filtre, contrôle, retry, worker, assertion, construction ni étape n'est supprimé ou parallélisé. Le rebuild Playwright reste volontairement inchangé pour ne pas introduire de sélection d'artefact ou de serveur périmé. La limite finie et l'annulation des exécutions supersédées restent actives. La marge absorbe le rebuild et la variabilité des runners ; elle ne promet pas une durée cible de 60 minutes.

Référence du mécanisme : documentation officielle GitHub Actions, `jobs.<job_id>.timeout-minutes` (annulation automatique à la limite du job).

## Régression exécutée

`node --test tests/scripts/ci-budget.test.mjs` lit le workflow réel comme configuration et confronte son budget à une charge observée : 1815 secondes d'exécution interrompue + quatre parcours restants bornés à 30 secondes chacun + 60 secondes de nettoyage, soit 1995 secondes. C'est un plancher de régression pour cette charge, pas une estimation universelle de toutes les futures suites.

Avant correction : FAIL, budget 1800 secondes insuffisant. Après correction : PASS, budget 3600 secondes. Le test est découvert par `test:scripts`, donc par les deux constructions déjà présentes dans la CI. La preuve définitive reste la CI Linux complète sur le nouveau commit ; elle sera transmise sur la carte sans ajouter de revue ni fusionner PR51.

## Périmètre et risque résiduel

Aucune correction produit ni donnée éditoriale modifiée. L'allongement du plafond permet à un run lent de consommer davantage de minutes ; il reste borné. Une croissance de la suite au-delà du budget observé n'est pas couverte par cette fixture et nécessitera une nouvelle mesure. La QA existante t_b3f1ff96 demeure unique et la publication relève de t_6d974686.
