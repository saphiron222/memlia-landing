import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runBrowserContracts } from '../../scripts/ci-browser-contracts.mjs';

async function fixture(t) {
  const root = await mkdtemp(join(process.env.TMPDIR ?? tmpdir(), 'ci-browser-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(join(root, 'package.json'), '{"type":"module"}');
  await mkdir(join(root, 'dist'));
  await writeFile(join(root, 'dist/index.html'), '<h1>already built</h1>');
  await writeFile(join(root, 'probe.mjs'), `
    import { writeFile } from 'node:fs/promises';
    const response = await fetch(process.env.QA_URL);
    if (!response.ok || !(await response.text()).includes('already built')) process.exit(99);
    await writeFile('observed-url.txt', process.env.QA_URL);
    process.exit(Number(process.env.PROBE_EXIT ?? 0));
  `);
  return root;
}

test('concurrent jobs serve their existing dist on distinct owned ports, without rebuilding', async t => {
  const roots = await Promise.all([fixture(t), fixture(t)]);
  const results = await Promise.all(roots.map(root => runBrowserContracts({
    root, command: process.execPath, args: ['probe.mjs'],
  })));
  assert.deepEqual(results, [0, 0]);
  const urls = await Promise.all(roots.map(root => readFile(join(root, 'observed-url.txt'), 'utf8')));
  assert.notEqual(urls[0], urls[1]);
  for (const [index, url] of urls.entries()) {
    await assert.rejects(fetch(url));
    assert.equal(await readFile(join(roots[index], 'dist/index.html'), 'utf8'), '<h1>already built</h1>');
  }
});

test('a failing browser command stays failed and its preview is stopped', async t => {
  const root = await fixture(t);
  assert.equal(await runBrowserContracts({
    root, command: process.execPath, args: ['probe.mjs'], env: { ...process.env, PROBE_EXIT: '7' },
  }), 7);
  const url = await readFile(join(root, 'observed-url.txt'), 'utf8');
  await assert.rejects(fetch(url));
});
