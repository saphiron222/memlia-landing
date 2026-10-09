import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const planner = fileURLToPath(new URL('../../docs/strategy/site-v3/build-cluster-plan.py', import.meta.url));
const article = (date, draft, title = 'Titre intégré') => `---\ntitre: "${title}"\ndatePublication: ${date}\nbrouillon: ${draft}\nfamille: saisie-pieces\nformat: how-to-guide\nprimaryQuery: relance pieces\n---\nCorps fictif.\n`;
function git(root, ...args) {
  const result = spawnSync('git', ['-C', root, ...args], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'memlia-publication-baseline-'));
  const blog = join(root, 'src/content/blog');
  mkdirSync(blog, { recursive: true });
  git(root, 'init', '--initial-branch=main');
  git(root, 'config', 'user.name', 'Fixture');
  git(root, 'config', 'user.email', 'fixture@example.invalid');
  writeFileSync(join(blog, 'pilier.md'), article('2026-09-21', false));
  writeFileSync(join(blog, 'brouillon-main.md'), article('2026-10-02', true));
  git(root, 'add', '--', 'src');
  git(root, 'commit', '-m', 'Fixture publiée');
  const base = git(root, 'rev-parse', 'HEAD');
  git(root, 'update-ref', 'refs/remotes/origin/main', base);
  git(root, 'switch', '-c', 'fixture-candidate');
  return { root, blog, base };
}
function state(root) {
  return spawnSync('python3', ['-B', '-c', `
import importlib.util, json, sys
from pathlib import Path
from datetime import date
spec = importlib.util.spec_from_file_location('planner', sys.argv[1])
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
module.RACINE = Path(sys.argv[2]); module.BLOG = module.RACINE/'src/content/blog'
published = module.etat_publie()
if 'pilier' in published:
    module.verifier_creneau('pilier', date(2026, 10, 2), ({}, {}, published, {}, [], [], {}))
print(json.dumps(published))
`, planner, root], { encoding: 'utf8' });
}

