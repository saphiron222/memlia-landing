import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {createSession,addScenario,retainScenario,exportJson,INPUT_FIELDS,demoSession} from '../../src/lib/signification.mjs';
const route='/outils-comptables-gratuits/seuil-signification-audit';
const click= (p,name)=>p.getByRole('button',{name,exact:true}).click();
async function download(page,selector){const wait=page.waitForEvent('download');await page.locator(selector).click();return readFile(await(await wait).path(),'utf8');}
async function save(page){await click(page,'Calculer et enregistrer le scénario');}
async function fill(page,patch){for(const [k,v] of Object.entries(patch))await page.locator(`#sig-${k}`).fill(v);}
test('parcours nominal : taux vides, choix explicite, justification conservée et reprise exacte',async({page})=>{
 await page.goto(route);await expect(page.locator('#sig-rate')).toHaveValue('');await expect(page.locator('#sig-planning')).toHaveValue('');
 await click(page,'Charger l’exemple fictif');await expect(page.locator('[data-sig-summary]')).toContainText('BROUILLON');await expect(page.locator('[data-sig-table]')).toContainText('10000.00');
 await fill(page,{justification:'Commentaire conservé'});await save(page);await click(page,'Retenir 001');await expect(page.locator('[data-sig-summary]')).toContainText('CHOIX UTILISATEUR');
 const final=await download(page,'[data-sig-final]');expect(final).toContain('CHOIX UTILISATEUR');expect(final).toContain('Fiche outil');expect(final).toContain('Commentaire conservé');
 await fill(page,{base:'2000000'});await expect(page.locator('[data-sig-export="json"]')).toBeDisabled();await save(page);
 await expect(page.locator('#sig-justification')).toHaveValue('Commentaire conservé');await expect(page.locator('[data-sig-summary]')).toContainText('BROUILLON');await expect(page.locator('[data-sig-table]')).toContainText('Entrées modifiées depuis validation');
 const raw=await download(page,'[data-sig-export="json"]');const saved=JSON.parse(raw);expect(saved.scenarios[0].base).toBe('2000000');expect(saved.retainedId).toBe('');
 page.once('dialog',d=>d.dismiss());await click(page,'Effacer la session');await expect(page.locator('[data-sig-summary]')).toContainText('2 scénario');
 page.once('dialog',d=>d.accept());await click(page,'Effacer la session');await expect(page.locator('[data-sig-summary]')).toContainText('0 scénario');await expect(page.locator('#sig-justification')).toHaveValue('');await expect(page.locator('[data-sig-downloads]')).toBeEmpty();
 await page.getByText('Reprendre une sauvegarde JSON',{exact:true}).click();await page.locator('#sig-json').setInputFiles({name:'reprise.json',mimeType:'application/json',buffer:Buffer.from(raw)});await click(page,'Reprendre le JSON');await expect(page.locator('[data-sig-summary]')).toContainText('2 scénario');
 const restored=JSON.parse(await download(page,'[data-sig-export="json"]'));expect(restored).toEqual(saved);
 await click(page,'Ouvrir 001');await expect(page.locator('#sig-justification')).toHaveValue('Commentaire conservé');
 await page.locator('#sig-planningMode').selectOption('amount');await fill(page,{planning:'21000'});await save(page);await expect(page.locator('#sig-planning')).toHaveAttribute('aria-invalid','true');await expect(page.locator('#sig-planning-error')).toContainText('supérieure');await click(page,'Exporter le dossier final');await expect(page.locator('[data-sig-error]')).toContainText('supérieure');
 await fill(page,{base:'0',rate:''});await save(page);await expect(page.locator('[data-sig-table]')).toContainText('Non calculée');await expect(page.locator('#sig-base-error')).toContainText('strictement positif');await expect(page.locator('#sig-rate-error')).not.toBeEmpty();
});
test('décimaux, CSV sécurisé, texte importé jamais actif et dossier brouillon',async({page})=>{
 await page.goto(route);await fill(page,{id:'001',name:'=1+1',baseName:'CA',base:'1234,56',rate:'1,25',period:'2026',reference:'<img src=x onerror=alert(1)>',justification:'Note'});await save(page);await expect(page.locator('[data-sig-table]')).toContainText('15.43');
 const csv=await download(page,'[data-sig-export="csv"]');expect(csv.startsWith('\ufeff')).toBeTruthy();expect(csv).toContain("'=1+1");expect(csv).toContain('BROUILLON');
 const html=await download(page,'[data-sig-export="html"]');expect(html).not.toContain('<img');expect(html).toContain('&lt;img');expect(html).toContain('BROUILLON');
 await click(page,'Exporter le dossier final');await expect(page.locator('[data-sig-error]')).toContainText('brouillon');expect(await page.locator('[data-signification] img').count()).toBe(0);
});
test('CSV : mapping complet, aperçu, duplication refusée et pagination sans perte',async({page})=>{
 await page.goto(route);await page.getByText('Importer des scénarios CSV',{exact:true}).click();
 const header=INPUT_FIELDS.join(';'),records=Array.from({length:25},(_,i)=>[String(i).padStart(3,'0'),'A','CA','1000000','1','2026','Balance','Motif','rate','70'].join(';')).join('\n');
 await page.locator('#sig-csv').setInputFiles({name:'scenario.csv',mimeType:'text/csv',buffer:Buffer.from(header+'\n'+records)});await click(page,'Lire le CSV');await expect(page.locator('[data-mapping]')).toHaveCount(10);
 await click(page,'Voir l’aperçu mappé');await expect(page.locator('[data-sig-error]')).toContainText('dix colonnes');
 for(let i=0;i<INPUT_FIELDS.length;i++)await page.locator(`[data-mapping="${INPUT_FIELDS[i]}"]`).selectOption(String(i));
 await click(page,'Voir l’aperçu mappé');await expect(page.locator('[data-sig-import-summary]')).toContainText('25 lignes');await expect(page.locator('[data-sig-preview-rows] tbody tr')).toHaveCount(20);
 await click(page,'Suivant (aperçu)');await expect(page.locator('[data-sig-preview-rows] tbody tr')).toHaveCount(5);await page.locator('[data-sig-import-valid]').check();await click(page,'Ajouter les scénarios importés');await expect(page.locator('[data-sig-summary]')).toContainText('25 scénario');await expect(page.locator('[data-sig-table] tr')).toHaveCount(20);
 await click(page,'Page suivante');await expect(page.locator('[data-sig-table] tr')).toHaveCount(5);const raw=JSON.parse(await download(page,'[data-sig-export="json"]'));expect(raw.scenarios).toHaveLength(25);expect(raw.scenarios[0].id).toBe('000');expect(raw.scenarios[24].id).toBe('024');
 await page.locator('#sig-csv').setInputFiles({name:'dup.csv',mimeType:'text/csv',buffer:Buffer.from(header+'\n'+records)});await click(page,'Lire le CSV');await expect(page.locator('[data-mapping]')).toHaveCount(10);for(let i=0;i<INPUT_FIELDS.length;i++)await page.locator(`[data-mapping="${INPUT_FIELDS[i]}"]`).selectOption(String(i));await click(page,'Voir l’aperçu mappé');await expect(page.locator('[data-sig-import-summary]')).toContainText('25 lignes');await page.locator('[data-sig-import-valid]').check();await click(page,'Ajouter les scénarios importés');await expect(page.locator('[data-sig-error]')).toContainText('identifiant');await expect(page.locator('[data-sig-summary]')).toContainText('25 scénario');
});
test('reprise corrompue et remplacement refusé préservent saisies et états',async({page})=>{
 await page.goto(route);await click(page,'Charger l’exemple fictif');await page.getByText('Reprendre une sauvegarde JSON',{exact:true}).click();
 await page.locator('#sig-json').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"version":1}')});await click(page,'Reprendre le JSON');await expect(page.locator('[data-sig-error]')).not.toBeEmpty();await expect(page.locator('[data-sig-summary]')).toContainText('2 scénario');
 let s=demoSession();s=retainScenario(s,'001');const raw=exportJson(s);await page.locator('#sig-json').setInputFiles({name:'ok.json',mimeType:'application/json',buffer:Buffer.from(raw)});page.once('dialog',d=>d.dismiss());await click(page,'Reprendre le JSON');await expect(page.locator('[data-sig-status]')).toContainText('non appliquée');await expect(page.locator('[data-sig-summary]')).toContainText('BROUILLON');
 page.once('dialog',d=>d.accept());await click(page,'Reprendre le JSON');await expect(page.locator('[data-sig-summary]')).toContainText('CHOIX UTILISATEUR');
});
test('100 000 lignes : Worker annulable, pas de résultat partiel et plafond explicite',async({page})=>{
 test.setTimeout(60000);await page.goto(route);await click(page,'Charger l’exemple fictif');await page.getByText('Importer des scénarios CSV',{exact:true}).click();
 const csv=INPUT_FIELDS.join(';')+'\n'+Array.from({length:100000},(_,i)=>`x${i};A;CA;1000000;1;2026;Balance;Motif;rate;70`).join('\n');
 await page.locator('#sig-csv').setInputFiles({name:'large.csv',mimeType:'text/csv',buffer:Buffer.from(csv)});
 await page.evaluate(()=>{document.querySelector('[data-sig-csv]').requestSubmit();document.querySelector('[data-sig-cancel]').click();});await expect(page.locator('[data-sig-status]')).toContainText('annulé');await expect(page.locator('[data-sig-summary]')).toContainText('2 scénario');await expect(page.locator('[data-mapping]')).toHaveCount(0);
 await click(page,'Lire le CSV');await expect(page.locator('[data-mapping]')).toHaveCount(10);for(let i=0;i<INPUT_FIELDS.length;i++)await page.locator(`[data-mapping="${INPUT_FIELDS[i]}"]`).selectOption(String(i));await click(page,'Voir l’aperçu mappé');await expect(page.locator('[data-sig-import-summary]')).toContainText('100000 lignes');await page.locator('[data-sig-import-valid]').check();await click(page,'Ajouter les scénarios importés');await expect(page.locator('[data-sig-error]')).toContainText('100 000');await expect(page.locator('[data-sig-summary]')).toContainText('2 scénario');
});
for(const width of [320,375,768,1024,1440,1920])test(`rendu et confidentialité ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(route);await page.evaluate(()=>document.fonts.ready);
 const requests=[];page.on('request',r=>requests.push(r));await click(page,'Charger l’exemple fictif');await click(page,'Retenir 001');await fill(page,{justification:'Texte de contrôle privé'});await save(page);await download(page,'[data-sig-export="json"]');
 expect(requests.every(r=>r.method()==='GET'&&r.url().startsWith(new URL(page.url()).origin)&&!r.url().includes('Texte'))).toBeTruthy();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();expect(errors).toEqual([]);
 expect(await page.evaluate(async()=>({local:localStorage.length,session:sessionStorage.length,cookies:document.cookie,idb:await indexedDB.databases(),cache:await caches.keys()}))).toEqual({local:0,session:0,cookies:'',idb:[],cache:[]});
 await expect(page.locator('h1')).toHaveText('Seuil de signification en audit : calcul et justification');await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://memlia.fr'+route);await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content',await page.locator('h1').innerText());await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute('content',/connect-src 'none'/);
});
