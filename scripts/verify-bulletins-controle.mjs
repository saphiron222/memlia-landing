import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const origin = process.env.MEMLIA_VERIFY_ORIGIN ?? 'http://127.0.0.1:4329';
const production = origin === 'https://memlia.fr';
const published = JSON.parse(readFileSync('commercial/services/bulletins-controle/manifest.json', 'utf8')).status === 'publie';
const recipe = JSON.parse(readFileSync('commercial/recettes/bulletins-controle/recette.json', 'utf8'));
const directory = '.qa/bulletins-controle';
mkdirSync(directory, { recursive: true });
const browser = await chromium.launch({ channel: 'chromium' });
const results = [];
try {
  const page = await browser.newPage({ extraHTTPHeaders: { 'Cache-Control': 'no-cache' } });
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto(`${origin}${recipe.path}`);
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => requestAnimationFrame(r)); }
      window.scrollTo(0, 0);
    });
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal((await page.locator('h1').innerText()).replace(/\s+/g, ' '), recipe.title);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://memlia.fr${recipe.path}`);
    assert.equal(await page.locator('meta[property="og:title"]').getAttribute('content'), recipe.title);
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    assert.equal(robots.includes('noindex'), !published);
    assert.equal(await page.locator('[data-service-section="couverture"]').count(), 1);
    assert.equal(await page.locator('[data-proof="v2/48-service-bulletins-controle"]').count(), 1);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.equal(await page.locator('main a[href="/contact"]').filter({ hasText: 'Confier une première tâche' }).count(), 3);
    for (const image of await page.locator('main img').all()) assert.ok(await image.evaluate((el) => el.complete && el.naturalWidth > 0));
    await page.screenshot({ path: `${directory}/${production ? 'production' : 'preview'}-${width}.png`, fullPage: true, animations: 'disabled' });
    results.push({ width, status: 'PASS' });
  }
  for (const link of recipe.incomingLinks) {
    const response = await page.goto(`${origin}${link.url}`);
    assert.equal(response.status(), 200);
    assert.ok(!(await page.locator('meta[name="robots"]').getAttribute('content')).includes('noindex'));
    assert.equal(await page.locator(`main a[href="${recipe.path}"]`).filter({ hasText: link.anchor }).count(), 1);
  }
  if (published) {
    await page.goto(`${origin}${recipe.path}`);
    assert.ok(await page.locator(`footer a[href="${recipe.path}"]`).count());
    const sitemap = await page.request.get(`${origin}/sitemap-services.xml`);
    assert.equal(sitemap.status(), 200);
    assert.ok((await sitemap.text()).includes(`https://memlia.fr${recipe.path}`));
  }
  writeFileSync(`${directory}/${production ? 'production' : 'preview'}.json`, JSON.stringify({ origin, path: recipe.path, results, incomingLinks: 'PASS' }, null, 2) + '\n');
  console.log(JSON.stringify({ origin, widths: results, incomingLinks: 'PASS' }));
} finally { await browser.close(); }
