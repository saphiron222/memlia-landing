/** Restitutions fictives rendues depuis les données, puis reprises par render-social-images.mjs. */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { ROBOTS } from '../src/data/robots.ts';
const escape = (s) => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const font=readFileSync('public/fonts/hanken-400.woff2').toString('base64');
const browser=await chromium.launch({channel:'chromium'});
const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
mkdirSync('public/robots/restitutions',{recursive:true});
const records=[];
for(const robot of ROBOTS){
 const html=`<!doctype html><html lang="fr"><meta charset="utf-8"><style>@font-face{font-family:Hanken;src:url(data:font/woff2;base64,${font})}*{box-sizing:border-box}body{margin:0;background:#fffefb;color:#231f20;font:19px/1.35 Hanken,Arial}main{padding:30px 44px;width:1200px;height:630px}header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}h1{font-size:27px;margin:0}header p{font-size:18px;color:#176f37;margin:0}table{width:100%;border-collapse:collapse}caption{text-align:left;color:#605c5a;margin-bottom:14px;font-size:17px}th,td{text-align:left;padding:17px 15px;border-bottom:1px solid #e5e3dd;vertical-align:top}thead{background:#f5f4ef}th{font-weight:400}tbody th{width:31%}td:last-child{width:13%;font-weight:bold;color:#176f37}tr[data-arret="true"]{background:#fbecea}tr[data-arret="true"] td:last-child{color:#a4322a}footer{font-size:16px;margin-top:18px;color:#605c5a}</style><main><header><h1>${escape(robot.nom)}</h1><p>Dossier fictif · Memlia</p></header><table><caption>${escape(robot.demonstration.dossier)}</caption><thead><tr><th>Cas joué</th><th>Sortie obtenue</th><th>Décision</th></tr></thead><tbody>${robot.demonstration.cas.map(c=>`<tr data-arret="${c.decision==='Arrêt'}"><th>${escape(c.cas)}</th><td>${escape(c.sortie)}</td><td>${escape(c.decision)}</td></tr>`).join('')}</tbody></table><footer>Une routine prise en charge. Les exceptions et décisions reviennent à votre cabinet.</footer></main></html>`;
 await page.setContent(html);await page.evaluate(()=>document.fonts.ready);
 const size=await page.locator('main').evaluate(el=>({h:el.scrollHeight,w:el.scrollWidth}));
 if(size.h>630||size.w>1200)throw Error(`Restitution sociale débordante : ${robot.id}`);
 const png=await page.screenshot({animations:'disabled'});
 const target=`public/robots/restitutions/${robot.id}.webp`;
 await sharp(png).webp({quality:90}).toFile(target);
 records.push({robot:robot.id,path:target,sourceHash:createHash('sha256').update(JSON.stringify(robot.demonstration)).digest('hex'),width:1200,height:630});
}
await browser.close();
writeFileSync('docs/strategy/site-v3/hub-robots/social-manifest.json',JSON.stringify({renderer:'scripts/render-robots-socials.mjs',records},null,2)+'\n');
console.log(`${records.length} restitutions fictives 1200 × 630 rendues.`);
