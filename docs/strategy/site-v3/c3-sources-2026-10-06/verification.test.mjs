import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../../../../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const json = path => JSON.parse(read(path));
const prefix = 'docs/strategy/site-v3/c3-sources-2026-10-06/';

test('C3: les cinq citations restent soutenues sans transformer une panne en disparition', () => {
  const report = json(`${prefix}verification.json`);
  assert.equal(report.citations.length, 5);
  assert.equal(new Set(report.citations.map(c => c.id)).size, 5);
  const maintenance = json('editorial/maintenance.json').taches;
  for (const citation of report.citations) {
    const recipe = json(`editorial/recettes/${citation.slug}/recette.json`);
    const source = recipe.sources.find(s => s.id === citation.sourceId);
    const manifest = json(`editorial/articles/${citation.slug}/manifest.json`);
    assert.equal(manifest.sources.find(s => s.id === citation.sourceId).url, source.url);
    assert.equal(source.excerpt, citation.excerpt);
    const evidence = read(`${prefix}${citation.evidence}`);
    assert.equal(createHash('sha256').update(evidence).digest('hex'), citation.evidenceSha256);
    const content = citation.transport === 'web_extract' ? JSON.parse(evidence).results[0].content : evidence;
    assert.ok(content.includes(citation.excerpt), citation.id);
    const task = maintenance.find(t => t.id === citation.id);
    assert.ok(task, citation.id);
    if (citation.transport === 'web_extract') {
      assert.equal(citation.localVerifierStatus, 'FAIL');
      assert.equal(task.statut, 'a-faire');
      assert.ok(citation.limit.length > 40);
    } else {
      assert.equal(citation.httpStatus, 200);
      assert.equal(task.statut, 'ecarte');
    }
  }
});
