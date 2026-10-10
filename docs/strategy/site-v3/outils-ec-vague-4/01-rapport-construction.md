# Construction — générateur de relance de facture impayée

Phase de construction terminée localement ; la livraison publique n’est pas approuvée. La finalisation technique t_f4b40722 précède l’unique revue QA t_7d981a8b puis la publication t_98d0d66b.

## Produit livré

- Route `/outils-comptables-gratuits/generateur-relance-facture-impayee`, gabarit Outil et registre catégorie Écrire.
- Une facture ou lot CSV, 5 000 000 octets et 500 factures maximum, Worker annulable, UTF-8/Windows-1252 et séparateur explicitement choisis. Parser strict partagé après lecture de ses API ; lignes physiques conservées même avec cellules multilignes.
- Centimes calculés par BigInt, montants positifs ou nuls jusqu’à 15 chiffres et deux décimales. Blanc distinct de zéro. Devise EUR seulement, jamais conversion.
- Clé client textuelle confirmée avant regroupement ; deux homonymes avec clés différentes restent distincts. Même clé avec noms différents ou référence dupliquée : examen, sans courrier.
- Solde = initial − paiements − avoirs. Soldée/non échue exclues séparément ; litige, solde négatif, montant ambigu, référence absente et date inexistante à examiner. Échéance du jour non dépassée, convention explicitée.
- Objet et corps éditables, copies et exports complets TXT/CSV versionnés. Rapport comprend toutes les exceptions au-delà de la pagination. Formules neutralisées seulement dans le CSV, originaux conservés. Texte utilisateur jamais injecté en HTML.
- Modifier les paramètres garde les éditions mais désactive les exports devenus périmés. Régénération ou remplacement d’un lot demandent confirmation. Effacement explicite et fermeture retirent la mémoire ; aucune reprise implicite par stockage.
- Aucun envoi ni règle contentieuse, pénalité, taux ou délai légal.

## Preuves réellement obtenues

- Test moteur écrit et exécuté avant son implémentation : échec module absent, puis huit comportements PASS.
- `node --test tests/scripts/relance*.test.mjs` : 15 PASS. Moteur, imports, annulation Worker avec message tardif, taille refusée avant lecture, headers/beacon, intention/maillage/HTML/sitemap et preuve scellée.
- `npm run check` : zéro erreur, zéro warning (hints préexistants).
- `QA_URL=http://127.0.0.1:4317 npx playwright test tests/browser/relance-facture.spec.mjs` : neuf PASS sur le build Astro local. Scène 90 EUR/exclusions/litige, 501 refusées sans écrasement, import multiligne, édition conservée, copie réelle, contenu des téléchargements TXT/CSV relu et six largeurs 320/375/768/1024/1440/1920.
- Après chargement local, saisie de signature/message, exemple, calcul, copie et exports : zéro requête observée et localStorage/sessionStorage inchangés. Cette sonde ne prouve pas encore le chemin import sur le déploiement.
- Proof HTML, content-contract, WebP 1600×900 (82 Ko) et OG 1200×630 réellement rendus à partir de trois factures rejouées par le moteur. `node scripts/render-relance-facture-proof.mjs --check` PASS. Contrôle visuel : scène lisible sans troncature, une relance de 90 EUR, une soldée et un litige.
- Trois routes entrantes existantes vérifiées en production : 200 et canonical exacts ; les nouveaux liens ne sont pas encore publiés. Hub/footer automatiques et sitemap outils vérifiés dans le build.
- Ownership : sept PASS, aucun conflit primaire ; vraie autocomplétion (pas de volume inventé). Fiche et contrat commun copiés dans le dossier de stratégie.
- `npm run regen:generated` PASS : lastmod et sceaux dérivés du glossaire régénérés, revue métier existante réaffirmée sans changement du fond.
- `git diff --check` PASS.
- Après le dernier changement d’interface, build Astro, strip des assets internes, rendu public et `npm run test:proof` : 150 PASS ; `npm run test:lastmod` PASS. Les listes attendues de sitemap et d’images OG ont été étendues à la nouvelle route, sans affaiblir les contrôles.

## Ce qui reste à finaliser, sans prétention de PASS

1. Build global et CI : premier arrêt de `npm run build` sur une fixture blog dépendante de la fraîcheur de `prompt chatgpt expert comptable` le 7 octobre. Sonde réelle refaite avec celles de relance, sans changement du blog. Réparation durable du test isolée dans t_6c7022cf. La reprise a atteint les preuves Python mais s’est arrêtée : deux listes d’artefacts attendus à étendre et un rebuild Astro concurrent avaient réintroduit des assets internes dans dist. Listes corrigées et rebuild séquentiel avec strip : 150 preuves PASS. La chaîne `npm run build` entière doit encore être relue jusqu’au bout, notamment tests:scripts et resource:audit:qa ; aucun PASS global revendiqué.
2. Prévisualisation Cloudflare : tentative réelle `wrangler pages deploy dist --project-name=memlia --branch=preview-relance-facture` refusée lors de récupération des account IDs. Pas d’URL de déploiement inventée, aucun secret lu ni nouvelle authentification. La carte technique doit tenter la reprise appropriée puis vérifier les en-têtes et l’absence de beacon sur Cloudflare, pas seulement dans le HTML local.
3. Lighthouse quatre axes ≥95, reflow 400 %, sonde réseau complète y compris import sur preview réel et validation du stockage au-delà de localStorage/sessionStorage restent à obtenir.
4. Captures pleines pages 375/1440 obtenues, mais prises après saut de focus vers le résultat : les sections animées hors viewport apparaissent pâles et l’en-tête sticky est capturé au milieu. Ce n’est pas une preuve visuelle suffisante de toute la page. Parcourir les sections/reduced-motion puis refaire les captures et les comparer aux pages historiques. Tableau horizontal accessible au focus ; une instruction de défilement est maintenant affichée et les boutons de l’outil ont une cible minimale 44 px.
5. Vérifier la CI fraîche et réconcilier les hotspots avec main avant livraison. Ne pas fusionner avant l’unique PASS QA.

## Reproduction

`npm ci` ; `npm run check` ; `npm run regen:generated` ; `npm run build` ; `node --test tests/scripts/relance*.test.mjs` ; `node scripts/render-relance-facture-proof.mjs --check` ; tests navigateur ci-dessus avec un serveur preview local ou l’URL Cloudflare.

Fichiers de preuve : `docs/design/relance-facture-proof/` ; `docs/qa/relance-facture/{node-log.txt,browser-log.txt,proofs-manifest.json,entrants-production.json,demande-autocomplete.json,preview-refus.txt}`. Rapport et copies sources dans `docs/strategy/site-v3/outils-ec-vague-4/`.

Hotspots : src/data/outils.ts, src/data/proofs.ts, config/page-intent-contract.json, registre-requetes.json et données dérivées lastmod/glossaire. Ajouts limités à cet outil ; aucune modification du moteur des autres outils.
