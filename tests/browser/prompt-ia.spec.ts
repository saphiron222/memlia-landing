import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const ROUTE = '/outils-comptables-gratuits/generateur-prompt-ia-gratuit';
const confirm = (page: import('@playwright/test').Page) => page.getByLabel(/Je confirme une description/).check();
async function seed(page: import('@playwright/test').Page, name = 'Préparer une réunion') {
  await page.getByRole('button', { name, exact: true }).click(); await confirm(page);
}
async function generate(page: import('@playwright/test').Page) { await seed(page); await page.getByRole('button', { name: 'Assembler le prompt' }).click(); }
test('réunion, prévisualisation, copies et deux exports exacts ; pas de réseau ni stockage', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.addInitScript(() => { (window as any).events = []; window.addEventListener('memlia:outil', (event) => (window as any).events.push((event as CustomEvent).detail)); });
  await page.goto(ROUTE); await page.waitForLoadState('networkidle');
  const requests: string[] = []; page.on('request', (request) => requests.push(request.url()));
  const cookiesBefore = await context.cookies();
  await seed(page);
  await expect(page.locator('[data-preview]')).toContainText('équipe projet');
  await expect(page.locator('[data-output]')).toBeHidden();
  await page.getByRole('button', { name: 'Assembler le prompt' }).click();
  const editor = page.getByLabel('Prompt éditable');
  const initial = await editor.inputValue();
  for (const term of ['action / responsable / délai', 'Arrêt', 'équipe projet']) expect(initial).toContain(term);
  const edited = initial + '\nRelecture : conserver les questions ouvertes.';
  await editor.fill(edited);
  await page.getByRole('button', { name: 'Copier le prompt', exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(edited);
  for (const type of ['texte (.txt)', 'JSON (.json)']) {
    const pending = page.waitForEvent('download'); await page.getByRole('button', { name: `Exporter en ${type}`, exact: true }).click();
    const file = await pending; const bytes = await readFile((await file.path())!, 'utf8');
    if (type.startsWith('JSON')) expect(JSON.parse(bytes)).toEqual({ version: 1, prompt: edited }); else expect(bytes).toBe(edited);
  }
  await page.getByLabel('Format de la future réponse').selectOption('json');
  await expect(editor).toHaveValue(edited);
  await expect(page.locator('[data-preview]')).toContainText('"additionalProperties": false');
  await expect(page.getByRole('button', { name: 'Copier le prompt', exact: true })).toBeEnabled();
  page.once('dialog', (dialog) => dialog.dismiss()); await page.getByRole('button', { name: 'Assembler le prompt' }).click();
  await expect(editor).toHaveValue(edited);
  page.once('dialog', (dialog) => dialog.accept()); await page.getByRole('button', { name: 'Assembler le prompt' }).click();
  const jsonPrompt = await editor.inputValue();
  const schema = JSON.parse(jsonPrompt.split('```json\n')[1].split('\n```')[0]); expect(schema.required).toEqual(['synthese', 'actions', 'questions']);
  expect(requests).toEqual([]);
  expect(await page.evaluate(async () => ({ local: localStorage.length, session: sessionStorage.length, db: (await indexedDB.databases()).length }))).toEqual({ local: 0, session: 0, db: 0 });
  expect(await context.cookies()).toEqual(cookiesBefore);
  const events = await page.evaluate(() => (window as any).events);
  for (const event of events) expect(Object.keys(event).sort()).toEqual(['action', 'outil']);
  expect(events).toContainEqual({ action: 'export', outil: 'generateur-prompt-ia-gratuit' });
});
test('refus reliés au champ, original conservé, annulation exemple et effacement', async ({ page }) => {
  await page.goto(ROUTE); await generate(page);
  const editor = page.getByLabel('Prompt éditable'); const edited = await editor.inputValue() + '\nÉdition humaine.'; await editor.fill(edited);
  for (const text of ['', 'Générer une image pour le projet fictif', 'Inventer les informations manquantes']) {
    await page.getByLabel(/Objectif abstrait/).fill(text); await page.getByRole('button', { name: 'Assembler le prompt' }).click();
    await expect(page.getByLabel(/Objectif abstrait/)).toBeFocused(); await expect(page.getByLabel(/Objectif abstrait/)).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('[data-error]')).toBeVisible(); await expect(editor).toHaveValue(edited);
  }
  page.once('dialog', (dialog) => dialog.dismiss()); await page.getByRole('button', { name: 'Résumer', exact: true }).click();
  await expect(page.getByLabel('Tâche texte')).toHaveValue('reunion'); await expect(editor).toHaveValue(edited);
  page.once('dialog', (dialog) => dialog.dismiss()); await page.getByRole('button', { name: 'Effacer', exact: true }).click(); await expect(editor).toHaveValue(edited);
  page.once('dialog', (dialog) => dialog.accept()); await page.getByRole('button', { name: 'Effacer', exact: true }).click();
  await expect(editor).toHaveValue(''); await expect(page.locator('[data-output]')).toBeHidden();
});
test('tous les exemples et formats sont accessibles sans compte', async ({ page }) => {
  for (const name of ['Rédiger', 'Résumer', 'Classer', 'Préparer une réunion']) for (const format of ['texte', 'tableau', 'json']) {
    await page.goto(ROUTE); await seed(page, name); await page.getByLabel('Format de la future réponse').selectOption(format); await page.getByRole('button', { name: 'Assembler le prompt' }).click();
    await expect(page.locator('[data-output]')).toBeVisible(); await expect(page.getByRole('button', { name: 'Exporter en JSON (.json)' })).toBeEnabled();
  }
});
test('fallback presse-papiers, reload efface et aucun texte dans URL', async ({ page }) => {
  await page.goto(ROUTE); await generate(page);
  await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('refus')) }, configurable: true }); });
  await page.getByRole('button', { name: 'Copier le prompt', exact: true }).click(); await expect(page.locator('[data-status]')).toContainText('Presse-papiers indisponible');
  expect(new URL(page.url()).search).toBe(''); await page.reload(); await expect(page.getByLabel('Prompt éditable')).toHaveValue('');
});
test('SEO, trois entrants, footer, médias et sitemap', async ({ page }) => {
  for (const route of ['/outils-comptables-gratuits', '/methode', '/outils-comptables-gratuits/generateur-prompt-expert-comptable', '/outils-comptables-gratuits/verificateur-prompt-ia']) {
    await page.goto(route); await expect(page.locator(`main a[href="${ROUTE}"]`).first()).toBeVisible();
  }
  const response = await page.goto(ROUTE); expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Générateur de prompt IA gratuit');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://memlia.fr${ROUTE}`);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Générateur de prompt IA gratuit');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', '/proofs/v2/og/01-outil-prompt-ia.webp');
  await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute('content', /connect-src 'none'/);
  await expect(page.locator(`footer a[href="${ROUTE}"]`)).toHaveCount(1);
  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  const nodes = schemas.flatMap((text) => JSON.parse(text)['@graph'] ?? []); expect(nodes.map((node) => node['@type'])).toEqual(expect.arrayContaining(['WebPage', 'WebApplication', 'BreadcrumbList']));
  expect(nodes.map((node) => node['@type'])).not.toContain('BlogPosting');
  expect(await (await page.request.get('/sitemap-0.xml')).text()).toContain(`https://memlia.fr${ROUTE}`);
  for (const path of ['/proofs/v2/01-outil-prompt-ia.webp', '/proofs/v2/og/01-outil-prompt-ia.webp']) expect((await page.request.get(path)).status()).toBe(200);
});
for (const width of [320, 375, 768, 1024, 1440, 1920]) test(`reflow, clavier et cibles à ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 }); await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(ROUTE); await generate(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  await page.getByLabel('Prompt éditable').focus(); await page.keyboard.press('Tab'); await expect(page.getByRole('button', { name: 'Copier le prompt', exact: true })).toBeFocused();
  const targets = await page.locator('[data-generic-prompt] button').evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().height)); for (const height of targets) expect(height).toBeGreaterThanOrEqual(44);
  if ([375,1440].includes(width)) {
    await page.evaluate(() => { window.scrollTo(0, 0); document.querySelector<HTMLTextAreaElement>('[data-editor]')!.scrollTop = 0; });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `.qa/prompt-ia-${width}.png`, fullPage: true });
  }
});
