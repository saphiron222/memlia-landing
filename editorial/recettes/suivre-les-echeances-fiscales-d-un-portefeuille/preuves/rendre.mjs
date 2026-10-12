import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri';
import { injecterPreuvesInline } from '../../../../scripts/blog-forge.mjs';
const dir=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const root=resolve(dir,'../../..');
const proof=join(dir,'preuves');
const output=join(proof,'figures');mkdirSync(output,{recursive:true});
const read=(p)=>JSON.parse(readFileSync(p,'utf8'));
const replay=read(join(proof,'rejeu.json'));
const recipe=read(join(dir,'recette.json'));
const esc=(t)=>String(t).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const hash=(v)=>createHash('sha256').update(v).digest('hex');
const row=(cells,cl='')=>`<div class="${cl}">${cells.map(c=>`<span>${c}</span>`).join('')}</div>`;
const pill=(t,cl='grey')=>`<em class="pill ${cl}">${esc(t)}</em>`;
const frame=(id,name,content)=>`<section class="frame" id="${id}"><article class="window full"><header class="window-bar"><span class="dot green"></span><b>${name}</b><span>Jeu d’essai fictif · TVA · 2026-09</span></header>${content}</article></section>`;
const registre=frame('fiscal-registre-portefeuille','Registre des échéances',`<div class="screen"><div class="toolbar"><div><small>Portefeuille de démonstration</small><b>TVA · septembre 2026</b></div><nav class="tabs"><span class="on">Registre</span><span>Retours</span><span>Paiements</span></nav></div><div class="data-table" style="--cols:.48fr .7fr 1.55fr .85fr">${row(['Ligne','Date dossier','Statut proposé','Paiement'],'table-head')}${replay.cas.slice(0,7).map(c=>row([esc(c.id),c.entree.date_confirmee?'Confirmée':'À qualifier',pill(c.obtenu,c.id==='F-07'?'green':c.id==='F-05'?'amber':'grey'),c.entree.paiement==='confirme'?'Confirmé':'À vérifier'],c.id==='F-01'||c.id==='F-05'?'sel':'')).join('')}</div><div class="footer-band"><b>F-03</b>${pill('Préparation prête')}<span>Transmission : aucune</span></div></div>`);
const agrege=frame('fiscal-files-agregees','Files du portefeuille',`<div class="screen"><div class="toolbar"><div><small>12 lignes importées · 11 clés uniques</small><b>Vue par état</b></div><nav class="tabs"><span class="on">Files</span><span>Doublons</span></nav></div><div class="counters">${Object.entries(replay.agrege).map(([k,v])=>`<div class="${k==='Éléments confirmés'?'c-green':k==='À qualifier ou reprendre'?'c-amber':'c-grey'}"><b>${v}</b><span>${esc(k)}</span></div>`).join('')}</div><div class="data-table" style="--cols:.6fr 1.3fr 1.3fr">${row(['Ligne','Motif','Statut proposé'],'table-head')}${replay.cas.filter(c=>['F-01','F-05','F-08','F-09','F-10','F-11','F-12'].includes(c.id)).map(c=>row([esc(c.id),esc({'F-01':'Date inconnue','F-05':'Retour rejeté','F-08':'Retour sans transmission','F-09':'Libellé inconnu','F-10':'Situation non qualifiée','F-11':'Copie de F-03','F-12':'Période du retour différente'}[c.id]),pill(c.obtenu,'amber')],c.id==='F-11'?'sel':'')).join('')}</div></div>`);
const frames=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Figures fiscales fictives</title><link rel="stylesheet" href="../../../../docs/design/blog-article-proofs/styles.css"></head><body><main>${registre}${agrege}</main></body></html>`;
writeFileSync(join(proof,'figures.html'),frames);
const browser=await chromium.launch({channel:'chromium'});
try {
 const page=await browser.newPage({viewport:{width:1720,height:1000},deviceScaleFactor:1});
 const failures=[];page.on('requestfailed',r=>failures.push(r.url()));page.on('pageerror',e=>failures.push(e.message));
 await page.goto(pathToFileURL(join(proof,'figures.html')).href);await page.evaluate(()=>document.fonts.ready);assert.deepEqual(failures,[]);
 await page.addStyleTag({content:'body{padding:0}main{display:block}.frame{display:none}.frame[data-render]{display:grid}'});
 const records=[];
 for(const p of recipe.inlineProofs) {
  await page.evaluate(id=>{document.querySelector('[data-render]')?.removeAttribute('data-render');document.getElementById(id).setAttribute('data-render','');},p.id);
  const element=page.locator('#'+p.id);
  const check=await element.evaluate(root=>{
   const clipped=[],hidden=[],texts=[];const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
   while(walker.nextNode()){
    const node=walker.currentNode;if(!node.textContent.trim())continue;texts.push(node.textContent.trim());
    const range=document.createRange();range.selectNodeContents(node);const rects=[...range.getClientRects()];
    if(!rects.length)hidden.push(node.textContent.trim());
    for(const r of rects){let a=node.parentElement;while(a){const css=getComputedStyle(a);if(css.display==='none'||css.visibility==='hidden')hidden.push(node.textContent.trim());if(a===root||['hidden','clip'].includes(css.overflow)){const b=a.getBoundingClientRect();if(r.left<b.left-1||r.top<b.top-1||r.right>b.right+1||r.bottom>b.bottom+1)clipped.push(node.textContent.trim());}if(a===root)break;a=a.parentElement;}}
   }
   const b=root.getBoundingClientRect();return{width:b.width,height:b.height,text:texts.join(' '),clipped,hidden};
  });
  assert.equal(check.width,1600);assert.equal(check.height,900);assert.deepEqual(check.clipped,[],p.id);assert.deepEqual(check.hidden,[],p.id);
  const png=await element.screenshot({path:join(output,p.id+'.png'),animations:'disabled'});
  const webp=await sharp(png).webp({quality:88,effort:6}).toBuffer();assert.ok(webp.length<150000);writeFileSync(join(output,p.id+'.webp'),webp);
  records.push({...p,centralText:check.text,article:recipe.slug,width:1600,height:900,bytes:webp.length,sha256:hash(webp),clipped:check.clipped,hidden:check.hidden});
 }
 writeFileSync(join(proof,'figures-contract.json'),JSON.stringify(records,null,2)+'\n');
 const processor=await createSatteriMarkdownProcessor({syntaxHighlight:false});
 const body=readFileSync(join(dir,'corps.md'),'utf8');
 let rendered=await processor.render(injecterPreuvesInline(body,recipe.inlineProofs));
 for(const p of recipe.inlineProofs)rendered.code=rendered.code.replace(`/proofs/blog/${p.id}.webp`,`figures/${p.id}.webp`);
 const toc=rendered.metadata.headings.filter(h=>h.depth===2).map(h=>`<a href="#${h.slug}">${esc(h.text)}</a>`).join('');
 const html=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(recipe.tabTitle)}</title><meta name="description" content="${esc(recipe.description)}"><meta name="robots" content="noindex"><style>@font-face{font-family:Hanken;src:url('../../../../public/fonts/hanken-400.woff2')}@font-face{font-family:Fraunces;src:url('../../../../public/fonts/fraunces-600.woff2')}*{box-sizing:border-box}body{margin:0;background:#fffefb;color:#231f20;font:18px/1.7 Hanken,sans-serif}main{max-width:880px;margin:auto;padding:40px 24px}h1,h2,h3{font-family:Fraunces,serif;line-height:1.2}h1{font-size:44px}h2{margin-top:56px}a{color:#1c8a41}img{max-width:100%;height:auto}figure{margin:32px 0}table{border-collapse:collapse;width:100%;font-size:16px}td,th{border:1px solid #dedbd2;padding:12px;text-align:left}th{background:#fcfbf7}nav{display:grid;gap:8px}@media(max-width:600px){h1{font-size:30px}table{display:block;overflow-x:auto}main{padding:24px 16px}}</style></head><body><main><small>Aperçu de fabrication local, pas la page de production</small><h1>${esc(recipe.title)}</h1><p>Kevin Kitanga · ${recipe.date}</p><p>${esc(recipe.summary)}</p><img src="image/hero-1200.webp" alt="${esc(recipe.image.alt)}" width="1200" height="675"><nav aria-label="Sommaire">${toc}</nav><article class="article-corps">${rendered.code}</article><aside><h2>Et dans votre cabinet ?</h2><p>${esc(recipe.cta.outcome)}</p><a href="https://memlia.fr/contact">${esc(recipe.cta.label)}</a></aside></main></body></html>`;
 writeFileSync(join(proof,'apercu.html'),html);
 await page.goto(pathToFileURL(join(proof,'apercu.html')).href);await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('h1').count(),1);
 assert.equal(await page.locator('[data-blog-proof]').count(),2);
 assert.equal(await page.locator('thead').count(),4);
 const stats={h1:await page.locator('h1').count(),h2:await page.locator('article h2').count(),h3:await page.locator('article h3').count(),figures:await page.locator('[data-blog-proof]').count(),tables:await page.locator('article table').count(),thead:await page.locator('thead').count(),bodyWords:body.split(/\s+/).length,publicationSurface:false,notes:'Rendu réel Markdown Astro Satteri, aperçu local noindex ; gabarit public et JSON-LD final à vérifier à la matérialisation.'};
 for(const width of [1440,390]) {await page.setViewportSize({width,height:1000});const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false,`débordement ${width}`);await page.screenshot({path:join(proof,`apercu-${width}.png`),fullPage:true});}
 writeFileSync(join(proof,'rendu-controles.json'),JSON.stringify({...stats,figures:records.map(r=>({id:r.id,bytes:r.bytes,clipped:r.clipped,hidden:r.hidden})),browserFailures:failures},null,2)+'\n');
 console.log(JSON.stringify({...stats,bytesFigures:records.map(r=>r.bytes)},null,2));
}finally{await browser.close();}
