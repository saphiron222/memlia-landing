// Système de page du 07/10/2026, § 2 : dans un titre, un mot composé ne se coupe pas à son trait
// d'union. Le découpage ne change aucun caractère du titre.
import test from 'node:test';
import assert from 'node:assert/strict';
import { segmentsInsecables } from '../../src/lib/insecable.ts';

const recoller = (segments) => segments.map((s) => s.texte).join('');

test('isole le mot composé du titre du héros sans changer le texte', () => {
  const titre = 'Votre cabinet tourne sur un savoir-faire que personne n’a écrit.';
  const segments = segmentsInsecables(titre);
  assert.equal(recoller(segments), titre);
  assert.deepEqual(segments.filter((s) => s.insecable).map((s) => s.texte), ['savoir-faire']);
});

test('garde une inversion du sujet d’un seul tenant, et le point d’interrogation avec son mot', () => {
  const titre = 'Quelle tâche vos collaborateurs refont-ils encore à la main ?';
  const segments = segmentsInsecables(titre);
  assert.equal(recoller(segments), titre);
  assert.deepEqual(segments.filter((s) => s.insecable).map((s) => s.texte), ['refont-ils', 'main ?']);
});

test('traite plusieurs traits d’union et les apostrophes typographiques', () => {
  const titre = 'Que se passe-t-il pour l’expert-comptable ?';
  const segments = segmentsInsecables(titre);
  assert.equal(recoller(segments), titre);
  assert.deepEqual(segments.filter((s) => s.insecable).map((s) => s.texte), ['passe-t-il', 'l’expert-comptable ?']);
});

test('laisse intact un titre sans mot composé, et un tiret isolé', () => {
  for (const titre of ['Par où commencer', 'Avant – après', '']) {
    const segments = segmentsInsecables(titre);
    assert.equal(recoller(segments), titre);
    assert.equal(segments.some((s) => s.insecable), false, titre);
  }
});

test('une ponctuation haute ne commence jamais une ligne : elle reste avec le mot qui la précède', () => {
  const titre = 'Rapprochement bancaire en cabinet : chaque écart reste à décider';
  const segments = segmentsInsecables(titre);
  assert.equal(recoller(segments), titre);
  assert.deepEqual(segments.filter((s) => s.insecable).map((s) => s.texte), ['cabinet :']);
});

test('un guillemet ouvrant reste avec son mot, un guillemet fermant avec le sien', () => {
  const titre = 'Le bouton « Activer le son » reste lisible ?';
  const segments = segmentsInsecables(titre);
  assert.equal(recoller(segments), titre);
  assert.deepEqual(segments.filter((s) => s.insecable).map((s) => s.texte), ['« Activer', 'son »', 'lisible ?']);
});
