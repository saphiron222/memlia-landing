import { autocompleterGoogle } from './lib/seo-instruments.mjs';
import { writeFileSync } from 'node:fs';
const queries=['lettrage comptable excel','prompt chatgpt expert comptable'];
const autocompletion={};const probes=[];
for(const query of queries){const result=await autocompleterGoogle(query);if(!result.ok)throw new Error(`${query}: ${result.erreur}`);autocompletion[query]=result.suggestions;probes.push({query,...result});}
const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const report={date,measuredAt:new Date().toISOString(),instrument:'scripts/lib/seo-instruments.mjs#autocompleterGoogle',hl:'fr',gl:'fr',autocompletion,probes,volumeMensuel:null,note:'Assistant local et rafraîchissement réel de la requête de fixture blog requise par le build ; aucun volume revendiqué.'};
writeFileSync(`docs/strategy/site-v3/mesures/titres-intent-${date}.json`,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
