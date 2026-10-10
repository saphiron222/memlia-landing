#!/usr/bin/env node
// Read-only evidence gate: no merge, push, or cron activation occurs here.
import { execFileSync } from 'node:child_process';
import { collectCheckRuns } from './lib/blog-auto-merge-gate.mjs';
import { evaluateSeoRelease } from './lib/seo-release-gate.mjs';

const REPO = 'saphiron222/memlia-landing';
const args = process.argv.slice(2);
const option = name => args.includes(name) ? args[args.indexOf(name) + 1] : undefined;
const prNumber = option('--pr');
const qaTask = option('--qa-task');

const expectedHead = option('--expected-head');
const expectedMain = option('--expected-main');
if (args.length !== 8 || !/^\d+$/.test(prNumber ?? '') ||
    !/^t_[0-9a-f]+$/.test(qaTask ?? '') ||
    !/^[0-9a-f]{40}$/.test(expectedHead ?? '') || !/^[0-9a-f]{40}$/.test(expectedMain ?? '')) {
  console.error('Usage: seo-release-gate.mjs --pr N --qa-task t_ID --expected-head SHA --expected-main SHA');
  process.exit(2);
}
const call = (program, argv) => execFileSync(program, argv, { encoding: 'utf8', timeout: 30000 });
try {
  const pr = JSON.parse(call('gh', ['pr', 'view', prNumber, '--repo', REPO, '--json',
    'number,state,isDraft,baseRefName,baseRefOid,headRefOid,mergeable,mergeStateStatus']));
  const qa = JSON.parse(call('hermes', ['kanban', 'show', qaTask, '--json']));

  const repository = JSON.parse(call('gh', ['api', `repos/${REPO}`]));
  const checks = collectCheckRuns(JSON.parse(call('gh', ['api',
    `repos/${REPO}/commits/${expectedHead}/check-runs?filter=all&per_page=100`,
    '--paginate', '--slurp'])));
  const filePages = JSON.parse(call('gh', ['api', `repos/${REPO}/pulls/${prNumber}/files?per_page=100`,
    '--paginate', '--slurp']));
  const changedPaths = filePages.flatMap(page => page.map(file => ({
    filename: file.filename, status: file.status, previous_filename: file.previous_filename })));
  const remoteMain = call('git', ['ls-remote', 'origin', 'refs/heads/main']).split(/\s+/)[0];
  const verdict = evaluateSeoRelease({ pr, qa, checks, changedPaths,
    expectedHead, expectedMain, remoteMain, privateRepository: repository.private === true &&
      repository.full_name === REPO });
  console.log(JSON.stringify({ ...verdict, pr: Number(prNumber), head: expectedHead,
    main: expectedMain, qaTask, scope: 'seo-measures', publicationPerformed: false }));
  if (!verdict.pass) process.exitCode = 2;
} catch (error) {
  console.error(`SEO release blocked: ${error.message}`);
  process.exitCode = 2;
}
