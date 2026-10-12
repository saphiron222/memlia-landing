import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = dirname(fileURLToPath(import.meta.url));
const slug = 'rapprochement-bancaire-automatise-les-ecarts-a-remonter';
const build = resolve('.qa/render-banque');
const recipe = JSON.parse(readFileSync(join(dir, 'recette.json')));
const results = [];
const check = (id, success, observed) => results.push({id, success: Boolean(success), observed});
const browser = await chromium.launch({channel: 'chromium'});
try {
 const page = await browser.newPage();
 const errors=[]; page.on('pageerror', e => errors.push(e.message));
 for (const width of [390,1280]) {
  await page.setViewportSize({width,height:900});
  const response = await page.goto(`http://127.0.0.1:4328/blog/${slug}.html`);
  await page.evaluate(() => document.fonts.ready);
  check(`http-${width}`,response.status()===200,response.status());
  await page.screenshot({path:join(dir,`vue-${width}.png`)});
  const data=await page.evaluate(() => ({lang:document.documentElement.lang,h1:[...document.querySelectorAll('h1')].map(e=>e.textContent.trim()), canonical:document.querySelector('link[rel=canonical]')?.href, title:document.title, description:document.querySelector('meta[name=description]')?.content, ogTitle:document.querySelector('meta[property="og:title"]')?.content, ogImage:document.querySelector('meta[property="og:image"]')?.content, robots:document.querySelector('meta[name=robots]')?.content, twitter:document.querySelector('meta[name="twitter:card"]')?.content, times:[...document.querySelectorAll('time')].map(x=>x.getAttribute('datetime')), schemas:[...document.querySelectorAll('script[type="application/ld+json"]')].map(e=>JSON.parse(e.textContent)), proofCount:document.querySelectorAll('[data-blog-proof]').length, tables:[...document.querySelectorAll('.article-corps table')].map(t=>({head:t.querySelectorAll('th').length, region:t.parentElement.getAttribute('role'),focus:t.parentElement.getAttribute('tabindex')})), overflow:document.documentElement.scrollWidth>innerWidth, text:document.querySelector('.article-corps')?.textContent, author:[...document.querySelectorAll('a')].find(x=>x.textContent==='Kevin Kitanga')?.textContent}));
  check(`lang-${width}`,data.lang==='fr',data.lang);
  check(`h1-${width}`,data.h1.length===1&&data.h1[0]===recipe.title,data.h1);
  check(`canonical-${width}`,data.canonical===`https://memlia.fr/blog/${slug}`,data.canonical);
  check(`meta-${width}`,data.title===recipe.tabTitle&&data.description===recipe.description,data.title);
  check(`og-${width}`,data.ogTitle===recipe.title&&data.ogImage?.startsWith('https://memlia.fr/'),{title:data.ogTitle,image:data.ogImage});
  check(`date-${width}`,data.times.some(x=>x.startsWith(recipe.date)),data.times);
  check(`author-${width}`,data.author==='Kevin Kitanga',data.author);
  check(`preview-noindex-${width}`,data.robots?.includes('noindex'),data.robots);
  check(`twitter-${width}`,data.twitter==='summary_large_image',data.twitter);
  const schemaText=JSON.stringify(data.schemas);
  check(`schema-${width}`,['BlogPosting','Person','Organization','BreadcrumbList','Kevin Kitanga'].every(x=>schemaText.includes(x)),data.schemas);
  check(`two-figures-${width}`,data.proofCount===2,data.proofCount);
  check(`tables-${width}`,data.tables.length===3&&data.tables.every(t=>t.head>0&&t.region==='region'&&t.focus==='0'),data.tables);
  check(`outer-overflow-${width}`,!data.overflow,data.overflow);
  check(`no-source-heading-${width}`,!/^Sources?\s*$/im.test(data.text), 'aucune section administrative dans le corps');
  for(const proof of page.locator('[data-blog-proof]').all ? await page.locator('[data-blog-proof]').all() : []) {
   await proof.scrollIntoViewIfNeeded();
   await proof.locator('img').evaluate(img=>img.decode());
  }
  const imgs=await page.locator('article img').evaluateAll(xs=>xs.map(x=>({alt:x.alt,loaded:x.complete&&x.naturalWidth>0,src:x.currentSrc})));
  check(`images-loaded-${width}`,imgs.length>=3&&imgs.every(x=>x.loaded&&x.alt),imgs);
  const region=page.locator('.article-corps [role=region]').first();
  await region.focus(); const before=await region.evaluate(x=>x.scrollLeft); await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(150); const after=await region.evaluate(x=>x.scrollLeft);
  const canScroll=await region.evaluate(x=>x.scrollWidth>x.clientWidth);
  check(`table-keyboard-${width}`,!canScroll||after>before,{canScroll,before,after});
  await region.screenshot({path:join(dir,`table-${width}.png`)});
 }
 check('js-errors',errors.length===0,errors);
 const links=[];
 for(const href of recipe.links.outgoing){
  const [path,anchor]=href.split('#'); const file=join(build,path+'.html');
  const found=existsSync(file); const anchorFound=!anchor||(found&&readFileSync(file,'utf8').includes(`id="${anchor}"`));
  links.push({href,found,anchorFound});
 }
 check('internal-link-targets',links.every(x=>x.found&&x.anchorFound),links);
 const images=[];
 for(const width of [768,1200,1600]) for(const format of ['avif','webp']){
  const file=resolve(`public/images/${recipe.image.heroId}-${width}.${format}`); const m=await sharp(file).metadata(); images.push({path:file,width:m.width,height:m.height,format:m.format});
 }
 const og=await sharp(resolve(`public/images/${recipe.image.heroId}-og.webp`)).metadata();
 check('hero-derivatives',images.every(x=>x.width/ x.height===16/9),images);
 check('og-dimensions',og.width===1200&&og.height===630,{width:og.width,height:og.height});
 const proof=JSON.parse(readFileSync(join(dir,'preuve-rejeu.json')));
 const expected=['PROPOSITION_UNIQUE','ECART_OUVERT','REFUS_AMBIGUITE','REFUS_ENTREE'];
 check('replay-scope',proof.resultats.length===4&&proof.resultats.every((x,i)=>x.obtenu.statut===expected[i]),proof.resultats);
} finally {await browser.close();}
const report={slug,scope:'Contrôle auteur de preview privée, pas PASS métier ni preuve de publication',results,success:results.every(x=>x.success)};
writeFileSync(join(dir,'verification-locale.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({success:report.success,checks:results.length,failed:results.filter(x=>!x.success)},null,2));
if(!report.success)process.exitCode=1;
