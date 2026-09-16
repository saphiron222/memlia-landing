# Recette — glossaire Astro

Date : 2026-09-14

Carte : `t_27e8be9f`

Branche : `site/glossaire`

Candidat Cloudflare exact : `https://076f583a.memlia.pages.dev/glossaire`

Alias : `https://preview-glossaire.memlia.pages.dev/glossaire`

## Périmètre livré

- index unique `/glossaire`, sans page autonome `/glossaire/{slug}` ;
- 23 définitions ancrées, triées alphabétiquement sous 11 lettres réellement présentes ;
- recherche progressive : la liste complète et les ancres restent disponibles sans JavaScript ;
- chaque entrée porte définition, contexte, confusion, exemple fictif, frontière d’automatisation, termes voisins, liens utiles, rédaction, état de revue, date de vérification et sources ;
- maillage bidirectionnel limité aux 6 et 5 premières occurrences explicitement approuvées dans les deux articles existants ;
- JSON-LD `CollectionPage`, `DefinedTermSet` avec 23 `DefinedTerm`, `BreadcrumbList`, `Organization` et `WebSite` ; aucun `FAQPage` ;
- canonical unique `https://memlia.fr/glossaire` et une seule URL glossaire dans le sitemap ;
- CTA unique vers le calendrier existant ; navigation globale non modifiée.

La page indique explicitement que la revue métier reste requise. Le candidat est une preview uniquement : il ne vaut ni validation réglementaire, ni publication.

## TDD et témoins négatifs

| Mesure | Résultat |
|---|---:|
| Oracle Python glossaire | 7/7 |
| Suite Python complète au build | 44/44 |
| Playwright glossaire local | 9/9 |
| Playwright complet local | 88/88 |
| Playwright glossaire sur candidat exact | 9/9 |

Les témoins couvrent notamment : 23 ancres uniques, 23 définitions distinctes, minimum de contenu par entrée, absence de page autonome mince, absence de fragments et sous-pages dans le sitemap, liens internes vers routes/fragments réellement rendus, canonical et schéma concordants, métadonnées et sources présentes, liste complète sans JavaScript, recherche vide/restaurée et bouton d’effacement désactivé sans requête. Les deux articles sont vérifiés contre les ensembles approuvés : exactement 6 liens pour le contrôle DSN et 5 pour le suivi social, chaque cible une seule fois.

Le premier build a rougi sur la lecture trop stricte des attributs `<time>` ; l’oracle a été corrigé pour analyser le DOM plutôt que dépendre de l’ordre d’attributs Astro. La recherche a ensuite rougi parce que le style `display:grid` neutralisait `hidden` ; le correctif porte explicitement l’invariant sur la recherche, les entrées et les groupes de lettres. Le bouton d’effacement a enfin été éprouvé rouge quand il restait actif sur une requête vide, puis vert après synchronisation de son état.

## Trois passes

### 1. Suites

- `npm run check` : 85 fichiers, 0 erreur, 0 warning, 1 hint hérité dans `scripts/lighthouse.mjs` ;
- `npm run build` : 8 pages, Python 44/44, images 23, export preview 3/3 ;
- `QA_URL=http://127.0.0.1:4327 npm run test` : 88/88.

Le premier `npm run test` sur le port par défaut 4321 ciblait un serveur concurrent périmé : 35 échecs sur 88, dont `/glossaire` en 404. Cette mesure est rejetée. Le serveur exact de ce worktree a été isolé sur `127.0.0.1:4327`, puis la suite entière a rendu 88/88.

### 2. Chaîne indépendante

L’oracle `tests/proof/test_glossary.py` relit `dist/glossaire.html`, les deux articles HTML et les sous-sitemaps XML sans importer les données TypeScript. Il recompte 23 termes, 11 lettres, les métadonnées, les sources, les 11 liens d’articles approuvés, l’absence de sous-page et la concordance des URL du schéma.

Readback du candidat exact avec query fraîche : HTTP 200, `X-Robots-Tag: noindex, nofollow`, une meta HTML `noindex, nofollow`, 23 entrées, bouton d’effacement réellement `disabled`, canonical de production intact. Le test distant ciblé rend 9/9.

### 3. Écran

Captures finales :

- `.qa/glossaire/final-preview-desktop.png` — 1440 × 1000 ;
- `.qa/glossaire/final-preview-mobile.png` — 375 × pleine page.

La lecture visuelle du candidat exact ne montre ni débordement, ni clipping, ni collision, ni séparateur isolé. Les liens voisins se replient sans virgule orpheline ; leurs lignes ont une cible minimale de 44 px. Le bouton d’effacement est visiblement désactivé au chargement.

## Lighthouse

| Cible | Performance | Accessibilité | Bonnes pratiques | SEO |
|---|---:|---:|---:|---:|
| candidat indexable local, mobile | 100 | 100 | 100 | 100 |
| candidat indexable local, desktop | 100 | 100 | 100 | 100 |
| preview Cloudflare protégée, mobile | 98 | 100 | 96 | 66 |
| preview Cloudflare protégée, desktop | 100 | 100 | 96 | 66 |

Le score SEO 66 de la preview est attendu et non corrigé : le header et la meta `noindex, nofollow` sont précisément la protection exigée. Le 96 distant en bonnes pratiques vient de l’environnement Cloudflare ; le candidat local est à 100 sur les quatre axes.

## Limites et suite

- La revue métier indiquée `Requise avant publication` reste ouverte pour les définitions concernées ; aucune validation réglementaire n’est revendiquée.
- Aucune page autonome n’est ouverte tant que GSC/SERP/reviewer ne justifient pas un job distinct.
- Aucun lien de navigation globale n’a été ajouté, conformément à l’ownership de la carte Hub aval.
- Aucun push, fusion, déploiement de production, publication ou cron.
- La revue croisée marketing est portée par l’enfant précréé `t_ab615a77` après libération du graphe.
