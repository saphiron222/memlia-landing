import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
test('le service juridique possède sa preuve propre et les trois liens prévus', () => {
  const recipe = JSON.parse(read('commercial/recettes/secretariat-juridique/recette.json'));
  assert.match(read('src/data/service-design.ts'), /'secretariat-juridique'/);
  assert.match(read('src/data/proofs.ts'), /v2\/46-service-secretariat-juridique/);
  for (const link of recipe.incomingLinks) {
    assert.ok(read(link.sourcePath).includes(`href="${recipe.path}">${link.anchor}</a>`));
  }
});
test('la scène montre les sorties résiduelles et refuse les cartouches promotionnels', () => {
  const html = read('docs/design/secretariat-juridique-proof/index.html');
  for (const id of ['approbation', 'depot', 'couvert', 'date-absente']) assert.ok(html.includes(`data-case="${id}"`));
  assert.match(html, /REF-J02/);
  assert.match(html, /Brouillon à valider/);
  assert.match(html, /Note du cabinet conservée/);
  assert.doesNotMatch(html, /Memlia|Lexis|VIKTA|partenariat|Sources|mis à jour/);
});
