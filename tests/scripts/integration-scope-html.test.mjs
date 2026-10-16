import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { parse } from 'parse5';
import { loadIntegrationFixture } from './integration-fixture.mjs';

const { INTEGRATIONS, INTEGRATIONS_INDEXABLES } = await loadIntegrationFixture();
const migration = JSON.parse(readFileSync('config/migration-catalogues.json', 'utf8'));
const guides = migration.routes.filter(row => row.type === 'guide');
const base = process.env.QA_URL;
const hubHtml = base ? await fetch(new URL('/integrations', base)).then(async response => {
  assert.equal(response.status, 200);
  return response.text();
}) : readFileSync('dist/integrations.html', 'utf8');
const all = node => [node, ...(node.childNodes ?? []).flatMap(all)];
const nodes = all(parse(hubHtml));
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;

test('le hub de compatibilité reste canonique, accessible et exempt de l’ancien annuaire de guides', () => {
  assert.deepEqual(INTEGRATIONS_INDEXABLES, []);
  assert.equal(INTEGRATIONS.length, 12, 'archives complètes');
  assert.equal(nodes.filter(n => n.tagName === 'h1').length, 1);
  assert.deepEqual(nodes.filter(n => n.tagName === 'link' && attr(n, 'rel') === 'canonical').map(n => attr(n, 'href')), ['https://memlia.fr/integrations']);
  assert.doesNotMatch(hubHtml, /data-guide-product|data-guide-filters|data-integration-cards|Guides par environnement/iu);
  assert.doesNotMatch(hubHtml, /undefined|\[object Object\]/u);
});

for (const row of guides) {
  test(`${row.from} : le remplacement pointe une carte réellement rendue`, async () => {
    const target = new URL(row.to, 'https://memlia.fr');
    assert.equal(target.pathname, '/integrations');
    const card = nodes.find(n => attr(n, 'id') === target.hash.slice(1));
    assert.ok(card && attr(card, 'data-connecteur'), `carte absente : ${row.to}`);
    assert.ok(!nodes.some(n => n.tagName === 'a' && attr(n, 'href') === row.from), 'aucun ancien lien du hub');
    if (!base) {
      assert.ok(!existsSync(`dist${row.from}.html`), 'ancienne page HTML absente du build');
    } else if (process.env.QA_PAGES_DELIVERY === '1') {
      const response = await fetch(new URL(row.from, base), { redirect: 'manual' });
      assert.equal(response.status, 301);
      const location = new URL(response.headers.get('location'), base);
      assert.equal(location.pathname + location.hash, row.to);
    }
  });
}

test('le contenu public distingue les compatibilités et les cas fictifs sans promettre un essai éditeur', () => {
  const text = nodes.filter(n => n.nodeName === '#text').map(n => n.value).join(' ').replace(/\s+/g, ' ');
  assert.match(text, /Votre logiciel n’est pas listé/);
  assert.match(text, /Rejoué sur un dossier fictif/);
  assert.ok(nodes.filter(n => n.tagName === 'tr' && attr(n, 'data-issue')).length >= 4);
  assert.doesNotMatch(text, /Essai exécuté dans Sage|certifié par|partenaire officiel/iu);
});
