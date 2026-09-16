import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const base = process.env.QA_URL;
const path = '/blog/comprendre-les-comptes-rendus-metier-dsn';
const out = process.argv[2];
mkdirSync(out, { recursive: true });
const widths = [320, 375, 768, 1024, 1440, 1920];
const browser = await chromium.launch({ channel: 'chromium' });
const results = [];
for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  const resp = await page.goto(base + path, { waitUntil: 'networkidle' });
  const r = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth,
    h1: document.querySelectorAll('h1').length,
    imgs: [...document.querySelectorAll('main img, article img')].map(i => ({ src: (i.currentSrc || i.src).replace(location.origin, ''), ok: i.complete && i.naturalWidth > 0, alt: i.alt })),
    title: document.title,
  }));
  results.push({ width: w, status: resp.status(), overflow: r.scrollWidth > r.innerWidth, ...r });
  if (w === 375 || w === 1440) {
    await page.screenshot({ path: `${out}/article-${w}-first-view.png` });
    await page.screenshot({ path: `${out}/article-${w}-fullpage.png`, fullPage: true });
  }
  await page.close();
}
await browser.close();
writeFileSync(`${out}/viewport-checks.json`, JSON.stringify(results, null, 2));
for (const r of results) console.log(`${r.width}px status=${r.status} overflow=${r.overflow} h1=${r.h1} imgs=${r.imgs.length} imgsOK=${r.imgs.every(i => i.ok)}`);
