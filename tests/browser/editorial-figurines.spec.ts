import {test,expect} from '@playwright/test';import {SCENES} from '../../src/data/scenes-figurines';
for(const width of [375,768,1440])test(`recette A : six pages lisibles et scènes chargées à ${width}`,async({page,request})=>{
 await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/automatisation-cabinet-comptable');const vert=await page.locator('.hub-signature').evaluate(e=>({fond:getComputedStyle(e).backgroundColor,rayon:getComputedStyle(e).borderRadius,marge:getComputedStyle(e).paddingTop}));
 await page.route('**/api/contact',r=>r.fulfill({status:503,contentType:'application/json',body:'{}'}));
 for(const [id,scene] of Object.entries(SCENES)){
  expect((await page.goto(scene.route))?.status()).toBe(200);await expect(page.locator('h1')).toHaveCount(1);await expect(page.locator('main [data-proof],main video')).toHaveCount(0);
  const bloc=page.locator('[data-editorial-points]');await expect(bloc).toHaveCount(1);await expect(bloc).toHaveCSS('background-color',vert.fond);await expect(bloc).toHaveCSS('border-radius',vert.rayon);await expect(bloc).toHaveCSS('padding-top',vert.marge);
  for(const item of await bloc.locator('li').all())await expect(item).toHaveCSS('background-color','rgba(0, 0, 0, 0)');await expect(bloc.locator('.cellule,.carte,.bande')).toHaveCount(0);
  await bloc.screenshot({path:`.qa/coherence-figurines/vert-${id}-${width}.png`,animations:'disabled'});
  const img=page.locator(`[data-scene="${id}"] img`);await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(page.locator('.catalogue-grille .catalogue-carte')).toHaveCount(3);
  const broken=await page.locator('main a[href^="#"]').evaluateAll(links=>links.map(a=>a.getAttribute('href')!).filter(h=>!document.getElementById(decodeURIComponent(h.slice(1)))));expect(broken).toEqual([]);
  const og=await page.locator('meta[property="og:image"]').getAttribute('content');expect((await request.get(new URL(og!).pathname)).status()).toBe(200);
  await page.screenshot({path:`.qa/coherence-figurines/${id}-a-${width}.png`,fullPage:true,animations:'disabled'});
 }
});
test('recette A : clavier, liens de cartes et ressources natives sans JavaScript',async({browser})=>{
 const c=await browser.newContext({javaScriptEnabled:false,viewport:{width:375,height:900},reducedMotion:'reduce'});const p=await c.newPage();await p.goto('/methode');
 const summary=p.getByText('Voir des exemples de recette par tâche',{exact:true});await summary.focus();await p.keyboard.press('Enter');await expect(p.locator('details').first()).toHaveAttribute('open','');
 await expect(p.locator('a[href="/automatisation/evaluation-transmission"]').first()).toBeVisible();
 const carte=p.locator('.catalogue-carte').first();await carte.focus();await expect(carte).toBeFocused();await expect(carte).toHaveCSS('outline-style','solid');await p.keyboard.press('Enter');await expect(p).toHaveURL(/automatisation-cabinet-comptable$/);
 await p.goto('/contact');await expect(p.locator('form[data-contact]')).toBeVisible();await expect(p.locator('main a[href^="mailto:"]').first()).toBeVisible();await expect(p.locator('#tache_robot')).toHaveValue('');await c.close();
});

for(const route of ['/garanties','/a-propos','/contact'])test(`composition des sections : grilles qui occupent la largeur sur ${route}`,async({page})=>{await page.setViewportSize({width:1440,height:1000});await page.goto(route);const grids=page.locator('[data-editorial-grid]');expect(await grids.count()).toBeGreaterThan(0);for(const grid of await grids.all()){const rects=await grid.locator('article').evaluateAll(nodes=>nodes.map(n=>{const b=n.getBoundingClientRect();return {x:b.x,y:b.y,right:b.right}}));expect(rects.at(-1)!.x).toBeGreaterThan(rects[0].right);expect(Math.abs(rects.at(-1)!.y-rects[0].y)).toBeLessThan(1);await grid.screenshot({path:`.qa/coherence-figurines/grille-${route.slice(1)}-${await grid.locator('h3').first().textContent()}.png`})}});
