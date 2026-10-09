import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const { scripts } = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
const expected = [
  'npx astro build',
  'npm run lastmod:sync',
  'npm run resource:seal-surfaces',
  'node scripts/reaffirm-resource-review.mjs reaffirmer',
  'node scripts/sync-lastmod.mjs --check',
  'npm run resource:audit:qa',
];

test('regen:generated rebuilds, synchronizes, seals, reaffirms and verifies in order', () => {
  assert.equal(scripts['regen:generated'], expected.join(' && '));
});

for (const failAt of [0, 1, 2, 3, 4, 5, 6]) {
  test(`regen:generated ${failAt ? `stops at failed step ${failAt}` : 'completes all six steps'}`, () => {
    assert.equal(typeof scripts['regen:generated'], 'string');
    const root = mkdtempSync(join(tmpdir(), 'regen-generated-'));
    try {
      const log = join(root, 'commands');
      for (const executable of ['npx', 'npm', 'node']) {
        const path = join(root, executable);
        writeFileSync(path, `#!${process.execPath}\nimport { appendFileSync, readFileSync } from 'node:fs';\nimport { basename } from 'node:path';\nappendFileSync(process.env.COMMAND_LOG, basename(process.argv[1]) + ' ' + process.argv.slice(2).join(' ') + '\\n');\nconst count = readFileSync(process.env.COMMAND_LOG, 'utf8').trim().split('\\n').length;\nprocess.exit(count === Number(process.env.FAIL_AT) ? 17 : 0);\n`);
        chmodSync(path, 0o755);
      }
      const result = spawnSync(scripts['regen:generated'], {
        shell: true,
        cwd: root,
        env: { ...process.env, PATH: `${root}:${process.env.PATH}`, COMMAND_LOG: log, FAIL_AT: String(failAt) },
        encoding: 'utf8',
      });
      assert.equal(result.status, failAt ? 17 : 0, result.stderr);
      assert.deepEqual(readFileSync(log, 'utf8').trim().split('\n'), expected.slice(0, failAt || expected.length));
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
}
