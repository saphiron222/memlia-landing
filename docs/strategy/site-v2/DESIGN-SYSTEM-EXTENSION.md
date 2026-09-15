# Extension du design system Memlia

15/09/2026. Redesign-preserve : étendre l’existant, pas remplacer la direction artistique. Sources : docs/2026-09-08-consigne-site.md, docs/design/2026-09-08-design-navattic-memlia.md, src/components/Nav.astro, src/data/proofs.ts et captures de l’audit. Navattic est une référence de structure/rythme ; aucun de ses assets, textes ou code n’est réutilisé.

## Tokens et composition
| Rôle | Valeur de charte | Usage |
|---|---|---|
| Marque | #27b657 | Accent discret, pas couleur automatique du texte sur fond blanc |
| Marque profonde | #1c8a41 | Action/contraste selon tests réels |
| Fond | #fffefb | Plan général |
| Papier | #fcfbf7 | Surface secondaire |
| Encre | #231f20 | Texte principal |
| Titres | Fraunces auto-hébergée | H1/H2, sans mot isolé arbitrairement recoloré |
| Corps | Hanken Grotesk auto-hébergée | Paragraphes, navigation, boutons |

Implémenter avec les alias sémantiques EXISTANTS de tokens.css après lecture, pas ces hex copiés localement. Mesurer contraste pour chaque couple réel. Lockup M collé à emlia. Largeur de prose cible 60–75 caractères, blocs de service plus courts. Échelle de départ : H1 clamp entre 36 et 64 px, H2 28–44, corps 18 ; adapter au système présent, pas créer un second système.

## Gabarits réutilisables (noms de conception, pas imports existants)
- Hero de service : titre/explication/CTA à gauche, une démonstration visuelle calme à droite ; la preuve reste légendée fictive si elle l’est.
- Ligne de livrable : entrée attendue, proposition préparée, validation humaine et limite ; pas carte gadget.
- Étapes de méthode : numérotation uniquement ici, car c’est une séquence ; une sortie concrète par étape.
- Bloc limite/preuve : même famille d’icônes Picto.astro, trait 1,5, rayon/conteneur homogènes. Aucun pictogramme solitaire plus coloré qui ressemble à un état actif.
- Bloc auteur : rôle réel, signature, liens éditoriaux ; pas de photo synthétique imitant Kevin.
- CTA de fin : un argument et un bouton, pas un deuxième hero.
- Navigation : six destinations visibles selon SITE-STRUCTURE.md, pas réduction des cibles sur mobile.

Les noms de composants seront décidés par dev après lecture des composants existants. Réutiliser avant d’ajouter. Les contrats de props concernent contenu, lien, preuve et niveau de titre, jamais HTML arbitraire ou style inline de page.

## Wireframes
```text
Service desktop
[logo] [Automatisation Méthode Garanties Ressources Blog] [Contact]
[titre et chapeau        ] [illustration / exemple fictif]
[CTA / lien méthode     ] [légende + limite              ]
[situations concrètes — gestes, pas catalogue produit]
[entrée → proposition → validation | ce qui n’est pas couvert]
[formats et accès] [critères du devis]
[liens guides] [CTA] [footer]

Mobile
[logo]
[Automatisation] [Méthode]
[Garanties    ] [Ressources]
[Blog         ]
[Parlons de votre tâche — pleine largeur]
[titre]
[chapeau]
[CTA]
[visuel et légende, puis sections dans l’ordre de lecture]
```

Pour les pages de confiance et auteur, préférer prose et preuves aux grilles. Les bentos varient par composition, pas par une palette par case. Limiter les fonds teintés. Une animation d’introduction discrète peut être conservée ; contenu visible sans JS, prefers-reduced-motion respecté. Pas de fade/slide obligatoire pour chaque section, pas d’animation qui laisse un écran vide avant scroll.

## Briefs d’images (génération seulement lors de la réalisation)
1. Service : nature morte éditoriale d’un bureau de cabinet, dossiers neutres, feuilles et un classeur ouvert sans contenu lisible ; vue trois-quarts, lumière diffuse, composition laissant de l’espace à gauche, palette crème/papier/encre et accent vert ; aucun texte, chiffre, logo, donnée ou fausse interface. Ratio 4:3, variations 768/1280, WebP/AVIF. Alt proposé : « Documents de travail réunis pour cadrer une tâche du cabinet ». Décor, pas preuve de résultat.
2. Méthode : trois ensembles de feuilles de papier sobres, un chemin de classement tangible interrompu par une feuille isolée ; cadrage horizontal, palette Memlia, sans texte/interface/personne. Alt : « Une exception isolée parmi les documents à traiter ». Une explication HTML porte la règle et le blocage ; l’image n’est pas un diagramme normatif.
3. Garanties : séparation physique de dossiers anonymes en deux compartiments, un espace vide matérialisant la limite, cadrage serré et lumière naturelle, vert profond discret ; aucun cadenas cliché, certification, écran ou texte. Alt : « Documents séparés selon leur périmètre de traitement ».

Ne pas générer trois images si les visuels existants suffisent. Hero À propos sans portrait tant qu’aucune photo réelle autorisée n’est disponible. Aucune capture Excel générée : captures exclusivement issues du banc Windows sur jeu fictif ; sans preuve disponible, garder illustration explicitement conceptuelle.

## Recette de cohérence
Captures 1440 et 375 pleine page APRÈS parcours de défilement, plus premier écran ; comparer chaque bloc à ses voisins. Tests 320, 375, 768, 1024, 1440, 1920 : pas de débordement, texte visible, six liens primaires accessibles sans action, cibles 48 px, focus clavier. Check avec JS désactivé et reduced-motion. Mesurer le contenu rendu, pas seulement un score Lighthouse.

Images : width/height présents, srcset/sizes, pas de lazy-loading du LCP, lazy sous la ligne de flottaison, aucune vidéo chargée complètement sans besoin. Objectif interne : hero optimisé sans dégradation perceptible, budget fixé sur le candidat avec mesures plutôt qu’un poids fictif universel. Valider alt selon fonction ; décor redondant alt vide. Preview uniquement noindex/nofollow avant release.
