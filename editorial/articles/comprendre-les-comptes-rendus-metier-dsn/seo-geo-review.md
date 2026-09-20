# SEO et préparation aux citations IA — Comprendre les comptes rendus métier DSN : méthode de lecture

Verdict : PASS — 97/100, 0 P0 (revue indépendante du 2026-09-20, barème blog-analyze, heuristique éditoriale, ni facteur Google ni probabilité de citation).

| Catégorie | Score |
| --- | ---: |
| Qualité du contenu | 28/30 |
| SEO | 25/25 |
| E-E-A-T | 14/15 |
| Technique | 15/15 |
| Préparation aux citations IA | 15/15 |
| Total | 97/100 |

## SEO

- Titre de balise à 56 caractères, dans la fourchette 40-60 recommandée, distinct du H1 mais cohérent avec lui.
- Meta description à 144 caractères, cohérente avec le contenu visible, sans troncature apparente ni mot-clé forcé.
- URL stable, lisible et en minuscules : /blog/comprendre-les-comptes-rendus-metier-dsn.
- Hiérarchie de titres propre : un seul H1, puis H2 vers H3 sans saut de niveau, y compris dans les six étapes et la FAQ.
- Quatre liens externes distincts vers des pages tier-1 officielles (net-entreprises.fr), chacun cité en contexte et repris dans « Sources consultées » avec date de consultation.
- Canonical et Open Graph (image 1200x630 avec largeur et hauteur déclarées, alt renseigné) cohérents avec le titre et la description de la page.

## Préparation aux citations

- La section « Réponse directe » ouvre l'article sur une réponse autonome de 75 mots, extractible sans le reste du contexte.
- Cinq questions de FAQ répondent chacune en une à trois phrases autonomes, la source étant nommée dans la réponse quand elle existe.
- Chaque définition clé (CRM, bilan d'anomalies, certificat de conformité) est posée une seule fois puis réutilisée sans synonymie flottante, ce qui limite l'ambiguïté d'entité pour un moteur de réponse.
- Les citations sont attribuées nommément à Net-entreprises avec lien direct vers la page officielle, un signal de vérifiabilité pour une réponse générée par IA.
- Aucun schema FAQPage n'est déclaré malgré la section Questions fréquentes visible ; le guide de notation du site traite ce balisage comme optionnel et sans bonus, donc non pénalisant ici.
- Le robots « noindex, follow » observé dans ce rendu est propre au harnais de prévisualisation QA (bandeau « Candidat éditorial ») et ne décrit pas le comportement de la page une fois publiée.

## Réserves mesurées

- Le score Lighthouse (performance, accessibilité, SEO, Core Web Vitals) n'a pas été mesuré dans cette revue ; l'appréciation technique s'appuie sur une lecture du code (preload de polices, fetchpriority sur l'image hero, formats AVIF/WebP), pas sur un audit chronométré.
- La citation réelle de cette page par des moteurs IA (AI Overviews, Perplexity, ChatGPT) n'est pas mesurée ; le jugement porte sur la structure d'extraction (réponse directe, FAQ, tableaux à <thead>), pas sur une citation observée en production.
- Le rendu mobile (320-768px, cibles tactiles, absence de défilement horizontal) n'a pas été vérifié visuellement dans un navigateur ; l'appréciation s'appuie sur les media queries et les unités clamp() lues dans le CSS.
- Le score de lisibilité (Flesch ou équivalent français) n'a pas été calculé par un outil dédié ; la densité de certaines phrases longues à clauses multiples est une lecture qualitative, pas une mesure.
