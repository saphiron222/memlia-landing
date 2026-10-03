import { REVIEW_CRITERIA } from './blog-pipeline.mjs';
import { IMAGE_REVIEW_CRITERIA } from '../blog-forge.mjs';

const sameSubject = (left, right) => ['slug', 'bodySha256', 'recipeSha256', 'renderedSha256']
  .every((key) => typeof right?.[key] === 'string' && right[key] === left?.[key]);
const identity = (value) => typeof value === 'string' && value.trim().length > 2;

function criteria(rows, ids) {
  if (!Array.isArray(rows) || rows.length !== ids.length || new Set(rows.map((row) => row.id)).size !== ids.length) {
    throw new Error('Grille indépendante incomplète ou dupliquée.');
  }
  return Object.fromEntries(ids.map((id) => {
    const row = rows.find((item) => item.id === id);
    if (row?.result !== 'PASS' || !Array.isArray(row.observations) || !row.observations.length
      || row.observations.some((text) => typeof text !== 'string' || text.length < 12)) {
      throw new Error(`Critère indépendant non approuvé : ${id}.`);
    }
    return [id, { result: row.result, observations: [...row.observations] }];
  }));
}

/** Projection de matrices indépendantes : copie les constats, ne produit aucun jugement. */
export function projectReviews({ qa, business, subject }) {
  if (qa?.verdict !== 'PASS' || qa.independent_qa_pass !== true || qa.browser_verified !== true
    || !Array.isArray(qa.p0) || qa.p0.length || !identity(qa.reviewer)
    || !qa.subjects?.some((item) => sameSubject(item, subject))) {
    throw new Error('Avis QA absent, non approuvé ou sujet divergent.');
  }
  if (!['PASS', 'PASS AVEC RÉSERVES'].includes(business?.verdict) || business.aiReview !== 'AI_REVIEW_PASS'
    || !identity(business.reviewer) || !sameSubject(business.candidate?.subject, subject)) {
    throw new Error('Avis métier absent, non approuvé ou sujet hors portée.');
  }
  const reviewedClaims = business.claims?.filter((row) => row.forgeClaimId) ?? [];
  if (!reviewedClaims.length || new Set(reviewedClaims.map((row) => row.forgeClaimId)).size !== reviewedClaims.length
    || reviewedClaims.some((row) => row.verdict !== 'PASS' || row.forgeVerdict !== 'soutient'
      || typeof row.reason !== 'string' || row.reason.length < 40)) {
    throw new Error('Verdicts métier forge absents ou non approuvés.');
  }
  return {
    subject: { ...subject },
    editorial: { reviewer: qa.reviewer, criteria: criteria(qa.editorial_criteria, REVIEW_CRITERIA.map(({ id }) => id)), p0: [...qa.p0] },
    business: { reviewerId: business.reviewer, claims: Object.fromEntries(reviewedClaims.map((row) => [row.forgeClaimId, { verdict: row.forgeVerdict, reasoning: row.reason }])) },
    image: { criteria: criteria(qa.visual_criteria, IMAGE_REVIEW_CRITERIA) },
    sources: { reviewedBy: business.reviewer },
    provenance: { qaTask: qa.task_id, businessReviewer: business.reviewer, qaDate: qa.review_date_paris, businessDate: business.reviewDateParis },
  };
}
