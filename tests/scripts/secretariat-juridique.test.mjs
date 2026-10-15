import { createHash } from 'node:crypto';
import { MIGRATION_CATALOGUES } from '../../src/data/migrations-catalogues.mjs';
import { FICHES, ficheDe } from '../../src/data/specialistes.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
test('le service juridique conserve sa preuve et rejoint la tâche de Grégoire', () => {
  const recipe = JSON.parse(read('commercial/recettes/secretariat-juridique/recette.json'));
  assert.match(read('src/data/service-design.ts'), /'secretariat-juridique'/);
  assert.match(read('src/data/proofs.ts'), /v2\/46-service-secretariat-juridique/);
  const migration = MIGRATION_CATALOGUES.routes.find(row => row.from === recipe.path);
  assert.ok(migration, 'retrait documenté de cette route exacte');
  assert.equal(migration.archive.sha256, createHash('sha256').update(read(migration.archive.path)).digest('hex'), 'recette archivée inchangée');
  const seal = JSON.parse(read(`commercial/services/${recipe.slug}/preuves/scellement.json`));
  assert.equal(seal.kind, 'service-depublication-scellee');
  assert.equal(seal.files.recipe.sha256, migration.archive.sha256, 'sceau du retrait lié à la recette');
  const agent = FICHES.find(item => item.slug === 'juridique-fiscal');
  assert.equal(agent?.publie, true);
  const index = ficheDe(agent).taches.findIndex(item => item.famille === recipe.family);
  assert.ok(index >= 0, 'la tâche historique est couverte dans la fiche publiée');
  assert.equal(migration.to, `/agents-ia/${agent.slug}#tache-${recipe.family}-${index + 1}`);
  assert.ok(!agent.servicesLies.includes(recipe.slug), 'aucun lien de retour vers la route retirée');
});
test('la scène montre les sorties résiduelles et refuse les cartouches promotionnels', () => {
  const html = read('docs/design/secretariat-juridique-proof/index.html');
  for (const id of ['approbation', 'depot', 'couvert', 'date-absente']) assert.ok(html.includes(`data-case="${id}"`));
  assert.match(html, /REF-J02/);
  assert.match(html, /Brouillon à valider/);
  assert.match(html, /Note du cabinet conservée/);
  assert.doesNotMatch(html, /Memlia|Lexis|VIKTA|partenariat|Sources|mis à jour/);
});
