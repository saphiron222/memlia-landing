import { test, expect, type Locator } from '@playwright/test';

// Mesurer le texte, pas les pictogrammes ni les panneaux fermés.
async function textLines(locator: Locator) {
  return locator.evaluateAll(elements => elements.map(el => {
    const range = document.createRange();
    const text = [...el.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
    if (!text) throw new Error('Texte à mesurer absent');
    range.selectNodeContents(text);
    return new Set([...range.getClientRects()].map(rect => Math.round(rect.y))).size;
  }));
}

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

test('menu mobile : clavier, fermeture et libération du fond', async ({ page }) => {
  await page.setViewportSize({width:375,height:812});
  await page.goto('/');
  await page.locator('[data-burger]').click();
  const liens = page.locator('#menu-mobile a');
  await liens.first().focus();
  await page.keyboard.press('Tab');
  await expect(liens.nth(1)).toBeFocused();
  await expect(page.locator('#main')).toHaveAttribute('inert', '');
  await page.keyboard.press('Escape');
  await expect(page.locator('#main')).not.toHaveAttribute('inert');
  await expect(page.locator('#menu-mobile')).toBeHidden();
  await expect(page.locator('body')).not.toHaveCSS('position','fixed');
});

test('garanties cohérentes avec les limites et les données', async ({ page }) => {
  await page.goto('/');
  // Système de page du 07/10/2026 : les six garanties de l'accueil sont une liste de liens.
  await expect(page.locator('#garanties .lien-rangee').filter({hasText:'RGPD'})).toHaveAttribute('href','#faq-donnees-reelles');
  await expect(page.locator('#garanties .lien-rangee')).toHaveCount(6);
  await expect(page.locator('#garanties')).not.toContainText('Zéro macro, zéro migration');
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
    for (const selector of ['.nav-centre .nav-entree:visible', '.nav-principal:visible', '.hero-btn:visible']) {
      const lines = await textLines(page.locator(selector));
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

  test(`sous-menus ouverts lisibles à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 768 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const triggers = page.locator('[data-groupe-bouton]');
    expect(await triggers.count()).toBeGreaterThan(0);
    for (const trigger of await triggers.all()) {
      const panel = page.locator(`#${await trigger.getAttribute('aria-controls')}`);
      await expect(panel).toBeHidden();
      await trigger.focus();
      await page.keyboard.press('Enter');
      await expect(panel).toBeVisible();
      for (const link of await panel.locator('a').all()) {
        await expect(link).toBeVisible();
        const box = (await link.boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
        const [lines] = await textLines(link);
        expect(lines).toBeGreaterThan(0);
        const lineHeight = await link.evaluate(el => parseFloat(getComputedStyle(el).lineHeight));
        expect(box.height).toBeGreaterThanOrEqual(lines * lineHeight);
      }
      await page.keyboard.press('Escape');
      await expect(panel).toBeHidden();
    }
  });
}

test('témoin : un vrai retour à la ligne visible reste détecté', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const entry = page.locator('.nav-centre a.nav-entree').first();
  expect(await textLines(entry)).toEqual([1]);
  await entry.evaluate(el => {
    el.textContent = 'Navigation volontairement sur plusieurs lignes';
    (el as HTMLElement).style.cssText = 'display:block; width:80px; white-space:normal; overflow-wrap:anywhere';
  });
  await expect(entry).toBeVisible();
  const lines = await textLines(entry);
  expect(lines[0]).toBeGreaterThan(1);
  expect(lines.every(count => count === 1)).toBe(false);
});
