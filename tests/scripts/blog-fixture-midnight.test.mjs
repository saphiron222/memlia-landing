import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { validateDossier } from '../../scripts/lib/blog-pipeline.mjs';
import { aujourdhui } from '../../scripts/blog-forge.mjs';

// À 22 h UTC en septembre, le calendrier Paris change de jour, contrairement à UTC.
const beforeMidnight = Date.parse('2026-09-29T21:59:59Z');
const afterMidnight = Date.parse('2026-09-29T22:00:00Z');
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));

test('une fixture importée avant minuit Paris prend une date cohérente à sa création après minuit Paris, sans accepter une revue réellement périmée', async (t) => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-blog-midnight-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  t.mock.timers.enable({ apis: ['Date'], now: beforeMidnight });
  try {
    const { createCompleteDossier } = await import('./blog-fixture.mjs?midnight-regression');
    const stale = await createCompleteDossier(join(root, 'stale'), { slug: 'stale' });
    t.mock.timers.setTime(afterMidnight);
    const fresh = await createCompleteDossier(join(root, 'fresh'), { slug: 'fresh' });
    const manifest = readJson(fresh.manifestPath);
    const claims = readJson(join(fresh.dossier, 'claims.json'));
    const skills = readJson(join(fresh.dossier, 'skills.json'));
    const business = readJson(join(fresh.dossier, 'preuves/business-review.json'));
    const editorial = readJson(join(fresh.dossier, 'review.json'));
    const editorialProof = readJson(join(fresh.dossier, 'preuves/review.json'));
    const expected = '2026-09-30';
    assert.equal(aujourdhui(), expected, 'la forge et les fixtures suivent le même calendrier');
    assert.equal(manifest.sourcesVerifiedAt, expected);
    assert.equal(manifest.role.proof.verifiedAt, expected);
    assert.ok(manifest.sources.every((source) => source.checkedAt === expected));
    assert.ok(claims.claims.every((claim) => claim.checkedAt === expected && claim.factCheck.checkedAt === expected
      && claim.factCheck.sourceResults.every((result) => result.checkedAt === expected && result.citation.coordinates.checkedAt === expected)));
    assert.ok([...skills.blog, ...skills.seo].every((row) => row.checkedAt === expected));
    assert.equal(business.checkedAt, expected);
    assert.ok(business.claimReviews.every((review) => review.checkedAt === expected));
    assert.equal(editorial.checkedAt, expected);
    assert.equal(editorialProof.checkedAt, expected);
    assert.equal(readJson(join(fresh.dossier, 'preuves/sources/source-urssaf.json')).checkedAt, expected);
    assert.equal(readJson(join(fresh.dossier, 'preuves/skills/blog-factcheck.json')).checkedAt, expected);
    assert.equal(readJson(join(fresh.dossier, 'preuves/role.json')).checkedAt, expected);

    const freshResult = await validateDossier({ root: fresh.root, slug: fresh.slug, renderedBlogHtml: `<li data-article="${fresh.slug}"><a href="/blog/${fresh.slug}">Article rendu</a></li>` });
    assert.deepEqual(freshResult.errors, []);
    const staleResult = await validateDossier({ root: stale.root, slug: stale.slug, renderedBlogHtml: `<li data-article="${stale.slug}"><a href="/blog/${stale.slug}">Article rendu</a></li>` });
    assert.equal(staleResult.pass, false);
    assert.ok(staleResult.errors.some((error) => /Fraîcheur sensible.*2026-09-30.*2026-09-29/i.test(error)), staleResult.errors.join('\n'));
  } finally {
    t.mock.timers.reset();
  }
});
