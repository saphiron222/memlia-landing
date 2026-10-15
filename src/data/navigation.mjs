/** Navigation courte : hubs directs et professions publiées seulement. */
export const LIEN_CAC = { libelle: 'Commissaires aux comptes', href: '/commissaires-aux-comptes' };

/**
 * « Ce qu'on automatise » est un groupe, plus un lien : la même offre se lit par la tâche, par le
 * métier qui la prend en charge, ou par l'outil où elle s'installe. Le pied de page reprend ces
 * trois entrées telles quelles (une seule source), pour que menu et pied ne divergent jamais.
 */
export const ENTREES_AUTOMATISE = Object.freeze([
  Object.freeze({ libelle: 'Robots', href: '/automatisation-cabinet-comptable' }),
  Object.freeze({ libelle: 'Agents IA', href: '/agents-ia' }),
  Object.freeze({ libelle: 'Intégrations', href: '/integrations' }),
]);

export const ENTREES_MEMOIRE = Object.freeze([
  Object.freeze({libelle:"Memlia OS",href:"/memoire-collective-cabinet-comptable"}),
  Object.freeze({libelle:"Modèle IA privé",href:"/modele-ia-prive-entreprise"}),
]);

export function creerNavigation({ chemin, cacDisponible, blogActif }) {
  return [
    ...(cacDisponible ? [{ id: 'cabinets', libelle: 'Cabinets', sousEntrees: [
      { libelle: 'Expertise comptable', href: '/' }, LIEN_CAC,
    ] }] : []),
    { id: 'automatise', libelle: "Ce qu’on automatise", sousEntrees: [...ENTREES_AUTOMATISE, ...ENTREES_MEMOIRE] },
    { libelle: 'Outils gratuits', href: '/outils-comptables-gratuits' },
    ...(blogActif ? [{ libelle: 'Blog', href: '/blog' }] : []),
  ];
}
