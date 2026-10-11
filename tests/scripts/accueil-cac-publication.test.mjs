import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CONTENU_CAC, SEO_CAC } from '../../src/data/accueil/cac.ts';
const read = path => readFileSync(path, 'utf8');

test('la profession CAC dispose de sa copie sans repli EC', () => {
  assert.match(read('src/data/accueil/contenu.ts'), /if \(profession === 'cac'\) return CONTENU_CAC/);
});
test('la route CAC compose les onze sections et ses compléments validés', () => {
  const page = read('src/pages/commissaires-aux-comptes.astro');
  for (const section of ['Hero', 'Orientation', 'Quotidien', 'Promesse', 'Usages', 'Methode', 'Integration', 'Preuves', 'Garanties', 'Faq', 'AppelFinal']) assert.match(page, new RegExp(`<${section}\\b`));
  for (const name of ['CouvertureCac', 'FrontiereCac', 'FicheOutilCac', 'SourcesCac']) assert.match(page, new RegExp(`<${name}\\b`));
  assert.match(page, /contenuDe\('cac'\)/);
  assert.match(page, /audienceType: 'Cabinets de commissariat aux comptes'/);
  assert.match(page, /questions\.map/);
});
test('la variante poster est explicite et ne rend pas de lecteur vide', () => {
  const hero = read('src/components/sections/Hero.astro');
  assert.match(hero, /contenu\.video\s*\?/);
  assert.match(hero, /<img[^>]*src=\{contenu\.poster\}/);
});
test('la publication possède son intention et ses liens entrants', () => {
  const intent = JSON.parse(read('config/page-intent-contract.json')).pages[SEO_CAC.chemin];
  assert.equal(intent.query, SEO_CAC.requete);
  assert.match(read('src/components/Footer.astro'), /LIEN_CAC/);
  assert.match(read('src/pages/automatisation-cabinet-comptable.astro'), /href="\/commissaires-aux-comptes"/);
  assert.ok(read('public/llms.txt').includes(`https://memlia.fr${SEO_CAC.chemin}`));
});
