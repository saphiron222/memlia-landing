# Oracle HTTP et suspension ciblée

`npm run test:indexability` sonde la production en lecture seule. Il ne publie rien et ne lève aucune suspension.

La liste des pages hors index reste `PAGES_NOINDEX` dans `src/data/site.mjs`. L'exception HTTP est une liste explicite dans l'oracle, associant exactement la route Saisie à sa fonction Pages existante : `functions/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier.js`. Aucun nom ou préfixe de route ne suffit à autoriser un 503.

Pour chaque page noindex servie (hors `/404`, exclusion historique), GET et HEAD sont contrôlés :

- page ordinaire : HTTP 200, meta robots noindex sur GET ;
- route explicitement suspendue : HTTP 503, Cache-Control et Retry-After identiques au contrat de la fonction de bord (`no-store`, `86400`), directives X-Robots-Tag identiques (`noindex, nofollow`) pour les deux méthodes ; meta noindex et nofollow sur GET ;
- HEAD : corps vide ; toutes les pages noindex restent absentes du sitemap.

Les contrôles existants sur l'accueil, robots.txt et les pages indexables du sitemap restent actifs. Le rapport distingue `checks.legalPages` et `checks.suspendedPages` et conserve la méthode et les en-têtes observés. Il ne certifie ni le contenu métier ni le SHA déployé.

Non-régression : `node --test tests/scripts/production-indexability.test.mjs tests/scripts/article-maintenance.test.mjs`. Les fixtures utilisent la vraie fonction Pages, puis altèrent individuellement statuts, en-têtes, meta et sitemap pour vérifier le refus. Un 503 sur une page légale ou un autre article reste une erreur ; un 200 sur la suspension aussi.

L'oracle historique de la release PR36 a échoué en exigeant 200 sur cette suspension. Ce FAIL reste une preuve historique valide du défaut de l'oracle, pas un PASS rétroactif et pas une preuve de défaut de production. Une nouvelle mesure avec le correctif doit être datée séparément.
