/**
 * Génère les placeholders d'images du site, à la place exacte des visuels à livrer.
 *
 * Pour chaque entrée de src/data/images.mjs et chaque largeur livrée, écrit
 * public/images/<id>-<largeur>.avif et .webp (ratio du manifeste, donc CLS déjà nul).
 * Le rendu est un aplat crème rayé en diagonale, une tuile verte et le code du brief
 * (IMG-NN), pour reconnaître d'un coup d'œil un placeholder d'un visuel livré.
 *
 * Le placeholder ne remplace jamais un fichier déjà présent : un visuel livré à la main
 * (capture du banc Windows, image générée depuis son brief) reste en place. `--force`
 * réécrit tout.
 *
 * Usage : npm run placeholders [-- --force]
 */
import { mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

import { IMAGES, FORMATS, hauteurPour } from '../src/data/images.mjs';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOSSIER = join(RACINE, 'public', 'images');
const FORCE = process.argv.includes('--force');

/** Charte : crème, papier, encre, vert Memlia (src/styles/tokens.css). */
const COULEURS = {
  fond: '#fcfbf7',
  rayure: 'rgba(35,31,32,0.06)',
  tuile: '#27b657',
  encre: 'rgba(35,31,32,0.42)',
  bord: 'rgba(35,31,32,0.12)',
};

const QUALITE = { avif: 45, webp: 70 };

const svgPlaceholder = (image, largeur, hauteur) => {
  const cote = Math.round(Math.min(largeur, hauteur) * 0.18);
  const x = Math.round((largeur - cote) / 2);
  const y = Math.round((hauteur - cote) / 2);
  const fonte = Math.max(12, Math.round(cote * 0.28));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${largeur}" height="${hauteur}" viewBox="0 0 ${largeur} ${hauteur}">
  <defs>
    <pattern id="rayures" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
      <rect width="1" height="8" fill="${COULEURS.rayure}"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="${COULEURS.fond}"/>
  <rect width="100%" height="100%" fill="url(#rayures)"/>
  <rect x="0.5" y="0.5" width="${largeur - 1}" height="${hauteur - 1}" fill="none" stroke="${COULEURS.bord}"/>
  <rect x="${x}" y="${y}" width="${cote}" height="${cote}" rx="${Math.round(cote * 0.23)}" fill="${COULEURS.tuile}"/>
  <text x="${largeur / 2}" y="${y + cote + fonte * 1.6}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="${fonte}" font-weight="600" fill="${COULEURS.encre}">${image.brief}</text>
</svg>`;
};

mkdirSync(DOSSIER, { recursive: true });

let ecrits = 0;
let conserves = 0;

for (const [id, image] of Object.entries(IMAGES)) {
  for (const largeur of image.largeurs) {
    const hauteur = hauteurPour(image, largeur);
    const svg = Buffer.from(svgPlaceholder(image, largeur, hauteur));
    for (const format of FORMATS) {
      const chemin = join(DOSSIER, `${id}-${largeur}.${format}`);
      if (existsSync(chemin) && !FORCE) {
        conserves += 1;
        continue;
      }
      const pipeline = sharp(svg, { density: 72 });
      if (format === 'avif') await pipeline.avif({ quality: QUALITE.avif, effort: 4 }).toFile(chemin);
      else if (format === 'webp') await pipeline.webp({ quality: QUALITE.webp }).toFile(chemin);
      else throw new Error(`[placeholders] format non géré : ${format}`);
      ecrits += 1;
    }
  }
  console.log(`[placeholders] ${id} (${image.brief}) : ${image.largeurs.join(', ')} px`);
}

console.log(`[placeholders] ${ecrits} fichier(s) écrit(s), ${conserves} conservé(s) dans public/images/.`);
