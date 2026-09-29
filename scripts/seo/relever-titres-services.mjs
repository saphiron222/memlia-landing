#!/usr/bin/env node
/** Relever les quinze requêtes déclarées par les cinq recettes, sans SERP payante.
 *   node scripts/seo/relever-titres-services.mjs
 * Écrit uniquement un relevé daté du jour UTC ; toute panne empêche l'écriture.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { autocompleterGoogle } from '../lib/seo-instruments.mjs';

const root = resolve(import.meta.dirname, '../..');
const slugs = ['factures-fournisseurs', 'notes-de-frais', 'paie', 'rapprochement-bancaire', 'saisie-comptable'];
const requetes = [...new Set(slugs.flatMap((slug) => {
  const recette = JSON.parse(readFileSync(join(root, 'commercial/recettes', slug, 'recette.json'), 'utf8'));
  return [recette.primaryQuery, ...recette.secondaryQueries];
}))];
if (requetes.length !== 15) throw new Error(`quinze requêtes distinctes attendues, ${requetes.length} trouvées`);

const autocompletion = {};
const captures = {};
for (const requete of requetes) {
  const resultat = await autocompleterGoogle(requete);
  if (!resultat.ok) throw new Error(`relevé incomplet pour « ${requete} » : ${resultat.erreur}`);
  autocompletion[requete] = resultat.suggestions;
  captures[requete] = {
    capturedAt: new Date().toISOString(),
    url: `https://suggestqueries.google.com/complete/search?client=firefox&hl=fr&gl=fr&q=${encodeURIComponent(requete)}`,
    instrument: 'scripts/lib/seo-instruments.mjs#autocompleterGoogle',
  };
}
const measuredAt = new Date().toISOString();
const jour = measuredAt.slice(0, 10);
const chemin = join(root, 'docs/strategy/site-v3/mesures', `titres-intent-${jour}.json`);
// Ne pas détruire les autres mesures d'un même jour : elles peuvent alimenter le blog.
let precedent = {};
try { precedent = JSON.parse(readFileSync(chemin, 'utf8')); }
catch (e) { if (e.code !== 'ENOENT') throw e; }
writeFileSync(chemin, `${JSON.stringify({
  ...precedent,
  measuredAt: precedent.measuredAt ?? measuredAt,
  instrument: precedent.instrument ?? 'scripts/lib/seo-instruments.mjs#autocompleterGoogle',
  autocompletion: { ...precedent.autocompletion, ...autocompletion },
  provenance: { ...precedent.provenance, ...captures },
}, null, 2)}\n`);
console.log(`${chemin} : ${requetes.length} requêtes mesurées`);
