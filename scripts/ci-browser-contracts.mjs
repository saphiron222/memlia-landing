import { preview } from 'astro';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// The preceding CI build owns dist and all deterministic gates. Playwright's
// QA_URL mode consumes that exact output rather than invoking build:site again.
export async function runBrowserContracts({
  root = process.cwd(), command = process.execPath,
  args = [resolve(root, 'node_modules/@playwright/test/cli.js'), 'test'],
  env = process.env,
} = {}) {
  const server = await preview({ root, server: { host: '127.0.0.1', port: 0 }, logLevel: 'warn' });
  const qaUrl = `http://127.0.0.1:${server.port}`;
  console.log(`Browser contracts: existing dist at ${qaUrl}`);
  let child;
  let interrupted;
  const forwardSignal = signal => {
    interrupted = signal;
    child?.kill(signal);
  };
  const onTerm = () => forwardSignal('SIGTERM');
  const onInt = () => forwardSignal('SIGINT');
  process.on('SIGTERM', onTerm);
  process.on('SIGINT', onInt);
  try {
    return await new Promise((resolveExit, reject) => {
      child = spawn(command, args, { cwd: root, env: { ...env, QA_URL: qaUrl }, stdio: 'inherit' });
      child.once('error', reject);
      child.once('exit', (code, signal) => resolveExit(code ?? (signal === 'SIGINT' ? 130 : 143)));
    });
  } finally {
    process.removeListener('SIGTERM', onTerm);
    process.removeListener('SIGINT', onInt);
    const closed = server.closed();
    await server.stop();
    await closed;
    if (interrupted) process.exitCode = interrupted === 'SIGINT' ? 130 : 143;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = await runBrowserContracts();
}
