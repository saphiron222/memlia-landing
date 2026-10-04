import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost } from '../../functions/api/contact.js';

const champs = { nom: 'Camille Exemple', courriel: 'camille@example.test', message: 'Une opération répétitive à automatiser chaque mois.', consentement: 'on' };
function scenario(token = 'jeton-fictif', envExtra = {}) {
  const writes = [];
  const DB = { prepare(sql) { return { bind(...values) { return {
    async first() { return 0; },
    async run() { writes.push({ sql, values }); return { meta: { last_row_id: 1 } }; },
  }; } }; } };
  const request = new Request('https://memlia.fr/api/contact', {
    method: 'POST', headers: { accept: 'application/json', 'content-type': 'application/json', 'cf-connecting-ip': '203.0.113.8' },
    body: JSON.stringify({ ...champs, 'cf-turnstile-response': token }),
  });
  return { request, env: { DB, CONTACT_SALT: 'test', TURNSTILE_SECRET: 'secret-fictif', ...envExtra }, writes };
}
function siteverify(t, response) {
  const previous = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    if (response instanceof Error) throw response;
    return response;
  };
  t.after(() => { globalThis.fetch = previous; });
  return calls;
}
const success = { success: true, hostname: 'memlia.fr', action: 'contact' };

test('jeton vérifié : seul le jeton et le secret partent vers Siteverify, puis insertion', async (t) => {
  const calls = siteverify(t, Response.json(success));
  const s = scenario();
  assert.equal((await onRequestPost(s)).status, 200);
  assert.equal(s.writes.filter(({ sql }) => sql.startsWith('INSERT')).length, 1);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
  assert.equal(new URLSearchParams(calls[0].options.body).get('response'), 'jeton-fictif');
  const transmis = [...new URLSearchParams(calls[0].options.body).values()];
  for (const value of Object.values(champs)) assert.equal(transmis.includes(value), false);
});

test('jeton absent, mauvais type, trop long ou secret absent : aucun appel distant ni écriture', async (t) => {
  const calls = siteverify(t, Response.json(success));
  for (const token of ['', null, 123, {}, 'x'.repeat(2050)]) {
    const s = scenario(token);
    assert.notEqual((await onRequestPost(s)).status, 200);
    assert.equal(s.writes.length, 0);
  }
  const s = scenario('jeton-fictif', { TURNSTILE_SECRET: '' });
  assert.equal((await onRequestPost(s)).status, 503);
  assert.equal(s.writes.length, 0);
  assert.equal(calls.length, 0);
});

for (const [label, reply] of [
  ['refus ou rejeu', { success: false, hostname: 'memlia.fr', action: 'contact' }],
  ['succès non booléen', { success: 'true', hostname: 'memlia.fr', action: 'contact' }],
  ['hostname tiers', { success: true, hostname: 'evil.example', action: 'contact' }],
  ['action différente', { success: true, hostname: 'memlia.fr', action: 'login' }],
  ['champ manquant', { success: true, hostname: 'memlia.fr' }],
]) {
  test(`Siteverify ${label} : aucune écriture`, async (t) => {
    siteverify(t, Response.json(reply));
    const s = scenario();
    assert.notEqual((await onRequestPost(s)).status, 200);
    assert.equal(s.writes.length, 0);
  });
}
for (const [label, reply] of [
  ['panne', new Error('réseau')],
  ['HTTP 500', new Response('erreur', { status: 500 })],
  ['JSON illisible', new Response('pas JSON')],
]) {
  test(`Siteverify ${label} : aucune écriture`, async (t) => {
    siteverify(t, reply);
    const s = scenario();
    assert.notEqual((await onRequestPost(s)).status, 200);
    assert.equal(s.writes.length, 0);
  });
}

test('corps mensonger sans Content-Length : lecture réellement bornée', async (t) => {
  const calls = siteverify(t, Response.json(success));
  const s = scenario();
  const request = new Request(s.request.url, { method: 'POST', headers: s.request.headers, body: JSON.stringify({ ...champs, message: 'x'.repeat(21_000), 'cf-turnstile-response': 'jeton-fictif' }) });
  assert.equal((await onRequestPost({ ...s, request })).status, 413);
  assert.equal(s.writes.length, 0);
  assert.equal(calls.length, 0);
});
