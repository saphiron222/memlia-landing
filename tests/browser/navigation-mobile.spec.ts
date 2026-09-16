import { test, expect, type Locator } from '@playwright/test';
import { CTA } from '../../src/data/site.mjs';

/**
 * Navigation mobile du site v2 : six entrées hors logo, aucune cachée.
 *
 * Le site a remplacé le panneau hamburger par une navigation servie dans le flux. Les
 * contrôles qui protégeaient le panneau — cible tactile, texte lisible, lien réellement
 * cliquable, ordre DOM égal à l'ordre visuel — restent tenus ici, sans qu'aucune action
 * ne soit nécessaire pour atteindre une entrée primaire.
 */
const PRIMAIRES = ['Automatisation', 'Méthode', 'Garanties', 'Ressources', 'Blog'];

/** Un lien n'est atteignable que si le hit-test le rend, pas seulement sa boîte DOM. */
async function mesurerAtteignable(lien: Locator) {
  const etat = await lien.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return {
      texte: el.textContent!.trim(),
      rect: r.toJSON(),
      police: parseFloat(getComputedStyle(el).fontSize),
      dansLEcran: r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth,
      touches: [0.15, 0.5, 0.85].map((ratio) => el.contains(document.elementFromPoint(r.left + r.width * ratio, r.top + r.height / 2))),
    };
  });
  expect(etat.touches, etat.texte).toEqual([true, true, true]);
  expect(etat.rect.height, etat.texte).toBeGreaterThanOrEqual(48);
  expect(etat.police, etat.texte).toBeGreaterThanOrEqual(16);
  return etat;
}

for (const width of [320, 375, 390, 430]) {
  for (const height of [844, 568, 360]) {
    test(`navigation visible sans action ${width}x${height}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);

      // Aucun panneau à ouvrir : le hamburger n'existe plus.
      await expect(page.locator('[data-burger]')).toHaveCount(0);
      await expect(page.locator('#menu-mobile')).toHaveCount(0);

      const entrees = page.locator('.nav-entree');
      await expect(entrees).toHaveText(PRIMAIRES);
      const action = page.locator('.nav-principal');
      await expect(action).toHaveText(CTA.nav.libelle);
      await expect(action).toHaveAttribute('href', CTA.nav.href);

      const mesures = [];
      for (const lien of [...(await entrees.all()), action]) {
        await lien.scrollIntoViewIfNeeded();
        mesures.push(await mesurerAtteignable(lien));
      }
      // Ordre DOM = ordre visuel : chaque entrée commence au plus tôt sur la ligne de
      // la précédente, jamais au-dessus d'elle.
      for (let i = 1; i < mesures.length; i++) {
        expect(mesures[i].rect.top, `${mesures[i].texte} après ${mesures[i - 1].texte}`)
          .toBeGreaterThanOrEqual(mesures[i - 1].rect.top);
      }
      // « Automatisation » demande 125 px : deux colonnes tiennent dès 320 px.
      const colonnes = new Set(mesures.slice(0, PRIMAIRES.length).map((m) => Math.round(m.rect.left))).size;
      expect(colonnes, `${width}px`).toBe(2);

      const debordement = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(debordement, `débordement horizontal à ${width}px`).toBeLessThanOrEqual(0);
      await testInfo.attach('mesures', { body: JSON.stringify(mesures), contentType: 'application/json' });
    });
  }
}

test('navigation : ordre du clavier, focus visible et page courante', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/methode');
  await expect(page.locator('.nav-entree[aria-current="page"]')).toHaveText('Méthode');

  // Le logo puis les cinq entrées puis l'action : une seule séquence, sans piège de focus.
  await page.locator('.nav-marque a').focus();
  for (const libelle of [...PRIMAIRES, CTA.nav.libelle]) {
    await page.keyboard.press('Tab');
    const focalise = page.locator(':focus');
    await expect(focalise).toHaveText(new RegExp(libelle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    // Le bouton principal signale le focus par une ombre portée, les liens par un
    // contour : exiger l'un des deux, pas un mécanisme en particulier.
    const marque = await focalise.evaluate((el) => {
      const style = getComputedStyle(el);
      return { contour: style.outlineStyle, ombre: style.boxShadow };
    });
    expect(marque.contour !== 'none' || (marque.ombre && marque.ombre !== 'none'), libelle).toBe(true);
  }
});

test('navigation : aucune réservation externe depuis le bandeau', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 844 });
  await page.goto('/');
  // L'échange se prépare sur /contact : le bandeau n'y court-circuite jamais.
  await expect(page.locator('.nav-barre a[href*="cal.com"]')).toHaveCount(0);
  await page.locator('.nav-principal').click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator('.nav-principal[aria-current="page"]')).toHaveCount(1);
  await expect(page.locator(`a[href="${CTA.rendezVous.href}"]`).first()).toBeVisible();
});

test('navigation : sans JavaScript, les six entrées restent servies', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto(process.env.QA_URL ?? 'http://127.0.0.1:4321');
  await expect(page.locator('.nav-entree')).toHaveText(PRIMAIRES);
  await expect(page.locator('.nav-principal')).toHaveAttribute('href', CTA.nav.href);
  await page.locator('.nav-entree', { hasText: 'Méthode' }).click();
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
