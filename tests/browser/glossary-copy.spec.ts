import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
const baseline = readFileSync('docs/qa/copy-glossaire/sources/production-avant.html', 'utf8');
const oldAnchors = [...baseline.matchAll(/class="glossaire-entree"[^>]*id="([^"]+)"/g)].map(match => match[1]);

for (const width of [375, 1440]) {
  test(`copy glossaire : CONT-10/11/12/13 et ancres conservées à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/glossaire');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('#prelevement-sepa-et-rejet')).toContainText('avant toute programmation ou transmission bancaire');
    await expect(page.locator('#honoraires-mensualises-et-actes-hors-forfait')).toContainText('facturés ou répartis mensuellement');
    await expect(page.locator('#generation-augmentee-par-recuperation')).toContainText('conserve ses connaissances d’entraînement');
    await expect(page.locator('.entree-liens a[href^="/#"]')).toHaveCount(0);
    await expect(page.locator('#sortie a.btn-principal')).toHaveText('Confier une première tâche');
    await expect(page.locator('#sortie a.btn-principal')).toHaveAttribute('href', '/contact');
    expect(oldAnchors.length).toBeGreaterThan(0);
    const current = await page.locator('.glossaire-entree').evaluateAll(nodes => nodes.map(node => node.id));
    for (const anchor of oldAnchors) expect(current).toContain(anchor);
    await page.goto('/glossaire#generation-augmentee-par-recuperation');
    await expect(page.locator('#generation-augmentee-par-recuperation')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.screenshot({ path: `docs/qa/copy-glossaire/glossaire-${width}.png`, fullPage: true });
    await page.locator('#sortie').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `docs/qa/copy-glossaire/sortie-${width}.png` });
  });
}
