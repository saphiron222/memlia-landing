import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const route = '/outils-comptables-gratuits/generateur-charte-ia-cabinet';
const notice = 'Trame non officielle — proposition à relire et à faire adopter par le cabinet. Elle ne remplace pas les ressources de l’Ordre et ne certifie aucune conformité. Aucun usage sur dossier réel n’est autorisé par ce document.';
const documentOracle = (body: string) => `# Charte IA du cabinet\n\n${notice}\n\n${body}\n`;
const example = async (page: Page) => { await page.goto(route); await page.getByRole('button', { name: 'Charger un exemple fictif' }).click(); await page.getByRole('button', { name: 'Préparer la charte', exact: true }).click(); };
test('nominal, édition conservée, exports identiques et impression', async ({ page }) => {
  await example(page);
  const editor = page.getByLabel('Clauses à relire et à modifier');
  await expect(editor).toHaveValue(/Relance de pièces/);
  await expect(editor).toHaveValue(/Synthèse de documents fictifs/);
  await expect(editor).toHaveValue(/Responsable des usages : à compléter/);
  const edited = await editor.inputValue() + '\nClause ajoutée par le cabinet.';
  await editor.fill(edited);
  const expected = documentOracle(edited);
  await expect(page.locator('[data-print]')).toHaveText(expected);
  for (const name of ['Exporter .md', 'Exporter .txt']) {
    const downloadEvent = page.waitForEvent('download');
    await page.getByRole('button', { name, exact: true }).click();
    const download = await downloadEvent;
    const content = await readFile((await download.path())!, 'utf8');
    expect(content).toBe(expected);
  }
  await page.getByLabel('Rôle responsable des usages').fill('Référent outils');
  page.once('dialog', (dialog) => dialog.dismiss());
  await page.getByRole('button', { name: 'Préparer la charte', exact: true }).click();
  await expect(editor).toHaveValue(edited);
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Préparer la charte', exact: true }).click();
  await expect(editor).toHaveValue(/Référent outils/);
  await expect(editor).not.toHaveValue(/Clause ajoutée/);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('[data-print]')).toBeVisible();
  await expect(page.locator('[data-charter-form]')).not.toBeVisible();
});
test('refus conserve les éditions, reset annulable et copie en repli', async ({ page }) => {
  await example(page);
  const editor = page.getByLabel('Clauses à relire et à modifier');
  const text = await editor.inputValue();
  await page.getByLabel('Envoi de fichiers clients à une IA publique').check();
  await page.getByRole('button', { name: 'Préparer la charte', exact: true }).click();
  await expect(page.locator('[data-error]')).toContainText('contradictoire');
  await expect(editor).toHaveValue(text);
  await expect(page.getByRole('button', { name: 'Exporter .md', exact: true })).toBeDisabled();
  await page.getByLabel('Envoi de fichiers clients à une IA publique').uncheck();
  await page.getByRole('button', { name: 'Préparer la charte', exact: true }).click();
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw Error('denied'); } }, configurable: true }));
  await page.getByRole('button', { name: 'Copier la charte', exact: true }).click();
  await expect(page.locator('[data-status]')).toContainText('Copie bloquée');
  page.once('dialog', (dialog) => dialog.dismiss());
  await page.getByRole('button', { name: 'Tout effacer', exact: true }).click();
  await expect(editor).toHaveValue(text);
});
for (const mode of ['refusé', 'indisponible']) {
  test(`copie de secours : document complet, Clipboard ${mode}`, async ({ page }) => {
    await example(page);
    const editor = page.getByLabel('Clauses à relire et à modifier');
    const edited = await editor.inputValue() + '\nClause fictive conservée <b>sans HTML</b>.';
    await editor.fill(edited);
    const expected = documentOracle(edited);
    await page.evaluate(mode => Object.defineProperty(navigator, 'clipboard', {
      value: mode === 'refusé' ? { writeText: async () => { throw Error('denied'); } } : undefined,
      configurable: true,
    }), mode);
    await page.getByRole('button', { name: 'Copier la charte', exact: true }).click();
    const selected = await page.evaluate(() => {
      const active = document.activeElement;
      return active instanceof HTMLTextAreaElement
        ? active.value.slice(active.selectionStart, active.selectionEnd)
        : window.getSelection()?.toString();
    });
    expect(selected).toBe(expected);
    await expect(editor).toHaveValue(edited);
    await expect(page.locator('[data-print]')).toHaveText(expected);
    for (const name of ['Exporter .md', 'Exporter .txt']) {
      const downloadEvent = page.waitForEvent('download');
      await page.getByRole('button', { name, exact: true }).click();
      const download = await downloadEvent;
      expect(await readFile((await download.path())!, 'utf8')).toBe(expected);
    }
  });
}
test('six largeurs, clavier, traitement sans réseau ni stockage', async ({ page }, testInfo) => {
  await example(page);
  await page.evaluate(() => document.fonts.ready);
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.getByLabel('Rôle responsable des usages').fill('Référent fictif');
  await page.getByRole('button', { name: 'Préparer la charte', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('Clauses à relire et à modifier')).toHaveValue(/Référent fictif/);
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if ([375, 1440].includes(width)) await page.screenshot({ path: testInfo.outputPath(`charte-${width}.png`), fullPage: true, animations: 'disabled' });
  }
  expect(requests).toEqual([]);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length, cookies: document.cookie }))).toEqual({ local: 0, session: 0, cookies: '' });
});
