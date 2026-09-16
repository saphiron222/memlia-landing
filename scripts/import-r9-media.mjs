#!/usr/bin/env node
/**
 * Importe la génération R9 de l'animatique (mention d'épreuve retirée à la source, 16/09/2026)
 * depuis le projet Remotion, sous des noms neutres, et remplace les générations historiques.
 * Fail-closed : refuse sans oracle R9 PASS ; contrôle chaque empreinte avant d'écrire.
 */
import assert from 'node:assert/strict';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import sharp from 'sharp';

const sourceVideo = resolve(process.argv[2] ?? '../memlia-video/out/r9');
const hash = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const verification = JSON.parse(readFileSync(join(sourceVideo, 'verification.json'), 'utf8'));
assert.equal(verification.status, 'PASS', 'oracle R9 non PASS');
assert.equal(verification.revision, 'r9');
const noms = {
  'animatique-hero-45s.mp4': 'explainer-hero-45s.mp4',
  'animatique.vtt': 'explainer.vtt',
  'hero-poster.webp': 'hero-poster.webp',
};
// Contrôler TOUTES les entrées avant d'écrire : une source absente ou divergente de l'oracle ferme l'import.
for (const name of Object.keys(noms)) assert.equal(hash(join(sourceVideo, name)), verification.sha256[name], name);
for (const generation of ['r7', 'r8']) rmSync(`public/media/${generation}`, { recursive: true, force: true });
mkdirSync('public/media/r9', { recursive: true });
const entries = [];
for (const [name, cible] of Object.entries(noms)) {
  const source = join(sourceVideo, name);
  const target = `public/media/r9/${cible}`;
  copyFileSync(source, target);
  entries.push({ source, target, bytes: statSync(target).size, sha256: hash(target) });
}
const source = 'public/media/r9/hero-poster.webp';
const target = 'public/media/r9/hero-poster-1200.webp';
await sharp(source).resize(1200).webp({ quality: 90 }).toFile(target);
entries.push({ source, target, derivative: true, bytes: statSync(target).size, sha256: hash(target) });
const manifestPath = 'docs/qa/m4-r4/media-manifest.json';
const historical = JSON.parse(readFileSync(manifestPath, 'utf8'));
const proofs = historical.entries.filter((entry) => !String(entry.target).includes('public/media/'));
writeFileSync(manifestPath, JSON.stringify({
  sources: { ...historical.sources, sourceVideo, sourceVideoVerification: join(sourceVideo, 'verification.json') },
  replacedHistoricalMedia: 4,
  generation: 'r9',
  entries: [...proofs, ...entries],
  proofRender: historical.proofRender,
}, null, 2) + '\n');
assert.ok(!existsSync('public/media/r8') && !existsSync('public/media/r7'));
console.log(JSON.stringify({ sourceVideo, imported: entries.map((e) => [e.target, e.sha256]) }, null, 2));
