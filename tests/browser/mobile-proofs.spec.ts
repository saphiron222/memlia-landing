import { test, expect } from '@playwright/test';

const pages = ['/', '/automatisation/paie', '/integrations/dsn-silae'];
for (const width of [320, 375, 1440]) {
  for (const path of pages) {
    test(`${path} : preuve lisible à ${width}px`, async ({ page, hasTouch }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      const trigger = page.getByRole('link', { name: 'Agrandir la preuve', exact: true }).first();
      await expect(trigger).toBeVisible();
      await trigger.focus();
      await expect(trigger).toBeFocused();
      const size = await trigger.boundingBox();
      expect(size!.height).toBeGreaterThanOrEqual(24);
      await trigger.press('Enter');
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('button', { name: 'Fermer la preuve' })).toBeFocused();
      await page.keyboard.press('Shift+Tab');
      await expect(dialog.getByRole('region')).toBeFocused();
      await expect(dialog).toHaveAccessibleName(/.+/);
      const image = dialog.locator('img');
      await expect(image).toBeVisible();
      expect(await image.evaluate((img: HTMLImageElement) => img.getBoundingClientRect().width)).toBe(1600);
      await expect(dialog.locator('[data-proof-summary]')).not.toBeEmpty();
      const region = dialog.getByRole('region');
      await region.focus();
      await region.press('ArrowRight');
      await expect.poll(() => region.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
      await page.keyboard.press('Tab');
      await expect(dialog.getByRole('button', { name: 'Fermer la preuve' })).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
      if (hasTouch) await trigger.tap();
      else await trigger.click();
      await expect(dialog).toBeVisible();
      await dialog.getByRole('button', { name: 'Fermer la preuve' }).click();
      await expect(trigger).toBeFocused();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }
}
for (const slug of ['factures-fournisseurs', 'notes-de-frais', 'paie', 'rapprochement-bancaire', 'saisie-comptable']) {
  test(`${slug} : un seul cadre utile`, async ({ page }) => {
    await page.goto(`/automatisation/${slug}`);
    const images = await page.locator('img[src^="/proofs/"]').evaluateAll((els) => els.map((el) => el.getAttribute('src')));
    expect(images.length).toBe(1);
    expect(new Set(images).size).toBe(images.length);
  });
}

test('gabarits voisins inchangés', async ({ page }) => {
  for (const path of ['/methode', '/integrations/dsn-sage', '/outils-comptables-gratuits/calculateur-marge-commerciale']) {
    await page.goto(path);
    await expect(page.getByRole('link', { name: 'Agrandir la preuve', exact: true })).toHaveCount(0);
    await expect(page.locator('img[src^="/proofs/"]').first()).toBeVisible();
  }
});
