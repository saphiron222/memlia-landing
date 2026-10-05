import { test, expect } from '@playwright/test';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const route = '/outils-comptables-gratuits/diagnostic-maturite-ia-cabinet';
const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();

for (const gaps of [1, 2]) for (const state of ['closed', 'mixed', 'open']) {
  test(`PDF A4 sans collision : ${gaps} dimensions à traiter, détails ${state}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route, { waitUntil: 'networkidle' });
    for (let step = 0; step < 5; step++) {
      for (const select of await page.locator('fieldset:visible select').all()) {
        const id = await select.getAttribute('id');
        await select.selectOption(id === 'donnees_1' || (gaps === 2 && id === 'validation_1') ? 'non-commence' : 'formalise');
      }
      if (step < 4) await page.getByRole('button', { name: 'Suivant', exact: true }).click();
    }
    await page.getByRole('button', { name: 'Voir ma synthèse' }).click();
    const details = page.locator('[data-result] details');
    await details.evaluateAll((nodes, state) => nodes.forEach((node, index) => {
      (node as HTMLDetailsElement).open = state === 'open' || (state === 'mixed' && index % 2 === 0);
    }), state);
    const before = await details.evaluateAll(nodes => nodes.map(node => (node as HTMLDetailsElement).open));
    const report = await page.locator('#diagnostic-report').inputValue();
    const expected = await page.locator('[data-result] .print-evidence li, [data-priorities] > li > p').allTextContents();
    await expect(page.locator('[data-summary] .print-evidence li')).toHaveCount(15);
    await expect(page.locator('[data-priorities] > li > p')).toHaveCount(3);
    await page.getByRole('button', { name: 'Imprimer', exact: true }).click();
    for (const position of ['button', 'top']) {
      if (position === 'top') await page.evaluate(() => scrollTo(0, 0));
      const path = testInfo.outputPath(`${position}.pdf`);
      const bytes = await page.pdf({ path, format: 'A4', printBackground: true });
      await testInfo.attach(`${position}.pdf`, { path, contentType: 'application/pdf' });
      const loading = getDocument({ data: new Uint8Array(bytes), useSystemFonts: true });
      const pdf = await loading.promise;
      const pages: string[] = [];
      const collisions: string[] = [];
      for (let number = 1; number <= pdf.numPages; number++) {
        const content = await (await pdf.getPage(number)).getTextContent();
        const items = content.items.filter((item): item is import('pdfjs-dist/types/src/display/api').TextItem => 'str' in item && !!item.str.trim());
        pages.push(items.map(item => item.str).join(' '));
        // Les rectangles proviennent du PDF fragmenté, pas du DOM avant pagination.
        for (let a = 0; a < items.length; a++) for (let b = a + 1; b < items.length; b++) {
          const first = items[a], second = items[b];
          const x = Math.min(first.transform[4] + first.width, second.transform[4] + second.width) - Math.max(first.transform[4], second.transform[4]);
          const y = Math.min(first.transform[5] + first.height, second.transform[5] + second.height) - Math.max(first.transform[5], second.transform[5]);
          if (x > 1 && y > 1) collisions.push(`page ${number}: ${first.str} / ${second.str} (${x}, ${y})`);
        }
      }
      const text = normalize(pages.join(' '));
      for (const line of expected) expect(text).toContain(normalize(line));
      expect(collisions, `${position}: collisions du PDF`).toEqual([]);
      await loading.destroy();
    }
    expect(await details.evaluateAll(nodes => nodes.map(node => (node as HTMLDetailsElement).open))).toEqual(before);
    expect(await page.locator('#diagnostic-report').inputValue()).toBe(report);
    for (const copy of await page.locator('[data-result] .print-evidence').all()) await expect(copy).toBeHidden();
  });
}
