# IMG-18 : Intégration

Statut : à produire par M4. Illustration conceptuelle, jamais présentée comme une preuve produit ou un résultat client.

## Composition

Nature morte de travail : écran neutre sans interface, documents vierges et chemise reliés visuellement par une organisation commune. Aucun logo de logiciel, aucun classeur Excel identifiable, pas de cockpit. Objets simples sur fond papier.

## Livraison

- Identifiant : `img-18-outils-existants`.
- Ratio : 4:3.
- Largeurs : 570, 1140 px.
- Formats : AVIF et WebP.
- Alt proposé : celui du manifeste `src/data/images.mjs`, à confirmer contre le rendu réel.

## Direction commune

Préserver la charte M2 Navattic → Memlia : fond #fcfbf7, papier #fffefb, encre #231f20, touche de vert Memlia #27b657, lumière douce venant du haut gauche. Matière papier et ombres très douces. Une seule famille photographique/3D éditoriale crédible pour la série. Aucun néon, robot, cerveau, réseau neuronal, badge, fausse UI, logo tiers, nom de module, visage ni donnée client. AUCUN TEXTE dans l’image ; les légendes restent en HTML.

## Production M4 et recette

Ce brief remplace la série centrée Excel/modules. Génération Higgsfield en priorité, vérifier le coût et l’enveloppe autorisée avant chaque appel ; GPT image seulement en repli documenté. Ne pas forcer le réemploi d’un ancien essai. Générer une source par composition, inspecter puis exporter chaque largeur en AVIF et WebP selon src/data/images.mjs. Garder les noms exacts pour préserver srcset et ratios. Retirer le code IMG du placeholder au remplacement. Vérifier lisibilité de la composition sur mobile, palette cohérente, pas de texte accidentel, ratio exact et absence de donnée réelle. Rejouer build, oracles, écran et Lighthouse après remplacement : la légèreté des placeholders n’est pas une preuve de performance des visuels finaux.
