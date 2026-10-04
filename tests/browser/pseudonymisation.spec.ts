import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const route = '/outils-comptables-gratuits/preparer-pseudonymiser-fichier-csv-fec';
const fictif = '\uFEFFNom;Libelle;Date;Montant\r\nAlice;"alice@example.test\npièce";20261004;9876\r\nAlice;"=HYPERLINK(""x"")";20261005;-10\r\nBob;Facture;20261006;20';
async function importFile(page: Page, text = fictif) {
  await page.locator('#pseudo-file').setInputFiles({ name:'jeu-fictif.csv', mimeType:'text/csv', buffer:Buffer.from(text) });
  await page.getByRole('button', { name:'Importer une copie', exact:true }).click();
  await expect(page.locator('[data-selection]')).toBeVisible();
}
async function prepare(page: Page) {
  await page.locator('#pseudo-col-2').selectOption('keep'); await page.locator('#pseudo-col-3').selectOption('keep');
  await page.locator('[data-preview]').click(); await expect(page.locator('[data-result]')).toBeVisible();
}
async function download(page: Page, format: string) {
  const event = page.waitForEvent('download'); await page.locator(`[data-export="${format}"]`).click();
  const d = await event; const content = await readFile((await d.path())!, 'utf8'); return { name:d.suggestedFilename(), content };
}
test('import local, aperçu cohérent, copie/rapport/mapping séparés et reset', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(route); await importFile(page); await prepare(page);
  await expect(page.locator('[data-before]')).toContainText('Alice');
  await expect(page.locator('[data-after]')).not.toContainText('Alice');
  await expect(page.locator('[data-after]')).toContainText('C1_000001');
  await expect(page.locator('[data-after]')).toContainText('9876');
  await expect(page.locator('[data-risks]')).toContainText('réidentification');
  await expect(page.locator('[data-export="csv"]')).toBeDisabled();
  await page.locator('[data-reviewed]').check();
  const csv = await download(page, 'csv'); expect(csv.name).toBe('copie-pseudonymisee.csv'); expect(csv.content).not.toContain('Alice'); expect(csv.content).not.toContain('Libelle'); expect(csv.content).toContain("'-10");
  const report = JSON.parse((await download(page,'report')).content); expect(report.lignes).toBe(3); expect(report.neutralisations).toBe(1);
  await expect(page.locator('[data-export="mapping"]')).toBeDisabled(); await page.locator('[data-mapping]').check();
  const mapping = await download(page,'mapping'); expect(mapping.name).toBe('mapping-separe-confidentiel.csv'); expect(mapping.content).toContain('Alice');
  await page.locator('#pseudo-col-1').selectOption('keep'); await expect(page.locator('[data-result]')).toBeHidden();
  await page.locator('[data-preview]').click(); await expect(page.locator('[data-risks]')).toContainText('email'); await expect(page.locator('[data-risks]')).toContainText('libre');
  await page.locator('[data-reviewed]').check(); const formula = await download(page,'csv'); expect(formula.content).toContain("'=HYPERLINK");
  await page.locator('[data-reset]').click(); await expect(page.locator('[data-selection]')).toBeHidden(); await expect(page.locator('[data-before]')).toBeEmpty(); await expect(page.locator('[data-after]')).toBeEmpty(); expect(await page.locator('#pseudo-file').inputValue()).toBe(''); expect(errors).toEqual([]);
});
test('erreur préserve import, cancel et exemple sans écrasement', async ({ page }) => {
  await page.goto(route); await importFile(page);
  await page.getByRole('button', { name:'Essayer le fichier fictif' }).click(); await expect(page.locator('[data-error]')).toContainText('Réinitialisez');
  await page.locator('#pseudo-file').setInputFiles({ name:'bad.csv', mimeType:'text/csv', buffer:Buffer.from('A;B\n1') });
  await page.getByRole('button', { name:'Importer une copie', exact:true }).click(); await expect(page.locator('[data-error]')).toContainText('colonnes'); await expect(page.locator('[data-before]')).toContainText('Alice');
  await page.evaluate(() => { const input = document.querySelector<HTMLInputElement>('#pseudo-file')!; const transfer = new DataTransfer(); transfer.items.add(new File([new Uint8Array(20 * 1024 * 1024 + 1)],'gros.csv')); input.files = transfer.files; });
  await page.getByRole('button', { name:'Importer une copie', exact:true }).click(); await expect(page.locator('[data-error]')).toContainText('20 Mo');
  await page.locator('#pseudo-file').setInputFiles({ name:'binary.csv', mimeType:'text/csv', buffer:Buffer.from([0,1,2]) }); await page.getByRole('button', { name:'Importer une copie', exact:true }).click(); await expect(page.locator('[data-error]')).toContainText('binaire');
  await page.evaluate(() => { const input = document.querySelector<HTMLInputElement>('#pseudo-file')!; const t = new DataTransfer(); t.items.add(new File(['A;B\n1;2'],'pending.csv')); input.files=t.files; document.querySelector<HTMLButtonElement>('form button[type=submit]')!.click(); document.querySelector<HTMLButtonElement>('[data-cancel]')!.click(); });
  await expect(page.locator('[data-status]')).toContainText('annulé'); await expect(page.locator('[data-before]')).toContainText('Alice');
});
test('UTF-8 refusé puis Windows-1252 explicite, TSV/FEC', async ({ page }) => {
  await page.goto(route); await page.locator('#pseudo-separator').selectOption('tab');
  await page.locator('#pseudo-file').setInputFiles({ name:'fec.txt', mimeType:'text/plain', buffer:Buffer.from('Nom\tMontant\nAndr\xe9\t12','latin1') });
  await page.getByRole('button', { name:'Importer une copie', exact:true }).click(); await expect(page.locator('[data-error]')).toContainText('Encodage');
  await page.locator('#pseudo-encoding').selectOption('windows-1252'); await page.getByRole('button', { name:'Importer une copie', exact:true }).click(); await expect(page.locator('[data-before]')).toContainText('André');
});
test('aucun réseau de contenu ni stockage pendant import/preview/export', async ({ page }) => {
  await page.goto(route); await page.waitForLoadState('networkidle');
  const requests: string[] = []; page.on('request', request => { if (!request.url().includes('/_astro/')) requests.push(request.url()); expect(request.method()).toBe('GET'); expect(request.postData()).toBeNull(); });
  await page.evaluate(() => { (window as any).storageWrites=[]; for(const proto of [Storage.prototype, IDBFactory.prototype]) for(const name of ['setItem','open']) { if(name in proto) { (proto as any)[name] = (...args: any[]) => { (window as any).storageWrites.push(args); throw new Error('stockage interdit'); }; } } });
  await importFile(page); await prepare(page); await page.locator('[data-reviewed]').check(); await download(page,'csv');
  expect(requests).toEqual([]); expect(await page.evaluate(() => (window as any).storageWrites)).toEqual([]);
  expect(await page.evaluate(() => ({ local:localStorage.length, session:sessionStorage.length, cookies:document.cookie }))).toEqual({ local:0, session:0, cookies:'' });
});
for (const width of [320,375,768,1024,1440,1920]) test(`rendu, SEO et export au clavier ${width}px`, async ({ page }) => {
  await page.setViewportSize({width,height:900}); await page.emulateMedia({ reducedMotion:'reduce' }); await page.goto(route);
  expect(await page.locator('h1').count()).toBe(1); const h1=await page.locator('h1').innerText(); await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content',h1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://memlia.fr'+route);
  await page.locator('[data-example]').click(); await prepare(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('[data-reviewed]').focus(); await page.keyboard.press('Space'); await expect(page.locator('[data-export="csv"]')).toBeEnabled();
  if (width <= 375) {
    const scroll = page.locator('[data-before]').locator('..'); await scroll.focus(); await page.keyboard.press('End');
    await scroll.evaluate(el => { el.scrollLeft = el.scrollWidth; });
    expect(await scroll.evaluate(el => el.scrollLeft > 0)).toBe(true);
  }
  await page.evaluate(() => scrollTo(0,0));
  await page.screenshot({ path:`.qa/pseudonymisation-${width}.png`, fullPage:true });
});
