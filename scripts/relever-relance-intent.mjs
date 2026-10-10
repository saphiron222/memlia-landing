import {writeFileSync} from 'node:fs';
import {autocompleterGoogle} from './lib/seo-instruments.mjs';
const autocompletion={};
for(const query of ['générateur relance facture impayée','mail relance facture impayée','prompt chatgpt expert comptable']) {
 const result=await autocompleterGoogle(query);
 if(!result.ok)throw new Error(`Sonde refusée : ${query} : ${result.erreur}`);
 autocompletion[query]=result.suggestions;
}
const measuredAt=new Date().toISOString();
const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const path=`docs/strategy/site-v3/mesures/titres-intent-${date}.json`;
writeFileSync(path,JSON.stringify({measuredAt,instrument:'scripts/lib/seo-instruments.mjs#autocompleterGoogle',autocompletion,note:'Relance : mesure du besoin, aucun volume. Prompt : rafraîchissement réel de la mesure requise par la fixture blog globale ; aucun changement de contenu.'},null,2)+'\n');
console.log(path,autocompletion);
