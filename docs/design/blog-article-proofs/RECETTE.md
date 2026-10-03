# Recette des figures de corps du blog

Décision de Kevin du 03/10/2026 : « les images servent juste à illustrer, pas à être une explication
comme le texte du blog ». Cette recette vaut pour toute figure du corps d'un article
(`<figure data-blog-proof>`), qu'elle soit nouvelle ou refaite. La couverture suit sa propre recette
(forge, crédits Higgsfield).

## Les références

Le modèle, ce sont les figures de quatre articles :
- `suivre-la-production-sociale-dans-excel` : `social-dictionnaire`, `social-vue-agregee` ;
- `controler-les-bulletins-de-paie-avant-la-dsn` : `controle-dsn-val`, `bulletins-crm` ;
- `comprendre-les-comptes-rendus-metier-dsn` : `crm-lecture-ligne`, `crm-registre` ;
- `automatiser-la-relance-des-pieces-clients` : `relance-checklist`, `relance-quatre-etats`.

Les 14 cadres refaits le 03/10/2026 suivent la même recette. Tous sont dans `index.html`, dans ce
dossier : on part toujours d'un cadre existant.

## La recette

1. **Format.** Une image de 1600 × 900, en WebP de moins de 150 Ko, la même sur ordinateur et sur
   téléphone. Jamais de variante `-mobile`, jamais de bande verticale.
2. **Fenêtre.** La fenêtre de référence sur fond quadrillé. À gauche de l'en-tête, une pastille de
   couleur et le nom de l'écran (« Registre des retours ») ; à droite, « Jeu d'essai fictif ·
   contexte » (« dossier D-004 · 2026-08 »).
3. **Contenu.** L'écran d'un outil : registre, file de travail, checklist à statuts, fiche,
   compteurs, fenêtre de discussion. Il est rempli de données fictives concrètes (D-012,
   FA-2026-0412, ORGANISME-A, avril 2026) et de pastilles d'état (Reçu, À valider, À qualifier…).
4. **Texte.** Au plus un titre court à l'écran (« R-014-A », « 6 pièces à qualifier »).
5. **Rôle.** L'image illustre la section où elle se trouve. C'est l'article qui explique.

## Ce qui est refusé (exemples refusés le 03/10/2026)

- Un schéma d'étapes numérotées et commentées, une frise de processus.
- Un slogan ou une phrase-thèse (« L'IA prépare, l'humain décide »).
- Une phrase d'avertissement (« La grille n'atteste aucune capacité… ») : le libellé « Jeu d'essai
  fictif » suffit.
- Une diapositive : pas de fenêtre, un grand titre, un cercle décoratif.
- Une marque, un logo, un éditeur, un client ou un collaborateur réel ; un chiffre qui se lirait comme
  un résultat mesuré (gain, heures gagnées, pourcentage).
- Une reprise du texte de l'article.

## Fabrication

1. Ajouter un `.frame` dans `index.html` en réutilisant les classes d'un cadre de référence
   (`styles.css`).
2. Rendre puis regarder chaque image : `node scripts/render-blog-article-proofs.mjs`, puis lire les
   rendus.
3. Après revue visuelle, `--adopt` fige le texte dans `content-contract.json` et publie dans
   `public/proofs/blog/` ; `--check` refuse ensuite toute dérive.
4. Dans l'article, la forge émet seule le balisage depuis la recette (`inlineProofs`) :
   `<figure data-blog-proof="ID">`, puis
   `<img src="/proofs/blog/ID.webp" alt="…" width="1600" height="900" loading="lazy" decoding="async">`,
   puis `</figure>`. L'alt décrit l'écran fictif en une phrase.

## Ce que le code bloque déjà

- Le renderer refuse un cadre sans la fenêtre de référence (pastille, nom de l'écran, « Jeu d'essai
  fictif · … » ou « Reconstitution · … ») et toute dimension autre que 1600 × 900.
- `scripts/verify-blog-contract.mjs` refuse une source `-mobile`, même si le fichier existe ; la forge
  n'émet que `/proofs/blog/<id>.webp` en 1600 × 900.
- `tests/scripts/blog-proof-mobile.test.mjs` et `tests/browser/blog-proof-mobile.spec.ts` vérifient
  l'image réellement servie et son format sur la page.

## Grille de la revue indépendante

Une seule réponse « non » donne FAIL et renvoie la figure à son auteur.

1. Est-ce l'écran d'un outil qu'un cabinet pourrait avoir sous les yeux ?
2. Les données sont-elles fictives, concrètes et sans marque ?
3. L'image se comprend-elle sans lire l'article, et l'article se lit-il sans l'image ?
4. N'y a-t-il ni schéma d'étapes commenté, ni slogan, ni avertissement ?
5. Posée à côté des références, passerait-elle pour l'une d'elles ?
