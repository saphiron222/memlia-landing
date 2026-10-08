import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const tool = '/outils-comptables-gratuits/modele-rapprochement-bancaire-excel-gratuit';

test('méthode : règle écrite, livraison et maintenance sans déplacer la décision', async ({ page }) => {
  await page.goto('/methode');
  await expect(page.locator('h1')).toHaveText('Observer. Écrire. Éprouver. Livrer.');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://memlia.fr/methode');
  const cadrage = page.locator('#cadrer');
  await expect(cadrage).toContainText('la frontière entre préparation, validation et jugement ; la proposition distincte de vos saisies ; l’arrêt dans le doute ; le jeu d’essai fictif');
  await expect(cadrage).toContainText('vos saisies restent intactes');
  await expect(page.getByRole('table', { name: 'La frontière de la règle écrite' }).getByRole('cell')).toHaveCount(3);
  await expect(page.locator('#valider')).toContainText('maintenance, le support et les évolutions');
  await expect(page.locator('#valider')).toContainText('soumise à votre recette avant sa mise en service');
  const ctas = page.getByRole('link', { name: 'Confier une première tâche', exact: true });
  expect(await ctas.count()).toBeGreaterThan(0);
  for (const cta of await ctas.all()) await expect(cta).toHaveAttribute('href', '/contact');
  const main = page.locator('main');
  await expect(main).toContainText('se télécharge sans compte, avant tout contrôle');
  await expect(main).toContainText('visibles et exportables avec l’état NON VALIDÉ');
  await expect(main).toContainText('Télécharger le classeur ou exporter le contrôle ne valide pas le rapprochement');
  await expect(main).not.toContainText('ne se télécharge que lorsque');
  for (const href of await main.locator('a[href^="/"]').evaluateAll(nodes => [...new Set(nodes.map(node => node.getAttribute('href')!))])) {
    const response = await page.request.get(href);
    expect(response.status(), href).toBe(200);
  }
});

test('renvoi méthode : classeur immédiat, écart exporté NON VALIDÉ et concordance à valider', async ({ page }) => {
  await page.goto('/methode');
  await page.getByRole('link', { name: 'modèle de rapprochement bancaire ouvrable dans Excel' }).click();
  await expect(page).toHaveURL(new RegExp(tool));
  const workbookPending = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Télécharger le modèle Excel (.xlsx)' }).click();
  const workbook = await workbookPending;
  expect(workbook.suggestedFilename()).toBe('modele-rapprochement-bancaire.xlsx');
  expect((await readFile((await workbook.path())!)).subarray(0, 2).toString()).toBe('PK');
  await page.getByRole('button', { name: 'Charger un exemple fictif' }).click();
  await page.getByLabel('Solde du compte 512').fill('900,00');
  await page.getByRole('button', { name: 'Contrôler les soldes' }).click();
  await expect(page.locator('[data-difference]')).toContainText('50,00');
  await expect(page.locator('[data-status]')).toContainText('NON VALIDÉ');
  const csvPending = page.waitForEvent('download');
  await page.getByRole('button', { name: /Télécharger le CSV/ }).click();
  const csv = await readFile((await (await csvPending).path())!, 'utf8');
  expect(csv).toContain('NON VALIDÉ');
  expect(csv).toContain('"Différence";"50,00"');
  await page.getByRole('button', { name: 'Charger un exemple fictif' }).click();
  await page.getByRole('button', { name: 'Contrôler les soldes' }).click();
  await expect(page.locator('[data-status]')).toContainText('Soldes concordants — à valider par le collaborateur');
});

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`méthode : structure et lecture à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/methode');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await expect(page.locator('.pv-etape')).toHaveCount(4);
    for (const image of await page.locator('main img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveJSProperty('complete', true);
      expect(await image.evaluate((node: HTMLImageElement) => node.naturalWidth)).toBeGreaterThan(0);
    }
    if (width === 375 || width === 1440) {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: `.qa/methode-${width}.png`, fullPage: true });
    }
  });
}
