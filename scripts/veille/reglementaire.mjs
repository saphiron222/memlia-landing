#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../..');
const MEASURE_PATH = 'docs/strategy/site-v3/mesures/facturation-electronique-2026-09-20.json';
const SEAL_PATH = 'docs/strategy/site-v3/mesures/facturation-electronique-c3-r1-seal.json';
const MAINTENANCE_BASELINE_PATH = 'docs/strategy/site-v3/mesures/facturation-electronique-fe05-fe06-2026-09-20.json';
const MAINTENANCE_SEAL_PATH = 'docs/strategy/site-v3/mesures/facturation-electronique-fe05-fe06-2026-09-20-seal-v1.json';
const CANDIDATE_PATHS = [
  'docs/strategy/site-v3/POLE-FACTURATION-ELECTRONIQUE.md',
  'docs/strategy/site-v3/METHODE-FENETRES-REGLEMENTAIRES.md',
  MEASURE_PATH,
];
const LEGACY_CLAIM_SOURCES = ['impots-pa-list'];
const DISCOVERY_SOURCES = [
  { id: 'legifrance-dila-index', url: 'https://echanges.dila.gouv.fr/OPENDATA/LEGI/', kind: 'primary-index' },
  { id: 'impots-actualites', url: 'https://www.impots.gouv.fr/toutes-les-actualites', kind: 'primary-news' },
  { id: 'net-entreprises-actualites', url: 'https://www.net-entreprises.fr/actualites/', kind: 'primary-news' },
  { id: 'ordre-sic', url: 'https://www.experts-comptables.fr/sic-emissions-evenements-presse/sic-webzine/liste-des-articles-sic', kind: 'professional-news' },
];
const WATCH_USER_AGENT = 'Mozilla/5.0 (compatible; MemliaRegulatoryWatch/1.0; +https://memlia.fr) AppleWebKit/537.36 Chrome/140 Safari/537.36';

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