test('la préparation répétée conserve seulement la publication intégrée, sans publier le candidat', () => {
  const { root, blog, base } = fixture();
  try {
    const candidate = article('2026-09-21', true, 'Titre candidat non revu');
    writeFileSync(join(blog, 'pilier.md'), candidate);
    writeFileSync(join(blog, 'nouveau.md'), article('2026-10-02', true));
    for (let pass = 0; pass < 2; pass++) {
      const result = state(root);
      assert.equal(result.status, 0, result.stderr);
      assert.deepEqual(Object.keys(JSON.parse(result.stdout)), ['pilier']);
      assert.equal(JSON.parse(result.stdout).pilier.titre, 'Titre intégré');
      assert.equal(JSON.parse(result.stdout).pilier.date, '2026-09-21');
      assert.equal(readFileSync(join(blog, 'pilier.md'), 'utf8'), candidate);
      assert.equal(git(root, 'rev-parse', 'refs/remotes/origin/main'), base);
    }
    // A commit in the feature branch is not an integrated publication.
    git(root, 'add', '--', 'src');
    git(root, 'commit', '-m', 'Brouillons candidats');
    const committed = state(root);
    assert.equal(committed.status, 0, committed.stderr);
    assert.deepEqual(Object.keys(JSON.parse(committed.stdout)), ['pilier']);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('une date historique modifiée ou une base Git absente ne crée pas une autorité de republication', () => {
  const { root, blog } = fixture();
  try {
    for (const draft of [true, false]) {
      writeFileSync(join(blog, 'pilier.md'), article('2026-10-02', draft));
      const result = state(root);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /date de publication historique/i);
    }
    writeFileSync(join(blog, 'pilier.md'), article('2026-09-21', true));
    git(root, 'update-ref', '-d', 'refs/remotes/origin/main');
    const missing = state(root);
    assert.notEqual(missing.status, 0);
    assert.match(missing.stderr, /base.*origin\/main/i);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('go-production local ne devient une publication qu’après intégration dans main', () => {
  const { root, blog } = fixture();
  const slug = 'tests-verts-et-regle-des-trois-passes';
  try {
    for (const status of ['pret-preview', 'go-production', 'publie']) {
      writeFileSync(join(blog, `${slug}.md`), article('2026-10-02', status === 'pret-preview')
        .replace('---\nCorps', `statutEditorial: ${status}\n---\nCorps`));
      const result = state(root);
      assert.equal(result.status, 0, result.stderr);
      assert.equal(JSON.parse(result.stdout)[slug], undefined, status);
    }
    git(root, 'add', '--', 'src');
    git(root, 'commit', '-m', 'Publication candidate');
    assert.equal(JSON.parse(state(root).stdout)[slug], undefined, 'un commit de branche ne suffit pas');
    git(root, 'update-ref', 'refs/remotes/origin/main', git(root, 'rev-parse', 'HEAD'));
    const integrated = state(root);
    assert.equal(integrated.status, 0, integrated.stderr);
    assert.equal(JSON.parse(integrated.stdout)[slug].date, '2026-10-02');
    const duplicate = spawnSync('python3', ['-B', '-c', `
import importlib.util, sys
from pathlib import Path
from datetime import date
spec = importlib.util.spec_from_file_location('planner', sys.argv[1])
p = importlib.util.module_from_spec(spec); spec.loader.exec_module(p)
p.RACINE = Path(sys.argv[2]); p.BLOG = p.RACINE/'src/content/blog'
p.verifier_creneau(sys.argv[3], date(2026, 10, 2), ({}, {}, p.etat_publie(), {}, [], [], {}))
`, planner, root, slug], { encoding: 'utf8' });
    assert.notEqual(duplicate.status, 0);
    assert.match(duplicate.stderr, /déjà publiée/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

// main avance après la création de la branche candidate : une autre PR a été fusionnée entre-temps.
function avancerMain(root, slug) {
  git(root, 'switch', 'main');
  writeFileSync(join(root, 'src/content/blog', `${slug}.md`), article('2026-10-03', false, 'Publié après la fourche'));
  // Brouillon chez le candidat, publié sur main après la fourche : lu à la pointe, il apparaîtrait.
  writeFileSync(join(root, 'src/content/blog/brouillon-main.md'), article('2026-10-02', false));
  git(root, 'add', '--', 'src');
  git(root, 'commit', '-m', 'Publication fusionnée après la fourche');
  const tip = git(root, 'rev-parse', 'HEAD');
  git(root, 'update-ref', 'refs/remotes/origin/main', tip);
  git(root, 'switch', 'fixture-candidate');
  return tip;
}

test('une PR en retard sur main qui ne touche pas au calendrier lit la publication à sa fourche', () => {
  const { root } = fixture();
  try {
    mkdirSync(join(root, 'src/pages'), { recursive: true });
    writeFileSync(join(root, 'src/pages/pied.astro'), '<footer>pied</footer>\n');
    git(root, 'add', '--', 'src');
    git(root, 'commit', '-m', 'Changement hors calendrier');
    avancerMain(root, 'publie-apres-fourche');
    const result = state(root);
    assert.equal(result.status, 0, result.stderr);
    // La fourche fait foi : l'article fusionné après elle n'est pas dans le candidat.
    assert.deepEqual(Object.keys(JSON.parse(result.stdout)), ['pilier']);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('une PR en retard sur main qui touche au calendrier doit intégrer main', () => {
  const changeurs = {
    'nouvel article': (root) => writeFileSync(join(root, 'src/content/blog/nouveau.md'), article('2026-10-05', true)),
    'backlog': (root) => {
      mkdirSync(join(root, 'docs/strategy/site-v3'), { recursive: true });
      writeFileSync(join(root, 'docs/strategy/site-v3/backlog-v3.json'), '[]\n');
    },
    'article suivi modifié': (root) => writeFileSync(join(root, 'src/content/blog/pilier.md'), article('2026-09-21', false, 'Titre modifié')),
    'article suivi supprimé': (root) => rmSync(join(root, 'src/content/blog/pilier.md')),
  };
  for (const [nom, changer] of Object.entries(changeurs)) {
    for (const mode of ['commit', 'index', 'arbre']) {
      const { root } = fixture();
      try {
        avancerMain(root, 'publie-apres-fourche');
        changer(root);
        if (mode !== 'arbre') git(root, 'add', '-A');
        if (mode === 'commit') git(root, 'commit', '-m', 'Changement du calendrier sur une base en retard');
        const result = state(root);
        assert.notEqual(result.status, 0, `${nom} (${mode}) : un candidat du calendrier en retard doit être refusé`);
        assert.match(result.stderr, /non intégrée au candidat : le calendrier est modifié/);
      } finally { rmSync(root, { recursive: true, force: true }); }
    }
  }
});

test('un calendrier candidat accepte main avancé hors publication sans lire ses brouillons candidats', () => {
  for (const mode of ['commit', 'index', 'arbre']) {
    const { root, blog, base } = fixture();
    try {
      git(root, 'switch', 'main');
      writeFileSync(join(root, 'GUIDE-FORGE.md'), 'Documentation sans effet calendrier.\n');
      git(root, 'add', '-A');
      git(root, 'commit', '-m', 'Documentation indépendante');
      const tip = git(root, 'rev-parse', 'HEAD');
      git(root, 'update-ref', 'refs/remotes/origin/main', tip);
      git(root, 'switch', 'fixture-candidate');
      const candidate = article('2026-09-21', true, 'Titre candidat non publié');
      writeFileSync(join(blog, 'pilier.md'), candidate);
      writeFileSync(join(blog, 'nouveau.md'), article('2026-10-05', false));
      if (mode !== 'arbre') git(root, 'add', '-A');
      if (mode === 'commit') git(root, 'commit', '-m', 'Calendrier candidat');
      const before = git(root, 'status', '--porcelain');
      const result = state(root);
      assert.equal(result.status, 0, `${mode}: ${result.stderr}`);
      assert.deepEqual(Object.keys(JSON.parse(result.stdout)), ['pilier']);
      assert.equal(JSON.parse(result.stdout).pilier.titre, 'Titre intégré');
      assert.equal(git(root, 'merge-base', tip, 'HEAD'), base);
      assert.equal(git(root, 'status', '--porcelain'), before);
      assert.equal(readFileSync(join(blog, 'pilier.md'), 'utf8'), candidate);
    } finally { rmSync(root, { recursive: true, force: true }); }
  }
});

test('les entrées concurrentes réellement lues bloquent un calendrier candidat sans écriture', () => {
  const paths = [
    'src/data/familles.ts', 'src/content.config.ts',
    'docs/strategy/site-v3/backlog-v3.json',
    'docs/strategy/site-v3/rattrapage-ia-2026-10-05.json',
    'docs/strategy/site-v3/mesures/questions-2026-09-19.json',
    'docs/strategy/site-v3/mesures/titres-intent-2026-09-21.json',
    'docs/strategy/site-v3/mesures/autocompletion-cache.json',
    'docs/strategy/site-v3/build-cluster-plan.py',
    'scripts/lib/blog-ia-catchup.mjs',
  ];
  for (const path of paths) {
    const { root, blog } = fixture();
    try {
      git(root, 'switch', 'main');
      mkdirSync(join(root, path, '..'), { recursive: true });
      writeFileSync(join(root, path), 'Entrée concurrente\n');
      git(root, 'add', '-A');
      git(root, 'commit', '-m', 'Entrée de publication concurrente');
      git(root, 'update-ref', 'refs/remotes/origin/main', git(root, 'rev-parse', 'HEAD'));
      git(root, 'switch', 'fixture-candidate');
      const candidate = article('2026-10-05', true);
      writeFileSync(join(blog, 'nouveau.md'), candidate);
      const before = git(root, 'status', '--porcelain');
      const result = state(root);
      assert.notEqual(result.status, 0, path);
      assert.match(result.stderr, /non intégrée au candidat : le calendrier est modifié/);
      assert.equal(git(root, 'status', '--porcelain'), before);
      assert.equal(readFileSync(join(blog, 'nouveau.md'), 'utf8'), candidate);
    } finally { rmSync(root, { recursive: true, force: true }); }
  }
});

test('un checkout CI partiel refuse la base manquante ; récupérer son historique conserve le candidat exact', () => {
  const { root, blog, base } = fixture();
  const cloneParent = mkdtempSync(join(tmpdir(), 'memlia-publication-checkout-'));
  const clone = join(cloneParent, 'candidate');
  try {
    const candidate = article('2026-09-21', true, 'Titre candidat non revu');
    writeFileSync(join(blog, 'pilier.md'), candidate);
    git(root, 'add', '--', 'src');
    git(root, 'commit', '-m', 'Candidat CI non publié');
    const head = git(root, 'rev-parse', 'HEAD');
    git(cloneParent, 'clone', '--depth=1', '--single-branch', '--branch=fixture-candidate',
      `file://${root}`, clone);
    assert.equal(git(clone, 'rev-parse', 'HEAD'), head);
    const shallow = state(clone);
    assert.notEqual(shallow.status, 0);
    assert.match(shallow.stderr, /base.*origin\/main/i);

    // Full history and branch refs, as required by checkout fetch-depth: 0.
    git(clone, 'fetch', '--unshallow', 'origin', '+refs/heads/*:refs/remotes/origin/*');
    const complete = state(clone);
    assert.equal(complete.status, 0, complete.stderr);
    assert.deepEqual(Object.keys(JSON.parse(complete.stdout)), ['pilier']);
    assert.equal(JSON.parse(complete.stdout).pilier.titre, 'Titre intégré');
    assert.equal(JSON.parse(complete.stdout).pilier.date, '2026-09-21');
    assert.equal(git(clone, 'rev-parse', 'HEAD'), head);
    assert.equal(git(clone, 'rev-parse', 'refs/remotes/origin/main'), base);
    assert.equal(readFileSync(join(clone, 'src/content/blog/pilier.md'), 'utf8'), candidate);
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(cloneParent, { recursive: true, force: true });
  }
});
