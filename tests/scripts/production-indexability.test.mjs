import assert from 'node:assert/strict';
import test from 'node:test';
import {
  analyzeHomeResponse,
  analyzeRobots,
  buildProbeUrl,
  verifyProductionIndexability,
} from '../../scripts/verify-production-indexability.mjs';
import { PAGES_NOINDEX } from '../../src/data/site.mjs';
import { onRequest } from '../../functions/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier.js';

const INDEXABLE_HOME = '<!doctype html><html><head><meta name="robots" content="index, follow, max-image-preview:large"></head></html>';
const SUSPENDED_PATH = '/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier';

function productionFixture({ mutate = (response) => response, sitemapExtra = '' } = {}) {
  return async (probeUrl, options) => {
    const { pathname } = new URL(probeUrl);
    let response;
    if (pathname === SUSPENDED_PATH) response = onRequest({ request: new Request(probeUrl, options) });
    else if (pathname === '/robots.txt') response = new Response('User-agent: *\nAllow: /\nSitemap: https://memlia.fr/sitemap.xml\n');
    else if (pathname === '/sitemap.xml') response = new Response('<sitemapindex><sitemap><loc>https://memlia.fr/sitemap-0.xml</loc></sitemap></sitemapindex>');
    else if (pathname === '/sitemap-0.xml') response = new Response(`<urlset><url><loc>https://memlia.fr/</loc></url>${sitemapExtra}</urlset>`);
    else if (PAGES_NOINDEX.includes(pathname)) response = new Response(options.method === 'HEAD' ? null : '<meta name="robots" content="noindex, follow">');
    else response = new Response(INDEXABLE_HOME);
    return mutate(response, pathname, options.method ?? 'GET');
  };
}

test('accepte la suspension réelle et sonde GET et HEAD pour chaque page noindex servie', async () => {
  const calls = [];
  const report = await verifyProductionIndexability({ fetchImpl: productionFixture({ mutate(response, path, method) {
    calls.push([path, method]);
    return response;
  } }) });
  assert.equal(report.passed, true);
  for (const path of PAGES_NOINDEX.filter((entry) => entry !== '/404')) {
    for (const method of ['GET', 'HEAD']) assert.ok(calls.some(([p, m]) => p === path && m === method), `${method} ${path}`);
  }
});

for (const method of ['GET', 'HEAD']) {
  for (const status of [200, 404]) {
    test(`refuse une suspension ${method} HTTP ${status}`, async () => {
      const fetchImpl = productionFixture({ mutate: (response, path, verb) => path === SUSPENDED_PATH && verb === method
        ? new Response(method === 'GET' ? '<meta name="robots" content="noindex, nofollow">' : null, { status, headers: response.headers }) : response });
      await assert.rejects(verifyProductionIndexability({ fetchImpl }), /HTTP 503/);
    });
  }
  for (const [header, value] of [['cache-control', null], ['cache-control', 'public'], ['retry-after', null], ['retry-after', '0'], ['x-robots-tag', null], ['x-robots-tag', 'noindex'], ['x-robots-tag', 'nofollow'], ['x-robots-tag', 'noindex, nofollow, index']]) {
    test(`refuse la suspension ${method} avec ${header}=${value}`, async () => {
      const fetchImpl = productionFixture({ mutate(response, path, verb) {
        if (path === SUSPENDED_PATH && verb === method) {
          if (value === null) response.headers.delete(header);
          else response.headers.set(header, value);
        }
        return response;
      } });
      await assert.rejects(verifyProductionIndexability({ fetchImpl }), /Cache-Control|Retry-After|X-Robots-Tag/);
    });
  }
  test(`refuse un 503 ${method} sur une page légale ordinaire`, async () => {
    const fetchImpl = productionFixture({ mutate: (response, path, verb) => path === '/mentions-legales' && verb === method
      ? new Response(null, { status: 503 }) : response });
    await assert.rejects(verifyProductionIndexability({ fetchImpl }), /mentions-legales.*HTTP 200/);
  });
}

test('refuse la suspension GET sans meta noindex', async () => {
  const fetchImpl = productionFixture({ mutate: (response, path, method) => path === SUSPENDED_PATH && method === 'GET'
    ? new Response(INDEXABLE_HOME, { status: 503, headers: response.headers }) : response });
  await assert.rejects(verifyProductionIndexability({ fetchImpl }), /meta robots.*noindex/);
});

test('refuse la route suspendue dans le sitemap', async () => {
  const fetchImpl = productionFixture({ sitemapExtra: `<url><loc>https://memlia.fr${SUSPENDED_PATH}</loc></url>` });
  await assert.rejects(verifyProductionIndexability({ fetchImpl }), /noindex.*hors sitemap/);
});

test('refuse un 503 sur une autre route de blog indexable', async () => {
  const path = '/blog/autre-article-a-verifier';
  const fetchImpl = productionFixture({
    sitemapExtra: `<url><loc>https://memlia.fr${path}</loc></url>`,
    mutate: (response, pathname) => pathname === path ? new Response(null, { status: 503 }) : response,
  });
  await assert.rejects(verifyProductionIndexability({ fetchImpl }), /HTTP 200.*503/);
});

