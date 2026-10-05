#!/usr/bin/env node
/** Comparaison de deux builds de /, sans modifier les sources ni mettre à jour le témoin. */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const [beforeUrl, afterUrl, output = '.qa/accueil-comparison'] = process.argv.slice(2);
if (!beforeUrl || !afterUrl) throw new Error('Usage : node scripts/compare-accueil.mjs URL_AVANT URL_APRES [dossier]');
const urls = [beforeUrl, afterUrl].map(value => {
  const url = new URL(value);
  assert.equal(url.pathname, '/');
  assert.equal(url.search, '');
  assert.equal(url.hash, '');
  return url.href;
});
await mkdir(output, { recursive: true });
const headers = { 'Cache-Control': 'no-cache' };
const html = await Promise.all(urls.map(async url => {
  const response = await fetch(url, { headers });
  assert.equal(response.status, 200, url);
  return Buffer.from(await response.arrayBuffer());
}));
assert.ok(html[0].equals(html[1]), 'HTML complet différent');
const browser = await chromium.launch();
const results = [];
try {
  for (const width of [375, 1440]) {
    const images = [];
    for (const [index, url] of urls.entries()) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce', extraHTTPHeaders: headers });
      try {
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.evaluate(async () => {
          await document.fonts.ready;
          document.querySelectorAll('video').forEach(video => { video.pause(); video.currentTime = 0; });
          for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(done => setTimeout(done, 20)); }
          window.scrollTo(0, 0);
        });
        const image = await page.screenshot({ path: resolve(output, `${index === 0 ? 'before' : 'after'}-${width}.png`), fullPage: true, animations: 'disabled' });
        images.push(await sharp(image).raw().toBuffer({ resolveWithObject: true }));
      } finally { await page.close(); }
    }
    assert.deepEqual(images[0].info, images[1].info, `Dimensions ${width}`);
    assert.ok(images[0].data.equals(images[1].data), `Pixels différents à ${width}px`);
    results.push({ width, height: images[0].info.height, identicalPixels: true });
  }
} finally { await browser.close(); }
const report = { htmlBytes: html[0].length, identicalHtml: true, captures: results };
await writeFile(resolve(output, 'comparison.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
