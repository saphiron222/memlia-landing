import { test, expect } from '@playwright/test';
import { readFileSync, mkdirSync } from 'node:fs';
const route = '/outils-comptables-gratuits/diagnostic-maturite-ia-cabinet';
test('impression exhaustive avec détails fermés, sans changer leur état écran', async ({ page }, testInfo) => {
  await page.goto(route);
  await page.getByRole('button', { name: 'Essayer un exemple fictif' }).click();
  const details = page.locator('[data-result] details');
  await details.first().evaluate((node: HTMLDetailsElement) => { node.open = true; });
  const before = await details.evaluateAll(nodes => nodes.map(node => (node as HTMLDetailsElement).open));
  const responses = page.locator('[data-summary] .print-evidence li');
  const evidence = page.locator('[data-priorities] .print-evidence li');
  await page.emulateMedia({ media: 'print' });
  await expect(responses).toHaveCount(15);
  for (const li of await responses.all()) await expect(li).toBeVisible();
  expect(await evidence.count()).toBeGreaterThan(0);
  for (const li of await evidence.all()) await expect(li).toBeVisible();
  const pdf = testInfo.outputPath('diagnostic-complet.pdf');
  await page.pdf({ path: pdf, format: 'A4', printBackground: true });
  await testInfo.attach('rapport imprimé', { path: pdf, contentType: 'application/pdf' });
  await page.emulateMedia({ media: 'screen' });
  expect(await details.evaluateAll(nodes => nodes.map(node => (node as HTMLDetailsElement).open))).toEqual(before);
  for (const li of await responses.all()) await expect(li).toBeHidden();
});
test.beforeEach(async ({ page }) => { await page.goto(route, { waitUntil: 'networkidle' }); });
test('inconnues : cinq incomplets, rapport et export exhaustif sans mail', async ({ page }) => {
  await page.getByRole('button', { name: 'Voir ma synthèse' }).click();
  await expect(page.locator('[data-summary] h3')).toHaveCount(5);
  await expect(page.locator('[data-summary]')).toContainText('Usages : Incomplet');
  await expect(page.locator('[data-unknowns] li')).toHaveCount(15);
  await expect(page.locator('[data-priorities] > li')).toHaveCount(3);
  await expect(page.locator('[data-diagnostic] input[type=email]')).toHaveCount(0);
  const displayed = await page.locator('#diagnostic-report').inputValue();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exporter en Markdown' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('diagnostic-maturite-ia-cabinet.md');
  expect(readFileSync((await download.path())!, 'utf8')).toBe(displayed);
  expect(displayed).not.toMatch(/faible maturité|percentile/);
});
test('précédent/suivant conserve les réponses, synthèse et reprise actualisées', async ({ page }) => {
  await page.locator('#usages_1').selectOption('formalise');
  await page.getByRole('button', { name: 'Suivant', exact: true }).click();
  await page.locator('#regles_2').selectOption('en-essai');
  await page.getByRole('button', { name: 'Précédent', exact: true }).click();
  await expect(page.locator('#usages_1')).toHaveValue('formalise');
  await page.getByRole('button', { name: 'Voir ma synthèse' }).click();
  const before = await page.locator('[data-summary] section').allTextContents();
  await page.getByRole('button', { name: 'Revenir aux réponses' }).click();
  await page.locator('#usages_2').selectOption('en-essai');
  const after = await page.locator('[data-summary] section').allTextContents();
  expect(after.slice(1)).toEqual(before.slice(1));
  expect(after[0]).not.toBe(before[0]);
  await expect(page.locator('#diagnostic-report')).toHaveValue(/En essai/);
});
test('exemple justifie données avant expansion, remplacement annulé et reset explicite', async ({ page }) => {
  await page.getByRole('button', { name: 'Essayer un exemple fictif' }).click();
  await expect(page.locator('[data-priorities] > li').first()).toContainText('Définir les données autorisées');
  const original = await page.locator('#diagnostic-report').inputValue();
  page.once('dialog', d => d.dismiss());
  await page.getByRole('button', { name: 'Essayer un exemple fictif' }).click();
  expect(await page.locator('#diagnostic-report').inputValue()).toBe(original);
  page.once('dialog', d => d.dismiss()); await page.getByRole('button', { name: 'Réinitialiser' }).click();
  expect(await page.locator('#diagnostic-report').inputValue()).toBe(original);
  page.once('dialog', d => d.accept()); await page.getByRole('button', { name: 'Réinitialiser' }).click();
  await expect(page.locator('[data-result]')).toBeHidden();
  await expect(page.locator('#usages_1')).toHaveValue('inconnu');
});
test('quinze formalisées : suivi des exceptions sans certification', async ({ page }) => {
  for (let step = 0; step < 5; step++) {
    for (const select of await page.locator('fieldset:visible select').all()) await select.selectOption('formalise');
    if (step < 4) await page.getByRole('button', { name: 'Suivant', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Voir ma synthèse' }).click();
  await expect(page.locator('[data-summary] h3')).toHaveText(['Usages : Formalisé','Règles : Formalisé','Données : Formalisé','Validation : Formalisé','Mesure : Formalisé']);
  await expect(page.locator('[data-priorities]')).toContainText('Suivre les exceptions');
});
test('copie réussie et refus offrent le même rapport sélectionnable', async ({ page }) => {
  await page.getByRole('button', { name: 'Voir ma synthèse' }).click();
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text: string) => { (window as any).__copied = text; } } }));
  await page.getByRole('button', { name: 'Copier le rapport' }).click();
  expect(await page.evaluate(() => (window as any).__copied)).toBe(await page.locator('#diagnostic-report').inputValue());
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('denied'); } } }));
  await page.getByRole('button', { name: 'Copier le rapport' }).click();
  await expect(page.locator('[data-message]')).toContainText('Copie indisponible');
  await expect(page.locator('#diagnostic-report')).toBeFocused();
});
test('interaction sans réseau ni stockage et événements sans réponses', async ({ page, context }) => {
  const requests: string[] = []; page.on('request', r => requests.push(r.url()));
  await page.evaluate(() => { (window as any).__events = []; window.addEventListener('memlia:outil', (e: Event) => (window as any).__events.push((e as CustomEvent).detail)); });
  await page.locator('#usages_1').selectOption('formalise');
  await page.getByRole('button', { name: 'Voir ma synthèse' }).click();
  await page.getByRole('button', { name: 'Exporter en Markdown' }).click();
  expect(requests).toEqual([]);
  expect(await page.evaluate(async () => ({ local: localStorage.length, session: sessionStorage.length, databases: (await indexedDB.databases()).length }))).toEqual({ local: 0, session: 0, databases: 0 });
  expect(await context.cookies()).toEqual([]);
  const events = await page.evaluate(() => (window as any).__events);
  expect(events.some((e: any) => e.action === 'reussite')).toBe(true);
  for (const e of events) expect(Object.keys(e).sort()).toEqual(['action','outil']);
});
test('sans JavaScript : questions, méthode et limites accessibles', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage();
  await page.goto(baseURL! + route);
  await expect(page.locator('fieldset')).toHaveCount(5); await expect(page.locator('select')).toHaveCount(15);
  await expect(page.locator('#diagnostic-method')).toBeVisible();
  await context.close();
});
for (const width of [320,375,768,1024,1440,1920]) test(`reflow et parcours à ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.getByRole('button', { name: 'Essayer un exemple fictif' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('[data-result]')).toBeVisible();
  if ([375,1440].includes(width)) {
    mkdirSync('docs/qa/maturite-ia/screens', { recursive: true });
    // Déclencher les révélations et les médias paresseux par le vrai parcours de scroll.
    for (let y = 0; y < await page.evaluate(() => document.body.scrollHeight); y += 600) {
      await page.evaluate(y => window.scrollTo(0, y), y); await page.waitForTimeout(70);
    }
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(1200);
    await page.screenshot({ path: `docs/qa/maturite-ia/screens/${width}.png`, fullPage: true, animations: 'disabled' });
  }
});
test('SEO canonical schema sitemap hub footer et entrants contextuels', async ({ page, request }) => {
  await expect(page.locator('h1')).toHaveText('Diagnostic de maturité IA du cabinet');
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://memlia.fr' + route);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content','Diagnostic de maturité IA du cabinet');
  const graphs = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(graphs.join('')).toContain('WebApplication'); expect(graphs.join('')).not.toContain('AggregateRating');
  expect(await (await request.get('/sitemap-0.xml')).text()).toContain('https://memlia.fr' + route);
  for (const from of ['/outils-comptables-gratuits','/methode','/automatisation-cabinet-comptable']) {
    await page.goto(from); await expect(page.locator(`main a[href="${route}"]`).first()).toBeVisible();
    await expect(page.locator(`footer a[href="${route}"]`)).toHaveCount(1);
  }
});
