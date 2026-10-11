# G4 — couverture des rubriques EC

Les trois parcours historiques restent inchangés : Paie et DSN (3 articles), Saisie et pièces (2), IA en cabinet (8). Aucune archive juridique/fiscale, facture électronique ou révision n’est créée sans stock propre.

La garde `verifierCouvertureRubriques` de `src/data/blog-rubriques.mjs` croise les articles publiés avec `FAMILLES` (`src/data/familles.ts`) : article → famille → pôle EC → rubrique ou exemption datée et motivée. Deux articles non exemptés d’un même pôle doivent chacun avoir un parcours ; une couverture partielle est refusée. Les rubriques suivent une intention de lecture et non une copie des pôles : la formation IA peut rejoindre le parcours IA. La taille minimale des hubs reste contrôlée par `construireRubriques`.

Le layout commun appelle cette garde sur les articles publiés réellement visibles. Le stock CAC reste distinct ; les brouillons en aperçu ne forcent pas une archive avant la décision éditoriale. Toute famille inconnue est refusée, y compris pour un article exempté.

Trois exceptions sont conservées dans la source centrale, sans modifier les articles scellés :

- Carte des tâches : pilier général de toutes les familles, pas un parcours métier.
- Cicatrice d’adoption : retour de cadrage, pas exécution d’un geste ; son rapprochement avec le pilier ne donne pas un parcours propre.
- Diagnostic de charge : transversal et seul article du portefeuille ; les pièces sont un exemple de blocage, pas sa seule intention.

Tests ciblés :

    node --test tests/scripts/blog-rubriques-coverage.test.mjs tests/scripts/blog-rubriques.test.mjs tests/scripts/blog-rubrique-routes.test.mjs tests/scripts/data-driven-counts.test.mjs

Les témoins couvrent réussite, absence de parcours au seuil de deux, couverture partielle, article isolé, exemption insuffisante, famille inconnue, double rattachement, exceptions transversales et séparation CAC. Le dernier test lit le stock réel et la taxonomie source. Ce fichier entre automatiquement dans `npm run test:scripts`, donc dans la CI et le build Cloudflare.

Le commentaire obsolète du gabarit de rubrique a déjà disparu lors de son extraction dans `BlogRubrique.astro` ; seule la docstring Python conservait la mention de deux rubriques. Les raisons d’exemption sont documentaires : aucun texte public, route, canonical, liste d’articles ou lien ne change. Pas de nouvelle mesure J+7/J+28 nécessaire pour ce changement interne. La livraison reste à vérifier par CI, puis sur les trois rubriques publiques, les liens article/hub, leurs canonical et le sitemap.
