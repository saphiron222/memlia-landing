import test from 'node:test';
import assert from 'node:assert/strict';
import { DIMENSIONS, OPTIONS, diagnose, reportMarkdown } from '../../src/lib/maturite-ia.mjs';
const filled = (value) => Object.fromEntries(DIMENSIONS.flatMap(d => d.questions.map(q => [q.id, value])));
test('trois actions distinctes et justifiées sur les 32 profils de dimensions', () => {
  const order = ['donnees', 'validation', 'regles', 'mesure', 'usages'];
  for (let mask = 0; mask < 32; mask++) {
    const values = filled('formalise');
    const gaps = order.filter((id, index) => mask & (1 << index));
    for (const id of gaps) values[`${id}_1`] = 'non-commence';
    const before = { ...values };
    const result = diagnose(values);
    assert.equal(result.priorities.length, 3, `profil ${mask}`);
    assert.equal(new Set(result.priorities.map(p => p.dimension)).size, 3);
    assert.deepEqual(result.priorities.filter(p => p.kind !== 'suivi').map(p => p.dimension), gaps.slice(0, 3));
    for (const p of result.priorities) {
      assert.ok(p.evidence.length > 0);
      for (const q of p.evidence) assert.equal(q.value, values[q.id]);
      if (p.kind === 'suivi') assert.ok(p.evidence.every(q => q.value === 'formalise'));
    }
    assert.deepEqual(values, before);
  }
});
test('quinze questions uniques, cinq dimensions, quatre réponses', () => {
  assert.equal(DIMENSIONS.length, 5);
  assert.equal(new Set(DIMENSIONS.flatMap(d => d.questions.map(q => q.id))).size, 15);
  assert.equal(OPTIONS.length, 4);
});
test('inconnues et absences restent incompletes, jamais faibles', () => {
  const result = diagnose({});
  assert.ok(result.dimensions.every(d => d.state === 'incomplet'));
  assert.equal(result.unknowns.length, 15);
  assert.doesNotMatch(reportMarkdown(result), /faible maturité|score|percentile/i);
});
test('états ordonnés uniquement pour réponses connues', () => {
  for (const [value, expected] of [['non-commence', 'a-demarrer'], ['en-essai', 'en-essai'], ['formalise', 'formalise']]) {
    assert.ok(diagnose(filled(value)).dimensions.every(d => d.state === expected));
  }
  const values = filled('formalise'); values.usages_1 = 'non-commence';
  assert.equal(diagnose(values).dimensions[0].state, 'en-essai');
});
test('données avant expansion et justifications traçables', () => {
  const values = filled('formalise'); values.donnees_1 = 'non-commence';
  const result = diagnose(values);
  assert.equal(result.priorities[0].dimension, 'donnees');
  assert.ok(result.priorities[0].evidence.some(q => q.id === 'donnees_1' && q.value === 'non-commence'));
});
test('quinze formalisées proposent exceptions, pas certification', () => {
  const result = diagnose(filled('formalise'));
  assert.equal(result.priorities[0].kind, 'suivi');
  assert.match(result.priorities[0].action, /exceptions/);
  assert.doesNotMatch(reportMarkdown(result), /certifié|conforme|100\s*%/i);
});
test('changement isolé ne modifie aucune autre dimension, entrée inchangée', () => {
  const values = filled('formalise'); const before = diagnose(values);
  const changed = { ...values, mesure_2: 'inconnu' }; const after = diagnose(changed);
  assert.deepEqual(before.dimensions.slice(0, 4), after.dimensions.slice(0, 4));
  assert.equal(values.mesure_2, 'formalise');
  assert.equal(after.dimensions[4].state, 'incomplet');
});
test('valeur non reconnue traitée comme inconnue, export exhaustif', () => {
  const values = filled('formalise'); values.regles_1 = '<script>';
  const result = diagnose(values); const markdown = reportMarkdown(result);
  assert.equal(result.dimensions[1].state, 'incomplet');
  for (const d of DIMENSIONS) for (const q of d.questions) assert.ok(markdown.includes(q.text));
  for (const p of result.priorities) assert.ok(markdown.includes(p.action));
  assert.match(markdown, /Méthode Memlia/);
});
