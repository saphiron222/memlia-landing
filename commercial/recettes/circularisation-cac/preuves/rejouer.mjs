import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Simulation de la frontière de suivi uniquement : aucun envoi, aucune lecture de pièce,
// aucune conclusion d'audit. Les validations et constats sont des entrées fictives humaines.
function suivre(input) {
  const output = { commentaireHumain: input.commentaireHumain ?? '', pieces: [...(input.pieces ?? [])], envoi: false, procedureAlternative: null, conclusion: null };
  if (input.refusDirection) return { ...output, etat: 'suspendu-refus', arret: 'Examen du refus par le CAC' };
  if (!input.validationEnvoi) return { ...output, etat: 'brouillon', arret: 'Validation d’envoi absente' };
  if (!input.reponse) return { ...output, etat: 'absence-transmise-cac', arret: 'Suites à décider par le CAC' };
  if (!input.rattachementCertain) return { ...output, etat: 'retour-non-rapproche', arret: 'Identifiant de demande ambigu ou absent' };
  if (!input.memePerimetre) return { ...output, etat: 'comparaison-refusee', arret: 'Devise ou période différente' };
  if (input.type === 'ouverte') return { ...output, etat: 'information-a-examiner', arret: null, information: input.information };
  const ecart = input.montantRetourne - input.montantAttendu;
  return { ...output, ecart, etat: ecart ? 'ecart-documente-a-examiner' : 'concordance-a-examiner', arret: null };
}
const base = { validationEnvoi: true, reponse: true, rattachementCertain: true, memePerimetre: true, type: 'fermee', montantAttendu: 12000, montantRetourne: 12000 };
const common = { commentaireHumain: '', pieces: [], envoi: false, procedureAlternative: null, conclusion: null };
const scenarios = [
  { id: 'retour-non-rapproche', input: { ...base, rattachementCertain: false, pieces: ['retour-orme-01.pdf'] }, expected: { ...common, pieces: ['retour-orme-01.pdf'], etat: 'retour-non-rapproche', arret: 'Identifiant de demande ambigu ou absent' } },
  { id: 'ecart-documente', input: { ...base, montantRetourne: 11700, pieces: ['justificatif-orme-02.pdf'] }, expected: { ...common, pieces: ['justificatif-orme-02.pdf'], ecart: -300, etat: 'ecart-documente-a-examiner', arret: null } },
  { id: 'absence-reponse', input: { ...base, reponse: false }, expected: { ...common, etat: 'absence-transmise-cac', arret: 'Suites à décider par le CAC' } },
  { id: 'validation-envoi-absente', input: { ...base, validationEnvoi: false }, expected: { ...common, etat: 'brouillon', arret: 'Validation d’envoi absente' } },
  { id: 'refus-direction', input: { ...base, refusDirection: true }, expected: { ...common, etat: 'suspendu-refus', arret: 'Examen du refus par le CAC' } },
  { id: 'saisie-preservee', input: { ...base, commentaireHumain: 'À examiner avec le chef de mission.' }, expected: { ...common, commentaireHumain: 'À examiner avec le chef de mission.', ecart: 0, etat: 'concordance-a-examiner', arret: null } },
  { id: 'perimetre-different', input: { ...base, memePerimetre: false }, expected: { ...common, etat: 'comparaison-refusee', arret: 'Devise ou période différente' } },
  { id: 'demande-ouverte', input: { ...base, type: 'ouverte', information: 'Engagement fictif à examiner' }, expected: { ...common, etat: 'information-a-examiner', arret: null, information: 'Engagement fictif à examiner' } },
];
const cases = scenarios.map(({ id, input, expected }) => {
  const actual = suivre(input);
  assert.deepEqual(actual, expected, id);
  assert.equal(actual.envoi, false);
  assert.equal(actual.procedureAlternative, null);
  assert.equal(actual.conclusion, null);
  return { id, input, expected, actual, status: 'PASS' };
});
const evidence = { status: 'PASS', fictitious: true, replayedAt: '2026-10-06', executedAt: new Date().toISOString(), method: 'Simulation déterministe des états de suivi. Aucun envoi, aucune pièce générée ou lue, aucune intégration ni diligence d’audit exécutée.', cases };
const path = fileURLToPath(new URL('./rejeu.json', import.meta.url));
if (process.argv.includes('--check')) {
  assert.ok(existsSync(path));
  const saved = JSON.parse(readFileSync(path, 'utf8'));
  assert.deepEqual(saved.cases, cases);
  assert.equal(saved.status, 'PASS');
} else writeFileSync(path, `${JSON.stringify(evidence, null, 2)}\n`);
console.log(`PASS : ${cases.length} cas fictifs de suivi ; aucun envoi ni conclusion d’audit.`);
