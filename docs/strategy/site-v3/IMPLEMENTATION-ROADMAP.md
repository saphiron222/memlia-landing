# Feuille de route v3 — de la validation à la cadence de quatre par semaine

16 septembre 2026, mise à jour le soir même après le « go » de Kevin. Chaque phase se termine par une preuve, pas par une annonce : suites (Python, Node, Playwright), chaîne de preuve (`build-cluster-plan.py --check`, `test:lastmod`, seal + reaffirm), écran (prévisualisation `pages.dev` puis production).

## Ce qui a été construit le 16 septembre (phase 1, réalisée)

| Élément | Où | Preuve |
|---|---|---|
| Taxonomie : 60 familles en 12 pôles, source unique | `src/data/familles.ts` ; `famille` dans le frontmatter (`src/content.config.ts`) ; pôle `conseil-missions` ajouté au schéma et au pipeline | `npx astro check` 0 erreur ; `tests/proof/test_build.py::test_familles_des_articles_pipeline` |
| Cadence codée : 2 par jour, 4 par semaine ISO | `CANDIDATS_PAR_JOUR_MAX`, `CANDIDATS_PAR_SEMAINE_MAX`, `verifierPlafonds` (`scripts/lib/blog-pipeline.mjs`) | `tests/scripts/blog-pipeline.test.mjs`, `blog-forge.test.mjs` |
| La forge éditoriale : recette → dossier complet → gate → publication scellée | `scripts/blog-forge.mjs` (`preparer`, `sceller`, `publier`), recettes dans `editorial/recettes/<slug>/` | `tests/scripts/blog-forge.test.mjs` : le dossier produit passe `validateDossier` en preview protégée, en production et en mode scellé ; un octet modifié casse le sceau |
| Publication scellée : statut `publie` + reçu `preuves/publication.json` (inventaire sha256), audité à chaque build | `validatePublicationSeal`, mode `publication-scellee` dans `blog:audit` | même test |
| Images de tête : cadre de preuve HTML rendu par Playwright (1920×1080), OG 1200×630, dérivés 768/1200/1600 AVIF et WebP, déclaration automatique dans `images.mjs` | `editorial/templates/cadre-article.html`, forge | rendu vérifié à l'écran ; `test_placeholders_and_briefs` compte 3 AVIF et 4 WebP par article publié |
| Vérificateur de sources réparé pour le réseau réel | `verifySource` : `fetch` et `Agent` du même paquet undici | 5 sources officielles ouvertes et copiées le 16/09 |
| Revues indépendantes : identités `marketing` (grille éditoriale) et `relecteur-metier-ia-memlia` (verdict par affirmation), rendues par un agent distinct de l'auteur | `revues.json` de chaque recette | exigées par le gate (score ≥ 90, verdict « soutient » par claim) |
| Pilier en tête du blog | `src/pages/blog.astro` | `tests/browser/blog.spec.ts` |

## Le cycle d'un article (à rejouer quatre fois par semaine)

1. Écrire la recette : `editorial/recettes/<slug>/recette.json` (métadonnées, sources officielles avec extraits verbatim, affirmations reliées) et `corps.md`.
2. `node scripts/blog-forge.mjs preparer <slug>` : sources ouvertes et copiées le jour même, claims construits, cadre rendu, paquet de revue écrit. Corriger la recette tant que `erreurs` n'est pas vide.
3. Revue indépendante (agent distinct) → `revues.json`.
4. `node scripts/blog-forge.mjs sceller <slug>` : dossier `pret-preview` puis gate complet (build Astro compris).
5. `node scripts/blog-forge.mjs publier <slug>` : `go-production`, `production-check` (build du site), puis statut `publie` et sceau.
6. `npm run lastmod:sync`, `npm run build`, commit par pathspec, push (le push publie), contrôle en ligne sur l'URL immuable `pages.dev`, sitemap renvoyé à Search Console.

Un candidat préparé mais non scellé fait échouer `blog:audit`, donc le build : on ne pousse jamais une recette à moitié jouée.


## Phase 0 — Décision (close le 16 septembre)

Kevin a validé le territoire en l'élargissant (soixante familles), fixé la cadence à quatre par semaine et donné le go d'exécution. Les 34 termes du glossaire et les briefs de la vague 1 sont conservés comme point de départ ; le backlog par famille (quatre angles par famille) remplace le calendrier de 36 articles.

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
