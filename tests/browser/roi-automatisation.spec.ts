import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { ROI_EXAMPLES, buildRoiReport, roiCsv } from '../../src/lib/roi-automatisation.mjs';
const route = '/outils-comptables-gratuits/calculateur-roi-automatisation';
const compare = 'Comparer les trois scénarios';
test('ROI : oracle, comparaison, copie et exports complets, zéro envoi ou stockage', async ({page,context}) => {
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.goto(route);
  await page.waitForLoadState('networkidle');
  const requests:string[] = []; page.on('request',request=>requests.push(request.url()));
  await page.getByRole('button',{name:'Charger trois exemples fictifs'}).click();
  await page.getByRole('button',{name:compare}).click();
  const expected = buildRoiReport(ROI_EXAMPLES);
  const actual = JSON.parse(await page.locator('[data-report]').textContent() ?? '{}');
  expect(actual).toEqual(expected);
  for (const [i,scenario] of expected.scenarios.entries()) {
    for (const value of Object.values(scenario.display)) await expect(page.locator('[data-results] article').nth(i)).toContainText(String(value));
  }
  await page.getByRole('button',{name:'Copier le rapport complet'}).click();
  expect(JSON.parse(await page.evaluate(()=>navigator.clipboard.readText()))).toEqual(expected);
  for (const format of ['CSV','JSON']) {
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button',{name:`Télécharger le ${format}`}).click();
    const download = await downloadPromise;
    const data = readFileSync((await download.path())!,'utf8');
    expect(data).toBe(format === 'CSV' ? roiCsv(expected) : JSON.stringify(expected,null,2));
  }
  expect(requests).toEqual([]);
  expect(await page.evaluate(async()=>({local:localStorage.length,session:sessionStorage.length,cookies:document.cookie,databases:(await indexedDB.databases()).length}))).toEqual({local:0,session:0,cookies:'',databases:0});
});
test('ROI : E inconnu, temps négatif, payback hors horizon, coûts nuls', async ({page}) => {
  await page.goto(route); await page.locator('[data-example]').click();
  await page.locator('#roi-0-E').fill('');
  await page.locator('#roi-1-p').fill('0');
  await page.locator('#roi-1-d').fill('13');
  await page.locator('#roi-2-I').fill('0'); await page.locator('#roi-2-M').fill('0'); await page.locator('#roi-2-E').fill('200');
  await page.getByRole('button',{name:compare}).click();
  const report = JSON.parse(await page.locator('[data-report]').textContent() ?? '{}');
  expect(report.scenarios[0].results.net).toBeNull(); expect(report.scenarios[0].results.capacity).toBeCloseTo(266.6666667);
  expect(report.scenarios[1].results.hours).toBe(-2); expect(report.scenarios[1].results.net).toBe(-1000); expect(report.scenarios[1].results.withinHorizon).toBe(false);
  expect(report.scenarios[2].results.roi).toBeNull(); expect(report.scenarios[2].results.paybackState).toBe('non-applicable');
});
test('ROI : refus sans perte, résultat périmé inaccessible, remplacement consenti et effacement', async ({page}) => {
  await page.goto(route); await page.locator('[data-example]').click(); await page.getByRole('button',{name:compare}).click();
  await page.locator('#roi-0-p').fill('101');
  await expect(page.locator('[data-output]')).toBeHidden();
  await page.getByRole('button',{name:compare}).click();
  await expect(page.locator('[data-error]')).toBeVisible(); await expect(page.locator('#roi-0-p')).toBeFocused();
  await expect(page.locator('#roi-0-p')).toHaveValue('101'); await expect(page.locator('#roi-1-V')).toHaveValue('100');
  page.once('dialog',dialog=>dialog.dismiss()); await page.locator('[data-example]').click();
  await expect(page.locator('#roi-0-p')).toHaveValue('101');
  page.once('dialog',dialog=>dialog.accept()); await page.locator('[data-example]').click();
  await expect(page.locator('#roi-0-p')).toHaveValue('50');
  await page.getByRole('button',{name:'Effacer les hypothèses'}).click();
  await expect(page.locator('#roi-0-p')).toHaveValue(''); await expect(page.locator('[data-output]')).toBeHidden();
  await expect(page.locator('[data-report]')).toHaveText('');
  await expect(page.locator('[data-results] article')).toHaveCount(0);
});
test('ROI : SEO, média propre, sitemap, hub/footer et entrants', async ({page,request}) => {
  const response = await page.goto(route); expect(response?.status()).toBe(200);
  const h1 = 'Calculateur de ROI d’automatisation comptable';
  await expect(page.locator('main h1')).toHaveCount(1); await expect(page.locator('main h1')).toHaveText(h1);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content',h1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',`https://memlia.fr${route}`);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content','/proofs/v2/og/30-outil-roi.webp');
  const schemas = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(text=>JSON.parse(text));
  const graph = schemas.find(schema=>schema['@graph'])['@graph'];
  expect(graph.map((node:Record<string,string>)=>node['@type'])).toEqual(['WebPage','WebApplication','BreadcrumbList']);
  expect(graph[0].headline).toBe(h1);
  await expect(page.locator('[data-official-source] h3')).toHaveText('Formules documentées');
  await page.setViewportSize({width:1440,height:900});
  const zone = await page.locator('.outil-calcul').boundingBox();
  expect(zone?.width).toBeGreaterThan(1000);
  expect((await request.get('/sitemap-0.xml')).status()).toBe(200);
  expect(await (await request.get('/sitemap-0.xml')).text()).toContain(`https://memlia.fr${route}`);
  for (const source of ['/outils-comptables-gratuits','/automatisation-cabinet-comptable','/methode']) {
    await page.goto(source); expect(await page.locator(`main a[href="${route}"]`).count()).toBeGreaterThan(0);
    await expect(page.locator(`footer a[href="${route}"]`)).toHaveCount(1);
  }
});
for (const width of [320,375,768,1024,1440,1920]) test(`ROI : largeur ${width}, clavier et reflow`, async ({page}) => {
  await page.setViewportSize({width,height:900}); await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(route); await page.locator('[data-example]').click(); await page.getByRole('button',{name:compare}).click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('#roi-0-V').focus(); await page.keyboard.press('Tab'); await expect(page.locator('#roi-0-t')).toBeFocused();
  for (const input of await page.locator('[data-roi-form] input').all()) {
    const box = await input.boundingBox(); expect(box?.height).toBeGreaterThanOrEqual(44);
    await expect(input).toHaveAttribute('aria-describedby','roi-hint roi-error');
  }
  if ([375,1440].includes(width)) {
    await page.evaluate(()=>document.querySelectorAll('.rv,.rvl,.rvd').forEach(el=>el.classList.add('vu')));
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.screenshot({path:`.qa/roi-${width}-full.png`,fullPage:true});
  }
});
