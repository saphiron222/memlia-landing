import test from 'node:test';
import assert from 'node:assert/strict';
import { historicalAccueil } from '../helpers/accueil-witness.mjs';

const guide = { slug: 'guide-fictif', task: 'contrôle fictif', vendor: 'Éditeur fictif' };
const item = '<li><a class="pied-lien" href="/integrations/guide-fictif">Contrôle fictif · Éditeur fictif</a></li>';
const baseline = '<html><head></head><body><h1>Témoin</h1><footer><ul><li>Historique</li></ul></footer></body></html>';
const withGuide = baseline.replace('</ul>', `${item}</ul>`);
const astroItem = item.replace('<li>', '<li data-astro-cid-jo6i4kqk>').replace('href="/integrations/guide-fictif">', 'href="/integrations/guide-fictif" data-astro-cid-jo6i4kqk>');

test('le fragment Astro réellement émis reste accepté', () => {
  assert.equal(historicalAccueil(baseline.replace('</ul>', `${astroItem}</ul>`), [guide]), baseline);
});

for (const [name, before, after] of [
  ['aria-hidden sur a', '<a ', '<a aria-hidden="true" '],
  ['tabindex sur a', '<a ', '<a tabindex="-1" '],
  ['style sur a', '<a ', '<a style="display:none" '],
  ['hidden sur li', '<li ', '<li hidden '],
  ['style sur li', '<li ', '<li style="display:none" '],
  ['href dupliqué', 'href="/integrations/guide-fictif"', 'href="/integrations/guide-fictif" href="/contact"'],
]) {
  test(`le témoin refuse ${name} avant de retirer le fragment`, () => {
    const mutation = astroItem.replace(before, after);
    assert.notEqual(mutation, astroItem);
    assert.throws(() => historicalAccueil(baseline.replace('</ul>', `${mutation}</ul>`), [guide]));
  });
}

test('le témoin conserve chaque octet hors lien contrôlé, y compris sans nouveau guide', () => {
  assert.equal(historicalAccueil(baseline, []), baseline);
  assert.equal(historicalAccueil(withGuide, [guide]), baseline);
  const changed = withGuide.replace('Témoin', 'Altéré');
  assert.notEqual(historicalAccueil(changed, [guide]), baseline);
});

test('un lien scellé manquant, dupliqué ou altéré reste refusé', () => {
  assert.throws(() => historicalAccueil(baseline, [guide]), /un lien accueil/);
  assert.throws(() => historicalAccueil(withGuide.replace(item, item + item), [guide]), /un lien accueil/);
  assert.throws(() => historicalAccueil(withGuide.replace('Contrôle fictif', 'Autre intitulé'), [guide]));
  assert.throws(() => historicalAccueil(withGuide.replace('pied-lien', 'autre-classe'), [guide]));
});

test('un lien hors footer ou enrichi ne peut pas disparaître du témoin', () => {
  assert.throws(() => historicalAccueil(baseline.replace('<h1>', `${item}<h1>`), [guide]), /footer/);
  assert.throws(() => historicalAccueil(withGuide.replace('</a>', '</a><span>Texte ajouté</span>'), [guide]));
});
