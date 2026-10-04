import { test, expect } from '@playwright/test';

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`la règle écrite reste bornée dans le passage d’accueil à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const passage = page.locator('.daily-note');
    await passage.scrollIntoViewIfNeeded();
    await expect(passage).toBeVisible();
    await expect(passage).toHaveText('Écrire la règle, c’est notre métier. Une règle écrite appartient au cabinet. Nous en automatisons la part répétitive lorsque les formats, les accès et les cas couverts le permettent.');
    await expect(page.locator('h1')).toHaveText('Votre cabinet tourne sur un savoir-faire que personne n’a écrit.');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: `.qa/home-bounded-automation/${width}.png`, fullPage: true });
  });
}
