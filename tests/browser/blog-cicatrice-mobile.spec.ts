import { expect, test } from '@playwright/test';
import { injecterPreuvesInline } from '../../scripts/blog-forge.mjs';
import { mkdirSync } from 'node:fs';

// Technical fixture only: real Article CSS/forge/assets, not a published story
// or a substitute for the final signed Cicatrice + pillar review.
const ids = ['w39-trois-passes', 'w39-reference-decalee'];
const html = injecterPreuvesInline('\n## Suite\n', ids.map(id => ({ id, insertBeforeHeading: 'Suite',
  alt: 'Reconstitution fictive, pas une capture produit', source: 'Jeu fictif', capturedAt: '2026-10-02' })), process.cwd());

for (const width of [320, 375, 1440]) {
  test(`fixture technique Cicatrice portrait et CTA à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    expect((await page.goto('/blog/logiciel-ia-comptabilite'))?.status()).toBe(200);
    await page.locator('.article-corps').evaluate((element, body) => {
      element.setAttribute('data-qa-technical-fixture', 'true');
      element.innerHTML = body;
    }, html);
    // Exact label that overflowed in the real joint candidate at 320px.
    await page.locator('.article-pont-actions .btn-lien').evaluate(element => {
      element.textContent = 'Voir le service d’automatisation et sa recette';
    });
    const figures = page.locator('.article-corps figure[data-blog-proof]');
    await expect(figures).toHaveCount(ids.length);
    mkdirSync('.qa/annotations/blog-cicatrice-mobile', { recursive: true });
    for (const [index, figure] of (await figures.all()).entries()) {
      const img = figure.locator(':scope > img');
      await figure.scrollIntoViewIfNeeded();
      await img.evaluate((image: HTMLImageElement) => image.decode());
      const measured = await img.evaluate((image: HTMLImageElement) => ({
        selected: new URL(image.currentSrc).pathname, loaded: image.naturalWidth > 0,
        width: image.getBoundingClientRect().width, height: image.getBoundingClientRect().height,
        parentWidth: image.parentElement!.getBoundingClientRect().width,
        legacy: Boolean(image.parentElement!.querySelector('figcaption, .preuve-defilante')),
      }));
      expect(measured.loaded).toBe(true);
      expect(measured.selected).toBe(`/proofs/blog/${ids[index]}-mobile.webp`);
      expect(measured.width).toBeLessThanOrEqual(measured.parentWidth);
      expect(measured.height).toBeGreaterThan(width < 600 ? 500 : 1000);
      expect(measured.legacy).toBe(false);
      await figure.screenshot({ path: `.qa/annotations/blog-cicatrice-mobile/${ids[index]}-${width}.png`, animations: 'disabled' });
    }
    const bounds = await page.locator('.article-pont-actions .btn').evaluateAll(buttons => buttons.map(button => ({
      left: button.getBoundingClientRect().left, right: button.getBoundingClientRect().right,
      height: button.getBoundingClientRect().height,
    })));
    for (const button of bounds) {
      expect(button.left).toBeGreaterThanOrEqual(0);
      expect(button.right).toBeLessThanOrEqual(width);
      expect(button.height).toBeGreaterThanOrEqual(32);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}
