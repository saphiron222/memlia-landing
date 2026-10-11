import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rendreTableauxAccessibles } from '../../src/lib/table-scroll.mjs';

test('wraps Markdown and raw HTML tables without rewriting their contents', () => {
  const table = '<table data-proof="x"><thead><tr><th>A</th><th>B &amp; C</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>';
  const html = `<h2 id="regle">La règle &amp; ses limites</h2>${table}<p>Suite</p>`;
  const rendered = rendreTableauxAccessibles(html);
  assert.ok(rendered.includes(table));
  assert.match(rendered, /role="region" tabindex="0" aria-label="Tableau 1 : La règle &amp; ses limites"/);
  assert.ok(rendered.endsWith('</div><p>Suite</p>'));
});

test('names every table, preferring caption then heading, and escapes labels', () => {
  const rendered = rendreTableauxAccessibles('<table><caption>Un "cas" &amp; exemple</caption><tr><td>X</td></tr></table><h3>Exceptions</h3><div><table><tr><td>Y</td></tr></table></div>');
  assert.match(rendered, /Tableau 1 : Un &quot;cas&quot; &amp; exemple/);
  assert.match(rendered, /Tableau 2 : Exceptions/);
});

test('leaves non-table markup byte-identical and has a fallback label', () => {
  const html = '<figure data-blog-proof="x"><img src="/x.webp" alt="A &amp; B"></figure>';
  assert.equal(rendreTableauxAccessibles(html), html);
  assert.match(rendreTableauxAccessibles('<table><tr><td>X</td></tr></table>'), /Tableau 1 : données/);
});
