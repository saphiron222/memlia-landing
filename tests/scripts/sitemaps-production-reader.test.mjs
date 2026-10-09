import test from 'node:test';
import assert from 'node:assert/strict';
import { sitemapProduction } from '../../scripts/lib/seo-instruments.mjs';

test('la sentinelle lit chaque enfant et retourne les pages, pas les fichiers XML', async t => {
  const previous = globalThis.fetch;
  t.after(() => { globalThis.fetch = previous; });
  const requested = [];
  globalThis.fetch = async url => {
    const path = new URL(url).pathname;
    requested.push(path);
    const bodies = {
      '/sitemap.xml': '<sitemapindex><sitemap><loc>https://memlia.fr/sitemap-pages.xml</loc></sitemap><sitemap><loc>https://memlia.fr/sitemap-blog.xml</loc></sitemap></sitemapindex>',
      '/sitemap-pages.xml': '<urlset><url><loc>https://memlia.fr/</loc></url></urlset>',
      '/sitemap-blog.xml': '<urlset><url><loc>https://memlia.fr/blog</loc></url></urlset>',
    };
    return new Response(bodies[path], { status: 200, headers: { 'Content-Type': 'application/xml' } });
  };
  const result = await sitemapProduction();
  assert.equal(result.ok, true);
  assert.deepEqual(result.urls, ['https://memlia.fr/', 'https://memlia.fr/blog']);
  assert.deepEqual(requested, ['/sitemap.xml', '/sitemap-pages.xml', '/sitemap-blog.xml']);
});

test('un enfant inaccessible refuse un relevé partiel', async t => {
  const previous = globalThis.fetch;
  t.after(() => { globalThis.fetch = previous; });
  globalThis.fetch = async url => new URL(url).pathname === '/sitemap.xml'
    ? new Response('<sitemapindex><sitemap><loc>https://memlia.fr/sitemap-blog.xml</loc></sitemap></sitemapindex>', { headers: { 'Content-Type': 'application/xml' } })
    : new Response('absent', { status: 404 });
  const result = await sitemapProduction();
  assert.equal(result.ok, false);
  assert.equal(result.status, 404);
  assert.deepEqual(result.urls, []);
});
