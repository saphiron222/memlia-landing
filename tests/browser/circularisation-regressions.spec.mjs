import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import * as c from '../../src/lib/circularisation.mjs';
const route='/outils-comptables-gratuits/suivi-circularisation';
for(const replacement of ['reset','demo','resume']) test(`R3 cleans detail on ${replacement}`,async({page})=>{
 await page.goto(route);
 await page.locator('[data-circ-demo]').click();await page.getByRole('button',{name:'Ouvrir 001',exact:true}).click();
 await page.locator('#circ-return').fill('Coordonnées anciennes uniques');await page.locator('#circ-note').fill('Note ancienne unique');await page.getByText('Ajouter une réponse ou un refus (historique conservé)',{exact:true}).click();await page.locator('#circ-response-comment').fill('Commentaire ancien unique');
 page.once('dialog',d=>d.accept());
 if(replacement==='resume'){
  await page.getByText('Reprendre une sauvegarde JSON',{exact:true}).click();
  await page.locator('#circ-json').setInputFiles({name:'empty.json',mimeType:'application/json',buffer:Buffer.from(c.exportSession(c.createSession()))});
  await page.locator('[data-circ-reimport] button').click();
 }else await page.locator(`[data-circ-${replacement}]`).click();
 await expect(page.locator('[data-circ-detail]')).toBeHidden();
 await expect(page.locator('[data-circ-history]')).toBeEmpty();
 await expect(page.locator('[data-circ-letter-text]')).not.toContainText('Client fictif A');
 for(const id of ['return','note','response-comment','response-date','response-amount','sent'])await expect(page.locator('#circ-'+id)).toHaveValue('');
 await expect(page.locator('[data-circ-letter-download]')).toBeDisabled();await expect(page.locator('[data-circ-letter-copy]')).toBeDisabled();
 const calls=await page.evaluate(()=>{let downloads=0,copies=0;URL.createObjectURL=()=>{downloads++;return 'blob:forbidden';};Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{copies++;}},configurable:true});for(const name of ['download','copy'])document.querySelector('[data-circ-letter-'+name+']').dispatchEvent(new Event('click'));return {downloads,copies};});
 expect(calls).toEqual({downloads:0,copies:0});
});
for(const [field,value] of [['referenceDate','2026-06-30'],['currency','USD'],['requestedAmount','110']])test(`R1 browser correction ${field}`,async({page})=>{
 await page.goto(route);await page.locator('[data-circ-demo]').click();await page.getByRole('button',{name:'Ouvrir 001',exact:true}).click();
 await page.locator('[data-circ-reconcile]').click();
 await page.locator('#circ-'+field).fill(value);await page.locator('[data-circ-save]').click();
 await expect(page.locator('[name="comparable"]')).not.toBeChecked();
 await expect(page.locator('[data-circ-reconcile]')).toBeDisabled();await expect(page.locator('[data-circ-table]')).toContainText('Non évalué');
 await page.getByText('Ajouter une réponse ou un refus (historique conservé)',{exact:true}).click();
 await page.locator('#circ-response-date').fill('2026-07-01');await page.locator('#circ-response-amount').fill('120');await page.locator('#circ-response-currency').fill(field==='currency'?'USD':'EUR');await page.locator('[name="comparable"]').check();await page.locator('[data-circ-response] button').click();
 await expect(page.locator('[data-circ-reconcile]')).toBeEnabled();await page.locator('[data-circ-reconcile]').click();
});
test('R2 browser saves all parts, confirms replacement and resumes equal work',async({page})=>{
 test.setTimeout(180000);
 const headers=['id','category','recipient','contact','referenceDate','currency','requestedAmount','confirmationType'];
 const count=25000,csv=headers.join(';')+'\n'+Array.from({length:count},(_,i)=>`${i};client;Fictif ${i};Adresse;2026-01-01;EUR;100;closed`).join('\n');
 let s=c.importCsv(c.createSession(),c.parseCsv(csv,{delimiter:';'}),{mapping:Object.fromEntries(headers.map(h=>[h,h])),selectedRows:Array.from({length:count},(_,i)=>i),selectionValidated:true});
 s=c.updateTier(s,'0',{note:'Note précieuse',sentDate:'2026-01-10'});s=c.generateLetter(s,'0',{returnContact:'Retour précieux',validated:true,amountValidated:true}).session;s=c.addResponse(s,'0',{date:'2026-01-11',amount:'120',comparable:true});s=c.reconcileResponse(s,'0');
 const seed=c.exportSessionFiles(s).map(f=>({name:f.name,mimeType:'application/json',buffer:Buffer.from(f.text)}));
 await page.goto(route);await page.getByText('Reprendre une sauvegarde JSON',{exact:true}).click();await page.locator('#circ-json').setInputFiles(seed);await page.locator('[data-circ-reimport] button').click();await expect(page.locator('[data-circ-summary]')).toContainText('25000 tiers');
 await page.locator('[data-circ-export="json"]').click();
 const buttons=page.locator('[data-circ-export-parts] button'),files=[];
 expect(await buttons.count()).toBeGreaterThan(1);
 for(const button of await buttons.all()) {const pending=page.waitForEvent('download');await button.click();const dl=await pending;const buffer=await readFile(await dl.path());expect(buffer.length).toBeLessThanOrEqual(c.MAX_BYTES);files.push({name:dl.suggestedFilename(),mimeType:'application/json',buffer});}
 expect(c.importSessionFiles(files.map(f=>f.buffer.toString()))).toEqual(s);
 page.once('dialog',d=>d.accept());await page.locator('[data-circ-demo]').click();
 await page.locator('#circ-json').setInputFiles(files);const declined=page.waitForEvent('dialog');await page.locator('[data-circ-reimport] button').click();await(await declined).dismiss();await expect(page.locator('[data-circ-reimport] button')).toBeEnabled();await expect(page.locator('[data-circ-summary]')).toContainText('3 tiers');
 page.once('dialog',d=>d.accept());await page.locator('[data-circ-reimport] button').click();await expect(page.locator('[data-circ-summary]')).toContainText('25000 tiers');
 await page.getByRole('button',{name:'Ouvrir 0',exact:true}).click();await expect(page.locator('[data-circ-history]')).toContainText('Note précieuse');await expect(page.locator('[data-circ-letter-text]')).toContainText('Retour précieux');
 await page.locator('[data-circ-export="json"]').click();const resumed=[];
 for(const button of await page.locator('[data-circ-export-parts] button').all()){const pending=page.waitForEvent('download');await button.click();resumed.push((await readFile(await(await pending).path())).toString());}
 expect(c.importSessionFiles(resumed)).toEqual(s);
});
