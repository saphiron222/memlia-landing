import { test, expect, type Page } from '@playwright/test';
const route = '/outils-comptables-gratuits/verificateur-prompt-ia';
const text = 'Préparer une synthèse. Le responsable relit avant utilisation.';
const input = (page: Page) => page.getByLabel('Votre consigne originale', { exact: true });
const confirmation = (page: Page) => page.getByLabel(/Je confirme que la consigne/);
const submit = (page: Page) => page.getByRole('button', { name: 'Analyser la structure', exact: true });
async function analyse(page: Page) {
 await input(page).fill(text); await confirmation(page).check(); await submit(page).click();
}
async function events(page: Page) {
 return page.evaluate(() => (window as any).toolEvents);
}
test.beforeEach(async ({ page }) => {
 await page.addInitScript(() => {
  (window as any).toolEvents = [];
  window.addEventListener('memlia:outil', event => (window as any).toolEvents.push((event as CustomEvent).detail));
 });
 await page.goto(route);
});
for (const sentence of ['Le responsable ne relit ni ne valide.', 'Pas besoin de faire relire par le responsable.', 'Le responsable relit mais ce contrôle est optionnel.', 'Le responsable relit ou pas.']) {
 test(`négation/restriction exacte : ${sentence}`, async ({ page }) => {
  await input(page).fill(sentence); await confirmation(page).check(); await submit(page).click();
  const finding = page.locator('[data-findings] li').nth(3);
  await expect(finding.locator('h3')).toHaveText('Validation humaine : à examiner');
  await expect(finding.locator('blockquote')).toHaveText(sentence);
 });
}
test('annulation sans succès ni recalcul ; copies/export accomplis et détails bornés', async ({ page, context }) => {
 await context.grantPermissions(['clipboard-read', 'clipboard-write']);
 await analyse(page);
 await page.getByLabel('Proposition à compléter et à relire').fill('Édition fictive conservée.');
 const before = await events(page);
 page.once('dialog', d => d.dismiss()); await submit(page).click();
 await expect(page.locator('[data-status]')).toContainText('Analyse annulée');
 expect(await events(page)).toEqual(before);
 await expect(page.getByLabel('Proposition à compléter et à relire')).toHaveValue('Édition fictive conservée.');
 for (const name of ['Copier l’original', 'Copier la proposition']) {
  await page.getByRole('button', { name, exact: true }).click();
  await expect.poll(async () => (await events(page)).filter((e: any) => e.action === 'copie').length).toBe(name === 'Copier l’original' ? 1 : 2);
 }
 const download = page.waitForEvent('download');
 await page.getByRole('button', { name: 'Exporter le rapport (.txt)' }).click(); await download;
 expect((await events(page)).map((e: any) => e.action)).toEqual(['demarrage', 'reussite', 'copie', 'copie', 'export']);
 page.once('dialog', d => d.accept()); await submit(page).click();
 expect((await events(page)).map((e: any) => e.action)).toEqual(['demarrage', 'reussite', 'copie', 'copie', 'export', 'reussite', 'recalcul']);
 for (const detail of await events(page)) expect(Object.keys(detail).sort()).toEqual(['action', 'outil']);
 expect(JSON.stringify(await events(page))).not.toContain(text);
});
test('copie échouée et export refusé sans événement de réussite', async ({ page }) => {
 await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw Error('disabled'); } } }));
 await analyse(page); const before = await events(page);
 await page.getByRole('button', { name: 'Copier l’original', exact: true }).click();
 await expect(page.locator('[data-status]')).toContainText('Texte sélectionné');
 expect(await events(page)).toEqual(before);
 await page.getByLabel('Proposition à compléter et à relire').fill('exemple@example.test');
 await page.getByRole('button', { name: 'Exporter le rapport (.txt)' }).click();
 await expect(page.locator('[data-status]')).toContainText('Coordonnée');
 expect(await events(page)).toEqual(before);
});
test('erreur clavier associée au premier contrôle invalide et nettoyée', async ({ page }) => {
 await input(page).fill(text); await submit(page).click();
 await expect(confirmation(page)).toBeFocused();
 await expect(confirmation(page)).toHaveAttribute('aria-invalid', 'true');
 await expect(confirmation(page)).toHaveAttribute('aria-describedby', /verifier-error/);
 await expect(input(page)).not.toHaveAttribute('aria-invalid', 'true');
 await page.keyboard.press('Space');
 await expect(confirmation(page)).not.toHaveAttribute('aria-invalid', 'true');
 await input(page).fill(''); await submit(page).click();
 await expect(input(page)).toBeFocused(); await expect(input(page)).toHaveAttribute('aria-invalid', 'true');
 await expect(input(page)).toHaveAttribute('aria-describedby', /verifier-error/);
 await input(page).fill('exemple@example.test'); await submit(page).click();
 await expect(input(page)).toBeFocused(); await expect(page.locator('[data-error]')).toContainText('Coordonnée');
 await input(page).fill(text); await submit(page).click();
 await expect(input(page)).not.toHaveAttribute('aria-invalid', 'true');
 await expect(confirmation(page)).not.toHaveAttribute('aria-invalid', 'true');
});
