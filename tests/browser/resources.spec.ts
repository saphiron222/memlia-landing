import { test, expect } from '@playwright/test';

const widths = [320, 375, 768, 1024, 1440, 1920];
// Composition du hub au 16/09/2026 : les trois articles publies du blog et l'entree glossaire.
// L'article 3 a rejoint l'index automatiquement : projectPublicResources derive sa fiche de son
// frontmatter des lors qu'il porte pipelineVersion 1, une tache et un role documente.
const RESSOURCES_ATTENDUES = 4;
// Le role affiche par le hub est un axe de DECOUVERTE, pas le rolePrincipal du frontmatter :
// ARTICLE_DISCOVERY (src/data/resources.ts) place volontairement « suivre la production sociale »
// sous direction-associes pour etaler les axes. Restent donc sous paie-responsables-sociaux le
// controle des bulletins avant la DSN et, depuis le 16/09/2026, la lecture des comptes rendus metier.
const ROLE_PAIE_ATTENDU = 2;

for (const width of widths) {
  test(`Hub Ressources sans débordement à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 667 : 900 });
    const response = await page.goto('/ressources');
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('[data-resource-id]')).toHaveCount(RESSOURCES_ATTENDUES);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    for (const section of await page.locator('main section').all()) {
      await section.scrollIntoViewIfNeeded();
      await expect(section).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

test('navigation mobile garde Ressources visible sans aucune action', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/ressources');
  const ressources = page.locator('.nav-entree[href="/ressources"]');
  await expect(ressources).toBeVisible();
  await expect(ressources).toHaveAttribute('aria-current', 'page');
  // Plus aucun panneau ne peut la cacher : le hamburger a disparu du site v2.
  await expect(page.locator('[data-burger]')).toHaveCount(0);
  for (const cible of [ressources, page.locator('.nav-principal')]) {
    const box = await cible.boundingBox();
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

  await expect(entries).toHaveCount(RESSOURCES_ATTENDUES);
  await role.selectOption('paie-responsables-sociaux');
  await expect(entries.filter({ visible: true })).toHaveCount(ROLE_PAIE_ATTENDU);
  await expect(count).toHaveText(`${ROLE_PAIE_ATTENDU} ressources`);
  await type.selectOption('terme');
  await expect(page.locator('[data-empty]')).toBeVisible();
  await expect(count).toHaveText('0 ressources');
  await reset.click();
  await expect(entries.filter({ visible: true })).toHaveCount(RESSOURCES_ATTENDUES);
  await expect(role).toBeFocused();
});

test('sans JavaScript : liste et navigation restent complètes, filtres absents', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 667 } });
  const page = await context.newPage();
  await page.goto(`${process.env.QA_URL ?? 'http://127.0.0.1:4321'}/ressources`);
  await expect(page.locator('[data-resource-id]')).toHaveCount(RESSOURCES_ATTENDUES);
  await expect(page.locator('[data-filters]')).toBeHidden();
  await expect(page.locator('.sans-js')).toBeVisible();
  await expect(page.locator('.nav-entree[href="/ressources"]')).toBeVisible();
  await context.close();
});

test('routes, canonical et schéma n’annoncent aucun index absent', async ({ page, request }) => {
  await page.goto('/ressources');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://memlia.fr/ressources');
  const graph = await page.locator('script[type="application/ld+json"]').evaluate((script) => JSON.parse(script.textContent!));
  expect(graph['@graph'].map((node: { '@type': string }) => node['@type'])).toEqual([
    'CollectionPage', 'ItemList', 'BreadcrumbList', 'Organization', 'WebSite',
  ]);
  expect(graph['@graph'][1].numberOfItems).toBe(RESSOURCES_ATTENDUES);
  expect((await request.get('/guides')).status()).toBe(404);
  expect((await request.get('/modeles')).status()).toBe(404);
  await expect(page.locator('a[href="/guides"], a[href="/modeles"]')).toHaveCount(0);
});
