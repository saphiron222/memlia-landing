import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const base = process.env.QA_URL ?? 'http://127.0.0.1:4337';
const output = process.env.QA_OUTPUT ?? '.qa/m4-r3';
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chromium', headless: false });
const report = { base, screens: [], proofs: [], playback: null, errors: [] };
try {
  for (const width of [1440, 375]) {
    const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 1000 : 812 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => report.errors.push(error.message));
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('video').evaluate(v => v.readyState >= 1 ? Promise.resolve() : new Promise(resolve => v.addEventListener('loadedmetadata', resolve, { once: true })));
    const screen = `${output}/hero-${width}.png`;
    await page.screenshot({ path: screen });
    report.screens.push(screen);
    const mediaScreen = `${output}/hero-player-${width}.png`;
    await page.locator('.hero-cadre').screenshot({ path: mediaScreen });
    report.screens.push(mediaScreen);
    for (const proof of await page.locator('[data-proof]').all()) {
      await proof.scrollIntoViewIfNeeded();
      await proof.locator('img').evaluate(i => i.decode());
      const id = await proof.getAttribute('data-proof');
      const path = `${output}/proof-${id}-${width}.png`;
      await proof.screenshot({ path });
      report.proofs.push({ id, width, path });
    }
    if (width === 1440) {
      await page.locator('video').scrollIntoViewIfNeeded();
      await page.locator('video').focus();
      await page.keyboard.press('Space');
      await page.waitForFunction(() => document.querySelector('video').currentTime > 30, null, { timeout: 60000 });
      await page.locator('.hero-ecran').screenshot({ path: `${output}/video-playing-1440.png` });
      await page.waitForFunction(() => document.querySelector('video').ended, null, { timeout: 60000 });
      report.playback = await page.locator('video').evaluate((/** @type {HTMLVideoElement} */ v) => ({ duration: v.duration, time: v.currentTime, ended: v.ended, muted: v.muted, volume: v.volume, audioBytes: v.webkitAudioDecodedByteCount, tracks: [...v.textTracks].map(t => ({ language: t.language, mode: t.mode, cues: t.cues.length })), quality: { total: v.getVideoPlaybackQuality().totalVideoFrames, dropped: v.getVideoPlaybackQuality().droppedVideoFrames } }));
    }
    for (const route of ['/blog', '/blog/controler-les-bulletins-de-paie-avant-la-dsn', '/blog/suivre-la-production-sociale-dans-excel', '/mentions-legales', '/politique-de-confidentialite']) {
      await page.goto(base + route);
      await page.evaluate(() => document.fonts.ready);
      const path = `${output}/${route.replaceAll('/', '-')}-${width}.png`;
      await page.screenshot({ path });
      report.screens.push(path);
      for (const figure of await page.locator('.article-couverture').all()) {
        await figure.scrollIntoViewIfNeeded();
        await figure.locator('img').evaluate(i => i.decode());
        const mediaPath = `${output}/${route.replaceAll('/', '-')}-media-${width}.png`;
        await figure.screenshot({ path: mediaPath });
        report.screens.push(mediaPath);
      }
    }
    await page.close();
  }
} finally {
  await browser.close();
  writeFileSync(`${output}/screen-report.json`, JSON.stringify(report, null, 2));
}
if (report.errors.length) throw new Error(JSON.stringify(report.errors));
console.log(JSON.stringify(report, null, 2));
