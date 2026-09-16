# SEO et préparation aux citations IA — Automatiser la relance des pièces clients

Verdict : PASS — 99/100, 0 P0 (revue indépendante du 2026-09-16, barème blog-analyze, heuristique éditoriale, ni facteur Google ni probabilité de citation).

| Catégorie | Score |
| --- | ---: |
| Qualité du contenu | 29/30 |
| SEO | 25/25 |
| E-E-A-T | 15/15 |
| Technique | 15/15 |
| Préparation aux citations IA | 15/15 |
| Total | 99/100 |

## SEO

- Title 50 caractères (« Automatiser la relance des pièces clients | Memlia »), meta description 150 caractères : les deux dans la fourchette recommandée.
- Canonical https://memlia.fr/blog/automatiser-la-relance-des-pieces-clients cohérent avec og:url et l’URL du JSON-LD ; aucune divergence relevée.
- Hiérarchie de titres H1 unique → H2 → H3 sans saut ; 3 tableaux structurés avec <thead>, 2 listes à puces sur la page rendue.
- 7 destinations internes contextuelles distinctes à ancres descriptives (glossaire ×3, articles liés ×2, /methode) ; 4 liens externes tier-1 (CNIL ×3, Service-Public ×1).
- `robots: noindex, follow` sur ce rendu `.qa/render` — cohérent avec la bannière « candidat non publiable », mais à remplacer explicitement au moment de la mise en ligne réelle.
- Couverture livrée en AVIF/WebP à 768/1200/1600 px plus OG 1200×630, chargée en eager/fetchpriority=high : pas de lazy sur l’image LCP.

## Préparation aux citations

- Réponse directe en tête d’article suivie de l’aside « En bref » : format extractible en un seul passage pour un moteur IA, sans avoir à parcourir toute la page.
- 3 tableaux avec <thead>, dont un tableau comparatif « se prépare seul / attend une validation / reste humain » : structure hautement citable telle quelle.
- Terminologie stable et définie une fois (« relance de pièces », « complétude du dossier », « checklist conditionnelle ») puis réutilisée sans dérive synonymique : entité non ambiguë.
- 5 questions-réponses en H3 sous « Questions fréquentes », chacune autonome et directement citable hors contexte par un moteur conversationnel.
- Chaque affirmation réglementaire (minimisation RGPD, durées de conservation, sous-traitant) est sourcée en ligne vers une source officielle tier-1, avec citation exacte vérifiée mot pour mot.
- Le `noindex` du rendu de prévisualisation empêcherait toute indexation ou citation réelle par un moteur IA tant qu’il n’est pas levé pour la publication effective.

## Réserves mesurées

- Aucun Lighthouse / Core Web Vitals réel exécuté : les scores « page speed » et « mobile » s’appuient sur des signaux structurels (préchargement, eager/fetchpriority, CSS inliné), pas sur une mesure de terrain.
- Score de lisibilité calculé avec un outil (textstat) calibré pour l’anglais appliqué à un texte français (Flesch ≈ 76,9) : indicatif seulement, aucune formule de lisibilité française (type Kandel-Moles) appliquée.
- Caractère bidirectionnel des liens internes non vérifié : les pages cibles (/glossaire, /methode, les deux articles liés) n’ont pas été ouvertes pour confirmer qu’elles renvoient vers cet article.
- Aucune citation réelle de l’article par un moteur IA (Google AI Overviews, Perplexity, ChatGPT) testée : la « citabilité » jugée ici est structurelle, pas observée en conditions réelles.
- Contenu réel des pages /a-propos, /contact, /mentions-legales et /politique-de-confidentialite non vérifié au-delà de leur présence en pied de page sur cette page.
- Relecture grammaticale faite à l’œil, sans correcteur outillé ; aucune coquille repérée mais l’exhaustivité n’est pas garantie sur 2369 mots.
- L’absence de `noindex` en production n’a pas été observée directement par cette revue (qui porte sur le rendu `.qa/render`, construit avec `BLOG_PREVIEW_SLUGS`) : elle est garantie par la commande `production-check` de `scripts/blog-pipeline.mjs`, qui échoue si la page publiée contient encore `noindex` ou si le canonical auto-référent manque.
