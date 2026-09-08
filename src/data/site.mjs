/**
 * Identité du site — importé par astro.config.mjs (d'où le .mjs) et par les pages.
 * Une seule source pour les URL, les CTA et les libellés de marque.
 */
export const SITE = {
  url: 'https://memlia.fr',
  nom: 'Memlia',
  tagline: 'Memlia code la règle. Votre cabinet garde la décision.',
  email: 'contact@memlia.fr',
  /** Date de la dernière modification éditoriale (lastmod du sitemap). */
  derniereMiseAJour: '2026-09-08',
  langue: 'fr-FR',
  couleurTheme: '#fffefb',
};

/** Un seul CTA principal sur tout le site ; un secondaire « humain ». */
export const CTA = {
  principal: { libelle: 'Faire évaluer ma règle', href: 'https://cal.com/kevin-svg/decouvrir-memlia' },
  humain: { libelle: 'Parler à un humain', href: 'https://cal.com/kevin-svg/echanger-avec-l-equipe-memlia' },
};

/** Pages servies mais hors index (noindex) : jamais dans le sitemap. */
export const PAGES_NOINDEX = ['/mentions-legales', '/politique-de-confidentialite', '/404'];

/** Image de partage (IMG-15 à monter ; l'actuelle reste en place d'ici là). */
export const OG_IMAGE = {
  url: `${SITE.url}/assets/og-memlia.png`,
  largeur: 1200,
  hauteur: 630,
  alt: "Memlia, compléments Excel pour cabinets d'expertise comptable",
};
