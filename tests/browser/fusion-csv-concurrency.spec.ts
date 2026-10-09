import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const route='/outils-comptables-gratuits/fusionner-fichiers-csv';
async function load(page:Page){
 await page.goto(route);
 await page.locator('#fusion-files').setInputFiles([
  {name:'a.csv',mimeType:'text/csv',buffer:Buffer.from('ID;Montant\n00123;10')},
  {name:'b.csv',mimeType:'text/csv',buffer:Buffer.from('Montant;ID\n20;004')},
 ]);
 await page.getByRole('button',{name:'Importer les fichiers',exact:true}).click();
 await expect(page.locator('[data-mapping]')).toBeVisible();
 await page.locator('[data-provenance]').check();
 await page.locator('[data-confirmed]').check();
}
async function merge(page:Page){
 await page.locator('[data-confirmed]').check();await page.locator('[data-merge]').click();
 await expect(page.locator('[data-result]')).toBeVisible();await page.locator('[data-reviewed]').check();
}
async function download(page:Page,format:string){
 const event=page.waitForEvent('download');await page.locator(`[data-export="${format}"]`).click();
 return readFile((await(await event).path())!,'utf8');
}
test('F1 : réordre pendant consolidation annule, puis ordre/mapping/rapport/CSV concordent',async({page})=>{
 await load(page);
 await page.evaluate(()=>{
  document.querySelector<HTMLButtonElement>('[data-merge]')!.click();
  document.querySelector<HTMLButtonElement>('[data-file="1"] button')!.click();
 });
 await expect(page.locator('[data-status]')).toContainText('annulé');
 await page.waitForTimeout(300); // laisser une réponse tardive éventuelle arriver
 await expect(page.locator('[data-result]')).toBeHidden();
 await expect(page.locator('[data-confirmed]')).not.toBeChecked();
 for(const button of await page.locator('[data-export],[data-copy]').all())await expect(button).toBeDisabled();
 await merge(page);
 const rows=await page.locator('[data-table] tbody tr').evaluateAll(trs=>trs.map(tr=>[...tr.querySelectorAll('td')].map(td=>td.textContent)));
 expect(rows).toEqual([['20','004','b.csv','2'],['10','00123','a.csv','2']]);
 // Le premier fichier réordonné définit aussi l'ordre des colonnes.
 expect(await page.locator('[data-table] th').allTextContents()).toEqual(['Montant','ID','source_fichier','source_ligne']);
 const report=JSON.parse(await download(page,'report'));
 expect(report.options.confirmed).toBe(true);expect(report.headers.slice(0,2)).toEqual(['Montant','ID']);
 expect(report.files.map((f:any)=>f.name)).toEqual(['b.csv','a.csv']);
 expect(await download(page,'csv')).toContain('"20";"004";"b.csv";"2"\r\n"10";"00123";"a.csv";"2"');
});
for(const actions of [['report','copy'],['copy','report'],['csv','copy'],['copy','csv']])test(`F2 : ${actions.join(' puis ')} conserve chaque destination`,async({page})=>{
 await load(page);await merge(page);
 const expectedCsv=await download(page,'csv');
 await page.evaluate(()=>{(window as any).copies=[];Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(text:string)=>{(window as any).copies.push(text);}}});});
 const downloads:import('@playwright/test').Download[]=[];page.on('download',d=>downloads.push(d));
 await page.evaluate(actions=>{for(const action of actions)document.querySelector<HTMLButtonElement>(action==='copy'?'[data-copy]':`[data-export="${action}"]`)!.click();},actions);
 await expect.poll(()=>page.evaluate(()=>(window as any).copies)).toEqual([expectedCsv]);
 await expect.poll(()=>downloads.length).toBe(1);
 const d=downloads[0],content=await readFile((await d.path())!,'utf8');
 if(actions.includes('report')){expect(d.suggestedFilename()).toBe('rapport-fusion-csv.json');expect(JSON.parse(content).method).toBe('vertical-concatenation');}
 else{expect(d.suggestedFilename()).toBe('fusion.csv');expect(content).toBe(expectedCsv);}
});
for(const change of ['reset','mapping','order','review','review-again'])test(`F2 : réponses export obsolètes ignorées après ${change}`,async({page})=>{
 await load(page);await merge(page);
 await page.evaluate(()=>{(window as any).copies=[];Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(text:string)=>{(window as any).copies.push(text);}}});});
 const downloads:string[]=[];page.on('download',d=>downloads.push(d.suggestedFilename()));
 await page.evaluate(change=>{
  document.querySelector<HTMLButtonElement>('[data-export="report"]')!.click();document.querySelector<HTMLButtonElement>('[data-copy]')!.click();
  if(change==='reset')document.querySelector<HTMLButtonElement>('[data-reset]')!.click();
  if(change==='order')document.querySelector<HTMLButtonElement>('[data-file="1"] button')!.click();
  if(change==='mapping'){const field=document.querySelector<HTMLInputElement>('[data-map]')!;field.value='Code';field.dispatchEvent(new Event('input',{bubbles:true}));}
  if(change==='review'){const field=document.querySelector<HTMLInputElement>('[data-reviewed]')!;field.checked=false;field.dispatchEvent(new Event('change',{bubbles:true}));}
  if(change==='review-again'){const field=document.querySelector<HTMLInputElement>('[data-reviewed]')!;field.click();field.click();}
 },change);
 await page.waitForTimeout(400);
 expect(await page.evaluate(()=>(window as any).copies)).toEqual([]);expect(downloads).toEqual([]);
 await expect(page.locator('[data-status]')).not.toContainText('copié');
 for(const button of await page.locator('[data-export],[data-copy]').all())if(change==='review-again')await expect(button).toBeEnabled();else await expect(button).toBeDisabled();
});
test('F2 : fin de copie asynchrone après reset ne déclare pas un faux succès',async({page})=>{
 await load(page);await merge(page);
 await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>new Promise<void>(resolve=>{(window as any).finishCopy=resolve;})}});});
 await page.locator('[data-copy]').click();await page.waitForFunction(()=>Boolean((window as any).finishCopy));
 await page.locator('[data-reset]').click();await page.evaluate(()=>(window as any).finishCopy());
 await expect(page.locator('[data-status]')).toHaveText('Fichiers et résultats effacés de cet onglet.');
});
