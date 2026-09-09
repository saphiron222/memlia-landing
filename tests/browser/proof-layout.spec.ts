import { test, expect } from '@playwright/test';

// Une régression pleine largeur ou un média sous le texte doit rougir sur les neuf preuves.
for (const width of [320, 375, 768, 1280, 1440]) {
  test(`preuves latérales et cadrage intégral à ${width}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const figures = page.locator('.functional-proof');
    await expect(figures).toHaveCount(9);
    for (const figure of await figures.all()) {
      await figure.scrollIntoViewIfNeeded();
      await expect(figure.locator('img')).toBeVisible();
      await figure.locator('img').evaluate((image: HTMLImageElement) => image.decode());
    }
    const measurements = await figures.evaluateAll(elements => elements.map(figure => {
      const img = figure.querySelector('img')!;
      const row = figure.closest('[data-proof-row]');
      const copy = row?.querySelector('[data-proof-copy]');
      const rect = (element: Element | null | undefined) => element?.getBoundingClientRect().toJSON() ?? null;
      return { id: figure.getAttribute('data-proof'), image: rect(img), row: rect(row), copy: rect(copy),
        fit: getComputedStyle(img).objectFit, natural: [img.naturalWidth, img.naturalHeight],
        interactive: !!figure.closest('a, button, [role="button"], [tabindex]'),
        focusable: img.tabIndex >= 0 || figure.querySelectorAll('a,button,[tabindex]').length > 0 };
    }));
    await testInfo.attach('geometry', { body: JSON.stringify(measurements, null, 2), contentType: 'application/json' });
    for (const item of measurements) {
      expect.soft(item.row, item.id!).not.toBeNull();
      expect.soft(item.fit).toBe('contain');
      expect.soft(item.interactive).toBe(false);
      expect.soft(item.focusable).toBe(false);
      expect.soft(item.image.x).toBeGreaterThanOrEqual(0);
      expect.soft(item.image.right).toBeLessThanOrEqual(width);
      expect.soft(item.image.width / item.image.height).toBeCloseTo(16 / 9, 2);
      if (width >= 1024) {
        expect.soft(item.image.width / (item.row?.width ?? width), item.id!).toBeLessThanOrEqual(0.52);
        expect.soft(item.image.width / (item.row?.width ?? width), item.id!).toBeGreaterThanOrEqual(0.48);
        if (item.row && item.copy) {
          expect.soft(item.copy.right).toBeLessThanOrEqual(item.image.x + 1);
          expect.soft(item.copy.y).toBeLessThan(item.image.bottom);
          expect.soft(item.copy.bottom).toBeGreaterThan(item.image.y);
          expect.soft(item.row.height).toBeGreaterThanOrEqual(370);
          expect.soft(item.row.height).toBeLessThanOrEqual(430);
        }
      } else if (item.row && item.copy) {
        expect.soft(item.image.y).toBeGreaterThanOrEqual(item.copy.bottom);
        expect.soft(item.image.height).toBeLessThanOrEqual(370);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
