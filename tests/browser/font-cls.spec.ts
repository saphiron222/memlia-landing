import { test, expect } from '@playwright/test';

// Chaque famille de repli à métriques ajustées du site et les polices de l'OS qu'elle attend (une liste par variante
// acceptée ; docs/qa/font-cls.md). On sonde l'OS du banc avec des faces indépendantes du site : là où il a les polices
// d'un repli, ce repli doit se charger. Si l'OS a un repli serif et un repli sans, la page doit tenir en place ; sinon
// seules les mesures de saut, qui dépendent de l'OS, sont relevées sans seuil et annoncées « non vérifié ».
const REPLIS = [
  { famille: 'Fraunces Fallback', genre: 'serif', variantes: [['Georgia Bold', 'Georgia Italic', 'Georgia Bold Italic']] },
  { famille: 'Fraunces Fallback Noto', genre: 'serif', variantes: [['Noto Serif Bold', 'Noto Serif Italic', 'Noto Serif Bold Italic']] },
  { famille: 'Fraunces Fallback Liberation', genre: 'serif', variantes: [['Liberation Serif Bold', 'Liberation Serif Italic', 'Liberation Serif Bold Italic'], ['Tinos Bold', 'Tinos Italic', 'Tinos Bold Italic']] },
  { famille: 'Hanken Fallback', genre: 'sans', variantes: [['Arial', 'Arial Bold'], ['Liberation Sans', 'Liberation Sans Bold'], ['Arimo', 'Arimo Bold']] },
  { famille: 'Hanken Fallback Roboto', genre: 'sans', variantes: [['Roboto', 'Roboto Medium', 'Roboto Bold']] },
];
async function etatDesReplis(page: import('@playwright/test').Page) {
  return page.evaluate(async (replis) => {
    let sonde = 0;
    const presente = (nom: string) => new FontFace(`sonde-os-${sonde++}`, `local("${nom}")`).load().then(() => true, () => false);
    return Promise.all(replis.map(async ({ famille, genre, variantes }) => {
      const os = (await Promise.all(variantes.map(async (noms) => (await Promise.all(noms.map(presente))).every(Boolean)))).some(Boolean);
      const poids = genre === 'serif' ? 600 : 400;
      const site = await document.fonts.load(`${poids} 16px "${famille}"`).then((faces) => faces.length > 0, () => false);
      return { famille, genre, os, site };
    }));
  }, REPLIS);
}

const routes = ['/glossaire', '/integrations/bulletin-de-paie-silae', '/integrations/saisie-comptable-sage'];
for (const route of routes) {
  for (const width of [320, 375, 412, 1440]) {
    test(`${route} — delayed fonts at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(() => {
        (window as any).__shifts = [];
        new PerformanceObserver(list => {
          for (const entry of list.getEntries() as any) {
            if (!entry.hadRecentInput) (window as any).__shifts.push({ value: entry.value, time: entry.startTime,
              sources: entry.sources?.map((s: any) => ({ node: s.node?.className, before: s.previousRect, after: s.currentRect })) });
          }
        }).observe({ type: 'layout-shift', buffered: true });
      });
      let release!: () => void;
      const gate = new Promise<void>(resolve => { release = resolve; });
      await page.route('**/fonts/*.woff2', async request => { await gate; await request.continue(); });
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      const replis = await etatDesReplis(page);
      // Là où l'OS a les polices d'un repli, une face supprimée ou mal écrite échoue ici au lieu d'être ignorée.
      for (const repli of replis) if (repli.os) expect(repli.site, `${repli.famille} chargé`).toBe(true);
      const osCompatible = ['serif', 'sans'].every((genre) => replis.some((repli) => repli.genre === genre && repli.os));
      await page.waitForTimeout(1500);
      const anchor = page.locator(route === '/glossaire' ? '.alphabet' : '.page-chapeau');
      const before = await anchor.boundingBox();
      const families = await page.locator('h1').evaluate(el => getComputedStyle(el).fontFamily);
      expect(families.indexOf('Fraunces Fallback')).toBeGreaterThanOrEqual(0);
      for (const repli of REPLIS.filter((r) => r.genre === 'serif')) {
        expect(families.indexOf(repli.famille), repli.famille).toBeGreaterThanOrEqual(0);
        expect(families.indexOf(repli.famille), repli.famille).toBeLessThan(families.indexOf('Georgia'));
      }
      const bodyFamilies = await page.locator('body').evaluate(el => getComputedStyle(el).fontFamily);
      expect(bodyFamilies.indexOf('Hanken Fallback')).toBeGreaterThanOrEqual(0);
      for (const repli of REPLIS.filter((r) => r.genre === 'sans')) {
        expect(bodyFamilies.indexOf(repli.famille), repli.famille).toBeGreaterThanOrEqual(0);
        expect(bodyFamilies.indexOf(repli.famille), repli.famille).toBeLessThan(bodyFamilies.indexOf('system-ui'));
      }
      // Screenshots otherwise wait for document.fonts.ready and deadlock the gate.
      process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY = '1';
      await page.screenshot({ path: testInfo.outputPath('fallback.png') });
      release();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1000);
      await page.screenshot({ path: testInfo.outputPath('settled.png') });
      const after = await anchor.boundingBox();
      const shifts = await page.evaluate(() => (window as any).__shifts);
      await testInfo.attach('layout-shifts', { body: JSON.stringify(shifts, null, 2), contentType: 'application/json' });
      // CLS session windows: max 5s, split after a 1s gap, excluding user input.
      let cls = 0, sum = 0, start = 0, previous = 0;
      for (const shift of shifts) {
        if (shift.time - previous > 1000 || shift.time - start > 5000) { sum = 0; start = shift.time; }
        sum += shift.value; previous = shift.time; cls = Math.max(cls, sum);
      }
      if (osCompatible) {
        expect(cls).toBeLessThanOrEqual(0.1);
        expect(Math.abs(after!.y - before!.y), 'index/chapeau stays in place during font swap').toBeLessThanOrEqual(2);
      } else {
        testInfo.annotations.push({ type: 'non vérifié', description: `aucun repli serif et sans ajusté sur cet OS : CLS ${cls.toFixed(3)} et décalage ${Math.abs(after!.y - before!.y).toFixed(1)} px relevés sans seuil (ticket polices-repli 01)` });
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await expect(page.locator('h1')).toBeVisible();
      if (route === '/glossaire') {
        await expect(page.locator('[data-search]')).toBeVisible();
        await page.locator('[data-search-input]').fill('DSN');
        await expect(page.locator('.glossaire-entree:not([hidden])')).not.toHaveCount(0);
        await expect(page.locator('.glossaire-entree[hidden]')).not.toHaveCount(0);
      }
    });
  }
}

test('glossary reserves the search before JavaScript activation', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/_astro/*.js', async request => { await gate; await request.continue(); });
  await page.goto('/glossaire', { waitUntil: 'commit' });
  await expect(page.locator('.alphabet')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const before = await page.locator('.alphabet').boundingBox();
  release();
  await expect(page.locator('[data-search]')).toBeVisible();
  const after = await page.locator('.alphabet').boundingBox();
  expect(Math.abs(after!.y - before!.y)).toBeLessThanOrEqual(2);
});