test('refuse une page légale GET sans meta noindex', async () => {
  const fetchImpl = productionFixture({ mutate: (response, path, method) => path === '/mentions-legales' && method === 'GET'
    ? new Response(INDEXABLE_HOME) : response });
  await assert.rejects(verifyProductionIndexability({ fetchImpl }), /meta robots.*noindex/);
});

test('refuse la suspension GET sans meta nofollow', async () => {
  const fetchImpl = productionFixture({ mutate: (response, path, method) => path === SUSPENDED_PATH && method === 'GET'
    ? new Response('<meta name="robots" content="noindex">', { status: 503, headers: response.headers }) : response });
  await assert.rejects(verifyProductionIndexability({ fetchImpl }), /meta robots.*nofollow/);
});

test('refuse un corps sur la suspension HEAD', async () => {
  const fetchImpl = productionFixture({ mutate: (response, path, method) => path === SUSPENDED_PATH && method === 'HEAD'
    ? new Response('corps inattendu', { status: 503, headers: response.headers }) : response });
  await assert.rejects(verifyProductionIndexability({ fetchImpl }), /HEAD.*sans corps/);
});

test('rougit si X-Robots-Tag désindexe la production malgré une meta indexable', () => {
  assert.throws(
    () => analyzeHomeResponse({ status: 200, xRobotsTag: 'noindex', html: INDEXABLE_HOME }),
    /X-Robots-Tag.*noindex/,
  );
});

test('rougit si la meta robots de l’accueil contient noindex', () => {
  const html = '<html><head><meta content="noindex, follow" name="robots"></head></html>';
  assert.throws(
    () => analyzeHomeResponse({ status: 200, xRobotsTag: null, html }),
    /meta robots.*noindex/,
  );
});

test('accepte uniquement un accueil 200 avec index et follow explicites', () => {
  assert.deepEqual(
    analyzeHomeResponse({ status: 200, xRobotsTag: null, html: INDEXABLE_HOME }),
    { metaRobots: 'index, follow, max-image-preview:large', xRobotsTag: null },
  );
  assert.throws(
    () => analyzeHomeResponse({ status: 404, xRobotsTag: null, html: '' }),
    /HTTP 200.*404/,
  );
});

test('sonde une variante unique pour contourner le cache sans perdre l’URL canonique', () => {
  const probe = new URL(buildProbeUrl('https://memlia.fr/'));
  assert.equal(probe.origin + probe.pathname, 'https://memlia.fr/');
  assert.match(probe.searchParams.get('__memlia_probe'), /^\d+$/);
});

test('rougit si une URL du sitemap reçoit noindex dans les en-têtes', async () => {
  const noindex = '<html><head><meta name="robots" content="noindex, follow"></head></html>';
  const sitemapIndex = '<sitemapindex><sitemap><loc>https://memlia.fr/sitemap-0.xml</loc></sitemap></sitemapindex>';
  const sitemapPages = '<urlset><url><loc>https://memlia.fr/</loc></url><url><loc>https://memlia.fr/page-test</loc></url></urlset>';
  const fetchImpl = async (probeUrl, options) => {
    const { pathname } = new URL(probeUrl);
    if (pathname === SUSPENDED_PATH) return onRequest({ request: new Request(probeUrl, options) });
    if (pathname === '/robots.txt') return new Response('User-agent: *\nAllow: /\nSitemap: https://memlia.fr/sitemap.xml\n');
    if (pathname === '/sitemap.xml') return new Response(sitemapIndex);
    if (pathname === '/sitemap-0.xml') return new Response(sitemapPages);
    if (PAGES_NOINDEX.includes(pathname)) return new Response(options.method === 'HEAD' ? null : noindex);
    if (pathname === '/page-test') return new Response(INDEXABLE_HOME, { headers: { 'x-robots-tag': 'noindex' } });
    return new Response(INDEXABLE_HOME);
  };

  await assert.rejects(
    verifyProductionIndexability({ fetchImpl }),
    /X-Robots-Tag.*noindex/,
  );
});

test('lit le groupe User-agent étoile sans hériter des groupes suivants', () => {
  const robots = `# commentaire\nUser-agent: *\nAllow: /\n\n# autre groupe\nUser-agent: Bytespider\nDisallow: /\n\nSitemap: https://memlia.fr/sitemap.xml\n`;
  assert.deepEqual(analyzeRobots(robots), { defaultAllowsRoot: true, sitemapDeclared: true });
});

test('accepte plusieurs User-agent dans le même groupe étoile', () => {
  const robots = `User-agent: *\nUser-agent: Googlebot\nAllow: /\n\nSitemap: https://memlia.fr/sitemap.xml\n`;
  assert.deepEqual(analyzeRobots(robots), { defaultAllowsRoot: true, sitemapDeclared: true });
});
