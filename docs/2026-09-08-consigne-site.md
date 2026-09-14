# Consigne — refonte de memlia.fr (posée le 08/09/2026)

Tu es un worker Hermes sur UNE carte du chantier « nouveau site ». Dépôt : `~/dev/interne/memlia-landing` (HTML statique aujourd'hui,
Cloudflare Pages, `wrangler` connecté). Le site final vit dans le même dépôt, en **Astro** (content collections pour le blog).

## Références, et ce qu'on en prend
- **Design = navattic.com**, export local `/Users/kevinkitanga/Downloads/www.navattic.com/www.navattic.com/index.html` (+ CSS/JS du dossier).
  On reproduit la **structure** (ordre et rôle des sections, grille, espacements, rythme typographique, tailles, composants : nav, hero,
  logos, bandes de fonctionnalités, témoignages, CTA, footer) et le **langage visuel** (arrondis, ombres, animations d'apparition,
  survols). On **recode tout de zéro**. Interdits : copier leur HTML/CSS/JS, leurs images, leurs textes, leur logo, leurs marques.
- **Copy = positionnement de rillet.com**, transposé en service pour les cabinets d'expertise comptable (voir SOUL du profil marketing
  et la proposition « positionnement » validée dans le coffre). On s'inspire de la structure argumentative, on n'écrit que du texte
  original, en français, ancré paie/DSN/Excel/cabinet.
- **Charte Memlia** : vert `#27b657` / `#1c8a41`, crème `#fffefb`, surface `#fcfbf7`, encre `#231f20`, Fraunces (titres), Hanken Grotesk
  (corps), lockup « M » collé à « emlia ». Les polices sont dans `fonts/`.
- **Images** : 100 % générées avec l'outil `image_generate` (GPT) du profil marketing, à partir d'un brief par image (sujet, cadrage,
  palette, sans texte incrusté) ; `alt` rédigé ; formats WebP/AVIF, `srcset`. Captures produit : banc Windows, jeu fictif uniquement.

## Ce qui ne bouge pas
- Le SEO acquis : `title`, `description`, canonical, OG, JSON-LD (Organization, WebSite, SoftwareApplication, FAQPage), `robots.txt`,
  `sitemap.xml` (généré par Astro), `llms.txt`, pages légales `noindex`, `lang="fr"`. Un seul `h1`. Score Lighthouse ≥ 95 sur les 4 axes.
- Aucune donnée client, aucune promesse au-delà des modules livrés, principes « l'IA prépare, l'humain décide » et anti-surveillance.

## Livraison
- Branche `site/<sujet>` dans un worktree, commits `type(portée): …`, **jamais `git push`** (Kevin pousse).
- Prévisualisation : `npx wrangler pages deploy dist --project-name memlia --branch preview-<sujet>` puis l'URL sur Telegram
  (profil marketing). Production **uniquement** sur le « go » de Kevin (branche `main`, interdite par politique aux workers).
- Fin de carte : `kanban_request_review` (revue croisée) avec résumé, URL de preview, planchers Lighthouse, ce qui reste.
