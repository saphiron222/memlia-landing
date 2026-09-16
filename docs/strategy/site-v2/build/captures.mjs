#!/usr/bin/env node
/**
 * Captures pleine page des routes du site v2, desktop 1440 et mobile 375.
 *
 * Chaque page est parcourue de haut en bas avant la capture : les blocs révélés au
 * défilement resteraient sinon invisibles sur l'image, et la capture montrerait un
 * état que personne ne voit. Le manifeste garde l'empreinte de chaque fichier.
 *
 * Usage : node docs/strategy/site-v2/build/captures.mjs <origine>
 */
import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const origine = process.argv[2] ?? 'http://127.0.0.1:4321';
const DOSSIER = 'docs/strategy/site-v2/build/captures';
const ROUTES = ['/', '/automatisation-cabinet-comptable', '/methode', '/garanties', '/a-propos', '/contact', '/blog'];
const PROFILS = [
  { nom: 'desktop1440', viewport: { width: 1440, height: 900 } },
  { nom: 'mobile375', viewport: { width: 375, height: 812 } },
];

mkdirSync(DOSSIER, { recursive: true });
const navigateur = await chromium.launch({ channel: 'chromium' });
const manifeste = [];
try {
  for (const profil of PROFILS) {
    for (const route of ROUTES) {
      const page = await navigateur.newPage({ viewport: profil.viewport });
      const erreurs = [];
      page.on('pageerror', (e) => erreurs.push(e.message));
      page.on('response', (r) => { if (r.status() >= 400) erreurs.push(`${r.status()} ${r.url()}`); });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(`${origine}${route}`);
      await page.evaluate(() => document.fonts.ready);
      const hauteur = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let haut = 0; haut < hauteur; haut += 400) {
        await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), haut);
        await page.waitForTimeout(60);
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(400);
      // JPEG : une capture de mise en page reste lisible, et quatorze PNG pleine page
      // pesaient 7,8 Mo dans un dépôt qui les garde pour toujours.
      const nom = `${profil.nom}${route === '/' ? '-accueil' : route.replace(/\//g, '-')}.jpg`;
      const chemin = `${DOSSIER}/${nom}`;
      await page.screenshot({ path: chemin, fullPage: true, animations: 'disabled', type: 'jpeg', quality: 80 });
      const octets = readFileSync(chemin);
      const debordement = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      manifeste.push({ route, profil: profil.nom, fichier: chemin, octets: octets.length, sha256: createHash('sha256').update(octets).digest('hex'), hauteurPage: hauteur, debordementHorizontal: debordement, erreurs });
      console.log(`${profil.nom} ${route} — ${Math.round(octets.length / 1024)} Ko, page ${hauteur}px, débordement ${debordement}px${erreurs.length ? `, ${erreurs.length} erreur(s)` : ''}`);
      await page.close();
    }
  }
} finally {
  await navigateur.close();
}
const enErreur = manifeste.filter((m) => m.erreurs.length > 0 || m.debordementHorizontal > 0);
writeFileSync(`${DOSSIER}/manifeste.json`, `${JSON.stringify({ schemaVersion: 1, origine, captures: manifeste, resultat: enErreur.length === 0 ? 'PASS' : 'FAIL' }, null, 2)}\n`);
console.log(`\n${manifeste.length} captures — ${enErreur.length === 0 ? 'PASS' : `FAIL sur ${enErreur.length}`}`);
process.exitCode = enErreur.length === 0 ? 0 : 1;
