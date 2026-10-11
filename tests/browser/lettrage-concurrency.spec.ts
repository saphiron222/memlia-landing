import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const route = '/outils-comptables-gratuits/assistant-lettrage-comptable-local';
const replacement = 'id;compte;tiers;reference;date;debit;credit;devise;lettre\nNEW-D;411;NEW;NEW;2026-01-01;7;0;EUR;\nNEW-C;411;NEW;NEW;2026-01-01;0;7;EUR;\n';

for (const action of ['export', 'copy']) test(`transaction ${action} : décision concurrente verrouillée`, async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(route);
  await page.locator('[data-example]').click();
  await expect(page.locator('[data-summary]')).toContainText('6 lignes source');
  await page.getByRole('button', { name: 'Accepter la paire P1', exact: true }).click();
  const downloadPromise = action === 'export' ? page.waitForEvent('download') : null;
  const locked = await page.evaluate(action => {
    (document.querySelector(`[data-${action}]`) as HTMLButtonElement).click();
    const refuse = document.querySelector('[aria-label="Refuser la paire P1"]') as HTMLButtonElement;
    const locked = refuse.disabled;
    refuse.click();
    // Même un événement synthétique ne doit pas contourner la transaction.
    refuse.dispatchEvent(new Event('click'));
    return locked;
  }, action);
  expect(locked).toBe(true);
  let csv: string;
  if (downloadPromise) csv = await readFile((await (await downloadPromise).path())!, 'utf8');
  else {
    await expect(page.locator('[data-status]')).toContainText('complet copié');
    csv = await page.evaluate(() => navigator.clipboard.readText());
  }
  expect(csv).toContain('"accepté"');
  expect(csv).not.toContain('"refusé"');
  await expect(page.locator('[data-pairs]')).toContainText('P1 : accepté');
  await expect(page.getByRole('button', { name: 'Refuser la paire P1', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Refuser la paire P1', exact: true }).click();
  await expect(page.locator('[data-pairs]')).toContainText('P1 : refusé');
});

for (const outcome of ['resolve', 'reject']) for (const change of ['reset', 'reset-import', 'import']) {
  test(`clipboard ${outcome} tardif après ${change} : aucun ancien contenu/statut/focus`, async ({ page }) => {
    await page.goto(route);
    await page.evaluate(() => {
      const state = window as any;
      state.copyStarted = false;
      Object.defineProperty(navigator.clipboard, 'writeText', { configurable: true, value: () => new Promise<void>((resolve, reject) => {
        state.copyStarted = true;
        state.finishCopy = (outcome: string) => outcome === 'resolve' ? resolve() : reject(new Error('permission refusée'));
      }) });
    });
    await page.locator('[data-example]').click();
    await expect(page.locator('[data-summary]')).toContainText('6 lignes source');
    await page.locator('[data-copy]').click();
    await expect.poll(() => page.evaluate(() => (window as any).copyStarted)).toBe(true);
    await expect.soft(page.locator('[data-copy]')).toBeDisabled();
    await expect.soft(page.getByRole('button', { name: 'Accepter la paire P1', exact: true })).toBeDisabled();
    // Une nouvelle mise en page pendant l'attente ne doit pas déverrouiller les décisions.
    await page.locator('#lettrage-filter').selectOption('proposé');
    await expect.soft(page.getByRole('button', { name: 'Accepter la paire P1', exact: true })).toBeDisabled();
    if (change.startsWith('reset')) await page.locator('[data-reset]').click();
    if (change.includes('import')) {
      await page.locator('#lettrage-file').setInputFiles({ name: 'nouveau.csv', mimeType: 'text/csv', buffer: Buffer.from(replacement) });
      await page.getByRole('button', { name: 'Importer et rechercher les paires' }).click();
      await expect(page.locator('[data-summary]')).toContainText('2 lignes source');
      await expect(page.locator('[data-lines]')).toContainText('NEW-D');
    }
    const before = await page.locator('[data-status]').textContent();
    await page.locator('[data-reset]').focus();
    await page.evaluate(async outcome => { (window as any).finishCopy(outcome); await new Promise(resolve => setTimeout(resolve, 0)); }, outcome);
    await expect(page.locator('[data-status]')).toHaveText(before!);
    await expect(page.locator('[data-reset]')).toBeFocused();
    await expect(page.locator('[data-fallback]')).toBeHidden();
    await expect(page.locator('[data-fallback]')).toHaveValue('');
    if (change === 'reset') await expect(page.locator('[data-result]')).toBeHidden();
    else {
      await expect(page.locator('[data-lines]')).not.toContainText('F-001');
      await expect(page.locator('[data-copy]')).toBeEnabled();
    }
  });
}
