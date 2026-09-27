import test from 'node:test';
import assert from 'node:assert/strict';
import { PAGES_NOINDEX } from '../../src/data/site.mjs';
import { onRequest } from '../../functions/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier.js';

const slug = '/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier';

test('la suspension cible GET et HEAD sans servir le contenu litigieux', async () => {
  for (const method of ['GET', 'HEAD']) {
    const response = onRequest({ request: new Request(`https://memlia.fr${slug}?source=search`, { method }) });
    assert.equal(response.status, 503);
    assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/);
    assert.equal(response.headers.get('retry-after'), '86400');
    assert.match(response.headers.get('cache-control') ?? '', /no-store/);
    assert.doesNotMatch(await response.text(), /cycle de vie|signaler directement/);
  }
});

test('la suspension exclut la route du sitemap', () => {
  assert.ok(PAGES_NOINDEX.includes(slug));
});
