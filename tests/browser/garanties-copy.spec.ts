import { test, expect } from '@playwright/test';

for (const width of [375, 1440]) {
  test(`garanties : engagements et attestations distincts à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto('/garanties');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText('Ce que nous garantissons, avant même de commencer.');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://memlia.fr/garanties');
    await page.locator('#refus').scrollIntoViewIfNeeded();
    await expect(page.locator('#refus h3').first()).toHaveText('Aucune attestation de conformité');
    await expect(page.locator('#refus h3').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Aucune conformité', exact: true })).toHaveCount(0);
    const limits = page.locator('#refus .pv-cellule').first();
    await expect(limits).toContainText('Nous documentons le traitement prévu et ses limites.');
    await expect(limits).toContainText('elle ne certifie pas les comptes ni le dossier d’audit');
    await expect(page.locator('#donnees')).toContainText('droits d’accès, les destinataires et les flux');
    await expect(page.locator('#donnees-titre')).toHaveText('Des essais fictifs, des flux cadrés par mission');
    await expect(page.locator('#donnees img')).toHaveAttribute('src', '/proofs/v2/45-cadrage-donnees.webp');
    await expect(page.locator('#donnees img')).toHaveAttribute('alt', /Scène fictive de cadrage/);
    await expect(page.locator('main')).not.toContainText('Vos fichiers restent chez vous');
    await expect(page.locator('#ecrit')).toContainText('maintenance, le support et les évolutions');
    await expect(page.locator('#ecrit')).toContainText('la signature reste au CAC');
    await expect(page.locator('#arret')).toContainText('Aucun envoi externe sans validation humaine');
    for (const link of await page.locator('[data-garanties] a').all()) {
      const href = await link.getAttribute('href');
      expect(href).toMatch(/^#/);
      await expect(page.locator(href!)).toHaveCount(1);
    }
    for (const link of await page.getByRole('link', { name: 'Confier une première tâche', exact: true }).all()) {
      await expect(link).toHaveAttribute('href', '/contact');
    }
    expect(await page.getByRole('link', { name: 'Confier une première tâche', exact: true }).count()).toBeGreaterThanOrEqual(2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const section of await page.locator('main section').all()) {
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(600);
    await page.screenshot({ path: `.qa/garanties-${width}.png`, fullPage: true });
  });
}
