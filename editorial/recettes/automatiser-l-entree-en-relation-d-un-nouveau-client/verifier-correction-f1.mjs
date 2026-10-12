import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(dir, 'rejouer.mjs'), 'utf8');
const definition = source.slice(source.indexOf('export function proposer'), source.indexOf('const base =')).replace('export ', '');
const proposer = Function(`${definition}; return proposer;`)();
const cases = JSON.parse(readFileSync(join(dir, 'preuves/rejeu.json'))).cas;
const base = cases.find(c => c.entree.dossier === 'D-107').entree;
const variants = [
  ['autre dossier', { ...base.decisionCabinet, dossier: 'D-999' }, 'REFUS : DÉCISION AUTRE DOSSIER'],
  ['ancienne version', { ...base.decisionCabinet, version: 'V1' }, 'REFUS : DÉCISION ANCIENNE VERSION'],
  ['défavorable', { ...base.decisionCabinet, resultat: 'defavorable' }, 'REFUS : DÉCISION NON FAVORABLE'],
  ['résultat inconnu', { ...base.decisionCabinet, resultat: 'INCONNU' }, 'REFUS : DÉCISION NON FAVORABLE'],
  ['objet reviewer REFUS', { ...base.decisionCabinet, resultat: 'REFUS' }, 'REFUS : DÉCISION NON FAVORABLE'],
  ['objet vide', {}, 'REFUS : DÉCISION INCOMPLÈTE'],
  ['simple booléen', true, 'REFUS : DÉCISION INCOMPLÈTE'],
  ['absente', null, 'DÉCISION CABINET ATTENDUE'],
  ['favorable complète', base.decisionCabinet, 'PRÉPARER LA PASSATION'],
];
for (const field of ['dossier', 'version', 'auteur', 'reference', 'resultat']) {
  const decision = { ...base.decisionCabinet };
  delete decision[field];
  variants.push([`champ absent : ${field}`, decision, 'REFUS : DÉCISION INCOMPLÈTE']);
  variants.push([`champ blanc : ${field}`, { ...base.decisionCabinet, [field]: '  ' }, 'REFUS : DÉCISION INCOMPLÈTE']);
}
const observations = variants.map(([nom, decisionCabinet, attendu]) => {
  const entree = structuredClone({ ...base, decisionCabinet });
  const avant = JSON.stringify(entree);
  const obtenu = proposer(entree);
  assert.equal(obtenu.statut, attendu, nom);
  assert.equal(obtenu.envois, 0);
  assert.equal(obtenu.decisionVigilance, null);
  assert.equal(JSON.stringify(entree), avant);
  return { nom, entree, attendu, obtenu };
});
writeFileSync(join(dir, 'preuves/correction-f1.json'), JSON.stringify({ auteur: 'marketing', controleAuteurNonRevue: true, executedAt: new Date().toISOString(), defectId: 'F1', casArticle: cases.length, observations, limites: 'Transitions administratives fictives, aucun calcul de vigilance ni intégration client. Le rapport FAIL indépendant initial est conservé.' }, null, 2) + '\n');
console.log(`${observations.length} contrôles F1 exécutés, dont le parcours favorable ; aucun envoi ni décision de vigilance.`);
