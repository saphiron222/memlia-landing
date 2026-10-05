import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

for (const configured of [false, true]) {
  test(`les refus du lot IA restent exercés avec TMPDIR ${configured ? 'défini' : 'absent'}`, () => {
    const directory = mkdtempSync(join(tmpdir(), 'catchup-portability-'));
    const env = { ...process.env };
    delete env.TMPDIR;
    delete env.NODE_TEST_CONTEXT;
    if (configured) env.TMPDIR = directory;
    try {
      const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap', join(import.meta.dirname, 'blog-ia-catchup.test.mjs')], {
        env, encoding: 'utf8', timeout: 30_000,
      });
      assert.ifError(result.error);
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.match(result.stdout, /# pass 3\b/);
      assert.match(result.stdout, /# fail 0\b/);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
}
