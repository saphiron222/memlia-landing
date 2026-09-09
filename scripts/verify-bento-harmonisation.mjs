/** Chaîne indépendante : périmètre, copie, palette rendue et contrastes composites. */
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import sharp from 'sharp';

const root = '.qa/harmonisation';
const before = JSON.parse(readFileSync(`${root}/before/measurements.json`, 'utf8'));
const after = JSON.parse(readFileSync(`${root}/local/measurements.json`, 'utf8'));
assert.equal(before.reports.length, 6);
assert.equal(after.reports.length, 6);
const changed = execFileSync('git', ['diff', '--name-only', 'a1f817d1624336e707780a3a14bec20de4ff5faf', '--', 'src', 'public'], { encoding: 'utf8' }).trim().split('\n');
assert.deepEqual(changed, ['src/components/sections/Usages.astro']);
const browser = await chromium.launch({ channel: 'chromium' });
let preservation;
try {
  const page = await browser.newPage();
  preservation = await page.evaluate(({ old, current }) => {
    const normalize = html => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const removed = { bento: doc.querySelectorAll('#usages').length, styles: doc.querySelectorAll('style, link[rel="stylesheet"]').length, scopes: 0 };
      doc.querySelectorAll('#usages, style, link[rel="stylesheet"]').forEach(el => el.remove());
      for (const el of doc.querySelectorAll('*')) for (const a of [...el.attributes]) if (a.name.startsWith('data-astro-cid-')) {
        el.removeAttribute(a.name);
        removed.scopes++;
      }
      return { html: doc.documentElement.outerHTML, removed };
    };
    const a = normalize(old), b = normalize(current);
    return { identical: a.html === b.html, before: a.removed, after: b.removed };
  }, { old: readFileSync(`${root}/baseline.html`, 'utf8'), current: readFileSync('dist/index.html', 'utf8') });
} finally { await browser.close(); }
assert.ok(preservation.identical);
assert.equal(preservation.before.bento, 1);
assert.deepEqual(preservation.before, preservation.after);
const rgb = css => css.match(/[\d.]+/g).map(Number);
const composite = (color, background) => {
  const [r, g, b, alpha = 1] = rgb(color), bg = rgb(background);
  return [r, g, b].map((v, i) => v * alpha + bg[i] * (1 - alpha));
};
const luminance = channels => channels.map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
const contrast = (fg, bg) => {
  const a = luminance(composite(fg, bg)), b = luminance(rgb(bg));
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
};
const measurements = [];
for (let i = 0; i < after.reports.length; i++) {
  const a = before.reports[i], b = after.reports[i];
  assert.equal(a.width, b.width);
  assert.deepEqual(a.cards.map(c => [c.id, c.text]), b.cards.map(c => [c.id, c.text]));
  assert.deepEqual(a.method, b.method);
  assert.equal(b.cards.length, 5);
  assert.deepEqual(b.overflow, []);
  for (const card of b.cards) {
    assert.deepEqual(card.mark, b.cards[0].mark);
    const body = contrast(card.body.color, card.card.backgroundColor);
    const title = contrast(card.title.color, card.card.backgroundColor);
    const icon = contrast(card.mark.color, card.mark.backgroundColor);
    assert.ok(body >= 4.5 && title >= 4.5);
    measurements.push({ width: b.width, id: card.id, title, body, decorativeIcon: icon });
  }
}
for (const width of [1440, 375]) {
  const a = await sharp(`${root}/before/bento-${width}.png`).resize({ width: 720 }).toBuffer();
  const b = await sharp(`${root}/local/bento-${width}.png`).resize({ width: 720 }).toBuffer();
  const am = await sharp(a).metadata(), bm = await sharp(b).metadata();
  await sharp({ create: { width: 1440, height: Math.max(am.height, bm.height), channels: 3, background: '#fcfbf7' } })
    .composite([{ input: a, left: 0, top: 0 }, { input: b, left: 720, top: 0 }]).png().toFile(`${root}/avant-apres-${width}.png`);
}
writeFileSync(`${root}/independent.json`, JSON.stringify({ changed, preservation, measurements, beforeLeftAfterRight: true }, null, 2));
console.log(JSON.stringify({ changed, preservation, checkedCards: measurements.length, contrast: measurements[0] }, null, 2));
