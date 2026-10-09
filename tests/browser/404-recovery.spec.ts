import { test, expect } from '@playwright/test';

for (const route of ['/404', '/copy-404-adresse-absente']) {
  for (const width of [320, 375]) {
    for (const input of ['clic', 'toucher']) {
      test(`bords visibles ${input} ${route} à ${width}px`, async ({ browser, baseURL }) => {
        const context = await browser.newContext({ baseURL, viewport: { width, height: 900 }, hasTouch: true });
        const page = await context.newPage();
        try {
          for (const [name, href] of [
            ['Retour à l’accueil', '/'],
            ['Consulter nos articles', '/blog'],
            ['Confier une première tâche', '/contact'],
          ]) {
            for (const edge of ['haut', 'bas', 'gauche', 'droite']) {
              await page.goto(route);
              const link = page.locator('main .erreur').getByRole('link', { name, exact: true });
              await link.scrollIntoViewIfNeeded();
              const box = await link.boundingBox();
              expect(box).not.toBeNull();
              const x = edge === 'gauche' ? box!.x + 2 : edge === 'droite' ? box!.x + box!.width - 2 : box!.x + box!.width / 2;
              const y = edge === 'haut' ? box!.y + 2 : edge === 'bas' ? box!.y + box!.height - 2 : box!.y + box!.height / 2;
              if (input === 'toucher') await page.touchscreen.tap(x, y);
              else await page.mouse.click(x, y);
              await expect(page, `${name}, bord ${edge}, ${input}`).toHaveURL(new RegExp(`${href}$`));
              await expect(page.locator('main h1')).toBeVisible();
            }
          }
        } finally {
          await context.close();
        }
      });
    }
  }
}

for (const route of ['/404', '/copy-404-adresse-absente']) {
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    test(`reprise du parcours ${route} à ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(route);
      if (route === '/404') expect([200, 404]).toContain(response?.status());
      else expect(response?.status()).toBe(404);
      await expect(page.locator('main h1')).toHaveText('Cette page est introuvable.');
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://memlia.fr/404');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

      const recovery = page.locator('main .erreur');
      const links = [
        ['Retour à l’accueil', '/'],
        ['Consulter nos articles', '/blog'],
        ['Confier une première tâche', '/contact'],
      ];
      for (const [name, href] of links) {
        const link = recovery.getByRole('link', { name, exact: true });
        await expect(link).toHaveAttribute('href', href);
        await expect(link).toBeVisible();
        const box = await link.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width);
        // La variante canonique mesure 32px ; minimum WCAG 2.2 AA de 24px.
        expect(box!.height).toBeGreaterThanOrEqual(24);
      }
      const home = recovery.getByRole('link', { name: 'Retour à l’accueil', exact: true });
      await expect(home).toHaveClass(/btn-principal/);
      await home.focus();
      for (const [name] of links.slice(1)) {
        await page.keyboard.press('Tab');
        await expect(recovery.getByRole('link', { name, exact: true })).toBeFocused();
      }
      for (const [name, href] of links) {
        await page.goto(route);
        await recovery.getByRole('link', { name, exact: true }).focus();
        await page.keyboard.press('Enter');
        await expect(page).toHaveURL(new RegExp(`${href === '/' ? '/' : href}$`));
        await expect(page.locator('main h1')).toBeVisible();
      }
    });
  }
}
