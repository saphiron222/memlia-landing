# Glossaire CAC, lot 4 : dossier et conclusion

## Résultat et portée

Paquet candidat : `docs/strategy/site-v3/glossaire-cac-lot-4.json`.

Dix entrées, 18 sources officielles, 84 unités de preuve, deux articles publics attestés et 12 destinations différées. Canonical `/glossaire` conservé ; aucune route autonome. La lettre d’affirmation est un alias des déclarations écrites de la direction. Le dossier permanent et la feuille maîtresse sont des conventions de classement et de présentation, pas des obligations normatives autonomes.

Le lot reste `preview-only`. Les verdicts des unités, `businessReviewer` et `reviewedAt` sont nuls. La revue indépendante appartient à `t_bf6cb3b3` ; aucune publication, validation juridique, opinion ou conclusion d’audit n’est revendiquée.

Préparation dans une archive de `origin/main` après fetch, base `f9b65c7d5a40d6ec6ccf17a3c8dee8f6f93eb73f`. Lecture : RUNBOOK-QUOTIDIEN §6, SOURCES-DILA, resource-pipeline, resource-metier-evidence/resource-metier-v3, ARCHITECTURE-CAC, `.agents/product-marketing.md` et plan F5. Les 3 541 fichiers de la base sont identiques à leurs objets Git (`global-files-check.json`). Le dépôt principal n’a pas été modifié ; ses fichiers non suivis préexistants et sa branche `site/page-contract-final` sont conservés. Aucun commit, push, déploiement ou build complet local.

## Sources, versions et fraîcheur

| Norme | Homologation H2A | Publication JO | Article actuel | Version DILA sélectionnée | Début de validité source |
|---|---|---|---|---|---|
| NEP 230 | 28 décembre 2023 | 31 décembre 2023 | A.821-66 | LEGIARTI000048882660 | 1er janvier 2024 |
| NEP 300 | 27 novembre 2024 | 30 novembre 2024 | A.821-69 | LEGIARTI000050693497 | 1er décembre 2024 |
| NEP 580 | 28 décembre 2023 | 31 décembre 2023 | A.821-79 | LEGIARTI000048877159 | 1er janvier 2024 |
| NEP 570 | 28 décembre 2023 | 31 décembre 2023 | A.821-83 | LEGIARTI000048877010 | 1er janvier 2024 |
| NEP 560 | 28 décembre 2023 | 31 décembre 2023 | A.821-85 | LEGIARTI000048876883 | 1er janvier 2024 |
| NEP 700 | 28 décembre 2023 | 31 décembre 2023 | A.821-92 | LEGIARTI000048875993 | 1er janvier 2024 |
| NEP 911 | 24 juillet 2026 | 26 juillet 2026 | A.821-94 | LEGIARTI000054491781 | 27 juillet 2026 |
| NEP 912 | 24 juillet 2026 | 26 juillet 2026 | A.821-94 | LEGIARTI000054491781 | 27 juillet 2026 |

Les huit pages H2A et les deux pages CNCC de normes ont été réellement ouvertes le 11 octobre 2026, HTTP 200, curl avec validation TLS. HTML complet conservé ; texte visible extrait par HTMLParser, sans scripts/styles. `captures.json` et `evidence.sources` conservent URL demandée/finale, instant réel, intégrité et attestation d’homologation. Les graphies et références des pages officielles ne sont pas corrigées silencieusement.

ALPE : les pages CNCC attestent explicitement que les NEP 911/912 de juillet 2026 remplacent celles homologuées le 13 novembre 2024. A.821-94 contient les deux normes : chaque citation est recherchée dans la section de la NEP concernée, pas dans le premier paragraphe de même numéro de l’article. La copie H2A de la NEP 912 présente une duplication/inversion autour des §18/19 ; elle reste intacte et aucun de ces paragraphes n’est utilisé pour le lot.

Le PDF CNCC `Propos et Débats, Audit et société`, septembre 2022, n°2, a été rouvert HTTP 200 le 11 octobre. PDF entier et extraction pypdf conservés ; `capture-pdf.json` atteste la collecte. Il sert seulement à l’expansion historique de l’acronyme ALPE. Ses seuils, statistiques et conditions anciennes ne sont pas repris dans l’entrée. Les conditions de la mission viennent des normes 2026 et de la copie DILA actuelle sélectionnée, sans recopier de seuil chiffré.

Les sept copies DILA ont été exportées par `scripts/export-dila-source.mjs`, voie PR125, depuis le référentiel A4. Collecte originale `2026-10-05T22:44:11.834561+00:00`, soit le 6 octobre à Paris : elle n’est jamais remplacée par la date d’export. Identifiants, périodes, provenance DINUM issue de DILA, livraison et texte complet sont conservés. `httpStatus` reste null : aucune ouverture HTTP de Légifrance n’est revendiquée.

Réserves A4 conservées : une collecte récente ne garantit pas une consolidation récente ni le droit à jour ; aucune comparaison aux pages Légifrance n’est prétendue. La fenêtre de 0 à 7 jours civils Paris inclus est satisfaite à la préparation. Pour ces copies DILA, elle se termine le 13 octobre inclus. Une nouvelle préparation/publication ultérieure nécessite une collecte autorisée fraîche, sans redater les copies. Une revue historique conserve les instants et octets examinés.

## Rattachement et points métier

Chaque entrée comporte définition, contexte, exemple fictif, confusion, frontière en préparation/validation/jugement, termes liés, sources et maillage. Les exemples ne sont pas des cas clients et ne prescrivent ni taille d’échantillon, ni montant, ni seuil.

