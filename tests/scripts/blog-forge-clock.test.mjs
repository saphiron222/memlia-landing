import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Charger la suite sous une horloge externe détecte aussi une date calculée à l'import.
test('les scénarios de forge restent valides le vendredi, samedi et dimanche dans deux timezones', () => {
  const suite = fileURLToPath(new URL('./blog-forge.test.mjs', import.meta.url));
  // Rejouer les scénarios de dates, pas six fois la publication scellée et le plan Python.
  const scenarios = 'la forge rafraîchit la preuve source|le report conserve|la réinscription|la réactivation|la forge refuse un claim';
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT; // Le fils est un runner autonome, pas un worker du test parent.
  for (const instant of ['2026-10-09T12:00:00Z', '2026-10-10T12:00:00Z', '2026-10-11T12:00:00Z']) {
    for (const TZ of ['UTC', 'America/Los_Angeles']) {
      const preload = `const NativeDate = Date;
        globalThis.Date = class extends NativeDate {
          constructor(...args) { super(...(args.length ? args : [${JSON.stringify(instant)}])); }
          static now() { return NativeDate.parse(${JSON.stringify(instant)}); }
        };`;
      const result = spawnSync(process.execPath, ['--import', `data:text/javascript,${encodeURIComponent(preload)}`, '--test', `--test-name-pattern=${scenarios}`, suite], {
        encoding: 'utf8', env: { ...env, TZ }, timeout: 120_000,
      });
      assert.equal(result.status, 0, `${instant}, TZ=${TZ}\n${result.error ?? ''}\n${result.stdout}\n${result.stderr}`);
    }
  }
});
