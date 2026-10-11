import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import sharp from 'sharp';
import { renderResponsiveProofs } from '../../scripts/lib/responsive-proofs.mjs';

test('le rendu dérive les preuves, conserve le master et adapte aussi le preload', async () => {
  const root = mkdtempSync(join(tmpdir(), 'responsive-proofs-'));
  try {
    mkdirSync(join(root, 'proofs/blog'), { recursive: true });
    const master = await sharp({ create: { width: 1600, height: 900, channels: 3, background: '#fffefb' } }).webp().toBuffer();
    writeFileSync(join(root, 'proofs/blog/test.webp'), master);
    const html = '<link rel="preload" as="image" href="/proofs/blog/test.webp"><figure><img src="/proofs/blog/test.webp" width="1600" height="900" alt="Preuve" loading="lazy"></figure><img src="/images/other.webp">';
    writeFileSync(join(root, 'index.html'), html);
    await renderResponsiveProofs(root);
    const rendered = readFileSync(join(root, 'index.html'), 'utf8');
    assert.match(rendered, /srcset="[^"]+400w[^"]+800w[^"]+1200w, \/proofs\/blog\/test.webp 1600w"/);
    assert.match(rendered, /sizes="auto, /);
    assert.match(rendered, /imagesrcset="/);
    assert.match(rendered, /imagesizes="/);
    assert.match(rendered, /src="\/proofs\/blog\/test.webp"/);
    assert.match(rendered, /<img src="\/images\/other.webp">/);
    assert.deepEqual(readFileSync(join(root, 'proofs/blog/test.webp')), master);
    const urls = [...rendered.matchAll(/(\/proofs\/responsive\/[^ ,"]+) (\d+)w/g)];
    for (const [, url, width] of urls) {
      const { info } = await sharp(join(root, url)).raw().toBuffer({ resolveWithObject: true });
      assert.equal(info.width, Number(width));
      assert.equal(info.height, Number(width) * 9 / 16);
    }
    await renderResponsiveProofs(root);
    assert.equal(readFileSync(join(root, 'index.html'), 'utf8'), rendered, 'rejeu stable');
  } finally { rmSync(root, { recursive: true, force: true }); }
});
