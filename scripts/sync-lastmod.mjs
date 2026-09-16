#!/usr/bin/env node
/**
 * Dates de dernière modification des pages non éditoriales, tenues par leur contenu rendu.
 *
 * Trois mécanismes ont été essayés le 16/09/2026, deux ont échoué :
 *   - une constante écrite à la main ne bouge que si quelqu'un y pense ; personne n'y a pensé,
 *     et cinq pages en ligne depuis six heures étaient encore datées du 09/09. Google compare
 *     ce `lastmod` à sa dernière lecture : il n'a pas relu le sitemap, et Search Console a
 *     continué d'annoncer quatre pages découvertes ;
 *   - la date du dernier commit ne se lit pas pareil partout : l'image de construction de
 *     Cloudflare Pages clone en profondeur 1, où le commit de tête paraît tout avoir écrit.
 *     Le sitemap servi divergeait alors du sitemap construit ici, aux octets près.
 *
 * Ce qui reste : un registre versionné, `src/data/pages-lastmod.json`, qui associe à chaque page
 * l'empreinte de son HTML rendu et la date où cette empreinte a changé. Il est lu à la
 * construction — donc identique partout — et mis à jour par ce script, jamais par le build.
 * Un contrôle de `tests/proof/test_build.py` refuse un registre périmé : une page dont le rendu
 * a changé sans que sa date suive fait rougir la chaîne au lieu de mentir au robot.
 *
 *   node scripts/sync-lastmod.mjs            met le registre à jour depuis dist/
 *   node scripts/sync-lastmod.mjs --check    ne touche à rien, sort en erreur s'il est périmé
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const REGISTRE = 'src/data/pages-lastmod.json';
const DIST = 'dist';
const controle = process.argv.includes('--check');

/** Le jour, à Paris : une date de modification n'a pas besoin d'être plus fine que la journée. */
const aujourdHui = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
const empreinte = (octets) => createHash('sha256').update(octets).digest('hex');

/** Les routes du sitemap qui ne sont pas des articles : leur date ne vient d'aucun frontmatter. */
export function routesNonEditoriales(dist = DIST) {
  const sitemap = readFileSync(join(dist, 'sitemap-0.xml'), 'utf8');
  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname.replace(/\/$/, '') || '/')
    .filter((route) => !route.startsWith('/blog/'))
    .sort();
}

export function fichierDeRoute(route) {
  return join(DIST, route === '/' ? 'index.html' : `${route.replace(/^\//, '')}.html`);
}

const registre = existsSync(REGISTRE)
  ? JSON.parse(readFileSync(REGISTRE, 'utf8'))
  : { version: 1, regle: '', pages: {} };
registre.regle = 'lastmod = jour où le HTML rendu de la page a changé. Mis à jour par scripts/sync-lastmod.mjs, jamais par le build.';

const routes = routesNonEditoriales();
const bouges = [];
const pages = {};
for (const route of routes) {
  const sha256 = empreinte(readFileSync(fichierDeRoute(route)));
  const precedent = registre.pages[route];
  if (precedent && precedent.sha256 === sha256) {
    pages[route] = precedent;
    continue;
  }
  pages[route] = { sha256, lastmod: aujourdHui };
  bouges.push(route);
}
const disparues = Object.keys(registre.pages).filter((route) => !routes.includes(route));

if (controle) {
  const motifs = [
    ...bouges.map((route) => `${route} : rendu modifié, date du registre périmée`),
    ...disparues.map((route) => `${route} : plus au sitemap, entrée à retirer`),
  ];
  if (motifs.length > 0) {
    console.error('Registre des dates périmé :');
    for (const motif of motifs) console.error(`  - ${motif}`);
    console.error('Rejouer : npm run lastmod:sync');
    process.exit(1);
  }
  console.log(`check : ${routes.length} page(s), registre à jour.`);
} else {
  registre.pages = Object.fromEntries(Object.entries(pages).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(REGISTRE, `${JSON.stringify(registre, null, 2)}\n`);
  console.log(`${routes.length} page(s) au registre ; ${bouges.length} datée(s) du ${aujourdHui}${bouges.length ? ` : ${bouges.join(', ')}` : ''}.`);
  if (disparues.length > 0) console.log(`retirée(s) : ${disparues.join(', ')}`);
}
