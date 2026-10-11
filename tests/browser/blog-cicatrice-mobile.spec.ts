import { expect, test } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';
import { expectProofSelection } from './proof-selection';

// Cicatrice « tests verts » : depuis la recette de référence du 03/10/2026, ses deux figures sont,
// comme les autres, un master 1600 × 900 et ses dérivés responsive sans recadrage. Le contrôle
// du CTA garde le libellé exact qui débordait à 320 px dans le candidat joint du 02/10.
const slug = 'tests-verts-et-regle-des-trois-passes';
const ids = JSON.parse(readFileSync(`editorial/recettes/${slug}/recette.json`, 'utf8')).inlineProofs.map((proof: { id: string }) => proof.id);

for (const width of [320, 375, 1440]) {
  test(`Cicatrice tests verts : figures 1600 × 900 et CTA à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    expect((await page.goto(`/blog/${slug}`))?.status()).toBe(200);
    // Exact label that overflowed in the real joint candidate at 320px.
    await page.locator('.article-pont-actions .btn-lien').evaluate(element => {
      element.textContent = 'Voir le service d’automatisation et sa recette';
    });
    const figures = page.locator('.article-corps figure[data-blog-proof]');
    await expect(figures).toHaveCount(ids.length);
    mkdirSync('.qa/annotations/blog-cicatrice-mobile', { recursive: true });
    for (const figure of await figures.all()) {
      const id = await figure.getAttribute('data-blog-proof');
      expect(ids).toContain(id);
      const img = figure.locator(':scope > img');
      await figure.scrollIntoViewIfNeeded();
      await img.evaluate((image: HTMLImageElement) => image.decode());
      const measured = await img.evaluate((image: HTMLImageElement) => ({
        selected: new URL(image.currentSrc).pathname, natural: [image.naturalWidth, image.naturalHeight],
        width: image.getBoundingClientRect().width, height: image.getBoundingClientRect().height,
        parentWidth: image.parentElement!.getBoundingClientRect().width,
        legacy: Boolean(image.parentElement!.querySelector('figcaption, .preuve-defilante')),
      }));
      await expectProofSelection(img, `/proofs/blog/${id}.webp`);
      expect(measured.width).toBeLessThanOrEqual(measured.parentWidth);
      expect(measured.width).toBeGreaterThanOrEqual(measured.parentWidth - 2);
      expect(Math.abs(measured.height - measured.width * 9 / 16)).toBeLessThanOrEqual(2);
      expect(measured.legacy).toBe(false);
      await figure.screenshot({ path: `.qa/annotations/blog-cicatrice-mobile/${id}-${width}.png`, animations: 'disabled' });
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
