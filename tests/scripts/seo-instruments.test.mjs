import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  analyserSortieJson,
  cheminDepuisUrl,
  estTexte,
  extraireLiensSitemap,
  lireDerive,
  lireMisesAJourGoogle,
  lirePsi,
  lireSerpDataForSeo,
} from '../../scripts/lib/seo-instruments.mjs';

test('analyserSortieJson lit un objet JSON précédé de lignes de texte', () => {
  const sortie = '\n    No drift detected. Page matches baseline.\n{\n  "status": "ok",\n  "n": 1\n}\n';
  assert.deepEqual(analyserSortieJson(sortie), { status: 'ok', n: 1 });
});

test('analyserSortieJson rend null sur une sortie sans JSON', () => {
  assert.equal(analyserSortieJson('rien du tout'), null);
  assert.equal(analyserSortieJson(''), null);
});

const deriveOk = '\n    No drift detected. Page matches baseline.\n' + JSON.stringify({
  status: 'ok', url: 'https://memlia.fr/', baseline_id: 1,
  summary: { total_rules: 17, triggered: 0, critical: 0, warning: 0, info: 0 }, triggered_findings: [],
});

test('lireDerive : aucune règle déclenchée est un statut ok', () => {
  const d = lireDerive({ sortie: deriveOk, code: 0, url: 'https://memlia.fr/', commitBaseline: 'abc' });
  assert.equal(d.statut, 'ok');
  assert.equal(d.commitBaseline, 'abc');
  assert.deepEqual(d.findings, []);
});

test('lireDerive : des règles déclenchées donnent une dérive avec ses comptes et ses règles', () => {
  const sortie = JSON.stringify({
    status: 'ok', summary: { total_rules: 17, triggered: 2, critical: 1, warning: 1, info: 0 },
    triggered_findings: [
      { rule: 'title_changed', severity: 'CRITICAL', old_value: 'A', new_value: 'B', message: 'Title changed' },
      { rule: 'h2_changed', severity: 'WARNING', old_value: 3, new_value: 4, message: 'H2 count changed' },
    ],
  });
  const d = lireDerive({ sortie, code: 0, url: 'https://memlia.fr/', commitBaseline: 'abc' });
  assert.equal(d.statut, 'derive');
  assert.equal(d.critical, 1);
  assert.equal(d.warning, 1);
  assert.deepEqual(d.findings.map((f) => f.rule), ['title_changed', 'h2_changed']);
});

test('lireDerive : sans baseline le statut le dit, une sortie illisible est une erreur', () => {
  const sans = lireDerive({ sortie: '{"error": "No baseline found for https://memlia.fr/blog. Run `drift baseline` first."}', code: 1, url: 'https://memlia.fr/blog' });
  assert.equal(sans.statut, 'sans-baseline');
  const erreur = lireDerive({ sortie: 'Traceback (most recent call last)', code: 1, url: 'https://memlia.fr/blog' });
  assert.equal(erreur.statut, 'erreur');
  assert.match(erreur.message, /Traceback/);
});

const psiBrut = {
  psi: {
    mobile: {
      url: 'https://memlia.fr/',
      lighthouse_scores: { performance: 96, accessibility: 100, 'best-practices': 100, seo: 100 },
      lab_metrics: {
        'first-contentful-paint': { value: 1800, display: '1,8 s', score: 0.92 },
        'largest-contentful-paint': { value: 2403, display: '2,4 s', score: 0.91 },
        'cumulative-layout-shift': { value: 0.02131, display: '0,021', score: 1 },
        'total-blocking-time': { value: 0, display: '0 ms', score: 1 },
        'speed-index': { value: 3100, display: '3,1 s', score: 0.89 },
      },
      failed_audits: [{ id: 'total-byte-weight', title: 'Avoid enormous network payloads' }],
      error: null,
    },
  },
};

test('lirePsi aplatit les scores et les métriques de laboratoire', () => {
  const r = lirePsi(psiBrut, { url: 'https://memlia.fr/' });
  assert.deepEqual(r.scores, { performance: 96, accessibility: 100, bestPractices: 100, seo: 100 });
  assert.equal(r.labo.lcpMs, 2403);
  assert.equal(r.labo.cls, 0.02131);
  assert.equal(r.labo.tbtMs, 0);
  assert.deepEqual(r.auditsEchoues, ['total-byte-weight']);
  assert.equal(r.erreur, null);
});

