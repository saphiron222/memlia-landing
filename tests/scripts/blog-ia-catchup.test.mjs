import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { verifierPlafonds } from '../../scripts/lib/blog-pipeline.mjs';

const root = resolve(import.meta.dirname, '../..');
const path = 'docs/strategy/site-v3/rattrapage-ia-2026-10-05.json';
const slug = 'automatiser-avec-ia-sans-changer-logiciel';
const actifs = [
  { slug: 'utiliser-chatgpt-cabinet-comptable', date: '2026-10-04' },
  { slug: 'verifier-reponse-ia-comptabilite', date: '2026-10-05' },
  { slug: 'ia-comptabilite-confidentialite-donnees', date: '2026-10-05' },
];

test('le troisième article réel du 05/10 appartient uniquement au lot IA W40', () => {
  assert.doesNotThrow(() => verifierPlafonds(actifs, '2026-10-05', { root, slug }));
  assert.throws(() => verifierPlafonds(actifs, '2026-10-05', { root, slug: 'autre-sujet' }));
  assert.throws(() => verifierPlafonds(actifs, '2026-10-06', { root, slug }));
  assert.throws(() => verifierPlafonds(actifs, '2026-10-05', { root, slug, serie: 'cicatrices' }));
  assert.throws(() => verifierPlafonds([...actifs, { slug: 'autre-sujet', date: '2026-10-05' }], '2026-10-05', { root, slug }));
});

test('le lot ne consomme pas les quatre nouveaux sujets W41, mais conserve le quota réel du jour', () => {
  const lot = [...actifs, { slug, date: '2026-10-05' }];
  const nouveaux = [6, 7, 8].map((day) => ({ slug: `nouveau-${day}`, date: `2026-10-0${day}` }));
  assert.doesNotThrow(() => verifierPlafonds([...lot, ...nouveaux], '2026-10-08', { root, slug: 'nouveau-4' }));
  assert.throws(() => verifierPlafonds([...lot, ...nouveaux, { slug: 'nouveau-4', date: '2026-10-08' }], '2026-10-09', { root, slug: 'nouveau-5' }));
  assert.throws(() => verifierPlafonds(lot, '2026-10-05', { root, slug: 'nouveau-1' }));
  assert.doesNotThrow(() => verifierPlafonds([...actifs, { slug: 'logiciel-ia-comptabilite', date: '2026-09-29' }, { slug: 'prompt-chatgpt-expert-comptable', date: '2026-09-29' }], '2026-10-05', { root, slug }));
  assert.throws(() => verifierPlafonds(lot, '2026-10-05', { root, slug }));
});

test('règle absente ou élargie : refus du lot, pas ouverture de cadence', () => {
  const tmp = mkdtempSync(join(process.env.TMPDIR || tmpdir(), 'catchup-test-'));
  try {
    assert.throws(() => verifierPlafonds(actifs, '2026-10-05', { root: tmp, slug }));
    const rule = JSON.parse(readFileSync(join(root, path)));
    mkdirSync(join(tmp, 'docs/strategy/site-v3'), { recursive: true });
    for (const mutate of [
      (r) => { r.publications['autre-sujet'] = '2026-10-05'; },
      (r) => { r.publications[slug] = '2026-10-06'; },
      (r) => { r.maximumParJour = 4; },
      (r) => { r.semaineEditoriale = '2026-W41'; },
    ]) {
      const mutant = structuredClone(rule); mutate(mutant);
      writeFileSync(join(tmp, path), JSON.stringify(mutant));
      assert.throws(() => verifierPlafonds(actifs, '2026-10-05', { root: tmp, slug }));
    }
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});
