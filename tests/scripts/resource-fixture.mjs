import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { BLOG_SKILLS, SEO_SKILLS } from '../../scripts/lib/blog-pipeline.mjs';

export const RESOURCE_ROLES = Object.freeze([
  'direction-associes', 'chefs-mission-portefeuille', 'collaborateurs-comptables',
  'assistants-comptables', 'paie-responsables-sociaux', 'juridique-fiscal', 'audit-cac',
  'administratif-secretariat', 'facturation-recouvrement', 'rh-recrutement-formation',
  'numerique-it-data', 'profils-formation',
]);

export const RESOURCE_CORE_SKILLS = Object.freeze([
  'content-strategy', 'site-architecture', 'customer-research', 'competitor-profiling',
  'product-marketing', 'brand', 'copywriting', 'copy-editing', 'marketing-psychology', 'cro',
  'offers', 'ai-seo', 'analytics', 'free-tools', 'lead-magnets', 'frontend-design',
  'design-system', 'memlia-blog-strategie', 'memlia-site-design',
]);

const BASE = JSON.parse(readFileSync(new URL('../fixtures/resource-candidate-h.json', import.meta.url), 'utf8'));
const RESOURCE_TYPES = { H: 'hub', A: 'article', T: 'terme', G: 'guide', M: 'modele' };
const PATHS = { H: '/ressources', A: '/blog/fixture-article', T: '/glossaire#fixture-terme', G: '/guides/fixture-guide', M: '/modeles/fixture-modele' };
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const canonical = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).filter((key) => value[key] !== undefined).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
};
const digest = (value) => sha256(canonical(value));
const candidateDigestPayload = (manifest) => ({
  schemaVersion: manifest.schemaVersion,
  contractRevision: manifest.contractRevision,
  formatAdapter: manifest.formatAdapter,
  resourceType: manifest.resourceType,
  editorialFormat: manifest.editorialFormat,
  policyBaseline: manifest.policyBaseline,
  taxonomy: manifest.taxonomy,
  candidate: manifest.candidate,
  formatContract: manifest.formatContract,
  research: manifest.research,
  claimsEvidence: manifest.claimsEvidence,
  assets: manifest.assets,
  links: manifest.links,
  skills: manifest.skills,
  quality: manifest.quality,
  negativeWitnessesRef: manifest.negativeWitnessesRef,
  contradictions: manifest.contradictions,
  limitations: manifest.limitations,
  sourceBundleDigest: manifest.integrity.sourceBundle.digest,
  assetBundleDigest: manifest.integrity.assetBundle.digest,
  configBundleDigest: manifest.integrity.configBundle.digest,
  buildOutputDigest: manifest.integrity.buildOutput.digest,
});
const reviewSubjectDigestPayload = (manifest) => {
  const payload = candidateDigestPayload(manifest);
  payload.claimsEvidence = clone(manifest.claimsEvidence);
  delete payload.claimsEvidence.sensitiveMatter.businessReview;
  return payload;
};
const clone = (value) => structuredClone(value);

