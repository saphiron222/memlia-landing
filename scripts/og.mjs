/** Montage OG M3-S : logo et fontes réellement rendus par la landing, aucun texte généré. */
import { chromium } from '@playwright/test';
import { resolve } from 'node:path';

const browser = await chromium.launch({ channel: 'chromium' });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await page.goto(process.env.QA_URL ?? 'http://127.0.0.1:4321');
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    const logo = document.querySelector('.lockup').cloneNode(true);
    logo.removeAttribute('href');
    document.body.replaceChildren();
    const main = document.createElement('main');
    main.className = 'og';
    main.append(logo);
    const title = document.createElement('h1');
    title.textContent = 'Automatisation IA pour cabinets comptables';
    const text = document.createElement('p');
    text.textContent = 'Votre cabinet garde la décision.';
    main.append(title, text);
    document.body.append(main);
  });
  await page.addStyleTag({ content: `
    html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: #fcfbf7; }
    .og { padding: 64px 80px; display: grid; gap: 40px; align-content: start; }
    .og .lockup { font-size: 42px; justify-self: start; }
    .og h1 { font-size: 72px; line-height: 1.12; max-width: 1000px; margin: 16px 0 0; text-wrap: balance; }
    .og p { font-size: 28px; color: var(--texte-2); margin: 0; }
  ` });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve('public/assets/og-memlia.png') });
  console.log('OG 1200 × 630 monté depuis le lockup et les fontes du site.');
} finally { await browser.close(); }
