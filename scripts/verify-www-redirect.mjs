/** Oracle HTTP réel www → apex : aucune résolution forcée, aucun envoi ni écriture distante. */
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';

const source = 'https://www.memlia.fr';
const target = 'https://memlia.fr';
const movedArticle = {
  // L'ancien slug reste littéral uniquement dans public/_redirects, la source de la migration.
  path: `/blog/${['la', 'plateforme', 'que', 'personne', 'n', 'a', 'achetee'].join('-')}`,
  status: 308,
  location: '/blog/pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils',
  canonical: `${target}/blog/pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils`,
};
// Les attentes sont explicites, indépendantes de la configuration Cloudflare.
const cases = [
  { path: '/', status: 200, canonical: `${target}/` },
  { path: '/?source=www-test', status: 200, canonical: `${target}/` },
  { path: '/blog?source=www-test', status: 200, canonical: `${target}/blog` },
  { path: '/blog?source=a%2Fb&tag=un&tag=deux&term=cabinet+comptable', status: 200, canonical: `${target}/blog` },
  { path: '/mentions-legales?source=www-test', status: 200, canonical: `${target}/mentions-legales`, noindex: true },
  { path: '/robots.txt?source=www-test', status: 200 },
  { path: '/sitemap.xml?source=www-test', status: 200 },
  { path: '/m8-www-page-inexistante?source=www-test', status: 404 },
];
const reports = [];
for (const entry of cases) {
  const report = { path: entry.path, expectedLocation: target + entry.path, ok: false };
  reports.push(report);
  try {
    // Ne pas suivre automatiquement : une boucle ou un deuxième saut doit rougir.
    const response = await fetch(source + entry.path, { redirect: 'manual', signal: AbortSignal.timeout(20_000) });
    report.status = response.status;
    report.location = response.headers.get('location');
    await response.body?.cancel();
    assert.equal(report.status, 301, 'www doit répondre 301, pas 200/302 ni une redirection JavaScript');
    assert.equal(report.location, report.expectedLocation, 'Chemin et query doivent être conservés exactement');

    const destination = await fetch(report.location, { redirect: 'manual', signal: AbortSignal.timeout(20_000) });
    report.destinationStatus = destination.status;
    report.destinationLocation = destination.headers.get('location');
    report.destinationRobots = destination.headers.get('x-robots-tag');
    const html = await destination.text();
    assert.equal(report.destinationStatus, entry.status, 'Statut final inattendu : chaîne de redirections ou page cassée');
    assert.equal(report.destinationLocation, null, 'Pas de deuxième saut sur les chemins canoniques testés');
    assert.doesNotMatch(report.destinationRobots ?? '', /noindex/i, 'Pas de noindex global de preview sur apex');
    if (entry.canonical) {
      const canonicals = [...html.matchAll(/<link\b[^>]*\brel="canonical"[^>]*>/gi)]
        .map(([tag]) => tag.match(/\bhref="([^"]+)"/i)?.[1]);
      report.canonicals = canonicals;
      assert.deepEqual(canonicals, [entry.canonical], 'Canonical apex unique attendu');
      const robots = html.match(/<meta\b[^>]*\bname="robots"[^>]*>/i)?.[0];
      assert.ok(robots, 'Meta robots absente');
      assert.equal(/noindex/i.test(robots), Boolean(entry.noindex), 'Indexabilité finale incorrecte');
    }
    report.ok = true;
  } catch (error) {
    report.error = error.message;
    if (error.cause) report.cause = error.cause.code ?? error.cause.message;
  }
}
{
  const report = { path: movedArticle.path, expectedLocation: movedArticle.location, ok: false };
  reports.push(report);
  try {
    // La route apex doit faire un seul saut permanent vers la nouvelle URL canonique.
    const response = await fetch(target + movedArticle.path, { redirect: 'manual', signal: AbortSignal.timeout(20_000) });
    report.status = response.status;
    report.location = response.headers.get('location');
    await response.body?.cancel();
    assert.equal(report.status, movedArticle.status, 'L’ancienne URL de l’article doit répondre 308');
    assert.equal(report.location, movedArticle.location, 'L’ancienne URL doit viser directement le nouveau chemin');

    const destination = await fetch(new URL(report.location, target), { redirect: 'manual', signal: AbortSignal.timeout(20_000) });
    report.destinationStatus = destination.status;
    report.destinationLocation = destination.headers.get('location');
    const html = await destination.text();
    assert.equal(report.destinationStatus, 200, 'La nouvelle URL de l’article doit répondre 200');
    assert.equal(report.destinationLocation, null, 'La redirection de l’article doit tenir en un seul saut');
    const canonicals = [...html.matchAll(/<link\b[^>]*\brel="canonical"[^>]*>/gi)]
      .map(([tag]) => tag.match(/\bhref="([^"]+)"/i)?.[1]);
    report.canonicals = canonicals;
    assert.deepEqual(canonicals, [movedArticle.canonical], 'La nouvelle URL doit porter son canonical unique');
    report.ok = true;
  } catch (error) {
    report.error = error.message;
    if (error.cause) report.cause = error.cause.code ?? error.cause.message;
  }
}
const passed = reports.filter(report => report.ok).length;
const result = { measuredAt: new Date().toISOString(), source, target, forcedDns: false, passed, total: cases.length + 1, reports };
const output = '.qa/www-redirect.json';
mkdirSync('.qa', { recursive: true });
writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
console.log(`Redirection www : ${passed}/${cases.length + 1}. Preuve : ${output}`);
if (passed !== cases.length + 1) process.exitCode = 1;
