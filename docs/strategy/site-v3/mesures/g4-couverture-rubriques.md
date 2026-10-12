# G4 — couverture des rubriques EC

Les trois parcours historiques restent inchangés : Paie et DSN (3 articles), Saisie et pièces (2), IA en cabinet (8). Aucune archive juridique/fiscale, facture électronique ou révision n’est créée sans stock propre.

La garde `verifierCouvertureRubriques` de `src/data/blog-rubriques.mjs` croise les articles publiés avec `FAMILLES` (`src/data/familles.ts`) : article → famille → pôle EC → rubrique ou exemption datée et motivée. Deux articles non exemptés d’un même pôle doivent chacun avoir un parcours ; une couverture partielle est refusée. Les rubriques suivent une intention de lecture et non une copie des pôles : la formation IA peut rejoindre le parcours IA. La taille minimale des hubs reste contrôlée par `construireRubriques`.

Le layout commun appelle cette garde sur les articles publiés réellement visibles. Le stock CAC reste distinct ; les brouillons en aperçu ne forcent pas une archive avant la décision éditoriale. Toute famille inconnue est refusée, y compris pour un article exempté.

Les exceptions historiques sont conservées dans la source centrale, sans modifier les articles scellés. Cette liste est documentaire, pas un plafond des exemptions autorisées :

- Carte des tâches : pilier général de toutes les familles, pas un parcours métier.
- Cicatrice d’adoption : retour de cadrage, pas exécution d’un geste ; son rapprochement avec le pilier ne donne pas un parcours propre.
- Diagnostic de charge : transversal et seul article du portefeuille ; les pièces sont un exemple de blocage, pas sa seule intention.

Tests ciblés :

    node --test tests/scripts/blog-rubriques-coverage.test.mjs tests/scripts/blog-rubriques.test.mjs tests/scripts/blog-rubrique-routes.test.mjs tests/scripts/data-driven-counts.test.mjs

Les témoins couvrent réussite, absence de parcours au seuil de deux, couverture partielle, article isolé, exemption insuffisante, famille inconnue, double rattachement, exceptions transversales et séparation CAC. Le contrat lit le stock publié réel et la taxonomie source : chaque article EC rejoint exactement un hub construit ou une exemption datée avec un motif substantiel. Il vérifie aussi la résolution article → rubrique. Il ne fige ni le nombre ni les identifiants des exemptions et ne dépend pas de la mise en forme du source `Base.astro`.

Deux nouvelles exemptions sont ajoutées successivement en mémoire au stock réel : elles doivent être acceptées sans archive artificielle, tandis que leur retrait ou un motif insuffisant reste refusé. Pour chaque exemption EC publiée du stock réel, les mutations sans exemption, motif insuffisant, date absente et famille inconnue sont refusées. Le stock réel est aussi rejoué avec un double rattachement et un rattachement doublé d’une exemption, tous deux refusés. Aucune garde de production n’est modifiée. Ce fichier entre automatiquement dans `npm run test:scripts`, donc dans la CI et le build Cloudflare.

Régression bancaire : exporter le candidat `bb92acd8c1ece40c22fa60907c2a6210aae6f6c8` dans un dossier de rejeu isolé (`git archive`), y lancer le test historique, puis remplacer seulement le fichier de test par le candidat infrastructure et relancer la commande ciblée ci-dessus. Avant : 8 réussites, 1 refus de la liste figée malgré l’exemption bancaire valide. Après : la couverture évolutive et ses contre-preuves passent. Le worktree bancaire original reste en lecture seule ; ni article ni décision d’exemption ne sont copiés dans la PR infrastructure. La construction et la suite complète sont vérifiées par la CI « Repository gates », pas par un build complet sur le Mac.

La fabrique de candidat de test renseigne `famille: bulletins-controle`, cohérente avec son scénario paie. Un témoin lit son vrai frontmatter après passage de preview à publication et vérifie sa couverture avec une exemption motivée ; une famille inconnue reste refusée même avec cette exemption. Le scénario complet preview → publication de `blog-candidate-render.test.mjs` est conservé et rejoué par la CI.

Le commentaire obsolète du gabarit de rubrique a déjà disparu lors de son extraction dans `BlogRubrique.astro` ; seule la docstring Python conservait la mention de deux rubriques. Les raisons d’exemption sont documentaires : aucun texte public, route, canonical, liste d’articles ou lien ne change. Pas de nouvelle mesure J+7/J+28 nécessaire pour ce changement interne. La livraison reste à vérifier par CI, puis sur les trois rubriques publiques, les liens article/hub, leurs canonical et le sitemap.
