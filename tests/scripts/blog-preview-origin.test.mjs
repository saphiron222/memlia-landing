import assert from 'node:assert/strict';
import test from 'node:test';
import { previewAssetOrigin, requireBlogPreviewOrigin } from '../../src/data/blog-preview-origin.mjs';

const productionOrigin = 'https://memlia.fr';
const previewOrigin = 'https://preview-blog-article.memlia.pages.dev';

test('utilise l’origine Cloudflare pour les assets du candidat sans changer les autres rendus', () => {
  assert.equal(previewAssetOrigin({ candidatePreview: true, configuredOrigin: previewOrigin, productionOrigin }), previewOrigin);
  assert.equal(previewAssetOrigin({ candidatePreview: false, configuredOrigin: previewOrigin, productionOrigin }), productionOrigin);
  assert.equal(previewAssetOrigin({ candidatePreview: true, configuredOrigin: '', productionOrigin }), productionOrigin);
});

test('refuse de packager une preview sans origine Cloudflare exacte', () => {
  assert.throws(() => requireBlogPreviewOrigin(''), /BLOG_PREVIEW_ORIGIN/);
  assert.throws(() => requireBlogPreviewOrigin('http://preview-blog-article.memlia.pages.dev'), /HTTPS/);
  assert.throws(() => requireBlogPreviewOrigin('https://example.com'), /memlia\.pages\.dev/);
  assert.throws(() => requireBlogPreviewOrigin(`${previewOrigin}/chemin`), /origine sans chemin/);
  assert.equal(requireBlogPreviewOrigin(`${previewOrigin}/`), previewOrigin);
});
