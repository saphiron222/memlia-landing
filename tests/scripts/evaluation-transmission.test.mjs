import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { COUVERTURE_SERVICES } from '../../src/data/couverture-logiciels.mjs';
const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

test('la préparation d’évaluation a sa preuve propre et trois liens contextuels', () => {
  const recipe = JSON.parse(read('commercial/recettes/evaluation-transmission/recette.json'));
  assert.match(read('src/data/service-design.ts'), /'evaluation-transmission'/);
  assert.match(read('src/data/proofs.ts'), /v2\/47-service-evaluation-transmission/);
  for (const link of recipe.incomingLinks) assert.ok(read(link.sourcePath).includes(`href="${recipe.path}">${link.anchor}</a>`));
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
