# Design du nouveau memlia.fr — structure navattic.com, charte Memlia

Posé le 08/09/2026 · carte « nouveau site » · branche de travail `wt/t_f5098486` (à renommer `site/design` à la fusion si Kevin le souhaite).

**Ce document est une spécification, pas une copie.** Il consigne des *mesures* relevées sur l'export local de navattic.com (structure, grille, rythme, composants, états, animations, points de rupture), puis les *transpose* dans la charte Memlia. Aucun HTML, CSS, JS, image, texte, logo ou marque de navattic n'est repris. Les noms de classes utilitaires cités le sont comme unités de mesure (Tailwind v4 : 1 unité = 0,25 rem = 4 px), jamais comme code à réutiliser.

Sources analysées (hors dépôt, `~/Downloads/www.navattic.com/`) : `index.html` (1,15 Mo dont 0,8 Mo de données Next.js), la feuille `85c84bc994785463.css` (394 Ko, Tailwind v4.1.17), la feuille `acb97c4166f8061e.css` (formulaire), les chunks JS de la page d'accueil (variantes d'animation, minuteries, offsets de défilement). Méthode : extraction programmatique (arbre DOM annoté de 1 330 lignes, variables de thème, règles `@media`, `@keyframes`, paramètres `framer-motion`).

---

## 1. Lecture de navattic.com — mesures brutes

### 1.1 Sections dans l'ordre

| # | Rôle | Conteneur | Espacements verticaux (mobile → ≥ 1024) | Contenu |
|---|---|---|---|---|
| 0 | Bandeau d'annonce | pleine largeur, `border-b` | 6 px + bouton 24 px | lien texte 12 px, chevron qui glisse de 2 px au survol, fond à motif diagonal + canevas animé (fondu 3,5 s) |
| 1 | Navigation collante | 1 360 px centré, `px-16` | hauteur **56 px** | logo (20 → 24 px de haut), menu centré (≥ 1024), 3 boutons à droite (fantôme, contour, plein) ; < 1024 : bouton contour + burger |
| 2 | Hero | 672 → 1 360 px, bordures latérales 1 px, fond blanc, grille de points derrière | `pt-32 pb-16` → `pt-48` ; bloc texte `min-h 270`, `mt-40` | titre display 36 → 68 px, sous-titre 14 → 16 px, 2 boutons, puis (≥ 1024) un sélecteur de 3 pastilles produit posé à −55 px sous la ligne |
| 3 | Cadre de démo | déborde du conteneur (`-mx-96` → `-mx-128`), `mt-96`, `min-h 600` | ≥ 1024 seulement | cadre verre (rayon 24 px, flou 8 px) + écran (rayon 11 px) qui se révèle en 1,75 s ; image 3024 × 1610 |
| 4 | Logos clients | `mt-32` | en-tête `py-24 pt-64` → `py-40` ; grille cellules **96 → 128 px** | phrase + lien fantôme, séparateur vertical 1 × 56 px, badge tiers ; grille 3 col × 4 lignes → 6 × 2, gap 1 px = filets |
| — | Entretoise | motif diagonal | **64 px** | vide décoratif |
| 5 | Bandes de fonctionnalités ×3 | empilées, `gap-48`, chaque bande `border-y` | colonne texte `p-24 pt-48` → `p-48 py-64` | pastille-étiquette, h3 25,6 → 32 px, paragraphe 14 px, bouton contour ; colonne image 50 % avec écran ancré en bas à droite |
| 6 | Parcours acheteur (scrollytelling) | pleine largeur du conteneur | `pt-160 pb-208` | 6 étapes ; mobile : cartes collantes empilées (décalage 12 px × i) ; ≥ 1024 : panneau visuel collant 50 vh à gauche, textes défilants à droite, `gap-160` |
| 7 | Preuve sociale | `py-128`, `gap-64` entre blocs | bloc note `pt-128 pb-96` ; carrousel `pt-64` ; mur `py-24` | (a) bloc note tierce avec emblème 72 px, (b) carrousel de cartes-chiffres 280 → 320 px, (c) mur 2 × 4 logos + témoignage central autoplay 5,5 s |
| 8 | Appel final | pleine largeur, `py-16` puis intérieur `pt-128 pb-120` `border-y` | grille 72 px fondue vers le haut à 40 % | titre 32 → 48 px, phrase 18 px, champ e-mail + bouton plein dans une boîte 480 px |
| 9 | Pied de page | 1 360 px, `pt-144 pb-56` | colonnes `gap-x-32 gap-y-48`, ligne © `pt-128` | 4 colonnes (2 sur mobile), titres 14 px, liens 14 px, ligne © 12 px, grand emblème vectoriel flou derrière (≥ 1024) |

Observations structurantes : une seule `h1` (placée dans l'appel final chez eux — Memlia la garde dans le hero) ; le *même* conteneur bordé traverse toute la page, ce qui donne la sensation de « feuille » ; les filets (`gap-px` sur fond gris) remplacent les cartes à ombre ; l'ornement de coin (carré 20 px flouté) marque chaque angle de bloc.

### 1.2 Grille et conteneurs

| Élément | Mesure |
|---|---|
| Largeur max desktop | **1 360 px** (`340 × 4 px`), centré, `px-16` puis `px-32` ≥ 1024 |
| Largeur max < 1024 | **672 px** |
| Bordures latérales du conteneur | 1 px, gris 95 % (`gray-100`), fond blanc ; de part et d'autre, un voile blanc de 10 vw masqué en dégradé (10 % → 40 %) qui fond la grille de points |
| Fond de page derrière le conteneur | grille de points : point 1 px tous les **9 px** (variante large : 18 px), gris 95 % |
| Ornement de coin | cellule 25 × 25 px centrée sur l'angle (`−13 px`), carré 10 px (≥ 640 : 20 px), rayon 3 px (≥ 640 : 6 px), blanc 60 %, `backdrop-blur 1px`, ombre 3 couches (0 3 5 / 0 1 2 / 0 0,5 0,5, alpha 5–7 %, teinte bleu-nuit) |
| Point de coin (variante grille de logos) | 2 px, gris 65 %, rond |
| Accolade décorative | filet 1 px + courbe SVG 57 × 41 px + filet, couleur `#EBEFF5`, `max-w 32 → 200 px` de chaque côté, posée à ±40 px des blocs |
| Colonnes de bande | texte `flex-1`, image `50 %` (≥ 768) ; sinon empilé, `divide-y` |
| Grille de logos | `grid gap-1px` sur fond gris 95 %, cellules blanches ; 3 → 6 colonnes |
| Mur de logos | 3 colonnes ≥ 1024 (2×2 logos / témoignage / 2×2 logos), `gap-1px` sur gris 91 % |
| Carrousel de chiffres | cartes `shrink-0` 280 / 300 (≥ 640) / 320 px (≥ 1024), `divide-x`, fondu latéral 56 px |
| Pied de page | 4 colonnes `gap-x-32 gap-y-48` (≥ 1024) ; 2 colonnes `gap-x-32`, blocs `gap-y-40` en dessous |

### 1.3 Échelle typographique (mesurée)

Familles : display propriétaire (3 graisses 400/500/600), corps sans-serif variable (100–900), mono tierce pour les chiffres. Fallbacks avec `size-adjust` pour éviter le saut de mise en page. Toutes les tailles ≥ `2xl` basculent sur la famille display.

| Jeton | < 1024 (taille / interligne) | ≥ 1024 | Approche | Graisse |
|---|---|---|---|---|
| xs | 12 / 19,2 px | id. | +0,01 rem | 400 |
| sm | 14 / 22,4 px | id. | −0,01 rem | 400 |
| base | **14 / 24 px** | **16 / 25,6 px** | −0,01 rem | 400 |
| lg | 18 / 28,8 px | id. | −0,02 rem | 500 |
| xl | 20 / 25 px | id. | −0,02 rem | 500 |
| 2xl (display) | 24 / 30 px | id. | −0,02 rem | 500 |
| 3xl (display) | 25,6 / 32 px | 32 / 36 px | −0,045 rem | 500 |
| 4xl (display) | 32 / 36 px | 40 / 44,8 px | −0,045 rem | 500 |
| 5xl (display) | 32 / 40,8 px | 48 / 55,2 px | −0,1 rem | 500 |
| 6xl (display) | 32 / 36 px | 50,4 / 53,6 px | −0,1 rem | 500 |
| 7xl (display) | 36 / 42 px | **68 / 68 px** | −0,1 rem | 500 |
| chiffre (mono) | 48 px, interligne 100 % | 48 px | −0,025 em | 500 |

Défauts de base : `p` 14 px ; `h3` 18 / 28,8 px semi-gras gris 27 %, marge basse 16 px ; titre hero avec ombre de texte `0 1px 3px` alpha 10 %. Mesures des largeurs de lecture : titre hero `max-w 896 px`, sous-titre `672 px`, paragraphe de bande `65ch`, titre d'étape `448 px`, titre d'appel final `500 px`, titre du bloc note `450 px`.

### 1.4 Espacements

Unité 4 px. Rythme relevé : intra-composant 4–12 px ; entre étiquette / titre / paragraphe **12 px** (`gap-3`) avec titre décalé de 10 px ; bouton sous un bloc texte **32 px** ; entre bandes 48 px ; entre sections 96–208 px ; padding de colonne de bande 24 → 48 px (64 px vertical) ; entrées de menu `py-6 px-10/12` ; liens de pied 10 px entre eux.

### 1.5 Composants

**Bouton (base commune)** : hauteur **32 px** (variantes 28 px lien-fantôme, 24 px bandeau), rayon **8 px**, 14 px / 500, `px-12` (`pr-10` quand icône à droite), écart icône 6 px, bordure 1 px, icônes 16 px trait 1,5 (14 px trait 1,5 en variante fantôme), `transition-all 150 ms cubic-bezier(.4,0,.2,1)`, `disabled` opacité 50 %. Astuce mesurée : deux libellés superposés (un visible en absolu, un invisible qui donne la largeur) pour animer le texte sans faire bouger la boîte.

| Variante | Repos | Survol | Actif | Focus visible |
|---|---|---|---|---|
| Plein sombre | fond gris 16 %, bordure gris 4 %, texte blanc ; ombre `0 1 1 / 10 %`, `0 2 3 / 8 %`, `1 4 8 / 12 %`, `inset 0 −3 2 / noir 40 %`, `inset 0 2 0,4 / blanc 14 %` | fond gris 27 % | `inset 0 3 1 / 20 %` + `inset 0 0 3 / 20 %` | anneau `0 0 0 1 blanc` + `0 0 1 3 / gris 40 %` |
| Plein couleur | fond marque 55 %, bordure marque 50 %, mêmes ombres, inset bas noir 20 % | fond marque 50 % | idem | contour 1 px décalé 1 px, marque 50 % alpha |
| Contour | fond blanc, bordure gris 88 %, texte gris 27 % ; ombre `0 2 3 / 3 %` + `0 2 2 −1 / 3 %` | fond gris 97 %, texte gris 4 % | `inset 0 2 1 / 5 %` | texte gris 4 % |
| Fantôme | transparent, texte gris 46 % | texte gris 4 % (nav : + fond gris 95 %, bordure gris 91 %) | fond gris 91 %, `inset 0 2 1 / 5 %` | fond gris 95 % |
| Fantôme-flèche | comme fantôme, flèche 14 px | flèche translatée de **2 px** en 200 ms | — | — |

**Pastille-étiquette (chip)** : `inline-flex gap-10`, icône dans un carré **20 px** rayon **7 px**, deux styles — plein coloré (ombre colorée `0 2 8 / 30 %` + `inset 0 2,5 1 / blanc 20 %`, contour blanc 40 % décalé −1 px) ou clair (dégradé blanc → gris 97 %, ombre `0 2 7 / 5 %`, icône colorée, contour couleur 10 %) ; libellé 14 px / 400, gris 16 %, remonté de 2 px.

**Sélecteur de produit (hero, ≥ 1024)** : 3 pastilles `gap-12` ; chaque pastille = enveloppe `p-1px` + calque d'anneau rayon 11 px (visible seulement à l'état actif : `ring-1` gris 95 %, échelle 0,92 → 1) + corps `px-5 pr-12 py-2` rayon 10 px bordure gris 91 % ; actif fond blanc texte gris 4 %, inactif fond gris 95 % texte gris 46 %, survol fond gris 97 % ; transition 250 ms.

