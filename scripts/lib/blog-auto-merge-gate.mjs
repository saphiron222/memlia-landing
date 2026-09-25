import path from 'node:path';

const SHA = /^[0-9a-f]{40}$/;

// Exact infrastructure files and article-owned directories only. Global image, SEO,
// publication-policy and generated assets need a separate review/authorization.
const BLOG_FILES = new Set([
  'docs/strategy/site-v3/RUNBOOK-QUOTIDIEN.md',
  'docs/strategy/site-v3/DIAGNOSTIC-CRONS-2026-09-23.md',
  'docs/strategy/site-v3/DIAGNOSTIC-PUBLICATION-2026-09-24.md',
  'docs/strategy/site-v3/BLOG-AUTO-MERGE-GATE.md',
  'scripts/blog-auto-merge.mjs', 'scripts/lib/blog-auto-merge-gate.mjs',
  'tests/scripts/blog-auto-merge-gate.test.mjs',
  'scripts/blog-pipeline.mjs', 'scripts/blog-forge.mjs',
  'scripts/lib/blog-pipeline.mjs', 'scripts/lib/blog-published-authority.mjs',
  'scripts/cron-preflight.mjs', 'tests/scripts/cron-preflight.test.mjs',
]);
const BLOG_OWNED = /^(?:editorial\/(?:articles|recettes)\/[a-z0-9-]+\/|src\/content\/blog\/)[^/]+(?:\/[^/]+)*$/;
function blogPathAllowed(file) {
  return typeof file === 'string' && file.split('/').every(part => part !== '.' && part !== '..') &&
    (BLOG_FILES.has(file) || BLOG_OWNED.test(file));
}
// One-time reviewed policy content; a main sync changes the PR head, not this blob.
const PREFLIGHT_POLICY_BLOB = 'b3b1d575a4405d9288ff8d2f1842d8faa2950535';

export function verifyMergeCheckout({ call, cwd, scriptPath, expectedMain }) {
  const root = call('git', ['rev-parse', '--show-toplevel'])?.trim();
  return SHA.test(expectedMain ?? '') && root === cwd &&
    path.resolve(scriptPath) === path.resolve(root, 'scripts/blog-auto-merge.mjs') &&
    call('git', ['branch', '--show-current'])?.trim() === 'main' &&
    call('git', ['rev-parse', 'HEAD'])?.trim() === expectedMain &&
    call('git', ['status', '--porcelain']) === '' &&
    call('git', ['ls-remote', 'origin', 'refs/heads/main'])?.split(/\s+/)[0] === expectedMain;
}

export function collectCheckRuns(pages) {
  if (!Array.isArray(pages) || pages.length === 0 ||
      !Number.isSafeInteger(pages[0]?.total_count) || pages[0].total_count < 0 ||
      pages.some(page => page?.total_count !== pages[0].total_count ||
        !Array.isArray(page.check_runs) || page.check_runs.length > 100)) {
    throw new Error('incomplete check runs pagination');
  }
  const check_runs = pages.flatMap(page => page.check_runs);
  if (check_runs.length !== pages[0].total_count) {
    throw new Error('incomplete check runs pagination');
  }
  return { total_count: check_runs.length, check_runs };
}

export function evaluateBlogAutoMerge({ pr, qa, checks, changedPaths, policyBlobSha,
  expectedHead, expectedMain, remoteMain }) {
  const errors = [];
  if (!SHA.test(expectedHead ?? '') || !SHA.test(expectedMain ?? '')) {
    errors.push('expected head and main must be exact 40-character SHAs');
  }
  if (pr?.state !== 'OPEN' || pr?.isDraft !== false || pr?.baseRefName !== 'main') {
    errors.push('PR must be open, non-draft and target main');
  }
  if (pr?.headRefOid !== expectedHead || pr?.baseRefOid !== expectedMain || remoteMain !== expectedMain) {
    errors.push('PR head or main moved since the recorded review');
  }
  if (pr?.mergeable !== 'MERGEABLE' || pr?.mergeStateStatus !== 'CLEAN') {
    errors.push('PR has a conflict or is not cleanly mergeable');
  }
  if (!Array.isArray(changedPaths) || changedPaths.length === 0 ||
      changedPaths.some(path => !blogPathAllowed(path) &&
        !(pr?.number === 3 && policyBlobSha === PREFLIGHT_POLICY_BLOB && path === 'CLAUDE.md'))) {
    errors.push('PR contains an empty or out-of-blog diff');
  }
  const run = qa?.runs?.at(-1);
  if (qa?.task?.assignee !== 'qa' || qa?.task?.status !== 'done' ||
      run?.profile !== 'qa' || run?.outcome !== 'completed' || run?.summary?.trim() !== 'PASS' ||
      run?.metadata?.verdict !== 'PASS' ||
      run?.metadata?.pr !== pr?.number || run?.metadata?.pr_head !== expectedHead ||
      run?.metadata?.ci?.exact_head !== true || run?.metadata?.ci?.head !== expectedHead ||
      run?.metadata?.ci?.success_verified !== true) {
    errors.push('independent QA PASS on the exact PR head is missing');
  }
  const runs = checks?.check_runs;
  const required = Array.isArray(runs) ? runs.filter(check => check.name === 'Repository gates') : [];
  if (!Number.isSafeInteger(checks?.total_count) || checks.total_count !== runs?.length ||
      required.length === 0 || required.some(check =>
        check.head_sha !== expectedHead || check.status !== 'completed' || check.conclusion !== 'success')) {
    errors.push('all Repository gates runs must be SUCCESS on the exact head (complete response required)');
  }
  return { pass: errors.length === 0, errors };
}
