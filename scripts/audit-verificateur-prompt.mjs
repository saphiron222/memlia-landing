import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { parse } from 'parse5';
const route = '/outils-comptables-gratuits/verificateur-prompt-ia';
const html = readFileSync(`dist${route}.html`, 'utf8');
const doc = parse(html); const nodes=[];
function walk(n){nodes.push(n);for(const c of n.childNodes??[])walk(c);} walk(doc);
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const text=n=>(n.childNodes??[]).map(c=>c.nodeName==='#text'?c.value:text(c)).join('');
assert.equal(nodes.filter(n=>n.tagName==='h1').length,1);
assert.equal(text(nodes.find(n=>n.tagName==='h1')),'Vérificateur de prompt IA');
assert.equal(attr(nodes.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical'),'href'),'https://memlia.fr'+route);
assert.ok(!html.includes('noindex'));
const graph=nodes.filter(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json').flatMap(n=>JSON.parse(text(n))['@graph']??[]);
for(const type of ['WebPage','WebApplication','BreadcrumbList'])assert.ok(graph.some(n=>n['@type']===type));
assert.ok(!graph.some(n=>['Article','BlogPosting','AggregateRating'].includes(n['@type'])));
assert.ok(readFileSync('dist/sitemap-outils.xml','utf8').includes('https://memlia.fr'+route));
for(const source of ['/outils-comptables-gratuits','/outils-comptables-gratuits/generateur-prompt-expert-comptable','/methode']) assert.ok(readFileSync(`dist${source}.html`,'utf8').includes(`href="${route}"`),source);
for(const img of nodes.filter(n=>n.tagName==='img')) { assert.ok(attr(img,'alt')); assert.ok(attr(img,'width')); assert.ok(attr(img,'height')); const src=attr(img,'src'); if(src?.startsWith('/'))assert.ok(existsSync('dist'+src)); }
const localLinks=nodes.filter(n=>n.tagName==='a').map(n=>attr(n,'href')).filter(h=>h?.startsWith('/'));
for(const href of localLinks){const path=href.split('#')[0]; assert.ok(existsSync('dist'+(path==='/'?'/index.html':path+'.html'))||existsSync('dist'+path),href);}
assert.ok(html.includes("connect-src 'none'")||html.includes('connect-src &#39;none&#39;'));
console.log('PASS : DOM, schémas, canonical, sitemap, trois entrants, médias et destinations internes existants.');
