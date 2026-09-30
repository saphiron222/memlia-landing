import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifierPlafonds, validateDossier } from '../../scripts/lib/blog-pipeline.mjs';
import { materialiser } from '../../scripts/blog-forge.mjs';

const slug = 'tests-verts-et-regle-des-trois-passes';
const framingPath = 'docs/strategy/site-v3/w39-cadrage-operateur.json';
const signedBody = readFileSync(new URL('../fixtures/w39-signed-body.md', import.meta.url));
const receipt = {
  version: 1, kind: 'w39-operator-framing', owner: 'default',
  operatorTask: 't_73628f94', preparationTask: 't_f94d562f', slug,
  editorialWeek: '2026-W39',
  signedBodySha256: '76ffb89670b44fa9acecc86b709546f3044b10e8bf3e9288a1b0e9e0fa5e5e3b',
  timezone: 'Europe/Paris', validFrom: '2026-10-01', validThrough: '2026-10-04', maxPublications: 1,
  authorityReferences: [
    'docs/MEMLIA-BLOG-RATTRAPAGE-W39-2026-09-27.md §1/Clarification (Kevin 27/09/2026)',
    'AGENTS.md §Corriger les erreurs systémiques (Kevin 28/09/2026)',
    'AGENTS.md:204-221 §Publication autonome du blog (Kevin 29/09/2026)',
  ],
};
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'memlia-w39-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const recipeDir = join(root, 'editorial/recettes', slug);
  mkdirSync(recipeDir, { recursive: true });
  mkdirSync(join(root, 'docs/strategy/site-v3'), { recursive: true });
  writeFileSync(join(recipeDir, 'corps.md'), signedBody);
  const committedReceipt = JSON.parse(readFileSync(new URL('../../docs/strategy/site-v3/w39-cadrage-operateur.json', import.meta.url)));
  assert.deepEqual(committedReceipt, receipt, 'le reçu effectivement livré correspond au contrat opérateur');
  writeFileSync(join(root, framingPath), JSON.stringify(committedReceipt));
  return root;
}

