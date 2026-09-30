import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PAGES_NOINDEX } from '../../src/data/site.mjs';

const slug = '/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier';

test('l’article FE n’est plus intercepté par une fonction de maintenance ni exclu de l’index', () => {
  const fonction = resolve('functions/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier.js');
  assert.equal(existsSync(fonction), false);
  assert.equal(PAGES_NOINDEX.includes(slug), false);
});

test('la règle de conservation distingue la transition fiscale des pièces comptables', () => {
  const dossier = resolve('editorial/recettes/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier');
  const corps = readFileSync(resolve(dossier, 'corps.md'), 'utf8');
  const recette = JSON.parse(readFileSync(resolve(dossier, 'recette.json'), 'utf8'));
  const paragraphe = corps.split('\n').find(ligne => ligne.startsWith('La pièce, elle, se conserve.'));
  assert.match(paragraphe, /pièces justificatives comptables.*dix ans/);
  assert.match(paragraphe, /L\. 102 B.*six ans.*dix ans/);
  assert.match(paragraphe, /expire après le 1er janvier 2027/);
  assert.match(paragraphe, /au 1er janvier 2027 n’entre pas.*au 2 janvier 2027 y entre/);
  assert.match(paragraphe, /aucune purge automatique/);
  assert.match(paragraphe, /loi n° 2026-534/);
  assert.ok(recette.sources.some(source => source.url === 'https://entreprendre.service-public.gouv.fr/actualites/A18906'));
  assert.ok(recette.claims.some(claim => claim.sourceId === 'sp-reforme-conservation' && corps.includes(claim.unite)));
});
