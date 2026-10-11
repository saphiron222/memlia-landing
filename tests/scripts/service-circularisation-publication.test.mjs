import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
test('circularisation : sa preuve, son audience CAC et sa couverture complète', async () => {
  const { couvertureDe } = await import('../../src/data/couverture-logiciels.mjs');
  const couverture = couvertureDe('circularisation-cac');
  assert.ok(couverture);
  assert.match(couverture.dejaFait.find((item) => item.outil === 'Circit').geste, /rapproche/);
  assert.match(read('src/data/service-design.ts'), /v2\/44-service-circularisation-cac/);
  assert.match(read('src/layouts/Service.astro'), /Cabinets de commissariat aux comptes/);
  const contract = JSON.parse(read('config/page-intent-contract.json'));
  assert.equal(contract.pages['/automatisation/circularisation-cac'].query, 'automatiser circularisation');
});
test('le cadre montre la sélection et les pièces, sans cartouche promotionnel', () => {
  const html = read('docs/design/circularisation-cac-proof/index.html');
  assert.match(html, /id="service-circularisation-cac"/);
  for (const word of ['Solde', 'Mouvement', 'Tirage', 'Couverture', 'Passe 2', 'Pièce', 'À examiner']) assert.ok(html.includes(word), word);
  assert.doesNotMatch(html, /Memlia|NEP|homolog|partenariat|2026/);
});
