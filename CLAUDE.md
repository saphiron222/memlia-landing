# CLAUDE.md — memlia.fr

Site public de **Memlia** (SASU, Plérin) : l'IA pour les cabinets d'expertise comptable. Markdown français.
Dépôt privé `saphiron222/memlia-landing`, poussé sur `main` par Kevin, déployé sur **Cloudflare Pages**.

## Ce que ce dépôt est, et ce qu'il n'est pas

| Il fait | Il ne fait pas |
|---|---|
| le site public et le blog : présenter l'offre, capter, convertir | livrer du produit — les compléments Excel vivent dans `~/dev/produit*` |
| parler le vocabulaire réel des cabinets (paie, DSN, bulletin, portefeuille) | promettre des fonctions qu'aucun module ne livre |

**Ce qui se vend, et qui doit transparaître :** des compléments Excel (Office.js sans macro, et COM/.NET
pour la ligne bureau) greffés sur les classeurs que le cabinet utilise déjà. On n'ôte pas Excel au cabinet,
on l'automatise en place. Positionnement : un **résultat livré**, la règle du cabinet codée et éprouvée sur
ses propres fichiers, avec proposition puis validation humaine ; prix à la complexité, jamais au siège.

## Stack

Site **Astro** (content collections pour le blog, sitemap, RSS), déployé sur Cloudflare Pages via `wrangler`.
Polices auto-hébergées dans `public/fonts`. Tests Playwright (`playwright.config.ts`, variante mobile).

```bash
npm ci && npm run build          # build
npx astro check                  # types et contenu : doit rendre 0 erreur
npx playwright test              # suite navigateur
```

## Charte

Vert `#27b657`, vert profond `#1c8a41`, crème `#fffefb`, surface `#fcfbf7`, encre `#231f20`.
Titres **Fraunces**, corps **Hanken Grotesk**. Lockup : le « M » collé à « emlia ».
Structure et langage visuel inspirés de navattic.com, **recodés de zéro** — jamais leur code, leurs images
ni leurs textes. Toutes les images sont **générées** (outil `image_generate`) sur brief écrit, avec `alt`
rédigé, en WebP/AVIF ; les captures produit viennent du banc Windows, sur le jeu de test fictif.

## Règles non négociables

- **Rien n'est publié sans Kevin.** Tu travailles sur une branche `site/<sujet>`, tu déploies une
  **prévisualisation** (`npx wrangler pages deploy dist --project-name memlia --branch preview-<sujet>`)
  et tu donnes l'URL. La production (`--branch main`) et `git push` sont **interdits** : Kevin s'en charge.
- **Le SEO acquis ne régresse pas** : `title`, `description`, canonical, Open Graph, JSON-LD (Organization,
  WebSite, SoftwareApplication, FAQPage), `robots.txt`, sitemap, `llms.txt`, pages légales en `noindex`,
  `lang="fr"`, un seul `h1`. Lighthouse ≥ 95 sur les quatre axes.
- **Aucune donnée client réelle**, aucun chiffre non sourcé, aucune promesse au-delà des modules livrés.
- Principes affichés et tenus : l'IA prépare, l'humain décide ; anti-surveillance (agrégats, jamais nominatif) ;
  RGPD et secret professionnel.
- Contenu paie et fiscal : **fact-check obligatoire**, sources datées.

## Agent skills

### Issue tracker

Les issues et specs vivent en markdown sous `.scratch/<chantier>/issues/NN-titre.md` — pas GitHub Issues
(dépôt privé, pas de PR interne). Chaque fiche porte un en-tête `Status:` et, s'il y a lieu, `Blocked by:`.
Même convention que `~/dev/produit-banque/memlia-desk`, dont les fiches servent de référence de forme.

### Triage labels

Vocabulaire canonique : `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`.

### Domain docs

Single-context : un `CONTEXT.md` et `docs/adr/` à la racine, créés paresseusement par `domain-modeling`
quand un terme ou une décision se fixe réellement. Le vocabulaire du site doit rester aligné sur celui des
modules produit : bulletin, DSN, portefeuille, pôle social, collaborateur, écart, divergence.

### Consigne de chantier

Avant toute refonte ou ajout de page, lire `docs/2026-09-08-consigne-site.md` : références visuelles,
interdits, livraison par prévisualisation.
