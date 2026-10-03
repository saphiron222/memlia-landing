import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const subject = await import('../browser/blog-proof-fixture.mjs').catch(() => ({}));
const root = fileURLToPath(new URL('../../', import.meta.url));

test('technical browser fixture uses the real forge and all ten existing portraits without publishing', () => {
  assert.equal(typeof subject.technicalProofFixtures, 'function', 'the technical/republication boundary is missing');
  const fixtures = subject.technicalProofFixtures(root);
  assert.equal(fixtures.length, 5);
  const ids = new Set();
  for (const fixture of fixtures) {
    const recipe = JSON.parse(readFileSync(`${root}/editorial/recettes/${fixture.slug}/recette.json`));
    assert.equal(recipe.inlineProofs.length, 2);
    for (const proof of recipe.inlineProofs) {
      assert.ok(fixture.html.includes(`data-blog-proof="${proof.id}"`));
      assert.ok(fixture.html.includes(`src="/proofs/blog/${proof.id}-mobile.webp"`));
      ids.add(proof.id);
    }
    assert.doesNotMatch(fixture.html, /figcaption|preuve-defilante/);
  }
  assert.equal(ids.size, 10);
});

test('no historical article is mistaken for republication, but a partial republication cannot skip the final gate', () => {
  assert.equal(typeof subject.requiresRepublicationGate, 'function');
  assert.equal(subject.requiresRepublicationGate(['<img src="/proofs/blog/a.webp">']), false);
  assert.equal(subject.requiresRepublicationGate(['<img src="/proofs/blog/a-mobile.webp">', '<div class="preuve-defilante"></div>']), true);
  assert.equal(subject.requiresRepublicationGate(['']), false);
  assert.equal(subject.requiresRepublicationGate([''], { remoteUrl: 'http://127.0.0.1:32679' }), true);
  assert.equal(subject.requiresRepublicationGate([''], { required: '1' }), true);
  assert.equal(subject.requiresRepublicationGate([''], { required: '0' }), false);
  assert.equal(subject.requiresRepublicationGate(['<img src="/proofs/blog/a-mobile.webp">'], { required: '0' }), true);
});
