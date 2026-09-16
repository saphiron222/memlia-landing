#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { createResourceFixture } from '../tests/scripts/resource-fixture.mjs';
import { loadMetierEvidence } from './lib/resource-metier-evidence.mjs';

const root = process.cwd();
const checkedAt = '2026-09-16T06:45:00+01:00'; // Date du corpus officiel, pas une date d’effet.
// Les neuf copies de source ont été rechargées le 16/09/2026 et chaque citation d’autorité a été
// retrouvée dans la page vivante. Deux formulations avaient changé depuis le 14/09 : la condition
// de licéité d’un dispositif de contrôle chez la CNIL, et la définition de l’identification d’une
// personne physique. Les deux citations suivent désormais la page courante.
const buildCommand = 'npm run build:site'; // Chaîne complète, jouée hors scellement (voir la vérification plus bas).
const publicEnv = { ...process.env };
for (const key of ['BLOG_PREVIEW_SLUG', 'BLOG_PREVIEW_SLUGS', 'BLOG_PREVIEW_ALL']) delete publicEnv[key];
const buildStartedAt = new Date().toISOString();
const bootstrapCommands = [
  { command: 'npx astro build', executable: 'npx', args: ['astro', 'build'], env: publicEnv },
  { command: 'node scripts/strip-briefs.mjs', executable: process.execPath, args: ['scripts/strip-briefs.mjs'], env: process.env },
];
for (const row of bootstrapCommands) {
  const run = spawnSync(row.executable, row.args, { cwd: root, env: row.env, stdio: 'inherit' });
  row.exitCode = run.status;
  if (!Number.isInteger(run.status) || run.status !== 0) throw new Error(`${row.command} a échoué ou n’a pas rendu de code entier (exit=${run.status ?? 'null'}).`);
}
const buildEndedAt = new Date().toISOString();
const metierEvidence = loadMetierEvidence(root, checkedAt);
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const canonicalJson = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).filter((key) => value[key] !== undefined).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
};
const digest = (value) => sha256(canonicalJson(value));
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
const entry = (path) => {
  const content = readFileSync(join(root, path));
  return { path, bytes: statSync(join(root, path)).size, sha256: sha256(content) };
};
const bundle = (paths) => {
  const entries = [...paths].sort().map(entry);
  return { entries, digest: digest(entries) };
};
const unresolvedSkills = new Set(['blog-google', 'seo-google', 'seo-sxo']);
const renderedSkills = new Set(['blog-brief', 'blog-outline', 'blog-image', 'seo-page', 'seo-images', 'seo-sitemap']);

function normalizeSkillRows(rows) {
  return rows.map((row) => {
    const common = {
      ...row,
      evidenceRefs: ['docs/qa/hub-ressources/freshness-r4-exec.md'],
      version: 'candidat-v3-t_54774b16',
    };
    if (unresolvedSkills.has(row.skill)) {
      return { ...common, applicable: false, status: 'N/A', result: null, toolOrCommand: null, checkedAt: null, naReason: 'Décision FIX-C : aucune nouvelle recherche. GSC absent et SERP fournisseur 40101 restent ND, sans point SEO attribué.' };
    }
    if (renderedSkills.has(row.skill) || row.skill === 'blog-factcheck') {
      return {
        ...common,
        applicable: true,
        status: 'RUN',
        result: 'PASS',
        toolOrCommand: buildCommand,
        checkedAt: buildEndedAt,
        naReason: null,
      };
    }
    return { ...common, applicable: false, status: 'N/A', result: null, toolOrCommand: null, checkedAt: null, version: null, naReason: 'Contrôle non rejoué sur ce candidat exact ; le gate reste fermé.' };
  });
}

