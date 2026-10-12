import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../../scripts/cron-preflight.mjs', import.meta.url));
const mandate = JSON.parse(readFileSync(new URL('../../scripts/lib/blog-w41-catchup.json', import.meta.url)));
const git = (root, ...args) => {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
};

test('préflight natif W41 : lot fermé au jour Paris, capacité ordinaire et portes conservées', () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-w41-preflight-'));
  try {
    const docs = join(root, 'docs/strategy/site-v3');
    mkdirSync(docs, { recursive: true });
    writeFileSync(join(root, 'CLAUDE.md'), 'Test fictif');
    writeFileSync(join(docs, 'RUNBOOK-QUOTIDIEN.md'), 'Test fictif');
    const clock = join(root, 'clock.mjs');
    writeFileSync(clock, `const NativeDate = Date;
globalThis.Date = class extends NativeDate {
  constructor(...args) { super(...(args.length ? args : [process.env.MEMLIA_TEST_INSTANT])); }
  static now() { return NativeDate.parse(process.env.MEMLIA_TEST_INSTANT); }
};\n`);
    git(root, 'init', '-q', '-b', 'main');
    git(root, 'config', 'user.email', 'test@example.invalid');
    git(root, 'config', 'user.name', 'Test');
    git(root, 'remote', 'add', 'origin', root);
    const lot = (day, status = 'planned') => mandate.articles.map(({ slug }) => ({ slug, date: day, status }));
    const normal = Array.from({ length: 15 }, (_, i) => ({ slug: `normal-${i}`, date: `2026-10-${12 + Math.floor(i / 3)}`, status: 'published' }));
    const run = (posts, { instant = '2026-10-12T12:00:00Z', reserve = true, phase = 'maintenance' } = {}) => {
      writeFileSync(join(docs, 'cluster-plan.json'), JSON.stringify({ pillar: posts[0], clusters: [{ posts: posts.slice(1) }] }));
      writeFileSync(join(docs, 'backlog-v3.json'), JSON.stringify(reserve ? posts.filter(p => p.status === 'planned').map(p => ({ slug: p.slug, datePlanifiee: p.date })) : []));
      git(root, 'add', '.'); git(root, 'commit', '--allow-empty', '-qm', 'fixture');
      const before = readFileSync(join(docs, 'cluster-plan.json'));
      const result = spawnSync(process.execPath, ['--import', clock, script, '--root', root, '--job', 'forge', '--phase', phase], {
        cwd: root, encoding: 'utf8', env: { ...process.env, TZ: 'America/Los_Angeles', MEMLIA_TEST_INSTANT: instant },
      });
      assert.deepEqual(readFileSync(join(docs, 'cluster-plan.json')), before);
      assert.equal(git(root, 'status', '--porcelain'), '');
      return { ...result, report: JSON.parse(result.stdout) };
    };
    let result = run([...lot('2026-10-12'), ...normal]);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(result.report.ok, true);
    assert.equal(run([...lot('2026-10-12', 'published'), ...normal], { instant: '2026-10-13T12:00:00Z' }).status, 0);
    result = run([...lot('2026-10-12'), ...normal, { slug: 'hors-lot', date: '2026-10-12', status: 'planned' }]);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /jour réel.*plafond de 3.*\(4\)/);
    result = run([...lot('2026-10-12'), ...normal, { slug: 'normal-16', date: '2026-10-17', status: 'published' }]);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /plafond hebdomadaire.*\(16\)/);
    for (const [day, instant, reserve] of [
      ['2026-10-13', '2026-10-12T12:00:00Z', true],
      ['2026-10-11', '2026-10-11T12:00:00Z', true],
      ['2026-10-12', '2026-10-12T12:00:00Z', false],
    ]) {
      result = run(lot(day), { instant, reserve });
      assert.equal(result.status, 1, result.stdout);
      assert.match(result.stdout, /jour réel.*plafond/);
    }
    result = run(lot('2026-10-12'), { instant: '2026-10-13T12:00:00Z', phase: 'initial' });
    assert.equal(result.status, 1);
    assert.match(result.stdout, /créneau planned échu/);
    const weekend = { instant: '2026-10-17T12:00:00Z' };
    assert.equal(run(lot('2026-10-17'), weekend).status, 0);
    result = run([...lot('2026-10-17'), { slug: 'hors-lot', date: '2026-10-17', status: 'planned' }], weekend);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /hors lundi-vendredi.*hors-lot/);
    result = run(lot('2026-10-13'), { instant: '2026-10-12T22:00:00Z' });
    assert.equal(result.status, 0, result.stdout);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
