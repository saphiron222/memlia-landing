import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const checks = [
  ['src/pages/automatisation-cabinet-comptable.astro', 'cabinet-comptable-surcharge-de-travail-ou-passe-le-temps', 'repérer où passe le temps du cabinet'],
  ['src/pages/automatisation-cabinet-comptable.astro', 'intelligence-artificielle-metier-comptable-ce-qu-elle-prepare-ce-qui-reste-humain', 'ce que l’IA prépare et ce qui reste humain'],
  ['src/pages/integrations/index.astro', 'automatiser-avec-ia-sans-changer-logiciel', 'écrire le passage entre les outils'],
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
test('les cartes affichent le résultat depuis les données canoniques', () => {
  const hub = read('src/pages/outils-comptables-gratuits.astro');
  assert.ok(hub.includes('{outil.libelleAction}'));
  assert.ok(!hub.includes('>Utiliser sans compte'));
  const tools = read('src/data/outils.ts');
  const entries = tools.split(/\n  \{\n/).filter((entry) => entry.includes("statut: 'disponible'"));
  const labels = entries.map((entry) => /libelleAction: '([^']+)'/.exec(entry)?.[1]);
  assert.ok(labels.every(Boolean), 'chaque outil disponible nomme son geste');
  assert.equal(new Set(labels).size, labels.length, 'ancres propres aux destinations');
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
