import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { collectCheckRuns, evaluateBlogAutoMerge, verifyMergeCheckout } from '../../scripts/lib/blog-auto-merge-gate.mjs';

const head = 'a'.repeat(40);
const main = 'b'.repeat(40);
const proof = () => ({
  expectedHead: head, expectedMain: main, remoteMain: main,
  pr: { number: 8, state: 'OPEN', isDraft: false, baseRefName: 'main', baseRefOid: main,
    headRefOid: head, mergeable: 'MERGEABLE', mergeStateStatus: 'CLEAN' },
  qa: { task: { assignee: 'qa', status: 'done' }, runs: [{ profile: 'qa', outcome: 'completed',
    summary: 'PASS', metadata: { verdict: 'PASS', pr: 8, pr_head: head,
      ci: { exact_head: true, head, success_verified: true } } }] },
  checks: { total_count: 1, check_runs: [{ name: 'Repository gates', head_sha: head,
    status: 'completed', conclusion: 'success' }] },
  changedPaths: ['docs/strategy/site-v3/RUNBOOK-QUOTIDIEN.md',
    'scripts/cron-preflight.mjs', 'tests/scripts/cron-preflight.test.mjs'],
});

test('exact-head independent QA and CI allow a procedural blog PR', () => {
  assert.equal(evaluateBlogAutoMerge(proof()).pass, true);
});

test('blog article and recipe paths remain eligible', () => {
  const p = proof();
  p.changedPaths = ['editorial/articles/exemple/manifest.json',
    'editorial/recettes/exemple/recette.json', 'src/content/blog/exemple.md'];
  assert.equal(evaluateBlogAutoMerge(p).pass, true);
});

test('all check-run pages are counted, including a failed earlier run', () => {
  const p = proof();
  const failed = { ...p.checks.check_runs[0], conclusion: 'failure' };
  const pages = [
    { total_count: 2, check_runs: [failed] },
    { total_count: 2, check_runs: p.checks.check_runs },
  ];
  p.checks = collectCheckRuns(pages);
  assert.equal(evaluateBlogAutoMerge(p).pass, false);
  assert.throws(() => collectCheckRuns(pages.slice(1)), /incomplete/);
  assert.throws(() => collectCheckRuns([{ ...pages[0], total_count: 3 }, pages[1]]), /incomplete/);
});

test('repository policy exception requires PR #3 and the reviewed policy blob after rebasing', () => {
  const p = proof();
  p.changedPaths.push('CLAUDE.md');
  assert.equal(evaluateBlogAutoMerge(p).pass, false);
  p.pr.number = 3;
  assert.equal(evaluateBlogAutoMerge(p).pass, false);
  p.qa.runs[0].metadata.pr = 3;
  p.policyBlobSha = 'b3b1d575a4405d9288ff8d2f1842d8faa2950535';
  assert.equal(evaluateBlogAutoMerge(p).pass, true);
  p.policyBlobSha = 'c'.repeat(40);
  assert.equal(evaluateBlogAutoMerge(p).pass, false);
  p.policyBlobSha = 'b3b1d575a4405d9288ff8d2f1842d8faa2950535';
  p.pr.number = p.qa.runs[0].metadata.pr = 4;
  assert.equal(evaluateBlogAutoMerge(p).pass, false);
});

test('merge requires a pristine installed main checkout at the expected base', () => {
  const values = new Map([
    ['rev-parse --show-toplevel', '/repo'], ['branch --show-current', 'main'],
    ['rev-parse HEAD', main], ['status --porcelain', ''],
    ['ls-remote origin refs/heads/main', `${main}\trefs/heads/main`],
  ]);
  const call = (...args) => values.get(args[1].join(' '));
  const verify = () => verifyMergeCheckout({ call, cwd: '/repo', scriptPath: '/repo/scripts/blog-auto-merge.mjs', expectedMain: main });
  assert.equal(verify(), true);
  values.set('rev-parse HEAD', head);
  assert.equal(verify(), false);
  values.set('rev-parse HEAD', main);
  values.set('status --porcelain', ' M scripts/blog-auto-merge.mjs');
  assert.equal(verify(), false);
  values.set('status --porcelain', '');
  values.set('ls-remote origin refs/heads/main', `${head}\trefs/heads/main`);
  assert.equal(verify(), false);
  values.set('ls-remote origin refs/heads/main', `${main}\trefs/heads/main`);
  assert.equal(verifyMergeCheckout({ call, cwd: '/repo', scriptPath: '/other/scripts/blog-auto-merge.mjs', expectedMain: main }), false);
});

