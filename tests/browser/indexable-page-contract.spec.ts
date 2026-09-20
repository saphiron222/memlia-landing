import { test, expect } from '@playwright/test';

const widths = [320, 375, 768, 1024, 1440, 1920] as const;
const routes = [
  '/blog',
  '/glossaire',
  '/outils-comptables-gratuits',
  '/outils-comptables-gratuits/calculateur-date-echeance-facture',
  '/outils-comptables-gratuits/calculateur-marge-commerciale',
  '/outils-comptables-gratuits/modele-rapprochement-bancaire-excel-gratuit',
] as const;

for (const width of widths) {
  test(`pages indexables contractualisées — structure visible à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator('main#main h1')).toHaveCount(1);
      await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute('content', /\bnoindex\b/);
      const h1 = (await page.locator('main#main h1').innerText()).replace(/\s+/g, ' ').trim();
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', h1);
      await expect(page.locator('footer')).toBeVisible();
      await expect(page.getByRole('link', { name: 'Confier une première tâche' }).last()).toBeVisible();
      if (route === '/outils-comptables-gratuits') {
        const categories = page.locator('.outils-categorie');
        for (let index = 0; index < await categories.count(); index += 1) {
          await expect(categories.nth(index).locator('[data-outil-card]')).not.toHaveCount(0);
        }
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${route} déborde à ${width}px`).toBeLessThanOrEqual(1);
    }
  });
}
