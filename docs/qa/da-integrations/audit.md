# Audit DA — Intégrations

Date de mesure : 21/09/2026.
Périmètre : `/integrations`, neuf guides, `/automatisation-cabinet-comptable` et footer global.
Captures sources : `avant/` et `apres/`, en 1440 px et 375 px, pleine page.

## Cause du vert trompeur

Le candidat source `b57f54e` puis la release `0cdd367` satisfaisaient les contrôles qui existaient : contenu, intention SEO, liens, métadonnées, absence de débordement et responsive. Ils ne satisfaisaient pas le contrat de design demandé par la carte pSEO : le gabarit `IntegrationGuide` formait une grammaire parallèle, les routes Intégrations n’étaient pas inscrites dans le contrat universel avec un minimum de média propre, et aucun garde ne reliait l’actif rendu à sa source HTML, son contrat, ses dimensions, son poids et son empreinte. Un test de largeur pouvait donc être vert avec une page à plat et sans preuve dédiée.

La correction porte sur la cause : les dix routes passent désormais par `PageCommerciale`, les primitives partagées vivent dans `src/components/sections/`, les dix médias ont une recette et un manifeste propres, et `verify-page-contract.mjs` contrôle composition, propriété des médias, empreintes, footer et maillage dans la chaîne `build:site`.

## Ligne directrice mesurée

| Axe | Références historiques | Contrat retenu pour Intégrations |
| --- | --- | --- |
| Ordre | fil d’Ariane → hero → preuve → règle → limites → sources → CTA | même ordre ; le hub remplace règle/limites par les familles Sage, Cegid et Silae |
| Largeur | texte 672–800 px ; H1 jusqu’à 1050 px ; preuve jusqu’à 1200 px | mêmes bornes dans `PageCommerciale` |
| Rythme | 96 px entre sections, 128 px sur grand écran | `.pv` canonique, sans empilement local concurrent |
| Grille | 1 colonne mobile ; 2 à 768 px ; 3 à 1024 px pour les triptyques | cartes et bandes `pv-*`, mêmes ruptures |
| Typographie | Fraunces pour les titres ; Hanken Grotesk pour le corps | tokens `--police-titre`, `--police-corps` ; pas de famille locale |
| Surfaces | crème/feuille, lignes neutres, carte et écran via tokens | `--surface-page`, `--surface-feuille`, `--ligne`, `--r-carte`, `--r-ecran` |
| Preuve | cadre 16:9, 1600×900, bordure, rayon écran, ombre légère | dix WebP distincts, 48–56 Ko, aucun actif partagé |
| Mouvement | révélations `rv` et transition ciblée ; reduced-motion lisible | primitives canoniques, aucun `transition: all` |
| CTA | une action principale « Confier une première tâche » vers `/contact` | identique sur le hub et les guides |
| Sources | organisme, rôle, limite et date consultée séparés | `SourceEvidence.astro`, réutilisé par `PageEvidence` et les guides |
| Footer | colonnes de navigation + bandeau légal inférieur | cinq colonnes équilibrées ; chaque lien légal rendu exactement une fois |

## Avant / après

Avant : pages à plat, preuve générique ou absente, listes techniques dans `/automatisation`, métadonnées internes trop saillantes et deux occurrences de chaque lien légal.

Après : composition commerciale canonique, preuve propre par route, familles d’intégrations éditorialisées, source bornée dans un composant partagé, retour au moyeu explicite et footer dédupliqué.

La revue visuelle des captures `apres/` a été faite avec `prefers-reduced-motion: reduce` afin de contrôler la totalité du contenu sans confondre un état d’entrée animé avec un vide de mise en page.