import { createHash } from 'node:crypto';
import { MIGRATION_CATALOGUES } from '../../src/data/migrations-catalogues.mjs';
import { FICHES, ficheDe } from '../../src/data/specialistes.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { COUVERTURE_SERVICES } from '../../src/data/couverture-logiciels.mjs';
const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

test('la préparation d’évaluation conserve sa preuve et rejoint la tâche de Florent', () => {
  const recipe = JSON.parse(read('commercial/recettes/evaluation-transmission/recette.json'));
  assert.match(read('src/data/service-design.ts'), /'evaluation-transmission'/);
  assert.match(read('src/data/proofs.ts'), /v2\/47-service-evaluation-transmission/);
  const migration = MIGRATION_CATALOGUES.routes.find(row => row.from === recipe.path);
  assert.ok(migration, 'retrait documenté de cette route exacte');
  assert.equal(migration.archive.sha256, createHash('sha256').update(read(migration.archive.path)).digest('hex'), 'recette archivée inchangée');
  const seal = JSON.parse(read(`commercial/services/${recipe.slug}/preuves/scellement.json`));
  assert.equal(seal.kind, 'service-depublication-scellee');
  assert.equal(seal.files.recipe.sha256, migration.archive.sha256, 'sceau du retrait lié à la recette');
  const agent = FICHES.find(item => item.slug === 'finance');
  assert.equal(agent?.publie, true);
  const index = ficheDe(agent).taches.findIndex(item => item.famille === recipe.family);
  assert.ok(index >= 0, 'la tâche historique est couverte dans la fiche publiée');
  assert.equal(migration.to, `/agents-ia/${agent.slug}#tache-${recipe.family}-${index + 1}`);
  assert.ok(!agent.servicesLies.includes(recipe.slug), 'aucun lien de retour vers la route retirée');
  const coverage = COUVERTURE_SERVICES['evaluation-transmission'];
  assert.equal(coverage.dejaFait[0].outil, 'RCA Évaluation');
  assert.match(coverage.dejaFait[0].geste, /centralisation|centralise/);
  assert.ok(coverage.reste.some((line) => line.includes('déjà')));
});

test('la scène reprend les trois états du rejeu sans cartouche promotionnel', () => {
  const html = read('docs/design/evaluation-transmission-proof/index.html');
  for (const state of ['accepte', 'attente', 'versions']) assert.ok(html.includes(`data-case="${state}"`));
  for (const text of ['80 000', '90 000', '112 000', '100 000', 'Conflit de versions', 'Note du cabinet conservée']) assert.ok(html.includes(text));
  assert.doesNotMatch(html, /Memlia|RCA|partenariat|Sources|mis à jour|prix de cession|valeur de l’entreprise/i);
});
