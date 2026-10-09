import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { MODELS, modelPrompt, TRANSFER_KEY } from '../../src/lib/bibliotheque-prompts.mjs';
const lib = '/outils-comptables-gratuits/bibliotheque-prompts-comptables';
const gen = '/outils-comptables-gratuits/generateur-prompt-expert-comptable';
async function assemble(page: import('@playwright/test').Page) {
  await page.locator('[name=confirmed]').check();
  await page.locator('button[type=submit]').click();
}
async function assembleModel(page: import('@playwright/test').Page, model: typeof MODELS[number]) {
  // L'URL et la visibilité du formulaire précèdent l'exécution du module.
  // Attendre la reprise réelle sans remplir les champs ni accepter un dialogue.
  for (const name of ['description', 'task', 'input', 'format', 'validator', 'stop'] as const) {
    await expect(page.locator(`form [name=${name}]`)).toHaveValue(model.seed[name]);
  }
  await assemble(page);
}
for (const navigationDelay of [0, 250]) test(`R1 : navigation réelle isolée, original édité conservé sans stockage${navigationDelay ? ', destination différée' : ''}`, async ({ page, context }) => {
  if (navigationDelay) await context.route(`**${lib}`, async route => {
    await delay(navigationDelay);
    await route.continue();
  });
  await page.goto(gen); await page.locator('[data-seed="pieces"]').click(); await assemble(page);
  const edited = (await page.locator('[data-editor]').inputValue()) + '\nNote abstraite à conserver.';
  await page.locator('[data-editor]').fill(edited);
  const before = await page.locator('form').evaluate((f: HTMLFormElement) => Object.fromEntries(new FormData(f)));
  // Sur Chromium macOS, l'acquittement du clic peut rester suspendu dans
  // l'onglet parent masqué. Le réactiver dès le popup, sans attendre le clic.
  const [other] = await Promise.all([
    page.waitForEvent('popup').then(async tab => { await page.bringToFront(); return tab; }),
    page.locator(`a[href="${lib}"]`).first().click(),
  ]);
  await other.bringToFront(); await expect(other).toHaveURL(new RegExp(lib + '$'));
  expect(await other.evaluate(() => window.opener === null)).toBe(true);
  await other.locator('[data-model="compte-rendu"] [data-adapt]').click();
  await expect(other).toHaveURL(new RegExp(gen + '$'));
  await assembleModel(other, MODELS.find(m => m.id === 'compte-rendu')!);
  await expect(other.locator('[data-editor]')).toHaveValue(modelPrompt(MODELS.find(m => m.id === 'compte-rendu')!));
  // Chromium macOS peut suspendre l'évaluation dans l'onglet en arrière-plan.
  // Revenir à l'original comme un utilisateur, sans toucher à son contenu.
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
test('R1 : module indisponible, la recette refuse de confirmer ou soumettre', async ({ page }) => {
  await page.goto(gen);
  const moduleUrl = await page.locator('script[src*="GenerateurPrompt."]').getAttribute('src');
  expect(moduleUrl).toBeTruthy();
  await page.goto(lib);
  await page.route(`**${moduleUrl}`, route => route.abort());
  const submissions: string[] = [];
  page.on('request', request => {
    const url = new URL(request.url());
    if (request.isNavigationRequest() && url.pathname === gen && url.search) submissions.push(request.url());
  });
  await page.locator('[data-model="compte-rendu"] [data-adapt]').click();
  await expect(page).toHaveURL(new RegExp(gen + '$'));
  await expect(assembleModel(page, MODELS.find(m => m.id === 'compte-rendu')!)).rejects.toThrow(/toHaveValue/);
  await expect(page.locator('form [name=description]')).toHaveValue('');
  await expect(page.locator('[name=confirmed]')).not.toBeChecked();
  await expect(page.locator('[data-editor]')).toHaveValue('');
  expect(submissions).toEqual([]);
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
  await expect(page).toHaveURL(new RegExp(gen + '$')); await assembleModel(page, MODELS[0]);
  const downloaded = page.waitForEvent('download'); await page.locator('[data-download]').click(); const file = await downloaded;
  expect(await file.failure()).toBe(null); expect(file.suggestedFilename()).toBe('prompt-expert-comptable.txt');
  expect(await readFile((await file.path())!, 'utf8')).toBe(modelPrompt(MODELS[0]));
  await expect.poll(() => page.evaluate(() => (window as any).__revoked.length)).toBe(1);
  await expect(page.locator('a[download][href^="blob:"]')).toHaveCount(0);
});
