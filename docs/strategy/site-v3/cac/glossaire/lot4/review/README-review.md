PASS — revue métier indépendante du glossaire CAC, lot 4.

Livraison de t_bf6cb3b3, 11 octobre 2026.

Pièces

- review/REVUE.md : rapport, preuves et limites A4, consignes d’intégration.
- review/lot-review.json : avis sur les 84 unités du paquet original, motifs individuels et textes soutenus.
- review/business-review.json : enveloppe native AI_REVIEW_PASS du seul lot 4.
- review/claims-evidence-projection.json : 50 champs, 87 claims, 163 citations, 58 verdicts sensibles ; projection de lot, pas manifeste global publiable.
- review/claims-check.json : contrôle réel validateClaims et empreinte native, six mutations refusées.
- review/source-recheck.json et review/captures-recheck : huit pages H2A, deux notices CNCC, un PDF CNCC rouverts ; sept copies A4 réexportées à l’identique.
- review/format-check.log, author-mutations.log et dila-tests.log : contrôles ciblés rejoués.
- review/verification.json : candidat/copies inchangés, base intacte, extraction PDF et version ALPE contrôlées.
- candidate/ : paquet et copies d’origine, non réécrits.
- review/reasons.json et build-review.mjs : motifs décidés par le reviewer et leur matérialisation ; ce script ne réalise pas une revue automatique. Ne pas le relancer pour redater un avis acquis.
- collect-review.py, check-review.mjs, verify-and-package.py : collecte réelle, contrôle natif et intégrité de la livraison.

Rejeu technique depuis un environnement équivalent :

  node check-review.mjs

Le contrôleur requiert fresh-main/ avec les dépendances npm installées, base f9b65c7d5a40d6ec6ccf17a3c8dee8f6f93eb73f, ainsi que le paquet parent à son emplacement durable. Il ajoute uniquement un export temporaire à une copie du module natif resource-pipeline pour exercer validateClaims. Aucun fichier suivi de la base n’est modifié ; il ne valide pas toutes les portes d’un manifeste global.

Pour l’intégration t_c7724c9d : consommer les pièces de lot, conserver les motifs, identités et dates, remapper candidate/ vers les pièces importées puis reconstruire seulement l’enveloppe du manifeste groupé. La projection ajoute NEP 580 §11 à la preuve, sépare la convention éditoriale d’alias et borne chaque attestation CNCC à sa propre norme. Elle ne modifie aucun texte public. Conserver les 58 verdicts sensibles, le verdict de terminologie historique et les avis de méthode ; aucun faux PASS par nombre global d’unités.

Réserves A4 et collecte originale conservées, sans visite Légifrance alléguée. Dates, chrome et nouveau scellement ne déclenchent pas une seconde revue du fond inchangé. Les fichiers globaux, le rendu, la CI et la publication restent à l’intégrateur ; rien n’est publié ici.
