import {createRequire} from 'node:module';import fs from 'node:fs';
const require=createRequire(process.cwd()+'/package.json');const {chromium}=require('@playwright/test');
const dir='docs/strategy/site-v3/audit-2026-10';const pages=[...new Map(JSON.parse(fs.readFileSync(dir+'/crawl.json')).pages.map(p=>[p.url,p])).values()];
const browser=await chromium.launch();const results=[];
for(const p of pages){
 const page=await browser.newPage({viewport:{width:375,height:812},extraHTTPHeaders:{'Cache-Control':'no-cache'}});
 try{await page.goto(p.url,{waitUntil:'networkidle',timeout:30000});await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
 const axe=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,html:n.html,failureSummary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>v.id)}});
 const dom=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:[...document.querySelectorAll('h1')].map(x=>x.textContent),canonical:[...document.querySelectorAll('link[rel=canonical]')].map(x=>x.href),images:[...document.images].map(i=>({src:i.currentSrc,alt:i.alt,width:i.width,naturalWidth:i.naturalWidth,complete:i.complete})),smallTargets:[...document.querySelectorAll('main a,main button,input,select,textarea')].map(e=>{const r=e.getBoundingClientRect();return {text:e.textContent.trim().slice(0,80),width:r.width,height:r.height}}).filter(r=>r.width>0&&r.height>0&&(r.width<24||r.height<24)),text:document.querySelector('main')?.innerText}));
 if(['/','/contact','/automatisation/paie','/integrations/dsn-silae','/outils-comptables-gratuits','/blog','/glossaire'].includes(p.path)){fs.mkdirSync(dir+'/screenshots',{recursive:true});await page.screenshot({path:dir+'/screenshots/'+(p.path.replaceAll('/','_')||'home')+'-375.png',fullPage:true});await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:dir+'/screenshots/'+(p.path.replaceAll('/','_')||'home')+'-1440.png',fullPage:true});}
 results.push({path:p.path,url:p.url,axe,dom});
 }catch(e){results.push({path:p.path,error:String(e)})}finally{await page.close()}
 fs.writeFileSync(dir+'/browser.json',JSON.stringify(results,null,2));console.log(p.path,results.at(-1).axe?.violations.length,results.at(-1).dom?.scrollWidth);
}
await browser.close();
