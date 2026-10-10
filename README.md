# Memlia — site Astro

Site statique : compléments Excel sur mesure pour les cabinets. Sources dans `src/`,
assets publics dans `public/`, sortie déployable uniquement dans `dist/`.

## Installer et vérifier

Node.js 22 ou supérieur et Python 3 (bibliothèque standard uniquement). `npm ci`, puis `npx playwright install chromium`.

- `npm run dev` : serveur de développement.
- `npm run check` : typage Astro/TypeScript.
- `npm run placeholders` : crée seulement les images manquantes ; ne remplace pas les images M4.
- `npm run build` : construit quatre pages, génère les sitemaps et retire les briefs de la sortie.
- `npm run test:proof` : oracle Python standard sur `dist/` ; aucun paquet Python requis.
- `npm run preview -- --host 127.0.0.1 --port 4321` : servir manuellement un build pour une revue locale.
- `npm test` : construit puis sert le worktree sur un port isolé appartenant à Playwright ; `QA_URL=https://… npm test` cible explicitement une preview distante sans lancer de serveur local.
- `npm run qa:screens` : captures et contrôle des images visibles sur six largeurs.
- `npm run lighthouse -- http://127.0.0.1:4321/` : quatre scores, seuil 95, échec non masqué.
- Ajouter `--desktop` pour la mesure desktop. Rapports dans `.lighthouse/` et `.qa/`.

## Prévisualisation Cloudflare Pages

### Un seul build par machine

`npm run build` prend un verrou système avant les audits et le conserve jusqu'à la fin
des portes déterministes. Agents, worktrees et runner CI Mac utilisent tous le fichier
`/Users/Shared/memlia-landing-build.lock`, indépendant du dépôt et de `TMPDIR`.
Les suivants annoncent leur attente ; après 45 minutes ils échouent (code 75), sans lancer
leur build. Le runner doit laisser ce temps d'attente dans son budget de job.

Une sortie normale, une erreur ou SIGINT/SIGTERM/SIGHUP ferme le verrou. Les signaux sont
transmis au groupe du build ; les processus qui refusent l'arrêt sont tués après cinq secondes.
Le noyau reprend un verrou orphelin quand ses derniers descripteurs sont fermés : si le
superviseur meurt brutalement mais son enfant tourne encore, ce dernier conserve le verrou.
Le fichier persiste et contient les PID à titre diagnostic : ne jamais le supprimer, même
s'il semble ancien, car un nouvel inode permettrait deux builds concurrents.

Sur un runner hébergé hors Mac, `MEMLIA_BUILD_LOCK=0 npm run build` désactive le verrou
(cette désactivation est refusée sur macOS). Ailleurs, le fichier par défaut est dans le
répertoire temporaire système. Un runner Mac doit garder ce verrou actif ; la CI actuelle
utilise des runners GitHub Ubuntu, sans modifier cette protection des builds locaux Mac.
`npm run build:locked` est l'implémentation interne ; agents et CI doivent appeler `npm run build`,
pas cette étape ni `astro build` directement. Les checkouts antérieurs à ce changement ne
participent pas au verrou et doivent être actualisés avant de construire.

Rejeu sans Astro : `node --test tests/scripts/build-lock.test.mjs` (aussi inclus dans
`npm run test:scripts`). Les options `--lock-file` et `--wait-seconds` du lanceur servent aux
tests isolés ; ne pas changer le chemin commun dans la CI ou les worktrees du Mac.
Le test de concurrence garde le premier build actif jusqu'à l'annonce d'attente du second,
puis le libère explicitement ; il rejoue aussi un démarrage du second retardé de 1,5 seconde.

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
