import { test, expect } from '@playwright/test';

const widths = [320, 375, 768, 1024, 1440, 1920];

for (const width of widths) {
  test(`Hub Ressources sans débordement à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 667 : 900 });
    const response = await page.goto('/ressources');
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('[data-resource-id]')).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    for (const section of await page.locator('main section').all()) {
      await section.scrollIntoViewIfNeeded();
      await expect(section).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

test('navigation mobile garde Ressources visible hors du panneau', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/ressources');
  const direct = page.locator('.nav-ressources-mobile');
  const menu = page.locator('[data-burger]');
  await expect(direct).toBeVisible();
  await expect(direct).toHaveAttribute('aria-current', 'page');
  await expect(menu).toContainText('Menu');
  for (const control of [direct, menu]) {
    const box = await control.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(48);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test('filtres progressifs : rôle, format, combinaison vide et reset', async ({ page }) => {
  await page.goto('/ressources');
  const entries = page.locator('[data-resource-id]');
  const role = page.locator('[data-role-filter]');
  const type = page.locator('[data-type-filter]');
  const reset = page.locator('[data-reset]');
  const count = page.locator('[data-count]');

  await expect(entries).toHaveCount(3);
  await role.selectOption('paie-responsables-sociaux');
  await expect(entries.filter({ visible: true })).toHaveCount(1);
  await expect(count).toHaveText('1 ressource');
  await type.selectOption('terme');
  await expect(page.locator('[data-empty]')).toBeVisible();
  await expect(count).toHaveText('0 ressources');
  await reset.click();
  await expect(entries.filter({ visible: true })).toHaveCount(3);
  await expect(role).toBeFocused();
});

test('sans JavaScript : liste et navigation restent complètes, filtres absents', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 667 } });
  const page = await context.newPage();
  await page.goto(`${process.env.QA_URL ?? 'http://127.0.0.1:4321'}/ressources`);
  await expect(page.locator('[data-resource-id]')).toHaveCount(3);
  await expect(page.locator('[data-filters]')).toBeHidden();
  await expect(page.locator('.sans-js')).toBeVisible();
  await expect(page.locator('.nav-sans-js a[href="/ressources"]')).toBeVisible();
  await context.close();
});

test('routes, canonical et schéma n’annoncent aucun index absent', async ({ page, request }) => {
  await page.goto('/ressources');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://memlia.fr/ressources');
  const graph = await page.locator('script[type="application/ld+json"]').evaluate((script) => JSON.parse(script.textContent!));
  expect(graph['@graph'].map((node: { '@type': string }) => node['@type'])).toEqual([
    'CollectionPage', 'ItemList', 'BreadcrumbList', 'Organization', 'WebSite',
  ]);
  expect(graph['@graph'][1].numberOfItems).toBe(3);
  expect((await request.get('/guides')).status()).toBe(404);
  expect((await request.get('/modeles')).status()).toBe(404);
  await expect(page.locator('a[href="/guides"], a[href="/modeles"]')).toHaveCount(0);
});
