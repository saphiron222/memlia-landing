import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { rmSync } from 'node:fs';
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
  assert.equal(SEUILS_PALETTE.dominante, 0.1);
  assert.equal(SEUILS_PALETTE.touche, 0.005);
});

test('mesurerPalette mesure un master réel, et rend zéro pour une couleur absente', async () => {
  const { mesurerPalette } = await import('../../scripts/mesurer-palette.mjs');
  const sharp = (await import('sharp')).default;
  // Le corpus réel : depuis le 19/09/2026 les six couvertures portent les couleurs de leur brief.
  // Ce test mesurait auparavant une dette (une couverture sans graphite) ; la dette est payée,
  // donc la discrimination se prouve maintenant sur une image construite, qui ne peut pas guérir.
  const master = join(RACINE, 'editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/image/master.png');
  const reelle = await mesurerPalette(master, ['#27b657', '#1c8a41', '#fcfbf7', '#231f20']);
  assert.ok(reelle.parts['#fcfbf7'] > 0.1, `le fond crème domine : ${reelle.parts['#fcfbf7']}`);
  assert.ok(reelle.parts['#231f20'] > 0.005, `le graphite est présent : ${reelle.parts['#231f20']}`);
  assert.equal(Object.keys(reelle.parts).length, 4);
  assert.ok(reelle.pixels > 10000);

  const unie = join(tmpdir(), `palette-unie-${process.pid}.png`);
  await sharp({ create: { width: 200, height: 120, channels: 3, background: '#fcfbf7' } }).png().toFile(unie);
  const absente = await mesurerPalette(unie, ['#fcfbf7', '#231f20']);
  assert.ok(absente.parts['#fcfbf7'] > 0.99, 'la couleur unie est comptée');
  assert.equal(absente.parts['#231f20'], 0, 'une couleur absente se mesure à zéro, pas à « peu »');
  rmSync(unie, { force: true });
});

test('verifierBriefPalette refuse deux couleurs plus proches que la tolérance : la mesure ne peut pas les partager', () => {
  // #fcfbf7 et #fffefb sont distants d'environ 6 sur 255 : un pixel proche de l'une est proche de
  // l'autre, et le classement au plus proche partage arbitrairement. Mesuré le 19/09/2026 sur deux
  // couvertures livrées, dont l'une échouait son plancher pour cette seule raison.
  const erreurs = verifierBriefPalette('Vert #27b657 dominant, crème #fcfbf7, papier #fffefb, graphite #231f20.');
  assert.equal(erreurs.length, 1, erreurs.join('\n'));
  assert.match(erreurs[0], /#fcfbf7/);
  assert.match(erreurs[0], /#fffefb/);
  assert.match(erreurs[0], /tolérance/);
  assert.match(erreurs[0], /45/);
  assert.deepEqual(verifierBriefPalette('Vert #27b657 dominant, crème #fcfbf7, graphite #231f20.'), []);
});
