import { test, expect, type Locator, type Page } from '@playwright/test';
import sharp from 'sharp';
import { CTA } from '../../src/data/site.mjs';

/**
 * Le panneau de navigation mobile, restauré le 16/09/2026 après la parenthèse du site v2 :
 * il porte les cinq pages et l'appel à l'action, et tient les propriétés qu'il tenait déjà.
 */
const ENTREES = ['Automatisation', 'Méthode', 'Garanties', 'Ressources', 'Blog'];

// Une boîte DOM peut être visible tout en étant rognée par le header filtré.
// Le hit-test ET les pixels doivent échouer si le contenu repasse devant le menu.
async function expectCovered(page: Page) {
  const geometry = await page.locator('#menu-mobile').evaluate(menu => {
    const rect = menu.getBoundingClientRect();
    const header = document.querySelector('.nav-barre')!.getBoundingClientRect();
    const points = [2, innerWidth / 2, innerWidth - 3].flatMap(x =>
      [rect.top + 3, (rect.top + innerHeight) / 2, innerHeight - 3].map(y =>
        ({ x, y, covered: menu.contains(document.elementFromPoint(x, y)) })));
    return { rect: rect.toJSON(), header: header.toJSON(), points, width: innerWidth, height: innerHeight };
  });
  expect(geometry.rect.bottom).toBeCloseTo(geometry.height, 0);
  expect(geometry.rect.top).toBeCloseTo(geometry.header.bottom, 0);
  expect(geometry.rect.left).toBe(0);
  expect(geometry.rect.right).toBe(geometry.width);
  expect(geometry.points.filter(point => !point.covered)).toEqual([]);
  await expect(page.locator('#menu-mobile')).toHaveCSS('background-color', 'rgb(255, 254, 251)');
  const png = await page.screenshot({ animations: 'disabled' });
  const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  // Colonne vide du panneau : mesure réelle du fond peint, pas sa couleur calculée.
  for (let y = Math.ceil(geometry.rect.top) + 3; y < geometry.height - 2; y++) {
    const offset = (y * info.width + 2) * info.channels;
    expect([...data.subarray(offset, offset + 3)], `fond opaque à y=${y}`).toEqual([255, 254, 251]);
  }
  return { geometry, png };
}

async function expectReachable(link: Locator) {
  const state = await link.evaluate(el => {
    const r = el.getBoundingClientRect();
    const panel = document.querySelector('#menu-mobile')!.getBoundingClientRect();
    return {
      text: el.textContent!.trim(), rect: r.toJSON(), font: parseFloat(getComputedStyle(el).fontSize),
      inside: r.top >= panel.top && r.bottom <= panel.bottom && r.left >= 0 && r.right <= innerWidth,
      hits: [0.15, 0.5, 0.85].map(ratio => el.contains(document.elementFromPoint(r.left + r.width * ratio, r.top + r.height / 2))),
    };
  });
  expect(state.inside, state.text).toBe(true);
  expect(state.hits, state.text).toEqual([true, true, true]);
  expect(state.rect.height, state.text).toBeGreaterThanOrEqual(48);
  expect(state.font, state.text).toBeGreaterThanOrEqual(16);
  return state;
}

