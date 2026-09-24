import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isBlogEntryDiscoverable, isSuspendedBlogPath } from '../../src/data/blog-visibility.mjs';
import { lireArticlesPublies } from '../../src/data/blog.mjs';
import liensBlogSuspendus from '../../src/lib/liens-blog-suspendus.mjs';

const slug = 'automatiser-la-saisie-comptable-ce-qui-reste-a-verifier';
const path = `/blog/${slug}`;

test('la suspension retire la publication des listes et du sitemap sans effacer sa source', () => {
  assert.equal(isBlogEntryDiscoverable({ id: slug, data: { brouillon: false } }), false);
  assert.equal(isBlogEntryDiscoverable({ id: 'automatiser-la-relance-des-pieces-clients', data: { brouillon: false } }), true);
  assert.equal(isSuspendedBlogPath(path), true);
  assert.equal(isSuspendedBlogPath('/blog/automatiser-la-relance-des-pieces-clients'), false);
  assert.ok(lireArticlesPublies().some((article) => article.slug === slug));
});

test('aucune des sept pages indexables ne renvoie un lien vers la publication suspendue', () => {
  assert.ok(!readFileSync('public/llms.txt', 'utf8').includes(path), 'llms.txt');
  const pages = [
    'src/pages/automatisation-cabinet-comptable.astro',
    'src/pages/garanties.astro',
  ];
  for (const page of pages) assert.ok(!readFileSync(page, 'utf8').includes(path), page);
  for (const route of [
    'automatisation-cabinet-comptable', 'automatisation/saisie-comptable', 'blog',
    'blog/automatiser-un-cabinet-comptable-la-carte-des-taches',
    'blog/rubrique/gestion-pieces-comptables', 'garanties', 'glossaire',
  ]) {
    const html = readFileSync(`dist/${route}.html`, 'utf8');
    assert.ok(!html.match(/<main\b[^>]*>[\s\S]*?<\/main>/)?.[0].includes(`href="${path}"`), route);
  }
  assert.ok(!readFileSync('dist/sitemap-0.xml', 'utf8').includes(path));
  const link = { properties: { href: path } };
  liensBlogSuspendus().element.visit(link, { setProperty(node, key, value) { node.properties[key] = value; } });
  assert.equal(link.properties.href, '/automatisation/saisie-comptable');
});
