import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const head = 'a'.repeat(40);
const base = 'b'.repeat(40);
for (const scenario of ['PASS', 'missing QA', 'red CI']) {
  test(`read-only SEO CLI: ${scenario}, no operator receipt`, () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'seo-cli-'));
    try {
      const evidence = {
        pr: { number: 12, state: 'OPEN', isDraft: false, baseRefName: 'main',
          baseRefOid: base, headRefOid: head, mergeable: 'MERGEABLE', mergeStateStatus: 'CLEAN' },
        qa: scenario === 'missing QA' ? {} : {
          task: { id: 't_aa', assignee: 'qa', status: 'done' },
          runs: [{ profile: 'qa', outcome: 'completed', summary: 'PASS', metadata: {
            verdict: 'PASS', pr: 12, pr_head: head,
            ci: { exact_head: true, head, success_verified: true } } }] },
        checks: { total_count: 1, check_runs: [{ name: 'Repository gates', head_sha: head,
          status: 'completed', conclusion: scenario === 'red CI' ? 'failure' : 'success' }] },
        files: [{ filename: 'docs/strategy/site-v3/mesures/cli-test.md', status: 'added' }],
        base,
      };
      const bin = path.join(dir, 'bin');
      mkdirSync(bin);
      writeFileSync(path.join(dir, 'evidence.json'), JSON.stringify(evidence));
      const fixture = `#!${process.execPath}
import { readFileSync } from 'node:fs';
const p = JSON.parse(readFileSync('evidence.json', 'utf8'));
const args = process.argv.slice(2);
if (args[0] === 'pr') console.log(JSON.stringify(p.pr));
else if (args[0] === 'kanban') console.log(JSON.stringify(p.qa));
else if (args[0] === 'ls-remote') console.log(p.base + '\\trefs/heads/main');
else if (args[1].includes('/check-runs?')) console.log(JSON.stringify([p.checks]));
else if (args[1].includes('/files?')) console.log(JSON.stringify([p.files]));
else console.log(JSON.stringify({ private: true, full_name: 'saphiron222/memlia-landing' }));
`;
      for (const name of ['gh', 'hermes', 'git'])
        writeFileSync(path.join(bin, name), fixture, { mode: 0o755 });
      writeFileSync(path.join(bin, 'python3'), '#!/bin/sh\nexit 99\n', { mode: 0o755 });
      const result = spawnSync(process.execPath, [new URL('../../scripts/seo-release-gate.mjs', import.meta.url).pathname,
        '--pr', '12', '--qa-task', 't_aa', '--expected-head', head, '--expected-main', base],
      { cwd: dir, encoding: 'utf8', env: { ...process.env, PATH: `${bin}:${process.env.PATH}` } });
      assert.equal(result.status, scenario === 'PASS' ? 0 : 2, result.stderr);
      const verdict = JSON.parse(result.stdout);
      assert.equal(verdict.pass, scenario === 'PASS');
      assert.equal(verdict.scope, 'seo-measures');
      assert.equal(verdict.publicationPerformed, false);
      assert.equal('authorizationTask' in verdict, false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
}
