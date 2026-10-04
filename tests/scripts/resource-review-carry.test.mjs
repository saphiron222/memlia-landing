import assert from 'node:assert/strict';
import test from 'node:test';
import { carryResourceReview } from '../../scripts/lib/resource-review-carry.mjs';

test('le report conserve la campagne de revue et ses verdicts récents, même en FAIL', () => {
  for (const status of ['AI_REVIEW_PASS', 'FAIL']) {
    const precedent = {
      claimsEvidence: {
        sensitiveMatter: {
          checkedAt: '2026-10-04T18:00:00+02:00',
          businessReview: {
            status,
            reviewedCandidateHash: 'ancien-sujet-non-reaffirme',
            claimSourceVerdicts: [
              { claimId: 'claim-a', checkedAt: '2026-10-04T17:00:00+02:00', verdict: 'soutient' },
              { claimId: 'claim-b', checkedAt: '2026-10-04T17:30:00+02:00', verdict: 'soutient' },
            ],
          },
        },
      },
      quality: { p0: ['defaut-p0'], p1: ['defaut-p1'], blocking: true },
    };
    const avant = structuredClone(precedent);
    const report = carryResourceReview(precedent);
    assert.equal(report.checkedAt, precedent.claimsEvidence.sensitiveMatter.checkedAt);
    assert.ok(report.revue.claimSourceVerdicts.every((verdict) => Date.parse(verdict.checkedAt) <= Date.parse(report.checkedAt)), 'aucun verdict ne devient postérieur à sa campagne');
    assert.deepEqual(report.revue, precedent.claimsEvidence.sensitiveMatter.businessReview);
    assert.deepEqual([report.p0, report.p1, report.blocking], [precedent.quality.p0, precedent.quality.p1, true]);
    report.revue.claimSourceVerdicts[0].verdict = 'modifie';
    report.p0.push('autre');
    report.p1.push('autre');
    assert.deepEqual(precedent, avant, 'le report ne mute pas la revue précédente');
  }
});

test('le report ne fabrique ni revue ni date de campagne manquante', () => {
  assert.equal(carryResourceReview(undefined), null);
  assert.equal(carryResourceReview({ claimsEvidence: { sensitiveMatter: { businessReview: { status: 'PENDING' } } } }), null);
  const sansDate = carryResourceReview({ claimsEvidence: { sensitiveMatter: { businessReview: { status: 'AI_REVIEW_PASS' } } } });
  assert.equal(sansDate.checkedAt, undefined, 'une campagne invalide reste invalide pour le validateur');
});
