import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'parse5';

const html = readFileSync('dist/a-propos.html', 'utf8');
const nodes = [];
function visit(node) {
  nodes.push(node);
  for (const child of node.childNodes ?? []) visit(child);
}
visit(parse(html));
const attr = (node, name) => node.attrs?.find((a) => a.name === name)?.value;
const text = (node) => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
const byId = (id) => nodes.find((node) => attr(node, 'id') === id);

test('à propos garde la valeur et la frontière avant le fondateur', () => {
  assert.equal(nodes.filter((n) => n.tagName === 'h1').length, 1);
  assert.ok(nodes.indexOf(byId('expert')) < nodes.indexOf(byId('kevin-kitanga')));
  assert.match(text(byId('kevin-kitanga')), /Kevin Kitanga, fondateur/);
  assert.match(text(byId('kevin-kitanga')), /jeu d’essai fictif/);
  assert.doesNotMatch(text(byId('kevin-kitanga')), /expert-comptable|commissaire aux comptes|Sauvaget/);
  assert.match(html, /ce qui se prépare seul, ce qui attend votre validation et ce qui reste une décision humaine/);
  assert.match(html, /l’automatisation s’arrête et présente le cas/);
});

test('à propos conserve les liens, les preuves et le CTA canonique', () => {
  for (const href of ['/methode', '/blog', '/glossaire', '/automatisation/saisie-comptable', '/automatisation/rapprochement-bancaire', '/automatisation/paie', '/automatisation/entrees-sorties-salaries']) {
    assert.ok(nodes.some((n) => n.tagName === 'a' && attr(n, 'href') === href), href);
  }
  const mainHtml = html.split('<main')[1].split('</main>')[0];
  const primary = [...mainHtml.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>/g)].filter(([link]) => text(parse(link)).trim() === 'Confier une première tâche');
  assert.equal(primary.length, 2);
  assert.ok(primary.every(([, href]) => href === '/contact'));
  assert.ok(nodes.some((n) => n.tagName === 'link' && attr(n, 'rel') === 'canonical' && attr(n, 'href') === 'https://memlia.fr/a-propos'));
  assert.deepEqual(nodes.filter((n) => attr(n, 'data-proof')).map((n) => attr(n, 'data-proof')), ['v2/17-hero-apropos', 'v2/11-regle-mots', 'v2/10-une-personne']);
  const graph = JSON.parse(text(nodes.find((n) => n.tagName === 'script' && attr(n, 'type') === 'application/ld+json')))['@graph'];
  const person = graph.find((n) => n['@type'] === 'Person');
  assert.equal(person.name, 'Kevin Kitanga');
  assert.equal(person['@id'], 'https://memlia.fr/a-propos#kevin-kitanga');
  assert.equal(graph.find((n) => n['@type'] === 'AboutPage').mainEntity['@id'], person['@id']);
});
