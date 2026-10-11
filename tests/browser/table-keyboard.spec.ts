import { test, expect, type Locator, type Page } from '@playwright/test';
import { createRequire } from 'node:module';
import routes from './table-keyboard.routes.json' with { type: 'json' };

const require = createRequire(import.meta.url);
async function waitForTabScroll(page: Page) {
  const settled = await page.evaluate(async () => {
    const active = document.activeElement;
    const ancestors: Element[] = [];
    for (let el = active; el; el = el.parentElement) ancestors.push(el);
    const position = () => {
      const box = active?.getBoundingClientRect();
      return [window.scrollX, window.scrollY, box?.top ?? 0, box?.left ?? 0,
        ...ancestors.flatMap(el => [el.scrollLeft, el.scrollTop])];
    };
    const start = performance.now();
    let lastMovement = start;
    let previous = position();
    // A fixed/sticky target can stand still while its document keeps moving.
    // Observe the viewport and nested scroll containers over consecutive frames,
    // including the delayed start of a native keyboard smooth scroll.
    while (performance.now() - start < 15_000) {
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      const next = position();
      if (next.some((value, index) => Math.abs(value - previous[index]) >= 0.5)) lastMovement = performance.now();
      previous = next;
      if (performance.now() - start >= 750 && performance.now() - lastMovement >= 350) {
        return active === document.activeElement;
      }
    }
    return false;
  });
  expect(settled, 'Défilement natif du viewport et des ancêtres terminé avant la touche suivante').toBe(true);
}
async function hasRenderedFocus(region: Locator) {
  return region.evaluate(async el => {
    const style = getComputedStyle(el);
    if (el !== document.activeElement || style.outlineStyle !== 'solid' || parseFloat(style.outlineWidth) < 3) return 'outline';
    let opacity = 1;
    for (let ancestor: Element | null = el; ancestor; ancestor = ancestor.parentElement) {
      const rendered = getComputedStyle(ancestor);
      opacity *= parseFloat(rendered.opacity);
      if (rendered.visibility !== 'visible' || rendered.display === 'none') return 'hidden';
    }
    if (opacity < 0.99) return 'transparent';
    const box = el.getBoundingClientRect();
    if (Math.min(box.right, innerWidth) - Math.max(box.left, 0) < 24 ||
        Math.min(box.bottom, innerHeight) - Math.max(box.top, 0) < 24) return `offscreen: ${box.x},${box.y},${box.width},${box.height}`;
    // Tab triggers smooth scrolling/reveal animations. Observe their end rather
    // than overriding production CSS or moving focus with the test API.
    await new Promise<void>(resolve => setTimeout(resolve, 250));
    const settled = el.getBoundingClientRect();
    return Math.abs(settled.top - box.top) < 0.5 && Math.abs(settled.left - box.left) < 0.5 ? 'visible' : 'moving';
  });
}

test('attente clavier observe aussi le scroll du document derrière une cible fixe', async ({ page }) => {
  await page.setContent('<style>html { scroll-behavior:smooth }</style><button style="position:fixed;top:0">Cible fixe</button><div style="height:12000px"></div>');
  await page.keyboard.press('Tab');
  // Do not let the fixture's initial native focus scroll cancel its own probe.
  await waitForTabScroll(page);
  await page.evaluate(() => window.scrollTo({ top: 6000, behavior: 'smooth' }));
  await waitForTabScroll(page);
  expect(await page.evaluate(() => window.scrollY)).toBe(6000);
});

for (const hiddenBy of ['opacity', 'viewport']) {
  test(`oracle de focus refuse ${hiddenBy}`, async ({ page }) => {
    await page.setContent(`<div style="${hiddenBy === 'opacity' ? 'opacity:0' : 'position:absolute;top:2000px'}"><div tabindex="0" style="outline:3px solid green;width:200px;height:100px">Tableau</div></div>`);
    await page.keyboard.press('Tab');
    const region = page.locator('[tabindex]');
    await expect(region).toBeFocused();
    if (hiddenBy === 'viewport') await page.evaluate(() => window.scrollTo(0, 0));
    expect(await hasRenderedFocus(region)).not.toBe('visible');
  });
}

