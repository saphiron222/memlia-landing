import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const route='/outils-comptables-gratuits/bareme-heures-cac';
test('local calculation, refusals, preservation and reprise',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(route);await page.evaluate(()=>document.fonts.ready);
 const requests=[];page.on('request',r=>{if(!r.url().startsWith('blob:'))requests.push(r.url());});
 await page.locator('[data-demo]').click();await expect(page.locator('[data-result]')).toContainText('20 à 35');await expect(page.locator('[data-result]')).toContainText('42 heures');
 await page.locator('[name="notes"]').fill('001 note <script>bad()</script>');await expect(page.locator('[data-export="json"]')).toBeDisabled();await page.locator('[data-bareme-form]').evaluate(f=>f.requestSubmit());
 const dl=page.waitForEvent('download');await page.locator('[data-export="json"]').click();const json=await readFile(await(await dl).path(),'utf8');expect(JSON.parse(json).input.notes).toBe('001 note <script>bad()</script>');
 await page.locator('[name="balance"]').fill('-1');await page.locator('[data-bareme-form]').evaluate(f=>f.requestSubmit());await expect(page.locator('[data-error]')).toContainText('Montant');expect(await page.locator('[name="notes"]').inputValue()).toContain('001 note');
 await page.locator('[name="balance"]').fill('100000');await page.locator('[name="association"]').selectOption('yes');await page.locator('[data-bareme-form]').evaluate(f=>f.requestSubmit());await expect(page.locator('[data-result]')).toContainText('Exclusion déclarée');
 await page.locator('[name="association"]').selectOption('unknown');await page.locator('[data-bareme-form]').evaluate(f=>f.requestSubmit());await expect(page.locator('[data-result]')).toContainText('inconnu');
 await page.locator('[data-replace]').check();await page.locator('[data-import]').setInputFiles({name:'reprise.json',mimeType:'application/json',buffer:Buffer.from(json)});await expect(page.locator('[data-result]')).toContainText('260000.00');expect(await page.locator('[name="notes"]').inputValue()).toContain('001 note');
 for(const kind of ['csv','html']){const pending=page.waitForEvent('download');await page.locator(`[data-export="${kind}"]`).click();const raw=await readFile(await(await pending).path(),'utf8');expect(raw).toContain('001 note');if(kind==='html')expect(raw).not.toContain('<script>');}
 await page.locator('[data-import]').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{}')});await expect(page.locator('[data-error]')).toContainText('Version');expect(await page.locator('[name="notes"]').inputValue()).toContain('001 note');
 expect(requests).toEqual([]);expect(errors).toEqual([]);expect(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length,cookie:document.cookie}))).toEqual({local:0,session:0,cookie:''});expect(await page.evaluate(()=>indexedDB.databases())).toEqual([]);
 await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute('content',/connect-src 'none'/);
 page.once('dialog',d=>d.accept());await page.locator('[data-reset]').click();await expect(page.locator('[data-result]')).toHaveText('Session effacée.');
});
for(const width of [320,375,768,1024,1440,1920])test(`layout ${width}`,async({page},testInfo)=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.goto(route);await page.evaluate(()=>document.fonts.ready);await page.locator('[data-demo]').click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await expect(page.locator('h1')).toHaveCount(1);await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://memlia.fr'+route);await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content',await page.locator('h1').innerText());
 if([375,1440].includes(width)){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:testInfo.outputPath(`bareme-${width}.png`),fullPage:true});}
});
