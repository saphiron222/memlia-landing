import { test, expect } from '@playwright/test';

/*
 * Décisions de Kevin du 06/10/2026 sur le hub « Ce qu'on automatise » :
 * - aucune section « Sources » ni « Expérience de première main » : une source se cite par un lien dans le texte ;
 * - chaque page service dit ce que le logiciel du cabinet fait déjà (bloc de couverture) ;
 * - la dernière section d'une page ne colle pas à ce qui la suit (la dernière carte respire).
 */

const services = [
  '/automatisation/paie',
  '/automatisation/saisie-comptable',
  '/automatisation/rapprochement-bancaire',
  '/automatisation/notes-de-frais',
  '/automatisation/factures-fournisseurs',
] as const;
const hub = '/automatisation-cabinet-comptable';

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`hub « Ce qu’on automatise » sans section de sources, dernière carte détachée, à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [...services, hub]) {
      await page.goto(route);
      await expect(page.locator('[data-source-section]'), `${route} : section Sources`).toHaveCount(0);
      await expect(page.locator('[data-first-hand-experience]'), `${route} : expérience de première main`).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth), `${route} : aucun débordement`).toBeLessThanOrEqual(width);
    }
    for (const route of services) {
      await page.goto(route);
      await expect(page.locator('[data-service-section="couverture"]'), `${route} : ce que le logiciel fait déjà`).toHaveCount(1);
    }

    await page.goto(hub);
    // Système de page (07/10/2026) : l'espace sous la dernière section est porté par l'appel final
    // (--section-espace au-dessus de son cadre), plus par la section elle-même. On mesure donc ce que
    // voit le lecteur : de la dernière carte au cadre de ce qui la suit.
    const ecart = await page.evaluate(() => {
      const sections = [...document.querySelectorAll<HTMLElement>('section.pv')];
      const derniere = sections[sections.length - 1];
      const cartes = derniere.querySelectorAll<HTMLElement>('li');
      const carte = cartes[cartes.length - 1];
      const suite = document.querySelector<HTMLElement>('.appel-int');
      return suite!.getBoundingClientRect().top - carte.getBoundingClientRect().bottom;
    });
    expect(ecart, 'la dernière carte ne touche pas la section suivante').toBeGreaterThanOrEqual(64);
  });
}
