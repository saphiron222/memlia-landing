import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { jugerIndexation } from '../../scripts/lib/seo-regles.mjs';
import * as sentinelle from '../../scripts/seo/sentinelle.mjs';
import { deriveComparer } from '../../scripts/lib/seo-instruments.mjs';

const verdict = (variantes) => jugerIndexation({ variantes, aujourdhui: '2026-10-11' });

test('un timeout de variante exclut la mesure sans inventer une mauvaise redirection', () => {
  const r = verdict([{ url: 'https://www.memlia.fr/', status: 0, erreur: 'délai dépassé', finalUrl: 'https://www.memlia.fr/' }]);
  assert.equal(r.rouges.length, 0);
  assert.equal(r.avertissements[0]?.code, 'variante-indisponible');
});

test('une inspection indisponible conserve le dernier état connu sans le compter comme mesure', () => {
  const r = jugerIndexation({ inspections: [{ url: 'https://memlia.fr/', error: 'quota' }], etatPrecedent: { 'https://memlia.fr/': 'indexee' }, aujourdhui: '2026-10-11' });
  assert.equal(r.etat['https://memlia.fr/'], 'indexee');
  assert.equal(r.resume.indexees, 0);
});

test('un suivi interrompu reste indisponible même si la première réponse était 301', () => {
  const r = verdict([{ url: 'http://www.memlia.fr/', status: 301, location: 'https://memlia.fr/', finalUrl: 'https://memlia.fr/', erreur: 'fetch failed' }]);
  assert.equal(r.avertissements[0]?.code, 'variante-indisponible');
});

test('une vraie réponse 200 sur www reste rouge', () => {
  assert.equal(verdict([{ url: 'https://www.memlia.fr/', status: 200, finalUrl: 'https://www.memlia.fr/' }]).rouges[0]?.code, 'variante-non-redirigee');
});

test('récupère le dernier état archivé, complète les absents sans écraser le local', () => {
  const root = mkdtempSync(join(tmpdir(), 'sentinelle-'));
  const archiveRoot = join(root, 'archives');
  const write = (path, data) => { mkdirSync(join(path, '..'), { recursive: true }); writeFileSync(path, JSON.stringify(data)); };
  const state = (id, date) => ({ version: 1, baselines: { 'https://memlia.fr/': { baselineId: id, date } }, premieresVues: { 'https://memlia.fr/': '2026-09-17' }, etat: { 'https://memlia.fr/': 'indexee' } });
  try {
    write(join(archiveRoot, '20261006', 'docs/strategy/site-v3/mesures/sentinelle-etat.json'), state(105, '2026-10-06'));
    write(join(archiveRoot, '20261007', 'docs/strategy/site-v3/mesures/sentinelle-etat.json'), state(160, '2026-10-07'));
    const r = sentinelle.chargerEtatSentinelle({ root, archiveRoot });
    assert.equal(r.etat.baselines['https://memlia.fr/'].baselineId, 160);
    assert.equal(r.etat.premieresVues['https://memlia.fr/'], '2026-09-17');
    write(join(root, '.qa/seo/etat-sentinelle.json'), state(200, '2026-10-08'));
    assert.equal(sentinelle.chargerEtatSentinelle({ root, archiveRoot }).etat.baselines['https://memlia.fr/'].baselineId, 200);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('un état corrompu est signalé et jamais remplacé silencieusement', () => {
  const root = mkdtempSync(join(tmpdir(), 'sentinelle-'));
  try {
    mkdirSync(join(root, '.qa/seo'), { recursive: true });
    writeFileSync(join(root, '.qa/seo/etat-sentinelle.json'), '{');
    assert.throws(() => sentinelle.chargerEtatSentinelle({ root, archiveRoot: join(root, 'absent') }));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('une seule reprise réseau, première exception conservée dans le brut', async () => {
  const responses = [
    { status: 0, erreur: 'délai dépassé' },
    { status: 200, finalUrl: 'https://memlia.fr/', redirections: 1 },
    { status: 301, location: 'https://memlia.fr/' },
    { status: 200, finalUrl: 'https://memlia.fr/', redirections: 1 },
  ];
  let calls = 0;
  const r = await sentinelle.releverVariante('https://www.memlia.fr/', { chercher: async () => responses[calls++] });
  assert.equal(calls, 4);
  assert.equal(r.status, 301);
  assert.equal(r.erreur, null);
  assert.equal(r.tentatives[0].erreur, 'délai dépassé');
  assert.equal(r.tentatives.length, 2);
});

test('une panne persistante cesse après une reprise et reste indisponible', async () => {
  let calls = 0;
  const r = await sentinelle.releverVariante('https://www.memlia.fr/', { chercher: async () => { calls += 1; return { status: 0, erreur: 'timeout' }; } });
  assert.equal(calls, 4);
  assert.equal(r.erreur, 'timeout');
});

test('la couverture exclut les nouvelles baselines et la variante sans réponse', () => {
  const r = sentinelle.couvertureSentinelle({ urls: ['a', 'b'], inspections: [{ url: 'a', coverage_state: 'Indexed' }], derive: [{ url: 'a', statut: 'ok' }, { url: 'b', statut: 'sans-baseline' }], variantes: [{ url: 'www', status: 0, erreur: 'timeout' }], sitemapsDisponibles: true, analytiqueDisponible: true });
  assert.equal(r.complete, false);
  assert.deepEqual(r.derive.exclues, ['b']);
  assert.deepEqual(r.inspections.exclues, ['b']);
  assert.deepEqual(r.variantes.exclues, ['www']);
});

test('le comparateur transmet précisément l’ID mémorisé, pas la dernière baseline globale', () => {
  let args;
  const execute = (_script, received) => { args = received; return { code: 0, sortie: '{"summary":{"triggered":0},"baseline_id":105}' }; };
  const r = deriveComparer('https://memlia.fr/', { baselineId: 105, commitBaseline: 'abc', execute });
  assert.deepEqual(args, ['https://memlia.fr/', '--skip-cwv', '--baseline-id', '105']);
  assert.equal(r.baselineId, 105);
});

test('une baseline mémorisée absente de SQLite reste en exception, pas à remplacer', () => {
  const execute = () => ({ code: 1, sortie: '{"error":"No baseline found"}' });
  const r = deriveComparer('https://memlia.fr/', { baselineId: 105, execute });
  assert.equal(r.statut, 'erreur');
  assert.match(r.message, /105/);
});

test('une baseline différente de celle demandée ne constitue pas une comparaison', () => {
  const execute = () => ({ code: 0, sortie: '{"summary":{"triggered":0},"baseline_id":999}' });
  assert.equal(deriveComparer('https://memlia.fr/', { baselineId: 105, execute }).statut, 'erreur');
});
