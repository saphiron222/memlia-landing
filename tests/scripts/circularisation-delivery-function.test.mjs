import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequestGet, onRequestHead } from '../../functions/outils-comptables-gratuits/suivi-circularisation.js';

const url = 'https://memlia.fr/outils-comptables-gratuits/suivi-circularisation';
const html = '<!doctype html><script src="/_astro/circularisation.js"></script><script src="https://static.cloudflareinsights.com/beacon.min.js"></script><script src="https://static.cloudflareinsights.com/beacon.min.js/v123"></script><script src="https://example.org/beacon.min.js"></script><main>Import/export local</main>';
const headers = {'Content-Type': 'text/html; charset=utf-8', ETag: 'old', 'Last-Modified': 'Sun, 04 Oct 2026 16:00:00 GMT', 'Content-Length': String(html.length), 'X-Content-Type-Options': 'nosniff'};

// Double du seul contrat HTMLRewriter ; la recette edge utilise le vrai runtime.
function installRewriter() {
  globalThis.HTMLRewriter = class {
    on(selector, handler) { assert.equal(selector, 'script[src]'); this.handler = handler; return this; }
    transform(response) {
      const handler = this.handler;
      const stream = new ReadableStream({async start(controller) {
        const body = (await response.text()).replace(/<script src="([^"]+)"><\/script>/g, (tag, src) => {
          let removed = false;
          handler.element({getAttribute: name => { assert.equal(name, 'src'); return src; }, remove: () => { removed = true; }});
          return removed ? '' : tag;
        });
        controller.enqueue(new TextEncoder().encode(body)); controller.close();
      }});
      return new Response(stream, {status: response.status, headers: response.headers});
    }
  };
}

test('circularisation : GET filtre le HTML, garde scripts applicatifs et protections', async () => {
  installRewriter();
  try {
    const response = await onRequestGet({request: new Request(url), next: async () => new Response(html, {headers})});
    assert.equal(await response.text(), html.replace(/<script src="https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js(?:\/v123)?"><\/script>/g, ''));
    assert.equal(response.headers.get('Cache-Control'), 'public, max-age=0, must-revalidate, no-transform');
    assert.match(response.headers.get('Content-Security-Policy'), /connect-src 'none'/);
    assert.match(response.headers.get('Content-Security-Policy'), /script-src 'self' 'unsafe-inline'/);
    assert.equal(response.headers.get('Strict-Transport-Security'), 'max-age=31536000');
    assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
    for (const name of ['ETag', 'Last-Modified', 'Content-Length']) assert.equal(response.headers.get(name), null);
  } finally { delete globalThis.HTMLRewriter; }
});

test('circularisation : GET/HEAD conditionnels récupèrent le corps complet plutôt que 304/206', async () => {
  installRewriter();
  try {
    for (const method of ['GET', 'HEAD']) {
      const request = new Request(url, {method, headers: {'If-None-Match': 'old', 'If-Modified-Since': headers['Last-Modified'], Range: 'bytes=0-10', 'If-Range': 'old', 'Accept-Language': 'fr'}});
      const response = await (method === 'HEAD' ? onRequestHead : onRequestGet)({request, next: async (assetRequest = request) => {
        assert.equal(assetRequest.method, 'GET');
        assert.equal(assetRequest.headers.get('Accept-Language'), 'fr');
        // Reproduit le cache d’asset : un validateur transmis rendrait 304.
        if (assetRequest.headers.has('If-None-Match') || assetRequest.headers.has('If-Modified-Since')) return new Response(null, {status: 304, headers});
        if (assetRequest.headers.has('Range') || assetRequest.headers.has('If-Range')) return new Response('partial', {status: 206, headers});
        return new Response(html, {headers});
      }});
      assert.equal(response.status, 200);
      for (const name of ['ETag', 'Last-Modified', 'Content-Length']) assert.equal(response.headers.get(name), null);
      assert.match(response.headers.get('Cache-Control'), /no-transform/);
      const body = await response.text();
      if (method === 'HEAD') assert.equal(body, '');
      else { assert.doesNotMatch(body, /cloudflareinsights/); assert.match(body, /Import\/export local/); }
    }
  } finally { delete globalThis.HTMLRewriter; }
});

test('circularisation : redirections et non HTML conservés, pas de HSTS preview', async () => {
  for (const method of ['GET', 'HEAD']) {
    for (const status of [200, 301, 404]) {
      const response = await (method === 'HEAD' ? onRequestHead : onRequestGet)({
        request: new Request(url.replace('memlia.fr', 'preview.memlia.pages.dev'), {method}),
        next: async () => new Response('unchanged', {status, headers: {'Content-Type': 'text/plain', Location: '/witness', ETag: 'unchanged'}}),
      });
      assert.equal(response.status, status);
      assert.equal(response.headers.get('Location'), '/witness');
      assert.equal(response.headers.get('ETag'), 'unchanged');
      assert.equal(response.headers.get('Strict-Transport-Security'), null);
      assert.equal(await response.text(), method === 'HEAD' ? '' : 'unchanged');
    }
  }
});
