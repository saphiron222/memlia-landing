import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { mesurerPalette } from '../../../scripts/mesurer-palette.mjs';
const dir = dirname(fileURLToPath(import.meta.url));
const source = 'couverture-master-e1b26719-2623-4044-8ccb-86b40198bac6.png';
const final = join(dir, 'image-source.png');
copyFileSync(join(dir, source), final);
const master = await sharp(final).resize(1920, 1080, { fit: 'cover' }).toBuffer();
await sharp(master).webp({ quality: 86 }).toFile(join(dir, 'preuves/hero-1920.webp'));
await sharp(final).resize(1200, 630, { fit: 'cover' }).webp({ quality: 84 }).toFile(join(dir, 'preuves/hero-og.webp'));
for (const w of [768, 1200, 1600]) {
  await sharp(master).resize(w).webp({ quality: 82 }).toFile(join(dir, `preuves/hero-${w}.webp`));
  await sharp(master).resize(w).avif({ quality: 58 }).toFile(join(dir, `preuves/hero-${w}.avif`));
}
const palette = await mesurerPalette(final, ['#27b657', '#1c8a41', '#fcfbf7', '#231f20']);
writeFileSync(join(dir, 'preuves/palette.json'), JSON.stringify(palette, null, 2) + '\n');
writeFileSync(join(dir, 'image-traitement.json'), JSON.stringify({ original: source, sortie: 'image-source.png', traitement: 'Copie exacte de la pièce jointe opérateur, sans recoloration ; dérivés redimensionnés et recadrés uniquement. Aucune génération ni crédit consommé.', script: 'preparer-images.mjs', pixelsModifies: 0, sha256_master: createHash('sha256').update(readFileSync(final)).digest('hex'), provenanceOriginale: 'provenance-e1b26719-2623-4044-8ccb-86b40198bac6.json', generatedAt: '2026-10-12', processedAt: new Date().toISOString(), modele: null, credits: null, provider: 'OpenAI', tool: 'image_gen.imagegen' }, null, 2) + '\n');
console.log(JSON.stringify(palette, null, 2));
