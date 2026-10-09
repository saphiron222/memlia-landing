import { test, expect } from '@playwright/test';
const ROUTE = '/outils-comptables-gratuits/generateur-prompt-expert-comptable';
async function generate(page: import('@playwright/test').Page) {
  await page.goto(ROUTE);
  await page.getByRole('button', { name: 'Demande de pièces', exact: true }).click();
  await page.getByLabel(/Je confirme que cette description/).check();
  await page.getByRole('button', { name: 'Assembler le prompt' }).click();
}
test('choix modifiés : sortie conservée mais copie bloquée jusqu’à nouvel assemblage', async ({ page }) => {
  await generate(page);
  const editor = page.getByLabel('Prompt éditable');
  const before = await editor.inputValue();
  await page.getByLabel('Format attendu').selectOption('tableau');
  await expect(editor).toHaveValue(before);
  await expect(page.getByRole('button', { name: 'Copier le prompt', exact: true })).toBeDisabled();
  await editor.fill(before + '\nCommentaire abstrait conservé.');
  await expect(page.getByRole('button', { name: 'Exporter en texte (.txt)' })).toBeDisabled();
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Assembler le prompt' }).click();
  await expect(page.getByRole('button', { name: 'Copier le prompt', exact: true })).toBeEnabled();
});
test('copie refusée : sélection du texte édité sans perte', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new Error('denied'); } } }));
  await generate(page);
  await page.getByRole('button', { name: 'Copier le prompt', exact: true }).click();
  const selection = await page.locator('[data-editor]').evaluate((element: HTMLTextAreaElement) => ({ start: element.selectionStart, end: element.selectionEnd, size: element.value.length }));
  expect(selection.start).toBe(0); expect(selection.end).toBe(selection.size);
  await expect(page.locator('[data-editor]')).toBeFocused();
});
