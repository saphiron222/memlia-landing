import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { parse } from 'parse5';
import { BLOG_SKILLS, SEO_SKILLS } from '../../../../../scripts/lib/blog-pipeline.mjs';

const base = dirname(fileURLToPath(import.meta.url));
const root = resolve(base, '../../../../..');
const json = (path) => JSON.parse(readFileSync(path, 'utf8'));
const file = (name) => json(join(base, name));
export function verifierCouverture(matrix, catalogueNames, packNames) {
  const expected = new Set(['blog', 'seo', ...BLOG_SKILLS, ...SEO_SKILLS, ...catalogueNames, ...packNames]);
  const entries = new Map();
  const states = new Set(['lu', 'execute', 'partiel', 'indisponible', 'a-executer', 'N/A']);
  for (const entry of matrix.skills) {
    assert(!entries.has(entry.skill), `Doublon : ${entry.skill}`);
    assert(expected.has(entry.skill), `Hors union : ${entry.skill}`);
    assert.equal(typeof entry.applicable, 'boolean', `Applicabilité : ${entry.skill}`);
    for (const key of ['chemin_lu', 'motif', 'phase', 'limites', 'controle_restant']) assert(entry[key]?.trim(), `${entry.skill} : ${key} manquant`);
    for (const phase of ['diagnostic', 'briefs']) assert(states.has(entry[phase]), `${entry.skill} : état ${phase} invalide`);
    assert(Array.isArray(entry.preuves), `Preuves : ${entry.skill}`);
    if (entry.diagnostic === 'execute' || entry.briefs === 'execute') assert(entry.preuves.length, `Exécution sans preuve : ${entry.skill}`);
    for (const proof of entry.preuves) assert(matrix.preuves_existantes[proof], `Preuve inconnue : ${entry.skill}/${proof}`);
    entries.set(entry.skill, entry);
  }
  assert.deepEqual([...entries.keys()].sort(), [...expected].sort(), 'Omission du catalogue/pack/pipeline');
  return { union: expected.size, uniques: entries.size, omissions: [] };
}

