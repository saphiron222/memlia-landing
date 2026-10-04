import { test, expect } from '@playwright/test';
import { FIELDS, exampleFec } from '../../src/lib/fec-local.mjs';
import { readFile } from 'node:fs/promises';
const route='/outils-comptables-gratuits/verificateur-fec-local';
async function upload(page,text,name='fictif.txt') { await page.locator('#fec-file').setInputFiles({name,mimeType:'text/plain',buffer:Buffer.from(text)}); await page.getByRole('button',{name:'Contrôler la structure',exact:true}).click(); }
test('Worker, exemple, CSV/JSON entier, CSP et zéro transmission/stockage',async({page},testInfo)=>{
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto(route); await page.evaluate(()=>document.fonts.ready);
  const requests=[];page.on('request',r=>requests.push({url:r.url(),method:r.method(),body:r.postData()}));
  await page.getByRole('button',{name:'Analyser l’exemple fictif'}).click();
  await expect(page.locator('[data-summary]')).toContainText('1 anomalies');
  await expect(page.locator('[data-anomalies]')).toContainText('Ligne 4 · EcritureDate · règle date');
  const dl=page.waitForEvent('download');await page.locator('[data-export="json"]').click();
  const file=await dl;const report=JSON.parse(await readFile(await file.path(),'utf8'));
  expect(report.anomalies).toHaveLength(1);expect(report.anomalies[0].line).toBe(4);
  await file.saveAs(testInfo.outputPath('exemple-rapport.json'));
  const csvDl=page.waitForEvent('download');await page.locator('[data-export="csv"]').click();
  expect(await readFile(await (await csvDl).path(),'utf8')).toContain('20260230');
  expect(requests.filter(r=>r.method!=='GET'||r.body)).toEqual([]);
  expect(requests.every(r=>r.url.startsWith(new URL(page.url()).origin))).toBe(true);
  expect(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length,cookie:document.cookie}))).toEqual({local:0,session:0,cookie:''});
  expect(await page.evaluate(()=>indexedDB.databases())).toEqual([]);
  expect(errors).toEqual([]);
  const csp=await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');expect(csp).toContain("connect-src 'none'");
});
test('pagination 300, export complet et sélection non écrasée par exemple',async({page})=>{
  await page.goto(route);
  const bad=exampleFec().split('\n').at(-1);
  await upload(page,FIELDS.join('|')+'\n'+Array(300).fill(bad).join('\n'));
  await expect(page.locator('[data-anomalies] li')).toHaveCount(100);
  await expect(page.locator('[data-page]')).toContainText('Page 1 sur 3 · 300');
  await page.locator('[data-next]').click();await expect(page.locator('[data-anomalies] li').first()).toContainText('Ligne 102');
  const dl=page.waitForEvent('download');await page.locator('[data-export="json"]').click();
  const report=JSON.parse(await readFile(await (await dl).path(),'utf8'));expect(report.anomalies).toHaveLength(300);
  await page.getByRole('button',{name:'Analyser l’exemple fictif'}).click();await expect(page.locator('[data-status]')).toContainText('Effacez explicitement');
  expect(await page.locator('#fec-file').evaluate(e=>e.files[0].name)).toBe('fictif.txt');
});
test('refus 20 Mo, profil hors périmètre, calendrier et Windows-1252 réel',async({page})=>{
  await page.goto(route);
  await page.locator('#fec-file').setInputFiles({name:'grand.txt',mimeType:'text/plain',buffer:Buffer.alloc(20_000_001)});
  await page.getByRole('button',{name:'Contrôler la structure',exact:true}).click();await expect(page.locator('[data-error]')).toContainText('avant lecture');
  await expect(page.locator('[data-output]')).toBeHidden();
  await upload(page,'JournalCode|Montant|Sens\nAC|10|D');await expect(page.locator('[data-status]')).toContainText('hors périmètre');
  await page.locator('#fec-encoding').selectOption('windows-1252');
  const nominal=exampleFec().split('\n').slice(0,2).join('\n');
  await page.locator('#fec-file').setInputFiles({name:'accent.txt',mimeType:'text/plain',buffer:Buffer.from(nominal.replace('20260101','20260230'),'latin1')});
  await page.getByRole('button',{name:'Contrôler la structure',exact:true}).click();await expect(page.locator('[data-summary]')).toContainText('lecture windows-1252');
  await expect(page.locator('[data-anomalies]')).toContainText('EcritureDate');
});
test('annulation interrompt le Worker sans rapport complet ni perte de sélection',async({page})=>{
  await page.goto(route);
  // Un Worker retardé permet d'exercer le bouton de façon déterministe, sans remplacer le test du vrai Worker ci-dessus.
  await page.evaluate(()=>{ window.Worker=class { terminate(){} postMessage(){} } });
  await page.locator('#fec-file').setInputFiles({name:'cancel.txt',mimeType:'text/plain',buffer:Buffer.from(exampleFec())});
  await page.getByRole('button',{name:'Contrôler la structure',exact:true}).click();await page.locator('[data-cancel]').click();
  await expect(page.locator('[data-status]')).toContainText('Analyse annulée');await expect(page.locator('[data-output]')).toBeHidden();
  expect(await page.locator('#fec-file').evaluate(e=>e.files[0].name)).toBe('cancel.txt');
});
for(const width of [320,375,768,1024,1440,1920]) test(`SEO, reflow et capture ${width}`,async({page},testInfo)=>{
  await page.setViewportSize({width,height:900}); await page.emulateMedia({reducedMotion:'reduce'});await page.goto(route);await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('h1')).toHaveCount(1);await expect(page.locator('h1')).toHaveText('Vérificateur FEC gratuit et local');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://memlia.fr'+route);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content','Vérificateur FEC gratuit et local');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('button',{name:'Analyser l’exemple fictif'}).click();await expect(page.locator('[data-output]')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  if([375,1440].includes(width))await page.screenshot({path:testInfo.outputPath(`fec-${width}.png`),fullPage:true});
});
