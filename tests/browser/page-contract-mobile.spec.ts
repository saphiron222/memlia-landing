import { test, expect } from '@playwright/test';

const widths = [320, 375, 768, 1024, 1440, 1920] as const;

for (const width of widths) {
  test(`contrat de page — navigation et largeur à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');

    if (width < 1024) await page.locator('[data-burger]').click();
    const cta = page.locator(width < 1024 ? '.nav-mobile-cta a' : '.nav-principal');
    if (width < 1024) await cta.scrollIntoViewIfNeeded();
    await expect(cta).toBeVisible();
    const ctaBox = await cta.boundingBox();
    expect(ctaBox, 'CTA sans boîte').not.toBeNull();
    expect(ctaBox!.height, 'CTA sous 44 px').toBeGreaterThanOrEqual(44);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, 'débordement horizontal de la page').toBeLessThanOrEqual(1);

    if (width < 1024) {
      const nav = page.locator('#menu-mobile');
      await expect(nav).toBeVisible();
      const links = nav.locator('a[href]');
      expect(await links.count()).toBeGreaterThan(0);
      for (let index = 0; index < await links.count(); index += 1) {
        const box = await links.nth(index).boundingBox();
        expect(box, `lien mobile ${index + 1} sans boîte`).not.toBeNull();
        expect(box!.width, `lien mobile ${index + 1} de largeur nulle`).toBeGreaterThan(0);
        expect(box!.height, `lien mobile ${index + 1} sous 44 px`).toBeGreaterThanOrEqual(44);
      }
      await page.keyboard.press('Escape');
      await expect(page.locator('#menu-mobile')).toBeHidden();
    } else {
      await expect(page.locator('.nav-centre')).toBeVisible();
      await expect(page.locator('[data-burger]')).toBeHidden();
    }
  });
}
