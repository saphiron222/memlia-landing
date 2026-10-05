import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { reviewSha256, renderedBodySha256 } from '../../../scripts/lib/blog-review-binding.mjs';
const dir = new URL('./', import.meta.url);
const recipeBytes = readFileSync(new URL('recette.json', dir));
const recipe = JSON.parse(recipeBytes);
const originalRecipe = Buffer.from(recipeBytes.toString().replace('"date": "2026-10-05"', '"date": "2026-10-04"'));
const reviewPath = new URL('revues.json', dir);
const review = JSON.parse(readFileSync(reviewPath));
const body = readFileSync(new URL('corps.md', dir), 'utf8').trim();
const html = readFileSync('.qa/render-verifier-reponse-ia-comptabilite/blog/verifier-reponse-ia-comptabilite.html', 'utf8');
if (recipe.date !== '2026-10-05' || review.subject.recipeSha256 !== reviewSha256(originalRecipe)
    || review.subject.bodySha256 !== reviewSha256(body) || review.subject.renderedSha256 !== renderedBodySha256(html)) {
  throw new Error('Report refusé : seule la date peut différer ; corps et rendu doivent rester identiques.');
}
const archive = new URL('revues-originales-qa.json', dir);
if (existsSync(archive)) throw new Error('Report déjà effectué.');
writeFileSync(archive, readFileSync(reviewPath));
review.dateProjection = {
  authority: 'Reprise explicitement demandée par QA t_2352a08b et constitution : une date seule ne nécessite pas une nouvelle revue.',
  originalReview: 'revues-originales-qa.json', originalSubject: { ...review.subject },
  operator: 'marketing:t_1b587b0b', from: '2026-10-04', to: '2026-10-05',
  change: 'date de publication uniquement ; aucun jugement ou constat de QA changé',
  bodyAndRenderedContentUnchanged: true,
};
review.subject.recipeSha256 = reviewSha256(recipeBytes);
writeFileSync(reviewPath, JSON.stringify(review, null, 2) + '\n');
console.log(JSON.stringify(review.dateProjection, null, 2));
