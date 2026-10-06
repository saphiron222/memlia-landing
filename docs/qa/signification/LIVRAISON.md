# Seuil de signification en audit — livraison construction

Route : `/outils-comptables-gratuits/seuil-signification-audit`.
Version moteur : `signification-1`. Construction pour revue QA ; aucune publication ni fusion sur main effectuée.

## Décisions et frontière

- Base, source, période et taux saisis par le CAC, sans taux métier par défaut. Planification facultative : taux du seuil exact ou montant direct.
- Décimaux sous forme de fractions BigInt ; arrondi demi-centime vers le haut uniquement à restitution. Le résultat arrondi n’alimente jamais le calcul de planification.
- Calcul exploratoire autorisé sans justification. Choix retenu explicite seulement avec base nommée, période, source, justification et calcul cohérent. Le dossier final ne certifie ni la pertinence des seuils ni une revue accomplie.
- La borne de taux ≤100 et le contrôle de planification ≤signification sont des contrôles arithmétiques, pas une validation normative. La NEP-320 §20 dit « inférieur » : l’adéquation professionnelle reste au CAC, explicitement hors résultat automatique.
- Commentaires conservés à correction ; changement d’entrées depuis validation signalé, choix invalidé. Les noms de préparateur/réviseur sont volontaires et ne valent pas validation.
- Session exclusivement en mémoire. Worker auto-hébergé chargé avec les assets, import et export annulables, aucun résultat partiel appliqué. Les traitements refusés/annulés gardent la session précédente ; le message le dit. Effacement explicite et remplacement confirmé.
- CSV UTF-8 BOM neutralisé, JSON exact versionné, HTML imprimable avec CSP restrictive et échappement. Au-delà de 20 Mo, le JSON est découpé et toutes les parties doivent être reprises ensemble. 100 000 scénarios maximum ; affichage et aperçu paginés par 20 sans troncature des exports.

## Vérifications réellement exécutées

1. Test initial rouge : `node --test tests/scripts/signification.test.mjs`, module moteur absent ; comportement ensuite implémenté et rejoué.
2. Moteur : 13 tests, couvrant les huit cas de fiche, limites et reprise exacte de 100 000 scénarios ; scène : deux tests. Deux tests de headers voisins conservés et mis à jour pour la nouvelle route : 17/17 PASS au total ciblé.
3. `npm run check` : 0 erreur, 0 warning, hints seulement.
4. `npm run regen:generated`, puis `npm run build` : PASS ; 150 tests proof PASS ; suite Node 771 cas, 763 PASS, 8 SKIP préexistants, 0 FAIL. Gardes de requête, blog, services, lastmod et Ressources QA vertes. L’architecture CAC est régénérée avec la route « construite-en-revue », pas « publiée ».
5. `QA_URL=http://127.0.0.1:45873 npx playwright test tests/browser/signification.spec.mjs` : 12/12 PASS sur le dist final servi par Cloudflare Pages local via Wrangler. Parcours nominal, refus, CSV mappé, commentaires, reprise identique, remplacement refusé, neutralisation/injection, 100 000 lignes, annulation et six largeurs.
6. `QA_URL=http://127.0.0.1:45873 node scripts/audit-signification.mjs` : PASS ; 320/375/768/1024/1440/1920, zéro requête après chargement sur calcul/exports/reprise au niveau du contexte navigateur et Worker, localStorage/sessionStorage/cookies/IndexedDB/Cache API vides. En-têtes réellement reçus : `connect-src 'none'`, `no-transform`, `nosniff`. Canonical, H1/OG/headline, WebPage/WebApplication/BreadcrumbList et sitemap vérifiés. Trois entrants indexables : hub, méthode, garanties.
7. `node scripts/render-proofs-v2.mjs --source=docs/design/signification-proof --manifest=docs/qa/signification/proofs-manifest.json --start=41 --check` : PASS, deux actifs conformes. Cadre 1600×900 propre, image sociale 1200×630, chacun <150 Ko. Jeu réellement calculé et interdits promotionnels verrouillés dans le test.
8. Captures pleines pages 375/1440 comparées au gabarit FEC historique. Table mobile effectivement défilable au clavier, actions Ouvrir/Retenir accessibles, focus visible. Un débordement découvert au test a été corrigé : styles des éléments créés en JS explicitement bornés à `.sig`. Captures remises en haut avant capture pour éviter l’artefact de navigation sticky à mi-page.
9. `git diff --check` : PASS.

## Rejouer la revue

Depuis la branche de la PR, `npm ci --no-audit --no-fund`, `npm run build`, puis :

    npx wrangler pages dev dist --ip 127.0.0.1 --port 45873 --show-interactive-dev-session=false
    QA_URL=http://127.0.0.1:45873 npx playwright test tests/browser/signification.spec.mjs
    QA_URL=http://127.0.0.1:45873 node scripts/audit-signification.mjs

Résultats structurés : `audit.json`, `nep320-source.json`, `proofs-manifest.json`. Captures du candidat et du FEC historique dans ce dossier.

La source H2A a été réellement rouverte depuis son référentiel et les extraits exacts §17/20/24 conservés dans `nep320-source.json`. Aucun blog n’est utilisé pour déduire un taux.

## Publication suivante, après la revue enfant

Fusion et déploiement restent à la carte de publication. Vérifier la CI, les données dérivées et les collisions de registres avant fusion ; réexécuter la recette de production sans query string avec `Cache-Control: no-cache`, notamment l’absence de beacon et de requêtes réseau, et créer les suivis J+7/J+28.

Hotspots : `src/data/outils.ts`, `src/data/proofs.ts`, `config/page-intent-contract.json`, `docs/strategy/site-v3/cac/page-intent-plan.json` et `tests/proof/test_build.py`. Les autres constructions CAC sont indépendantes ; conserver leurs ajouts. En cas de conflit sur lastmod/sceaux, repartir de main puis `npm run regen:generated`, pas de fusion manuelle des données dérivées.
