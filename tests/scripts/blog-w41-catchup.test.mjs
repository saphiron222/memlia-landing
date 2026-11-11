import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verifierPlafonds } from '../../scripts/lib/blog-pipeline.mjs';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { materialiser } from '../../scripts/blog-forge.mjs';

const slug = 'checklist-avant-le-depot-mensuel-de-la-dsn';
const now = new Date('2026-10-12T12:00:00Z');
const jour = '2026-10-12';
const actifs = Array.from({ length: 3 }, (_, i) => ({ slug: `ordinaire-${i}`, date: jour }));

test('W41 : le quatrième candidat mandaté passe au jour réel, hors lot et dates mutantes refusés', () => {
  const mandate = JSON.parse(readFileSync(new URL('../../scripts/lib/blog-w41-catchup.json', import.meta.url)));
  assert.equal(mandate.articles.length, 12);
  for (const e of mandate.articles) assert.doesNotThrow(() => verifierPlafonds(actifs, jour, { slug: e.slug, now }));
  assert.doesNotThrow(() => verifierPlafonds(actifs, jour, { slug, now }));
  assert.throws(() => verifierPlafonds(actifs, jour, { slug: 'autre', now }), /3 candidats/);
  for (const date of ['2026-10-11', '2026-10-13', '2026-10-19']) {
    assert.throws(() => verifierPlafonds([], date, { slug, now }));
  }
  assert.throws(() => verifierPlafonds([], jour, { slug, now, serie: 'cicatrices' }));
});

test('W41 : capacité ordinaire conservée et archives du lot séparées des quinze places', () => {
  const lot = [{ slug, date: jour }];
  assert.doesNotThrow(() => verifierPlafonds([...lot, ...actifs.slice(0, 2)], jour, { slug: 'autre', now }));
  assert.throws(() => verifierPlafonds([...lot, ...actifs], jour, { slug: 'autre', now }));
  const semaine = Array.from({ length: 15 }, (_, i) => ({ slug: `ordinaire-${i}`, date: '2026-10-13' }));
  assert.doesNotThrow(() => verifierPlafonds(semaine, jour, { slug, now }));
  assert.throws(() => verifierPlafonds(semaine, jour, { slug: 'autre', now }), /15 candidats/);
});

test('W41 : minuit Paris, week-end réel autorisé au lot seulement, pas de doublon', () => {
  assert.doesNotThrow(() => verifierPlafonds(actifs, '2026-10-13', { slug, now: new Date('2026-10-12T22:00:00Z') }));
  assert.throws(() => verifierPlafonds([], jour, { slug, now: new Date('2026-10-12T22:00:00Z') }));
  assert.doesNotThrow(() => verifierPlafonds([], '2026-10-17', { slug, now: new Date('2026-10-17T10:00:00Z') }));
  assert.throws(() => verifierPlafonds([], '2026-10-17', { slug: 'autre', now: new Date('2026-10-17T10:00:00Z') }));
  assert.throws(() => verifierPlafonds([{ slug, date: jour }], jour, { slug, now }), /déjà/);
});

