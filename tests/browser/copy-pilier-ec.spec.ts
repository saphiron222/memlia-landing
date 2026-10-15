import { test, expect } from '@playwright/test';

const route = '/automatisation-cabinet-comptable';
for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`hub robots : catalogue, prise en charge et parcours à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText('Des robots pour les tâches que votre cabinet refait encore à la main.');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://memlia.fr${route}`);
    await expect(page.locator('main')).not.toContainText('n’est pas ouvert à la prise en charge');
    expect(await page.locator('[data-hub-section]').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-hub-section'))))
      .toEqual(['hero', 'signature', 'annuaire', 'sur-mesure', 'autre-tache', 'contact']);
    await expect(page.locator('[data-hub-section="signature"]')).toContainText('Derrière chaque robot, nous.');
    await expect(page.locator('[data-hub-section="signature"] li')).toHaveText(['Observation', 'Règle écrite', 'Essais', 'Recette', 'Maintenance']);
    const body = page.locator('main');
    for (const phrase of [
      'une routine précise : un déclencheur, une règle écrite, un résultat dans vos outils',
      'Votre équipe reprend les exceptions et valide les actions qui engagent le cabinet.',
      'éprouvons le robot sur des cas fictifs', 'Votre équipe vérifie le résultat avant la mise en service.',
      'Nous assurons ensuite sa maintenance.', 'Vos règles, vos outils, vos échéances',
      'Votre tâche n’a pas encore son robot ?', 'Sources officielles connectées',
      'Import depuis votre logiciel', 'Votre logiciel n’est pas listé ? Nous l’intégrons sur demande.',
    ]) await expect(body).toContainText(phrase);
    const ctas = page.getByRole('link', { name: 'Confier une première tâche', exact: true });
    expect(await ctas.count()).toBeGreaterThanOrEqual(2);
    for (const cta of await ctas.all()) await expect(cta).toHaveAttribute('href', '/contact');
    const cartes = body.locator('[data-robot]');
    await expect(cartes).toHaveCount(21);
    const destinations = await cartes.locator('a.catalogue-carte').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
    expect(new Set(destinations).size).toBe(21);
    for (const slug of ['cfe', 'taxes-foncieres', 'suivi-urssaf', 'messagerie-fiscale', 'informations-legales-rne', 'veille-bodacc']) {
      await expect(body.locator(`a[href="/automatisation/${slug}"]`)).toBeAttached();
    }
    for (const href of ['/methode', '/integrations', '/garanties']) await expect(body.locator(`a[href="${href}"]`).first()).toBeAttached();
    await expect(body.locator('section details'), 'la FAQ appartient aux fiches, pas au hub').toHaveCount(0);
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
      await page.screenshot({ path: `.qa/copy-browser-final/screens/hub-robots-${width}.png`, fullPage: true });
    }
    await ctas.last().click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.locator('h1')).toHaveCount(1);
  });
}
