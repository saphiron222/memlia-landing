import { test, expect } from '@playwright/test';
import { chargerImagesDifferees } from './helpers/images-chargees';
import { readFile } from 'node:fs/promises';
import { MODELS, modelPrompt, TRANSFER_KEY } from '../../src/lib/bibliotheque-prompts.mjs';
const ROUTE = '/outils-comptables-gratuits/bibliotheque-prompts-comptables';
const GENERATOR = '/outils-comptables-gratuits/generateur-prompt-expert-comptable';

test('sans JS : douze fiches, prompts complets et limites lisibles', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage(); await page.goto(ROUTE); await ouvrirReglages(page);
  await expect(page.locator('[data-model]')).toHaveCount(12);
  await expect(page.getByLabel('Rechercher un prompt')).toBeDisabled();
  await expect(page.locator('[data-copy]').first()).toBeDisabled();
  for (const m of MODELS) {
    const card = page.locator(`[data-model="${m.id}"]`);
    await expect(card).toBeVisible();
    await expect(page.locator(`[data-prompt-reader="${m.id}"] [data-text]`)).toHaveValue(modelPrompt(m));
  }
  await context.close();
});
test('filtres combinés, recherche vide, effacement sans nouvelle URL', async ({ page }) => {
  await page.goto(ROUTE); await ouvrirReglages(page);
  await page.getByLabel('Pôle', { exact: true }).selectOption('relation-client');
  await page.getByLabel('Format attendu', { exact: true }).selectOption('mail');
  await expect(page.locator('[data-model]:visible')).toHaveCount(3);
  await expect(page.locator('[data-count]')).toHaveText('3 modèles disponibles.');
  await page.getByLabel('Rechercher un prompt').fill('introuvablexyz');
  await expect(page.locator('[data-empty]')).toBeVisible();
  await expect(page.locator('[data-count]')).toHaveText('0 modèle disponible.');
  await page.getByRole('button', { name: 'Effacer les filtres' }).click();
  await expect(page.locator('[data-model]:visible')).toHaveCount(12);
  expect(new URL(page.url()).search).toBe('');
});
for (const m of MODELS) test(`copie et export exacts sans transmission de contenu : ${m.id}`, async ({ page }) => {
  // Une page par fiche : Chromium bloque une rafale de plus de dix téléchargements.
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (text: string) => { (window as any).__copy = text; } } }));
  await page.goto(ROUTE); await ouvrirReglages(page); await chargerImagesDifferees(page);
  const requests: string[] = []; page.on('request', r => requests.push(`${r.method()} ${r.url()}`));
  const card = await lirePrompt(page,m.id);
  await card.getByRole('button', { name: 'Copier le prompt' }).click();
  await expect.poll(() => page.evaluate(() => (window as any).__copy)).toBe(modelPrompt(m));
  const promise = page.waitForEvent('download');
  await card.getByRole('button', { name: 'Exporter en texte' }).click();
  const dl = await promise; expect(dl.suggestedFilename()).toBe(`prompt-${m.id}.txt`);
  expect(await readFile((await dl.path())!, 'utf8')).toBe(modelPrompt(m));
  // Chromium peut relire son favicon après l’ancre publique ; aucun autre appel n’est permis.
  expect(requests.filter(r=>r!==`GET ${new URL('/favicon.svg',page.url()).href}`)).toEqual([]);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
});
test('export : navigation différée et nettoyage après consommation du Blob', async ({ page }) => {
  await page.addInitScript(() => {
    const click = HTMLAnchorElement.prototype.click;
    const revoke = URL.revokeObjectURL;
    (window as any).__revoked = [];
    HTMLAnchorElement.prototype.click = function () {
      if (this.download && this.href.startsWith('blob:')) {
        // Reproduire un navigateur qui consomme le lien dans une tâche ultérieure.
        setTimeout(() => click.call(this), 100);
      } else click.call(this);
    };
    URL.revokeObjectURL = url => {
      (window as any).__revoked.push(url);
      revoke.call(URL, url);
    };
  });
  await page.goto(ROUTE); await ouvrirReglages(page);
  const download = page.waitForEvent('download');
  const card=await lirePrompt(page,'relance-pieces'); await card.locator('[data-export]').click();
  const file = await download;
  expect(await readFile((await file.path())!, 'utf8')).toBe(modelPrompt(MODELS[0]));
  await expect.poll(() => page.evaluate(() => (window as any).__revoked.length)).toBe(1);
  await expect(page.locator('a[download][href^="blob:"]')).toHaveCount(0);
});
test('copie refusée : texte complet sélectionné, aucune perte', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new Error('denied'); } } }));
  await page.goto(ROUTE); await ouvrirReglages(page); const card = await lirePrompt(page,'relance-pieces');
  await card.getByRole('button', { name: 'Copier le prompt' }).click();
  await expect(card.locator('[data-text]')).toBeFocused();
  expect(await card.locator('[data-text]').evaluate((e: HTMLTextAreaElement) => e.selectionEnd - e.selectionStart)).toBe(modelPrompt(MODELS[0]).length);
});
test('reprise publique complète, consommée puis éditions protégées', async ({ page }) => {
  await page.goto(ROUTE); await ouvrirReglages(page);
  const card=await lirePrompt(page,'relance-pieces');await card.getByRole('link', { name: 'Adapter dans le générateur' }).click();
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
  await page.goto(ROUTE); await ouvrirReglages(page);
  const card = await lirePrompt(page,'relance-pieces');
  await card.getByRole('link', { name: 'Adapter dans le générateur' }).click();
  await expect(card.locator('[data-card-status]')).toContainText('Stockage temporaire indisponible');
  await expect(card).toBeVisible();await expect(card.locator('[data-adapt-fallback]')).toBeVisible();await expect(card.locator('[data-adapt-fallback]')).toHaveAttribute('href',GENERATOR); expect(new URL(page.url()).pathname).toBe(ROUTE);
});
for (const width of [320, 375, 768, 1024, 1440, 1920]) test(`clavier, reflow et captures à ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 }); await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(ROUTE); await ouvrirReglages(page); await page.waitForLoadState('networkidle');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByLabel('Pôle', { exact: true }).selectOption('relation-client');
  await page.getByLabel('Tâche', { exact: true }).selectOption('relance-pieces');
  const summary = page.locator('[data-model="relance-pieces"] [data-read]');
  await summary.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('[data-prompt-reader="relance-pieces"] [data-text]')).toBeVisible();
  await page.keyboard.press('Tab'); await expect(page.locator('[data-prompt-reader="relance-pieces"] [data-text]')).toBeFocused();
  const sizes = await page.locator('[data-library] button:visible,[data-library] select:visible,[data-library] input:visible,[data-library] a.btn:visible').evaluateAll(els => els.map(el => el.getBoundingClientRect().height));
  expect(sizes.every(h => h >= 44)).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({ path: `.qa/bibliotheque-${width}.png`, fullPage: true });
});

async function ouvrirReglages(page: any){ for (const summary of await page.locator('[data-outil-options]').locator(':scope > summary').all()) { if(await summary.isVisible() && await summary.locator('..').getAttribute('open') === null) await summary.click(); } }

async function lirePrompt(page:any,id:string){await page.locator(`[data-model="${id}"] [data-read]`).click();const reader=page.locator(`[data-prompt-reader="${id}"]`);await reader.locator('summary').click();return reader;}

test('reprise Accusé : texte et panneau de règle partagent la même préparation',async({page})=>{
 await page.goto(ROUTE);const model=MODELS.find(m=>m.id==='accuse-reception')!;const card=await lirePrompt(page,model.id);await card.getByRole('link',{name:'Adapter dans le générateur'}).click();await page.getByLabel(/Je confirme/).check();await page.getByRole('button',{name:'Assembler le prompt'}).click();await expect(page.getByLabel('Prompt éditable')).toHaveValue(modelPrompt(model));await page.getByText('Règle et cas d’essai',{exact:true}).click();const boundary=page.locator('[data-boundary]');await expect(boundary).toContainText(model.description);await expect(boundary).toContainText(model.human);await expect(boundary).not.toContainText('Préparer un brouillon générique de demande de pièces manquantes.');
});
