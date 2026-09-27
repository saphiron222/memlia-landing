#!/usr/bin/env node
// SEO-only local preparation gate; it cannot authorize a PR merge or cron activation.
import { existsSync, realpathSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const jobs = new Set(['sentinelle', 'demande', 'integrite', 'autorite']);
const args = process.argv.slice(2);
const option = key => args.includes(key) ? args[args.indexOf(key) + 1] : undefined;
const root = resolve(option('--root') ?? '');
const job = option('--job');
const phase = option('--phase') ?? 'initial';
const base = option('--base');
const commit = option('--commit');
const sha = value => typeof value === 'string' && /^[0-9a-f]{40}$/.test(value);
const scoped = path => typeof path === 'string' && !path.split('/').some(part => !part || part === '.' || part === '..') &&
  (path.startsWith('docs/strategy/site-v3/mesures/') || path === 'docs/strategy/site-v3/JOURNAL.md' ||
    path === 'editorial/maintenance.json');
const errors = [];
const report = { ok: false, job, root, cwd: process.cwd(), branch: null, head: null, originMain: null, errors };
const git = (...argv) => {
  const r = spawnSync('git', argv, { cwd: root, encoding: 'utf8', timeout: 30_000 });
  if (r.error || r.status !== 0) throw new Error(`git ${argv.join(' ')} : ${r.error?.message ?? r.stderr.trim() ?? 'échec'}`);
  return r.stdout.trim();
};
try {
  if (!jobs.has(job) || !args.includes('--root')) throw new Error('Usage : seo-cron-preflight --root <checkout> --job <sentinelle|demande|integrite|autorite>');
  if (!['initial', 'before-commit', 'before-push'].includes(phase) ||
      (phase === 'initial' && (base || commit)) ||
      (phase !== 'initial' && !sha(base)) ||
      (phase === 'before-commit' && commit) ||
      (phase === 'before-push' && !sha(commit))) throw new Error('phase/base/commit invalides');
  if (realpathSync(root) !== realpathSync(process.cwd())) errors.push('workdir incorrect');
  if (realpathSync(git('rev-parse', '--show-toplevel')) !== realpathSync(root)) errors.push('checkout incorrect');
  report.branch = git('branch', '--show-current');
  const seoBranch = new RegExp(`^site/seo-mesures-${job}-[0-9]{8}(?:-[a-z0-9]+)*$`).test(report.branch);
  if (phase === 'initial' ? report.branch !== 'main' : !seoBranch)
    errors.push(`branche incorrecte : ${report.branch || '(detached)'}`);
  if (phase !== 'before-commit' && git('status', '--porcelain=v1')) errors.push('arbre Git non propre');
  for (const path of ['CLAUDE.md', 'docs/strategy/site-v3/RUNBOOK-SEO.md', 'docs/strategy/site-v3/CRONS-SEO.md'])
    if (!existsSync(join(root, path))) errors.push(`fichier requis absent : ${path}`);
  git('fetch', 'origin', 'main');
  report.head = git('rev-parse', 'HEAD');
  report.originMain = git('rev-parse', 'FETCH_HEAD');
  if (phase !== 'initial' && base !== report.originMain) errors.push('base désynchronisée');
  if (phase === 'before-push') {
    if (report.head !== commit) errors.push('commit inattendu');
    if (git('rev-parse', 'HEAD^') !== base) errors.push('parent du commit inattendu');
  } else if (report.head !== (base ?? report.originMain)) errors.push('HEAD désynchronisé');
  if (phase !== 'initial') {
    const changed = phase === 'before-commit'
      ? git('diff', '--cached', '--name-status', '-z', '--diff-filter=ACDMRT')
      : git('diff', '--name-status', '-z', base, 'HEAD');
    const entries = changed ? changed.split('\0') : [];
    const paths = [];
    while (entries.length) {
      const status = entries.shift();
      if (!status) break;
      if (!/^[ACDMRT][0-9]*$/.test(status)) throw new Error('statut Git inattendu');
      const count = /^[RC]/.test(status) ? 2 : 1;
      for (let i = 0; i < count; i++) {
        const path = entries.shift();
        if (!path) throw new Error('chemin Git manquant');
        paths.push(path);
      }
    }
    if (entries.length) throw new Error('sortie Git inattendue');
    if (!paths.length || paths.some(path => !scoped(path))) errors.push('périmètre SEO incorrect');
  }
} catch (error) {
  errors.push(error.message);
}
report.ok = errors.length === 0;
console.log(JSON.stringify(report));
if (!report.ok) process.exitCode = 1;
