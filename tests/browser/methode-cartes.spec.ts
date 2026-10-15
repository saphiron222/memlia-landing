import {test,expect} from '@playwright/test';

for(const width of [375,768,1440])test(`Méthode : cinq petites cartes lisibles à ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:1000});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/methode');
  const cartes=page.locator('#etapes > li');
  await expect(cartes).toHaveCount(5);
  const positions=await cartes.evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}}));
  const colonnes=width===1440?3:width===768?2:1;
  expect(positions.filter(p=>Math.abs(p.y-positions[0].y)<1)).toHaveLength(colonnes);
  expect(Math.max(...positions.map(p=>p.width))-Math.min(...positions.map(p=>p.width))).toBeLessThan(1);
  if(width===1440){expect(positions[3].y).toBe(positions[4].y);expect(positions[3].x).toBeGreaterThan(positions[0].x);expect(Math.max(...positions.map(p=>p.height))).toBeLessThan(330)}
  for(const id of ['observer','cadrer','eprouver','valider','maintenir'])await expect(page.locator(`#${id}`)).toHaveCount(1);
  await expect(page.getByText('Ce que nous vous remettons',{exact:true})).toHaveCount(0);
  await expect(page.locator('main a[href="/automatisation/facture-electronique"]')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.locator('.parcours').screenshot({path:`.qa/coherence-figurines/methode-cartes-${width}.png`,animations:'disabled'});
});

test('Étapes sans JavaScript et scène À propos sans légende',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:375,height:900}});
  const page=await context.newPage();await page.goto('/methode#cadrer');
  await expect(page.locator('#cadrer')).toBeInViewport();
  for(const card of await page.locator('#etapes > li').all())await expect(card).toBeVisible();
  await page.goto('/a-propos');const scene=page.locator('[data-scene="apropos"]');
  await expect(scene.locator('figcaption')).toHaveCount(0);
  await expect(scene.locator('img')).toHaveAttribute('alt',/Deux figurines Memlia/);
  await expect(page.getByText('Nos figurines représentent les tâches que nous construisons et maintenons avec vous.',{exact:true})).toHaveCount(0);
  await page.goto('/garanties');await expect(page.locator('main a[href="/automatisation/facture-electronique"]')).toHaveCount(1);
  await context.close();
});
