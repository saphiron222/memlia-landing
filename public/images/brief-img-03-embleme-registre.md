# Brief img-03-embleme-registre

Statut : placeholder M3 ; visuel final à produire par M4.
Source : docs/design/2026-09-08-design-navattic-memlia.md (M2).
Pour les blocs communs, ne produire que le numéro du nom de ce fichier.
IMG-14 : décor CSS/SVG ; IMG-15 : OG historique conservé jusqu’au montage M4.

**IMG-03 · Emblème « registre » (à la place du badge tiers)**
- Sujet : un sceau rond en relief léger, comme une empreinte à sec sur du papier, motif géométrique simple (cercle + quatre traits), pas de lettre.
- Cadrage : centré, carré, marge 12 % autour du sceau, vue de face, éclairage rasant de gauche.
- Palette : papier `#fcfbf7`, relief encre à 10 %, un filet vert `#27b657` sur le cercle extérieur.
- Ratio et dimensions : `higgsfield generate create gpt_image_2 --prompt "…" --aspect_ratio 1:1 --resolution 2k --background opaque --wait`, ramené à 400 × 400 px, livré 160 et 240 px (2× et 3× des 80 px affichés), WebP + AVIF, sur crème (le relief a besoin du papier qui porte son ombre ; `--background transparent` n'a de sens que sur le repli vectoriel `recraft_v4_1 --model_type vector`).
- Négatifs : NEG-COMMUN + aucune lettre, aucun chiffre, aucun monogramme dans le sceau (motif strictement géométrique : cercle et quatre traits) ; aucun blason, sceau officiel ou emblème existant ; pas d'effet doré, métallique ou de cire ; pas de double ombre portée, pas de bord dentelé ni de contour vectoriel apparent, pas de rendu 3D brillant.
- Série : forme une paire avec IMG-13 — même papier crème, même relief léger, même éclairage rasant de gauche, un seul filet vert ; générer les deux dans le même lot.
- `alt` : « Sceau Memlia en relief sur papier ».


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
