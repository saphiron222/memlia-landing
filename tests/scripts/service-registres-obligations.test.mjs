import { createHash } from 'node:crypto';
import { MIGRATION_CATALOGUES } from '../../src/data/migrations-catalogues.mjs';
import { FICHES, ficheDe } from '../../src/data/specialistes.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { couvertureDe } from '../../src/data/couverture-logiciels.mjs';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
test('registres : la citation possède une ancre présente dans le texte', () => {
  const eeat = read('src/data/page-eeat.ts').match(/'registres-obligations': \{([\s\S]*?)\n  \},/)[1];
  const anchor = eeat.match(/mot: '([^']+)'/)?.[1];
  assert.ok(anchor, 'mot requis par le gabarit de citation');
  assert.ok(read('src/content/services/registres-obligations.md').includes(anchor));
});
test('registres : couverture existante et travail résiduel explicités', () => {
  const coverage = couvertureDe('registres-obligations');
  assert.ok(coverage);
  assert.ok(coverage.dejaFait.some((item) => item.outil === 'Kanta'));
  assert.ok(coverage.dejaFait.some((item) => /BODACC/.test(item.outil)));
  assert.ok(coverage.reste.length >= 3);
});
test('registres : preuve dédiée fonctionnelle sans cartouche promotionnel', () => {
  const html = read('docs/design/registres-obligations-proof/index.html');
  assert.match(html, /id="service-registres-obligations"/);
  assert.match(html, /Annotation conservée/);
  assert.match(html, /Alerte à l’associé/);
  assert.match(html, /Terme calendaire à valider/);
  assert.doesNotMatch(html, /Memlia|logo|partenariat|data-brand/);
  assert.ok(existsSync(new URL('../../docs/design/registres-obligations-proof/content-contract.json', import.meta.url)));
});
test('registres : archive conservée, tâche de Grégoire et frontière de formalités', () => {
  const recipe = JSON.parse(read('commercial/recettes/registres-obligations/recette.json'));
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
  const body = read('commercial/recettes/registres-obligations/corps.md');
  assert.match(body, /distinct de la tenue d’un registre légal/);
  assert.match(body, /sans connexion aux registres/);
});
