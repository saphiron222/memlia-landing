import { test, expect } from '@playwright/test';

/**
 * Les six largeurs de la consigne, sur les pages du site v2.
 *
 * Un débordement horizontal ne casse aucun test fonctionnel : la page se rend, elle
 * se défile simplement de travers. Il faut donc le mesurer explicitement, largeur par
 * largeur, plutôt que l'attendre d'une suite qui n'en parle pas.
 */
const LARGEURS: [number, number][] = [[320, 740], [375, 812], [768, 1024], [1024, 768], [1440, 900], [1920, 1080]];
const ROUTES = ['/automatisation-cabinet-comptable', '/methode', '/garanties', '/a-propos', '/contact'];

for (const [width, height] of LARGEURS) {
  test(`pages v2 sans débordement ni titre manquant ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const route of ROUTES) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('h1'), route).toHaveCount(1);
      await expect(page.locator('.ariane'), route).toBeVisible();
      const debordement = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(debordement, `${route} à ${width}px`).toBeLessThanOrEqual(0);
      // Les cinq entrées sont toujours dans le document ; sous 1024 px elles se déplient
      // depuis le menu, au-dessus elles sont en clair dans le bandeau.
      await expect(page.locator('.nav-entree'), route).toHaveCount(5);
      if (width < 1024) {
        const bouton = page.locator('[data-burger]');
        await expect(bouton, route).toBeVisible();
        const boite = await bouton.boundingBox();
        expect(boite?.height, `${route} à ${width}px`).toBeGreaterThanOrEqual(48);
        expect(boite?.width, `${route} à ${width}px`).toBeGreaterThanOrEqual(48);
        await page.locator('[data-burger]').click();
        await expect(page.locator('.nav-mobile-lien'), route).toHaveCount(5);
        await expect(page.locator('#menu-mobile a').last(), route).toBeVisible();
        await page.keyboard.press('Escape');
      } else {
        await expect(page.locator('.nav-centre'), route).toBeVisible();
        await expect(page.locator('.nav-principal'), route).toBeVisible();
      }
    }
  });
}

/**
 * Le HTML servi et le DOM rendu doivent dire la même chose des éléments que lisent les
 * robots. Un script qui réécrit un titre ou une canonical après le chargement ne casse
 * rien à l'écran : seule cette comparaison le voit.
 */
const INDEXABLES = ['/', '/automatisation-cabinet-comptable', '/methode', '/garanties', '/a-propos', '/contact', '/blog', '/ressources', '/glossaire'];

test('crawl : le DOM rendu ne contredit pas le HTML initial', async ({ page, request }) => {
  for (const route of INDEXABLES) {
    const initial = await (await request.get(route)).text();
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const rendu = {
      titre: await page.title(),
      canonical: await page.locator('link[rel="canonical"]').getAttribute('href'),
      h1: await page.locator('h1').count(),
      robots: await page.locator('meta[name="robots"]').count(),
      nav: await page.locator('.nav-entree').evaluateAll((liens) => liens.map((l) => l.getAttribute('href'))),
    };
    const servi = {
      titre: (initial.match(/<title>(.*?)<\/title>/is)?.[1] ?? '').replace(/&#39;/g, "'").replace(/&amp;/g, '&'),
      canonical: initial.match(/<link\s+rel="canonical"\s+href="(.*?)"/is)?.[1] ?? null,
      h1: (initial.match(/<h1[\s>]/gi) ?? []).length,
      robots: (initial.match(/<meta\s+name="robots"/gi) ?? []).length,
      nav: [...initial.matchAll(/class="nav-entree"\s+href="([^"]+)"/g)].map((m) => m[1]),
    };
    expect(rendu.titre, `${route} titre`).toBe(servi.titre);
    expect(rendu.canonical, `${route} canonical`).toBe(servi.canonical);
    expect(rendu.h1, `${route} h1`).toBe(servi.h1);
    expect(rendu.robots, `${route} robots`).toBe(servi.robots);
    expect(rendu.nav.length, `${route} entrées de navigation`).toBe(5);
  }
});