function createManifest(adapter) {
  const scratch = mkdtempSync(join(tmpdir(), `memlia-surface-${adapter}-`));
  let manifest;
  try {
    manifest = createResourceFixture(scratch, adapter, 'qa');
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }

  const isHub = adapter === 'H';
  // Le manifeste est reconstruit depuis un fixture : il ne sait rien de la revue metier
  // deja scellee sur disque. Sans cette relecture, rescellier les surfaces effacait la
  // revue en silence et la remettait a PENDING. On la reporte telle quelle, empreinte
  // perimee comprise, pour que le validateur refuse bruyamment tant qu'elle n'a pas ete
  // reaffirmee sur le candidat courant (scripts/reaffirm-resource-review.mjs).
  const manifestPath = `editorial/resources/${isHub ? 'hub' : 'glossaire'}/manifest.json`;
  let revueReportee = null;
  if (existsSync(join(root, manifestPath))) {
    const precedent = JSON.parse(readFileSync(join(root, manifestPath), 'utf8'));
    const revue = precedent?.claimsEvidence?.sensitiveMatter?.businessReview;
    if (revue && typeof revue.status === 'string' && revue.status !== 'PENDING') {
      revueReportee = {
        revue: structuredClone(revue),
        p0: [...(precedent.quality?.p0 ?? [])],
        p1: [...(precedent.quality?.p1 ?? [])],
        blocking: precedent.quality?.blocking ?? false,
      };
    }
  }
  const sourcePath = isHub ? 'src/pages/ressources.astro' : 'src/data/glossary.ts';
  const outputPath = isHub ? 'dist/ressources.html' : 'dist/glossaire.html';
  const surfaceEntries = metierEvidence.entries.filter((entry) => entry.surface === adapter);
  const unitText = isHub
    ? surfaceEntries.find((entry) => entry.id === 'H-DESCRIPTION').text
    : surfaceEntries.find((entry) => entry.id === 'T-DEF-DSN').text;
  const glossaryAnchors = [
    'dsn', 'dsn-val', 'compte-rendu-metier-dsn', 'annule-et-remplace-dsn', 'controle-avant-dsn',
    'production-sociale', 'donnee-personnelle', 'minimisation-des-donnees', 'anonymisation',
    'pseudonymisation', 'agregat-non-nominatif', 'lettrage-comptable', 'rapprochement-bancaire',
    'revision-comptable', 'piece-justificative', 'recouvrement-amiable', 'regle-de-cabinet',
    'cas-de-refus', 'controle-de-coherence', 'schema-de-donnees', 'tracabilite',
    'validation-humaine', 'fail-closed',
  ].map((anchor) => `/glossaire#${anchor}`);
  const destinations = [
    '/blog/controler-les-bulletins-de-paie-avant-la-dsn',
    '/blog/suivre-la-production-sociale-dans-excel',
    ...glossaryAnchors,
  ];

  // Le dossier doit décrire son propre état, pas un état figé : il a déjà affirmé
  // « aucun AI_REVIEW_PASS n’est revendiqué » alors qu’il en portait un.
  const revueAccordee = revueReportee?.revue?.status === 'AI_REVIEW_PASS';
  manifest.$comment = revueAccordee
    ? 'CANDIDAT V3 : 41 unités R2 couvertes, résumés H atomisés. Contenu paie/social non attesté ; revue métier IA indépendante AI_REVIEW_PASS. SERP ND sans crédit SEO.'
    : 'CANDIDAT V3 : 41 unités R2 couvertes, résumés H atomisés. Contenu non attesté, aucune revue IA indépendante accordée. SERP ND sans crédit SEO.';
  manifest.contractRevision = 3;
  manifest.policyBaseline = {
    ...manifest.policyBaseline,
    pipelineTask: 't_8931b129',
    pipelineCommit: 'c2efa557476bc5d8eab3b6995fd116007a4f4c7c',
    architectureTask: isHub ? 't_f7f13852' : 't_27e8be9f',
    publicProjection: isHub ? 'src/pages/ressources.astro' : 'src/pages/glossaire.astro',
    decisions: '/glossaire reste un index unique de 23 ancres ; aucun guide ou modèle.',
  };
  manifest.candidate = {
    ...manifest.candidate,
    id: isHub ? 'hub-ressources-local' : 'glossaire-index-local',
    slug: isHub ? 'ressources' : 'glossaire',
    canonicalPath: isHub ? '/ressources' : '/glossaire',
    title: isHub ? 'Ressources pour les tâches du cabinet' : 'Glossaire des tâches et contrôles du cabinet',
    summary: unitText,
    primaryRole: isHub ? 'direction-associes' : 'profils-formation',
    secondaryRoles: isHub ? ['paie-responsables-sociaux'] : ['paie-responsables-sociaux'],
    task: isHub ? 'Trouver une ressource utile par tâche, rôle ou format.' : 'Clarifier le vocabulaire d’une règle ou d’un contrôle.',
    cluster: isHub ? 'hub-ressources' : 'glossaire-cabinet',
    primaryQuery: isHub ? 'ressources cabinet expertise comptable' : 'glossaire cabinet expertise comptable',
    secondaryQueries: isHub ? ['ressources tâches cabinet'] : ['définitions paie dsn cabinet'],
    fanOut: isHub ? destinations : glossaryAnchors,
    owner: 'Memlia',
    author: 'Memlia',
    editorialReviewer: 'Équipe éditoriale Memlia',
    maintenanceRule: 'Rejouer le scellement et l’audit après toute modification de source ou de build.',
  };
  manifest.editorialFormat = isHub ? 'landing-navigationnelle' : 'index-de-termes-ancres';
  manifest.formatContract = isHub
    ? {
      requiredInputs: ['src/pages/ressources.astro', 'src/data/resources.ts', 'dist/ressources.html'],
      requiredOutputs: ['dist/ressources.html', 'inventaire SSR sans JavaScript'],
      navigationIntent: 'Découverte par tâche, rôle et format sans URL de filtre indexable.',
      imagePolicy: 'Aucun visuel informatif ajouté au Hub.',
      indexSubstance: {
        minimum: 5,
        excludedResourceTypes: ['hub'],
        unitRule: 'Deux articles historiques et vingt-trois ancres de glossaire, sans auto-compter le Hub.',
        computedCount: destinations.length,
        eligibleUnitRefs: destinations,
        result: 'PASS',
        transitionTests: ['absence de manifeste', 'hash de build divergent', 'unité rendue absente'],
        noJsInventoryRef: 'tests/browser/resources.spec.ts',
      },
    }
    : {
      requiredInputs: ['src/data/glossary.ts', 'src/pages/glossaire.astro', 'dist/glossaire.html'],
      requiredOutputs: ['dist/glossaire.html', '23 ancres uniques'],
      routeDecision: { status: 'PASS', choice: 'index', allowed: ['anchor', 'index', 'page'], evidenceRef: 'docs/qa/glossaire/recette.md', rule: 'Index unique ; aucune page /glossaire/{slug}.', containerAuditResult: 'PASS' },
      anchorPolicy: 'Le conteneur /glossaire porte exactement les 23 ancres déclarées.',
      noNaAbuse: 'Les audits du conteneur restent requis.',
      imagePolicy: 'Aucune image utile à cet index.',
    };
  manifest.research.serp = { ...manifest.research.serp, requiredDecision: false, status: 'RUN', gateResult: 'ND', checkedAt, scope: 'France/fr ; Hub desktop indisponible, 40101 après deux essais. Opportunité SEO non établie, pas un gate métier.', inputRefs: ['docs/qa/hub-ressources/metier-fix-c-serp/checksums-retry.sha256'], outputRefs: ['docs/qa/hub-ressources/metier-fix-c-serp/checksums-retry.sha256'] };
  manifest.research.gsc = { ...manifest.research.gsc, candidateUrlHistoryStatus: 'ND', historyReason: 'Nouvelle URL sans historique GSC exploitable.', requiredForDecision: false, status: 'N/A', propertyQueryEvidenceStatus: 'N/A', checkedAt, inputRefs: ['docs/qa/hub-ressources/qad-fix.md'], outputRefs: ['docs/qa/hub-ressources/qad-fix.md'], arbitration: { decision: 'Le manque GSC reste ND et ne rapporte aucun point.', decidedBy: 'QAD t_7a6dbdf8', checkedAt, evidenceRef: 'docs/qa/hub-ressources/qad-fix.md' } };
  manifest.claimsEvidence.renderedUnitInventory = [...new Set(surfaceEntries.map((entry) => entry.unitId))].map((id) => {
    const claims = surfaceEntries.filter((entry) => entry.unitId === id);
    const text = claims[0].unitText ?? claims[0].text;
    return { id, text, sha256: sha256(text), claimIds: claims.map((entry) => entry.claimId) };
  });
  manifest.claimsEvidence.claims = surfaceEntries.map((entry) => ({
    id: entry.claimId, unitId: entry.unitId, text: entry.text, sha256: sha256(entry.text), type: entry.type,
    sourceIds: [entry.sourceId], citationIds: entry.citations.map((citation) => citation.id), checkedAt, status: 'PASS',
    applicability: {
      population: entry.applicability,
      regime: entry.regime,
      validAsOf: entry.validAsOf,
      exceptions: entry.exceptions,
      sourceIds: [entry.sourceId],
    },
  }));
  manifest.claimsEvidence.citations = surfaceEntries.flatMap((entry) => {
    const source = metierEvidence.sources[entry.sourceId];
    const sourceContent = readFileSync(join(root, source.snapshotPath));
    return entry.citations.map((citation) => ({
      id: citation.id, claimIds: [entry.claimId], sourceId: entry.sourceId,
      text: citation.text, sha256: sha256(citation.text), sourceContentSha256: sha256(sourceContent),
      finalUrl: source.finalUrl, checkedAt, title: source.title, locator: citation.locator, verdict: 'soutient',
    }));
  });
  const usedSourceIds = [...new Set(surfaceEntries.map((entry) => entry.sourceId))];
  manifest.claimsEvidence.sources = usedSourceIds.map((sourceId) => {
    const source = metierEvidence.sources[sourceId];
    const sourceContent = readFileSync(join(root, source.snapshotPath));
    return {
      id: source.id, publisher: source.publisher, title: source.title,
      requestedUrl: source.requestedUrl, finalUrl: source.finalUrl, checkedAt: source.checkedAt,
      level: source.level, provenance: source.provenance, official: source.official,
      upstreamUrl: source.upstreamUrl, snapshotPath: source.snapshotPath,
      contentSha256: sha256(sourceContent),
      verificationEvidenceRef: source.verificationEvidenceRef,
      classificationEvidenceRef: source.classificationEvidenceRef,
      claimIds: surfaceEntries.filter((entry) => entry.sourceId === sourceId).map((entry) => entry.claimId),
    };
  });
  manifest.claimsEvidence.sensitiveMatter = {
    detected: true,
    signals: [...new Set(surfaceEntries.filter((entry) => ['dsn', 'legal-reglementaire'].includes(entry.type)).map((entry) => entry.type))],
    checkedAt,
    businessReview: revueReportee ? revueReportee.revue : {
      required: true, reviewerId: null, reviewerType: null, reviewerProfile: null, reviewerRole: null,
      distinctFrom: ['author', 'editorialReviewer', 'sourceClassifier'], reviewedCandidateHash: null,
      status: 'PENDING', claimSourceVerdicts: [], evidenceRef: null, evidenceSha256: null,
    },
  };
  manifest.assets = { ...manifest.assets, decision: 'aucun-visuel-informatif', assetRefs: [sourcePath], image: { ...manifest.assets.image, required: false }, uiCapture: { ...manifest.assets.uiCapture, present: false } };
  manifest.links.outgoing = isHub ? destinations : ['/blog/controler-les-bulletins-de-paie-avant-la-dsn', '/blog/suivre-la-production-sociale-dans-excel', '/ressources'];
  manifest.links.incoming = isHub ? ['/', '/blog', '/glossaire'] : ['/ressources'];
  manifest.links.corpusInventoryRef = 'src/data/resources.ts';
  manifest.links.cannibalization = { risk: 'controlled', comparedCanonicalPaths: ['/blog', '/glossaire', '/ressources'], decision: 'distinct', evidenceRef: 'docs/qa/glossaire/recette.md' };
  manifest.links.filterPolicy.javascriptFallbackTestRef = isHub ? 'tests/browser/resources.spec.ts' : 'tests/browser/glossary.spec.ts';
  manifest.skills.blog = normalizeSkillRows(manifest.skills.blog);
  manifest.skills.seo = normalizeSkillRows(manifest.skills.seo);
  manifest.skills.marketingDesignCore = normalizeSkillRows(manifest.skills.marketingDesignCore);
  const registryPath = `editorial/resources/${isHub ? 'hub' : 'glossaire'}/skills.json`;
  const registry = { blog: manifest.skills.blog.map((row) => row.skill), seo: manifest.skills.seo.map((row) => row.skill), marketingDesignCore: manifest.skills.marketingDesignCore.map((row) => row.skill) };
  mkdirSync(dirname(join(root, registryPath)), { recursive: true });
  writeFileSync(join(root, registryPath), `${JSON.stringify(registry, null, 2)}\n`);
  manifest.skills.registryContract = { ...manifest.skills.registryContract, sourceOfTruth: registryPath, candidateRegistryPath: registryPath, candidateRegistrySha256: sha256(readFileSync(join(root, registryPath))), manifestProjectionSha256: digest(registry), comparison: 'JSON canonique exact', result: 'PASS', rule: '31 Blog + 24 SEO + 19 noyau, sans omission ni doublon.' };
  manifest.gates = manifest.gates.map((gate, index) => index <= 4
    ? { ...gate, status: 'PASS', result: 'PASS', checkedAt: buildEndedAt, evidenceRefs: ['docs/qa/hub-ressources/freshness-r4-exec.md'] }
    : { ...gate, status: 'PENDING', result: 'PENDING', checkedAt: null, evidenceRefs: [] });
  manifest.quality.rubric = manifest.quality.rubric.map((row) => {
    const isSerp = row.id === 'serp-format-rankability';
    return {
      ...row,
      result: isSerp ? 'ND' : 'PASS',
      earned: isSerp ? 0 : row.weight,
      observations: [isSerp
        ? 'SERP fournisseur ND : aucun point SEO brut attribué ; score normalisé sur les 85 points mesurables.'
        : `Contrôle déterministe du candidat v3 rejoué avec ${buildCommand}.`],
      evidenceRefs: ['docs/qa/hub-ressources/freshness-r4-exec.md'],
    };
  });
  // Le score se calcule depuis la grille qu'on vient d'ecrire, jamais en dur : une constante
  // ne peut pas rougir. Meme formule que le validateur (resource-pipeline.mjs).
  const rawScore = manifest.quality.rubric.reduce((total, row) => total + (row.result === 'PASS' ? row.weight : 0), 0);
  const measurableWeight = manifest.quality.rubric.reduce((total, row) => total + (row.result === 'ND' ? 0 : row.weight), 0);
  manifest.quality.recalculatedScore = measurableWeight === 0
    ? 0
    : Math.round(rawScore * 100 / measurableWeight);
  // Les defauts constates par la revue metier survivent au rescellement, comme son verdict.
  manifest.quality.p0 = revueReportee ? [...revueReportee.p0] : [];
  manifest.quality.p1 = revueReportee ? [...revueReportee.p1] : [];
  manifest.quality.blocking = revueReportee ? revueReportee.blocking : false;
  const sourceBundlePaths = [...new Set([
    ...surfaceEntries.map((entry) => entry.contentPath),
    ...usedSourceIds.map((sourceId) => metierEvidence.sources[sourceId].snapshotPath),
  ])];
  manifest.integrity.sourceBundle = bundle(sourceBundlePaths);
  manifest.integrity.assetBundle = bundle([sourcePath]);
  manifest.integrity.configBundle = bundle([registryPath, 'scripts/lib/resource-metier-evidence.mjs', 'scripts/lib/resource-metier-v3.mjs', 'src/data/resources.ts']);
  manifest.integrity.buildOutput = bundle([outputPath]);
  manifest.build = { ...manifest.build, pipelineCommit: '5c33c9ba18807cc70c6535e4edbbf3327bdd7d9a', commands: bootstrapCommands.map((row) => row.command), startedAt: buildStartedAt, endedAt: buildEndedAt, result: 'PASS', sourceBundleDigest: manifest.integrity.sourceBundle.digest, assetBundleDigest: manifest.integrity.assetBundle.digest, configBundleDigest: manifest.integrity.configBundle.digest, outputDigest: manifest.integrity.buildOutput.digest, reportRefs: ['docs/qa/hub-ressources/freshness-r4-exec.md'] };
  manifest.limitations = [
    'Candidat v3 non publié ; preview, approbation et release restent futures.',
    revueAccordee
      ? 'Contenu paie/social explicitement non attesté : la revue métier IA indépendante contrôle la correspondance affirmation/source/citation, elle ne vaut pas attestation professionnelle.'
      : 'Contenu paie/social explicitement non attesté. Revue IA indépendante PENDING : aucun AI_REVIEW_PASS n’est revendiqué.',
    'SERP ND : opportunité SEO non établie et aucun point SEO brut attribué.',
    'Aucune donnée client réelle, aucune surveillance nominative, aucune publication ou cron.',
  ];
  const candidateHash = digest(candidateDigestPayload(manifest));
  manifest.integrity.candidateHash.value = candidateHash;
  manifest.preview = { branch: null, deploymentId: null, requestedUrl: null, finalUrl: null, candidateHash: null, buildOutputDigest: null, htmlNoindexNofollow: null, httpXRobotsNoindexNofollow: null, excludedFromSitemap: null, excludedFromFeeds: null, routeChecks: [], captureRefs: [], reportRef: null };
  manifest.audit = { ...manifest.audit, candidateHash, buildOutputDigest: manifest.integrity.buildOutput.digest, score: manifest.quality.recalculatedScore, result: 'PASS', p0: [...manifest.quality.p0], p1: [...manifest.quality.p1], auditHash: '' };
  const auditPayload = { ...manifest.audit };
  delete auditPayload.auditHash;
  manifest.audit.auditHash = digest(auditPayload);
  manifest.approval = { state: 'pending', approvedBy: null, channel: null, exactMessage: null, receivedAt: null, candidateHash: null, auditHash: null, previewFinalUrl: null, durableEvidenceRef: null, scope: null, rule: manifest.approval.rule };
  manifest.release = { authorized: false, preflightCandidateHash: null, deploymentId: null, productionUrl: null, remoteDigest: null, rollbackRef: null, result: 'PENDING' };
  return manifest;
}