**Navigation** : entrée 14 px / 500 gris 27 %, `py-6 pl-12 pr-10`, rayon 8 px, chevron 14 px ; survol / ouvert : texte gris 9 % + fond gris 96 % (`transition-colors ease-out`). Panneau déroulant : centré sous la barre (`top: 100 % − 4 px`), rayon 6 px, bordure, ombre `lg`, hauteur animée 150 ms ; contenu 1 000 px `p-16` ; ouverture fondu + zoom 90 → 100 % ; passage d'un panneau à l'autre par glissement latéral 200 px + fondu ; délai d'ouverture 200 ms, délai de saut 300 ms. Mobile : burger `p-6` rayon 8 px (survol fond gris 95 % + bordure gris 91 %) ; panneau fixe sous l'en-tête, blanc, `border-t` ; sections en accordéon (hauteur animée + flou 2 px → 0, 200 ms `ease-out`).

**Cadre de démo** : conteneur `-mx-16` ; calque verre `rounded-24 bg gris 97 % / 20 % + bordure gris 91 % / 80 % + backdrop-blur 8 px`, `p-16` ; écran `rounded-11 border overflow-hidden`, image `w-100 % h-auto`.

**Bande de fonctionnalité — colonne image** : fond dégradé `to-br` (teinte produit 1 % → 10 % ou bleu 100 à 10 % → 100 %, ou gris 2 %) + motif diagonal blanc 20 % ; padding haut/gauche seul (16 / 24 / 40 px selon la bande) ; panneau « écran » = fond gris 2 % + `backdrop-blur 24 px` + saturation 125 %, `padding 8 px 0 0 8 px`, **rayon 32 px sur le seul angle haut-gauche**, bordure 1 px haut/gauche ; image `max-w 500`, rayon 24 px haut-gauche, bordure gris 91 % / 50 % haut/gauche, ancrée bas-droite et rognée par le bord.

**Grille de logos** : cellule 96 → 128 px, logo `h 16 → 20 → 24 px` en niveaux de gris, opacité 0,65 ou 1 ; un calque couleur superposé passe à opacité 1 au survol (300 ms) ; lien « lire l'étude » glisse de 12 px vers le haut (250 ms, `[.4,0,.2,1]`) depuis `bottom 16 → 24 px` ; boucle « shimmer » : balayage par `clip-path` 1,5 s par logo, décalage 0,15 s, pause 2,5 s, plus un reflet dégradé 105° blanc 40 %.

**Carte-chiffre (carrousel)** : `px-32 py-32 → py-48`, `min-h 320`, colonne `gap-32` ; logo 20 → 24 px gris → couleur au survol (300 ms) ; filet supérieur 2 px couleur de marque client (opacité 0 → 1) ; voile dégradé 195° couleur 10 % → transparent à 30 % ; chiffre 48 px mono ; libellé 16 px gris 46 % ; lien fantôme gris 46 % → gris 16 %.

