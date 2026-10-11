import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const origin = process.argv[2];
if (!origin) throw new Error('Origine de preview requise');
const out = '.qa/entrees-sorties-salaries';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chromium' });
try {
  for (const width of [375, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    for (const slug of ['automatisation/entrees-sorties-salaries', 'automatisation/paie', 'blog/controler-les-bulletins-de-paie-avant-la-dsn']) {
      await page.goto(`${origin}/${slug}`);
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          scrollTo({ top: y, behavior: 'instant' }); await new Promise(resolve => setTimeout(resolve, 250));
        }
        scrollTo({ top: 0, behavior: 'instant' });
      });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${out}/${slug.split('/').pop()}-${width}.png`, fullPage: true });
    }
    await page.close();
  }
  const response = await fetch(`${origin}/automatisation/entrees-sorties-salaries`, { headers: { 'Cache-Control': 'no-cache' } });
  const html = await response.text();
  writeFileSync(`${out}/http.json`, JSON.stringify({ origin, status: response.status, url: response.url, observedAt: new Date().toISOString(), canonical: html.match(/rel="canonical" href="([^"]+)"/)?.[1], coverage: html.includes('Ce que votre logiciel fait déjà'), noindex: /name="robots" content="[^"]*noindex/.test(html) }, null, 2)+'\n');
} finally { await browser.close(); }
