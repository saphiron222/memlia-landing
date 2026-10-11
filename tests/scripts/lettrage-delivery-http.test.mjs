import { test } from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.DELIVERY_URL;
const route = '/outils-comptables-gratuits/assistant-lettrage-comptable-local';
const csp = "default-src 'self'; base-uri 'self'; connect-src 'none'; font-src 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data: blob:; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'";

for (const method of ['GET', 'HEAD']) {
  for (const conditional of [{}, {'If-None-Match':'"old"'}, {'If-Modified-Since':'Sun, 04 Oct 2026 16:00:00 GMT'}, {Range:'bytes=0-10', 'If-Range':'"old"'}]) {
    test(`Lettrage HTTP réel ${method} ${JSON.stringify(conditional)}`, {skip: !base}, async () => {
      const response = await fetch(new URL(route, base), {method, headers:{'Cache-Control':'no-cache', ...conditional}});
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('content-security-policy'), csp);
      assert.equal(response.headers.get('etag'), null);
      assert.equal(response.headers.get('last-modified'), null);
      assert.match(response.headers.get('cache-control'), /no-transform/);
      const html = await response.text();
      if (method === 'HEAD') assert.equal(html, '');
      else {
        assert.match(html, /<!doctype html>/i);
        assert.match(html, /lettrage/);
        assert.doesNotMatch(html, /<script[^>]+src=["']https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js/);
      }
    });
  }
}
