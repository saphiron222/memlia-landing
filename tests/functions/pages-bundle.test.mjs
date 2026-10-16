import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
// Version observée dans le build Pages af114ac9 du 16/10/2026 ; ne pas employer « latest ».
const WRANGLER = '3.114.17';
const decision = JSON.parse(readFileSync(new URL('../../config/migration-catalogues.json', import.meta.url), 'utf8'));

function wrangler(args) {
  const result = spawnSync('npm', ['exec', '--yes', `--package=wrangler@${WRANGLER}`, '--', 'wrangler', ...args], {
    cwd: ROOT, encoding: 'utf8', timeout: 120_000,
    env: { ...process.env, CI: 'true', WRANGLER_SEND_METRICS: 'false' },
  });
  assert.ifError(result.error);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

test('Pages production : le vrai bundle Functions compile et conserve les 301 GET/HEAD et leurs ancres', async () => {
  assert.match(wrangler(['--version']), new RegExp(`^${WRANGLER.replaceAll('.', '\\.')}\\s*$`, 'm'));
  const temp = mkdtempSync(join(tmpdir(), 'memlia-pages-bundle-'));
  try {
    const upload = join(temp, 'worker.bundle');
    wrangler(['pages', 'functions', 'build', 'functions', '--outfile', upload,
      '--project-directory', ROOT, '--build-metadata-path', join(temp, 'build.json')]);
    // --outfile contient le multipart destiné à Pages, pas directement un module JS.
    const bytes = readFileSync(upload);
    const boundary = bytes.subarray(2, bytes.indexOf('\r\n')).toString();
    const form = await new Response(bytes, { headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` } }).formData();
    const metadata = JSON.parse(form.get('metadata'));
    const outfile = join(temp, 'worker.mjs');
    writeFileSync(outfile, await form.get(metadata.main_module).text());
    // Exécuter le module produit vérifie notamment que le JSON est bien embarqué.
    const { default: worker } = await import(pathToFileURL(outfile).href);
    let assetsRead = 0;
    const env = { ASSETS: { fetch: async () => { assetsRead++; return new Response('Introuvable', { status: 404 }); } } };
    const context = { waitUntil() {}, passThroughOnException() {} };
    for (const row of decision.routes) for (const method of ['GET', 'HEAD']) for (const suffix of ['', '/', '.html']) {
      const response = await worker.fetch(new Request(`https://preview.memlia.pages.dev${row.from}${suffix}?ancien=1`, { method }), env, context);
      assert.equal(response.status, 301, `${method} ${row.from}${suffix}`);
      assert.equal(response.headers.get('Location'), `https://preview.memlia.pages.dev${row.to}`);
      assert.equal(response.headers.get('Cache-Control'), 'public, max-age=3600');
      assert.equal(await response.text(), '');
    }
    assert.equal(assetsRead, 0, 'aucun ancien asset relu');
    const unknown = await worker.fetch(new Request('https://memlia.fr/integrations/inconnu'), env, context);
    assert.equal(unknown.status, 404);
    assert.equal(unknown.headers.get('Location'), null);
    assert.equal(assetsRead, 1);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});
