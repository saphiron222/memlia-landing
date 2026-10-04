import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '../..');
const slug = 'prompt-chatgpt-expert-comptable';
const recipe = JSON.parse(readFileSync(resolve(root, `editorial/recettes/${slug}/recette.json`), 'utf8'));
const article = readFileSync(resolve(root, `src/content/blog/${slug}.md`), 'utf8');
const stopProof = recipe.inlineProofs.find((proof) => proof.id === 'prompt-suivi-demandes');
const draftProof = recipe.inlineProofs.find((proof) => proof.id === 'prompt-assistant-brouillon');
const contract = JSON.parse(readFileSync(resolve(root, 'docs/design/blog-article-proofs/content-contract.json'), 'utf8'));
const journal = JSON.parse(readFileSync(resolve(root, `editorial/recettes/${slug}/journal-rejeu.json`), 'utf8'));
const centralText = (id) => contract.find((entry) => entry.id === id)?.centralText ?? '';
const words = (text) => text.trim().split(/\s+/).join(' ');

test('la preuve de suivi décrit le champ manquant sans prétendre que le justificatif est absent', () => {
  assert.ok(stopProof, 'preuve prompt-suivi-demandes absente de la recette');
  assert.match(stopProof.alt, /champ « Pièce attendue » non renseigné/i);
  assert.doesNotMatch(stopProof.alt, /absence de la pièce attendue/i);
  assert.match(article, /alt="[^"]*champ « Pièce attendue » non renseigné[^"]*"/i);
  // L’écran montre l’arrêt du rejeu local sur un contexte incomplet, pas une pièce déclarée absente.
  assert.match(centralText('prompt-suivi-demandes'), /Champ non renseigné Arrêt · contexte incomplet/);
});

test('le brouillon de l’écran d’assistant reprend mot pour mot la sortie nominale du rejeu', () => {
  assert.ok(draftProof, 'preuve prompt-assistant-brouillon absente de la recette');
  const nominal = journal.cas.find((cas) => cas.nom === 'nominal').sortie;
  const text = centralText('prompt-assistant-brouillon');
  assert.ok(text.includes(words(nominal.message)), 'message du brouillon différent du journal');
  assert.ok(text.includes(`Objet : ${words(nominal.objet)}`), 'objet du brouillon différent du journal');
  assert.match(text, /Brouillon · non envoyé/);
  assert.doesNotMatch(text, /ChatGPT|OpenAI/);
});
