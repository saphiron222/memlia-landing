import test from 'node:test';
import assert from 'node:assert/strict';
import { historicalAccueil } from '../helpers/accueil-witness.mjs';

const guide = { slug: 'guide-fictif', task: 'contrôle fictif', vendor: 'Éditeur fictif' };
const item = '<li><a class="pied-lien" href="/integrations/guide-fictif">Contrôle fictif · Éditeur fictif</a></li>';
const baseline = '<html><head></head><body><h1>Témoin</h1><footer><ul><li>Historique</li></ul></footer></body></html>';
const withGuide = baseline.replace('</ul>', `${item}</ul>`);

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
