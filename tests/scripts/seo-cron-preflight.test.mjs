import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const script = new URL('../../scripts/seo-cron-preflight.mjs', import.meta.url).pathname;
const git = (root, ...args) => {
  const r = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  return r.stdout.trim();
};

test('four SEO jobs use separate branches and scoped commits, never blog or main', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'seo-preflight-'));
  try {
    git(root, 'init', '-q', '-b', 'main');
    git(root, 'config', 'user.email', 'test@example.invalid');
    git(root, 'config', 'user.name', 'Test');
    mkdirSync(path.join(root, 'docs/strategy/site-v3/mesures'), { recursive: true });
    for (const file of ['CLAUDE.md', 'docs/strategy/site-v3/RUNBOOK-SEO.md',
      'docs/strategy/site-v3/CRONS-SEO.md']) writeFileSync(path.join(root, file), 'fixture');
    git(root, 'add', '.');
    git(root, 'commit', '-qm', 'base');
    git(root, 'remote', 'add', 'origin', root);
    const base = git(root, 'rev-parse', 'HEAD');
    const run = (job, phase = 'initial', more = []) => spawnSync(process.execPath,
      [script, '--root', root, '--job', job, '--phase', phase, ...more], { cwd: root, encoding: 'utf8' });
    for (const job of ['sentinelle', 'demande', 'integrite', 'autorite'])
      assert.equal(run(job).status, 0);
    assert.notEqual(run('forge').status, 0);
    git(root, 'switch', '-q', '-c', 'site/seo-mesures-demande-20260926');
    writeFileSync(path.join(root, 'docs/strategy/site-v3/mesures/rapport.json'), '{}');
    git(root, 'add', 'docs/strategy/site-v3/mesures/rapport.json');
    assert.equal(run('demande', 'before-commit', ['--base', base]).status, 0);
    assert.notEqual(run('integrite', 'before-commit', ['--base', base]).status, 0);
    git(root, 'commit', '-qm', 'measure');
    const commit = git(root, 'rev-parse', 'HEAD');
    assert.equal(run('demande', 'before-push', ['--base', base, '--commit', commit]).status, 0);
    git(root, 'switch', '-q', '-c', 'site/blog-faux-seo');
    assert.notEqual(run('demande', 'before-push', ['--base', base, '--commit', commit]).status, 0);
    git(root, 'switch', '-q', '-c', 'site/seo-mesures-integrite-20260926');
    writeFileSync(path.join(root, 'CLAUDE.md'), 'tamper');
    git(root, 'add', 'CLAUDE.md');
    assert.notEqual(run('integrite', 'before-commit', ['--base', base]).status, 0);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
