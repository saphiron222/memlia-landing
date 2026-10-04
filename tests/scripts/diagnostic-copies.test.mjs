import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { verifierCopies } from '../../docs/strategy/site-v3/mesures/diagnostic-2026-10-03/verifier-livraison.mjs';

const base = new URL('../../docs/strategy/site-v3/mesures/diagnostic-2026-10-03/', import.meta.url);
const read = (path) => readFileSync(new URL(path, base));
const live = JSON.parse(read('live-audit.json'));
const pages = JSON.parse(read('onpage-summary.json'));
const sitemap = read('live/sitemap-0.xml').toString();
const check = (rows = live, summary = pages, reader = read, xml = sitemap) => verifierCopies(rows, summary, reader, xml);

test('les copies historiques complètes passent sans écrire de preuve', () => {
  assert.equal(check().length, pages.length);
});
for (const [name, summary] of [
  ['vide', []], ['omission', pages.slice(1)], ['doublon', [...pages, pages[0]]],
]) test(`résumé ${name} rejeté`, () => assert.throws(() => check(live, summary)));
for (const [name, rows] of [
  ['vide', []], ['omission', live.filter((row) => row.url !== pages[0].url)], ['doublon', [...live, live.find((row) => row.url === pages[0].url)]],
]) test(`snapshot ${name} rejeté`, () => assert.throws(() => check(rows)));
test('article absent du sitemap rejeté', () => {
  assert.throws(() => check(live, pages, read, sitemap.replace(`<loc>${pages[0].url}</loc>`, '<loc>https://memlia.fr/absent</loc>')), /absent du sitemap/);
});

const source = live.find((row) => row.url === pages[0].url);
test('URL seulement dans un commentaire XML rejetée', () => {
  const loc = `<loc>${source.url}</loc>`;
  const altered = sitemap.replace(loc, `<loc>https://memlia.fr/absent</loc><!--${loc}-->`);
  assert.notEqual(altered, sitemap);
  assert.throws(() => check(live, pages, read, altered), /absent du sitemap/);
});
test('URL hors de url/loc rejetée', () => {
  const loc = `<loc>${source.url}</loc>`;
  const altered = sitemap.replace(loc, `<loc>https://memlia.fr/absent</loc><extra>${loc}</extra>`);
  assert.throws(() => check(live, pages, read, altered), /absent du sitemap/);
});
for (const omitted of [false, true]) test(`collecte 503 sans copie, résumé ${omitted ? 'omis' : 'conservé'} : rejetée`, () => {
  const rows = structuredClone(live);
  const failed = rows.find((row) => row.url === source.url);
  failed.status = 503;
  delete failed.source_file;
  const summary = structuredClone(pages).filter((page) => !omitted || page.url !== source.url);
  if (omitted) for (const page of summary) page.bodyIncoming = page.bodyIncoming.filter((url) => url !== source.url);
  assert.throws(() => check(rows, summary), /Collecte HTTP/);
});
test('collecte 200 sans copie rejetée même si omise du résumé', () => {
  const rows = structuredClone(live);
  delete rows.find((row) => row.url === source.url).source_file;
  assert.throws(() => check(rows, pages.slice(1)), /Copie absente/);
});
const html = read(source.source_file).toString();
const mutations = [
  ['ensemble des métadonnées absent', '<html><head><meta name="robots" content="noindex"></head><body>aucun article</body></html>'],
  ['canonical absent', html.replace(/<link\b[^>]*rel="canonical"[^>]*>/gi, '')],
  ['h1 absent', html.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi, '')],
  ['corps absent', html.replace(/article-corps/g, 'corps-retire')],
  ['schema absent', html.replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '')],
  ['noindex', html.replace(/name="robots" content="[^"]*"/gi, 'name="robots" content="noindex"')],
];
for (const [name, altered] of mutations) test(`HTML ${name}, condensat cohérent : rejeté`, () => {
  assert.notEqual(altered, html, 'La mutation doit changer le témoin');
  const raw = Buffer.from(altered);
  const rows = structuredClone(live);
  rows.find((row) => row.url === source.url).sha256 = createHash('sha256').update(raw).digest('hex');
  assert.throws(() => check(rows, pages, (path) => path === source.source_file ? raw : read(path)));
});
