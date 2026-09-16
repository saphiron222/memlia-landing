#!/usr/bin/env node
/**
 * Médiane de trois mesures Lighthouse par gabarit et par profil.
 *
 * Une mesure unique ne prouve rien : le bruit d'une exécution dépasse souvent l'écart
 * qu'on prétend mesurer. On garde la médiane de trois, et on imprime les trois valeurs
 * pour qu'un lecteur voie la dispersion plutôt qu'un chiffre isolé.
 *
 * Usage : node docs/strategy/site-v2/build/lighthouse-medianes.mjs <origine>
 */
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const origine = process.argv[2] ?? 'http://127.0.0.1:4321';
const SEUIL = 95;
const GABARITS = [
  { gabarit: 'accueil', route: '/' },
  { gabarit: 'page commerciale', route: '/methode' },
  { gabarit: 'liste blog', route: '/blog' },
  { gabarit: 'article', route: '/blog/controler-les-bulletins-de-paie-avant-la-dsn' },
  { gabarit: 'hub ressources', route: '/ressources' },
  { gabarit: 'glossaire', route: '/glossaire' },
];
// Les axes ne sont pas devinés : on enregistre les intitulés que Lighthouse a rendus.

const mediane = (valeurs) => [...valeurs].sort((a, b) => a - b)[Math.floor(valeurs.length / 2)];

function mesurer(url, desktop) {
  const run = spawnSync(process.execPath, ['scripts/lighthouse.mjs', url, ...(desktop ? ['--desktop'] : []), '--seuil=0'], { encoding: 'utf8' });
  const scores = {};
  for (const ligne of (run.stdout ?? '').split('\n')) {
    const trouve = ligne.match(/^\s+[✓✗]\s+(.+?)\s{2,}(\d+)\s*$/);
    if (trouve) scores[trouve[1].trim()] = Number(trouve[2]);
  }
  if (Object.keys(scores).length !== 4) throw new Error(`Lighthouse n'a pas rendu quatre axes pour ${url} : ${run.stdout}\n${run.stderr}`);
  return scores;
}

const lignes = [];
for (const { gabarit, route } of GABARITS) {
  for (const profil of ['mobile', 'desktop']) {
    const passes = [mesurer(`${origine}${route}`, profil === 'desktop'), mesurer(`${origine}${route}`, profil === 'desktop'), mesurer(`${origine}${route}`, profil === 'desktop')];
    const axes = Object.fromEntries(Object.keys(passes[0]).map((axe) => [axe, { passes: passes.map((p) => p[axe]), mediane: mediane(passes.map((p) => p[axe])) }]));
    const sousSeuil = Object.entries(axes).filter(([, v]) => v.mediane < SEUIL).map(([axe]) => axe);
    lignes.push({ gabarit, route, profil, axes, sousSeuil, resultat: sousSeuil.length === 0 ? 'PASS' : 'FAIL' });
    console.log(`${gabarit} ${profil} : ${Object.entries(axes).map(([axe, v]) => `${axe} ${v.mediane} [${v.passes.join(' ')}]`).join(' · ')} → ${sousSeuil.length === 0 ? 'PASS' : `FAIL ${sousSeuil.join(', ')}`}`);
  }
}

const rapport = {
  schemaVersion: 1,
  origine,
  seuil: SEUIL,
  regle: 'Médiane de trois mesures par gabarit et par profil ; les trois passes sont conservées pour montrer la dispersion.',
  axes: Object.keys(lignes[0].axes),
  mesures: lignes,
  resultat: lignes.every((l) => l.resultat === 'PASS') ? 'PASS' : 'FAIL',
};
writeFileSync('docs/strategy/site-v2/build/lighthouse-medianes.json', `${JSON.stringify(rapport, null, 2)}\n`);
console.log(`\n${rapport.resultat} — rapport écrit dans docs/strategy/site-v2/build/lighthouse-medianes.json`);
process.exitCode = rapport.resultat === 'PASS' ? 0 : 1;