test('W39: seul le reçu exact et le corps brut signé ouvrent la fenêtre, sans doublon ni reconduction', (t) => {
  const root = fixture(t);
  const options = { root, serie: 'cicatrices', slug, now: new Date('2026-10-01T00:00:00Z') };
  for (const date of ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04']) {
    assert.doesNotThrow(() => verifierPlafonds([], date, options));
    for (const previous of [
      { serie: 'cicatrices', date: '2026-09-26', slug: 'autre' },
      { serie: 'cicatrices', date: '2026-09-29', slug },
      { serie: 'cicatrices', date: '2026-10-04', slug },
      { serie: 'cicatrices', date: '2026-10-10', slug },
      { date: '2026-10-01', slug },
    ]) assert.throws(() => verifierPlafonds([previous], date, options), /déjà planifiée/);
  }
  for (const date of ['2026-09-30', '2026-10-05', '2026-10-10', '2026-10-01suffix', '2026-09-28suffix']) {
    assert.throws(() => verifierPlafonds([], date, options));
  }
  for (const now of ['2026-09-30T21:59:59Z', '2026-10-04T22:00:00Z']) {
    assert.throws(() => verifierPlafonds([], '2026-10-01', { ...options, now: new Date(now) }));
  }
  assert.doesNotThrow(() => verifierPlafonds([], '2026-10-04', { ...options, now: new Date('2026-10-04T21:59:59Z') }));
  for (const [key, value] of Object.entries({
    version: 2, kind: 'qa-pass', owner: 'marketing', operatorTask: 't_a399cb4c',
    preparationTask: 't_other', slug: 'autre', editorialWeek: '2026-W40',
    signedBodySha256: '0'.repeat(64), timezone: 'UTC', validFrom: '2026-09-30',
    validThrough: '2026-10-10', maxPublications: 2, authorityReferences: ['QA PASS'],
  })) {
    writeFileSync(join(root, framingPath), JSON.stringify({ ...receipt, [key]: value }));
    assert.throws(() => verifierPlafonds([], '2026-10-01', options), undefined, key);
  }
  for (const value of [null, true, [], {}, { ...receipt, qaPass: true }]) {
    writeFileSync(join(root, framingPath), JSON.stringify(value));
    assert.throws(() => verifierPlafonds([], '2026-10-01', options));
  }
  writeFileSync(join(root, framingPath), '{');
  assert.throws(() => verifierPlafonds([], '2026-10-01', options));
  rmSync(join(root, framingPath));
  assert.throws(() => verifierPlafonds([], '2026-10-01', options));
  assert.throws(() => verifierPlafonds([], '2026-10-01', { serie: 'cicatrices', slug, rattrapage: true }));
  writeFileSync(join(root, framingPath), JSON.stringify(receipt));
  writeFileSync(join(root, 'editorial/recettes', slug, 'corps.md'), Buffer.concat([signedBody, Buffer.from('\n')]));
  assert.throws(() => verifierPlafonds([], '2026-10-01', options));
  // Même une mutation que trim() effacerait doit fermer le cadrage.
  writeFileSync(join(root, 'editorial/recettes', slug, 'corps.md'), signedBody);
  assert.doesNotThrow(() => verifierPlafonds([], '2026-10-03', { ...options, slug: 'autre' }));
  assert.throws(() => verifierPlafonds([], '2026-10-01', { ...options, slug: 'autre' }), /samedi/);
  assert.throws(() => verifierPlafonds([{ serie: 'cicatrices', slug, date: '2026-10-01' }], '2026-09-26', { serie: 'cicatrices', slug: 'autre' }), /déjà planifiée.*2026-W39/);
  assert.doesNotThrow(() => verifierPlafonds([{ serie: 'cicatrices', slug, date: '2026-10-01' }], '2026-10-03', { serie: 'cicatrices', slug: 'autre' }));
});

test('la forge refuse le cadrage W39 avant écriture ou réseau, même sur une entrée de même date déjà publique', async (t) => {
  const root = fixture(t);
  const recipeDir = join(root, 'editorial/recettes', slug);
  const queuePath = join(root, 'editorial/queue.json');
  writeFileSync(join(recipeDir, 'recette.json'), JSON.stringify({ slug, serie: 'cicatrices', date: '2026-10-01' }));
  let fetched = false;
  const fetcher = () => { fetched = true; throw new Error('réseau interdit'); };
  for (const status of ['a-valider', 'go-production', 'publie']) {
    writeFileSync(queuePath, JSON.stringify({ version: 1, candidates: [{ slug, serie: 'cicatrices', date: '2026-10-01', status: 'publie' }] }));
    const before = readFileSync(queuePath);
    await assert.rejects(materialiser({ root, slug, statut: status, fetcher }), /déjà planifiée|déjà publi/);
    assert.deepEqual(readFileSync(queuePath), before);
    assert.equal(existsSync(join(root, 'editorial/articles', slug)), false);
    assert.equal(fetched, false);
  }
  writeFileSync(queuePath, JSON.stringify({ version: 1, candidates: [] }));
  rmSync(join(root, framingPath));
  await assert.rejects(materialiser({ root, slug, statut: 'a-valider', fetcher }), /cadrage/);
  assert.equal(existsSync(join(root, 'editorial/articles', slug)), false);
  assert.equal(fetched, false);
  // Un gate appelé directement ne doit pas éviter le contrôle de cadrage de la forge.
  for (const gateMode of ['protected-preview', 'production']) {
    const gate = await validateDossier({ root, slug, gateMode });
    assert.equal(gate.pass, false);
    assert.ok(gate.errors.some((error) => error.startsWith('Cadrage W39 :')), gate.errors.join('\n'));
  }
});
