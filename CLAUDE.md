# CLAUDE.md — memlia.fr

Site public de **Memlia** (SASU, Paris 8ᵉ — RCS Paris 108 621 541) : l'automatisation IA des tâches répétitives des cabinets d'expertise comptable et de commissariat aux comptes. Markdown français.
Dépôt privé `saphiron222/memlia-landing`, intégré sur `main` sous garde PR, déployé sur **Cloudflare Pages**.

## Ce que ce dépôt est, et ce qu'il n'est pas

| Il fait | Il ne fait pas |
|---|---|
| le site public et le blog : présenter l'offre, capter, convertir | livrer du produit — les automatisations livrées vivent dans `~/dev/produit*` |
| parler le vocabulaire réel des cabinets (paie, DSN, bulletin, portefeuille) | promettre une fonction qu'aucune automatisation livrée ne fait |

**Ce qui se vend, et qui doit transparaître : l'automatisation IA des tâches répétitives d'un cabinet
d'expertise comptable ou de commissariat aux comptes.** Un service, pas un logiciel : observer la tâche, écrire sa règle et ses limites dans
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

Ces trois commandes complètes tournent dans la CI GitHub (« Repository gates », obligatoire pour
fusionner dans `main`) : son verdict sur le SHA exact fait foi. Sur le Mac, ne lancer que les tests
ciblés du changement et, si la copy, le menu ou le pied de page changent, `npm run regen:generated`.

Les fixtures de `blog-forge.test.mjs` utilisent un mardi fixe précédé d'un lundi et une horloge
à midi UTC, restaurée après chaque test. Les scénarios de minuit Paris gardent leur propre horloge ;
les Cicatrices gardent un samedi de publication. Ne pas dater les recettes de test avec le jour réel.
`node --test tests/scripts/blog-forge-clock.test.mjs` rejoue les scénarios de sources, report,
Cicatrices et claims sous des horloges de vendredi, samedi et dimanche, en UTC et America/Los_Angeles.
La suite complète reste jouée une fois ; ce contrat entre dans `npm run test:scripts`.

## Message et copy

**La charte de message fait foi : `.agents/product-marketing.md` (v5, 06/10/2026).** Toute surface publique
(site, blog, LinkedIn, devis, prise de parole) suit son angle (« Votre cabinet tourne sur un savoir-faire que
personne n'a écrit »), sa promesse (toute tâche répétitive, prise entière), sa voix (« nous », concret,
confiant) et ses interdits. Une phrase qui la contredit se corrige ; une phrase qu'elle ne couvre pas se
discute dans la charte avant d'être publiée. Le copy des pages vit dans `src/data/pages-v2.mjs`,
`src/data/site.mjs`, `src/data/faq.ts`, les sections de l'accueil et les pages ; `public/llms.txt` le reflète.

Pour les CAC, appliquer les personas, le lexique normatif et la fiche outil de la charte : Memlia prépare ;
le CAC apprécie les données et l'outil, documente ses travaux et conserve son opinion et sa responsabilité.
Le secret et l'indépendance se cadrent par mission ; aucun rapprochement entre production et audit des mêmes comptes n'est vendu comme une synergie.

## Charte

Vert `#27b657`, vert profond `#1c8a41`, crème `#fffefb`, surface `#fcfbf7`, encre `#231f20`.
Titres **Fraunces**, corps **Hanken Grotesk**. Lockup : le « M » collé à « emlia ».
Structure et langage visuel inspirés de navattic.com, **recodés de zéro** — jamais leur code, leurs images
ni leurs textes. Toutes les images sont **générées** (outil `image_generate`) sur brief écrit, avec `alt`
rédigé, en WebP/AVIF ; les captures produit viennent du banc Windows, sur le jeu de test fictif.

## Règles non négociables

- **Livraison (constitution Hermes du 03/10/2026, `~/hermes/AGENTS.md` §5).** Tu travailles sur une
  branche `site/<sujet>` et la pousses librement : `git push` non destructif, après contrôle du dépôt, de
  la branche et du diff, puis vérification du SHA distant et de la CI. La fusion sur `main` suit dès que la
  CI est verte et qu'**une** revue indépendante est PASS (QA pour le code, `metier` pour le contenu
  réglementé) ; une correction du même candidat repasse la même revue. Le blog se publie seul : `main` →
  Cloudflare Pages, jamais par un déploiement manuel de production (`--branch main`). Une
  **prévisualisation** reste possible (`npx wrangler pages deploy dist --project-name memlia --branch
  preview-<sujet>`). Le push forcé, la suppression de branche distante et toute refspec destructive restent
  interdits. Kevin n'est sollicité que pour les quatre cas de la constitution (§1) ; le reste, tu le tranches.
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
