import { test, expect, type Locator } from '@playwright/test';

import { DESTINATIONS } from '../navigation-attendue.mjs';

async function expectTouchable(link: Locator) {
  const state = await link.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      text: element.textContent!.trim(),
      rect: rect.toJSON(),
      fontSize: parseFloat(getComputedStyle(element).fontSize),
      hits: [0.15, 0.5, 0.85].map((ratio) =>
        element.contains(document.elementFromPoint(rect.left + rect.width * ratio, rect.top + rect.height / 2))),
    };
  });
  expect(state.rect.height, state.text).toBeGreaterThanOrEqual(44);
  expect(state.rect.left, state.text).toBeGreaterThanOrEqual(0);
  expect(state.rect.right, state.text).toBeLessThanOrEqual(await link.page().evaluate(() => innerWidth));
  expect(state.fontSize, state.text).toBeGreaterThanOrEqual(14);
  expect(state.hits, state.text).toEqual([true, true, true]);
  return state;
}

for (const width of [320, 375, 390, 430, 768]) {
  for (const height of [844, 568, 360]) {
    test(`navigation visible et tactile ${width}x${height}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);

      const navigation = page.locator('[data-mobile-visible]');
      const links = navigation.locator('a');
      await expect(navigation).toBeVisible();
      await expect(links).toHaveText(DESTINATIONS);
      const states = [];
      for (const link of await links.all()) {
        states.push(await expectTouchable(link));
      }
      await expect(page.locator('[data-burger]')).toBeHidden();
      await expect(page.locator('#menu-mobile')).toBeHidden();
      await expect(page.locator('#main')).not.toHaveAttribute('inert');
      await expect(page.locator('body')).not.toHaveCSS('position', 'fixed');
      await testInfo.attach('mesures', { body: JSON.stringify(states), contentType: 'application/json' });
    });
  }
}

test('navigation visible : chaque destination atteint son fragment', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const fragment of ['usages', 'methode', 'preuves', 'questions']) {
    await page.goto('/');
    await page.locator(`[data-mobile-visible] a[href="/#${fragment}"]`).click();
    await expect(page).toHaveURL(new RegExp(`#${fragment}$`));
    await expect(page.locator(`#${fragment}`)).toBeVisible();
  }
});

test('navigation visible : retours à la ligne à 320 px sans défilement horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const navigation = page.locator('[data-mobile-visible]');
  const rows = await navigation.locator('a').evaluateAll((links) => [...new Set(links.map((link) => link.getBoundingClientRect().top))]);
  expect(rows.length).toBeGreaterThanOrEqual(2);
  expect(await navigation.evaluate((element) => element.scrollWidth)).toBe(320);
  expect(await navigation.evaluate((element) => element.scrollLeft)).toBe(0);
  await expectTouchable(navigation.locator('a').last());
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
});