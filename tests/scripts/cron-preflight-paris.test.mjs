import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
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

test('all release phases expire planned posts and reservations on the Paris day, not host TZ', () => {
  const temporary = mkdtempSync(join(tmpdir(), 'memlia-preflight-paris-'));
  let assertions = 0;
  try {
    const clock = join(temporary, 'clock.mjs');
    writeFileSync(clock, `const NativeDate = Date;
const instant = process.env.MEMLIA_TEST_INSTANT;
globalThis.Date = class extends NativeDate {
  constructor(...args) { super(...(args.length ? args : [instant])); }
  static now() { return NativeDate.parse(instant); }
};\n`);
    for (const [season, day, before, after] of [
      ['summer', '2026-09-30', '2026-09-30T21:59:59Z', '2026-09-30T22:30:00Z'],
      ['winter', '2026-12-01', '2026-12-01T22:59:59Z', '2026-12-01T23:30:00Z'],
    ]) {
      for (const kind of ['planned', 'reservation']) {
        for (const phase of ['initial', 'before-commit', 'before-push']) {
          const root = join(temporary, `${season}-${kind}-${phase}`);
          const docs = join(root, 'docs/strategy/site-v3');
          mkdirSync(docs, { recursive: true });
          writeFileSync(join(root, 'CLAUDE.md'), 'Test fictif local\n');
          writeFileSync(join(docs, 'RUNBOOK-QUOTIDIEN.md'), 'Test fictif local\n');
          const plan = join(docs, 'cluster-plan.json');
          const backlog = join(docs, 'backlog-v3.json');
          writeFileSync(plan, JSON.stringify({ pillar: { date: '2026-09-16', status: 'published' },
            clusters: [{ posts: [{ slug: 'test-fictif', date: day,
              status: kind === 'planned' ? 'planned' : 'manque' }] }] }));
          writeFileSync(backlog, JSON.stringify(kind === 'planned' ? [] : [{ slug: 'test-fictif', datePlanifiee: day }]));
          const beforePlan = readFileSync(plan), beforeBacklog = readFileSync(backlog);
          git(root, 'init', '-q', '-b', 'main');
          git(root, 'config', 'user.name', 'Test fictif');
          git(root, 'config', 'user.email', 'test@example.invalid');
          git(root, 'add', '.'); git(root, 'commit', '-qm', 'fixture');
          git(root, 'remote', 'add', 'origin', root);
          const base = git(root, 'rev-parse', 'HEAD');
          const args = [script, '--root', root, '--job', 'forge'];
          if (phase !== 'initial') args.push('--phase', phase, '--base', base);
          if (phase === 'before-push') {
            git(root, 'switch', '-qc', 'site/blog-test-fictif');
            writeFileSync(join(root, 'candidate.txt'), 'Test fictif local');
            git(root, 'add', '.'); git(root, 'commit', '-qm', 'candidate');
            args.push('--commit', git(root, 'rev-parse', 'HEAD'));
          }
          for (const [instant, expired] of [[before, false], [after, true]]) {
            for (const TZ of ['Europe/Paris', 'UTC', 'America/New_York']) {
              const result = spawnSync(process.execPath, ['--import', clock, ...args], {
                cwd: root, encoding: 'utf8', timeout: 30_000,
                env: { ...process.env, TZ, MEMLIA_TEST_INSTANT: instant },
              });
              const report = JSON.parse(result.stdout);
              const expectedError = kind === 'planned' ? 'créneau planned échu' : 'datePlanifiee échue';
              const context = JSON.stringify({ season, kind, phase, instant, TZ, report });
              assert.equal(result.status, expired ? 1 : 0, context);
              assert.equal(report.ok, !expired, context);
              assert.equal(report.errors.some(error => error.includes(expectedError)), expired, context);
              assert.equal(git(root, 'status', '--porcelain'), '', context);
              assert.deepEqual(readFileSync(plan), beforePlan);
              assert.deepEqual(readFileSync(backlog), beforeBacklog);
              assertions++;
            }
          }
        }
      }
    }
    assert.equal(assertions, 72);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});
