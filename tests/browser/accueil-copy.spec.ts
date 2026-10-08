import { test, expect } from '@playwright/test';

for (const width of [375, 1440]) {
  test(`accueil EC : tâche confiée, outils et décision à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText('Votre cabinet tourne sur un savoir-faire que personne n’a écrit.');
    await expect(page.locator('.hero-sub')).toContainText('Confiez-nous une tâche répétitive.');
    await expect(page.locator('.hero-sub')).toContainText('dans leurs outils');
    await expect(page.locator('.hero-sub')).toContainText('Ils gardent la décision. Votre cabinet garde le savoir.');
    await expect(page.locator('main section')).toHaveCount(11);
    await expect(page.locator('main [data-proof]')).toHaveCount(9);
    await expect(page.locator('video')).toHaveAttribute('src', '/media/r9/explainer-hero-45s.mp4');
    await expect(page.locator('track')).toHaveAttribute('src', '/media/r9/explainer.vtt');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://memlia.fr/');
    await expect(page.locator('#promesse')).toContainText('De l’observation à la maintenance');
    await expect(page.locator('#preuves')).toContainText('ce qui se prépare seul, ce qui attend votre validation et ce qui reste humain');
    await expect(page.locator('#evaluer')).toContainText('un périmètre et un devis avant tout engagement');
    const ctas = page.getByRole('link', { name: 'Confier une première tâche', exact: true });
    expect(await ctas.count()).toBeGreaterThanOrEqual(2);
    for (const cta of await ctas.all()) await expect(cta).toHaveAttribute('href', '/contact');
    const brokenAnchors = await page.locator('main a[href^="#"]').evaluateAll(links => links
      .map(link => link.getAttribute('href')!)
      .filter(href => !document.getElementById(decodeURIComponent(href.slice(1)))));
    expect(brokenAnchors).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    await page.locator('.hero-btn').click();
    await expect(page).toHaveURL(/\/contact$/);
  });
}
