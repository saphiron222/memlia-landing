# Système de page — memlia.fr hors blog (07/10/2026)

Décidé pour tout le site hors blog. Phase 1 : l'accueil et les composants partagés qu'il exige.
Phase 2 : les autres pages, après validation de Kevin. La charte ne change pas : crème et vert,
Fraunces pour les titres, Hanken Grotesk pour le texte, jetons de `src/styles/tokens.css`. Pour la
mise en page, ce document remplace la spec du 08/09 (§ 3.3, 4.7, 4.9 et 4.15). Le blog garde son
dessin.

**Lecture.** Une page se lit comme un dossier bien tenu : une feuille, des sections au même pas, un
titre par section, une forme par type de contenu. Une seule chose se remarque, le héros ; le reste
est calme. Réglages : variété 4/10, mouvement 3/10, densité 3/10.

## 1. Squelette

```
nav (56 px, collante)
feuille (672 px, puis 1 360 px dès 1 024 px)
  héros
  section × n      en-tête, puis une forme ; au plus une maquette
  appel final
pied
```

- Le contenu est en retrait de `--marge-page` (16 px), puis de `--marge-page-lg` (32 px) dès
  1 024 px. Seule la bande va bord à bord de la feuille.
- Les sections se séparent par l'espace, jamais par un filet. Les filets vivent dans les formes.
- **Deux héros, pas trois.**
  - *Centré* (accueil, pages commerciales) : surtitre, h1, sous-titre, un bouton principal, au plus
    un secondaire, puis le média sous le texte, dans le cadre unique (§ 7).
  - *Partagé* (services, outils) : la même pile de texte à gauche ; la maquette à droite dès
    1 024 px, dessous avant.
- Titre h1 : `--titre-page` (36 → 60 px) pour le héros centré, `--titre-page-partage` (36 → 56 px)
  pour le héros partagé.
- Rien ne se pose au centre d'une vidéo. « Activer le son » va dans le coin bas gauche, à 16 px
  du bord (12 px en mobile), là où aucune image de la vidéo ne porte de texte.
- **Navigation mobile** (sous 1 024 px) : les quatre destinations restent visibles, sur une ligne
  répartie dès 360 px, en 2 × 2 en dessous ; jamais une destination seule sur une ligne. Le bouton
  « Confier une première tâche » garde son libellé entier ; sous 360 px, il laisse sa flèche.

## 2. En-tête de section (`.tete`)

| Élément | Règle |
|---|---|
| Surtitre `.surtitre` | Facultatif. Hanken 600, 14 px, `--accent-texte`, casse de phrase, jamais de capitales. Seulement s'il dit ce que le titre ne dit pas (catégorie, numéro d'étape). Au plus un pour trois sections, héros compris. |
| Titre h2 | Fraunces 600, `--titre-section` (32 → 48 px), interligne 1,1, lignes équilibrées. Une taille pour toutes les sections, appel final compris. |
| Introduction | `--t-base`, `--texte-2`, 62 caractères au plus par ligne. |
| Alignement | À gauche partout. Deux blocs centrés seulement : le héros de l'accueil et l'appel final. |

Écarts : 16 px entre surtitre, titre et paragraphes. Sous l'en-tête, h3 en Fraunces 600
`--titre-bloc` (24 px) ; libellé de ligne en Fraunces 600 `--titre-ligne` (20 px) ; dans un
document long, intertitre en `--titre-intertitre` (32 px). Échelle des titres : 60, 48, 32, 24,
20 px. Dans un titre,
un mot composé ne se coupe pas à son trait d'union et une ponctuation haute ne commence jamais
une ligne (`Insecable.astro`) : ni « savoir-/faire », ni « refont-/ils », ni « cabinet / : ».

## 3. Espacement

Base 4 px : 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128 (`--espace-1` à `--espace-32`).

| Jeton | < 768 | 768–1 023 | ≥ 1 024 | Rôle |
|---|---|---|---|---|
| `--section-espace` | 80 | 96 | 128 | du bas d'une section au haut de la suivante |
| `--bloc-ecart` | 40 | 40 | 48 | en-tête → forme ; forme → forme |
| `--tete-ecart` | 16 | 16 | 16 | dans l'en-tête |
| `--cartes-ecart` | 16 | 24 | 24 | entre deux cartes |
| `--carte-marge` | 24 | 32 | 32 | dans une carte ou une cellule |
| `--rangee-gouttiere` | — | — | 48 | entre le texte et la maquette |

Aucune autre valeur de marge de section. Le héros garde 40 → 64 px en haut ; l'appel final prend
`--section-espace` au-dessus et au-dessous.

## 4. Formes de contenu : une par usage

