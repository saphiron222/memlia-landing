import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../../scripts/cron-preflight.mjs', import.meta.url));
const git = (cwd, ...args) => {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  return r.stdout.trim();
};

test('cron refuses a wrong branch and missing runbooks instead of reporting ok', () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-cron-'));
  try {
    git(root, 'init', '-q', '-b', 'site/stale');
    git(root, 'config', 'user.email', 'test@example.invalid');
    git(root, 'config', 'user.name', 'Test');
    writeFileSync(join(root, 'README.md'), 'test');
    git(root, 'add', '.');
    git(root, 'commit', '-qm', 'init');
    const result = spawnSync(process.execPath, [script, '--root', root, '--job', 'forge'], { cwd: root, encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    const report = JSON.parse(result.stdout);
    assert.equal(report.ok, false);
    assert.ok(report.errors.some((e) => e.includes('branche')));
    assert.ok(report.errors.some((e) => e.includes('RUNBOOK-QUOTIDIEN.md')));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('cron refuses a dirty checkout and accepts only clean synced main with required files', () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-cron-'));
  try {
    git(root, 'init', '-q', '-b', 'main');
    git(root, 'config', 'user.email', 'test@example.invalid');
    git(root, 'config', 'user.name', 'Test');
    mkdirSync(join(root, 'docs/strategy/site-v3'), { recursive: true });
    for (const name of ['RUNBOOK-QUOTIDIEN.md', 'RUNBOOK-SEO.md', 'CRONS-SEO.md']) writeFileSync(join(root, 'docs/strategy/site-v3', name), 'test');
    writeFileSync(join(root, 'CLAUDE.md'), 'test');
    git(root, 'add', '.');
    git(root, 'commit', '-qm', 'init');
    git(root, 'remote', 'add', 'origin', root);
    git(root, 'fetch', '-q', 'origin', 'main');
    const args = [script, '--root', root, '--job', 'forge'];
    const valid = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' });
    assert.equal(valid.status, 0, valid.stdout + valid.stderr);
    assert.equal(JSON.parse(valid.stdout).ok, true);
    writeFileSync(join(root, 'README.md'), 'untracked');
    const dirty = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' });
    assert.notEqual(dirty.status, 0);
    assert.ok(JSON.parse(dirty.stdout).errors.some((e) => e.includes('arbre')));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('cron refuses wrong checkout, failed fetch, stale SHA and never claims publication', () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-cron-'));
  const other = mkdtempSync(join(tmpdir(), 'memlia-cron-other-'));
  try {
    git(root, 'init', '-q', '-b', 'main');
    git(root, 'config', 'user.email', 'test@example.invalid');
    git(root, 'config', 'user.name', 'Test');
    mkdirSync(join(root, 'docs/strategy/site-v3'), { recursive: true });
    for (const name of ['RUNBOOK-QUOTIDIEN.md', 'RUNBOOK-SEO.md', 'CRONS-SEO.md']) writeFileSync(join(root, 'docs/strategy/site-v3', name), 'test');
    writeFileSync(join(root, 'CLAUDE.md'), 'test');
    git(root, 'add', '.');
    git(root, 'commit', '-qm', 'init');
    const args = [script, '--root', root, '--job', 'forge'];
    const run = (cwd = root) => spawnSync(process.execPath, args, { cwd, encoding: 'utf8' });
    const wrong = run(other);
    assert.notEqual(wrong.status, 0);
    assert.ok(JSON.parse(wrong.stdout).errors.some((e) => e.includes('workdir')));
    const noRemote = run();
    assert.notEqual(noRemote.status, 0);
    assert.ok(JSON.parse(noRemote.stdout).errors.some((e) => e.includes('fetch')));
    git(root, 'clone', '-q', '--bare', root, other);
    git(root, 'remote', 'add', 'origin', other);
    git(root, 'fetch', '-q', 'origin', 'main');
    const valid = run();
    assert.equal(valid.status, 0);
    assert.deepEqual(Object.keys(JSON.parse(valid.stdout)).sort(), ['branch', 'cwd', 'errors', 'head', 'job', 'ok', 'originMain', 'root'].sort());
    writeFileSync(join(root, 'CLAUDE.md'), 'changed');
    git(root, 'add', '.');
    git(root, 'commit', '-qm', 'advance without remote');
    const stale = run();
    assert.notEqual(stale.status, 0);
    assert.ok(JSON.parse(stale.stdout).errors.some((e) => e.includes('désynchronisé')));
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(other, { recursive: true, force: true });
  }
});

test('cron publication guard accepts prepared changes then exact commit, and rejects concurrent main', () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-cron-'));
  const remote = mkdtempSync(join(tmpdir(), 'memlia-cron-remote-'));
  const competitor = mkdtempSync(join(tmpdir(), 'memlia-cron-competitor-'));
  try {
    git(root, 'init', '-q', '-b', 'main');
    git(root, 'config', 'user.email', 'test@example.invalid');
    git(root, 'config', 'user.name', 'Test');
    mkdirSync(join(root, 'docs/strategy/site-v3'), { recursive: true });
    for (const name of ['RUNBOOK-QUOTIDIEN.md', 'RUNBOOK-SEO.md']) writeFileSync(join(root, 'docs/strategy/site-v3', name), 'test');
    writeFileSync(join(root, 'CLAUDE.md'), 'test');
    git(root, 'add', '.');
    git(root, 'commit', '-qm', 'base');
    git(remote, 'init', '-q', '--bare', '-b', 'main');
    git(root, 'remote', 'add', 'origin', remote);
    git(root, 'push', '-q', '-u', 'origin', 'main');
    const base = git(root, 'rev-parse', 'HEAD');
    const run = (...extra) => spawnSync(process.execPath, [script, '--root', root, '--job', 'forge', ...extra], { cwd: root, encoding: 'utf8' });
    assert.equal(run().status, 0);
    writeFileSync(join(root, 'CLAUDE.md'), 'prepared');
    assert.equal(run().status, 1);
    assert.equal(run('--phase', 'before-commit', '--base', base).status, 0);
    assert.equal(run('--phase', 'before-commit', '--base', '0'.repeat(40)).status, 1);
    git(root, 'add', 'CLAUDE.md');
    git(root, 'commit', '-qm', 'prepared');
    const head = git(root, 'rev-parse', 'HEAD');
    assert.equal(run('--phase', 'before-push', '--base', base, '--commit', head).status, 0);
    assert.equal(run('--phase', 'before-push', '--base', base, '--commit', base).status, 1);
    writeFileSync(join(root, 'CLAUDE.md'), 'uncommitted');
    assert.equal(run('--phase', 'before-push', '--base', base, '--commit', head).status, 1);
    writeFileSync(join(root, 'CLAUDE.md'), 'prepared');
    git(competitor, 'clone', '-q', remote, '.');
    git(competitor, 'config', 'user.email', 'test@example.invalid');
    git(competitor, 'config', 'user.name', 'Test');
    writeFileSync(join(competitor, 'CLAUDE.md'), 'competitor');
    git(competitor, 'add', '.');
    git(competitor, 'commit', '-qm', 'concurrent');
    git(competitor, 'push', '-q', 'origin', 'main');
    const concurrent = run('--phase', 'before-push', '--base', base, '--commit', head);
    assert.equal(concurrent.status, 1);
    assert.ok(JSON.parse(concurrent.stdout).errors.some((e) => e.includes('désynchronisé')));
    assert.equal(run('--phase', 'before-commit', '--base', base).status, 1);
  } finally {
    for (const path of [root, remote, competitor]) rmSync(path, { recursive: true, force: true });
  }
});
