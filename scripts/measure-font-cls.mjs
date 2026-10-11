// Isolated mobile laboratory runs; never interpreted as field/INP evidence.
// node scripts/measure-font-cls.mjs http://127.0.0.1:4377 .qa/font-cls/before
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const [base, output] = process.argv.slice(2);
if (!base || !output) throw new Error('Usage: measure-font-cls.mjs BASE_URL OUTPUT_DIR');
mkdirSync(output, { recursive: true });
const routes = ['/glossaire', '/integrations/bulletin-de-paie-silae', '/integrations/saisie-comptable-sage'];
const runs = [];
for (const route of routes) {
  for (let run = 1; run <= 3; run++) {
    const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless=new', '--no-first-run'] });
    try {
      const { lhr } = await lighthouse(new URL(route, base).href, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance'] });
      const file = `${route.slice(1).replaceAll('/', '-')}-${run}.json`;
      writeFileSync(join(output, file), JSON.stringify(lhr));
      const result = { route, run, report: file, version: lhr.lighthouseVersion, cls: lhr.audits['cumulative-layout-shift'].numericValue, lcp: lhr.audits['largest-contentful-paint'].numericValue, settings: lhr.configSettings };
      runs.push(result); console.log(JSON.stringify({ ...result, settings: undefined }));
    } finally { await chrome.kill(); }
  }
}
const median = values => [...values].sort((a,b) => a-b)[1];
const medians = routes.map(route => ({ route, cls: median(runs.filter(r => r.route === route).map(r => r.cls)), lcp: median(runs.filter(r => r.route === route).map(r => r.lcp)) }));
writeFileSync(join(output, 'summary.json'), JSON.stringify({ base, kind: 'mobile laboratory, Lighthouse defaults, isolated Chrome per run', runs, medians }, null, 2));
console.log(JSON.stringify(medians));