test('lirePsi rend une erreur nommée quand PageSpeed n’a pas répondu', () => {
  const r = lirePsi({ psi: { mobile: { url: 'https://memlia.fr/', error: 'HTTP 500' } } }, { url: 'https://memlia.fr/' });
  assert.equal(r.erreur, 'HTTP 500');
  assert.equal(r.scores, null);
  const vide = lirePsi(null, { url: 'https://memlia.fr/' });
  assert.match(vide.erreur, /vide/);
});

test('lireSerpDataForSeo sépare une tâche réussie de son coût et nomme une tâche refusée', () => {
  const ok = lireSerpDataForSeo({ tasks: [{ status_code: 20000, status_message: 'Ok.', cost: 0.0035, result: [{ keyword: 'memlia', items: [] }] }] });
  assert.equal(ok.ok, true);
  assert.equal(ok.cout, 0.0035);
  assert.equal(ok.resultat.keyword, 'memlia');
  const refus = lireSerpDataForSeo({ tasks: [{ status_code: 40201, status_message: 'Unauthorized.', cost: 0, result: null }] });
  assert.equal(refus.ok, false);
  assert.match(refus.erreur, /40201 Unauthorized/);
  assert.equal(lireSerpDataForSeo({}).ok, false);
});

test('extraireLiensSitemap rend les loc dans l’ordre', () => {
  const xml = '<?xml version="1.0"?><urlset><url><loc>https://memlia.fr/</loc><lastmod>2026-09-17</lastmod></url><url><loc>https://memlia.fr/blog</loc></url></urlset>';
  assert.deepEqual(extraireLiensSitemap(xml), ['https://memlia.fr/', 'https://memlia.fr/blog']);
});

test('cheminDepuisUrl rend le chemin sans barre finale, et la racine reste la racine', () => {
  assert.equal(cheminDepuisUrl('https://memlia.fr/blog/a'), '/blog/a');
  assert.equal(cheminDepuisUrl('https://memlia.fr/blog/'), '/blog');
  assert.equal(cheminDepuisUrl('https://memlia.fr/'), '/');
});

test('lireMisesAJourGoogle lit les lignes datées du tableau officiel et dédouble le nom', () => {
  const html = '<table><tr><th>Summary</th><th>Date</th><th>Duration</th></tr>'
    + '<tr><td><a href="#a">August 2026 spam update</a> August 2026 spam update</td><td>18 Aug 2026</td><td>2 days, 16 hours</td></tr>'
    + '<tr><td>May 2026 core update May 2026 core update</td><td>21 May 2026</td><td>11 days, 21 hours</td></tr>'
    + '<tr><td>sans date</td><td>bientôt</td><td></td></tr></table>';
  const maj = lireMisesAJourGoogle(html);
  assert.deepEqual(maj, [
    { nom: 'August 2026 spam update', date: '2026-08-18', duree: '2 days, 16 hours' },
    { nom: 'May 2026 core update', date: '2026-05-21', duree: '11 days, 21 hours' },
  ]);
});

test('estTexte ne lit le corps que des réponses textuelles', () => {
  assert.equal(estTexte('text/html; charset=UTF-8'), true);
  assert.equal(estTexte('application/xhtml+xml'), true);
  assert.equal(estTexte('application/pdf'), false);
  assert.equal(estTexte(null), true);
});

test('lireAutocompletion lit la réponse firefox de Google et rend une liste vide sur tout le reste', async () => {
  const { lireAutocompletion } = await import('../../scripts/lib/seo-instruments.mjs');
  assert.deepEqual(lireAutocompletion(['crm dsn', ['crm dsn c est quoi', 'crm dsn 120']]), ['crm dsn c est quoi', 'crm dsn 120']);
  assert.deepEqual(lireAutocompletion(['sans volume', []]), []);
  assert.deepEqual(lireAutocompletion({ pas: 'un tableau' }), []);
  assert.deepEqual(lireAutocompletion(null), []);
});
