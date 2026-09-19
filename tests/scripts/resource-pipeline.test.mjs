import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import {
  auditResourceInventory,
  auditResourceManifestFile,
  validateResourceManifest,
} from '../../scripts/lib/resource-pipeline.mjs';
import { createResourceFixture, RESOURCE_CORE_SKILLS, RESOURCE_ROLES } from './resource-fixture.mjs';

const clone = (value) => structuredClone(value);
const withFixture = (adapter, run) => {
  const root = mkdtempSync(join(tmpdir(), `memlia-resource-${adapter}-`));
  try {
    return run(createResourceFixture(root, adapter), root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
};
const errorsFor = (manifest, root) => validateResourceManifest(manifest, { root }).errors;
const hasError = (errors, fragment) => errors.some((error) => error.includes(fragment));

for (const phase of ['qa', 'preview', 'approval', 'release']) {
  test(`la phase ${phase} accepte uniquement son état nominal séquentiel`, () => withFixture('H', (_, root) => {
    const manifest = createResourceFixture(root, 'H', phase);
    const report = validateResourceManifest(manifest, { root, phase });
    assert.equal(report.pass, true, report.errors.join('\n'));
    assert.equal(report.phase, phase);
  }));
}

test('les phases conservent les hashes du candidat et de l’audit exacts', () => withFixture('H', (_, root) => {
  const manifests = ['qa', 'preview', 'approval', 'release'].map((phase) => createResourceFixture(root, 'H', phase));
  assert.equal(new Set(manifests.map((manifest) => manifest.integrity.candidateHash.value)).size, 1);
  assert.equal(new Set(manifests.map((manifest) => manifest.audit.auditHash)).size, 1);
}));

test('chaque phase refuse une preuve future préremplie', () => {
  for (const [phase, mutate, expected] of [
    ['qa', (manifest) => { manifest.preview.finalUrl = 'https://preview.fixture.invalid/ressources'; }, 'preview prématurée'],
    ['preview', (manifest) => { manifest.approval.approvedBy = 'Kevin'; }, 'approbation prématurée'],
    ['approval', (manifest) => { manifest.release.remoteDigest = 'a'.repeat(64); }, 'release prématurée'],
  ]) {
    withFixture('H', (_, root) => {
      const manifest = createResourceFixture(root, 'H', phase);
      mutate(manifest);
      const errors = validateResourceManifest(manifest, { root, phase }).errors;
      assert.ok(hasError(errors, expected), phase);
      assert.ok(hasError(errors, 'Schéma'), `${phase}: le schéma brut a accepté un état partiel`);
    });
  }
});

test('un champ requis de la phase courante reste bloquant', () => {
  withFixture('H', (_, root) => {
    const preview = createResourceFixture(root, 'H', 'preview');
    preview.preview.deploymentId = null;
    assert.ok(hasError(validateResourceManifest(preview, { root, phase: 'preview' }).errors, 'preview.deploymentId'));
  });
  withFixture('H', (_, root) => {
    const release = createResourceFixture(root, 'H', 'release');
    release.release.remoteDigest = null;
    assert.ok(hasError(validateResourceManifest(release, { root, phase: 'release' }).errors, 'release.remoteDigest'));
  });
});

test('la QA du candidat courant ne réclame ni preview, ni GO, ni release', () => {
  for (const directory of ['glossaire']) {
    const path = join(process.cwd(), 'editorial/resources', directory, 'manifest.json');
    const report = auditResourceManifestFile(path, { root: process.cwd(), phase: 'qa' });
    // Depuis le scellement de la revue metier du 16/09/2026, la QA passe. Ce test garde son
    // role : verifier qu aucune exigence de preview, de GO ou de release ne fuit dans la QA.
    assert.equal(report.pass, true, report.errors.join('\n'));
    assert.equal(hasError(report.errors, 'agent IA'), false, report.errors.join('\n'));
    assert.equal(hasError(report.errors, 'preview exige'), false, report.errors.join('\n'));
    assert.equal(hasError(report.errors, 'GO Kevin'), false, report.errors.join('\n'));
    assert.equal(hasError(report.errors, 'release exige'), false, report.errors.join('\n'));
    assert.equal(hasError(report.errors, 'prématurée'), false, report.errors.join('\n'));
    assert.equal(hasError(report.errors, 'candidateHash doit être recalculé'), false, report.errors.join('\n'));
    assert.equal(hasError(report.errors, 'audit.candidateHash diverge'), false, report.errors.join('\n'));
  }
});

test('la CLI exige une phase explicite et refuse une phase inconnue', () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-resource-cli-'));
  const script = join(process.cwd(), 'scripts/resource-pipeline.mjs');
  try {
    const missing = spawnSync(process.execPath, [script, 'audit'], { cwd: root, encoding: 'utf8' });
    assert.notEqual(missing.status, 0);
    assert.match(missing.stderr, /--phase qa\|preview\|approval\|release/);

    const unknown = spawnSync(process.execPath, [script, 'audit', '--phase', 'permissive'], { cwd: root, encoding: 'utf8' });
    assert.notEqual(unknown.status, 0);
    assert.match(unknown.stderr, /Phase inconnue/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

for (const adapter of ['H', 'A', 'T', 'G', 'M']) {
  test(`l’adaptateur ${adapter} accepte son manifeste nominal scellé`, () => withFixture(adapter, (manifest, root) => {
    const report = validateResourceManifest(manifest, { root });
    assert.equal(report.pass, true, report.errors.join('\n'));
    assert.equal(report.formatAdapter, adapter);
    assert.deepEqual(report.counts, { blogSkills: 31, seoSkills: 24, coreSkills: 19, gates: 7, renderedUnits: 1, claims: 1, citations: 1, sources: 1, sensitiveVerdictsReportes: 0 });
  }));
}

test('le socle ferme les 12 rôles, les 31+24+19 skills et recalcule le score', () => withFixture('H', (nominal, root) => {
  assert.equal(RESOURCE_ROLES.length, 12);
  assert.equal(RESOURCE_CORE_SKILLS.length, 19);
  const badRole = clone(nominal);
  badRole.candidate.primaryRole = 'autre-role-documente';
  badRole.taxonomy.resourceDiscoveryRoles.push('autre-role-documente');
  assert.ok(hasError(errorsFor(badRole, root), '12 rôles'));

  const missingSkill = clone(nominal);
  missingSkill.skills.blog.pop();
  assert.ok(hasError(errorsFor(missingSkill, root), '31'));

  const fakeScore = clone(nominal);
  fakeScore.quality.rubric[0].result = 'FAIL';
  assert.ok(hasError(errorsFor(fakeScore, root), 'recalculé'));

  const legacyContract = clone(nominal);
  legacyContract.contractRevision = 1;
  assert.ok(hasError(errorsFor(legacyContract, root), 'contractRevision doit valoir 3'));
}));

test('les sept gates G0 à G6 sont présents, ordonnés et PASS', () => withFixture('A', (nominal, root) => {
  const missing = clone(nominal);
  missing.gates.pop();
  assert.ok(hasError(errorsFor(missing, root), 'sept gates'));

  const failing = clone(nominal);
  failing.gates[2].result = 'FAIL';
  assert.ok(hasError(errorsFor(failing, root), 'G2'));
}));

test('la chaîne bidirectionnelle refuse claim omis, citation non soutenante et source T4', () => withFixture('G', (nominal, root) => {
  const omitted = clone(nominal);
  omitted.claimsEvidence.claims = [];
  assert.ok(hasError(errorsFor(omitted, root), 'bidirectionnelle'));

  const contradiction = clone(nominal);
  contradiction.claimsEvidence.citations[0].verdict = 'contredit';
  assert.ok(hasError(errorsFor(contradiction, root), 'soutient'));

  const t4 = clone(nominal);
  t4.claimsEvidence.sources[0].level = 'tier-4';
  assert.ok(hasError(errorsFor(t4, root), 'tier-4'));

  const reverseGhost = clone(nominal);
  reverseGhost.claimsEvidence.sources[0].claimIds.push('claim-fantome');
  reverseGhost.claimsEvidence.citations[0].claimIds.push('claim-fantome');
  assert.ok(hasError(errorsFor(reverseGhost, root), 'bidirectionnelle'));

  const inventedExcerpt = clone(nominal);
  inventedExcerpt.claimsEvidence.citations[0].text = 'Extrait absent de la copie source.';
  inventedExcerpt.claimsEvidence.citations[0].sha256 = createHash('sha256').update(inventedExcerpt.claimsEvidence.citations[0].text).digest('hex');
  assert.ok(hasError(errorsFor(inventedExcerpt, root), 'copie source exacte'));
}));

test('les N/A abusifs et les doublons sont refusés', () => withFixture('T', (nominal, root) => {
  const falseNa = clone(nominal);
  falseNa.skills.blog[0] = { ...falseNa.skills.blog[0], applicable: false, status: 'N/A', result: null, toolOrCommand: null, naReason: 'Pas utile ici.' };
  assert.ok(hasError(errorsFor(falseNa, root), 'N/A'));

  const duplicateQuery = clone(nominal);
  duplicateQuery.candidate.secondaryQueries = [duplicateQuery.candidate.primaryQuery];
  assert.ok(hasError(errorsFor(duplicateQuery, root), 'distinctes'));

  const duplicateSecondaryQuery = clone(nominal);
  duplicateSecondaryQuery.candidate.secondaryQueries = ['requête secondaire', 'requête secondaire'];
  assert.ok(hasError(errorsFor(duplicateSecondaryQuery, root), 'uniques'));

  const duplicateSource = clone(nominal);
  duplicateSource.claimsEvidence.sources.push(clone(duplicateSource.claimsEvidence.sources[0]));
  assert.ok(hasError(errorsFor(duplicateSource, root), 'dupliqué'));
}));

test('un fichier cassé, un digest faux et un hash modifié après GO ferment le gate', () => withFixture('M', (nominal, root) => {
  writeFileSync(join(root, 'fixtures/model.xlsx'), 'cassé');
  assert.ok(hasError(errorsFor(nominal, root), 'fixtures/model.xlsx'));

  const badDigest = clone(nominal);
  badDigest.integrity.sourceBundle.digest = '0'.repeat(64);
  assert.ok(hasError(errorsFor(badDigest, root), 'sourceBundle.digest'));

  const changedAfterGo = clone(nominal);
  changedAfterGo.candidate.summary = 'Le contenu a changé après le GO exact de Kevin.';
  assert.ok(hasError(errorsFor(changedAfterGo, root), 'candidateHash'));

  const changedClaimAfterGo = clone(nominal);
  changedClaimAfterGo.claimsEvidence.claims[0].text = 'Le claim a changé après le GO exact de Kevin.';
  changedClaimAfterGo.claimsEvidence.claims[0].sha256 = createHash('sha256').update(changedClaimAfterGo.claimsEvidence.claims[0].text).digest('hex');
  assert.ok(hasError(errorsFor(changedClaimAfterGo, root), 'candidateHash'));

  const placeholderGo = clone(nominal);
  placeholderGo.approval.exactMessage = 'GO candidateHash auditHash previewFinalUrl';
  assert.ok(hasError(errorsFor(placeholderGo, root), 'valeurs candidateHash'));

  const divergentRemote = clone(nominal);
  divergentRemote.release.remoteDigest = 'f'.repeat(64);
  assert.ok(hasError(errorsFor(divergentRemote, root), 'build distant exact'));
}));

test('des timestamps frais sans reçu de build hashé ne peuvent pas déclarer PASS', () => withFixture('H', (nominal, root) => {
  const timestampOnly = clone(nominal);
  timestampOnly.build.startedAt = new Date(Date.now() - 1_000).toISOString();
  timestampOnly.build.endedAt = new Date().toISOString();
  delete timestampOnly.build.receiptRef;
  delete timestampOnly.build.receiptSha256;

  const errors = errorsFor(timestampOnly, root);
  assert.ok(hasError(errors, 'reçu de build'), errors.join('\n'));
}));

test('le Hub exclut son propre type, exige cinq destinations et garde ses filtres non indexables', () => withFixture('H', (nominal, root) => {
  const selfCounted = clone(nominal);
  selfCounted.formatContract.indexSubstance.eligibleUnitRefs = ['/blog/a', '/blog/b', '/guides/c', '/modeles/d', '/ressources'];
  assert.ok(hasError(errorsFor(selfCounted, root), 'auto-compté'));

  const thin = clone(nominal);
  thin.formatContract.indexSubstance.eligibleUnitRefs.pop();
  thin.formatContract.indexSubstance.computedCount = 4;
  assert.ok(hasError(errorsFor(thin, root), 'cinq'));

  const indexableFilter = clone(nominal);
  indexableFilter.links.filterPolicy.queryVariantsNoindexFollow = false;
  assert.ok(hasError(errorsFor(indexableFilter, root), 'filtre'));
}));

test('GSC reste distinct de SERP : Article exige RUN/PASS, Hub exige ND arbitré', () => {
  withFixture('A', (nominal, root) => {
    nominal.research.gsc.status = 'N/A';
    nominal.research.gsc.result = null;
    assert.ok(hasError(errorsFor(nominal, root), 'Article'));
  });
  withFixture('H', (nominal, root) => {
    const impossibleDate = clone(nominal);
    impossibleDate.research.gsc.arbitration.checkedAt = '2026-02-31T12:00:00Z';
    assert.ok(hasError(errorsFor(impossibleDate, root), 'arbitrage daté'));

    nominal.research.gsc.arbitration = null;
    assert.ok(hasError(errorsFor(nominal, root), 'arbitrage'));
  });
});

test('le terme choisit exactement ancre ou page sans rendre le conteneur N/A', () => withFixture('T', (nominal, root) => {
  const both = clone(nominal);
  both.formatContract.routeDecision.choice = 'anchor+page';
  assert.ok(hasError(errorsFor(both, root), 'anchor | index | page'));

  const index = clone(nominal);
  index.candidate.canonicalPath = '/glossaire';
  index.candidate.fanOut = ['/glossaire#fixture-terme'];
  index.formatContract.routeDecision.choice = 'index';
  assert.equal(hasError(errorsFor(index, root), 'Index des termes'), false);

  const hiddenContainer = clone(nominal);
  hiddenContainer.formatContract.routeDecision.containerAuditResult = 'N/A';
  assert.ok(hasError(errorsFor(hiddenContainer, root), 'conteneur'));
}));

test('guide et modèle exigent leurs oracles réellement PASS et le modèle reste ouvert sans macros, liens ou PII', () => {
  withFixture('G', (nominal, root) => {
    nominal.formatContract.procedure.replayResult = 'FAIL';
    assert.ok(hasError(errorsFor(nominal, root), 'rejouée'));
  });
  withFixture('M', (nominal, root) => {
    nominal.formatContract.download.containsMacros = true;
    nominal.formatContract.openAccess = false;
    nominal.formatContract.oracle.formulas = 'FAIL';
    const errors = errorsFor(nominal, root);
    assert.ok(hasError(errors, 'macros'));
    assert.ok(hasError(errors, 'capture email'));
    assert.ok(hasError(errors, 'formulas'));
  });
});

test('la matière sensible exige une source primaire officielle et une revue IA du profil métier distinct', () => withFixture('A', (nominal, root) => {
  const noOfficial = clone(nominal);
  noOfficial.claimsEvidence.sources[0].official = false;
  assert.ok(hasError(errorsFor(noOfficial, root), 'primaire officielle'));

  const selfReview = clone(nominal);
  selfReview.claimsEvidence.sensitiveMatter.businessReview.reviewerId = selfReview.candidate.author;
  assert.ok(hasError(errorsFor(selfReview, root), 'distinct'));

  const wrongProfile = clone(nominal);
  wrongProfile.claimsEvidence.sensitiveMatter.businessReview.reviewerProfile = 'dev';
  assert.ok(hasError(errorsFor(wrongProfile, root), 'profil metier'));

  const inventedProfessionalRole = clone(nominal);
  inventedProfessionalRole.claimsEvidence.sensitiveMatter.businessReview.reviewerRole = 'expert-comptable-humain';
  assert.ok(hasError(errorsFor(inventedProfessionalRole, root), 'rôle interne'));

  const untraceableReviewer = clone(nominal);
  untraceableReviewer.claimsEvidence.sensitiveMatter.businessReview.reviewerId = 'metier';
  assert.ok(hasError(errorsFor(untraceableReviewer, root), 'carte Kanban'));

  const divergentSubject = clone(nominal);
  divergentSubject.claimsEvidence.sensitiveMatter.businessReview.reviewedCandidateHash = '0'.repeat(64);
  assert.ok(hasError(errorsFor(divergentSubject, root), 'candidat exact'));

  const legacyVerdict = clone(nominal);
  legacyVerdict.claimsEvidence.sensitiveMatter.businessReview.status = 'PASS';
  assert.ok(hasError(errorsFor(legacyVerdict, root), 'AI_REVIEW_PASS'));

  const missingEvidence = clone(nominal);
  missingEvidence.claimsEvidence.sensitiveMatter.businessReview.evidenceRef = 'fixtures/absent-review.json';
  assert.ok(hasError(errorsFor(missingEvidence, root), 'preuve de revue IA'));

  const divergentEvidence = clone(nominal);
  divergentEvidence.claimsEvidence.sensitiveMatter.businessReview.evidenceSha256 = 'f'.repeat(64);
  assert.ok(hasError(errorsFor(divergentEvidence, root), 'preuve de revue IA'));

  const untraceableVerdict = clone(nominal);
  untraceableVerdict.claimsEvidence.sensitiveMatter.businessReview.claimSourceVerdicts[0].citationIds = [];
  assert.ok(hasError(errorsFor(untraceableVerdict, root), 'traçable'));

  const staleSource = clone(nominal);
  staleSource.claimsEvidence.sources[0].checkedAt = '2026-09-12T23:30:00+01:00';
  assert.ok(hasError(errorsFor(staleSource, root), 'copie source périmée'));

  const sourceOlderThan24Hours = clone(nominal);
  sourceOlderThan24Hours.claimsEvidence.sources[0].checkedAt = '2026-09-13T00:00:00+14:00';
  assert.ok(hasError(errorsFor(sourceOlderThan24Hours, root), 'plus de 24 heures'));

  const staleClaim = clone(nominal);
  staleClaim.claimsEvidence.claims[0].checkedAt = '2026-09-12T23:30:00+01:00';
  assert.ok(hasError(errorsFor(staleClaim, root), 'contrôle périmé'));

  const reviewAfterGo = clone(nominal);
  reviewAfterGo.claimsEvidence.sensitiveMatter.checkedAt = '2026-09-13T23:30:00+01:00';
  assert.ok(hasError(errorsFor(reviewAfterGo, root), 'dates ISO valides et ordonnées'));

  const hiddenSensitiveTitle = clone(nominal);
  hiddenSensitiveTitle.claimsEvidence.sensitiveMatter.detected = false;
  hiddenSensitiveTitle.claimsEvidence.claims[0].type = 'fixture';
  hiddenSensitiveTitle.candidate.primaryRole = 'direction-associes';
  hiddenSensitiveTitle.candidate.secondaryRoles = [];
  hiddenSensitiveTitle.candidate.cluster = 'pilotage';
  hiddenSensitiveTitle.claimsEvidence.renderedUnitInventory[0].text = 'Contenu fictif neutre.';
  hiddenSensitiveTitle.claimsEvidence.renderedUnitInventory[0].sha256 = createHash('sha256').update('Contenu fictif neutre.').digest('hex');
  hiddenSensitiveTitle.claimsEvidence.claims[0].text = 'Affirmation fictive neutre.';
  hiddenSensitiveTitle.claimsEvidence.claims[0].sha256 = createHash('sha256').update('Affirmation fictive neutre.').digest('hex');
  hiddenSensitiveTitle.candidate.title = 'Calendrier fiscal fictif';
  assert.ok(hasError(errorsFor(hiddenSensitiveTitle, root), 'redétection'));

  const unbundledSource = clone(nominal);
  unbundledSource.integrity.sourceBundle.entries = [];
  assert.ok(hasError(errorsFor(unbundledSource, root), 'hors du bundle'));
}));

test('P1-04 retire population, régime, validAsOf ou exception d’un claim sensible et exige FAIL', () => withFixture('A', (nominal, root) => {
  for (const field of ['population', 'regime', 'validAsOf', 'exceptions']) {
    const omitted = clone(nominal);
    delete omitted.claimsEvidence.claims[0].applicability[field];
    const report = validateResourceManifest(omitted, { root });
    assert.equal(report.pass, false, `${field}: omission acceptée`);
    assert.ok(hasError(report.errors, 'applicabilité métier'), `${field}: refus non attribué au contrat d’applicabilité`);
  }

  const staleCorpusDate = clone(nominal);
  staleCorpusDate.claimsEvidence.claims[0].applicability.validAsOf = '2026-09-12';
  assert.ok(hasError(errorsFor(staleCorpusDate, root), 'validAsOf doit correspondre au checkedAt'));

  const uncheckedAfterSnapshot = clone(nominal);
  uncheckedAfterSnapshot.claimsEvidence.claims[0].checkedAt = '2026-09-12T23:59:59Z';
  assert.ok(hasError(errorsFor(uncheckedAfterSnapshot, root), 'validAsOf doit correspondre au checkedAt'));
}));

test('l’image exige image_generate, alt descriptif et capture UI uniquement issue du banc fictif', () => withFixture('H', (nominal, root) => {
  const fakeImage = clone(nominal);
  fakeImage.assets.image.engine = 'sharp';
  fakeImage.assets.image.alt = 'image.png';
  assert.ok(hasError(errorsFor(fakeImage, root), 'image_generate'));
  assert.ok(hasError(errorsFor(fakeImage, root), 'alt'));

  const fakeUi = clone(nominal);
  fakeUi.assets.uiCapture = { present: true, allowedProvenance: 'image_generate', datasetId: 'fixture', captureEvidenceRef: 'fixture://ui', sha256: 'a'.repeat(64) };
  assert.ok(hasError(errorsFor(fakeUi, root), 'banc Windows'));

  const unboundOg = clone(nominal);
  unboundOg.assets.image.ogSha256 = 'f'.repeat(64);
  assert.ok(hasError(errorsFor(unboundOg, root), 'OG'));
}));

test('l’audit de fichier transforme JSON cassé en rapport FAIL contrôlé', () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-resource-json-'));
  try {
    const path = join(root, 'manifest.json');
    writeFileSync(path, '{ cassé');
    const report = auditResourceManifestFile(path, { root });
    assert.equal(report.pass, false);
    assert.ok(hasError(report.errors, 'JSON invalide'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('l’audit de corpus compte les PASS et FAIL par adaptateur sans masquer un JSON cassé', () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-resource-audit-'));
  try {
    const valid = createResourceFixture(root, 'H');
    const validPath = join(root, 'editorial/resources/hub-fixture/manifest.json');
    const brokenPath = join(root, 'editorial/resources/guide-casse/manifest.json');
    const missingPath = join(root, 'editorial/resources/terme-sans-manifeste/manifest.json');
    mkdirSync(join(validPath, '..'), { recursive: true });
    mkdirSync(join(brokenPath, '..'), { recursive: true });
    mkdirSync(join(missingPath, '..'), { recursive: true });
    writeFileSync(validPath, `${JSON.stringify(valid, null, 2)}\n`);
    writeFileSync(brokenPath, '{ cassé');

    const report = auditResourceInventory({ root });
    assert.equal(report.pass, false);
    assert.deepEqual(report.counts, {
      discovered: 3,
      passed: 1,
      failed: 2,
      byAdapter: { H: 1, A: 0, T: 0, G: 0, M: 0, invalid: 2 },
      surfaces: { discovered: 0, linked: 0, unlinked: 0 },
    });
    assert.equal(report.manifests.length, 3);
    assert.ok(report.manifests.some((manifest) => manifest.path.endsWith('terme-sans-manifeste/manifest.json') && hasError(manifest.errors, 'JSON invalide')));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('l’oracle exécute et refuse exactement les 24 témoins W01 à W24', () => {
  const cases = [
    ['W01-claim-omis', 'H', (m) => { m.claimsEvidence.renderedUnitInventory = []; }],
    ['W02-source-non-soutenante', 'H', (m) => { m.claimsEvidence.citations[0].verdict = 'contredit'; }],
    ['W03-source-t4-echo', 'H', (m) => { m.claimsEvidence.sources[0].level = 'tier-4'; }],
    ['W04-faux-na', 'H', (m) => { m.skills.blog[0].status = 'N/A'; }],
    ['W05-duplicat-intent', 'H', (m) => { m.candidate.secondaryQueries = [m.candidate.primaryQuery]; }],
    ['W06-fichier-casse', 'G', (m) => { m.build.result = 'FAIL'; }],
    ['W07-macros-liens-pii', 'M', (m) => { m.formatContract.download.containsMacros = true; }],
    ['W08-hash-apres-go', 'H', (m) => { m.approval.candidateHash = '0'.repeat(64); }],
    ['W09-index-creux', 'H', (m) => { m.formatContract.indexSubstance.computedCount = 4; }],
    ['W10-filtre-indexable', 'H', (m) => { m.links.filterPolicy.queryVariantsNoindexFollow = false; }],
    ['W11-sensible-auto-review', 'A', (m) => { m.claimsEvidence.sensitiveMatter.businessReview.reviewerId = m.candidate.author; }],
    ['W12-fausse-provenance-image', 'H', (m) => { m.assets.image.generationId = ''; }],
    ['W13-fausse-ui', 'H', (m) => { m.assets.uiCapture.allowedProvenance = 'image-generated-ui'; }],
    ['W14-alt-charabia', 'H', (m) => { m.assets.image.alt = 'image.png'; }],
    ['W15-preview-indexable', 'H', (m) => { m.preview.htmlNoindexNofollow = false; }],
    ['W16-score-saisi', 'H', (m) => { m.quality.recalculatedScore = 89; }],
    ['W17-hub-serp-gsc-silencieux', 'H', (m) => { m.research.gsc.candidateUrlHistoryStatus = 'N/A'; }],
    ['W18-terme-ancre-page', 'T', (m) => { m.candidate.canonicalPath = '/glossaire/fixture'; }],
    ['W19-go-vague', 'H', (m) => { m.approval.exactMessage = 'go'; }],
    ['W20-promise-scope', 'H', (m) => { m.candidate.summary = 'Catalogue de modules avec surveillance nominative.'; }],
    ['W21-hub-auto-compte', 'H', (m) => { m.formatContract.indexSubstance.eligibleUnitRefs = ['/blog/a', '/blog/b', '/guides/c', '/modeles/d', '/ressources']; }],
    ['W22-role-historique-navigation', 'H', (m) => { m.taxonomy.resourceDiscoveryRoles.push('autre-role-documente'); }],
    ['W23-registre-skills-divergent', 'H', (m) => { m.skills.registryContract.result = 'FAIL'; }],
    ['W24-p1-absent', 'H', (m) => { m.quality.p1 = null; }],
  ];
  assert.equal(cases.length, 24);
  assert.equal(new Set(cases.map(([id]) => id)).size, 24);
  for (const [id, adapter, mutate] of cases) {
    withFixture(adapter, (nominal, root) => {
      const mutated = clone(nominal);
      mutate(mutated);
      assert.notDeepEqual(mutated, nominal, `${id}: mutation non appliquée`);
      assert.equal(validateResourceManifest(mutated, { root }).pass, false, `${id}: mutation acceptée`);
    });
  }
});

test('les 13 blocs critiques vides et les six états P0/P1 absent, null ou présent ferment le gate', () => withFixture('H', (nominal, root) => {
  const blocks = ['candidate', 'research', 'claimsEvidence', 'assets', 'links', 'skills', 'quality', 'integrity', 'build', 'preview', 'audit', 'approval', 'release'];
  for (const block of blocks) {
    const mutated = clone(nominal);
    mutated[block] = {};
    assert.equal(validateResourceManifest(mutated, { root }).pass, false, `${block}: bloc vide accepté`);
  }
  for (const field of ['p0', 'p1']) {
    for (const state of ['absent', 'null', 'present']) {
      const mutated = clone(nominal);
      if (state === 'absent') delete mutated.quality[field];
      else mutated.quality[field] = state === 'null' ? null : [`fixture-${field}`];
      assert.equal(validateResourceManifest(mutated, { root }).pass, false, `${field}/${state}: état accepté`);
    }
  }
}));

test('la matière sensible est redétectée depuis le rôle et le rendu', () => withFixture('A', (nominal, root) => {
  nominal.claimsEvidence.sensitiveMatter.detected = false;
  nominal.claimsEvidence.claims[0].type = 'fixture';
  nominal.candidate.secondaryRoles = ['juridique-fiscal'];
  assert.ok(hasError(errorsFor(nominal, root), 'redétection'));
}));

test('la revue sensible, l’arbitrage GSC et l’état sans candidat ne produisent pas de faux vert', () => {
  withFixture('A', (nominal, root) => {
    nominal.claimsEvidence.sensitiveMatter.businessReview.reviewerType = 'human';
    assert.ok(hasError(errorsFor(nominal, root), 'agent IA'));
  });
  withFixture('H', (nominal, root) => {
    nominal.research.gsc.arbitration.checkedAt = null;
    assert.ok(hasError(errorsFor(nominal, root), 'arbitrage daté'));
  });
  const root = mkdtempSync(join(tmpdir(), 'memlia-resource-empty-'));
  try {
    const report = auditResourceInventory({ root });
    assert.equal(report.pass, true);
    assert.equal(report.result, 'NO_CANDIDATE');
    assert.equal(report.candidateValidated, false);
    assert.equal(report.counts.discovered, 0);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('une surface H ou T rendue sans manifeste exact ferme l’audit du build', () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-resource-rendered-without-manifest-'));
  try {
    mkdirSync(join(root, 'dist'), { recursive: true });
    writeFileSync(join(root, 'dist/ressources.html'), '<!doctype html><title>Ressources</title>');
    writeFileSync(join(root, 'dist/glossaire.html'), '<!doctype html><title>Glossaire</title>');

    const report = auditResourceInventory({ root });

    assert.equal(report.pass, false);
    assert.equal(report.result, 'FAIL');
    assert.deepEqual(report.counts.surfaces, { discovered: 2, linked: 0, unlinked: 2 });
    assert.deepEqual(report.unlinkedSurfaces.map((surface) => surface.canonicalPath), ['/glossaire', '/ressources']);
    assert.ok(report.errors.some((error) => error.includes('/ressources')));
    assert.ok(report.errors.some((error) => error.includes('/glossaire')));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('le lien manifeste vers le build contrôle le chemin, les octets, le hash et les ancres T', () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-resource-exact-surface-'));
  try {
    const hubHtml = '<!doctype html><title>Ressources</title>';
    const glossaryHtml = '<div class="glossaire-entree" id="dsn"></div><div class="glossaire-entree" id="dsn-val"></div>';
    mkdirSync(join(root, 'dist'), { recursive: true });
    writeFileSync(join(root, 'dist/ressources.html'), hubHtml);
    writeFileSync(join(root, 'dist/glossaire.html'), glossaryHtml);
    for (const [directory, manifest] of [
      ['hub', {
        formatAdapter: 'H', candidate: { canonicalPath: '/ressources' },
        integrity: { buildOutput: { entries: [{ path: 'dist/ressources.html', bytes: Buffer.byteLength(hubHtml), sha256: createHash('sha256').update(hubHtml).digest('hex') }] } },
      }],
      ['glossaire', {
        formatAdapter: 'T', candidate: { canonicalPath: '/glossaire', fanOut: ['/glossaire#dsn'] },
        integrity: { buildOutput: { entries: [{ path: 'dist/glossaire.html', bytes: Buffer.byteLength(glossaryHtml), sha256: createHash('sha256').update(glossaryHtml).digest('hex') }] } },
      }],
    ]) {
      mkdirSync(join(root, 'editorial/resources', directory), { recursive: true });
      writeFileSync(join(root, 'editorial/resources', directory, 'manifest.json'), `${JSON.stringify(manifest)}\n`);
    }

    const report = auditResourceInventory({ root });

    assert.deepEqual(report.counts.surfaces, { discovered: 2, linked: 1, unlinked: 1 });
    assert.deepEqual(report.unlinkedSurfaces.map((surface) => surface.canonicalPath), ['/glossaire']);
    assert.ok(report.errors.some((error) => error.includes('ancres')));

    const hubManifestPath = join(root, 'editorial/resources/hub/manifest.json');
    const hubManifest = JSON.parse(readFileSync(hubManifestPath, 'utf8'));
    hubManifest.claimsEvidence = { renderedUnitInventory: [{ id: 'unit-absente', text: 'Texte absent du HTML.' }] };
    writeFileSync(hubManifestPath, `${JSON.stringify(hubManifest)}\n`);
    const missingUnitReport = auditResourceInventory({ root });
    assert.ok(missingUnitReport.errors.some((error) => error.includes('unité rendue')));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

// Une campagne de revue date les couples qu’elle juge ; les autres gardent leur propre date, jusqu’à leur validité.
const withDatedFixture = (options, run) => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-resource-date-'));
  try {
    return run(createResourceFixture(root, 'A', 'release', options), root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
};

test('une revue métier ne rouvre que ce qu’elle juge, date chaque verdict et compte ce qu’elle reporte', () => {
  withDatedFixture({}, (nominal, root) => {
    const report = validateResourceManifest(nominal, { root });
    assert.equal(report.pass, true, report.errors.join(' | '));
    assert.equal(report.counts.sensitiveVerdictsReportes, 0);
  });

  // Le cœur : une campagne du 13/09 ne déclare pas périmé un couple qu’elle ne rouvre pas.
  withDatedFixture({ sensitiveVerdictDay: '2026-08-20' }, (reporte, root) => {
    const report = validateResourceManifest(reporte, { root });
    assert.ok(!hasError(report.errors, 'contrôle périmé'), report.errors.join(' | '));
    assert.ok(!hasError(report.errors, 'copie source périmée'), report.errors.join(' | '));
    assert.equal(report.pass, true, report.errors.join(' | '));
    assert.equal(report.counts.sensitiveVerdictsReportes, 1);
  });

  // Le contrepoids : passé sa validité, le couple doit être rouvert ; le report n’est pas une dispense.
  withDatedFixture({ sensitiveVerdictDay: '2026-01-10' }, (perime, root) => {
    assert.ok(hasError(validateResourceManifest(perime, { root }).errors, 'hors de validité'));
  });

  // La cohérence par couple survit : un claim daté d’un autre jour que SON verdict reste refusé.
  withDatedFixture({ sensitiveVerdictDay: '2026-08-20' }, (reporte, root) => {
    const claimHorsVerdict = clone(reporte);
    claimHorsVerdict.claimsEvidence.claims[0].checkedAt = '2026-08-19T10:00:00+01:00';
    assert.ok(hasError(errorsFor(claimHorsVerdict, root), 'contrôle périmé'));
  });

  // La fenêtre de 24 heures se mesure sur le verdict qui juge, pas sur la campagne : 23 heures avant son
  // verdict, la copie source passe, alors qu’elle précède la campagne de 24 jours.
  withDatedFixture({ sensitiveVerdictDay: '2026-08-20' }, (reporte, root) => {
    const veilleDuVerdict = clone(reporte);
    veilleDuVerdict.claimsEvidence.sources[0].checkedAt = '2026-08-20T00:00:00+14:00';
    assert.ok(!hasError(errorsFor(veilleDuVerdict, root), 'plus de 24 heures'));
  });

  // Et elle reste fermante : la même copie source, jugée treize heures plus tard, dépasse la fenêtre.
  withDatedFixture({ sensitiveVerdictDay: '2026-08-20' }, (reporte, root) => {
    const sourceTropTot = clone(reporte);
    sourceTropTot.claimsEvidence.sources[0].checkedAt = '2026-08-20T00:00:00+14:00';
    sourceTropTot.claimsEvidence.sensitiveMatter.businessReview.claimSourceVerdicts[0].checkedAt = '2026-08-20T23:30:00+01:00';
    assert.ok(hasError(errorsFor(sourceTropTot, root), 'plus de 24 heures'));
  });
});
