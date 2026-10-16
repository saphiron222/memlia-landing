import { createHash } from 'node:crypto';
import { MIGRATION_CATALOGUES } from '../../src/data/migrations-catalogues.mjs';
import { FICHES, ficheDe } from '../../src/data/specialistes.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { COUVERTURE_SERVICES } from '../../src/data/couverture-logiciels.mjs';
const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

test('le contrôle croisé conserve sa preuve, sa couverture et sa destination Salomé', () => {
  const recipe = JSON.parse(read('commercial/recettes/bulletins-controle/recette.json'));
  const migration = MIGRATION_CATALOGUES.routes.find(row => row.from === recipe.path);
  assert.ok(migration, 'retrait documenté de cette route exacte');
  assert.equal(migration.archive.sha256, createHash('sha256').update(read(migration.archive.path)).digest('hex'), 'recette archivée inchangée');
  const seal = JSON.parse(read(`commercial/services/${recipe.slug}/preuves/scellement.json`));
  assert.equal(seal.kind, 'service-depublication-scellee');
  assert.equal(seal.files.recipe.sha256, migration.archive.sha256, 'sceau du retrait lié à la recette');
  const agent = FICHES.find(item => item.slug === 'paie-social');
  assert.equal(agent?.publie, true);
  const index = ficheDe(agent).taches.findIndex(item => item.famille === recipe.family);
  assert.ok(index >= 0, 'la tâche historique est couverte dans la fiche publiée');
  assert.equal(migration.to, `/agents-ia/${agent.slug}#tache-${recipe.family}-${index + 1}`);
  assert.ok(!agent.servicesLies.includes(recipe.slug), 'aucun lien de retour vers la route retirée');
  assert.match(read('src/data/service-design.ts'), /v2\/48-service-bulletins-controle/);
  const coverage = COUVERTURE_SERVICES['bulletins-controle'];
  assert.deepEqual(coverage.dejaFait.map((item) => item.outil), ['Silae', 'Cegid Payroll Ultimate']);
  assert.ok(coverage.reste.some((text) => text.includes('contrôles natifs')));
  assert.ok(coverage.reste.some((text) => text.includes('correction et la validation')));
});

test('la scène reprend les écarts et arrêts fictifs sans cartouche promotionnel', () => {
  const html = read('docs/design/bulletins-controle-proof/index.html');
  for (const state of ['prime_ecart', 'reference_absente', 'recalcul']) assert.ok(html.includes(`data-case="${state}"`));
  for (const text of ['200 → 150', 'Référence absente', 'Nouvelle version : v2', 'Validation à reprendre']) assert.ok(html.includes(text));
  assert.doesNotMatch(html, /Memlia|Silae|Cegid|partenariat|mis à jour|2026-10|preuves\//i);
  const replay = JSON.parse(read('commercial/recettes/bulletins-controle/preuves/rejeu.json'));
  assert.equal(replay.status, 'PASS');
  assert.equal(replay.cases.length, 9);
  assert.ok(replay.cases.every((item) => item.pass && item.writePayroll === false && item.humanDecisionRequired));
});
