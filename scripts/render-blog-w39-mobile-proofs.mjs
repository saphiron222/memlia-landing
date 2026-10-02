import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

// Portrait transcriptions of the W39 landscape proofs. Their wording is
// reviewed against the original WebP; never substitute these for a product test.
const source = 'docs/design/blog-w39-mobile-proofs/index.html';
const manifestPath = 'docs/qa/blog-w39-mobile-proofs.json';
const ids = ['w39-prompt-brouillon', 'w39-prompt-arret', 'w39-logiciel-parcours', 'w39-logiciel-exceptions',
  'w39-trois-passes', 'w39-reference-decalee'];
const check = process.argv.includes('--check');
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const sources = [source, 'scripts/render-blog-w39-mobile-proofs.mjs', ...ids.map((id) => `public/proofs/blog/${id}.webp`)]
  .map((path) => ({ path, sha256: sha256(readFileSync(path)) }));
const previous = check ? JSON.parse(readFileSync(manifestPath, 'utf8')) : null;
if (check) {
  assert.deepEqual(previous.sources, sources, 'Source ou preuve paysage W39 périmée');
  assert.deepEqual(previous.entries.map(({ id }) => id), ids);
  for (const entry of previous.entries) {
    assert.ok(existsSync(entry.target), `Preuve mobile absente : ${entry.target}`);
    assert.equal(sha256(readFileSync(entry.target)), entry.sha256, `Preuve mobile périmée : ${entry.target}`);
  }
}
if (check && process.env.CF_PAGES === '1') {
  console.log(`check Cloudflare : ${ids.length} transcriptions W39 et actifs portrait scellés.`);
  process.exit(0);
}
const browser = await chromium.launch({ channel: 'chromium' });
try {
  const page = await browser.newPage({ viewport: { width: 360, height: 900 }, deviceScaleFactor: 3 });
  await page.goto(pathToFileURL(resolve(source)).href);
  await page.evaluate(() => document.fonts.ready);
  assert.deepEqual(await page.locator('.frame').evaluateAll((nodes) => nodes.map((node) => node.id)), ids);
  await page.addStyleTag({ content: 'main{display:block}.frame{display:none}.frame[data-render]{display:grid}' });
  const entries = [];
  mkdirSync('.qa/annotations/blog-w39-mobile', { recursive: true });
  for (const id of ids) {
    await page.evaluate((target) => {
      document.querySelector('[data-render]')?.removeAttribute('data-render');
      document.getElementById(target).setAttribute('data-render', '');
    }, id);
    const frame = page.locator(`#${id}`);
    const measured = await frame.evaluate((root) => {
      const nodes = [];
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) if (walker.currentNode.textContent.trim()) nodes.push(walker.currentNode);
      const box = root.getBoundingClientRect();
      const clipped = nodes.filter((node) => {
        const range = document.createRange(); range.selectNodeContents(node);
        return [...range.getClientRects()].some((rect) => rect.left < box.left - 1 || rect.right > box.right + 1 || rect.bottom > box.bottom + 1);
      }).map((node) => node.textContent.trim());
      return { width: box.width, overflow: root.scrollWidth > root.clientWidth, clipped,
        fontSize: Math.min(...nodes.map((node) => parseFloat(getComputedStyle(node.parentElement).fontSize))),
        text: nodes.flatMap((node) => node.textContent.trim().split(/\s+/)).join(' ') };
    });
    assert.equal(measured.width, 360, `Largeur ${id}`);
    assert.equal(measured.overflow, false, `Débordement ${id}`);
    assert.deepEqual(measured.clipped, [], `Texte coupé ${id}`);
    assert.ok(measured.fontSize >= 18, `Texte illisible ${id}`);
    if (check) assert.equal(measured.text, previous.entries.find((entry) => entry.id === id).text, `Transcription modifiée : ${id}`);
    const png = await frame.screenshot({ path: `.qa/annotations/blog-w39-mobile/${id}.png`, animations: 'disabled' });
    const webp = await sharp(png).resize({ width: 1200 }).webp({ quality: 86, effort: 6 }).toBuffer();
    assert.ok(webp.length < 250_000, `Preuve trop lourde : ${id}`);
    const target = `public/proofs/blog/${id}-mobile.webp`;
    if (check) assert.equal(sha256(webp), previous.entries.find((entry) => entry.id === id).sha256, `Rendu divergent : ${id}`);
    else writeFileSync(target, webp);
    entries.push({ id, target, sha256: sha256(webp), bytes: webp.length, text: measured.text });
  }
  if (!check) writeFileSync(manifestPath, `${JSON.stringify({ capturedAt: new Date().toISOString(), sources, entries }, null, 2)}\n`);
  console.log(`${check ? 'check' : 'render'} : ${entries.length} preuves W39 portrait conformes.`);
} finally {
  await browser.close();
}
