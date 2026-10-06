import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
import routes from './table-keyboard.routes.json' with { type: 'json' };

const require = createRequire(import.meta.url);
for (const width of [320, 375, 1440]) {
  for (const route of routes) {
    test(`${width}px ${route}: tableaux accessibles au clavier`, async ({ page }, testInfo) => {
      test.setTimeout(60_000);
      await page.setViewportSize({ width, height: 900 });
      expect((await page.goto(route))?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      const tables = page.locator('.article-corps table, .service-body-copy table');
      expect(await tables.count()).toBeGreaterThan(0);
      for (let i = 0; i < await tables.count(); i++) {
        const table = tables.nth(i);
        const region = table.locator('..');
        await expect(region).toHaveAttribute('role', 'region');
        await expect(region).toHaveAttribute('tabindex', '0');
        await expect(region).toHaveAttribute('aria-label', /Tableau .+/);
        for (let step = 0; step < 150; step++) {
          if (await region.evaluate(el => el === document.activeElement)) break;
          await page.keyboard.press('Tab');
        }
        await expect(region).toBeFocused();
        expect(await region.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid');
        expect(await region.evaluate(el => parseFloat(getComputedStyle(el).outlineWidth))).toBeGreaterThanOrEqual(3);
        const max = await region.evaluate(el => el.scrollWidth - el.clientWidth);
        if (max > 1) {
          await page.keyboard.press('ArrowRight');
          await expect.poll(() => region.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
          for (let step = 0; step < 80; step++) {
            await page.keyboard.press('ArrowRight');
            if (await region.evaluate(el => el.scrollLeft >= el.scrollWidth - el.clientWidth - 1)) break;
          }
          await expect.poll(() => region.evaluate(el => el.scrollWidth - el.clientWidth - el.scrollLeft)).toBeLessThanOrEqual(1);
          const lastCell = table.locator('tr').first().locator('th, td').last();
          expect(await lastCell.evaluate(el => {
            const cell = el.getBoundingClientRect();
            const box = el.closest('[data-table-scroll]')!.getBoundingClientRect();
            return cell.right <= box.right + 1 && cell.left < box.right;
          })).toBe(true);
          await page.keyboard.press('ArrowLeft');
          await expect.poll(() => region.evaluate(el => el.scrollLeft)).toBeLessThan(max);
        }
        if (i === 0) await region.screenshot({ path: testInfo.outputPath('table-focus.png') });
        await page.keyboard.press('Tab');
        await expect(region).not.toBeFocused();
        await page.keyboard.press('Shift+Tab');
        await expect(region).toBeFocused();
        await page.keyboard.press('Tab');
      }
      await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
      const violations = await page.evaluate(async () => {
        return (await (window as any).axe.run(document, { runOnly: ['scrollable-region-focusable'] })).violations;
      });
      expect(violations).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    });
  }
}
