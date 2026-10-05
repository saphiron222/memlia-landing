import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { MODELS, modelPrompt, TRANSFER_KEY } from '../../src/lib/bibliotheque-prompts.mjs';
const ROUTE = '/outils-comptables-gratuits/bibliotheque-prompts-comptables';
const GENERATOR = '/outils-comptables-gratuits/generateur-prompt-expert-comptable';

test('sans JS : douze fiches, prompts complets et limites lisibles', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage(); await page.goto(ROUTE);
  await expect(page.locator('[data-model]')).toHaveCount(12);
  for (const m of MODELS) {
    const card = page.locator(`[data-model="${m.id}"]`);
    await expect(card).toBeVisible(); await card.locator('summary').click();
    await expect(card.locator('[data-text]')).toHaveValue(modelPrompt(m));
  }
  await context.close();
});
test('filtres combinés, recherche vide, effacement sans nouvelle URL', async ({ page }) => {
  await page.goto(ROUTE);
  await page.getByLabel('Pôle', { exact: true }).selectOption('relation-client');
  await page.getByLabel('Format attendu', { exact: true }).selectOption('mail');
  await expect(page.locator('[data-model]:visible')).toHaveCount(3);
  await expect(page.locator('[data-count]')).toHaveText('3 modèles disponibles.');
  await page.getByLabel('Rechercher un modèle').fill('introuvablexyz');
  await expect(page.locator('[data-empty]')).toBeVisible();
  await expect(page.locator('[data-count]')).toHaveText('0 modèle disponible.');
  await page.getByRole('button', { name: 'Effacer les filtres' }).click();
  await expect(page.locator('[data-model]:visible')).toHaveCount(12);
  expect(new URL(page.url()).search).toBe('');
});
test('les douze copies et exports sont exactement les prompts affichés, sans réseau', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (text: string) => { (window as any).__copy = text; } } }));
  await page.goto(ROUTE); await page.waitForLoadState('networkidle');
  const requests: string[] = []; page.on('request', r => requests.push(r.url()));
  for (const m of MODELS) {
    const card = page.locator(`[data-model="${m.id}"]`);
    await card.getByRole('button', { name: 'Copier le modèle' }).click();
    await expect.poll(() => page.evaluate(() => (window as any).__copy)).toBe(modelPrompt(m));
    const promise = page.waitForEvent('download');
    await card.getByRole('button', { name: 'Exporter en texte' }).click();
    const dl = await promise; expect(dl.suggestedFilename()).toBe(`prompt-${m.id}.txt`);
    expect(await readFile((await dl.path())!, 'utf8')).toBe(modelPrompt(m));
  }
  expect(requests).toEqual([]);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
});
test('copie refusée : texte complet sélectionné, aucune perte', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new Error('denied'); } } }));
  await page.goto(ROUTE); const card = page.locator('[data-model="relance-pieces"]');
  await card.getByRole('button', { name: 'Copier le modèle' }).click();
  await expect(card.locator('[data-text]')).toBeFocused();
  expect(await card.locator('[data-text]').evaluate((e: HTMLTextAreaElement) => e.selectionEnd - e.selectionStart)).toBe(modelPrompt(MODELS[0]).length);
});
test('reprise publique complète, consommée puis éditions protégées', async ({ page }) => {
  await page.goto(ROUTE);
  await page.locator('[data-model="relance-pieces"]').getByRole('link', { name: 'Adapter dans le générateur' }).click();
  await expect(page).toHaveURL(new RegExp(GENERATOR + '$'));
  await expect(page.getByLabel('Description abstraite de la tâche')).toHaveValue(MODELS[0].description);
  expect(await page.evaluate(key => sessionStorage.getItem(key), TRANSFER_KEY)).toBe(null);
  await page.getByLabel(/Je confirme/).check();
  await page.getByRole('button', { name: 'Assembler le prompt' }).click();
  await expect(page.getByLabel('Prompt éditable')).toHaveValue(modelPrompt(MODELS[0]));
  const edited = modelPrompt(MODELS[0]) + '\nCommentaire abstrait conservé.';
  await page.getByLabel('Prompt éditable').fill(edited);
  // Simuler la réception d’une nouvelle amorce sur la page vivante (cas retour bfcache).
  await page.evaluate(key => sessionStorage.setItem(key, JSON.stringify({ version: 1, id: 'compte-rendu' })), TRANSFER_KEY);
  page.once('dialog', d => d.dismiss());
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow')));
  await expect(page.getByLabel('Prompt éditable')).toHaveValue(edited);
  await expect(page.getByLabel('Description abstraite de la tâche')).toHaveValue(MODELS[0].description);
  await page.evaluate(key => sessionStorage.setItem(key, JSON.stringify({ version: 1, id: 'compte-rendu' })), TRANSFER_KEY);
  page.once('dialog', d => d.accept());
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow')));
  await expect(page.getByLabel('Prompt éditable')).toHaveValue(edited);
  await page.getByLabel(/Je confirme/).check();
  page.once('dialog', d => d.dismiss());
  await page.getByRole('button', { name: 'Assembler le prompt' }).click();
  await expect(page.getByLabel('Prompt éditable')).toHaveValue(edited);
});
test('stockage indisponible : repli explicite, catalogue conservé', async ({ page }) => {
  await page.addInitScript(() => Storage.prototype.setItem = () => { throw new Error('denied'); });
  await page.goto(ROUTE);
  const card = page.locator('[data-model="relance-pieces"]');
  await card.getByRole('link', { name: 'Adapter dans le générateur' }).click();
  await expect(card.locator('[data-card-status]')).toContainText('Stockage temporaire indisponible');
  await expect(card).toBeVisible(); expect(new URL(page.url()).pathname).toBe(ROUTE);
});
for (const width of [320, 375, 768, 1024, 1440, 1920]) test(`clavier, reflow et captures à ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 }); await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(ROUTE); await page.waitForLoadState('networkidle');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByLabel('Pôle', { exact: true }).selectOption('relation-client');
  await page.getByLabel('Tâche', { exact: true }).selectOption('relance-pieces');
  const summary = page.locator('[data-model="relance-pieces"] summary');
  await summary.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('[data-model="relance-pieces"] [data-text]')).toBeVisible();
  await page.keyboard.press('Tab'); await expect(page.locator('[data-model="relance-pieces"] [data-text]')).toBeFocused();
  const sizes = await page.locator('[data-library] button:visible,[data-library] select:visible,[data-library] input:visible,[data-library] a.btn:visible').evaluateAll(els => els.map(el => el.getBoundingClientRect().height));
  expect(sizes.every(h => h >= 44)).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({ path: `.qa/bibliotheque-${width}.png`, fullPage: true });
});
