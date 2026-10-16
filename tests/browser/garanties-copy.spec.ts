import { test, expect } from '@playwright/test';

for (const width of [375, 1440]) {
  test(`garanties : engagements et attestations distincts à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const response = await page.goto('/garanties');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText('Vos services IA au travail. Vos décisions sous contrôle.');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://memlia.fr/garanties');
    await page.locator('#refus').scrollIntoViewIfNeeded();
    await expect(page.locator('#refus h3').first()).toHaveText('Un traitement documenté');
    await expect(page.locator('#refus h3').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Aucune conformité', exact: true })).toHaveCount(0);
    const limits = page.locator('#refus .editorial-point').first();
    await expect(limits).toContainText('Nous décrivons le fonctionnement et les limites du service retenu.');
    await expect(limits).toContainText('ne constitue pas une attestation de conformité');
    await expect(limits).toContainText('ne certifie ni les comptes ni le dossier d’audit');
    await expect(page.locator('#donnees')).toContainText('droits d’accès, les destinataires et les flux');
    await expect(page.locator('#donnees-titre')).toHaveText('Des essais fictifs, des flux cadrés par mission');
    const scene = page.locator('[data-scene="garanties"] img');
    await expect(scene).toHaveAttribute('src', '/illustrations/figurines/garanties-1200.webp');
    await expect(scene).toHaveAttribute('alt', /robot devant des pièces classées/i);
    await expect(page.locator('main [data-proof],main video')).toHaveCount(0);
    await expect(page.locator('#donnees')).toContainText('entièrement fictifs');
    await expect(page.locator('#donnees')).toContainText('Un traitement local se vérifie sur ses appels réseau et sa télémétrie');
    await expect(page.locator('main')).not.toContainText('Vos fichiers restent chez vous');
    await expect(page.locator('#ecrit')).toContainText('maintenance, le support et les évolutions');
    await expect(page.locator('#ecrit')).toContainText('la signature reste au CAC');
    await expect(page.locator('#arret')).toContainText('Aucun envoi externe sans validation humaine');
    await expect(page.locator('#personnes')).toContainText('Il ne classe pas les collaborateurs.');
    await expect(page.locator('#personnes a[href="https://www.cnil.fr/fr/controle-de-lactivite-des-personnes-employees"]')).toHaveText('une mesure individuelle continue');
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
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `.qa/copy-browser-final/screens/garanties-${width}.png`, fullPage: true });
  });
}
