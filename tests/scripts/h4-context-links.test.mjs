import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse } from 'parse5';
import { OUTILS_VITRINE } from '../../src/data/outils-vitrine.ts';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const checks = [
  ['src/pages/garanties.astro', 'ia-comptabilite-confidentialite-donnees', 'préparer les données avant de les confier à une IA'],
  ['src/pages/methode.astro', 'logiciel-ia-comptabilite', 'comparer le parcours complet d’un outil IA'],
  ['src/pages/methode.astro', 'tests-verts-et-regle-des-trois-passes', 'recetter le parcours en trois passes'],
  ['src/pages/outils-comptables-gratuits/generateur-prompt-expert-comptable.astro', 'utiliser-chatgpt-cabinet-comptable', 'choisir un premier usage utile de ChatGPT'],
  ['src/pages/outils-comptables-gratuits/verificateur-prompt-ia.astro', 'verifier-reponse-ia-comptabilite', 'vérifier ensuite la réponse produite'],
];
for (const [file, slug, anchor] of checks) {
  test(`${file} donne un lien contextuel vers ${slug}`, () => {
    assert.ok(read(file).includes(`<a href="/blog/${slug}">${anchor}</a>`));
    assert.ok(read(`src/content/blog/${slug}.md`).includes('brouillon: false'), 'destination publique');
  });
}
const visit = (node, fn) => { fn(node); for (const child of node.childNodes ?? []) visit(child, fn); };
const attr = (node, name) => node.attrs?.find((a) => a.name === name)?.value;
const text = (node) => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
test('les catalogues relient la méthode et les compatibilités sans rétablir les guides retirés', () => {
  for (const route of ['automatisation-cabinet-comptable', 'integrations']) {
    const doc = parse(read(`dist/${route}.html`));
    const links = []; visit(doc, (node) => { if (node.tagName === 'a') links.push(attr(node, 'href')); });
    assert.ok(links.includes('/methode'), `${route} explique la prise en charge`);
    if (route === 'automatisation-cabinet-comptable') assert.ok(links.includes('/integrations'));
    else for (const href of ['/automatisation-cabinet-comptable', '/agents-ia']) assert.ok(links.includes(href));
    assert.ok(!links.some((href) => href?.startsWith('/integrations/')), 'les logiciels sont dans le catalogue commun');
  }
});
test('chaque carte outil nomme son besoin et son résultat avant l’action courte', () => {
  const doc = parse(read('dist/outils-comptables-gratuits.html'));
  const cards = []; visit(doc, (node) => { if (node.tagName === 'a' && attr(node, 'class')?.split(' ').includes('outil-carte')) cards.push(node); });
  assert.equal(cards.length, OUTILS_VITRINE.length);
  for (const outil of OUTILS_VITRINE) {
    const card = cards.find((node) => attr(node, 'href') === `/outils-comptables-gratuits/${outil.slug}`);
    assert.ok(card, outil.slug);
    const parts = []; visit(card, (node) => { if (['h3', 'p'].includes(node.tagName)) parts.push(text(node)); });
    assert.deepEqual(parts, [outil.nom, outil.texte]);
    assert.match(text(card), /Utiliser l’outil/);
  }
  assert.equal(new Set(cards.map((node) => attr(node, 'href'))).size, cards.length, 'une carte par intention, sans doublon de destination');
});
test('la recette du pilier relie les quatre satellites et distingue le glossaire', () => {
  const body = read('editorial/recettes/automatiser-un-cabinet-comptable-la-carte-des-taches/corps.md');
  for (const [slug, anchor] of [
    ['cabinet-comptable-surcharge-de-travail-ou-passe-le-temps', 'repérer où passe le temps du cabinet'],
    ['intelligence-artificielle-metier-comptable-ce-qu-elle-prepare-ce-qui-reste-humain', 'distinguer préparation IA et compétences humaines'],
    ['utiliser-chatgpt-cabinet-comptable', 'choisir un premier usage de ChatGPT au cabinet'],
    ['verifier-reponse-ia-comptabilite', 'vérifier une réponse IA avant de décider'],
  ]) assert.ok(body.includes(`[${anchor}](/blog/${slug})`));
  assert.ok(body.includes('[définition du rapprochement bancaire](/glossaire#rapprochement-bancaire)'));
});
