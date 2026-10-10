import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmodSync, cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const { scripts } = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
const expected = [
  'npm run resource:seal-surfaces',
  'node scripts/render-public-source-text.mjs',
  'npm run lastmod:sync',
  'node scripts/reaffirm-resource-review.mjs reaffirmer',
  'node scripts/sync-lastmod.mjs --check',
  'npm run resource:audit:qa',
];

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

test('regen leaves lastmod valid after final public rendering, including a sealing rebuild', () => {
  const root = mkdtempSync(join(tmpdir(), 'regen-public-final-'));
  try {
    mkdirSync(join(root, 'dist'), { recursive: true });
    mkdirSync(join(root, 'src/data'), { recursive: true });
    mkdirSync(join(root, 'bin'));
    mkdirSync(join(root, 'scripts/lib'), { recursive: true });
    for (const file of ['render-public-source-text.mjs', 'verify-public-source-labels.mjs', 'sync-lastmod.mjs', 'lib/sitemaps.mjs']) {
      cpSync(new URL(`../../scripts/${file}`, import.meta.url), join(root, 'scripts', file));
    }
    symlinkSync(fileURLToPath(new URL('../../node_modules', import.meta.url)), join(root, 'node_modules'), 'dir');
    // Only Astro and editorial operations are substituted. Rendering and lastmod use
    // the production CLIs, including their filesystem reads and writes.
    const raw = '<html><body><p>Source officielle, consultée le 2026-10-01</p></body></html>';
    const shim = `#!${process.execPath}
import { writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { spawnSync } from 'node:child_process';
const executable = basename(process.argv[1]);
const args = process.argv.slice(2);
if (executable === 'npx' || (executable === 'npm' && args[1] === 'resource:seal-surfaces')) {
  writeFileSync('dist/index.html', ${JSON.stringify(raw)});
  writeFileSync('dist/sitemap-pages.xml', '<urlset><url><loc>https://memlia.fr/</loc></url></urlset>');
} else if (executable === 'npm' && args[1] === 'lastmod:sync') {
  process.exit(spawnSync(${JSON.stringify(process.execPath)}, ['scripts/sync-lastmod.mjs'], { stdio: 'inherit' }).status ?? 1);
} else if (executable === 'node' && args[0] !== 'scripts/reaffirm-resource-review.mjs') {
  process.exit(spawnSync(${JSON.stringify(process.execPath)}, args, { stdio: 'inherit' }).status ?? 1);
}
`;
    for (const executable of ['npx', 'npm', 'node']) {
      writeFileSync(join(root, 'bin', executable), shim);
      chmodSync(join(root, 'bin', executable), 0o755);
    }
    const result = spawnSync(scripts['regen:generated'], {
      shell: true, cwd: root, encoding: 'utf8',
      env: { ...process.env, PATH: `${join(root, 'bin')}:${process.env.PATH}` },
    });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    const register = readFileSync(join(root, 'src/data/pages-lastmod.json'), 'utf8');
    const render = spawnSync(process.execPath, ['scripts/render-public-source-text.mjs'], { cwd: root, encoding: 'utf8' });
    assert.equal(render.status, 0, render.stderr);
    assert.doesNotMatch(readFileSync(join(root, 'dist/index.html'), 'utf8'), /consultée le/);
    const check = spawnSync(process.execPath, ['scripts/sync-lastmod.mjs', '--check'], { cwd: root, encoding: 'utf8' });
    assert.equal(check.status, 0, check.stdout + check.stderr);
    const sync = spawnSync(process.execPath, ['scripts/sync-lastmod.mjs'], { cwd: root, encoding: 'utf8' });
    assert.equal(sync.status, 0, sync.stderr);
    assert.equal(readFileSync(join(root, 'src/data/pages-lastmod.json'), 'utf8'), register);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
