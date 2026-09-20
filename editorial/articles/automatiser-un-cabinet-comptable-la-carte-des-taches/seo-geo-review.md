# SEO et préparation aux citations IA — Automatiser un cabinet comptable : la carte des tâches

Verdict : PASS — 97/100, 0 P0 (revue indépendante du 2026-09-20, barème blog-analyze, heuristique éditoriale, ni facteur Google ni probabilité de citation).

| Catégorie | Score |
| --- | ---: |
| Qualité du contenu | 28/30 |
| SEO | 24/25 |
| E-E-A-T | 15/15 |
| Technique | 15/15 |
| Préparation aux citations IA | 15/15 |
| Total | 97/100 |

## SEO

- Balise title : 60 caractères pile, requête primaire « automatisation cabinet comptable » en tête exacte — dans la fourchette 40-60 mais sans marge restante pour une évolution future.
- Meta description : 152 caractères, spécifique, et désormais entièrement vérifiable par le contenu de la page (le chiffre « soixante familles » qu'elle porte correspond exactement au tableau).
- Hiérarchie de titres correcte : un H1, vingt H2 de contenu, cinq H3 (FAQ), sans saut de niveau — chiffres obtenus par comptage direct des balises du rendu.
- Cinq liens sortants vers quatre domaines tier-1 officiels distincts (service-public.gouv.fr, cnil.fr deux fois, impots.gouv.fr, net-entreprises.fr), chacun aussi listé et daté dans « Sources consultées ».
- Maillage interne dense typique d'un pilier : /methode, /garanties, /automatisation-cabinet-comptable dans la clôture, huit ancres de glossaire distinctes, quatre articles satellites cités en contexte plus deux en pied d'article.
- URL stable et lisible, canonical auto-référent correct ; robots noindex de ce rendu confirmé comme artefact du harnais de prévisualisation lié au statut de candidat, pas un réglage de production.

## Préparation aux citations

- Encart « En bref » puis H2 « Réponse directe » en tout premier bloc de contenu : format idéal pour une reprise par un AI Overview ou un assistant conversationnel, et le chiffre qu'il porte (« soixante familles réparties en douze pôles ») se vérifie maintenant par le reste de la page.
- Trois définitions en gras (tâche automatisable, règle de cabinet, frontière d'automatisation) posent une terminologie d'entité stable, réutilisée sans dérive dans les onze sections de pôle qui suivent.
- Douze tableaux structurés avec thead/tbody, dont onze tableaux de frontière à trois colonnes désormais présents pour chacun des onze pôles ouverts, offrent des blocs autonomes directement citables pour une requête du type « ce qui reste humain dans telle tâche ».
- La section « Que ne contient pas cette carte ? » délimite explicitement le périmètre (pas de chiffre de gain non mesuré, pas d'audit légal documenté, pas de fonction livrée promise), ce qui réduit le risque qu'un moteur IA surinterprète la portée de l'article.
- Cinq questions en H3 dans « Questions fréquentes », réponses autonomes en un paragraphe chacune, sans balisage FAQPage — sans bonus de score selon la grille, donc sans conséquence sur la note.
- Le noindex de ce rendu QA limiterait un crawler IA déclaré s'il persistait en production ; vérifié dans le code comme un artefact du harnais de prévisualisation lié au statut candidat, pas la configuration de production.

## Réserves mesurées

- Aucune mesure Lighthouse/CrUX réelle n'a été exécutée ; les signaux de performance (préchargement des polices, fetchpriority, absence de CSS bloquant) sont lus dans le HTML statique du rendu QA, pas mesurés en conditions réelles.
- La reprise effective de ce contenu par un moteur IA (AI Overviews, ChatGPT, Perplexity) n'est pas mesurable a priori ; seule la citabilité structurelle (format réponse directe, tableaux, FAQ) a été évaluée.
- Le wordCount du JSON-LD (3702) et le temps de lecture affiché (19 min) sont cohérents entre eux, mais un comptage indépendant approximatif sur le seul corps rendu (hors CTA et sources) donne un ordre de grandeur proche sans être identique, faute de chronométrage réel.
- L'ordre des pôles dans le tableau de l'article (…Excel, Conseil, Méthode, Audit) diffère de l'ordre de déclaration dans src/data/familles.ts (…Excel, Méthode, Conseil, Audit) ; les décomptes par pôle concordent malgré tout exactement, donc sans conséquence factuelle.
- La densité de maillage interne (plus d'une quinzaine de liens contextuels dans le corps) dépasse largement la fourchette indicative de 3 à 10 liens du barème, attendu et cohérent pour un format pilier faisant fonction de hub, mais à surveiller si ce gabarit sert un format plus court.
- Le titre de balise est à 60 caractères pile, donc sans marge restante : un allongement lors d'une prochaine évolution éditoriale le ferait sortir de la fourchette recommandée.
