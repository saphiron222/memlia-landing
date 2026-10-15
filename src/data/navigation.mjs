/** Navigation courte : hubs directs et professions publiées seulement. */
export const LIEN_CAC = { libelle: 'Commissaires aux comptes', href: '/commissaires-aux-comptes' };

export function creerNavigation({ chemin, cacDisponible, blogActif }) {
  return [
    ...(cacDisponible ? [{ id: 'cabinets', libelle: 'Cabinets', sousEntrees: [
      { libelle: 'Expertise comptable', href: '/' }, LIEN_CAC,
    ] }] : []),
    { libelle: 'Robots comptables', href: '/automatisation-cabinet-comptable' },
    { libelle: 'Outils gratuits', href: '/outils-comptables-gratuits' },
    ...(blogActif ? [{ libelle: 'Blog', href: '/blog' }] : []),
  ];
}
