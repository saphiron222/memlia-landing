import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { auditHtml, renderedPages } from '../../scripts/verify-public-source-labels.mjs';
import { renderPublicSourceText } from '../../scripts/render-public-source-text.mjs';

test('le rendu final retire uniquement les dates de consultation, sans toucher aux preuves internes', () => {
  const html = `<html><head><script type="application/ld+json">{"note":"consultée le 4 octobre 2026"}</script></head><body>
    <p data-note="consulté le 2026-09-20">Net-entreprises consultée le 17 septembre 2026 indique la règle.</p>
    <p><a href="https://example.org">Source</a>, publié le 11 janvier 2023, consulté le 21 septembre 2026.</p>
    <p>Source, consulté le 2026-09-20.</p>
    <p>Le cabinet consulte le dossier. Applicable au 1er septembre 2026.</p></body></html>`;
  const expected = html.replace('Net-entreprises consultée le 17 septembre 2026 indique', 'Net-entreprises indique')
    .replace(', consulté le 21 septembre 2026.', '.')
    .replace('Source, consulté le 2026-09-20.', 'Source.');
  assert.equal(renderPublicSourceText(html), expected);
  assert.equal(renderPublicSourceText(expected), expected);
  assert.deepEqual(auditHtml(expected), []);
});

test('les libellés de contrôle interne sont refusés même découpés par le HTML', () => {
  for (const text of [
    'Cegid · consultée le <time>4 octobre 2026</time>',
    'consulté le 21 septembre 2026', 'consultées le 20 septembre 2026',
    'Vérifiée le 2026-09-21.', 'Sources consultées', 'Source vérifiée : Cloudflare',
    'Source : jeu fictif · capture du 2026-09-20', 'Capture le 20 septembre 2026',
    'Date de consultation : 2026-09-20', 'consult<em>ée</em>&nbsp;le 4 octobre 2026',
    '<span hidden>consultée le 4 octobre 2026</span>',
  ]) assert.ok(auditHtml(`<body><p>${text}</p></body>`).length, text);
});

test('les références, dates éditoriales/réglementaires et métadonnées internes restent possibles', () => {
  const html = `<head><script type="application/ld+json">{"consulté le":"2026-09-20"}</script></head>
    <body><p>Net-entreprises, <a href="https://www.net-entreprises.fr/">La DSN</a>.</p>
    <p>Publié le 20 septembre 2026 ; mis à jour le 4 octobre 2026.</p>
    <p>Applicable au 1er septembre 2026. Conditions mises à jour le 12 septembre 2025.</p>
    <p>Vérifier le dossier ; le cabinet vérifie le classement, consulte le dossier, lit la preuve consultée et garde la date de la décision.</p>
    <p>Ce jeu fictif n’est pas une capture d’un dossier réel.</p>
    <script>const internal = 'capture du 2026-09-20';</script>
    <style>.x::before { content: 'consultée le'; }</style></body>`;
  assert.deepEqual(auditHtml(html), []);
});

test('toutes les pages rendues, sans liste figée de routes, sont exemptes de libellés de processus', () => {
  const pages = renderedPages();
  assert.ok(pages.some((page) => page.route === '/glossaire'));
  assert.ok(pages.some((page) => page.route.startsWith('/blog/')));
  assert.ok(pages.some((page) => page.route.startsWith('/outils-comptables-gratuits/')));
  assert.ok(pages.some((page) => page.route.startsWith('/integrations/')));
  const violations = pages.flatMap(({ route, file }) => auditHtml(readFileSync(file, 'utf8')).map((match) => `${route}: ${match.context}`));
  assert.deepEqual(violations, []);
});
