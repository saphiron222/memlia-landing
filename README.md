# Memlia — Landing page

Site vitrine statique de **Memlia** (IA pour les cabinets d'expertise comptable).

## Stack
HTML/CSS statique, polices auto-hébergées, JavaScript inline.
**Aucune dépendance, aucun build.**

## Déploiement — Cloudflare Pages
- Framework preset : **None**
- Build command : *(vide)*
- Build output directory : `/` (racine du dépôt)

Alternative en une commande : `npx wrangler pages deploy .`

## Domaine
URL canonique : `https://memlia.fr/` (à déposer, puis attacher comme *Custom domain* dans Cloudflare Pages).

## Pages
- `index.html` — accueil
- `mentions-legales.html`, `politique-de-confidentialite.html` — pages légales (`noindex`)
- `robots.txt`, `sitemap.xml`, `llms.txt` — SEO / IA
