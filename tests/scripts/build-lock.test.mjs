import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const launcher = resolve('scripts/build-lock.py');
const packageScripts = JSON.parse(await readFile('package.json', 'utf8')).scripts;
async function fixture(t) {
  const dir = await mkdtemp(join(tmpdir(), 'memlia-build-lock-'));
  const lock = join(dir, 'machine.lock');
  const journal = join(dir, 'events');
  const children = [];
  await writeFile(journal, '');
  const simulation = join(dir, 'simulation.py');
  await writeFile(simulation, `import os, signal, sys, time
journal, name, mode = sys.argv[1:]
def record(event):
    with open(journal, 'a') as stream:
        stream.write(name + ':' + event + '\\n')
record('start')
if mode == 'hold':
    signal.signal(signal.SIGTERM, lambda *_: sys.exit(0))
    while True: time.sleep(0.05)
time.sleep(0.8)
record('end')
sys.exit(7 if mode == 'error' else 0)
`);
  t.after(async () => {
    for (const child of children) if (child.exitCode === null && child.signalCode === null) child.kill('SIGTERM');
    await Promise.all(children.map((child) => child.done));
    await rm(dir, { recursive: true, force: true });
  });
  async function run(name, mode = 'normal', wait = '5', viaNpm = false) {
    const cwd = join(dir, name);
    await mkdir(cwd);
    if (viaNpm) {
      await writeFile(join(cwd, 'package.json'), JSON.stringify({ scripts: {
        build: packageScripts.build.replace('scripts/build-lock.py --', `${JSON.stringify(launcher)} --lock-file ${JSON.stringify(lock)} --wait-seconds ${wait} --`),
        'build:locked': `python3 ${JSON.stringify(simulation)} ${JSON.stringify(journal)} ${name} ${mode}`,
      } }));
    }
    const child = spawn(viaNpm ? 'npm' : 'python3', viaNpm ? ['run', 'build'] : [launcher, '--lock-file', lock, '--wait-seconds', wait, '--', 'python3', simulation, journal, name, mode], {
      cwd, env: { ...process.env, MEMLIA_BUILD_LOCK: '1' }, stdio: ['ignore', 'pipe', 'pipe'],
    });
    child.output = '';
    child.stdout.on('data', (data) => { child.output += data; });
    child.stderr.on('data', (data) => { child.output += data; });
    child.done = new Promise((resolve, reject) => {
      child.once('error', reject);
      child.once('exit', (code, signal) => resolve({ code, signal }));
    });
    children.push(child);
    return child;
  }
  async function until(predicate, description) {
    const end = Date.now() + 10000;
    while (Date.now() < end) {
      if (await predicate()) return;
      if (children.some((child) => child.exitCode !== null && child.exitCode !== 0)) {
        assert.fail(`${description}: ${children.map((child) => child.output).join('\n')}`);
      }
      await delay(20);
    }
    assert.fail(`Délai dépassé : ${description}`);
  }
  return { lock, journal, run, until, events: () => readFile(journal, 'utf8') };
}

test('des worktrees différents se suivent ; attente bornée, erreur et interruption rendent le verrou', { timeout: 30000 }, async (t) => {
  const f = await fixture(t);
  const npmAgent = await f.run('npm-agent', 'normal', '5', true);
  await f.until(async () => (await f.events()).includes('npm-agent:start'), 'npm run build agent');
  const npmCi = await f.run('npm-ci', 'normal', '5', true);
  await f.until(() => npmCi.output.includes('attente'), 'npm run build CI en attente');
  assert.equal((await npmAgent.done).code, 0);
  assert.equal((await npmCi.done).code, 0);
  assert.equal(await f.events(), 'npm-agent:start\nnpm-agent:end\nnpm-ci:start\nnpm-ci:end\n');
  await writeFile(f.journal, '');
  const first = await f.run('agent', 'hold');
  await f.until(async () => (await f.events()).includes('agent:start'), 'premier build');
  const second = await f.run('ci');
  await f.until(() => second.output.includes('attente'), 'annonce du build CI en attente');
  assert.equal(await f.events(), 'agent:start\n');
  const timedOut = await f.run('timeout', 'normal', '0.1');
  assert.equal((await timedOut.done).code, 75);
  assert.match(timedOut.output, /délai.*dépassé/i);
  first.kill('SIGTERM');
  assert.equal((await first.done).code, 143);
  assert.equal((await second.done).code, 0);
  assert.equal(await f.events(), 'agent:start\nci:start\nci:end\n');
  const failed = await f.run('failure', 'error');
  assert.equal((await failed.done).code, 7);
  assert.equal((await (await f.run('after-error')).done).code, 0);
});

test('un détenteur tué laisse un fichier orphelin récupérable sans supprimer le verrou actif', { timeout: 30000 }, async (t) => {
  const f = await fixture(t);
  const holder = await f.run('orphan', 'hold');
  await f.until(async () => (await f.events()).includes('orphan:start'), 'détenteur actif');
  const metadata = JSON.parse(await readFile(f.lock, 'utf8'));
  t.after(() => {
    try { process.kill(metadata.childPid, 'SIGTERM'); } catch (error) {
      if (error.code !== 'ESRCH') throw error;
    }
  });
  holder.kill('SIGKILL');
  await holder.done;
  const next = await f.run('recovery');
  await f.until(() => next.output.includes('attente'), 'le descendant actif conserve le verrou');
  assert.equal(await f.events(), 'orphan:start\n');
  process.kill(metadata.childPid, 'SIGTERM');
  assert.equal((await next.done).code, 0);
  assert.equal(await f.events(), 'orphan:start\nrecovery:start\nrecovery:end\n');
  assert.equal((await (await f.run('stale-file')).done).code, 0);
});