| Forme | Pour | Jamais pour |
|---|---|---|
| **Carte** `.carte` | Une destination cliquable décrite par une phrase. La carte entière est le lien ; elle finit par le lien d'action. 2 à 9 par groupe. | Un énoncé non cliquable. Une destination seule : c'est un lien d'action. |
| **Liste de liens** `.liens` | Des destinations nommées par leur libellé (services, garanties, outils, guides). Une rangée par lien, filet dessous, flèche au bout ; au besoin une phrase courte sous le libellé et le libellé de l'action avant la flèche. | Un texte à lire. |
| **Bande** `.bande` | 2 à 4 engagements non cliquables (promesse, preuves) : un titre-phrase et une phrase, côte à côte, bord à bord de la feuille. | Plus de 4 éléments ; des définitions. |
| **Lignes** `.lignes` | Des définitions : un terme (verbe, nom, principe) et son explication, lus de haut en bas. 2 à 8. Pictogramme facultatif, pour toutes les lignes ou aucune. | Des engagements à comparer ; des liens. |
| **Tableau** `table` | Une comparaison : deux colonnes de valeurs ou plus pour les mêmes lignes. | Une simple liste. |
| **Étapes** `.etapes` | Une suite ordonnée, numérotée par son surtitre, une maquette par étape. | Des points sans ordre. |
| **Document** | Un texte long à intertitres (page service) : colonne de lecture, intertitres de 32 px espacés de 64 px sans filet, tableaux du texte ; une note collante à gauche dès 1 024 px. | Une page de sections. |
| **Questions** | Questions et réponses, accordéon natif. | — |
| **Formulaire** | Les champs sur un plateau (bord, rayon de carte) ; le titre est celui de la section ; à côté dès 1 024 px, ce qu'il faut préparer, en lignes empilées. | Un texte à lire. |
| **Mention** `.mention` | Une phrase de portée ou de limite, sous la forme qu'elle borne : 14 px, `--texte-2`, sans filet. | Un message principal. |

Ce qui disparaît : la carte non cliquable, la phrase ouverte par un mot en gras pour faire une
liste (ce sont des lignes), la tuile à libellé centré (c'est une liste de liens).

## 5. Disposition selon le nombre

Les éléments d'un groupe ont tous la même largeur. Aucun ne s'étire. La dernière rangée ne porte
jamais un élément seul. Une rangée incomplète se centre. Trois colonnes de cartes au plus : à
quatre, une carte n'a plus que 240 px de texte, même à 1 440 px. Les seuils se mesurent sur la
largeur du groupe (requête de conteneur), pas sur celle de l'écran.

| Cartes | < 576 px | 576–895 px | ≥ 896 px |
|---|---|---|---|
| 1 | pas de carte : lien d'action | | |
| 2 | 1 colonne | 2 | 2 |
| 3 | 1 | 1 | 3 |
| 4 | 1 | 2 × 2 | 2 × 2 |
| 5 | 1 | 1 | 3 + 2 centrées |
| 6 | 1 | 2 × 3 | 3 × 2 |
| 7 | 1 | 1 | 3 + 2 + 2 centrées |
| 8 | 1 | 2 × 4 | 3 + 3 + 2 centrées |
| 9 | 1 | 1 | 3 × 3 |

- **Bande** : 2 → deux colonnes ; 3 → trois colonnes dès 768 px de bande, empilées avant ;
  4 → 2 × 2 dès 576 px. Au-delà de 4 : des lignes.
- **Lignes** : une par rangée, filet entre deux lignes. Dès 768 px, le libellé occupe un tiers et
  le texte deux tiers ; dès 1 024 px, les deux moitiés de la rangée : la définition commence sur
  le bord de la maquette.
- **Liste de liens** : une colonne de 26 rem au plus jusqu'à 4 liens ; deux colonnes à partir de
  5 liens, dès 640 px de bloc.

## 6. Lien d'action

Un seul style, dans une carte comme sous un en-tête : libellé Hanken 600 `--accent-texte`, flèche
de 14 px après le libellé, cible de 44 px. Au survol, la flèche avance de 2 px ; dans une carte,
toute la carte réagit (bord vert, ombre levée). Ni flèche seule, ni lien noir, ni « → » tapé dans
le texte. Les boutons restent des boutons : un principal par écran, « Confier une première
tâche » ; un contour au plus.

## 7. Maquettes et captures

- **Un cadre** `.cadre` : bord 1 px `--ligne`, fond `--surface-page`, rayon 16 px puis 24 px dès
  768 px, marge intérieure 6, 8 puis 12 px. L'image dedans : rayon concentrique (rayon du cadre
  moins la marge), filet `--ligne-douce`. Le héros vidéo prend le même cadre.
- 16:9, `object-fit: contain`, jamais rognée, jamais cliquable ni agrandie.
- **Dans une rangée** (`ProofRow`, dès 1 024 px) : texte à gauche, maquette à droite sur la moitié
  de la largeur, gouttière de 48 px, alignés en haut : le titre tombe toujours à
  `--section-espace` de la section précédente, quelle que soit la longueur du texte. Jamais en
  quinconce. Avant 1 024 px, la maquette passe sous le texte. La forme de la section se pose sous
  la rangée.
