import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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
  const usages = read('src/components/sections/Usages.astro');
  assert.match(usages, /contenuDe\('ec'\)\.usages/);
  assert.match(usages, /\{contenu\.texte\}/);
  for (const path of ['src/data/accueil/ec.ts', 'src/pages/methode.astro', 'src/pages/automatisation-cabinet-comptable.astro']) {
    const source = read(path);
    assert.match(source, /famillesDeLaProfession\('ec'\)/);
    assert.match(source, /new Set\(familles\.map\(\(\{ pole \}\) => pole\)\)\.size/);
    assert.match(source, /\$?\{familles\.length\}/);
    assert.match(source, /\$?\{nombrePoles\}/);
    assert.doesNotMatch(source, /soixante familles|douze pôles/);
  }
});


test('le hub ne masque pas un produit d’un nouvel éditeur', () => {
  const source = read('src/pages/integrations/index.astro');
  assert.match(source, /new Set\(INTEGRATIONS_INDEXABLES\.map\(/);
  assert.doesNotMatch(source, /Neuf guides/);
});

test('le pont CAC est accepté, pas une destination éditoriale ou externe', () => {
  for (const href of ['/commissaires-aux-comptes', '/automatisation/paie', '/automatisation-cabinet-comptable']) assert.equal(estLienCommercialBlog(href), true);
  for (const href of ['/blog/fictif', 'https://exemple.fr', '/commissaires-aux-comptes?x=1', '/commissaires-aux-comptes-autre']) assert.equal(estLienCommercialBlog(href), false);
});
