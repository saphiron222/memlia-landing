import {test,expect} from '@playwright/test';
import {SOURCES_OFFICIELLES,IMPORTS_LOGICIELS} from '../../src/data/sources-robots';
for(const width of [375,1440]){
 test(`figurines : hub enrichi sans changer ses six sections à ${width}`,async({page,request})=>{
  await page.setViewportSize({width,height:1000});await page.goto('/automatisation-cabinet-comptable');
  await expect(page.locator('[data-hub-section]')).toHaveCount(6);
  const sources=page.locator('[data-sources-robots]');await sources.scrollIntoViewIfNeeded();
  await expect(sources.getByRole('heading',{name:'Sources officielles connectées'})).toBeVisible();
  await expect(sources.getByRole('heading',{name:'Import depuis votre logiciel'})).toBeVisible();
  for(const asset of [...SOURCES_OFFICIELLES,...IMPORTS_LOGICIELS]){const img=sources.getByAltText(asset.nom,{exact:true});await expect(img).toBeVisible();await expect.poll(()=>img.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);expect((await request.get(asset.logo)).status()).toBe(200);}
  await expect(sources).not.toContainText(/Bêta|Éprouvé|Par export/);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await sources.screenshot({path:`.qa/coherence-figurines/sources-${width}.png`});
 });
 test(`figurines : atelier et méthode, deux recettes à comparer à ${width}`,async({page,request})=>{
  await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion:'reduce'});
  for(const route of ['/apercu/direction-figurines','/apercu/methode-figurines']){
   expect((await page.goto(route))?.status()).toBe(200);await expect(page.locator('h1')).toHaveCount(1);await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/noindex/);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await expect(page.locator('.pilote-hero img')).toHaveCount(0);await expect(page.locator('.pilote-etapes>li')).toHaveCount(5);
  await page.locator('input[value="b"]').focus();await page.keyboard.press('Space');await expect(page.locator('.pilote-scene-b')).toBeVisible();await expect(page.locator('.pilote-scene-a')).toBeHidden();
  await expect.poll(()=>page.locator('.pilote-scene-b img').evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
  await page.locator('input[value="a"]').focus();await page.keyboard.press('Space');await expect(page.locator('.pilote-scene-a')).toBeVisible();
  await expect(page.locator('input[value="a"] + span')).toHaveCSS('outline-style','solid');
  await expect.poll(()=>page.locator('.pilote-scene-a img').evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
  await page.screenshot({path:`.qa/coherence-figurines/methode-${width}.png`,fullPage:true,animations:'disabled'});
  const map=await request.get('/sitemap-pages.xml');expect(await map.text()).not.toContain('/apercu/');
 });
}
test('figurines : comparaison native sans JavaScript',async({browser})=>{
 const c=await browser.newContext({javaScriptEnabled:false});const p=await c.newPage();await p.goto('/apercu/methode-figurines');await p.locator('input[value="b"]').check({force:true});await expect(p.locator('.pilote-scene-b')).toBeVisible();await expect(p.locator('a[href="/contact"]').first()).toBeVisible();await c.close();
});
