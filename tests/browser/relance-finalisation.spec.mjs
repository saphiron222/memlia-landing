import {test,expect} from '@playwright/test';
const route='/outils-comptables-gratuits/generateur-relance-facture-impayee';
const storage=page=>page.evaluate(async()=>({local:{...localStorage},session:{...sessionStorage},cookies:document.cookie,idb:await indexedDB.databases(),caches:await caches.keys(),workers:(await navigator.serviceWorker.getRegistrations()).map(r=>r.scope)}));
test('import, saisie, calcul, copie, export et effacement sans réseau ni persistance',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);
 const response=await page.goto(route);await page.waitForLoadState('networkidle');
 expect(await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content')).toContain("connect-src 'none'");
 if(new URL(response.url()).hostname.endsWith('.pages.dev'))expect(response.headers()['content-security-policy']).toContain("connect-src 'none'");
 expect(await page.content()).not.toMatch(/static\.cloudflareinsights\.com|data-cf-beacon/);
 const before=await storage(page),cookies=await context.cookies();const requests=[],errors=[];
 page.on('request',r=>{if(!r.url().startsWith('blob:'))requests.push(r.url());});page.on('pageerror',e=>errors.push(e.message));
 for(const [id,value] of Object.entries({clientKey:'001',client:'Client fictif',reference:'F-SAISIE',amount:'120',payments:'20',credits:'10',dueDate:'20260901'}))await page.locator(`#rel-${id}`).fill(value);
 await page.locator('#rel-dispute').selectOption('non');await page.getByRole('button',{name:'Ajouter la facture',exact:true}).click();
 await page.locator('#rel-group').check();await page.getByRole('button',{name:'Préparer les relances',exact:true}).click();await expect(page.locator('#rel-message-body')).toHaveValue(/90,00 EUR/);
 await page.locator('summary').filter({hasText:'Importer un CSV'}).click();
 await page.locator('#rel-file').setInputFiles({name:'fictif.csv',mimeType:'text/csv',buffer:Buffer.from('clientKey;client;reference;amount;payments;credits;dueDate;dispute;currency\n001;Client fictif;F-IMPORT;120;20;10;20260901;non;EUR')});
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Lire le CSV',exact:true}).click();await expect(page.locator('#rel-status')).toContainText('1 facture');
 await page.locator('#rel-group').check();await page.locator('#rel-signature').fill('Signature fictive');await page.getByRole('button',{name:'Préparer les relances',exact:true}).click();
 await page.locator('#rel-message-body').fill('Texte fictif relu');await page.getByRole('button',{name:'Copier le message',exact:true}).click();await expect.poll(()=>page.evaluate(()=>navigator.clipboard.readText())).toContain('Texte fictif relu');
 for(const label of ['Exporter tout en texte','Exporter tout en CSV']){const event=page.waitForEvent('download');await page.getByRole('button',{name:label,exact:true}).click();const stream=await(await event).createReadStream();const chunks=[];for await(const c of stream)chunks.push(c);expect(Buffer.concat(chunks).toString()).toContain('Texte fictif relu');}
 await page.getByRole('button',{name:'Effacer la session',exact:true}).click();await expect(page.locator('#rel-message')).toBeHidden();
 expect(await storage(page)).toEqual(before);expect(await context.cookies()).toEqual(cookies);expect(errors).toEqual([]);expect(requests).toEqual([]);
});
test('reflow 400 % équivalent 1280/4, parcours animations et captures complètes',async({page})=>{
 test.setTimeout(120_000);
 for(const width of [320,375,1440]){
  await page.setViewportSize({width,height:width===320?225:900});await page.goto(route);await page.getByRole('button',{name:'Charger l’exemple fictif',exact:true}).click();await page.getByRole('button',{name:'Préparer les relances',exact:true}).click();
  await expect(page.locator('#rel-message-body')).toHaveValue(/90,00 EUR/);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  const height=await page.evaluate(()=>document.documentElement.scrollHeight);
  for(let y=0;y<height;y+=500){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(60);}
  await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0);});await page.waitForTimeout(500);
  await page.screenshot({path:`docs/qa/relance-facture/final-${width}.png`,fullPage:true});
 }
});
