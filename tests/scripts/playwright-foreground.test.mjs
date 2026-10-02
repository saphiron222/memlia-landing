import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFileSync, spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';

function localServerConfig() {
  const env = { ...process.env };
  delete env.QA_URL;
  return JSON.parse(execFileSync(process.execPath, ['--experimental-strip-types', '--input-type=module', '-e',
    'const {default:c}=await import("./playwright.config.ts"); console.log(JSON.stringify(c.webServer));'],
  { encoding: 'utf8', env }));
}

test('Playwright keeps its exact Astro child foreground in an agent environment', { timeout: 20000 }, async () => {
  const config = localServerConfig();
  assert.equal(config.env?.ASTRO_PREVIEW_BACKGROUND, '1');
  assert.equal(config.reuseExistingServer, false);
  assert.doesNotMatch(config.command, /--ignore-lock|--force|--background/);
  const root = mkdtempSync(join(tmpdir(), 'memlia-qa-foreground-'));
  const reservation = createServer();
  await new Promise(resolve => reservation.listen(0, '127.0.0.1', resolve));
  const { port } = reservation.address();
  await new Promise(resolve => reservation.close(resolve));
  mkdirSync(join(root, 'dist'));
  writeFileSync(join(root, 'dist', 'index.html'), '<!doctype html><p>foreground-fixture-only</p>');
  const child = spawn(process.execPath, [realpathSync('node_modules/.bin/astro'), 'preview', '--root', root,
    '--host', '127.0.0.1', '--port', String(port)], {
    env: { ...process.env, ...config.env }, stdio: ['ignore', 'pipe', 'pipe'],
  });
  const exited = new Promise(resolve => child.once('close', resolve));
  let output = '';
  child.stdout.on('data', bytes => { output += bytes; });
  child.stderr.on('data', bytes => { output += bytes; });
  child.on('error', error => { output += error.message; });
  try {
    let ready = false;
    const deadline = Date.now() + 12000;
    while (Date.now() < deadline && child.exitCode === null) {
      try {
        const response = await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(500) });
        ready = response.ok && (await response.text()).includes('foreground-fixture-only');
        if (ready) break;
      } catch {}
      await delay(50);
    }
    assert.equal(ready, true, output);
    await delay(150);
    assert.equal(child.exitCode, null, `Astro detached before Playwright could own it: ${output}`);
  } finally {
    // Only our exact test child: no reused server, Hermes PID or native board.
    if (child.exitCode === null) child.kill('SIGTERM');
    await Promise.race([exited, delay(3000).then(() => {
      if (child.exitCode === null) child.kill('SIGKILL');
    })]);
    await exited;
    rmSync(root, { recursive: true, force: true });
  }
});
