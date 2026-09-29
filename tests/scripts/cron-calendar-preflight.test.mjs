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

test('real published plus actionable planned cannot exceed two on one day', () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-real-quota-'));
  try {
    git(root, 'init', '-q', '-b', 'main');
    git(root, 'config', 'user.email', 'test@example.invalid');
    git(root, 'config', 'user.name', 'Test');
    mkdirSync(join(root, 'docs/strategy/site-v3'), { recursive: true });
    writeFileSync(join(root, 'docs/strategy/site-v3/RUNBOOK-QUOTIDIEN.md'), 'test');
    writeFileSync(join(root, 'CLAUDE.md'), 'test');
    const day = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const posts = [
      { slug: 'published-1', date: day, status: 'published' },
      { slug: 'published-2', date: day, status: 'published' },
      { slug: 'planned', date: day, status: 'planned' },
      { slug: 'missed', date: day, status: 'manque' },
    ];
    const plan = () => writeFileSync(join(root, 'docs/strategy/site-v3/cluster-plan.json'),
      JSON.stringify({ pillar: posts[0], clusters: [{ posts: posts.slice(1) }] }));
    plan();
    writeFileSync(join(root, 'docs/strategy/site-v3/backlog-v3.json'), '[]');
    git(root, 'add', '.');
    git(root, 'commit', '-qm', 'base');
    git(root, 'remote', 'add', 'origin', root);
    const run = () => spawnSync(process.execPath, [script, '--root', root, '--job', 'forge'], { cwd: root, encoding: 'utf8' });
    const rejected = run();
    assert.equal(rejected.status, 1, rejected.stdout + rejected.stderr);
    assert.match(rejected.stdout, /jour réel.*plus de deux/);
    posts[2].status = 'a-replanifier';
    plan();
    git(root, 'add', '.');
    git(root, 'commit', '-qm', 'historical only');
    const accepted = run();
    assert.equal(accepted.status, 0, accepted.stdout + accepted.stderr);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
