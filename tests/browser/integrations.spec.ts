import { test, expect } from '@playwright/test';

import { INTEGRATIONS_INDEXABLES } from '../../src/data/integrations';
import { checkIntegrationPage, widths } from './helpers/inventories';

const slugs = INTEGRATIONS_INDEXABLES.map(({ slug }) => slug);
const services = [...new Set(INTEGRATIONS_INDEXABLES.map(({ service }) => service.href))];

test('inventaire des guides : plancher et identités uniques', () => {
  expect(slugs.length).toBeGreaterThanOrEqual(9);
  expect(new Set(slugs).size).toBe(slugs.length);
});

for (const width of widths) {
  test(`les pages intégrations restent lisibles à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const guide of INTEGRATIONS_INDEXABLES) await checkIntegrationPage(page, guide, width);
  });
}

test('le hub, les moyeux et le footer relient la vague forte', async ({ page }) => {
  await page.goto('/integrations');
  for (const slug of slugs) await expect(page.locator(`main a[href="/integrations/${slug}"]`)).toHaveCount(1);
  await expect(page.locator('footer a[href="/integrations"]')).toBeVisible();

  for (const service of services) {
    const response = await page.goto(service);
    expect(response?.status()).toBe(200);
    for (const guide of INTEGRATIONS_INDEXABLES.filter((guide) => guide.service.href === service)) {
      await expect(page.locator(`main a[href="/integrations/${guide.slug}"]`)).toHaveCount(1);
    }
  }
});

test('le hub et tous les guides gardent leurs repères accessibles essentiels', async ({ page }) => {
  for (const path of ['/integrations', ...slugs.map((slug) => `/integrations/${slug}`)]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('nav[aria-label="Navigation principale"]')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);
    await expect(page.locator('img:not([alt])')).toHaveCount(0);
    await expect(page.locator('a[href=""]')).toHaveCount(0);
    const structure = await page.evaluate(() => {
      const ids = [...document.querySelectorAll<HTMLElement>('[id]')].map((element) => element.id);
      const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
      const levels = [...document.querySelectorAll('main h1, main h2, main h3')].map((heading) => Number(heading.tagName[1]));
      const skipped = levels.some((level, index) => index > 0 && level > levels[index - 1] + 1);
      return { duplicateIds, skipped };
    });
    expect(structure.duplicateIds, `${path}: identifiants dupliqués`).toEqual([]);
    expect(structure.skipped, `${path}: niveau de titre sauté`).toBe(false);
  }
});

test('sans JavaScript, le contenu, la preuve et le retour au moyeu restent servis', async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  for (const guide of INTEGRATIONS_INDEXABLES) {
    const response = await page.goto(`/integrations/${guide.slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toHaveText(guide.h1);
    await expect(page.locator(`[data-proof="integrations/${guide.slug}"]`)).toBeVisible();
    await expect(page.locator(`main a[href="${guide.service.href}"]`)).toBeVisible();
  }
  await context.close();
});
