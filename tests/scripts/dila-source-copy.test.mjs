import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { readDilaCopy } from '../../scripts/lib/dila-source-copy.mjs';

import { TEXT, URL, COPY } from './dila-copy-fixture.mjs';
const hash = (v) => createHash('sha256').update(v).digest('hex');
function fixture(run) {
  const root = mkdtempSync(join(tmpdir(), 'dila-copy-'));
  try {
    const write = (copy) => { const bytes = JSON.stringify(copy); writeFileSync(join(root, 'copy.json'), bytes); return hash(bytes); };
    const options = { root, path: 'copy.json', url: URL, excerpt: TEXT, asOf: '2026-10-08T12:00:00Z' };
    write(COPY); run(options, write);
  } finally { rmSync(root, { recursive: true, force: true }); }
}
test('LEGI : collecte de 0 à 7 jours inclus, version et URL conservées', () => fixture((options) => {
  for (const asOf of ['2026-10-01T10:00:00Z', '2026-10-08T12:00:00Z']) {
    const copy = readDilaCopy({ ...options, asOf });
    assert.equal(copy.text, TEXT); assert.equal(copy.retrievedAt, COPY.provenance.retrieved_at);
    assert.equal(copy.versionDate, '2025-05-03'); assert.equal(copy.url, URL);
  }
}));
test('copies absentes, sorties du dossier, périmées et futures refusées', () => fixture((options) => {
  for (const patch of [{ path: 'missing.json' }, { path: '../copy.json' }, { asOf: '2026-10-09T12:00:00Z' }, { asOf: '2026-09-30T12:00:00Z' }]) {
    assert.throws(() => readDilaCopy({ ...options, ...patch }));
  }
}));
test('horodatage Python A4 préservé : microsecondes et offset UTC, jour civil Paris', () => fixture((options, write) => {
  const copy = structuredClone(COPY);
  copy.provenance.retrieved_at = '2026-10-01T22:44:11.834561+00:00'; write(copy);
  const result = readDilaCopy({ ...options, asOf: '2026-10-09T12:00:00Z' });
  assert.equal(result.checkedAt, '2026-10-02');
  assert.equal(result.retrievedAt, copy.provenance.retrieved_at);
  assert.throws(() => readDilaCopy({ ...options, asOf: '2026-10-10T12:00:00Z' }));
}));
test('extrait inexact, provenance manquante, identifiant/version/URL incohérents refusés', () => fixture((options, write) => {
  assert.throws(() => readDilaCopy({ ...options, excerpt: 'Extrait inventé et absent de cette source' }), /extrait/i);
  const mutations = [
    (c) => { delete c.provenance; }, (c) => { c.provenance.dataset_id = 'autre'; },
    (c) => { c.provenance.sha256 = 'invalide'; }, (c) => { c.version = 'LEGIARTI000000000001'; },
    (c) => { c.valid_from = '2025-02-30'; }, (c) => { c.validity_anomaly = true; },
    (c) => { c.chunks[0].text = 'Tronqué'; }, (c) => { c.url = 'https://example.org'; },
  ];
  for (const mutate of mutations) { const c = structuredClone(COPY); mutate(c); write(c); assert.throws(() => readDilaCopy(options)); }
  write(COPY); assert.throws(() => readDilaCopy({ ...options, expectedSha256: 'b'.repeat(64) }), /empreinte/i);
}));
test('JORF : acte publié et article exact, sans convertir un JORF en LEGI', () => fixture((options, write) => {
  const c = { schema_version: 1, source_type: 'DILA_JORFSIMPLE', id: 'JORFTEXT000050685006', version: 'JORFTEXT000050685006',
    publication_date: '2024-11-30', signature_date: '2024-11-27', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000050685006',
    text: `Article 1\n${TEXT}`, articles: [{ id: 'JORFARTI000050685015', number: '1', text: TEXT }],
    provenance: { publisher: 'DILA', archive_url: 'https://echanges.dila.gouv.fr/OPENDATA/JORFSIMPLE/stock.tar.gz', archive_sha256: 'a'.repeat(64), member: 'jorf/JORFTEXT000050685006.xml', retrieved_at: COPY.provenance.retrieved_at }, warning: 'Acte publié non consolidé.' };
  write(c);
  assert.equal(readDilaCopy({ ...options, url: c.url }).text, c.text);
  assert.equal(readDilaCopy({ ...options, url: 'https://www.legifrance.gouv.fr/jorf/article_jo/JORFARTI000050685015' }).text, TEXT);
  assert.throws(() => readDilaCopy(options));
  c.provenance.archive_url = 'https://example.org/stock.tar.gz'; write(c);
  assert.throws(() => readDilaCopy({ ...options, url: c.url }));
}));
