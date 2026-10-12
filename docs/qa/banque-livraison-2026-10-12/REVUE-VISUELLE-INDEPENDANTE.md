# Revue indépendante de la couverture bancaire

- Verdict : **PASS**, aucun défaut bloquant.
- Reviewer : `hermes-sous-agent-revue-visuelle-independante` ; date : `2026-10-12T16:47:18.909794+02:00`.
- Génération : `exec-33d99a39-d32b-4617-9253-060758da07f0`.
- Master, hero-768, OG preuve et OG public inspectés effectivement avec `vision_analyze` ; aucune nouvelle génération, publication ou modification editorial/code.

## Critères

### brief-six-components — PASS
- Les six composantes sujet, composition, style, palette, interdits et alt sont explicites. Deux longs plateaux parallèles vert/graphite de cartes crème, trois attaches vertes, petite carte isolée et dossier arrière réellement visibles dans master, hero et OG.
- Diorama géométrique isométrique mat ; lumière douce, ombres vers le bas/droite et fond crème aéré. Le dossier arrière est vert, détail non bloquant.

### generation-constraints — PASS
- Aucun texte, chiffre, logo, personnage, main, donnée client, interface, rouge, sceau de validation ni symbole d’envoi visible dans les trois images inspectées.
- Identifiant exec-33d99a39-d32b-4617-9253-060758da07f0 et fournisseur OpenAI consignés ; empreintes source et master concordent avec generation.json. Modèle exact et coût inconnus ; credits null ne signifie pas coût nul. Aucun appel de génération pendant cette revue. Le mot ceramic appartient au prompt exact fourni : aucune réécriture de conformité.

### fictive-provenance — PASS
- Cartes entièrement vierges et géométriques, sans montant, identité ou compte réel : métaphore fictive, pas capture bancaire ni preuve de produit livré.
- image-source.png identique octet pour octet à la pièce jointe désignée ; prompt identique entre recette et image-source.json. Provenance locale cohérente, sans vérification indépendante de l’appel fournisseur originel.

### recognizable-subject — PASS
- Trois ponts verts relient des paires entre deux ensembles ; une carte séparée en plateau graphite rend visible le reste à examiner. Ces objets restent lisibles au format hero 768 et en OG.
- Le rapprochement et ses exceptions sont reconnaissables avec le titre bancaire. Sans titre, aucune banque littérale n’est identifiable : limite sémantique non bloquante du brief abstrait, sans garantie de solde ou choix automatique.

### technical-derivatives — PASS
- Mesures sips : master 1920×1080 PNG ; hero 768×432 WebP/AVIF ; OG preuve et public 1200×630 WebP ; variantes publiques 1200×675 et 1600×900 WebP/AVIF. Tailles et SHA-256 détaillés ci-dessous.
- Hero et OG effectivement regardés : aucun objet important coupé, séparation de la carte isolée préservée. OG public aussi regardé car son encodage diffère : même composition et recadrage, sans défaut visuel bloquant. Ne pas prétendre à une identité binaire OG public/preuve.

### alt-information — PASS
- Alt mesuré à 96 caractères, sous 125, identique entre recette.image.alt et brief.alt : Deux plateaux de cartes vierges appariées par des attaches vertes, une carte isolée pour examen.
- Décrit les deux plateaux, les attaches et la carte isolée sans certifier de validation. Le dossier arrière n’est pas décrit, omission secondaire acceptable. Les alternatives des figures sont inchangées dans inlineProofs.

## Conservation du fond
- Diff structurel recette avant/après : seuls les chemins `/image/*` ci-dessous changent ; sources, claims, tâche, inlineProofs et autres champs strictement identiques.
  - `/image/alt`
  - `/image/brief/alt`
  - `/image/brief/composition`
  - `/image/brief/interdits`
  - `/image/brief/palette`
  - `/image/brief/prompt`
  - `/image/brief/reviewCriteria`
  - `/image/brief/style`
  - `/image/brief/sujet`
  - `/image/source/generationId`
- Corps selon la méthode effective de la forge (`trim()` avant SHA-256) : `35bafc1b60252726d1025326a392c3ac14d8220b435148cc142793b2bf9a7bba`, identique au subject historique. Empreinte brute différente uniquement par l’enveloppe whitespace de calcul : `073a76b3985a2ea2112c948cbb23b0077bc73611d3452a986ab7a827a68d7e97` ; aucune substitution d’empreinte.
- `coverCorrection.originalSubject` identique intégralement au subject archivé ; SHA du fichier de revue historique conforme à la référence enregistrée.
- Sections editorial, business, sources et qualite inchangées ; PASS92 historique conservé sans refaire la revue réglementaire.
- Avis historiques des figures conservés intégralement dans le JSON. Les deux fichiers mesurés concordent avec les SHA du manifeste figé, leurs dimensions 1600×900 et tailles 27722 / 28752 octets restent sous 150 Ko.

