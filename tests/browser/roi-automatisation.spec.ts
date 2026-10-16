import {test,expect} from '@playwright/test';
const route='/outils-comptables-gratuits/calculateur-roi-automatisation';
for(const mode of ['disabled','blocked'] as const)test(`ROI : scripts ${mode}, aucune soumission ni perte`,async({browser,baseURL})=>{
 const context=await browser.newContext({baseURL,javaScriptEnabled:mode!=='disabled',reducedMotion:'reduce'});
 if(mode==='blocked')await context.route('**/*',r=>r.request().resourceType()==='script'?r.abort():r.continue());
 const page=await context.newPage();try{await page.goto(route);await page.waitForLoadState('networkidle');const url=page.url(),requests:string[]=[];page.on('request',r=>requests.push(r.url()));
 await page.locator('#budget-heures').fill('12.5');await page.locator('#budget-cout').fill('35');await page.locator('#budget-mensuel').fill('150');await page.getByRole('button',{name:'Calculer mon estimation'}).click();await page.locator('#budget-mensuel').press('Enter');expect(page.url()).toBe(url);expect(requests).toEqual([]);await expect(page.locator('#budget-heures')).toHaveValue('12.5');await expect(page.locator('[data-budget-result]')).toBeHidden();}finally{await context.close();}
});
test('ROI : oracle, coût initial facultatif, copie exacte et aucun stockage',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);await page.goto(route);await page.waitForLoadState('networkidle');
 const requests:string[]=[];page.on('request',r=>requests.push(r.url()));await page.locator('#budget-mensuel').fill('100');await page.getByRole('button',{name:'Calculer mon estimation'}).click();
 await expect(page.locator('[data-result-hours]')).toHaveText('120 h');await expect(page.locator('[data-result-net]')).toHaveText(/3.?600/);
 await page.getByText('Ajouter un coût de mise en service',{exact:true}).click();await page.locator('#budget-setup').fill('500');await page.getByRole('button',{name:'Calculer mon estimation'}).click();await expect(page.locator('[data-first-year]')).toHaveText(/3.?100/);
 await page.getByRole('button',{name:'Copier mon estimation'}).click();const copy=await page.evaluate(()=>navigator.clipboard.readText());expect(copy).toContain('500 € HT');expect(copy).toContain('pas une économie de trésorerie garantie');expect(copy).not.toMatch(/Socle|crédits|agent/);expect(requests).toEqual([]);expect(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length,cookies:document.cookie}))).toEqual({local:0,session:0,cookies:''});
});
test('ROI : erreur ciblée sans perte, résultat périmé masqué, zéro et négatif explicites',async({page})=>{
 await page.goto(route);await page.locator('#budget-mensuel').fill('100');await page.getByRole('button',{name:'Calculer mon estimation'}).click();await page.locator('#budget-heures').fill('-1');await expect(page.locator('[data-budget-result]')).toBeHidden();await page.getByRole('button',{name:'Calculer mon estimation'}).click();await expect(page.locator('[data-budget-error]')).toBeVisible();await expect(page.locator('#budget-heures')).toBeFocused();await expect(page.locator('#budget-mensuel')).toHaveValue('100');
 await page.locator('#budget-heures').fill('1');await page.getByRole('button',{name:'Calculer mon estimation'}).click();await expect(page.locator('[data-result-net]')).toHaveText(/-/);await page.locator('#budget-mensuel').fill('0');await page.getByRole('button',{name:'Calculer mon estimation'}).click();await expect(page.locator('[data-result-roi]')).toContainText('non calculable');
});
test('ROI : SEO, média propre, sitemap, hub/footer et entrants', async ({page,request}) => {
  const response = await page.goto(route);  expect(response?.status()).toBe(200);
  const h1 = 'Calculateur de ROI d’automatisation comptable';
  await expect(page.locator('main h1')).toHaveCount(1); await expect(page.locator('main h1')).toHaveText(h1);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content',h1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',`https://memlia.fr${route}`);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content','https://memlia.fr/social/outils/social/calculateur-roi-automatisation.webp.jpg');
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content','https://memlia.fr/social/outils/social/calculateur-roi-automatisation.webp.jpg');
  const schemas = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(text=>JSON.parse(text));
  const graph = schemas.find(schema=>schema['@graph'])['@graph'];
  expect(graph.map((node:Record<string,string>)=>node['@type'])).toEqual(['WebPage','WebApplication','BreadcrumbList']);
  expect(graph[0].headline).toBe(h1);
  await expect(page.locator('[data-official-source] h3')).toHaveText('Formules documentées');
  await page.setViewportSize({width:1440,height:900});
  const zone = await page.locator('.outil-calcul').boundingBox();
  expect(zone?.width).toBeGreaterThan(1000);
  expect((await request.get('/sitemap-outils.xml')).status()).toBe(200);
  expect(await (await request.get('/sitemap-outils.xml')).text()).toContain(`https://memlia.fr${route}`);
  for (const source of ['/outils-comptables-gratuits','/automatisation-cabinet-comptable','/agents-ia','/methode']) {
    await page.goto(source);  expect(await page.locator(`main a[href="${route}"]`).count()).toBeGreaterThan(0);
    await expect(page.locator('footer a[href="/outils-comptables-gratuits"]')).toHaveCount(1);
  }
});

for(const width of [320,375,768,1024,1440,1920])test(`ROI : trois champs, clavier et reflow à ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.goto(route);await expect(page.locator('[data-budget-form] input:visible')).toHaveCount(3);await page.locator('#budget-heures').focus();await page.keyboard.press('Tab');await expect(page.locator('#budget-cout')).toBeFocused();await page.locator('#budget-mensuel').fill('100');await page.getByRole('button',{name:'Calculer mon estimation'}).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);for(const input of await page.locator('[data-budget-form] input:visible').all())expect((await input.boundingBox())!.height).toBeGreaterThanOrEqual(44);
});
