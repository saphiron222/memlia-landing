import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const IA_CATCHUP_PATH = 'docs/strategy/site-v3/rattrapage-ia-2026-10-05.json';
const SLUGS = [
  'utiliser-chatgpt-cabinet-comptable', 'verifier-reponse-ia-comptabilite',
  'ia-comptabilite-confidentialite-donnees', 'automatiser-avec-ia-sans-changer-logiciel',
];
export const estRattrapageIA = (slug) => SLUGS.includes(slug);

/** Une seule règle lue par la forge et le planificateur ; bornes du mandat non extensibles. */
export function lireRattrapageIA(root) {
  if (!root || !existsSync(join(root, IA_CATCHUP_PATH))) return null;
  const rule = JSON.parse(readFileSync(join(root, IA_CATCHUP_PATH), 'utf8'));
  const keys = ['version', 'decisionLe', 'carteSource', 'semaineEditoriale', 'maximumParJour', 'publications'];
  if (!rule || JSON.stringify(Object.keys(rule).sort()) !== JSON.stringify(keys.sort())
    || rule.version !== 1 || rule.decisionLe !== '2026-10-05T12:08:00+02:00'
    || rule.carteSource !== 't_f9e51486' || rule.semaineEditoriale !== '2026-W40'
    || rule.maximumParJour !== 3 || !rule.publications
    || JSON.stringify(Object.keys(rule.publications).sort()) !== JSON.stringify([...SLUGS].sort())
    || SLUGS.some((slug, index) => rule.publications[slug] !== (index === 0 ? '2026-10-04' : '2026-10-05'))) {
    throw new Error('Rattrapage IA : règle divergente du mandat limité aux quatre sujets W40.');
  }
  return rule;
}

export function verifierDateRattrapageIA(rule, slug, date, serie) {
  if (rule && estRattrapageIA(slug) && (rule.publications[slug] !== date || serie === 'cicatrices')) {
    throw new Error(`Rattrapage IA : slug/date/série hors mandat (${slug}, ${date}).`);
  }
}

export function semaineEditorialeIA(rule, slug, date, semaineReelle) {
  return rule?.publications[slug] === date ? rule.semaineEditoriale : semaineReelle;
}

export function plafondJourIA(rule, slug, date, actifs, plafondOrdinaire) {
  return rule?.publications[slug] === date && date === '2026-10-05'
    && actifs.filter((e) => e.date === date).every((e) => rule.publications[e.slug] === date)
    ? rule.maximumParJour : plafondOrdinaire;
}

// Python consomme le même validateur, sans réimplémenter ni élargir le mandat.
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { console.log(JSON.stringify(lireRattrapageIA(process.argv[2]))); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
