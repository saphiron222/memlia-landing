import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { parse } from 'yaml';

const workflow = parse(readFileSync(new URL('../../.github/workflows/pr-validation.yml', import.meta.url), 'utf8'));

test('un seul build alimente toutes les parts navigateur sans rebuild Playwright', () => {
  const builds = Object.values(workflow.jobs).flatMap(job => job.steps ?? []).filter(step => /npm run build(?:\s|$)/.test(step.run ?? ''));
  assert.equal(builds.length, 1);
  const upload = workflow.jobs.portes.steps.find(step => step.uses?.startsWith('actions/upload-artifact@'));
  assert.ok(upload, 'le build doit être partagé');
  assert.equal(upload.with.path, 'dist/');
  assert.equal(upload.with['if-no-files-found'], 'error');
  assert.equal(upload.with['include-hidden-files'], true, 'préserver .assetsignore et les sorties Astro');
  for (const name of ['verify', 'clavier']) {
    const job = workflow.jobs[name];
    assert.ok([job.needs].flat().includes('portes'));
    const download = job.steps.find(step => step.uses?.startsWith('actions/download-artifact@'));
    assert.equal(download?.with.name, upload.with.name);
    assert.equal(download?.with.path, 'dist/');
    const browser = job.steps.find(step => step.run?.startsWith('npm run test --'));
    assert.equal(browser.env.PLAYWRIGHT_PREBUILT, '1');
  }
  const script = 'const {default:c}=await import("./playwright.config.ts");console.log(JSON.stringify(c));';
  for (const prebuilt of ['0', '1']) {
    const env = { ...process.env, PLAYWRIGHT_PREBUILT: prebuilt };
    delete env.QA_URL;
    const config = JSON.parse(execFileSync(process.execPath, ['--experimental-strip-types', '--input-type=module', '-e', script], { env, encoding: 'utf8' }));
    assert.equal(config.webServer.command.includes('build:site'), prebuilt !== '1');
    assert.equal(config.fullyParallel, true);
    assert.equal(config.webServer.reuseExistingServer, false);
  }
});

test('les brouillons ne lancent aucun job et ready_for_review déclenche la validation', () => {
  assert.ok(workflow.on.pull_request.types.includes('ready_for_review'));
  for (const event of ['opened', 'synchronize', 'reopened']) assert.ok(workflow.on.pull_request.types.includes(event));
  for (const [name, job] of Object.entries(workflow.jobs)) {
    assert.match(job.if, /github\.event\.pull_request\.draft == false/, name);
  }
  assert.equal(workflow.jobs.gates.if, 'always() && github.event.pull_request.draft == false');
  assert.equal(workflow.concurrency['cancel-in-progress'], true);
  assert.match(workflow.concurrency.group, /github\.event\.pull_request\.number/);
  assert.equal(workflow.on.push, undefined, 'main ne participe pas à cette concurrence');
});
