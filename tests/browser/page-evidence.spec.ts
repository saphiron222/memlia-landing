import { test, expect } from '@playwright/test';

const routes = [
  '/automatisation/paie',
  '/automatisation/saisie-comptable',
  '/automatisation/rapprochement-bancaire',
  '/automatisation/notes-de-frais',
  '/automatisation/factures-fournisseurs',
] as const;

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`les sources se terminent avant l’appel final à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      const sources = page.locator('[data-source-section]');
      const callToAction = page.locator('[data-service-section="appel"]');
      await expect(sources).toHaveCount(1);
      await expect(callToAction).toHaveCount(1);
      await expect(sources.getByRole('heading', { name: 'Sources' })).toBeVisible();
      await expect(sources.getByText('Source primaire', { exact: true })).toHaveCount(0);
      await expect(sources.getByText('Ce qu’elle établit.', { exact: true })).toHaveCount(0);
      await expect(sources.getByText('Limite.', { exact: true })).toHaveCount(0);

      const separation = await page.evaluate(() => {
        const evidence = document.querySelector<HTMLElement>('[data-source-section]')!;
        const cta = document.querySelector<HTMLElement>('[data-service-section="appel"]')!;
        const evidenceStyle = getComputedStyle(evidence);
        const ctaStyle = getComputedStyle(cta);
        return {
          evidenceBottom: evidence.getBoundingClientRect().bottom,
          ctaTop: cta.getBoundingClientRect().top,
          evidenceBackground: evidenceStyle.backgroundColor,
          ctaBackground: ctaStyle.backgroundColor,
          evidencePaddingBottom: Number.parseFloat(evidenceStyle.paddingBottom),
        };
      });
      expect(Math.abs(separation.evidenceBottom - separation.ctaTop), `${route}: sections contiguës sans chevauchement`).toBeLessThanOrEqual(1);
      expect(separation.evidenceBackground, `${route}: fond des sources`).not.toBe(separation.ctaBackground);
      expect(separation.evidencePaddingBottom, `${route}: fin visuelle des sources`).toBeGreaterThanOrEqual(64);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
  });
}
