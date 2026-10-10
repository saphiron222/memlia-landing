import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { COUVERTURE_SERVICES } from '../../src/data/couverture-logiciels.mjs';
import { verifierLiensEntrantsService } from '../../scripts/service-forge.mjs';
const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

test('le contrôle croisé a sa preuve propre, sa couverture et trois liens exacts', () => {
  const recipe = JSON.parse(read('commercial/recettes/bulletins-controle/recette.json'));
  const errors = [];
  verifierLiensEntrantsService(process.cwd(), recipe, errors);
  assert.deepEqual(errors, []);
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
