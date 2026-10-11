import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import sharp from 'sharp';

const check = process.argv.includes('--check');
const manifestPath = 'docs/qa/bulletins-controle/proofs-manifest.json';
execFileSync(process.execPath, ['scripts/render-proofs-v2.mjs', '--source=docs/design/bulletins-controle-proof', `--manifest=${manifestPath}`, '--start=48', check ? '--check' : '--adopt'], { stdio: 'inherit' });
const source = 'public/proofs/v2/og/48-service-bulletins-controle.webp';
const target = source.replace(/\.webp$/, '.jpg');
const bytes = await sharp(readFileSync(source)).jpeg({ quality: 90, mozjpeg: true }).toBuffer();
const metadata = await sharp(bytes).metadata();
assert.equal(metadata.width, 1200);
assert.equal(metadata.height, 630);
const sha256 = (data) => createHash('sha256').update(data).digest('hex');
const globalPath = 'docs/qa/site-v2/proofs-manifest.json';
const global = JSON.parse(readFileSync(globalPath, 'utf8'));
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
if (check) {
  assert.equal(sha256(readFileSync(target)), sha256(bytes));
  for (const entry of manifest.entries) {
    assert.ok(global.entries.some((item) => item.target === entry.target && item.sha256 === entry.sha256));
  }
} else {
  writeFileSync(target, bytes);
  const targets = new Set(manifest.entries.map((entry) => entry.target));
  global.entries = global.entries.filter((entry) => !targets.has(entry.target));
  global.entries.push(...manifest.entries);
  writeFileSync(globalPath, JSON.stringify(global, null, 2) + '\n');
}
console.log(`Image sociale JPG 1200 × 630 et référencement du cadre : ${check ? 'PASS' : 'générés'}`);
