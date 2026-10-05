import test from 'node:test';
import assert from 'node:assert/strict';
import { MODELS, filterModels, modelPrompt, parseTransfer } from '../../src/lib/bibliotheque-prompts.mjs';
import { assemblePrompt, checkPrompt, SECTIONS } from '../../src/lib/prompt-comptable.mjs';

test('douze fiches originales, complètes et compatibles avec le moteur partagé', () => {
  assert.equal(MODELS.length, 12);
  assert.equal(new Set(MODELS.map(m => m.id)).size, 12);
  assert.equal(new Set(MODELS.map(m => modelPrompt(m))).size, 12);
  for (const m of MODELS) {
    assert.equal(assemblePrompt({ ...m.seed, confirmed: true }).ok, true, m.id);
    assert.equal(checkPrompt(modelPrompt(m)).ok, true, m.id);
    for (const section of SECTIONS) assert.ok(modelPrompt(m).includes(`## ${section}\n`));
    for (const key of ['context', 'input', 'output', 'human', 'stop', 'exampleIn', 'exampleOut']) assert.ok(m[key].length > 20, `${m.id} ${key}`);
    assert.ok(modelPrompt(m).includes(m.exampleIn));
  }
});
test('filtres combinés, accents, tâche et état vide', () => {
  assert.deepEqual(filterModels({ pole: 'relation-client', format: 'mail' }).map(m => m.id), ['relance-pieces', 'accuse-reception', 'liste-pieces']);
  assert.deepEqual(filterModels({ query: 'SYNTHESE', pole: 'pilotage' }).map(m => m.id), ['synthese-suivi']);
  assert.deepEqual(filterModels({ task: 'relance-pieces' }).map(m => m.id), ['relance-pieces']);
  assert.equal(filterModels({ query: 'introuvablexyz' }).length, 0);
  assert.equal(filterModels({}).length, 12);
});
test('transfert versionné : ID public seulement, inconnu et payload altéré refusés', () => {
  assert.equal(parseTransfer(JSON.stringify({ version: 1, id: 'relance-pieces' })).id, 'relance-pieces');
  for (const raw of [null, '', '{', JSON.stringify({ version: 2, id: 'relance-pieces' }), JSON.stringify({ version: 1, id: 'client' }), JSON.stringify({ version: 1, id: 'relance-pieces', text: 'secret' })]) assert.equal(parseTransfer(raw), null);
});
