import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { onRequestPost } from '../../functions/api/contact.js';

test('demande fictive : fonction réelle, migration et stockage SQLite avec les deux champs', async (t) => {
  const sqlite = new DatabaseSync(':memory:');
  t.after(() => sqlite.close());
  sqlite.exec(readFileSync(new URL('../../db/contact/0001-messages.sql', import.meta.url), 'utf8'));
  // Colonne déjà en production depuis septembre, antérieure à cette migration.
  sqlite.exec('ALTER TABLE messages ADD COLUMN origine TEXT');
  sqlite.exec("INSERT INTO messages (recu_le, nom, courriel, message, origine) VALUES ('2026-09-01T00:00:00Z', 'Historique fictif', 'historique@example.test', 'Ancienne demande fictive', '/methode')");
  sqlite.exec(readFileSync(new URL('../../db/contact/0002-type-cabinet.sql', import.meta.url), 'utf8'));
  assert.deepEqual({ ...sqlite.prepare('SELECT origine, type_cabinet FROM messages WHERE id = 1').get() }, { origine: '/methode', type_cabinet: null });
  const DB = { prepare: (sql) => ({ bind: (...values) => ({
    first: async (column) => sqlite.prepare(sql).get(...values)[column],
    run: async () => { const result = sqlite.prepare(sql).run(...values); return { meta: { last_row_id: Number(result.lastInsertRowid) } }; },
  }) }) };
  // Seul le service anti-abus est simulé : le schéma, la fonction et l'écriture sont réels.
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async (url) => {
    assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
    return Response.json({ success: true, hostname: 'memlia.fr', action: 'contact' });
  };
  const form = new FormData();
  for (const [key, value] of Object.entries({ nom: 'Test fictif D7', courriel: 'test-d7@example.test', message: 'Test technique fictif : rapprochement de deux exports.', consentement: 'on', consentement_origine: 'on', origine: '/garanties?utm_source=test', type_cabinet: 'mixte', 'cf-turnstile-response': 'test' })) form.set(key, value);
  const response = await onRequestPost({ request: new Request('https://memlia.fr/api/contact', { method: 'POST', headers: { accept: 'application/json', 'cf-connecting-ip': '203.0.113.7' }, body: form }), env: { DB, CONTACT_SALT: 'test', TURNSTILE_SECRET: 'test' } });
  assert.equal(response.status, 200);
  assert.deepEqual({ ...sqlite.prepare('SELECT origine, type_cabinet FROM messages WHERE id = 2').get() }, { origine: '/garanties', type_cabinet: 'mixte' });
  assert.throws(() => sqlite.exec("UPDATE messages SET type_cabinet = 'autre' WHERE id = 2"), /CHECK constraint/);
});
