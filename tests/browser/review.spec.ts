import { test, expect } from '@playwright/test';

for (const [width, height] of [[320,740],[375,812],[1024,768],[1366,768]]) {
  test(`première vue utile ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({width,height});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const box = await page.locator('.hero-boutons').boundingBox();
    expect(box!.y + box!.height).toBeLessThan(height - 16);
    expect(await page.locator('.hero').evaluate(el => parseFloat(getComputedStyle(el).paddingTop))).toBeLessThanOrEqual(96);
  });
}

test('navigation mobile visible reste au clavier sans verrouiller le fond', async ({ page }) => {
  await page.setViewportSize({width:375,height:812});
  await page.goto('/');
  const liens = page.locator('[data-mobile-visible] a');
  await liens.first().focus();
  await page.keyboard.press('Tab');
  await expect(liens.nth(1)).toBeFocused();
  await expect(page.locator('#main')).not.toHaveAttribute('inert');
  await page.keyboard.press('Escape');
  await expect(page.locator('#menu-mobile')).toBeHidden();
  await expect(page.locator('body')).not.toHaveCSS('position','fixed');
});

test('garanties cohérentes avec les limites et les données', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.garantie-lien').filter({hasText:'RGPD'})).toHaveAttribute('href','#faq-donnees-reelles');
  await expect(page.locator('.garanties-grille')).not.toContainText('Zéro macro, zéro migration');
});

test('promesse tablette conserve des colonnes lisibles', async ({ page }) => {
  await page.setViewportSize({width:768,height:1024});
  await page.goto('/');
  const box = await page.locator('.promesse-point').first().boundingBox();
  expect(box!.width).toBeGreaterThan(300);
});

for (const width of [1024, 1366]) {
  test(`navigation et CTA sur une ligne à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 768 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    for (const selector of ['.nav-centre a', '.nav-principal', '.hero-btn']) {
      const lines = await page.locator(selector).evaluateAll(elements => elements.map(el => {
        const range = document.createRange();
        const text = [...el.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
        if (!text) throw new Error('Texte à mesurer absent');
        range.selectNodeContents(text);
        return new Set([...range.getClientRects()].map(rect => Math.round(rect.y))).size;
      }));
      expect(lines.length).toBeGreaterThan(0);
      expect(lines.every(count => count === 1)).toBe(true);
    }
    const lines = await page.locator('h1').evaluate(el => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return new Set([...range.getClientRects()].map(rect => Math.round(rect.y))).size;
    });
    expect(lines).toBeLessThanOrEqual(2);
  });
}
