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

test('une bibliographie ne revient pas sous un autre titre ou avec des balises séparées', () => {
  for (const title of ['Sources', 'Source officielle', 'Références', 'Les textes de référence', 'Les textes de <em>référence</em>']) {
    assert.ok(auditHtml(`<h2>${title}</h2><p>Liste documentaire</p>`).length, title);
  }
  assert.deepEqual(auditHtml('<h2>Quels textes encadrent votre décision ?</h2><p>La <a href="https://h2a-france.org/">NEP</a> précise ce point.</p>'), []);
  assert.ok(auditHtml('<p>Références : <a href="https://h2a-france.org/">NEP</a>.</p>').length);
});

test('les liens de présentation des Cicatrices restent dans le paragraphe, sans modifier le JSON-LD', () => {
  const text = 'les sources Python citées en annexe éclairent seulement la méthode des tests';
  const script = `<script type="application/ld+json">${JSON.stringify({ text })}</script>`;
  const html = `<head><link rel="canonical" href="https://memlia.fr/blog/tests-verts-et-regle-des-trois-passes">${script}</head><body><p>${text}.</p></body>`;
  const rendered = renderPublicSourceText(html);
  assert.ok(rendered.includes(script));
  assert.ok(rendered.includes('<a href="https://docs.python.org/fr/3/library/doctest.html">doctest</a>'));
  assert.ok(rendered.includes('<a href="https://docs.python.org/fr/3/library/unittest.html">unittest</a>'));
  assert.ok(rendered.includes('<a href="https://docs.pytest.org/en/stable/how-to/assert.html">pytest</a>'));
  assert.equal(renderPublicSourceText(rendered), rendered);
});

test('le rendu retire une bibliographie redondante et conserve chaque lien dans son paragraphe', () => {
  const paragraph = '<p>Le <a href="https://example.org/texte">texte officiel</a> encadre ce contrôle.</p>';
  const source = '<h2 id="sources">Sources</h2><ul><li><a href="https://example.org/texte">Texte officiel</a></li></ul>';
  const html = `<div class="article-corps lecture">${paragraph}${source}</div>`;
  assert.equal(renderPublicSourceText(html), `<div class="article-corps lecture">${paragraph}</div>`);
  assert.equal(renderPublicSourceText(renderPublicSourceText(html)), renderPublicSourceText(html));
  assert.throws(() => renderPublicSourceText(`<div class="article-corps">${source}</div>`), /Citations à intégrer/);
  const toc = '<nav data-blog-toc><ol><li><a href="#controle">Le contrôle</a></li><li><a href="#sources">Sources</a></li></ol></nav>';
  const rendered = renderPublicSourceText(toc + html);
  assert.ok(rendered.includes('<li><a href="#controle">Le contrôle</a></li>'));
  assert.ok(!rendered.includes('href="#sources"'));
});

test('toutes les pages rendues, sans liste figée de routes, sont exemptes de libellés de processus', () => {
  const pages = renderedPages();
  assert.ok(pages.some((page) => page.route === '/glossaire'));
  assert.ok(pages.some((page) => page.route.startsWith('/blog/')));
  assert.ok(pages.some((page) => page.route.startsWith('/outils-comptables-gratuits/')));
  assert.ok(pages.some((page) => page.route === '/integrations'), 'le catalogue commun remplace les guides par environnement');
  assert.ok(pages.some((page) => page.route.startsWith('/agents-ia/')));
  assert.ok(pages.some((page) => page.route.startsWith('/automatisation/')));
  const violations = pages.flatMap(({ route, file }) => auditHtml(readFileSync(file, 'utf8')).map((match) => `${route}: ${match.context}`));
  assert.deepEqual(violations, []);
});
