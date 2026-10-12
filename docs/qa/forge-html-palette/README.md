# Qualification des couvertures HTML originales

## Contrat

Les couvertures originales autorisées par la décision éditoriale du 11/10 ne sont pas des dioramas IA. Leur fournisseur local, Chromium, zéro crédit et leur provenance explicite ouvrent le régime `html-original`. Ce moteur est conservé dans le manifeste, l'image et ses deux preuves structurées. Aucun régime n'est inféré du seul nom du modèle ni du style visuel.

La mesure HTML compte le master à sa largeur native, avec la même tolérance 45 et le même classement au plus proche. Aucun chiffre n'est corrigé ou substitué. Les couleurs absentes restent à zéro. Les planchers calibrés sur les couvertures IA ne décrivent pas la lisibilité d'un tableau HTML ; ils restent publiés comme objectifs cosmétiques indicatifs. Le statut est `OBSERVATION`, pas `PASS`. Le brief épinglé et séparable reste requis. Les couvertures IA gardent leur mesure à 320 et leurs refus antérieurs.

Les contrôles critiques restent actifs : identité du candidat, intégrité du master, alt descriptif, formats et dimensions, variation visuelle, grille indépendante, zéro P0, sources et claims. Ce correctif ne change ni les recettes CAC, ni le contenu, ni les images, ni l'avis métier existant. Les cadres historiques sans provenance HTML explicite ne sont pas migrés dans cette livraison.

## Reproduction réelle

Le 12/10/2026, copie isolée du workspace F4 `t_22498ed8/site` dans `t_22fb4350/reproduction`. Le dépôt de reproduction reçoit une référence `origin/main` locale intégrée pour conserver le vrai garde de calendrier. Aucune horloge, aucun garde de production et aucune recette ne sont modifiés. Les deux commandes sont exécutées avant puis après remplacement des seuls scripts corrigés :

    node scripts/blog-forge.mjs preparer automatiser-un-cabinet-cac-la-carte-des-taches
    node scripts/blog-forge.mjs preparer cac-reception-fec-constat

Résultats exacts dans `reproduction.json` :

- Avant : deux défauts palette par candidat, en plus d'une citation courte (`claims[8]` / `claims[4]`).
- Après : les deux défauts palette ne bloquent plus ; la citation courte reste refusée et chaque commande sort encore avec le code 1. Ce n'est pas une autorisation de publication.
- Masters copiés et masters F4 identiques aux empreintes prises avant le rejeu ; aucun PNG modifié.
- Mesure native sur 2 073 600 pixels : parts graphite/cuivre du pilier 0.0014115547839506173 / 0.0001663773148148148 ; satellite 0.0008203125 / 0.0005420524691358025. Elles restent sous 0.005. Augmenter la résolution seul ne suffit donc pas.
- Examen visuel de la source satellite : registre explicitement fictif, traits et textes fins, fond très clair, accents cuivre. La mesure et le sens du visuel sont deux preuves distinctes.

## Tests

Le nouveau test Forge a d'abord échoué sur le refus de cuivre absent. Après correction, les 117 tests ciblés passent :

    node --test tests/scripts/palette.test.mjs tests/scripts/blog-forge.test.mjs tests/scripts/blog-pipeline.test.mjs tests/scripts/blog-pipeline-hardening.test.mjs

Le scénario HTML accepte le vrai gate de preview avec revue complète, conserve une couleur absente à zéro et refuse les crédits non nuls, un modèle IA, une provenance manquante, une preuve de génération incohérente, un P0 et un critère visuel FAIL. La régression IA existante maintient ses refus de couleur absente, de brief flou et sa dette historique.

La construction complète et les suites complètes restent confiées à la CI GitHub `Repository gates`. Une seule revue QA indépendante est requise avant livraison ; aucune nouvelle revue métier n'est demandée.
