import { existsSync } from 'node:fs';

export const CAC_PUBLIE = existsSync(new URL('../src/pages/commissaires-aux-comptes.astro', import.meta.url));

/** Les quatre offres du groupe « Nos services ». Le pied de page les reprend à l’identique. */
export const SERVICES = [
  { libelle: 'Robots', href: '/automatisation-cabinet-comptable' },
  { libelle: 'Agents IA', href: '/agents-ia' },
  { libelle: 'Memlia OS', href: '/memoire-collective-cabinet-comptable' },
  { libelle: 'Modèle IA privé', href: '/modele-ia-prive-entreprise' },
];

/**
 * Les destinations dans l’ordre de la barre : les entrées de Cabinets, les quatre de
 * « Nos services », puis les trois liens directs. Les intitulés de groupe ne comptent pas :
 * ce sont des boutons, pas des destinations.
 */
export const DESTINATIONS = [
  ...(CAC_PUBLIE ? ['Expertise comptable', 'Commissaires aux comptes'] : []),
  ...SERVICES.map((entree) => entree.libelle),
  'Intégrations',
  'Outils gratuits',
  'Blog',
];
export const HREFS = [
  ...(CAC_PUBLIE ? ['/', '/commissaires-aux-comptes'] : []),
  ...SERVICES.map((entree) => entree.href),
  '/integrations',
  '/outils-comptables-gratuits',
  '/blog',
];
/** Les deux titres de groupe, tels qu’ils précèdent leurs entrées là où le groupe n’est pas un bouton (nav sans JavaScript). */
export const TITRES = { cabinets: 'Cabinets', services: 'Nos services' };

/**
 * L’ordre exact de la navigation servie sans JavaScript, sans l’action finale : un titre non cliquable
 * (`titre:`), puis les liens (`lien:`) de son groupe, puis les trois liens directs.
 */
export const ORDRE_SANS_JS = [
  ...(CAC_PUBLIE ? [`titre:${TITRES.cabinets}`, 'lien:/', 'lien:/commissaires-aux-comptes'] : []),
  `titre:${TITRES.services}`,
  ...SERVICES.map((entree) => `lien:${entree.href}`),
  'lien:/integrations',
  'lien:/outils-comptables-gratuits',
  'lien:/blog',
];

/** Les seuls liens posés directement dans la barre (`.nav-entree[href]`) ; tout le reste vit dans un sous-menu. */
export const HREFS_DIRECTS = ['/integrations', '/outils-comptables-gratuits', '/blog'];
