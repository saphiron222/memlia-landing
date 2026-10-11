# Livraison du contrôle croisé des bulletins

Le service reste limité aux rapprochements inter-sources encore manuels, après vérification des contrôles natifs de l’outil, de son édition et de ses options. Silae et Cegid sont documentés dans la couverture ; aucune supériorité ni compatibilité démontrée n’est revendiquée.

La recette et le PASS métier du parent sont conservés. Le Markdown du blog n’est pas rematérialisé : son pont contextualisé dans `src/data/blog-commercial-links.mjs` pointe désormais vers ce service. La forge reconnaît ce lien seulement lorsque la clé d’article, la route publique, la destination et l’ancre correspondent ; une autre destination, une autre ancre, un fallback ou une source non indexable restent refusés. Le contrôle navigateur vérifie le lien réellement rendu.

Tests ciblés : couverture rouge puis verte ; pont commercial rouge puis vert ; 25 tests PASS. Preuve HTML dédiée : trois cas du rejeu, WebP 1600×900, moins de 150 Ko, texte figé et OG JPG 1200×630. Aucun cadre historique modifié.

Vérification locale : six largeurs 320, 375, 768, 1024, 1440 et 1920 ; H1/canonical/OG, couverture, média unique, images chargées, absence de débordement et trois entrants PASS. Captures pleine page dans `.qa/bulletins-controle/`.

La prévisualisation manuelle Cloudflare a refusé le jeton d’écriture injecté. L’authentification OAuth existante fonctionne en retirant cette seule variable de la commande : `env -u CLOUDFLARE_API_TOKEN npx wrangler pages deploy dist --project-name=memlia --branch=preview-bulletins-controle --commit-dirty=true`. Candidat servi vérifié sur https://0aeee25d.memlia.pages.dev ; `service:publier` PASS sur cette prévisualisation. Ce reçu ne prouve pas une publication sur memlia.fr, qui sera constatée après fusion. Aucun secret changé, aucun déploiement manuel de production.

Revue QA indépendante : un défaut de test de pont commercial signalé, corrigé par une ligne puis recontrôlé avec 5 PASS. Verdict final PASS ; rapport joint à la carte. La revue métier reste inchangée.

Retour arrière : revenir sur le commit de livraison par une PR de revert ; conserver les preuves et le résultat de revue. Une dépublication du service suit `service:depublier` et sa déclaration autorisée, pas une rétrogradation silencieuse.
