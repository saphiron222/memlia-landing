import { FICHES, ficheDe } from './specialistes.ts';
import { TOUTES_LES_FAMILLES } from './familles.ts';
/** Liste blanche dérivée des trois points de départ de chaque fiche, sans texte libre en stockage ni URL. */
export const contactsAgents = () => FICHES.filter(a=>a.publie).flatMap(agent => ficheDe(agent).tachesDepart.map(id=>({id,agent:agent.slug,nom:ficheDe(agent).taches.find(t=>t.famille===id)?.geste??TOUTES_LES_FAMILLES.find(f=>f.id===id)!.libelle})));
