import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequestGet, onRequestHead } from '../../functions/outils-comptables-gratuits/assistant-lettrage-comptable-local.js';
const request = new Request('https://memlia.fr/outils-comptables-gratuits/assistant-lettrage-comptable-local');

test('Lettrage : seuls les deux beacons Cloudflare sont retirés, CSP et validation du cache maintenues', async () => {
  const removed = [];
  globalThis.HTMLRewriter = class {
    on(selector, handler) {
      assert.equal(selector, 'script[src]');
      for (const src of ['https://static.cloudflareinsights.com/beacon.min.js', 'https://static.cloudflareinsights.com/beacon.min.js/v123', '/_astro/lettrage.js', 'https://example.org/beacon.min.js']) {
        handler.element({getAttribute: () => src, remove: () => removed.push(src)});
      }
      return this;
    }
    transform(response) { return response; }
  };
  try {
    const response = await onRequestGet({request, next: async () => new Response('<!doctype html>', {headers: {'Content-Type':'text/html; charset=utf-8',ETag:'old'}})});
    assert.deepEqual(removed, ['https://static.cloudflareinsights.com/beacon.min.js','https://static.cloudflareinsights.com/beacon.min.js/v123']);
    assert.equal(response.headers.get('Cache-Control'), 'public, max-age=0, must-revalidate, no-transform');
    assert.match(response.headers.get('Content-Security-Policy'), /connect-src 'none'/);
    assert.equal(response.headers.get('ETag'), null);
  } finally { delete globalThis.HTMLRewriter; }
});
test('Lettrage : redirection ou erreur non HTML inchangée', async () => {
  const response = new Response(null,{status:301,headers:{Location:'/outils-comptables-gratuits/assistant-lettrage-comptable-local'}});
  const delivered = await onRequestGet({request,next:async()=>response});
  assert.equal(delivered.status, response.status);
  assert.equal(delivered.headers.get('Location'), response.headers.get('Location'));
  assert.equal(await delivered.text(), '');
});

test('Lettrage : ancien ETag, date ou Range ne réutilisent jamais le corps avec beacon ; HEAD concorde', async () => {
  globalThis.HTMLRewriter = class { on() {return this;} transform(response) {return response;} };
  try {
    for (const method of ['GET','HEAD']) {
      const conditional = new Request(request.url, {method,headers:{'If-None-Match':'old','If-Modified-Since':'Sun, 04 Oct 2026 16:00:00 GMT',Range:'bytes=0-10','If-Range':'old'}});
      const handler = method === 'HEAD' ? onRequestHead : onRequestGet;
      const response = await handler({request:conditional,next:async assetRequest=>{
        assert.equal(assetRequest.method,'GET');
        for (const header of ['If-None-Match','If-Modified-Since','Range','If-Range']) assert.equal(assetRequest.headers.get(header),null);
        return new Response('full html',{headers:{'Content-Type':'text/html',ETag:'old','Last-Modified':'old'}});
      }});
      assert.equal(response.status,200);assert.equal(response.headers.get('ETag'),null);assert.equal(response.headers.get('Last-Modified'),null);
      assert.match(response.headers.get('Cache-Control'),/no-transform/);
      assert.equal(await response.text(),method === 'HEAD' ? '' : 'full html');
    }
  } finally {delete globalThis.HTMLRewriter;}
});
