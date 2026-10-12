import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'parse5';
import sharp from 'sharp';
import {createServer} from 'node:http';
import {chromium} from '@playwright/test';
const slugs=['automatiser-un-cabinet-cac-la-carte-des-taches','cac-reception-fec-constat'];
const out='docs/qa/cac-f4-livraison/editorial';fs.mkdirSync(out,{recursive:true});
const dist=path.resolve('.qa/render-cac-f4');
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)];
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const findRoute=route=>[path.join(dist,route),path.join(dist,route+'.html'),path.join(dist,route,'index.html')].find(p=>fs.existsSync(p)&&fs.statSync(p).isFile());
const server=createServer((req,res)=>{const u=new URL(req.url,'http://localhost');const p=findRoute(decodeURIComponent(u.pathname));if(!p||!path.resolve(p).startsWith(dist+'/')){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':path.extname(p)==='.html'?'text/html; charset=utf-8':({'.css':'text/css','.js':'application/javascript','.avif':'image/avif','.webp':'image/webp','.woff2':'font/woff2'}[path.extname(p)]??'application/octet-stream')});res.end(fs.readFileSync(p));});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;
const results=[];let browser;
try{
 browser=await chromium.launch({headless:true});
 for(const slug of slugs){
  const recipe=JSON.parse(fs.readFileSync(`editorial/recettes/${slug}/recette.json`));
  const body=fs.readFileSync(`editorial/recettes/${slug}/corps.md`,'utf8');
  const html=fs.readFileSync(findRoute('/blog/'+slug),'utf8');const nodes=walk(parse(html));
  const meta=Object.fromEntries(nodes.filter(n=>n.tagName==='meta').map(n=>[attr(n,'name')??attr(n,'property'),attr(n,'content')]));
  const article=nodes.find(n=>(attr(n,'class')??'').split(/\s+/).includes('article-corps'));const inside=walk(article);
  const headings=nodes.filter(n=>/^h[1-6]$/.test(n.tagName??'')).map(n=>({level:Number(n.tagName.slice(1)),text:text(n).trim()}));
  const hierarchyErrors=headings.filter((h,i)=>i&&h.level>headings[i-1].level+1);
  const links=inside.filter(n=>n.tagName==='a').map(n=>({href:attr(n,'href'),anchor:text(n).trim()}));
  const internal=[];for(const l of links.filter(l=>l.href.startsWith('/'))){const u=new URL(l.href,origin);const p=findRoute(u.pathname);let fragmentExists=null;if(p&&u.hash)fragmentExists=walk(parse(fs.readFileSync(p,'utf8'))).some(n=>attr(n,'id')===decodeURIComponent(u.hash.slice(1)));internal.push({...l,status:(await fetch(origin+u.pathname)).status,fragmentExists});}
  const schema=nodes.filter(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json').flatMap(n=>JSON.parse(text(n))['@graph']??[]);
  const posting=schema.find(n=>n['@type']==='BlogPosting');
  const images=[];for(const n of nodes.filter(n=>n.tagName==='img')){const src=attr(n,'src');if(!src?.startsWith('/'))continue;const p=findRoute(src);const m=p?await sharp(p).metadata():null;images.push({src,alt:attr(n,'alt'),width:attr(n,'width'),height:attr(n,'height'),loading:attr(n,'loading')??null,bytes:p?fs.statSync(p).size:null,format:m?.format,pixelWidth:m?.width,pixelHeight:m?.height,http:(await fetch(origin+src)).status});}
  const derivatives=[];for(const p of fs.readdirSync('public/images').filter(f=>f.startsWith(recipe.image.heroId+'-'))){const abs='public/images/'+p;const m=await sharp(abs).metadata();derivatives.push({path:abs,bytes:fs.statSync(abs).size,width:m.width,height:m.height,format:m.format});}
  const viewports=[];for(const width of [375,1440]){const page=await browser.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));const response=await page.goto(origin+'/blog/'+slug,{waitUntil:'networkidle'});await page.evaluate(async()=>{await document.fonts.ready;for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});const v=await page.evaluate(()=>({documentWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,bodyCharacters:document.querySelector('.article-corps').textContent.trim().length,missingImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),tables:[...document.querySelectorAll('.article-corps table')].map(t=>({scrollContainer:t.parentElement.hasAttribute('data-table-scroll'),head:!!t.querySelector('thead')})),cta:[...document.querySelectorAll('a[href="/contact"]')].map(a=>a.textContent.trim())}));await page.screenshot({path:`${out}/${slug}-${width}-haut.png`});viewports.push({width,http:response.status(),errors,...v});await page.close();}
  const canonical=attr(nodes.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical'),'href');
  const primaryCollision=[];for(const f of fs.readdirSync('editorial/recettes')){const p=`editorial/recettes/${f}/recette.json`;if(f!==slug&&fs.existsSync(p)){const other=JSON.parse(fs.readFileSync(p));if(other.primaryQuery?.toLowerCase()===recipe.primaryQuery.toLowerCase())primaryCollision.push(f);}}
  const reciprocal=links.filter(l=>l.href.startsWith('/blog/')).map(l=>{const p=findRoute(l.href);return {href:l.href,backlink:p?fs.readFileSync(p,'utf8').includes(`href="/blog/${slug}"`):false};});
  const forbidden=['—','nous constatons','complément Excel','Memlia peut','le service ne fournit pas'].filter(w=>body.includes(w));
  const checks={oneH1:headings.filter(h=>h.level===1).length===1,hierarchy:!hierarchyErrors.length,canonical:canonical===`https://memlia.fr/blog/${slug}`,ogTitle:meta['og:title']===recipe.title,ogUrl:meta['og:url']===canonical,description:meta.description===recipe.description,twitter:meta['twitter:card']==='summary_large_image',schemaAuthor:schema.some(s=>s['@type']==='Person'&&s.name==='Kevin Kitanga'),schemaHeadline:posting?.headline===recipe.title,dates:posting?.datePublished?.startsWith(recipe.date)&&posting?.dateModified?.startsWith(recipe.date),allInternalLinks:internal.every(l=>l.status===200&&l.fragmentExists!==false),allImages:images.every(i=>i.http===200&&i.alt&&i.width&&i.height),noPrimaryCollision:primaryCollision.length===0,voice:forbidden.length===0,browser:viewports.every(v=>v.http===200&&v.documentWidth<=v.width&&!v.errors.length&&!v.missingImages.length)};
  results.push({slug,checks,title:text(nodes.find(n=>n.tagName==='title')),titleLength:text(nodes.find(n=>n.tagName==='title')).length,descriptionLength:meta.description.length,meta,canonical,headings,hierarchyErrors,links,internal,reciprocal,images,derivatives,schemaTypes:schema.map(s=>s['@type']),robotsIsPreview:meta.robots?.includes('noindex'),viewports,primaryCollision,forbidden,paragraphs:body.split(/\n\s*\n/).length,words:body.split(/\s+/).length});
 }
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
const result={observedAt:new Date().toISOString(),scope:'Contrôles locaux de fabrication, non revue indépendante ni production',performance:{Lighthouse:'non mesure',CWV:'non mesure, URLs non publiees'},results};fs.writeFileSync(out+'/CONTROLES.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(results.map(r=>({slug:r.slug,checks:r.checks,titleLength:r.titleLength,descriptionLength:r.descriptionLength,reciprocal:r.reciprocal,images:r.images.map(i=>({src:i.src,bytes:i.bytes})),previewNoindex:r.robotsIsPreview})),null,2));if(results.some(r=>Object.values(r.checks).some(v=>!v)))process.exitCode=1;
