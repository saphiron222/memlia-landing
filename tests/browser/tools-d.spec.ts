import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const HUB = '/outils-comptables-gratuits';
const slugs = ['calculateur-marge-commerciale', 'calculateur-date-echeance-facture', 'calculateur-amortissement-comptable', 'modele-rapprochement-bancaire-excel-gratuit'];

test('formules et classeur accessibles sans JavaScript et sans compte', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${HUB}/${slugs[0]}`);
  const formulas = page.getByRole('region', { name: 'Formules de marge' });
  await expect(formulas).toContainText('Taux de marge = marge ÷ achat HT × 100');
  await expect(formulas).toContainText('Taux de marque = marge ÷ vente HT × 100');
  await page.goto(`${HUB}/${slugs[3]}`);
  const pending = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Télécharger le modèle Excel (.xlsx)' }).click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe('modele-rapprochement-bancaire.xlsx');
  const bytes = await readFile((await download.path())!);
  expect(bytes.subarray(0, 2).toString()).toBe('PK');
  await context.close();
});

test('dégressif utilise acquisition novembre plutôt que mise en service décembre', async ({ page }) => {
  await page.goto(`${HUB}/${slugs[2]}`);
  await page.getByLabel('Date de mise en service').fill('2026-12-15');
  await page.getByLabel('Méthode').selectOption('declining');
  await page.getByLabel('Date d’acquisition').fill('2026-11-15');
  await page.getByLabel(/Je confirme avoir vérifié/).check();
  await page.getByRole('button', { name: 'Calculer le plan' }).click();
  await expect(page.locator('[data-result-rows] tr').first()).toContainText('2/12 mois');
  await expect(page.locator('[data-result-rows] tr').first()).toContainText('583,33');
  await page.getByLabel('Date d’acquisition').fill('');
  await page.getByRole('button', { name: 'Calculer le plan' }).click();
  await expect(page.locator('[data-amortization-result]')).toBeHidden();
  await expect(page.locator('[data-error]')).toContainText('date d’acquisition');
  await page.getByLabel('Méthode').selectOption('linear');
  await page.getByRole('button', { name: 'Calculer le plan' }).click();
  await expect(page.locator('[data-result-rows] tr').first()).toContainText('17/365');
});

test('dégressif refuse 2009 et accepte la borne du 01/01/2010', async ({ page }) => {
  await page.goto(`${HUB}/${slugs[2]}`);
  await page.getByLabel('Méthode').selectOption('declining');
  await expect(page.locator('#amortissement-acquisition-aide')).toContainText('01/01/2010');
  await expect(page.getByLabel('Date d’acquisition')).toHaveAttribute('min', '2010-01-01');
  await page.getByLabel(/Je confirme avoir vérifié/).check();
  for (const date of ['2009-07-03', '2009-12-31']) {
    await page.getByLabel('Date d’acquisition').fill(date);
    await page.getByRole('button', { name: 'Calculer le plan' }).click();
    await expect(page.locator('[data-amortization-result]')).toBeHidden();
    await expect(page.locator('[data-error]')).toContainText('01/01/2010');
  }
  await page.getByLabel('Date d’acquisition').fill('2010-01-01');
  await page.getByRole('button', { name: 'Calculer le plan' }).click();
  await expect(page.locator('[data-result-rows] tr').first()).toContainText('12/12 mois');
  await expect(page.locator('[data-result-rows] tr').first()).toContainText('3 500,00');
});

test('exceptions inexpliquées exportées sans annoncer de validation', async ({ page }) => {
  await page.goto(`${HUB}/${slugs[3]}`);
  await page.getByRole('button', { name: 'Charger un exemple fictif' }).click();
  await page.getByLabel('Éléments inexpliqués').fill('12,34');
  await page.getByRole('button', { name: 'Contrôler les soldes' }).click();
  await expect(page.locator('[data-status]')).toContainText('NON VALIDÉ');
  await expect(page.locator('[data-difference]')).toContainText('0,00');
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: /Télécharger le CSV/ }).click();
  const bytes = await readFile((await (await pending).path())!);
  expect(bytes.toString()).toContain('NON VALIDÉ');
  expect(bytes.toString()).toContain('12,34');
  await page.getByLabel('Solde du compte 512').fill('');
  await expect(page.locator('[data-output]')).toBeHidden();
  await page.getByRole('button', { name: 'Contrôler les soldes' }).click();
  await expect(page.locator('[data-error]')).toContainText('vide, ambigu');
});

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  for (const slug of slugs) {
    test(`${slug} : lecture et calcul à ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(`${HUB}/${slug}`);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      if (width === 375 || width === 1440) {
        for (const image of await page.locator('main img').all()) {
          await image.scrollIntoViewIfNeeded();
          await expect(image).toHaveJSProperty('complete', true);
          expect(await image.evaluate((node: HTMLImageElement) => node.naturalWidth)).toBeGreaterThan(0);
        }
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.screenshot({ path: `docs/qa/site-tools-d/${slug}-${width}.png`, fullPage: true });
      }
    });
  }
}
