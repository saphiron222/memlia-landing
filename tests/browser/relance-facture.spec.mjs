import {test,expect} from '@playwright/test';
const route='/outils-comptables-gratuits/generateur-relance-facture-impayee';
async function demo(page){await page.goto(route);await page.getByRole('button',{name:'Charger l’exemple fictif',exact:true}).click();await page.getByRole('button',{name:'Préparer les relances',exact:true}).click();await expect(page.locator('#rel-message-body')).toHaveValue(/90,00 EUR/);}
for(const [width,height] of [[320,900],[375,900],[768,900],[1024,900],[1440,900],[1920,900],[320,225]]) test(`import et refus CSV sans débordement global ${width}x${height}`,async({page})=>{
 await page.setViewportSize({width,height});await demo(page);await page.locator('summary').filter({hasText:'Importer un CSV'}).click();
 await expect(page.locator('details').filter({has:page.locator('[data-rel-import]')}).locator('p')).toContainText('clientKey;client;reference;amount;payments;credits;dueDate;dispute;currency');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.locator('#rel-file').setInputFiles({name:'refus.csv',mimeType:'text/csv',buffer:Buffer.from('clientKey;client\n001;Fictif')});
 await page.getByRole('button',{name:'Lire le CSV',exact:true}).click();await expect(page.locator('#rel-error')).toContainText('En-têtes requis');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await expect(page.locator('#rel-message-body')).toHaveValue(/90,00 EUR/);
 const table=page.locator('.table-scroll');await table.focus();await page.keyboard.press('End');
 if(width<=375)expect(await table.evaluate(el=>el.scrollWidth>el.clientWidth)).toBe(true);
});
test('édition, copie et exports complets ; aucune requête ni stockage après chargement',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);await page.goto(route);await page.waitForLoadState('networkidle');const requests=[];page.on('request',r=>{if(!r.url().startsWith('blob:'))requests.push(r.url());});const before=await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage}}));
 await page.getByRole('button',{name:'Charger l’exemple fictif',exact:true}).click();await page.getByRole('button',{name:'Préparer les relances',exact:true}).click();await expect(page.locator('#rel-summary')).toContainText('4 factures');await expect(page.locator('#rel-message-body')).toHaveValue(/90,00 EUR/);await expect(page.locator('[data-rel-decisions]')).toContainText('Litige');await expect(page.locator('[data-rel-decisions]')).toContainText('soldée');await expect(page.locator('[data-rel-decisions]')).toContainText('Non échue');
 await page.locator('#rel-message-body').fill('Mon message relu');await page.getByRole('button',{name:'Copier le message',exact:true}).click();await expect.poll(()=>page.evaluate(()=>navigator.clipboard.readText())).toContain('Mon message relu');
 for(const label of ['Exporter tout en texte','Exporter tout en CSV']){const event=page.waitForEvent('download');await page.getByRole('button',{name:label,exact:true}).click();const download=await event;const stream=await download.createReadStream();const chunks=[];for await(const c of stream)chunks.push(c);const text=Buffer.concat(chunks).toString('utf8');expect(text).toContain('Mon message relu');expect(text).toContain('Litige');expect(text).toContain('F-004');}
 expect(requests).toEqual([]);expect(await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage}}))).toEqual(before);await expect(page.locator('script[src*="beacon"]')).toHaveCount(0);expect(await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content')).toContain("connect-src 'none'");
});
test('refus 501, import multiline et source traçable sans écrasement',async({page})=>{
 await demo(page);await page.locator('summary').filter({hasText:'Importer un CSV'}).click();
 const header='clientKey;client;reference;amount;payments;credits;dueDate;dispute;currency';
 await page.locator('#rel-file').setInputFiles({name:'lot.csv',mimeType:'text/csv',buffer:Buffer.from(header+'\n'+Array.from({length:501},(_,i)=>`001;Atelier;F${i};1;0;0;20260901;non;EUR`).join('\n'))});
 await page.getByRole('button',{name:'Lire le CSV',exact:true}).click();await expect(page.locator('#rel-error')).toContainText('500');await expect(page.locator('#rel-message-body')).toHaveValue(/90,00 EUR/);
 await page.locator('#rel-file').setInputFiles({name:'lot.csv',mimeType:'text/csv',buffer:Buffer.from(header+'\n001;"Atelier\nfictif";F1;120;20;10;20260901;non;EUR')});
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Lire le CSV',exact:true}).click();await expect(page.locator('#rel-status')).toContainText('1 facture');
 await page.locator('#rel-group').check();await page.getByRole('button',{name:'Préparer les relances',exact:true}).click();await expect(page.locator('#rel-message-body')).toHaveValue(/90,00 EUR/);await expect(page.locator('[data-rel-decisions]')).toContainText('2');
});
test('édition conservée après modification et refus de régénération',async({page})=>{await demo(page);await page.locator('#rel-message-body').fill('Édition humaine');await page.locator('#rel-signature').fill('Nouvelle signature');await expect(page.getByRole('button',{name:'Exporter tout en texte',exact:true})).toBeDisabled();page.once('dialog',d=>d.dismiss());await page.getByRole('button',{name:'Préparer les relances',exact:true}).click();await expect(page.locator('#rel-message-body')).toHaveValue('Édition humaine');await page.getByRole('button',{name:'Effacer la session',exact:true}).click();await expect(page.locator('#rel-message')).toBeHidden();});
for(const width of [320,375,768,1024,1440,1920]) test(`reflow et navigation clavier ${width}`,async({page})=>{await page.setViewportSize({width,height:900});await demo(page);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await page.locator('#rel-message-body').focus();await page.keyboard.press('Tab');await expect(page.getByRole('button',{name:'Copier le message',exact:true})).toBeFocused();if([375,1440].includes(width))await page.screenshot({path:`docs/qa/relance-facture/relance-${width}.png`,fullPage:true});});
