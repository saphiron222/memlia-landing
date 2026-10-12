PASS — livraison métier du lot CAC 2, correction F1.

Pièces de référence

  review/REVUE.md : rapport motivé, limites et note sur le script auteur manquant.
  review/lot-review.json : 87 avis, 36 réexamens F1 et 51 reports de fond inchangé.
  review/business-review.json : preuve AI_REVIEW_PASS, 66 couples normatifs.
  review/claims-evidence-projection.json : projection Ressources du lot uniquement.
  review/claims-check.json : sous-contrat natif exécuté et six mutations refusées.
  verification-f1.json et review/independent-f1-negative-check.json : localisation/couverture indépendantes.
  review/tests-executed.json : commandes réellement rejouées et sorties brutes.

Le candidat courant est corrected/docs/strategy/site-v3/glossaire-cac-lot-2.json. Les autres JSON sous corrected/original, corrected/review, prior et original-preparation.zip sont historiques ; ils ne sont pas les preuves courantes d’approbation. Le FAIL initial n’a pas été effacé.

La revue ne modifie ni ne publie le candidat. Le lot conserve le canonical /glossaire et les dix ancres, dont ipe-audit et seuil-planification-audit. Les liens différés restent hors liens publics. A4 reste un dérivé DINUM sans garantie de consolidation générale, collecté le 6 octobre à Paris ; NEP 315 révisée applicable aux exercices ouverts à compter du 19 novembre 2024.

Consignes à t_c7724c9d

  Importer le paquet corrigé et les copies correspondantes.
  Préserver les sous-claims text et champs complets unitText, ainsi que les 87 avis et leurs dates.
  L’item IPE lexical est methode-memlia, pas legal-reglementaire ; ne pas lui inventer une source normative.
  La projection choisit un claim par ligne evidence.units.id et groupe le champ par unit-t-{entryId}-{field}. Les claimId de regroupement auteur restent dans le paquet, sans double comptage dans la preuve native.
  Remapper corrected/ et review/ vers les pièces intégrées ; rematérialiser seulement l’enveloppe du manifeste groupé avec les bibliothèques natives. Ne pas transplanter sa valeur de liaison telle quelle dans un autre manifeste.
  Préserver les propriétaires logiques partagés H2A NEP 200 et DILA A.821-63 du lot 1 sans écraser les copies relues.
  Rejouer le circuit Ressources, la validité DILA courante, les tests, CI et production ; ces opérations ne sont pas accomplies par cette revue.

Rejeu des contrôles

Créer baseline/ dans un répertoire de travail à partir de l’archive du dépôt origin/main b896a3a37f6a4fbf902d7889fdaf184711d6c573, puis npm ci --ignore-scripts --no-audit --no-fund dans baseline/. Aucune mutation des bibliothèques natives : check-review-f1.mjs crée seulement un module-sonde dans ce scratch pour exposer validateClaims à la vérification.

  python3 verify-f1.py
  python3 test-review-f1.py
  node check-review-f1.mjs

Pour les scripts auteur, superposer corrected/ dans une seconde archive scratch du dépôt, puis utiliser les commandes effectives recensées dans review/tests-executed.json. f1.test.mjs est annoncé mais non livré ; son absence est une note, non une nouvelle réserve bloquante. Le contrôle positif indépendant et trois réintroductions de F1 sont livrés ici. Ne pas annoncer ses trois tests comme rejoués.

build-review-f1.mjs est la matérialisation effectuée dans cette revue ; ne pas l’exécuter pour redater les avis acquis. Le rejeu normal utilise la preuve figée et check-review-f1.mjs. Les sources HTTP, dates, avis et leur distinction avec la date de campagne restent réels.
