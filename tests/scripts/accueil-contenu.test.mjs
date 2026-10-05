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

test('le contenu EC compose les sources FAQ, méthode et garanties existantes', () => {
  const source = readFileSync('src/data/accueil/ec.ts', 'utf8');
  for (const name of ['FAQ', 'METHODE', 'GARANTIES']) assert.match(source, new RegExp(name));
});


