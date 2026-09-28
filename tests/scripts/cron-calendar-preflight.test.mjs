import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../../scripts/cron-preflight.mjs', import.meta.url));
const git = (root, ...args) => {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
};

test('expired planned calendar blocks a synced forge; a missed trace is inert', () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-calendar-preflight-'));
  try {
    git(root, 'init', '-q', '-b', 'main');
    git(root, 'config', 'user.email', 'test@example.invalid');
    git(root, 'config', 'user.name', 'Test');
    mkdirSync(join(root, 'docs/strategy/site-v3'), { recursive: true });
    writeFileSync(join(root, 'docs/strategy/site-v3/RUNBOOK-QUOTIDIEN.md'), 'test');
    writeFileSync(join(root, 'CLAUDE.md'), 'test');
    const plan = (status) => writeFileSync(join(root, 'docs/strategy/site-v3/cluster-plan.json'),
      JSON.stringify({ pillar: { status: 'published', date: '2026-09-16' }, clusters: [{ posts: [
        { slug: 'overdue', date: '2026-09-22', status },
      ] }] }));
    plan('planned');
    writeFileSync(join(root, 'docs/strategy/site-v3/backlog-v3.json'), '[]');
    git(root, 'add', '.');
    git(root, 'commit', '-qm', 'base');
    git(root, 'remote', 'add', 'origin', root);
    const run = () => spawnSync(process.execPath, [script, '--root', root, '--job', 'forge'], { cwd: root, encoding: 'utf8' });
    const overdue = run();
    assert.equal(overdue.status, 1);
    assert.match(overdue.stdout, /créneau planned échu.*overdue/);
    plan('manque');
    git(root, 'add', '.');
    git(root, 'commit', '-qm', 'missed trace');
    const resolved = run();
    assert.equal(resolved.status, 0, resolved.stdout + resolved.stderr);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
