import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const sections = ['Hero', 'Orientation', 'Quotidien', 'Promesse', 'Usages', 'Methode', 'Integration', 'Preuves', 'Garanties', 'Faq', 'AppelFinal'];

test('les onze sections de l’accueil acceptent leur contenu et gardent EC par défaut', () => {
  for (const section of sections) {
    const source = readFileSync(`src/components/sections/${section}.astro`, 'utf8');
    assert.match(source, /contenuDe\('ec'\)/, section);
    assert.match(source, /contenu\??: ContenuAccueil\[/, section);
    assert.match(source, /Astro\.props/, section);
  }
});

test('le contenu EC compose les sources FAQ et garanties, avec une méthode de déploiement du catalogue', () => {
  const source = readFileSync('src/data/accueil/ec.ts', 'utf8');
  for (const name of ['FAQ', 'GARANTIES', 'ROBOTS']) assert.match(source, new RegExp(name));
  for (const step of ['Choisir la tâche.', 'Adapter à vos outils.', 'Vérifier avec votre équipe.', 'Déployer et maintenir.']) assert.ok(source.includes(step),step);
  assert.match(source,/\$\{ROBOTS.length\}/);
});

// Plus aucun agrandissement d'image (demande de Kevin du 07/10/2026, #166) : la preuve suit le contenu, sans zoom.
test('le contenu EC conserve les compteurs dynamiques ; ses scènes remplacent les cadres commerciaux (recette A du 15/10)', () => {
  const source = readFileSync('src/data/accueil/ec.ts', 'utf8');
  assert.match(source, /famillesDeLaProfession\('ec'\)/);
  assert.match(source, /\$\{familles\.length\}/);
  assert.match(source, /\$\{nombrePoles\}/);
  for (const section of ['Quotidien', 'Promesse', 'Integration', 'Preuves', 'Garanties']) {
    const composant = readFileSync(`src/components/sections/${section}.astro`, 'utf8');
    assert.doesNotMatch(composant, /<Proof(?:Row|Media)\b/, section);
    assert.doesNotMatch(composant, /\benlarge\b/, section);
  }
  const methode = readFileSync('src/components/sections/Methode.astro', 'utf8');
  assert.doesNotMatch(methode, /<ProofMedia\b/);
  assert.match(methode, /editorial-etapes/);
  const quotidien=readFileSync('src/components/sections/Quotidien.astro','utf8');
  assert.match(quotidien, /<BlocEditorial scene=\{scene\}/);
  assert.doesNotMatch(methode, /\benlarge\b/);
});
