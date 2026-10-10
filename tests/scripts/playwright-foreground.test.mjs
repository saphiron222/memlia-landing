import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFileSync, spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';

function localServerConfig() {
  const env = { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', NODE_DISABLE_COMPILE_CACHE: '1' };
  delete env.QA_URL;
  return JSON.parse(execFileSync(process.execPath, ['--experimental-strip-types', '--input-type=module', '-e',
    'const {default:c}=await import("./playwright.config.ts"); console.log(JSON.stringify(c.webServer));'],
  { encoding: 'utf8', env }));
}

test('Playwright retains ownership of its real Astro preview child', { timeout: 20000 }, async () => {
  const config = localServerConfig();
  assert.equal(config.env?.ASTRO_PREVIEW_BACKGROUND, '1');
  assert.equal(config.reuseExistingServer, false);
  assert.equal(config.stdout, 'pipe', 'Les refus de build doivent être visibles dans les journaux CI.');
  assert.equal(config.stderr, 'pipe');
  assert.doesNotMatch(config.command, /--ignore-lock|--force|--background/);
  const reservation = createServer();
  let root;
  let child;
  let exited;
  let closed = false;
  let output = '';
  try {
    await new Promise((resolve, reject) => {
      reservation.once('error', reject);
      reservation.listen(0, '127.0.0.1', resolve);
    });
    const { port } = reservation.address();
    await new Promise(resolve => reservation.close(resolve));
    root = mkdtempSync(join(tmpdir(), 'memlia-qa-foreground-'));
    mkdirSync(join(root, 'dist'));
    writeFileSync(join(root, 'dist', 'index.html'), '<!doctype html><p>foreground-fixture-only</p>');
    child = spawn(process.execPath, [realpathSync('node_modules/.bin/astro'), 'preview', '--root', root,
      '--host', '127.0.0.1', '--port', String(port)], {
      env: { ...process.env, ...config.env, ASTRO_TELEMETRY_DISABLED: '1', NODE_DISABLE_COMPILE_CACHE: '1' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    exited = new Promise(resolve => child.once('close', code => { closed = true; resolve(code); }));
    child.stdout.on('data', bytes => { output += bytes; });
    child.stderr.on('data', bytes => { output += bytes; });
    child.on('error', error => { output += error.message; });
    let ready = false;
    const deadline = Date.now() + 12000;
    while (Date.now() < deadline && !closed && child.exitCode === null && child.signalCode === null) {
      try {
        const response = await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(500) });
        ready = response.ok && (await response.text()).includes('foreground-fixture-only');
        if (ready) break;
      } catch {}
      await delay(50);
    }
    assert.equal(ready, true, output);
    await delay(150);
    assert.equal(closed, false, `Astro closed before Playwright could own it: ${output}`);
    assert.equal(child.exitCode, null, output);
    assert.equal(child.signalCode, null, output);
  } finally {
    // Only our exact test child: no reused server, Hermes PID or native board.
    if (child && !closed) child.kill('SIGTERM');
    if (exited) {
      const timeout = setTimeout(() => { if (!closed) child.kill('SIGKILL'); }, 3000);
      try { await exited; } finally { clearTimeout(timeout); }
    }
    if (reservation.listening) await new Promise(resolve => reservation.close(resolve));
    if (root) rmSync(root, { recursive: true, force: true });
  }
});
