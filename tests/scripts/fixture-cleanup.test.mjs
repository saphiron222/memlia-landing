import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '../..');
const suite = join(root, 'tests/scripts/blog-intent-preservation.test.mjs');

function runIsolated(t, file, preload = '') {
  const temporary = mkdtempSync(join(tmpdir(), 'memlia-cleanup-check-'));
  t.after(() => rmSync(temporary, { recursive: true, force: true }));
  const hook = join(temporary, 'fault.mjs');
  writeFileSync(hook, preload);
  const before = readdirSync(temporary);
  const env = { ...process.env, TMPDIR: temporary, TMP: temporary, TEMP: temporary };
  delete env.NODE_TEST_CONTEXT;
  const result = spawnSync(process.execPath, ['--import', hook, '--test', file], {
    cwd: root, env,
    encoding: 'utf8', timeout: 120_000, maxBuffer: 4 * 1024 * 1024,
  });
  const leftovers = readdirSync(temporary).filter((name) => !before.includes(name));
  assert.deepEqual(leftovers, [], `Temporaires abandonnés : ${leftovers.join(', ')}\n${result.stdout}\n${result.stderr}`);
  assert.equal(result.error, undefined);
  return result;
}

test('la suite blog-intent ne laisse aucune fixture après succès', { skip: !existsSync(join(root, 'dist')) }, (t) => {
  const result = runIsolated(t, suite);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /# pass 4\b/);
});

test('la suite blog-intent nettoie aussi quand la copie initiale échoue après écriture', (t) => {
  const result = runIsolated(t, suite, `
    import fs from 'node:fs';
    import { syncBuiltinESMExports } from 'node:module';
    const copy = fs.cpSync;
    let calls = 0;
    fs.cpSync = (...args) => {
      if (++calls === 2) throw new Error('fixture-copy-failure');
      return copy(...args);
    };
    syncBuiltinESMExports();
  `);
  assert.notEqual(result.status, 0);
  assert.match(result.stdout + result.stderr, /fixture-copy-failure/);
});

test('la suite blog-intent nettoie après une assertion de contrat en échec', { skip: !existsSync(join(root, 'dist')) }, (t) => {
  const result = runIsolated(t, suite, `
    import fs from 'node:fs';
    import { syncBuiltinESMExports } from 'node:module';
    import { basename } from 'node:path';
    const copy = fs.cpSync;
    fs.cpSync = (source, ...args) => {
      if (basename(source) === 'dist') return;
      return copy(source, ...args);
    };
    syncBuiltinESMExports();
  `);
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /page construite absente/);
  assert.match(result.stdout, /# pass 3\b/);
  assert.match(result.stdout, /# fail 1\b/);
});

for (const name of ['prepare-preview', 'service-design', 'page-contract', 'blog-contract',
  'blog-batch-preview', 'c3-r1-validator', 'blog-published-baseline', 'blog-forge', 'service-forge']) {
  test(`${name} : une préparation de helper interrompue nettoie son répertoire`, (t) => {
    const result = runIsolated(t, join(root, `tests/scripts/${name}.test.mjs`), `
      import fs from 'node:fs';
      import { syncBuiltinESMExports } from 'node:module';
      fs.mkdirSync = () => { throw new Error('fixture-setup-failure'); };
      syncBuiltinESMExports();
    `);
    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /fixture-setup-failure/);
  });
}

test('cron-preflight nettoie les allocations précédant un mkdtemp en échec', (t) => {
  const result = runIsolated(t, join(root, 'tests/scripts/cron-preflight.test.mjs'), `
    import fs from 'node:fs';
    import { syncBuiltinESMExports } from 'node:module';
    const create = fs.mkdtempSync;
    let calls = 0;
    fs.mkdtempSync = (...args) => {
      if (++calls === 4) throw new Error('fixture-allocation-failure');
      return create(...args);
    };
    syncBuiltinESMExports();
  `);
  assert.notEqual(result.status, 0);
  assert.match(result.stdout + result.stderr, /fixture-allocation-failure/);
});
