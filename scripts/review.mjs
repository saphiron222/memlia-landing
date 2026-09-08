import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const base = process.env.QA_URL ?? 'http://localhost:4331';
const out = process.env.QA_PHASE ?? 'before';
const dir = `.qa/review-${out}`;
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ channel: 'chromium' });
const reports = [];
try {
  for (const [width, height] of [[1440,900],[1366,768],[1024,768],[768,1024],[375,812],[320,740]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2100);
    await page.screenshot({ path: `${dir}/${width}-hero.png` });
    const hero = await page.locator('.hero-boutons').evaluate(el => ({ bottom: el.getBoundingClientRect().bottom, height: window.innerHeight }));
    for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += Math.floor(height / 2)) {
      await page.evaluate(y => window.scrollTo({top:y,behavior:'instant'}), y);
      await page.waitForTimeout(100);
    }
    await page.waitForTimeout(1100);
    const unrevealed = await page.locator('.rv:not(.in)').count();
    await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${dir}/${width}-full.png`, fullPage: true });
    for (const id of ['modules','methode','questions']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      await page.screenshot({ path: `${dir}/${width}-${id}.png` });
    }
    let menu = null;
    if (width < 1024) {
      await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
      await page.locator('[data-burger]').click();
      await page.screenshot({path:`${dir}/${width}-menu.png`});
      menu = await page.locator('#menu-mobile').evaluate(el => ({height:el.getBoundingClientRect().height,scrollHeight:el.scrollHeight}));
      await page.locator('#menu-mobile a').last().focus();
      await page.keyboard.press('Tab');
      menu.hiddenAfterExit = await page.locator('#menu-mobile').evaluate(el => el.hidden);
    }
    reports.push({width,height,hero,unrevealed,menu});
    await page.close();
  }
} finally { await browser.close(); }
writeFileSync(`${dir}/report.json`, JSON.stringify(reports,null,2));
console.log(JSON.stringify(reports,null,2));
