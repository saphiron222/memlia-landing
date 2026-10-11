# SEC-02 — extension de livraison Pages aux surfaces locales

Constat et qualification du 6 octobre 2026, carte t_9f284ce4.

## Cause observée et périmètre

Chromium sur le domaine public, sans query string, observe les deux scripts Insights (simple et versionné) et leurs refus CSP sur les onze routes ci-dessous. Le GET HTTP de Node sans navigateur ne contient pas ces scripts : ce GET seul ne prouve donc pas leur absence publique. Les données brutes des deux collectes sont conservées dans les preuves de carte.

- `/contact`
- `/outils-comptables-gratuits`
- `/outils-comptables-gratuits/calculateur-marge-commerciale`
- `/outils-comptables-gratuits/calculateur-amortissement-comptable`
- `/outils-comptables-gratuits/generateur-charte-ia-cabinet`
- `/outils-comptables-gratuits/calculateur-date-echeance-facture`
- `/outils-comptables-gratuits/verificateur-fec-local`
- `/outils-comptables-gratuits/verificateur-prompt-ia`
- `/outils-comptables-gratuits/modele-rapprochement-bancaire-excel-gratuit`
- `/outils-comptables-gratuits/generateur-prompt-expert-comptable`
- `/outils-comptables-gratuits/diagnostic-maturite-ia-cabinet`

PR101 (bibliothèque) et PR103 (générateur générique) sont encore ouvertes à la qualification, contrairement à la prémisse « déjà livrées » de la carte. Leurs correctifs/revues/publications restent sur leurs cartes existantes ; leurs routes ne sont pas réimplémentées ici. ROI et pseudonymiseur sont inchangés. MESURE-01 et le chantier global Web Analytics/RUM arrêté restent hors périmètre.

## Correction du mécanisme

Les dix surfaces outils réexportent GET/HEAD du filtre ROI existant. Contact appelle le même filtre, puis rétablit exactement sa CSP stricte propre : Turnstile et l’API same-origin restent autorisés, aucun `unsafe-inline` ajouté à `script-src`. Le filtre ne traite aucun POST ; `/api/contact` et ses contrôles restent inchangés.

Onze règles exactes `Cache-Control: public, max-age=0, must-revalidate, no-transform` complètent la protection contre une nouvelle transformation edge. Aucune règle wildcard de transformation, aucun réglage Cloudflare global. CSP, calculs, traitement local, contenus et exports conservés. Les deux anciens tests de liste figée ROI/pseudonymiseur deviennent des contrats de route et d’absence de transformation globale pour accepter les livraisons indépendantes.

Hotspot : `public/_headers` et `tests/scripts/roi-delivery-headers.test.mjs` ; conserver les ajouts des PR101/103 lors de leur intégration. Le nouveau test exige aussi la concordance de CSP contact entre fonction et configuration de livraison.

## Preuves réelles avant revue

- Deux tests nouveaux rouges sur main (fonction contact et règle cache absentes), puis six tests ciblés verts.
- Fixture sur Wrangler 4.101.0 / compatibilité 2026-06-23 : 88 requêtes (GET/HEAD simples, ETag, date, Range/If-Range, onze routes). HTMLRewriter réel retire les deux vrais beacons ; comparaison du document intégral, cinq scripts externes témoins, JSON-LD et inline intacts. Les témoins incluent un domaine ressemblant, un chemin local et un autre script sur le domaine Insights.
- Site Astro compilé : même matrice de 88 requêtes PASS, HEAD vide, CSP propre, validateurs originaux retirés, GET intégral. Range sur HTML local ne produit pas de 206 ; aucun 206 réel prétendu. La neutralisation des en-têtes conditionnels/Range est aussi exercée par les unitaires.
- Build complet PASS après correction du second test de liste figée : 150 tests Python et 750 tests scripts PASS, zéro échec (758 cas scripts, skips préexistants).
- `npm run check` avec `npm ci` isolé : zéro erreur, zéro warning, dix hints. Premier check utilisant le node_modules partagé échouait sur pdfjs absent ; aucune dépendance ni environnement utilisateur modifiés.
- Première suite Pages : 117/118 PASS ; unique 404 pendant la reconstruction de dist, suite rejouée sur artefact figé. Une reprise lancée pendant le remplacement des dépendances a été arrêtée : le watcher Wrangler avait redémarré et rencontré un verrou SQLite partagé avec le serveur fixture ; serveur fixture arrêté, runtime redémarré. Aucun PASS attribué à cette exécution interrompue.
- Reprise finale sur Pages stabilisé : **118/118 PASS**, onze recettes de livraison incluses et tous les parcours existants cités ci-dessous ; aucune recette ignorée dans ce passage.
- La recette dédiée navigateur est activée uniquement avec `QA_PAGES_DELIVERY=1` : la preview Astro de CI ne lance pas les fonctions Pages. Ses onze cas sont explicitement ignorés dans cette preview, jamais présentés comme preuve de livraison.

Commande de recette réelle :

    QA_PAGES_DELIVERY=1 QA_URL=http://127.0.0.1:18843 npx playwright test tests/browser/local-surfaces-delivery.spec.ts

Les parcours existants charte, contact (API et Turnstile simulés explicitement, pas un envoi réel), FEC, maturité, hub, quatre outils historiques, prompt expert et vérificateur sont joués sur Pages. Les saisies sont fictives ; les cas dédiés vérifient absence de POST/corps réseau à la saisie, aucune tentative Insights et aucune erreur CSP liée au beacon. Contact conserve ses trois erreurs inline préexistantes SEC-01 : carte séparée, pas d’élargissement CSP ici.

## État de livraison et retour arrière

Ce rapport décrit la qualification locale et le défaut public AVANT livraison, pas une correction de production. CI, revue QA unique de cette extension, fusion et déploiement canonique puis contrôle du domaine public sans query string restent à réaliser. Après QA PASS, publier sans nouvelle revue du fond et archiver GET/HEAD/validateurs/Range, console/réseau, saisies fictives et parcours sur le déploiement réel. Ne pas envoyer de message réel au formulaire de contact ; sa transmission explicite reste validée avec API interceptée.

Retour arrière : retirer uniquement les onze nouvelles fonctions et leurs règles Cache-Control ; conserver CSP, fonctions ROI/pseudonymiseur, ajouts indépendants bibliothèque/générateur et leurs règles.
