import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
import {parse} from 'parse5';
const base=dirname(fileURLToPath(import.meta.url));
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const all=(n)=>[n,...(n.childNodes??[]).flatMap(all)];
const text=(n)=> n.nodeName==='#text'?n.value:['script','style','template','noscript'].includes(n.tagName)?'':(n.childNodes??[]).map(text).join(' ');
const rows=JSON.parse(readFileSync(join(base,'live-audit.json'),'utf8')).filter(r=>r.source_file&&r.url.includes('/blog/'));
const summary=rows.map(r=>{
 const html=readFileSync(join(base,r.source_file),'utf8');const dom=parse(html);const nodes=all(dom);const body=nodes.find(n=>(attr(n,'class')??'').split(' ').includes('article-corps'));
 const children=body?all(body):[];const links=children.filter(n=>n.tagName==='a').map(n=>({href:attr(n,'href'),anchor:text(n).trim()}));
 const types=r.schema.flatMap(s=>s['@graph']??[s]).map(s=>s['@type']).flat();
 return {url:r.url,status:r.status,canonical:r.canonical,robots:r.meta.robots,title:r.headings.find(h=>h[0]==='title')?.[1],h1:r.headings.filter(h=>h[0]==='h1').map(h=>h[1]),description:r.meta.description,bodyPresent:!!body,bodyWords:body?text(body).trim().split(/\s+/).length:null,headings:children.filter(n=>/^h[23]$/.test(n.tagName??'')).map(n=>[n.tagName,text(n).trim()]),links,internal:links.filter(l=>l.href?.startsWith('/')),external:links.filter(l=>l.href?.startsWith('https:')),proofs:children.filter(n=>n.tagName==='figure'&&attr(n,'data-blog-proof')!==undefined).length,images:children.filter(n=>n.tagName==='img').map(n=>Object.fromEntries(n.attrs.map(a=>[a.name,a.value]))),hero:r.images[0],schemaTypes:types,hasSommaire:nodes.some(n=>(attr(n,'class')??'').split(' ').includes('article-sommaire') || (n.tagName==='nav'&&/sommaire/i.test(attr(n,'aria-label')??''))),author:html.includes('Kevin Kitanga'),ogTitle:r.meta['og:title']};
});
for(const r of summary)r.bodyIncoming=summary.filter(s=>s.internal.some(l=>l.href===new URL(r.url).pathname)).map(s=>s.url);
writeFileSync(join(base,'onpage-summary.json'),JSON.stringify(summary,null,2));
console.log(JSON.stringify(summary.map(r=>({slug:r.url.split('/').at(-1),words:r.bodyWords,proofs:r.proofs,internal:r.internal.length,incoming:r.bodyIncoming.length,sommaire:r.hasSommaire,bodyPresent:r.bodyPresent,types:r.schemaTypes})),null,2));
