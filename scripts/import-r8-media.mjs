/** R8 remplace le cartouche incrusté ; aucune réécriture des preuves, du blog ou de R7. */
import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import sharp from 'sharp';

const sourceVideo = resolve(process.argv[2] ?? '../../../memlia-video/out/r8');
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const approved = {
  'animatique-hero-45s.mp4': '164f6090f7d7a820d544d6679e5f68257fb4f929fe35079b5ce9a22ef86585e4',
  'hero-poster.webp': 'c549233d274e7ec926f2e2de296436a0c510ddeeeda1ec1ecbfe06de21a9d1f1',
  'animatique.vtt': hash('public/media/r7/animatique.vtt'),
};
const historical = JSON.parse(readFileSync('docs/qa/m4-r3/media-manifest.json', 'utf8'));
// Contrôler TOUTES les entrées avant d'écrire : une source absente/divergente ferme l'import.
for (const entry of historical.entries) assert.equal(hash(entry.target), entry.sha256, entry.target);
for (const [name, sha256] of Object.entries(approved)) assert.equal(hash(join(sourceVideo, name)), sha256, name);
const entries = historical.entries.filter(entry => !entry.target.startsWith('public/media/r7/'));
assert.equal(historical.entries.length - entries.length, 4);
mkdirSync('public/media/r8', { recursive: true });
for (const [name, sha256] of Object.entries(approved)) {
  const source = join(sourceVideo, name);
  const target = `public/media/r8/${name}`;
  copyFileSync(source, target);
  assert.equal(hash(target), sha256);
  entries.push({ source, target, bytes: statSync(target).size, sha256 });
}
const source = 'public/media/r8/hero-poster.webp';
const target = 'public/media/r8/hero-poster-1200.webp';
await sharp(source).resize(1200).webp({ quality: 90 }).toFile(target);
entries.push({ source, target, derivative: true, bytes: statSync(target).size, sha256: hash(target) });
assert.equal(entries.length, 26);
for (const entry of historical.entries) assert.equal(hash(entry.target), entry.sha256, entry.target);
mkdirSync('docs/qa/m4-r4', { recursive: true });
writeFileSync('docs/qa/m4-r4/media-manifest.json', JSON.stringify({ sources: { ...historical.sources, sourceVideo }, replacedHistoricalMedia: 4, entries }, null, 2) + '\n');
console.log(JSON.stringify({ sourceVideo, entries: entries.length, historicalUnchanged: historical.entries.length, imported: Object.keys(approved), posterBytes: statSync(target).size }));