test('CLI validates the PR #3 policy blob and refuses merge from a candidate checkout', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'blog-merge-refusal-'));
  try {
    const bin = path.join(dir, 'bin');
    mkdirSync(bin);
    const payload = proof();
    payload.pr.number = 3;
    payload.qa.runs[0].metadata.pr = 3;
    payload.changedPaths = ['CLAUDE.md'];
    payload.policyBlobSha = 'c'.repeat(40);
    writeFileSync(path.join(dir, 'evidence.json'), JSON.stringify(payload));
    for (const name of ['gh', 'hermes', 'git']) {
      writeFileSync(path.join(bin, name), `#!/usr/bin/env node
const fs = require('node:fs');
const p = JSON.parse(fs.readFileSync(process.env.GATE_EVIDENCE, 'utf8'));
const a = process.argv.slice(2).join(' ');
if (${JSON.stringify(name)} === 'gh') {
  if (a.startsWith('pr view ')) console.log(JSON.stringify(p.pr));
  else if (a.startsWith('api ')) {
    if (a.includes('/contents/CLAUDE.md?ref=')) console.log(JSON.stringify({ type: 'file', sha: p.policyBlobSha }));
    else if (a.includes('filter=all') && a.includes('--paginate --slurp')) console.log(JSON.stringify([p.checks]));
    else process.exit(8);
  }
  else if (a.startsWith('pr diff ')) console.log(p.changedPaths.join('\\n'));
  else if (a.startsWith('pr merge ')) fs.writeFileSync(process.env.GATE_MERGED, 'yes');
  else process.exit(7);
} else if (${JSON.stringify(name)} === 'hermes') console.log(JSON.stringify(p.qa));
else if (a === 'ls-remote origin refs/heads/main') console.log('${main}\\trefs/heads/main');
else if (a === 'rev-parse --show-toplevel') console.log(process.cwd());
else if (a === 'branch --show-current') console.log('candidate');
else process.exit(7);
`, { mode: 0o755 });
    }
    const runGate = (merge = false) => spawnSync(process.execPath, [path.resolve('scripts/blog-auto-merge.mjs'),
      '--pr', '3', '--qa-task', 't_aaaaaaaa', '--expected-head', head, '--expected-main', main,
      ...(merge ? ['--merge'] : [])],
    { cwd: dir, encoding: 'utf8', env: { ...process.env, PATH: `${bin}:${process.env.PATH}`,
      GATE_EVIDENCE: path.join(dir, 'evidence.json'), GATE_MERGED: path.join(dir, 'merged') } });
    assert.equal(runGate().status, 2);
    payload.policyBlobSha = 'b3b1d575a4405d9288ff8d2f1842d8faa2950535';
    writeFileSync(path.join(dir, 'evidence.json'), JSON.stringify(payload));
    assert.equal(runGate().status, 0);
    const run = runGate(true);
    assert.equal(run.status, 2, run.stderr);
    assert.match(run.stderr, /clean, current main checkout/);
    assert.throws(() => readFileSync(path.join(dir, 'merged')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

for (const [name, change] of [
  ['draft', p => { p.pr.isDraft = true; }],
  ['moved head', p => { p.pr.headRefOid = 'c'.repeat(40); }],
  ['moved main', p => { p.remoteMain = 'c'.repeat(40); }],
  ['conflict', p => { p.pr.mergeStateStatus = 'DIRTY'; }],
  ['stale QA', p => { p.qa.runs[0].metadata.pr_head = 'c'.repeat(40); }],
  ['failed QA', p => { p.qa.runs[0].summary = 'FAIL'; }],
  ['conditional QA', p => { p.qa.runs[0].metadata.verdict = 'PASS AVEC RÉSERVES'; }],
  ['conditional QA summary', p => { p.qa.runs[0].summary = 'PASS AVEC RÉSERVES'; }],
  ['qualified QA summary', p => { p.qa.runs[0].summary = 'PASS technique, réserves de release'; }],
  ['implicit QA caveat', p => { p.qa.runs[0].summary = 'PASS pending release validation'; }],
  ['QA for another PR', p => { p.qa.runs[0].metadata.pr = 3; }],
  ['contradictory CI head', p => { p.qa.runs[0].metadata.ci.head = main; }],
  ['CI not verified', p => { p.qa.runs[0].metadata.ci.success_verified = false; }],
  ['non-independent QA', p => { p.qa.task.assignee = 'dev'; }],
  ['QA completed by a different profile', p => { p.qa.runs[0].profile = 'platform'; }],
  ['QA run without a profile', p => { delete p.qa.runs[0].profile; }],
  ['wrong check SHA', p => { p.checks.check_runs[0].head_sha = 'c'.repeat(40); }],
  ['failed check', p => { p.checks.check_runs[0].conclusion = 'failure'; }],
  ['concurrent failed check', p => { p.checks.check_runs.push({ name: 'Repository gates', head_sha: head, status: 'completed', conclusion: 'failure' }); p.checks.total_count++; }],
  ['concurrent pending check', p => { p.checks.check_runs.push({ name: 'Repository gates', head_sha: head, status: 'in_progress', conclusion: null }); p.checks.total_count++; }],
  ['truncated check response', p => { p.checks.total_count++; }],
  ['CI workflow modification', p => { p.changedPaths.push('.github/workflows/pr-validation.yml'); }],
  ['unreviewed policy modification', p => { p.changedPaths.push('.agents/product-marketing.md'); }],
  ['unrelated page', p => { p.changedPaths.push('src/pages/pricing.astro'); }],
  ['glossary manifest outside blog', p => { p.changedPaths.push('editorial/resources/glossaire/manifest.json'); }],
  ['sitewide SEO integrity script', p => { p.changedPaths.push('scripts/seo/integrite.mjs'); }],
  ['global image asset', p => { p.changedPaths.push('public/images/hero-768.webp'); }],
  ['global image registry', p => { p.changedPaths.push('src/data/images.mjs'); }],
  ['global llms policy', p => { p.changedPaths.push('public/llms.txt'); }],
  ['push policy', p => { p.changedPaths.push('scripts/agent-push-policy.mjs'); }],
  ['push policy test', p => { p.changedPaths.push('tests/scripts/agent-push-policy.test.mjs'); }],
  ['global script disguised as blog', p => { p.changedPaths.push('scripts/blog-global-policy.mjs'); }],
  ['global script test disguised as blog', p => { p.changedPaths.push('tests/scripts/blog-global-policy.test.mjs'); }],
  ['blog prefix directory traversal', p => { p.changedPaths.push('src/content/blog/../../pages/pricing.astro'); }],
  ['blog-like sibling script', p => { p.changedPaths.push('scripts/blogevil/backdoor.mjs'); }],
]) test(`refuses ${name}`, () => {
  const p = proof();
  change(p);
  assert.equal(evaluateBlogAutoMerge(p).pass, false);
});
