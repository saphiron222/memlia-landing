import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderedBodySha256 } from '../../scripts/lib/blog-review-binding.mjs';
import { proofSrcset, proofSizes } from '../../scripts/lib/responsive-proofs.mjs';
const src = '/proofs/blog/example.webp';
const image = `<figure><img src="${src}" alt="Décision humaine" width="1600" height="900" loading="lazy" decoding="async"></figure>`;
const page = body => `<div class="article-corps">${body}</div>`;
const responsive = image.replace('decoding="async"', `decoding="async" srcset="${proofSrcset(src, Buffer.from('master'))}" sizes="${proofSizes(true)}"`);
test('les seuls attributs de diffusion canoniques ne périment pas la revue éditoriale', () => {
  assert.equal(renderedBodySha256(page(responsive)), renderedBodySha256(page(image)));
});
test('alt, source, image étrangère ou sélection non canonique restent liés à la revue', () => {
  const expected = renderedBodySha256(page(image));
  for (const changed of [responsive.replace('Décision humaine','Décision automatique'),
    responsive.replace('src="/proofs/blog/example.webp"','src="/proofs/blog/other.webp"'),
    responsive.replace('-400.webp 400w','-400.webp 401w'),
    responsive.replace('sizes="auto, ','sizes="'),
    responsive.replace('/proofs/responsive/blog/example-', '/unrelated-')]) {
    assert.notEqual(renderedBodySha256(page(changed)), expected);
  }
});
