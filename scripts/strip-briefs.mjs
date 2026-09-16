/**
 * Post-build : retire du `dist` les sources qui ne doivent jamais être publiées.
 *
 * Les briefs (`public/images/brief-<id>.md`) vivent à côté des placeholders pour que
 * la génération des visuels reste traçable, mais ils ne doivent jamais être déployés
 * sur Cloudflare Pages. Astro copie `public/` tel quel dans `dist/` : on nettoie ici.
 * Les médias R7 restent eux aussi en source historique, mais seule R8 est publiable.
 *
 * Appelé par `npm run build` (voir package.json). Sortie 0 si `dist/images/` n'existe
 * pas (aucun brief à retirer) ; toute autre erreur fait échouer le build.
 */
import { readdirSync, rmSync, existsSync, copyFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { IMAGES, FORMATS, PUBLISHED_IMAGE_IDS } from '../src/data/images.mjs';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOSSIER_IMAGES = join(RACINE, 'dist', 'images');
const DOSSIER_MEDIA_R7 = join(RACINE, 'dist', 'media', 'r7');
const MOTIF_BRIEF = /^brief-.+\.md$/;

// Garder /sitemap.xml, URL historique déclarée dans robots.txt et le head.
copyFileSync(join(RACINE, 'dist', 'sitemap-index.xml'), join(RACINE, 'dist', 'sitemap.xml'));

const fichiersR7 = existsSync(DOSSIER_MEDIA_R7)
  ? readdirSync(DOSSIER_MEDIA_R7, { recursive: true, withFileTypes: true }).filter((entree) => entree.isFile()).length
  : 0;
rmSync(DOSSIER_MEDIA_R7, { recursive: true, force: true });
if (existsSync(DOSSIER_MEDIA_R7)) throw new Error('Le dossier media/r7 interdit subsiste dans dist.');
console.log(`[strip-briefs] ${fichiersR7} asset(s) R7 exclu(s) de dist/media/r7/.`);

if (!existsSync(DOSSIER_IMAGES)) {
  console.log(`[strip-briefs] ${DOSSIER_IMAGES} absent : rien à retirer.`);
  process.exit(0);
}

const briefs = readdirSync(DOSSIER_IMAGES).filter((nom) => MOTIF_BRIEF.test(nom));

for (const nom of briefs) {
  rmSync(join(DOSSIER_IMAGES, nom));
}

console.log(`[strip-briefs] ${briefs.length} brief(s) retiré(s) de dist/images/.`);

// Les essais et images de l’ancien catalogue restent en source, jamais dans la preview.
const expected = new Set(Object.entries(IMAGES).filter(([id]) => PUBLISHED_IMAGE_IDS.includes(id)).flatMap(([id, image]) =>
  [
    ...image.largeurs.flatMap(width => FORMATS.map(format => `${id}-${width}.${format}`)),
    `${id}-og.webp`,
  ]
));
const excluded = readdirSync(DOSSIER_IMAGES).filter(name => !expected.has(name));
for (const name of excluded) rmSync(join(DOSSIER_IMAGES, name), { recursive: true });
const missing = [...expected].filter(name => !existsSync(join(DOSSIER_IMAGES, name)));
console.log(`[strip-briefs] ${excluded.length} ancien(s) asset(s) exclu(s), ${expected.size} attendu(s), ${missing.length} manquant(s).`);
if (missing.length) throw new Error(`Images manquantes : ${missing.join(', ')}`);
