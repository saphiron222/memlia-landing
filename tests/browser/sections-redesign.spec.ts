import { test, expect } from '@playwright/test';

const titles = ['Collecter et préparer', 'Contrôler et signaler', 'Rapprocher et synthétiser', 'Suivre un processus', 'Préparer une décision'];

// Système de page du 07/10/2026 : les cinq usages sont des lignes (un terme, sa définition), plus
// des cartes ; les quatre étapes de la méthode vont deux par deux dès 1 024 px, texte au-dessus de
// la maquette, maquettes alignées d'une colonne à l'autre, jamais en quinconce.
for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`capacités en lignes et méthode deux par deux à ${width}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const uses = page.locator('#usages');
    await expect(uses.locator('h3')).toHaveText(titles);
    await expect(uses.locator('dl, dt, dd, table, small, .chip, .carte')).toHaveCount(0);
    await expect(uses).not.toContainText('Exemples non contractuels');
    await expect(uses).not.toContainText('Exemple de parcours');
    const lignes = uses.locator('[data-usage]');
    await expect(lignes).toHaveCount(5);
    const boxes = await lignes.evaluateAll(elements => elements.map(el => ({
      ligne: el.getBoundingClientRect().toJSON(),
      terme: el.querySelector('h3')!.getBoundingClientRect().toJSON(),
      definition: el.querySelector('p')!.getBoundingClientRect().toJSON(),
    })));
    // Une ligne par rangée, de haut en bas.
    for (let i = 1; i < boxes.length; i++) expect(boxes[i].ligne.y).toBeGreaterThanOrEqual(boxes[i - 1].ligne.bottom - 1);
    for (const b of boxes) {
      if (width >= 768) {
        // Le terme à gauche, la définition à droite, sur la même rangée.
        expect(b.terme.right).toBeLessThanOrEqual(b.definition.x + 1);
        expect(Math.abs(b.terme.y - b.definition.y)).toBeLessThan(12);
      } else expect(b.definition.y).toBeGreaterThanOrEqual(b.terme.bottom - 1);
    }
    // Toutes les définitions commencent sur la même verticale.
    expect(Math.max(...boxes.map(b => b.definition.x)) - Math.min(...boxes.map(b => b.definition.x))).toBeLessThanOrEqual(1);

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
        const frame = img.closest('.proof-media')!;
        // Coordonnées du document : chaque étape est mesurée après son propre défilement.
        const boite = (e: Element) => {
          const r = e.getBoundingClientRect();
          return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height,
            right: r.right + scrollX, bottom: r.bottom + scrollY };
        };
        return { step: boite(el), copy: boite(copy), image: boite(img), frame: boite(frame),
          framed: frame.classList.contains('cadre'),
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
      expect(m.framed).toBe(true);
      expect(m.alt.length).toBeGreaterThan(20);
      expect(m.natural).toEqual([1600, 900]);
      // Le texte de l'étape, puis sa maquette encadrée, sur toute la largeur de l'étape.
      expect(m.copy.bottom).toBeLessThanOrEqual(m.image.y + 1);
      expect(Math.abs(m.frame.width - m.step.width)).toBeLessThanOrEqual(1);
    }
    if (width >= 1024) {
      // Deux étapes par rangée, côte à côte ; maquettes alignées dans chaque rangée ; aucune quinconce.
      for (const [a, b] of [[0, 1], [2, 3]]) {
        expect(measurements[a].step.right).toBeLessThanOrEqual(measurements[b].step.x + 1);
        expect(Math.abs(measurements[a].copy.y - measurements[b].copy.y)).toBeLessThanOrEqual(1);
        expect(Math.abs(measurements[a].image.y - measurements[b].image.y)).toBeLessThanOrEqual(1);
      }
      expect(measurements[2].step.y).toBeGreaterThanOrEqual(measurements[0].frame.bottom);
      expect(Math.abs(measurements[0].step.x - measurements[2].step.x)).toBeLessThanOrEqual(1);
    } else {
      for (let i = 1; i < 4; i++) expect(measurements[i].step.y).toBeGreaterThanOrEqual(measurements[i - 1].frame.bottom);
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
