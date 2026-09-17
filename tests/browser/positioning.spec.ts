import { test, expect } from '@playwright/test';

for (const [route, status, phrase] of [
  ['/mentions-legales', 200, 'un service d’automatisation IA des tâches et processus chronophages'],
  ['/politique-de-confidentialite', 200, 'documentés pour chaque processus automatisé'],
  ['/m3-page-inexistante', 404, 'Retrouvez notre service d’automatisation IA'],
] as const) {
  test(`positionnement service sur ${route}`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(status);
    await expect(page.locator('main')).toContainText(phrase);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    const texts = await page.evaluate(() => [
      document.body.innerText,
      document.title,
      ...Array.from(document.querySelectorAll('meta[content], [alt], [aria-label]')).flatMap(el =>
        ['content', 'alt', 'aria-label'].map(attr => el.getAttribute(attr) ?? '')),
    ]);
    for (const text of texts) expect(text).not.toMatch(/\bmodules?\b|compléments?\s+(Excel|Memlia)/i);
    await page.getByRole('link', { name: /Retour à l’accueil/ }).click();
    await expect(page.locator('h1')).toHaveText('Votre cabinet tourne sur un savoir-faire que personne n’a écrit.');
  });
}