- Une maquette par section au plus. Seules les étapes en portent une chacune : deux par rangée
  dès 1 024 px, textes et maquettes alignés d'une colonne à l'autre.
- Limite connue : à 375 px, une preuve de 1 600 px reste illisible dans n'importe quel cadre.
  Seule une capture recadrée pour le mobile la rendrait lisible ; c'est une décision de phase 2.

## 8. Accessibilité

Titres dans l'ordre (h1, h2, h3). Une carte, un lien au nom explicite ; pictogrammes masqués aux
lecteurs d'écran. Focus de 2,5 px `--focus` partout. Cibles de 44 px. Mouvement réduit : aucune
apparition, vidéo arrêtée.

## 9. Accueil (phase 1)

| Section | Avant | Après |
|---|---|---|
| Héros | pastille ; son au centre de la vidéo | surtitre ; son en bas à gauche ; cadre unique |
| Par où commencer | titre de 20 px ; liens sans flèche ; services en ligne | h2 ; 4 cartes en 2 × 2, lien d'action fléché ; 5 services en liste de liens |
| Quotidien | filet au-dessus ; libellés de 16 px | rangée sans filet ; lignes ; mention |
| Promesse | filet au-dessus | rangée ; bande de 3 |
| Usages | 5 cartes non cliquables sur fond teinté, la 5e étirée | 5 lignes avec pictogramme, sur la feuille |
| Méthode | titre de 24 px centré ; quinconce | h2 à gauche ; étapes deux par deux, maquettes alignées |
| Intégration | phrases ouvertes en gras | rangée ; lignes |
| Preuves | surtitre en capitales | surtitre en casse de phrase ; bande de 3 |
| Garanties | titre en texte de 16 px ; tuiles centrées | h2 et lien d'action ; liste de 6 liens |
| Questions | 96 → 128 px | `--section-espace` |
| Appel final | 176 px au-dessus, titre de 40 px | `--section-espace` ; titre de section |

Points ouverts pour la phase 2 :
- Tranché par Kevin le 07/10/2026 : le bouton de la navigation dit « Confier une première
  tâche », comme le reste du site (une intention, un libellé).
- Intégration, Preuves et Garanties enchaînent trois rangées texte + maquette. La forme qui suit
  chacune change (lignes, bande bord à bord, liste) et rompt la répétition ; à revoir si la page
  paraît encore monotone.
- Les preuves illisibles à 375 px (§ 7).
- Restent des cartes seules parce que le contenu les impose : l'outil seul de sa catégorie
  (Explorer, Se situer) et le guide seul de son produit (Cegid Loop). Les regrouper est une
  décision de contenu.
- /integrations porte quatre surtitres (l'éditeur de chaque produit) : c'est une catégorie, mais
  la règle « un pour trois sections » y est dépassée.

## 10. Phase 2 : les autres pages

| Page | Avant | Après |
|---|---|---|
| Hub | règle en bande ; qualification en cartes non cliquables ; outils en cartes ; quinconce | lignes (règle, qualification, pôles) ; outils en liste de liens ; rangées alignées |
| Services | héros à coins ; logiciel en cartes non cliquables ; document à filets | héros partagé, cadre unique ; lignes ; document sans filets ; principes en bande |
| Garanties | six tuiles centrées ; rangées en quinconce | liste de six liens ; rangées alignées ; bande de 4 |
| Méthode | étapes en quinconce, titres de section à chaque étape | étapes deux par deux, surtitre « Étape n », h3, maquettes encadrées |
| À propos | rangées en quinconce | rangées alignées ; en-têtes du système ; bande de 2 |
| Contact | titre dans le plateau du formulaire ; pastilles grises ; astuce sous filet | en-tête de section, plateau, lignes à pictogramme, mention |
| Intégrations | quatre repères en bande ; « → » tapé | lignes ; éditeur en surtitre ; cartes au lien d'action fléché |
| Guides | champs en cartes non cliquables ; marge ad hoc du tableau | lignes ; tableau au pas des blocs |
| Outils (hub) | catégories en colonne, filets entre elles ; « → » tapé | une section par catégorie ; cartes au lien d'action fléché |
| Outils (pages) | héros à coins, pastille ; bandeaux à filets ; encadré vert ; deux boutons principaux en fin de page | héros partagé ; lignes ; plateau ; garanties en liste de liens ; trois suites en cartes ; un seul bouton principal, celui de l'appel final |
| Glossaire | lettres soulignées d'un filet épais ; sortie à filet | intertitres sans filet, au pas de 64 px ; appel final du site |

Règles précisées en phase 2 : le lien d'action garde sa flèche après le dernier mot quand son
libellé passe à la ligne ; dans une rangée à phrase, pictogramme, action et flèche suivent la
première ligne du libellé ; un surtitre en trop devient le libellé de sa liste ou la phrase
d'appui sous le titre, sans changer ses mots (services, autocritique du 07/10/2026).
