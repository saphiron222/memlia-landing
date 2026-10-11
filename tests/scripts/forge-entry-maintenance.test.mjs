import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../../scripts/cron-preflight.mjs', import.meta.url));
const git = (root, ...args) => {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
};

test('isolated maintenance reports overdue slots without selecting them; selection and release stay closed', () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-forge-entry-'));
  try {
    git(root, 'init', '-q', '-b', 'main');
    git(root, 'config', 'user.email', 'test@example.invalid');
    git(root, 'config', 'user.name', 'Test');
    const docs = join(root, 'docs/strategy/site-v3');
    mkdirSync(docs, { recursive: true });
    writeFileSync(join(docs, 'RUNBOOK-QUOTIDIEN.md'), 'test');
    writeFileSync(join(root, 'CLAUDE.md'), 'test');
    const plan = { pillar: { slug: 'pillar', status: 'published', date: '2020-01-01' },
      clusters: [{ posts: [{ slug: 'overdue', status: 'planned', date: '2020-01-02' }] }] };
    const calendar = join(docs, 'cluster-plan.json');
    const backlog = join(docs, 'backlog-v3.json');
    writeFileSync(calendar, JSON.stringify(plan));
    writeFileSync(backlog, JSON.stringify([{ slug: 'overdue', datePlanifiee: '2020-01-02' }]));
    git(root, 'add', '.'); git(root, 'commit', '-qm', 'base');
    git(root, 'remote', 'add', 'origin', root);
    const base = git(root, 'rev-parse', 'HEAD');
    const worktree = join(root, 'isolated');
    git(root, 'worktree', 'add', '-qb', 'site/blog-forge-test', worktree, base);
    const run = (phase, ...extra) => spawnSync(process.execPath,
      [script, '--root', worktree, '--job', 'forge', '--phase', phase, ...extra],
      { cwd: worktree, encoding: 'utf8' });
    const original = readFileSync(join(worktree, 'docs/strategy/site-v3/cluster-plan.json'));
    const entry = run('maintenance');
    assert.equal(entry.status, 0, entry.stdout + entry.stderr);
    const receipt = JSON.parse(entry.stdout);
    assert.equal(receipt.head, base);
    assert.equal(receipt.ok, true);
    assert.equal(receipt.maintenanceRequired.length, 2);
    assert.deepEqual(readFileSync(join(worktree, 'docs/strategy/site-v3/cluster-plan.json')), original);
    for (const phase of ['before-selection', 'before-commit']) {
      const refused = run(phase, '--base', base);
      assert.equal(refused.status, 1, refused.stdout);
      assert.match(refused.stdout, /créneau planned échu/);
    }
    plan.clusters[0].posts[0].status = 'a-replanifier';
    writeFileSync(join(worktree, 'docs/strategy/site-v3/cluster-plan.json'), JSON.stringify(plan));
    const selection = run('before-selection', '--base', base);
    assert.equal(selection.status, 0, selection.stdout);
    writeFileSync(join(worktree, 'article.md'), 'unexpected editorial change');
    assert.equal(run('before-selection', '--base', base).status, 1);
    assert.equal(run('maintenance').status, 1);
    rmSync(join(worktree, 'article.md'));
    assert.equal(run('before-commit', '--base', base).status, 0);
    git(worktree, 'add', 'docs'); git(worktree, 'commit', '-qm', 'calendar maintenance');
    assert.equal(run('before-push', '--base', base, '--commit', git(worktree, 'rev-parse', 'HEAD')).status, 0);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('maintenance does not bypass wrong branches, dirty roots, stale bases or real quotas', () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-forge-entry-'));
  try {
    git(root, 'init', '-q', '-b', 'site/unrelated');
    git(root, 'config', 'user.email', 'test@example.invalid');
    git(root, 'config', 'user.name', 'Test');
    const docs = join(root, 'docs/strategy/site-v3');
    mkdirSync(docs, { recursive: true });
    writeFileSync(join(docs, 'RUNBOOK-QUOTIDIEN.md'), 'test');
    writeFileSync(join(root, 'CLAUDE.md'), 'test');
    const posts = [1, 2, 3].map(i => ({ slug: `published-${i}`, status: 'published', date: '2020-01-01' }));
    writeFileSync(join(docs, 'cluster-plan.json'), JSON.stringify({ pillar: posts[0], clusters: [{ posts: posts.slice(1) }] }));
    writeFileSync(join(docs, 'backlog-v3.json'), '[]');
    git(root, 'add', '.'); git(root, 'commit', '-qm', 'base');
    git(root, 'branch', 'main'); git(root, 'remote', 'add', 'origin', root);
    const run = () => spawnSync(process.execPath, [script, '--root', root, '--job', 'forge', '--phase', 'maintenance'], { cwd: root, encoding: 'utf8' });
    assert.match(run().stdout, /branche incorrecte/);
    git(root, 'switch', '-qc', 'site/blog-forge-test');
    assert.match(run().stdout, /jour réel.*plafond de 2/);
    writeFileSync(join(root, 'dirty'), 'dirty');
    assert.match(run().stdout, /arbre Git non propre/);
    rmSync(join(root, 'dirty'));
    writeFileSync(join(root, 'CLAUDE.md'), 'advanced');
    git(root, 'add', 'CLAUDE.md'); git(root, 'commit', '-qm', 'advanced without main');
    assert.match(run().stdout, /HEAD désynchronisé/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
