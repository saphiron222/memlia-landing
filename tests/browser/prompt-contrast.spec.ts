import { test, expect } from '@playwright/test';

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`frontières et focus des deux textarea, vides/remplis — ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/outils-comptables-gratuits/generateur-prompt-expert-comptable');
    await page.getByRole('button', { name: 'Demande de pièces', exact: true }).click();
    await page.getByLabel(/Je confirme que cette description/).check();
    await page.getByRole('button', { name: 'Assembler le prompt' }).click();
    for (const selector of ['textarea[name=description]', '[data-editor]']) {
      const field = page.locator(selector);
      for (const value of ['', 'Une description abstraite sans donnée réelle.']) {
        await field.fill(value);
        for (const focused of [false, true]) {
          // Tab gives a real keyboard :focus-visible state.
          await field.focus();
          await page.keyboard.press('Tab');
          if (focused) await page.keyboard.press('Shift+Tab');
          if (focused) await expect(field).toBeFocused();
          else await expect(field).not.toBeFocused();
          const ratios = await field.evaluate((element) => {
            const rgb = (color: string) => (color.match(/[\d.]+/g) || []).map(Number);
            const composite = (color: string, bg: number[]) => {
              const c = rgb(color), alpha = c[3] ?? 1;
              return c.slice(0, 3).map((v, i) => v * alpha + bg[i] * (1 - alpha));
            };
            const luminance = (c: number[]) => c.map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
            const contrast = (a: number[], b: number[]) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
            let parent = element.parentElement;
            while (parent && getComputedStyle(parent).backgroundColor === 'rgba(0, 0, 0, 0)') parent = parent.parentElement;
            const outside = rgb(getComputedStyle(parent!).backgroundColor);
            const style = getComputedStyle(element);
            const inside = composite(style.backgroundColor, outside);
            const border = composite(style.borderTopColor, inside);
            const outline = composite(style.outlineColor, outside);
            return { inside: contrast(border, inside), outside: contrast(border, outside), focus: contrast(outline, outside), outline: parseFloat(style.outlineWidth), visible: element.matches(':focus-visible') };
          });
          expect(ratios.inside, `${selector} intérieur`).toBeGreaterThanOrEqual(3);
          expect(ratios.outside, `${selector} extérieur`).toBeGreaterThanOrEqual(3);
          if (focused) {
            expect(ratios.visible).toBe(true);
            expect(ratios.outline).toBeGreaterThanOrEqual(2);
            expect(ratios.focus).toBeGreaterThanOrEqual(3);
          }
        }
      }
    }
  });
}
