import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../../guides/recettes/cloture-ebp/', import.meta.url);

test('clôture EBP : contrôles documentaires, trois issues et lancement humain', () => {
  const recipe = JSON.parse(readFileSync(new URL('recette.json', dir)));
  const guide = recipe.integration;
  assert.equal(recipe.reviewKind, 'metier');
  assert.equal(guide.product, 'EBP Comptabilité');
  assert.equal(guide.service.href, '/automatisation-cabinet-comptable');
  assert.equal(guide.h1, "Clôture EBP : préparer les contrôles avant de fermer l'exercice");
  assert.deepEqual(guide.replay.map(c => c.outcome), ['Préparé', 'À valider', 'Arrêt']);
  assert.match(guide.documentScope, /V20/);
  assert.match(guide.documentScope, /pas un essai/);
  assert.match(guide.boundary.human, /LANCER/);
  assert.match(guide.knownTrap, /irréversible/);
  assert.match(guide.knownTrap, /Information/);
  assert.match(guide.replay[2].input, /non validée/);
  assert.match(guide.replay[1].input, /à-nouveaux/);
  for (const field of guide.fields) assert.match(field.control, /Source :/);
  const evidence = JSON.parse(readFileSync(new URL('autocomplete.json', dir)));
  assert.equal(evidence.response[0], 'clôture ebp');
  assert.equal(evidence.httpStatus, 200);
  assert.equal(evidence.response[1].length, guide.suggestions);
});
