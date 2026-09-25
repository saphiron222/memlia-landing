import path from 'node:path';

const SHA = /^[0-9a-f]{40}$/;

const BLOG_PATH = /^(?:docs\/strategy\/site-v3\/(?:RUNBOOK-QUOTIDIEN|DIAGNOSTIC-CRONS-2026-09-23|DIAGNOSTIC-PUBLICATION-2026-09-24)\.md$|docs\/qa\/blog\/|editorial\/|src\/content\/blog\/|src\/data\/images\.mjs$|public\/(?:images\/|llms\.txt$)|scripts\/(?:blog[^/]*|cron-preflight|agent-push-policy|verify-blog[^/]*|render-blog[^/]*)(?:\.[^/]+)?$|scripts\/(?:seo|lib\/blog)\/|tests\/scripts\/(?:blog[^/]*|cron-preflight|agent-push-policy)(?:\.[^/]+)?$|tests\/proof\/test_blog)/;
// One-time reviewed preflight migration; never grant arbitrary PRs permission to edit repository policy.
const PREFLIGHT_POLICY_HEAD = 'e024882b1c1048eadff8835e20313292087a2145';

export function verifyMergeCheckout({ call, cwd, scriptPath, expectedMain }) {
  const root = call('git', ['rev-parse', '--show-toplevel'])?.trim();
  return SHA.test(expectedMain ?? '') && root === cwd &&
    path.resolve(scriptPath) === path.resolve(root, 'scripts/blog-auto-merge.mjs') &&
    call('git', ['branch', '--show-current'])?.trim() === 'main' &&
    call('git', ['rev-parse', 'HEAD'])?.trim() === expectedMain &&
    call('git', ['status', '--porcelain']) === '' &&
    call('git', ['ls-remote', 'origin', 'refs/heads/main'])?.split(/\s+/)[0] === expectedMain;
}

export function evaluateBlogAutoMerge({ pr, qa, checks, changedPaths, expectedHead, expectedMain, remoteMain }) {
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
      changedPaths.some(path => !BLOG_PATH.test(path) &&
        !(pr?.number === 3 && expectedHead === PREFLIGHT_POLICY_HEAD && path === 'CLAUDE.md'))) {
    errors.push('PR contains an empty or out-of-blog diff');
  }
  const run = qa?.runs?.at(-1);
  if (qa?.task?.assignee !== 'qa' || qa?.task?.status !== 'done' ||
      run?.outcome !== 'completed' || !/^PASS(?:\s|$)/.test(run?.summary ?? '') ||
      /^PASS\s+AVEC\s+RÉSERVES/i.test(run?.summary ?? '') ||
      run?.metadata?.verdict !== 'PASS' ||
      run?.metadata?.pr_head !== expectedHead || run?.metadata?.ci?.exact_head !== true) {
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
