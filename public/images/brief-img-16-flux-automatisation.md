# IMG-16 : Hero

Statut : à produire par M4. Illustration conceptuelle, jamais présentée comme une preuve produit ou un résultat client.

## Composition

Une composition horizontale de papiers vierges et chemins en creux sur un bureau crème. À gauche plusieurs entrées distinctes, au centre un traitement ordonné, une exception mise à part, à droite un dossier ouvert avec stylo posé pour validation. Aucune interface logicielle. Le chemin ne dépasse jamais le point de validation.

## Livraison

- Identifiant : `img-16-flux-automatisation`.
- Ratio : 3024:1610.
- Largeurs : 768, 1024, 1440, 1888, 3024 px.
- Formats : AVIF et WebP.
- Alt proposé : celui du manifeste `src/data/images.mjs`, à confirmer contre le rendu réel.

## Direction commune

Préserver la charte M2 Navattic → Memlia : fond #fcfbf7, papier #fffefb, encre #231f20, touche de vert Memlia #27b657, lumière douce venant du haut gauche. Matière papier et ombres très douces. Une seule famille photographique/3D éditoriale crédible pour la série. Aucun néon, robot, cerveau, réseau neuronal, badge, fausse UI, logo tiers, nom de module, visage ni donnée client. AUCUN TEXTE dans l’image ; les légendes restent en HTML.

## Production M4 et recette

Ce brief remplace la série centrée Excel/modules. Génération Higgsfield en priorité, vérifier le coût et l’enveloppe autorisée avant chaque appel ; GPT image seulement en repli documenté. Ne pas forcer le réemploi d’un ancien essai. Générer une source par composition, inspecter puis exporter chaque largeur en AVIF et WebP selon src/data/images.mjs. Garder les noms exacts pour préserver srcset et ratios. Retirer le code IMG du placeholder au remplacement. Vérifier lisibilité de la composition sur mobile, palette cohérente, pas de texte accidentel, ratio exact et absence de donnée réelle. Rejouer build, oracles, écran et Lighthouse après remplacement : la légèreté des placeholders n’est pas une preuve de performance des visuels finaux.
