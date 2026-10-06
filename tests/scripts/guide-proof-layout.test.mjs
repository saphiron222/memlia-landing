import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { renderGuideProof } from '../../scripts/render-guide-proof.mjs';

const normal = JSON.parse(readFileSync('guides/recettes/rapprochement-bancaire-sage/recette.json')).integration;
test('preuve trop haute refusée avant toute écriture', async t => {
  const root = mkdtempSync(join(tmpdir(), 'guide-overflow-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const d = structuredClone(normal);
  d.replay[0].detail = 'Une cause métier longue. '.repeat(200);
  await assert.rejects(renderGuideProof({ root, integration: d }), /Texte hors cadre/);
  assert.equal(existsSync(join(root, `guides/etats/${d.slug}/preuve.html`)), false);
  assert.equal(existsSync(join(root, `public/proofs/integrations/${d.slug}.webp`)), false);
});
for (const wide of [false, true]) {
  test(`preuve forge : géométrie et composition ${wide ? '74 W / 49 W' : 'normales'}`, async t => {
    const root = mkdtempSync(join(tmpdir(), 'guide-layout-'));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    const d = structuredClone(normal);
    if (wide) { d.product = 'W'.repeat(74); d.replay[0].input = 'W'.repeat(49); }
    const result = await renderGuideProof({ root, integration: d });
    const browser = await chromium.launch({ channel: 'chromium' });
    t.after(() => browser.close());
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
    await page.setContent(readFileSync(join(root, result.source), 'utf8'));
    await page.evaluate(() => document.fonts.ready);
    const geometry = await page.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const failures = [];
      while (walker.nextNode()) {
        const n = walker.currentNode;
        if (!n.textContent.trim() || n.parentElement.closest('style,script')) continue;
        const box = n.parentElement.getBoundingClientRect();
        const range = document.createRange(); range.selectNodeContents(n);
        for (const r of range.getClientRects()) if (r.left < box.left - 1 || r.right > box.right + 1 || r.top < box.top - 1 || r.bottom > box.bottom + 1 || r.right > 1600 || r.bottom > 900) failures.push(n.textContent);
      }
      return { failures, text: document.body.innerText, fonts: [...document.fonts].map(f => [f.family, f.status]) };
    });
    assert.deepEqual(geometry.failures, []);
    for (const c of d.replay) for (const key of ['input', 'rule', 'outcome', 'detail']) assert.ok(geometry.text.includes(c[key]), key);
    assert.ok(geometry.fonts.some(([name, state]) => name === 'Hanken' && state === 'loaded'));
    assert.ok(geometry.fonts.some(([name, state]) => name === 'Fraunces' && state === 'loaded'));
    assert.doesNotMatch(geometry.text, /Simulation documentaire|Aucun essai|La décision reste humaine/);
    assert.ok(!geometry.text.includes(d.slug));
    const meta = await sharp(readFileSync(join(root, result.target))).metadata();
    assert.equal(meta.width, 1600); assert.equal(meta.height, 900);
    assert.match(result.proof.alt, /Simulation documentaire/);
  });
}
