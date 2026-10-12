import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { reviewBindingErrors, reviewSha256, renderedBodySha256 } from '../../scripts/lib/blog-review-binding.mjs';

const slug = 'automatiser-un-cabinet-comptable-la-carte-des-taches';
const target = '/blog/rapprochement-bancaire-automatise-les-ecarts-a-remonter';
// Optional read-only replay against a real delivery worktree.
const fixtureRoot = process.env.BLOG_LINK_FIXTURE_ROOT || new URL('../../', import.meta.url).pathname;
const dir = pathToFileURL(`${join(fixtureRoot, 'editorial/recettes', slug)}/`);
const body = readFileSync(new URL('corps.md', dir), 'utf8').trim();
const recipe = JSON.parse(readFileSync(new URL('recette.json', dir)));
const review = JSON.parse(readFileSync(new URL('revues.json', dir)));
const link = `[rapprochement bancaire](${target})`;
const declarationPath = new URL('review-link-projection.json', dir);
const declaration = existsSync(declarationPath) ? JSON.parse(readFileSync(declarationPath)) : undefined;
const bankingDeclaration = { version: 1, reviewSha256: reviewSha256(JSON.stringify(review)), additions: [{ text: 'rapprochement bancaire', url: target }] };
const { body: unlinkedBody, recipe: unlinkedRecipe } = pillarBaseline(body, recipe, declaration);
const linked = unlinkedBody.replace('et le rapprochement bancaire (voir', `et le ${link} (voir`);
const linkedRecipe = structuredClone(unlinkedRecipe);
linkedRecipe.links.outgoing.push(target);

function pillarBaseline(currentBody, currentRecipe, projection) {
  // Independent fixture inverse: do not call the production projection or rebind a review.
  const baselineRecipe = structuredClone(currentRecipe);
  if (projection !== undefined) {
    assert.equal(projection.version, 1);
    assert.equal(projection.reviewSha256, reviewSha256(JSON.stringify(review)));
    assert.ok(Array.isArray(projection.additions) && projection.additions.length > 0);
    const seen = new Set();
    for (const addition of projection.additions) {
      assert.ok(addition && typeof addition === 'object');
      const { text, url } = addition;
      assert.ok(typeof text === 'string' && /^[\p{L}\p{N} -]+$/u.test(text));
      assert.ok(typeof url === 'string' && /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(url));
      assert.notEqual(url, `/blog/${slug}`);
      assert.ok(!seen.has(url), 'duplicate declared destination');
      seen.add(url);
      const envelope = `[${text}](${url})`;
      assert.equal(currentBody.split(envelope).length, 2, 'exactly one declared Markdown link');
      assert.equal(baselineRecipe.links?.outgoing?.filter(item => item === url).length, 1, 'exactly one declared outgoing');
      currentBody = currentBody.replace(envelope, text);
      baselineRecipe.links.outgoing = baselineRecipe.links.outgoing.filter(item => item !== url);
    }
  }
  return { body: currentBody, recipe: baselineRecipe };
}

