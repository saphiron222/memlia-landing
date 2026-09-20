#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const EXPECTED_IDS = ['FE-01', 'FE-02', 'FE-03', 'FE-04', 'FE-05', 'FE-06'];
const ALLOWED_VERDICTS = new Set([
  'SOUTIENT',
  'SOUTIENT_PARTIELLEMENT',
  'CONTREDIT',
  'HORS_SUJET',
  'SOURCE_INACCESSIBLE',
]);
const REQUIRED_CONDITION_FRAGMENTS = {
  'FE-04': [
    'Link the live DGFiP page',
    'do not copy the list',
    'distinguish definitive approval from pending interoperability tests',
  ],
  'FE-05': [
    'explicit attribution to Service-Public',
    'do not describe the procedure as an exhaustive legal obligation',
  ],
  'FE-06': [
    'structure present in the directory',
    'do not add an exclusion not displayed by the current AIFE interface',
  ],
};
const SEAL_PATH = 'docs/strategy/site-v3/mesures/facturation-electronique-c3-r1-seal.json';
const CANDIDATE_PATHS = {
  pole: 'docs/strategy/site-v3/POLE-FACTURATION-ELECTRONIQUE.md',
  method: 'docs/strategy/site-v3/METHODE-FENETRES-REGLEMENTAIRES.md',
  measure: 'docs/strategy/site-v3/mesures/facturation-electronique-2026-09-20.json',
};
const ALLOWED_KEYS = {
  top: ['version', 'measuredAt', 'market', 'instruments', 'coverage', 'costsUsd', 'volumeSignals', 'autocomplete', 'serpSignals', 'serpOverlap', 'pagePlan', 'excludedPages', 'sourceSnapshots', 'freshnessRule', 'review'],
  market: ['locationCode', 'languageCode', 'device'],
  instruments: ['autocomplete', 'serp', 'officialSources'],
  coverage: ['autocompleteProbes', 'autocompleteResponses', 'autocompleteFailures', 'probesWithSuggestions', 'probesWithoutSuggestions', 'newSerps', 'newSerpFailures'],
  costsUsd: ['newSerpsEstimated', 'newSerpsActual', 'gateStatus', 'c1InheritedTotal'],
  volumeSignal: ['query', 'monthlyAverageFrance', 'peak', 'latest', 'autocompleteCount', 'source', 'volumeStatus'],
  datedVolume: ['year', 'month', 'volume'],
  autocomplete: ['positive', 'zero'],
  autocompletePositive: ['query', 'count', 'collapsedTo', 'topSuggestion'],
  serpSignal: ['peopleAlsoAsk', 'topDomains', 'aiOverview'],
  serpOverlap: ['a', 'b', 'sharedTop10Urls', 'decision'],
  pagePlan: ['order', 'type', 'route', 'primaryQuery', 'signal', 'intent'],
  excludedPage: ['candidate', 'reason'],
  sourceSnapshot: ['id', 'url', 'sourceDate', 'sourceDateEvidence', 'consultedAt', 'httpStatus', 'sha256', 'rawBodySha256', 'previousManifestSha256', 'rawHashStatus', 'claimExcerptSha256', 'claimExcerpt', 'role', 'population', 'displayedExclusions', 'archiveSha256', 'xmlPath', 'xmlSha256', 'articleId', 'articleNumber', 'articleState', 'effectiveFrom', 'effectiveTo', 'applicabilityNote', 'freshnessReview', 'claimBearing', 'publicationEligible', 'dilaVersionEnd', 'contentVerifiedViaCanonical', 'contentVerified'],
  freshnessReview: ['reviewedAt', 'officialIndexLatestPackage', 'candidateReconciledThrough', 'currentStateReconciled', 'reason'],
  freshnessRule: ['prePublishTtlHours', 'primaryWatch', 'secondaryWatch', 'criticalFields', 'onCriticalChange', 'onFailure', 'silenceWithoutChange'],
  review: ['requiredProfile', 'status', 'claimSourcePairs', 'professionalAttestation', 'candidateCounts', 'legalTextStatus', 'aiReviewPass', 'claims'],
  candidateCounts: ['claims', 'SOUTIENT', 'SOUTIENT_PARTIELLEMENT', 'SOURCE_INACCESSIBLE', 'publicationEligible', 'publicationIneligible'],
  claim: ['id', 'statement', 'sourceIds', 'verdict', 'severity', 'publicationEligible', 'reason', 'condition'],
};

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const fail = (message) => { throw new Error(message); };

