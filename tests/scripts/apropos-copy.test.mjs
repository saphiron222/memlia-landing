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
  assert.match(text(byId('kevin-kitanga')), /démonstrations fictives/);
  assert.doesNotMatch(text(byId('kevin-kitanga')), /expert-comptable|commissaire aux comptes|Sauvaget/);
  const engagements = nodes.find((node) => node.tagName === 'section' && attr(node, 'aria-labelledby') === 'expert');
  assert.match(text(engagements), /Un cas hors règle est présenté à votre équipe/);
  assert.match(text(engagements), /Le jugement professionnel reste au cabinet/);
  assert.match(html, /catalogue donne un point de départ concret/);
  assert.match(html, /construisons sur mesure lorsque cette base ne couvre pas votre besoin/);
});

test('à propos conserve les parcours actuels, la scène et le CTA canonique', () => {
  // Catalogue validé le 15/10 : les anciens services par pôle mènent directement à leur tâche dans un agent.
  for (const href of ['/methode', '/blog', '/glossaire', '/agents-ia/comptabilite#tache-saisie-ocr-2', '/agents-ia/comptabilite#tache-banque-rapprochement-5', '/agents-ia/paie-social', '/agents-ia/paie-social#tache-entrees-sorties-salaries-5']) {
    assert.ok(nodes.some((n) => n.tagName === 'a' && attr(n, 'href') === href), href);
  }
  const mainHtml = html.split('<main')[1].split('</main>')[0];
  const primary = [...mainHtml.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>/g)].filter(([link]) => text(parse(link)).trim() === 'Confier une première tâche');
  assert.equal(primary.length, 2);
  assert.ok(primary.every(([, href]) => href === '/contact'));
  assert.ok(nodes.some((n) => n.tagName === 'link' && attr(n, 'rel') === 'canonical' && attr(n, 'href') === 'https://memlia.fr/a-propos'));
  assert.equal(nodes.filter((n) => attr(n, 'data-proof')).length, 0, 'les anciens écrans HTML ne reviennent pas');
  assert.equal(nodes.filter((n) => n.tagName === 'img' && attr(n, 'src')?.includes('/apropos-1200.webp')).length, 1, 'une scène figurines propre à la page');
  const graph = JSON.parse(text(nodes.find((n) => n.tagName === 'script' && attr(n, 'type') === 'application/ld+json')))['@graph'];
  const person = graph.find((n) => n['@type'] === 'Person');
  assert.equal(person.name, 'Kevin Kitanga');
  assert.equal(person['@id'], 'https://memlia.fr/a-propos#kevin-kitanga');
  assert.equal(graph.find((n) => n['@type'] === 'AboutPage').mainEntity['@id'], person['@id']);
});
