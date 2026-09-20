import { test, expect } from '@playwright/test';

const widths = [320, 375, 768, 1024, 1440, 1920] as const;
const routes = [
  '/404',
  '/contact/erreur',
  '/contact/merci',
  '/mentions-legales',
  '/politique-de-confidentialite',
  '/outils-comptables-gratuits/temoin-calcul-local',
] as const;

for (const width of widths) {
  test(`pages manuelles noindex — contrat visible à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator('main#main h1')).toHaveCount(1);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /\bnoindex\b/);
      const h1 = (await page.locator('main#main h1').innerText()).replace(/\s+/g, ' ').trim();
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', h1);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${route} déborde à ${width}px`).toBeLessThanOrEqual(1);
    }
  });
}