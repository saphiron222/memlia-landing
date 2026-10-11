import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { verifierRecetteGuide } from '../../scripts/lib/guide-forge.mjs';

const recipePath = new URL('../../guides/recettes/export-fec-ebp/recette.json', import.meta.url);

test('le guide FEC EBP distingue destination, périmètre et décision humaine', () => {
  const recipe = JSON.parse(readFileSync(recipePath, 'utf8'));
  const d = recipe.integration;
  assert.deepEqual(verifierRecetteGuide({ recipe }), []);
  assert.equal(recipe.reviewKind, 'metier');
  assert.equal(d.primaryQuery, 'export fec ebp');
  assert.equal(d.h1, 'Export FEC EBP : choisir le bon export et contrôler son périmètre');
  assert.equal(d.product, 'EBP Comptabilité');
  assert.equal(d.service.href, '/automatisation/saisie-comptable');
  assert.match(d.intro, /Provisoire au format FEC/);
  assert.match(d.intro, /comptable/);
  assert.match(d.intro, /comptabilité informatisé FEC/);
  assert.match(d.intro, /administration fiscale/);
  for (const label of ['destinataire', 'exercice et période', 'régime', 'codage du fichier', 'pièces jointes', 'emplacement et nom du fichier']) {
    assert.ok(d.fields.some(field => field.label === label), label);
  }
  assert.deepEqual(d.replay.map(c => c.outcome), ['Préparé', 'À valider', 'Arrêt']);
  assert.match(d.replay[2].input, /destination inconnue|hors exercice/);
  assert.match(d.boundary.human, /réaliser l’export/);
  assert.match(d.boundary.prepared, /sans modifier/);
  assert.match(d.documentScope, /2024/);
  assert.match(d.source.url, /support\.ebp\.com\/hc\/fr\/articles\/360009858758/);
});
