#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../..');
const MEASURE_PATH = 'docs/strategy/site-v3/mesures/facturation-electronique-2026-09-20.json';
const SEAL_PATH = 'docs/strategy/site-v3/mesures/facturation-electronique-c3-r1-seal.json';
const CANDIDATE_PATHS = [
  'docs/strategy/site-v3/POLE-FACTURATION-ELECTRONIQUE.md',
  'docs/strategy/site-v3/METHODE-FENETRES-REGLEMENTAIRES.md',
  MEASURE_PATH,
];
const CLAIM_SOURCES = ['impots-pa-list', 'service-public-f39785', 'aife-annuaire'];
const DISCOVERY_SOURCES = [
  { id: 'legifrance-dila-index', url: 'https://echanges.dila.gouv.fr/OPENDATA/LEGI/', kind: 'primary-index' },
  { id: 'impots-actualites', url: 'https://www.impots.gouv.fr/toutes-les-actualites', kind: 'primary-news' },
  { id: 'net-entreprises-actualites', url: 'https://www.net-entreprises.fr/actualites/', kind: 'primary-news' },
  { id: 'urssaf-actualites', url: 'https://www.urssaf.fr/accueil/actualites.html', kind: 'primary-news' },
  { id: 'ordre-sic', url: 'https://www.experts-comptables.fr/sic-emissions-evenements-presse/sic-webzine/liste-des-articles-sic', kind: 'professional-news' },
];

export const sha256 = (value) => createHash('sha256').update(value).digest('hex');

export function canonicalText(html) {
  return String(html)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizedIncludes(body, excerpt) {
  return canonicalText(body).normalize('NFKC').includes(canonicalText(excerpt).normalize('NFKC'));
}

async function fetchSnapshot(source) {
  try {
    const response = await fetch(source.url, {
      redirect: 'follow',
      headers: {
        'cache-control': 'no-cache, no-store',
        pragma: 'no-cache',
        'user-agent': 'MemliaRegulatoryWatch/1.0 (+https://memlia.fr)',
      },
      signal: AbortSignal.timeout(25_000),
    });
    const body = await response.text();
    return {
      id: source.id,
      kind: source.kind ?? 'claim-source',
      requestedUrl: source.url,
      finalUrl: response.url,
      httpStatus: response.status,
      bodySha256: sha256(body),
      canonicalSha256: sha256(canonicalText(body)),
      body,
    };
  } catch (error) {
    return {
      id: source.id,
      kind: source.kind ?? 'claim-source',
      requestedUrl: source.url,
      finalUrl: null,
      httpStatus: 0,
      error: error instanceof Error ? error.name : 'FetchError',
      body: '',
    };
  }
}

export function evaluateClaimSource(snapshot, source) {
  const excerptPresent = source.claimExcerpt ? normalizedIncludes(snapshot.body, source.claimExcerpt) : null;
  const expectedRawSha256 = source.rawBodySha256 ?? source.sha256 ?? null;
  const dynamicBody = /dynamic body/i.test(source.rawHashStatus ?? '');
  const hashMatches = expectedRawSha256 ? snapshot.bodySha256 === expectedRawSha256 : null;
  const critical = snapshot.httpStatus !== 200
    || (excerptPresent === false)
    || (!dynamicBody && expectedRawSha256 !== null && hashMatches === false);
  return {
    id: snapshot.id,
    requestedUrl: snapshot.requestedUrl,
    finalUrl: snapshot.finalUrl,
    httpStatus: snapshot.httpStatus,
    bodySha256: snapshot.bodySha256 ?? null,
    expectedRawSha256,
    hashMatches,
    excerptSha256: source.claimExcerptSha256 ?? null,
    excerptPresent,
    dynamicBody,
    critical,
    error: snapshot.error ?? null,
  };
}

export async function inspectRegulatorySources({ root = ROOT } = {}) {
  const measure = JSON.parse(readFileSync(resolve(root, MEASURE_PATH), 'utf8'));
  const seal = JSON.parse(readFileSync(resolve(root, SEAL_PATH), 'utf8'));
  const candidate = Object.fromEntries(CANDIDATE_PATHS.map((path) => [path, sha256(readFileSync(resolve(root, path)))]));
  const candidateMatchesSeal = CANDIDATE_PATHS.every((path) => candidate[path] === seal.files[path]);
  const sources = new Map(measure.sourceSnapshots.map((source) => [source.id, source]));
  const claimSnapshots = await Promise.all(CLAIM_SOURCES.map((id) => fetchSnapshot({ ...sources.get(id), kind: 'claim-source' })));
  const claimSources = claimSnapshots.map((snapshot) => evaluateClaimSource(snapshot, sources.get(snapshot.id)));
  const discoverySnapshots = await Promise.all(DISCOVERY_SOURCES.map(fetchSnapshot));
  const discoverySources = discoverySnapshots.map(({ body, ...snapshot }) => {
    const latestDilaPackage = snapshot.id === 'legifrance-dila-index'
      ? [...body.matchAll(/LEGI_(\d{8}-\d{6})\.tar\.gz/g)].map((match) => match[1]).sort().at(-1) ?? null
      : undefined;
    return { ...snapshot, ...(latestDilaPackage === undefined ? {} : { latestDilaPackage }) };
  });
  const closedClaims = measure.review.claims
    .filter((claim) => claim.verdict === 'SOURCE_INACCESSIBLE')
    .map(({ id, verdict, severity, publicationEligible }) => ({ id, verdict, severity, publicationEligible }));
  const supportedClaims = measure.review.claims
    .filter((claim) => claim.verdict === 'SOUTIENT')
    .map(({ id, statement, condition, publicationEligible }) => ({ id, statement, condition, publicationEligible }));

  return {
    schemaVersion: 1,
    policy: {
      cadence: 'daily-07:05-Europe/Paris',
      prePublishTtlHours: measure.freshnessRule.prePublishTtlHours,
      silenceWithoutDiff: true,
      criticalFields: measure.freshnessRule.criticalFields,
      onCriticalChange: measure.freshnessRule.onCriticalChange,
      onFailure: measure.freshnessRule.onFailure,
    },
    candidate: { commit: 'e73e9905fec92c4dc215e78171e75c0812430a1f', matchesSeal: candidateMatchesSeal, files: candidate },
    review: { aiReviewPass: measure.review.aiReviewPass, closedClaims, supportedClaims },
    claimSources,
    discoverySources,
    critical: !candidateMatchesSeal || claimSources.some((source) => source.critical) || discoverySources.some((source) => source.httpStatus !== 200),
  };
}

const invoked = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;
if (invoked === import.meta.url) console.log(JSON.stringify(await inspectRegulatorySources(), null, 2));
