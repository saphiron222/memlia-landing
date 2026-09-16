# Site v3 — élargir l'éditorial à toute tâche automatisable du cabinet

16 septembre 2026 — validée par Kevin (« sinon go ») avec deux amendements : quatre articles par semaine, et soixante familles de tâches (`src/data/familles.ts`) au lieu de onze. En exécution : la forge éditoriale (`scripts/blog-forge.mjs`) publie les articles depuis `editorial/recettes/`, chaque dossier étant scellé sur ses octets à la mise en ligne (`preuves/publication.json`). Produit avec les skills `seo`, `seo-plan` et `seo-cluster` (expansion, classification d'intention, recouvrement SERP qualitatif, hub-and-spoke, matrice de liens, carte interactive).

## À lire, dans l'ordre
1. [Stratégie](SEO-STRATEGY.md) : le constat, la thèse, la carte des onze familles, la différenciation, les seuils de décision.
2. [Concurrents](COMPETITOR-ANALYSIS.md) : qui occupe chaque famille, en quel format, et l'espace libre.
3. [Architecture](SITE-STRUCTURE.md) : pilier, satellites, règles d'URL, matrice de liens, enablers de code.
4. [Calendrier](CONTENT-CALENDAR.md) : généré depuis [backlog-v3.json](backlog-v3.json) (236 angles, quatre par famille) à quatre articles par semaine ; les trois articles historiques et le pilier y figurent.
5. [Glossaire](GLOSSARY-PLAN.md) : 34 termes automatisation, IA, données, cadre ; la vague 1 (20 termes) est rédigée dans [glossaire-vague-1.json](glossaire-vague-1.json), à intégrer par la chaîne Ressources.
6. [Exécution](IMPLEMENTATION-ROADMAP.md) : phases, commandes, contrôles.
7. [Plan de cluster](cluster-plan.md), [données](cluster-plan.json), [carte interactive](cluster-map.html) : ouvrir `cluster-map.html` dans un navigateur.
8. [Briefs de la vague 1](cluster-briefs/) : neuf briefs au format `editorial/templates/brief.md`, prêts pour `npm run blog:create` après validation.

## Vérification
`python3 docs/strategy/site-v3/build-cluster-plan.py --check` depuis la racine du dépôt : régénère `cluster-plan.json`, `cluster-plan.md` et `cluster-map.html` depuis la source unique (les listes du script) et vérifie l'unicité des slugs et des requêtes primaires, l'appartenance des clusters, rôles et formats aux énumérations du schéma du blog, le lien obligatoire satellite ↔ pilier, le minimum de trois liens entrants par article, l'absence d'orpheline et la répartition mensuelle.

## Ce qui attend Kevin
- Territoire validé et élargi : soixante familles en douze pôles, `audit-legal` listée mais fermée.
- Cadence validée : 4 par semaine, 2 par jour au plus (`CANDIDATS_PAR_SEMAINE_MAX`, `CANDIDATS_PAR_JOUR_MAX`).
- Valider la liste des 34 termes et l'ordre des deux vagues.
- Valider les neuf briefs de la vague 1, à commencer par « Automatiser la relance des pièces clients ».
- Dire quand relancer Hermes (cartes de chantier) : pas avant.

## Limites
Volumes et positions ND hors les deux requêtes chiffrées du 12/09 (10/mois chacune). Le recouvrement SERP est lu sur des relevés WebSearch (listes de 6 à 12 URL), pas sur un top 10 organique exact : les regroupements sont des regroupements de cohérence éditoriale, comme au 10/09. Les dates de la facture électronique et de l'AI Act ne sont pas affirmées ici ; elles se relèvent à la rédaction.
