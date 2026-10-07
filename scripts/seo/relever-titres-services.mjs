#!/usr/bin/env node
/** Relever les requêtes déclarées par toutes les recettes, sans SERP payante.
 *   node scripts/seo/relever-titres-services.mjs
 * Rejouer chaque semaine ; fusionne le relevé du jour Europe/Paris.
 * Toute panne empêche l'écriture, y compris une mesure partielle.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { autocompleterGoogle } from '../lib/seo-instruments.mjs';

export async function releverTitresServices({
  root = resolve(import.meta.dirname, '../..'),
  autocompleter = autocompleterGoogle,
  maintenant = () => new Date(),
} = {}) {
  const recettes = join(root, 'commercial/recettes');
  const requetes = [...new Set(readdirSync(recettes, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(recettes, entry.name, 'recette.json')))
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const recette = JSON.parse(readFileSync(join(recettes, entry.name, 'recette.json'), 'utf8'));
      return [recette.primaryQuery, ...recette.secondaryQueries];
    }))];
  if (requetes.length === 0) throw new Error('aucune requête de service à mesurer');

  // La date de début évite de vieillir artificiellement une capture faite avant minuit.
  const debut = maintenant();
  const jour = debut.toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
  const autocompletion = {};
  const captures = {};
  for (const requete of requetes) {
    const resultat = await autocompleter(requete);
    if (!resultat.ok) throw new Error(`relevé incomplet pour « ${requete} » : ${resultat.erreur}`);
    autocompletion[requete] = resultat.suggestions;
    captures[requete] = {
      capturedAt: maintenant().toISOString(),
      url: `https://suggestqueries.google.com/complete/search?client=firefox&hl=fr&gl=fr&q=${encodeURIComponent(requete)}`,
      instrument: 'scripts/lib/seo-instruments.mjs#autocompleterGoogle',
    };
  }
  const dossier = join(root, 'docs/strategy/site-v3/mesures');
  const chemin = join(dossier, `titres-intent-${jour}.json`);
  // Ne pas détruire les autres mesures d'un même jour : elles peuvent alimenter le blog.
  let precedent = {};
  try { precedent = JSON.parse(readFileSync(chemin, 'utf8')); }
  catch (e) { if (e.code !== 'ENOENT') throw e; }
  mkdirSync(dossier, { recursive: true });
  writeFileSync(chemin, `${JSON.stringify({
    ...precedent,
    measuredAt: precedent.measuredAt ?? debut.toISOString(),
    instrument: precedent.instrument ?? 'scripts/lib/seo-instruments.mjs#autocompleterGoogle',
    autocompletion: { ...precedent.autocompletion, ...autocompletion },
    provenance: { ...precedent.provenance, ...captures },
  }, null, 2)}\n`);
  return { chemin, requetes: requetes.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  releverTitresServices().then(({ chemin, requetes }) => {
    console.log(`${chemin} : ${requetes} requêtes mesurées`);
  }).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
