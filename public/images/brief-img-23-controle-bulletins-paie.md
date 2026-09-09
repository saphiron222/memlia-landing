# IMG-23 : Blog — contrôler les bulletins de paie avant la DSN

Statut : à produire par M4. Couverture d’article conceptuelle, jamais présentée comme une preuve produit ou un résultat client.

## Composition

Sur un bureau crème, une pile de bulletins de paie vierges (feuilles pliées, sans texte) à gauche ; au centre une liste de contrôle en papier dont quelques cases sont cochées d’un trait vert ; à droite une enveloppe fermée prête à partir, posée sur un tampon dateur sans date. Le regard va des bulletins à la liste, puis à l’enveloppe : le contrôle précède l’envoi. Aucune interface logicielle, aucun écran.

## Livraison

- Identifiant : `img-23-controle-bulletins-paie`.
- Ratio : 16:9.
- Largeurs : 768, 1200, 1600 px.
- Formats : AVIF et WebP.
- Alt proposé : celui du manifeste `src/data/images.mjs`, à confirmer contre le rendu réel.

## Direction commune

Préserver la charte M2 Navattic → Memlia : fond #fcfbf7, papier #fffefb, encre #231f20, touche de vert Memlia #27b657, lumière douce venant du haut gauche. Matière papier et ombres très douces. Même famille photographique/3D éditoriale que IMG-16 à IMG-22. Aucun néon, robot, cerveau, réseau neuronal, badge, fausse UI, logo tiers, visage, main ni donnée client. AUCUN TEXTE dans l’image : les feuilles sont vierges, le tampon sans date, les cases cochées d’un simple trait ; les légendes restent en HTML.

## Production M4 et recette

Génération Higgsfield en priorité, vérifier le coût et l’enveloppe autorisée avant chaque appel ; GPT image seulement en repli documenté. Générer une source 16:9, inspecter puis exporter chaque largeur en AVIF et WebP selon src/data/images.mjs. Garder les noms exacts pour préserver srcset et ratios. Retirer le code IMG du placeholder au remplacement. Vérifier lisibilité en carte de liste (largeur réduite) et en tête d’article, palette cohérente, pas de texte accidentel, ratio exact et absence de donnée réelle. Rejouer build, oracles, écran et Lighthouse après remplacement.
