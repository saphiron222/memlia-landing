import { test, expect } from '@playwright/test';

const titles = ['Collecter et préparer', 'Contrôler et signaler', 'Rapprocher et synthétiser', 'Suivre un processus', 'Préparer une décision'];

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`capacités éditoriales et méthode en quinconce à ${width}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const uses = page.locator('#usages');
    await expect(uses.locator('h3')).toHaveText(titles);
    await expect(uses.locator('dl, dt, dd, table, small, .chip')).toHaveCount(0);
    await expect(uses).not.toContainText('Exemples non contractuels');
    await expect(uses).not.toContainText('Exemple de parcours');
    const cards = uses.locator('[data-usage]');
    await expect(cards).toHaveCount(5);
    const boxes = await cards.evaluateAll(elements => elements.map(el => el.getBoundingClientRect().toJSON()));
    if (width >= 768) {
      // Règle de grille du site (Kevin, 07/10/2026) : cinq cartes sur deux colonnes, la
      // cinquième s'étend sur toute la largeur ; aucune carte orpheline.
      expect(boxes[0].y).toBe(boxes[1].y);
      expect(boxes[2].y).toBe(boxes[3].y);
      expect(boxes[1].x).toBeGreaterThanOrEqual(boxes[0].right);
      expect(boxes[3].x).toBeGreaterThanOrEqual(boxes[2].right);
      expect(boxes[4].y).toBeGreaterThanOrEqual(boxes[2].bottom);
      expect(boxes[4].width).toBeGreaterThan(boxes[0].width * 1.9);
    } else {
      for (let i = 1; i < boxes.length; i++) expect(boxes[i].y).toBeGreaterThanOrEqual(boxes[i - 1].bottom);
    }
    const steps = page.locator('#methode [data-etape]');
    await expect(steps).toHaveCount(4);
    await expect(page.locator('#methode .step-number')).toHaveText(['Étape 1', 'Étape 2', 'Étape 3', 'Étape 4']);
    await expect(page.locator('#methode .chip, #methode figcaption, #methode small')).toHaveCount(0);
    const measurements = [];
    for (let i = 0; i < 4; i++) {
      const step = steps.nth(i);
      await step.scrollIntoViewIfNeeded();
      await step.locator('img').evaluate((image: HTMLImageElement) => image.decode());
      const m = await step.evaluate(el => {
        const copy = el.querySelector('[data-proof-copy]')!;
        const img = el.querySelector('img')!;
        return { copy: copy.getBoundingClientRect().toJSON(), image: img.getBoundingClientRect().toJSON(),
          enlarge: el.querySelectorAll('[data-proof-detail], dialog, a[href^="/proofs/"]').length,
          natural: [img.naturalWidth, img.naturalHeight], alt: img.alt,
          copyFirst: !!(copy.compareDocumentPosition(img) & Node.DOCUMENT_POSITION_FOLLOWING),
          interactive: !!img.closest('a,button,[tabindex],[role="button"]') };
      });
      measurements.push(m);
      expect(m.copyFirst).toBe(true);
      expect(m.interactive).toBe(false);
      // Aucune version agrandie de l'illustration (Kevin, 07/10/2026).
      expect(m.enlarge).toBe(0);
      expect(m.alt.length).toBeGreaterThan(20);
      expect(m.natural).toEqual([1600, 900]);
      if (width >= 1024) {
        expect(m.image.width).toBeCloseTo(m.copy.width, 0);
        expect(Math.abs((m.image.y + m.image.height / 2) - (m.copy.y + m.copy.height / 2))).toBeLessThan(2);
        if (i % 2 === 0) expect(m.image.right).toBeLessThanOrEqual(m.copy.x + 1);
        else expect(m.copy.right).toBeLessThanOrEqual(m.image.x + 1);
      } else expect(m.copy.bottom).toBeLessThanOrEqual(m.image.y);
    }
    const overflow = await page.locator('#usages, #methode').evaluateAll(sections => sections.flatMap(section =>
      [section, ...section.querySelectorAll('*')].filter(el => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1 || el.scrollWidth > el.clientWidth + 1);
      }).map(el => el.tagName + '.' + el.className)));
    expect(overflow).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await testInfo.attach('geometry', { body: JSON.stringify({ boxes, measurements }), contentType: 'application/json' });
  });
}
