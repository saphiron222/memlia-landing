# SEO et préparation aux citations IA — Automatiser un cabinet comptable : la carte des tâches

Verdict : PASS — 96/100, 0 P0 (revue indépendante du 2026-09-16, barème blog-analyze, heuristique éditoriale, ni facteur Google ni probabilité de citation).

| Catégorie | Score |
| --- | ---: |
| Qualité du contenu | 27/30 |
| SEO | 25/25 |
| E-E-A-T | 14/15 |
| Technique | 15/15 |
| Préparation aux citations IA | 15/15 |
| Total | 96/100 |

## SEO

- Titre de balise à 52 caractères et meta description à 152 caractères, tous deux dans les bornes d'affichage SERP recommandées.
- Canonical auto-référent correct vers https://memlia.fr/blog/automatiser-un-cabinet-comptable-la-carte-des-taches.
- Hiérarchie H1 vers H2 vers H3 sans saut, dix-neuf H2 et quatre H3 de FAQ, cohérente avec un format pilier.
- Cinq liens sortants, tous vers des domaines tier-1 officiels (service-public.gouv.fr, cnil.fr deux fois, impots.gouv.fr, net-entreprises.fr).
- Environ seize liens internes contextuels (ancres de glossaire, articles publiés du pôle paie, pages méthode/garanties/ressources), cohérent avec une architecture pilier vers des pages filles.
- Meta robots noindex, follow sur ce rendu de prévisualisation : à retirer explicitement avant toute mise en production.

## Préparation aux citations

- Le bloc Réponse directe ouvre l'article avant toute autre section, au format réponse directe idéal pour une extraction par un AI Overview.
- Trois définitions en gras (tâche automatisable, règle de cabinet, frontière d'automatisation) fournissent des entités nommées et non ambiguës, réutilisées ensuite sans dérive terminologique.
- Onze tableaux structurés avec en-têtes offrent des blocs comparatifs autonomes et directement extractibles pour répondre à des requêtes du type ce qui reste humain dans telle tâche.
- Le bloc Questions fréquentes en cinq H3 couvre des questions naturelles (par où commencer, qui contrôle encore) sans balisage FAQPage, ce qui reste optionnel selon le barème.
- La section Ce que cette carte ne contient pas délimite explicitement le périmètre (pas de chiffre de gain, pas d'audit légal, pas de fonction promise), utile pour qu'un moteur IA ne surinterprète pas la portée de l'article.
- Le même noindex, follow qui limite l'indexation classique bloquerait aussi un crawler IA déclaré si cette balise persistait telle quelle en production.

## Réserves mesurées

- Aucun audit Lighthouse ou CrUX n'a été exécuté ; les signaux de performance (fetchpriority, dimensions explicites, préchargement des polices) sont lus dans le HTML mais le LCP, le CLS et l'INP réels ne sont pas mesurés.
- Aucune vérification de citation réelle par un moteur IA (ChatGPT, Perplexity, AI Overviews) n'a été effectuée ; l'évaluation de citabilité repose sur la structure de la page, pas sur un test de récupération live.
- La présence site-large d'une page de contact et d'une politique éditoriale distinctes n'a été vérifiée que par inférence depuis les liens et le schéma Organization/Person, pas par navigation directe vers ces pages.
- Le compte de dix îlots contre onze sur la couverture (voir revue image) a été établi par inspection visuelle manuelle d'un rendu isométrique dense, avec une marge d'erreur possible sur un comptage aussi fin.
- Le noindex, follow observé sur ce rendu est l'état attendu par construction pour tout candidat non publié (BLOG_PREVIEW_SLUGS) : son retrait en production n'est pas observé par cette revue mais garanti par la porte automatisée production-check (scripts/blog-pipeline.mjs), qui échoue si noindex ou le canonical auto-référent manquent.
