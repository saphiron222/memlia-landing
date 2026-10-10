import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequestGet, onRequestHead } from '../../functions/outils-comptables-gratuits/calculateur-roi-automatisation.js';
import { onRequestGet as fecGet, onRequestHead as fecHead } from '../../functions/outils-comptables-gratuits/preparer-pseudonymiser-fichier-csv-fec.js';

test('HSTS : GET/HEAD ROI et FEC, erreurs comprises, sans modifier CSP ni corps', async () => {
  globalThis.HTMLRewriter = class { on() { return this; } transform(response) { return response; } };
  try {
    for (const [path, handlers] of [
      ['calculateur-roi-automatisation', [onRequestGet, onRequestHead]],
      ['preparer-pseudonymiser-fichier-csv-fec', [fecGet, fecHead]],
    ]) {
      for (const [index, handler] of handlers.entries()) {
        for (const status of [200, 404]) {
          const response = await handler({
            request: new Request(`https://memlia.fr/outils-comptables-gratuits/${path}`, {method: index ? 'HEAD' : 'GET'}),
            next: async () => new Response('html', {status, headers: {'Content-Type': 'text/html', 'Content-Security-Policy': "default-src 'self'"}}),
          });
          assert.equal(response.headers.get('Strict-Transport-Security'), 'max-age=31536000');
          assert.equal(response.status, status);
          assert.match(response.headers.get('Content-Security-Policy'), /default-src 'self'/);
          assert.equal(await response.text(), index ? '' : 'html');
        }
      }
    }
  } finally { delete globalThis.HTMLRewriter; }
});

test('HSTS : aucune extension aux previews, localhost ou sous-domaines', async () => {
  for (const host of ['preview.memlia.pages.dev', 'memlia.pages.dev', 'localhost', 'www.memlia.fr', 'other.example']) {
    const asset = new Response(null, {status: 301, headers: {Location: '/destination'}});
    const response = await onRequestGet({request: new Request(`https://${host}/outils-comptables-gratuits/calculateur-roi-automatisation`), next: async () => asset});
    assert.equal(response, asset);
    assert.equal(response.headers.get('Strict-Transport-Security'), null);
  }
});
