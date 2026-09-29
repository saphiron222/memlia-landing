import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { PAGES_NOINDEX } from '../../src/data/site.mjs';

const slug = '/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier';

test('l’article FE n’est plus intercepté par une fonction de maintenance ni exclu de l’index', () => {
  const fonction = resolve('functions/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier.js');
  assert.equal(existsSync(fonction), false);
  assert.equal(PAGES_NOINDEX.includes(slug), false);
});
