#!/usr/bin/env node
// Fail-closed entry point for the blog forge only; SEO jobs await a separate release.
import { existsSync, realpathSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { lireRattrapageIA, verifierDateRattrapageIA, semaineEditorialeIA, plafondJourIA } from './lib/blog-ia-catchup.mjs';
import { semaineIso, plafondJourOrdinaire, plafondSemaineOrdinaire, DEBUT_CADENCE_15 } from './lib/blog-pipeline.mjs';

const required = ['RUNBOOK-QUOTIDIEN.md'];
const args = process.argv.slice(2);
const option = (key) => args.includes(key) ? args[args.indexOf(key) + 1] : undefined;
const root = resolve(option('--root') ?? '');
const job = option('--job');
const phase = option('--phase') ?? 'initial';
const base = option('--base');
const commit = option('--commit');
const entryPhase = phase === 'initial' || phase === 'maintenance';
const sha = (value) => typeof value === 'string' && /^[0-9a-f]{40}$|^[0-9a-f]{64}$/.test(value);

const errors = [];
const report = { ok: false, job, root, cwd: process.cwd(), branch: null, head: null, originMain: null, errors };
const git = (...argv) => {
  const r = spawnSync('git', argv, { cwd: root, encoding: 'utf8', timeout: 30_000 });
  if (r.error || r.status !== 0) throw new Error(`git ${argv.join(' ')} : ${r.error?.message ?? r.stderr.trim() ?? 'échec'}`);
  return r.stdout.trim();
};
try {
  if (job !== 'forge' || !args.includes('--root')) throw new Error('Usage : cron-preflight --root <checkout> --job forge (SEO non autorisé)');
  if (!['initial', 'maintenance', 'before-selection', 'before-commit', 'before-push'].includes(phase) ||
      (entryPhase && (base || commit)) ||
      (!entryPhase && !sha(base)) ||
      (['before-selection', 'before-commit'].includes(phase) && commit) ||
      (phase === 'before-push' && !sha(commit))) throw new Error('phase/base/commit invalides');
  if (realpathSync(root) !== realpathSync(process.cwd())) errors.push(`workdir incorrect : ${process.cwd()} != ${root}`);
  if (realpathSync(git('rev-parse', '--show-toplevel')) !== realpathSync(root)) errors.push('checkout incorrect : root doit être la racine Git');
  report.branch = git('branch', '--show-current');
  const blogBranch = /^site\/blog-[a-z0-9][a-z0-9-]*$/.test(report.branch);
  if (phase === 'initial' ? report.branch !== 'main' : !(blogBranch || (phase !== 'before-push' && report.branch === 'main'))) {
    errors.push(`branche incorrecte : ${report.branch || '(detached)'} pour ${phase}`);
  }
  if (phase === 'before-selection') {
    // Only calendar maintenance may precede selection; never article preparation.
    const allowed = new Set(['backlog-v3.json', 'cluster-plan.json', 'cluster-plan.md',
      'CONTENT-CALENDAR.md', 'cluster-map.html'].map(name => `docs/strategy/site-v3/${name}`));
    const changed = new Set([...git('diff', '--name-only').split('\n'),
      ...git('diff', '--cached', '--name-only').split('\n'),
      ...git('ls-files', '--others', '--exclude-standard').split('\n')].filter(Boolean));
    for (const path of changed) if (!allowed.has(path)) errors.push(`écriture avant sélection non autorisée : ${path}`);
  } else if (phase !== 'before-commit' && git('status', '--porcelain=v1')) errors.push('arbre Git non propre');
  for (const path of ['CLAUDE.md', ...required.map((name) => `docs/strategy/site-v3/${name}`)]) {
    if (!existsSync(join(root, path))) errors.push(`fichier requis absent : ${path}`);
  }
  // A missed slot is a historical trace, never a publication candidate. Check the
  // materialized calendar and explicit backlog reservations on every release phase.
  const calendar = JSON.parse(readFileSync(join(root, 'docs/strategy/site-v3/cluster-plan.json'), 'utf8'));
  const backlog = JSON.parse(readFileSync(join(root, 'docs/strategy/site-v3/backlog-v3.json'), 'utf8'));
  if (!Array.isArray(calendar.clusters) || !Array.isArray(backlog)) throw new Error('calendrier éditorial illisible');
  // Match the forge's civil publication day, independent of the host/CI zone.
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const posts = [calendar.pillar, ...calendar.clusters.flatMap((cluster) => cluster.posts)];
  const cicatrices = new Set(backlog.filter((entry) => entry.serie === 'cicatrices').map((entry) => entry.slug));
  cicatrices.add('tests-verts-et-regle-des-trois-passes'); // W39 published replaces the old backlog slug.
  const realDays = new Map();
  const realWeeks = new Map();
  const ruleIA = lireRattrapageIA(root);
  const actifs = posts.filter((post) => ['published', 'planned'].includes(post?.status) && !cicatrices.has(post.slug));
  const overdue = [];
  if (phase === 'maintenance') report.maintenanceRequired = overdue;
  for (const post of posts) {
    if (post?.status === 'published' || post?.status === 'planned') {
      const parsed = new Date(`${post.date}T12:00:00Z`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== post.date) {
        errors.push(`date réelle invalide : ${post.slug} (${post.date})`);
        continue;
      }
    }
    if (post?.status === 'planned' && post.date < today) {
      const message = `créneau planned échu : ${post.slug} (${post.date})`;
      (phase === 'maintenance' ? overdue : errors).push(message);
      if (phase === 'maintenance') continue; // Historical slots never reserve today's capacity.
    }
    if ((post?.status === 'published' || post?.status === 'planned') && !cicatrices.has(post.slug)) {
      const day = post.date;
      if (post.status === 'planned' && day >= DEBUT_CADENCE_15 && [0, 6].includes(new Date(`${day}T12:00:00Z`).getUTCDay())) {
        errors.push(`article ordinaire hors lundi-vendredi : ${post.slug} (${day})`);
      }
      verifierDateRattrapageIA(ruleIA, post.slug, day);
      const semaine = semaineEditorialeIA(ruleIA, post.slug, day, semaineIso(day));
      const week = ruleIA?.publications[post.slug] === day ? `lot-ia-${semaine}` : semaine;
      realDays.set(day, (realDays.get(day) ?? 0) + 1);
      realWeeks.set(week, (realWeeks.get(week) ?? 0) + 1);
    }
  }
  for (const [day, count] of realDays) {
    if (actifs.some((post) => post.date === day && count > plafondJourIA(ruleIA, post.slug, day, actifs, plafondJourOrdinaire(day)))) {
      errors.push(`jour réel ${day} : plafond de ${plafondJourOrdinaire(day)} articles dépassé hors rattrapage IA (${count})`);
    }
  }
  for (const [week, count] of realWeeks) if (count > plafondSemaineOrdinaire(week.replace('lot-ia-', ''))) errors.push(`semaine réelle ${week} : plafond hebdomadaire dépassé (${count})`);
  const statusBySlug = new Map(posts.map((post) => [post.slug, post.status]));
  for (const entry of backlog) {
    if (entry.datePlanifiee && entry.datePlanifiee < today && statusBySlug.get(entry.slug) !== 'a-replanifier') {
      (phase === 'maintenance' ? overdue : errors).push(`datePlanifiee échue : ${entry.slug} (${entry.datePlanifiee})`);
    }
  }
  git('fetch', 'origin', 'main');
  report.head = git('rev-parse', 'HEAD');
  report.originMain = git('rev-parse', 'FETCH_HEAD');
  if (!entryPhase && base !== report.originMain) errors.push(`base désynchronisée : ${base} != ${report.originMain}`);
  if (phase === 'before-push') {
    if (report.head !== commit) errors.push(`commit inattendu : ${report.head} != ${commit}`);
    if (git('rev-parse', 'HEAD^') !== base) errors.push(`parent du commit inattendu : ${base}`);
  } else if (report.head !== (base ?? report.originMain)) {
    errors.push(`HEAD désynchronisé : ${report.head} != ${base ?? report.originMain}`);
  }

} catch (error) {
  errors.push(error.message);
}
report.ok = errors.length === 0;
console.log(JSON.stringify(report));
if (!report.ok) process.exitCode = 1;