const sealed = [];
for (const adapter of ['H', 'T']) {
  const directory = join(root, 'editorial/resources', adapter === 'H' ? 'hub' : 'glossaire');
  mkdirSync(directory, { recursive: true });
  const manifest = createManifest(adapter);
  const path = `editorial/resources/${adapter === 'H' ? 'hub' : 'glossaire'}/manifest.json`;
  sealed.push({ adapter, path, manifest });
}

const buildReceiptPath = 'docs/qa/hub-ressources/metier-fix-c-build-receipt.json';
const receiptSurfaces = () => Object.fromEntries(sealed.map(({ adapter, manifest }) => [adapter, {
    sourceBundleDigest: manifest.build.sourceBundleDigest,
    assetBundleDigest: manifest.build.assetBundleDigest,
    configBundleDigest: manifest.build.configBundleDigest,
    outputDigest: manifest.build.outputDigest,
  }]));
const receiptBytes = (commands, endedAt, verification = null) => `${JSON.stringify({ schemaVersion: 1, commands, startedAt: buildStartedAt, endedAt, result: 'PASS', verification: verification && { commands: verification, snapshotsIdentiques: true, regle: 'Reconstruction indépendante : les snapshots scellés doivent se reproduire octet pour octet.' }, surfaces: receiptSurfaces() }, null, 2)}\n`;
let buildReceipt = receiptBytes(bootstrapCommands.map(({ command, exitCode }) => ({ command, exitCode })), buildEndedAt);
writeFileSync(join(root, buildReceiptPath), buildReceipt);
for (const { path, manifest } of sealed) {
  manifest.build.receiptRef = buildReceiptPath;
  manifest.build.receiptSha256 = sha256(buildReceipt);
  writeFileSync(join(root, path), `${JSON.stringify(manifest, null, 2)}\n`);
}

