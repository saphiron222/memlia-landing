import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import {OUTILS_VITRINE} from '../../src/data/outils-vitrine';
const hub='/outils-comptables-gratuits';
test.use({reducedMotion:'reduce'});
test('catalogue : six essentiels et 21 outils uniques, filtres natifs sans JavaScript',async({browser,baseURL})=>{
 expect(new Set(OUTILS_VITRINE.map(o=>o.slug)).size).toBe(21);
 const context=await browser.newContext({baseURL,javaScriptEnabled:false});const page=await context.newPage();
 try{await page.goto(hub);await expect(page.locator('[data-outil-card]:visible')).toHaveCount(6);
 await page.getByRole('radio',{name:'Tous (21)'}).check();await expect(page.locator('[data-outil-card]:visible')).toHaveCount(21);
 await page.getByRole('radio',{name:'Faire un calcul (6)'}).check();await expect(page.locator('[data-outil-card]:visible')).toHaveCount(6);
 await page.getByRole('radio',{name:'Préparer un dossier (9)'}).focus();await page.keyboard.press('Space');await expect(page.locator('[data-outil-card]:visible')).toHaveCount(9);
 await page.keyboard.press('Tab');await expect(page.locator('[data-outil-card]:visible a').first()).toBeFocused();
 }finally{await context.close();}
});
for(const width of [375,1440])test(`les 21 outils : page initiale compacte et sans débordement à ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});const failures:string[]=[];page.on('pageerror',error=>failures.push(error.message));
 mkdirSync('.qa/outils-simples/screens',{recursive:true});
 for(const o of OUTILS_VITRINE){
  const r=await page.goto(`${hub}/${o.slug}`);expect(r?.status(),o.slug).toBe(200);await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('main h1')).toHaveCount(1);await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',`https://memlia.fr${hub}/${o.slug}`);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),o.slug).toBe(true);
  const first=await page.locator('.outil-calcul').evaluate(zone=>[...zone.querySelectorAll('input,select,textarea')].map(el=>el.getBoundingClientRect()).find(r=>r.width&&r.height)?.bottom);
  expect(first,`${o.slug} : première saisie`).toBeLessThan(900);
  await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute('content',/form-action 'none'/);
  await page.screenshot({path:`.qa/outils-simples/screens/${o.slug}-${width}.png`,animations:'disabled'});
 }
 expect(failures).toEqual([]);
 await page.goto(hub);await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`.qa/outils-simples/screens/hub-${width}.png`,fullPage:true});
});
test('simulateur court : tarifs, profils de dossiers, dépassement, valeurs négatives et copie',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);await page.goto(`${hub}/calculateur-roi-automatisation`);await page.waitForLoadState('networkidle');
 const sent:string[]=[];page.on('request',r=>sent.push(r.url()));
 await page.getByRole('button',{name:'Calculer mon estimation',exact:true}).click();await expect(page.locator('[data-result-price]')).toHaveText(/600,00.*an/);await expect(page.locator('[data-first-year]')).toContainText('à chiffrer');
 await page.locator('#budget-offre').selectOption('comptabilite');await expect(page.locator('[data-budget-result]')).toBeHidden();await expect(page.locator('#budget-dossiers')).toHaveValue('20');
 await page.getByRole('button',{name:'Calculer mon estimation',exact:true}).click();await expect(page.locator('[data-price-detail]')).toContainText('548,00');await expect(page.locator('[data-credit-detail]')).toContainText('20 dossiers ou lots');await expect(page.locator('[data-first-year]')).toContainText('8 566,00');
 await page.getByText('Adapter les temps et la mise en service',{exact:true}).click();await page.locator('#budget-profil').selectOption('courant');await page.locator('#budget-dossiers').fill('10');await page.locator('#budget-manuel').fill('10');await page.locator('#budget-controle').fill('20');await page.getByRole('button',{name:'Calculer mon estimation',exact:true}).click();
 await expect(page.locator('[data-credit-detail]')).toContainText('39,00');await expect(page.locator('[data-result-net]')).toHaveText(/-/);
 await page.getByRole('button',{name:'Copier mon estimation',exact:true}).click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('uniquement si autorisé');expect(sent).toEqual([]);
});
for(const enabled of [true,false])test(`aucune saisie envoyée par un formulaire, JavaScript ${enabled}`,async({browser,baseURL})=>{
 const context=await browser.newContext({baseURL,javaScriptEnabled:enabled,reducedMotion:'reduce'});const page=await context.newPage();
 try{await page.goto(`${hub}/calculateur-marge-commerciale`);await page.waitForLoadState('networkidle');const url=page.url();const sent:string[]=[];page.on('request',r=>sent.push(r.url()));
 await page.getByLabel('Prix d’achat HT').fill('12345');await page.getByLabel('Prix de vente HT').fill('23456');await page.getByLabel('Prix de vente HT').press('Enter',{noWaitAfter:true});
 await new Promise(resolve=>setTimeout(resolve,150));expect(page.url()).toBe(url);expect(sent).toEqual([]);await expect(page.getByLabel('Prix d’achat HT')).toHaveValue('12345');
 }finally{await context.close();}
});
test('réglage erroné replié : ouverture et focus conservés',async({page})=>{
 await page.goto(`${hub}/modele-rapprochement-bancaire-excel-gratuit`);await page.getByRole('button',{name:'Charger un exemple fictif',exact:true}).click();
 const details=page.locator('[data-outil-options]');await details.locator('summary').click();await page.getByLabel('Intérêts à comptabiliser').fill('texte');await details.locator('summary').click();await page.getByRole('button',{name:'Contrôler les soldes'}).click();await expect(details).toHaveAttribute('open','');await expect(page.getByLabel('Intérêts à comptabiliser')).toBeFocused();
});
for(const route of ['/', '/agents-ia/comptabilite','/automatisation/cfe'])test(`repères collants et limités à leur section : ${route}`,async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto(route);await page.evaluate(()=>document.fonts.ready);
 const selectors=route==='/'?['.faq-rail']:['.routine-faq > .tete','.routine-outils'];
 for(const selector of selectors){const rail=page.locator(selector);await expect(rail).toHaveAttribute('data-sticky-rail','');
 const measurements=await rail.evaluate(el=>{const r=el.getBoundingClientRect(),p=el.parentElement!.getBoundingClientRect();return {y:p.top+scrollY,h:p.height,rh:r.height,top:parseFloat(getComputedStyle(el).top)};});
 const target=measurements.y+Math.min(200,(measurements.h-measurements.rh)/2);
 await page.evaluate(y=>scrollTo(0,y),target);await expect(rail).toHaveCSS('position','sticky');
 const box=await rail.boundingBox();expect(box!.y).toBeCloseTo(measurements.top,0);
 await page.evaluate(y=>scrollTo(0,y),measurements.y+measurements.h);const after=await rail.boundingBox();expect(after!.y+after!.height).toBeLessThanOrEqual(2);
 await page.evaluate(()=>scrollTo(0,0));
 }
 await page.setViewportSize({width:375,height:812});for(const selector of selectors)await expect(page.locator(selector)).not.toHaveCSS('position','sticky');
});
