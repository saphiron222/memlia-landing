import { test, expect } from '@playwright/test';
const route = '/automatisation/entrees-sorties-salaries';
for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`annonces hors portail : couverture, preuve et frontière à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText('Automatisation entrées sorties salariés en cabinet comptable : les annonces hors portail');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://memlia.fr${route}`);
    await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute('content', /noindex/);
    await expect(page.locator('[data-service-section="couverture"]')).toContainText('mySilae');
    await expect(page.locator('[data-service-section="couverture"]')).toContainText('PayFit');
    await expect(page.locator('[data-service-section="couverture"]')).toContainText('seulement pour une entrée hors portail');
    await expect(page.locator('[data-proof="v2/44-service-entrees-sorties-salaries"]')).toHaveCount(1);
    await expect(page.locator('footer a[href="/automatisation/entrees-sorties-salaries"]')).toHaveCount(1);
    await expect(page.locator('a[href="/automatisation/paie"]').first()).toBeAttached();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
