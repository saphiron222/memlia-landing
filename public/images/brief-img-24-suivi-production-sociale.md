# IMG-24 : Blog — suivre la production sociale dans Excel

Statut : à produire par M4. Couverture d’article conceptuelle, jamais présentée comme une preuve produit ou un résultat client.

## Composition

Sur un bureau crème, une grande feuille quadrillée vierge vue en légère plongée, évoquant un tableau de suivi mensuel : des lignes régulières, une colonne marquée par une bande verte (l’avancement), et une seule fiche cartonnée sortie du rang, posée de côté avec un trombone vert (le cas à revoir). Aucune écriture, aucun nom, aucun chiffre ; le motif de grille suffit à dire « suivi ». Aucune interface logicielle, aucun écran.

## Livraison

- Identifiant : `img-24-suivi-production-sociale`.
- Ratio : 16:9.
- Largeurs : 768, 1200, 1600 px.
- Formats : AVIF et WebP.
- Alt proposé : celui du manifeste `src/data/images.mjs`, à confirmer contre le rendu réel.

## Direction commune

Préserver la charte M2 Navattic → Memlia : fond #fcfbf7, papier #fffefb, encre #231f20, touche de vert Memlia #27b657, lumière douce venant du haut gauche. Matière papier et ombres très douces. Même famille photographique/3D éditoriale que IMG-16 à IMG-22 et IMG-23. Aucun néon, robot, cerveau, réseau neuronal, badge, fausse UI, logo tiers, visage, main ni donnée client. AUCUN TEXTE dans l’image : la grille est vide, la fiche mise à part est vierge ; les légendes restent en HTML.

## Production M4 et recette

Génération Higgsfield en priorité, vérifier le coût et l’enveloppe autorisée avant chaque appel ; GPT image seulement en repli documenté. Générer une source 16:9, inspecter puis exporter chaque largeur en AVIF et WebP selon src/data/images.mjs. Garder les noms exacts pour préserver srcset et ratios. Retirer le code IMG du placeholder au remplacement. Vérifier lisibilité en carte de liste (largeur réduite) et en tête d’article, palette cohérente, pas de texte accidentel, ratio exact et absence de donnée réelle. Rejouer build, oracles, écran et Lighthouse après remplacement.
