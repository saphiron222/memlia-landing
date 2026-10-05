import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { parse } from 'parse5';
const route = '/outils-comptables-gratuits/generateur-prompt-ia-gratuit';
const html = readFileSync(`dist${route}.html`, 'utf8');
const doc = parse(html); const nodes = [];
function visit(node) { nodes.push(node); for (const child of node.childNodes ?? []) visit(child); }
visit(doc);
const attr = (node, name) => node.attrs?.find((entry) => entry.name === name)?.value;
const text = (node) => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join(' ');
const h1 = nodes.filter((node) => node.tagName === 'h1'); assert.equal(h1.length, 1); assert.equal(text(h1[0]).trim(), 'Générateur de prompt IA gratuit');
assert.ok(nodes.some((node) => node.tagName === 'link' && attr(node, 'rel') === 'canonical' && attr(node, 'href') === `https://memlia.fr${route}`));
assert.ok(nodes.some((node) => attr(node, 'property') === 'og:title' && attr(node, 'content') === 'Générateur de prompt IA gratuit'));
assert.ok(!/noindex/i.test(nodes.find((node) => attr(node, 'name') === 'robots') && attr(nodes.find((node) => attr(node, 'name') === 'robots'), 'content')));
assert.match(html, /connect-src 'none'/);
const schemas = nodes.filter((node) => attr(node, 'type') === 'application/ld+json').flatMap((node) => JSON.parse(text(node))['@graph'] ?? []);
for (const type of ['WebPage', 'WebApplication', 'BreadcrumbList']) assert.ok(schemas.some((node) => node['@type'] === type));
assert.ok(!schemas.some((node) => ['Article','BlogPosting'].includes(node['@type'])));
for (const label of ['Une consigne texte professionnelle', 'Formats et contraintes', 'Tester et réviser', 'image ou vidéo', 'sans inscription']) assert.ok(text(doc).includes(label), label);
for (const source of ['/outils-comptables-gratuits', '/methode', '/outils-comptables-gratuits/generateur-prompt-expert-comptable']) {
  const sourceHtml = readFileSync(`dist${source}.html`, 'utf8');
  assert.ok(sourceHtml.split('</main>')[0].includes(`href="${route}"`), source);
}
assert.ok(readFileSync('dist/sitemap-0.xml','utf8').includes(`https://memlia.fr${route}`));
for (const path of ['public/proofs/v2/01-outil-prompt-ia.webp', 'public/proofs/v2/og/01-outil-prompt-ia.webp']) assert.ok(existsSync(path));
const registry = JSON.parse(readFileSync('docs/strategy/site-v3/mesures/registre-requetes.json','utf8'));
const entry = registry.articles.find((row) => row.slug === 'generateur-prompt-ia-gratuit');
assert.equal(entry.type, 'outil');
const normalize = (value) => value.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().trim().replace(/\s+/g,' ');
assert.equal(registry.articles.filter((row) => normalize(row.requete) === normalize(entry.requete)).length, 1);
console.log('PASS : rendu statique outil 06, primaire unique, SEO/schema/corps, trois entrants, médias et sitemap.');