for (const width of [320, 375, 390, 430, 768]) {
  for (const height of [844, 568, 360]) {
    test(`menu peint ${width}x${height}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      const burger = page.locator('[data-burger]');
      await expect(burger).toHaveAttribute('aria-expanded', 'false');
      await expect(burger.locator('.burger-ouvrir')).toBeVisible();
      await expect(burger.locator('.burger-fermer')).toBeHidden();
      await burger.click();
      await expect(burger).toHaveAttribute('aria-expanded', 'true');
      await expect(burger).toHaveAttribute('aria-label', 'Fermer le menu principal');
      await expect(burger.locator('.burger-fermer')).toBeVisible();
      await expect(burger.locator('.burger-ouvrir')).toBeHidden();
      const { geometry, png } = await expectCovered(page);
      await testInfo.attach('menu-ouvert', { body: png, contentType: 'image/png' });
      await expect(page.locator('#main')).toHaveAttribute('inert', '');
      const links = page.locator('#menu-mobile a');
      await expect(page.locator('.nav-mobile-lien')).toHaveText(ENTREES);
      await expect(links).toHaveCount(ENTREES.length + 1);
      await expect(links.last()).toHaveAttribute('href', CTA.nav.href);
      const states = [];
      for (const link of await links.all()) {
        // En hauteur normale, aucun scroll nécessaire ; en paysage chaque lien doit rester atteignable.
        if (height === 360) await link.evaluate(element => element.scrollIntoView({ block: 'center' }));
        states.push(await expectReachable(link));
      }
      for (let i = 1; i < states.length; i++) {
        if (height !== 360) expect(states[i].rect.top).toBeGreaterThanOrEqual(states[i - 1].rect.bottom);
      }
      if (height === 360) {
        expect(await page.locator('#menu-mobile').evaluate(el => el.scrollTop)).toBeGreaterThan(0);
        await testInfo.attach('menu-bas', { body: (await expectCovered(page)).png, contentType: 'image/png' });
      }
      await testInfo.attach('mesures', { body: JSON.stringify({ geometry, states }), contentType: 'application/json' });
      await burger.click();
      await expect(page.locator('#menu-mobile')).toBeHidden();
      await expect(page.locator('#main')).not.toHaveAttribute('inert');
      await expect(burger).toBeFocused();
    });
  }
}

test('menu : clavier, focus, verrou du fond et restauration du scroll', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 568 });
  await page.goto('/');
  await page.evaluate(() => window.scrollTo({ top: 720, behavior: 'instant' }));
  const before = await page.evaluate(() => scrollY);
  const burger = page.locator('[data-burger]');
  await burger.focus();
  await page.keyboard.press('Enter');
  await expectCovered(page);
  await expect(burger).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('.nav-mobile-lien').first()).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(burger).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#menu-mobile a').last()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(burger).toBeFocused();
  for (const link of await page.locator('#menu-mobile a').all()) {
    await page.keyboard.press('Tab');
    await expect(link).toBeFocused();
    await expectReachable(link);
  }
  await page.keyboard.press('Tab');
  await expect(burger).toBeFocused();
  await expect(page.locator('body')).toHaveCSS('position', 'fixed');
  const lockedTop = await page.locator('body').evaluate(el => el.getBoundingClientRect().top);
  await burger.hover();
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(150); // Laisser le navigateur traiter le geste de défilement.
  expect(await page.locator('body').evaluate(el => el.getBoundingClientRect().top)).toBe(lockedTop);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await page.locator('#main a').first().evaluate(el => (el as HTMLElement).focus());
  await expect(burger).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#menu-mobile')).toBeHidden();
  await expect(burger).toBeFocused();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(before);
  await expect(page.locator('body')).not.toHaveCSS('position', 'fixed');
  await burger.click();
  await expectCovered(page);
  await page.locator('.nav-mobile-lien[href="/methode"]').click();
  await expect(page).toHaveURL(/\/methode$/);
  await expect(page.locator('#menu-mobile')).toBeHidden();
  await expect(page.locator('#main')).not.toHaveAttribute('inert');
});

test('menu : appel à l’action, changement de viewport ouvert et retour mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 844 });
  await page.goto('/');
  const burger = page.locator('[data-burger]');
  await burger.click();
  await page.setViewportSize({ width: 430, height: 360 });
  await expectCovered(page);
  const cta = page.locator('#menu-mobile a').last();
  await cta.scrollIntoViewIfNeeded();
  await expectReachable(cta);
  await expect(cta).toHaveAttribute('href', CTA.nav.href);
  await cta.click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator('#menu-mobile')).toBeHidden();
  await expect(page.locator('#main')).not.toHaveAttribute('inert');
  await burger.click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('#menu-mobile')).toBeHidden();
  await expect(page.locator('body')).not.toHaveCSS('position', 'fixed');
  await expect(page.locator('#main')).not.toHaveAttribute('inert');
  await expect(page.locator('.nav-centre')).toBeVisible();
  await page.setViewportSize({ width: 375, height: 844 });
  await expect(burger).toHaveAttribute('aria-expanded', 'false');
  await burger.click();
  await expectCovered(page);
});

test('menu : section courante marquée et états du fond préexistants conservés', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => {
    document.querySelector<HTMLElement>('footer')!.inert = true;
    document.body.style.setProperty('--mobile-menu-scroll-top', '13px');
  });
  await page.locator('[data-burger]').click();
  await page.keyboard.press('Escape');
  await expect(page.locator('footer')).toHaveAttribute('inert', '');
  expect(await page.locator('body').evaluate(el => el.style.getPropertyValue('--mobile-menu-scroll-top'))).toBe('13px');
  await page.locator('[data-burger]').click();
  await page.locator('#menu-mobile a[href="/blog"]').click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect(page.locator('#menu-mobile')).toBeHidden();
  await page.locator('[data-burger]').click();
  await expect(page.locator('#menu-mobile [aria-current="page"]')).toHaveText('Blog');
  await page.locator('#menu-mobile a[href="/garanties"]').click();
  await expect(page).toHaveURL(/\/garanties$/);
  await expect(page.locator('#main')).not.toHaveAttribute('inert');
  await expect(page.locator('body')).not.toHaveCSS('position', 'fixed');
  // Le Hub reste marqué depuis les contenus qu'il réunit, sans être la page courante.
  await page.goto('/glossaire');
  await page.locator('[data-burger]').click();
  await expect(page.locator('#menu-mobile [aria-current="true"]')).toHaveText('Ressources');
});
