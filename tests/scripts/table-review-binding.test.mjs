import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderedBodySha256 } from '../../scripts/lib/blog-review-binding.mjs';
import { rendreTableauxAccessibles } from '../../src/lib/table-scroll.mjs';

const table = '<table><thead><tr><th>Contrôle</th></tr></thead><tbody><tr><td>Décision humaine</td></tr></tbody></table>';
const page = (body) => `<html><body><div class="article-corps lecture">${body}</div></body></html>`;
test('accessibility-only wrappers preserve the editorial review binding', () => {
  assert.equal(renderedBodySha256(page(rendreTableauxAccessibles(table))), renderedBodySha256(page(table)));
});
test('table content and arbitrary wrapper changes still invalidate the review binding', () => {
  const expected = renderedBodySha256(page(table));
  assert.notEqual(renderedBodySha256(page(rendreTableauxAccessibles(table.replace('humaine', 'automatique')))), expected);
  assert.notEqual(renderedBodySha256(page(`<div>${table}</div>`)), expected);
  assert.notEqual(renderedBodySha256(page(`<div data-table-scroll><p>Promesse nouvelle</p>${table}</div>`)), expected);
});
