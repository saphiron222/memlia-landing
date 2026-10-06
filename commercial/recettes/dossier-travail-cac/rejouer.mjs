import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
const base = new URL('./', import.meta.url);
export function preparer(input) {
  const output = { proposals: [], exceptions: [], contributions: structuredClone(input.contributions) };
  if (input.locked) { output.exceptions.push('dossier-verrouille'); return output; }
  const refs = new Map();
  for (const piece of input.pieces) {
    if (!refs.has(piece.ref)) refs.set(piece.ref, []);
    refs.get(piece.ref).push(piece);
    if (!piece.sheet) output.exceptions.push(`orpheline:${piece.id}`);
  }
  for (const ref of input.requested) {
    const pieces = refs.get(ref) ?? [];
    if (pieces.length === 0) output.exceptions.push(`reference-absente:${ref}`);
    else if (pieces.length !== 1) output.exceptions.push(`doublon:${ref}`);
    else if (pieces[0].sheet) output.proposals.push({ ref, piece: pieces[0].id, sheet: pieces[0].sheet, status: 'attend-validation' });
  }
  const groups = new Map();
  for (const contribution of input.contributions) {
    const key = contribution.sheet + ':' + contribution.field;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(contribution);
  }
  for (const [key, values] of groups) {
    if (new Set(values.map(v => v.value)).size > 1) output.exceptions.push(`conflit:${key}:validation-requise`);
  }
  return output;
}
const comment = { sheet: 'F-01', field: 'commentaire', value: 'À justifier', author: 'auditeur-fictif-A', date: '2026-10-06' };
const good = { id: 'P-01', ref: 'B-01', sheet: 'F-01' };
const fixtures = [
  { name: 'reference-absente', input: { pieces: [good], requested: ['B-99'], contributions: [comment] }, exceptions: ['reference-absente:B-99'], proposals: [] },
  { name: 'doublon', input: { pieces: [good, { ...good, id: 'P-02' }], requested: ['B-01'], contributions: [comment] }, exceptions: ['doublon:B-01'], proposals: [] },
  { name: 'orpheline', input: { pieces: [{ id: 'P-03', ref: 'C-01', sheet: null }], requested: ['C-01'], contributions: [comment] }, exceptions: ['orpheline:P-03'], proposals: [] },
  { name: 'contributions-concurrentes', input: { pieces: [], requested: [], contributions: [comment, { ...comment, value: 'Justificatif demandé', author: 'auditeur-fictif-B' }] }, exceptions: ['conflit:F-01:commentaire:validation-requise'], proposals: [] },
  { name: 'renvoi-unique', input: { pieces: [good], requested: ['B-01'], contributions: [comment] }, exceptions: [], proposals: [{ ref: 'B-01', piece: 'P-01', sheet: 'F-01', status: 'attend-validation' }] },
  { name: 'dossier-verrouille', input: { locked: true, pieces: [good], requested: ['B-01'], contributions: [comment] }, exceptions: ['dossier-verrouille'], proposals: [] }
];
const cases = fixtures.map(test => {
  const before = structuredClone(test.input);
  const actual = preparer(test.input);
  const expected = { proposals: test.proposals, exceptions: test.exceptions, contributions: test.input.contributions };
  assert.deepEqual(actual, expected);
  assert.deepEqual(test.input, before);
  assert.deepEqual(actual.contributions, before.contributions);
  assert.deepEqual(preparer(test.input), actual);
  return { name: test.name, input: before, expected, actual, status: 'PASS', humanContributionsPreserved: true };
});
const result = { status: 'PASS', fictitious: true, replayedAt: '2026-10-06', scope: 'Convention proposée sur jeu fictif Atlas ; aucune intégration client ni restauration physique testée.', cases };
const text = JSON.stringify(result, null, 2) + '\n';
if (process.argv.includes('--check')) assert.equal(readFileSync(new URL('preuves/rejeu.json', base), 'utf8'), text);
else writeFileSync(new URL('preuves/rejeu.json', base), text);
console.log(`${cases.length} cas PASS ; contributions conservées ; entrées inchangées ; résultats reproductibles.`);
