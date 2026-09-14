import assert from 'node:assert/strict';
import test from 'node:test';
import {
  analyzeHomeResponse,
  analyzeRobots,
  buildProbeUrl,
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

test('contourne le cache avec une query unique sans changer le chemin sondé', () => {
  const url = new URL(buildProbeUrl('https://memlia.fr/', 'temoin-123'));
  assert.equal(url.origin, 'https://memlia.fr');
  assert.equal(url.pathname, '/');
  assert.equal(url.searchParams.get('__memlia_indexability'), 'temoin-123');
});

test('lit le groupe User-agent étoile sans hériter des groupes suivants', () => {
  const robots = `# commentaire\nUser-agent: *\nAllow: /\n\n# autre groupe\nUser-agent: Bytespider\nDisallow: /\n\nSitemap: https://memlia.fr/sitemap.xml\n`;
  assert.deepEqual(analyzeRobots(robots), { defaultAllowsRoot: true, sitemapDeclared: true });
});

test('accepte plusieurs User-agent dans le même groupe étoile', () => {
  const robots = `User-agent: *\nUser-agent: Googlebot\nAllow: /\n\nSitemap: https://memlia.fr/sitemap.xml\n`;
  assert.deepEqual(analyzeRobots(robots), { defaultAllowsRoot: true, sitemapDeclared: true });
});
