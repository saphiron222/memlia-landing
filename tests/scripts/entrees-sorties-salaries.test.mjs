import { createHash } from 'node:crypto';
import { MIGRATION_CATALOGUES } from '../../src/data/migrations-catalogues.mjs';
import { FICHES, ficheDe } from '../../src/data/specialistes.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { COUVERTURE_SERVICES } from '../../src/data/couverture-logiciels.mjs';
const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const slug = 'entrees-sorties-salaries';

test('les annonces hors portail ont leur couverture et leur intention propres', () => {
  const couverture = COUVERTURE_SERVICES[slug];
  assert.ok(couverture);
  assert.deepEqual([...new Set(couverture.dejaFait.map((geste) => geste.outil))], ['mySilae', 'PayFit']);
  assert.match(couverture.reste.join(' '), /seulement pour une entrée hors portail/);
  const intent = JSON.parse(read('config/page-intent-contract.json')).pages[`/automatisation/${slug}`];
  assert.equal(intent, undefined, 'la route retirée ne réserve plus une intention publique');
  const migration = MIGRATION_CATALOGUES.routes.find(row => row.from === `/automatisation/${slug}`);
  const recipe = JSON.parse(read(migration.archive.path));
  assert.equal(recipe.primaryQuery, 'automatisation entrées sorties salariés cabinet comptable');
  assert.equal(createHash('sha256').update(read(migration.archive.path)).digest('hex'), migration.archive.sha256);
  const agent = FICHES.find(item => item.slug === 'paie-social');
  const index = ficheDe(agent).taches.findIndex(item => item.famille === recipe.family);
  assert.ok(index >= 0);
  assert.equal(migration.to, `/agents-ia/paie-social#tache-${recipe.family}-${index + 1}`);
});

test('la scène spécifique conserve les sept cas sans cartouche promotionnel', () => {
  const html = read(`docs/design/${slug}-proof/index.html`);
  assert.equal((html.match(/data-case=/g) ?? []).length, 7);
  assert.match(html, /sans DPAE/);
  assert.match(html, /Circuit existant conservé/);
  assert.doesNotMatch(html, /Memlia|mySilae|PayFit|partenariat|2026-\d\d-\d\d/);
  assert.match(read('src/data/service-design.ts'), /v2\/44-service-entrees-sorties-salaries/);
  assert.match(read('src/data/page-eeat.ts'), /'entrees-sorties-salaries'/);
});
