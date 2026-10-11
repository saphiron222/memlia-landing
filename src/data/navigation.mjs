/** Navigation v3 : hubs directs, lecture locale, professions publiées seulement. */
export const LIEN_CAC = { libelle: 'Commissaires aux comptes', href: '/commissaires-aux-comptes' };

export function creerNavigation({ chemin, cacDisponible, blogActif }) {
  const accueil = chemin === LIEN_CAC.href ? LIEN_CAC.href : '/';
  return [
    { id: 'lecture', libelle: chemin === accueil ? 'Sur cette page' : 'Lire l’accueil', sousEntrees: [
      { libelle: 'Tâches', href: `${accueil}#usages` },
      { libelle: 'Méthode', href: `${accueil}#methode` },
      { libelle: 'Contrôle humain', href: `${accueil}#preuves` },
      { libelle: 'Questions', href: `${accueil}#questions` },
    ] },
    ...(cacDisponible ? [{ id: 'cabinets', libelle: 'Cabinets', sousEntrees: [
      { libelle: 'Expertise comptable', href: '/' }, LIEN_CAC,
    ] }] : []),
    { libelle: "Ce qu’on automatise", href: '/automatisation-cabinet-comptable' },
    { libelle: 'Outils gratuits', href: '/outils-comptables-gratuits' },
    ...(blogActif ? [{ libelle: 'Blog', href: '/blog' }] : []),
  ];
}
