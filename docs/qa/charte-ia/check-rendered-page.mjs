import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
const origin = process.env.QA_URL ?? 'http://127.0.0.1:4330';
const route = '/outils-comptables-gratuits/generateur-charte-ia-cabinet';
const output = '.qa/charte-ia';
const browser = await chromium.launch({ channel: 'chromium' });
try {
  const context = await browser.newContext({ reducedMotion: 'reduce', permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();
  const response = await page.goto(origin + route);
  assert.equal(response.status(), 200);
  const h1 = await page.locator('h1').allTextContents();
  assert.deepEqual(h1, ['Générateur de charte IA du cabinet']);
  assert.equal(await page.locator('meta[property="og:title"]').getAttribute('content'), h1[0]);
  assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://memlia.fr' + route);
  const schema = await page.locator('script[type="application/ld+json"]').allTextContents();
  const nodes = schema.flatMap(text => JSON.parse(text)['@graph'] ?? [JSON.parse(text)]);
  for (const type of ['WebPage', 'WebApplication', 'BreadcrumbList']) assert.ok(nodes.some(node => node['@type'] === type));
  assert.equal(nodes.find(node => node['@type'] === 'WebPage').headline, h1[0]);
  const media = page.locator('[data-tool-media] img');
  assert.equal(await media.getAttribute('width'), '1600');
  assert.equal(await media.getAttribute('height'), '900');
  const title = await page.title();
  const mediaLazy = await media.getAttribute('loading');
  const description = await page.locator('meta[name=description]').getAttribute('content');
  const robots = await context.request.get(origin + '/robots.txt');
  assert.equal(robots.status(), 200); assert.match(await robots.text(), /User-agent: \*/);
  const sitemap = await context.request.get(origin + '/sitemap-0.xml');
  assert.ok((await sitemap.text()).includes('https://memlia.fr' + route));
  const incoming = [];
  for (const path of ['/outils-comptables-gratuits', '/methode', '/garanties']) {
    const html = await (await context.request.get(origin + path)).text();
    assert.ok(html.includes(`href="${route}"`)); incoming.push(path);
  }
  await page.getByRole('link', { name: 'Utiliser l’outil', exact: true }).click();
  assert.equal(await page.locator('#outil-calcul').count(), 1);
  assert.equal(await page.locator('#outil-calcul [data-charter]').count(), 1);
  await page.getByRole('button', { name: 'Charger un exemple fictif', exact: true }).click();
  await page.getByRole('button', { name: 'Préparer la charte', exact: true }).click();
  await page.getByRole('button', { name: 'Copier la charte', exact: true }).click();
  const expected = await page.locator('[data-print]').textContent();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), expected);
  for (const extension of ['md', 'txt']) {
    const event = page.waitForEvent('download');
    await page.getByRole('button', { name: `Exporter .${extension}`, exact: true }).click();
    const download = await event; await download.saveAs(`${output}/charte-exemple.${extension}`);
  }
  const databaseNames = await page.evaluate(async () => (await indexedDB.databases()).map(database => database.name));
  assert.deepEqual(databaseNames, []);
  await page.pdf({ path: `${output}/charte-exemple.pdf`, format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' } });
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(origin + route);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${output}/charte-${width}.png`, fullPage: true });
    await page.goto(origin + '/outils-comptables-gratuits/calculateur-marge-commerciale');
    await page.screenshot({ path: `${output}/voisin-${width}.png`, fullPage: true });
  }
  const result = { checkedAt: new Date().toISOString(), origin, production: origin === 'https://memlia.fr', h1: h1[0], titleCharacters: title.length, descriptionCharacters: description.length, schemaTypes: nodes.map(node => node['@type']), incoming, clipboardMatches: true, exportFormats: ['md', 'txt'], printPdfProduced: true, indexedDB: databaseNames, mediaLazy };
  writeFileSync(`${output}/page-report.json`, JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
} finally { await browser.close(); }
