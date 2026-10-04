import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { digest } from '../../../scripts/lib/resource-pipeline.mjs';
const manifest = JSON.parse(readFileSync('editorial/resources/glossaire/manifest.json', 'utf8'));
const startedAt = new Date().toISOString();
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const runs = [];
for (let replay = 0; replay < 2; replay++) {
  const commands = [];
  for (const [exe, args] of [['npx', ['astro', 'build']], ['node', ['scripts/strip-briefs.mjs']]]) {
    const run = spawnSync(exe, args, { encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr || run.stdout);
    commands.push({ command: [exe, ...args].join(' '), exitCode: run.status });
  }
  const bytes = readFileSync('dist/glossaire.html');
  const entries = [{ path: 'dist/glossaire.html', bytes: bytes.length, sha256: hash(bytes) }];
  assert.equal(digest(entries), manifest.integrity.buildOutput.digest);
  runs.push(commands);
}
console.log(JSON.stringify({ schemaVersion: 1, commands: runs[0], startedAt, endedAt: new Date().toISOString(), result: 'PASS', verification: { commands: runs[1], snapshotsIdentiques: true, regle: 'Deux reconstructions réelles reproduisent le snapshot sans changement de matière du glossaire.' }, surfaces: { T: { sourceBundleDigest: manifest.integrity.sourceBundle.digest, assetBundleDigest: manifest.integrity.assetBundle.digest, configBundleDigest: manifest.integrity.configBundle.digest, outputDigest: manifest.integrity.buildOutput.digest } } }, null, 2));
