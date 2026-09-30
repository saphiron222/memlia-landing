import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const articles = [
  'automatiser-la-saisie-comptable-ce-qui-reste-a-verifier',
  'automatiser-un-cabinet-comptable-la-carte-des-taches',
  'intelligence-artificielle-metier-comptable-ce-qu-elle-prepare-ce-qui-reste-humain',
  'logiciel-ia-comptabilite',
  'prompt-chatgpt-expert-comptable',
];

for (const width of [320, 375, 1440]) {
  test(`preuves inline lisibles et directes à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    mkdirSync('.qa/annotations/blog-proof-mobile', { recursive: true });
    for (const slug of articles) {
      const response = await page.goto(`/blog/${slug}`);
      expect(response?.status(), slug).toBe(200);
      const figures = page.locator('.article-corps figure[data-blog-proof]');
      await expect(figures, slug).toHaveCount(2);
      for (const [index, figure] of (await figures.all()).entries()) {
        await figure.scrollIntoViewIfNeeded();
        const image = figure.locator(':scope > img');
        await expect(image).toHaveCount(1);
        await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
        const measured = await image.evaluate((img: HTMLImageElement) => {
          const rect = img.getBoundingClientRect();
          return {
            loaded: img.complete && img.naturalWidth > 0,
            selected: new URL(img.currentSrc).pathname,
            width: rect.width,
            height: rect.height,
            figureWidth: img.parentElement!.getBoundingClientRect().width,
            horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
            legacy: Boolean(img.parentElement!.querySelector('figcaption, .preuve-defilante')),
          };
        });
        expect(measured.loaded, slug).toBe(true);
        expect(measured.selected, slug).toMatch(width < 600 ? /-mobile\.webp$/ : /(?<!-mobile)\.webp$/);
        expect(measured.width, slug).toBeLessThanOrEqual(measured.figureWidth);
        expect(measured.height, slug).toBeGreaterThan(width < 600 ? 400 : 100);
        expect(measured.legacy, slug).toBe(false);
        // Deux anciens articles débordent déjà à 320 px dans leur CTA, hors figures.
        if (width > 320) expect(measured.horizontalOverflow, slug).toBe(false);
        await figure.screenshot({ path: `.qa/annotations/blog-proof-mobile/${slug}-${width}-${index + 1}.png` });
      }
    }
  });
}
