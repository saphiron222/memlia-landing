import { test, expect } from '@playwright/test';

const EXPECTED_TERMS = 53;

async function glossaryReport(page: import('@playwright/test').Page) {
  return page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    terms: document.querySelectorAll('.glossaire-entree').length,
    h1: document.querySelectorAll('h1').length,
    broken: [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
      .filter((link) => !document.getElementById(link.hash.slice(1)))
      .map((link) => link.hash),
  }));
}

test('glossaire : 53 termes, alphabet réel, canonical, breadcrumb et schéma', async ({ page }) => {
  const response = await page.goto('/glossaire');
  expect(response?.status()).toBe(200);
  const report = await glossaryReport(page);
  expect(report).toEqual(expect.objectContaining({ terms: EXPECTED_TERMS, h1: 1, broken: [] }));
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://memlia.fr/glossaire');
  await expect(page.locator('.ariane [aria-current="page"]')).toHaveText('Glossaire');
  // 16 initiales depuis la vague 1 du 16/09/2026 (E, G, H, I, J rejoignent les onze lettres initiales).
  await expect(page.locator('[data-lettre]')).toHaveCount(16);
  await expect(page.locator('.alphabet a')).toHaveCount(16);
  const schema = await page.locator('script[type="application/ld+json"]').textContent();
  const types = JSON.parse(schema!)['@graph'].map((node: { '@type': string }) => node['@type']);
  expect(types).toEqual(['CollectionPage', 'DefinedTermSet', 'BreadcrumbList', 'Organization', 'WebSite']);
  expect(schema).not.toContain('FAQPage');
});

test('recherche progressive : filtre, état vide puis restauration', async ({ page }) => {
  await page.goto('/glossaire');
  const search = page.getByLabel('Rechercher un terme');
  const reset = page.getByRole('button', { name: 'Effacer la recherche' });
  await expect(search).toBeVisible();
  await expect(reset).toBeDisabled();
  await search.fill('pseudonymisation');
  await expect(reset).toBeEnabled();
  await expect(page.locator('.glossaire-entree:visible')).toHaveCount(1);
  await expect(page.locator('[data-result-count]')).toHaveText('1 terme');
  await search.fill('terme absent du glossaire');
  await expect(page.locator('[data-empty]')).toBeVisible();
  await reset.click();
  await expect(page.locator('.glossaire-entree:visible')).toHaveCount(EXPECTED_TERMS);
  await expect(reset).toBeDisabled();
  await expect(search).toBeFocused();
});

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`glossaire sans débordement à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/glossaire');
    await page.evaluate(() => document.fonts.ready);
    expect((await glossaryReport(page)).width).toBeLessThanOrEqual(width);
    await expect(page.locator('.glossaire-entree').last()).toBeVisible();
  });
}

test('glossaire sans JavaScript : toutes les entrées et les ancres restent utilisables', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto(`${process.env.QA_URL ?? 'http://127.0.0.1:4321'}/glossaire`);
  await expect(page.getByLabel('Rechercher un terme')).toBeHidden();
  await expect(page.locator('.glossaire-entree')).toHaveCount(EXPECTED_TERMS);
  await expect(page.locator('.glossaire-entree').last()).toBeVisible();
  await page.locator('.alphabet a').first().click();
  await expect(page).toHaveURL(/#lettre-a$/);
  await context.close();
});
