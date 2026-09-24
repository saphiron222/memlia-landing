# CLAUDE.md — memlia.fr

Site public de **Memlia** (SASU, Paris 8ᵉ — RCS Paris 108 621 541) : l'IA pour les cabinets d'expertise comptable. Markdown français.
Dépôt privé `saphiron222/memlia-landing`, poussé sur `main` par Kevin, déployé sur **Cloudflare Pages**.

## Ce que ce dépôt est, et ce qu'il n'est pas

| Il fait | Il ne fait pas |
|---|---|
| le site public et le blog : présenter l'offre, capter, convertir | livrer du produit — les automatisations livrées vivent dans `~/dev/produit*` |
| parler le vocabulaire réel des cabinets (paie, DSN, bulletin, portefeuille) | promettre une fonction qu'aucune automatisation livrée ne fait |

**Ce qui se vend, et qui doit transparaître : l'automatisation IA des tâches répétitives d'un cabinet
d'expertise comptable.** Un service, pas un logiciel : observer la tâche, écrire sa règle et ses limites dans
les mots du cabinet, automatiser **dans les outils existants**, éprouver sur un jeu d'essai fictif, recetter,
maintenir. Proposition puis validation humaine ; prix à la complexité, jamais au siège. Le **véhicule** se
choisit par tâche (panneau Office.js sur un classeur, add-in COM/.NET, application de bureau) et n'est
jamais la catégorie commerciale : ⚠ **« module » et « complément Excel » ne s'écrivent sur aucune surface
publique** — charte §9, verrouillé par `tests/proof/test_positioning.py`. Excel est une intégration
possible, jamais un mot du hero (charte §4).

## Stack

Site **Astro** (content collections pour le blog, sitemap, RSS), déployé sur Cloudflare Pages via `wrangler`.
Polices auto-hébergées dans `public/fonts`. Tests Playwright (`playwright.config.ts`, variante mobile).

```bash
npm ci && npm run build          # build
npx astro check                  # types et contenu : doit rendre 0 erreur
npx playwright test              # suite navigateur
```

## Message et copy

**La charte de message fait foi : `.agents/product-marketing.md` (v3, 17/09/2026).** Toute surface publique
(site, blog, LinkedIn, devis, prise de parole) suit son angle (« Votre cabinet tourne sur un savoir-faire que
personne n'a écrit »), sa promesse (toute tâche répétitive, prise entière), sa voix (« nous », concret,
confiant) et ses interdits. Une phrase qui la contredit se corrige ; une phrase qu'elle ne couvre pas se
discute dans la charte avant d'être publiée. Le copy des pages vit dans `src/data/pages-v2.mjs`,
`src/data/site.mjs`, `src/data/faq.ts`, les sections de l'accueil et les pages ; `public/llms.txt` le reflète.

## Charte

Vert `#27b657`, vert profond `#1c8a41`, crème `#fffefb`, surface `#fcfbf7`, encre `#231f20`.
Titres **Fraunces**, corps **Hanken Grotesk**. Lockup : le « M » collé à « emlia ».
Structure et langage visuel inspirés de navattic.com, **recodés de zéro** — jamais leur code, leurs images
ni leurs textes. Toutes les images sont **générées** (outil `image_generate`) sur brief écrit, avec `alt`
rédigé, en WebP/AVIF ; les captures produit viennent du banc Windows, sur le jeu de test fictif.

## Règles non négociables

- **Distinguer push et publication.** Décision Kevin du 24/09/2026 : l'agent peut pousser sans
  nouveau « go » une branche de travail non destructive pour ouvrir ou actualiser une PR, après
  vérification du diff, du dépôt et du SHA ciblés. Le push forcé et la suppression de branches
  distantes restent interdits. Tu travailles sur une branche `site/<sujet>`, tu déploies une
  **prévisualisation** (`npx wrangler pages deploy dist --project-name memlia --branch preview-<sujet>`)
  et tu donnes l'URL. La fusion d'une PR, le push vers `main`, le déploiement de production
  (`--branch main`) et la publication de contenu suivent le contrat explicite de la carte et leurs
  contrôles propres ; l'autorisation d'un push de branche ne les approuve pas automatiquement.
- **Le SEO acquis ne régresse pas** : `title`, `description`, canonical, Open Graph, JSON-LD (Organization,
  WebSite, Service, FAQPage), `robots.txt`, sitemap, `llms.txt`, pages légales en `noindex`,
  `lang="fr"`, un seul `h1`. Lighthouse ≥ 95 sur les quatre axes.
- **Aucune donnée client réelle**, aucun chiffre non sourcé, aucune promesse au-delà de ce qui est livré.
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
interdits de copie, livraison par prévisualisation. ⚠ Son volet **copy** est périmé depuis le 17/09 :
la charte `.agents/product-marketing.md` fait seule foi sur le message, et gagne en cas de désaccord.
