# Glossaire CAC, lot 3 : éléments probants et procédures

## Résultat et portée

Paquet candidat : `docs/strategy/site-v3/glossaire-cac-lot-3.json`.

Dix entrées, dix sources officielles, 88 unités de preuve, deux articles publics attestés et dix destinations différées. Le canonical `/glossaire` est conservé ; les termes sont uniquement des ancres. `confirmation-tiers-audit` reste l’ancre C3. Circularisation et revue analytique sont des alias, pas des entrées supplémentaires.

Le lot reste `preview-only`. `businessReviewer`, `reviewedAt` et les verdicts des unités sont nuls. La revue indépendante appartient à `t_f87ddaa1` ; aucune publication, conclusion d’audit ni validation juridique n’est revendiquée.

Préparation depuis une archive de `origin/main` après fetch, base `f9b65c7d5a40d6ec6ccf17a3c8dee8f6f93eb73f`. Lecture : RUNBOOK-QUOTIDIEN §6, SOURCES-DILA, resource-pipeline, resource-metier-evidence/resource-metier-v3, ARCHITECTURE-CAC, `.agents/product-marketing.md` et plan F5. Les 3 541 fichiers de la base sont identiques à leurs objets Git (`global-files-check.json`). Le dépôt principal n’a pas été modifié ; ses fichiers non suivis préexistants et sa branche `site/page-contract-final` ont été conservés. Aucun commit, push, déploiement ou build complet local.

## Sources, versions et fraîcheur

| Norme | Homologation H2A | Publication JO | Article actuel | Version DILA sélectionnée | Début de validité source |
|---|---|---|---|---|---|
| NEP 330 révisée | 13 novembre 2024 | 19 novembre 2024 | A.821-73 | LEGIARTI000054151024 | 20 novembre 2024 |
| NEP 500 | 28 décembre 2023 | 31 décembre 2023 | A.821-74 | LEGIARTI000048882102 | 1er janvier 2024 |
| NEP 505 | 28 décembre 2023 | 31 décembre 2023 | A.821-76 | LEGIARTI000048881589 | 1er janvier 2024 |
| NEP 520 | 13 novembre 2024 | 19 novembre 2024 | A.821-77 | LEGIARTI000054151028 | 20 novembre 2024 |
| NEP 530 | 13 novembre 2024 | 19 novembre 2024 | A.821-78 | LEGIARTI000054151032 | 20 novembre 2024 |

Les cinq pages H2A ont été effectivement ouvertes le 11 octobre 2026, HTTP 200, par curl avec validation TLS. HTML complet conservé ; texte visible extrait par HTMLParser, sans scripts/styles. `captures.json` et `evidence.sources` conservent URL demandée/finale, instant réel, intégrité et attestation d’homologation complète. Le texte et sa numérotation ne sont pas corrigés silencieusement : la graphie `0l.`/`l.` du premier paragraphe de la NEP 500 reste dans les copies.

La NEP 330 révisée prévoit son application aux missions de certification relatives aux exercices ouverts à compter de sa publication au JO, soit le 19 novembre 2024. Cette condition figure dans les preuves ; ne pas transposer automatiquement cette version à un exercice plus ancien. La date de début de validité DILA et la condition relative à l’ouverture de l’exercice sont des informations différentes.

Les cinq copies DILA ont été exportées par `scripts/export-dila-source.mjs`, voie PR125, depuis le référentiel A4. Collecte originale `2026-10-05T22:44:11.834561+00:00`, soit le 6 octobre à Paris : elle n’est jamais remplacée par la date de l’export. Identifiants, périodes, provenance DINUM issue de DILA, commit/date de livraison et texte complet sont conservés. `httpStatus` reste null : aucune ouverture HTTP de Légifrance n’est revendiquée.

Réserves A4 conservées : une collecte récente ne garantit pas une consolidation récente ni le droit à jour ; aucune comparaison aux pages Légifrance n’est prétendue. La fenêtre de 0 à 7 jours civils Paris inclus est satisfaite à la préparation. Pour ces copies DILA, elle se termine le 13 octobre inclus. Une nouvelle préparation/publication ultérieure nécessite une collecte autorisée fraîche, sans redater ces copies. Une revue historique conserve les instants et octets examinés.

## Distinctions et rattachement des preuves

Chaque entrée comprend définition, contexte, exemple fictif, confusion, frontière d’automatisation, termes liés, sources et maillage. Les exemples ne prescrivent aucun taux, montant, taille d’échantillon ni procédure universelle.

`evidence.units` rattache définitions, contextes et confusions à des paragraphes exacts, avec source et localisation par ligne. `extraits.md` permet une lecture par unité ; les copies complètes restent la référence. Les rattachements proposés par l’auteur doivent être jugés par métier : contrôle matériel d’une citation n’est pas verdict sémantique.

Les alias et rapprochements terminologiques sont distingués en unités `methode-memlia`. Les exemples et frontières sont également des unités Memlia, sans portée normative propre ni preuve d’une intégration livrée. Les unités à source officielle restent `legal-reglementaire`, avec champ `unitText` pour replacer chaque affirmation dans son contexte complet.

Points à examiner particulièrement lors de la revue :