export function metaDescription(html) {
  const tag = String(html).match(/<meta\b(?=[^>]*\bname=["']description["'])[^>]*>/i)?.[0] ?? '';
  return tag.match(/\bcontent=(["'])([\s\S]*?)\1/i)?.[2] ?? '';
}

function evidenceCorpus(body, source) {
  const text = canonicalText(body);
  return source.evidenceScope === 'document-source-including-meta-description'
    ? `${text} ${canonicalText(metaDescription(body))}`
    : text;
}

async function fetchSnapshot(source) {
  try {
    const requestUrl = new URL(source.url);
    if (source.cacheBuster) requestUrl.searchParams.set('_memlia_watch', Date.now().toString());
    const response = await fetch(requestUrl, {
      redirect: 'follow',
      cache: 'no-store',
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'accept-language': 'fr-FR,fr;q=0.9',
        'cache-control': 'no-cache, no-store',
        pragma: 'no-cache',
        'user-agent': WATCH_USER_AGENT,
      },
      signal: AbortSignal.timeout(25_000),
    });
    const body = await response.text();
    const finalUrl = new URL(response.url);
    finalUrl.searchParams.delete('_memlia_watch');
    return {
      id: source.id,
      kind: source.kind ?? 'claim-source',
      requestedUrl: source.url,
      finalUrl: finalUrl.toString(),
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
  const fragments = source.claimFragments ?? (source.claimExcerpt ? [source.claimExcerpt] : []);
  const corpus = evidenceCorpus(snapshot.body, source);
  const fragmentResults = fragments.map((fragment) => ({
    sha256: sha256(fragment),
    present: normalizedIncludes(corpus, fragment),
  }));
  const excerptPresent = fragmentResults.length > 0 ? fragmentResults.every((fragment) => fragment.present) : null;
  const evidenceSha256 = fragments.length > 0 ? sha256(fragments.join('\n')) : null;
  const evidenceHashMatches = source.evidenceSha256 ? evidenceSha256 === source.evidenceSha256 : null;
  const expectedRawSha256 = source.rawBodySha256 ?? source.sha256 ?? null;
  const dynamicBody = /dynamic body/i.test(source.rawHashStatus ?? '');
  const hashMatches = expectedRawSha256 ? snapshot.bodySha256 === expectedRawSha256 : null;
  const critical = snapshot.httpStatus !== 200
    || (excerptPresent === false)
    || (evidenceHashMatches === false)
    || (!dynamicBody && expectedRawSha256 !== null && hashMatches === false);
  return {
    id: snapshot.id,
    requestedUrl: snapshot.requestedUrl,
    finalUrl: snapshot.finalUrl,
    httpStatus: snapshot.httpStatus,
    bodySha256: snapshot.bodySha256 ?? null,
    expectedRawSha256,
    hashMatches,
    excerptSha256: source.claimExcerptSha256 ?? source.evidenceSha256 ?? null,
    excerptPresent,
    evidenceSha256,
    evidenceHashMatches,
    fragmentResults,
    dynamicBody,
    critical,
    error: snapshot.error ?? null,
  };
}

function evaluateDiscoverySource(snapshot, source) {
  const fragments = source.requiredFragments ?? [];
  const corpus = canonicalText(snapshot.body);
  const fragmentResults = fragments.map((fragment) => ({
    sha256: sha256(fragment),
    present: normalizedIncludes(corpus, fragment),
  }));
  const evidencePresent = fragmentResults.length > 0 ? fragmentResults.every((fragment) => fragment.present) : null;
  return {
    id: snapshot.id,
    kind: snapshot.kind,
    requestedUrl: snapshot.requestedUrl,
    finalUrl: snapshot.finalUrl,
    httpStatus: snapshot.httpStatus,
    bodySha256: snapshot.bodySha256 ?? null,
    canonicalSha256: snapshot.canonicalSha256 ?? null,
    evidencePresent,
    fragmentResults,
    latestDilaPackage: snapshot.latestDilaPackage,
    critical: snapshot.httpStatus !== 200 || evidencePresent === false,
    error: snapshot.error ?? null,
  };
}

export async function inspectRegulatorySources({ root = ROOT } = {}) {
  const measure = JSON.parse(readFileSync(resolve(root, MEASURE_PATH), 'utf8'));
  const seal = JSON.parse(readFileSync(resolve(root, SEAL_PATH), 'utf8'));
  const maintenanceBody = readFileSync(resolve(root, MAINTENANCE_BASELINE_PATH));
  const maintenance = JSON.parse(maintenanceBody.toString('utf8'));
  const maintenanceSeal = JSON.parse(readFileSync(resolve(root, MAINTENANCE_SEAL_PATH), 'utf8'));
  const sealedMaintenanceClaims = maintenance.claimMatrix.every((claim) => {
    const sealed = maintenanceSeal.claims[claim.id];
    return sealed?.statement === claim.statement && sealed?.sha256 === sha256(claim.statement);
  });
  const maintenanceMatchesSeal = maintenanceSeal.files[MAINTENANCE_BASELINE_PATH] === sha256(maintenanceBody)
    && sealedMaintenanceClaims;
  const candidate = Object.fromEntries(CANDIDATE_PATHS.map((path) => [path, sha256(readFileSync(resolve(root, path)))]));
  const candidateMatchesSeal = CANDIDATE_PATHS.every((path) => candidate[path] === seal.files[path]);
  const sources = new Map(measure.sourceSnapshots.map((source) => [source.id, source]));
  const maintenanceSources = new Map(maintenance.claimSources.map((source) => [source.id, source]));
  const claimSourceDefinitions = [
    ...LEGACY_CLAIM_SOURCES.map((id) => sources.get(id)),
    ...maintenance.claimSources,
  ];
  const claimSnapshots = await Promise.all(claimSourceDefinitions.map((source) => fetchSnapshot({ ...source, kind: 'claim-source' })));
  const claimSources = claimSnapshots.map((snapshot) => evaluateClaimSource(
    snapshot,
    maintenanceSources.get(snapshot.id) ?? sources.get(snapshot.id),
  ));
  const discoveryDefinitions = [...DISCOVERY_SOURCES, ...maintenance.discoverySources];
  const discoverySnapshots = await Promise.all(discoveryDefinitions.map(fetchSnapshot));
  const discoverySources = discoverySnapshots.map((snapshot) => {
    const latestDilaPackage = snapshot.id === 'legifrance-dila-index'
      ? [...snapshot.body.matchAll(/LEGI_(\d{8}-\d{6})\.tar\.gz/g)].map((match) => match[1]).sort().at(-1) ?? null
      : undefined;
    return evaluateDiscoverySource(
      { ...snapshot, ...(latestDilaPackage === undefined ? {} : { latestDilaPackage }) },
      discoveryDefinitions.find((source) => source.id === snapshot.id),
    );
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
    maintenanceBaseline: {
      path: MAINTENANCE_BASELINE_PATH,
      sealPath: MAINTENANCE_SEAL_PATH,
      measuredAt: maintenance.measuredAt,
      matchesSeal: maintenanceMatchesSeal,
      status: maintenance.watchBaseline.status,
    },
    candidate: { commit: 'e73e9905fec92c4dc215e78171e75c0812430a1f', matchesSeal: candidateMatchesSeal, files: candidate },
    review: { aiReviewPass: measure.review.aiReviewPass, closedClaims, supportedClaims },
    claimSources,
    discoverySources,
    critical: !maintenanceMatchesSeal
      || !candidateMatchesSeal
      || claimSources.some((source) => source.critical)
      || discoverySources.some((source) => source.critical),
  };
}

const invoked = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;
if (invoked === import.meta.url) console.log(JSON.stringify(await inspectRegulatorySources(), null, 2));
