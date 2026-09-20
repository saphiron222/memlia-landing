import assert from 'node:assert/strict';
import test from 'node:test';
import {
  analyzeHomeResponse,
  analyzeRobots,
  buildProbeUrl,
  verifyProductionIndexability,
} from '../../scripts/verify-production-indexability.mjs';

const INDEXABLE_HOME = '<!doctype html><html><head><meta name="robots" content="index, follow, max-image-preview:large"></head></html>';

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
  const fetchImpl = async (probeUrl) => {
    const { pathname } = new URL(probeUrl);
    if (pathname === '/robots.txt') return new Response('User-agent: *\nAllow: /\nSitemap: https://memlia.fr/sitemap.xml\n');
    if (pathname === '/sitemap.xml') return new Response(sitemapIndex);
    if (pathname === '/sitemap-0.xml') return new Response(sitemapPages);
    if (['/mentions-legales', '/politique-de-confidentialite', '/contact/merci', '/contact/erreur'].includes(pathname)) return new Response(noindex);
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
