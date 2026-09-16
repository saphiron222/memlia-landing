# Feuille de route v3 — de la validation à la quatrième vague

16 septembre 2026. Chaque phase se termine par une preuve, pas par une annonce : suites (Python, Node, Playwright), chaîne de preuve (`build-cluster-plan.py --check`, `test:lastmod`, seal + reaffirm), écran (prévisualisation `pages.dev` puis production).

## Phase 0 — Décision (cette semaine)

Kevin valide ou amende : le territoire (onze familles, `audit-cac` dormant), la cadence (3/mois, 2 le premier mois), les 34 termes, les neuf briefs de la vague 1. Tant que cette phase n'est pas close, rien n'est créé dans `src/`.

## Phase 1 — Enablers de code (semaines 1 et 2, une seule branche `site/v3-enablers`)

| Tâche | Fichiers | Preuve |
|---|---|---|
| Étendre `sujets` (12 valeurs de plus) | `src/content.config.ts`, `tests/proof/test_build.py` | `npx astro check` 0 erreur ; test qui refuse un sujet hors liste |
| Cadres de preuve HTML par famille (11 cadres 1600×900 + recadrage OG) | `docs/design/site-v2-proofs/`, `scripts/render-proofs-v2.mjs --adopt`, `src/data/proofs.ts`, `src/data/images.mjs` | `--check` vert ; compteurs `test_build.py` ajustés |
| Glossaire vague 1 (18 termes) | `src/data/glossary.ts`, `editorial/resources/glossaire/manifest.json`, `tests/proof/test_glossary.py` | 41 ancres rendues ; `resource:seal-surfaces` + `reaffirm` ; `test_aucune_mention_de_processus_rendue` |
| Pilier en tête du blog | `src/pages/blog/index.astro`, `tests/browser/blog.spec.ts` | Playwright : le pilier est le premier lien de la liste |
| Registre lastmod | `npm run lastmod:sync` puis `npm run build` | `test:lastmod` vert |

Livraison : prévisualisation `wrangler pages deploy dist --branch preview-v3-enablers`, vérification octet à octet `PREVIEW_SOURCE=dist QA_URL=<url> node scripts/verify-preview.mjs`, puis fusion sur `main` (le push publie).

## Phase 2 — Vague 1, mois 1 (octobre 2026)

1. `npm run blog:create automatiser-un-cabinet-comptable-la-carte-des-taches "Automatiser un cabinet comptable : la carte des tâches"` ; copier le brief validé dans le dossier candidat ; rédiger ; `blog:verify-source` pour chaque source ; `blog:gate` ; `blog:preview` ; `blog:review` (revue métier IA) ; `blog:production-check`.
2. Même chaîne pour `automatiser-la-relance-des-pieces-clients`.
3. Relier les trois articles publiés au pilier (une ligne chacun) et réadopter leurs dossiers scellés par `node scripts/migrate-published-blog.mjs`.
4. `npm run lastmod:sync`, build, push, contrôle en ligne, demande d'indexation des nouvelles URL dans Search Console (barre d'inspection de la propriété).

## Phase 3 — Vague 1, mois 2 et 3

Sept satellites (voir `CONTENT-CALENDAR.md` : trois en M2, quatre en M3), dans l'ordre des priorités : familles observées sur le terrain d'abord (facturation-recouvrement, administratif-secretariat). Après chaque publication : `build-cluster-plan.py --check` (liens entrants ≥ 3, aucune orpheline), sitemap, RSS.

## Phase 4 — Mesure à M+3 (fin décembre 2026)

Relevé Search Console par page (`gsc_query.py` du skill `seo`) : requêtes avec impressions par cluster, pages indexées, demandes de contact citant une tâche. Application des seuils de `SEO-STRATEGY.md` §8 : un cluster sans impression après trois satellites ne reçoit pas de deuxième vague, ses créneaux vont à une famille qui en a. Facette « par tâche » du hub Ressources livrée à ce moment (vague 2 de l'architecture).

## Phases 5 à 7 — Vagues 2, 3, 4 (janvier à septembre 2027)

Neuf articles par vague, glossaire vague 2 (16 termes) avec la vague 2. Une relecture trimestrielle des articles paie et fiscaux (dates, sources, `dateMiseAJour`), un article non relu depuis six mois passe en `a-maintenir`. Bilan à M+12 et v4.

## Ce que cette feuille de route ne fait pas

- Elle ne crée aucune page commerciale par famille : la règle anti-catalogue reste (une page de conversion décrit une chose livrée).
- Elle ne fixe pas de cible de trafic. Elle fixe des seuils de décision.
- Elle ne remplace pas les cartes Hermes : elles seront créées quand Kevin le dira, une par phase.
