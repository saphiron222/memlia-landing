# Brief img-09-tampon-dateur

Statut : placeholder M3 ; visuel final à produire par M4.
Source : docs/design/2026-09-08-design-navattic-memlia.md (M2).
Pour les blocs communs, ne produire que le numéro du nom de ce fichier.
IMG-14 : décor CSS/SVG ; IMG-15 : OG historique conservé jusqu’au montage M4.

**IMG-07 à IMG-12 · Série « objets du cabinet » (6 images, même série)**
- Sujets, un par étape : (07) une pile de trois enveloppes kraft et une pochette élastique ; (08) une calculatrice de bureau et un bulletin plié, vierge ; (09) un tampon dateur et un trombone sur une feuille quadrillée vierge ; (10) un combiné téléphonique posé sur un carnet fermé ; (11) deux tasses et une chemise cartonnée ouverte sur une table ; (12) une lampe d'architecte éclairant un plan de travail vide.
- Cadrage : plan moyen en plongée 30°, objet centré, fond uni, ombre portée douce unique à gauche ; ratio 4:3.
- Palette : fond papier `#fcfbf7`, objets en crème / encre / kraft, une seule touche de vert `#27b657` par image (élastique, capuchon, trombone…), jamais de bleu.
- Ratio et dimensions : `--aspect_ratio 4:3 --resolution 2k` — IMG-07 avec `gpt_image_2`, IMG-08 → IMG-12 avec `nano_banana_2 --image ./img-07.png` (le prompt ne décrit alors que le changement de sujet). Ramenées à 1 600 × 1 200 px, livrées 570 / 1 140 px de large, AVIF + WebP.
- Négatifs : NEG-COMMUN + feuilles strictement vierges ou quadrillées (aucun imprimé, aucun tampon lisible, aucune date sur le tampon dateur, écran de calculatrice éteint et sans chiffre) ; objets anonymes, aucune marque ni logo sur la calculatrice, le téléphone ou la lampe ; aucun personnage, aucune main ; aucune plante, aucune tasse à motif ; une seule ombre portée (pas de second éclairage), pas de reflet spéculaire dur, pas d'objet dupliqué en arrière-plan, pas de bleu, pas de rendu 3D brillant.
- Série : préambule commun de la section « Conventions de brief » recopié tel quel en tête des six prompts ; même fond, même angle 30°, même ombre à gauche, une seule touche de vert par image. Une image hors registre se régénère — on ne rattrape pas les cinq autres.
- `alt` (exemples) : « Enveloppes kraft et pochette de pièces comptables » ; « Calculatrice de bureau et bulletin de paie plié, vierge ».


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
