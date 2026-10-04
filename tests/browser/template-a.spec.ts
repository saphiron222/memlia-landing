import { test, expect } from '@playwright/test';
import { OUTILS_DISPONIBLES, outilPath } from '../../src/data/outils';

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`gabarit : destinations visibles et CTA effectif à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const outil of OUTILS_DISPONIBLES) {
      await page.goto(outilPath(outil));
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      if (width < 1024) {
        const rects = await page.locator('[data-mobile-visible] a').evaluateAll((links) => links.map((link) => {
          const r = link.getBoundingClientRect();
          return { left: r.left, right: r.right, top: r.top, height: r.height, width: r.width };
        }));
        for (const r of rects) {
          expect(r.left).toBeGreaterThanOrEqual(0);
          expect(r.right).toBeLessThanOrEqual(width);
          expect(r.height).toBeGreaterThanOrEqual(44);
          expect(r.width).toBeGreaterThanOrEqual(44);
        }
        if (width === 320) expect(new Set(rects.map((r) => r.top)).size).toBe(2);
        const links = page.locator('[data-mobile-visible] a');
        await links.first().focus();
        await page.keyboard.press('Tab');
        await expect(links.nth(1)).toBeFocused();
      } else {
        await expect(page.locator('.nav-centre')).toBeVisible();
        await expect(page.locator('[data-mobile-visible]')).toBeHidden();
      }
      await expect(page.locator('[data-tool-section="hero"] img')).toHaveAttribute('loading', 'eager');
      await expect(page.locator('[data-tool-section="hero"] img')).toHaveAttribute('fetchpriority', 'high');
      await expect(page.locator('#outil-calcul')).toHaveCount(1);
      await page.locator('[data-tool-section="hero"] a[href="#outil-calcul"]').click();
      await expect(page).toHaveURL(/#outil-calcul$/);
      await expect.poll(() => page.locator('#outil-calcul').evaluate((el) => Math.round(el.getBoundingClientRect().top))).toBeLessThan(100);
      await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute('content', /connect-src 'none'/);
    }
  });
}

test('dates : aucun repli inventé ; les dates éditoriales explicites restent concordantes', async ({ page }) => {
  for (const route of ['/outils-comptables-gratuits', ...OUTILS_DISPONIBLES.map(outilPath), '/contact', '/mentions-legales']) {
    await page.goto(route);
    const nodes = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) => scripts.flatMap((script) => {
      const value = JSON.parse(script.textContent ?? '{}');
      return value['@graph'] ?? [value];
    }));
    expect(nodes.some((node) => node['@type']?.endsWith('Page'))).toBe(true);
    for (const node of nodes) {
      expect(node).not.toHaveProperty('datePublished');
      expect(node).not.toHaveProperty('dateModified');
    }
    if (route === '/mentions-legales') await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  }
  await page.goto('/methode');
  const nodes = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) => scripts.flatMap((script) => JSON.parse(script.textContent ?? '{}')['@graph'] ?? []));
  const node = nodes.find((item) => item['@type'] === 'WebPage');
  await expect(page.locator(`[data-page-byline] time[datetime="${node.datePublished}"]`)).toHaveCount(1);
  await expect(page.locator(`[data-page-byline] time[datetime="${node.dateModified}"]`)).toHaveCount(1);
  // Les preuves sous la ligne de flottaison ne deviennent pas prioritaires.
  await expect(page.locator('main img[loading="lazy"]').first()).toHaveAttribute('loading', 'lazy');
});
