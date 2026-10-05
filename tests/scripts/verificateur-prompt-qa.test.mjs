import test from 'node:test';
import assert from 'node:assert/strict';
import { analysePrompt } from '../../src/lib/verificateur-prompt.mjs';

for (const text of [
 'Le responsable ne relit ni ne valide.',
 'Pas besoin de faire relire par le responsable.',
 'Le responsable relit mais ce contrôle est optionnel.',
 'Le responsable relit ou pas.',
]) test(`validation non acquise : ${text}`, () => {
 const item = analysePrompt(text, true).items[3];
 assert.equal(item.state, 'à examiner');
 assert.equal(item.excerpt, text);
});
for (const text of [
 'Le responsable relit avant utilisation.',
 'Faire relire par le responsable.',
 'Validation humaine obligatoire.',
]) test(`validation affirmative préservée : ${text}`, () => {
 const item = analysePrompt(text, true).items[3];
 assert.equal(item.state, 'détecté');
 assert.equal(item.excerpt, text);
});