- Éléments collectés versus éléments suffisants et appropriés ; quantité versus pertinence et fiabilité ; esprit critique et traitement des contradictions (NEP 500 §04 à 07).
- Réponse reçue, concordance, appréciation du caractère probant et conclusion sont distincts. Confirmation d’une existence ne confirme pas généralement l’évaluation ; absence de réponse, refus fondé et refus non fondé de la direction ont des suites distinctes (NEP 505 §07 à 15).
- Revue analytique n’est pas un simple calcul de variation ; usage en évaluation des risques, procédures de substance et cohérence finale sont distingués (NEP 520 §04 à 10).
- Les termes du lot « tests de procédures » et « contrôles de substance » sont reliés explicitement aux libellés révisés « tests sur les contrôles » et « procédures de substance ». L’absence d’anomalie dans les procédures de substance ne démontre pas l’efficacité des contrôles (NEP 330 §06, 08, 14, 15 et 23).
- Sondage statistique ou non statistique, chance de sélection pour tous les éléments, sélection spécifique et population sont distingués. Une couverture en valeur ne vaut pas représentativité ; le raisonnement sur toute la population ne s’applique pas automatiquement à une sélection ciblée (NEP 530 §03 à 09).
- L’exactitude et l’exhaustivité des informations produites par l’entité sont rattachées à la NEP 500 §06, pas présumées à partir d’un export.

Le CAC garde le choix des méthodes et diligences, l’appréciation des éléments, les conséquences des anomalies et les conclusions. La préparation décrit des propositions et des exceptions ; les décisions, observations et données saisies par le cabinet restent intactes. Aucun score ne déclare un élément probant ou un contrôle terminé.

## Maillage et propriétaires

Les 53 ancres existantes de main ont été examinées : aucune collision. Les termes liés appartiennent au lot, sans dépendance au déploiement d’un autre lot.

Les deux articles EC utilisés sont publiés sur main (`brouillon: false`) et réellement servis HTTP 200 avec corps `<article>` : vérifier une réponse IA en comptabilité et préparer des données confidentielles pour une IA. Les libellés les présentent comme contexte EC, jamais comme méthodes CAC. Copies HTML, instants et intégrité sont dans `linkChecks`.

Les huit articles CAC futurs et les deux outils du contrat C3 restent dans `deferredLinks`, hors des liens publics. Les chemins sont présents dans ARCHITECTURE-CAC ; les articles sont absents de la base. Réutiliser le propriétaire de suivi-circularisation ou revue-analytique-excel à l’intégration ; ne pas créer de nouvelle page pour leur alias. Un statut construit/en revue ne prouve pas une publication.

## Compatibilité et intégration groupée

`entries` et `sources` suivent les interfaces GlossaryEntry et GlossarySource. L’union des dates de `GlossaryEntry.sourceCheckedAt` doit recevoir `2026-10-11` lors de l’intégration groupée. `shape-check.ts` vérifie tous les autres champs contre les interfaces réelles, avec cette seule extension déclarée. Les dates de source DILA restent `2026-10-06`.

H2A NEP 500 et DILA A.821-74 sont partagées avec le lot 2 : réutiliser leurs identifiants logiques, conserver les captures effectivement relues et ne pas réécrire silencieusement les preuves d’un autre lot. Toutes les sources sont proposées sur les mots dans `motsSources` ; les dates et les preuves d’accès restent internes, pas dans les textes rendus.

Ce paquet n’est pas un manifeste global resource-pipeline. La publication groupée reste responsable de déclarer les unités, adapter les planchers/compteurs, injecter le verdict indépendant, sceller les surfaces, vérifier la chaîne Ressources, la CI Repository gates et la production. Lors de la conversion de `evidence.sources` vers `claimsEvidence.sources`, utiliser l’instant exact de `retrievedAt` pour `checkedAt` conformément à SOURCES-DILA, sans fabriquer une ouverture réseau. Aucun PASS de resource-pipeline ni de revue métier n’est revendiqué ici.

## Contrôles exécutés et rejeu

Échec initial du validateur observé avant création du paquet : fichier absent. Après préparation :

- `node docs/qa/hub-ressources/glossaire-cac-lot-3-sources/validate.mjs` : PASS, dix entrées, dix sources, 88 unités, deux liens attestés et 53 ancres examinées. Contrôle des champs, alias, numérotation, fraîcheur, intégrité, provenance DILA, citations exactes et lignes.
- `node docs/qa/hub-ressources/glossaire-cac-lot-3-sources/mutations.mjs` : dix mutations refusées, dont citation inventée, source périmée, lien futur exposé, fausse revue, alias déplacé et ancienne numérotation.
- `node --test tests/scripts/dila-source-copy.test.mjs` : cinq tests PASS, sortie conservée dans `tests-dila.log`.
- `tsc --ignoreConfig --noEmit --skipLibCheck --strict --target ES2022 --moduleResolution bundler --module ESNext docs/qa/hub-ressources/glossaire-cac-lot-3-sources/shape-check.ts` : sortie zéro, commande exacte dans `typecheck-result.json`.
- Comparaison de tous les fichiers de la base à leurs objets Git : aucun modifié.

L’archive est extractible à la racine d’un checkout de la base pour rejouer les contrôles. `draft.json` et `assemble.py` documentent la préparation ; rejouer l’assembleur rouvre les deux articles publics et change la date de préparation, mais ne redonne aucune fraîcheur aux captures H2A ou DILA. Pour la revue de ce candidat, utiliser le paquet livré sans le régénérer.
