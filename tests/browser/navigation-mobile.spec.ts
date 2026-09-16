import { test, expect, type Locator } from '@playwright/test';
import { CTA } from '../../src/data/site.mjs';

/**
 * Le bandeau mobile lui-même : le logo, et le bouton qui ouvre le panneau.
 *
 * Le panneau est éprouvé par mobile-menu.spec.ts. Ici, ce qui ne dépend d'aucun geste : le
 * bouton est une cible de 48 px portant un nom accessible malgré l'absence de texte visible,
 * et la navigation reste servie en clair à qui n'a pas JavaScript — le panneau ne s'ouvrirait pas.
 */
const PRIMAIRES = ['Automatisation', 'Méthode', 'Garanties', 'Ressources', 'Blog'];

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
  expect(etat.rect.height, etat.texte).toBeGreaterThanOrEqual(48);
  return etat;
}

for (const width of [320, 375, 390, 430, 768]) {
  for (const height of [844, 568, 360]) {
    test(`bandeau lisible sans action ${width}x${height}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);

      const bouton = page.locator('[data-burger]');
      await expect(bouton).toBeVisible();
      // Aucun texte visible : le nom accessible doit donc être porté par l'attribut.
      await expect(bouton).toHaveAttribute('aria-label', 'Ouvrir le menu principal');
      expect((await bouton.textContent())?.trim()).toBe('');
      const mesures = [await mesurerAtteignable(bouton)];
      expect(mesures[0].rect.width, 'cible tactile du bouton').toBeGreaterThanOrEqual(48);
      // Le bandeau tient sur une ligne : le bouton reste au niveau du logo.
      const logo = await page.locator('.nav-marque').boundingBox();
      expect(mesures[0].rect.top, 'le bouton reste sur la ligne du bandeau').toBeLessThan(logo!.y + logo!.height);
      // Les cinq entrées sont dans le document, repliées derrière le menu — aucune dans le bandeau.
      await expect(page.locator('.nav-centre')).toBeHidden();
      await expect(page.locator('.nav-entree')).toHaveText(PRIMAIRES);
      // Un seul lien visible dans le bandeau : le logo. Les autres sont dans le document, repliés.
      await expect(page.locator('.nav-barre a:visible')).toHaveCount(1);

      const debordement = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(debordement, `débordement horizontal à ${width}px`).toBeLessThanOrEqual(0);
      await testInfo.attach('mesures', { body: JSON.stringify(mesures), contentType: 'application/json' });
    });
  }
}

test('bandeau : ordre du clavier et page courante marquée dans le panneau', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/ressources');

  // Le logo puis le bouton : une seule séquence, sans piège de focus tant qu'il est fermé.
  await page.locator('.nav-marque a').focus();
  await page.keyboard.press('Tab');
  const bouton = page.locator(':focus');
  await expect(bouton).toHaveAttribute('data-burger', '');
  const marque = await bouton.evaluate((el) => {
    const style = getComputedStyle(el);
    return { contour: style.outlineStyle, ombre: style.boxShadow };
  });
  expect(marque.contour !== 'none' || (marque.ombre && marque.ombre !== 'none')).toBe(true);

  // Le Hub est dans le panneau, et s'y marque comme page courante.
  await page.keyboard.press('Enter');
  await expect(page.locator('#menu-mobile [aria-current="page"]')).toHaveText('Ressources');
});

test('bandeau : aucune réservation externe, l’action mène à /contact', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 844 });
  await page.goto('/');
  // L'échange se prépare sur /contact : le bandeau n'y court-circuite jamais.
  await expect(page.locator('.nav-barre a[href*="cal.com"]')).toHaveCount(0);
  await expect(page.locator('#menu-mobile a[href*="cal.com"]')).toHaveCount(0);
  await page.locator('[data-burger]').click();
  await page.locator('#menu-mobile a').last().click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator(`a[href="${CTA.rendezVous.href}"]`).first()).toBeVisible();
});

test('sans JavaScript : les cinq entrées et l’action restent servies', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto(process.env.QA_URL ?? 'http://127.0.0.1:4321');
  // Le panneau ne s'ouvrirait pas : la navigation de repli porte les mêmes destinations.
  const repli = page.locator('.nav-sans-js a');
  await expect(repli).toHaveText([...PRIMAIRES, CTA.nav.libelle]);
  await expect(repli.last()).toHaveAttribute('href', CTA.nav.href);
  await repli.filter({ hasText: 'Méthode' }).click();
  await expect(page).toHaveURL(/\/methode$/);
  await context.close();
});

test('ancre : après défilement, un fragment atterrit sur sa cible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 568 });
  await page.goto('/');
  const ancre = page.locator('.pied-lien[href="#questions"]');
  await ancre.scrollIntoViewIfNeeded();
  await ancre.click();
  await expect(page).toHaveURL(/#questions$/);
  await expect.poll(async () => Math.abs(await page.locator('#questions').evaluate((el) => el.getBoundingClientRect().top)) < 150).toBe(true);
});
