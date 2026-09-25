#!/usr/bin/env node
// Narrow procedural release gate for the private GitHub Free blog repository.
// It does not claim that GitHub branch protection is enabled.
import { execFileSync } from 'node:child_process';
import { evaluateBlogAutoMerge, verifyMergeCheckout } from './lib/blog-auto-merge-gate.mjs';

const REPO = 'saphiron222/memlia-landing';
const args = process.argv.slice(2);
const option = name => {
  const index = args.indexOf(name);
  return index < 0 ? undefined : args[index + 1];
};
const prNumber = option('--pr');
const qaTask = option('--qa-task');
const expectedHead = option('--expected-head');
const expectedMain = option('--expected-main');
const merge = args.includes('--merge');

if (!/^\d+$/.test(prNumber ?? '') || !/^t_[0-9a-f]+$/.test(qaTask ?? '') ||
    !/^[0-9a-f]{40}$/.test(expectedHead ?? '') || !/^[0-9a-f]{40}$/.test(expectedMain ?? '')) {
  console.error('Usage: blog-auto-merge.mjs --pr N --qa-task t_ID --expected-head SHA --expected-main SHA [--merge]');
  process.exit(2);
}

function call(command, argv) {
  return execFileSync(command, argv, { encoding: 'utf8', timeout: 30000 });
}

function readEvidence() {
  const pr = JSON.parse(call('gh', ['pr', 'view', prNumber, '--repo', REPO, '--json',
    'number,state,isDraft,baseRefName,baseRefOid,headRefOid,mergeable,mergeStateStatus']));
  const qa = JSON.parse(call('hermes', ['kanban', 'show', qaTask, '--json']));
  const checks = JSON.parse(call('gh', ['api', `repos/${REPO}/commits/${expectedHead}/check-runs?per_page=100`]));
  const changedPaths = call('gh', ['pr', 'diff', prNumber, '--repo', REPO, '--name-only'])
    .split('\n').map(line => line.trim()).filter(Boolean);
  const remoteMain = call('git', ['ls-remote', 'origin', 'refs/heads/main']).split(/\s+/)[0];
  const result = evaluateBlogAutoMerge({ pr, qa, checks, changedPaths,
    expectedHead, expectedMain, remoteMain });
  return { result, changedPaths };
}

try {
  const { result, changedPaths } = readEvidence();
  console.log(JSON.stringify({ ...result, pr: Number(prNumber), head: expectedHead,
    main: expectedMain, changedPaths, qaTask, githubProtectionClaimed: false }));
  if (!result.pass) process.exit(2);
  if (merge) {
    if (!verifyMergeCheckout({ call, cwd: process.cwd(), scriptPath: process.argv[1], expectedMain })) {
      throw new Error('merge requires the reviewed script installed in a clean, current main checkout');
    }
    // Re-read both refs and all gates just before requesting a merge. GitHub's
    // --match-head-commit locks the head, not the base; post-merge proof remains mandatory.
    const fresh = readEvidence();
    if (!fresh.result.pass || !verifyMergeCheckout({ call, cwd: process.cwd(),
      scriptPath: process.argv[1], expectedMain })) {
      throw new Error('merge aborted: PR, QA, CI or main changed since the first read');
    }
    // GitHub refuses a changed PR head. Do not use --admin or --delete-branch.
    call('gh', ['pr', 'merge', prNumber, '--repo', REPO, '--merge',
      '--match-head-commit', expectedHead]);
    console.log(JSON.stringify({ mergeRequested: true, pr: Number(prNumber),
      head: expectedHead, productionVerified: false }));
  }
} catch (error) {
  console.error(`Blog auto-merge gate blocked: ${error.message}`);
  process.exit(2);
}
