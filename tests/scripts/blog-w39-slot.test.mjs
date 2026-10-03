import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { materialiser } from '../../scripts/blog-forge.mjs';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const slug = 'tests-verts-et-regle-des-trois-passes';
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'w39-slot-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const path of ['scripts', 'package.json', 'src/content.config.ts', 'src/data/familles.ts', 'src/content/blog',
    'docs/strategy/site-v3/backlog-v3.json', 'docs/strategy/site-v3/mesures', 'docs/strategy/site-v3/w39-cadrage-operateur.json']) {
    cpSync(join(repo, path), join(root, path), { recursive: true });
  }
  symlinkSync(join(repo, 'node_modules'), join(root, 'node_modules'), 'dir');
  const planDir = join(root, 'docs/strategy/site-v3');
  cpSync(join(repo, 'docs/strategy/site-v3/build-cluster-plan.py'), join(planDir, 'engine.py'));
  const clock = join(root, 'clock.json');
  writeFileSync(clock, JSON.stringify('2026-10-01'));
  const wrapper = `import datetime, json, runpy\nfrom pathlib import Path\nDAY=json.loads(Path(${JSON.stringify(clock)}).read_text())\nclass FixedDate(datetime.date):\n    @classmethod\n    def today(cls): return cls.fromisoformat(DAY)\ndatetime.date=FixedDate\nrunpy.run_path(${JSON.stringify(join(planDir, 'engine.py'))}, run_name='__main__')\n`;
  writeFileSync(join(planDir, 'build-cluster-plan.py'), wrapper);
  const edit = join(root, 'edit.py');
  writeFileSync(edit, wrapper.replace('runpy.run_path(', 'p=runpy.run_path(').replace("run_name='__main__'", "run_name='edition'") +
    "d=p['construire']()\ne, entrants, _=p['verifier'](*d)\nassert not e, e\np['ecrire_json'](d[0],d[1],d[3],d[4],d[5],entrants)\np['ecrire_calendrier'](d[3],d[4],d[1],d[0])\n");
  const preload = join(root, 'clock.mjs');
  writeFileSync(preload, `import { readFileSync } from 'node:fs';\nconst day=JSON.parse(readFileSync(${JSON.stringify(clock)}));\nconst RealDate=Date; globalThis.Date=class extends RealDate { constructor(...args) { super(...(args.length ? args : [day+'T10:00:00Z'])); } static now() { return new RealDate(day+'T10:00:00Z').getTime(); } };\n`);
  const recipeDir = join(root, 'editorial/recettes', slug);
  mkdirSync(recipeDir, { recursive: true });
  cpSync(join(repo, 'tests/fixtures/w39-signed-body.md'), join(recipeDir, 'corps.md'));
  const recipe = { slug, serie: 'cicatrices', date: '2026-10-01' };
  const recipePath = join(recipeDir, 'recette.json');
  writeFileSync(recipePath, JSON.stringify(recipe));
  const queuePath = join(root, 'editorial/queue.json');
  writeFileSync(queuePath, JSON.stringify({ candidates: [] }));
  const options = { cwd: root, encoding: 'utf8', env: { ...process.env, NODE_OPTIONS: `--import=${preload}` } };
  const edition = () => {
    const result = spawnSync('python3', [edit], options);
    assert.equal(result.status, 0, result.stderr);
  };
  const slot = (target = slug, day = JSON.parse(readFileSync(clock))) => spawnSync('python3', [join(planDir, 'build-cluster-plan.py'), '--slot', target, day], options);
  return { root, planDir, recipe, recipePath, queuePath, clock, edition, slot, preload };
}

test('le vrai préflight W39 exige le calendrier frais puis utilise le reçu, sans replanification historique', async (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: new Date('2026-10-01T10:00:00Z') });
  const f = fixture(t);
  let result = f.slot();
  assert.notEqual(result.status, 0);
  f.edition();
  const paths = ['cluster-plan.json', 'CONTENT-CALENDAR.md'].map((p) => join(f.planDir, p));
  const before = paths.map((p) => readFileSync(p));
  result = f.slot();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /créneau : OK/);
  assert.deepEqual(paths.map((p) => readFileSync(p)), before);
  // La forge traverse le vrai préflight, puis refuse la recette de test incomplète.

  const old = process.env.NODE_OPTIONS;
  process.env.NODE_OPTIONS = `--import=${f.preload}`;
  try {
    await assert.rejects(materialiser({ root: f.root, slug, statut: 'a-valider' }), (error) => {
      assert.doesNotMatch(error.message, /Créneau éditorial refusé/);
      return true;
    });
  } finally {
    if (old === undefined) delete process.env.NODE_OPTIONS; else process.env.NODE_OPTIONS = old;
  }
  assert.equal(existsSync(join(f.root, 'editorial/articles', slug)), false);
  writeFileSync(paths[1], before[1] + '\nDérive\n');
  result = f.slot();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /désaligné/);
});

