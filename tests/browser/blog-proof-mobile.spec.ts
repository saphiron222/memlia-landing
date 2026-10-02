import { expect, test } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';
import { articles, technicalProofFixtures, requiresRepublicationGate } from './blog-proof-fixture.mjs';

const fixtures = technicalProofFixtures(process.cwd());
const finalRequired = requiresRepublicationGate(
  articles.map(slug => readFileSync(`src/content/blog/${slug}.md`, 'utf8')),
  { remoteUrl: process.env.QA_URL, required: process.env.QA_BLOG_REPUBLICATION_REQUIRED });

for (const width of [320, 375, 1440]) {
  for (const technical of [true, false]) {
  test(`${technical ? 'fixture technique forge/CSS (non publiée)' : 'republication réelle des cinq articles'} à ${width}px`, async ({ page }) => {
    test.skip(!technical && !finalRequired, 'PR technique : corps historiques inchangés ; aucune qualification de republication. Le premier portrait réel ou QA_URL force ce gate complet.');
    await page.setViewportSize({ width, height: 900 });
    const captureDir = `.qa/annotations/blog-proof-mobile/${technical ? 'technical-fixture' : 'republication'}`;
    mkdirSync(captureDir, { recursive: true });
    for (const slug of articles) {
      const response = await page.goto(`/blog/${slug}`);
      expect(response?.status(), slug).toBe(200);
      if (technical) {
        const fixture = fixtures.find(item => item.slug === slug)!;
        // Keep the real Article layout, font, nav, asset server and production
        // CSS. Only this explicitly labelled test DOM is replaced; no file or
        // production content is changed, and no editorial verdict is implied.
        await page.locator('.article-corps').evaluate((el, html) => {
          el.setAttribute('data-qa-technical-fixture', 'true');
          el.innerHTML = html;
        }, fixture.html);
      }
      const figures = page.locator('.article-corps figure[data-blog-proof]');
      await expect(figures, slug).toHaveCount(2);
      for (const [index, figure] of (await figures.all()).entries()) {
        await figure.scrollIntoViewIfNeeded();
        const image = figure.locator(':scope > img');
        await expect(image).toHaveCount(1);
        await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
        const measured = await image.evaluate((img: HTMLImageElement) => {
          const rect = img.getBoundingClientRect();
          return {
            loaded: img.complete && img.naturalWidth > 0,
            selected: new URL(img.currentSrc).pathname,
            width: rect.width,
            height: rect.height,
            figureWidth: img.parentElement!.getBoundingClientRect().width,
            horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
            legacy: Boolean(img.parentElement!.querySelector('figcaption, .preuve-defilante')),
          };
        });
        expect(measured.loaded, slug).toBe(true);
        expect(measured.selected, slug).toMatch(/-mobile\.webp$/);
        expect(measured.width, slug).toBeLessThanOrEqual(measured.figureWidth);
        expect(measured.height, slug).toBeGreaterThan(width < 600 ? 400 : 800);
        expect(measured.legacy, slug).toBe(false);
        // Deux anciens articles débordent déjà à 320 px dans leur CTA, hors figures.
        if (width > 320) expect(measured.horizontalOverflow, slug).toBe(false);
        const navBottom = await page.locator('header').first().evaluate(el => el.getBoundingClientRect().bottom);
        await figure.evaluate((el, clearance) => window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - clearance, behavior: 'instant' }), navBottom + 24);
        await image.evaluate((img: HTMLImageElement) => img.decode());
        const captureTop = await figure.evaluate(el => el.getBoundingClientRect().top);
        expect(captureTop, `${slug}: la nav ne doit pas masquer le début de la preuve`).toBeGreaterThan(navBottom);
        await page.screenshot({ path: `${captureDir}/${slug}-${width}-${index + 1}-top.png`, animations: 'disabled' });
        await figure.evaluate(el => window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().bottom - window.innerHeight + 80, behavior: 'instant' }));
        const captureBottom = await figure.evaluate(el => el.getBoundingClientRect().bottom);
        expect(captureBottom, `${slug}: la fin de la preuve doit apparaître dans la capture basse`).toBeLessThan(page.viewportSize()!.height);
        await page.screenshot({ path: `${captureDir}/${slug}-${width}-${index + 1}-bottom.png`, animations: 'disabled' });
      }
    }
  });
  }
}
