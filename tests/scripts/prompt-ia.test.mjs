import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import Ajv from 'ajv';
import { assembleGenericPrompt, GENERIC_SEEDS } from '../../src/lib/prompt-ia.mjs';
import { PROMPT_ENGINE_VERSION, composePromptBlocks, assemblePrompt, AMORCES } from '../../src/lib/prompt-comptable.mjs';
const config = { ...GENERIC_SEEDS[3], confirmed: true };
test('moteur partagé versionné et ancien assemblage préservé', () => {
  assert.equal(PROMPT_ENGINE_VERSION, 1);
  assert.equal(composePromptBlocks(['But'], ['Une tâche']), '## But\nUne tâche');
  assert.ok(assemblePrompt({ ...AMORCES[0], confirmed: true }).ok);
});
test('réunion générique : public, actions et arrêt explicites', () => {
  const result = assembleGenericPrompt(config);
  assert.ok(result.ok);
  for (const term of ['équipe projet', 'action', 'responsable', 'délai', 'Arrêt', 'Critères', 'Jeu d’essai fictif']) assert.ok(result.text.includes(term), term);
  assert.doesNotMatch(result.text, /comptable|pièces|fiscal/i);
});
test('schéma JSON syntaxiquement valide et vérifiable', () => {
  const result = assembleGenericPrompt({ ...config, format: 'json' });
  assert.ok(result.ok);
  const schema = JSON.parse(result.text.split('```json\n')[1].split('\n```')[0]);
  assert.equal(schema.type, 'object');
  assert.deepEqual(schema.properties.actions.items.required, ['action', 'responsable', 'delai']);
  assert.match(result.text, /sans Markdown/);
  const validate = new Ajv().compile(schema);
  assert.ok(validate({ synthese: 'Atelier fictif', actions: [{ action: 'Relire les notes', responsable: null, delai: null }], questions: ['Qui valide ?'] }));
  assert.equal(validate({ synthese: 'Atelier fictif', actions: [{ action: 'Relire' }], questions: [] }), false);
});
test('sources et actifs de la scène propre correspondent au manifeste', () => {
  const manifest = JSON.parse(readFileSync('docs/qa/prompt-ia/proofs-manifest.json', 'utf8'));
  for (const entry of [...manifest.sources, ...manifest.entries]) {
    const bytes = readFileSync(entry.path ?? entry.target);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256);
    if (entry.target) assert.ok(bytes.length < 150000);
  }
});
test('chaque tâche et format est propre et déterministe', () => {
  for (const seed of GENERIC_SEEDS) for (const format of ['texte', 'tableau', 'json']) {
    const input = { ...seed, format, confirmed: true };
    assert.ok(assembleGenericPrompt(input).ok);
    assert.deepEqual(assembleGenericPrompt(input), assembleGenericPrompt(input));
  }
});
test('refus expliqués : objectif, bornes, contradiction, média et confirmation', () => {
  for (const [field, value] of [['description', ''], ['description', 'x'.repeat(1501)], ['description', 'Générer une vidéo de présentation'], ['constraints', 'Inventer les informations manquantes'], ['format', 'inconnu'], ['confirmed', false]]) {
    const result = assembleGenericPrompt({ ...config, [field]: value });
    assert.equal(result.ok, false, `${field}: ${value}`);
    assert.equal(result.field, field);
    assert.ok(result.error.length > 10);
  }
  assert.ok(assembleGenericPrompt({ ...config, description: 'x'.repeat(1500) }).ok);
});
