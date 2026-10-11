import { test, expect } from '@playwright/test';

const path = '/automatisation/registres-obligations';
const title = 'Automatisation du suivi des registres et obligations en cabinet comptable';

test('registres : contrat public, preuve et limites du jeu', async ({ page }) => {
  await page.setExtraHTTPHeaders({ 'Cache-Control': 'no-cache' });
  const response = await page.goto(path);
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveText(title);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://memlia.fr${path}`);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
  await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute('content', /noindex/);
  await expect(page.locator('[data-proof="v2/44-service-registres-obligations"] img')).toHaveCount(1);
  await expect(page.locator('[data-service-sections]')).toContainText('sans connexion aux registres');
  await expect(page.locator('[data-service-sections]')).toContainText('distinct de la tenue d’un registre légal');
  await expect(page.locator('footer a[href="/automatisation/registres-obligations"]')).toHaveCount(1);
});

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`registres : largeur ${width} sans débordement`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width, height: 900 });
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}