**Témoignage** : enveloppe motif diagonal `p-12` ; carte bordée `p-20 py-32 → p-40`, `min-h 310` ; barre de progression 1 px en haut (gris 91 %, remplissage couleur client 0 → 100 % linéaire sur la durée de l'autoplay) ; citation 20 px / 500 gris 27 %, logo 28 px ; voile teinté bas 128 px opacité 5 % ; deux zones cliquables invisibles (moitié gauche = précédent, droite = suivant).

**Boîte e-mail (appel final)** : `max-w 480`, blanc, rayon 12 px, bordure gris 91 %, `p-8 py-6`, ombre `xs` (`0 2 2 / 2 %` + `0 5 5 / 2 %`), champ `px-12 py-8` sans bordure, bouton plein 32 px.

**Accordéon (FAQ / mobile)** : hauteur animée `accordion-down/up` (0 ↔ hauteur du contenu), contenu `px-8 pb-16`, flou 2 px → 0 et opacité 0 → 1 en 200 ms `ease-out`, chevron 20 px qui tourne en 200 ms.

### 1.6 États de survol (résumé)

| Cible | Effet | Durée / courbe |
|---|---|---|
| Bouton plein | fond un cran plus clair (sombre) ou plus foncé (couleur) | 150 ms `[.4,0,.2,1]` |
| Bouton contour | fond gris 97 %, texte plus sombre | 150 ms |
| Bouton fantôme | texte plus sombre ; flèche +2 px | 150 / 200 ms |
| Entrée de menu | texte + fond gris 96 % | `transition-colors ease-out` (150 ms) |
| Logo (grille, mur, carte) | niveaux de gris → couleur ; opacité 0,65 → 1 | 300 ms |
| Cellule logo | apparition du lien par glissement 12 px | 250 ms `[.4,0,.2,1]` |
| Carte-chiffre | filet coloré + voile dégradé | 300 ms |
| Pastille de note | bordure gris 91 % → 88 % | `transition-colors` |
| Badge tiers | opacité 0,9 → 1 | `transition-opacity` |
| Pastille produit inactive | fond gris 95 % → 97 % | 250 ms |
| Lien de pied | texte gris 46 % → 16 % | instantané |

Toutes les règles de survol sont enveloppées dans `@media (hover: hover)` — rien ne « colle » au toucher.

### 1.7 Animations (durées, courbes, décalages)

Bibliothèque : framer-motion (variantes `hidden` / `visible`), `IntersectionObserver` via `useInView`, `useScroll` + `useTransform` pour le scrollytelling ; animations CSS pour les micro-transitions. Courbes rencontrées : `[.4,0,.2,1]` (standard), `[.25,.1,.25,1]` (révélation de l'écran), `[.76,0,.24,1]` (étiquette du hero), `easeOut`, `easeInOut`, `linear` (barres de progression).

| Animation | De → vers | Durée | Courbe | Délai / cadence |
|---|---|---|---|---|
| Titre hero | opacité 0, y +15 px, échelle 0,98, flou 7 px → neutre | 0,5 s | easeOut | 0 |
| Sous-titre hero | idem | 0,5 s | easeOut | 0,1 s |
| Boutons hero | opacité 0, y +20 px, flou 3 px → neutre | 0,5 s | easeOut | 0,1 s puis 0,2 s |
| Pastilles produit | idem | 0,5 s | easeOut | 0,1 s + 0,1 s × i |
| Étiquette au-dessus du titre | opacité 0, y −8 px, échelle 0,8, flou 4 px | 0,7 s | `[.76,0,.24,1]` | 0,2 s |
| Calque verre du cadre | opacité 0, échelle 0,99 → 1 | 0,7 s (`transition-opacity duration-700 ease-out` sur l'enveloppe) | ease-out | quand 80 % visible, une fois ; garde-fou 1,5 s |
| Écran de démo | opacité 0, échelle 0,98, flou 6 px + gris 100 % → neutre | **1,75 s** | `[.25,.1,.25,1]` | 0 |
| Iframe de démo | opacité 0, flou 8 px, échelle 0,97 → neutre | — | — | après chargement |
| Panneau de menu | fondu + zoom 90 % → 100 % ; hauteur | 150 ms | ease-in-out / ease-out | ouverture après 200 ms de survol |
| Accordéon mobile | hauteur ; flou 2 px + opacité | 200 ms | ease-out | — |
| Grille de logos, shimmer | balayage `clip-path` gauche → droite | 1,5 s par logo | `[.4,0,.2,1]` | décalage 0,15 s, pause 2,5 s, infini |
| Témoignage | entrée x −30 px (logo −50 px) flou 2 px ; sortie x −30 px | 0,35 s / 0,5 s | easeInOut | délai 0,1 s ; autoplay **5,5 s** avec barre linéaire ; clic = changement immédiat |
| Parcours (desktop) | opacité de chaque étape pilotée par la position de défilement : offsets `start 70 % → end 20 %`, courbe `[0, .3, .5, .7, 1] → [0, 1, 1, 1, 0]` (première étape démarre à 1) | liée au défilement | — | — |
| Parcours, filet de progression | hauteur 0 → 100 % sur `start center → end 20 %` | liée au défilement | — | — |
| Parcours, titre collant | opacité 0 → 1 sur 0–10 % puis 1 → 0 sur 60–70 % | liée au défilement | — | — |
| Bandeau d'annonce | opacité 0 → 1 du canevas | 3,5 s | `[.4,0,.2,1]` | — |
| `fadeUp` (CSS) | opacité 0 + y 16 px → neutre | — | — | utilitaire générique |
| `marquee` (CSS) | translation 0 → −100 % | — | linéaire | infini |
| `progressBar` / `dot-progress` | `scaleX` 0 → 1 | — | linéaire | — |
| Spinner / pulse | rotation 1 s ; opacité 0,5 à 50 % sur 2 s | — | linear / `[.4,0,.6,1]` | infini |

Transition par défaut du système : **150 ms `cubic-bezier(.4,0,.2,1)`**. Aucune règle `prefers-reduced-motion` relevée dans la feuille : c'est un manque que Memlia comble (voir 5.4).

### 1.8 Responsive (points de rupture)

Tailwind v4 par défaut : **sm 640 · md 768 · lg 1024 (64 rem) · xl 1280 · 2xl 1536**, plus `@media (hover: hover)` et `forced-colors: active`.

| Écran | Comportement mesuré |
|---|---|
| < 640 | ornements 10 px ; cellules logo 96 px ; cartes 280 px ; titres display en tailles « mobile » ; conteneur 672 px max, `px-16` |
| ≥ 640 | ornements 20 px ; cellules logo 128 px ; logos 20 px ; cartes 300 px |
| ≥ 768 | bandes en 2 colonnes (texte / image 50 %) ; padding de colonne 48 px ; en-tête de section en ligne ; séparateur vertical des logos visible ; pied et appel final en ligne |
| ≥ 1024 | menu centré et boutons complets ; conteneur 1 360 px, `px-32` ; sélecteur produit et cadre de démo affichés ; grille de logos 6 colonnes ; scrollytelling en 2 colonnes collantes ; tailles display « desktop » (titre 68 px) ; cartes 320 px ; pied en 4 colonnes ; emblème décoratif |
| ≥ 1280 | cadre de démo déborde de 128 px au lieu de 96 px |

### 1.9 Ce qu'on ne reprend pas

Traqueurs et pixels (une quinzaine), iframe de démo interactive tierce, animations vectorielles tierces, badge d'un comparateur, marques et logos clients, bandeau d'annonce (sans objet au lancement), champ e-mail sans validation humaine (contraire à la règle human-in-the-loop : Memlia renvoie vers Cal.com), typographies propriétaires, défilement automatique sans commande de pause.

---

## 2. Tokens Memlia (couleurs substituées)

Architecture en trois couches (primitive → sémantique → composant). Les valeurs primitives viennent de la charte (`index.html` actuel et `interne/memlia-landing` qui fait foi pour le lockup) ; les noms sémantiques sont nommés par **rôle**, jamais par couleur, conformément au skill produit.

### 2.1 Primitives

```css
:root {
  /* Surfaces */
  --creme:        #fffefb;   /* fond de page (remplace le blanc pur) */
  --papier:       #fcfbf7;   /* surface secondaire, survol, motifs */
  --blanc:        #ffffff;   /* écrans de démo, cartes d'image uniquement */

  /* Encre et ses voiles (dérivés de #231f20) */
  --encre:        #231f20;   /* 16,2:1 sur crème */
  --encre-88:     rgba(35,31,32,.88);
  --encre-68:     rgba(35,31,32,.68);   /* texte secondaire — 5,45:1 (AA) */
  --encre-42:     rgba(35,31,32,.42);   /* pictos au repos, points de coin — 2,57:1 : jamais pour un texte ou un lien */
  --encre-18:     rgba(35,31,32,.18);   /* bordures de champs et boutons contour */
  --encre-12:     rgba(35,31,32,.12);   /* filets de structure */
  --encre-07:     rgba(35,31,32,.07);   /* filets doux, motifs de fond */
  --encre-04:     rgba(35,31,32,.04);   /* survol de surface */

  /* Vert Memlia */
  --vert:         #27b657;   /* accent — tuile du lockup, pastilles, focus, filets de progression */
  --vert-appui:   #1c8a41;   /* bordure du bouton principal, icônes ≥ 24 px (4,37:1 sur crème, 4,08 sur voile : jamais en texte courant) */
  --vert-texte:   #176f37;   /* texte vert sur crème/papier/voile — 6,2:1 (AA) ; remplace #1c8a41 pour les eyebrows 12–13 px */
  --vert-doux:    #b9f8cf;   /* sélection, bordure de bloc mis en avant */
  --vert-voile:   #eafaef;   /* fond de bloc mis en avant, pastille de statut « ok » */

  /* Signal (jamais décoratif) */
  --ocre:         #926500;   --ocre-voile: #fbf3df;   /* « à traiter » */
  --rouge:        #a4322a;   /* erreur uniquement */

  /* Teintes de tuile des modules (identifient un module ; l'interface reste verte) */
  --tuile-suivi-social:        #27b657;
  --tuile-supervision-sociale: #1e63d4;
  --tuile-flux-compta:         #b86b2e;   /* cuivre — valeur à confirmer avec le module 4 */
  --tuile-synthese-salaires:   #1f6b78;   /* pétrole — valeur à confirmer avec le module 6 */
}
```

Contrastes calculés par script (WCAG 2.x, alpha composé sur crème `#fffefb`) : encre 16,16 · encre 88 % 11,17 · encre 68 % 5,64 · encre 60 % 4,34 (**la valeur actuelle `--muted` échoue AA : passer à 68 %**) · encre 42 % 2,57 (**réservé au décoratif, jamais à un texte ou un lien**) · vert-texte 6,19 (6,03 sur papier) · vert-appui 4,37 (4,08 sur voile — **échoue AA en texte courant : d'où `--vert-texte`**) · vert `#27b657` 2,63 (**sous 3:1 : interdit comme couleur de focus, de texte ou d'icône sur crème**) · blanc sur vert 2,65 (**interdit : le bouton principal ne sera pas « blanc sur vert »**) · encre sur vert 6,14 et sur `#34c264` 7,02 (autorisés) · crème sur vert-texte 6,19 · tuiles sur crème : bleu 5,49, cuivre 4,02, pétrole 6,07.

Conséquences appliquées plus bas : l'indicateur de focus et les anneaux passent en `--vert-texte` ; l'icône d'une chip pleine verte est en encre (crème sur les tuiles bleue, cuivre, pétrole) ; la ligne © et les liens légaux sont en `--texte-2`. Seul le lockup (lettre crème sur tuile verte) est exempté : c'est un logotype.

### 2.2 Correspondance navattic → Memlia (sémantique)

| Rôle chez navattic | Valeur relevée (hex approché) | Jeton Memlia |
|---|---|---|
| fond de la « feuille » (conteneur bordé) | blanc `#ffffff` | `--surface-feuille: var(--creme)` |
| fond de page derrière la feuille, motif de points, survol léger | gris 97 % `#f6f8f9` | `--surface-page: var(--papier)` |
| fond d'entrée de menu survolée | gris 96 % | `--surface-hover: var(--encre-04)` |
| filets de structure (bordures de conteneur, `gap-px`) | gris 95 % `#f0f2f4` | `--ligne-douce: var(--encre-07)` |
| bordures de blocs, séparateurs de pied | gris 91 % `#e5e7eb` | `--ligne: var(--encre-12)` |
| bordure de bouton contour, champs | gris 88 % `#dde0e4` | `--ligne-forte: var(--encre-18)` |
| texte discret (©, mentions) | gris 65 % `#9ca3b0` | `--texte-2: var(--encre-68)` (le gris 65 % de la référence est sous 3:1 ; Memlia ne descend pas en dessous de 68 % pour un texte) |
| texte secondaire (sous-titres, libellés) | gris 46 % `#6b7280` | `--texte-2: var(--encre-68)` |
| texte courant | gris 27 % `#384252` | `--texte: var(--encre-88)` |
| titres, bouton plein sombre | gris 16 % `#1d2735` | `--texte-fort: var(--encre)` · `--bouton-sombre: var(--encre)` |
| bordure du bouton sombre | gris 4 % `#070a0d` | `#141112` |
| accent (bouton couleur, filet de progression, ring focus, chip principal) | bleu 55 % `#286ef0` | `--accent: var(--vert)` |
| accent hover | bleu 50 % `#1c62e3` | `--accent-appui: var(--vert-appui)` |
| voile d'accent (dégradé de bande) | bleu 94 % `#e2f1fd` | `--accent-voile: var(--vert-voile)` |
| chips produit (aqua / indigo / gris) | 3 teintes | teintes de tuile des modules |
| filet coloré de carte-chiffre | couleur du client | `--accent` (unique) |
| succès | vert 35 % `#12a154` | `--vert-texte` sur `--vert-voile` |
| attention | orange | `--ocre` sur `--ocre-voile` |
| accolade décorative | `#EBEFF5` | `--ligne-douce` |
| ombre de texte du titre | noir 10 % | supprimée (Fraunces n'en a pas besoin) ; option : `0 1px 2px rgba(35,31,32,.06)` |
| teinte des ombres d'ornement | bleu-nuit `rgba(7,60,133)` | `rgba(35,31,32)` (encre) |

### 2.3 Tokens sémantiques et de composant

```css
:root {
  /* Alias sémantiques (les seuls noms autorisés dans les composants) */
  --surface-page:    var(--papier);  /* derrière la feuille, porte la grille de points */
  --surface-feuille: var(--creme);   /* le conteneur bordé, la nav, les cartes */
  --surface-hover:   var(--encre-04);
  --ligne-douce:   var(--encre-07); --ligne: var(--encre-12);     --ligne-forte: var(--encre-18);
  --texte-fort:    var(--encre);   --texte: var(--encre-88);     --texte-2: var(--encre-68);
  --picto-repos:   var(--encre-42);   /* éléments non textuels au repos uniquement */
  --accent:        var(--vert);    --accent-appui: var(--vert-appui);  --accent-voile: var(--vert-voile);
  --accent-texte:  var(--vert-texte);
  --focus:         var(--vert-texte);   /* 6,19:1 sur crème — l'indicateur de focus n'est jamais en --vert (2,63:1) */
  --bouton-sombre: var(--encre);   --bouton-sombre-bord: #141112;   --bouton-sombre-hover: #37322f;
  --bouton-principal-hover: #34c264;

  /* Typographie */
  --police-display: 'Fraunces', Georgia, serif;
  --police-corps:   'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif;
  --police-chiffres: var(--police-display);          /* tabular-nums, voir 3.3 */

  /* Rayons (mesurés chez navattic, conservés) */
  --r-chip: 7px;  --r-bouton: 8px;  --r-pastille: 10px;  --r-ecran: 11px;
  --r-boite: 12px; --r-carte: 16px; --r-cadre: 24px;  --r-ecran-coin: 32px;
  --r-ornement: 6px;

  /* Ombres (alpha calées sur les mesures, teinte encre) */
  --ombre-xs:        0 2px 2px rgba(35,31,32,.02), 0 5px 5px rgba(35,31,32,.02);
  --ombre-contour:   0 2px 3px rgba(35,31,32,.03), 0 2px 2px -1px rgba(35,31,32,.03);
  --ombre-plein:     0 1px 1px rgba(35,31,32,.10), 0 2px 3px rgba(35,31,32,.08), 1px 4px 8px rgba(35,31,32,.12),
                     inset 0 -3px 2px rgba(0,0,0,.20), inset 0 2px .4px rgba(255,255,255,.14);
  --ombre-plein-actif: inset 0 3px 1px rgba(0,0,0,.20), inset 0 0 3px rgba(0,0,0,.20);
  --ombre-contour-actif: inset 0 2px 1px rgba(35,31,32,.05);
  --ombre-chip:      0 2px 8px rgba(39,182,87,.30), inset 0 2.5px 1px rgba(255,255,255,.20);
  --ombre-chip-clair: 0 2px 7px rgba(35,31,32,.05);
  --ombre-ornement:  0 3px 5px rgba(35,31,32,.05), 0 1px 2px rgba(35,31,32,.05), 0 .5px .5px rgba(35,31,32,.07);
  --ombre-panneau:   0 10px 15px -3px rgba(35,31,32,.10), 0 4px 6px -4px rgba(35,31,32,.10);

  /* Motion */
  --duree-1: 150ms;  --duree-2: 200ms;  --duree-3: 250ms;  --duree-4: 300ms;
  --duree-entree: 500ms;  --duree-etiquette: 700ms;  --duree-revelation: 1750ms;
  --courbe-standard: cubic-bezier(.4,0,.2,1);
  --courbe-sortie:   cubic-bezier(0,0,.2,1);
  --courbe-douce:    cubic-bezier(.25,.1,.25,1);
  --courbe-etiquette: cubic-bezier(.76,0,.24,1);
  --courbe-expo:     cubic-bezier(.16,1,.3,1);   /* apparitions au défilement, héritée de la landing */

  /* Grille */
  --conteneur-lg: 1360px;  --conteneur-sm: 672px;
  --marge-page: 16px;      --marge-page-lg: 32px;
  --pas-points: 9px;       --pas-grille: 72px;  --decalage-grille: 32px;
  --pas-diagonal: 4px;

  /* Composants */
  --bouton-h: 32px;  --bouton-h-lien: 28px;  --bouton-px: 12px;  --bouton-gap: 6px;
  --chip-icone: 20px; --ornement: 20px; --ornement-sm: 10px;
  --nav-h: 56px;

  /* Échelle de texte (valeurs détaillées en 3.2) */
  --t-xs: .75rem;  --t-sm: .875rem;  --t-base: clamp(1rem, .95rem + .25vw, 1.125rem);
  --t-lg: 1.125rem; --t-xl: 1.25rem; --t-2xl: 1.5rem;
  --t-3xl: clamp(1.625rem, 1.2rem + 1.2vw, 2rem);
  --t-4xl: clamp(2rem, 1.5rem + 1.4vw, 2.5rem);
  --t-5xl: clamp(2rem, 1.2rem + 2.4vw, 3rem);
  --t-7xl: clamp(2.25rem, 1rem + 4.2vw, 4.25rem);
  --t-chiffre: clamp(2.75rem, 2.4rem + 1vw, 3rem);
}
```

Focus visible (global) : `outline: 2.5px solid var(--focus); outline-offset: 3px` — la landing actuelle utilise `--accent` (`#27b657`, 2,63:1), ce qui échoue au 3:1 exigé pour l'indicateur (WCAG 2.4.11 / 2.4.13) ; c'est un défaut hérité, corrigé ici. Sur les boutons pleins : anneau `0 0 0 1px var(--creme), 0 0 0 3px var(--focus)` opaque. Sélection : `--vert-doux`.

---

## 3. Échelle typographique Memlia

### 3.1 Familles et graisses (fichiers présents dans `fonts/`)

| Rôle | Police | Graisses disponibles | Usage |
|---|---|---|---|
| Display (2xl → 7xl) | Fraunces | 400, 600, 400 italique, 600 italique (`woff2`) | titres ; le mot-clé d'un titre peut passer en 400 italique (usage déjà en place dans le hero actuel) |
| Corps | Hanken Grotesk | 400, 500, 600, 700 (`woff2`) | tout le reste |
| Chiffres | Fraunces 600 + `font-variant-numeric: tabular-nums` | — | cartes-chiffres (navattic utilise une mono ; Memlia n'en embarque pas, et la serif à chiffres tabulaires porte le registre « papier ») |

TASA Orbiter (`tasa-*.woff`) est la police de corps de la landing actuelle ; la consigne fixe Hanken Grotesk : les fichiers TASA deviennent du **code mort** à signaler, pas à supprimer dans cette carte. Précharger trois fichiers : Fraunces 600, Hanken 400, Hanken 500 (nav et boutons au-dessus de la ligne de flottaison) ; l'italique Fraunces 400 se charge en différé ; `font-display: swap` ; fallback avec `size-adjust` (Georgia ≈ 96 %, Arial ≈ 100 %) à mesurer au build. Vérifier au build que la fonctionnalité `tnum` a survécu au sous-ensemble `fraunces-600.woff2` (18 Ko) avant de promettre des chiffres tabulaires ; sinon, chiffres en Hanken 600.

### 3.2 Échelle (deux paliers comme la référence, avec `clamp()` équivalent)

| Jeton | < 1024 | ≥ 1024 | `clamp()` | Interligne | Approche | Graisse |
|---|---|---|---|---|---|---|
| `--t-xs` | 12 px | 12 px | `.75rem` | 1,6 | +0,01 em | 400 |
| `--t-sm` | 14 px | 14 px | `.875rem` | 1,6 | −0,005 em | 400 |
| `--t-base` | 16 px | 18 px | `clamp(1rem, .95rem + .25vw, 1.125rem)` | 1,6 | −0,005 em | 400 |
| `--t-lg` | 18 px | 18 px | `1.125rem` | 1,55 | −0,01 em | 500 |
| `--t-xl` | 20 px | 20 px | `1.25rem` | 1,3 | −0,01 em | 500 |
| `--t-2xl` (Fraunces) | 24 px | 24 px | `1.5rem` | 1,25 | −0,01 em | 600 |
| `--t-3xl` (Fraunces) | 26 px | 32 px | `clamp(1.625rem, 1.2rem + 1.2vw, 2rem)` | 1,15 | −0,015 em | 600 |
| `--t-4xl` (Fraunces) | 32 px | 40 px | `clamp(2rem, 1.5rem + 1.4vw, 2.5rem)` | 1,12 | −0,02 em | 600 |
| `--t-5xl` (Fraunces) | 32 px | 48 px | `clamp(2rem, 1.2rem + 2.4vw, 3rem)` | 1,1 | −0,02 em | 600 |
| `--t-7xl` (Fraunces, hero) | 36 px | 68 px | `clamp(2.25rem, 1rem + 4.2vw, 4.25rem)` | 1,02 | −0,025 em | 600 |
| `--t-chiffre` (Fraunces) | 44 px | 48 px | `clamp(2.75rem, 2.4rem + 1vw, 3rem)` | 1 | −0,02 em | 600 |

Écarts assumés par rapport à la référence : approches en `em` et moins serrées (une serif ne supporte pas −0,1 rem à 68 px) ; corps à 16 → 18 px, comme la landing actuelle, au lieu de 14 → 16 chez la référence (public de professionnels du chiffre sur écrans 1080p à 100 % ; les colonnes de bande restent à 65 ch, donc plus larges d'environ 60 px) ; graisse 600 pour les titres (Fraunces 500 n'est pas embarquée) ; le jeton 6xl mesuré n'est pas transposé (aucun emplacement ne l'emploie). Largeurs de lecture conservées : titre hero 896 px, sous-titre 672 px, paragraphes de bande 65 ch, titre d'étape 448 px, titre d'appel final 560 px (rallongé pour le français).

### 3.3 Hiérarchie de la page

Une seule `h1` : le titre du hero. Titres de section `h2` en `--t-5xl` ; titres de bande et d'étape `h3` en `--t-3xl` / `--t-2xl` ; eyebrow (étiquette) 12–13 px / 600 / majuscules espacées +0,06 em en `--vert-texte` (plus de `#1c8a41` à cette taille) ; paragraphes en `--t-base` `--texte-2` ; libellés de boutons 14 px / 500.

---

## 4. Composants Memlia — spécifications

Toutes les dimensions reprennent les mesures de la section 1 ; seules les couleurs, polices et courbes changent.

### 4.1 Boutons

Base : hauteur 32 px (28 px pour le lien-flèche), rayon 8 px, Hanken 14 px / 500, `padding 0 12px` (10 px côté icône), écart 6 px, bordure 1 px, icône 16 px trait 1,5, `transition: background, color, border-color, box-shadow, transform 150 ms var(--courbe-standard)`. Cible tactile : le bouton reste 32 px de haut mais la zone cliquable est étendue à 44 px (5 px de chaque côté en largeur, 6 px en hauteur) par un pseudo-élément — WCAG 2.5.8 exige 24 px, 44 px est le niveau AAA (2.5.5) ; les boutons voisins sont espacés d'au moins 16 px pour que les zones ne se chevauchent pas. Deux libellés superposés autorisés pour animer un changement de texte, jamais pour cacher du contenu au lecteur d'écran (`aria-hidden` sur le double).

| Variante | Repos | Survol | Actif | Focus visible | Emploi |
|---|---|---|---|---|---|
| **Principal (vert)** | fond `--accent`, texte `--texte-fort` (6,14:1), bordure `--accent-appui`, `--ombre-plein` | fond `--bouton-principal-hover` (7,02:1 avec l'encre), `translateY(-1px)` | `--ombre-plein-actif`, translation nulle | anneau crème 1 px + `--focus` 3 px | « Réserver une démo » (nav, hero, appel final) — un seul par écran |
| **Sombre (encre)** | fond `--bouton-sombre`, texte crème (16,16:1), bordure `--bouton-sombre-bord`, `--ombre-plein` avec inset noir 40 % | fond `--bouton-sombre-hover` | idem | anneau crème 1 px + `--focus` 3 px | bouton d'un bloc sur fond vert-voile ; bouton de la boîte de contact |
| **Contour** | fond `--surface-feuille`, bordure `--ligne-forte`, texte `--texte`, `--ombre-contour` | fond `--surface-page`, texte `--texte-fort` | `--ombre-contour-actif` | contour `--focus` | « Parler à un humain », « Voir le module » |
| **Fantôme** | transparent, texte `--texte-2` | texte `--texte-fort` (nav : + fond `--surface-hover`, bordure `--ligne`) | fond `--ligne-douce`, `--ombre-contour-actif` | contour `--focus` | entrées secondaires |
| **Lien-flèche** | fantôme 28 px, flèche 14 px | flèche `translateX(2px)` 200 ms ; texte encre | — | — | « Lire », « Voir toutes les questions » |
| Désactivé | opacité 0,5, `cursor: not-allowed` | aucun | aucun | — | — |

### 4.2 Pastille-étiquette (chip)

`inline-flex`, écart 10 px ; icône dans un carré 20 px rayon 7 px ; libellé 14 px / 500 `--texte-fort`, remonté de 2 px pour l'alignement optique.
- **Pleine** : fond = teinte de tuile du module (ou `--accent`), `--ombre-chip` (teinte = celle du fond), contour blanc 40 % décalé −1 px. Couleur de l'icône : **encre sur la tuile verte** (6,14:1 ; la crème n'y ferait que 2,63:1), crème sur les tuiles bleue, cuivre et pétrole (≥ 4:1).
- **Claire** : dégradé `--surface-feuille → --surface-page`, `--ombre-chip-clair`, icône `--accent-texte`, contour `rgba(39,182,87,.10)`.

### 4.3 Sélecteur de modules (hero, ≥ 1024)

Une pastille par module affiché (voir l'hypothèse de périmètre en tête de la section 7 ; avec un seul module, le sélecteur disparaît), écart 12 px, posées 55 px sous la ligne du bloc texte. Anatomie : enveloppe `padding 1px` ; calque d'anneau rayon 11 px (`ring 1px --ligne-douce`), visible seulement à l'état actif avec `scale .92 → 1` en 250 ms ; corps `padding 2px 12px 2px 5px`, rayon 10 px, bordure `--ligne`. Actif : fond `--surface-feuille`, libellé `--texte-fort`. Inactif : fond `--surface-hover`, libellé `--texte-2` ; survol fond `--surface-page`, bordure `--ligne`. Rôle ARIA : `tablist` / `tab`, `aria-selected`, flèches clavier. Le choix change l'écran du cadre de démo (fondu croisé 300 ms, conditionné à `img.complete`, sinon changement sec). Chargement : seule la capture active porte `fetchpriority="high"` ; les autres sont préchargées par `<link rel="prefetch">` après l'événement `load`.

### 4.4 Navigation

Barre collante `top 0`, hauteur 56 px, fond `--surface-feuille` à 92 % + `backdrop-blur 10px` (la seule couche de flou permanente de la page), `border-bottom 1px --ligne-douce`, `z-index 50`. Conteneur 1 360 px, marges `--marge-page` / `--marge-page-lg` (alignées sur les bords de la feuille). Gauche : lockup (tuile « M » 1,45 em rayon 0,34 em `--accent`, lettre en crème — logotype, exempté de la règle de contraste — ; « emlia » Fraunces 600 collé, écart 0,02 em ; hauteur 22 → 24 px). Centre (≥ 1024) : entrées 14 px / 500 `--texte`, `padding 6px 12px 6px 12px` (10 px côté chevron), rayon 8 px ; survol / ouvert : `--texte-fort` + fond `--surface-hover` ; chevron 14 px tourne à 180° en 200 ms. Droite : contour « Parler à un humain » + principal « Réserver une démo », écart 16 px. Pas de « connexion » (aucun espace client).

Panneau déroulant « Modules » (seulement si au moins deux modules sont affichés ; sinon « Le module » est un lien simple) : centré sous la barre (`top: calc(100% − 4px)`), largeur 224 px par module + 32 px de marges (la référence est à 1 000 px pour cinq colonnes), `padding 16px`, rayon 12 px, bordure `--ligne`, `--ombre-panneau`, fond `--surface-feuille` ; entrée = chip pleine + titre 14 px / 600 + phrase 13 px `--texte-2`, `padding 10px 12px`, rayon 8 px, survol `--surface-hover`. Ouverture : fondu + `scale .9 → 1` 150 ms `--courbe-sortie` (opacité et transformation seulement, pas de hauteur animée) ; délai d'ouverture au survol 200 ms, fermeture 300 ms. Motif *disclosure navigation* : bouton avec `aria-expanded` et `aria-controls` ; `Entrée` / `Espace` ouvre ; `Échap` ferme et rend le focus au bouton ; `Tab` sort du dernier lien et ferme le panneau (`focusout` hors du panneau) ; pas de piège de focus.

Mobile (< 1024) : contour « Réserver une démo » + burger (icône 16 px, `padding 6px`, rayon 8 px, `aria-expanded`, survol fond `--surface-hover` + bordure `--ligne`). Panneau fixé sous la barre, fond `--surface-feuille`, `border-top --ligne`, défilement interne ; sections en accordéon 200 ms (`grid-template-rows` + flou 2 px → 0) ; liens 16 px, `padding 12px 8px`.

### 4.5 Conteneur « feuille » et ornements

Le conteneur principal (672 → 1 360 px) porte des bordures latérales 1 px `--ligne-douce` et un fond `--surface-feuille` ; derrière, sur `--surface-page`, une grille de points 1 px tous les 9 px en `--ligne-douce` ; de chaque côté, un voile crème de 10 vw masqué (10 % → 40 %) qui fond les points. Ornements de coin : cellule 25 px centrée sur l'angle, carré 10 / 20 px (< 640 / ≥ 640), rayon 3 / 6 px, `--surface-feuille` à 92 % **sans flou** (la référence pose un `backdrop-blur 1px` sur chaque angle ; à 30–40 angles par page, c'est un coût GPU sans gain visible), `--ombre-ornement`. Points de coin (variante fine) : 2 px `--picto-repos`. Accolade : filet 1 px `--ligne-douce` + courbe 57 × 41 px (SVG maison, trait 1 px) + filet ; `max-width 32 → 200 px` de chaque côté.

Motifs : diagonal = `repeating-linear-gradient(-45deg, var(--ligne-douce) 0 1px, transparent 1px 4px)` ; grille = lignes 1 px `--ligne-douce` tous les 72 px, décalées de 32 px, fondue vers le haut à 40 % sur l'appel final. Tous en `::before` avec `isolation: isolate`, `pointer-events: none`.

### 4.6 Cadre de démo (hero)

Conteneur `margin-top 96px`, `min-height 600px`, débord `−96 px` (≥ 1024) / `−128 px` (≥ 1280), masqué < 1024 (une capture statique réduite prend sa place, voir storyboard). Calque verre : rayon 24 px, fond `--surface-page` 20 %, bordure `--ligne` 80 %, `backdrop-blur 8px` (actif seulement pendant la révélation, retiré ensuite : `backdrop-filter: none` après 2 s), `padding 16px`. Écran : rayon 11 px, bordure `--ligne`, `overflow hidden`, image `width 100 %`, `aspect-ratio: 3024 / 1610` (le ratio exact de la capture, pas une approximation). Un seul écran par module (fondu croisé 300 ms au changement de pastille). Aucune iframe.

### 4.7 Bande de module

Bloc `border-top/bottom 1px --ligne`, fond `--surface-feuille`, 2 colonnes ≥ 768 (`divide-x --ligne-douce`), empilées sinon (`divide-y`). Colonne texte : `padding 24px 24px 24px` + `padding-top 48px` (< 768) ; `48px` / `64px` vertical (≥ 768) ; pile `gap 12px` : chip pleine (tuile du module), `h3` `--t-3xl` décalé de 10 px, paragraphe `--t-base` `--texte-2` 65 ch, bouton contour à 32 px (ancre `#module-<nom>` tant que la page du module n'existe pas, voir 7 bis). Colonne image (50 %) : fond dégradé `to bottom right` de la teinte de tuile 1 % → 10 % + motif diagonal blanc 20 % ; `padding-top/left` 16 / 24 / 40 px selon le rang ; panneau écran : fond `rgba(35,31,32,.02)`, `padding 8px 0 0 8px`, rayon **32 px haut-gauche seulement**, bordure 1 px haut/gauche `--ligne` ; le `backdrop-blur 24px` + saturation 125 % de la référence n'est appliqué qu'à partir de 1024 px (`@media (min-width: 64rem)`), fond opaque `--surface-page` en dessous ; capture `max-width 500px`, rayon 24 px haut-gauche, bordure haut/gauche `--ligne` 50 %, ancrée bas-droite et rognée. Entre deux bandes : 48 px sur motif diagonal. Avec un seul module affiché, la bande unique garde le même gabarit (aucune variante « pleine largeur »).

### 4.8 Parcours « une journée au cabinet » (scrollytelling)

Section `padding 160px 0 208px`. **≥ 1024** : titre collant `height 15vh top 15vh`, `--t-2xl` centré, fond crème fondu vers le bas (80 → 100 %) ; colonne gauche `flex 1`, collante `top 30vh height 50vh`, bordures `--ligne-douce`, motif diagonal, image centrée `padding 16–32px` rayon 16 px, `object-fit: contain; max-height: 100%` (à 1366 × 768, 50 vh = 384 px, moins que les 428 px d'une image 4:3 de 570 px) ; filet de progression 1 px `--accent` sur le bord droit, `transform: scaleY(0 → 1)` avec `transform-origin: top` (jamais `height`) ; colonne droite 50 %, `padding 48px 8px 48px 0`, `gap 160px`, `margin 12.5vh 0 14vh`, chaque étape `max-width 448px` (chip claire + `h3` `--t-2xl` + paragraphe). Opacité de chaque étape pilotée par la position : intervalle `start 70 % → end 20 %` du viewport, courbe 0 → 1 (à 30 %) → 1 (70 %) → 0 ; la première démarre visible. **< 1024** : titre collant `top 100px` `padding 32px 0` ; cartes collantes empilées, `top calc(13rem + 12px × i)`, chacune `border-top --ligne-douce`, image sur motif diagonal `padding 16–32px` rayon 16 px, puis `padding 24px` texte (`h3` `--t-3xl`). Sans JS : tout visible, opacité 1 (progressive enhancement).

### 4.9 Grille de garanties (à la place des logos)

Mêmes mécaniques que la grille de logos : `border-top/bottom --ligne-douce`, points de coin, `grid gap 1px` sur `--ligne-douce`, cellules `--surface-feuille` 96 → 128 px, 3 → 6 colonnes (2 lignes → 1). **Chaque cellule est un lien** `<a>` vers l'ancre FAQ correspondante (accessible au toucher et au clavier). Contenu : picto trait 1,5 de 24 px `--picto-repos` + libellé 13 px / 500 `--texte-2` centré ; survol et `:focus-visible` : picto `--accent-texte`, libellé `--texte-fort` (300 ms) et une flèche décorative glisse de 12 px vers le haut depuis `bottom 16 → 24px` (250 ms `--courbe-standard`). Pas de boucle « shimmer » (bruit visuel sans information) ; à la place, un seul balayage de 1,5 s à l'entrée dans le viewport, une fois, supprimé sous `prefers-reduced-motion`.

### 4.10 Carte-repère (carrousel de chiffres)

Piste `padding 8px 0`, `border-top/bottom --ligne`, motif diagonal `--ligne-douce`, fondus latéraux 56 px crème ; cartes 280 / 300 / 320 px, `divide-x --ligne-douce`, `padding 32px` (48 px vertical ≥ 1024), `min-height 320px`, pile `gap 32px` : chip claire (module concerné), chiffre `--t-chiffre` Fraunces tabulaire `--texte-fort`, libellé `--t-base` `--texte-2`, lien-flèche (≥ 1024). Survol : filet supérieur 2 px `--accent` (0 → 1), voile `linear-gradient(195deg, rgba(39,182,87,.10), transparent 30%)`, 300 ms. Défilement : **aucun mouvement automatique** (la référence fait défiler en continu ; un mouvement de plus de 5 s sans commande de pause échoue WCAG 2.2.2). À la place : piste `overflow-x: auto` avec `scroll-snap-type: x mandatory`, cartes `scroll-snap-align: start`, deux boutons contour précédent / suivant (28 px, icônes 14 px) au-dessus de la piste à droite de l'en-tête, barre de défilement masquée mais piste focusable (`tabindex="0"`, `aria-label`). Rendu identique (cartes coupées par le bord), zéro JS obligatoire.

### 4.11 Mur « méthode » + témoignage

Grille 1 → 3 colonnes (≥ 1024), `gap 1px` sur `--ligne`, `border-top/bottom --ligne`. Côtés : 2 × 2 cellules `padding 32px` (16 px ≥ 1024) avec picto 20 → 28 px `--picto-repos` → `--accent-texte` au survol (300 ms). Centre : enveloppe motif diagonal `padding 12px` ; carte `border-left/right/bottom --ligne`, `padding 20px 20px 32px` (40 px ≥ 640), `min-height 310px` ; barre 1 px en haut (`--ligne`, remplissage `--accent` par `transform: scaleX(0 → 1)` linéaire 5,5 s, `transform-origin: left`) ; citation `--t-xl` / 500 `--texte` ; signature 14 px `--texte-2` (fonction + type de cabinet, jamais nominative sans accord écrit) ; voile bas 128 px `--accent` à 5 %. Entrée x −30 px + flou 2 px → 0 en 350 ms `ease-in-out`, sortie 500 ms. Commandes visibles : boutons précédent / suivant (28 px) et un bouton **pause / lecture** (`aria-pressed`) alignés en bas à droite de la carte, en plus des moitiés cliquables ; conteneur `aria-roledescription="carrousel"`, citation dans une zone `aria-live="polite"` ; l'autoplay se met en pause au survol, au focus et au clic sur pause, et n'est jamais lancé sous `prefers-reduced-motion`. Avec un seul témoignage (ou aucun accord écrit), pas d'autoplay ni de commandes : carte statique.

### 4.12 FAQ (accordéon)

Liste `border-top --ligne-douce` entre items ; question `--t-lg` / 600 `--texte-fort`, `padding 20px 2px`, chevron 20 px `--accent-texte` (rotation 180° en 200 ms) ; réponse `--t-base` `--texte-2` 64 ch, `padding 0 2px 20px`, ouverture par `grid-template-rows: 0fr → 1fr` + flou 2 px → 0 en 200 ms `--courbe-sortie`. Item ouvert : `border-color --vert-doux`, fond `--surface-page`. Le contenu reste dans le DOM (JSON-LD `FAQPage` inchangé), `aria-expanded` sur le bouton, `hidden` sur le panneau fermé uniquement après hydratation.

### 4.13 Appel final

Bloc pleine largeur `padding 16px 0`, `border-top/bottom --ligne` ; intérieur `padding 128px 16px 120px`, `border-top/bottom --ligne`, motif grille 72 px fondu vers le haut à 40 % ; pile `gap 16px` centrée : eyebrow, `h2` `--t-5xl` 560 px, paragraphe `--t-lg` `--texte-2` 500 px ; puis, à la place du champ e-mail, une boîte 480 px `--surface-feuille` rayon 12 px bordure `--ligne` `padding 6px 8px` `--ombre-xs` contenant deux boutons alignés (contour « Parler à un humain » + principal « Réserver une démo », écart 16 px), qui s'empilent < 480 px.

### 4.14 Pied de page

`padding 144px 0 56px`, conteneur 1 360 px sans bordures. Colonnes : 4 (≥ 1024, `gap 32px / 48px`) ; 2 en dessous (`gap-x 32px`, blocs `gap-y 40px`). Titre de colonne 14 px / 600 `--texte-fort` ; liste `margin-top 12px`, `gap 10px` ; liens 14 px `--texte-2` → `--texte-fort`. Colonne « Modules » avec chips pleines 20 px (une par module affiché). Ligne © et liens légaux : `padding-top 128px`, 12 px **`--texte-2`** (5,64:1 ; la référence descend à 2,6:1, ce qui n'est pas admissible pour des liens obligatoires), liens `gap 32px / 16px`. Derrière (≥ 1024) : la tuile « M » du lockup en très grand (≈ 765 × 669 px, échelle 125 %, centrée à 48 %), tracée en `--surface-hover`, décorative (`aria-hidden`), sans `will-change`.

### 4.15 Carte et bande — un seul dessin (décision de Kevin, 07/10/2026)

Remplace, pour les cartes, la surface crème de 2.3 (« les cartes » en `--surface-feuille`) : sur la feuille crème, une carte crème se fondait dans le fond. Défini une fois dans `src/styles/global.css` (`.cartes`, `.carte`, `.bande`, `.cellule`) ; jetons en trois couches dans `tokens.css` : primitives (`--blanc`, `--encre-18`, `--vert-appui`), sémantique (`--surface-elevee`, `--ligne-forte`, `--accent-appui`, élévations `--ombre-posee` / `--ombre-levee`), composant (`--carte-fond`, `--carte-bord`, `--carte-bord-survol`, `--carte-ombre`, `--carte-ombre-survol`, `--carte-rayon`, `--carte-marge`, `--carte-ecart`, `--carte-icone`, `--cartes-ecart`).

- **Carte** `.carte` : fond blanc, bord 1 px `--ligne-forte` (1,4:1 sur crème), rayon 16 px, ombre posée diffuse teintée encre, marges 24 px puis 32 px (≥ 768). Contenu, toujours sous une carte ou une cellule (`:where(.carte, .cellule)`, sans spécificité ajoutée) : pastille `.carte-icone` 40 px (`--accent-texte` sur `--surface-page`, bord `--ligne`), méta `.carte-meta` 14 px `--texte-2`, titre `.carte-titre` Fraunces `--t-2xl`, texte `.carte-texte` `--texte-2`, action `.carte-action` `--accent-texte` 600 poussée en bas.
- **Carte cliquable** : la carte est le lien (`a.carte`) ou son lien `.carte-lien` s'étend sur toute la carte ; chaque carte cliquable finit par une action verte (libellé ou flèche). Survol : bord `--carte-bord-survol` et ombre levée ; appui : la fiche s'enfonce d'un pixel ; focus clavier : anneau 2,5 px `--focus` décalé de 3 px, sur la carte entière.
- **Grille** `.cartes` (requête de conteneur, donc juste aussi dans une colonne étroite) : 1 colonne sous 576 px ; 2 colonnes au-delà ; 3 colonnes quand le nombre de cartes est un multiple de 3 et que la grille mesure au moins 896 px ; sur 2 colonnes, un nombre impair étend la dernière carte sur toute la largeur (pictogramme ou image alors à côté du texte). Aucune carte orpheline ; aucune colonne fixée à la main.
- **Bande** `.bande` : la pleine largeur et les ornements de coin de 4.7 restent ; cellules `.cellule` au fond et aux marges de la carte, séparées par un filet `--carte-bord` (visible), même grille que les cartes. La grille des garanties (4.9) garde ses trois colonnes de tuiles, avec les mêmes filets et la même pastille.
- **Hors périmètre** : le blog (liste, rubriques, articles) garde son propre dessin (« les blogs pas besoin de toucher », Kevin, 07/10/2026) ; il ne porte ni `.cartes` ni `.carte`.
- **Aucun agrandissement d'image** : ni lien « Agrandir », ni dialogue, ni image cliquable vers son fichier (contrats `tests/browser/mobile-proofs.spec.ts`, `tests/proof/test_cartes.py`).

---

## 5. Motion Memlia

### 5.1 Entrées (au chargement, hero uniquement)

| Élément | Depuis | Durée | Courbe | Délai |
|---|---|---|---|---|
| Titre | opacité 0, y +15 px, échelle 0,98, flou 7 px | 500 ms | `--courbe-sortie` | 0 |
| Sous-titre | idem | 500 ms | idem | 100 ms |
| Boutons | opacité 0, y +20 px, flou 3 px | 500 ms | idem | 100 / 200 ms |
| Pastilles de module | idem | 500 ms | idem | 100 ms + 100 ms × i |
| Eyebrow | opacité 0, y −8 px, échelle 0,8, flou 4 px | 700 ms | `--courbe-etiquette` | 200 ms |
| Calque verre | opacité 0, échelle 0,99 | 700 ms | `--courbe-sortie` | quand 80 % visible |
| Écran de démo | opacité 0, échelle 0,98, flou 6 px, gris 100 % | 1 750 ms | `--courbe-douce` | 0, garde-fou 1,5 s |

### 5.2 Apparitions au défilement (toutes les autres sections)

Un seul motif, hérité de la landing actuelle et calé sur la référence : opacité 0 + y +14 px → neutre, 600 ms `--courbe-expo`, déclenché à 10 % de visibilité avec `rootMargin -40px`, une seule fois. Décalage de 80 ms entre enfants d'une même grille (max 6). Pas de flou hors hero (coût GPU sur mobile).

### 5.3 Micro-interactions

Survols 150 ms `--courbe-standard` (couleur, bordure, ombre, `translateY(-1px)` max) ; flèches de liens `translateX(2px)` 200 ms ; chevrons 200 ms ; panneaux 150 ms ; accordéons 200 ms ; logos / pictos 300 ms ; sélecteur 250 ms ; fondu croisé d'écran 300 ms ; autoplay du témoignage 5 500 ms avec commande de pause visible (le seul mouvement de plus de 5 s de la page ; le carrousel de repères ne bouge pas seul).

### 5.4 Règles

Propriétés animées : `opacity`, `transform`, `clip-path`, `filter` (hero seulement). Jamais `height` ni `width` : accordéons via `grid-template-rows: 0fr → 1fr`, barres et filets de progression via `transform: scaleX/scaleY`. Sous `prefers-reduced-motion: reduce` : toutes les entrées à l'état final, autoplay arrêté, opacités de scrollytelling à 1, transitions ≤ 1 ms. Aucune animation sans JS ne cache du contenu (`.rv` visibles par défaut, classe ajoutée à l'hydratation). Budget : au plus **trois** `backdrop-filter` actifs en même temps (nav, calque verre pendant sa révélation, panneau de menu ouvert).

---

## 6. Responsive Memlia

Points de rupture identiques à la référence : **640 · 768 · 1024 · 1280** (1536 inutile). Cibles de test visuel : 320, 375, 768, 1024, 1440, 1920.

| Écran | Comportement |
|---|---|
| < 640 | conteneur 672 max, marge 16 px ; ornements 10 px ; garanties 3 colonnes × 2 ; cartes-repères 280 px ; hero : titre 36 px, boutons empilés si < 400 px ; cadre de démo remplacé par une capture statique pleine largeur rayon 11 px |
| ≥ 640 | ornements 20 px ; cellules 128 px ; cartes 300 px ; boîte de l'appel final en ligne |
| ≥ 768 | bandes en 2 colonnes ; padding de colonne 48 / 64 px ; en-têtes de section en ligne ; pied en ligne |
| ≥ 1024 | menu centré ; conteneur 1 360 px, marge 32 px ; sélecteur de modules + cadre de démo ; garanties 6 colonnes ; scrollytelling 2 colonnes collantes ; titre hero 68 px ; cartes 320 px ; pied 4 colonnes ; emblème décoratif |
| ≥ 1280 | débord du cadre de démo 128 px |

Images : `width`/`height` explicites, `loading="lazy"` sauf la capture active du hero (`fetchpriority="high"`), AVIF puis WebP, `sizes` calé sur la colonne (50 vw en bande, 100 vw en hero). Listes de largeurs `srcset`, **une seule par emplacement, cette section fait foi** : hero 768 / 1 024 / 1 440 / 1 888 / 3 024 (largeur native, jamais au-delà) ; bande 500 / 1 000 ; parcours 570 / 1 140 ; emblèmes 2× / 3× de leur taille affichée ; fond d'ambiance 1 200 / 1 800 / 2 400.

---

## 7. Storyboard du site Memlia

Ordre et rôle des sections transposés ; le texte (copy) relève d'une autre carte : ici, seuls la fonction de chaque emplacement de texte et les **briefs d'images** sont fixés. Aucune image ne porte de texte, de chiffre, de logo ou d'interface lisible incrustés ; les captures produit viennent du banc Windows sur le jeu de données fictif, jamais d'un classeur client.

**Hypothèse de périmètre, à valider par Kevin.** Le storyboard affiche trois modules (suivi social, supervision sociale, flux compta). Au 08/09/2026, d'après l'état des dépôts : le module suivi social est livrable (recette passée le 26/07) ; la supervision sociale est en recette ; flux compta attend son exécutable et sa recette ; la synthèse de salaires n'a pas de socle. La consigne interdit toute promesse au-delà des modules livrés : **aucune entrée « bientôt »**, pour aucun module. Le gabarit doit tenir avec un seul module affiché — bande unique, nav sans panneau déroulant (« Le module » devient un lien simple), hero sans sélecteur, pied à une chip — et chaque bande, chip et capture d'un module non retenu est simplement retirée. La liste des modules affichés est une décision de Kevin, pas une déduction du document.

### Conventions de brief — exploitables tel quel avec la CLI Higgsfield

Chaque brief est écrit dans la même grammaire, dans cet ordre : **sujet · cadrage · palette · ratio et dimensions · négatifs · série · `alt` · emplacement**. Un brief auquel il manque un de ces champs n'est pas lançable.

**Outil et forme d'appel.** Génération par `@higgsfield/cli` (`higgsfield account status` pour vérifier la session avant tout lot) :

```bash
higgsfield generate cost   <modèle> --prompt "…" --aspect_ratio <r> [--resolution 2k]   # annoncer le coût
higgsfield generate create <modèle> --prompt "…" --aspect_ratio <r> [--resolution 2k] --wait
```

La génération est **payante à l'usage** : coût estimé annoncé et feu vert de Kevin avant chaque lot. Les prompts s'écrivent **en anglais** (les modèles y sont calés) ; les `alt` et les libellés restent en français. La sortie est une URL d'image matricielle : téléchargement, recadrage, puis conversion AVIF + WebP aux largeurs de la **section 6, qui fait foi** — et **jamais d'agrandissement** au-delà de la sortie du modèle.

**Ne passent pas par la génération** : les captures produit (IMG-01, 04, 05, 06 — banc Windows sur jeu fictif), le tracé SVG (IMG-14) et le montage Open Graph (IMG-15). Leurs briefs portent quand même leurs négatifs, qui se vérifient à l'œil.

**Négatifs — aucun modèle image n'expose `negative_prompt`** (relevé le 08/09/2026 sur `gpt_image_2`, `nano_banana_2`, `recraft_v4_1`, `soul_location`, `z_image`, `text2image_soul_v2`). Ils s'écrivent donc en deux temps :

1. *Formulation positive*, recopiée en fin de chaque `--prompt` — bloc commun **NEG-COMMUN**, identique pour toutes les images générées :
   > `matte studio photograph, plain cream paper backdrop, blank unprinted surfaces, unbranded anonymous objects, every surface free of any inscription, no people, clean sharp edges, even diffused light, soft natural grain`
2. *Liste de rejet*, vérifiée à l'œil sur chaque sortie — **un seul défaut = régénération**, jamais de retouche : texte, lettre ou chiffre incrusté, même illisible ou purement décoratif · logo, marque, monogramme ou marque déposée · écran, tableau ou donnée lisible · watermark ou signature · visage, main, personnage · artefacts (objet dupliqué, bord baveux, ombre incohérente, perspective qui casse, moiré, frange chromatique) · bleu franc (réservé à la tuile supervision) · rendu 3D brillant ou « photo de banque d'images ».

**Ratios — l'énumération `aspect_ratio` est fermée** (`1:1 · 3:2 · 2:3 · 4:3 · 3:4 · 16:9 · 9:16 · 21:9`, variable selon le modèle) : aucune dimension libre n'est acceptée, on génère au ratio le plus proche puis on recadre.

| Brief | Livré (section 6 fait foi) | Ratio | Modèle et résolution | Recadrage |
|---|---|---|---|---|
| IMG-02 | 2 400 × 1 200 (2:1) | `16:9` | `gpt_image_2 --resolution 4k` (le palier `2k` sort sous 2 400 px : il faudrait agrandir) | rogner en hauteur, centre laissé vide |
| IMG-03 | 400 × 400, livré 160 / 240 (1:1) | `1:1` | `gpt_image_2 --resolution 2k --background opaque` | aucun |
| IMG-07 → IMG-12 | 1 600 × 1 200 (4:3) | `4:3` | `gpt_image_2` (IMG-07) puis `nano_banana_2` (08 → 12), `--resolution 2k` | aucun |
| IMG-13 | 600 × 600, livré 144 / 216 (1:1) | `1:1` | `gpt_image_2 --resolution 2k` | aucun |

`--background transparent` existe sur `gpt_image_2`, mais sur un relief photographié c'est le papier qui porte l'ombre : IMG-03 se livre sur crème (l'option déjà prévue à son brief). Repli si le relief photographié rate : `recraft_v4_1 --model_type vector --background_color "#fcfbf7" --colors @couleurs.json` (le tableau `["#27b657"]` se passe par fichier, jamais en argument nu).

**Cohérence de série.** `gpt_image_2` n'expose pas de `seed` : la série des six objets de bureau (IMG-07 → IMG-12) tient par deux leviers, à respecter tels quels — (a) un **préambule identique** en tête des six prompts :

> `matte studio still life, one small group of desk objects centred on a plain cream paper backdrop, 30° high-angle view, one soft shadow falling to the left, warm neutral light, medium shot`

et (b) la première image validée réinjectée en référence pour les cinq suivantes (`nano_banana_2 --image ./img-07.png`), le prompt ne décrivant alors **que le changement de sujet**, jamais la scène entière. Si une image sort du registre, on la régénère — on ne rattrape pas les cinq autres. Les deux emblèmes (IMG-03, IMG-13) forment une seconde série : même papier crème, même relief léger, même éclairage rasant de gauche, un seul filet vert. Les captures (IMG-01, 04, 05, 06) forment la troisième : même session, même zoom, même angle de rognage.

**Contrôle avant commit.** Le scan anti-fuite ne lit pas une image : **relecture visuelle par Kevin de chaque fichier avant commit**, générations comprises, en plus de la liste de rejet ci-dessus.

### S0 — Bandeau d'annonce

Absent du gabarit au lancement (pas de balisage vide). Le jour d'une actualité, l'ajouter au-dessus de la nav avec les mesures de la section 1.1 (6 px + bouton 24 px, lien 12 px, motif diagonal).

### S1 — Navigation

Lockup à gauche ; entrées : **Modules ▾** (ou « Le module »), **Méthode**, **Questions**, **Blog** ; à droite : contour « Parler à un humain », principal « Réserver une démo » (Cal.com). Panneau « Modules » : une entrée par module affiché, chip pleine à la teinte de tuile. Aucune image.

### S2 — Hero

Eyebrow (pastille avec point vert) · `h1` en deux lignes, mot-clé en Fraunces italique · sous-titre 672 px · boutons principal + contour · ligne de confiance (2 pictos : « au-dessus d'Excel, sans migration », « RGPD & secret professionnel ») · sélecteur de modules (≥ 1024) · cadre de démo.

**IMG-01 · Capture du panneau latéral dans Excel (par module, 3 variantes)**
- Sujet : Excel Windows, classeur de suivi fictif ouvert, panneau Memlia à droite montrant un état « proposition vs saisie » (lignes proposées en vert-voile, lignes saisies neutres).
- Cadrage : fenêtre entière sans barre des tâches, ruban réduit, zoom 100 %, panneau ≈ 30 % de la largeur, pas de curseur.
- Palette : chrome Excel natif, interface Memlia verte, tuile du module concernée ; fond de la fenêtre neutre.
- Ratio et dimensions : **aucune génération** — capture d'écran du banc, jamais un modèle. Capture native 3 024 × 1 610 px (ratio 1,878) ; largeurs livrées 768, 1 024, 1 440, 1 888 et 3 024 (la native sert le 2× du cadre à 1 512 px ; on ne livre jamais plus large que la source), AVIF + WebP.
- Négatifs : aucun texte ajouté au montage — uniquement les libellés du jeu fictif, aucun nom réel, aucune donnée client, aucun montant reconnaissable ; pas de curseur, pas d'info-bulle, pas de notification Windows, pas de barre des tâches, pas d'onglet de navigateur, pas de compte Office ni de chemin de fichier réel dans la barre de titre, pas de watermark d'outil de capture, pas de bord flouté ni d'agrandissement au-delà de la native. Classeur = jeu de test fictif du dépôt du module (`produit/memlia-suivi-social`, jamais `fichiers-recus/`). Le scan anti-fuite ne lit pas une image : **relecture visuelle par Kevin de chaque capture avant commit**, obligatoire.
- Série : les trois variantes (une par module) sont prises dans la même session — même fenêtre, même zoom 100 %, même largeur de panneau, même feuille active, même position de défilement ; seuls la teinte de tuile et le contenu du panneau changent. Une variante reprise plus tard se refait entièrement, on n'en remplace pas une seule.
- `alt` : « Panneau Memlia ouvert à droite d'un classeur Excel de suivi social, avec des lignes proposées à valider ».
- Emplacement : écran du cadre de démo (≥ 1024) ; version 768 px en statique sous 1024.

**IMG-02 · Fond d'ambiance du hero (optionnel, derrière le cadre)**
- Sujet : lumière douce sur une feuille de papier crème vue de très près, grain fin, une ombre légère en bas à droite ; abstrait.
- Cadrage : plan très rapproché, horizontal, centre vide (le cadre se pose dessus), vignettage 10 %.
- Palette : crème `#fffefb` à papier `#fcfbf7`, ombre encre à 6 %, une touche de vert-voile `#eafaef` dans le quart inférieur droit.
- Ratio et dimensions : généré en `16:9` puis rogné en hauteur vers 2:1 (le centre reste vide) — `higgsfield generate create gpt_image_2 --prompt "…" --aspect_ratio 16:9 --resolution 4k --wait` ; le palier `2k` sortirait sous les 2 400 px livrés. Livré 2 400 × 1 200 px, AVIF + WebP, `srcset` 1 200 / 1 800 / 2 400.
- Négatifs : NEG-COMMUN + aucun objet identifiable, aucun stylo, aucune main, aucune plante ; pas de pliure marquée ni de trame régulière (moiré à l'échelle du fond), pas de bleu, pas de dégradé bruité ou en bandes, pas de vignettage au-delà de 10 %, pas de reflet spéculaire dur qui concurrencerait le cadre posé dessus.
- Série : partage le registre papier des emblèmes (IMG-03, IMG-13) — même crème, même grain ; c'est aussi le fond du montage IMG-15, donc la version retenue est figée avant de composer l'Open Graph.
- `alt` : vide (décoratif, `aria-hidden`).

### S3 — Grille de garanties (remplace les logos clients)

Six cellules : IA prépare / humain décide · aucune donnée client dans les démos · RGPD & secret professionnel · zéro macro, zéro migration · fail-closed (refuse d'écrire plutôt que d'écrire faux) · anti-surveillance (agrégats, jamais nominatif). En-tête : phrase 16 px / 500 + lien-flèche vers la FAQ ; à droite, à la place du badge tiers : IMG-03.

**IMG-03 · Emblème « registre » (à la place du badge tiers)**
- Sujet : un sceau rond en relief léger, comme une empreinte à sec sur du papier, motif géométrique simple (cercle + quatre traits), pas de lettre.
- Cadrage : centré, carré, marge 12 % autour du sceau, vue de face, éclairage rasant de gauche.
- Palette : papier `#fcfbf7`, relief encre à 10 %, un filet vert `#27b657` sur le cercle extérieur.
- Ratio et dimensions : `higgsfield generate create gpt_image_2 --prompt "…" --aspect_ratio 1:1 --resolution 2k --background opaque --wait`, ramené à 400 × 400 px, livré 160 et 240 px (2× et 3× des 80 px affichés), WebP + AVIF, sur crème (le relief a besoin du papier qui porte son ombre ; `--background transparent` n'a de sens que sur le repli vectoriel `recraft_v4_1 --model_type vector`).
- Négatifs : NEG-COMMUN + aucune lettre, aucun chiffre, aucun monogramme dans le sceau (motif strictement géométrique : cercle et quatre traits) ; aucun blason, sceau officiel ou emblème existant ; pas d'effet doré, métallique ou de cire ; pas de double ombre portée, pas de bord dentelé ni de contour vectoriel apparent, pas de rendu 3D brillant.
- Série : forme une paire avec IMG-13 — même papier crème, même relief léger, même éclairage rasant de gauche, un seul filet vert ; générer les deux dans le même lot.
- `alt` : « Sceau Memlia en relief sur papier ».

Pictos des six cellules : SVG maison trait 1,5, 24 px, monochromes (pas d'images générées).

### S4 — Bandes de modules (×3)

Rang 1 — **Suivi social** (tuile verte) : chip, `h3`, paragraphe, bouton contour « Voir le module », capture IMG-04.
Rang 2 — **Supervision sociale** (tuile bleue `#1e63d4`) : idem, capture IMG-05 — sous réserve de l'hypothèse de périmètre.
Rang 3 — **Flux compta** (tuile cuivre) : idem, capture IMG-06 (app de bureau, pas Excel) — sous réserve de l'hypothèse de périmètre.

Le bouton « Voir le module » pointe vers l'ancre `#module-<nom>` de la bande tant que la page du module n'existe pas (voir 7 bis).

**IMG-04 / IMG-05 · Captures produit des modules Excel**
- Sujet : le panneau du module avec un onglet généré visible dans le classeur fictif (module 1 : feuille de suivi avec lignes proposées ; module 2 : un des dix onglets générés, tableau agrégé, jamais nominatif).
- Cadrage : rogné sur le quart bas-droite de la fenêtre Excel (panneau + coin du classeur), le bord gauche et le haut sont coupés par le panneau écran de la bande ; 1 000 × 720 px minimum visibles.
- Palette : Excel natif + vert Memlia (module 1) / tuile bleue (module 2) ; fond de bande dégradé de la tuile 1 % → 10 %.
- Ratio et dimensions : **aucune génération** — capture du banc. Source 2 000 × 1 440 px (ratio 1,389), livrée 500 / 1 000 px de large (× 2), AVIF + WebP ; jamais plus large que la source.
- Négatifs : aucun texte ajouté, libellés du jeu fictif seulement ; aucun nom de personne, aucune donnée nominative dans l'onglet de supervision (agrégats seulement), aucun montant reconnaissable ; pas de curseur, pas d'info-bulle, pas de notification Windows, pas de barre des tâches, pas de compte Office ni de chemin de fichier réel visible, pas de watermark d'outil de capture, pas d'agrandissement, pas de bord flouté au rognage. Classeur = jeu de test fictif du dépôt du module (`produit/memlia-suivi-social`, `produit/memlia-supervision-sociale`), jamais `fichiers-recus/` ; relecture visuelle par Kevin de chaque capture avant commit.
- Série : IMG-04, IMG-05 et IMG-06 forment une série — même angle de rognage (quart bas-droite), même échelle apparente du panneau, même hauteur de capture, un seul écran par bande ; seules la teinte de tuile et le fond de bande changent.
- `alt` : « Onglet de suivi social généré par Memlia dans Excel, avec le panneau de validation » / « Onglet de supervision agrégée généré par Memlia, sans donnée nominative ».

**IMG-06 · Capture de l'app de bureau Flux compta**
- Sujet : fenêtre pywebview de l'app (accent cuivre) montrant l'écran de rapprochement caisse / boutique en ligne / suivi comptable sur données fictives.
- Cadrage : quart bas-droite de la fenêtre, comme IMG-04, barre de titre Windows coupée.
- Palette : interface de l'app (crème, cuivre), fond de bande cuivre 1 % → 10 %.
- Ratio et dimensions : **aucune génération** — capture du banc, idem IMG-04 (source 2 000 × 1 440 px, livrée 500 / 1 000 px).
- Négatifs : aucun texte ajouté ; données = jeu fictif du dépôt `produit/memlia-flux-compta` ; aucun nom de commerce, d'enseigne ou de service tiers lisible à l'écran (les libellés de source restent génériques), aucun montant reconnaissable ; pas de curseur, pas de notification, pas de barre des tâches, pas de watermark de capture, pas d'agrandissement. Relecture visuelle par Kevin avant commit.
- Série : troisième image de la série IMG-04 / IMG-05 / IMG-06 — même angle de rognage et même échelle apparente, malgré la fenêtre applicative au lieu d'Excel.
- `alt` : « Écran de rapprochement des flux de caisse et de boutique en ligne dans l'application Memlia Flux compta ».

### S5 — Parcours « une journée au cabinet » (scrollytelling)

Titre collant ; six étapes avec chip claire, `h3`, paragraphe et une illustration par étape : 1 réception des pièces · 2 saisie de la paie · 3 contrôle avant DSN · 4 relance et pièces manquantes · 5 restitution au dirigeant · 6 pilotage du cabinet. Style commun : illustrations d'objets de bureau photographiés en studio, sans personnage, sans écran lisible.

**IMG-07 à IMG-12 · Série « objets du cabinet » (6 images, même série)**
- Sujets, un par étape : (07) une pile de trois enveloppes kraft et une pochette élastique ; (08) une calculatrice de bureau et un bulletin plié, vierge ; (09) un tampon dateur et un trombone sur une feuille quadrillée vierge ; (10) un combiné téléphonique posé sur un carnet fermé ; (11) deux tasses et une chemise cartonnée ouverte sur une table ; (12) une lampe d'architecte éclairant un plan de travail vide.
- Cadrage : plan moyen en plongée 30°, objet centré, fond uni, ombre portée douce unique à gauche ; ratio 4:3.
- Palette : fond papier `#fcfbf7`, objets en crème / encre / kraft, une seule touche de vert `#27b657` par image (élastique, capuchon, trombone…), jamais de bleu.
- Ratio et dimensions : `--aspect_ratio 4:3 --resolution 2k` — IMG-07 avec `gpt_image_2`, IMG-08 → IMG-12 avec `nano_banana_2 --image ./img-07.png` (le prompt ne décrit alors que le changement de sujet). Ramenées à 1 600 × 1 200 px, livrées 570 / 1 140 px de large, AVIF + WebP.
- Négatifs : NEG-COMMUN + feuilles strictement vierges ou quadrillées (aucun imprimé, aucun tampon lisible, aucune date sur le tampon dateur, écran de calculatrice éteint et sans chiffre) ; objets anonymes, aucune marque ni logo sur la calculatrice, le téléphone ou la lampe ; aucun personnage, aucune main ; aucune plante, aucune tasse à motif ; une seule ombre portée (pas de second éclairage), pas de reflet spéculaire dur, pas d'objet dupliqué en arrière-plan, pas de bleu, pas de rendu 3D brillant.
- Série : préambule commun de la section « Conventions de brief » recopié tel quel en tête des six prompts ; même fond, même angle 30°, même ombre à gauche, une seule touche de vert par image. Une image hors registre se régénère — on ne rattrape pas les cinq autres.
- `alt` (exemples) : « Enveloppes kraft et pochette de pièces comptables » ; « Calculatrice de bureau et bulletin de paie plié, vierge ».

### S6 — Preuve : méthode, repères, témoignage

(a) Bloc « méthode » (à la place du bloc de note tierce) : emblème IMG-13, pastille « proposition vs saisie », `h2` 450 px, phrase, boutons sombre « Voir la méthode » + contour « Lire les questions ».
(b) Piste de **repères vérifiables** (sans défilement automatique, voir 4.10) : chiffres métier reproductibles et stables — par exemple « 10 onglets générés », « 0 macro », « 0 migration », « 3 passes de vérification » — chip du module, lien vers l'ancre du module. Règle : aucun chiffre client, aucun compte de tests internes (ils bougent à chaque commit et ne parlent pas à un cabinet) ; la liste finale est validée par Kevin.
(c) Mur « méthode » : 8 pictos de principes autour d'un **témoignage** — activé seulement avec accord écrit du cabinet (signature « Responsable paie, cabinet de 12 collaborateurs »), sinon la cellule centrale affiche une citation de la charte (« L'IA prépare, l'humain décide »).

**IMG-13 · Emblème de la méthode**
- Sujet : deux feuilles de papier superposées légèrement décalées, celle du dessus porte une zone vert-voile (la proposition), celle du dessous est nette et blanche (la saisie) ; vue de dessus, abstrait.
- Cadrage : carré, centré, marge 15 %.
- Palette : crème, papier, vert-voile `#eafaef`, filet vert `#27b657`, ombre encre 8 %.
- Ratio et dimensions : `higgsfield generate create gpt_image_2 --prompt "…" --aspect_ratio 1:1 --resolution 2k --background opaque --wait`, ramené à 600 × 600 px, livré 144 et 216 px (2× et 3× des 72 px affichés), WebP + AVIF.
- Négatifs : NEG-COMMUN + feuilles strictement vierges (aucune ligne de texte simulée, aucun filigrane, aucun tableau, aucun graphique), aucune main ni trombone, une seule ombre portée douce, pas de perspective en fuite (vue de dessus stricte), pas de bord corné ni de déchirure, pas de rendu 3D brillant, pas de vert saturé au-delà du filet `#27b657`.
- Série : paire avec IMG-03 — même papier crème, même relief léger, même éclairage rasant de gauche ; générés dans le même lot.
- `alt` : « Deux feuilles superposées, la proposition en vert sur la saisie ».

**IMG-14 · Fond du bloc méthode (à la place du graphique de fond)**
- Sujet : grande courbe d'accolade en filigrane, tracée au trait fin, comme une reliure vue de profil ; très pâle.
- Cadrage : centré, 605 px de large max à l'affichage, hauteur ≈ 1,06 × largeur, extrémités qui s'évanouissent.
- Palette : trait encre 6 % sur transparent.
- Ratio et dimensions : 1 210 × 1 290 px, PNG transparent ou SVG tracé à la main — **préférer le SVG, aucune génération** ; le ratio visé (0,938:1) n'existe d'ailleurs dans aucune énumération `aspect_ratio`, et un trait à 6 % d'opacité ne survit pas à une compression de modèle.
- Négatifs : aucun texte ; trait unique d'épaisseur constante, pas de remplissage, pas d'ombre, pas de dégradé, pas de bord aliasé, pas de fond opaque (transparent strict), aucun raccord visible aux extrémités qui s'évanouissent.
- Série : élément de structure, hors des deux séries d'images ; il partage la couleur de filet des ornements (`--ligne-douce`), pas le registre photographique.
- `alt` : vide (décoratif).

### S7 — Questions (FAQ)

Rail collant à gauche (eyebrow, `h2`, phrase, lien-flèche « Parler à un humain ») ; accordéon à droite avec les huit questions existantes (JSON-LD `FAQPage` conservé). Aucune image.

### S8 — Appel final

Eyebrow « Voir Memlia en action » · `h2` · phrase 500 px · boîte à deux boutons (Cal.com). Motif grille fondu. Aucune image.

### S9 — Pied de page

Colonnes : Modules (une chip par module affiché) · Méthode (proposition vs saisie, sécurité & RGPD, anti-surveillance) · Ressources (Blog, Questions, `llms.txt` non listé) · Cabinet (Contact, Mentions légales, Confidentialité). Ligne © 2026 Memlia. Emblème « M » en filigrane derrière (SVG dérivé du lockup, pas de génération).

### Image de partage

**IMG-15 · Open Graph (remplace `assets/og-memlia.png`)**
- Sujet : le cadre de démo IMG-01 (module suivi social) posé en perspective légère sur le fond IMG-02, lockup rendu en SVG par-dessus au montage (pas dans la génération).
- Cadrage : 1 200 × 630, capture décalée à droite, tiers gauche libre pour le lockup.
- Palette : crème, vert, encre.
- Dimensions : 1 200 × 630 px, PNG (exigence des réseaux) + WebP.
- Sans texte généré ; seul le lockup SVG est ajouté au montage.
- `alt` (balise `og:image:alt`) : « Memlia, compléments Excel pour cabinets d'expertise comptable ».

Récapitulatif : 15 briefs — 5 captures produit (IMG-01 ×3 variantes comptées pour une, 04, 05, 06), 9 images générées (02, 03, 07–12, 13), 1 montage (15), 1 SVG tracé (14) ; aucun visage, aucun logo tiers, aucun texte incrusté. Les captures et briefs des modules non retenus par Kevin sont retirés sans remplacement.

### 7 bis — Gabarits hors accueil (hors périmètre de cette carte, à traiter dans la carte d'intégration)

La page d'accueil renvoie vers des pages qui n'existent pas encore ; tant qu'elles n'existent pas, chaque lien pointe vers une ancre de l'accueil. Gabarits minimaux à produire ensuite, avec les mêmes tokens :
- **Page module** : hero réduit (eyebrow, `h1` `--t-5xl`, sous-titre, deux boutons, capture IMG-04 en cadre de démo), une bande par capacité du module, FAQ filtrée sur le module, appel final.
- **Liste du blog** (content collections Astro) : en-tête de section, grille 1 → 3 colonnes de cartes bordées (`gap 1px` sur `--ligne`, `padding 24px`, date 12 px, titre `--t-xl`, extrait `--t-base`), sans image générée par article au lancement.
- **Article** : colonne 672 px, `--t-base` 18 px, sommaire collant à droite ≥ 1024, aucun motif de fond.
- **Pages légales** (`noindex`, existantes) : colonne 672 px, sans motif ni ornement, mêmes tokens de texte.

---

## 8. Contraintes de mise en œuvre (rappel pour la carte suivante)

- Astro, un seul `h1`, `lang="fr"`, `title` / `description` / canonical / OG / JSON-LD (Organization, WebSite, SoftwareApplication, FAQPage), `robots.txt`, `sitemap.xml` généré, `llms.txt`, pages légales `noindex` : inchangés.
- Lighthouse ≥ 95 sur les quatre axes : budget JS < 150 Ko gzippé — pas de framer-motion ; entrées en CSS (`@starting-style` + classes), scrollytelling avec `IntersectionObserver` + `scroll-timeline` quand disponible, repli sans animation sinon.
- Deux familles de polices, trois fichiers préchargés (Fraunces 600, Hanken 400, Hanken 500), Fraunces 400 italique en différé.
- Hover sous `@media (hover: hover)` ; `prefers-reduced-motion` respecté partout ; `forced-colors` : bordures visibles sur boutons et chips ; au plus trois `backdrop-filter` actifs simultanément ; tout mouvement de plus de 5 s a une commande de pause visible.
- Rien ne part vers l'extérieur sans geste humain : aucun formulaire d'e-mail, tous les CTA vont vers Cal.com.

## 9. Vérifications faites sur ce document et limites

- Chaque mesure de la section 1 provient d'une lecture programmatique de l'export (arbre DOM annoté, variables de thème, `@media`, `@keyframes`, paramètres d'animation JS) ; les valeurs hexadécimales de la section 2.2 sont converties depuis les HSL relevés (approximations à ±1).
- Aucune chaîne de texte, aucun sélecteur complet, aucune image de navattic n'est reproduit ici ; les noms utilitaires cités servent d'unités.
- Contrastes calculés par script (formule WCAG 2.x, alpha composé) ; quatre défauts de la charte actuelle sont signalés et corrigés dans les tokens (muted 60 %, vert-appui en texte courant, blanc sur vert, indicateur de focus en vert 2,63:1).
- Relecture indépendante (agent frontend) après rédaction : trois bloquants corrigés (pause des contenus animés, contrastes sous 3:1 sur focus / liens légaux / chip verte, périmètre des modules et créneau « bientôt »), dix points importants et quatorze mineurs intégrés (alias sémantiques déclarés, dimensions d'images unifiées, motif de navigation sans piège de focus, cellules de garanties cliquables, budget de `backdrop-filter`, plus d'animation de hauteur, gabarits hors accueil listés, corps de texte 16 → 18 px conservé, relecture visuelle des captures).
- Non vérifié ici : le rendu réel des polices Fraunces / Hanken aux tailles proposées (à faire à l'écran dans la carte d'intégration), la survie de `tnum` dans le sous-ensemble Fraunces, les teintes cuivre et pétrole exactes des modules 4 et 6 (à relever dans leurs dépôts), la liste des modules affichés et des repères chiffrés (décisions Kevin).
