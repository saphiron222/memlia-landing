import type { Specialiste } from './specialistes';
/** Figurines validées du 15 octobre, dérivées sans modifier les originaux. */
const couleurs: Record<string,string> = { comptabilite:'#929d73','paie-social':'#c98d79','juridique-fiscal':'#6f7e82',finance:'#96b9ac','missions-audit':'#b8a282',commercial:'#dc9a63',communication:'#e2c4a6','relation-client':'#aaa0b3','gestion-cabinet':'#b48c64','rh-cabinet':'#af716b','informatique-outils':'#c9a14d','protection-donnees':'#8b9cce' };
export const imageAgent = (agent: Specialiste) => ({ src: `/agents/${agent.slug}`, alt: `Figurine Memlia de ${agent.prenom}, ${agent.libelle.toLocaleLowerCase('fr')}.`, couleur: couleurs[agent.slug] });
