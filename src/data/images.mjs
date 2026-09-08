/**
 * Manifeste des images du site — une entrée par brief de la spec de design (section 7),
 * largeurs livrées fixées par la section 6 (« cette section fait foi »).
 *
 * Lu par :
 *  - scripts/placeholders.mjs (génère les placeholders AVIF + WebP à ces largeurs) ;
 *  - src/components/Picture.astro (construit `srcset` / `sizes`).
 *
 * Fichiers attendus : public/images/<id>-<largeur>.{avif,webp}. Le brief d'origine vit
 * à côté : public/images/brief-<id>.md (retiré du `dist` au build).
 *
 * Les captures produit (IMG-01, 04) ne sont jamais générées : elles viennent du banc
 * Windows sur le jeu fictif. Tant qu'elles n'existent pas, le placeholder tient la place
 * exacte (mêmes dimensions) pour que la mise en page et le CLS soient déjà les bons.
 */
export const IMAGES = {
  'img-01-panneau-suivi-social': {
    brief: 'IMG-01',
    largeurs: [768, 1024, 1440, 1888, 3024],
    ratio: [3024, 1610],
    alt: 'Panneau Memlia ouvert à droite d’un classeur Excel de suivi social, avec des lignes proposées à valider',
    generee: false,
  },
  'img-02-fond-hero': {
    brief: 'IMG-02',
    largeurs: [1200, 1800, 2400],
    ratio: [2, 1],
    alt: '',
    generee: true,
  },
  'img-03-embleme-registre': {
    brief: 'IMG-03',
    largeurs: [160, 240],
    ratio: [1, 1],
    alt: 'Sceau Memlia en relief sur papier',
    generee: true,
  },
  'img-04-onglet-suivi-social': {
    brief: 'IMG-04',
    largeurs: [500, 1000],
    ratio: [2000, 1440],
    alt: 'Onglet de suivi social généré par Memlia dans Excel, avec le panneau de validation',
    generee: false,
  },
  'img-07-enveloppes-pieces': {
    brief: 'IMG-07',
    largeurs: [570, 1140],
    ratio: [4, 3],
    alt: 'Enveloppes kraft et pochette de pièces comptables',
    generee: true,
  },
  'img-08-calculatrice-bulletin': {
    brief: 'IMG-08',
    largeurs: [570, 1140],
    ratio: [4, 3],
    alt: 'Calculatrice de bureau et bulletin de paie plié, vierge',
    generee: true,
  },
  'img-09-tampon-dateur': {
    brief: 'IMG-09',
    largeurs: [570, 1140],
    ratio: [4, 3],
    alt: 'Tampon dateur et trombone sur une feuille quadrillée vierge',
    generee: true,
  },
  'img-11-chemise-recette': {
    brief: 'IMG-11',
    largeurs: [570, 1140],
    ratio: [4, 3],
    alt: 'Deux tasses et une chemise cartonnée ouverte sur une table',
    generee: true,
  },
  'img-13-embleme-methode': {
    brief: 'IMG-13',
    largeurs: [144, 216],
    ratio: [1, 1],
    alt: 'Deux feuilles superposées, la proposition en vert sur la saisie',
    generee: true,
  },
};

/** Formats livrés, du plus léger au repli. */
export const FORMATS = ['avif', 'webp'];

/** M4 retire chaque identifiant de cette liste après validation du visuel final. */
export const PLACEHOLDERS = new Set(Object.keys(IMAGES));

export const cheminImage = (id, largeur, format) => `/images/${id}-${largeur}.${format}`;

export const hauteurPour = (image, largeur) =>
  Math.round((largeur * image.ratio[1]) / image.ratio[0]);