function main() {
  const matrixPath = resolve(process.argv[2] || join(base, 'couverture-livraison.json'));
  const cataloguePath = resolve(process.argv[3] || join(base, 'catalogue-hermes.json'));
  const matrix = json(matrixPath);
  const catalogue = json(cataloguePath).skills.filter((s) => /^(blog|seo)(-|$)/.test(s.name)).map((s) => s.name);
  const pack = readdirSync(matrix.base_chemins_lus).filter((name) => /^(blog|seo)(-|$)/.test(name) && existsSync(join(matrix.base_chemins_lus, name, 'SKILL.md')));
  const coverage = verifierCouverture(matrix, catalogue, pack);
  for (const entry of matrix.skills) assert(existsSync(join(matrix.base_chemins_lus, entry.chemin_lu)), `Skill absent : ${entry.skill}`);
  for (const proof of Object.values(matrix.preuves_existantes)) for (const path of proof.fichiers) assert(existsSync(join(base, path)), `Artefact absent : ${path}`);
  const template = json(join(root, 'editorial/templates/skills.json'));
  assert.deepEqual(template.blog, [...BLOG_SKILLS]);
  assert.deepEqual(template.seo, [...SEO_SKILLS]);
  const initialPage = file('gsc-28j-page.json');
  const currentPage = file('gsc-reverification-page.json');
  const initialQuery = file('gsc-28j-page-query.json');
  const currentQuery = file('gsc-reverification-page-query.json');
  assert.equal(currentPage.error, null);
  assert.equal(currentQuery.error, null);
  assert.deepEqual(initialPage.rows, currentPage.rows);
  assert.deepEqual(initialQuery.rows, currentQuery.rows);
  const dates = file('gsc-reverification-date.json');
  assert.equal(dates.error, null);
  const sum = (rows, key) => rows.reduce((n, row) => n + row[key], 0);
  const blogRows = currentPage.rows.filter((row) => row.page.includes('/blog/'));
  const live = file('live-audit.json');
  const pages = file('onpage-summary.json');
  const liveChecks = pages.map((page) => {
    assert.equal(page.status, 200, page.url);
    assert.equal(page.canonical, page.url, page.url);
    assert.equal(page.h1.length, 1, page.url);
    assert(!/noindex/i.test(page.robots) && /index/i.test(page.robots), page.url);
    assert(page.bodyPresent && page.bodyWords > 0, page.url);
    assert(page.hasSommaire && page.author, page.url);
    assert(page.bodyIncoming.length > 0, page.url);
    const source = live.find((row) => row.url === page.url);
    const raw = readFileSync(join(base, source.source_file));
    assert.equal(createHash('sha256').update(raw).digest('hex'), source.sha256, `Copie modifiée : ${page.url}`);
    const nodes = source.schema.flatMap((s) => s['@graph'] || [s]);
    const article = nodes.find((s) => s['@type'] === 'BlogPosting');
    assert.equal(article.url, page.url);
    assert.equal(article.headline, page.h1[0]);
    assert(nodes.some((s) => s['@type'] === 'Person' && s.name === 'Kevin Kitanga'));
    parse(raw.toString());
    return { url: page.url, body: true, canonical: true, schemaIdentity: true, proofs: page.proofs, incoming: page.bodyIncoming.length };
  });
  const serp = file('serp-2026-10-03.json');
  const xmlPaths = ['live/sitemap-index.xml', 'live/sitemap-0.xml', 'live/blog-rss.xml'].map((path) => join(base, path));
  execFileSync('xmllint', ['--noout', ...xmlPaths]);
  const sitemap = readFileSync(join(base, 'live/sitemap-0.xml'), 'utf8');
  const index = readFileSync(join(base, 'live/sitemap-index.xml'), 'utf8');
  assert(index.includes('https://memlia.fr/sitemap-0.xml'));
  const sitemapChecks = pages.map((page) => ({ url: page.url, present: sitemap.includes(`<loc>${page.url}</loc>`) }));
  assert.deepEqual(serp.recherches.map((r) => r.slug).sort(), [...matrix.slugs].sort());
  assert.equal(serp.recherches.length, 4);
  for (const row of serp.recherches) assert.equal(row.resultats.length, 5);
  const brief = readFileSync(join(base, 'BRIEFS-QUATRE-ARTICLES.md'), 'utf8');
  for (const slug of matrix.slugs) assert(brief.includes(slug), `Brief absent : ${slug}`);
  // Le test automatique contrôle présence/cohérence, pas la véracité métier de la prose.
  const tests = [];
  for (const mutation of ['omission', 'doublon', 'executeSansPreuve', 'NAEtMotifVide']) {
    const altered = structuredClone(matrix);
    if (mutation === 'omission') altered.skills.pop();
    if (mutation === 'doublon') altered.skills.push(altered.skills[0]);
    if (mutation === 'executeSansPreuve') { altered.skills[0].briefs = 'execute'; altered.skills[0].preuves = []; }
    if (mutation === 'NAEtMotifVide') { altered.skills[0].diagnostic = 'N/A'; altered.skills[0].motif = ''; }
    assert.throws(() => verifierCouverture(altered, catalogue, pack), mutation);
    tests.push({ mutation, rejetee: true });
  }
  const result = {
    checkedAt: new Date().toISOString(), scope: 'diagnostic et briefs locaux ; aucun article nouveau rendu/publié',
    coverage, catalogue: catalogue.length, pack: pack.length,
    templatePipeline: { blog: BLOG_SKILLS.length, seo: SEO_SKILLS.length, identical: true },
    gsc: { pageRowsIdentical: true, pageQueryRowsIdentical: true, dateRange: dates.date_range,
      siteByDate: { clicks: sum(dates.rows, 'clicks'), impressions: sum(dates.rows, 'impressions') },
      pageSum: { clicks: sum(currentPage.rows, 'clicks'), impressions: sum(currentPage.rows, 'impressions') },
      blogPageSum: { clicks: sum(blogRows, 'clicks'), impressions: sum(blogRows, 'impressions') },
      warning: 'Sommes page et total site distincts ; totals.position du wrapper non calculé.' },
    liveChecks, liveScope: 'Copies du snapshot initial, pas crawl complet actuel ni QA mobile',
    xml: { documentsValides: xmlPaths.length, indexVersSitemapEffectif: true, articles: sitemapChecks },
    serp: { recherches: serp.recherches.length, resultats: serp.recherches.flatMap((r) => r.resultats).length, rankTracker: false },
    mutationTests: tests,
    limits: ['CrUX sans données CRM', 'Lighthouse non exécuté', 'Backlinks/citations IA ND', 'Sources finales et revue métier des articles à exécuter']
  };
  // Un rejeu ne retamponne jamais la preuve historique conservée au dépôt.
  if (process.argv[4]) {
    const outputPath = resolve(process.argv[4]);
    assert(outputPath !== join(base, 'verification.json'), 'La preuve historique est en lecture seule');
    assert(!existsSync(outputPath), 'Le résultat de rejeu doit être un nouveau fichier');
    writeFileSync(outputPath, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
  }
  console.log(JSON.stringify(result, null, 2));
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
