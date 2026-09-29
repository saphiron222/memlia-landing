import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '../..');
const slug = 'prompt-chatgpt-expert-comptable';
const recipe = JSON.parse(readFileSync(resolve(root, `editorial/recettes/${slug}/recette.json`), 'utf8'));
const article = readFileSync(resolve(root, `src/content/blog/${slug}.md`), 'utf8');
const stopProof = recipe.inlineProofs.find((proof) => proof.id === 'w39-prompt-arret');

test('la preuve d’arrêt décrit le champ manquant sans prétendre que le justificatif est absent', () => {
  assert.ok(stopProof, 'preuve w39-prompt-arret absente de la recette');
  assert.match(stopProof.alt, /champ « Pièce attendue » n’est pas renseigné/i);
  assert.doesNotMatch(stopProof.alt, /absence de la pièce attendue/i);
  assert.match(article, /alt="[^"]*champ « Pièce attendue » n’est pas renseigné[^"]*"/i);
});
