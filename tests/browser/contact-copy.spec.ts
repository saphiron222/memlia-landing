import { test, expect } from '@playwright/test';

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`contact : copy et parcours clavier à ${width} px, sans envoi`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    let envois = 0;
    await page.route('**/api/contact', async (route) => {
      if (route.request().method() === 'POST') envois++;
      await route.fulfill({ status: 503, contentType: 'application/json', body: '{}' });
    });
    await page.goto('/contact');
    await expect(page.locator('h1')).toHaveText('Quelle tâche vos collaborateurs refont-ils encore à la main ?');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://memlia.fr/contact');
    await expect(page.locator('main')).toContainText('Votre équipe garde les décisions.');
    await expect(page.locator('#ensuite').locator('..')).toContainText('Si elle n’est pas automatisable en l’état, nous vous expliquons ce qui bloque.');
    await expect(page.locator('#ensuite').locator('..')).toContainText('Le devis vient après ce cadrage.');
    await expect(page.getByText(/Rien à envoyer : la description suffit\./)).toHaveCount(1);
    const form = page.locator('[data-contact]');
    await expect(form.locator('input[type="file"]')).toHaveCount(0);
    await expect(form.locator('#cabinet')).not.toHaveAttribute('required');
    await page.locator('#nom').focus();
    await page.keyboard.type('Camille Fictive');
    await page.keyboard.press('Tab');
    await expect(page.locator('#cabinet')).toBeFocused();
    await page.keyboard.press('Tab');
    // D7 adds an optional selector here: leave its choice empty and continue.
    if (await page.locator('#type_cabinet').count()) await page.keyboard.press('Tab');
    await expect(page.locator('#courriel')).toBeFocused();
    await page.keyboard.type('camille@exemple.test');
    await page.keyboard.press('Tab');
    await expect(page.locator('#message')).toBeFocused();
    await page.keyboard.type('Chaque mois nous rapprochons deux listes et validons les écarts.');
    await page.keyboard.press('Tab');
    await expect(page.locator('#consentement')).toBeFocused();
    await expect(page.locator('[data-etat]')).toContainText('Le formulaire est indisponible.');
    await expect(page.locator('#message')).toHaveValue(/rapprochons/);
    await expect(form.locator('button[type="submit"]')).toBeDisabled();
    await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(envois).toBe(0);
  });
}
