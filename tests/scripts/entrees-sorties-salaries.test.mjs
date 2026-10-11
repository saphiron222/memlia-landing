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
  assert.equal(intent.query, 'automatisation entrées sorties salariés cabinet comptable');
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
