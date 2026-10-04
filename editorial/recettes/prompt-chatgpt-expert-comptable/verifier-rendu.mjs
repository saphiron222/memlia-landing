import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'parse5';
const renderedPath = process.argv[2];
assert.ok(renderedPath, 'Usage : node verifier-rendu.mjs <chemin-du-rendu-html>');
const html = readFileSync(resolve(renderedPath), 'utf8');
const doc = parse(html);
const nodes = [];
function walk(node) { if (node.tagName) nodes.push(node); for (const child of node.childNodes ?? []) walk(child); }
walk(doc);
const attr = (node, key) => node.attrs?.find((entry) => entry.name === key)?.value;
const text = (node) => (node.childNodes ?? []).map((child) => child.value ?? text(child)).join('');
function nodesIn(node) { return [node, ...(node.childNodes ?? []).flatMap(nodesIn)]; }
const faq = nodes.filter((node) => node.tagName === 'p').map(text).find((value) => value.startsWith('Pas dans cet exemple'));
assert.ok(faq?.includes('gardez le cas fictif'));
assert.ok(!faq.includes('CNIL'));
assert.equal(nodes.filter((node) => node.tagName === 'h1').length, 1);
assert.deepEqual(nodes.filter((node) => node.tagName === 'meta' && attr(node, 'name') === 'robots').map((node) => attr(node, 'content')), ['noindex, follow']);
const canonical = nodes.find((node) => node.tagName === 'link' && attr(node, 'rel') === 'canonical');
assert.equal(attr(canonical, 'href'), 'https://memlia.fr/blog/prompt-chatgpt-expert-comptable');
const links = nodes.filter((node) => node.tagName === 'a').map((node) => attr(node, 'href'));
for (const link of ['/contact', '/methode', '/glossaire#validation-humaine', '/blog/automatiser-la-relance-des-pieces-clients', '/blog/automatiser-un-cabinet-comptable-la-carte-des-taches']) assert.ok(links.includes(link), link);
assert.ok(html.includes('Demande déjà partie'));
const recipe = JSON.parse(readFileSync(new URL('./recette.json', import.meta.url), 'utf8'));
const articleHeader = nodes.find((node) => node.tagName === 'header' && attr(node, 'class')?.split(/\s+/).includes('article-tete'));
assert.ok(articleHeader, 'En-tête de l’article absent');
assert.ok(nodesIn(articleHeader).some((node) => node.tagName === 'time' && attr(node, 'datetime') === recipe.date), `Date de publication absente ou différente de la recette : ${recipe.date}`);
const structured = nodes.filter((node) => node.tagName === 'script' && attr(node, 'type') === 'application/ld+json').map(text).flatMap((value) => { const parsed = JSON.parse(value); return Array.isArray(parsed['@graph']) ? parsed['@graph'] : [parsed]; });
assert.ok(structured.some((entry) => entry['@type'] === 'BlogPosting' && entry.datePublished?.startsWith(recipe.date)), 'Date BlogPosting absente ou incohérente');
for (const source of recipe.sources) {
  const proof = JSON.parse(readFileSync(new URL(`../../articles/${recipe.slug}/preuves/sources/${source.id}.json`, import.meta.url), 'utf8'));
  const entry = nodes.find((node) => node.tagName === 'li' && node.parentNode?.tagName === 'ol' && node.parentNode?.parentNode?.tagName === 'section' && attr(node.parentNode.parentNode, 'class')?.includes('article-sources') && nodesIn(node).some((child) => child.tagName === 'a' && attr(child, 'href') === source.url));
  assert.ok(entry, `Source absente du rendu : ${source.id}`);
  assert.ok(nodesIn(entry).some((child) => child.tagName === 'time' && attr(child, 'datetime') === proof.checkedAt), `Date de consultation incohérente : ${source.id}`);
}
console.log(JSON.stringify({ faq, canonical: attr(canonical, 'href'), robots: 'noindex, follow', publicationDate: recipe.date, requiredLinksPresent: true, thirdCasePresent: true, renderedPath: resolve(renderedPath) }));
