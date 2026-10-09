import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {demoSession,exportJson,INPUT_FIELDS} from '../../src/lib/signification.mjs';
const route='/outils-comptables-gratuits/seuil-signification-audit';
const raw=exportJson(demoSession());
for(const field of ['missionRef','preparer','reviewer'])for(const action of ['demo','restore','reset'])test(`${field} seul : ${action} exige un accord`,async({page})=>{
 await page.goto(route);await page.getByText('Mission et intervenants (facultatifs)',{exact:true}).click();const input=page.locator(`[data-sig-meta] [name="${field}"]`);await input.fill('Saisie privée');
 if(action==='restore'){await page.getByText('Reprendre une sauvegarde JSON',{exact:true}).click();await page.locator('#sig-json').setInputFiles({name:'reprise.json',mimeType:'application/json',buffer:Buffer.from(raw)});}
 const selector=action==='restore'?'[data-sig-restore] button':`[data-sig-${action}]`;
 let dialogs=0;const refuse=async d=>{dialogs++;await d.dismiss();};page.on('dialog',refuse);await page.locator(selector).click();
 if(action==='restore')await expect(page.locator('[data-sig-status]')).toContainText('non appliquée');
 expect(dialogs).toBe(1);await expect(input).toHaveValue('Saisie privée');await expect(page.locator('[data-sig-summary]')).toContainText('0 scénario');
 expect(await page.evaluate(()=>{const e=new Event('beforeunload',{cancelable:true});window.dispatchEvent(e);return e.defaultPrevented;})).toBeTruthy();
 page.off('dialog',refuse);page.once('dialog',d=>d.accept());await page.locator(selector).click();await expect(input).toHaveValue('');
 await expect(page.locator('[data-sig-summary]')).toContainText(action==='reset'?'0 scénario':'2 scénario');
});
test('annulation puis reprise/export : aucune requête, aucun résultat annulé',async({page,context})=>{
 await page.goto(route);await page.waitForLoadState('networkidle');const requests=[];context.on('request',r=>requests.push(`${r.method()} ${r.url()}`));
 await page.locator('[data-sig-demo]').click();await page.getByText('Importer des scénarios CSV',{exact:true}).click();
 const csv=INPUT_FIELDS.join(';')+'\n'+Array.from({length:100000},(_,i)=>`x${i};A;CA;1000000;1;2026;Balance;Motif;rate;70`).join('\n');
 await page.locator('#sig-csv').setInputFiles({name:'large.csv',mimeType:'text/csv',buffer:Buffer.from(csv)});
 await page.evaluate(()=>{document.querySelector('[data-sig-csv]').requestSubmit();document.querySelector('[data-sig-cancel]').click();});
 await expect(page.locator('[data-sig-status]')).toContainText('annulé');await expect(page.locator('[data-mapping]')).toHaveCount(0);await expect(page.locator('[data-sig-downloads]')).toBeEmpty();
 await page.getByText('Reprendre une sauvegarde JSON',{exact:true}).click();await page.locator('#sig-json').setInputFiles({name:'reprise.json',mimeType:'application/json',buffer:Buffer.from(raw)});page.once('dialog',d=>d.accept());await page.locator('[data-sig-restore] button').click();await expect(page.locator('[data-sig-status]')).toContainText('Sauvegarde reprise');
 const downloading=page.waitForEvent('download');await page.locator('[data-sig-export="json"]').click();expect(JSON.parse(await readFile(await(await downloading).path(),'utf8'))).toEqual(JSON.parse(raw));
 await expect(page.locator('[data-mapping]')).toHaveCount(0);await page.waitForLoadState('networkidle');expect(requests).toEqual([]);
 expect(await page.evaluate(async()=>({local:localStorage.length,session:sessionStorage.length,cookies:document.cookie,idb:await indexedDB.databases(),cache:await caches.keys()}))).toEqual({local:0,session:0,cookies:'',idb:[],cache:[]});
});
