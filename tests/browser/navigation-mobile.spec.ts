import { test, expect, type Locator } from '@playwright/test';
import { CTA } from '../../src/data/site.mjs';

/**
 * La navigation mobile publiée est une liste immédiatement visible sous le bandeau.
 * Aucun geste ni JavaScript ne doit être nécessaire pour découvrir ses destinations.
 */
const DESTINATIONS = ['Tâches', 'Méthode', 'Contrôle humain', 'Questions'];
const HREFS = ['/#usages', '/#methode', '/#preuves', '/#questions'];

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
    test(`bandeau lisible sans action ${width}x${height}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);

      const navigation = page.locator('[data-mobile-visible]');
      const liens = navigation.locator('a');
      await expect(navigation).toBeVisible();
      await expect(liens).toHaveText(DESTINATIONS);
      expect(await liens.evaluateAll((elements) => elements.map((element) => element.getAttribute('href')))).toEqual(HREFS);
      const mesures = [];
      for (const lien of await liens.all()) {
        await lien.scrollIntoViewIfNeeded();
        mesures.push(await mesurerAtteignable(lien));
      }
      await expect(page.locator('.nav-centre')).toBeHidden();
      await expect(page.locator('[data-burger]')).toBeHidden();
      await expect(page.locator('#menu-mobile')).toBeHidden();

      const debordement = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(debordement, `débordement horizontal à ${width}px`).toBeLessThanOrEqual(0);
      await testInfo.attach('mesures', { body: JSON.stringify(mesures), contentType: 'application/json' });
    });
  }
}

test('navigation mobile : ordre du clavier et destinations publiées', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const liens = page.locator('[data-mobile-visible] a');
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
  await expect(page.locator('[data-mobile-visible] a[href*="cal.com"]')).toHaveCount(0);
  await page.locator('.nav-principal').click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator(`a[href="${CTA.rendezVous.href}"]`).first()).toBeVisible();
});

test('sans JavaScript : les quatre entrées visibles et l’action restent servies', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto(process.env.QA_URL ?? 'http://127.0.0.1:4321');
  const navigation = page.locator('[data-mobile-visible]');
  await expect(navigation).toBeVisible();
  await expect(navigation.locator('a')).toHaveText(DESTINATIONS);
  await expect(page.locator('.nav-principal')).toHaveAttribute('href', CTA.nav.href);
  await navigation.getByText('Méthode', { exact: true }).click();
  await expect(page).toHaveURL(/\/#methode$/);
  await context.close();
});

test('ancre : après défilement, un fragment atterrit sur sa cible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 568 });
  await page.goto('/');
  const ancre = page.locator('[data-mobile-visible] a[href="/#questions"]');
  await ancre.scrollIntoViewIfNeeded();
  await ancre.click();
  await expect(page).toHaveURL(/#questions$/);
  await expect.poll(async () => Math.abs(await page.locator('#questions').evaluate((el) => el.getBoundingClientRect().top)) < 150).toBe(true);
});
