import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { socialImageUrl } from '../../src/data/social-image.mjs';
import { renderSocialImages } from '../../scripts/render-social-images.mjs';

test('les cartes JPEG gardent l’origine et ne modifient pas le chemin du média source', () => {
  assert.equal(socialImageUrl('https://memlia.fr/proofs/outil.webp'), 'https://memlia.fr/social/proofs/outil.webp.jpg');
  assert.equal(socialImageUrl('https://preview.memlia.pages.dev/images/article.webp?x=1'), 'https://preview.memlia.pages.dev/social/images/article.webp.jpg');
});

test('le rendu crée un JPEG 1200 × 630 sous 300 Ko et conserve le WebP original', async () => {
  const root = await mkdtemp(join(tmpdir(), 'memlia-social-'));
  try {
    await mkdir(join(root, 'proofs'));
    const source = await sharp({ create: { width: 1600, height: 900, channels: 3, background: '#27b657' } }).webp().toBuffer();
    await writeFile(join(root, 'proofs/test.webp'), source);
    await writeFile(join(root, 'index.html'), '<meta property="og:image" content="https://memlia.fr/social/proofs/test.webp.jpg"><meta name="twitter:image" content="https://memlia.fr/social/proofs/test.webp.jpg">');
    assert.equal(await renderSocialImages(root), 1);
    const jpeg = await readFile(join(root, 'social/proofs/test.webp.jpg'));
    const meta = await sharp(jpeg).metadata();
    assert.equal(meta.format, 'jpeg');
    assert.equal(meta.width, 1200);
    assert.equal(meta.height, 630);
    assert.ok(jpeg.length <= 300_000);
    assert.deepEqual(await readFile(join(root, 'proofs/test.webp')), source);
    await rm(join(root, 'proofs/test.webp'));
    await assert.rejects(renderSocialImages(root), /Input file is missing/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