`evidence.units` rattache les définitions, contextes et confusions aux paragraphes exacts, avec source et localisation par ligne. `extraits.md` permet la lecture par unité ; les copies complètes restent la référence. Les rattachements sont proposés par l’auteur : un contrôle matériel de citation ne vaut pas verdict sémantique.

Les termes de classement, alias de présentation, exemples et frontières sont distingués comme unités Memlia. L’expansion ALPE est `professionnelle-terminologie`, à source CNCC historique, sans portée réglementaire autonome. Les déclarations écrites / lettre d’affirmation sont directement rattachées à la NEP 580 §08. Les unités normatives sont `legal-reglementaire` et conservent le contexte intégral `unitText`.

Points à examiner lors de la revue :

- Documentation compréhensible, auteurs/dates et revue lorsqu’elle existe (NEP 230 §04,08), pas simple accumulation de fichiers. Dossier permanent et feuille maîtresse ne sont pas présentés comme des formes imposées par la NEP 230.
- Approche générale du plan de mission versus nature/étendue et heures des diligences du programme (NEP 300 §10/11), modifications motivées (§12/13).
- Plusieurs formes de déclarations écrites, date et réception de la lettre (§08 à 10 de la NEP 580) ; corroboration des éléments significatifs et traitement des incohérences (§04/05).
- Survenance, identification, arrêté, signature et approbation sont des dates différentes. Fin de la recherche après signature n’est pas absence de suites pour les événements connus ensuite (NEP 560 §15 à 18).
- Période de douze mois uniquement lorsque le référentiel ne la définit pas (NEP 570 §07). Incertitude significative, principe approprié et information pertinente de l’annexe restent distincts (§12 à 15).
- Opinion, observation et réserve ne sont pas interchangeables ; assurance raisonnable n’est pas garantie d’absence d’erreur (NEP 700 §06 à 08).
- ALPE : mandat de trois exercices NEP 911 versus six exercices NEP 912 ; proportionnalité ne diminue pas l’assurance raisonnable. Les conditions d’application doivent être appréciées, pas déduites de la seule taille de l’entité.

Le CAC conserve le choix des diligences, les appréciations, les conclusions, l’opinion et la responsabilité. La préparation propose et signale les exceptions ; les saisies humaines restent intactes. Aucune préparation n’atteste une conformité aux NEP ni un contrôle achevé.

## Maillage et intégration

Les 53 ancres existantes de main ont été examinées : aucune collision. Les termes liés appartiennent au lot, sans dépendre du déploiement d’un lot frère.

Les deux articles EC utilisés sont publiés sur main (`brouillon: false`) et réellement servis HTTP 200 avec corps `<article>` : vérifier une réponse IA en comptabilité et préparer des données confidentielles pour une IA. Les libellés les présentent comme contexte EC, jamais comme méthodes CAC. Copies, instants et intégrité figurent dans `linkChecks`.

Les dix articles CAC futurs, l’outil feuilles maîtresses et le service dossier de travail restent dans `deferredLinks`, hors liens publics. Leurs chemins sont présents dans ARCHITECTURE-CAC ; les articles sont absents de la base. Réutiliser les propriétaires déjà définis par l’architecture lors de l’intégration ; ne pas créer de seconde page. Un statut construit/en revue ne démontre pas une publication.

`entries` et `sources` suivent GlossaryEntry/GlossarySource. L’union des dates de `GlossaryEntry.sourceCheckedAt` doit recevoir `2026-10-11` à l’intégration groupée. `shape-check.ts` vérifie les autres champs contre les interfaces réelles avec cette seule extension déclarée. Les dates de collecte DILA restent `2026-10-06`.

Ce paquet n’est pas un manifeste global resource-pipeline. La publication groupée déclare les unités, adapte les planchers/compteurs, injecte le verdict indépendant, scelle les surfaces puis contrôle la chaîne Ressources, la CI Repository gates et la production. Lors de la conversion de `evidence.sources` vers `claimsEvidence.sources`, utiliser l’instant exact `retrievedAt` pour `checkedAt`, conformément à SOURCES-DILA. Aucun PASS de resource-pipeline ni de revue métier n’est revendiqué ici.

## Contrôles et rejeu

Échec initial du validateur observé avant création du paquet : fichier absent. Après préparation :

- `node docs/qa/hub-ressources/glossaire-cac-lot-4-sources/validate.mjs` : PASS, dix entrées, 18 sources, 84 unités, deux liens attestés et 53 ancres examinées. Champs, alias, numérotation, version ALPE, fraîcheur, intégrité, provenance DILA, citations exactes et lignes contrôlés.
- `node docs/qa/hub-ressources/glossaire-cac-lot-4-sources/mutations.mjs` : 13 mutations refusées, dont citation inventée, source périmée, lien futur, fausse revue, alias déplacé, ancienne numérotation et ALPE ancienne version.
- `node --test tests/scripts/dila-source-copy.test.mjs` : cinq tests PASS, sortie conservée dans `tests-dila.log`.
- `tsc --ignoreConfig --noEmit --skipLibCheck --strict --target ES2022 --moduleResolution bundler --module ESNext docs/qa/hub-ressources/glossaire-cac-lot-4-sources/shape-check.ts` : sortie zéro, commande exacte dans `typecheck-result.json`.
- Comparaison des 3 541 fichiers de la base à leurs objets Git : aucun modifié.

L’archive est extractible à la racine d’un checkout de la base. `draft.json` et `assemble.py` documentent la préparation ; rejouer l’assembleur rouvre les liens publics et change la préparation, sans rafraîchir les captures H2A, CNCC ou DILA. Pour la revue, utiliser le candidat livré sans le régénérer. Les scripts de capture font de vrais accès HTTP ; ils ne doivent pas remplacer les preuves d’un candidat déjà relu.