function assertExactKeys(value, allowedKeys, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${label}: expected object`);
  const allowed = new Set(allowedKeys);
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) fail(`${label}: unexpected field ${key}`);
  }
}

function assertNoPii(value, path = '$') {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertNoPii(entry, `${path}[${index}]`));
    return;
  }
  if (value && typeof value === 'object') {
    for (const [key, entry] of Object.entries(value)) {
      if (/(?:^|_)(?:client|customer|prospect|employee|person|name|nom|email|mail|phone|telephone|mobile)(?:$|_)/i.test(key)) {
        fail(`${path}.${key}: possible PII field is forbidden`);
      }
      assertNoPii(entry, `${path}.${key}`);
    }
    return;
  }
  if (typeof value === 'string' && /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(value)) {
    fail(`${path}: possible email address is forbidden`);
  }
}

function assertMeasureSchema(measure) {
  assertExactKeys(measure, ALLOWED_KEYS.top, 'measure');
  for (const key of ['market', 'instruments', 'coverage', 'costsUsd', 'autocomplete', 'freshnessRule', 'review']) {
    assertExactKeys(measure[key], ALLOWED_KEYS[key], key);
  }
  for (const [index, signal] of measure.volumeSignals.entries()) {
    assertExactKeys(signal, ALLOWED_KEYS.volumeSignal, `volumeSignals[${index}]`);
    for (const key of ['peak', 'latest']) {
      if (signal[key]) assertExactKeys(signal[key], ALLOWED_KEYS.datedVolume, `volumeSignals[${index}].${key}`);
    }
  }
  measure.autocomplete.positive.forEach((entry, index) => assertExactKeys(entry, ALLOWED_KEYS.autocompletePositive, `autocomplete.positive[${index}]`));
  for (const [key, entry] of Object.entries(measure.serpSignals)) assertExactKeys(entry, ALLOWED_KEYS.serpSignal, `serpSignals.${key}`);
  measure.serpOverlap.forEach((entry, index) => assertExactKeys(entry, ALLOWED_KEYS.serpOverlap, `serpOverlap[${index}]`));
  measure.pagePlan.forEach((entry, index) => assertExactKeys(entry, ALLOWED_KEYS.pagePlan, `pagePlan[${index}]`));
  measure.excludedPages.forEach((entry, index) => assertExactKeys(entry, ALLOWED_KEYS.excludedPage, `excludedPages[${index}]`));
  measure.sourceSnapshots.forEach((entry, index) => {
    assertExactKeys(entry, ALLOWED_KEYS.sourceSnapshot, `sourceSnapshots[${index}]`);
    if (entry.freshnessReview) assertExactKeys(entry.freshnessReview, ALLOWED_KEYS.freshnessReview, `sourceSnapshots[${index}].freshnessReview`);
  });
  assertExactKeys(measure.review.candidateCounts, ALLOWED_KEYS.candidateCounts, 'review.candidateCounts');
  measure.review.claims.forEach((entry, index) => assertExactKeys(entry, ALLOWED_KEYS.claim, `review.claims[${index}]`));
}

function claimById(claims, id) {
  return claims.find((claim) => claim.id === id);
}

function assertCondition(claim, fragments) {
  if (typeof claim.condition !== 'string' || claim.condition.trim() === '') {
    fail(`${claim.id}: publication condition is required`);
  }
  for (const fragment of fragments) {
    if (!claim.condition.includes(fragment)) fail(`${claim.id}: publication condition lost scope: ${fragment}`);
  }
}

function matrixRows(pole) {
  return new Map(
    pole
      .split('\n')
      .filter((line) => /^\| FE-0[1-6] \|/.test(line))
      .map((line) => {
        const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
        const statement = cells[1].replace(/^«\s*/, '').replace(/\s*»$/, '');
        return [cells[0], { statement, verdict: cells[3], publication: cells[4] }];
      }),
  );
}

export function validateC3R1({ root = process.cwd(), now = new Date() } = {}) {
  const paths = Object.fromEntries(
    Object.entries(CANDIDATE_PATHS).map(([id, relativePath]) => [id, `${root}/${relativePath}`]),
  );
  const bodies = Object.fromEntries(
    Object.entries(paths).map(([id, path]) => [id, readFileSync(path)]),
  );
  const measure = JSON.parse(bodies.measure.toString('utf8'));
  const seal = JSON.parse(readFileSync(`${root}/${SEAL_PATH}`, 'utf8'));
  assertNoPii(measure);
  for (const [id, body] of Object.entries(bodies)) assertNoPii(body.toString('utf8'), CANDIDATE_PATHS[id]);
  assertMeasureSchema(measure);
  const claims = measure.review?.claims ?? [];

  if (claims.length !== EXPECTED_IDS.length) fail(`expected 6 claims, got ${claims.length}`);
  if (JSON.stringify(claims.map((claim) => claim.id)) !== JSON.stringify(EXPECTED_IDS)) {
    fail('claim IDs or order differ');
  }

  for (const claim of claims) {
    if (!ALLOWED_VERDICTS.has(claim.verdict)) fail(`${claim.id}: invalid verdict ${claim.verdict}`);
    if (!Array.isArray(claim.sourceIds) || claim.sourceIds.length === 0) fail(`${claim.id}: no source`);
    const shouldBeEligible = claim.verdict === 'SOUTIENT';
    if (claim.publicationEligible !== shouldBeEligible) {
      fail(`${claim.id}: verdict ${claim.verdict} requires publicationEligible=${shouldBeEligible}`);
    }
  }

  if (!Array.isArray(measure.sourceSnapshots)) fail('sourceSnapshots must be an array');
  const sources = new Map(measure.sourceSnapshots.map((source) => [source.id, source]));
  for (const claim of claims) {
    for (const sourceId of claim.sourceIds) {
      if (!sources.has(sourceId)) fail(`${claim.id}: missing source ${sourceId}`);
    }
  }
  for (const sourceId of ['service-public-f39785', 'aife-annuaire', 'dila-legi-20260729-cgi-289-bis']) {
    const source = sources.get(sourceId);
    if (!source?.claimExcerpt || !source?.claimExcerptSha256) {
      fail(`${sourceId}: missing exact excerpt evidence`);
    }
    if (sha256(source.claimExcerpt) !== source.claimExcerptSha256) {
      fail(`${sourceId}: excerpt hash mismatch`);
    }
  }

  for (const id of ['FE-01', 'FE-02']) {
    const claim = claimById(claims, id);
    if (claim.verdict !== 'SOURCE_INACCESSIBLE' || claim.severity !== 'P1') {
      fail(`${id}: fail-closed state lost`);
    }
  }

  const fe03 = claimById(claims, 'FE-03');
  const dila = sources.get('dila-legi-20260729-cgi-289-bis');
  const historicalSnapshotLocked =
    dila?.articleState === 'ABROGE_DIFF'
    && dila?.freshnessReview?.officialIndexLatestPackage === 'LEGI_20260919-214658.tar.gz'
    && dila?.freshnessReview?.candidateReconciledThrough === '2026-07-29'
    && dila?.freshnessReview?.currentStateReconciled === false
    && dila?.claimBearing === false
    && dila?.publicationEligible === false;
  if (!historicalSnapshotLocked) fail('FE-03: historical DILA snapshot lock was changed');
  if (dila.freshnessReview.currentStateReconciled !== true) {
    if (fe03.verdict !== 'SOURCE_INACCESSIBLE' || fe03.severity !== 'P1' || fe03.publicationEligible !== false) {
      fail('FE-03: unreconciled current state must remain SOURCE_INACCESSIBLE P1 and non-publishable');
    }
  }

  for (const [id, fragments] of Object.entries(REQUIRED_CONDITION_FRAGMENTS)) {
    const claim = claimById(claims, id);
    if (claim.verdict !== 'SOUTIENT' || claim.publicationEligible !== true) {
      fail(`${id}: supported scoped claim was reopened or closed inconsistently`);
    }
    assertCondition(claim, fragments);
  }

  const nowMs = new Date(now).getTime();
  if (!Number.isFinite(nowMs)) fail('now must be a valid date');
  const ttlHours = measure.freshnessRule.prePublishTtlHours;
  if (!Number.isFinite(ttlHours) || ttlHours <= 0 || seal.prePublishTtlHours !== ttlHours) {
    fail('freshness TTL differs from the sealed policy');
  }
  for (const claim of claims.filter((entry) => entry.publicationEligible)) {
    for (const sourceId of claim.sourceIds) {
      const source = sources.get(sourceId);
      if (source.httpStatus !== 200) fail(`${claim.id}/${sourceId}: supported source must be HTTP 200`);
      const consultedAtMs = Date.parse(source.consultedAt);
      if (!Number.isFinite(consultedAtMs)) fail(`${claim.id}/${sourceId}: consultedAt must be an ISO date`);
      const ageMs = nowMs - consultedAtMs;
      if (ageMs < 0 || ageMs > ttlHours * 60 * 60 * 1000) {
        fail(`${claim.id}/${sourceId}: source consultation is stale or in the future`);
      }
    }
  }

  assertExactKeys(seal, ['version', 'kind', 'sealedAt', 'prePublishTtlHours', 'files', 'claims'], 'seal');
  if (seal.version !== 1 || seal.kind !== 'c3-r1-candidate-seal') fail('invalid candidate seal');
  assertExactKeys(seal.claims, EXPECTED_IDS, 'seal.claims');
  for (const claim of claims) {
    const sealedClaim = seal.claims[claim.id];
    assertExactKeys(sealedClaim, ['statement', 'sha256'], `seal.claims.${claim.id}`);
    if (sha256(sealedClaim.statement) !== sealedClaim.sha256) fail(`${claim.id}: sealed statement hash mismatch`);
    if (claim.statement !== sealedClaim.statement || sha256(claim.statement) !== sealedClaim.sha256) {
      fail(`${claim.id}: sealed statement differs from measure`);
    }
  }

  const fe05 = claimById(claims, 'FE-05');
  if (!fe05.statement.startsWith('Service-Public recommande')) fail('FE-05 attribution missing');
  const fe06 = claimById(claims, 'FE-06');
  if (!fe06.statement.includes('annuaire AIFE') || fe06.statement.includes('raccord')) {
    fail('FE-06 was not narrowed to direct AIFE evidence');
  }

  const recomputed = Object.fromEntries(
    [...ALLOWED_VERDICTS].map((verdict) => [
      verdict,
      claims.filter((claim) => claim.verdict === verdict).length,
    ]),
  );
  const eligible = claims.filter((claim) => claim.publicationEligible).length;
  const declared = measure.review.candidateCounts;
  const exactCounts =
    declared.claims === 6
    && declared.SOUTIENT === 3
    && declared.SOUTIENT_PARTIELLEMENT === 0
    && declared.SOURCE_INACCESSIBLE === 3
    && declared.publicationEligible === 3
    && declared.publicationIneligible === 3
    && recomputed.SOUTIENT === 3
    && recomputed.SOUTIENT_PARTIELLEMENT === 0
    && recomputed.SOURCE_INACCESSIBLE === 3
    && eligible === 3;
  if (!exactCounts) fail('candidate must remain 6/6: 3 supported, 3 closed, 3 publishable');
  if (measure.review.aiReviewPass !== false) fail('candidate must not claim AI_REVIEW_PASS');

  const pole = bodies.pole.toString('utf8');
  const rows = matrixRows(pole);
  for (const claim of claims) {
    const row = rows.get(claim.id);
    if (!row) fail(`${claim.id}: expected one matrix row`);
    if (row.statement !== claim.statement) fail(`${claim.id}: matrix statement differs from measure`);
    if (!row.verdict.includes(claim.verdict)) fail(`${claim.id}: matrix verdict differs from measure`);
    const matrixEligible = /^oui\b/i.test(row.publication);
    if (matrixEligible !== claim.publicationEligible) {
      fail(`${claim.id}: matrix publication state differs from measure`);
    }
  }

  const method = bodies.method.toString('utf8');
  for (const marker of [
    'Open Data officiel DILA',
    'hash brut',
    'hash citation',
    'ferme le couple tant que l’état courant',
  ]) {
    if (!method.includes(marker)) fail(`method missing ${marker}`);
  }

  assertExactKeys(seal.files, Object.values(CANDIDATE_PATHS), 'seal.files');
  for (const [id, relativePath] of Object.entries(CANDIDATE_PATHS)) {
    const actual = sha256(bodies[id]);
    if (seal.files[relativePath] !== actual) fail(`${relativePath}: candidate hash differs from seal`);
  }

  return {
    pass: true,
    claims: claims.length,
    verdicts: recomputed,
    publicationEligible: eligible,
    publicationIneligible: claims.length - eligible,
    sourceSnapshots: measure.sourceSnapshots.length,
    aiReviewPass: measure.review.aiReviewPass,
    fileSha256: Object.fromEntries(
      Object.entries(bodies).map(([id, body]) => [id, sha256(body)]),
    ),
  };
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;
if (invokedPath === import.meta.url) {
  console.log(JSON.stringify(validateC3R1(), null, 2));
}