for (const width of [320, 375, 1440]) {
  for (const route of routes) {
    test(`${width}px ${route}: tableaux accessibles au clavier`, async ({ page }, testInfo) => {
      test.setTimeout(180_000);
      await page.setViewportSize({ width, height: 900 });
      expect((await page.goto(route))?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      const tables = page.locator('.article-corps table, .service-body-copy table');
      expect(await tables.count()).toBeGreaterThan(0);
      for (let i = 0; i < await tables.count(); i++) {
        const table = tables.nth(i);
        const region = table.locator('..');
        await expect(region).toHaveAttribute('role', 'region');
        await expect(region).toHaveAttribute('tabindex', '0');
        await expect(region).toHaveAttribute('aria-label', /Tableau .+/);
        for (let step = 0; step < 150; step++) {
          if (await region.evaluate(el => el === document.activeElement)) break;
          await page.keyboard.press('Tab', { delay: 50 });
          await waitForTabScroll(page);
        }
        await expect(region).toBeFocused();
        await expect.poll(() => hasRenderedFocus(region), { timeout: 15_000, message: 'Focus visible dans le viewport, ancêtres opaques et défilement stabilisé' }).toBe('visible');
        expect(await region.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid');
        expect(await region.evaluate(el => parseFloat(getComputedStyle(el).outlineWidth))).toBeGreaterThanOrEqual(3);
        const max = await region.evaluate(el => el.scrollWidth - el.clientWidth);
        if (max > 1) {
          await page.keyboard.press('ArrowRight');
          await expect.poll(() => region.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
          for (let step = 0; step < 80; step++) {
            await page.keyboard.press('ArrowRight');
            if (await region.evaluate(el => el.scrollLeft >= el.scrollWidth - el.clientWidth - 1)) break;
          }
          await expect.poll(() => region.evaluate(el => el.scrollWidth - el.clientWidth - el.scrollLeft)).toBeLessThanOrEqual(1);
          const lastCell = table.locator('tr').first().locator('th, td').last();
          expect(await lastCell.evaluate(el => {
            const cell = el.getBoundingClientRect();
            const box = el.closest('[data-table-scroll]')!.getBoundingClientRect();
            return cell.right <= box.right + 1 && cell.left < box.right;
          })).toBe(true);
          await page.keyboard.press('ArrowLeft');
          await expect.poll(() => region.evaluate(el => el.scrollLeft)).toBeLessThan(max);
        }
        if (i === 0) {
          await expect.poll(() => hasRenderedFocus(region), { timeout: 15_000 }).toBe('visible');
          await page.screenshot({ path: testInfo.outputPath('table-focus.png') });
        }
        await page.keyboard.press('Tab');
        await expect(region).not.toBeFocused();
        await waitForTabScroll(page);
        await page.keyboard.press('Shift+Tab');
        await expect(region).toBeFocused();
        await waitForTabScroll(page);
        await expect.poll(() => hasRenderedFocus(region), { timeout: 15_000 }).toBe('visible');
        await testInfo.attach(`table-${i + 1}-return.json`, { body: JSON.stringify(await region.evaluate(el => {
          const box = el.getBoundingClientRect();
          return { scrollY, x: box.x, y: box.y, width: box.width, height: box.height, viewport: { width: innerWidth, height: innerHeight } };
        })), contentType: 'application/json' });
        if (i === 0) await page.screenshot({ path: testInfo.outputPath('table-return.png') });
        await page.keyboard.press('Tab');
        await waitForTabScroll(page);
      }
      await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
      const violations = await page.evaluate(async () => {
        return (await (window as any).axe.run(document, { runOnly: ['scrollable-region-focusable'] })).violations;
      });
      expect(violations).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    });
  }
}
