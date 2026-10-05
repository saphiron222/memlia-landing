import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, rmSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { createCompleteDossier } from './blog-fixture.mjs';
import { validateDossier } from '../../scripts/lib/blog-pipeline.mjs';
import { recipeSubstanceSha256, recipeReviewMatches } from '../../scripts/lib/blog-review-binding.mjs';
const hash = (value) => createHash('sha256').update(value).digest('hex');

test('les dates techniques, liens HTTPS et empreintes ne changent pas le fond de la recette', () => {
  const before = JSON.stringify({ title: 'Titre relu', source: { url: 'https://example.org/source', checkedAt: '2026-10-04', sha256: 'ancienne', excerpt: 'Texte exact relu' } });
  const after = JSON.stringify({ title: 'Titre relu', source: { url: 'https://example.org/source-finale', checkedAt: '2026-10-05', sha256: 'nouvelle', excerpt: 'Texte exact relu' } });
  assert.equal(recipeSubstanceSha256(before), recipeSubstanceSha256(after));
  assert.equal(recipeReviewMatches(hash(before), after, undefined, recipeSubstanceSha256(before)), true);
  assert.notEqual(recipeSubstanceSha256(before), recipeSubstanceSha256(after.replace('Texte exact relu', 'Affirmation divergente')));
});

test('un corps court ne déclenche aucun refus numérique de longueur', async () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-short-'));
  try {
    const fixture = await createCompleteDossier(root, { body: '## Réponse directe\n\nLa personne valide la proposition préparée sur le jeu fictif.' });
    const result = await validateDossier({ root, slug: fixture.slug });
    assert.ok(!result.errors.some((error) => /manifestement mince|mots utiles|paragraphes substantiels/.test(error)), result.errors.join('\n'));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('une date de recette seule conserve le PASS de la revue sans modifier son avis', async () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-constitution-'));
  try {
    const fixture = await createCompleteDossier(root);
    const path = join(root, 'editorial/recettes', fixture.slug, 'recette.json');
    const bytes = readFileSync(path);
    const recipe = JSON.parse(bytes);
    const reviewPath = join(root, 'editorial/recettes', fixture.slug, 'revues.json');
    const originalReview = readFileSync(reviewPath);
    mkdirSync(join(root, 'editorial'), { recursive: true });
    writeFileSync(join(root, 'editorial/review-substance-baseline.json'), JSON.stringify({ version: 1, recipes: {
      [hash(bytes)]: recipeSubstanceSha256(bytes),
    } }));
    writeFileSync(path, JSON.stringify({ ...recipe, date: '2026-09-29' }));
    const renderedBlogHtml = `<li data-article="${fixture.slug}"><a href="/blog/${fixture.slug}">Article</a></li>`;
    const result = await validateDossier({ root, slug: fixture.slug, renderedBlogHtml });
    assert.equal(result.pass, true, result.errors.join('\n'));
    assert.deepEqual(readFileSync(reviewPath), originalReview);
    writeFileSync(path, JSON.stringify({ ...recipe, title: 'Autre fond non relu' }));
    const changed = await validateDossier({ root, slug: fixture.slug, renderedBlogHtml });
    assert.equal(changed.pass, false);
    assert.ok(changed.errors.some((error) => /recette.*divergente/.test(error)));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('un score SEO faible sans P0 est un conseil, pas un refus de revue', async () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-score-'));
  try {
    const fixture = await createCompleteDossier(root);
    const path = join(fixture.dossier, 'preuves/review.json');
    const proof = JSON.parse(readFileSync(path));
    for (const criterion of proof.criteria) { criterion.result = 'FAIL'; criterion.earned = 0; }
    writeFileSync(path, JSON.stringify(proof));
    const result = await validateDossier({ root, slug: fixture.slug, renderedBlogHtml: `<li data-article="${fixture.slug}"><a href="/blog/${fixture.slug}">Article</a></li>` });
    assert.equal(result.pass, true, result.errors.join('\n'));
  } finally { rmSync(root, { recursive: true, force: true }); }
});
