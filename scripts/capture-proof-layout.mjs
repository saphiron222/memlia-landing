import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const base = process.env.QA_URL ?? 'http://127.0.0.1:4337';
const out = process.env.QA_OUT ?? '.qa/m4-r5/screens';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: false });
const report = { base, widths: [], errors: [] };
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  page.on('pageerror', error => report.errors.push(error.message));
  for (const width of [320, 375, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    const proofs = page.locator('.functional-proof');
    if (await proofs.count() !== 9) throw new Error('Neuf preuves attendues');
    for (const figure of await proofs.all()) {
      await figure.scrollIntoViewIfNeeded();
      await figure.locator('img').evaluate(img => img.decode());
    }
    // Déclencher toutes les révélations avant une capture pleine page, pas neuf images seulement.
    for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 600) {
      await page.evaluate(y => scrollTo(0, y), y);
      await page.waitForTimeout(25);
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `${out}/full-${width}.png`, fullPage: true });
    const items = [];
    for (const figure of await proofs.all()) {
      const id = await figure.getAttribute('data-proof');
      const row = figure.locator('xpath=ancestor::*[@data-proof-row][1]');
      const capture = await row.count() ? row : figure;
      await capture.scrollIntoViewIfNeeded();
      await capture.screenshot({ path: `${out}/${id}-${width}.png` });
      items.push(await figure.evaluate(figure => {
        const img = figure.querySelector('img');
        const row = figure.closest('[data-proof-row]');
        const copy = row?.querySelector('[data-proof-copy]');
        const rect = e => e?.getBoundingClientRect().toJSON() ?? null;
        return { id: figure.dataset.proof, image: rect(img), row: rect(row), copy: rect(copy),
          fit: getComputedStyle(img).objectFit, natural: [img.naturalWidth, img.naturalHeight],
          imageText: img.alt, clickable: !!figure.closest('a,button,[role="button"]'), tabIndex: img.tabIndex };
      }));
    }
    report.widths.push({ width, pageHeight: await page.evaluate(() => document.documentElement.scrollHeight),
      overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), items });
    writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2));
  }
} finally { await browser.close(); }
console.log(JSON.stringify({ base, widths: report.widths.map(w => ({ width: w.width, count: w.items.length, height: w.pageHeight, overflow: w.overflow })), errors: report.errors }));
