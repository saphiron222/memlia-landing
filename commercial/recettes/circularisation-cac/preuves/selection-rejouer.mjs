import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

// Démonstration locale sur montants structurés fictifs en centimes, pas un produit livré.
export function proposer(population, rule, previous = []) {
  const stop = (arret) => ({ arret, selection: [], conclusion: null, envoi: false });
  if (!rule.populationRapprochee) return stop('population-non-rapprochee');
  if (new Set(population.map(p => p.id)).size !== population.length) return stop('identifiants-ambigus');
  if (population.some(p => !Number.isSafeInteger(p.solde) || p.solde < 0 || !Number.isSafeInteger(p.mouvement) || p.mouvement < 0)) return stop('montant-ou-sens-inattendu');
  if (!Number.isInteger(rule.n) || rule.n < 1 || !(rule.couverture > 0 && rule.couverture <= 1) || !rule.graine) return stop('parametres-invalides');
  const denominator = population.reduce((s, p) => s + p.solde, 0);
  if (!denominator) return stop('denominateur-nul');
  const selection = new Map();
  const add = (p, motif) => { if (!selection.has(p.id)) selection.set(p.id, { ...p, motif }); };
  const byId = new Map(population.map(p => [p.id, p]));
  for (const id of previous) if (byId.has(id)) add(byId.get(id), 'passe-anterieure');
  const missing = previous.filter(id => !byId.has(id));
  for (const id of rule.ajoutsManuels ?? []) if (byId.has(id)) add(byId.get(id), 'ajout-humain');
  const covered = () => [...selection.values()].reduce((s, p) => s + p.solde, 0);
  const reached = () => selection.size >= rule.n || covered() / denominator >= rule.couverture;
  const ordered = (key) => [...population].sort((a, b) => b[key] - a[key] || a.id.localeCompare(b.id));
  for (const p of ordered('solde')) if (p.solde >= rule.seuil) add(p, 'seuil-individuel');
  for (const [key, count, motif] of [['solde', rule.grosSoldes, 'solde'], ['mouvement', rule.grosMouvements, 'mouvement']]) {
    let added = 0;
    for (const p of ordered(key)) {
      if (reached() || added >= count) break;
      if (!selection.has(p.id)) { add(p, motif); added++; }
    }
  }
  // Ordre pseudo-aléatoire reproductible, non présenté comme sondage statistique.
  const rank = p => createHash('sha256').update(`${rule.graine}:${p.id}`).digest('hex');
  for (const p of population.filter(p => !selection.has(p.id)).sort((a, b) => rank(a).localeCompare(rank(b)) || a.id.localeCompare(b.id))) {
    if (reached()) break;
    add(p, 'tirage-reproductible');
  }
  return { selection: [...selection.values()], denominator, montantSelectionne: covered(), couverture: covered() / denominator, graine: rule.graine, parametres: rule,
    absentsSecondePasse: missing, depassementN: selection.size > rule.n, objectifAtteint: covered() / denominator >= rule.couverture,
    arret: reached() ? (covered() / denominator >= rule.couverture ? 'couverture' : 'nombre') : 'population-epuisee', conclusion: null, envoi: false };
}
function piecesPosterieures(input) {
  if (!input.procedureChoisieCAC) return { etat: 'absence-transmise-cac', propositions: [], conclusion: null };
  const candidates = input.pieces.filter(p => p.tiers === input.tiers && p.devise === input.devise && p.date > input.cloture && p.montant === input.solde);
  return { etat: candidates.length === 1 ? 'piece-a-examiner' : candidates.length ? 'pieces-ambigues' : 'piece-manquante', propositions: candidates.map(p => p.id), conclusion: null };
}
const population = [
  { id: 'A', solde: 40000, mouvement: 10000 }, { id: 'B', solde: 25000, mouvement: 90000 },
  { id: 'C', solde: 15000, mouvement: 30000 }, { id: 'D', solde: 10000, mouvement: 20000 },
  { id: 'E', solde: 10000, mouvement: 5000 },
];
const rule = { populationRapprochee: true, seuil: 100000, grosSoldes: 1, grosMouvements: 1, couverture: 0.7, n: 5, graine: 'orme-2026-09', ajoutsManuels: [] };
const cases = [];
function test(id, input, expected, fn) {
  const actual = fn(input);
  for (const [key, value] of Object.entries(expected)) assert.deepEqual(actual[key], value, `${id}:${key}`);
  assert.equal(actual.conclusion, null);
  cases.push({ id, input, expected, actual, status: 'PASS' });
  return actual;
}
const first = test('selection-couverture', { population, rule }, { denominator: 100000, objectifAtteint: true, arret: 'couverture', envoi: false }, i => proposer(i.population, i.rule));
assert.equal(first.selection[0].id, 'A'); assert.equal(first.selection[1].id, 'B');
assert.ok(first.selection.some(p => p.motif === 'tirage-reproductible'));
assert.equal(new Set(first.selection.map(p => p.id)).size, first.selection.length);
assert.deepEqual(proposer([...population].reverse(), rule), first);
test('arret-n-comptes', { population, rule: { ...rule, n: 2, couverture: 0.99 } }, { arret: 'nombre', objectifAtteint: false, montantSelectionne: 65000 }, i => proposer(i.population, i.rule));
test('deux-passes', { population: [...population, { id: 'F', solde: 50000, mouvement: 80000 }], rule, previous: first.selection.map(p => p.id) }, { denominator: 150000, absentsSecondePasse: [] }, i => proposer(i.population, i.rule, i.previous));
test('tiers-disparu', { population: population.filter(p => p.id !== 'A'), rule, previous: ['A', 'B'] }, { absentsSecondePasse: ['A'] }, i => proposer(i.population, i.rule, i.previous));
test('population-non-rapprochee', { population, rule: { ...rule, populationRapprochee: false } }, { arret: 'population-non-rapprochee', selection: [] }, i => proposer(i.population, i.rule));
test('doublon-identifiant', { population: [...population, population[0]], rule }, { arret: 'identifiants-ambigus' }, i => proposer(i.population, i.rule));
test('solde-inattendu', { population: [{ id: 'X', solde: -100, mouvement: 0 }], rule }, { arret: 'montant-ou-sens-inattendu' }, i => proposer(i.population, i.rule));
test('denominateur-nul', { population: [{ id: 'X', solde: 0, mouvement: 100 }], rule }, { arret: 'denominateur-nul' }, i => proposer(i.population, i.rule));
const document = { tiers: 'C', devise: 'EUR', solde: 12000, cloture: '2026-12-31', procedureChoisieCAC: true, pieces: [{ id: 'reglement-01', tiers: 'C', devise: 'EUR', date: '2027-01-20', montant: 12000 }] };
test('piece-posterieure-proposee', document, { etat: 'piece-a-examiner', propositions: ['reglement-01'] }, piecesPosterieures);
test('procedure-non-choisie', { ...document, procedureChoisieCAC: false }, { etat: 'absence-transmise-cac', propositions: [] }, piecesPosterieures);
test('piece-manquante', { ...document, pieces: [] }, { etat: 'piece-manquante', propositions: [] }, piecesPosterieures);
test('pieces-ambigues', { ...document, pieces: [...document.pieces, { ...document.pieces[0], id: 'reglement-02' }] }, { etat: 'pieces-ambigues', propositions: ['reglement-01', 'reglement-02'] }, piecesPosterieures);
const evidence = { status: 'PASS', fictitious: true, replayedAt: '2026-10-06', executedAt: new Date().toISOString(), method: 'Calcul déterministe de sélection et propositions sur données structurées fictives. Ni PDF lu ni plateforme connectée ni procédure d’audit réalisée.', cases };
const url = new URL('./selection-rejeu.json', import.meta.url);
if (process.argv.includes('--check')) assert.deepEqual(JSON.parse(readFileSync(url)).cases, cases);
else writeFileSync(url, JSON.stringify(evidence, null, 2) + '\n');
console.log(`PASS : ${cases.length} cas sélection/deux passes/pièces postérieures ; conclusions vides.`);
