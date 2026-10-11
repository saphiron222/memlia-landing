import { test, expect } from '@playwright/test';
import { INTEGRATIONS } from '../../src/data/integrations';

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`hub guides : choisir une tâche à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/integrations');
    await expect(page.locator('h1')).toHaveText('Guides par environnement comptable');
    const count = await page.locator('script[type="application/ld+json"]').first().evaluate(el =>
      JSON.parse(el.textContent!)['@graph'].find((node: any) => node['@type'] === 'ItemList').numberOfItems);
    await expect(page.locator('.page-chapeau')).toContainText(`Les ${count} guides`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://memlia.fr/integrations');
    await expect(page.locator('[data-integration-cards] > li')).toHaveCount(count);
    const titles = await page.locator('[data-integration-cards] h3').allTextContents();
    expect([...titles].sort()).toEqual(INTEGRATIONS.map(({ task, product }) => `${task.charAt(0).toLocaleUpperCase('fr')}${task.slice(1)} dans ${product}`).sort());
    for (const title of titles) {
      expect(title).not.toMatch(/Dsn|sage|cegid|silae/);
    }
    await expect(page.locator('main')).not.toContainText(/moyeu|signal d.indexation|Mesurer, publier peu/i);
    await expect(page.locator('#suite a', { hasText: 'Confier une première tâche' })).toHaveAttribute('href', '/contact');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    if (width === 375 || width === 1440) {
      await page.evaluate(() => document.querySelectorAll('.rv, .rv-groupe').forEach(el => el.classList.add('in')));
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.screenshot({ path: `.qa/integrations-hub-${width}.png`, fullPage: true });
    }
  });
}

test('chaque carte mène au guide décrit, puis le CTA mène au contact', async ({ page }) => {
  await page.goto('/integrations');
  const cards = await page.locator('[data-integration-cards] a').evaluateAll(elements => elements.map(el => ({
    path: el.getAttribute('href')!, description: el.querySelector('p')!.textContent!,
  })));
  const items = await page.locator('script[type="application/ld+json"]').first().evaluate(el =>
    JSON.parse(el.textContent!)['@graph'].find((node: any) => node['@type'] === 'ItemList').itemListElement);
  expect(cards.length).toBe(items.length);
  for (const card of cards) {
    await page.goto('/integrations');
    await page.locator(`[data-integration-cards] a[href="${card.path}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${card.path}$`));
    await expect(page.locator('h1')).toHaveText(items.find((item: any) => new URL(item.url).pathname === card.path).name);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', card.description);
  }
  await page.goto('/integrations');
  await page.locator('#suite a', { hasText: 'Confier une première tâche' }).click();
  await expect(page).toHaveURL(/\/contact$/);
});
