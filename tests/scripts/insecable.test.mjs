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

test('garde une inversion du sujet d’un seul tenant', () => {
  const titre = 'Quelle tâche vos collaborateurs refont-ils encore à la main ?';
  const segments = segmentsInsecables(titre);
  assert.equal(recoller(segments), titre);
  assert.deepEqual(segments.filter((s) => s.insecable).map((s) => s.texte), ['refont-ils']);
});

test('traite plusieurs traits d’union et les apostrophes typographiques', () => {
  const titre = 'Que se passe-t-il pour l’expert-comptable ?';
  const segments = segmentsInsecables(titre);
  assert.equal(recoller(segments), titre);
  assert.deepEqual(segments.filter((s) => s.insecable).map((s) => s.texte), ['passe-t-il', 'l’expert-comptable']);
});

test('laisse intact un titre sans mot composé, et un tiret isolé', () => {
  for (const titre of ['Par où commencer', 'Avant – après', '']) {
    const segments = segmentsInsecables(titre);
    assert.equal(recoller(segments), titre);
    assert.equal(segments.some((s) => s.insecable), false, titre);
  }
});
