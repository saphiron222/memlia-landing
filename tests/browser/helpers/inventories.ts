import { expect, type Page } from '@playwright/test';
import type { IntegrationDefinition } from '../../../src/data/integrations';

export const widths = [320, 375, 768, 1024, 1440, 1920];

export async function assertGlossaryInventory(page: Page, entries: readonly { anchor: string; term: string }[]) {
  expect(entries.length).toBeGreaterThanOrEqual(53);
  const letters = [...new Set(entries.map(({ term }) => term.normalize('NFD').replace(/\p{Diacritic}/gu, '').charAt(0).toUpperCase()))].sort();
  expect(letters.length).toBeGreaterThanOrEqual(16);
  expect(new Set(entries.map(({ anchor }) => anchor)).size).toBe(entries.length);
  const actual = await page.evaluate(() => ({
    entries: [...document.querySelectorAll('.glossaire-entree')].map((node) => ({ anchor: node.id, term: node.querySelector('dt a')?.textContent })),
    letters: [...document.querySelectorAll<HTMLElement>('[data-lettre]')].map((node) => node.dataset.lettre).sort(),
    alphabet: [...document.querySelectorAll<HTMLAnchorElement>('.alphabet a')].map((node) => ({ text: node.textContent, href: node.getAttribute('href') })).sort((a, b) => a.text!.localeCompare(b.text!)),
  }));
  expect(actual.entries.sort((a, b) => a.anchor.localeCompare(b.anchor))).toEqual(entries.map(({ anchor, term }) => ({ anchor, term })).sort((a, b) => a.anchor.localeCompare(b.anchor)));
  expect(actual.letters).toEqual(letters);
  expect(actual.alphabet).toEqual(letters.map((letter) => ({ text: letter, href: `#lettre-${letter.toLowerCase()}` })));
}

export async function checkIntegrationPage(page: Page, guide: Pick<IntegrationDefinition, 'slug' | 'h1'>, width: number) {
  const response = await page.goto(`/integrations/${guide.slug}`);
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText(guide.h1);
  await expect(page.locator('[data-proof]')).toHaveAttribute('data-proof', `integrations/${guide.slug}`);
  await expect(page.locator('.source-lien')).toHaveAttribute('href', /^https:\/\//);
  await expect(page.locator('h2', { hasText: 'La règle écrite' })).toBeVisible();
  await expect(page.locator('#jeu-fictif')).toHaveText('Cas illustratifs sur données fictives');
  const overflow = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    elements: [
      `html ${document.documentElement.clientWidth}/${document.documentElement.scrollWidth} · body ${document.body.clientWidth}/${document.body.scrollWidth}`,
      ...[...document.querySelectorAll<HTMLElement>('body *')]
        .filter((element) => {
          const box = element.getBoundingClientRect();
          return box.right > document.documentElement.clientWidth + 1 || box.left < -1;
        })
        .slice(0, 8)
        .map((element) => `${element.tagName.toLowerCase()}.${element.className} (${Math.round(element.getBoundingClientRect().left)}→${Math.round(element.getBoundingClientRect().right)})`),
    ],
  }));
  expect(overflow.width, overflow.elements.join('\n')).toBeLessThanOrEqual(width);
}
