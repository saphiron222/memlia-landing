import {readFileSync,writeFileSync} from 'node:fs';
import {autocompleterGoogle} from '../../../scripts/lib/seo-instruments.mjs';
const dir=new URL('./',import.meta.url),r=JSON.parse(readFileSync(new URL('recette.json',dir)));
const autocompletion={},receipts=[];
for(const q of [r.primaryQuery,...r.secondaryQueries]){const result=await autocompleterGoogle(q);receipts.push({q,...result,retrievedAt:new Date().toISOString()});if(!result.ok)throw Error(q+': '+result.erreur);autocompletion[q]=result.suggestions;}
writeFileSync(new URL('autocompletion.json',dir),JSON.stringify({date:'2026-10-05',receipts},null,2));
writeFileSync('docs/strategy/site-v3/mesures/titres-intent-2026-10-05.json',JSON.stringify({date:'2026-10-05',autocompletion,note:'Formulations du passage ; liste vide ne signifie ni zéro volume ni absence de besoin.'},null,2));
console.log(JSON.stringify(receipts,null,2));
