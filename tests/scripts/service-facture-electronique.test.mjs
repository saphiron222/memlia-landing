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

test('les trois liens contextuels reprennent les ancres de la recette recadrée', () => {
  const recipe = JSON.parse(read('commercial/recettes/facture-electronique/recette.json'));
  for (const link of recipe.incomingLinks) assert.ok(read(link.sourcePath).includes(`href="${recipe.path}">${link.anchor}</a>`), link.sourcePath);
});
