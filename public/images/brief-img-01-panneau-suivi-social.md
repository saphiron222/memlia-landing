# Brief img-01-panneau-suivi-social

Statut : placeholder M3 ; visuel final à produire par M4.
Source : docs/design/2026-09-08-design-navattic-memlia.md (M2).
Pour les blocs communs, ne produire que le numéro du nom de ce fichier.
IMG-14 : décor CSS/SVG ; IMG-15 : OG historique conservé jusqu’au montage M4.

**IMG-01 · Capture du panneau latéral dans Excel (par module, 3 variantes)**
- Sujet : Excel Windows, classeur de suivi fictif ouvert, panneau Memlia à droite montrant un état « proposition vs saisie » (lignes proposées en vert-voile, lignes saisies neutres).
- Cadrage : fenêtre entière sans barre des tâches, ruban réduit, zoom 100 %, panneau ≈ 30 % de la largeur, pas de curseur.
- Palette : chrome Excel natif, interface Memlia verte, tuile du module concernée ; fond de la fenêtre neutre.
- Ratio et dimensions : **aucune génération** — capture d'écran du banc, jamais un modèle. Capture native 3 024 × 1 610 px (ratio 1,878) ; largeurs livrées 768, 1 024, 1 440, 1 888 et 3 024 (la native sert le 2× du cadre à 1 512 px ; on ne livre jamais plus large que la source), AVIF + WebP.
- Négatifs : aucun texte ajouté au montage — uniquement les libellés du jeu fictif, aucun nom réel, aucune donnée client, aucun montant reconnaissable ; pas de curseur, pas d'info-bulle, pas de notification Windows, pas de barre des tâches, pas d'onglet de navigateur, pas de compte Office ni de chemin de fichier réel dans la barre de titre, pas de watermark d'outil de capture, pas de bord flouté ni d'agrandissement au-delà de la native. Classeur = jeu de test fictif du dépôt du module (`produit/memlia-suivi-social`, jamais `fichiers-recus/`). Le scan anti-fuite ne lit pas une image : **relecture visuelle par Kevin de chaque capture avant commit**, obligatoire.
- Série : les trois variantes (une par module) sont prises dans la même session — même fenêtre, même zoom 100 %, même largeur de panneau, même feuille active, même position de défilement ; seuls la teinte de tuile et le contenu du panneau changent. Une variante reprise plus tard se refait entièrement, on n'en remplace pas une seule.
- `alt` : « Panneau Memlia ouvert à droite d'un classeur Excel de suivi social, avec des lignes proposées à valider ».
- Emplacement : écran du cadre de démo (≥ 1024) ; version 768 px en statique sous 1024.


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
