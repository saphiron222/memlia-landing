/**
 * Identité du site — importé par astro.config.mjs (d'où le .mjs) et par les pages.
 * Une seule source pour les URL, les CTA et les libellés de marque.
 */
export const SITE = {
  url: 'https://memlia.fr',
  nom: 'Memlia',
  tagline: 'L’IA automatise le travail répétitif. Votre cabinet garde la décision.',
  email: 'contact@memlia.fr',
  /** Date de la dernière modification éditoriale (lastmod du sitemap). */
  derniereMiseAJour: '2026-09-09',
  langue: 'fr-FR',
  couleurTheme: '#fffefb',
};

/**
 * Un seul appel à l'action sur tout le site. Depuis le site v2 il mène à /contact, qui
 * explique quoi préparer avant l'échange ; c'est là, et là seulement, que se trouvent
 * les liens de réservation. Le bouton de navigation porte un libellé court, même
 * action et même destination.
 */
export const CTA = {
  principal: { libelle: 'Identifier une tâche à automatiser', href: '/contact' },
  nav: { libelle: 'Parlons de votre tâche', href: '/contact' },
  /** Réservation directe : réservée à /contact, jamais un raccourci depuis une autre page. */
  rendezVous: { libelle: 'Réserver un échange', href: 'https://cal.com/kevin-svg/decouvrir-memlia' },
  humain: { libelle: 'Parler à un humain', href: 'https://cal.com/kevin-svg/echanger-avec-l-equipe-memlia' },
};

/** Pages servies mais hors index (noindex) : jamais dans le sitemap. */
export const PAGES_NOINDEX = ['/mentions-legales', '/politique-de-confidentialite', '/404', '/contact/merci', '/contact/erreur'];

/** Montage typographique M3-S (scripts/og.mjs) ; fond définitif éventuel en M4. */
export const OG_IMAGE = {
  url: `${SITE.url}/assets/og-memlia.png`,
  largeur: 1200,
  hauteur: 630,
  alt: "Memlia, automatisation IA pour cabinets d'expertise comptable",
};
