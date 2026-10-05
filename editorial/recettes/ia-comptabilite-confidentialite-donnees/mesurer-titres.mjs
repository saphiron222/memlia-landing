import {autocompleterGoogle} from '../../../scripts/lib/seo-instruments.mjs';
import {writeFileSync} from 'node:fs';
const queries=['IA cabinet comptable confidentialité données','ChatGPT données clients cabinet comptable','données autorisées IA générative','IA comptabilité et confidentialité'];
const a={}; for(const q of queries){const r=await autocompleterGoogle(q); console.log(q,r);if(!r.ok)throw Error(r.erreur);a[q]=r.suggestions;}
writeFileSync('docs/strategy/site-v3/mesures/titres-intent-2026-10-05.json',JSON.stringify({date:'2026-10-05',instrument:'autocompleterGoogle',autocompletion:a},null,2));
