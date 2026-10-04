import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const subject = await import('../browser/blog-proof-fixture.mjs').catch(() => ({}));
const root = fileURLToPath(new URL('../../', import.meta.url));

test('technical browser fixture uses the real forge and the fourteen reference images without publishing', () => {
  assert.equal(typeof subject.technicalProofFixtures, 'function', 'the technical/republication boundary is missing');
  const fixtures = subject.technicalProofFixtures(root);
  assert.equal(fixtures.length, 7);
  const ids = new Set();
  for (const fixture of fixtures) {
    const recipe = JSON.parse(readFileSync(`${root}/editorial/recettes/${fixture.slug}/recette.json`));
    assert.equal(recipe.inlineProofs.length, 2);
    for (const proof of recipe.inlineProofs) {
      assert.ok(fixture.html.includes(`data-blog-proof="${proof.id}"`));
      // Recette de référence : la même image 1600 × 900 sur bureau et sur téléphone.
      assert.ok(fixture.html.includes(`src="/proofs/blog/${proof.id}.webp"`));
      assert.ok(fixture.html.includes('width="1600" height="900"'));
      ids.add(proof.id);
    }
    assert.doesNotMatch(fixture.html, /figcaption|preuve-defilante|-mobile\.webp/);
  }
  assert.equal(ids.size, 14);
});

test('no historical article is mistaken for republication, but a partial republication cannot skip the final gate', () => {
  assert.equal(typeof subject.requiresRepublicationGate, 'function');
  assert.equal(subject.requiresRepublicationGate(['<img src="/proofs/blog/a.webp">']), false);
  assert.equal(subject.requiresRepublicationGate(['<div class="preuve-defilante"><img src="/proofs/blog/a.webp"></div>']), false);
  assert.equal(subject.requiresRepublicationGate(['<figure data-blog-proof="a">\n  <img src="/proofs/blog/a.webp" alt="A" width="1600" height="900"></figure>']), true);
  assert.equal(subject.requiresRepublicationGate(['<img src="/proofs/blog/a-mobile.webp">', '<div class="preuve-defilante"></div>']), true);
  assert.equal(subject.requiresRepublicationGate(['']), false);
  assert.equal(subject.requiresRepublicationGate([''], { remoteUrl: 'http://127.0.0.1:32679' }), true);
  assert.equal(subject.requiresRepublicationGate([''], { required: '1' }), true);
  assert.equal(subject.requiresRepublicationGate([''], { required: '0' }), false);
  assert.equal(subject.requiresRepublicationGate(['<img src="/proofs/blog/a-mobile.webp">'], { required: '0' }), true);
});
