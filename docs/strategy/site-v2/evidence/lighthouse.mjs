import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {writeFile} from 'node:fs/promises';
const require=createRequire('/Users/kevinkitanga/dev/interne/memlia-landing/package.json');
const {default:lighthouse}=await import(pathToFileURL(require.resolve('lighthouse')));
const chromeLauncher=await import(pathToFileURL(require.resolve('chrome-launcher')));
const {chromium}=require('@playwright/test');
const root=new URL('./',import.meta.url);
const chrome=await chromeLauncher.launch({chromeFlags:['--headless','--no-sandbox'],chromePath:chromium.executablePath()});
const rows=[];
try{
for (const route of ['/','/blog']) for(const formFactor of ['mobile','desktop']) {
 const opts={port:chrome.port,output:'json',logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo'], ...(formFactor==='desktop'?{preset:'desktop'}:{})};
 const result=await lighthouse('https://memlia.fr'+route,opts);
 const lhr=result.lhr;
 const row={route,formFactor,date:lhr.fetchTime,scores:Object.fromEntries(Object.entries(lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)])),metrics:Object.fromEntries(['largest-contentful-paint','cumulative-layout-shift','total-blocking-time'].map(k=>[k,lhr.audits[k].numericValue])),failed:Object.values(lhr.audits).filter(a=>a.score!==null&&a.score<1).map(a=>({id:a.id,title:a.title,score:a.score,displayValue:a.displayValue}))};
 rows.push(row);await writeFile(new URL('lighthouse-summary.json',root),JSON.stringify(rows,null,2));console.log(JSON.stringify(row));
}
}finally{await chrome.kill();}
const browser=await chromium.launch();
for(const width of [375,1440])for(const route of ['/','/blog']){
 const page=await browser.newPage({viewport:{width,height:900}});await page.goto('https://memlia.fr'+route,{waitUntil:'networkidle'});
 for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=650){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(90);}
 await page.waitForTimeout(800);await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(600);
 await page.screenshot({path:new URL(`screenshots/${route==='/'?'home':'blog'}-${width}-scrolled.png`,root).pathname,fullPage:true});await page.close();
}
await browser.close();
