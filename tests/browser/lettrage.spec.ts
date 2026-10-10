import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { mkdirSync } from 'node:fs';
const route='/outils-comptables-gratuits/assistant-lettrage-comptable-local';
const header='id;compte;tiers;reference;date;debit;credit;devise;lettre\n';
const row=(id:string,d:string,c:string,ref='X',devise='EUR',letter='')=>`${id};411;CLIENT;${ref};2026-01-01;${d};${c};${devise};${letter}\n`;
async function importCsv(page:any,content:string){await page.locator('#lettrage-file').setInputFiles({name:'fictif.csv',mimeType:'text/csv',buffer:Buffer.from(content)});await page.getByRole('button',{name:'Importer et rechercher les paires'}).click();}
async function exportCsv(page:any){const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Exporter le rapport CSV complet'}).click();const download=await downloadPromise;return readFile((await download.path())!,'utf8');}

test('exemple, décisions réversibles, copie/export complets, stockage et réseau inchangés',async({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);await page.goto(route);const before=await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage}}));const requests:string[]=[];page.on('request',r=>{if(r.method()!=='GET'||!r.url().includes('lettrage.worker'))requests.push(r.url());});
  await page.getByRole('button',{name:'Essayer l’exemple fictif'}).click();await expect(page.locator('[data-summary]')).toContainText('6 lignes source ; 1 paire(s), 1 groupe(s) ambigu(s)');await expect(page.locator('[data-lines] tbody tr')).toHaveCount(6);
  await page.getByRole('button',{name:'Accepter la paire P1',exact:true}).click();await expect(page.locator('[data-pairs]')).toContainText('P1 : accepté');expect(await exportCsv(page)).toContain('"accepté"');
  await page.getByRole('button',{name:'Refuser la paire P1',exact:true}).click();const csv=await exportCsv(page);expect(csv).toContain('"refusé"');expect(csv).toContain('R-003');expect(csv).toContain('F-003');expect(csv).not.toContain('"accepté"');
  await page.getByRole('button',{name:'Copier le rapport CSV complet'}).click();await expect(page.locator('[data-status]')).toContainText('complet copié');expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(csv);
  await page.getByRole('button',{name:'Revenir à proposé la paire P1',exact:true}).click();await expect(page.locator('[data-pairs]')).toContainText('P1 : proposé');expect(await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage}}))).toEqual(before);expect(requests).toEqual([]);
  await page.getByRole('button',{name:'Tout réinitialiser'}).click();await expect(page.locator('[data-result]')).toBeHidden();await expect(page.locator('[data-pairs]')).toBeEmpty();
});

test('import strict, exceptions exportées, erreur conservant rapport et saisie, HTML inerte',async({page})=>{
  await page.goto(route);await importCsv(page,header+row('001','100','0','<img src=x onerror=alert(1)>')+row('002','0','100','<img src=x onerror=alert(1)>')+row('dup','2','0')+row('dup','0','2')+row('nul','1','1')+row('old','1','0','X','EUR','AA')+row('missing','1','0','X',''));
  await expect(page.locator('[data-summary]')).toContainText('7 lignes source');await expect(page.locator('[data-lines] img')).toHaveCount(0);const csv=await exportCsv(page);expect(csv).toContain('Identifiant dupliqué');expect(csv).toContain('Débit et crédit simultanés');expect(csv).toContain('"exclu"');expect(csv).toContain('devise obligatoire');
  await importCsv(page,'id;compte\n1;411');await expect(page.locator('[data-error]')).toContainText('Colonnes obligatoires absentes');await expect(page.locator('[data-summary]')).toContainText('7 lignes source');expect(await page.locator('#lettrage-file').evaluate((el:HTMLInputElement)=>el.files?.[0].name)).toBe('fictif.csv');await expect(page.locator('#lettrage-file')).toHaveAttribute('aria-invalid','true');
});

