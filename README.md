# Memlia — site Astro

Site statique : compléments Excel sur mesure pour les cabinets. Sources dans `src/`,
assets publics dans `public/`, sortie déployable uniquement dans `dist/`.

## Installer et vérifier

Node.js 22 ou supérieur. `npm ci`, puis `npx playwright install chromium`.

- `npm run dev` : serveur de développement.
- `npm run check` : typage Astro/TypeScript.
- `npm run placeholders` : crée seulement les images manquantes ; ne remplace pas les images M4.
- `npm run build` : construit quatre pages, génère les sitemaps et retire les briefs de la sortie.
- `npm run test:proof` : oracle Python standard sur `dist/` ; aucun paquet Python requis.
- `npm run preview -- --host 127.0.0.1 --port 4321` : servir le build dans un autre terminal.
- `npm test` : tests Playwright sur ce serveur (ou `QA_URL=https://… npm test`).
- `npm run qa:screens` : captures et contrôle des images visibles sur six largeurs.
- `npm run lighthouse -- http://127.0.0.1:4321/` : quatre scores, seuil 95, échec non masqué.
- Ajouter `--desktop` pour la mesure desktop. Rapports dans `.lighthouse/` et `.qa/`.

## Prévisualisation Cloudflare Pages

Le projet live s’appelle **memlia**, pas `memlia-landing` (vérifié avec Wrangler).
Après build : `npx wrangler pages deploy dist --project-name memlia --branch preview-astro-m3 --commit-dirty=true`.
Ne jamais déployer la racine. Aucun push, aucune production sans le go distinct de Kevin.
Lors de l’intégration autorisée : preset Astro, commande `npm run build`, dossier `dist`.
La configuration de production Cloudflare n’a pas été modifiée par M3.

Les previews reçoivent `X-Robots-Tag: noindex` de Cloudflare : le SEO Lighthouse distant
est donc dégradé volontairement. Ne pas retirer ce garde-fou pour verdir le score.
Cloudflare injecte aussi son analytics : les erreurs éventuelles du beacon doivent être
rapportées séparément des erreurs du site. Le build local est mesuré sans cette injection.

## Contenus et suite

- Accueil, légales `noindex` et vraie page 404 ; canonique `https://memlia.fr/`.
- JSON-LD et FAQ partagent les mêmes données ; `robots.txt`, `llms.txt` et sitemap conservés.
- Collection blog Zod dans `src/content.config.ts` ; vide volontairement avant M5.
- M4 remplace les placeholders selon les 11 briefs `public/images/brief-*.md`.
- Rapport de livraison : `docs/qa/2026-09-08-m3.md`. Revue obligatoire M3-R avant la suite.
