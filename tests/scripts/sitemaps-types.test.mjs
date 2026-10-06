import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { splitSitemaps, sitemapType, readSitemapPages } from '../../scripts/lib/sitemaps.mjs';

const header = '<?xml version="1.0" encoding="UTF-8"?>';
const paths = ['/', '/contact', '/automatisation/fec', '/integrations', '/integrations/sage', '/outils-comptables-gratuits', '/outils-comptables-gratuits/fec', '/blog', '/blog/article', '/glossaire', '/commissaires-aux-comptes', '/commissaires-aux-comptes/certification'];
const entries = paths.map(path => `<url><loc>https://memlia.fr${path}</loc><lastmod>2026-09-20T12:34:56.000Z</lastmod><priority>0.6</priority></url>`);

test('classe les hubs, leurs descendants et CAC sans capturer un préfixe voisin', () => {
  assert.deepEqual(paths.map(path => sitemapType(`https://memlia.fr${path}`)), ['pages', 'pages', 'services', 'guides', 'guides', 'outils', 'outils', 'blog', 'blog', 'glossaire', 'cac', 'cac']);
  assert.equal(sitemapType('https://memlia.fr/blogue'), 'pages');
});

test('partition complète, unique, XML daté inchangé et absence du sitemap agrégé', () => {
  const dist = mkdtempSync(join(tmpdir(), 'sitemap-types-'));
  try {
    writeFileSync(join(dist, 'sitemap-0.xml'), `${header}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</urlset>`);
    writeFileSync(join(dist, 'sitemap-index.xml'), '<sitemapindex/>');
    splitSitemaps(dist, 'https://memlia.fr');
    assert.ok(!readdirSync(dist).includes('sitemap-0.xml'));
    assert.equal(readFileSync(join(dist, 'sitemap.xml'), 'utf8'), readFileSync(join(dist, 'sitemap-index.xml'), 'utf8'));
    const actual = readSitemapPages(dist);
    for (const entry of entries) assert.ok(actual.includes(entry), entry);
    const urls = [...actual.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
    assert.equal(urls.length, paths.length);
    assert.equal(new Set(urls).size, paths.length);
    for (const type of ['pages', 'services', 'guides', 'outils', 'blog', 'glossaire', 'cac']) {
      assert.ok(readFileSync(join(dist, `sitemap-${type}.xml`), 'utf8').includes('<urlset xmlns='));
      assert.ok(readFileSync(join(dist, 'sitemap.xml'), 'utf8').includes(`https://memlia.fr/sitemap-${type}.xml`));
    }
  } finally { rmSync(dist, { recursive: true }); }
});

test('refuse un doublon au lieu de le masquer et ne publie pas un type vide', () => {
  const dist = mkdtempSync(join(tmpdir(), 'sitemap-types-'));
  try {
    writeFileSync(join(dist, 'sitemap-0.xml'), `<urlset>${entries[0]}${entries[0]}</urlset>`);
    assert.throws(() => splitSitemaps(dist, 'https://memlia.fr'), /doublon/);
    writeFileSync(join(dist, 'sitemap-0.xml'), `<urlset>${entries[0]}</urlset>`);
    writeFileSync(join(dist, 'sitemap-cac.xml'), `<urlset>${entries.at(-1)}</urlset>`);
    splitSitemaps(dist, 'https://memlia.fr');
    assert.ok(!readdirSync(dist).includes('sitemap-cac.xml'));
    assert.ok(!readFileSync(join(dist, 'sitemap.xml'), 'utf8').includes('sitemap-cac.xml'));
  } finally { rmSync(dist, { recursive: true }); }
});
