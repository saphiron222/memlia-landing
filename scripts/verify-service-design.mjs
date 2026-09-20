import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REQUIRED_MARKERS = [
  ['data-service-layout="da-v1"', 'gabarit de direction artistique'],
  ['data-service-hero', 'hero éditorial'],
  ['data-service-sections', 'sections structurées'],
  ['data-service-media', 'premier média fonctionnel'],
  ['data-page-byline', 'signature visible'],
  ['data-primary-source', 'source primaire datée'],
];

export function servicesServis(root) {
  const source = join(root, 'src/content/services');
  if (!existsSync(source)) return [];
  return readdirSync(source)
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.replace(/\.md$/, ''))
    .sort();
}

export function servicesPublies(root) {
  const source = join(root, 'src/content/services');
  return servicesServis(root).filter((slug) =>
    /\nstatus:\s*publie\s*(?:\n|$)/.test(readFileSync(join(source, `${slug}.md`), 'utf8'))
  );
}

export function auditerServiceDesign({ root = process.cwd(), dist = join(root, 'dist') } = {}) {
  const services = servicesServis(root);
  const servicesDansFooter = servicesPublies(root);
  const erreurs = [];
  const proprietairesMedia = new Map();
  const manifesteV2 = join(root, 'docs/qa/site-v2/proofs-manifest.json');
  const mediasScelles = existsSync(manifesteV2)
    ? new Set(JSON.parse(readFileSync(manifesteV2, 'utf8')).entries.map((entry) => entry.target))
    : new Set();
  for (const slug of services) {
    const route = `/automatisation/${slug}`;
    const dossier = join(dist, 'automatisation', slug, 'index.html');
    const fichier = join(dist, 'automatisation', `${slug}.html`);
    const cible = existsSync(dossier) ? dossier : fichier;
    if (!existsSync(cible)) {
      erreurs.push(`${route} : page construite absente`);
      continue;
    }
    const html = readFileSync(cible, 'utf8');
    for (const [marker, label] of REQUIRED_MARKERS) {
      if (!html.includes(marker)) erreurs.push(`${route} : ${label} absent`);
    }
    if (!html.includes('"@type":"Person"')) erreurs.push(`${route} : nœud Person absent du JSON-LD`);
    if (!html.includes('"worksFor":{"@id":"https://memlia.fr/#organization"}')) erreurs.push(`${route} : Person non reliée à Organization`);
    if (!/class="[^"]*\brv\b/.test(html)) erreurs.push(`${route} : animation de révélation absente`);
    const medias = (html.match(/data-service-media/g) ?? []).length;
    if (medias < 2) erreurs.push(`${route} : ${medias} média(s), 2 requis`);
    const preuves = [...new Set([...html.matchAll(/data-proof="([^"]+)"/g)].map((match) => match[1]))];
    if (preuves.length === 0) erreurs.push(`${route} : aucune recette d’image référencée`);
    for (const preuve of preuves) {
      const cibleRelative = `public/proofs/${preuve}.webp`;
      if (!existsSync(join(root, cibleRelative))) erreurs.push(`${route} : média rendu absent pour ${preuve}`);
      if (!mediasScelles.has(cibleRelative)) erreurs.push(`${route} : recette scellée absente pour ${preuve}`);
      const proprietaire = proprietairesMedia.get(preuve);
      if (proprietaire && proprietaire !== slug) {
        erreurs.push(`média ${preuve} partagé entre /automatisation/${proprietaire} et ${route}`);
      } else {
        proprietairesMedia.set(preuve, slug);
      }
    }
    for (const destination of servicesDansFooter) {
      const href = `/automatisation/${destination}`;
      if (!html.includes(`href="${href}"`)) erreurs.push(`${route} : lien de footer absent vers ${href}`);
    }
  }
  return { pass: erreurs.length === 0, services: services.length, erreurs };
}

function cli() {
  const resultat = auditerServiceDesign();
  const ligne = resultat.pass ? 'VERT' : 'ROUGE';
  console.log(`${ligne} — garde DA services : ${resultat.services} page(s)`);
  for (const erreur of resultat.erreurs) console.error(`- ${erreur}`);
  if (!resultat.pass) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) cli();
