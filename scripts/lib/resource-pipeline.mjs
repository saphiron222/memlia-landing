import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from 'node:fs';
import { isAbsolute, join, relative, resolve } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import { BLOG_SKILLS, REVIEW_CRITERIA, SEO_SKILLS } from './blog-pipeline.mjs';

const RESOURCE_SCHEMA = JSON.parse(readFileSync(new URL('../../editorial/templates/resource-manifest-v1.schema.json', import.meta.url), 'utf8'));
// Le contrat R1 décrit la forme candidate de formatContract avec H seulement.
// validateFormat ferme donc chaque adaptateur sans assouplir les autres blocs.
const candidateSchema = RESOURCE_SCHEMA.oneOf.find((branch) => branch.title === 'candidate-executable');
candidateSchema.properties.formatContract = { type: 'object', minProperties: 1 };
const candidateBaseSchema = structuredClone(RESOURCE_SCHEMA);
delete candidateBaseSchema.oneOf;
const validateSchema = new Ajv2020({ allErrors: true, strict: true }).compile({
  allOf: [candidateBaseSchema, { type: 'object', ...candidateSchema }],
});

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

const ADAPTER_TYPES = Object.freeze({ H: 'hub', A: 'article', T: 'terme', G: 'guide', M: 'modele' });
export const RESOURCE_PHASES = Object.freeze(['qa', 'preview', 'approval', 'release']);
const LAST_REQUIRED_GATE = Object.freeze({ qa: 4, preview: 4, approval: 5, release: 6 });
const REQUIRED_BLOCKS = Object.freeze([
  'candidate', 'research', 'claimsEvidence', 'assets', 'links', 'skills', 'quality',
  'integrity', 'build', 'preview', 'audit', 'approval', 'release',
]);
const ACCEPTED_TIERS = new Set(['tier-1', 'tier-2', 'tier-3', 'original-method']);
const SENSITIVE_TYPES = new Set(['paie', 'social', 'dsn', 'fiscal', 'juridique', 'legal-reglementaire', 'statistique-chiffre']);
const SHA256 = /^[a-f0-9]{64}$/;
const KANBAN_TASK_ID = /^t_[a-f0-9]{8}$/;
const REVIEW_FRESHNESS_MS = 24 * 60 * 60 * 1000;
// Une revue juge des couples claim/source et les date. Passé cette validité, le couple doit être rouvert :
// sans elle, reporter un verdict deviendrait le moyen de ne plus jamais revérifier.
const VERDICT_VALIDITY_MS = 183 * 24 * 60 * 60 * 1000;
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const ISO_TIMESTAMP = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(?:Z|([+-])(\d{2}):(\d{2}))$/;
const hasText = (value, minimum = 1) => typeof value === 'string' && value.trim().length >= minimum;
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const timestamp = (value) => {
  const match = ISO_TIMESTAMP.exec(value ?? '');
  if (!match) return null;
  const [, year, month, day, hour, minute, second, , , offsetHour = '00', offsetMinute = '00'] = match;
  const numbers = [year, month, day, hour, minute, second, offsetHour, offsetMinute].map(Number);
  const [numericYear, numericMonth, numericDay, numericHour, numericMinute, numericSecond, numericOffsetHour, numericOffsetMinute] = numbers;
  const maximumDay = new Date(Date.UTC(numericYear, numericMonth, 0)).getUTCDate();
  if (numericMonth < 1 || numericMonth > 12 || numericDay < 1 || numericDay > maximumDay || numericHour > 23 || numericMinute > 59 || numericSecond > 59 || numericOffsetHour > 23 || numericOffsetMinute > 59) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
};
const calendarDate = (value) => ISO_DATE.test(value ?? '') && timestamp(`${value}T00:00:00Z`) !== null;
export const canonicalJson = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).filter((key) => value[key] !== undefined).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
};
export const digest = (value) => sha256(canonicalJson(value));
export const candidateDigestPayload = (manifest) => ({
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
  sourceBundleDigest: manifest.integrity?.sourceBundle?.digest,
  assetBundleDigest: manifest.integrity?.assetBundle?.digest,
  configBundleDigest: manifest.integrity?.configBundle?.digest,
  buildOutputDigest: manifest.integrity?.buildOutput?.digest,
});
export const reviewSubjectDigestPayload = (manifest) => {
  const payload = candidateDigestPayload(manifest);
  payload.claimsEvidence = structuredClone(manifest.claimsEvidence ?? {});
  if (payload.claimsEvidence.sensitiveMatter) delete payload.claimsEvidence.sensitiveMatter.businessReview;
  return payload;
};
const sameArray = (left, right) => Array.isArray(left) && left.length === right.length && left.every((value, index) => value === right[index]);
const duplicateValues = (items) => {
  if (!Array.isArray(items)) return [];
  const seen = new Set();
  return items.filter((item) => seen.has(item) || !seen.add(item));
};

function requireObject(errors, value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).length === 0) {
    errors.push(`${label} doit être un objet non vide.`);
    return false;
  }
  return true;
}

function schemaErrors(input) {
  if (validateSchema(input)) return [];
  return validateSchema.errors.map((error) => `Schéma ${error.instancePath || '$'} : ${error.message}.`);
}

function validateIdentity(manifest, errors) {
  if (manifest.schemaVersion !== 'resource-manifest-v1') errors.push('schemaVersion doit valoir resource-manifest-v1.');
  if (manifest.contractRevision !== 3) errors.push('contractRevision doit valoir 3.');
  if (manifest.templateState !== 'candidate' || manifest.executable !== true) errors.push('Le manifeste doit être un candidat exécutable explicite.');
  const expectedType = ADAPTER_TYPES[manifest.formatAdapter];
  if (!expectedType) errors.push('formatAdapter doit valoir H | A | T | G | M.');
  else if (manifest.resourceType !== expectedType) errors.push(`resourceType ${manifest.resourceType ?? 'absent'} diverge de l’adaptateur ${manifest.formatAdapter}.`);
  if (!hasText(manifest.editorialFormat)) errors.push('editorialFormat doit rester distinct et non vide.');
  for (const block of REQUIRED_BLOCKS) requireObject(errors, manifest[block], block);
  if (!Array.isArray(manifest.gates) || manifest.gates.length === 0) errors.push('gates doit être une liste non vide.');
}

function validateTaxonomy(manifest, errors) {
  const taxonomy = manifest.taxonomy;
  if (!requireObject(errors, taxonomy, 'taxonomy')) return;
  if (!sameArray(taxonomy.canonicalRoles, RESOURCE_ROLES) || !sameArray(taxonomy.resourceDiscoveryRoles, RESOURCE_ROLES)) {
    errors.push('La taxonomie doit conserver exactement les 12 rôles Ressources, dans l’ordre canonique.');
  }
  if (!sameArray(taxonomy.blogRoleEnum, [...RESOURCE_ROLES, 'autre-role-documente'])) {
    errors.push('L’enum Blog doit conserver les 12 rôles plus autre-role-documente historique.');
  }
  if (taxonomy.otherRoleDocumented?.allowedAsResourceDiscoveryRole !== false) errors.push('autre-role-documente ne peut pas être exposé comme famille de découverte.');
  const candidate = manifest.candidate ?? {};
  if (!RESOURCE_ROLES.includes(candidate.primaryRole) || (candidate.secondaryRoles ?? []).some((role) => !RESOURCE_ROLES.includes(role))) {
    errors.push('Le candidat doit utiliser uniquement les 12 rôles de découverte canoniques.');
  }
  if ((candidate.secondaryRoles ?? []).includes(candidate.primaryRole) || duplicateValues(candidate.secondaryRoles).length) {
    errors.push('Les rôles secondaires doivent être uniques et distincts du rôle principal.');
  }
}

