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
 * Registre M3-S : docs/design/2026-09-09-m3-s-briefs.md. Les anciens visuels produit
 * sont exclus de dist. Les illustrations conceptuelles M4 sont tenues par des
 * placeholders explicites ; aucune capture produit n'est simulée.
 */
export const IMAGES = {
  'img-16-flux-automatisation': {
    brief: 'IMG-16',
    largeurs: [768, 1024, 1440, 1888, 3024],
    ratio: [3024, 1610],
    alt: 'Illustration conceptuelle d’un processus de cabinet : entrées, traitement borné, exceptions et validation humaine',
    generee: true,
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
  'img-17-scenario-validation': {
    brief: 'IMG-17',
    largeurs: [500, 1000],
    ratio: [2000, 1440],
    alt: 'Illustration conceptuelle d’informations rassemblées, avec un cas isolé pour revue humaine',
    generee: true,
  },
  'img-18-outils-existants': {
    brief: 'IMG-18',
    largeurs: [570, 1140],
    ratio: [4, 3],
    alt: 'Illustration d’outils et de documents reliés autour d’un même processus de travail',
    generee: true,
  },
  'img-19-observer-processus': {
    brief: 'IMG-19',
    largeurs: [570, 1140],
    ratio: [4, 3],
    alt: 'Documents vierges et carnet ouvert pour décrire un processus',
    generee: true,
  },
  'img-20-cadrer-limites': {
    brief: 'IMG-20',
    largeurs: [570, 1140],
    ratio: [4, 3],
    alt: 'Pièces de papier regroupées avec une exception séparée du traitement courant',
    generee: true,
  },
  'img-21-eprouver-processus': {
    brief: 'IMG-21',
    largeurs: [570, 1140],
    ratio: [4, 3],
    alt: 'Série de pièces fictives préparées pour éprouver une règle et ses exceptions',
    generee: true,
  },
  'img-22-recette-cabinet': {
    brief: 'IMG-22',
    largeurs: [570, 1140],
    ratio: [4, 3],
    alt: 'Dossier de recette ouvert et stylo posé au point de validation humaine',
    generee: true,
  },
  'img-13-embleme-methode': {
    brief: 'IMG-13',
    largeurs: [144, 216],
    ratio: [1, 1],
    alt: 'Deux feuilles superposées, la proposition en vert sur la saisie',
    generee: true,
  },
  /* Couvertures du blog (16:9) : liste à 50 vw, article à 720 px, écrans 2x. */
  'img-23-controle-bulletins-paie': {
    brief: 'ART',
    largeurs: [768, 1200, 1600],
    ratio: [16, 9],
    alt: "Trois contrôles successifs : pièces de paie, comparaison mensuelle et validation du fichier DSN.",
    generee: true,
  },
  'img-24-suivi-production-sociale': {
    brief: 'ART',
    largeurs: [768, 1200, 1600],
    ratio: [16, 9],
    alt: "Cinq dossiers avancent dans trois couches de suivi, avec une exception isolée pour décision.",
    generee: true,
  },
  'img-25-comptes-rendus-metier-dsn': {
    brief: 'ART',
    largeurs: [768, 1200, 1600],
    ratio: [16, 9],
    alt: "Un dépôt franchi, plusieurs retours distincts et une anomalie isolée avant la décision humaine.",
    generee: true,
  },
  'img-art-carte-des-taches': {
    brief: 'ART',
    largeurs: [768, 1200, 1600],
    ratio: [16, 9],
    alt: "Carte des tâches en diorama 3D : îlots reliés par des chemins, jeton vert sur un chemin choisi devant une bifurcation",
    generee: true,
  },
  'img-art-relance-des-pieces': {
    brief: 'ART',
    largeurs: [768, 1200, 1600],
    ratio: [16, 9],
    alt: "Relance des pièces en diorama 3D : plateau à moitié rempli, checklist cochée, enveloppe devant un portique, dossier à l’écart",
    generee: true,
  },
  'img-art-saisie-comptable': {
    brief: 'ART',
    largeurs: [768, 1200, 1600],
    ratio: [16, 9],
    alt: "Saisie comptable en diorama 3D : pile de feuilles, barre de lecture verte, plateau rangé, plateau graphite de côté, loupe",
    generee: true,
  },
  'img-art-pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils': {
    brief: 'ART',
    largeurs: [768, 1200, 1600],
    ratio: [16, 9],
    alt: "Diorama 3D isométrique : un bâtiment neuf et fermé à côté d’un établi ouvert où le travail se fait, fond crème",
    generee: true,
  },
  'img-art-charge-travail-cabinet-comptable': {
    brief: 'ART',
    largeurs: [768, 1200, 1600],
    ratio: [16, 9],
    alt: "Semaine fictive répartie entre répétition, attente, exception et décision humaine",
    generee: true,
  },
  'img-art-intelligence-artificielle-metier-comptable': {
    brief: 'ART',
    largeurs: [768, 1200, 1600],
    ratio: [16, 9],
    alt: "Frontière en trois colonnes entre préparation automatisée, validation et décision humaine",
    generee: true,
  },
  'img-art-prompt-chatgpt-expert-comptable': {
    brief: 'ART',
    largeurs: [768, 1200, 1600],
    ratio: [16, 9],
    alt: "Feuille vierge et enveloppe séparées par une grille fermée, pour figurer le contrôle humain avant une demande de pièce",
    generee: true,
  },
  'img-art-logiciel-ia-comptabilite': {
    brief: 'ART',
    largeurs: [768, 1200, 1600],
    ratio: [16, 9],
    alt: "Trois feuilles blanches près d'un bac de tri et d'un portique vide ; aucune issue de contrôle n'est visible",
    generee: true,
  },
  'img-art-tests-verts-trois-passes': {
    brief: 'ART',
    largeurs: [768, 1200, 1600],
    ratio: [16, 9],
    alt: "Trois postes de vérification distincts en diorama, pour les suites, la chaîne de preuve et la lecture humaine",
    generee: true,
  },
  'img-art-utiliser-chatgpt-cabinet-comptable': {
    brief: 'ART',
    largeurs: [768, 1200, 1600],
    ratio: [16, 9],
    alt: "Trois plateaux de tâches et des fiches vierges dans un diorama vert, graphite et crème",
    generee: true,
  },
  'img-art-verifier-reponse-ia-comptabilite': {
    brief: 'ART',
    largeurs: [768, 1200, 1600],
    ratio: [16, 9],
    alt: "Une feuille vierge et trois points de vérification dans un diorama vert, graphite et crème",
    generee: true,
  },
};

/** Formats livrés, du plus léger au repli. */
export const FORMATS = ['avif', 'webp'];

/** M4 retire chaque identifiant de cette liste après validation du visuel final. */
export const PUBLISHED_IMAGE_IDS = [
  'img-art-verifier-reponse-ia-comptabilite',
  'img-art-utiliser-chatgpt-cabinet-comptable',
  'img-art-tests-verts-trois-passes',
  'img-art-logiciel-ia-comptabilite',
  'img-art-prompt-chatgpt-expert-comptable',
  'img-art-intelligence-artificielle-metier-comptable',
  'img-art-charge-travail-cabinet-comptable',
  'img-art-pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils',
  'img-art-saisie-comptable',
  'img-art-relance-des-pieces',
  'img-art-carte-des-taches',
  'img-23-controle-bulletins-paie',
  'img-24-suivi-production-sociale',
  'img-25-comptes-rendus-metier-dsn',
];
export const PLACEHOLDERS = new Set(Object.keys(IMAGES).filter(id => !PUBLISHED_IMAGE_IDS.includes(id)));

export const cheminImage = (id, largeur, format) => `/images/${id}-${largeur}.${format}`;

export const hauteurPour = (image, largeur) =>
  Math.round((largeur * image.ratio[1]) / image.ratio[0]);
