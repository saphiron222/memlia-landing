# SEO et préparation aux citations IA — Tableau de bord paie Excel en cabinet : suivre sans surveiller

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

- Title tag distinct du h1 (« Tableau de bord paie Excel : suivre sans surveiller », 60 caractères) : cible la requête primaire du registre et l’angle anti-surveillance plutôt que de répéter le h1 littéral.
- 3 liens externes tier-1/tier-2 (CNIL, 2× Microsoft Support), au bas de la fourchette cible de 3-8 mais tous vérifiés verbatim et à forte autorité sur leur sujet respectif.
- URL stable et lisible /blog/suivre-la-production-sociale-dans-excel, cohérente avec le slug déclaré dans paquet-revue.json.
- Canonical, Open Graph (title/description/image 1200×630/locale fr_FR) et Twitter Card summary_large_image tous présents et cohérents avec le contenu visible.
- Hiérarchie de titres sans saut (h1 unique puis h2/h3 imbriqués) sur l’ensemble du rendu, avec 4 questions de FAQ en h3 sans schema FAQPage dédié (optionnel selon le barème, sans effet sur le score).

## Préparation aux citations

- Bloc « Réponse directe » de 78 mots en ouverture du corps, répondant à la requête avant tout développement : format answer-first favorable à l’extraction par un aperçu IA.
- Trois définitions clés posées en gras dès leur première occurrence (suivi de production sociale, exception, agrégat non nominatif), formant des extraits auto-suffisants citables isolément.
- Citations légales exactes entre guillemets, liées directement vers cnil.fr et datées au 17 septembre 2026, ce qui réduit le risque de citation tronquée ou hors contexte par une IA générative.
- Trois tableaux avec <thead> structuré, en format extraction-friendly pour des réponses génératives comparatives (dictionnaire de colonnes, matrice de transition, jeu d’essai).
- Contenu présent nativement dans le HTML statique du rendu, sans dépendance au JavaScript pour son affichage ; le robots noindex observé sur ce rendu est propre au harnais de prévisualisation, pas à la page publiée.

## Réserves mesurées

- Aucun audit Lighthouse (performance, accessibilité, bonnes pratiques, SEO) n’a été exécuté sur ce rendu : les signaux statiques (fetchpriority, dimensions explicites, préchargement des polices) sont favorables mais non chiffrés.
- Le rendu mobile réel (320/768 px) n’a pas été capturé dans un navigateur ; seules les media queries et les unités clamp() du CSS ont été lues dans le code source.
- La citation réelle de la page par un moteur génératif (Google AI Overviews, ChatGPT, Perplexity) n’est pas mesurable avant publication : ce rendu porte un robots noindex propre au harnais de prévisualisation QA, pas à l’article publié.
- L’existence et le contenu réels des pages liées en pied de page (/a-propos, /mentions-legales, /politique-de-confidentialite) n’ont pas été revérifiés dans le cadre de cette revue, qui porte sur l’article lui-même.
