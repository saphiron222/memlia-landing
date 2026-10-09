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
test('registres : trois liens contextuels exacts et frontière de formalités', () => {
  const recipe = JSON.parse(read('commercial/recettes/registres-obligations/recette.json'));
  for (const link of recipe.incomingLinks) {
    const source = read(link.sourcePath);
    assert.ok(source.includes(`[${link.anchor}](${recipe.path})`) || source.includes(`href="${recipe.path}">${link.anchor}</a>`));
  }
  const body = read('commercial/recettes/registres-obligations/corps.md');
  assert.match(body, /distinct de la tenue d’un registre légal/);
  assert.match(body, /sans connexion aux registres/);
});
