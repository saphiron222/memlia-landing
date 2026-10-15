import { existsSync } from 'node:fs';

export const CAC_PUBLIE = existsSync(new URL('../src/pages/commissaires-aux-comptes.astro', import.meta.url));

/** Les trois entrées du groupe « Ce qu’on automatise » : la tâche, le métier, l’outil. Le pied de page les reprend à l’identique. */
export const AUTOMATISE = [
  { libelle: 'Par tâche', href: '/automatisation-cabinet-comptable' },
  { libelle: 'Par métier', href: '/agents-ia' },
  { libelle: 'Dans vos outils', href: '/integrations' },
];

/**
 * Sept destinations, dans l’ordre de la barre : les deux entrées de Cabinets, les trois de
 * « Ce qu’on automatise », puis les deux liens directs. Les intitulés de groupe ne comptent pas :
 * ce sont des boutons, pas des destinations.
 */
export const DESTINATIONS = [
  ...(CAC_PUBLIE ? ['Expertise comptable', 'Commissaires aux comptes'] : []),
  ...AUTOMATISE.map((entree) => entree.libelle),
  'Outils gratuits',
  'Blog',
];
export const HREFS = [
  ...(CAC_PUBLIE ? ['/', '/commissaires-aux-comptes'] : []),
  ...AUTOMATISE.map((entree) => entree.href),
  '/outils-comptables-gratuits',
  '/blog',
];
/** Les deux titres de groupe, tels qu’ils précèdent leurs entrées là où le groupe n’est pas un bouton (nav sans JavaScript). */
export const TITRES = { cabinets: 'Cabinets', automatise: 'Ce qu’on automatise' };

/**
 * L’ordre exact de la navigation servie sans JavaScript, sans l’action finale : un titre non cliquable
 * (`titre:`), puis les liens (`lien:`) de son groupe, puis les deux liens directs.
 */
export const ORDRE_SANS_JS = [
  ...(CAC_PUBLIE ? [`titre:${TITRES.cabinets}`, 'lien:/', 'lien:/commissaires-aux-comptes'] : []),
  `titre:${TITRES.automatise}`,
  ...AUTOMATISE.map((entree) => `lien:${entree.href}`),
  'lien:/outils-comptables-gratuits',
  'lien:/blog',
];

/** Les seuls liens posés directement dans la barre (`.nav-entree[href]`) ; tout le reste vit dans un sous-menu. */
export const HREFS_DIRECTS = ['/outils-comptables-gratuits', '/blog'];
