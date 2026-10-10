import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const slug='generateur-relance-facture-impayee';
const route=`/outils-comptables-gratuits/${slug}`;
const read=p=>readFileSync(`dist${p}.html`,'utf8');
test('HTML construit : intention, canonical, schémas, CTA et confidentialité',()=>{
 const html=read(route); const h1='Générateur de relance de facture impayée';
 assert.match(html,new RegExp(`<h1[^>]*>\\s*${h1}`));
 assert.match(html,new RegExp(`rel="canonical" href="https://memlia.fr${route}"`));
 assert.match(html,new RegExp(`property="og:title" content="${h1}"`));
 for(const type of ['WebPage','WebApplication','BreadcrumbList']) assert.ok(html.includes(`"@type":"${type}"`),type);
 assert.ok(html.includes('/proofs/v2/og/44-outil-relance-facture.webp'));
 assert.ok(html.includes('Confier une première tâche'));
 assert.ok(html.includes("connect-src &#39;none&#39;")||html.includes("connect-src 'none'"));
 assert.doesNotMatch(html,/static\.cloudflareinsights\.com|noindex/);
});
test('HTML construit : trois entrants, footer et sitemap',()=>{
 for(const p of ['/methode','/automatisation-cabinet-comptable','/outils-comptables-gratuits']) assert.ok(read(p).includes(`href="${route}"`),p);
 assert.ok(readFileSync('dist/index.html','utf8').includes(`href="${route}"`),'footer');
 assert.ok(readFileSync('dist/sitemap-outils.xml','utf8').includes(`https://memlia.fr${route}`));
});
