const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const path=require('node:path');
(async()=>{
 const root=__dirname;
 const b=await chromium.launch();const page=await b.newPage({viewport:{width:1440,height:1000},locale:'fr-FR'});
 const mutations=[];
 await page.route('**/*',async route=>{const req=route.request();if(!['GET','HEAD'].includes(req.method())){mutations.push({url:req.url(),method:req.method()});return route.abort();}return route.continue();});
 await page.goto('https://outils-ec.fr/roi',{waitUntil:'networkidle'});
 const rows=[];
 for(const n of [0,10,50,100,110,250,260,500]){
  await page.locator('#sDossiers').fill(String(n));
  await page.waitForTimeout(60);
  rows.push({dossiers:n,sortie:await page.locator('#stack').innerText(),detail:await page.locator('#calcTotal').innerText()});
 }
 await page.screenshot({path:path.join(root,'outils-ec-roi','roi-500-desktop.png'),fullPage:true});
 await page.locator('#sDossiers').fill('100');
 await page.screenshot({path:path.join(root,'outils-ec-roi','roi-100-desktop.png'),fullPage:true});
 await fs.writeFile(path.join(root,'outils-ec-roi','manipulations.json'),JSON.stringify({url:page.url(),at:new Date().toISOString(),cost:35,rows,blockedNonGet:mutations},null,2));
 await page.goto('https://www.factory456.com/diagnostic',{waitUntil:'networkidle'});
 await page.screenshot({path:path.join(root,'factory456-diagnostic','diagnostic-premier-ecran.png'),fullPage:true});
 await fs.writeFile(path.join(root,'factory456-diagnostic','texte-rendu.txt'),await page.locator('body').innerText());
 await b.close();
 console.log('8 positions du curseur vérifiées; captures ROI et diagnostic conservées; aucun formulaire envoyé.');
})().catch(e=>{console.error(e);process.exit(1)});
