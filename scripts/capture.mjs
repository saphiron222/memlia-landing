import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const base = process.env.QA_URL ?? 'http://127.0.0.1:4321';
mkdirSync('.qa/screens', { recursive: true });
const browser = await chromium.launch({ channel: 'chromium' });
const reports = [];
try {
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    // Parcourir chaque viewport : sauter au centre des grandes sections omet des .rv.
    for (let top = 0; top < await page.evaluate(() => document.documentElement.scrollHeight); top += 450) {
      await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), top);
      await page.waitForTimeout(100);
    }
    await page.waitForTimeout(1100);
    if (await page.locator('.rv:not(.in)').count()) throw new Error('Révélations incomplètes avant capture');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(2100);
    await page.screenshot({ path: `.qa/screens/${width}-hero.png` });
    await page.screenshot({ path: `.qa/screens/${width}-full.png`, fullPage: true });
    for (const id of ['modules', 'methode', 'questions']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      await page.screenshot({ path: `.qa/screens/${width}-${id}.png` });
    }
    reports.push({ width, errors, images: await page.locator('img').evaluateAll(images => images.map(image => ({ src: image.currentSrc, width: image.naturalWidth, rendered: image.getClientRects().length > 0, loaded: image.complete && image.naturalWidth > 0 }))) });
    await page.close();
  }
} finally { await browser.close(); }
writeFileSync('.qa/screens/report.json', JSON.stringify(reports, null, 2));
console.log(JSON.stringify(reports.map(r => ({ width: r.width, errors: r.errors, images: r.images.length, hiddenImages: r.images.filter(i => !i.rendered).length, brokenImages: r.images.filter(i => i.rendered && !i.loaded).length })), null, 2));
if (reports.some(r => r.errors.length || r.images.some(i => i.rendered && !i.loaded))) process.exitCode = 1;
