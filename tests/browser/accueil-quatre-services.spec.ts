import { test, expect } from '@playwright/test';

const destinations = [
  '/automatisation-cabinet-comptable',
  '/agents-ia',
  '/memoire-collective-cabinet-comptable',
  '/modele-ia-prive-entreprise',
];

for (const route of ['/', '/commissaires-aux-comptes']) {
  for (const width of [375, 1440]) {
    test(`${route} : quatre services distincts et accessibles à ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(route);
      const choix = page.locator('.editorial-choix');
      const cartes = choix.locator('.catalogue-carte');
      await expect(cartes).toHaveCount(4);
      expect(await cartes.evaluateAll(links => links.map(a => a.getAttribute('href')))).toEqual(destinations);
      await expect(choix).toContainText('mémoire collective');
      await expect(choix).toContainText('entraînement');
      await expect(choix.getByRole('link', { name: 'Décrire votre besoin' })).toHaveAttribute('href', '/contact');
      for (const carte of await cartes.all()) {
        await carte.focus();
        await expect(carte).toBeFocused();
        expect(await carte.evaluate(e => getComputedStyle(e).outlineStyle)).not.toBe('none');
        await expect(carte.locator('h3')).toBeVisible();
      }
      const boxes = await cartes.evaluateAll(nodes => nodes.map(n => { const b=n.getBoundingClientRect(); return {x:b.x,y:b.y,w:b.width}; }));
      if (width < 768) expect(new Set(boxes.map(b => b.x)).size).toBe(1);
      else {
        expect(boxes[0].y).toBe(boxes[1].y);
        expect(boxes[2].y).toBe(boxes[3].y);
        expect(boxes[0].w).toBe(boxes[3].w);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('#questions details')).toHaveCount(11);
      for (const href of destinations) {
        const response = await page.request.get(href);
        expect(response.status(), href).toBe(200);
      }
      await cartes.nth(2).focus();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/\/memoire-collective-cabinet-comptable$/);
    });
  }
}
