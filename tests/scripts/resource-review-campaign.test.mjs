import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
test('rescellement conserve la date de campagne de la revue reportée, pas la date historique', () => {
  const source = readFileSync('scripts/seal-resource-surfaces.mjs', 'utf8');
  // Exerce les expressions réellement employées par le CLI, sans reconstruire les fichiers du dépôt.
  const carried = source.match(/revueReportee = \{([\s\S]*?)\n      \};/)[1];
  const expression = carried.match(/checkedAt:\s*([^,\n]+)/)?.[1];
  assert.ok(expression, 'la date de campagne doit être reportée avec le verdict');
  const precedent = { claimsEvidence:{ sensitiveMatter:{ checkedAt:'2026-10-04T02:49:45.632Z' } } };
  const checkedAt = vm.runInNewContext(expression, { precedent });
  const actual = source.match(/manifest\.claimsEvidence\.sensitiveMatter = \{([\s\S]*?)businessReview:/)[1].match(/checkedAt:\s*([^,\n]+)/)[1];
  assert.equal(vm.runInNewContext(actual, { revueReportee:{ checkedAt }, revueCheckedAt:'2026-09-16T21:09:13+01:00' }), precedent.claimsEvidence.sensitiveMatter.checkedAt);
  assert.equal(vm.runInNewContext(actual, { revueReportee:null, revueCheckedAt:'2026-09-16T21:09:13+01:00' }), '2026-09-16T21:09:13+01:00');
});
