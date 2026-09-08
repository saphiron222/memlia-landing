/**
 * Post-build : retire les briefs d'images du `dist`.
 *
 * Les briefs (`public/images/brief-<id>.md`) vivent à côté des placeholders pour que
 * la génération des visuels reste traçable, mais ils ne doivent jamais être déployés
 * sur Cloudflare Pages. Astro copie `public/` tel quel dans `dist/` : on nettoie ici.
 *
 * Appelé par `npm run build` (voir package.json). Sortie 0 si `dist/images/` n'existe
 * pas (aucun brief à retirer) ; toute autre erreur fait échouer le build.
 */
import { readdirSync, rmSync, existsSync, copyFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOSSIER_IMAGES = join(RACINE, 'dist', 'images');
const MOTIF_BRIEF = /^brief-.+\.md$/;

// Garder /sitemap.xml, URL historique déclarée dans robots.txt et le head.
copyFileSync(join(RACINE, 'dist', 'sitemap-index.xml'), join(RACINE, 'dist', 'sitemap.xml'));

if (!existsSync(DOSSIER_IMAGES)) {
  console.log(`[strip-briefs] ${DOSSIER_IMAGES} absent : rien à retirer.`);
  process.exit(0);
}

const briefs = readdirSync(DOSSIER_IMAGES).filter((nom) => MOTIF_BRIEF.test(nom));

for (const nom of briefs) {
  rmSync(join(DOSSIER_IMAGES, nom));
}

console.log(`[strip-briefs] ${briefs.length} brief(s) retiré(s) de dist/images/.`);
