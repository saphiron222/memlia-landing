import { test } from 'node:test';
import assert from 'node:assert/strict';
import { valider, onRequestPost, onRequestGet } from '../../functions/api/contact.js';

/** Base D1 factice : assez de surface pour prouver ce que la fonction écrit et compte. */
function fauxD1({ recents = 0 } = {}) {
  const inserts = [];
  const requetes = [];
  const prepare = (sql) => ({
    bind: (...valeurs) => ({
      first: async () => { requetes.push({ sql, valeurs }); return recents; },
      run: async () => { requetes.push({ sql, valeurs }); if (sql.startsWith('INSERT')) inserts.push(valeurs); return { success: true }; },
    }),
  });
  return { prepare, inserts, requetes };
}

const formulaire = (champs) => {
  const fd = new FormData();
  for (const [cle, valeur] of Object.entries(champs)) fd.set(cle, valeur);
  return new Request('https://memlia.fr/api/contact', { method: 'POST', body: fd, headers: { 'cf-connecting-ip': '203.0.113.7' } });
};
const json = (champs, accept = 'application/json') => new Request('https://memlia.fr/api/contact', {
  method: 'POST', body: JSON.stringify(champs), headers: { 'content-type': 'application/json', accept, 'cf-connecting-ip': '203.0.113.7' },
});
const valide = { nom: 'Claire Fictive', cabinet: 'Cabinet Exemple', courriel: 'claire@exemple.test', message: 'Nous refaisons chaque mois le même rapprochement entre deux exports.', consentement: 'on' };

test('valider : un message complet passe, chaque manque est nommé', () => {
  assert.deepEqual(valider(valide).erreurs, []);
  assert.deepEqual(valider({ ...valide, nom: 'A' }).erreurs, ['nom']);
  assert.deepEqual(valider({ ...valide, courriel: 'pas-une-adresse' }).erreurs, ['courriel']);
  assert.deepEqual(valider({ ...valide, message: 'trop court' }).erreurs, ['message']);
  assert.deepEqual(valider({ ...valide, consentement: '' }).erreurs, ['consentement']);
});

test('valider : les longueurs sont bornées, jamais tronquées en silence côté sens', () => {
  const { champs } = valider({ ...valide, message: 'x'.repeat(10_000) });
  assert.equal(champs.message.length, 4000);
});

test('sans JavaScript : un envoi valide est écrit puis redirigé vers la page avec envoye=1', async () => {
  const DB = fauxD1();
  const reponse = await onRequestPost({ request: formulaire(valide), env: { DB } });
  assert.equal(reponse.status, 303);
  assert.equal(new URL(reponse.headers.get('location')).pathname, '/contact/merci');
  assert.equal(DB.inserts.length, 1);
  assert.equal(DB.inserts[0][1], 'Claire Fictive');
  assert.equal(DB.inserts[0][3], 'claire@exemple.test');
  assert.match(DB.inserts[0][5], /^[0-9a-f]{64}$/, 'l’adresse IP est hachée, jamais stockée en clair');
});

test('avec fetch : la même fonction répond en JSON', async () => {
  const DB = fauxD1();
  const reponse = await onRequestPost({ request: json(valide), env: { DB } });
  assert.equal(reponse.status, 200);
  assert.deepEqual(await reponse.json(), { ok: true, code: '1' });
});

test('le champ piège rempli rend un faux succès et n’écrit rien', async () => {
  const DB = fauxD1();
  const reponse = await onRequestPost({ request: json({ ...valide, site_web: 'http://spam.example' }), env: { DB } });
  assert.equal(reponse.status, 200);
  assert.equal(DB.inserts.length, 0);
});

test('une erreur de validation ne touche pas la base et nomme le champ', async () => {
  const DB = fauxD1();
  const reponse = await onRequestPost({ request: json({ ...valide, courriel: 'x' }), env: { DB } });
  assert.equal(reponse.status, 422);
  assert.deepEqual(await reponse.json(), { ok: false, code: 'courriel', erreurs: ['courriel'] });
  assert.equal(DB.inserts.length, 0);
});

test('au-delà de trois messages par heure depuis la même adresse, refus 429 sans écriture', async () => {
  const DB = fauxD1({ recents: 3 });
  const reponse = await onRequestPost({ request: json(valide), env: { DB } });
  assert.equal(reponse.status, 429);
  assert.equal(DB.inserts.length, 0);
});

test('sans base liée, la fonction refuse au lieu de perdre le message en silence', async () => {
  const reponse = await onRequestPost({ request: json(valide), env: {} });
  assert.equal(reponse.status, 503);
});

test('Turnstile configuré : un jeton absent ferme la porte', async () => {
  const DB = fauxD1();
  const reponse = await onRequestPost({ request: json(valide), env: { DB, TURNSTILE_SECRET: 'secret' } });
  assert.equal(reponse.status, 422);
  assert.equal(DB.inserts.length, 0);
});

test('GET répond 405 avec la méthode autorisée', async () => {
  const reponse = await onRequestGet();
  assert.equal(reponse.status, 405);
  assert.equal(reponse.headers.get('allow'), 'POST');
});
