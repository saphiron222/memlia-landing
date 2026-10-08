import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';

import { join, resolve } from 'node:path';
import test from 'node:test';
import { parse } from 'yaml';

const project = resolve(import.meta.dirname, '../..');

test('les contrôles CAC du build Cloudflare passent sans installation Chromium', (t) => {
  const browsers = mkdtempSync(join(project, '.qa-no-chromium-'));
  t.after(() => rmSync(browsers, { recursive: true, force: true }));
  const env = { ...process.env, CF_PAGES: '1', PLAYWRIGHT_BROWSERS_PATH: browsers };
  // Un nouveau runner, pas un enfant silencieux du runner Node courant.
  delete env.NODE_TEST_CONTEXT;
  const result = spawnSync(process.execPath, ['--test', 'tests/scripts/accueil-cac-medias.test.mjs'], {
    cwd: project,
    env,
    encoding: 'utf8',
    timeout: 30_000,
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /# pass [1-9]/, 'le runner a exécuté des assertions');
  assert.doesNotMatch(result.stdout, /# SKIP/, 'les contrôles déterministes restent réellement exécutés');
});

test('la géométrie CAC est exécutée après installation Chromium par une porte CI obligatoire', () => {
  const workflow = parse(readFileSync(join(project, '.github/workflows/pr-validation.yml'), 'utf8'));
  const steps = workflow.jobs.portes.steps;
  const browser = steps.findIndex(step => step.run === 'node --test tests/scripts/accueil-cac-geometry.test.mjs');
  assert.ok(browser >= 0, 'étape explicite pour le contrat géométrique CAC');
  assert.ok(steps.slice(0, browser).some(step => step.run === 'npx playwright install --with-deps chromium'));
  assert.equal(steps[browser].if, undefined, 'le contrat n’est pas conditionnel');
  assert.equal(steps[browser]['continue-on-error'], undefined);
  assert.ok(workflow.jobs.gates.needs.includes('portes'), 'Repository gates dépend de ce contrat');
});
