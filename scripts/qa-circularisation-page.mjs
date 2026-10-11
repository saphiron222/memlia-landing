import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const origin = process.env.QA_ORIGIN ?? 'http://127.0.0.1:4328';
const dir = process.env.QA_OUTPUT_DIR ?? 'docs/qa/circularisation-cac';
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ channel: 'chromium' });
const reports = [];
async function reveal(page) {
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(1000);
}
try {
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ 'Cache-Control': 'no-cache' });
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 960 });
    const response = await page.goto(`${origin}/automatisation/circularisation-cac`);
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    const observation = await page.evaluate(() => {
      const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((el) => JSON.parse(el.textContent)['@graph'] ?? []);
      const source = [...document.querySelectorAll('.service-body-copy p')].find((el) => el.textContent.startsWith('Références :'));
      const cta = document.querySelector('#confier');
      return {
        width: window.innerWidth,
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        h1: [...document.querySelectorAll('h1')].map((el) => el.textContent),
        canonical: document.querySelector('[rel="canonical"]').href,
        audience: schemas.find((node) => node['@type'] === 'Service').audience.audienceType,
        types: schemas.map((node) => node['@type']),
        proof: document.querySelector('[data-proof]').getAttribute('data-proof'),
        sourcesBeforeCta: source.getBoundingClientRect().bottom <= cta.getBoundingClientRect().top,
      };
    });
    assert.equal(observation.overflow, false, `débordement ${width}`);
    assert.equal(observation.h1.length, 1);
    assert.equal(observation.canonical, 'https://memlia.fr/automatisation/circularisation-cac');
    assert.equal(observation.audience, 'Cabinets de commissariat aux comptes');
    assert.equal(observation.proof, 'v2/44-service-circularisation-cac');
    assert.equal(observation.sourcesBeforeCta, true, `sources/CTA ${width}`);
    for (const type of ['WebPage', 'Service', 'BreadcrumbList', 'Organization', 'WebSite', 'Person']) assert.ok(observation.types.includes(type));
    await reveal(page);
    assert.equal(await page.locator('.service-body-copy').evaluate((el) => Number(getComputedStyle(el).opacity)), 1, `corps visible ${width}`);
    if ([375, 1440].includes(width)) await page.screenshot({ path: `${dir}/page-${width}.png`, fullPage: true, animations: 'disabled' });
    reports.push(observation);
  }
  for (const route of ['/automatisation/paie', '/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier']) {
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: 960 });
      await page.goto(`${origin}${route}`);
      await reveal(page);
      await page.screenshot({ path: `${dir}/${route.includes('/blog/') ? 'reference-blog' : 'reference-service'}-${width}.png`, fullPage: true, animations: 'disabled' });
    }
  }
  for (const route of ['/methode', '/garanties', '/outils-comptables-gratuits/suivi-circularisation']) {
    await page.goto(`${origin}${route}`);
    assert.ok(await page.locator('main a[href="/automatisation/circularisation-cac"]').filter({ hasText: 'Automatiser la circularisation' }).count(), route);
    assert.ok(!((await page.locator('meta[name="robots"]').getAttribute('content')) ?? '').includes('noindex'), route);
  }
  writeFileSync(`${dir}/responsive.json`, `${JSON.stringify({ origin, reports, incoming: 3 }, null, 2)}\n`);
  console.log('PASS : six largeurs, sources séparées du CTA, audience CAC et trois liens indexables.');
} finally { await browser.close(); }
