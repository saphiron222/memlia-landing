import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';

// Contrat du rendu final : la CSP de contact n'autorise aucun script exécutable inline.
test('contact sert les scripts du chrome en actifs same-origin sous la CSP existante', () => {
  const document = parse(readFileSync('dist/contact.html', 'utf8'));
  const scripts = [];
  const visit = (node) => {
    if (node.tagName === 'script') scripts.push(Object.fromEntries(node.attrs.map(({ name, value }) => [name, value])));
    for (const child of node.childNodes ?? []) visit(child);
  };
  visit(document);
  const executable = scripts.filter(({ type }) => type !== 'application/ld+json');
  assert.ok(executable.length >= 4, 'navigation, footer, apparitions et formulaire présents');
  for (const script of executable) {
    assert.match(script.src ?? '', /^\/_astro\/.+\.js$/, 'chaque script exécutable doit rester externe et same-origin');
    assert.ok(existsSync(`dist${script.src}`), `actif livré : ${script.src}`);
  }
  const headers = readFileSync('public/_headers', 'utf8');
  const csp = headers.split('/contact\n')[1].split('\n\n')[0];
  assert.match(csp, /script-src 'self' https:\/\/challenges\.cloudflare\.com;/);
  assert.doesNotMatch(csp.match(/script-src[^;]+/)[0], /unsafe-inline|unsafe-eval/);
});
