import { mkdirSync, writeFileSync } from 'node:fs';
import { autocompleterGoogle } from '../../../scripts/lib/seo-instruments.mjs';
const query = 'automatiser assemblage dossier audit';
const result = await autocompleterGoogle(query);
console.log(JSON.stringify(result, null, 2));
mkdirSync('commercial/recettes/dossier-travail-cac/preuves', { recursive: true });
writeFileSync('commercial/recettes/dossier-travail-cac/preuves/demande.json', JSON.stringify({ query, measuredAt: new Date().toISOString(), result }, null, 2)+'\n');
