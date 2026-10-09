import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { MODELS, modelPrompt, TRANSFER_KEY } from '../../src/lib/bibliotheque-prompts.mjs';
const lib = '/outils-comptables-gratuits/bibliotheque-prompts-comptables';
const gen = '/outils-comptables-gratuits/generateur-prompt-expert-comptable';
async function assemble(page: import('@playwright/test').Page) {
  await page.locator('[name=confirmed]').check();
  await page.locator('button[type=submit]').click();
}
test('R1 : navigation réelle isolée, original édité conservé sans stockage', async ({ page }) => {
  await page.goto(gen); await page.locator('[data-seed="pieces"]').click(); await assemble(page);
  const edited = (await page.locator('[data-editor]').inputValue()) + '\nNote abstraite à conserver.';
  await page.locator('[data-editor]').fill(edited);
  const before = await page.locator('form').evaluate((f: HTMLFormElement) => Object.fromEntries(new FormData(f)));
  const popup = page.waitForEvent('popup');
  // Observe the popup before awaiting the click: opening a tab can background
  // the original while Playwright is still finishing its pointer action.
  const clicked = page.locator(`a[href="${lib}"]`).first().click();
  const other = await popup;
  await page.bringToFront();
  await clicked;
  // Suivre l’onglet consulté, sans dépendre de l’activation implicite de Chromium.
  await other.bringToFront();
  await expect(other).toHaveURL(new RegExp(lib + '$'));
  expect(await other.evaluate(() => window.opener === null)).toBe(true);
  await other.locator('[data-model="compte-rendu"] [data-adapt]').click();
  await expect(other).toHaveURL(new RegExp(gen + '$')); await assemble(other);
  await expect(other.locator('[data-editor]')).toHaveValue(modelPrompt(MODELS.find(m => m.id === 'compte-rendu')!));
  await page.bringToFront();
  await expect(page).toHaveURL(new RegExp(gen + '$'));
  await expect(page.locator('[data-editor]')).toHaveValue(edited);
  expect(await page.locator('form').evaluate((f: HTMLFormElement) => Object.fromEntries(new FormData(f)))).toEqual(before);
  for (const tab of [page, other]) {
    await tab.bringToFront();
    expect(await tab.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
  }
  await other.close();
  await page.bringToFront();
  const downloaded = page.waitForEvent('download'); await page.locator('[data-download]').click();
  expect(await readFile((await (await downloaded).path())!, 'utf8')).toBe(edited);
});
for (const name of ['task', 'input', 'format', 'validator', 'stop', 'description', 'confirmed']) {
  for (const accept of [false, true]) test(`R2 : ${name} seul, reprise ${accept ? 'acceptée' : 'refusée'}`, async ({ page }) => {
    await page.goto(gen); const field = page.locator(`form [name=${name}]`);
    if (name === 'confirmed') await field.check();
    else if (name === 'description') await field.fill('Une description abstraite à conserver.');
    else await field.selectOption(await field.locator('option').nth(1).getAttribute('value') as string);
    const before = await page.locator('form').evaluate((f: HTMLFormElement) => Object.fromEntries(new FormData(f)));
    let dialogs = 0;
    page.once('dialog', async d => { dialogs++; if (accept) await d.accept(); else await d.dismiss(); });
    await page.evaluate(key => { sessionStorage.setItem(key, JSON.stringify({ version: 1, id: 'relance-pieces' })); window.dispatchEvent(new PageTransitionEvent('pageshow')); }, TRANSFER_KEY);
    expect(dialogs).toBe(1);
    expect(await page.locator('form').evaluate((f: HTMLFormElement) => Object.fromEntries(new FormData(f)))).toEqual(accept ? { ...MODELS[0].seed } : before);
    expect(await page.evaluate(key => sessionStorage.getItem(key), TRANSFER_KEY)).toBe(null);
  });
}
test('R3 : export adapté différé exact et nettoyage', async ({ page }) => {
  await page.addInitScript(() => {
    const click = HTMLAnchorElement.prototype.click; const revoke = URL.revokeObjectURL;
    (window as any).__revoked = [];
    HTMLAnchorElement.prototype.click = function () { if (this.download && this.href.startsWith('blob:')) setTimeout(() => click.call(this), 100); else click.call(this); };
    URL.revokeObjectURL = url => { (window as any).__revoked.push(url); revoke.call(URL, url); };
  });
  await page.goto(lib); await page.locator('[data-model="relance-pieces"] [data-adapt]').click();
  await expect(page).toHaveURL(new RegExp(gen + '$')); await assemble(page);
  const downloaded = page.waitForEvent('download'); await page.locator('[data-download]').click(); const file = await downloaded;
  expect(await file.failure()).toBe(null); expect(file.suggestedFilename()).toBe('prompt-expert-comptable.txt');
  expect(await readFile((await file.path())!, 'utf8')).toBe(modelPrompt(MODELS[0]));
  await expect.poll(() => page.evaluate(() => (window as any).__revoked.length)).toBe(1);
  await expect(page.locator('a[download][href^="blob:"]')).toHaveCount(0);
});
