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
