import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

// Les entrées Pages chargent le JSON via un bundler, contrairement aux imports Node.
// Le vrai bundle Wrangler reste exercé dans tests/functions/pages-bundle.test.mjs.
export async function loadBundledModules(paths) {
  const cacheDir = mkdtempSync(join(tmpdir(), 'memlia-tests-vite-'));
  let bundler;
  try {
    bundler = await createServer({
      root: fileURLToPath(new URL('../../', import.meta.url)),
      configFile: false, cacheDir, optimizeDeps: { noDiscovery: true, include: [] },
      server: { middlewareMode: true, watch: null, ws: false }, appType: 'custom',
    });
    const modules = [];
    for (const path of paths) modules.push(await bundler.ssrLoadModule(path));
    return modules;
  } finally {
    try {
      await bundler?.close();
    } finally {
      rmSync(cacheDir, { recursive: true, force: true });
    }
  }
}
