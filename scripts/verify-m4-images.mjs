/** Oracle M4 adapté au lot fonctionnel : 9 preuves, 12 dérivés blog, 1 vrai poster. */
import { readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const manifest = JSON.parse(readFileSync('docs/qa/m4-r3/media-manifest.json', 'utf8'));
const images = manifest.entries.filter(e => /\.(webp|avif)$/.test(e.target));
if (images.length !== 22) throw new Error(`22 images attendues, ${images.length} reçues`);
const hashes = new Set();
let totalBytes = 0;
const report = [];
for (const entry of images) {
  const width = entry.target.includes('/proofs/') ? 1600 : entry.target.includes('hero-poster') ? 1920 : Number(entry.target.match(/-(\d+)\.(avif|webp)$/)[1]);
  const height = Math.round(width * 9 / 16);
  for (const file of [entry.target, entry.target.replace(/^public\//, 'dist/')]) {
    const meta = await sharp(file).metadata();
    const format = file.endsWith('.avif') ? 'heif' : 'webp';
    const hash = createHash('sha256').update(readFileSync(file)).digest('hex');
    if (meta.width !== width || meta.height !== height || meta.format !== format || hash !== entry.sha256) throw new Error(`Image divergente : ${file}`);
  }
  if (entry.target.startsWith('public/proofs/')) hashes.add(entry.sha256);
  totalBytes += statSync(entry.target).size;
  report.push({ file: entry.target, width, height, bytes: entry.bytes });
}
if (hashes.size !== 9) throw new Error('Les neuf preuves ne sont pas distinctes');
if (/Emplacement du visuel à produire/.test(readFileSync('dist/index.html', 'utf8') + readFileSync('dist/blog.html', 'utf8'))) throw new Error('Placeholder actif');
console.log(JSON.stringify({ checked: images.length, originalProofs: hashes.size, totalBytes, report }, null, 2));
