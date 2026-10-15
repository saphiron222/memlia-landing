/** Une source commune au menu, à son repli sans JS et au pied de page. */
export const LIEN_CAC = Object.freeze({ libelle:'Commissaires aux comptes',href:'/commissaires-aux-comptes' });
export const LIEN_INTEGRATIONS = Object.freeze({ libelle:'Intégrations',href:'/integrations' });
export const ENTREES_SERVICES = Object.freeze([
 Object.freeze({libelle:'Robots',href:'/automatisation-cabinet-comptable'}),
 Object.freeze({libelle:'Agents IA',href:'/agents-ia'}),
 Object.freeze({libelle:'Memlia OS',href:'/memoire-collective-cabinet-comptable'}),
 Object.freeze({libelle:'Modèle IA privé',href:'/modele-ia-prive-entreprise'}),
]);
export function creerNavigation({ chemin,cacDisponible,blogActif }) {
 return [
  ...(cacDisponible?[{id:'cabinets',libelle:'Cabinets',sousEntrees:[{libelle:'Expertise comptable',href:'/'},LIEN_CAC]}]:[]),
  {id:'services',libelle:'Nos services',sousEntrees:[...ENTREES_SERVICES]},
  LIEN_INTEGRATIONS,
  {libelle:'Outils gratuits',href:'/outils-comptables-gratuits'},
  ...(blogActif?[{libelle:'Blog',href:'/blog'}]:[]),
 ];
}