function validateCandidate(manifest, errors) {
  const { candidate = {}, formatAdapter } = manifest;
  const canonical = candidate.canonicalPath;
  const validPath = {
    H: canonical === '/ressources',
    A: /^\/blog\/[^/?#]+$/.test(canonical ?? ''),
    T: canonical === '/glossaire' || /^\/glossaire#[^/?#]+$/.test(canonical ?? '') || /^\/glossaire\/[^/?#]+$/.test(canonical ?? ''),
    G: /^\/guides\/[^/?#]+$/.test(canonical ?? ''),
    M: /^\/modeles\/[^/?#]+$/.test(canonical ?? ''),
  }[formatAdapter];
  if (!validPath || (canonical !== '/' && canonical?.endsWith('/'))) errors.push('candidate.canonicalPath est hors namespace, ambigu ou terminé par un slash.');
  for (const field of ['id', 'slug', 'title', 'summary', 'task', 'primaryQuery', 'owner', 'author', 'editorialReviewer', 'maintenanceRule']) {
    if (!hasText(candidate[field])) errors.push(`candidate.${field} doit être renseigné.`);
  }
  if (candidate.author === candidate.editorialReviewer) errors.push('Le reviewer éditorial doit être distinct de l’auteur.');
  if (!Array.isArray(candidate.secondaryQueries) || candidate.secondaryQueries.includes(candidate.primaryQuery) || duplicateValues(candidate.secondaryQueries).length) errors.push('Les requêtes secondaires doivent être uniques et distinctes de la requête primaire.');
  const scope = [candidate.title, candidate.summary, candidate.task].join(' ').toLocaleLowerCase('fr');
  if (/catalogue de modules|surveillance nominative/.test(scope)) errors.push('Le candidat contient une promesse hors périmètre ou de la surveillance nominative.');
}

function validateResearch(manifest, errors) {
  const { research = {}, formatAdapter } = manifest;
  const documentedNd = ['H', 'T'].includes(formatAdapter) && research.serp?.requiredDecision === false && research.serp?.gateResult === 'ND'
    && research.serp?.scope?.includes('40101') && research.serp?.outputRefs?.some((ref) => safePath(manifest.__root, ref) && existsSync(safePath(manifest.__root, ref)));
  if (research.serp?.status !== 'RUN' || research.serp?.gateResult !== 'PASS' && !documentedNd) errors.push('SERP doit rester une preuve RUN/PASS distincte ou un ND H/T documenté non bloquant.');
  if (timestamp(research.serp?.checkedAt) === null) errors.push('SERP RUN/PASS exige une date ISO valide.');
  const gsc = research.gsc;
  if (!gsc || gsc.candidateUrlHistoryStatus !== 'ND') errors.push('L’historique GSC d’une nouvelle URL doit rester ND, distinct du résultat du gate.');
  if (formatAdapter === 'A') {
    if (gsc?.requiredForDecision !== true || gsc?.status !== 'RUN' || gsc?.propertyQueryEvidenceStatus !== 'PASS') errors.push('Article : GSC doit être RUN/PASS quand la décision le requiert ; ND ne dispense pas de preuve.');
    if (timestamp(gsc?.checkedAt) === null) errors.push('Article : GSC RUN/PASS exige une date ISO valide.');
  } else if (gsc?.requiredForDecision === true) {
    if (gsc.status !== 'RUN' || gsc.propertyQueryEvidenceStatus !== 'PASS') errors.push('GSC requis pour la décision doit être RUN/PASS.');
    if (timestamp(gsc?.checkedAt) === null) errors.push('GSC requis pour la décision exige une date ISO valide.');
  } else if (gsc?.status !== 'N/A' || gsc?.propertyQueryEvidenceStatus !== 'N/A' || !requireObject([], gsc?.arbitration, 'arbitration') || !hasText(gsc?.arbitration?.decision, 12) || !hasText(gsc?.arbitration?.decidedBy) || timestamp(gsc?.arbitration?.checkedAt) === null || !hasText(gsc?.arbitration?.evidenceRef)) {
    errors.push('GSC non requis exige un arbitrage daté, sourcé et signé ; l’historique reste ND.');
  }
}

function indexById(items, label, errors) {
  if (!Array.isArray(items)) {
    errors.push(`${label} doit être une liste.`);
    return new Map();
  }
  const map = new Map();
  for (const item of items) {
    if (!hasText(item?.id) || map.has(item.id)) errors.push(`${label} contient un identifiant absent ou dupliqué.`);
    else map.set(item.id, item);
  }
  return map;
}

function validateClaims(manifest, phase, errors) {
  const evidence = manifest.claimsEvidence ?? {};
  const units = indexById(evidence.renderedUnitInventory, 'renderedUnitInventory', errors);
  const claims = indexById(evidence.claims, 'claims', errors);
  const citations = indexById(evidence.citations, 'citations', errors);
  const sources = indexById(evidence.sources, 'sources', errors);
  for (const unit of units.values()) {
    if (unit.sha256 !== sha256(unit.text ?? '')) errors.push(`Unité ${unit.id} : SHA-256 divergent.`);
    const reverseClaims = [...claims.values()].filter((claim) => claim.unitId === unit.id).map((claim) => claim.id).sort();
    if (!sameArray([...(unit.claimIds ?? [])].sort(), reverseClaims)) errors.push(`Chaîne bidirectionnelle unité↔claim divergente pour ${unit.id}.`);
  }
  for (const claim of claims.values()) {
    if (!units.has(claim.unitId) || claim.sha256 !== sha256(claim.text ?? '')) errors.push(`Claim ${claim.id} omis du rendu ou SHA-256 divergent.`);
    if (!Array.isArray(claim.sourceIds) || !claim.sourceIds.length || !Array.isArray(claim.citationIds) || !claim.citationIds.length) errors.push(`Claim ${claim.id} doit pointer vers source et citation.`);
    const applicability = claim.applicability;
    if (!requireObject([], applicability, 'applicability')
      || !hasText(applicability?.population, 12)
      || !hasText(applicability?.regime, 12)
      || !calendarDate(applicability?.validAsOf)
      || !hasText(applicability?.exceptions, 12)
      || !sameArray([...(applicability?.sourceIds ?? [])].sort(), [...(claim.sourceIds ?? [])].sort())) {
      errors.push(`Claim ${claim.id} : l’applicabilité métier doit relier population, régime, validAsOf, exceptions et sources exactes.`);
    }
    for (const sourceId of claim.sourceIds ?? []) {
      const source = sources.get(sourceId);
      if (!source || !(source.claimIds ?? []).includes(claim.id)) errors.push(`Chaîne bidirectionnelle claim↔source divergente pour ${claim.id}/${sourceId}.`);
      if (timestamp(source?.checkedAt) === null || applicability?.validAsOf !== source.checkedAt.slice(0, 10)
        || timestamp(claim.checkedAt) === null || timestamp(claim.checkedAt) < timestamp(source?.checkedAt)) {
        errors.push(`Claim ${claim.id} : validAsOf doit correspondre au checkedAt de sa copie source et précéder son contrôle.`);
      }
    }
    for (const citationId of claim.citationIds ?? []) {
      const citation = citations.get(citationId);
      if (!citation || !(citation.claimIds ?? []).includes(claim.id)) errors.push(`Chaîne bidirectionnelle claim↔citation divergente pour ${claim.id}/${citationId}.`);
    }
  }
  for (const citation of citations.values()) {
    const source = sources.get(citation.sourceId);
    const reverseClaims = [...claims.values()].filter((claim) => (claim.citationIds ?? []).includes(citation.id)).map((claim) => claim.id).sort();
    if (!sameArray([...(citation.claimIds ?? [])].sort(), reverseClaims)) errors.push(`Chaîne bidirectionnelle citation↔claim divergente pour ${citation.id}.`);
    if (citation.verdict !== 'soutient') errors.push(`Citation ${citation.id} : seul le verdict soutient ouvre le gate.`);
    if (citation.sha256 !== sha256(citation.text ?? '')) errors.push(`Citation ${citation.id} : SHA-256 divergent.`);
    if (!source || citation.sourceContentSha256 !== source.contentSha256 || citation.finalUrl !== source.finalUrl) errors.push(`Citation ${citation.id} n’est pas reliée à la copie source exacte.`);
    else {
      const sourcePath = safePath(manifest.__root, source.snapshotPath);
      if (!sourcePath || !existsSync(sourcePath) || !readFileSync(sourcePath, 'utf8').includes(citation.text ?? '')) errors.push(`Citation ${citation.id} : l’extrait est absent de la copie source exacte.`);
    }
  }
  for (const source of sources.values()) {
    const reverseClaims = [...claims.values()].filter((claim) => (claim.sourceIds ?? []).includes(source.id)).map((claim) => claim.id).sort();
    if (!sameArray([...(source.claimIds ?? [])].sort(), reverseClaims)) errors.push(`Chaîne bidirectionnelle source↔claim divergente pour ${source.id}.`);
    if (!ACCEPTED_TIERS.has(source.level)) errors.push(`Source ${source.id} : ${source.level ?? 'niveau absent'} est refusé (tier-4, tier-5 et echo-only).`);
    if (!['primary', 'secondary'].includes(source.provenance) || !hasText(source.verificationEvidenceRef) || !hasText(source.classificationEvidenceRef) || source.verificationEvidenceRef === source.classificationEvidenceRef) errors.push(`Source ${source.id} : ouverture, classification et provenance doivent être distinctes et prouvées.`);
    const path = safePath(manifest.__root, source.snapshotPath);
    if (!path || !existsSync(path) || sha256(existsSync(path) ? readFileSync(path) : '') !== source.contentSha256) errors.push(`Source ${source.id} : copie source absente ou hash divergent.`);
    const bundleEntry = manifest.integrity?.sourceBundle?.entries?.find((entry) => entry.path === source.snapshotPath);
    if (!bundleEntry || bundleEntry.sha256 !== source.contentSha256) errors.push(`Source ${source.id} : copie source hors du bundle d’intégrité ou hash divergent.`);
  }
  const sensitiveClaims = [...claims.values()].filter((claim) => SENSITIVE_TYPES.has(claim.type));
  // Corollaire maison : un contrôle qui accepte un report doit compter ce qu’il reporte, et l’afficher.
  let sensitiveVerdictsReportes = 0;
  const sensitive = evidence.sensitiveMatter;
  const renderedText = [...units.values(), ...claims.values()].map((row) => row.text ?? '').join(' ');
  const candidateSignals = [manifest.candidate?.title, manifest.candidate?.summary, manifest.candidate?.task, manifest.candidate?.primaryQuery, ...(manifest.candidate?.secondaryQueries ?? []), manifest.candidate?.primaryRole, ...(manifest.candidate?.secondaryRoles ?? []), manifest.candidate?.cluster, renderedText].join(' ').toLocaleLowerCase('fr');
  const redetectedSensitive = sensitiveClaims.length > 0 || /paie|social|dsn|fiscal|juridique|l[eé]gal|r[eè]glement|statistique|chiffre/.test(candidateSignals);
  if (redetectedSensitive && sensitive?.detected !== true) errors.push('La redétection de matière sensible diverge du manifeste.');
  if (redetectedSensitive || sensitive?.detected) {
    const review = sensitive?.businessReview;
    const reviewCheckedAt = timestamp(sensitive?.checkedAt);
    const approvalReceivedAt = timestamp(manifest.approval?.receivedAt);
    if (reviewCheckedAt === null || ['approval', 'release'].includes(phase) && (approvalReceivedAt === null || reviewCheckedAt > approvalReceivedAt)) {
      errors.push(['approval', 'release'].includes(phase)
        ? 'La revue sensible et le GO doivent porter des dates ISO valides et ordonnées.'
        : 'La revue sensible doit porter une date ISO valide.');
    }
    const forbidden = new Set([manifest.candidate?.author, manifest.candidate?.editorialReviewer]);
    if (review?.required !== true || review?.reviewerType !== 'ai-agent' || !hasText(review?.reviewerId)) errors.push('La matière sensible exige une revue par un agent IA identifié.');
    if (review?.reviewerProfile !== 'metier') errors.push('La revue sensible doit être produite par le profil metier.');
    if (!KANBAN_TASK_ID.test(review?.reviewerId ?? '')) errors.push('Le reviewer IA doit être relié à une carte Kanban traçable.');
    if (review?.reviewerRole !== 'reviewer-metier-memlia') errors.push('La revue IA doit déclarer le rôle interne reviewer-metier-memlia, sans qualification professionnelle humaine.');
    if (forbidden.has(review?.reviewerId)) errors.push('Le reviewer métier doit être distinct de l’auteur et du reviewer éditorial.');
    if (review?.status !== 'AI_REVIEW_PASS') errors.push('La matière sensible exige le verdict explicite AI_REVIEW_PASS ; FAIL, ND et PASS historique ferment le gate.');
    if (!sameArray(review?.distinctFrom, ['author', 'editorialReviewer', 'sourceClassifier'])) errors.push('La preuve de reviewer métier distinct est incomplète.');
    const reviewedCandidateHash = digest(reviewSubjectDigestPayload(manifest));
    if (review?.reviewedCandidateHash !== reviewedCandidateHash) errors.push(`La revue IA ne correspond pas au candidat exact (${reviewedCandidateHash}).`);
    const claimsRequiringSensitiveReview = sensitiveClaims.length > 0 ? sensitiveClaims : [...claims.values()];
    const verdicts = Array.isArray(review?.claimSourceVerdicts) ? review.claimSourceVerdicts : [];
    const verdictKeys = new Set();
    const jourDeCampagne = typeof sensitive?.checkedAt === 'string' ? sensitive.checkedAt.slice(0, 10) : null;
    for (const claim of claimsRequiringSensitiveReview) {
      // La date de référence d’un claim sensible est celle du verdict qui le juge, jamais celle de la campagne :
      // une revue qui ajoute des termes prouve ces termes, elle ne redate pas ceux qu’elle ne rouvre pas.
      const claimVerdicts = (claim.sourceIds ?? [])
        .map((sourceId) => verdicts.filter((row) => row?.claimId === claim.id && row?.sourceId === sourceId))
        .filter((rows) => rows.length === 1)
        .map((rows) => rows[0]);
      const joursDuJugement = new Set(claimVerdicts.map((row) => String(row?.checkedAt ?? '').slice(0, 10)));
      if (joursDuJugement.size > 1) errors.push(`Claim sensible ${claim.id} : ses verdicts IA portent des jours différents, il n’a pas de date de jugement unique.`);
      const jourDuJugement = joursDuJugement.size === 1 ? [...joursDuJugement][0] : null;
      const datesDuJugement = claimVerdicts.map((row) => timestamp(row?.checkedAt)).filter((value) => value !== null);
      const dateDuJugement = datesDuJugement.length === claimVerdicts.length && datesDuJugement.length > 0 ? Math.max(...datesDuJugement) : null;
      const jugementDate = jourDuJugement !== null && dateDuJugement !== null;
      if (jugementDate && reviewCheckedAt !== null) {
        if (dateDuJugement > reviewCheckedAt) errors.push(`Claim sensible ${claim.id} : son verdict IA est postérieur à la campagne de revue.`);
        if (reviewCheckedAt - dateDuJugement > VERDICT_VALIDITY_MS) errors.push(`Claim sensible ${claim.id} : verdict IA hors de validité (plus de ${Math.round(VERDICT_VALIDITY_MS / 86400000)} jours), la source doit être rouverte.`);
        if (jourDuJugement !== jourDeCampagne) sensitiveVerdictsReportes += 1;
      }
      const claimCheckedAt = timestamp(claim.checkedAt);
      if (claimCheckedAt === null || !jugementDate || claim.checkedAt.slice(0, 10) !== jourDuJugement || claimCheckedAt > dateDuJugement) {
        errors.push(`Claim sensible ${claim.id} : contrôle périmé, invalide ou postérieur à la revue métier.`);
      }
      for (const sourceId of claim.sourceIds ?? []) {
        const source = sources.get(sourceId);
        if (!source?.official || source.provenance !== 'primary' || !['tier-1', 'tier-2', 'tier-3'].includes(source.level)) errors.push(`Claim sensible ${claim.id} : une source primaire officielle tier-1 à tier-3 est requise.`);
        const matchingVerdicts = verdicts.filter((row) => row?.claimId === claim.id && row?.sourceId === sourceId);
        if (matchingVerdicts.length !== 1) {
          errors.push(`Claim sensible ${claim.id} : verdict IA claim/source traçable absent ou dupliqué.`);
          continue;
        }
        const verdict = matchingVerdicts[0];
        verdictKeys.add(`${claim.id}/${sourceId}`);
        const verdictCheckedAt = timestamp(verdict.checkedAt);
        const sourceCheckedAt = timestamp(source?.checkedAt);
        if (sourceCheckedAt === null || verdictCheckedAt === null || source.checkedAt.slice(0, 10) !== verdict.checkedAt.slice(0, 10) || sourceCheckedAt > verdictCheckedAt) {
          errors.push(`Claim sensible ${claim.id} : copie source périmée, invalide ou postérieure à la revue métier.`);
        }
        if (sourceCheckedAt !== null && verdictCheckedAt !== null && verdictCheckedAt - sourceCheckedAt > REVIEW_FRESHNESS_MS) errors.push(`Claim sensible ${claim.id} : copie source consultée plus de 24 heures avant la revue métier.`);
        const expectedCitationIds = (claim.citationIds ?? []).filter((citationId) => citations.get(citationId)?.sourceId === sourceId).sort();
        if (verdict.verdict !== 'soutient'
          || !sameArray([...(verdict.citationIds ?? [])].sort(), expectedCitationIds)
          || expectedCitationIds.length === 0
          || verdict.sourceContentSha256 !== source?.contentSha256
          || verdictCheckedAt === null
          || reviewCheckedAt === null
          || verdictCheckedAt > reviewCheckedAt
          || !hasText(verdict.reasoning, 12)) {
          errors.push(`Claim sensible ${claim.id} : verdict IA claim/source non traçable, non soutenant ou périmé.`);
        }
      }
    }
    const expectedVerdictKeys = claimsRequiringSensitiveReview.flatMap((claim) => (claim.sourceIds ?? []).map((sourceId) => `${claim.id}/${sourceId}`)).sort();
    if (!sameArray([...verdictKeys].sort(), expectedVerdictKeys) || verdicts.length !== expectedVerdictKeys.length) errors.push('La revue métier IA doit contenir exactement un verdict traçable par couple claim/source.');
    const evidencePath = safePath(manifest.__root, review?.evidenceRef);
    let evidence = null;
    if (evidencePath && existsSync(evidencePath)) {
      const content = readFileSync(evidencePath);
      try { evidence = JSON.parse(content); } catch { evidence = null; }
      if (sha256(content) !== review?.evidenceSha256) evidence = null;
    }
    const expectedEvidence = {
      required: review?.required,
      reviewerType: review?.reviewerType,
      reviewerProfile: review?.reviewerProfile,
      reviewerId: review?.reviewerId,
      reviewerRole: review?.reviewerRole,
      distinctFrom: review?.distinctFrom,
      reviewedCandidateHash: review?.reviewedCandidateHash,
      status: review?.status,
      claimSourceVerdicts: verdicts,
    };
    if (!evidence || canonicalJson(evidence) !== canonicalJson(expectedEvidence)) errors.push('La preuve de revue IA est absente, illisible, de hash divergent ou ne retrace pas le verdict exact.');
  }
  return { units, claims, citations, sources, sensitiveVerdictsReportes };
}

function validateSkills(manifest, errors) {
  const skills = manifest.skills ?? {};
  for (const [family, expected] of [['blog', BLOG_SKILLS], ['seo', SEO_SKILLS], ['marketingDesignCore', RESOURCE_CORE_SKILLS]]) {
    const rows = skills[family];
    if (!Array.isArray(rows) || rows.length !== expected.length) {
      errors.push(`Le registre ${family} doit contenir exactement ${expected.length} lignes.`);
      continue;
    }
    if (!sameArray(rows.map((row) => row?.skill), expected)) errors.push(`Le registre ${family} diverge en contenu, ordre ou doublon.`);
    for (const row of rows) {
      if (!hasText(row.applicabilityRule) || !Array.isArray(row.requiredInputs) || row.requiredInputs.length === 0 || !Array.isArray(row.requiredOutputs) || row.requiredOutputs.length === 0 || !Array.isArray(row.evidenceRefs) || row.evidenceRefs.length === 0) {
        errors.push(`${family}.${row.skill ?? 'skill absent'} doit déclarer condition, entrées, sorties et preuves.`);
      }
      if (row.status === 'RUN') {
        if (row.applicable !== true || row.result !== 'PASS' || !hasText(row.toolOrCommand) || !hasText(row.checkedAt) || !hasText(row.version)) errors.push(`${family}.${row.skill} RUN doit être applicable, PASS, daté, versionné, outillé et prouvé.`);
      } else if (row.status === 'N/A') {
        const vagueReason = /^(?:pas|non) (?:utile|applicable)(?: ici)?\.?$/i.test(row.naReason?.trim() ?? '');
        if (row.applicable !== false || row.result !== null || !hasText(row.naReason, 12) || vagueReason || ['H', 'T'].includes(manifest.formatAdapter) && ['blog-brief', 'blog-outline', 'blog-image', 'seo-page', 'seo-images', 'seo-sitemap'].includes(row.skill)) errors.push(`${family}.${row.skill} N/A est faux ou insuffisamment justifié.`);
      } else errors.push(`${family}.${row.skill} doit être RUN ou N/A.`);
    }
  }
  const registry = skills.registryContract;
  if (registry?.result !== 'PASS' || !hasText(registry?.candidateRegistryPath) || !SHA256.test(registry?.candidateRegistrySha256 ?? '') || !SHA256.test(registry?.manifestProjectionSha256 ?? '')) errors.push('Le registre 31+24+noyau doit être relié, hashé et comparé PASS.');
  else {
    const registryPath = safePath(manifest.__root, registry.candidateRegistryPath);
    if (!registryPath || !existsSync(registryPath)) errors.push('Le registre candidat est absent du dossier contrôlé.');
    else {
      const content = readFileSync(registryPath);
      let parsed;
      try { parsed = JSON.parse(content); } catch { parsed = null; }
      const projection = { blog: skills.blog.map((row) => row.skill), seo: skills.seo.map((row) => row.skill), marketingDesignCore: skills.marketingDesignCore.map((row) => row.skill) };
      if (sha256(content) !== registry.candidateRegistrySha256 || !parsed || digest(projection) !== registry.manifestProjectionSha256 || canonicalJson(parsed) !== canonicalJson(projection)) errors.push('Le registre candidat, son empreinte et la projection 31+24+noyau divergent.');
    }
  }
}

function validateQuality(manifest, errors) {
  const quality = manifest.quality ?? {};
  if (!Array.isArray(quality.rubric) || !sameArray(quality.rubric.map((row) => row.id), REVIEW_CRITERIA.map((row) => row.id)) || !sameArray(quality.rubric.map((row) => row.weight), REVIEW_CRITERIA.map((row) => row.weight))) {
    errors.push('La grille qualité doit conserver les sept critères et poids canoniques totalisant 100.');
    return;
  }
  const serpNd = ['H', 'T'].includes(manifest.formatAdapter) && manifest.research?.serp?.requiredDecision === false && manifest.research?.serp?.gateResult === 'ND';
  const raw = quality.rubric.reduce((score, row) => score + (row.result === 'PASS' ? row.weight : 0), 0);
  const calculated = serpNd ? Math.round(raw * 100 / 85) : raw;
  if (serpNd && quality.rubric.find((row) => row.id === 'serp-format-rankability')?.result === 'PASS') errors.push('SERP ND ne peut recevoir aucun point SEO.');
  if (quality.recalculatedScore !== calculated) errors.push(`quality.recalculatedScore doit être recalculé depuis la grille (${calculated}).`);
  if (calculated < 90 || quality.minimum !== 90) errors.push('Le score qualité recalculé doit atteindre 90/100.');
  if (!Array.isArray(quality.p0) || quality.p0.length || !Array.isArray(quality.p1) || quality.p1.length || quality.blocking !== false) errors.push('quality exige zéro P0, zéro P1 et aucun blocage ; absent/null ne vaut pas zéro.');
}

function validateGates(manifest, phase, errors) {
  const expected = Array.from({ length: 7 }, (_, index) => `G${index}`);
  if (!Array.isArray(manifest.gates) || !sameArray(manifest.gates.map((gate) => gate?.id), expected)) {
    errors.push('Le manifeste doit contenir exactement les sept gates G0 à G6, dans l’ordre.');
    return;
  }
  const lastRequiredGate = LAST_REQUIRED_GATE[phase];
  for (const [index, gate] of manifest.gates.entries()) {
    if (index <= lastRequiredGate) {
      if (gate.status !== 'PASS' || gate.result !== 'PASS' || timestamp(gate.checkedAt) === null || !Array.isArray(gate.evidenceRefs) || gate.evidenceRefs.length === 0) {
        errors.push(`${gate.id} doit être PASS, daté et accompagné d’une preuve explicite pour la phase ${phase}.`);
      }
    } else if (gate.status !== 'PENDING' || gate.result !== 'PENDING' || gate.checkedAt !== null || !Array.isArray(gate.evidenceRefs) || gate.evidenceRefs.length !== 0) {
      errors.push(`${gate.id} est futur en phase ${phase} et doit rester strictement PENDING sans preuve.`);
    }
  }
}

function safePath(root, relativePath) {
  if (!root || !hasText(relativePath) || relativePath.startsWith('/') || relativePath.includes('\0')) return null;
  const base = realpathSync(resolve(root));
  const path = resolve(base, relativePath);
  const relation = relative(base, path);
  if (relation.startsWith('..') || isAbsolute(relation)) return null;
  if (existsSync(path)) {
    const realPath = realpathSync(path);
    const realRelation = relative(base, realPath);
    if (realRelation.startsWith('..') || isAbsolute(realRelation)) return null;
  }
  return path;
}

function validateBundles(manifest, errors) {
  const integrity = manifest.integrity ?? {};
  for (const bundleName of ['sourceBundle', 'assetBundle', 'configBundle', 'buildOutput']) {
    const bundle = integrity[bundleName];
    if (!bundle || !Array.isArray(bundle.entries) || !SHA256.test(bundle.digest ?? '')) {
      errors.push(`${bundleName} doit contenir entries et digest SHA-256.`);
      continue;
    }
    const paths = bundle.entries.map((entry) => entry?.path);
    if (!sameArray(paths, [...paths].sort()) || duplicateValues(paths).length) errors.push(`${bundleName}.entries doit être trié par path et sans doublon.`);
    if (bundle.digest !== digest(bundle.entries)) errors.push(`${bundleName}.digest ne correspond pas aux entrées canoniques.`);
    for (const entry of bundle.entries) {
      const path = safePath(manifest.__root, entry?.path);
      if (!path || !existsSync(path)) {
        errors.push(`${bundleName} : fichier ${entry?.path ?? 'absent'} introuvable.`);
        continue;
      }
      const content = readFileSync(path);
      if (statSync(path).size !== entry.bytes || sha256(content) !== entry.sha256) errors.push(`${bundleName} : fichier ${entry.path} cassé, périmé ou divergent.`);
    }
  }
  const candidateHash = digest(candidateDigestPayload(manifest));
  if (integrity.candidateHash?.value !== candidateHash) errors.push(`integrity.candidateHash doit être recalculé (${candidateHash}).`);
  return candidateHash;
}

function validateAssets(manifest, errors) {
  const image = manifest.assets?.image;
  if (image?.required === true) {
    if (image.engine !== 'image_generate' || !hasText(image.generationId) || !hasText(image.generationEvidenceRef) || !hasText(image.promptEvidenceRef)) errors.push('Une illustration exige une provenance réelle image_generate, son prompt et son identifiant de génération.');
    const alt = image.alt?.trim().toLocaleLowerCase('fr') ?? '';
    if (!hasText(image.alt, 10) || /^(image|illustration|photo)(\.[a-z]+)?$/.test(alt) || /\.(png|jpe?g|webp|avif)$/.test(alt)) errors.push('assets.image.alt doit être descriptif et ne peut pas être un nom de fichier.');
    const imageEntries = manifest.integrity?.assetBundle?.entries ?? [];
    if (!imageEntries.some((entry) => entry.sha256 === image.masterSha256 && manifest.assets.assetRefs?.includes(entry.path))) errors.push('Le master image_generate est absent du bundle d’assets ou son hash diverge.');
    if (!SHA256.test(image.ogSha256 ?? '') || !Array.isArray(image.derivativeRefs) || image.derivativeRefs.length === 0 || !hasText(image.visualReviewEvidenceRef)) errors.push('L’image exige dérivés, hash OG et preuve de revue visuelle.');
    if (!imageEntries.some((entry) => entry.sha256 === image.ogSha256 && manifest.assets.assetRefs?.includes(entry.path))) errors.push('L’image OG est absente du bundle d’assets ou son hash diverge.');
  }
  const ui = manifest.assets?.uiCapture;
  if (ui?.present === true && (ui.allowedProvenance !== 'banc-windows-jeu-fictif' || !hasText(ui.datasetId) || !hasText(ui.captureEvidenceRef) || !SHA256.test(ui.sha256 ?? ''))) errors.push('Une capture UI doit provenir du banc Windows sur jeu fictif et être hashée.');
}

function validateLinks(manifest, errors) {
  const links = manifest.links ?? {};
  if (!Array.isArray(links.outgoing) || !Array.isArray(links.incoming) || !hasText(links.corpusInventoryRef) || !hasText(links.cannibalization?.evidenceRef)) errors.push('Le maillage et la cannibalisation doivent couvrir le corpus dans les deux sens.');
  if (duplicateValues(links.outgoing).length || duplicateValues(links.incoming).length) errors.push('Le maillage contient un lien dupliqué.');
  const cannibalization = links.cannibalization;
  if (!['none', 'controlled'].includes(cannibalization?.risk) || cannibalization?.decision !== 'distinct' || !Array.isArray(cannibalization?.comparedCanonicalPaths) || cannibalization.comparedCanonicalPaths.length === 0 || duplicateValues(cannibalization.comparedCanonicalPaths).length) errors.push('La cannibalisation doit comparer un corpus canonique explicite, distinct et sans doublon.');
  const policy = links.filterPolicy;
  if (!policy || policy.queryVariantsNoindexFollow !== true || policy.canonicalUnfiltered !== true || policy.excludedFromSitemap !== true || !hasText(policy.javascriptFallbackTestRef)) errors.push('Un filtre doit rester non indexable, canonicaliser l’index et conserver la liste sans JS.');
}

function validateFormat(manifest, errors) {
  const contract = manifest.formatContract ?? {};
  if (!Array.isArray(contract.requiredInputs) || contract.requiredInputs.length === 0 || !Array.isArray(contract.requiredOutputs) || contract.requiredOutputs.length === 0) errors.push('Le contrat de format doit déclarer ses entrées et sorties requises.');
  if (manifest.formatAdapter === 'H') {
    const substance = contract.indexSubstance;
    const refs = substance?.eligibleUnitRefs;
    if (!Array.isArray(refs) || refs.includes('/ressources') || (refs ?? []).some((ref) => ref === manifest.candidate?.canonicalPath)) errors.push('Le Hub est auto-compté ou les destinations ne sont pas une liste.');
    if (duplicateValues(refs).length) errors.push('Les destinations substantielles du Hub doivent être distinctes.');
    if (substance?.excludedResourceTypes?.length !== 1 || substance.excludedResourceTypes[0] !== 'hub') errors.push('resourceType hub doit être explicitement exclu du seuil.');
    if (substance?.computedCount !== refs?.length || refs?.length < 5 || substance?.minimum !== 5 || substance?.result !== 'PASS') errors.push('Le Hub exige cinq destinations substantielles hors Hub, comptées et PASS.');
    if (!hasText(substance?.noJsInventoryRef)) errors.push('Le Hub exige une preuve de liste complète sans JavaScript.');
  } else if (manifest.formatAdapter === 'A') {
    if (!contract.pipelinePolicy?.includes('2d78b8bed588884e53157145077499cd56c27086') || !hasText(contract.historicalPipelineEvidenceRef)) errors.push('Article : le pipeline historique complet doit rester PASS et prouvé au commit exact.');
  } else if (manifest.formatAdapter === 'T') {
    const decision = contract.routeDecision;
    if (!['anchor', 'index', 'page'].includes(decision?.choice)) errors.push('Terme : routeDecision.choice doit valoir anchor | index | page.');
    if (decision?.containerAuditResult !== 'PASS') errors.push('Terme : une ancre ne rend jamais les audits du conteneur N/A.');
    if (decision?.choice === 'anchor' && !/^\/glossaire#[^/?#]+$/.test(manifest.candidate?.canonicalPath ?? '')) errors.push('Terme ancré : canonicalPath doit identifier son ancre sous /glossaire.');
    if (decision?.choice === 'index' && (manifest.candidate?.canonicalPath !== '/glossaire' || !Array.isArray(manifest.candidate?.fanOut) || manifest.candidate.fanOut.length === 0)) errors.push('Index des termes : canonicalPath /glossaire et inventaire fanOut non vide sont requis.');
    if (decision?.choice === 'page' && !/^\/glossaire\/[^/?#]+$/.test(manifest.candidate?.canonicalPath ?? '')) errors.push('Terme autonome : canonicalPath doit être /glossaire/{slug}.');
  } else if (manifest.formatAdapter === 'G') {
    const procedure = contract.procedure;
    for (const field of ['prerequisites', 'steps', 'controls', 'stopConditions']) if (!Array.isArray(procedure?.[field]) || !procedure[field].length) errors.push(`Guide : ${field} doit être renseigné.`);
    if (procedure?.replayResult !== 'PASS' || !hasText(procedure?.validatorEvidenceRef) || !hasText(procedure?.fictitiousDatasetId)) errors.push('Guide : la procédure doit être réellement rejouée PASS sur jeu fictif avec un valideur.');
  } else if (manifest.formatAdapter === 'M') {
    const download = contract.download;
    const oracle = contract.oracle;
    if (contract.openAccess !== true) errors.push('Modèle : accès ouvert requis, sans capture email.');
    if (download?.containsMacros !== false || download?.containsExternalLinks !== false || download?.containsRealClientData !== false || download?.containsPersonalMetadata !== false) errors.push('Modèle : macros, liens externes, PII, métadonnées personnelles et données client sont refusés.');
    const path = safePath(manifest.__root, download?.path);
    if (!path || !existsSync(path) || sha256(existsSync(path) ? readFileSync(path) : '') !== download?.sha256 || statSync(path).size !== download?.bytes) errors.push(`Modèle : fichier ${download?.path ?? 'absent'} cassé ou non relié à la notice.`);
    for (const field of ['commonCase', 'invalidCases', 'limits', 'formulas', 'errors']) if (oracle?.[field] !== 'PASS') errors.push(`Modèle : oracle.${field} doit être PASS.`);
    if (!hasText(oracle?.independentEvidenceRef)) errors.push('Modèle : oracle indépendant absent.');
  }
}

const pendingPreview = (preview) => [
  preview.branch, preview.deploymentId, preview.requestedUrl, preview.finalUrl,
  preview.candidateHash, preview.buildOutputDigest, preview.htmlNoindexNofollow,
  preview.httpXRobotsNoindexNofollow, preview.excludedFromSitemap,
  preview.excludedFromFeeds, preview.reportRef,
].every((value) => value === null)
  && Array.isArray(preview.routeChecks) && preview.routeChecks.length === 0
  && Array.isArray(preview.captureRefs) && preview.captureRefs.length === 0;

const pendingApproval = (approval) => approval.state === 'pending'
  && [approval.approvedBy, approval.channel, approval.exactMessage, approval.receivedAt,
    approval.candidateHash, approval.auditHash, approval.previewFinalUrl,
    approval.durableEvidenceRef, approval.scope].every((value) => value === null)
  && hasText(approval.rule);

const pendingRelease = (release) => release.authorized === false
  && [release.preflightCandidateHash, release.deploymentId, release.productionUrl,
    release.remoteDigest, release.rollbackRef].every((value) => value === null)
  && release.result === 'PENDING';

function validatePreviewEvidence(manifest, candidateHash, errors) {
  const { integrity = {}, preview = {} } = manifest;
  for (const [field, value] of Object.entries({
    branch: preview.branch,
    deploymentId: preview.deploymentId,
    requestedUrl: preview.requestedUrl,
    finalUrl: preview.finalUrl,
    reportRef: preview.reportRef,
  })) if (!hasText(value)) errors.push(`preview.${field} doit être renseigné pour la phase courante.`);
  if (preview.candidateHash !== candidateHash) errors.push('preview.candidateHash diverge de la chaîne de preuve exacte.');
  if (preview.buildOutputDigest !== integrity.buildOutput?.digest) errors.push('preview.buildOutputDigest diverge de la chaîne de preuve exacte.');
  if (![preview.htmlNoindexNofollow, preview.httpXRobotsNoindexNofollow, preview.excludedFromSitemap, preview.excludedFromFeeds].every((value) => value === true)) errors.push('La preview exige noindex,nofollow HTML+HTTP et exclusion sitemap+flux.');
  if (!Array.isArray(preview.routeChecks) || preview.routeChecks.length === 0 || !Array.isArray(preview.captureRefs) || preview.captureRefs.length === 0) errors.push('La preview exige des contrôles de routes et des captures explicites.');
}

function validateChain(manifest, candidateHash, phase, errors) {
  const { integrity = {}, build = {}, preview = {}, audit = {}, approval = {}, release = {} } = manifest;
  for (const [label, actual, expected] of [
    ['build.sourceBundleDigest', build.sourceBundleDigest, integrity.sourceBundle?.digest],
    ['build.assetBundleDigest', build.assetBundleDigest, integrity.assetBundle?.digest],
    ['build.configBundleDigest', build.configBundleDigest, integrity.configBundle?.digest],
    ['build.outputDigest', build.outputDigest, integrity.buildOutput?.digest],
    ['audit.candidateHash', audit.candidateHash, candidateHash],
    ['audit.buildOutputDigest', audit.buildOutputDigest, integrity.buildOutput?.digest],
  ]) if (actual !== expected) errors.push(`${label} diverge de la chaîne de preuve exacte.`);
  const receiptPath = safePath(manifest.__root, build.receiptRef);
  let receipt = null;
  let receiptRaw = null;
  if (!receiptPath || !existsSync(receiptPath)) {
    errors.push('Le reçu de build hashé est absent ou hors du dépôt.');
  } else {
    receiptRaw = readFileSync(receiptPath);
    if (sha256(receiptRaw) !== build.receiptSha256) errors.push('Le reçu de build hashé diverge des octets déclarés.');
    try {
      receipt = JSON.parse(receiptRaw.toString('utf8'));
    } catch {
      errors.push('Le reçu de build hashé contient un JSON invalide.');
    }
  }
  if (receipt) {
    const receiptCommands = Array.isArray(receipt.commands) ? receipt.commands : [];
    const surface = receipt.surfaces?.[manifest.formatAdapter];
    if (receipt.schemaVersion !== 1 || receipt.result !== 'PASS' || receiptCommands.length === 0
      || receiptCommands.some((row) => !hasText(row?.command) || row.exitCode !== 0)) {
      errors.push('Le reçu de build doit porter des commandes exécutées avec code de sortie 0 et result PASS.');
    }
    if (!sameArray(receiptCommands.map((row) => row.command), build.commands ?? [])) errors.push('Le reçu de build ne correspond pas aux commandes déclarées.');
    if (receipt.startedAt !== build.startedAt || receipt.endedAt !== build.endedAt
      || timestamp(receipt.startedAt) === null || timestamp(receipt.endedAt) === null
      || timestamp(receipt.startedAt) > timestamp(receipt.endedAt)) {
      errors.push('Le reçu de build doit porter des dates ISO ordonnées identiques au manifeste.');
    }
    for (const field of ['sourceBundleDigest', 'assetBundleDigest', 'configBundleDigest', 'outputDigest']) {
      if (surface?.[field] !== build[field]) errors.push(`Le reçu de build ne lie pas ${field} au snapshot exact.`);
    }
  }
  if (build.result !== 'PASS') errors.push('build.result doit être PASS ; une sortie cassée ferme le gate.');
  const auditPayload = { ...audit };
  delete auditPayload.auditHash;
  const auditHash = digest(auditPayload);
  if (audit.auditHash !== auditHash) errors.push(`audit.auditHash doit être recalculé (${auditHash}).`);
  if (audit.score !== manifest.quality?.recalculatedScore || audit.result !== 'PASS' || !Array.isArray(audit.p0) || audit.p0.length || !Array.isArray(audit.p1) || audit.p1.length) errors.push('L’audit doit relier le score recalculé, zéro P0/P1 et un résultat PASS.');
  if (phase === 'qa') {
    if (!pendingPreview(preview)) errors.push('Une preuve de preview prématurée est interdite en phase qa.');
  } else validatePreviewEvidence(manifest, candidateHash, errors);

  if (['qa', 'preview'].includes(phase)) {
    if (!pendingApproval(approval)) errors.push(`Une preuve d’approbation prématurée est interdite en phase ${phase}.`);
  } else {
    const approvedValues = [candidateHash, auditHash, preview.finalUrl];
    if (approval.state !== 'approved' || approval.approvedBy !== 'Kevin' || !approvedValues.every((value) => approval.exactMessage?.includes(value)) || !hasText(approval.durableEvidenceRef)) errors.push('Le GO Kevin exact et durable doit contenir les valeurs candidateHash, auditHash et previewFinalUrl du candidat contrôlé.');
    if (approval.candidateHash !== candidateHash || approval.auditHash !== auditHash || approval.previewFinalUrl !== preview.finalUrl) errors.push('Le GO ne correspond pas au candidat, à l’audit et à la preview exacts.');
  }

  if (phase !== 'release') {
    if (!pendingRelease(release)) errors.push(`Une preuve de release prématurée est interdite en phase ${phase}.`);
  } else {
    for (const field of ['preflightCandidateHash', 'deploymentId', 'productionUrl', 'remoteDigest', 'rollbackRef']) {
      if (!hasText(release[field])) errors.push(`release.${field} doit être renseigné pour la phase courante.`);
    }
    if (release.authorized !== true || release.preflightCandidateHash !== candidateHash || release.remoteDigest !== integrity.buildOutput?.digest || release.result !== 'PASS') {
      errors.push('La release exige une autorisation, le build distant exact, les preuves de déploiement/rollback et un préflight recalculé sur candidateHash exact.');
    }
  }
}

function validateResourceManifestUnsafe(input, { root = process.cwd(), phase = 'release' } = {}) {
  if (!RESOURCE_PHASES.includes(phase)) return { pass: false, phase, formatAdapter: input?.formatAdapter ?? null, counts: {}, errors: [`Phase inconnue ${phase}; attendu : ${RESOURCE_PHASES.join(' | ')}.`] };
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { pass: false, phase, formatAdapter: null, counts: {}, errors: ['Le manifeste ressource doit être un objet JSON.'] };
  const errors = schemaErrors(input);
  const manifest = { ...input, __root: resolve(root) };
  validateIdentity(manifest, errors);
  validateTaxonomy(manifest, errors);
  validateCandidate(manifest, errors);
  validateResearch(manifest, errors);
  const relations = validateClaims(manifest, phase, errors);
  validateAssets(manifest, errors);
  validateLinks(manifest, errors);
  validateSkills(manifest, errors);
  validateGates(manifest, phase, errors);
  validateQuality(manifest, errors);
  validateFormat(manifest, errors);
  const candidateHash = validateBundles(manifest, errors);
  validateChain(manifest, candidateHash, phase, errors);
  return {
    pass: errors.length === 0,
    phase,
    formatAdapter: manifest.formatAdapter ?? null,
    counts: {
      blogSkills: manifest.skills?.blog?.length ?? 0,
      seoSkills: manifest.skills?.seo?.length ?? 0,
      coreSkills: manifest.skills?.marketingDesignCore?.length ?? 0,
      gates: manifest.gates?.length ?? 0,
      renderedUnits: relations.units.size,
      claims: relations.claims.size,
      citations: relations.citations.size,
      sources: relations.sources.size,
      sensitiveVerdictsReportes: relations.sensitiveVerdictsReportes ?? 0,
    },
    errors,
  };
}

export function validateResourceManifest(input, options = {}) {
  try {
    return validateResourceManifestUnsafe(input, options);
  } catch (error) {
    return {
      pass: false,
      formatAdapter: input?.formatAdapter ?? null,
      counts: {},
      errors: [`Validation interrompue en mode fail-closed : ${error.message}`],
    };
  }
}

export function auditResourceManifestFile(path, { root = process.cwd(), phase = 'release' } = {}) {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    return { pass: false, phase, formatAdapter: null, counts: {}, errors: [`JSON invalide dans ${path} : ${error.message}`] };
  }
  return validateResourceManifest(manifest, { root, phase });
}

export function auditResourceInventory({ root = process.cwd(), phase = 'release' } = {}) {
  const absoluteRoot = resolve(root);
  const directory = join(absoluteRoot, 'editorial/resources');
  const paths = existsSync(directory)
    ? readdirSync(directory, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(directory, entry.name, 'manifest.json'))
      .sort()
    : [];
  const manifests = paths.map((path) => {
    const report = auditResourceManifestFile(path, { root: absoluteRoot, phase });
    return { path: relative(absoluteRoot, path), ...report };
  });
  const byAdapter = { H: 0, A: 0, T: 0, G: 0, M: 0, invalid: 0 };
  for (const manifest of manifests) {
    if (Object.hasOwn(byAdapter, manifest.formatAdapter)) byAdapter[manifest.formatAdapter] += 1;
    else byAdapter.invalid += 1;
  }
  const passed = manifests.filter((manifest) => manifest.pass).length;
  const hasCandidates = manifests.length > 0;
  const surfaceDefinitions = [
    { formatAdapter: 'T', canonicalPath: '/glossaire', outputPath: 'dist/glossaire.html' },
    { formatAdapter: 'H', canonicalPath: '/ressources', outputPath: 'dist/ressources.html' },
  ];
  const surfaces = surfaceDefinitions
    .filter((surface) => existsSync(join(absoluteRoot, surface.outputPath)))
    .map((surface) => {
      const content = readFileSync(join(absoluteRoot, surface.outputPath));
      const relationErrors = [];
      const linkedManifests = manifests.filter((manifest) => {
        let candidate;
        try {
          candidate = JSON.parse(readFileSync(join(absoluteRoot, manifest.path), 'utf8'));
        } catch {
          return false;
        }
        if (candidate.formatAdapter !== surface.formatAdapter || candidate.candidate?.canonicalPath !== surface.canonicalPath) return false;
        const output = candidate.integrity?.buildOutput?.entries?.find((entry) => entry.path === surface.outputPath);
        if (!output || output.bytes !== content.length || output.sha256 !== sha256(content)) {
          relationErrors.push(`Manifeste ${manifest.path} : sortie ${surface.outputPath} absente ou hash divergent.`);
          return false;
        }
        if (surface.formatAdapter === 'T') {
          const renderedAnchors = [...content.toString('utf8').matchAll(/class="glossaire-entree" id="([a-z0-9-]+)"/g)]
            .map((match) => `/glossaire#${match[1]}`)
            .sort();
          const declaredAnchors = [...(candidate.candidate?.fanOut ?? [])].sort();
          if (!sameArray(declaredAnchors, renderedAnchors)) {
            relationErrors.push(`Manifeste ${manifest.path} : ancres T déclarées et rendues divergentes.`);
            return false;
          }
        }
        for (const unit of candidate.claimsEvidence?.renderedUnitInventory ?? []) {
          if (!hasText(unit?.text) || !content.toString('utf8').includes(unit.text)) {
            relationErrors.push(`Manifeste ${manifest.path} : unité rendue ${unit?.id ?? 'sans identifiant'} absente de ${surface.outputPath}.`);
            return false;
          }
        }
        return true;
      });
      return {
        ...surface,
        bytes: content.length,
        sha256: sha256(content),
        manifestPaths: linkedManifests.map((manifest) => manifest.path),
        relationErrors,
      };
    });
  const unlinkedSurfaces = surfaces.filter((surface) => surface.manifestPaths.length !== 1);
  const surfaceErrors = unlinkedSurfaces.flatMap((surface) => surface.relationErrors.length > 0
    ? surface.relationErrors
    : [surface.manifestPaths.length === 0
      ? `Surface ${surface.formatAdapter} ${surface.canonicalPath} rendue sans manifeste exact.`
      : `Surface ${surface.formatAdapter} ${surface.canonicalPath} reliée à ${surface.manifestPaths.length} manifestes au lieu d’un.`]);
  const manifestPass = manifests.every((manifest) => manifest.pass);
  const pass = manifestPass && surfaceErrors.length === 0;
  return {
    pass,
    phase,
    result: surfaceErrors.length > 0 || hasCandidates && !manifestPass ? 'FAIL' : hasCandidates ? 'PASS' : 'NO_CANDIDATE',
    candidateValidated: hasCandidates && passed > 0,
    scope: paths.length === 0 && surfaces.length === 0 ? 'aucun candidat ressource découvert; aucun candidat validé' : 'manifestes et surfaces H/T du build rapprochés',
    counts: {
      discovered: manifests.length,
      passed,
      failed: manifests.length - passed,
      byAdapter,
      surfaces: { discovered: surfaces.length, linked: surfaces.length - unlinkedSurfaces.length, unlinked: unlinkedSurfaces.length },
    },
    surfaces,
    unlinkedSurfaces,
    errors: surfaceErrors,
    manifests,
  };
}
