import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'parse5';
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

function elements(node, tagName) {
  return [
    ...(node.tagName === tagName ? [node] : []),
    ...(node.childNodes ?? []).flatMap((child) => elements(child, tagName)),
  ];
}

function text(node) {
  return node.value ?? (node.childNodes ?? []).map(text).join('');
}

function href(node) {
  return node.attrs?.find((attr) => attr.name === 'href')?.value;
}

test('la page saisie ne promet pas un guide absent ni ne renvoie vers elle-même', () => {
  const document = parse(readFileSync('dist/automatisation/saisie-comptable.html', 'utf8'));
  const main = elements(document, 'main')[0];
  assert.ok(main);
  assert.ok(!text(main).includes('Le détail des six contrôles est publié'), 'promesse de guide suspendu');
  for (const link of elements(main, 'a')) {
    assert.notEqual(href(link), '/automatisation/saisie-comptable', `auto-renvoi : ${text(link)}`);
    assert.ok(!text(link).includes('notre guide sur l’automatisation de la saisie comptable'), 'libellé de guide absent');
  }
});

test('la rubrique pièces mène à la saisie publiée et conserve la relance', () => {
  const document = parse(readFileSync('dist/blog/rubrique/gestion-pieces-comptables.html', 'utf8'));
  const main = elements(document, 'main')[0];
  assert.ok(main, 'contenu principal absent');
  const links = elements(main, 'a');
  const saisie = links.find((link) => href(link) === '/automatisation/saisie-comptable');
  assert.ok(saisie, 'destination saisie absente du contenu principal');
  assert.match(text(saisie).trim(), /saisie comptable/i, 'libellé de destination explicite');
  assert.ok(links.some((link) => href(link) === '/blog/automatiser-la-relance-des-pieces-clients'), 'article relance absent');
  assert.ok(links.every((link) => href(link) !== path), 'publication suspendue liée');
});

test('les cinq termes du glossaire conservent un renvoi contextuel publié', () => {
  const document = parse(readFileSync('dist/glossaire.html', 'utf8'));
  const destinations = {
    idempotence: '/methode',
    'generation-augmentee-par-recuperation': '/garanties',
    'connecteur-et-api': '/integrations',
    'export-logiciel-et-import-csv': '/integrations',
    'cle-de-rapprochement': '/automatisation/rapprochement-bancaire',
  };
  for (const [id, destination] of Object.entries(destinations)) {
    const entry = elements(document, 'div').find((node) => node.attrs?.some((attr) => attr.name === 'id' && attr.value === id));
    assert.ok(entry, id);
    const links = elements(entry, 'a').filter((node) => href(node) === destination);
    assert.equal(links.length, 1, `${id} : alternative contextuelle absente`);
    assert.ok(text(links[0]).trim().length > 0, `${id} : libellé absent`);
    assert.ok(!text(links[0]).includes('ce qui reste à vérifier après une saisie automatisée'), `${id} : ancien libellé`);
  }
});
