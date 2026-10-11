import { test, expect } from '@playwright/test';
import { CAC_PUBLIE } from '../navigation-attendue.mjs';

for (const width of [1024, 1440]) {
  test(`menu de lecture : premier clic souris à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.mouse.move(width - 20, 500);
    const trigger = page.locator('[aria-controls="sous-menu-lecture"]');
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#sous-menu-lecture')).toBeVisible();
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.locator('h1').click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test(`menu de lecture : trajet souris continu à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const trigger = page.locator('[aria-controls="sous-menu-lecture"]');
    const panel = page.locator('#sous-menu-lecture');
    await trigger.hover();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const buttonBox = (await trigger.boundingBox())!;
    const panelBox = (await panel.boundingBox())!;
    const x = buttonBox.x + buttonBox.width / 2;
    await page.mouse.move(x, buttonBox.y + buttonBox.height - 1);
    await page.mouse.move(x, (buttonBox.y + buttonBox.height + panelBox.y) / 2);
    await page.mouse.move(panelBox.x + 40, panelBox.y + 20);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();
    await panel.locator('a').first().click();
    await expect(page).toHaveURL(/#usages$/);
  });
}

for (const width of [375, 1024, 1440]) {
  test(`hubs globaux et position courante à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/automatisation-cabinet-comptable', '/outils-comptables-gratuits', '/blog']) {
      await page.goto(path);
      if (width < 1024) await page.locator('[data-burger]').click();
      const nav = page.locator(width < 1024 ? '#menu-mobile' : '.nav-centre');
      await expect(nav.locator(`a[href="${path}"]`)).toHaveAttribute('aria-current', 'page');
      for (const href of ['/automatisation-cabinet-comptable', '/outils-comptables-gratuits', '/blog']) {
        await expect(nav.locator(`a[href="${href}"]`)).toBeVisible();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
  });
}

test('menu de lecture : Entrée, Tab, Échap et retour du focus', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const trigger = page.locator('[aria-controls="sous-menu-lecture"]');
  const panel = page.locator('#sous-menu-lecture');
  await trigger.focus();
  await expect(panel).toBeHidden();
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Tab');
  await expect(panel.locator('a').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(panel).toBeHidden();
  await page.keyboard.press('Tab');
  await expect(page.locator('.nav-centre > ul > li').nth(1).locator('a,button').first()).toBeFocused();
});

for (const width of [375, 1024, 1440]) {
  test(`activation CAC : entrée, lien accueil et fragments locaux à ${width}px`, async ({ page }) => {
    test.skip(!CAC_PUBLIE, 'E4 n’a pas encore publié sa route ; le contrat de données couvre les deux états.');
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('.hero-texte a[href="/commissaires-aux-comptes"]')).toBeVisible();
    if (width >= 1024) {
      await page.locator('[aria-controls="sous-menu-cabinets"]').focus();
      await page.keyboard.press('Enter');
    }
    if (width < 1024) await page.locator('[data-burger]').click();
    const nav = page.locator(width < 1024 ? '#menu-mobile' : '.nav-centre');
    await nav.getByRole('link', { name: 'Commissaires aux comptes', exact: true }).press('Enter');
    await expect(page).toHaveURL(/\/commissaires-aux-comptes$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    if (width >= 1024) {
      await page.locator('[aria-controls="sous-menu-lecture"]').focus();
      await page.keyboard.press('Enter');
    }
    if (width < 1024) await page.locator('[data-burger]').click();
    for (const id of ['usages', 'methode', 'preuves', 'questions']) {
      await expect(nav.locator(`a[href="/commissaires-aux-comptes#${id}"]`)).toBeVisible();
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });
}
