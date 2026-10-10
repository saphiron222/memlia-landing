import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chmodSync, copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const repository = new URL('../../', import.meta.url);
const { scripts } = JSON.parse(readFileSync(new URL('package.json', repository), 'utf8'));

test('regen seals final public HTML and keeps lastmod stable after reconstruction', () => {
  const root = mkdtempSync(join(tmpdir(), 'regen-public-html-'));
  try {
    for (const directory of ['scripts/lib', 'src/data', 'bin', 'dist/automatisation']) {
      mkdirSync(join(root, directory), { recursive: true });
    }
    for (const file of [
      'scripts/sync-lastmod.mjs', 'scripts/lib/sitemaps.mjs',
      'scripts/strip-briefs.mjs', 'src/data/images.mjs',
      'scripts/render-public-source-text.mjs', 'scripts/verify-public-source-labels.mjs',
    ]) copyFileSync(new URL(file, repository), join(root, file));
    symlinkSync(new URL('node_modules', repository).pathname, join(root, 'node_modules'), 'dir');
    const html = '<html><head><script type="application/ld+json">{"note":"consulté le 2026-09-20"}</script></head><body><p>Source, consulté le 21 septembre 2026.</p></body></html>';
    const finalHtml = html.replace(', consulté le 21 septembre 2026', '');
    const route = '/automatisation/evaluation-transmission';
    writeFileSync(join(root, 'fixture.html'), html);
    // Astro is substituted; post-processing and lastmod execute their real CLIs.
    const astro = join(root, 'bin/npx');
    writeFileSync(astro, `#!${process.execPath}\nimport { copyFileSync, writeFileSync } from 'node:fs';\ncopyFileSync('fixture.html', 'dist/automatisation/evaluation-transmission.html');\nwriteFileSync('dist/sitemap-index.xml', '<sitemapindex/>');\nwriteFileSync('dist/sitemap-pages.xml', '<urlset><url><loc>https://memlia.fr${route}</loc></url></urlset>');\n`);
    chmodSync(astro, 0o755);
    writeFileSync(join(root, 'scripts/reaffirm-resource-review.mjs'), '');
    writeFileSync(join(root, 'package.json'), JSON.stringify({ type: 'module', scripts: {
      ...scripts,
      // Model the sealer's independent rebuild; the real sealer is exercised in regen QA.
      'resource:seal-surfaces': `npx astro build${scripts['render:public'] ? ' && npm run render:public' : ' && node scripts/strip-briefs.mjs'}`,
      'resource:audit:qa': 'node scripts/verify-public-source-labels.mjs',
    } }));
    const env = { ...process.env, PATH: `${join(root, 'bin')}:${process.env.PATH}` };
    const run = (command) => spawnSync(command, { cwd: root, env, shell: true, encoding: 'utf8' });
    const regenerated = run('npm run regen:generated');
    assert.equal(regenerated.status, 0, regenerated.stdout + regenerated.stderr);
    const file = join(root, 'dist/automatisation/evaluation-transmission.html');
    assert.equal(readFileSync(file, 'utf8'), finalHtml);
    const registryFile = join(root, 'src/data/pages-lastmod.json');
    const registry = readFileSync(registryFile, 'utf8');
    assert.equal(JSON.parse(registry).pages[route].sha256, createHash('sha256').update(finalHtml).digest('hex'));
    const rebuilt = run('npm run resource:seal-surfaces && node scripts/sync-lastmod.mjs --check && npm run lastmod:sync');
    assert.equal(rebuilt.status, 0, rebuilt.stdout + rebuilt.stderr);
    assert.equal(readFileSync(registryFile, 'utf8'), registry);
    // Exercise the real sealer bootstrap, not just the modeled reconstruction above.
    // The fixture deliberately has no business evidence: sealing must then fail closed,
    // but only after rendering public HTML, without undoing lastmod's final bytes.
    const sealer = spawnSync(process.execPath, [fileURLToPath(new URL('scripts/seal-resource-surfaces.mjs', repository))], {
      cwd: root, env, encoding: 'utf8',
    });
    assert.notEqual(sealer.status, 0);
    assert.match(sealer.stderr, /ENOENT[^\n]*src\/data\/glossary\.ts/);
    assert.equal(readFileSync(file, 'utf8'), finalHtml);
    const checked = run('node scripts/sync-lastmod.mjs --check');
    assert.equal(checked.status, 0, checked.stdout + checked.stderr);
    assert.equal(readFileSync(join(root, 'fixture.html'), 'utf8'), html);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
