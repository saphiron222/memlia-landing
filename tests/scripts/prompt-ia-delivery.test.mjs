import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const route = '/outils-comptables-gratuits/generateur-prompt-ia-gratuit';
const csp = "default-src 'self'; base-uri 'self'; connect-src 'none'; font-src 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data: blob:; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'";

test('prompt IA : GET/HEAD retirent uniquement Insights sans réutiliser le corps non filtré', async () => {
  const { onRequestGet, onRequestHead } = await import('../../functions/outils-comptables-gratuits/generateur-prompt-ia-gratuit.js');
  const previous = globalThis.HTMLRewriter;
  const removed = [];
  globalThis.HTMLRewriter = class {
    on(selector, handler) {
      assert.equal(selector, 'script[src]');
      for (const src of ['https://static.cloudflareinsights.com/beacon.min.js', 'https://static.cloudflareinsights.com/beacon.min.js/v123', '/_astro/prompt-ia.js', '/scripts/prompt-ia.mjs', 'https://example.org/beacon.min.js']) {
        handler.element({ getAttribute: () => src, remove: () => removed.push(src) });
      }
      return this;
    }
    transform(response) { return response; }
  };
  try {
    for (const method of ['GET', 'HEAD']) {
      removed.length = 0;
      const request = new Request(`https://memlia.fr${route}`, { method, headers: { 'If-None-Match': 'old', 'If-Modified-Since': 'Mon, 05 Oct 2026 12:00:00 GMT', Range: 'bytes=0-10', 'If-Range': 'old' } });
      const response = await (method === 'GET' ? onRequestGet : onRequestHead)({ request, next: async assetRequest => {
        assert.equal(assetRequest.method, 'GET');
        for (const header of ['If-None-Match', 'If-Modified-Since', 'Range', 'If-Range']) assert.equal(assetRequest.headers.get(header), null);
        return new Response('full html', { headers: { 'Content-Type': 'text/html', ETag: 'old', 'Last-Modified': 'old', 'Content-Length': '9' } });
      } });
      assert.deepEqual(removed, ['https://static.cloudflareinsights.com/beacon.min.js', 'https://static.cloudflareinsights.com/beacon.min.js/v123']);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('Content-Security-Policy'), csp);
      assert.equal(response.headers.get('Cache-Control'), 'public, max-age=0, must-revalidate, no-transform');
      for (const header of ['ETag', 'Last-Modified', 'Content-Length']) assert.equal(response.headers.get(header), null);
      assert.equal(await response.text(), method === 'GET' ? 'full html' : '');
    }
    for (const response of [new Response(null, { status: 301, headers: { Location: route } }), new Response('error', { status: 404 })]) {
      assert.equal(await onRequestGet({ request: new Request(`https://memlia.fr${route}`), next: async () => response }), response);
    }
  } finally {
    if (previous === undefined) delete globalThis.HTMLRewriter;
    else globalThis.HTMLRewriter = previous;
  }
});

test('prompt IA : no-transform limité à la route et CSP locale conservée', () => {
  const blocks = readFileSync(new URL('../../public/_headers', import.meta.url), 'utf8').trim().split(/\n\s*\n/).map(block => block.split('\n'));
  const scoped = blocks.find(([path]) => path === route);
  assert.ok(scoped, 'la route doit prévenir la seconde injection edge');
  assert.ok(scoped.includes('  Cache-Control: public, max-age=0, must-revalidate, no-transform'));
  assert.equal(blocks.find(([path]) => path === '/outils-comptables-gratuits/*')[1], `  Content-Security-Policy: ${csp}`);
  assert.ok(!blocks.find(([path]) => path === '/*')?.some(line => line.includes('no-transform')));
});
