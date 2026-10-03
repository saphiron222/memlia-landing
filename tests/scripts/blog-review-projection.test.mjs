import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { projectReviews } from '../../scripts/lib/blog-review-projection.mjs';

const read = (name) => JSON.parse(readFileSync(new URL(`../../docs/qa/w39-review-projection/${name}`, import.meta.url)));
const qa = read('qa.json');
const business = read('metier.json');
const subject = qa.subjects[0];

test('projette les avis W39 sans fabriquer de scores ni élargir leur portée', () => {
  const result = projectReviews({ qa, business, subject });
  assert.deepEqual(result.subject, subject);
  assert.equal(result.editorial.reviewer, qa.reviewer);
  assert.equal(result.business.reviewerId, business.reviewer);
  assert.deepEqual(Object.values(result.editorial.criteria), qa.editorial_criteria.map(({ id, ...row }) => row));
  assert.deepEqual(Object.values(result.image.criteria), qa.visual_criteria.map(({ id, ...row }) => row));
  assert.equal(Object.hasOwn(result.image, 'directionArt'), false);
  assert.equal(Object.hasOwn(result, 'qualite'), false);
  assert.deepEqual(Object.keys(result.business.claims), ['claim-unit-f2ed6077a390-1']);
  assert.equal(result.business.claims['claim-unit-f2ed6077a390-1'].reasoning, business.claims[0].reason);
  assert.deepEqual(qa, read('qa.json'));
  assert.deepEqual(business, read('metier.json'));
});

test('refuse un FAIL, un P0, une identité absente ou un sujet non relu', () => {
  for (const change of [{ verdict: 'FAIL' }, { p0: ['route cassée'] }, { reviewer: null }, { independent_qa_pass: false }]) {
    assert.throws(() => projectReviews({ qa: { ...qa, ...change }, business, subject }));
  }
  for (const key of ['slug', 'bodySha256', 'recipeSha256', 'renderedSha256']) {
    assert.throws(() => projectReviews({ qa, business, subject: { ...subject, [key]: 'divergent' } }));
  }
  assert.throws(() => projectReviews({ qa, business, subject: qa.subjects[1] }), /métier/);
  assert.throws(() => projectReviews({ qa, business: { ...business, verdict: 'FAIL' }, subject }));
  const broken = structuredClone(business);
  broken.claims[0].forgeVerdict = 'hors_sujet';
  assert.throws(() => projectReviews({ qa, business: broken, subject }));
  const missing = structuredClone(qa);
  missing.visual_criteria.pop();
  assert.throws(() => projectReviews({ qa: missing, business, subject }));
});
