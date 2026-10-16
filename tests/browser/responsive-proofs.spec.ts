import { test, expect } from '@playwright/test';

// Scènes éditoriales, figurines des catalogues/fiches et preuves des articles scellés.
// L'outil ROI réel n'ajoute plus de capture décorative dans le corps de sa page.
const routes = ['/', '/contact', '/methode', '/integrations', '/outils-comptables-gratuits', '/agents-ia/paie-social', '/automatisation/cfe', '/blog/logiciel-ia-comptabilite'];
for (const route of routes) for (const width of [375, 1440]) for (const deviceScaleFactor of [1, 2]) {
  test(`preuves responsives ${route} à ${width}px DPR ${deviceScaleFactor}`, async ({ browser, baseURL }) => {
    const measurements = [];
    for (const responsive of [false, true]) {
      const context = await browser.newContext({ baseURL, viewport: { width, height: 900 }, deviceScaleFactor });
      const page = await context.newPage();
      if (!responsive) await page.route('**/*', async handler => {
        if (handler.request().resourceType() !== 'document') return handler.continue();
        const response = await handler.fetch();
        const html = (await response.text()).replace(/\s(?:srcset|sizes|imagesrcset|imagesizes)="[^"]*"/g, '');
        await handler.fulfill({ response, body: html });
      });
      await page.goto(route);
      const editorial = ['/', '/contact', '/methode'].includes(route);
      const figurines = ['/integrations', '/outils-comptables-gratuits', '/agents-ia/paie-social', '/automatisation/cfe'].includes(route);
      const selector = editorial ? '[data-scene] img' : figurines ? '.hub-trio img, .routine-identite img' : 'img[src^="/proofs/"]';
      const images = page.locator(selector);
      expect(await images.count()).toBeGreaterThan(0);
      const selections = [];
      for (const image of await images.all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate((node: HTMLImageElement) => node.decode());
        const selected = await image.evaluate((node: HTMLImageElement) => ({
          src: node.getAttribute('src'), currentSrc: new URL(node.currentSrc).pathname,
          srcset: node.srcset, sizes: node.sizes, width: node.getBoundingClientRect().width,
          naturalWidth: node.naturalWidth,
        }));
        expect(selected.naturalWidth).toBeGreaterThan(0);
        if(editorial){
          if(responsive){expect(selected.currentSrc).toMatch(/\/illustrations\/figurines\/(accueil|contact|methode)-(640|1200)\.(avif|webp)$/);expect(selected.srcset).not.toBe('')}else expect(selected.currentSrc).toBe(selected.src);
        } else if (figurines) {
          expect(selected.width).toBeGreaterThan(0);
          if (responsive) {
            expect(selected.srcset).toContain('128w');
            expect(selected.sizes).toMatch(/^\d+px$/);
            expect(selected.currentSrc).toMatch(/^\/(agents|robots)\/[a-z-]+-(128|256|512)\.(avif|webp)$/);
            const rasterWidth = Number(selected.currentSrc.match(/-(128|256|512)\./)?.[1]);
            expect(rasterWidth).toBeGreaterThanOrEqual(Math.min(selected.width * deviceScaleFactor, 512) - 1);
          } else expect(selected.currentSrc).toBe(selected.src);
          const master = await context.request.get(selected.src!);
          expect(master.status()).toBe(200);
        } else if (responsive) {
          expect(selected.srcset).toContain(`${selected.src} 1600w`);
          expect(selected.sizes).not.toBe('');
          if (width === 375) expect(selected.currentSrc).toMatch(new RegExp(`/responsive/.*-${deviceScaleFactor === 1 ? 400 : 800}\\.webp$`));
          else expect(selected.currentSrc).toMatch(/(?:-(800|1200)\.webp|^\/proofs\/(?!responsive\/).*\.webp)$/);
          const master = await context.request.get(selected.src!);
          expect(master.status()).toBe(200);
        } else expect(selected.currentSrc).toBe(selected.src);
        selections.push(selected);
      }
      const bytes = await page.evaluate((prefix) => (performance.getEntriesByType('resource') as PerformanceResourceTiming[])
        .filter((item: PerformanceResourceTiming) => item.initiatorType === 'img' || item.initiatorType === 'link')
        .filter(item => new URL(item.name).pathname.startsWith(prefix))
        .reduce((sum, item: PerformanceResourceTiming) => sum + item.encodedBodySize, 0),editorial ? '/illustrations/figurines/' : figurines ? (route === '/automatisation/cfe' ? '/robots/' : '/agents/') : '/proofs/');
      measurements.push({ responsive, bytes, selections });
      await context.close();
    }
    console.log(JSON.stringify({ route, width, deviceScaleFactor, measurements }));
    if (width === 375) expect(measurements[1].bytes).toBeLessThan(measurements[0].bytes);
  });
}
