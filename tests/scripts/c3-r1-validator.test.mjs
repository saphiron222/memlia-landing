import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { validateC3R1 } from '../../scripts/validate-c3-r1.mjs';

const REPOSITORY_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const RELATIVE_FILES = [
  'docs/strategy/site-v3/POLE-FACTURATION-ELECTRONIQUE.md',
  'docs/strategy/site-v3/METHODE-FENETRES-REGLEMENTAIRES.md',
  'docs/strategy/site-v3/mesures/facturation-electronique-2026-09-20.json',
];
const MEASURE_PATH = RELATIVE_FILES[2];

function candidateFixture() {
  const root = mkdtempSync(join(tmpdir(), 'memlia-c3-r1-'));
  for (const relativePath of RELATIVE_FILES) {
    const target = join(root, relativePath);
    mkdirSync(dirname(target), { recursive: true });
    cpSync(join(REPOSITORY_ROOT, relativePath), target);
  }
  return root;
}

function mutateMeasure(root, mutate) {
  const path = join(root, MEASURE_PATH);
  const measure = JSON.parse(readFileSync(path, 'utf8'));
  mutate(measure);
  writeFileSync(path, `${JSON.stringify(measure, null, 2)}\n`);
}

function claim(measure, id) {
  return measure.review.claims.find((entry) => entry.id === id);
}

test('C3-R1 exécute les trois témoins rouges avant le candidat nominal vert', async (t) => {
  await t.test('ROUGE — FE-05 contredit ne peut pas rester publiable', () => {
    const root = candidateFixture();
    try {
      mutateMeasure(root, (measure) => {
        claim(measure, 'FE-05').verdict = 'CONTREDIT';
        measure.review.candidateCounts.SOUTIENT = 2;
      });
      assert.throws(
        () => validateC3R1({ root }),
        /FE-05: verdict CONTREDIT requires publicationEligible=false/,
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  await t.test('ROUGE — FE-06 sans condition de portée est refusé', () => {
    const root = candidateFixture();
    try {
      mutateMeasure(root, (measure) => {
        delete claim(measure, 'FE-06').condition;
      });
      assert.throws(
        () => validateC3R1({ root }),
        /FE-06: publication condition is required/,
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  await t.test('ROUGE — FE-03 ne rouvre pas sur un snapshot DILA non réconcilié', () => {
    const root = candidateFixture();
    try {
      mutateMeasure(root, (measure) => {
        const fe03 = claim(measure, 'FE-03');
        fe03.verdict = 'SOUTIENT';
        fe03.severity = null;
        fe03.publicationEligible = true;
        measure.review.candidateCounts.SOUTIENT = 4;
        measure.review.candidateCounts.SOURCE_INACCESSIBLE = 2;
        measure.review.candidateCounts.publicationEligible = 4;
        measure.review.candidateCounts.publicationIneligible = 2;
      });
      assert.throws(
        () => validateC3R1({ root }),
        /FE-03: unreconciled current state must remain SOURCE_INACCESSIBLE P1 and non-publishable/,
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  await t.test('VERT — le candidat exact reste à 6/6, 3 soutiens et 3 fermés', () => {
    const result = validateC3R1({ root: REPOSITORY_ROOT });
    assert.equal(result.pass, true);
    assert.equal(result.claims, 6);
    assert.equal(result.verdicts.SOUTIENT, 3);
    assert.equal(result.verdicts.SOURCE_INACCESSIBLE, 3);
    assert.equal(result.publicationEligible, 3);
    assert.equal(result.publicationIneligible, 3);
    assert.equal(result.aiReviewPass, false);
  });
});
