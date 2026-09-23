#!/usr/bin/env node
// Shared fail-closed entry point for the five editorial/SEO scheduled jobs.
import { existsSync, realpathSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const required = {
  forge: ['RUNBOOK-QUOTIDIEN.md', 'RUNBOOK-SEO.md'],
  sentinelle: ['RUNBOOK-SEO.md', 'CRONS-SEO.md'],
  demande: ['RUNBOOK-SEO.md', 'CRONS-SEO.md'],
  integrite: ['RUNBOOK-SEO.md', 'CRONS-SEO.md'],
  autorite: ['RUNBOOK-SEO.md', 'CRONS-SEO.md'],
};
const args = process.argv.slice(2);
const option = (key) => args[args.indexOf(key) + 1];
const root = resolve(option('--root') ?? '');
const job = option('--job');
const errors = [];
const report = { ok: false, job, root, cwd: process.cwd(), branch: null, head: null, originMain: null, errors };
const git = (...argv) => {
  const r = spawnSync('git', argv, { cwd: root, encoding: 'utf8', timeout: 30_000 });
  if (r.error || r.status !== 0) throw new Error(`git ${argv.join(' ')} : ${r.error?.message ?? r.stderr.trim() ?? 'échec'}`);
  return r.stdout.trim();
};
try {
  if (!required[job] || !args.includes('--root')) throw new Error('Usage : cron-preflight --root <checkout> --job <forge|sentinelle|demande|integrite|autorite>');
  if (realpathSync(root) !== realpathSync(process.cwd())) errors.push(`workdir incorrect : ${process.cwd()} != ${root}`);
  if (realpathSync(git('rev-parse', '--show-toplevel')) !== realpathSync(root)) errors.push('checkout incorrect : root doit être la racine Git');
  report.branch = git('branch', '--show-current');
  if (report.branch !== 'main') errors.push(`branche incorrecte : ${report.branch || '(detached)'} != main`);
  if (git('status', '--porcelain=v1')) errors.push('arbre Git non propre');
  for (const path of ['CLAUDE.md', ...required[job].map((name) => `docs/strategy/site-v3/${name}`)]) {
    if (!existsSync(join(root, path))) errors.push(`fichier requis absent : ${path}`);
  }
  git('fetch', 'origin', 'main');
  report.head = git('rev-parse', 'HEAD');
  report.originMain = git('rev-parse', 'refs/remotes/origin/main');
  if (report.head !== report.originMain) errors.push(`HEAD désynchronisé : ${report.head} != ${report.originMain}`);
} catch (error) {
  errors.push(error.message);
}
report.ok = errors.length === 0;
console.log(JSON.stringify(report));
if (!report.ok) process.exitCode = 1;
