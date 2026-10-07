import { test, expect } from '@playwright/test';

// Une régression pleine largeur ou un média sous le texte doit rougir sur les neuf preuves.
// Système de page du 07/10/2026 (§ 7) : chaque preuve est posée dans le cadre unique ; dans une
// rangée, la maquette est à droite du texte, sur la moitié de la largeur, alignée en haut, jamais
// en quinconce ; les quatre étapes de la méthode vont deux par deux, chaque maquette sous son
// texte, dans sa moitié.
const ETAPES = ['04-observer', '05-cadrer', '06-eprouver', '07-livrer'];
for (const width of [320, 375, 768, 1280, 1440]) {
  test(`preuves encadrées, latérales et cadrage intégral à ${width}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const figures = page.locator('.functional-proof');
    await expect(figures).toHaveCount(9);
    for (const figure of await figures.all()) {
      await figure.scrollIntoViewIfNeeded();
      await expect(figure.locator('img')).toBeVisible();
      await figure.locator('img').evaluate((image: HTMLImageElement) => image.decode());
    }
    const measurements = await figures.evaluateAll(elements => elements.map(figure => {
      const img = figure.querySelector('img')!;
      const media = figure.closest('.proof-media')!;
      const row = figure.closest('[data-proof-row]');
      const copy = row?.querySelector('[data-proof-copy]');
      const grid = row?.closest('.etapes');
      const rect = (element: Element | null | undefined) => element?.getBoundingClientRect().toJSON() ?? null;
      // Aucune version agrandie à côté du cadre (Kevin, 07/10/2026) : le cadre seul fait la rangée.
      const enlarge = row?.querySelectorAll('[data-proof-detail], dialog, a[href^="/proofs/"]').length ?? 0;
      return { id: figure.getAttribute('data-proof'), image: rect(img), media: rect(media), row: rect(row), copy: rect(copy),
        grid: rect(grid), framed: media.classList.contains('cadre'), enlarge,
        fit: getComputedStyle(img).objectFit, natural: [img.naturalWidth, img.naturalHeight],
        interactive: !!figure.closest('a, button, [role="button"], [tabindex]'),
        focusable: img.tabIndex >= 0 || figure.querySelectorAll('a,button,[tabindex]').length > 0 };
    }));
    await testInfo.attach('geometry', { body: JSON.stringify(measurements, null, 2), contentType: 'application/json' });
    for (const item of measurements) {
      expect.soft(item.row, item.id!).not.toBeNull();
      expect.soft(item.framed, `${item.id} : cadre unique`).toBe(true);
      expect.soft(item.fit).toBe('contain');
      expect.soft(item.interactive).toBe(false);
      expect.soft(item.focusable).toBe(false);
      expect.soft(item.enlarge, item.id!).toBe(0);
      expect.soft(item.image.x).toBeGreaterThanOrEqual(0);
      expect.soft(item.image.right).toBeLessThanOrEqual(width);
      expect.soft(item.image.width / item.image.height).toBeCloseTo(16 / 9, 2);
      const etape = ETAPES.includes(item.id!);
      if (width >= 1024 && item.row && item.copy) {
        if (etape) {
          // Étape : la moitié de la grille des étapes, maquette sous son texte.
          expect.soft(item.media.width / item.grid!.width, item.id!).toBeLessThanOrEqual(0.52);
          expect.soft(item.media.width / item.grid!.width, item.id!).toBeGreaterThanOrEqual(0.45);
          expect.soft(item.copy.bottom, item.id!).toBeLessThanOrEqual(item.image.y + 1);
        } else {
          // Rangée : la maquette à droite du texte, sur la moitié de la largeur, alignés en haut.
          expect.soft(item.media.width / item.row.width, item.id!).toBeLessThanOrEqual(0.52);
          expect.soft(item.media.width / item.row.width, item.id!).toBeGreaterThanOrEqual(0.48);
          expect.soft(item.copy.right, item.id!).toBeLessThanOrEqual(item.media.x + 1);
          expect.soft(Math.abs(item.copy.y - item.media.y), `${item.id} : alignés en haut`).toBeLessThanOrEqual(1);
          expect.soft(item.row.height, item.id!).toBeLessThanOrEqual(Math.max(item.copy.height, item.media.height) + 1);
        }
      } else if (item.row && item.copy) {
        expect.soft(item.image.y).toBeGreaterThanOrEqual(item.copy.bottom);
        expect.soft(item.image.height).toBeLessThanOrEqual(370);
      }
    }
    if (width >= 1024) {
      // Étapes deux par deux : les maquettes d'une même rangée sont alignées.
      const parId = Object.fromEntries(measurements.map((m) => [m.id, m]));
      for (const [a, b] of [['04-observer', '05-cadrer'], ['06-eprouver', '07-livrer']]) {
        expect.soft(Math.abs(parId[a].image.y - parId[b].image.y), `${a} / ${b}`).toBeLessThanOrEqual(1);
        expect.soft(parId[a].media.right, `${a} / ${b}`).toBeLessThanOrEqual(parId[b].media.x);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
