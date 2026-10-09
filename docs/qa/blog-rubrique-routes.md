# Routes canoniques des rubriques du blog

BLOG_RUBRIQUES reste le registre unique. Chaque rubrique déclare son chemin : /blog/rubrique/<segment> conserve la route EC historique ; /blog/<segment> passe par [...rubrique].astro. Le paramètre vient du chemin, pas du slug éditorial. Les deux routes composent BlogRubrique.astro ; canonical, Open Graph et JSON-LD suivent rubrique.chemin. Aucun alias ni article supplémentaire n'est créé.

construireRoutesRubriques joint la collection visible, conserve le minimum de deux articles et refuse un chemin invalide, réservé, dupliqué ou en collision avec un article visible. La route article appelle aussi ce contrôle : sa priorité Astro ne peut pas masquer une rubrique. verify-page-contract consulte le registre avant de classer /blog/<segment> comme BlogPosting.

Cette livraison n'ajoute aucune rubrique CAC, aucun article et aucune réservation de calendrier. F4 déclarera sa rubrique seulement lorsque ses deux articles seront réellement publics.

## Vérification ciblée

    node --test tests/scripts/blog-rubrique-routes.test.mjs tests/scripts/blog-rubriques.test.mjs tests/scripts/page-contract.test.mjs tests/scripts/blog-contract.test.mjs tests/scripts/data-driven-counts.test.mjs

Témoin initial : les cinq nouveaux tests échouent avant implémentation. Après implémentation : 47 tests passent. La suite complète et la construction relèvent de Repository gates sur GitHub, pas du Mac.

Recette Astro locale exécutée sur 127.0.0.1:4337 : les trois rubriques EC répondent HTTP 200 avec canonical exact, CollectionPage et toutes leurs cartes ; un article EC répond HTTP 200 avec BlogPosting. Fixture temporaire : remplacer uniquement le chemin de la première rubrique par /blog/fixture-directe (slug inchangé), sans toucher ses articles. Cette URL répond HTTP 200 avec canonical exact et trois cartes ; le garde la classe CollectionPage et résout [...rubrique].astro ; son ancien alias répond HTTP 404. Restaurer immédiatement le chemin EC avant tout commit. Les fixtures ne sont pas publiées.

Les tests Node couvrent aussi les collisions, doublons, routes réservées et la perte du second article visible. Le test historique protège les trois chemins EC sans interdire les futures rubriques directes.
