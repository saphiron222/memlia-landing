import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { requetesServices } from '../../scripts/seo/relever-titres-services.mjs';
import { estLienCommercialBlog } from '../../src/data/blog-commercial-links.mjs';

const read = (path) => readFileSync(path, 'utf8');

test('une troisième rubrique fictive rejoint le contrat sans retoucher ses tests', async () => {
  const source = read('src/data/blog-rubriques.mjs').replace('export const BLOG_RUBRIQUES = Object.freeze([', `export const BLOG_RUBRIQUES = Object.freeze([
    Object.freeze({ slug: 'fictive', chemin: '/blog/rubrique/fictive', articleIds: ['fictif-a', 'fictif-b'] }),`);
  const { BLOG_RUBRIQUES, construireRubriques } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
  const entries = BLOG_RUBRIQUES.flatMap(({ articleIds }) => articleIds.map((id) => ({ id })));
  const hubs = construireRubriques(entries);
  assert.deepEqual(hubs.map(({ articles }) => articles.map(({ id }) => id)), BLOG_RUBRIQUES.map(({ articleIds }) => articleIds));
  assert.throws(() => construireRubriques(entries.filter(({ id }) => id !== 'fictif-b')), /minimum 2/);
  assert.doesNotMatch(read('tests/scripts/blog-rubriques.test.mjs'), /assert\.equal\(BLOG_RUBRIQUES\.length, 2\)/);
});

test('les compteurs des pages non scellées viennent de la taxonomie', () => {
  for (const path of ['src/components/sections/Usages.astro', 'src/pages/methode.astro', 'src/pages/automatisation-cabinet-comptable.astro']) {
    const source = read(path);
    assert.match(source, /FAMILLES/);
    assert.match(source, /POLES/);
    assert.doesNotMatch(source, /soixante familles|douze pôles/);
  }
});

test('un sixième service et ses requêtes sont découverts sans plafond', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-service-inventory-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (let i = 0; i < 6; i++) {
    const path = join(root, 'commercial/recettes', `service-${i}`);
    mkdirSync(path, { recursive: true });
    writeFileSync(join(path, 'recette.json'), JSON.stringify({ primaryQuery: `tache ${i}`, secondaryQueries: [`controle ${i}`, `exception ${i}`, 'requete commune'] }));
  }
  assert.deepEqual(requetesServices(root), [...Array.from({ length: 6 }, (_, i) => [`tache ${i}`, `controle ${i}`, `exception ${i}`, 'requete commune']).flat()].filter((value, index, all) => all.indexOf(value) === index));
  const bad = join(root, 'commercial/recettes/service-5/recette.json');
  writeFileSync(bad, JSON.stringify({ primaryQuery: '', secondaryQueries: [] }));
  assert.throws(() => requetesServices(root), /requête/);
});

test('le pont CAC est accepté, pas une destination éditoriale ou externe', () => {
  for (const href of ['/commissaires-aux-comptes', '/automatisation/paie', '/automatisation-cabinet-comptable']) assert.equal(estLienCommercialBlog(href), true);
  for (const href of ['/blog/fictif', 'https://exemple.fr', '/commissaires-aux-comptes?x=1', '/commissaires-aux-comptes-autre']) assert.equal(estLienCommercialBlog(href), false);
});
