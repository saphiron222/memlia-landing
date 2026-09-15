import { createRequire } from 'node:module';
import { writeFile, mkdir } from 'node:fs/promises';
const require = createRequire('/Users/kevinkitanga/dev/interne/memlia-landing/package.json');
const { chromium } = require('@playwright/test');
const root = new URL('./', import.meta.url);
await mkdir(new URL('screenshots/', root), {recursive:true});
const browser=await chromium.launch({headless:true});
const report={observedAt:new Date().toISOString(),responsive:[],search:[]};
for(const width of [320,375,768,1024,1440,1920]) {
 const page=await browser.newPage({viewport:{width,height:900}});
 for(const route of ['/','/blog']) {
  await page.goto('https://memlia.fr'+route+'?audit='+Date.now(),{waitUntil:'networkidle'});
  const data=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,h1:document.querySelector('h1')?.innerText,nav:[...document.querySelectorAll('header a')].filter(e=>e.getBoundingClientRect().height&&getComputedStyle(e).visibility!=='hidden').map(e=>({text:e.innerText,href:e.getAttribute('href'),height:e.getBoundingClientRect().height})),fonts:[getComputedStyle(document.body).fontFamily,getComputedStyle(document.querySelector('h1')).fontFamily],emailLinks:[...document.querySelectorAll('a')].filter(e=>e.href.includes('mailto:')).map(e=>e.getAttribute('href'))}));
  report.responsive.push({width,route,...data});
  if([375,1440].includes(width))await page.screenshot({path:new URL(`screenshots/${route==='/'?'home':'blog'}-${width}.png`,root).pathname,fullPage:true});
 }
 await page.close();
}
for(const q of ['automatisation cabinet expertise comptable','automatisation Excel cabinet comptable','suivi production sociale cabinet','contrôle bulletins avant DSN']) {
 const page=await browser.newPage();
 try {
  await page.goto('https://www.google.com/search?q='+encodeURIComponent(q)+'&hl=fr&gl=fr&num=10',{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForTimeout(1500);
  report.search.push({query:q,url:page.url(),text:(await page.locator('body').innerText()).slice(0,35000),links:await page.locator('a').evaluateAll(es=>es.map(e=>({text:e.innerText,href:e.href})).filter(e=>e.text))});
 }catch(e){report.search.push({query:q,error:e.message});}
 await page.close();
}
await browser.close();
await writeFile(new URL('browser-audit.json',root),JSON.stringify(report,null,2));
console.log(JSON.stringify({responsive:report.responsive,search:report.search.map(s=>({query:s.query,url:s.url,error:s.error,text:s.text?.slice(0,16000)}))},null,2));
