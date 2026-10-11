import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

// Exercise Playwright's actual transport, not the config source text.
test('a failed webServer prints its build diagnostic before the startup error', { timeout: 20000 }, () => {
  const env = { ...process.env };
  delete env.QA_URL;
  delete env.DEBUG;
  const config = JSON.parse(execFileSync(process.execPath, ['--experimental-strip-types', '--input-type=module', '-e',
    'const {default:c}=await import("./playwright.config.ts"); console.log(JSON.stringify(c.webServer));'],
  { encoding: 'utf8', env }));
  const root = mkdtempSync(join(tmpdir(), 'memlia-qa-startup-'));
  try {
    const runner = pathToFileURL(realpathSync('node_modules/@playwright/test/index.mjs')).href;
    writeFileSync(join(root, 'playwright.config.mjs'), `export default ${JSON.stringify({
      testDir: root,
      reporter: 'list',
      outputDir: join(root, 'results'),
      webServer: { ...config, command: `${JSON.stringify(process.execPath)} -e "console.log('startup-regression-diagnostic'); process.exit(23)"` },
    })};`);
    writeFileSync(join(root, 'startup.spec.mjs'), `import {test} from ${JSON.stringify(runner)}; test('must not run', () => { throw new Error('unexpected-test-execution'); });`);
    const result = spawnSync(process.execPath, [realpathSync('node_modules/.bin/playwright'), 'test', '--config', join(root, 'playwright.config.mjs')],
      { encoding: 'utf8', env, timeout: 15000 });
    const output = result.stdout + result.stderr;
    assert.equal(result.status, 1, output);
    assert.match(output, /Exit code: 23/);
    assert.match(output, /startup-regression-diagnostic/);
    assert.doesNotMatch(output, /unexpected-test-execution/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
