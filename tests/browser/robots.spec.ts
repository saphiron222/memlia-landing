import {test,expect} from '@playwright/test';
import {ROBOTS,ROBOT_CATEGORIES,comptesRobots,cheminRobot,contactsRobots} from '../../src/data/robots';

const hub='/automatisation-cabinet-comptable';
for(const width of [375,768,1440]){
 test(`robots : annuaire, filtres natifs et largeur ${width}`,async({page})=>{
  await page.setViewportSize({width,height:1000});await page.goto(hub);
  await expect(page.locator('[data-hub-section]')).toHaveCount(6);
  await expect(page.locator('.hub-robots > li:visible')).toHaveCount(ROBOTS.length);
  const counts=comptesRobots();
  for(const cat of ROBOT_CATEGORIES){
   const input=page.locator(`input[value="${cat.id}"]`);
   await input.focus();await page.keyboard.press('Space');
   await expect(input).toBeChecked();await expect(page.locator('.hub-robots > li:visible')).toHaveCount(counts[cat.id]);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const radio=page.locator('input[value="tous"]');await radio.focus();await page.keyboard.press('Space');
  await expect(page.locator('.hub-robots > li:visible')).toHaveCount(21);
  await page.screenshot({path:`.qa/hub-robots/hub-${width}.png`,fullPage:true,animations:'disabled'});
 });
}
test('robots : fiches complètes, images, métadonnées et liens réels',async({page,request})=>{
 test.setTimeout(120000);const paths=new Set<string>();
 for(const r of ROBOTS){
  const response=await page.goto(cheminRobot(r));expect(response?.status(),r.id).toBe(200);
  await expect(page.locator('h1')).toHaveText(r.h1);
  await expect(page.locator('[data-robot-section]')).toHaveCount(10);
  await expect(page.locator('[data-robot-demo] tbody tr')).toHaveCount(4);
  await expect(page.locator('[data-decision="Arrêt"]').first()).toContainText(/Motif|raison|car |: /i);
  await expect(page.locator('.routine-faq details')).toHaveCount(r.faq.length);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://memlia.fr'+cheminRobot(r));
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content',/social\/.*\.jpg$/);
  const graph=await page.locator('script[type="application/ld+json"]').evaluateAll(es=>es.flatMap(e=>JSON.parse(e.textContent??'{}')['@graph']??[]));
  expect(graph.some(n=>n['@type']==='Service')).toBe(true);expect(graph.some(n=>['Person','SoftwareApplication','FAQPage'].includes(n['@type']))).toBe(false);
  const links=await page.locator('main a[href^="/"], main img[src^="/"]').evaluateAll(es=>es.map(e=>e.getAttribute(e.tagName==='IMG'?'src':'href')!));
  links.forEach(p=>paths.add(p.split('#')[0]));
 }
 for(const path of paths){const res=await request.get(path);expect(res.status(),path).toBeLessThan(400);}
});
test('robots : mobile, clavier, accordéon natif et mouvement réduit',async({page})=>{
 test.setTimeout(120000);await page.setViewportSize({width:375,height:812});await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto(hub);const card=page.locator('.catalogue-carte').first();await card.hover();
 expect(await card.evaluate(e=>getComputedStyle(e).transitionDuration.split(',').every(v=>parseFloat(v)<=0.001))).toBe(true);await expect(card).toHaveCSS('transform','none');
 for(const r of ROBOTS){await page.goto(cheminRobot(r));expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),r.id).toBe(true);}
 await page.goto('/automatisation/cfe');const summary=page.locator('.routine-faq summary').first();await summary.focus();await page.keyboard.press('Enter');await expect(page.locator('.routine-faq details').first()).toHaveAttribute('open','');
 expect(await summary.evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
 await page.screenshot({path:'.qa/hub-robots/cfe-375.png',fullPage:true,animations:'disabled'});
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'.qa/hub-robots/cfe-1440.png',fullPage:true,animations:'disabled'});
});
test('robots : sans JavaScript, filtres, démonstrations, FAQ et contact restent accessibles',async({browser})=>{
 const c=await browser.newContext({javaScriptEnabled:false});const page=await c.newPage();await page.goto(hub);
 await page.locator('input[value="social"]').check({force:true});await expect(page.locator('.hub-robots > li:visible')).toHaveCount(2);
 await page.goto('/automatisation/cfe');await expect(page.locator('[data-robot-demo] tbody tr')).toHaveCount(4);
 await page.locator('.routine-faq summary').first().click();await expect(page.locator('.routine-faq details').first()).toHaveAttribute('open','');
 await page.locator('[data-tache-robot]').first().click();await expect(page).toHaveURL(/\/contact$/);await expect(page.locator('#tache_robot')).toHaveValue('');await expect(page.locator('#tache_robot')).toBeVisible();
 await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();await c.close();
});
test('robots : présélection facultative, autorisée et consommée une fois',async({page})=>{
 await page.route('**/api/contact',r=>r.fulfill({status:503,body:'{}'}));
 await page.goto('/automatisation/cfe');const id=contactsRobots().find(c=>c.robot==='cfe')!.id;
 await page.locator('[data-tache-robot]').first().click();await expect(page).toHaveURL(/\/contact$/);await expect(page.locator('#tache_robot')).toHaveValue(id);
 expect(await page.evaluate(()=>sessionStorage.getItem('memlia-tache'))).toBe(null);await page.reload();await expect(page.locator('#tache_robot')).toHaveValue('');
 await page.evaluate(()=>sessionStorage.setItem('memlia-tache','inconnu'));await page.reload();await expect(page.locator('#tache_robot')).toHaveValue('');
});
test('robots : le lien de contact survit au stockage bloqué',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(window,'sessionStorage',{get(){throw new DOMException('Bloqué','SecurityError')}})});
 await page.route('**/api/contact',r=>r.fulfill({status:503,body:'{}'}));
 await page.goto('/automatisation/cfe');await page.locator('[data-tache-robot]').first().click();await expect(page).toHaveURL(/\/contact$/);await expect(page.locator('#tache_robot')).toHaveValue('');
});
test('robots : démonstrations sans requête externe, sitemap et destinations historiques préservés',async({page,request,baseURL})=>{
 test.setTimeout(120000);const external:string[]=[];
 page.on('request',r=>{if(new URL(r.url()).origin!==new URL(baseURL!).origin)external.push(r.url());});
 for(const path of [hub,...ROBOTS.map(cheminRobot)]){
  const response=await page.goto(path);expect(response?.status()).toBe(200);
  expect(await response!.text()).not.toMatch(/<script[^>]+src=["']https:\/\/static\.cloudflareinsights\.com/);
  if(baseURL?.includes('.pages.dev')){
   expect(response!.headers()['content-security-policy']).toContain("connect-src 'none'");
   await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex, nofollow');
  }
 }
 expect(external).toEqual([]);
 const sitemap=await request.get('/sitemap-services.xml');const xml=await sitemap.text();for(const r of ROBOTS)expect(xml).toContain('https://memlia.fr'+cheminRobot(r));
 for(const slug of ['bulletins-controle','circularisation-cac','entrees-sorties-salaries','evaluation-transmission','facture-electronique','factures-fournisseurs','notes-de-frais','paie','rapprochement-bancaire','registres-obligations','saisie-comptable','secretariat-juridique']){
  const res=await request.get('/automatisation/'+slug);expect(res.status(),slug).toBe(200);expect(await res.text()).toContain('data-service-layout="da-v1"');
 }
});
