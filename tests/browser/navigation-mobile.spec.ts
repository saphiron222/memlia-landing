import { test, expect, type Locator } from '@playwright/test';
import { CTA } from '../../src/data/site.mjs';

/** Le burger ouvre les destinations ; sans JavaScript, les liens restent servis en clair. */
import { DESTINATIONS, HREFS } from '../navigation-attendue.mjs';

/** Un contrôle n'est atteignable que si le hit-test le rend, pas seulement sa boîte DOM. */
async function mesurerAtteignable(cible: Locator) {
  const etat = await cible.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return {
      texte: el.textContent!.trim(),
      rect: r.toJSON(),
      police: parseFloat(getComputedStyle(el).fontSize),
      dansLEcran: r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth,
      touches: [0.15, 0.5, 0.85].map((ratio) => el.contains(document.elementFromPoint(r.left + r.width * ratio, r.top + r.height / 2))),
    };
  });
  expect(etat.dansLEcran, etat.texte).toBe(true);
  expect(etat.touches, etat.texte).toEqual([true, true, true]);
  expect(etat.rect.height, etat.texte).toBeGreaterThanOrEqual(44);
  return etat;
}

for (const width of [320, 375, 390, 430, 768]) {
  for (const height of [844, 568, 360]) {
    test(`menu mobile lisible et tactile ${width}x${height}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);

      await page.locator('[data-burger]').click();
      const navigation = page.locator('#menu-mobile');
      const liens = navigation.locator('.nav-mobile-lien');
      await expect(navigation).toBeVisible();
      await expect(liens).toHaveText(DESTINATIONS);
      expect(await liens.evaluateAll((elements) => elements.map((element) => element.getAttribute('href')))).toEqual(HREFS);
      const mesures = [];
      for (const lien of await liens.all()) {
        // Centrer dans le panneau défilant évite l’arrondi du défilement « au plus près » de Chromium.
        await lien.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
        mesures.push(await mesurerAtteignable(lien));
      }
      await expect(page.locator('.nav-centre')).toBeHidden();
      await expect(page.locator('[data-burger]')).toBeVisible();
      await expect(page.locator('#menu-mobile')).toBeVisible();

      const debordement = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(debordement, `débordement horizontal à ${width}px`).toBeLessThanOrEqual(0);
      await testInfo.attach('mesures', { body: JSON.stringify(mesures), contentType: 'application/json' });
    });
  }
}

test('navigation mobile : ordre du clavier et destinations publiées', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.locator('[data-burger]').click();
  const liens = page.locator('#menu-mobile .nav-mobile-lien');
  await liens.first().focus();
  await page.keyboard.press('Tab');
  await expect(liens.nth(1)).toBeFocused();
  const marque = await liens.nth(1).evaluate((el) => {
    const style = getComputedStyle(el);
    return { contour: style.outlineStyle, ombre: style.boxShadow };
  });
  expect(marque.contour !== 'none' || (marque.ombre && marque.ombre !== 'none')).toBe(true);
  expect(await liens.evaluateAll((elements) => elements.map((element) => element.getAttribute('href')))).toEqual(HREFS);
});

test('bandeau : aucune réservation externe, l’action mène à /contact', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 844 });
  await page.goto('/');
  // L'échange se prépare sur /contact : le bandeau n'y court-circuite jamais.
  await expect(page.locator('.nav-barre a[href*="cal.com"]')).toHaveCount(0);
  await page.locator('[data-burger]').click();
  await expect(page.locator('#menu-mobile a[href*="cal.com"]')).toHaveCount(0);
  await page.locator('.nav-mobile-cta a').click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator(`a[href="${CTA.rendezVous.href}"]`).first()).toBeVisible();
});

test('sans JavaScript : les destinations publiées et l’action restent servies', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto('/');
  const navigation = page.locator('.nav-sans-js');
  await expect(navigation).toBeVisible();
  await expect(navigation.locator('a')).toHaveText([...DESTINATIONS, CTA.nav.libelle]);
  for (const link of await navigation.locator('a').all()) {
    expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  }
  await expect(page.locator('[data-burger]')).toBeHidden();
  await expect(navigation.locator('a').last()).toHaveAttribute('href', CTA.nav.href);
  await navigation.getByText('Méthode', { exact: true }).click();
  await expect(page).toHaveURL(/\/#methode$/);
  await context.close();
});

test('ancre : après défilement, un fragment atterrit sur sa cible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 568 });
  await page.goto('/');
  await page.evaluate(() => scrollTo({ top: 500, behavior: 'instant' }));
  await page.locator('[data-burger]').click();
  const ancre = page.locator('#menu-mobile a[href="/#questions"]');
  await ancre.scrollIntoViewIfNeeded();
  await ancre.click();
  await expect(page).toHaveURL(/#questions$/);
  await expect.poll(async () => Math.abs(await page.locator('#questions').evaluate((el) => el.getBoundingClientRect().top)) < 150).toBe(true);
});