function formatContract(adapter) {
  const common = { requiredInputs: ['fixture input'], requiredOutputs: ['fixture output'] };
  if (adapter === 'H') return { ...common, navigationIntent: 'Preuve navigationnelle RUN/PASS.', imagePolicy: 'Audit image et OG RUN.', indexSubstance: { minimum: 5, excludedResourceTypes: ['hub'], unitRule: 'Destination canonique, approuvée, rendue et substantielle.', computedCount: 5, eligibleUnitRefs: ['/blog/a', '/blog/b', '/glossaire#c', '/guides/d', '/modeles/e'], result: 'PASS', transitionTests: ['quatre absentes', 'cinq présentes', 'retrait à quatre'], noJsInventoryRef: 'fixture://hub/no-js' } };
  if (adapter === 'A') return { ...common, pipelinePolicy: 'Appliquer intégralement t_584e6438 au commit 2d78b8bed588884e53157145077499cd56c27086; aucun assouplissement.', historicalPipelineEvidenceRef: 'fixture://article/pipeline', newUrlGsc: 'Historique ND, preuve GSC RUN/PASS.', imagePolicy: 'Image réelle obligatoire.' };
  if (adapter === 'T') return { ...common, routeDecision: { status: 'PASS', choice: 'anchor', allowed: ['anchor', 'page'], evidenceRef: 'fixture://term/decision', rule: 'Une seule surface canonique.', containerAuditResult: 'PASS' }, anchorPolicy: 'Canonical /glossaire et absent du sitemap.', noNaAbuse: 'Audits du conteneur RUN/PASS.', imagePolicy: 'Décision image auditée.' };
  if (adapter === 'G') return { ...common, procedurePolicy: 'Procédure réellement rejouée.', typeIndexMinimumSubstantiveUnits: 5, imagePolicy: 'UI du banc fictif seulement.', procedure: { prerequisites: ['fixture'], steps: ['fixture'], output: 'fixture output', controls: ['fixture'], stopConditions: ['fixture'], replayResult: 'PASS', validatorEvidenceRef: 'fixture://guide/replay', fictitiousDatasetId: 'fixture-dataset' } };
  return { ...common, artifactPolicy: 'Fichier fictif contrôlé.', typeIndexMinimumSubstantiveUnits: 5, downloadPolicy: 'Accès ouvert sans capture email.', imagePolicy: 'Aperçu réel seulement.', download: { path: 'fixtures/model.xlsx', publicUrl: '/modeles/fixture.xlsx', mediaType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', version: '1', sha256: null, bytes: null, license: 'usage interne autorisé', testEvidenceRef: 'fixture://model/test', containsMacros: false, containsExternalLinks: false, containsRealClientData: false, containsPersonalMetadata: false }, oracle: { commonCase: 'PASS', invalidCases: 'PASS', limits: 'PASS', formulas: 'PASS', errors: 'PASS', independentEvidenceRef: 'fixture://model/oracle' }, openAccess: true };
}

export function createResourceFixture(root, adapter = 'H', phase = 'release', options = {}) {
  // Un couple claim/source/verdict peut être daté d’un jour antérieur : c’est le cas réel d’une revue
  // qui ajoute des termes sans rouvrir ceux qu’elle ne juge pas. La campagne, elle, garde sa date.
  const jourSensible = options.sensitiveVerdictDay ?? null;
  const dateClaimSensible = options.sensitiveVerdictAt ?? (jourSensible ? `${jourSensible}T10:00:00+01:00` : '2026-09-13T21:30:00+01:00');
  const dateSourceSensible = options.dilaCopy?.provenance.retrieved_at ?? (jourSensible ? `${jourSensible}T09:00:00+01:00` : '2026-09-13T21:30:00+01:00');
  if (!['qa', 'preview', 'approval', 'release'].includes(phase)) throw new Error(`Phase fixture inconnue : ${phase}.`);
  const manifest = clone(BASE);
  manifest.contractRevision = 3;
  const files = new Map([
    ['fixtures/source.md', options.dilaCopy?.text ?? 'Source fixture primaire.'],
    ['fixtures/build.html', '<html><meta name="robots" content="noindex, nofollow"><body>Fixture</body></html>'],
    ['fixtures/image.webp', 'fixture-image'],
  ]);
  const registry = { blog: [...BLOG_SKILLS], seo: [...SEO_SKILLS], marketingDesignCore: [...RESOURCE_CORE_SKILLS] };
  files.set('fixtures/skills.json', `${JSON.stringify(registry)}\n`);
  if (options.dilaCopy) files.set('fixtures/dila.json', `${JSON.stringify(options.dilaCopy)}\n`);
  if (adapter === 'M') files.set('fixtures/model.xlsx', 'fixture-xlsx');
  for (const [path, content] of files) {
    mkdirSync(join(root, path, '..'), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  const entry = (path) => ({ path, bytes: Buffer.byteLength(files.get(path)), sha256: sha256(files.get(path)) });
  const bundles = {
    sourceBundle: { entries: [entry('fixtures/source.md')] },
    assetBundle: { entries: [entry('fixtures/image.webp')] },
    configBundle: { entries: [entry('fixtures/skills.json')] },
    buildOutput: { entries: [entry('fixtures/build.html')] },
  };
  if (adapter === 'M') bundles.assetBundle.entries.push(entry('fixtures/model.xlsx'));
  if (options.dilaCopy) bundles.sourceBundle.entries.push(entry('fixtures/dila.json'));
  for (const bundle of Object.values(bundles)) {
    bundle.entries.sort((left, right) => left.path.localeCompare(right.path));
    bundle.digest = digest(bundle.entries);
  }
  const buildReceiptPath = 'fixtures/build-receipt.json';
  const buildReceipt = `${JSON.stringify({
    schemaVersion: 1,
    commands: [{ command: 'fixture:build', exitCode: 0 }],
    startedAt: manifest.build.startedAt,
    endedAt: manifest.build.endedAt,
    result: 'PASS',
    surfaces: {
      [adapter]: {
        sourceBundleDigest: bundles.sourceBundle.digest,
        assetBundleDigest: bundles.assetBundle.digest,
        configBundleDigest: bundles.configBundle.digest,
        outputDigest: bundles.buildOutput.digest,
      },
    },
  }, null, 2)}\n`;
  writeFileSync(join(root, buildReceiptPath), buildReceipt);

  manifest.formatAdapter = adapter;
  manifest.resourceType = RESOURCE_TYPES[adapter];
  manifest.editorialFormat = adapter === 'H' ? 'landing-navigationnelle' : `fixture-${RESOURCE_TYPES[adapter]}`;
  manifest.candidate.id = `${RESOURCE_TYPES[adapter]}:fixture`;
  manifest.candidate.slug = adapter === 'H' ? 'ressources' : `fixture-${RESOURCE_TYPES[adapter]}`;
  manifest.candidate.canonicalPath = PATHS[adapter];
  manifest.candidate.primaryQuery = `fixture ${RESOURCE_TYPES[adapter]}`;
  manifest.candidate.secondaryQueries = [`contrat ${RESOURCE_TYPES[adapter]}`];
  manifest.formatContract = formatContract(adapter);
  manifest.research.serp.gateResult = 'PASS';
  manifest.research.gsc = adapter === 'A'
    ? { ...manifest.research.gsc, candidateUrlHistoryStatus: 'ND', historyReason: 'nouvelle URL sans historique', requiredForDecision: true, status: 'RUN', propertyQueryEvidenceStatus: 'PASS', arbitration: { decision: 'GSC requis pour cet article.', decidedBy: 'fixture-owner', checkedAt: '2026-09-13T23:30:00+01:00', evidenceRef: 'fixture://gsc' } }
    : { ...manifest.research.gsc, candidateUrlHistoryStatus: 'ND', historyReason: 'nouvelle URL sans historique', requiredForDecision: false, status: 'N/A', propertyQueryEvidenceStatus: 'N/A', arbitration: { decision: 'non requis pour cette décision', decidedBy: 'fixture-owner', checkedAt: '2026-09-13T23:30:00+01:00', evidenceRef: 'fixture://gsc-arbitration' } };

  const sourceText = files.get('fixtures/source.md');
  const unitText = 'Cette unité contient une affirmation juridique fictive et contrôlée.';
  const claimText = 'L’affirmation juridique fictive est soutenue.';
  manifest.claimsEvidence.renderedUnitInventory = [{ id: 'unit-1', text: unitText, sha256: sha256(unitText), claimIds: ['claim-1'] }];
  manifest.claimsEvidence.claims = [{
    id: 'claim-1', unitId: 'unit-1', text: claimText, sha256: sha256(claimText), type: 'juridique',
    sourceIds: ['source-1'], citationIds: ['citation-1'], checkedAt: dateClaimSensible, status: 'PASS',
    applicability: {
      population: 'Entreprises françaises concernées par la règle juridique fictive.',
      regime: 'Régime juridique fictif décrit par la source primaire de la fixture.',
      validAsOf: options.dilaCopy ? dateSourceSensible.slice(0, 10) : jourSensible ?? '2026-09-13',
      exceptions: 'Les situations hors du régime fictif restent exclues du claim.',
      sourceIds: ['source-1'],
    },
  }];
  manifest.claimsEvidence.citations = [{ id: 'citation-1', claimIds: ['claim-1'], sourceId: 'source-1', text: sourceText, sha256: sha256(sourceText), sourceContentSha256: sha256(sourceText), finalUrl: 'https://www.service-public.fr/fixture', checkedAt: dateClaimSensible, title: 'Source fixture', locator: 'ligne 1', verdict: 'soutient' }];
  manifest.claimsEvidence.sources = [{ id: 'source-1', publisher: 'Service Public', title: 'Source fixture', requestedUrl: 'https://www.service-public.fr/fixture', finalUrl: 'https://www.service-public.fr/fixture', checkedAt: dateSourceSensible, level: 'tier-1', provenance: 'primary', official: true, upstreamUrl: 'https://www.service-public.fr/fixture', snapshotPath: 'fixtures/source.md', contentSha256: sha256(sourceText), verificationEvidenceRef: 'fixture://source/open', classificationEvidenceRef: 'fixture://source/classification', claimIds: ['claim-1'] }];
  manifest.claimsEvidence.sensitiveMatter = { detected: true, signals: ['juridique'], checkedAt: '2026-09-13T21:30:00+01:00', businessReview: null };
  if (options.dilaCopy) {
    const url = options.dilaCopy.url;
    Object.assign(manifest.claimsEvidence.sources[0], {
      publisher: 'Légifrance', requestedUrl: url, finalUrl: url, upstreamUrl: url,
      dilaCopyPath: 'fixtures/dila.json', dilaCopySha256: sha256(files.get('fixtures/dila.json')), verificationEvidenceRef: 'fixtures/dila.json',
    });
    manifest.claimsEvidence.citations[0].finalUrl = url;
    manifest.claimsEvidence.sensitiveMatter.checkedAt = dateClaimSensible;
  }

  manifest.assets.assetRefs = ['fixtures/image.webp'];
  manifest.assets.image = { required: true, engine: 'image_generate', promptEvidenceRef: 'fixture://prompt', generationEvidenceRef: 'fixture://generation', generationId: 'fixture-generation', masterSha256: sha256(files.get('fixtures/image.webp')), visualReviewEvidenceRef: 'fixture://visual-review', alt: 'Illustration fictive d’une ressource contrôlée', ogSha256: sha256(files.get('fixtures/image.webp')), derivativeRefs: ['fixture://derivative'], kevinApproved: true };
  manifest.assets.uiCapture = { present: true, allowedProvenance: 'banc-windows-jeu-fictif', datasetId: 'fixture-dataset', captureEvidenceRef: 'fixture://ui-capture', sha256: sha256('fixture-ui-capture') };
  manifest.skills.registryContract.candidateRegistryPath = 'fixtures/skills.json';
  manifest.skills.registryContract.candidateRegistrySha256 = sha256(files.get('fixtures/skills.json'));
  manifest.skills.registryContract.manifestProjectionSha256 = digest(registry);
  manifest.integrity.sourceBundle = bundles.sourceBundle;
  manifest.integrity.assetBundle = bundles.assetBundle;
  manifest.integrity.configBundle = bundles.configBundle;
  manifest.integrity.buildOutput = bundles.buildOutput;
  if (adapter === 'M') {
    manifest.formatContract.download.sha256 = sha256(files.get('fixtures/model.xlsx'));
    manifest.formatContract.download.bytes = Buffer.byteLength(files.get('fixtures/model.xlsx'));
  }
  Object.assign(manifest.build, {
    receiptRef: buildReceiptPath,
    receiptSha256: sha256(buildReceipt),
    sourceBundleDigest: bundles.sourceBundle.digest,
    assetBundleDigest: bundles.assetBundle.digest,
    configBundleDigest: bundles.configBundle.digest,
    outputDigest: bundles.buildOutput.digest,
  });
  const reviewedCandidateHash = digest(reviewSubjectDigestPayload(manifest));
  const claimSourceVerdicts = [{
    claimId: 'claim-1', sourceId: 'source-1', citationIds: ['citation-1'], verdict: 'soutient',
    sourceContentSha256: sha256(sourceText), checkedAt: dateClaimSensible,
    reasoning: 'Le profil métier a comparé le claim, la citation exacte et la source primaire.',
  }];
  const reviewEvidence = `${JSON.stringify({
    required: true, reviewerType: 'ai-agent', reviewerProfile: 'metier', reviewerId: 't_00000000',
    reviewerRole: 'reviewer-metier-memlia', distinctFrom: ['author', 'editorialReviewer', 'sourceClassifier'],
    reviewedCandidateHash, status: 'AI_REVIEW_PASS', claimSourceVerdicts,
  }, null, 2)}\n`;
  writeFileSync(join(root, 'fixtures/business-review.json'), reviewEvidence);
  manifest.claimsEvidence.sensitiveMatter.businessReview = {
    required: true,
    reviewerId: 't_00000000',
    reviewerType: 'ai-agent',
    reviewerProfile: 'metier',
    reviewerRole: 'reviewer-metier-memlia',
    distinctFrom: ['author', 'editorialReviewer', 'sourceClassifier'],
    reviewedCandidateHash,
    status: 'AI_REVIEW_PASS',
    claimSourceVerdicts,
    evidenceRef: 'fixtures/business-review.json',
    evidenceSha256: sha256(reviewEvidence),
  };
  const lastRequiredGate = { qa: 4, preview: 4, approval: 5, release: 6 }[phase];
  manifest.gates = manifest.gates.map((gate, index) => index <= lastRequiredGate
    ? gate
    : { ...gate, status: 'PENDING', result: 'PENDING', checkedAt: null, evidenceRefs: [] });
  const candidateHash = digest(candidateDigestPayload(manifest));
  manifest.integrity.candidateHash.value = candidateHash;
  const previewFinalUrl = `https://preview.fixture.invalid${PATHS[adapter].split('#')[0]}`;
  manifest.preview = phase === 'qa'
    ? { branch: null, deploymentId: null, requestedUrl: null, finalUrl: null, candidateHash: null, buildOutputDigest: null, htmlNoindexNofollow: null, httpXRobotsNoindexNofollow: null, excludedFromSitemap: null, excludedFromFeeds: null, routeChecks: [], captureRefs: [], reportRef: null }
    : { ...manifest.preview, finalUrl: previewFinalUrl, candidateHash, buildOutputDigest: bundles.buildOutput.digest };
  Object.assign(manifest.audit, { candidateHash, buildOutputDigest: bundles.buildOutput.digest });
  const auditPayload = { ...manifest.audit };
  delete auditPayload.auditHash;
  manifest.audit.auditHash = digest(auditPayload);
  manifest.approval = ['qa', 'preview'].includes(phase)
    ? { state: 'pending', approvedBy: null, channel: null, exactMessage: null, receivedAt: null, candidateHash: null, auditHash: null, previewFinalUrl: null, durableEvidenceRef: null, scope: null, rule: manifest.approval.rule }
    : {
      ...manifest.approval,
      exactMessage: `GO FIXTURE ${candidateHash} ${manifest.audit.auditHash} ${previewFinalUrl}`,
      candidateHash,
      auditHash: manifest.audit.auditHash,
      previewFinalUrl,
    };
  manifest.release = phase === 'release'
    ? { ...manifest.release, preflightCandidateHash: candidateHash, remoteDigest: bundles.buildOutput.digest }
    : { authorized: false, preflightCandidateHash: null, deploymentId: null, productionUrl: null, remoteDigest: null, rollbackRef: null, result: 'PENDING' };
  return manifest;
}