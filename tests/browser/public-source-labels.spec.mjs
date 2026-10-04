import { test, expect } from '@playwright/test';
import { auditHtml, renderedPages } from '../../scripts/verify-public-source-labels.mjs';

test('toutes les routes publiques restent sans mentions de consultation après exécution JavaScript', async ({ page }) => {
  test.setTimeout(180_000);
  // Resolved after webServer builds the site, not at test-discovery time on a fresh checkout.
  const pages = renderedPages();
  for (const { route } of pages) {
    const response = await page.goto(route, { waitUntil: 'networkidle' });
    expect(route === '/404' ? [200, 404] : [200], route).toContain(response?.status());
    expect(auditHtml(await page.locator('body').innerHTML()), route).toEqual([]);
  }
});
