#!/usr/bin/env node
/** Import de R4 nettoyée : vérifier toutes les sources avant de remplacer les actifs CAC. */
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, copyFileSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import sharp from 'sharp';

const source = resolve(process.argv[2] ?? '../memlia-video/out/r4-clean');
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const verification = JSON.parse(readFileSync(join(source, 'verification.json'), 'utf8'));
assert.equal(verification.status, 'PASS', 'QA non PASS');
assert.equal(verification.revision, 'cac-r4-clean');
assert.equal(verification.audioUnchanged, true);
assert.equal(verification.peripheralLabelsRemoved, true);
const files = { 'hero.mp4': 'explainer-hero-45s.mp4', 'captions.vtt': 'explainer.vtt', 'poster.jpg': 'hero-poster-1200.webp' };
for (const name of Object.keys(files)) assert.equal(hash(join(source, name)), verification.sha256[name], name);
assert.ok(readFileSync(join(source, 'captions.vtt'), 'utf8').startsWith('WEBVTT\n'));
const poster = await sharp(join(source, 'poster.jpg')).metadata();
assert.deepEqual([poster.width, poster.height], [1920, 1080]);
const output = 'public/media/cac-r4';
mkdirSync(output, { recursive: true });
const entries = [];
for (const [name, filename] of Object.entries(files)) {
  const target = `${output}/${filename}`;
  if (name === 'poster.jpg') await sharp(join(source, name)).resize(1200).webp({ quality: 90 }).toFile(target);
  else copyFileSync(join(source, name), target);
  entries.push({ source: `E8/R4-clean/${name}`, target, bytes: statSync(target).size, sha256: hash(target) });
}
writeFileSync('docs/qa/accueil-cac/video-manifest.json', JSON.stringify({
  generation: 'cac-r4-clean',
  provenance: 'Film CAC R4 validé par Kevin ; deux mentions périphériques retirées à la source à sa demande. Jeu fictif, proposition puis validation humaine. Bande sonore conservée sans réencodage.',
  verification,
  entries,
}, null, 2) + '\n');
console.log(JSON.stringify({ imported: entries }, null, 2));
