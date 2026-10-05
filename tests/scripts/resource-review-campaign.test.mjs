import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { carryResourceReview } from '../../scripts/lib/resource-review-carry.mjs';

test('rescellement conserve la date de campagne de la revue reportée, pas la date historique', () => {
  const precedent = JSON.parse(readFileSync('editorial/resources/glossaire/manifest.json', 'utf8'));
  const sensitiveMatter = precedent.claimsEvidence.sensitiveMatter;
  const report = carryResourceReview(precedent);
  assert.equal(report.checkedAt, sensitiveMatter.checkedAt);
  assert.deepEqual(report.revue, sensitiveMatter.businessReview);
  assert.deepEqual([report.p0, report.p1, report.blocking], [precedent.quality.p0, precedent.quality.p1, precedent.quality.blocking]);
  assert.ok(report.revue.claimSourceVerdicts.every((verdict) => Date.parse(verdict.checkedAt) <= Date.parse(report.checkedAt)));
});
