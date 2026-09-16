import { test } from 'node:test';
import assert from 'node:assert/strict';
import { purger, EMPREINTE_MS, MESSAGES_MS } from '../../workers/purge-contact/index.mjs';

test('la purge efface les empreintes de plus de 24 h et les messages de plus de 365 jours, par requêtes liées', async () => {
  const requetes = [];
  const db = { prepare: (sql) => ({ bind: (...valeurs) => ({ run: async () => { requetes.push({ sql, valeurs }); return { meta: { changes: sql.startsWith('UPDATE') ? 4 : 1 } }; } }) }) };
  const maintenant = Date.parse('2026-09-16T12:00:00.000Z');
  const bilan = await purger(db, maintenant);
  assert.deepEqual(bilan, { empreintesEffacees: 4, messagesSupprimes: 1 });
  assert.equal(requetes.length, 2);
  assert.match(requetes[0].sql, /^UPDATE messages SET ip_hash = NULL WHERE ip_hash IS NOT NULL AND recu_le < \?1$/);
  assert.deepEqual(requetes[0].valeurs, [new Date(maintenant - EMPREINTE_MS).toISOString()]);
  assert.equal(requetes[0].valeurs[0], '2026-09-15T12:00:00.000Z');
  assert.match(requetes[1].sql, /^DELETE FROM messages WHERE recu_le < \?1$/);
  assert.equal(requetes[1].valeurs[0], '2025-09-16T12:00:00.000Z');
  assert.equal(MESSAGES_MS, 365 * 24 * 60 * 60 * 1000);
});
