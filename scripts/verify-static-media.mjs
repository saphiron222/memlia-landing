/** Recette M4-R4 : images statiques, écouteurs réels CDP et captures contextualisées. */
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const base = process.env.QA_URL;
if (!base) throw new Error('QA_URL requis pour nommer le candidat mesuré.');
const output = process.env.QA_OUTPUT ?? '.qa/m4-r4/screens';
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chromium', headless: false });
const report = { base, widths: [], screenshots: [], errors: [] };
try {
  for (const width of [320, 375, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => report.errors.push(error.message));
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => document.querySelector('video').readyState >= 1);
    const cdp = await page.context().newCDPSession(page);
    const measurement = { width, proofs: [], dom: await page.locator('.hero-cadre').innerHTML() };
    measurement.removedTextMatches = (await page.locator('body').innerText()).match(/Lire la transcription|Lire le détail|Illustration de fonctionnement sur données fictives, pas une capture produit\./g) ?? [];
    assert.deepEqual(measurement.removedTextMatches, []);
    assert.equal(await page.locator('.repere-lien').count(), 0);
    const capture = async (name, locator) => {
      const path = `${output}/${name}-${width}.png`;
      if (locator) await locator.screenshot({ path });
      else await page.screenshot({ path });
      report.screenshots.push(path);
    };
    await capture('hero');
    await capture('player', page.locator('.hero-cadre'));
    await capture('reperes', page.locator('.reperes'));
    const figures = await page.locator('[data-proof]').all();
    assert.equal(figures.length, 9);
    for (const figure of figures) {
      const id = await figure.getAttribute('data-proof');
      await figure.scrollIntoViewIfNeeded();
      await figure.locator('img').evaluate(i => i.decode());
      const proof = await figure.evaluate(f => ({
        id: f.getAttribute('data-proof'), children: [...f.children].map(c => c.tagName), text: f.textContent.trim(),
        alt: f.querySelector('img').alt, cursor: getComputedStyle(f.querySelector('img')).cursor,
        imageWidth: f.querySelector('img').naturalWidth, renderedWidth: f.getBoundingClientRect().width,
      }));
      assert.deepEqual(proof.children, ['IMG']);
      assert.equal(proof.text, '');
      assert.equal(proof.imageWidth, 1600);
      assert.ok(proof.alt.length > 50);
      assert.ok(proof.renderedWidth <= width);
      assert.ok(!/pointer|zoom/.test(proof.cursor));
      proof.listeners = [];
      // Détecte aussi addEventListener(), invisible d'un contrôle des attributs HTML.
      for (const selector of [`[data-proof="${id}"]`, `[data-proof="${id}"] img`]) {
        const { result } = await cdp.send('Runtime.evaluate', { expression: `document.querySelector(${JSON.stringify(selector)})` });
        assert.ok(result.objectId);
        const { listeners } = await cdp.send('DOMDebugger.getEventListeners', { objectId: result.objectId });
        proof.listeners.push({ selector, types: listeners.map(l => l.type) });
        assert.equal(listeners.length, 0);
      }
      await capture(id, figure);
      measurement.proofs.push(proof);
    }
    measurement.pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    assert.ok(measurement.pageWidth <= width);
    measurement.dialogs = await page.locator('dialog, [role="dialog"]').count();
    assert.equal(measurement.dialogs, 0);
    const full = `${output}/page-${width}.png`;
    await page.screenshot({ path: full, fullPage: true });
    report.screenshots.push(full);
    report.widths.push(measurement);
    await page.close();
  }
  assert.equal(report.widths.flatMap(w => w.proofs).length, 36);
  assert.deepEqual(report.errors, []);
} finally {
  await browser.close();
  writeFileSync(`${output}/report.json`, JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ base, widths: report.widths.map(w => w.width), proofs: report.widths.flatMap(w => w.proofs).length, screenshots: report.screenshots.length, errors: report.errors }));