test('fixture isolates zero, one and multiple declared additions without changing the opinion', () => {
  const fiscal = { text: 'échéances fiscales', url: '/blog/suivre-les-echeances-fiscales-d-un-portefeuille' };
  const banking = { text: 'rapprochement bancaire', url: target };
  const opinionBytes = JSON.stringify(review);
  for (const additions of [[], [banking], [fiscal], [banking, fiscal]]) {
    let currentBody = unlinkedBody;
    const currentRecipe = structuredClone(unlinkedRecipe);
    for (const { text, url } of additions) {
      currentBody = currentBody.replace(text, `[${text}](${url})`);
      currentRecipe.links.outgoing.push(url);
    }
    const declaration = additions.length ? { version: 1, reviewSha256: reviewSha256(opinionBytes), additions } : undefined;
    const baseline = pillarBaseline(currentBody, currentRecipe, declaration);
    assert.equal(baseline.body, unlinkedBody);
    assert.deepEqual(baseline.recipe, unlinkedRecipe);
    assert.equal(JSON.stringify(review), opinionBytes);
    const inputBytes = JSON.stringify(currentRecipe);
    const root = mkdtempSync(join(tmpdir(), 'blog-links-multiple-'));
    try {
      const folder = join(root, 'editorial/recettes', slug);
      mkdirSync(folder, { recursive: true });
      mkdirSync(join(root, 'src/content/blog'), { recursive: true });
      const projectionPath = join(folder, 'review-link-projection.json');
      const save = value => writeFileSync(projectionPath, JSON.stringify(value));
      for (const { url } of additions) writeFileSync(join(root, 'src/content/blog', `${url.slice(6)}.md`), '# Candidat\n');
      if (declaration) save(declaration);
      const check = (b = currentBody, r = currentRecipe, opinion = review, html) => reviewBindingErrors(opinion, slug, b, JSON.stringify(r), html, root);
      assert.deepEqual(check(), [], `production accepts ${additions.length} additions`);
      assert.ok(check(currentBody.replace('validation', 'suppression')).length);
      for (const field of ['sources', 'inlineProofs']) {
        const changed = structuredClone(currentRecipe);
        changed[field][0][field === 'sources' ? 'title' : 'alt'] += ' modifié';
        assert.ok(check(currentBody, changed).length);
      }
      if (declaration) assert.ok(check(currentBody, currentRecipe, { ...review, editorial: { ...review.editorial, reviewer: 'autre' } }).length, 'divergent opinion refused');
      for (const { text, url } of additions) {
        const missing = structuredClone(currentRecipe);
        missing.links.outgoing = missing.links.outgoing.filter(item => item !== url);
        assert.throws(() => pillarBaseline(currentBody, missing, declaration));
        assert.ok(check(currentBody, missing).length, 'missing outgoing refused');
        const duplicate = structuredClone(currentRecipe);
        duplicate.links.outgoing.push(url);
        assert.throws(() => pillarBaseline(currentBody, duplicate, declaration));
        assert.ok(check(currentBody, duplicate).length, 'duplicate outgoing refused');
        assert.throws(() => pillarBaseline(currentBody.replace(`[${text}](${url})`, text), currentRecipe, declaration));
        const targetPath = join(root, 'src/content/blog', `${url.slice(6)}.md`);
        rmSync(targetPath);
        assert.ok(check().length, 'absent target refused');
        writeFileSync(targetPath, '# Candidat\n');
      }
      if (declaration) {
        for (const invalid of [
          { ...declaration, version: 2 },
          { ...declaration, reviewSha256: '0'.repeat(64) },
          { ...declaration, additions: [] },
          { ...declaration, additions: [null] },
          { ...declaration, additions: [...additions, additions[0]] },
          { ...declaration, additions: [{ ...additions[0], text: '**modifié**' }] },
          { ...declaration, additions: [{ ...additions[0], url: `${additions[0].url}#fragment` }] },
          { ...declaration, additions: [{ ...additions[0], url: `/blog/${slug}` }] },
        ]) {
          assert.throws(() => pillarBaseline(currentBody, currentRecipe, invalid));
          save(invalid);
          assert.ok(check().length, 'invalid declaration refused by production');
        }
        save(declaration);
        const page = text => `<div class="article-corps">${text}</div>`;
        const text = additions.map(item => item.text).join(' ; ');
        const anchors = additions.map(item => `<a href="${item.url}">${item.text}</a>`).join(' ; ');
        // Synthetic render witness only; the real independent opinion stays unchanged.
        const htmlReview = { ...review, subject: { ...review.subject, renderedSha256: renderedBodySha256(page(text)) } };
        save({ ...declaration, reviewSha256: reviewSha256(JSON.stringify(htmlReview)) });
        assert.deepEqual(check(currentBody, currentRecipe, htmlReview, page(anchors)), []);
        assert.ok(check(currentBody, currentRecipe, htmlReview, page(anchors + '<img src="figure.png">')).length);
        assert.ok(check(currentBody, currentRecipe, htmlReview, page(anchors.replace('<a href=', '<a title="promesse" href='))).length);
      }
      assert.equal(JSON.stringify(currentRecipe), inputBytes);
      assert.equal(JSON.stringify(review), opinionBytes);
    } finally { rmSync(root, { recursive: true, force: true }); }
  }
});

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

for (const [state, currentBody, currentRecipe, currentProjection] of [
  ['without backlink', unlinkedBody, unlinkedRecipe, undefined],
  ['already linked', linked, linkedRecipe, bankingDeclaration],
  ['published additions', body, recipe, declaration],
]) test(`real pillar ${state} preserves the independent opinion and bounds recipe and render changes`, () => {
  const inputBytes = JSON.stringify(currentRecipe);
  const baseline = pillarBaseline(currentBody, currentRecipe, currentProjection);
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