## Mesures
| Fichier | Dimensions | Octets | SHA-256 |
|---|---:|---:|---|
| `editorial/articles/rapprochement-bancaire-automatise-les-ecarts-a-remonter/preuves/image/master.png` | 1920×1080 | 2914196 | `9c1c102b62279e01010ae4f272e395227e8a6b3aa9eafa7a3b4601341fdde260` |
| `editorial/articles/rapprochement-bancaire-automatise-les-ecarts-a-remonter/preuves/image/hero-768.webp` | 768×432 | 15340 | `9427428118609da795264e57c909e14c23a8b77cfe52c5842c9ed87127943bb6` |
| `editorial/articles/rapprochement-bancaire-automatise-les-ecarts-a-remonter/preuves/image/hero-768.avif` | 768×432 | 9536 | `96d70b8c6dc0a1a0c6b32fa64bc3b2e237cc244d7a932310073b60017a399aea` |
| `editorial/articles/rapprochement-bancaire-automatise-les-ecarts-a-remonter/preuves/image/og.webp` | 1200×630 | 42414 | `c4fbd8485aae32082d120fdb54e12fe15743dd51c45b2772cbea316c182c6b6a` |
| `editorial/recettes/rapprochement-bancaire-automatise-les-ecarts-a-remonter/image-source.png` | 1672×941 | 1927030 | `9d08ff4acd4485fc7203de0f396dc6aa1ee631c929db007dbc0bf93bf0add1f9` |
| `public/images/img-art-rapprochement-bancaire-og.webp` | 1200×630 | 26090 | `2d49ad75b131f34ee593fabf8941a82907a59995a07ddadad9a0cd29600b6076` |
| `public/images/img-art-rapprochement-bancaire-1200.avif` | 1200×675 | 15821 | `e2921f1392f6e6a2ded37cb1b80270aa731e55947270c407a92402431b0f2885` |
| `public/images/img-art-rapprochement-bancaire-1200.webp` | 1200×675 | 27160 | `0ae3803ad629facd75592a6673525819c5ec2c6dd3c5822e141ccbf4189d06ca` |
| `public/images/img-art-rapprochement-bancaire-1600.avif` | 1600×900 | 23117 | `ed378defd438516237bc23404dcd73e06eb1ffb177c4d9274ccb1a315ed32bdd` |
| `public/images/img-art-rapprochement-bancaire-1600.webp` | 1600×900 | 40592 | `c248758e9f4e852f1f7adf2e6f4aea9a32b1b6783096a670e571ef764fc66e35` |
| `public/images/img-art-rapprochement-bancaire-768.avif` | 768×432 | 9536 | `96d70b8c6dc0a1a0c6b32fa64bc3b2e237cc244d7a932310073b60017a399aea` |
| `public/images/img-art-rapprochement-bancaire-768.webp` | 768×432 | 15340 | `9427428118609da795264e57c909e14c23a8b77cfe52c5842c9ed87127943bb6` |
| `public/proofs/blog/banque-cle.webp` | 1600×900 | 27722 | `88cafccfc38df0e014bb7e7e810159e70444ca9161d70bb809374bc652775cdc` |
| `public/proofs/blog/banque-rejeu.webp` | 1600×900 | 28752 | `78b056ec5a0a24fcd7ddbc0c73cbf679d75d256dde25d02444d6d7af7203ba94` |

## Provenance et réserves non bloquantes
- Source originale adoptée 1672×941, master forgé 1920×1080 ; ne pas confondre source et dérivé. Source identique à la pièce jointe, hashes de generation.json vérifiés.
- Modèle et coût inconnus. Prompt exact conservé et égal entre ses deux enregistrements ; SHA-256 : `4015527af599f1200420042a8b5b5f8c0b5531f742d0c6a3fa0803114a621440`.
- OG public et OG preuve ne sont pas identiques en octets ; inspection supplémentaire du public conforme, même sujet et cadrage.
- Palette : OBSERVATION seulement, aucun seuil automatique. Parts numériques préexistantes non remesurées ; aucun chiffre cosmétique inventé.
- directionArt/semanticRelevance non attribués faute de barème réellement appliqué ; anciennes notes non reprises pour cette couverture.
- Le sujet bancaire nécessite le contexte du titre ; le visuel seul montre un rapprochement abstrait, pas un relevé identifiable.
- Aucun nouveau verdict de fond, aucune validation de production. Les mentions de revue en attente dans editorial sont laissées intactes pour intégration par le parent.

## Livrables
- `.qa/bank-cover-independent-review.md`
- `.qa/bank-cover-independent-review.json`
- Défauts bloquants : aucun.