test('le préflight W39 réel conserve refus de dates, identité, reçu, RAW et doublons avant toute écriture', (t) => {
  const f = fixture(t);
  const receiptPath = join(f.planDir, 'w39-cadrage-operateur.json');
  const receipt = readFileSync(receiptPath);
  const bodyPath = join(f.root, 'editorial/recettes', slug, 'corps.md');
  const body = readFileSync(bodyPath);
  for (const day of ['2026-10-01', '2026-10-04']) {
    writeFileSync(f.clock, JSON.stringify(day));
    writeFileSync(f.recipePath, JSON.stringify({ ...f.recipe, date: day }));
    f.edition();
    assert.equal(f.slot().status, 0);
  }
  writeFileSync(f.clock, JSON.stringify('2026-10-01'));
  writeFileSync(f.recipePath, JSON.stringify(f.recipe));
  f.edition();
  const mutations = [
    () => writeFileSync(f.recipePath, JSON.stringify({ ...f.recipe, serie: 'ordinary' })),
    () => writeFileSync(f.recipePath, JSON.stringify({ ...f.recipe, date: '2026-09-29' })),
    () => writeFileSync(receiptPath, JSON.stringify({ ...JSON.parse(receipt), validThrough: '2026-10-05' })),
    () => rmSync(receiptPath),
    () => writeFileSync(bodyPath, Buffer.concat([body, Buffer.from('\n')])),
    () => writeFileSync(f.queuePath, JSON.stringify({ candidates: [{ ...f.recipe, status: 'publie' }] })),
    () => writeFileSync(f.queuePath, JSON.stringify({ candidates: [{ ...f.recipe, serie: 'ordinary', status: 'a-valider' }] })),
    () => writeFileSync(f.queuePath, JSON.stringify({ candidates: [{ slug: 'autre', serie: 'cicatrices', date: '2026-09-26', status: 'a-valider' }] })),
    () => writeFileSync(f.clock, JSON.stringify('2026-09-30')),
    () => writeFileSync(join(f.root, 'src/content/blog', `${slug}.md`), '---\nbrouillon: false\ndatePublication: 2026-10-01\nfamille: ia-generative-agents\nformat: thought-leadership\nprimaryQuery: pourquoi des tests verts peuvent manquer des défauts\ntitre: Pourquoi des tests verts manquent des défauts : la règle des trois passes\n---\n'),
  ];
  for (const [index, mutate] of mutations.entries()) {
    writeFileSync(f.clock, JSON.stringify('2026-10-01'));
    writeFileSync(f.recipePath, JSON.stringify(f.recipe));
    writeFileSync(receiptPath, receipt);
    writeFileSync(bodyPath, body);
    writeFileSync(f.queuePath, JSON.stringify({ candidates: [] }));
    mutate();
    const before = [f.recipePath, f.queuePath, bodyPath].map((p) => readFileSync(p));
    const result = f.slot();
    assert.notEqual(result.status, 0, `mutation ${index}: ${result.stdout}`);
    assert.deepEqual([f.recipePath, f.queuePath, bodyPath].map((p) => readFileSync(p)), before);
    assert.equal(existsSync(join(f.root, 'editorial/articles', slug)), false);
  }
});

test('le calendrier conserve la Cicatrice publiée aux dates cadrées, même après expiration', (t) => {
  const f = fixture(t);
  for (const day of ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04']) {
    const article = `---\nbrouillon: false\ndatePublication: ${day}\nfamille: ia-generative-agents\nformat: thought-leadership\nprimaryQuery: pourquoi des tests verts peuvent manquer des défauts\ntitre: Pourquoi des tests verts manquent des défauts : la règle des trois passes\n---\n`;
    writeFileSync(join(f.root, 'src/content/blog', `${slug}.md`), article);
    writeFileSync(f.clock, JSON.stringify('2026-10-05'));
    f.edition();
    const plan = readFileSync(join(f.planDir, 'cluster-plan.json'), 'utf8');
    assert.match(plan, new RegExp(`"date": "${day}"`));
    assert.match(plan, new RegExp(slug));
    // Le doublon est refusé même pendant la fenêtre, calendrier frais :
    // le refus ne doit pas seulement provenir de l'expiration du reçu.
    writeFileSync(f.clock, JSON.stringify(day));
    writeFileSync(f.recipePath, JSON.stringify({ ...f.recipe, date: day }));
    f.edition();
    const duplicate = f.slot(slug, day);
    assert.notEqual(duplicate.status, 0, duplicate.stdout);
    assert.match(duplicate.stderr, /déjà publiée/);
    writeFileSync(f.clock, JSON.stringify('2026-10-05'));
    f.edition();
    // L'archive ne renouvelle pas le droit de préparer une seconde publication.
    assert.notEqual(f.slot(slug, '2026-10-05').status, 0);
  }
});
