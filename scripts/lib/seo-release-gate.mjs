// Separate, read-only SEO measurement release decision. Never reuse the blog allowlist.
const SHA = /^[0-9a-f]{40}$/;

const PREFIX = 'docs/strategy/site-v3/mesures/';
const MEASURE_FILES = new Set(['docs/strategy/site-v3/JOURNAL.md', 'editorial/maintenance.json']);

function scoped(path) {
  return typeof path === 'string' && !path.split('/').some(part => part === '.' || part === '..' || !part) &&
    (MEASURE_FILES.has(path) || (path.startsWith(PREFIX) && path.length > PREFIX.length));
}

export function evaluateSeoRelease({ pr, qa, checks, changedPaths,
  expectedHead, expectedMain, remoteMain, privateRepository }) {
  const errors = [];
  if (!SHA.test(expectedHead ?? '') || !SHA.test(expectedMain ?? '') ||
      privateRepository !== true || pr?.state !== 'OPEN' || pr?.isDraft !== false || pr?.baseRefName !== 'main' ||
      pr?.headRefOid !== expectedHead || pr?.baseRefOid !== expectedMain ||
      remoteMain !== expectedMain || pr?.mergeable !== 'MERGEABLE' || pr?.mergeStateStatus !== 'CLEAN') {
    errors.push('PR, HEAD ou main non conforme à la base enregistrée');
  }
  if (!Array.isArray(changedPaths) || changedPaths.length === 0 || changedPaths.some(file =>
    !file || !scoped(file.filename) || !['added', 'modified', 'removed', 'renamed'].includes(file.status) ||
    (file.status === 'renamed' && !scoped(file.previous_filename)) ||
    (file.status !== 'renamed' && file.previous_filename !== undefined))) {
    errors.push('diff hors mesures SEO');
  }
  const q = qa?.runs?.at(-1);
  if (qa?.task?.assignee !== 'qa' || qa?.task?.status !== 'done' ||
      q?.profile !== 'qa' || q?.outcome !== 'completed' || q?.summary !== 'PASS' ||
      q?.metadata?.verdict !== 'PASS' || q?.metadata?.pr !== pr?.number ||
      q?.metadata?.pr_head !== expectedHead || q?.metadata?.ci?.exact_head !== true ||
      q?.metadata?.ci?.head !== expectedHead || q?.metadata?.ci?.success_verified !== true) {
    errors.push('QA indépendante exact-head absente');
  }

  const runs = checks?.check_runs;
  const required = Array.isArray(runs) ? runs.filter(check => check.name === 'Repository gates') : [];
  if (!Number.isSafeInteger(checks?.total_count) || checks.total_count !== runs?.length ||
      required.length === 0 || runs.some(check => check.head_sha !== expectedHead ||
        check.status !== 'completed' || check.conclusion !== 'success')) {
    errors.push('Repository gates exact-head incomplets ou non réussis');
  }
  return { pass: errors.length === 0, errors };
}
