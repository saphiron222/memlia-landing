import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { reviewBindingErrors, reviewSha256, renderedBodySha256 } from '../../scripts/lib/blog-review-binding.mjs';

const slug = 'automatiser-un-cabinet-comptable-la-carte-des-taches';
const target = '/blog/rapprochement-bancaire-automatise-les-ecarts-a-remonter';
const dir = new URL(`../../editorial/recettes/${slug}/`, import.meta.url);
const body = readFileSync(new URL('corps.md', dir), 'utf8').trim();
const recipe = JSON.parse(readFileSync(new URL('recette.json', dir)));
const review = JSON.parse(readFileSync(new URL('revues.json', dir)));
const link = `[rapprochement bancaire](${target})`;
const { body: unlinkedBody, recipe: unlinkedRecipe } = pillarBaseline(body, recipe);
const linked = unlinkedBody.replace('et le rapprochement bancaire (voir', `et le ${link} (voir`);
const linkedRecipe = structuredClone(unlinkedRecipe);
linkedRecipe.links.outgoing.push(target);

function pillarBaseline(currentBody, currentRecipe) {
  // Undo only the declared banking addition, never other links or reviewed content.
  const baselineRecipe = structuredClone(currentRecipe);
  baselineRecipe.links.outgoing = baselineRecipe.links.outgoing.filter(url => url !== target);
  return { body: currentBody.replace(link, 'rapprochement bancaire'), recipe: baselineRecipe };
}

test('historical SEO maillage report does not become a review projection', () => {
  const root = new URL('../../', import.meta.url).pathname;
  const legacySlug = 'ia-comptabilite-confidentialite-donnees';
  const folder = join(root, 'editorial/recettes', legacySlug);
  const opinionBytes = readFileSync(join(folder, 'revues.json'), 'utf8');
  const reportBytes = readFileSync(join(folder, 'maillage.json'), 'utf8');
  assert.equal(JSON.parse(reportBytes).slug, legacySlug);
  assert.deepEqual(reviewBindingErrors(
    JSON.parse(opinionBytes), legacySlug,
    readFileSync(join(folder, 'corps.md'), 'utf8').trim(),
    readFileSync(join(folder, 'recette.json'), 'utf8'), undefined, root,
  ), []);
  assert.equal(readFileSync(join(folder, 'revues.json'), 'utf8'), opinionBytes);
  assert.equal(readFileSync(join(folder, 'maillage.json'), 'utf8'), reportBytes);
});

for (const [state, currentBody, currentRecipe] of [
  ['without backlink', unlinkedBody, unlinkedRecipe],
  ['already linked', linked, linkedRecipe],
]) test(`real pillar ${state} preserves the independent opinion and bounds recipe and render changes`, () => {
  const inputBytes = JSON.stringify(currentRecipe);
  const baseline = pillarBaseline(currentBody, currentRecipe);
  assert.equal(baseline.body, unlinkedBody);
  assert.deepEqual(baseline.recipe, unlinkedRecipe);
  assert.notEqual(baseline.recipe, currentRecipe, 'fixture must not mutate the current recipe');
  assert.equal(JSON.stringify(currentRecipe), inputBytes);
  const root = mkdtempSync(join(tmpdir(), 'blog-links-'));
  try {
    const folder = join(root, 'editorial/recettes', slug);
    mkdirSync(folder, { recursive: true });
    mkdirSync(join(root, 'src/content/blog'), { recursive: true });
    writeFileSync(join(root, 'src/content/blog', `${target.split('/').pop()}.md`), '# Candidat bancaire\n');
    const projection = { version: 1, reviewSha256: reviewSha256(JSON.stringify(review)), additions: [{ text: 'rapprochement bancaire', url: target }] };
    const save = () => writeFileSync(join(folder, 'review-link-projection.json'), JSON.stringify(projection));
    save();
    const next = structuredClone(baseline.recipe);
    next.links.outgoing.push(target);
    const check = (b = linked, r = next, opinion = review, html) => reviewBindingErrors(opinion, slug, b, JSON.stringify(r), html, root);
    assert.deepEqual(check(), []);
    const duplicate = structuredClone(next);
    duplicate.links.outgoing.push(target);
    assert.ok(check(linked, duplicate).length, 'duplicate outgoing remains refused');
    projection.version = 2;
    save();
    assert.ok(check().some(error => error.includes('projection ou avis divergent')));
    projection.version = 1;
    save();
    assert.ok(check(linked.replace('validation', 'suppression')).length);
    const changed = structuredClone(next);
    changed.sources[0].title += ' modifié';
    assert.ok(check(linked, changed).length);
    const figure = structuredClone(next);
    figure.inlineProofs[0].alt += ' modifié';
    assert.ok(check(linked, figure).length);
    assert.ok(check(linked, baseline.recipe).length, 'outgoing declaration required');
    assert.ok(check(linked, next, { ...review, editorial: { ...review.editorial, reviewer: 'autre' } }).length);
    rmSync(join(root, 'src/content/blog', `${target.split('/').pop()}.md`));
    assert.ok(check().length, 'absent target refused');
    writeFileSync(join(root, 'src/content/blog', `${target.split('/').pop()}.md`), '# Candidat bancaire\n');
    const page = (text) => `<div class="article-corps">${text}</div>`;
    const htmlReview = { ...review, subject: { ...review.subject, renderedSha256: renderedBodySha256(page('et le rapprochement bancaire (voir')) } };
    projection.reviewSha256 = reviewSha256(JSON.stringify(htmlReview));
    save();
    assert.deepEqual(check(linked, next, htmlReview, page(`et le <a href="${target}">rapprochement bancaire</a> (voir`)), []);
    assert.ok(check(linked, next, htmlReview, page(`et le <a href="${target}" title="promesse">rapprochement bancaire</a> (voir`)).length);
    assert.ok(check(linked, next, htmlReview, page(`et le <a href="${target}">rapprochement bancaire modifié</a> (voir`)).length);
    assert.ok(check(linked, next, htmlReview, page(`et le <a href="${target}">rapprochement bancaire</a> (voir<img src="figure.png">`)).length);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