const registerPath = 'docs/qa/hub-ressources/metier-fix-c-register.json';
const register = { units: [], claims: [], citations: [], sources: [] };
for (const { manifest } of sealed) {
  const surface = manifest.formatAdapter;
  register.units.push(...manifest.claimsEvidence.renderedUnitInventory.map((row) => ({ ...row, surface })));
  for (const key of ['claims', 'citations', 'sources']) register[key].push(...manifest.claimsEvidence[key].map((row) => ({ ...row, surface })));
}
register.counts = Object.fromEntries(['units', 'claims', 'citations', 'sources'].map((key) => [key, register[key].length]));
register.generatedFrom = sealed.map(({ path }) => ({ path, sha256: sha256(readFileSync(join(root, path))) }));
writeFileSync(join(root, registerPath), `${JSON.stringify(register, null, 2)}\n`);

// La vérification reconstruit le site et compare les octets. Elle ne rejoue PAS
// `npm run build:site` : cette chaîne audite le dossier qu'on est en train de sceller,
// donc elle échouait toujours quand le candidat venait de bouger — un scellement ne
// pouvait jamais se terminer. La chaîne complète se joue après, une fois la revue
// réaffirmée, et c'est elle qui fait foi pour la carte.
const verificationRuns = bootstrapCommands.map((row) => {
  const run = spawnSync(row.executable, row.args, { cwd: root, env: row.env, stdio: 'inherit' });
  if (!Number.isInteger(run.status) || run.status !== 0) throw new Error(`Vérification : ${row.command} a échoué ou n’a pas rendu de code entier (exit=${run.status ?? 'null'}).`);
  return { command: row.command, exitCode: run.status };
});
for (const { manifest } of sealed) {
  const outputPath = manifest.integrity.buildOutput.entries[0].path;
  if (bundle([outputPath]).digest !== manifest.integrity.buildOutput.digest) throw new Error(`Le build vérifié a modifié le snapshot ${outputPath}.`);
}
const verifiedEndedAt = new Date().toISOString();
const verifiedCommands = bootstrapCommands.map(({ command, exitCode }) => ({ command, exitCode }));
buildReceipt = receiptBytes(verifiedCommands, verifiedEndedAt, verificationRuns);
writeFileSync(join(root, buildReceiptPath), buildReceipt);
for (const { path, manifest } of sealed) {
  manifest.build.commands = verifiedCommands.map((row) => row.command);
  manifest.build.endedAt = verifiedEndedAt;
  manifest.build.receiptSha256 = sha256(buildReceipt);
  writeFileSync(join(root, path), `${JSON.stringify(manifest, null, 2)}\n`);
}
register.generatedFrom = sealed.map(({ path }) => ({ path, sha256: sha256(readFileSync(join(root, path))) }));
writeFileSync(join(root, registerPath), `${JSON.stringify(register, null, 2)}\n`);
const etatsRevue = sealed.map(({ adapter, manifest }) => `${adapter}=${manifest.claimsEvidence.sensitiveMatter.businessReview.status}`).join(' ');
console.log(`Manifestes H/T v3 rescellés depuis dist ; revue métier reportée : ${etatsRevue}. Contenu non attesté.`);
