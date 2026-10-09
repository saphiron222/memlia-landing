/** Captures depuis l'origine : navigation fixe intacte, continuité avec les voisins. */
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import sharp from 'sharp';

const base = process.env.QA_URL ?? 'http://127.0.0.1:4371';
const out = process.env.QA_OUTPUT ?? '.qa/harmonisation/local';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chromium' });
const reports = [];
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    for (const image of await page.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(img => img.decode());
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    const screen = await page.screenshot({ fullPage: true, animations: 'disabled' });
    await sharp(screen).png().toFile(`${out}/page-${width}.png`);
    const box = await page.locator('#usages').boundingBox();
    assert.ok(box);
    await sharp(screen).extract({ left: Math.floor(box.x), top: Math.floor(box.y), width: Math.ceil(box.width), height: Math.ceil(box.height) + 16 }).png().toFile(`${out}/bento-${width}.png`);
    const report = await page.evaluate(() => {
      const style = el => {
        const s = getComputedStyle(el);
        return Object.fromEntries(['color', 'backgroundColor', 'backgroundImage', 'width', 'height', 'border', 'borderRadius', 'display', 'placeItems'].map(k => [k, s[k]]));
      };
      const section = document.querySelector('#usages');
      const text = el => el.textContent.replace(/\s+/g, ' ').trim();
      return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        section: style(section),
        cards: [...section.querySelectorAll('[data-usage]')].map(el => ({ id: el.getAttribute('data-usage'), text: text(el), card: style(el), title: style(el.querySelector('h3')), body: style(el.querySelector('p')), mark: style(el.querySelector('.carte-icone')), svg: style(el.querySelector('svg')) })),
        method: [...document.querySelectorAll('#methode [data-etape]')].map(el => ({ text: text(el.querySelector('.step-copy')), image: el.querySelector('img').getAttribute('src'), alt: el.querySelector('img').alt })),
        overflow: [section, ...section.querySelectorAll('*')].filter(el => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1 || el.scrollWidth > el.clientWidth + 1);
        }).map(el => el.tagName + '.' + el.className),
      };
    });
    assert.equal(report.cards.length, 5);
    assert.equal(report.method.length, 4);
    assert.ok(report.scrollWidth <= width);
    assert.deepEqual(report.overflow, []);
    reports.push(report);
  }
} finally { await browser.close(); }
writeFileSync(`${out}/measurements.json`, JSON.stringify({ base, reports }, null, 2));
console.log(JSON.stringify({ base, widths: reports.length, screenshots: reports.length * 2, out }));
