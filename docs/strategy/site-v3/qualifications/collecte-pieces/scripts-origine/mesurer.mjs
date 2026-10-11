import {writeFileSync,mkdirSync} from 'node:fs';
import {autocompleterGoogle} from './site/scripts/lib/seo-instruments.mjs';
const queries=['automatisation collecte pièces clients cabinet comptable','automatisation collecte pièces comptables','collecte pièces comptables','relance pièces clients cabinet comptable','logiciel collecte pièces comptables','automatiser relance pièces comptables','collecte documents expert comptable','service collecte pièces comptables'];
const results=await Promise.all(queries.map(async query=>({query,measuredAt:new Date().toISOString(),...await autocompleterGoogle(query)})));
mkdirSync('qualification',{recursive:true});
writeFileSync('qualification/autocomplete.json',JSON.stringify({instrument:'scripts/lib/seo-instruments.mjs#autocompleterGoogle',hl:'fr',gl:'fr',monthlyVolume:null,results},null,2)+'\n');
console.log(JSON.stringify(results,null,2));
