/**
 * Mesure Lighthouse d'une URL (par défaut le preview local) sur les quatre axes.
 *
 * Ne prétend rien : le script imprime les scores mesurés et sort en erreur si l'un d'eux
 * est sous le plancher (95 par défaut, consigne du 08/09/2026). Le rapport JSON complet est
 * écrit dans .lighthouse/ (ignoré par git) pour lire le détail des audits.
 *
 * Usage :
 *   npm run preview                      # dans un autre terminal, après npm run build
 *   npm run lighthouse -- [url] [--desktop] [--seuil=95] [--robots-crawler]
 * --robots-crawler : collecte HTTP hors document, audit robots natif inchangé.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import lighthouse from 'lighthouse';
import defaultConfig from 'lighthouse/core/config/default-config.js';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from '@playwright/test';
import CrawlerRobots, { withRobotsCrawler } from './lib/lighthouse-robots-crawler.mjs';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOSSIER_RAPPORTS = join(RACINE, '.lighthouse');

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith('--')) ?? 'http://localhost:4321/';
const desktop = args.includes('--desktop');
const seuilArg = args.find((a) => a.startsWith('--seuil='));
const seuil = seuilArg ? Number(seuilArg.split('=')[1]) : 95;
if (!Number.isFinite(seuil) || seuil < 0 || seuil > 100) {
  console.error(`[lighthouse] seuil invalide : ${seuilArg}`);
  process.exit(2);
}

const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];
const robotsCrawler = args.includes('--robots-crawler') ? new CrawlerRobots() : null;
const config = {
  ...withRobotsCrawler(defaultConfig, robotsCrawler),
  settings: {
    ...defaultConfig.settings,
    ...(desktop ? {
    formFactor: 'desktop',
    screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
    throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
    } : {}),
  },
};

const chrome = await chromeLauncher.launch({ chromePath: process.env.CHROME_PATH ?? chromium.executablePath(), chromeFlags: ['--headless=new', '--no-first-run'] });
try {
  const resultat = await lighthouse(
    url,
    { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: CATEGORIES },
    config
  );
  if (!resultat) throw new Error('Lighthouse n’a rien renvoyé.');

  const { lhr } = resultat;
  const scores = CATEGORIES.map((c) => ({
    categorie: lhr.categories[c]?.title ?? c,
    score: Math.round((lhr.categories[c]?.score ?? 0) * 100),
  }));

  mkdirSync(DOSSIER_RAPPORTS, { recursive: true });
  const horodatage = new Date().toISOString().replace(/[:.]/g, '-');
  const chemin = join(DOSSIER_RAPPORTS, `${desktop ? 'desktop' : 'mobile'}-${horodatage}.json`);
  writeFileSync(chemin, JSON.stringify(lhr, null, 2));
  writeFileSync(chemin.replace('.json', '.collector.json'), JSON.stringify({
    robotsCollector: robotsCrawler ? 'http-outside-document' : 'lighthouse-default',
    robotsEvidence: robotsCrawler?.evidence ?? null,
    robotsAudit: 'lighthouse/core/audits/seo/robots-txt.js (non modifié)',
    lighthouseVersion: lhr.lighthouseVersion,
    hostUserAgent: lhr.environment.hostUserAgent,
  }, null, 2));

  console.log(`\nLighthouse ${lhr.lighthouseVersion} — ${url} (${desktop ? 'desktop' : 'mobile'})`);
  console.log(`  robots : ${robotsCrawler ? 'HTTP hors document, audit natif' : 'collecteur Lighthouse par défaut'}`);
  for (const s of scores) {
    const ok = s.score >= seuil;
    console.log(`  ${ok ? '✓' : '✗'} ${s.categorie.padEnd(16)} ${String(s.score).padStart(3)}`);
  }
  console.log(`  rapport : ${chemin}\n`);

  const sousSeuil = scores.filter((s) => s.score < seuil);
  if (sousSeuil.length > 0) {
    console.error(`[lighthouse] ${sousSeuil.length} axe(s) sous le plancher ${seuil}.`);
    process.exitCode = 1;
  }
} finally {
  await chrome.kill();
}
