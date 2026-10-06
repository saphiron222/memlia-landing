import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
const parameters = { absolute: 5000, percentage: 20, purpose: 'Convention fictive de tri, aucun seuil normatif', convention: '(N - N-1) / abs(N-1) × 100' };
function compare(previous, current, exists = true) {
  if (!exists) return { status: 'compte-nouveau', delta: null, percentage: null, conclusion: null };
  if (!Number.isFinite(previous) || !Number.isFinite(current)) return { status: 'montant-absent-ou-invalide', delta: null, percentage: null, conclusion: null };
  const delta = current - previous;
  const percentage = previous === 0 ? null : delta / Math.abs(previous) * 100;
  const status = previous === 0 ? 'base-nulle' : previous * current < 0 ? 'changement-signe' : Math.abs(delta) >= parameters.absolute && Math.abs(percentage) >= parameters.percentage ? 'critere-examen' : 'sous-critere';
  return { status, delta, percentage, conclusion: null };
}
function regroup(previous, current, approved) {
  if (!approved) return { status: 'correspondance-a-valider', delta: null, percentage: null, conclusion: null };
  return { ...compare(previous.reduce((a,b)=>a+b,0), current.reduce((a,b)=>a+b,0)), presentationChanged: true };
}
const cases = [];
function test(id, input, expected, actual) { assert.deepEqual(actual, expected); cases.push({ id, input, expected, actual, status: 'PASS' }); }
test('base-nulle', { previous: 0, current: 12000, previousAccountExists: true }, { status: 'base-nulle', delta: 12000, percentage: null, conclusion: null }, compare(0,12000));
test('compte-nouveau', { previous: null, current: 8000, previousAccountExists: false }, { status: 'compte-nouveau', delta: null, percentage: null, conclusion: null }, compare(null,8000,false));
test('montant-comparatif-absent', { previous: null, current: 8000, previousAccountExists: true }, { status: 'montant-absent-ou-invalide', delta: null, percentage: null, conclusion: null }, compare(null,8000,true));
test('montant-courant-absent', { previous: 8000, current: null }, { status: 'montant-absent-ou-invalide', delta: null, percentage: null, conclusion: null }, compare(8000,null));
test('reclassement-non-valide', { previous: [10000,0], current: [0,10000], approved: false }, { status: 'correspondance-a-valider', delta: null, percentage: null, conclusion: null }, regroup([10000,0],[0,10000],false));
test('reclassement-valide', { previous: [10000,0], current: [0,10000], approved: true, approval: 'validation de scénario fictif, pas jugement CAC réel' }, { status: 'sous-critere', delta: 0, percentage: 0, conclusion: null, presentationChanged: true }, regroup([10000,0],[0,10000],true));
test('changement-signe', { previous: 10000, current: -2000 }, { status: 'changement-signe', delta: -12000, percentage: -120, conclusion: null }, compare(10000,-2000));
test('variation-ordinaire', { previous: 20000, current: 26000 }, { status: 'critere-examen', delta: 6000, percentage: 30, conclusion: null }, compare(20000,26000));
const user = { comment: 'Pièce à examiner par le professionnel', conclusion: null };
const snapshot = structuredClone(user);
const generated = compare(20000,26000);
assert.deepEqual(user,snapshot);
test('saisie-preservee', { user: snapshot, previous: 20000, current: 26000 }, { user: snapshot, generated }, { user, generated });
writeFileSync(new URL('./rejeu.json', import.meta.url), JSON.stringify({ version: 1, status: 'PASS', fictitious: true, replayedAt: '2026-10-06', executedAt: new Date().toISOString(), game: 'Comparaisons Atelier', command: 'node commercial/recettes/revue-analytique-cac/preuves/rejouer.mjs', scope: 'Démonstrateur de règle, pas automatisation livrée. Choix des seuils et conclusion réservés au professionnel.', parameters, cases }, null, 2)+'\n');
console.log(`${cases.length} cas fictifs PASS ; saisies préservées et aucune conclusion produite.`);
