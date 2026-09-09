/** Importe les sources approuvées sans les modifier ; chaque copie est comparée par SHA-256. */
import { copyFileSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import sharp from 'sharp';
const sourceProofs = resolve(process.argv[2] ?? '../../docs/design/m4-r1-functional-proofs/optimized');
const sourceVideo = resolve(process.argv[3] ?? '../../../memlia-video/out/r7');
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const entries = [];
function copy(source, target) {
  mkdirSync(resolve(target, '..'), { recursive: true });
  copyFileSync(source, target);
  const sha256 = hash(source);
  if (sha256 !== hash(target)) throw new Error(`Copie divergente : ${target}`);
  entries.push({ source, target, bytes: statSync(target).size, sha256 });
}
const proofs = readdirSync(sourceProofs).filter(name => name.endsWith('.webp')).sort();
if (proofs.length !== 9) throw new Error(`9 preuves attendues, reçu ${proofs.length}`);
for (const name of proofs) {
  const meta = await sharp(join(sourceProofs, name)).metadata();
  if (meta.width !== 1600 || meta.height !== 900) throw new Error(`Dimensions invalides : ${name}`);
  copy(join(sourceProofs, name), `public/proofs/${name}`);
}
for (const name of ['animatique-hero-45s.mp4', 'animatique.vtt', 'hero-poster.webp']) copy(join(sourceVideo, name), `public/media/r7/${name}`);
copy(join(sourceVideo, 'script.md'), 'docs/design/m4-r3/r7-script-source.md');
// Poster de diffusion au cadre maximal ; l'original approuvé reste intact et tracé.
const posterSource = 'public/media/r7/hero-poster.webp';
const posterTarget = 'public/media/r7/hero-poster-1200.webp';
await sharp(posterSource).resize(1200).webp({ quality: 90 }).toFile(posterTarget);
entries.push({ source: posterSource, target: posterTarget, derivative: true, bytes: statSync(posterTarget).size, sha256: hash(posterTarget) });
// Les couvertures du blog deviennent elles aussi fonctionnelles, sans photographie de papeterie.
for (const [source, id] of [['06-eprouver', 'img-23-controle-bulletins-paie'], ['09-garanties', 'img-24-suivi-production-sociale']]) {
  for (const width of [768, 1200, 1600]) for (const format of ['avif', 'webp']) {
    const target = `public/images/${id}-${width}.${format}`;
    await sharp(`public/proofs/${source}.webp`).resize(width).toFormat(format, { quality: 85 }).toFile(target);
    entries.push({ source: `public/proofs/${source}.webp`, target, derivative: true, bytes: statSync(target).size, sha256: hash(target) });
  }
}
mkdirSync('docs/qa/m4-r3', { recursive: true });
writeFileSync('docs/qa/m4-r3/media-manifest.json', JSON.stringify({ sources: { sourceProofs, sourceVideo }, entries }, null, 2) + '\n');
console.log(JSON.stringify({ copied: entries.filter(e => !e.derivative).length, derivatives: entries.filter(e => e.derivative).length, entries }, null, 2));
