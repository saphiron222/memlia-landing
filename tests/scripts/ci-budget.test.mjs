import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'yaml';

// Real unfinished execution: run 37238384216, attempt 2 (2026-10-04).
// This is a regression workload, not a snapshot of the configured timeout.
const interrupted = {
  startedAt: '2026-10-04T22:32:43Z',
  completedAt: '2026-10-04T23:02:58Z',
  remainingTests: 4,
  testTimeoutSeconds: 30,
  teardownSeconds: 60,
};

test('le budget CI laisse terminer le parcours interrompu et son nettoyage', () => {
  const workflow = parse(readFileSync(new URL('../../.github/workflows/pr-validation.yml', import.meta.url), 'utf8'));
  const elapsedSeconds = (Date.parse(interrupted.completedAt) - Date.parse(interrupted.startedAt)) / 1000;
  const requiredSeconds = elapsedSeconds + interrupted.remainingTests * interrupted.testTimeoutSeconds + interrupted.teardownSeconds;
  const budgetSeconds = workflow.jobs.verify['timeout-minutes'] * 60;
  assert.ok(Number.isFinite(budgetSeconds), 'la CI doit conserver une limite explicite');
  assert.ok(budgetSeconds >= requiredSeconds, `budget ${budgetSeconds}s insuffisant pour le parcours observé + fin bornée (${requiredSeconds}s)`);
});
