import { test, expect } from '@playwright/test';
import { DESTINATIONS, HREFS } from '../navigation-attendue.mjs';

for (const width of [320, 375, 390, 430, 768]) {
  for (const height of [844, 568, 360]) {
    test(`burger en haut à droite, panneau ouvrable et refermable ${width}x${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      const burger = page.locator('[data-burger]');
      const menu = page.locator('#menu-mobile');
      await expect(burger).toBeVisible();
      await expect(burger).toHaveAccessibleName('Ouvrir le menu principal');
      await expect(burger).toHaveAttribute('aria-expanded', 'false');
      await expect(menu).toBeHidden();
      await expect(page.locator('.nav-principal')).toBeHidden();
      await expect(page.locator('[data-mobile-visible]')).toHaveCount(0);
      const box = (await burger.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(48);
      expect(box.height).toBeGreaterThanOrEqual(48);
      expect(box.x + box.width).toBeGreaterThan(width - 40);
      expect(box.y).toBeLessThan(16);
      expect(await page.locator('.nav-barre').evaluate(el => el.getBoundingClientRect().height)).toBeLessThanOrEqual(64);
      await burger.click();
      await expect(menu).toBeVisible();
      await expect(burger).toHaveAccessibleName('Fermer le menu principal');
      await expect(burger).toHaveAttribute('aria-expanded', 'true');
      await expect(menu.locator('.nav-mobile-lien')).toHaveText(DESTINATIONS);
      expect(await menu.locator('.nav-mobile-lien').evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual(HREFS);
      await expect(page.locator('#main')).toHaveAttribute('inert', '');
      await expect(page.locator('body')).toHaveCSS('position', 'fixed');
      await burger.click();
      await expect(menu).toBeHidden();
      await expect(burger).toHaveAccessibleName('Ouvrir le menu principal');
      await expect(page.locator('#main')).not.toHaveAttribute('inert');
      await expect(page.locator('body')).not.toHaveCSS('position', 'fixed');
    });
  }
}

test('burger : Entrée, boucle Tab dans les deux sens, Échap et retour du focus', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 568 });
  await page.goto('/');
  const burger = page.locator('[data-burger]');
  const menu = page.locator('#menu-mobile');
  const links = menu.locator('a[href]');
  await burger.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toBeVisible();
  await page.keyboard.press('Shift+Tab');
  await expect(links.last()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(burger).toBeFocused();
  for (const link of await links.all()) {
    await page.keyboard.press('Tab');
    await expect(link).toBeFocused();
  }
  await page.keyboard.press('Tab');
  await expect(burger).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(burger).toBeFocused();
  await expect(page.locator('#main')).not.toHaveAttribute('inert');
});

test('burger : fermer restaure la position de lecture', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 568 });
  await page.goto('/');
  await page.evaluate(() => scrollTo({ top: 650, behavior: 'instant' }));
  const before = await page.evaluate(() => scrollY);
  // Le bouton sticky est déjà visible : un clic réel évite l’auto-scroll du locator avant le handler.
  const box = (await page.locator('[data-burger]').boundingBox())!;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.keyboard.press('Escape');
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(before);
});

test('burger : passage au bureau libère le fond et conserve un focus visible', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.locator('[data-burger]').click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('#menu-mobile')).toBeHidden();
  await expect(page.locator('[data-burger]')).toBeHidden();
  await expect(page.locator('#main')).not.toHaveAttribute('inert');
  await expect(page.locator('body')).not.toHaveCSS('position', 'fixed');
  await expect(page.locator('.nav-centre .nav-entree').first()).toBeFocused();
});

test('burger : chaque destination de lecture ferme le panneau et atteint son fragment', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const fragment of ['usages', 'methode', 'preuves', 'questions']) {
    await page.goto('/');
    await page.locator('[data-burger]').click();
    await page.locator(`#menu-mobile a[href="/#${fragment}"]`).click();
    await expect(page).toHaveURL(new RegExp(`#${fragment}$`));
    await expect(page.locator('#menu-mobile')).toBeHidden();
    await expect(page.locator('#main')).not.toHaveAttribute('inert');
    await expect(page.locator('body')).not.toHaveCSS('position', 'fixed');
    await expect(page.locator(`#${fragment}`)).toBeVisible();
  }
});
