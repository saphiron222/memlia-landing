import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { couleursDuBrief, verifierBriefPalette, classerPixel, verifierParts, SEUILS_PALETTE } from '../../scripts/lib/palette.mjs';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

test('couleursDuBrief lit chaque hex avec le rôle que son segment lui donne', () => {
  const brief = 'Vert Memlia #27b657 et vert profond #1c8a41 dominants, fond crème papier #fffefb, touches de graphite #231f20.';
  assert.deepEqual(couleursDuBrief(brief), [
    { hex: '#27b657', role: 'dominante' },
    { hex: '#1c8a41', role: 'dominante' },
    { hex: '#fffefb', role: 'presente' },
    { hex: '#231f20', role: 'touche' },
  ]);
  assert.deepEqual(couleursDuBrief(''), []);
  assert.deepEqual(couleursDuBrief(null), []);
  assert.deepEqual(couleursDuBrief('#ABCDEF dominant').map((c) => c.hex), ['#abcdef']);
});

test('verifierBriefPalette refuse une couleur nommée sans son hex, et un brief qui en épingle moins de trois', () => {
  const flou = 'Vert Memlia #27b657 et vert profond #1c8a41 dominants, crème, graphite.';
  const erreurs = verifierBriefPalette(flou);
  assert.ok(erreurs.some((e) => /crème/.test(e) && /hex/.test(e)), erreurs.join('\n'));
  assert.ok(erreurs.some((e) => /graphite/.test(e)), erreurs.join('\n'));
  assert.deepEqual(verifierBriefPalette('Vert #27b657 dominant, crème #fffefb, graphite #231f20.'), []);
  assert.ok(verifierBriefPalette('Vert #27b657 dominant, crème #fffefb.').some((e) => /trois/.test(e)));
  assert.ok(verifierBriefPalette('').some((e) => /aucune couleur/.test(e)));
});

test('classerPixel rend la cible la plus proche dans la tolérance, et null au-delà', () => {
  const cibles = [{ hex: '#27b657', rgb: [39, 182, 87] }, { hex: '#231f20', rgb: [35, 31, 32] }];
  assert.equal(classerPixel(40, 183, 88, cibles, 60), '#27b657');
  assert.equal(classerPixel(36, 32, 33, cibles, 60), '#231f20');
  assert.equal(classerPixel(255, 0, 0, cibles, 60), null);
  assert.equal(classerPixel(39, 182, 87, [], 60), null);
});

test('verifierParts refuse une couleur épinglée sous le plancher de son rôle, et nomme la mesure', () => {
  const couleurs = [{ hex: '#27b657', role: 'dominante' }, { hex: '#231f20', role: 'touche' }];
  assert.deepEqual(verifierParts(couleurs, { '#27b657': 0.1689, '#231f20': 0.1018 }), []);
  const rouges = verifierParts(couleurs, { '#27b657': 0.1689, '#231f20': 0.00032 });
  assert.equal(rouges.length, 1);
  assert.match(rouges[0], /#231f20/);
  assert.match(rouges[0], /0,032 %/);
  assert.match(rouges[0], /0,5 %/);
  const absente = verifierParts(couleurs, { '#27b657': 0.004 });
  assert.equal(absente.length, 2, 'une dominante sous son plancher et une couleur non mesurée sont deux rouges');
  // Planchers calibrés le 19/09/2026 sur les six couvertures livrées, pas choisis a priori.
  assert.equal(SEUILS_PALETTE.dominante, 0.02);
  assert.equal(SEUILS_PALETTE.touche, 0.005);
});

test('mesurerPalette compte les parts d’un master réel et discrimine les deux couvertures connues', async () => {
  const { mesurerPalette } = await import('../../scripts/mesurer-palette.mjs');
  const conforme = await mesurerPalette(join(RACINE, 'editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/image/master.png'), ['#27b657', '#1c8a41', '#fffefb', '#231f20']);
  assert.ok(conforme.parts['#231f20'] > 0.005, `graphite mesuré à ${conforme.parts['#231f20']}`);
  assert.ok(conforme.parts['#27b657'] + conforme.parts['#1c8a41'] > 0.05, 'le vert est présent');
  // Témoin de la dette écrite le 18/09/2026 : cette couverture n'a jamais suivi son brief.
  // Le jour où elle est régénérée, ce test change avec elle : c'est son objet.
  const dette = await mesurerPalette(join(RACINE, 'editorial/articles/comprendre-les-comptes-rendus-metier-dsn/preuves/image/master.png'), ['#27b657', '#1c8a41', '#fffefb', '#231f20']);
  assert.ok(dette.parts['#231f20'] < 0.005, `la dette connue du 18/09 doit se voir : graphite ${dette.parts['#231f20']}`);
  assert.equal(Object.keys(conforme.parts).length, 4);
  assert.ok(conforme.pixels > 10000);
});
