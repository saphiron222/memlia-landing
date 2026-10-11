import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';
import { CONTENU_CAC } from '../../src/data/accueil/cac.ts';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
test('CAC uses its own clean R4 film, poster and optional captions', async () => {
  assert.equal(CONTENU_CAC.hero.video, '/media/cac-r4/explainer-hero-45s.mp4');
  assert.equal(CONTENU_CAC.hero.sousTitres, '/media/cac-r4/explainer.vtt');
  assert.equal(CONTENU_CAC.hero.poster, '/media/cac-r4/hero-poster-1200.webp');
  assert.equal(CONTENU_CAC.hero.sousTitresOptionnels, true);
  assert.match(CONTENU_CAC.hero.descriptionVideo, /fictif/i);
  const manifest = JSON.parse(readFileSync('docs/qa/accueil-cac/video-manifest.json'));
  assert.equal(manifest.generation, 'cac-r4-clean');
  assert.equal(manifest.verification.audioUnchanged, true);
  assert.equal(manifest.verification.peripheralLabelsRemoved, true);
  assert.equal(manifest.entries.length, 3);
  for (const entry of manifest.entries) {
    const bytes = readFileSync(entry.target);
    assert.equal(bytes.length, entry.bytes);
    assert.equal(hash(bytes), entry.sha256);
  }
  const poster = await sharp('public' + CONTENU_CAC.hero.poster).metadata();
  assert.deepEqual([poster.width, poster.height], [1200, 675]);
  const vtt = readFileSync('public' + CONTENU_CAC.hero.sousTitres, 'utf8');
  assert.ok(vtt.startsWith('WEBVTT\n'));
  assert.equal(vtt.split(' --> ').length - 1, 12);
});
test('import rejects an unapproved or corrupt delivery before publishing any file', () => {
  const dir = mkdtempSync(join(tmpdir(), 'cac-import-'));
  const before = readFileSync('docs/qa/accueil-cac/video-manifest.json');
  try {
    for (const name of ['hero.mp4', 'captions.vtt', 'poster.jpg']) writeFileSync(join(dir, name), 'corrupt');
    for (const verification of [{status:'FAIL'}, {status:'PASS', revision:'cac-r4-clean', audioUnchanged:true, peripheralLabelsRemoved:true, sha256:{}}]) {
      writeFileSync(join(dir, 'verification.json'), JSON.stringify(verification));
      const result = spawnSync(process.execPath, ['scripts/import-cac-media.mjs', dir], {encoding:'utf8'});
      assert.notEqual(result.status, 0);
      assert.doesNotMatch(result.stderr, /MODULE_NOT_FOUND/);
      assert.deepEqual(readFileSync('docs/qa/accueil-cac/video-manifest.json'), before);
    }
  } finally { rmSync(dir, {recursive:true, force:true}); }
});