test('W41 : vrais --check et --slot sur le stock réel, aucune publication inventée', async (t) => {
  t.mock.timers.enable({ apis: ['Date'], now });
  const repo = fileURLToPath(new URL('../../', import.meta.url));
  const root = mkdtempSync(join(tmpdir(), 'w41-slot-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const path of ['CLAUDE.md', 'scripts', 'src/data/familles.ts', 'src/content.config.ts', 'src/content/blog', 'docs/strategy/site-v3']) {
    cpSync(join(repo, path), join(root, path), { recursive: true });
  }
  // Le contrat d'architecture CAC est joué par la CI ; ici on exerce la cadence.
  rmSync(join(root, 'docs/strategy/site-v3/cac/page-intent-plan.json'));
  const dir = join(root, 'docs/strategy/site-v3');
  const backlogPath = join(dir, 'backlog-v3.json');
  const backlog = JSON.parse(readFileSync(backlogPath));
  const mandate = JSON.parse(readFileSync(join(root, 'scripts/lib/blog-w41-catchup.json')));
  for (const e of backlog.filter((e) => mandate.articles.some((a) => a.slug === e.slug))) {
    e.datePlanifiee = jour;
  }
  writeFileSync(backlogPath, JSON.stringify(backlog));
  const engine = join(dir, 'engine.py');
  cpSync(join(dir, 'build-cluster-plan.py'), engine);
  const clock = `import datetime, runpy\nclass FixedDate(datetime.date):\n    @classmethod\n    def today(cls): return cls(2026, 10, 12)\ndatetime.date=FixedDate\n`;
  writeFileSync(join(dir, 'build-cluster-plan.py'), clock + `runpy.run_path(${JSON.stringify(engine)}, run_name='__main__')\n`);
  const options = { cwd: root, encoding: 'utf8', timeout: 30_000 };
  const cli = (...args) => spawnSync('python3', [join(dir, 'build-cluster-plan.py'), ...args], options);
  let result = cli('--check');
  assert.equal(result.status, 0, result.stderr + result.stdout);
  assert.match(result.stdout, /OBSERVATION cadence 2026-10-12 : \d+ ordinaires réels/);
  assert.match(result.stdout, /réservés seulement/);
  writeFileSync(join(root, 'edition.py'), clock + `p=runpy.run_path(${JSON.stringify(engine)}, run_name='edition')\nd=p['construire']()\ne, entrants, _=p['verifier'](*d)\nassert not e, e\np['ecrire_json'](d[0],d[1],d[3],d[4],d[5],entrants)\np['ecrire_calendrier'](d[3],d[4],d[1],d[0])\n`);
  result = spawnSync('python3', [join(root, 'edition.py')], options);
  assert.equal(result.status, 0, result.stderr);
  const paths = ['cluster-plan.json', 'CONTENT-CALENDAR.md'].map((p) => join(dir, p));
  const before = paths.map((p) => readFileSync(p));
  result = cli('--slot', slug, jour);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /créneau : OK/);
  assert.deepEqual(paths.map((p) => readFileSync(p)), before);
  const posts = JSON.parse(before[0]).clusters.flatMap((c) => c.posts);
  assert.equal(posts.find((e) => e.slug === slug).status, 'planned');
  for (const e of backlog.filter((e) => e.datePlanifiee && !mandate.articles.some((a) => a.slug === e.slug))) {
    assert.equal(posts.find((p) => p.slug === e.slug).date, e.datePlanifiee);
  }
  for (const args of [[slug, '2026-10-13'], [slug, '2026-10-11'], ['cible-manquante', jour]]) {
    result = cli('--slot', ...args);
    assert.notEqual(result.status, 0, result.stdout);
  }
  // Une cadence admise ne devient ni source, ni avis, ni autorisation de publier.
  await assert.rejects(materialiser({ root, slug, statut: 'publie' }), (error) => {
    assert.doesNotMatch(error.message, /Créneau éditorial refusé/);
    assert.match(error.message, /ENOENT.*recette\.json/);
    return true; // La recette absente reste refusée après le vrai préflight.
  });
  assert.equal(existsSync(join(root, 'editorial/articles', slug)), false);
  // Le vrai préflight de cron doit accepter le calendrier reconstruit, pas
  // seulement les validations de slot, dans un checkout propre et synchronisé.
  const nativeClock = join(root, 'clock.mjs');
  writeFileSync(nativeClock, `const NativeDate = Date;
globalThis.Date = class extends NativeDate {
  constructor(...args) { super(...(args.length ? args : ['2026-10-12T12:00:00Z'])); }
  static now() { return NativeDate.parse('2026-10-12T12:00:00Z'); }
};\n`);
  const git = (...args) => {
    const result = spawnSync('git', args, options);
    assert.equal(result.status, 0, result.stderr);
  };
  git('init', '-q', '-b', 'main');
  git('config', 'user.name', 'Test');
  git('config', 'user.email', 'test@example.invalid');
  git('add', '.'); git('commit', '-qm', 'stock réel réservé');
  git('remote', 'add', 'origin', root);
  result = spawnSync(process.execPath, ['--import', nativeClock, join(repo, 'scripts/cron-preflight.mjs'),
    '--root', root, '--job', 'forge', '--phase', 'maintenance'], options);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.equal(JSON.parse(result.stdout).ok, true);
  assert.deepEqual(paths.map((p) => readFileSync(p)), before);
  writeFileSync(paths[1], before[1] + '\nDérive\n');
  result = cli('--slot', slug, jour);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /désaligné/);
});
