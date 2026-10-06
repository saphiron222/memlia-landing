import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const ROUTE = '/outils-comptables-gratuits/generateur-prompt-expert-comptable';
async function generate(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'Demande de pièces', exact: true }).click();
  await page.getByLabel(/Je confirme que cette description/).check();
  await page.getByRole('button', { name: 'Assembler le prompt' }).click();

  await expect(page.locator('[data-output]')).toBeVisible();
}
test('amorces, édition contrôlée, export exact et copie ; aucune donnée dans les événements', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.addInitScript(() => {
    (window as any).events = [];
    window.addEventListener('memlia:outil', (event) => (window as any).events.push((event as CustomEvent).detail));
    (window as any).revoked = [];
    const revoke = URL.revokeObjectURL.bind(URL);
    URL.revokeObjectURL = (url) => { (window as any).revoked.push(url); revoke(url); };
  });
  const requests: string[] = []; let armed = false;
  page.on('request', (request) => { if (armed) requests.push(request.url()); });
  await page.goto(ROUTE); await page.waitForLoadState('networkidle'); armed = true;
  await generate(page);
  const editor = page.getByLabel('Prompt éditable');
  const initial = await editor.inputValue();
  expect(initial).toContain('## Frontière');
  await expect(page.locator('#prompt-result-title')).toBeFocused();
  const edited = initial.replace('Préparer une demande', 'Proposer une demande');
  await editor.fill(edited);
  await page.getByRole('button', { name: 'Copier le prompt', exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(edited);
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exporter en texte (.txt)' }).click();
  const file = await downloading;
  expect(file.suggestedFilename()).toBe('prompt-expert-comptable.txt');
  expect(await readFile((await file.path())!, 'utf8')).toBe(edited);
  await expect.poll(() => page.evaluate(() => (window as any).revoked.length)).toBe(1);
  await editor.fill(edited.replace('## Arrêt', '## Retiré'));
  await expect(page.getByRole('button', { name: 'Copier le prompt', exact: true })).toBeDisabled();
  await expect(page.locator('[data-check-status]')).toContainText('copie et export bloqués');
  await editor.fill(edited + '\nclient@exemple.test');
  await expect(page.getByRole('button', { name: 'Exporter en texte (.txt)' })).toBeDisabled();
  expect(requests).toEqual([]);
  expect(await page.evaluate(async () => ({ local: localStorage.length, session: sessionStorage.length, db: (await indexedDB.databases()).length }))).toEqual({ local: 0, session: 0, db: 0 });
  const events = await page.evaluate(() => (window as any).events);
  expect(events).toContainEqual({ action: 'reussite', outil: 'generateur-prompt-expert-comptable' });
  expect(events).toContainEqual({ action: 'copie', outil: 'generateur-prompt-expert-comptable' });
  expect(events).toContainEqual({ action: 'export', outil: 'generateur-prompt-expert-comptable' });
  for (const event of events) expect(Object.keys(event).sort()).toEqual(['action', 'outil']);
});
test('refus accessibles et aucune édition écrasée sans confirmation', async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).events = [];
    window.addEventListener('memlia:outil', (event) => (window as any).events.push((event as CustomEvent).detail));
  });
  await page.goto(ROUTE);
  await page.getByRole('button', { name: 'Assembler le prompt' }).click();
  await expect(page.getByLabel(/Je confirme que cette description/)).toBeFocused();
  await generate(page);
  const editor = page.getByLabel('Prompt éditable');
  const initial = await editor.inputValue();
  const edited = initial + '\nCommentaire de relecture abstrait.';
  await editor.fill(edited);
  const reject = (dialog: import('@playwright/test').Dialog) => dialog.dismiss();
  page.on('dialog', reject);
  await page.getByRole('button', { name: 'Assembler le prompt' }).click();
  await expect(editor).toHaveValue(edited);
  await page.getByRole('button', { name: 'Synthèse de notes', exact: true }).click();
  await expect(page.getByLabel('Tâche à préparer')).toHaveValue('pieces');
  await expect(editor).toHaveValue(edited);
  await page.getByRole('button', { name: 'Effacer', exact: true }).click();
  await expect(editor).toHaveValue(edited);
  const canceledEvents = await page.evaluate(() => (window as any).events);
  expect(canceledEvents.filter((event: any) => event.action === 'reussite')).toHaveLength(1);
  expect(canceledEvents.filter((event: any) => event.action === 'exemple')).toHaveLength(1);
  expect(canceledEvents.filter((event: any) => event.action === 'effacer')).toHaveLength(0);
  expect(canceledEvents).toContainEqual({ action: 'annulation', outil: 'generateur-prompt-expert-comptable' });
  page.off('dialog', reject); page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Synthèse de notes', exact: true }).click();
  await expect(page.getByLabel('Tâche à préparer')).toHaveValue('synthese');
  await expect(editor).toHaveValue(edited);
  await page.getByLabel('Description abstraite de la tâche').fill('Relancer client@exemple.test pour le dossier');
  await page.getByLabel(/Je confirme que cette description/).check();
  await page.getByRole('button', { name: 'Assembler le prompt' }).click();
  await expect(page.getByLabel('Description abstraite de la tâche')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Description abstraite de la tâche')).toBeFocused();
  await expect(editor).toHaveValue(edited);
});
test('toutes les amorces, choix configurables et effacement explicite', async ({ page }) => {
  for (const seed of ['Demande de pièces', 'Synthèse de notes', 'Checklist de contrôle', 'Tri d’écarts']) {
    await page.goto(ROUTE);
    await page.getByRole('button', { name: seed, exact: true }).click();
    await page.getByLabel('Format attendu').selectOption('tableau');
    await page.getByLabel('Qui valide le résultat ?').selectOption('expert');
    await page.getByLabel('Condition d’arrêt choisie').selectOption('hors-regle');
    await page.getByLabel(/Je confirme que cette description/).check();
    await page.getByRole('button', { name: 'Assembler le prompt' }).click();
    const text = await page.getByLabel('Prompt éditable').inputValue();
    expect(text).toContain('Tableau :'); expect(text).toContain('Expert-comptable'); expect(text).toContain('Un point sort de la procédure');
    await expect(page.getByRole('button', { name: 'Copier le prompt', exact: true })).toBeEnabled();
    await expect(page.locator('[data-boundary] dt')).toHaveCount(3);
    await expect(page.locator('[data-cases] li')).toHaveCount(3);
  }
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Effacer', exact: true }).click();
  await expect(page.locator('[data-output]')).toBeHidden();
  await expect(page.getByLabel('Description abstraite de la tâche')).toHaveValue('');
});
test('maillage, médias propres, canonical et sitemap', async ({ page }) => {
  for (const route of ['/outils-comptables-gratuits', '/methode', '/automatisation-cabinet-comptable']) {
    await page.goto(route); await expect(page.locator(`main a[href="${ROUTE}"]`)).toBeVisible();
  }
  const response = await page.goto(ROUTE); expect(response?.status()).toBe(200);
  await expect(page.locator(`footer a[href="${ROUTE}"]`)).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://memlia.fr${ROUTE}`);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', '/proofs/v2/og/29-outil-prompt.webp');
  await expect(page.locator('[data-proof="v2/29-outil-prompt"] img')).toBeVisible();
  await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute('content', /connect-src 'none'/);
  const sitemap = await page.request.get('/sitemap-outils.xml'); expect(await sitemap.text()).toContain(`https://memlia.fr${ROUTE}`);
});
for (const width of [320, 375, 768, 1024, 1440, 1920]) test(`clavier et aucun débordement à ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(ROUTE); await generate(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  await page.getByLabel('Prompt éditable').focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Copier le prompt', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Exporter en texte (.txt)' })).toBeFocused();
  if ([375, 1440].includes(width)) {
    await page.evaluate(() => { window.scrollTo(0, 0); document.querySelector<HTMLTextAreaElement>('[data-editor]')!.scrollTop = 0; });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `.qa/prompt-${width}.png`, fullPage: true });
  }
});
