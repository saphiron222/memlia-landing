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
  for (const name of ['CouvertureCac', 'FrontiereCac']) assert.match(page, new RegExp(`<${name}\\b`));
  // Décision de Kevin du 13/10/2026 : plus d'encadré « Une fiche outil pour votre dossier » ; la NEP 315
  // révisée se cite dans la réponse FAQ « fiche ».
  assert.doesNotMatch(page, /FicheOutilCac/);
  assert.match(page, /fiche: \[\{ texte: 'NEP 315 révisée', href: nep315 \}, \{ texte: 'NEP 330 révisée', href: nep330 \}\]/);
  assert.doesNotMatch(page, /<SourcesCac\b/);
  for (const authority of ['h2a-france.org', 'doc.cncc.fr']) assert.ok(page.includes(authority));
  assert.match(page, /<Faq[^>]*references=/);
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
  // Le hub robots a remplacé l’ancienne page service ; l’entrée CAC reste dans le corps de l’accueil.
  assert.match(read('src/pages/index.astro'), /href=\{LIEN_CAC\.href\}[\s\S]*data-accueil-cac/);
  assert.ok(read('public/llms.txt').includes(`https://memlia.fr${SEO_CAC.chemin}`));
});
