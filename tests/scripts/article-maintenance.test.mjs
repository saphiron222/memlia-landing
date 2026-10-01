import test from 'node:test';
import assert from 'node:assert/strict';
import { PAGES_NOINDEX } from '../../src/data/site.mjs';
import { onRequest } from '../../functions/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier.js';

const slug = '/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier';

test('la suspension cible GET et HEAD sans servir le contenu litigieux', async () => {
  for (const method of ['GET', 'HEAD']) {
    const response = onRequest({ request: new Request(`https://memlia.fr${slug}?source=search`, { method }) });
    assert.equal(response.status, 503);
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
    assert.equal(response.headers.get('retry-after'), '86400');
    assert.equal(response.headers.get('cache-control'), 'no-store');
    const body = await response.text();
    assert.doesNotMatch(body, /cycle de vie|signaler directement/);
    if (method === 'HEAD') assert.equal(body, '');
    else assert.match(body, /<meta name="robots" content="noindex, nofollow">/);
  }
});

test('la suspension exclut la route du sitemap', () => {
  assert.ok(PAGES_NOINDEX.includes(slug));
});
