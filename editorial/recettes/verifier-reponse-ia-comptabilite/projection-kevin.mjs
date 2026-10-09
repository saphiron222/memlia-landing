import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { reviewSha256, renderedBodySha256 } from '../../../scripts/lib/blog-review-binding.mjs';
const dir = new URL('./', import.meta.url);
const oldText = 'Les quatre décisions sont une convention de travail, pas des catégories réglementaires. Leur sens doit rester stable pour que la personne qui reprend le dossier comprenne la suite.';
const newText = "Les quatre décisions sont une convention de travail propre au cabinet. Gardez-leur le même sens d'un dossier à l'autre, pour que la personne qui reprend comprenne la suite.";
const review = JSON.parse(readFileSync(new URL('revues.json', dir)));
const body = readFileSync(new URL('corps.md', dir), 'utf8').trim();
const html = readFileSync('.qa/render-verifier-reponse-ia-comptabilite/blog/verifier-reponse-ia-comptabilite.html', 'utf8');
assert.equal(body.split(newText).length, 2);
assert.equal(reviewSha256(body.replace(newText, oldText)), review.subject.bodySha256);
assert.equal(reviewSha256(readFileSync(new URL('recette.json', dir))), review.subject.recipeSha256);
const renderedNewText = newText.replaceAll("'", '’');
assert.equal(html.split(renderedNewText).length, 2);
assert.equal(renderedBodySha256(html.replace(renderedNewText, oldText)), review.subject.renderedSha256);
const originalSubject = { ...review.subject };
review.subject.bodySha256 = reviewSha256(body);
review.subject.renderedSha256 = renderedBodySha256(html);
review.operatorProjection = {
  authority: 'Décision explicite de Kevin, commentaire du 05/10 sur t_1b587b0b : reformulation de convention sans nouvelle revue du fond.',
  operator: 'marketing:t_1b587b0b',
  originalSubject,
  oldText,
  newText,
  verified: 'Différence limitée exactement à cette phrase dans le corps et le rendu ; recette inchangée. Aucun jugement QA modifié ni nouvelle revue attribuée.'
};
writeFileSync(new URL('revues.json', dir), JSON.stringify(review, null, 2) + '\n');
console.log(JSON.stringify(review.operatorProjection, null, 2));
