import { test, expect } from '@playwright/test';

const route = '/automatisation-cabinet-comptable';
for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`pilier EC : livraison, limites et parcours à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText('Automatisation pour cabinet comptable : votre règle écrite, dans vos outils.');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://memlia.fr${route}`);
    await expect(page.locator('main')).not.toContainText('n’est pas ouvert à la prise en charge');
    await expect(page.locator('#prepare').locator('..')).toContainText('quatre parties');
    await expect(page.locator('.pv-bande-liste h3')).toHaveText(['La frontière', 'La proposition', 'L’arrêt', 'Le jeu d’essai']);
    const body = page.locator('main');
    for (const phrase of [
      'Avant tout accès aux dossiers', 'des données inventées pour tester la règle',
      'Vous recevez la règle écrite', 'La recette est la vérification par votre équipe',
      'maintenance, de support et d’évolution', 'des sources à relier',
      'Il n’est jamais multiplié par le nombre de postes.',
      'ce que votre logiciel fait déjà', 'Le devis nomme l’environnement pris en charge.',
      'Le commissaire aux comptes garde la sélection des travaux, leur appréciation et l’opinion.',
      'cadrés séparément pour chaque mission',
    ]) await expect(body).toContainText(phrase);
    const ctas = page.getByRole('link', { name: 'Confier une première tâche', exact: true });
    expect(await ctas.count()).toBeGreaterThanOrEqual(2);
    for (const cta of await ctas.all()) await expect(cta).toHaveAttribute('href', '/contact');
    for (const slug of ['saisie-comptable', 'rapprochement-bancaire', 'notes-de-frais', 'paie', 'entrees-sorties-salaries', 'factures-fournisseurs']) {
      await expect(body.locator(`a[href="/automatisation/${slug}"]`).first()).toBeAttached();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(body).not.toContainText('compatibilité universelle');
    if ([375, 1440].includes(width)) {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.evaluate(async () => {
        await document.fonts.ready;
        Array.from(document.images).forEach((image) => { image.loading = 'eager'; });
        await Promise.all(Array.from(document.images).map((image) => image.decode().catch(() => {})));
      });
      await expect(page.locator('#suite')).toHaveCSS('opacity', '1');
      await page.screenshot({ path: `.qa/pilier-ec-${width}.png`, fullPage: true });
    }
    await ctas.last().click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.locator('h1')).toHaveCount(1);
  });
}
