# Livraison W39 : date conservée et projection des avis

La constitution du 03/10 prime sur les anciennes instructions du runbook : le fond relu reste approuvé quand seul le jour de livraison change. La recette W39 du 02/10 est conservée, sans nouvelle date ni nouvelle signature. Le reçu continue d'identifier ce lot et sa date de recette ; son échéance ne bloque plus la livraison. Une date future, un corps RAW différent, une incohérence recette/file et une seconde publication restent refusés.

Les notes de direction artistique et de pertinence sémantique sont des améliorations cosmétiques facultatives. Les six critères visuels, les observations, les actifs, la palette, la provenance et zéro P0 restent contrôlés. On ne synthétise pas de notes à partir de PASS booléens.

## Avis sources et projection

`qa.json` et `metier.json` sont les copies inchangées des matrices indépendantes t_c9dd7b40 du 03/10 et t_3a224b17 du 02/10. Elles gardent leurs restrictions historiques ; la présente décision ne transforme pas leur portée. `project-blog-reviews.mjs` copie les sept critères éditoriaux, les six visuels et le verdict métier forge réellement émis. Les identités réelles sont propagées par la forge. Aucun score qualité, aucune note visuelle, aucun avis métier sur le socle du pilier n'est inventé.

Commande (depuis le dépôt technique, chemins absolus pour le candidat et son HTML) :

    node scripts/project-blog-reviews.mjs <candidat> tests-verts-et-regle-des-trois-passes <html-revu> docs/qa/w39-review-projection/qa.json docs/qa/w39-review-projection/metier.json <nouveau-fichier.json>

La projection compare les empreintes canoniques de la recette, du corps et de `.article-corps` aux matrices. Elle refuse FAIL, P0, identité absente, grille incomplète et sujet hors portée. Un fichier d'avis déjà saisi n'est jamais écrasé : sortie distincte, puis adoption explicite par le responsable de livraison. Un second appel identique est idempotent.

## Reprise de livraison

Après QA technique et CI, intégrer cette correction puis reprendre t_73628f94 dans un checkout isolé. Le candidat source n'a pas été modifié. Adopter la projection Cicatrice, sceller et matérialiser le lot, puis vérifier le build public, la PR et la production. Le pilier doit conserver ses avis historiques sur les claims inchangés : le PASS métier Cicatrice n'approuve pas ces six claims. Le seul nouveau lien bénéficie de la revue existante C12. Ne pas adopter les modifications de calendrier qui déplacent les créneaux futurs ; régénérer uniquement les dérivés nécessaires au lot avec les commandes du dépôt. Cette PR technique ne publie aucun article.

## Vérification

    node --test tests/scripts/blog-w39-framing.test.mjs tests/scripts/blog-forge.test.mjs tests/scripts/blog-review-projection.test.mjs

Les témoins reproduisent le refus d'une date de recette de la veille et celui des notes visuelles absentes avant correction. La suite exerce aussi l'identité métier dans le manifeste et chaque claimReview, les mutations du RAW/file, le doublon et la date future. Les tests de projection utilisent les matrices réelles ci-jointes, pas des avis générés.
