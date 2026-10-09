import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

export const routes = [
  '/contact',
  '/outils-comptables-gratuits',
  ...['calculateur-marge-commerciale', 'calculateur-amortissement-comptable', 'generateur-charte-ia-cabinet', 'calculateur-date-echeance-facture', 'verificateur-fec-local', 'verificateur-prompt-ia', 'modele-rapprochement-bancaire-excel-gratuit', 'generateur-prompt-expert-comptable', 'diagnostic-maturite-ia-cabinet'].map(slug => `/outils-comptables-gratuits/${slug}`),
];
const blocks = readFileSync(new URL('../../public/_headers', import.meta.url), 'utf8').trim().split(/\n\s*\n/).map(block => block.split('\n'));
const cspFor = route => blocks.find(([path]) => path === (route === '/contact' ? route : '/outils-comptables-gratuits'))[1].split(': ').slice(1).join(': ');

test('surfaces locales : filtre de route, GET/HEAD complets, CSP propre et scripts utiles conservés', async () => {
  const previous = globalThis.HTMLRewriter;
  const removed = [];
  const beacons = ['https://static.cloudflareinsights.com/beacon.min.js', 'https://static.cloudflareinsights.com/beacon.min.js/v123'];
  const witnesses = ['/_astro/local.js', '/scripts/contact-form.js', 'https://example.org/beacon.min.js', 'https://static.cloudflareinsights.com.evil.test/beacon.min.js', '/beacon.min.js', 'https://static.cloudflareinsights.com/not-beacon.min.js'];
  globalThis.HTMLRewriter = class {
    on(selector, handler) {
      assert.equal(selector, 'script[src]');
      for (const src of [...beacons, ...witnesses]) handler.element({ getAttribute: () => src, remove: () => removed.push(src) });
      return this;
    }
    transform(response) { return response; }
  };
  try {
    for (const route of routes) {
      const handlers = await import(`../../functions${route}.js`);
      assert.equal(handlers.onRequestPost, undefined, 'le filtre ne doit pas traiter les saisies POST');
      for (const method of ['GET', 'HEAD']) {
        removed.length = 0;
        const response = await handlers[method === 'GET' ? 'onRequestGet' : 'onRequestHead']({
          request: new Request(`https://memlia.fr${route}`, { method, headers: { 'If-None-Match': 'old', 'If-Modified-Since': 'Mon, 05 Oct 2026 12:00:00 GMT', Range: 'bytes=0-10', 'If-Range': 'old' } }),
          next: async assetRequest => {
            assert.equal(assetRequest.method, 'GET');
            for (const header of ['If-None-Match', 'If-Modified-Since', 'Range', 'If-Range']) assert.equal(assetRequest.headers.get(header), null);
            return new Response('full html', { headers: { 'Content-Type': 'text/html', ETag: 'old', 'Last-Modified': 'old', 'Content-Length': '9', 'Content-Security-Policy': cspFor(route) } });
          },
        });
        assert.deepEqual(removed, beacons, route);
        assert.equal(response.status, 200);
        assert.equal(response.headers.get('Content-Security-Policy'), cspFor(route), route);
        assert.match(response.headers.get('Cache-Control'), /no-transform/);
        for (const header of ['ETag', 'Last-Modified', 'Content-Length']) assert.equal(response.headers.get(header), null);
        assert.equal(await response.text(), method === 'GET' ? 'full html' : '');
      }
      for (const response of [new Response(null, { status: 301 }), new Response('missing', { status: 404 }), new Response('asset', { headers: { 'Content-Type': 'text/plain' } })]) {
        const expectedBody = await response.clone().text();
        const result = await handlers.onRequestGet({ request: new Request(`https://memlia.fr${route}`), next: async () => response });
        assert.equal(result.status, response.status);
        assert.equal(result.headers.get('Content-Type'), response.headers.get('Content-Type'));
        assert.equal(result.headers.get('Strict-Transport-Security'), 'max-age=31536000');
        assert.equal(await result.text(), expectedBody);
      }
    }
  } finally {
    if (previous === undefined) delete globalThis.HTMLRewriter;
    else globalThis.HTMLRewriter = previous;
  }
});

test('surfaces locales : no-transform sur chaque route exacte, aucune extension globale', () => {
  for (const route of routes) assert.ok(blocks.find(([path]) => path === route)?.includes('  Cache-Control: public, max-age=0, must-revalidate, no-transform'), route);
  for (const [route, ...headers] of blocks.filter(([route]) => route.includes('*'))) assert.ok(!headers.some(line => line.includes('no-transform')), route);
});
