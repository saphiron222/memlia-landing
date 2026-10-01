/** Oracle HTTP réel de l’indexabilité de la production memlia.fr. */
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

import { PAGES_NOINDEX } from '../src/data/site.mjs';
import { onRequest as suspendedArticleResponse } from '../functions/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier.js';

// Liste explicite : le contrat HTTP vient de la fonction Pages, pas du nom des pages noindex.
const SUSPENDED_PAGES = new Map([
  ['/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier', suspendedArticleResponse],
]);

const PRODUCTION_ORIGIN = 'https://memlia.fr';
const ROBOTS_META = /<meta\b[^>]*\bname=["']robots["'][^>]*>/gi;

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match?.[2] ?? null;
}

function parseDirectives(value) {
  return new Set((value ?? '').split(',').map((directive) => directive.trim().toLowerCase()).filter(Boolean));
}

export function buildProbeUrl(url) {
  const probe = new URL(url);
  probe.searchParams.set('__memlia_probe', String(Date.now()));
  return probe.href;
}

function analyzeMetaRobots(html, expectedDirective) {
  const tags = html.match(ROBOTS_META) ?? [];
  assert.equal(tags.length, 1, `Une meta robots unique est requise (trouvé : ${tags.length}).`);
  const content = getAttribute(tags[0], 'content');
  assert.ok(content, 'La meta robots doit porter un attribut content.');
  const directives = parseDirectives(content);
  assert.ok(directives.has(expectedDirective), `La meta robots doit contenir ${expectedDirective} (reçu : ${content}).`);
  return { content, directives };
}

export function analyzeHomeResponse({ status, xRobotsTag, html }) {
  assert.equal(status, 200, `L’accueil de production doit répondre HTTP 200 (reçu : ${status}).`);
  assert.doesNotMatch(xRobotsTag ?? '', /(?:^|[,\s])noindex(?:$|[,\s])/i, `X-Robots-Tag interdit en production : ${xRobotsTag}`);
  const { content, directives } = analyzeMetaRobots(html, 'index');
  assert.ok(directives.has('follow'), `La meta robots de l’accueil doit contenir follow (reçu : ${content}).`);
  assert.ok(!directives.has('noindex'), `La meta robots de l’accueil contient noindex : ${content}`);
  assert.ok(!directives.has('nofollow'), `La meta robots de l’accueil contient nofollow : ${content}`);
  return { metaRobots: content, xRobotsTag };
}

async function fetchFresh(url, fetchImpl, method = 'GET') {
  const probeUrl = buildProbeUrl(url);
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetchImpl(probeUrl, {
        method,
        redirect: 'manual',
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
        signal: AbortSignal.timeout(20_000),
      });
      const body = await response.text();
      return {
        url,
        method,
        probeUrl,
        status: response.status,
        age: response.headers.get('age'),
        cacheStatus: response.headers.get('cf-cache-status'),
        cacheControl: response.headers.get('cache-control'),
        retryAfter: response.headers.get('retry-after'),
        xRobotsTag: response.headers.get('x-robots-tag'),
        body,
      };
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 250));
    }
  }
  throw lastError;
}

function sitemapLocations(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/gi)].map(([, location]) => location.trim());
}

export function analyzeRobots(body) {
  let groupAgents = [];
  let groupHasRules = false;
  let defaultAllowsRoot = false;
  let defaultDisallowsRoot = false;
  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    const userAgent = line.match(/^User-agent:\s*(.+)$/i);
    if (userAgent) {
      if (groupHasRules) {
        groupAgents = [];
        groupHasRules = false;
      }
      groupAgents.push(userAgent[1].trim());
      continue;
    }
    const isAllowRoot = /^Allow:\s*\/$/i.test(line);
    const isDisallowRoot = /^Disallow:\s*\/$/i.test(line);
    if (isAllowRoot || isDisallowRoot) groupHasRules = true;
    if (!groupAgents.includes('*')) continue;
    if (isAllowRoot) defaultAllowsRoot = true;
    if (isDisallowRoot) defaultDisallowsRoot = true;
  }
  assert.ok(defaultAllowsRoot, 'robots.txt doit autoriser / pour User-agent: *.');
  assert.ok(!defaultDisallowsRoot, 'robots.txt ne doit pas bloquer / pour User-agent: *.');
  const sitemapDeclared = /^Sitemap:\s*https:\/\/memlia\.fr\/sitemap\.xml$/im.test(body);
  assert.ok(sitemapDeclared, 'robots.txt doit déclarer le sitemap canonique.');
  return { defaultAllowsRoot, sitemapDeclared };
}

