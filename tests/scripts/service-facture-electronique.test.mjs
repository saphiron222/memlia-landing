import { createHash } from 'node:crypto';
import { MIGRATION_CATALOGUES } from '../../src/data/migrations-catalogues.mjs';
import { FICHES, ficheDe } from '../../src/data/specialistes.ts';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
function find(node, id) {
  if (node.attrs?.some((attr) => attr.name === 'id' && attr.value === id)) return node;
  for (const child of node.childNodes ?? []) { const match = find(child, id); if (match) return match; }
}
const text = (node) => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join(' ');

test('la preuve montre appels, brouillon, exclusion et note préservée sans cartouche promotionnel', () => {
  const frame = find(parse(read('docs/design/site-v2-proofs/index.html')), 'service-facture-electronique');
  assert.ok(frame, 'cadre propre à la facture électronique');
  const rendered = text(frame);
  for (const label of ['FE-01', 'FE-03', 'FE-04', 'Déjà pris en charge', 'Brouillon', 'Note du cabinet', 'Plateforme à confirmer']) assert.ok(rendered.includes(label), label);
  assert.doesNotMatch(rendered, /Memlia|partenariat|Pennylane|2026|2027|Automatisation des flux/);
  const design = read('src/data/service-design.ts');
  assert.match(design, /'facture-electronique':\s*\{\s*heroProof: 'v2\/30-service-facture-electronique'/);
});

test('la recette scellée conserve ses anciens liens et rejoint la tâche de Balthazar', () => {
  const recipe = JSON.parse(read('commercial/recettes/facture-electronique/recette.json'));
  const migration = MIGRATION_CATALOGUES.routes.find(row => row.from === recipe.path);
  assert.ok(migration, 'retrait documenté de cette route exacte');
  assert.equal(migration.archive.sha256, createHash('sha256').update(read(migration.archive.path)).digest('hex'), 'recette archivée inchangée');
  const seal = JSON.parse(read(`commercial/services/${recipe.slug}/preuves/scellement.json`));
  assert.equal(seal.kind, 'service-depublication-scellee');
  assert.equal(seal.files.recipe.sha256, migration.archive.sha256, 'sceau du retrait lié à la recette');
  const agent = FICHES.find(item => item.slug === 'comptabilite');
  assert.equal(agent?.publie, true);
  const index = ficheDe(agent).taches.findIndex(item => item.famille === recipe.family);
  assert.ok(index >= 0, 'la tâche historique est couverte dans la fiche publiée');
  assert.equal(migration.to, `/agents-ia/${agent.slug}#tache-${recipe.family}-${index + 1}`);
  assert.ok(!agent.servicesLies.includes(recipe.slug), 'aucun lien de retour vers la route retirée');
  assert.ok(recipe.incomingLinks.some((link) => link.url === '/methode'), 'la recette scellée garde son lien historique');
});
