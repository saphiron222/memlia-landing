import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../../scripts/cron-preflight.mjs', import.meta.url));
const rulePath = 'docs/strategy/site-v3/rattrapage-ia-2026-10-05.json';
const git = (root, ...args) => {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
};

test('le préflight conserve le lot W40 et quinze sujets ordinaires sans ouvrir un quatrième article du jour', () => {
  const root = mkdtempSync(join(process.env.TMPDIR || tmpdir(), 'memlia-ia-preflight-'));
  try {
    git(root, 'init', '-q', '-b', 'main');
    git(root, 'config', 'user.email', 'test@example.invalid');
    git(root, 'config', 'user.name', 'Test');
    mkdirSync(join(root, 'docs/strategy/site-v3'), { recursive: true });
    writeFileSync(join(root, 'CLAUDE.md'), 'test');
    writeFileSync(join(root, 'docs/strategy/site-v3/RUNBOOK-QUOTIDIEN.md'), 'test');
    writeFileSync(join(root, 'docs/strategy/site-v3/backlog-v3.json'), '[]');
    const rule = JSON.parse(readFileSync(new URL(`../../${rulePath}`, import.meta.url)));
    writeFileSync(join(root, rulePath), JSON.stringify(rule));
    const posts = Object.entries(rule.publications).map(([slug, date]) => ({ slug, date, status: 'published' }));
    posts.push(...Array.from({ length: 15 }, (_, i) => ({ slug: `sujet-${i}`, date: `2026-10-${12 + Math.floor(i / 3)}`, status: 'published' })));
    const run = () => {
      writeFileSync(join(root, 'docs/strategy/site-v3/cluster-plan.json'), JSON.stringify({ pillar: posts[0], clusters: [{ posts: posts.slice(1) }] }));
      git(root, 'add', '.'); git(root, 'commit', '-qm', 'fixture');
      return spawnSync(process.execPath, [script, '--root', root, '--job', 'forge'], { cwd: root, encoding: 'utf8' });
    };
    git(root, 'add', '.'); git(root, 'commit', '-qm', 'base');
    git(root, 'remote', 'add', 'origin', root);
    const accepted = run();
    assert.equal(accepted.status, 0, accepted.stdout + accepted.stderr);
    posts.push({ slug: 'sujet-16', date: '2026-10-17', status: 'published' });
    assert.match(run().stdout, /plafond hebdomadaire/);
    posts.pop();
    posts.push({ slug: 'intrus', date: '2026-10-05', status: 'published' });
    assert.match(run().stdout, /jour réel.*plafond de 2/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

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

test('real published plus actionable planned cannot exceed three on one weekday', () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-real-quota-'));
  try {
    git(root, 'init', '-q', '-b', 'main');
    git(root, 'config', 'user.email', 'test@example.invalid');
    git(root, 'config', 'user.name', 'Test');
    mkdirSync(join(root, 'docs/strategy/site-v3'), { recursive: true });
    writeFileSync(join(root, 'docs/strategy/site-v3/RUNBOOK-QUOTIDIEN.md'), 'test');
    writeFileSync(join(root, 'CLAUDE.md'), 'test');
    const next = new Date(Date.now() + 86400000);
    while ([0, 6].includes(next.getUTCDay())) next.setUTCDate(next.getUTCDate() + 1);
    const day = next.toISOString().slice(0, 10);
    const posts = [
      { slug: 'published-1', date: day, status: 'published' },
      { slug: 'published-2', date: day, status: 'published' },
      { slug: 'published-3', date: day, status: 'published' },
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
    assert.match(rejected.stdout, /jour réel.*plafond de 3/);
    posts[3].status = 'a-replanifier';
    plan();
    git(root, 'add', '.');
    git(root, 'commit', '-qm', 'historical only');
    const accepted = run();
    assert.equal(accepted.status, 0, accepted.stdout + accepted.stderr);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
