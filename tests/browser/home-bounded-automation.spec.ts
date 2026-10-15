import { test, expect } from '@playwright/test';

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`la règle écrite reste bornée dans le passage d’accueil à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const passage = page.locator('.daily-note');
    await passage.scrollIntoViewIfNeeded();
    await expect(passage).toBeVisible();
    await expect(passage).toHaveText('Nous adaptons chaque robot ou agent aux formats, aux accès et aux cas couverts par votre cabinet. La règle écrite précise le résultat attendu et les validations à conserver.');
    await expect(page.locator('h1')).toHaveText('Robots et agents IA pour votre cabinet comptable.');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: `.qa/home-bounded-automation/${width}.png`, fullPage: true });
  });
}