test('pagination sans troncature et export non filtré',async({page})=>{
  await page.goto(route);const content=header+Array.from({length:60},(_,i)=>row(`ID-${i}`,'1','0',`REF-${i}`)).join('');await importCsv(page,content);await expect(page.locator('[data-lines] tbody tr')).toHaveCount(50);await expect(page.locator('[data-line-page]')).toContainText('60 ligne(s) au total');await page.getByRole('button',{name:'Lignes suivantes'}).click();await expect(page.locator('[data-lines] tbody tr')).toHaveCount(10);await expect(page.locator('[data-lines]')).toContainText('ID-59');await page.locator('#lettrage-filter').selectOption('ambigu');await expect(page.locator('[data-lines] tbody tr')).toHaveCount(0);expect(await exportCsv(page)).toContain('ID-59');
});

test('annulation immédiate laisse le rapport précédent intact',async({page})=>{
  await page.goto(route);await page.getByRole('button',{name:'Essayer l’exemple fictif'}).click();await expect(page.locator('[data-summary]')).toContainText('6 lignes source');await page.locator('#lettrage-file').setInputFiles({name:'long.csv',mimeType:'text/csv',buffer:Buffer.from(header+Array.from({length:20000},(_,i)=>row(`ID-${i}`,'1','0')).join(''))});await page.evaluate(()=>{const root=document.querySelector('[data-lettrage]')!;root.querySelector('form')!.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));(root.querySelector('[data-cancel]') as HTMLButtonElement).click();});await expect(page.locator('[data-status]')).toContainText('Traitement annulé');await expect(page.locator('[data-summary]')).toContainText('6 lignes source');
});

for(const width of [320,375,768,1024,1440,1920])test(`clavier et lisibilité à ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto(route);await page.getByRole('button',{name:'Essayer l’exemple fictif'}).focus();await page.keyboard.press('Enter');await expect(page.locator('[data-summary]')).toContainText('6 lignes source');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);await page.getByRole('button',{name:'Accepter la paire P1',exact:true}).focus();await page.keyboard.press('Enter');await expect(page.locator('[data-pairs]')).toContainText('accepté');
  const csv=await exportCsv(page);expect(csv).toContain('R-003');expect(csv).toContain('F-003');expect(csv).toContain('"accepté"');
  mkdirSync('docs/qa/lettrage/captures',{recursive:true});
  for(let top=0;top<await page.evaluate(()=>document.documentElement.scrollHeight);top+=450){await page.evaluate(top=>window.scrollTo({top,behavior:'instant'}),top);await page.waitForTimeout(100);}
  await page.waitForTimeout(1100);expect(await page.locator('.rv:not(.in)').count()).toBe(0);
  await page.evaluate(()=>{for(const el of document.querySelectorAll<HTMLElement>('.table-scroll'))el.scrollLeft=0;window.scrollTo({top:0,behavior:'instant'});});await page.waitForTimeout(2100);
  await page.screenshot({path:`docs/qa/lettrage/captures/largeur-${width}.png`,fullPage:true,animations:'disabled'});
});

test('contrat canonique, maillage et reflow équivalent 400 %',async({page})=>{
  await page.goto(route);await expect(page.locator('h1')).toHaveText('Assistant de lettrage comptable local');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',`https://memlia.fr${route}`);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content','Assistant de lettrage comptable local');
  const graph=await page.locator('script[type="application/ld+json"]').allTextContents();const nodes=graph.flatMap(t=>{const j=JSON.parse(t);return j['@graph']??[j];});
  for(const type of ['WebPage','WebApplication','BreadcrumbList'])expect(nodes.some(n=>n['@type']===type)).toBe(true);
  expect(nodes.some(n=>n['@type']==='Article'||n.aggregateRating)).toBe(false);
  for(const source of ['/outils-comptables-gratuits','/integrations/lettrage-sage','/integrations/lettrage-cegid']){await page.goto(source);expect(await page.locator(`main a[href="${route}"]`).count()).toBeGreaterThan(0);}
  await page.setViewportSize({width:320,height:900});await page.goto(route);await page.getByRole('button',{name:'Essayer l’exemple fictif'}).click();await expect(page.locator('[data-summary]')).toContainText('6 lignes source');
  for(const region of await page.locator('[data-lettrage] .table-scroll').all()){await region.focus();await expect(region).toBeFocused();await page.keyboard.press('ArrowRight');}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
});
