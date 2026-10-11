import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { verifierRecetteGuide } from '../../scripts/lib/guide-forge.mjs';

const root = resolve(import.meta.dirname, '../..');
test('le guide lettrage EBP distingue le natif, la proposition et les exceptions', () => {
  const recipe = JSON.parse(readFileSync(resolve(root, 'guides/recettes/lettrage-ebp/recette.json')));
  const d = recipe.integration;
  assert.deepEqual(verifierRecetteGuide({ root, recipe }), []);
  assert.equal(recipe.reviewKind, 'metier');
  assert.equal(recipe.author, 'dev');
  assert.equal(d.h1, 'Lettrage EBP : contrôler les paires avant de les valider');
  assert.equal(d.product, 'EBP Comptabilité');
  assert.equal(d.service.href, '/automatisation/saisie-comptable');
  assert.match(d.intro, /lettrage automatique/i);
  assert.match(d.officialPath, /Consultation des comptes/);
  assert.match(d.documentScope, /version/);
  assert.match(d.knownTrap, /équilibre/);
  assert.match(d.writtenRule, /référence.*unique/);
  assert.match(d.boundary.human, /dans EBP/);
  assert.deepEqual(d.replay.map(c => c.outcome), ['Préparé', 'À valider', 'Arrêt']);
  assert.match(d.replay[0].input, /référence/);
  assert.match(d.replay[1].input, /Deux règlements/);
  assert.match(d.replay[2].detail, /aucune paire/i);
  assert.equal(d.source.url, 'https://support.ebp.com/hc/fr/articles/360011494518');
});