export async function verifyProductionIndexability({ fetchImpl = fetch } = {}) {
  const report = { measuredAt: new Date().toISOString(), origin: PRODUCTION_ORIGIN, checks: {} };

  const home = await fetchFresh(`${PRODUCTION_ORIGIN}/`, fetchImpl);
  report.checks.home = { ...home, body: undefined };
  report.checks.home.analysis = analyzeHomeResponse({ ...home, html: home.body });

  const legalPages = [];
  const suspendedPages = [];
  for (const path of SUSPENDED_PAGES.keys()) {
    assert.ok(PAGES_NOINDEX.includes(path), `${path} suspendue doit rester dans PAGES_NOINDEX.`);
  }
  for (const path of PAGES_NOINDEX.filter((entry) => entry !== '/404')) {
    const suspension = SUSPENDED_PAGES.get(path);
    for (const method of ['GET', 'HEAD']) {
      const response = await fetchFresh(`${PRODUCTION_ORIGIN}${path}`, fetchImpl, method);
      const expected = suspension?.({ request: new Request(response.url, { method }) });
      if (expected) assert.equal(expected.status, 503, `${path} : le contrat de suspension doit rester HTTP 503.`);
      const status = expected?.status ?? 200;
      assert.equal(response.status, status, `${method} ${path} doit répondre HTTP ${status} (reçu : ${response.status}).`);
      if (expected) {
        assert.equal(response.cacheControl, expected.headers.get('cache-control'), `${method} ${path} : Cache-Control de suspension manquant ou divergent.`);
        assert.equal(response.retryAfter, expected.headers.get('retry-after'), `${method} ${path} : Retry-After de suspension manquant ou divergent.`);
        assert.deepEqual(parseDirectives(response.xRobotsTag), parseDirectives(expected.headers.get('x-robots-tag')), `${method} ${path} : X-Robots-Tag de suspension manquant ou divergent.`);
      }
      const meta = method === 'GET' ? analyzeMetaRobots(response.body, 'noindex') : null;
      if (expected && meta) assert.ok(meta.directives.has('nofollow'), `${path} : la meta robots de suspension doit contenir nofollow.`);
      if (method === 'HEAD') assert.equal(response.body, '', `${path} : HEAD doit rester sans corps.`);
      (suspension ? suspendedPages : legalPages).push({ ...response, body: undefined, metaRobots: meta?.content });
    }
  }
  report.checks.legalPages = legalPages;
  report.checks.suspendedPages = suspendedPages;

  const robots = await fetchFresh(`${PRODUCTION_ORIGIN}/robots.txt`, fetchImpl);
  assert.equal(robots.status, 200, `robots.txt doit répondre HTTP 200 (reçu : ${robots.status}).`);
  report.checks.robots = { ...robots, body: undefined, analysis: analyzeRobots(robots.body) };

  const sitemapIndex = await fetchFresh(`${PRODUCTION_ORIGIN}/sitemap.xml`, fetchImpl);
  assert.equal(sitemapIndex.status, 200, `sitemap.xml doit répondre HTTP 200 (reçu : ${sitemapIndex.status}).`);
  const indexLocations = sitemapLocations(sitemapIndex.body);
  const sitemapPages = [];
  for (const location of indexLocations) {
    const sitemap = await fetchFresh(location, fetchImpl);
    assert.equal(sitemap.status, 200, `${location} doit répondre HTTP 200 (reçu : ${sitemap.status}).`);
    sitemapPages.push(...sitemapLocations(sitemap.body));
  }
  const allLocations = indexLocations.some((location) => location.endsWith('.xml')) ? sitemapPages : indexLocations;
  assert.ok(allLocations.includes(`${PRODUCTION_ORIGIN}/`), 'Le sitemap doit contenir l’accueil canonique.');
  for (const path of PAGES_NOINDEX) {
    assert.ok(!allLocations.includes(`${PRODUCTION_ORIGIN}${path}`), `${path} est noindex et doit rester hors sitemap.`);
  }
  const indexablePages = [];
  for (const location of allLocations) {
    const response = await fetchFresh(location, fetchImpl);
    const analysis = analyzeHomeResponse({ ...response, html: response.body });
    indexablePages.push({ ...response, body: undefined, analysis });
  }
  report.checks.sitemap = { ...sitemapIndex, body: undefined, indexLocations, pageLocations: allLocations };
  report.checks.indexablePages = indexablePages;
  report.passed = true;
  return report;
}

async function main() {
  const output = '.qa/indexation/production-indexability.json';
  try {
    const report = await verifyProductionIndexability();
    mkdirSync('.qa/indexation', { recursive: true });
    writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify(report, null, 2));
    console.log(`Indexabilité production : PASS. Preuve : ${output}`);
  } catch (error) {
    console.error(`Indexabilité production : FAIL — ${error.message}`);
    if (error.cause) console.error(`Cause réseau : ${error.cause.code ?? error.cause.message}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
