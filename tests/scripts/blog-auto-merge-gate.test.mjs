import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateBlogAutoMerge } from '../../scripts/lib/blog-auto-merge-gate.mjs';

const head = 'a'.repeat(40);
const main = 'b'.repeat(40);
const proof = () => ({
  expectedHead: head, expectedMain: main, remoteMain: main,
  pr: { number: 8, state: 'OPEN', isDraft: false, baseRefName: 'main', baseRefOid: main,
    headRefOid: head, mergeable: 'MERGEABLE', mergeStateStatus: 'CLEAN' },
  qa: { task: { assignee: 'qa', status: 'done' }, runs: [{ outcome: 'completed',
    summary: 'PASS technical', metadata: { verdict: 'PASS technical', pr_head: head,
      ci: { exact_head: true } } }] },
  checks: { check_runs: [{ name: 'Repository gates', head_sha: head,
    status: 'completed', conclusion: 'success' }] },
  changedPaths: ['docs/strategy/site-v3/RUNBOOK-QUOTIDIEN.md',
    'scripts/cron-preflight.mjs', 'tests/scripts/cron-preflight.test.mjs'],
});

test('exact-head independent QA and CI allow a procedural blog PR', () => {
  assert.equal(evaluateBlogAutoMerge(proof()).pass, true);
});

test('repository policy exception is pinned to the preflight PR and its reviewed head', () => {
  const p = proof();
  p.changedPaths.push('CLAUDE.md');
  assert.equal(evaluateBlogAutoMerge(p).pass, false);
  p.pr.number = 3;
  assert.equal(evaluateBlogAutoMerge(p).pass, false);
  p.expectedHead = p.pr.headRefOid = p.qa.runs[0].metadata.pr_head =
    p.checks.check_runs[0].head_sha = 'e024882b1c1048eadff8835e20313292087a2145';
  assert.equal(evaluateBlogAutoMerge(p).pass, true);
});

for (const [name, change] of [
  ['draft', p => { p.pr.isDraft = true; }],
  ['moved head', p => { p.pr.headRefOid = 'c'.repeat(40); }],
  ['moved main', p => { p.remoteMain = 'c'.repeat(40); }],
  ['conflict', p => { p.pr.mergeStateStatus = 'DIRTY'; }],
  ['stale QA', p => { p.qa.runs[0].metadata.pr_head = 'c'.repeat(40); }],
  ['failed QA', p => { p.qa.runs[0].summary = 'FAIL'; }],
  ['non-independent QA', p => { p.qa.task.assignee = 'dev'; }],
  ['wrong check SHA', p => { p.checks.check_runs[0].head_sha = 'c'.repeat(40); }],
  ['failed check', p => { p.checks.check_runs[0].conclusion = 'failure'; }],
  ['CI workflow modification', p => { p.changedPaths.push('.github/workflows/pr-validation.yml'); }],
  ['unreviewed policy modification', p => { p.changedPaths.push('.agents/product-marketing.md'); }],
  ['unrelated page', p => { p.changedPaths.push('src/pages/pricing.astro'); }],
  ['blog-like sibling script', p => { p.changedPaths.push('scripts/blogevil/backdoor.mjs'); }],
]) test(`refuses ${name}`, () => {
  const p = proof();
  change(p);
  assert.equal(evaluateBlogAutoMerge(p).pass, false);
});
