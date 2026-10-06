import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const base = new URL('./', import.meta.url);
const data = JSON.parse(readFileSync(new URL('preuves/demande.json', base)));
if (!data.result.ok) throw new Error('Sonde en panne, pas une mesure vide');
const date = data.measuredAt.slice(0, 10);
const target = new URL(`../../../docs/strategy/site-v3/mesures/titres-intent-${date}.json`, base);
let measure;
try { measure = JSON.parse(readFileSync(target)); } catch (error) { if (error.code !== 'ENOENT') throw error; measure = { date, source: 'autocompleterGoogle client=firefox hl=fr gl=fr', autocompletion: {} }; }
measure.autocompletion[data.query] = data.result.suggestions;
writeFileSync(target, JSON.stringify(measure, null, 2)+'\n');
const sources = [
  { id: 'nep230', url: 'https://h2a-france.org/normes/documentation-de-laudit-des-comptes/', version: 'Arrêté du 28 décembre 2023, JO du 31 décembre 2023, A.821-66', excerpts: ['Les éléments de documentation consignés dans le dossier mentionnent l’identité du membre de l’équipe d’audit qui a effectué les travaux et leur date de réalisation.'] },
  { id: 'nep315', url: 'https://h2a-france.org/normes/connaissance-de-lentite-et-de-son-environnement-et-evaluation-du-risque-danomalies-significatives-dans-les-comptes/', version: 'Arrêté du 13 novembre 2024, JO du 19 novembre 2024, A.821-72', excerpts: ['Ces outils et techniques automatisés se distinguent des plateformes et logiciels d’audit utilisés pour documenter les travaux du commissaire aux comptes.', 'Les éléments d’appréciation des outils et techniques automatisés visés au paragraphe 46.'] }
];
for (const source of sources) {
  const response = await fetch(source.url);
  if (!response.ok) throw new Error(`${source.id} HTTP ${response.status}`);
  const html = await response.text();
  writeFileSync(new URL(`preuves/${source.id}.html`, base), html);
  source.openedAt = new Date().toISOString();
  source.status = response.status;
  source.sha256 = createHash('sha256').update(html).digest('hex');
}
writeFileSync(new URL('preuves/sources.json', base), JSON.stringify({ sources, note: 'Pages également ouvertes et extraits lus dans le navigateur Hermes le 2026-10-06 ; NEP230 §§08-10, NEP315 §§14/46/48d. Fiche Memlia volontaire, pas modèle normatif ; indexation distincte de procédure d’évaluation des risques.' }, null, 2)+'\n');
console.log('Mesure enregistrée ; deux sources officielles archivées.');
