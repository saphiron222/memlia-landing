import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { collectCheckRuns } from '../../scripts/lib/blog-auto-merge-gate.mjs';
import { evaluateSeoRelease } from '../../scripts/lib/seo-release-gate.mjs';

const head = 'a'.repeat(40);
const base = 'b'.repeat(40);
const evidence = () => ({
  expectedHead: head, expectedMain: base, remoteMain: base,
  pr: { number: 12, state: 'OPEN', isDraft: false, baseRefName: 'main', baseRefOid: base,
    headRefOid: head, mergeable: 'MERGEABLE', mergeStateStatus: 'CLEAN' },
  changedPaths: [{ filename: 'docs/strategy/site-v3/mesures/semaine-2026-W39-demande.json', status: 'added' },
    { filename: 'docs/strategy/site-v3/JOURNAL.md', status: 'modified' }],
  qa: { task: { id: 't_qa123', assignee: 'qa', status: 'done' }, runs: [{ profile: 'qa',
    outcome: 'completed', summary: 'PASS', metadata: { verdict: 'PASS', pr: 12, pr_head: head,
      ci: { exact_head: true, head, success_verified: true } } }] },
  checks: collectCheckRuns([{ total_count: 1, check_runs: [{ name: 'Repository gates', head_sha: head,
    status: 'completed', conclusion: 'success' }] }]),
  authorization: { task: { id: 't_release123', status: 'done' }, runs: [{ outcome: 'completed',
    metadata: { scope: 'seo-measures', decision: 'AUTHORIZE', pr: 12, pr_head: head,
      main_sha: base, qa_task: 't_qa123' } }] },
});

test('SEO gate accepts exact scoped proof and does not confer blog permission', () => {
  const p = evidence();
  assert.equal(evaluateSeoRelease(p).pass, true);
  p.changedPaths = [{ filename: 'src/content/blog/example.md', status: 'added' }];
  assert.equal(evaluateSeoRelease(p).pass, false);
});

for (const [name, mutate] of [
  ['missing authorization', p => { delete p.authorization; }],
  ['blog authorization', p => { p.authorization.runs[0].metadata.scope = 'blog'; }],
  ['other PR authorization', p => { p.authorization.runs[0].metadata.pr = 3; }],
  ['stale authorization', p => { p.authorization.runs[0].metadata.main_sha = head; }],
  ['non-independent authorization', p => { p.authorization.task.id = p.qa.task.id; }],
  ['stale head', p => { p.pr.headRefOid = base; }],
  ['moved main', p => { p.remoteMain = head; }],
  ['draft', p => { p.pr.isDraft = true; }],
  ['conflict', p => { p.pr.mergeStateStatus = 'DIRTY'; }],
  ['missing QA', p => { delete p.qa; }],
  ['conditional QA', p => { p.qa.runs[0].summary = 'PASS with caveats'; }],
  ['failed check', p => { p.checks.check_runs[0].conclusion = 'failure'; }],
  ['other failed check', p => { p.checks.check_runs.push({ name: 'other', head_sha: head,
    status: 'completed', conclusion: 'failure' }); p.checks.total_count++; }],
  ['truncated checks', p => { p.checks.total_count++; }],
  ['renamed blog source', p => { p.changedPaths = [{ filename: 'docs/strategy/site-v3/mesures/new.md',
    status: 'renamed', previous_filename: 'src/content/blog/old.md' }]; }],
  ['site script', p => { p.changedPaths.push('scripts/seo/integrite.mjs'); }],
  ['blog document', p => { p.changedPaths.push('docs/strategy/site-v3/RUNBOOK-QUOTIDIEN.md'); }],
  ['traversal', p => { p.changedPaths.push('docs/strategy/site-v3/mesures/../RUNBOOK-SEO.md'); }],
  ['empty diff', p => { p.changedPaths = []; }],
]) test(`SEO release refuses ${name}`, () => {
  const p = evidence();
  mutate(p);
  assert.equal(evaluateSeoRelease(p).pass, false);
});

test('read-only CLI refuses unavailable evidence without publishing', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'seo-gate-'));
  try {
    const bin = path.join(dir, 'bin');
    mkdirSync(bin);
    for (const name of ['gh', 'hermes', 'git'])
      writeFileSync(path.join(bin, name), '#!/bin/sh\nexit 99\n', { mode: 0o755 });
    const result = spawnSync(process.execPath, [new URL('../../scripts/seo-release-gate.mjs', import.meta.url).pathname,
      '--pr', '12', '--qa-task', 't_aa', '--authorization-task', 't_bb',
      '--expected-head', head, '--expected-main', base],
    { cwd: dir, encoding: 'utf8', env: { ...process.env, PATH: `${bin}:${process.env.PATH}` } });
    assert.equal(result.status, 2);
    assert.match(result.stderr, /SEO release blocked/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
