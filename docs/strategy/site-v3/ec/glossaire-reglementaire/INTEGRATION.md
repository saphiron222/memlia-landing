# Intégration EC du 11 octobre 2026

Deux termes publics admis : Lettre de mission ; Facture électronique et plateforme agréée.
Les quatre candidats ont reçu le PASS métier t_79043fac, mais les deux termes IA restent hors publication faute d’article support servi. Aucun lien futur ajouté. Voir LIENS.md, admission.json et review/REVUE.md ; les textes du candidat restent identiques à entries.json.

## Preuves et avis acquis

Le paquet original et ses huit copies restent documentaires, sans redatation. Les copies du reviewer et son rapport sont dans review/. Les unités natives couvrent les cinq champs de chaque entrée admise : 86 unités au total, 101 affirmations, 114 citations, 33 sources. Les 24 nouvelles phrases sont inventoriées ; 18 couples sensibles sont remappés, les six phrases pédagogiques restent non opposables. La revue globale compose 27 avis sensibles historiques inchangés et 18 avis EC, soit 45. L’identité de chaque provenance est conservée dans review/remappage.json ; l’identité de l’enveloppe courante désigne la dernière revue ajoutée, pas une nouvelle lecture de l’historique.

La reproduction DILA réelle PR125 pour LEGIARTI000053546660 est identique à sources/cgi.dila.json. Le corps concorde avec la page officielle ; la note tronquée A4 reste exclue comme preuve. Réserves A4 conservées et réparation t_976e43cb indépendante. Article 151 absent du snapshot A4 : copie publique officielle seulement, aucune copie DILA inventée.

Les témoins TypeScript négatifs de préparation ne sont pas intégrés au dépôt : seule la date 2026-10-11 est ajoutée au contrat réel. Les logs historiques de préparation ne constituent pas une nouvelle exécution. Les scripts de préparation sont conservés comme provenance, pas à rejouer sur le paquet intégré.

## Reconstruction reproductible

Depuis la racine, à partir du paquet relu et de la base f9b65c7d :

    npm run resource:seal-surfaces
    npm run lastmod:sync
    npm run resource:seal-surfaces
    node docs/strategy/site-v3/ec/glossaire-reglementaire/integrer-revue.mjs
    node scripts/reaffirm-resource-review.mjs ancrer
    npm run regen:generated

integrer-revue.mjs refuse un changement de texte historique ou de source officielle, un claim EC divergent, une copie modifiée ou une citation différente. Pour la convention interne dont la copie est glossary.ts, seuls le hash de ce fichier agrandi et les liens inverses évoluent. Il importe les motifs existants, sans rédiger de verdict ; les empreintes dérivées et le registre sont recalculés. L’ancre globale du dossier historique R5 devient l’enveloppe composée ; les anciens avis et dates restent dans la preuve globale.

## Vérifications exécutées

- Nouveau test : deux échecs attendus avant intégration, puis deux PASS sur les entrées exactes et la couverture de chaque phrase.
- Réexport DILA PR125 réellement exécuté et copie comparée.
- regen:generated PASS et resource:audit:qa PASS ; aucune porte supprimée.
- 8 tests Python glossaire et 4 tests traçabilité PASS.
- 38 tests Node ciblés (EC et chaîne Ressources) PASS.
- 31 tests Playwright glossaire/review PASS sur le vrai rendu local, 320 à 1920 px, avec et sans JavaScript. Serveur preview existant, QA_URL explicite : pas de build complet Mac.
- Construction complète, types et suite entière : preuve attendue de CI GitHub Repository gates, pas revendiquée localement.

La publication et les contrôles de production sont consignés sur t_dd049e8c après fusion. Les deux reports IA ne sont pas deux publications manquantes à fabriquer : réexaminer l’admission quand un article existant les emploiera. Suivi J+7/J+28 à dater de la publication effective du sous-lot, sans prétendre disposer de métriques GSC absentes.
