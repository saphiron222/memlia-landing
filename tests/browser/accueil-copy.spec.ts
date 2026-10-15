import { test, expect } from '@playwright/test';

for (const width of [375, 1440]) {
  test(`accueil EC : tâche confiée, outils et décision à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText('Robots et agents IA pour votre cabinet comptable.');
    await expect(page.locator('.hero-editorial-intro')).toContainText('Nous déployons nos robots et agents IA');
    await expect(page.locator('.hero-editorial-intro')).toContainText('dans vos outils');
    await expect(page.locator('.hero-editorial-intro')).toContainText('Nous construisons sur mesure lorsque votre besoin dépasse le catalogue.');
    await expect(page.locator('main section')).toHaveCount(11);
    // Recette A validée le 15 octobre : scène de portefeuille, plus de fausse interface décorative.
    await expect(page.locator('main [data-proof]')).toHaveCount(0);
    await expect(page.locator('main video')).toHaveCount(0);
    const scene=page.locator('[data-scene="accueil"] img');
    await scene.scrollIntoViewIfNeeded();
    await expect.poll(()=>scene.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://memlia.fr/');
    await expect(page.locator('#promesse')).toContainText('Nous assurons le déploiement et la suite.');
    await expect(page.locator('#preuves')).toContainText('ce qui se prépare seul, ce qui attend votre validation et ce qui reste humain');
    await expect(page.locator('#evaluer')).toContainText('les adaptations utiles et un devis');
    const ctas = page.getByRole('link', { name: 'Confier une première tâche', exact: true });
    expect(await ctas.count()).toBeGreaterThanOrEqual(2);
    for (const cta of await ctas.all()) await expect(cta).toHaveAttribute('href', '/contact');
    const brokenAnchors = await page.locator('main a[href^="#"]').evaluateAll(links => links
      .map(link => link.getAttribute('href')!)
      .filter(href => !document.getElementById(decodeURIComponent(href.slice(1)))));
    expect(brokenAnchors).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    await page.locator('.hero-editorial-actions a').first().click();
    await expect(page).toHaveURL(/\/contact$/);
  });
}
