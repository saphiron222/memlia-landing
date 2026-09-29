import { createHash } from 'node:crypto';
import { lookup as dnsLookup } from 'node:dns/promises';
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { isIP } from 'node:net';
import { dirname, join, relative, resolve } from 'node:path';
import { parse as parseHtml } from 'parse5';
import sharp from 'sharp';
import { Agent, fetch as fetchUndici } from 'undici';
import { parse as parseYaml } from 'yaml';
import { dossierFiles, validatePublishedAdoption } from './blog-published-authority.mjs';
import { retirerPreuvesInline } from './blog-proof-figures.mjs';
import { corpsSansTitreDuplique } from './blog-body-envelope.mjs';
import { reviewBindingErrors, reviewSha256 } from './blog-review-binding.mjs';
import { verifierTitreIntentMesure } from './blog-title-intent.mjs';

export const BLOG_SKILLS = Object.freeze([
  'blog-strategy', 'blog-brand', 'blog-persona', 'blog-discourse', 'blog-google', 'blog-calendar',
  'blog-cluster', 'blog-taxonomy', 'blog-brief', 'blog-outline', 'blog-notebooklm', 'blog-write',
  'blog-rewrite', 'blog-factcheck', 'blog-style', 'blog-chart', 'blog-image', 'blog-schema',
  'blog-seo-check', 'blog-geo', 'blog-analyze', 'blog-audit', 'blog-cannibalization', 'blog-decay',
  'blog-flow', 'blog-repurpose', 'blog-audio', 'blog-multilingual', 'blog-translate', 'blog-localize',
  'blog-locale-audit',
]);

export const SEO_SKILLS = Object.freeze([
  'seo-plan', 'seo-google', 'seo-content-brief', 'seo-cluster', 'seo-sxo', 'seo-page', 'seo-content',
  'seo-technical', 'seo-schema', 'seo-images', 'seo-sitemap', 'seo-geo', 'seo-flow', 'seo-audit',
  'seo-drift', 'seo-backlinks', 'seo-competitor-pages', 'seo-local', 'seo-maps', 'seo-hreflang',
  'seo-ecommerce', 'seo-programmatic', 'seo-dataforseo', 'seo-image-gen',
]);

export const CORE_BLOG_SKILLS = Object.freeze([
  'blog-brief', 'blog-seo-check', 'blog-geo', 'blog-audit', 'blog-cannibalization',
]);
export const CORE_SEO_SKILLS = Object.freeze([
  'seo-content-brief', 'seo-page', 'seo-content', 'seo-technical', 'seo-schema', 'seo-images', 'seo-audit',
]);
export const REVIEW_CRITERIA = Object.freeze([
  { id: 'intent-satisfaction', weight: 20 },
  { id: 'serp-format-rankability', weight: 15 },
  { id: 'eeat-sources', weight: 20 },
  { id: 'information-gain-proof', weight: 20 },
  { id: 'technical-onpage-seo', weight: 10 },
  { id: 'ai-citability', weight: 10 },
  { id: 'contextual-conversion', weight: 5 },
]);
export const CLAIM_TYPES = Object.freeze([
  'produit',
  'methode',
  'information',
  'paie',
  'social',
  'dsn',
  'fiscal',
  'juridique',
  'legal-reglementaire',
  'statistique-chiffre',
]);

const MIN_SAFETY_WORDS = 80;
/** Cadence décidée le 16/09/2026 : quatre articles par semaine, au plus deux le même jour. */
export const CANDIDATS_PAR_JOUR_MAX = 2;
export const CANDIDATS_PAR_SEMAINE_MAX = 4;
/** Reçu de publication : le dossier est scellé sur ses octets le jour de la mise en ligne. */
export const PUBLICATION_SEAL_PATH = 'preuves/publication.json';
/** La date déclarée est celle du calendrier de publication en Europe/Paris, pas la date UTC du fetch. */
export function jourRecuperationParis(retrievedAt) {
  if (typeof retrievedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(retrievedAt)) return null;
  const instant = Date.parse(retrievedAt);
  if (!Number.isFinite(instant) || instant > Date.now()) return null;
  const canonique = new Date(instant).toISOString();
  if (retrievedAt !== canonique && retrievedAt !== canonique.replace('.000Z', 'Z')) return null;
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(instant).map(({ type, value }) => [type, value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}
/** Semaine ISO 8601 d'une date AAAA-MM-JJ, sous la forme AAAA-Wnn. */
export function semaineIso(value) {
  const date = new Date(`${value}T00:00:00Z`);
  const jour = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - jour);
  const debutAnnee = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const numero = Math.ceil(((date - debutAnnee) / 86_400_000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(numero).padStart(2, '0')}`;
}
/** Refuse une date qui ferait dépasser la cadence propre à chaque flux éditorial. */
export function verifierPlafonds(actifs, date, { serie = null, slug = null } = {}) {
  const semaine = semaineIso(date);
  if (serie === 'cicatrices') {
    // Rattrapage signé W39 uniquement : les 28 et 29 sont en W40, sans doubler la W39.
    const slugW39 = 'tests-verts-et-regle-des-trois-passes';
    const rattrapageW39 = (candidateSlug, candidateDate) => candidateSlug === slugW39
      && ['2026-09-27', '2026-09-28', '2026-09-29'].includes(candidateDate);
    if (slug === slugW39 && date > '2026-09-29') {
      throw new Error(`Le rattrapage W39 de cette cicatrice s'arrête au 29/09/2026 ; nouveau cadrage requis pour ${date}.`);
    }
    if (new Date(`${date}T00:00:00Z`).getUTCDay() !== 6 && !rattrapageW39(slug, date)) {
      throw new Error(`Une cicatrice paraît le samedi ; ${date} n’est pas un samedi.`);
    }
    const semaineControlee = rattrapageW39(slug, date) ? '2026-W39' : semaine;
    if (actifs.some((candidate) => candidate.serie === 'cicatrices' && isDate(candidate.date)
      && (rattrapageW39(candidate.slug, candidate.date)
        ? '2026-W39' : semaineIso(candidate.date)) === semaineControlee)) {
      throw new Error(`Une cicatrice est déjà planifiée la semaine ${semaineControlee} ; le plafond est d’une cicatrice par semaine ISO.`);
    }
    return;
  }
  const ordinaires = actifs.filter((candidate) => candidate.serie !== 'cicatrices');
  if (ordinaires.filter((candidate) => candidate.date === date).length >= CANDIDATS_PAR_JOUR_MAX) {
    throw new Error(`${CANDIDATS_PAR_JOUR_MAX} candidats sont déjà planifiés le ${date} ; le plafond est de ${CANDIDATS_PAR_JOUR_MAX} candidats par jour.`);
  }
  if (ordinaires.filter((candidate) => isDate(candidate.date) && semaineIso(candidate.date) === semaine).length >= CANDIDATS_PAR_SEMAINE_MAX) {
    throw new Error(`${CANDIDATS_PAR_SEMAINE_MAX} candidats sont déjà planifiés la semaine ${semaine} ; le plafond est de ${CANDIDATS_PAR_SEMAINE_MAX} candidats par semaine.`);
  }
}
/**
 * Publication scellée (v3) : un dossier au statut « publie » ne bouge plus. Le reçu inventorie
 * chaque fichier du dossier avec son empreinte ; tout octet modifié après la mise en ligne
 * casse le sceau, et le seul chemin de correction est de republier par la forge.
 */
export function validatePublicationSeal(dossier, manifest, subject) {
  const errors = [];
  if (manifest?.editorialStatus !== 'publie' || manifest?.kevin?.productionApproved !== true) errors.push('Publication scellée : statut publie et productionApproved requis.');
  if (manifest?.publicationEvidence !== PUBLICATION_SEAL_PATH) errors.push('Publication scellée : reçu de publication obligatoire.');
  if (!isDate(manifest?.publishedAt)) errors.push('Publication scellée : publishedAt doit être une date AAAA-MM-JJ.');
  try {
    const proof = JSON.parse(readFileSync(join(dossier, PUBLICATION_SEAL_PATH), 'utf8'));
    if (proof.version !== 1 || proof.kind !== 'publication-scellee' || proof.candidateSlug !== subject.slug
      || proof.articleSha256 !== subject.articleHash || proof.manifestSha256 !== subject.manifestHash
      || proof.publishedAt !== manifest?.publishedAt) {
      errors.push('Publication scellée : reçu divergent du candidat exact.');
    }
    const paths = dossierFiles(dossier).filter((path) => path !== PUBLICATION_SEAL_PATH);
    if (JSON.stringify(paths) !== JSON.stringify(proof.files?.map((row) => row.path))) errors.push('Publication scellée : inventaire de dossier divergent.');
    for (const row of proof.files ?? []) {
      if (!paths.includes(row.path)) continue;
      const bytes = readFileSync(join(dossier, row.path));
      if (row.sha256 !== sha256(bytes) || row.bytes !== bytes.length) errors.push(`Publication scellée : empreinte divergente (${row.path}).`);
    }
  } catch (error) {
    errors.push(`Publication scellée : reçu absent ou illisible (${error.message}).`);
  }
  return errors;
}

/** Le relevé au jour de publication ne survit au TTL que si le dossier entier reste scellé. */
export function dateIntentionScellee(root, slug) {
  try {
    const dossier = join(root, 'editorial/articles', slug);
    const manifestPath = join(dossier, 'manifest.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const subject = {
      slug,
      articleHash: sha256(readFileSync(join(root, 'src/content/blog', `${slug}.md`))),
      manifestHash: sha256(readFileSync(manifestPath)),
    };
    return validatePublicationSeal(dossier, manifest, subject).length === 0 ? manifest.publishedAt : null;
  } catch {
    return null;
  }
}
const RESERVED_SOURCE_HOST = /(?:^|\.)(?:example|invalid|localhost|test)$/i;
const MAX_SOURCE_BYTES = 2 * 1024 * 1024;
const MAX_SOURCE_REDIRECTS = 4;
const MAX_PROTECTED_PREVIEW_EVIDENCE_AGE_DAYS = 7;
const BUSINESS_CLAIM_VERDICTS = new Set(['soutient', 'soutient_partiellement', 'contredit', 'hors_sujet']);
const SOURCE_LEVELS = Object.freeze(['tier-1', 'tier-2', 'tier-3', 'tier-4', 'tier-5', 'original-method', 'technical-primary']);
const SOURCE_PROVENANCE = Object.freeze(['primary', 'secondary', 'echo']);
const ACCEPTED_SOURCE_LEVELS = new Set(['tier-1', 'tier-2', 'tier-3', 'original-method', 'technical-primary']);
const OFFICIAL_PRIMARY_CLAIM_TYPES = new Set(['paie', 'social', 'dsn', 'fiscal', 'juridique', 'legal-reglementaire']);
const OFFICIAL_PRIMARY_SIGNALS = new Set(['paie', 'social', 'dsn', 'fiscal', 'juridique', 'legal-reglementaire', 'rgpd', 'assertion-normative']);
const DISALLOWED_SOURCE_PLATFORMS = Object.freeze([
  { label: 'Medium', host: /(?:^|\.)medium\.com$/i },
  { label: 'Reddit', host: /(?:^|\.)reddit\.com$/i },
  { label: 'Substack', host: /(?:^|\.)substack\.com$/i },
  { label: 'WordPress', host: /(?:^|\.)wordpress\.com$/i },
  { label: 'Quora', host: /(?:^|\.)quora\.com$/i },
  { label: 'Hacker News', host: /^news\.ycombinator\.com$/i },
]);
const OFFICIAL_SOURCE_AUTHORITIES = Object.freeze([
  { id: 'urssaf', host: /(?:^|\.)urssaf\.fr$/i, publisher: /\burssaf\b/i },
  { id: 'net-entreprises', host: /(?:^|\.)net-entreprises\.fr$/i, publisher: /\bnet[- ]entreprises\b/i },
  { id: 'service-public', host: /(?:^|\.)service-public\.(?:fr|gouv\.fr)$/i, publisher: /\bservice public\b/i },
  { id: 'legifrance', host: /(?:^|\.)legifrance\.gouv\.fr$/i, publisher: /\blegifrance\b/i },
  { id: 'cnil', host: /(?:^|\.)cnil\.fr$/i, publisher: /\bcnil\b/i },
  { id: 'impots', host: /(?:^|\.)(?:impots\.gouv\.fr|bofip\.impots\.gouv\.fr)$/i, publisher: /\b(?:impots|bofip|direction generale des finances publiques|dgfip)\b/i },
  { id: 'insee', host: /(?:^|\.)insee\.fr$/i, publisher: /\binsee\b/i },
  { id: 'travail-emploi', host: /(?:^|\.)travail-emploi\.gouv\.fr$/i, publisher: /\b(?:ministere du travail|travail emploi)\b/i },
]);
// Documentation du projet, pas autorité publique ni preuve d'une obligation métier.
const TECHNICAL_PRIMARY_DOCUMENTS = Object.freeze([
  { id: 'python-doctest', url: 'https://docs.python.org/fr/3/library/doctest.html', publisher: 'python software foundation' },
]);
const IMAGE_REVIEW_CRITERIA = Object.freeze([
  'brief-six-components',
  'generation-constraints',
  'fictive-provenance',
  'recognizable-subject',
  'technical-derivatives',
  'alt-information',
]);
const SENSITIVE_CLAIM_TYPES = new Set(['paie', 'social', 'dsn', 'fiscal', 'juridique', 'legal-reglementaire', 'statistique-chiffre']);
const SENSITIVE_CLUSTERS = new Set(['paie-social', 'juridique-fiscal']);
const SENSITIVE_ROLES = new Set(['paie-responsables-sociaux', 'juridique-fiscal']);
const SENSITIVE_TEXT_RULES = Object.freeze([
  ['paie', /\b(?:bulletins? de (?:paie|salaire)|fiches? de paie|gestion de la paie|traitement de la paie|logiciels? de paie|masse salariale|salaire brut|net a payer)\b/],
  ['social', /\b(?:droit social|pole social|protection sociale|securite sociale|cotisations? sociales?|charges? sociales?|relations? sociales?|comite social et economique|cse)\b/],
  ['dsn', /\b(?:dsn|declarations? sociales? nominatives?)\b/],
  ['fiscal', /\b(?:fiscal(?:e|es|ite)?|impots?|prelevement a la source|tva|taxes?|contribuables?|assujettis?)\b/],
  ['juridique', /\b(?:juridiqu(?:e|es)|droit du travail|contrats? de travail|conventions? collectives?)\b/],
  ['legal-reglementaire', /\b(?:legal(?:e|es|ement)?|reglementair(?:e|es)|reglementation|code (?:du travail|de la securite sociale|general des impots|civil|de commerce|de la consommation|monetaire et financier|des assurances|rural et de la peche maritime|de procedure (?:civile|penale))|loi(?:s| n)?|decrets?|arretes?|articles? [lr]\s*\d)\b/],
  ['rgpd', /\b(?:rgpd|reglement general sur la protection des donnees|donnees? personnelles?|cnil)\b/],
]);
const NORMATIVE_LANGUAGE = /\b(?:doit|doivent|devra|devront|obligatoire|interdit(?:e|es|s)?|autorise(?:e|es|s)?|exige(?:e|es|s)?|tenu(?:e|es|s)? de|au plus tard|delai(?:s)? de|est due|sont dues)\b/;
const RGPD_OBLIGATION_LANGUAGE = /\b(?:doit|doivent|devra|devront|obligatoir(?:e|es)|obligation(?:s)?|interdit(?:e|es|s)?|exige(?:e|es|s)?|tenu(?:e|es|s)? de)\b/;
const NORMATIVE_PARTIES = /\b(?:employeurs?|salaries?|cotisants?|declarants?|contribuables?|assujettis?)\b/;
const SUPPORT_STOP_WORDS = new Set([
  'alors', 'avec', 'avoir', 'cette', 'comme', 'dans', 'depuis', 'elle', 'elles', 'entre', 'etre',
  'faire', 'leurs', 'mais', 'meme', 'pour', 'sans', 'selon', 'sont', 'sous', 'toute', 'toutes',
  'toujours', 'tout', 'tous', 'une', 'vers', 'votre',
]);
const SPECIAL_IPV4_CIDRS = Object.freeze([
  '0.0.0.0/8', '10.0.0.0/8', '100.64.0.0/10', '127.0.0.0/8', '169.254.0.0/16',
  '172.16.0.0/12', '192.0.0.0/24', '192.0.2.0/24', '192.31.196.0/24', '192.52.193.0/24',
  '192.88.99.0/24', '192.168.0.0/16', '192.175.48.0/24', '198.18.0.0/15',
  '198.51.100.0/24', '203.0.113.0/24', '224.0.0.0/4', '240.0.0.0/4',
]);
const SPECIAL_IPV6_CIDRS = Object.freeze([
  '::/128', '::1/128', '::ffff:0:0/96', '64:ff9b::/96', '64:ff9b:1::/48', '100::/64',
  '100:0:0:1::/64', '2001::/23', '2001::/32',
  '2001:1::1/128', '2001:1::2/128', '2001:2::/48', '2001:3::/32', '2001:4:112::/48',
  '2001:10::/28', '2001:20::/28', '2001:30::/28', '2001:db8::/32', '2002::/16',
  '2620:4f:8000::/48', '3fff::/20', '5f00::/16', 'fc00::/7', 'fe80::/10', 'ff00::/8',
]);

const ENUMS = Object.freeze({
  action: ['creation', 'revision', 'consolidation'],
  editorialStatus: ['a-preparer', 'a-valider', 'bloque', 'pret-preview', 'go-production', 'publie', 'publie-non-atteste', 'a-maintenir', 'archive'],
  intent: ['comprendre', 'executer', 'diagnostiquer', 'comparer-approches', 'evaluer-service', 'reduire-risque', 'decider'],
  funnel: ['TOFU', 'MOFU', 'BOFU'],
  cluster: ['production-comptable', 'portefeuille-echeances', 'paie-social', 'juridique-fiscal', 'audit-cac', 'administratif-secretariat', 'facturation-recouvrement', 'rh-formation', 'excel-outils-existants', 'numerique-it-data', 'methode-decision-humaine', 'conseil-missions'],
  role: ['direction-associes', 'chefs-mission-portefeuille', 'collaborateurs-comptables', 'assistants-comptables', 'paie-responsables-sociaux', 'juridique-fiscal', 'audit-cac', 'administratif-secretariat', 'facturation-recouvrement', 'rh-recrutement-formation', 'numerique-it-data', 'profils-formation', 'autre-role-documente'],
  roleProof: ['observe', 'indirect', 'hypothese', 'absent'],
  contentType: ['searchable', 'shareable', 'experimental'],
  format: ['how-to-guide', 'faq-knowledge', 'tutorial', 'pillar-page', 'thought-leadership', 'listicle-checklist', 'case-study', 'data-research', 'resource-template'],
  rankability: ['forte', 'plausible', 'faible', 'bloquante'],
  businessRelevance: ['directe', 'adjacente', 'faible', 'hors-perimetre'],
  proofStatus: ['requise', 'a-produire', 'verifiee', 'non-applicable'],
});

const hasText = (value, minimum = 1) =>
  typeof value === 'string' && value.trim().length >= minimum && !/__[A-Z_]+__/.test(value);
const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value ?? '') && !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime());
const sha256 = (content) => createHash('sha256').update(content).digest('hex');

function isSafeRelativePath(base, reference) {
  if (!hasText(reference) || /^https:\/\//.test(reference)) return null;
  const path = resolve(base, reference);
  return path.startsWith(`${resolve(base)}/`) ? path : null;
}

function sameValue(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function isPublicHttpsUrl(value) {
  if (!/^https:\/\/[^\s"<>]+$/.test(value ?? '')) return false;
  try {
    const hostname = new URL(value).hostname.replace(/^\[|\]$/g, '');
    return !RESERVED_SOURCE_HOST.test(hostname) && !(isIP(hostname) && isForbiddenAddress(hostname));
  } catch {
    return false;
  }
}

function isManifestlyNonDescriptiveAlt(value) {
  if (!hasText(value, 10)) return true;
  const normalized = value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('fr').trim();
  const compact = normalized.replace(/[^a-z0-9]+/g, '');
  if (/\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(normalized)) return true;
  if (new Set([
    'image', 'photo', 'illustration', 'visuel', 'image generique', 'photo generique',
    'illustration generique', 'visuel generique', 'image de couverture', 'illustration de couverture',
  ]).has(normalized)) return true;
  if (compact.length >= 8 && /^(.{1,4})\1{2,}$/.test(compact)) return true;
  const artificialSequences = [
    'abcdefghijklmnopqrstuvwxyz', 'zyxwvutsrqponmlkjihgfedcba',
    'qwertyuiopasdfghjklzxcvbnm', 'azertyuiopqsdfghjklmwxcvbn',
  ];
  if (compact.length >= 8 && artificialSequences.some((sequence) => sequence.includes(compact))) return true;
  if (compact === normalized && compact.length >= 10 && /^[a-z]+$/.test(compact) && !/[aeiouy]/.test(compact)) return true;
  const words = normalized.split(/\s+/).filter(Boolean);
  return words.length > 1 && new Set(words).size === 1;
}

function normalizedPublisher(value) {
  return String(value ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('fr').replace(/[^a-z0-9]+/g, ' ').trim();
}

function rejectDisallowedSourcePlatform(value, errors, label) {
  try {
    const hostname = new URL(value).hostname.replace(/^\[|\]$/g, '');
    const platform = DISALLOWED_SOURCE_PLATFORMS.find((candidate) => candidate.host.test(hostname));
    if (platform) errors.push(`${label} pointe vers ${platform.label}, plateforme UGC ou générique refusée comme source porteuse.`);
    return platform;
  } catch {
    return null;
  }
}

function sourceClassification(source, finalUrl, errors, label) {
  let hostname = '';
  try {
    hostname = new URL(finalUrl).hostname.replace(/^\[|\]$/g, '');
  } catch {
    return { officialAuthority: false };
  }
  const platform = rejectDisallowedSourcePlatform(finalUrl, errors, `${label}.finalUrl`);

  const publisher = normalizedPublisher(source?.publisher);
  const technical = TECHNICAL_PRIMARY_DOCUMENTS.find((document) => {
    return finalUrl === document.url && publisher === document.publisher;
  });
  if (source?.level === 'technical-primary' && !technical) {
    errors.push(`${label} : documentation primaire technique non reconnue ou incohérence domaine↔éditeur (${hostname}, « ${source?.publisher} »).`);
  }
  const hostAuthority = OFFICIAL_SOURCE_AUTHORITIES.find((authority) => authority.host.test(hostname));
  const publisherAuthority = OFFICIAL_SOURCE_AUTHORITIES.find((authority) => authority.publisher.test(publisher));
  const coherentAuthority = hostAuthority && hostAuthority.publisher.test(publisher);
  if (publisherAuthority && publisherAuthority !== hostAuthority) {
    errors.push(`${label} : incohérence domaine↔éditeur, « ${source?.publisher} » ne correspond pas au domaine ${hostname}.`);
  }
  if (source?.official === true && !coherentAuthority) {
    errors.push(`${label} : official=true ne suffit pas ; le domaine ${hostname} et l’éditeur « ${source?.publisher} » ne correspondent à aucune autorité officielle bornée reconnue.`);
  } else if (hostAuthority && !coherentAuthority) {
    errors.push(`${label} : incohérence domaine↔éditeur pour l’autorité ${hostAuthority.id}.`);
  }
  return { officialAuthority: source?.official === true && Boolean(coherentAuthority) && !platform,
    technicalPrimary: source?.level === 'technical-primary' && Boolean(technical) && !platform };
}

function requireText(errors, value, path, minimum = 1) {
  if (!hasText(value, minimum)) errors.push(`${path} doit contenir au moins ${minimum} caractère(s).`);
}

function requireEnum(errors, value, path, values) {
  if (!values.includes(value)) errors.push(`${path} doit valoir ${values.join(' | ')}.`);
}

function validateResearchProof(errors, proof, label, gateMode = 'production') {
  const protectedPreviewNd = ['protected-preview', 'published-audit'].includes(gateMode) && label === 'GSC' && proof?.status === 'ND';
  if (proof?.status !== 'PASS' && !protectedPreviewNd) errors.push(`${label} doit être PASS avant publication ; seul GSC=ND documenté est admis en preview protégée.`);
  requireText(errors, proof?.evidence, `${label}.evidence`, 3);
  if (!isDate(proof?.checkedAt)) errors.push(`${label}.checkedAt doit être une date AAAA-MM-JJ.`);
}

export function validateCandidate(candidate, { gateMode = 'production' } = {}) {
  const errors = [];
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return ['Le manifeste candidat doit être un objet JSON.'];
  if (candidate.version !== 1) errors.push('version doit valoir 1.');
  requireText(errors, candidate.slug, 'slug', 3);
  if (hasText(candidate.slug) && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(candidate.slug)) errors.push('slug doit être en minuscules ASCII séparées par des tirets.');
  requireEnum(errors, candidate.action, 'action', ENUMS.action);
  requireEnum(errors, candidate.editorialStatus, 'editorialStatus', ENUMS.editorialStatus);
  requireText(errors, candidate.title, 'title', 10);
  requireText(errors, candidate.tabTitle, 'tabTitle', 20);
  requireText(errors, candidate.summary, 'summary', 40);
  requireText(errors, candidate.description, 'description', 50);
  if (hasText(candidate.description) && candidate.description.length > 160) errors.push('description ne peut pas dépasser 160 caractères.');
  if (!isDate(candidate.publicationDate)) errors.push('publicationDate doit être une date AAAA-MM-JJ.');
  if (candidate.updatedAt !== null && candidate.updatedAt !== undefined && !isDate(candidate.updatedAt)) errors.push('updatedAt doit être null ou une date AAAA-MM-JJ.');
  if (!Array.isArray(candidate.topics) || candidate.topics.length === 0) errors.push('topics doit contenir au moins un sujet rendu dans le frontmatter.');
  if (!Array.isArray(candidate.keywords)) errors.push('keywords doit être une liste rendue dans le frontmatter.');
  requireText(errors, candidate.primaryQuery, 'primaryQuery', 3);
  if (!Array.isArray(candidate.secondaryQueries)) errors.push('secondaryQueries doit être une liste.');
  requireEnum(errors, candidate.intent, 'intent', ENUMS.intent);
  if (!Array.isArray(candidate.fanOut) || candidate.fanOut.length === 0) errors.push('fanOut doit contenir au moins une sous-intention.');
  requireEnum(errors, candidate.role?.primary, 'role.primary', ENUMS.role);
  if (!Array.isArray(candidate.role?.secondary)) errors.push('role.secondary doit être une liste.');
  else candidate.role.secondary.forEach((role, index) => requireEnum(errors, role, `role.secondary[${index}]`, ENUMS.role));
  requireEnum(errors, candidate.role?.proof?.level, 'role.proof.level', ENUMS.roleProof);
  requireText(errors, candidate.role?.proof?.source, 'role.proof.source', 3);
  if (!isDate(candidate.role?.proof?.verifiedAt)) errors.push('role.proof.verifiedAt doit être une date AAAA-MM-JJ.');
  requireEnum(errors, candidate.funnel, 'funnel', ENUMS.funnel);
  requireEnum(errors, candidate.cluster, 'cluster', ENUMS.cluster);
  requireEnum(errors, candidate.contentType, 'contentType', ENUMS.contentType);
  requireEnum(errors, candidate.format, 'format', ENUMS.format);
  requireText(errors, candidate.task, 'task', 10);
  requireEnum(errors, candidate.rankability, 'rankability', ENUMS.rankability);
  if (['faible', 'bloquante'].includes(candidate.rankability)) errors.push('rankability faible ou bloquante interdit la preview.');
  requireEnum(errors, candidate.businessRelevance, 'businessRelevance', ENUMS.businessRelevance);
  if (['faible', 'hors-perimetre'].includes(candidate.businessRelevance)) errors.push('businessRelevance faible ou hors-perimetre interdit la preview.');
  requireEnum(errors, candidate.proofStatus, 'proofStatus', ENUMS.proofStatus);
  if (!['verifiee', 'non-applicable'].includes(candidate.proofStatus)) errors.push('proofStatus doit être verifiee ou non-applicable avant preview.');
  requireText(errors, candidate.proofRequired, 'proofRequired', 10);
  if (!isDate(candidate.sourcesVerifiedAt)) errors.push('sourcesVerifiedAt doit être une date AAAA-MM-JJ.');
  if (!Array.isArray(candidate.sources) || candidate.sources.length < 3) errors.push('sources doit contenir au moins trois sources vérifiables avant preview.');
  else candidate.sources.forEach((source, index) => {
    requireText(errors, source?.id, `sources[${index}].id`, 3);
    requireText(errors, source?.publisher, `sources[${index}].publisher`, 2);
    requireText(errors, source?.title, `sources[${index}].title`, 3);
    if (!isPublicHttpsUrl(source?.url)) errors.push(`sources[${index}].url doit être une URL https publique non réservée.`);
    if (!isDate(source?.checkedAt)) errors.push(`sources[${index}].checkedAt doit être une date AAAA-MM-JJ.`);
    requireText(errors, source?.verificationEvidence, `sources[${index}].verificationEvidence`, 3);
    requireText(errors, source?.classificationEvidence, `sources[${index}].classificationEvidence`, 3);
    requireEnum(errors, source?.level, `sources[${index}].level`, SOURCE_LEVELS);
    requireEnum(errors, source?.provenance, `sources[${index}].provenance`, SOURCE_PROVENANCE);
    if (typeof source?.official !== 'boolean') errors.push(`sources[${index}].official doit être un booléen explicite.`);
    if (!isPublicHttpsUrl(source?.upstreamUrl)) errors.push(`sources[${index}].upstreamUrl doit nommer la source primaire amont par une URL https publique.`);
    requireText(errors, source?.classificationReason, `sources[${index}].classificationReason`, 20);
    if (source?.level === 'original-method') {
      if (source?.provenance !== 'primary') errors.push(`sources[${index}] : une méthode originale doit porter provenance primary.`);
      for (const [field, minimum] of [['period', 8], ['population', 12], ['protocol', 20], ['limitations', 20]]) {
        if (!hasText(source?.method?.[field], minimum)) errors.push(`sources[${index}] : la méthode originale doit documenter ${field} (${minimum} caractères minimum).`);
      }
    } else if (source?.method !== null) {
      errors.push(`sources[${index}].method doit être null hors niveau original-method.`);
    }
  });
  if (Array.isArray(candidate.sources) && new Set(candidate.sources.map((source) => source?.id)).size !== candidate.sources.length) errors.push('Chaque source doit porter un id unique.');
  requireText(errors, candidate.author, 'author', 2);
  requireText(errors, candidate.reviewer, 'reviewer', 2);
  requireText(errors, candidate.reviewRule, 'reviewRule', 10);
  requireText(errors, candidate.cta?.label, 'cta.label', 2);
  requireText(errors, candidate.cta?.destination, 'cta.destination', 1);
  requireText(errors, candidate.cta?.outcome, 'cta.outcome', 5);
  requireText(errors, candidate.image?.heroId, 'image.heroId', 3);
  requireText(errors, candidate.image?.master, 'image.master', 3);
  requireText(errors, candidate.image?.og, 'image.og', 3);
  if (candidate.image?.engine !== 'image_generate') errors.push('image.engine doit valoir image_generate.');
  const altLength = typeof candidate.image?.alt === 'string' ? [...candidate.image.alt].length : 0;
  if (altLength < 10 || altLength > 125) errors.push('image.alt doit contenir 10 à 125 caractères.');
  validateResearchProof(errors, candidate.research?.serp, 'SERP', gateMode);
  validateResearchProof(errors, candidate.research?.gsc, 'GSC', gateMode);
  if (!Array.isArray(candidate.links?.outgoing) || candidate.links.outgoing.length === 0) errors.push('links.outgoing doit contenir au moins un lien utile.');
  if (!Array.isArray(candidate.links?.incoming) || new Set(candidate.links.incoming).size < 2) errors.push('links.incoming doit contenir au moins deux pages sources distinctes.');
  if (!['faible', 'moyen'].includes(candidate.cannibalization?.risk)) errors.push('Une cannibalisation forte, bloquante ou non évaluée interdit la preview.');
  requireText(errors, candidate.cannibalization?.decision, 'cannibalization.decision', 5);
  if (!Array.isArray(candidate.contradictions)) errors.push('contradictions doit être une liste.');
  else if (candidate.contradictions.some((item) => !hasText(item?.arbitration, 5))) errors.push('Toute contradiction doit porter un arbitrage explicite.');
  if (candidate.kevin?.briefApproved !== true) errors.push('Le brief doit être approuvé explicitement par Kevin avant preview.');
  return errors;
}

function validateSkillRows(rows, expected, family) {
  const errors = [];
  if (!Array.isArray(rows)) return [`Le registre ${family} doit être une liste de ${expected.length} lignes.`];
  if (rows.length !== expected.length) errors.push(`Le registre ${family} doit contenir exactement ${expected.length} lignes (reçu : ${rows.length}).`);
  const names = rows.map((row) => row?.skill);
  if (new Set(names).size !== names.length) errors.push(`Chaque skill ${family} doit être unique.`);
  for (const name of expected) if (!names.includes(name)) errors.push(`Skill ${family} manquant : ${name}.`);
  for (const row of rows) {
    const prefix = `${family}.${row?.skill ?? 'inconnu'}`;
    if (!expected.includes(row?.skill)) errors.push(`${prefix} n'appartient pas au registre canonique.`);
    if (row?.status === 'RUN') {
      if (row.applicable !== true) errors.push(`${prefix} RUN doit être applicable.`);
      if (row.result !== 'PASS') errors.push(`${prefix} RUN/${row?.result ?? 'sans résultat'} : seul PASS ouvre la preview ; FAIL bloque.`);
      requireText(errors, row.evidence, `${prefix}.evidence`, 3);
      if (!isDate(row.checkedAt)) errors.push(`${prefix}.checkedAt doit être une date AAAA-MM-JJ.`);
    } else if (row?.status === 'N/A') {
      if (row.applicable !== false) errors.push(`${prefix} N/A ne peut pas être applicable.`);
      if (!hasText(row.justification, 12)
        || /^inutile\.?$/i.test(row.justification.trim())
        || /manifeste amont scellé conclut/i.test(row.justification)) errors.push(`${prefix} N/A exige une justification factuelle propre à l’article.`);
    } else {
      errors.push(`${prefix}.status doit valoir RUN ou N/A.`);
    }
  }
  return errors;
}

export function validateSkillsManifest(manifest) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) return ['Le registre des skills doit être un objet JSON.'];
  const errors = [];
  if (manifest.version !== 1) errors.push('skills.version doit valoir 1.');
  errors.push(...validateSkillRows(manifest.blog, BLOG_SKILLS, 'Blog'));
  errors.push(...validateSkillRows(manifest.seo, SEO_SKILLS, 'SEO'));
  if (!Array.isArray(manifest.contradictions)) errors.push('skills.contradictions doit être une liste.');
  else if (manifest.contradictions.some((item) => !hasText(item?.arbitration, 5))) errors.push('Une contradiction du registre reste sans arbitrage explicite.');
  return errors;
}

function validateRequiredSkills(skills, sensitiveMatter) {
  const errors = [];
  const rows = new Map([...(skills?.blog ?? []), ...(skills?.seo ?? [])].map((row) => [row?.skill, row]));
  for (const skill of [...CORE_BLOG_SKILLS, ...CORE_SEO_SKILLS]) {
    if (rows.get(skill)?.status !== 'RUN') errors.push(`Le skill cœur ${skill} doit être RUN/PASS pour ce candidat.`);
  }
  if (![rows.get('blog-write'), rows.get('blog-rewrite')].some((row) => row?.status === 'RUN' && row?.result === 'PASS')) {
    errors.push('Le candidat doit exécuter blog-write ou blog-rewrite en RUN/PASS selon qu’il s’agit d’une création ou d’une réécriture.');
  }
  if (sensitiveMatter.sensitive && rows.get('blog-factcheck')?.status !== 'RUN') {
    errors.push(`Le skill blog-factcheck doit être RUN/PASS : la matière sensible (${sensitiveMatter.signals.join(', ')}) exige un fact-check.`);
  }
  return errors;
}

export function validateHeadings(markdown) {
  const errors = [];
  const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
  const headings = [...body.matchAll(/^(#{1,6})\s+\S.*$/gm)].map((match) => ({ level: match[1].length, line: body.slice(0, match.index).split(/\r?\n/).length }));
  if (headings.some((heading) => heading.level === 1)) errors.push('Le H1 vient du frontmatter : aucun H1 n’est admis dans le corps Markdown.');
  let previous = 1;
  for (const heading of headings) {
    if (heading.level > previous + 1) errors.push(`Hiérarchie Hn : saut de H${previous} à H${heading.level} vers la ligne ${heading.line}.`);
    previous = heading.level;
  }
  return errors;
}

export function auditArticleInventory({ root = process.cwd() } = {}) {
  const absoluteRoot = resolve(root);
  const blogDirectory = join(absoluteRoot, 'src/content/blog');
  const baselinePath = join(absoluteRoot, 'editorial/legacy-baseline.json');
  const errors = [];
  const articles = [];
  let baseline = { articles: {} };
  if (existsSync(baselinePath)) {
    try {
      baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
    } catch (error) {
      return { articles, errors: [`legacy-baseline.json invalide : ${error.message}`] };
    }
  }
  for (const filename of readdirSync(blogDirectory).filter((name) => name.endsWith('.md')).sort()) {
    const slug = filename.replace(/\.md$/, '');
    const content = readFileSync(join(blogDirectory, filename), 'utf8');
    const actualHash = sha256(content);
    const dossier = join(absoluteRoot, 'editorial/articles', slug);
    if (existsSync(join(dossier, 'manifest.json')) && existsSync(join(dossier, 'skills.json'))) {
      articles.push({ slug, status: 'pipeline', sha256: actualHash });
      continue;
    }
    if (baseline.articles?.[slug] === actualHash) {
      articles.push({ slug, status: 'legacy-preserved', sha256: actualHash });
      continue;
    }
    errors.push(`${slug} a changé ou est nouveau sans dossier éditorial complet (manifest.json + skills.json).`);
    articles.push({ slug, status: 'blocked', sha256: actualHash });
  }
  for (const slug of Object.keys(baseline.articles ?? {})) {
    if (!existsSync(join(blogDirectory, `${slug}.md`))) errors.push(`Article historique supprimé sans décision : ${slug}.`);
  }
  return { articles, errors };
}

function readJson(path, errors, label) {
  if (!existsSync(path)) {
    errors.push(`${label} absent : ${path}.`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    errors.push(`${label} invalide : ${error.message}`);
    return null;
  }
}

function writeJsonAtomic(path, value) {
  const temporary = `${path}.${process.pid}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  renameSync(temporary, path);
}

function replaceTemplateTokens(value, replacements) {
  if (typeof value === 'string') {
    let result = value;
    for (const [token, replacement] of Object.entries(replacements)) result = result.replaceAll(token, replacement);
    return result;
  }
  if (Array.isArray(value)) return value.map((item) => replaceTemplateTokens(item, replacements));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replaceTemplateTokens(item, replacements)]));
  }
  return value;
}

export function createCandidate({ root = process.cwd(), slug, title, primaryQuery, secondaryQueries = [], date }) {
  const absoluteRoot = resolve(root);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug ?? '')) throw new Error('Le slug doit être en minuscules ASCII séparées par des tirets.');
  if (!hasText(title, 10)) throw new Error('Le titre de travail doit contenir au moins 10 caractères.');
  if (!hasText(primaryQuery, 3)) throw new Error('La création exige une requête primaire mesurée.');
  if (!Array.isArray(secondaryQueries)) throw new Error('secondaryQueries doit être une liste.');
  if (!isDate(date)) throw new Error('La date candidat doit être au format AAAA-MM-JJ.');
  verifierTitreIntentMesure({ root: absoluteRoot, titre: title, requetes: [primaryQuery, ...secondaryQueries], au: date, surface: `${slug} : H1` });
  const queuePath = join(absoluteRoot, 'editorial/queue.json');
  const queue = JSON.parse(readFileSync(queuePath, 'utf8'));
  if (!Array.isArray(queue.candidates)) throw new Error('editorial/queue.json doit contenir une liste candidates.');
  const actifs = queue.candidates.filter((candidate) => !['archive', 'bloque'].includes(candidate.status));
  verifierPlafonds(actifs, date);
  if (queue.candidates.some((candidate) => candidate.slug === slug)) throw new Error(`Le candidat ${slug} existe déjà dans la file.`);

  const articlePath = join(absoluteRoot, 'src/content/blog', `${slug}.md`);
  const dossier = join(absoluteRoot, 'editorial/articles', slug);
  if (existsSync(articlePath) || existsSync(dossier)) throw new Error(`Le candidat ${slug} existe déjà sur disque.`);
  const templates = join(absoluteRoot, 'editorial/templates');
  const articleTemplate = readFileSync(join(templates, 'article.md'), 'utf8');
  const replacements = { __SLUG__: slug, __TITLE__: title, __PRIMARY_QUERY__: primaryQuery, __DATE__: date };
  const manifest = replaceTemplateTokens(JSON.parse(readFileSync(join(templates, 'manifest.json'), 'utf8')), replacements);
  const skillTemplate = JSON.parse(readFileSync(join(templates, 'skills.json'), 'utf8'));
  const pendingRow = (skill) => ({ skill, applicable: null, status: 'TODO', result: null, evidence: `preuves/skills/${skill}.json`, checkedAt: null, justification: '__A_RENSEIGNER__' });
  const skills = {
    ...skillTemplate,
    blog: skillTemplate.blog.map((item) => typeof item === 'string' ? pendingRow(item) : item),
    seo: skillTemplate.seo.map((item) => typeof item === 'string' ? pendingRow(item) : item),
  };

  mkdirSync(join(dossier, 'preuves', 'skills'), { recursive: true });
  mkdirSync(join(dossier, 'preuves', 'image'), { recursive: true });
  mkdirSync(join(dossier, 'preuves', 'sources'), { recursive: true });
  manifest.slug = slug;
  manifest.title = title;
  manifest.primaryQuery = primaryQuery;
  manifest.secondaryQueries = secondaryQueries;
  manifest.editorialStatus = 'a-preparer';
  manifest.kevin = { briefApproved: false, previewApproved: false, productionApproved: false };
  writeJsonAtomic(join(dossier, 'manifest.json'), manifest);
  writeJsonAtomic(join(dossier, 'skills.json'), skills);
  const article = Object.entries(replacements).reduce((content, [token, replacement]) => content.replaceAll(token, replacement), articleTemplate);
  writeFileSync(articlePath, article);
  const artifactReplacements = {
    ...replacements,
    __ARTICLE_SHA256__: sha256(readFileSync(articlePath)),
    __MANIFEST_SHA256__: sha256(readFileSync(join(dossier, 'manifest.json'))),
  };
  for (const filename of ['brief.md', 'claims.json', 'review.json', 'image.json']) {
    const template = readFileSync(join(templates, filename), 'utf8');
    const hydrated = Object.entries(artifactReplacements).reduce((content, [token, replacement]) => content.replaceAll(token, replacement), template);
    writeFileSync(join(dossier, filename), hydrated);
  }
  const businessReviewTemplate = readFileSync(join(templates, 'business-review-evidence.json'), 'utf8');
  const hydratedBusinessReview = Object.entries(artifactReplacements).reduce((content, [token, replacement]) => content.replaceAll(token, replacement), businessReviewTemplate);
  writeFileSync(join(dossier, 'preuves/business-review.json'), hydratedBusinessReview);
  queue.candidates.push({ slug, date, status: 'a-preparer' });
  writeJsonAtomic(queuePath, queue);
  return { slug, article: articlePath, dossier };
}

function addressToBigInt(address, family) {
  if (family === 4) return address.split('.').reduce((value, part) => (value << 8n) | BigInt(Number(part)), 0n);
  let normalized = address;
  if (normalized.includes('.')) {
    const lastColon = normalized.lastIndexOf(':');
    const ipv4 = normalized.slice(lastColon + 1).split('.').map(Number);
    normalized = `${normalized.slice(0, lastColon)}:${((ipv4[0] << 8) | ipv4[1]).toString(16)}:${((ipv4[2] << 8) | ipv4[3]).toString(16)}`;
  }
  const [left = '', right = ''] = normalized.split('::');
  const leftParts = left ? left.split(':') : [];
  const rightParts = right ? right.split(':') : [];
  const missing = 8 - leftParts.length - rightParts.length;
  const parts = normalized.includes('::')
    ? [...leftParts, ...Array(missing).fill('0'), ...rightParts]
    : leftParts;
  return parts.reduce((value, part) => (value << 16n) | BigInt(`0x${part || '0'}`), 0n);
}

function isInCidr(address, cidr, family) {
  const [network, prefixText] = cidr.split('/');
  const bits = family === 4 ? 32 : 128;
  const shift = BigInt(bits - Number(prefixText));
  return (addressToBigInt(address, family) >> shift) === (addressToBigInt(network, family) >> shift);
}

function isForbiddenAddress(address) {
  const normalized = address.toLowerCase().split('%', 1)[0];
  if (normalized.startsWith('::ffff:')) return isForbiddenAddress(normalized.slice(7));
  const family = isIP(normalized);
  if (family === 4) return SPECIAL_IPV4_CIDRS.some((cidr) => isInCidr(normalized, cidr, family));
  if (family === 6) return SPECIAL_IPV6_CIDRS.some((cidr) => isInCidr(normalized, cidr, family));
  return true;
}

async function validateRemoteUrl(rawUrl, resolver) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error('La vérification source exige une URL HTTPS valide.');
  }
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('La vérification source exige une URL HTTPS sans identifiants.');
  if (RESERVED_SOURCE_HOST.test(url.hostname)) throw new Error('La vérification refuse les domaines réservés ou factices.');
  const hostname = url.hostname.replace(/^\[|\]$/g, '');
  const literalFamily = isIP(hostname);
  const addresses = literalFamily
    ? [{ address: hostname, family: literalFamily }]
    : await resolver(hostname, { all: true, verbatim: true });
  if (!Array.isArray(addresses) || addresses.length === 0) throw new Error(`La résolution DNS de ${hostname} n’a retourné aucune adresse.`);
  if (addresses.some(({ address }) => isForbiddenAddress(address))) {
    throw new Error(`La vérification refuse une adresse loopback, privée, link-local ou réservée pour ${hostname}.`);
  }
  return { url, addresses };
}

async function readBoundedResponse(response) {
  const declaredLength = Number(response.headers?.get?.('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_SOURCE_BYTES) throw new Error(`La source dépasse la taille maximale de ${MAX_SOURCE_BYTES} octets.`);
  if (!response.body?.getReader) throw new Error('La source ne fournit pas de flux de réponse bornable.');
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_SOURCE_BYTES) {
      await reader.cancel();
      throw new Error(`La source dépasse la taille maximale de ${MAX_SOURCE_BYTES} octets.`);
    }
    chunks.push(Buffer.from(value));
  }
  const contentType = response.headers?.get?.('content-type') ?? '';
  const charsetMatch = contentType.match(/charset\s*=\s*(?:"([^"]+)"|'([^']+)'|([^;\s]+))/i);
  const charset = charsetMatch?.slice(1).find(Boolean)?.trim() ?? 'utf-8';
  try {
    return new TextDecoder(charset, { fatal: true }).decode(Buffer.concat(chunks));
  } catch (error) {
    throw new Error(`La source ne peut pas être décodée avec le charset déclaré « ${charset} ».`, { cause: error });
  }
}

export async function verifySource({ root = process.cwd(), slug, sourceId, excerpt, fetcher = fetchUndici, resolver = dnsLookup }) {
  const absoluteRoot = resolve(root);
  const dossier = join(absoluteRoot, 'editorial/articles', slug);
  const manifestPath = join(dossier, 'manifest.json');
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    throw new Error(`manifest.json invalide pour ${slug} : ${error.message}`, { cause: error });
  }
  const source = (manifest.sources ?? []).find((item) => item.id === sourceId);
  if (!source) throw new Error(`Source inconnue pour ${slug} : ${sourceId}.`);
  if (!hasText(excerpt, 12)) throw new Error('Un extrait exact d’au moins 12 caractères est requis pour relier la source.');
  const approvedAddresses = new Map();
  const remember = ({ url, addresses }) => {
    approvedAddresses.set(url.hostname.replace(/^\[|\]$/g, ''), addresses);
    return url;
  };
  let currentUrl = remember(await validateRemoteUrl(source.url, resolver));
  const dispatcher = new Agent({
    connect: {
      lookup: (hostname, options, callback) => {
        const addresses = approvedAddresses.get(hostname.replace(/^\[|\]$/g, ''));
        if (!addresses?.length) return callback(new Error(`Résolution réseau non prévalidée : ${hostname}.`));
        if (options?.all) return callback(null, addresses);
        return callback(null, addresses[0].address, addresses[0].family);
      },
    },
  });
  let response;
  let body;
  try {
    for (let redirectCount = 0; redirectCount <= MAX_SOURCE_REDIRECTS; redirectCount += 1) {
      response = await fetcher(currentUrl.href, {
        redirect: 'manual',
        dispatcher,
        signal: AbortSignal.timeout(15_000),
        headers: { 'user-agent': 'MemliaBlogSourceVerifier/1.0 (+https://memlia.fr)' },
      });
      if (![301, 302, 303, 307, 308].includes(response.status)) break;
      if (redirectCount === MAX_SOURCE_REDIRECTS) throw new Error(`La source dépasse ${MAX_SOURCE_REDIRECTS} redirects.`);
      const location = response.headers?.get?.('location');
      if (!hasText(location)) throw new Error('La source répond par un redirect sans destination.');
      await response.body?.cancel?.();
      currentUrl = remember(await validateRemoteUrl(new URL(location, currentUrl).href, resolver));
    }
    if (response.url && response.url !== currentUrl.href) remember(await validateRemoteUrl(response.url, resolver));
    if (!response.ok) throw new Error(`La source ${source.url} répond HTTP ${response.status}.`);
    body = await readBoundedResponse(response);
  } finally {
    await dispatcher.close();
  }
  if (!body.includes(excerpt)) throw new Error('L’extrait fourni est absent de la réponse ouverte ; aucune preuve n’a été écrite.');
  const retrievedAt = new Date().toISOString();
  const evidencePath = isSafeRelativePath(dossier, source.verificationEvidence);
  if (!evidencePath) throw new Error('verificationEvidence doit rester dans le dossier éditorial.');
  const contentPath = join(dirname(evidencePath), `${source.id}.source.txt`);
  mkdirSync(dirname(evidencePath), { recursive: true });
  writeFileSync(contentPath, body);
  writeJsonAtomic(evidencePath, {
    version: 1,
    candidateSlug: slug,
    sourceId: source.id,
    level: source.level,
    provenance: source.provenance,
    official: source.official,
    upstreamUrl: source.upstreamUrl,
    classificationReason: source.classificationReason,
    method: source.method,
    requestedUrl: source.url,
    finalUrl: response.url || currentUrl.href,
    httpStatus: response.status,
    checkedAt: jourRecuperationParis(retrievedAt),
    retrievedAt,
    contentType: response.headers.get('content-type') ?? 'inconnu',
    contentPath: relative(dossier, contentPath),
    contentSha256: sha256(body),
    excerpt,
  });
  return { sourceId, evidence: relative(absoluteRoot, evidencePath), content: relative(absoluteRoot, contentPath) };
}

function readEvidenceJson(dossier, reference, errors, label) {
  const path = isSafeRelativePath(dossier, reference);
  if (!path || !existsSync(path)) {
    errors.push(`${label} est absente ou sort du dossier éditorial : ${reference ?? '(absente)'}.`);
    return null;
  }
  if (!path.endsWith('.json')) {
    errors.push(`${label} doit être un artefact JSON structuré, pas une preuve texte auto-déclarée.`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    errors.push(`${label} est un JSON invalide : ${error.message}`);
    return null;
  }
}

function validateSubjectEvidence(errors, evidence, expected, label, expectedKind) {
  if (!evidence) return;
  if (evidence.version !== 1) errors.push(`${label}.version doit valoir 1.`);
  if (evidence.candidateSlug !== expected.slug) errors.push(`${label}.candidateSlug ne nomme pas le candidat exact ${expected.slug}.`);
  if (evidence.articleSha256 !== expected.articleHash) errors.push(`${label}.articleSha256 ne correspond pas au contenu exact du candidat.`);
  if (evidence.manifestSha256 !== expected.manifestHash) errors.push(`${label}.manifestSha256 ne correspond pas au manifeste exact du candidat.`);
  if (expectedKind && evidence.kind !== expectedKind) errors.push(`${label}.kind doit valoir ${expectedKind}.`);
  if (evidence.status !== 'PASS') errors.push(`${label}.status doit valoir PASS.`);
  if (!isDate(evidence.checkedAt)) errors.push(`${label}.checkedAt doit être une date AAAA-MM-JJ.`);
  if (!Array.isArray(evidence.observations) || evidence.observations.length === 0 || evidence.observations.some((item) => !hasText(item, 12))) {
    errors.push(`${label}.observations doit contenir au moins un constat substantiel.`);
  }
}

function validateSources(manifest, dossier, expected) {
  const errors = [];
  const verified = new Map();
  for (const [index, source] of (manifest?.sources ?? []).entries()) {
    const label = `sources[${index}].verificationEvidence`;
    const proof = readEvidenceJson(dossier, source?.verificationEvidence, errors, label);
    const classificationLabel = `sources[${index}].classificationEvidence`;
    const classificationProof = readEvidenceJson(dossier, source?.classificationEvidence, errors, classificationLabel);
    if (source?.classificationEvidence === source?.verificationEvidence) errors.push(`${classificationLabel} doit être distincte de la preuve d’ouverture de l’URL.`);
    validateSubjectEvidence(errors, classificationProof, expected, classificationLabel, 'source-classification');
    if (classificationProof) {
      if (classificationProof.sourceId !== source.id) errors.push(`${classificationLabel}.sourceId n'est pas relié à ${source.id}.`);
      if (classificationProof.sourceUrl !== source.url) errors.push(`${classificationLabel}.sourceUrl n'est pas reliée à l'URL du manifeste.`);
      if (proof && classificationProof.finalUrl !== proof.finalUrl) errors.push(`${classificationLabel}.finalUrl n'est pas reliée à l'URL finale effectivement ouverte.`);
      for (const field of ['publisher', 'level', 'provenance', 'official', 'upstreamUrl']) {
        if (!sameValue(classificationProof[field], source[field])) errors.push(`${classificationLabel}.${field} ne correspond pas à la source du manifeste.`);
      }
      requireText(errors, classificationProof.classifiedBy, `${classificationLabel}.classifiedBy`, 3);
      requireText(errors, classificationProof.reviewedBy, `${classificationLabel}.reviewedBy`, 3);
      if (classificationProof.classifiedBy === classificationProof.reviewedBy) errors.push(`${classificationLabel} : la classification doit être relue par une identité distincte de classifiedBy.`);
    }
    if (!proof) continue;
    if (proof.version !== 1) errors.push(`${label}.version doit valoir 1.`);
    if (proof.candidateSlug !== expected.slug) errors.push(`${label}.candidateSlug ne nomme pas le candidat exact ${expected.slug}.`);
    if (proof.sourceId !== source.id) errors.push(`${label}.sourceId n'est pas relié à ${source.id}.`);
    for (const field of ['level', 'provenance', 'official', 'upstreamUrl', 'classificationReason', 'method']) {
      if (!sameValue(proof[field], source[field])) errors.push(`${label}.${field} ne correspond pas à la classification du manifeste.`);
    }
    if (!ACCEPTED_SOURCE_LEVELS.has(source.level)) errors.push(`${label} : les sources ${source.level ?? 'sans niveau'} sont refusées ; seuls tier-1, tier-2, tier-3, original-method ou technical-primary sont admis.`);
    if (source.provenance === 'echo') errors.push(`${label} : une source écho seule est refusée et doit être supprimée ou remplacée par sa source primaire.`);
    if (proof.requestedUrl !== source.url) errors.push(`${label}.requestedUrl n'est pas relié à l'URL du manifeste.`);
    rejectDisallowedSourcePlatform(source.url, errors, `${label}.requestedUrl`);
    rejectDisallowedSourcePlatform(source.upstreamUrl, errors, `${label}.upstreamUrl`);
    let deterministicClassification = { officialAuthority: false };
    try {
      const finalHostname = new URL(proof.finalUrl).hostname.replace(/^\[|\]$/g, '');
      if (!/^https:\/\//.test(proof.finalUrl) || RESERVED_SOURCE_HOST.test(finalHostname) || (isIP(finalHostname) && isForbiddenAddress(finalHostname))) errors.push(`${label}.finalUrl doit être une URL HTTPS finale non factice, publique et non réservée.`);
      deterministicClassification = sourceClassification(source, proof.finalUrl, errors, label);
    } catch {
      errors.push(`${label}.finalUrl doit être une URL HTTPS finale valide.`);
    }
    if (!isPublicHttpsUrl(proof.upstreamUrl)) errors.push(`${label}.upstreamUrl doit tracer une source primaire amont publique.`);
    if (source.provenance === 'primary' && proof.upstreamUrl !== proof.finalUrl) errors.push(`${label}.upstreamUrl doit être l'URL finale vérifiée lorsque provenance vaut primary.`);
    if (source.level === 'technical-primary') {
      if (source.official !== false) errors.push(`${label} : official=false est obligatoire pour une source primaire technique.`);
      if (source.provenance !== 'primary') errors.push(`${label} : provenance primary est obligatoire pour une source primaire technique.`);
      if (source.url !== proof.finalUrl) errors.push(`${label} : une source primaire technique doit être ouverte directement, sans redirection depuis un domaine tiers.`);
    }
    if (source.provenance === 'secondary' && proof.upstreamUrl === proof.finalUrl) errors.push(`${label}.upstreamUrl doit nommer une source primaire distincte pour une source secondary.`);
    if (proof.httpStatus < 200 || proof.httpStatus >= 300) errors.push(`${label}.httpStatus doit prouver une réponse 2xx.`);
    if (proof.checkedAt !== source.checkedAt) errors.push(`${label}.checkedAt doit être identique à la date de la source.`);
    if (jourRecuperationParis(proof.retrievedAt) !== proof.checkedAt) {
      errors.push(`${label}.retrievedAt doit dater l'ouverture réelle, non future, au jour civil Europe/Paris de checkedAt.`);
    }
    const snapshotPath = isSafeRelativePath(dossier, proof.contentPath);
    if (!snapshotPath || !existsSync(snapshotPath)) {
      errors.push(`${label}.contentPath doit pointer vers une copie locale vérifiée de la source.`);
      continue;
    }
    const snapshot = readFileSync(snapshotPath, 'utf8');
    if (!/^[a-f0-9]{64}$/.test(proof.contentSha256 ?? '') || sha256(snapshot) !== proof.contentSha256) {
      errors.push(`${label}.contentSha256 ne correspond pas à la copie locale de la source.`);
    }
    if (!hasText(proof.excerpt, 12) || !snapshot.includes(proof.excerpt)) errors.push(`${label}.excerpt est absent de la copie locale de la source.`);
    verified.set(source.id, { source, proof, snapshot, classificationProof, deterministicClassification });
  }
  return { errors, verified };
}

function renderedContentUnits(markdown) {
  return retirerPreuvesInline(markdownBody(markdown))
    .replace(/<!--[\s\S]*?-->/g, '')
    .split(/\r?\n\s*\r?\n/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((raw) => ({
      raw,
      text: raw
        .replace(/^#{1,6}\s+/, '')
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/[`*_~]/g, '')
        .replace(/\s+/g, ' ')
        .trim(),
    }))
    .map(({ raw, text }) => ({ id: `unit-${sha256(text).slice(0, 12)}`, text, raw }));
}

function normalizedDetectionText(value) {
  return String(value ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

function visibleSourceBlocks(source) {
  if (!/<(?:html|body|main|article|section|p|div|h[1-6])\b/i.test(source)) return [source.replace(/\s+/g, ' ').trim()];
  const document = parseHtml(source);
  const ignoredTags = new Set(['head', 'style', 'script', 'noscript', 'template']);
  const blockTags = new Set(['p', 'li', 'blockquote', 'figcaption', 'td', 'th', 'dt', 'dd', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
  const nodeText = (node, hidden = false) => {
    const ignored = hidden || ignoredTags.has(node.tagName);
    if (ignored) return '';
    if (node.nodeName === '#text') return node.value;
    return (node.childNodes ?? []).map((child) => nodeText(child, ignored)).join(' ');
  };
  const blocks = [];
  const visit = (node, hidden = false) => {
    const ignored = hidden || ignoredTags.has(node.tagName);
    if (!ignored && blockTags.has(node.tagName)) {
      const text = nodeText(node).replace(/\s+/g, ' ').trim();
      if (text) blocks.push(text);
      return;
    }
    for (const child of node.childNodes ?? []) visit(child, ignored);
  };
  visit(document);
  const fallback = nodeText(document).replace(/\s+/g, ' ').trim();
  return blocks.length ? blocks : [fallback];
}

export function contexteDeCitation(source, excerpt) {
  const citation = excerpt.replace(/\s+/g, ' ').trim();
  const visible = visibleSourceBlocks(source).find((block) => block.includes(citation)) ?? citation;
  const position = visible.indexOf(citation);
  if (position < 0) return citation;
  const end = position + citation.length;
  for (const { segment, index } of new Intl.Segmenter('fr', { granularity: 'sentence' }).segment(visible)) {
    if (index <= position && index + segment.length >= end) return segment.trim();
  }
  return citation;
}

function sourceContainsContext(source, context) {
  return source.includes(context) || visibleSourceBlocks(source).some((block) => block.includes(context));
}

function sensitiveTextSignals(value) {
  const text = normalizedDetectionText(value);
  const signals = SENSITIVE_TEXT_RULES.filter(([, pattern]) => pattern.test(text)).map(([id]) => id);
  if (NORMATIVE_LANGUAGE.test(text) && NORMATIVE_PARTIES.test(text)) signals.push('assertion-normative');
  return [...new Set(signals)];
}

function detectSensitiveMatter(manifest, claims, markdown) {
  const signals = new Set();
  const claimRequiredUnitIds = new Set();
  if (SENSITIVE_CLUSTERS.has(manifest?.cluster)) signals.add(`cluster:${manifest.cluster}`);
  for (const role of [manifest?.role?.primary, ...(manifest?.role?.secondary ?? [])]) {
    if (SENSITIVE_ROLES.has(role)) signals.add(`role:${role}`);
  }
  for (const claim of Array.isArray(claims?.claims) ? claims.claims : []) {
    if (SENSITIVE_CLAIM_TYPES.has(claim?.type)) signals.add(`claim.type:${claim.type}`);
  }

  const actualUnits = renderedContentUnits(markdown);
  const unitSignals = new Map();
  for (const unit of actualUnits) {
    const detected = sensitiveTextSignals(unit.text);
    if (detected.length > 0) {
      unitSignals.set(unit.id, detected);
      detected.forEach((signal) => signals.add(`contenu:${signal}`));
      const normalized = normalizedDetectionText(unit.text);
      const carriesLegalRule = detected.includes('legal-reglementaire');
      if (/https:\/\//i.test(unit.raw) || (carriesLegalRule && NORMATIVE_LANGUAGE.test(normalized))) {
        claimRequiredUnitIds.add(unit.id);
      }
    }
  }
  for (let index = 0; index < actualUnits.length - 1; index += 1) {
    const current = normalizedDetectionText(actualUnits[index].text);
    const next = normalizedDetectionText(actualUnits[index + 1].text);
    const normativeUnit = NORMATIVE_LANGUAGE.test(current) && NORMATIVE_PARTIES.test(next)
      ? actualUnits[index]
      : NORMATIVE_PARTIES.test(current) && NORMATIVE_LANGUAGE.test(next)
        ? actualUnits[index + 1]
        : null;
    if (normativeUnit) {
      const detected = unitSignals.get(normativeUnit.id) ?? [];
      unitSignals.set(normativeUnit.id, [...new Set([...detected, 'assertion-normative'])]);
      signals.add('contenu:assertion-normative');
    }
  }
  const renderedMetadata = [
    manifest?.title,
    manifest?.summary,
    manifest?.description,
    manifest?.task,
    manifest?.primaryQuery,
    ...(manifest?.secondaryQueries ?? []),
    ...(manifest?.topics ?? []),
    ...(manifest?.keywords ?? []),
  ];
  for (const value of renderedMetadata) {
    sensitiveTextSignals(value).forEach((signal) => signals.add(`contenu:${signal}`));
  }
  return { sensitive: signals.size > 0, signals: [...signals].sort(), unitSignals, claimRequiredUnitIds };
}

function supportTokens(value) {
  return [...new Set(normalizedDetectionText(value)
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length >= 4 && !SUPPORT_STOP_WORDS.has(token)))];
}

function hasMinimumClaimCitationOverlap(claim, context) {
  const normalizedClaim = normalizedDetectionText(claim).replace(/\s+/g, ' ').trim();
  const normalizedContext = normalizedDetectionText(context).replace(/\s+/g, ' ').trim();
  if (normalizedContext.includes(normalizedClaim)) return true;
  const claimTokens = supportTokens(claim);
  if (claimTokens.length === 0) return false;
  const contextTokens = new Set(supportTokens(context));
  const shared = claimTokens.filter((token) => contextTokens.has(token)).length;
  return shared >= Math.max(2, Math.ceil(claimTokens.length * 0.6));
}

function hasDocumentedClaimCitationOverlap(claim, context, translationTerms = []) {
  if (hasMinimumClaimCitationOverlap(claim, context)) return true;
  const normalizedClaim = normalizedDetectionText(claim);
  const normalizedContext = normalizedDetectionText(context);
  return Array.isArray(translationTerms)
    && translationTerms.length >= 2
    && translationTerms.every((pair) => hasText(pair?.claimTerm, 3)
      && hasText(pair?.citationTerm, 3)
      && normalizedClaim.includes(normalizedDetectionText(pair.claimTerm))
      && normalizedContext.includes(normalizedDetectionText(pair.citationTerm)));
}

function hasContradictoryPolarity(claim, citation) {
  const left = normalizedDetectionText(claim).replace(/[’']/g, ' ').replace(/\s+/g, ' ').trim();
  const right = normalizedDetectionText(citation).replace(/[’']/g, ' ').replace(/\s+/g, ' ').trim();
  const oppositeMarkers = [
    [/\btoujours\b/, /\bjamais\b/],
    [/\bobligatoire\b/, /\b(?:facultatif|optionnel)\b/],
    [/\binterdit\b/, /\bautorise\b/],
  ];
  if (oppositeMarkers.some(([positive, negative]) => (positive.test(left) && negative.test(right)) || (negative.test(left) && positive.test(right)))) return true;
  const predicates = ['autorise', 'doit', 'exige', 'permet', 'interdit', 'obligatoire'];
  const isNegated = (text, predicate) => new RegExp(`\\b(?:n|ne)\\s+${predicate}\\b|\\b${predicate}\\s+(?:pas|jamais|plus)\\b`).test(text);
  return predicates.some((predicate) => left.includes(predicate) && right.includes(predicate) && isNegated(left, predicate) !== isNegated(right, predicate));
}

function citationRange(snapshot, proof, locator) {
  const lines = snapshot.split(/\r?\n/);
  const sliceRange = (startLine, endLine) => {
    if (!Number.isInteger(startLine) || !Number.isInteger(endLine) || startLine < 1 || endLine < startLine || endLine > lines.length) return null;
    return lines.slice(startLine - 1, endLine).join('\n');
  };
  if (locator?.kind === 'line-range') return sliceRange(locator.startLine, locator.endLine);
  if (locator?.kind === 'section' && hasText(locator.heading, 2)) {
    const heading = normalizedDetectionText(locator.heading).replace(/^#+\s*/, '').trim();
    const start = lines.findIndex((line) => normalizedDetectionText(line).replace(/^#+\s*/, '').trim() === heading);
    if (start < 0) return null;
    let end = lines.length;
    for (let index = start + 1; index < lines.length; index += 1) {
      if (/^#{1,6}\s+/.test(lines[index])) {
        end = index;
        break;
      }
    }
    return lines.slice(start, end).join('\n');
  }
  if (locator?.kind === 'anchor' && hasText(locator.value, 1)) {
    const anchoredRange = proof?.anchors?.[locator.value];
    return sliceRange(anchoredRange?.startLine, anchoredRange?.endLine);
  }
  return null;
}

function validateCitation(result, claim, source, verified, prefix) {
  const errors = [];
  const citation = result?.citation;
  const text = citation?.text;
  if (!hasText(text, 12) || text !== result?.excerpt || text !== claim?.sourceExcerpts?.[source?.id] || !verified?.snapshot.includes(text)) {
    errors.push(`${prefix}.citation.text doit être la citation exacte reliée au claim et présente dans la copie locale vérifiée.`);
  }
  if (!/^[a-f0-9]{64}$/.test(citation?.sha256 ?? '') || sha256(text ?? '') !== citation?.sha256) errors.push(`${prefix}.citation.sha256 ne correspond pas à la citation exacte.`);
  if (citation?.sourceContentSha256 !== verified?.proof?.contentSha256) errors.push(`${prefix}.citation.sourceContentSha256 ne correspond pas à la copie locale vérifiée.`);
  const coordinates = citation?.coordinates;
  if (coordinates?.finalUrl !== verified?.proof?.finalUrl || coordinates?.checkedAt !== verified?.proof?.checkedAt || coordinates?.title !== source?.title) {
    errors.push(`${prefix}.citation.coordinates doit relier l’URL finale, la date et le titre exacts de la source vérifiée.`);
  }
  const located = citationRange(verified?.snapshot ?? '', verified?.proof, coordinates?.locator);
  if (!located || !located.includes(text ?? '')) errors.push(`${prefix}.citation.coordinates ne reproduit pas la citation dans la section, l’ancre ou la plage indiquée.`);
  const citationTokens = supportTokens(text);
  if ((text?.trim().length ?? 0) < 40 || citationTokens.length < 5) errors.push(`${prefix}.citation.text est trop générique pour étayer seule un claim sensible.`);
  if (!hasDocumentedClaimCitationOverlap(claim?.claim, text, result?.justification?.translationTerms)) errors.push(`${prefix}.citation.text ne partage pas assez d’entités ou traductions documentées avec le claim.`);
  if (hasContradictoryPolarity(claim?.claim, text)) errors.push(`${prefix}.citation.text porte une négation ou polarité contradictoire avec le claim.`);
  const sharedTerms = result?.justification?.sharedTerms;
  const actualShared = new Set(supportTokens(claim?.claim).filter((token) => citationTokens.includes(token)));
  const translationTerms = result?.justification?.translationTerms ?? [];
  const normalizedClaim = normalizedDetectionText(claim?.claim);
  const normalizedCitation = normalizedDetectionText(text);
  const translationsValid = Array.isArray(translationTerms) && translationTerms.every((pair) =>
    hasText(pair?.claimTerm, 3)
      && hasText(pair?.citationTerm, 3)
      && normalizedClaim.includes(normalizedDetectionText(pair.claimTerm))
      && normalizedCitation.includes(normalizedDetectionText(pair.citationTerm)));
  if (!Array.isArray(sharedTerms) || new Set(sharedTerms).size !== sharedTerms.length || sharedTerms.some((term) => !actualShared.has(term))
    || !translationsValid || sharedTerms.length + translationTerms.length < 2) {
    errors.push(`${prefix}.justification doit nommer au moins deux correspondances exactes ou traductions explicites entre le claim et la citation.`);
  }
  if (!hasText(result?.justification?.reasoning, 20)) errors.push(`${prefix}.justification.reasoning doit expliquer de façon structurée le lien claim↔citation.`);
  return errors;
}

function validateClaims(claims, markdown, manifest, verifiedSources, expected, sensitiveMatter) {
  const errors = [];
  if (claims?.version !== 1) errors.push('claims.version doit valoir 1.');
  if (claims?.candidateSlug !== expected.slug) errors.push(`claims.candidateSlug doit nommer le candidat exact ${expected.slug}.`);
  if (claims?.articleSha256 !== expected.articleHash) errors.push('claims.articleSha256 doit correspondre au contenu exact du candidat.');
  if (!Array.isArray(claims?.claims) || claims.claims.length === 0) return [...errors, 'Le registre des affirmations doit contenir au moins une affirmation porteuse.'];
  const actualUnits = renderedContentUnits(markdown);
  const registeredUnits = Array.isArray(claims?.contentUnits) ? claims.contentUnits : [];
  const unitsById = new Map(registeredUnits.map((unit) => [unit?.id, unit]));
  if (registeredUnits.length !== actualUnits.length) {
    errors.push(`L’inventaire exhaustif des unités porteuses diverge du rendu : ${actualUnits.length} unité(s) rendue(s), ${registeredUnits.length} enregistrée(s).`);
  }
  for (const unit of actualUnits) {
    const registered = unitsById.get(unit.id);
    if (!registered || registered.text !== unit.text) errors.push(`Unité porteuse non enregistrée dans claims.contentUnits : ${unit.id}.`);
  }
  for (const unit of registeredUnits) {
    if (!actualUnits.some((actual) => actual.id === unit?.id && actual.text === unit?.text)) errors.push(`claims.contentUnits.${unit?.id ?? 'sans-id'} ne correspond à aucune unité du rendu.`);
    if (sensitiveMatter.claimRequiredUnitIds.has(unit?.id)) {
      if (!Array.isArray(unit?.claimIds) || unit.claimIds.length === 0) {
        errors.push(`claims.contentUnits.${unit?.id ?? 'sans-id'} doit relier au moins une affirmation vérifiée : cette unité contient une matière sensible visible.`);
      }
      const linkedClaims = (claims?.claims ?? []).filter((claim) => unit?.claimIds?.includes(claim?.id));
      const unitSignals = sensitiveMatter.unitSignals.get(unit.id) ?? [];
      const rgpdWithoutObligation = unitSignals.length === 1 && unitSignals[0] === 'rgpd'
        && !RGPD_OBLIGATION_LANGUAGE.test(normalizedDetectionText(unit.text));
      if (!rgpdWithoutObligation && !linkedClaims.some((claim) => SENSITIVE_CLAIM_TYPES.has(claim?.type))) {
        errors.push(`claims.contentUnits.${unit?.id ?? 'sans-id'} contient une matière sensible visible (${sensitiveMatter.unitSignals.get(unit.id).join(', ')}) mais aucun claim.type sensible canonique.`);
      }
    }
  }
  const sourceIds = new Set((manifest?.sources ?? []).map((source) => source.id));
  claims.claims.forEach((claim, index) => {
    const prefix = `claims[${index}]`;
    requireText(errors, claim?.id, `${prefix}.id`, 3);
    requireText(errors, claim?.claim, `${prefix}.claim`, 10);
    requireEnum(errors, claim?.type, `${prefix}.type`, CLAIM_TYPES);
    requireText(errors, claim?.unitId, `${prefix}.unitId`, 3);
    const unit = unitsById.get(claim?.unitId);
    if (!unit || !unit.text.includes(claim?.claim ?? '') || !unit.claimIds?.includes(claim?.id)) errors.push(`${prefix} n’est pas reliée bidirectionnellement à son unité exacte du rendu.`);
    if (!Array.isArray(claim?.sourceIds) || claim.sourceIds.length === 0) errors.push(`${prefix}.sourceIds doit relier l’affirmation à au moins une source du manifeste.`);
    else for (const sourceId of claim.sourceIds) {
      if (!sourceIds.has(sourceId)) errors.push(`${prefix}.sourceIds référence une source absente du manifeste : ${sourceId}.`);
      const verified = verifiedSources.get(sourceId);
      if (!verified) errors.push(`${prefix} référence ${sourceId}, dont la vérification n’est pas prouvée.`);
      const unitSignals = sensitiveMatter.unitSignals.get(claim?.unitId) ?? [];
      if (verified?.source?.level === 'technical-primary' && (claim?.type !== 'methode' || verified.deterministicClassification?.technicalPrimary !== true)) {
        errors.push(`${prefix} : source primaire technique ${sourceId} réservée aux claims methode avec domaine et éditeur vérifiés.`);
      }
      if (OFFICIAL_PRIMARY_CLAIM_TYPES.has(claim?.type) || unitSignals.some((signal) => OFFICIAL_PRIMARY_SIGNALS.has(signal))) {
        const source = verified?.source ?? (manifest?.sources ?? []).find((item) => item.id === sourceId);
        if (!['tier-1', 'tier-2', 'tier-3'].includes(source?.level) || source?.provenance !== 'primary' || source?.official !== true || verified?.deterministicClassification?.officialAuthority !== true) {
          errors.push(`${prefix} de type ${claim.type} exige une source primaire officielle tier-1 à tier-3 ; ${sourceId} ne satisfait pas ce contrat.`);
        }
      }
      const excerpt = claim.sourceExcerpts?.[sourceId];
      if (!hasText(excerpt, 12) || (verified && !verified.snapshot.includes(excerpt))) errors.push(`${prefix}.sourceExcerpts.${sourceId} est absent de la copie vérifiée.`);
    }
    const factCheck = claim?.factCheck;
    if (factCheck?.verdict !== 'SUPPORTED') errors.push(`${prefix}.factCheck.verdict doit valoir SUPPORTED ; absent, contradictoire ou hors contexte ferme le gate.`);
    if (!isDate(factCheck?.checkedAt)) errors.push(`${prefix}.factCheck.checkedAt doit être une date AAAA-MM-JJ.`);
    const sourceResults = Array.isArray(factCheck?.sourceResults) ? factCheck.sourceResults : [];
    if (sourceResults.length !== (claim?.sourceIds ?? []).length) errors.push(`${prefix}.factCheck.sourceResults doit contenir exactement un résultat par source liée.`);
    if (new Set(sourceResults.map((result) => result?.sourceId)).size !== sourceResults.length) errors.push(`${prefix}.factCheck.sourceResults doit contenir des sourceId uniques.`);
    for (const sourceId of claim?.sourceIds ?? []) {
      const result = sourceResults.find((item) => item?.sourceId === sourceId);
      const verified = verifiedSources.get(sourceId);
      const source = verified?.source ?? (manifest?.sources ?? []).find((item) => item.id === sourceId);
      const resultPrefix = `${prefix}.factCheck.sourceResults.${sourceId}`;
      if (!result) {
        errors.push(`${resultPrefix} est absent.`);
        continue;
      }
      if (result.sourceUrl !== source?.url || result.verifiedUrl !== verified?.proof?.finalUrl) errors.push(`${resultPrefix} ne relie pas les URL source et finale exactes.`);
      if (result.excerpt !== claim.sourceExcerpts?.[sourceId]) errors.push(`${resultPrefix}.excerpt diverge de l’extrait relié au claim.`);
      if (!hasText(result.context, 12) || !result.context.includes(result.excerpt ?? '') || (verified && !sourceContainsContext(verified.snapshot, result.context))) {
        errors.push(`${resultPrefix}.context est absent, hors de la copie vérifiée ou ne contient pas l’extrait exact.`);
      }
      if (!/^[a-f0-9]{64}$/.test(result.contextSha256 ?? '') || sha256(result.context ?? '') !== result.contextSha256) errors.push(`${resultPrefix}.contextSha256 ne correspond pas au contexte exact.`);
      if (result.verdict !== 'SUPPORTED' || result.supportsClaim !== true || result.contradictsClaim !== false) errors.push(`${resultPrefix} déclare un support absent, contradictoire ou hors contexte.`);
      if (!hasText(result.explanation, 20)) errors.push(`${resultPrefix}.explanation doit motiver le support claim-par-claim.`);
      if (!hasDocumentedClaimCitationOverlap(claim.claim, result.context, result?.justification?.translationTerms)) errors.push(`${resultPrefix} ne soutient pas le claim : recouvrement lexical ou traduction documentée insuffisante.`);
      errors.push(...validateCitation(result, claim, source, verified, resultPrefix));
      if (!isDate(result.checkedAt)) errors.push(`${resultPrefix}.checkedAt doit être une date AAAA-MM-JJ.`);
    }
    if (!isDate(claim?.checkedAt)) errors.push(`${prefix}.checkedAt doit être une date AAAA-MM-JJ.`);
    if (claim?.status !== 'PASS') errors.push(`${prefix}.status doit être PASS ; reformuler ou supprimer bloque la preview.`);
  });
  if (new Set(claims.claims.map((claim) => claim?.id)).size !== claims.claims.length) errors.push('Chaque affirmation doit porter un id unique.');
  const citationClaims = new Map();
  for (const claim of claims.claims) for (const result of claim?.factCheck?.sourceResults ?? []) {
    const citationHash = result?.citation?.sha256;
    if (!citationHash) continue;
    const normalizedClaim = normalizedDetectionText(claim?.claim).replace(/\s+/g, ' ').trim();
    const prior = citationClaims.get(citationHash);
    if (prior && prior.normalizedClaim !== normalizedClaim) errors.push(`La citation ${citationHash} est recyclée sur des claims non équivalents (${prior.claimId} et ${claim?.id ?? 'sans-id'}).`);
    else citationClaims.set(citationHash, { claimId: claim?.id, normalizedClaim });
  }
  const claimIds = new Set(claims.claims.map((claim) => claim?.id));
  for (const unit of registeredUnits) for (const claimId of unit?.claimIds ?? []) {
    if (!claimIds.has(claimId)) errors.push(`claims.contentUnits.${unit?.id}.claimIds référence une affirmation absente : ${claimId}.`);
  }
  return errors;
}

function validateSensitiveFreshness(manifest, claims, review, skills, verifiedSources, dossier, sensitiveMatter, gateMode = 'production') {
  const errors = [];
  const reviewDay = review?.checkedAt;
  const today = jourRecuperationParis(new Date().toISOString());
  if (gateMode === 'published-audit') {
    // Audit de conservation borné par validatePublishedAdoption, jamais fact-check frais.
    if (manifest.evidenceVerifiedAt !== reviewDay) errors.push('La date historique du dossier publié doit correspondre à sa revue conservée.');
  } else if (gateMode === 'protected-preview') {
    const ageDays = (Date.parse(`${today}T00:00:00Z`) - Date.parse(`${reviewDay}T00:00:00Z`)) / 86_400_000;
    if (!Number.isFinite(ageDays) || ageDays < 0 || ageDays > MAX_PROTECTED_PREVIEW_EVIDENCE_AGE_DAYS) {
      errors.push(`Fraîcheur sensible : une preview protégée exige une revue âgée de 0 à ${MAX_PROTECTED_PREVIEW_EVIDENCE_AGE_DAYS} jours ; reçu ${reviewDay ?? 'absent'}.`);
    }
  } else if (gateMode === 'publication-scellee') {
    if (reviewDay !== manifest?.publishedAt) errors.push(`Fraîcheur sensible : un dossier scellé date sa revue du jour de publication (${manifest?.publishedAt ?? 'absent'}), reçu ${reviewDay ?? 'absent'}.`);
  } else if (reviewDay !== today) {
    errors.push(`Fraîcheur sensible : la revue éditoriale doit être datée du jour du gate (${today}), reçu ${reviewDay ?? 'absent'}.`);
  }
  const requireReviewDay = (value, label) => {
    if (value !== reviewDay) errors.push(`Fraîcheur sensible : ${label} doit être vérifié le jour de la revue éditoriale (${reviewDay ?? 'absent'}), reçu ${value ?? 'absent'}.`);
  };
  const sourceDates = (manifest?.sources ?? []).map((source) => source?.checkedAt);
  if (gateMode === 'published-audit') {
    requireReviewDay(manifest?.evidenceVerifiedAt, 'manifest.evidenceVerifiedAt');
  } else if (manifest?.sourcesVerifiedAt !== [...sourceDates].sort()[0]) {
    errors.push('Fraîcheur sensible : manifest.sourcesVerifiedAt doit dater la plus ancienne récupération source.');
  }
  for (const source of manifest?.sources ?? []) {
    if (gateMode !== 'published-audit') {
      const age = (Date.parse(`${reviewDay}T00:00:00Z`) - Date.parse(`${source?.checkedAt}T00:00:00Z`)) / 86_400_000;
      if (!Number.isInteger(age) || age < 0 || age > 7) errors.push(`Fraîcheur sensible : source ${source?.id ?? 'sans-id'} doit dater de 0 à 7 jours avant la revue (${reviewDay ?? 'absent'}).`);
    }
    if (verifiedSources.get(source?.id)?.proof?.checkedAt !== source?.checkedAt) errors.push(`Fraîcheur sensible : preuve source ${source?.id ?? 'sans-id'} doit dater de la récupération déclarée.`);
  }
  if (!sensitiveMatter.sensitive) return errors;
  for (const claim of Array.isArray(claims?.claims) ? claims.claims : []) {
    requireReviewDay(claim?.checkedAt, `claim ${claim?.id ?? 'sans-id'}.checkedAt`);
    requireReviewDay(claim?.factCheck?.checkedAt, `fact-check ${claim?.id ?? 'sans-id'}.checkedAt`);
    for (const result of claim?.factCheck?.sourceResults ?? []) requireReviewDay(result?.checkedAt, `fact-check ${claim?.id ?? 'sans-id'}/${result?.sourceId ?? 'sans-source'}.checkedAt`);
  }
  const editorialProof = readEvidenceJson(dossier, review?.rubricEvidence, [], 'preuve éditoriale');
  requireReviewDay(editorialProof?.checkedAt, 'preuve de revue éditoriale.checkedAt');
  const businessProof = readEvidenceJson(dossier, manifest?.businessReview?.evidence, [], 'preuve métier ou report de revue métier');
  requireReviewDay(businessProof?.checkedAt, 'preuve métier ou report.checkedAt');
  const factcheckSkill = skills?.blog?.find((row) => row?.skill === 'blog-factcheck');
  requireReviewDay(factcheckSkill?.checkedAt, 'skill blog-factcheck.checkedAt');
  const factcheckProof = readEvidenceJson(dossier, factcheckSkill?.evidence, [], 'preuve blog-factcheck');
  requireReviewDay(factcheckProof?.checkedAt, 'preuve blog-factcheck.checkedAt');
  return errors;
}

function validateReview(review, dossier, manifest, expected) {
  const errors = [];
  if (review?.version !== 1) errors.push('review.version doit valoir 1.');
  requireText(errors, review?.reviewer, 'review.reviewer', 2);
  if (review?.reviewer !== manifest?.reviewer) errors.push('review.reviewer doit être identique au reviewer du manifeste.');
  if (review?.reviewer === manifest?.author) errors.push('La revue éditoriale doit être portée par une personne distincte de l’auteur.');
  if (!isDate(review?.checkedAt)) errors.push('review.checkedAt doit être une date AAAA-MM-JJ.');
  if ('score' in (review ?? {})) errors.push('Un score saisi est interdit : le score doit être recalculé depuis la grille structurée.');
  if (!Array.isArray(review?.p0) || review.p0.length > 0) errors.push('La revue doit conclure à zéro P0.');
  if (review?.blocking !== false) errors.push('review.blocking doit valoir false avant preview.');
  if (review?.decision !== 'pret-preview') errors.push('review.decision doit valoir pret-preview.');
  if (!sameValue(review?.subject, { slug: expected.slug, articleSha256: expected.articleHash, manifestSha256: expected.manifestHash })) {
    errors.push('review.subject doit relier la revue au slug et aux empreintes exactes du candidat.');
  }
  const proof = readEvidenceJson(dossier, review?.rubricEvidence, errors, 'review.rubricEvidence (grille structurée)');
  validateSubjectEvidence(errors, proof, expected, 'review.rubricEvidence', 'editorial-review');
  if (proof) {
    if (proof.reviewer !== review.reviewer) errors.push('review.rubricEvidence.reviewer doit être identique au reviewer du dossier.');
    const rows = Array.isArray(proof.criteria) ? proof.criteria : [];
    if (rows.length !== REVIEW_CRITERIA.length) errors.push(`La grille structurée doit contenir exactement ${REVIEW_CRITERIA.length} critères.`);
    const byId = new Map(rows.map((row) => [row?.id, row]));
    let score = 0;
    for (const criterion of REVIEW_CRITERIA) {
      const row = byId.get(criterion.id);
      if (!row) {
        errors.push(`Critère de revue manquant : ${criterion.id}.`);
        continue;
      }
      if (!['PASS', 'FAIL'].includes(row.result)) errors.push(`review.criteria.${criterion.id}.result doit valoir PASS ou FAIL.`);
      const expectedEarned = row.result === 'PASS' ? criterion.weight : 0;
      if (row.earned !== expectedEarned) errors.push(`review.criteria.${criterion.id}.earned divergent : ${expectedEarned} attendu.`);
      if (!Array.isArray(row.observations) || row.observations.length === 0 || row.observations.some((item) => !hasText(item, 12))) {
        errors.push(`review.criteria.${criterion.id}.observations doit contenir un constat substantiel.`);
      }
      score += expectedEarned;
    }
    if (score < 90) errors.push(`Le score recalculé depuis la grille est ${score}/100 ; 90 minimum est requis.`);
  }
  return errors;
}

function validateBusinessReview(manifest, dossier, subject, sensitiveMatter, claims, verifiedSources, gateMode = 'production') {
  const errors = [];
  if (!sensitiveMatter.sensitive) return errors;
  const review = manifest?.businessReview;
  if (!review) return ['Une revue métier structurée est obligatoire pour toute matière paie, sociale, fiscale, juridique, légale ou réglementaire.'];
  if (review.required !== true) errors.push('La revue métier structurée exige businessReview.required à true pour toute matière sensible détectée.');
  if (gateMode === 'published-audit') {
    const proof = readEvidenceJson(dossier, review.evidence, errors, 'absence d’attestation du contenu déjà publié');
    validateSubjectEvidence(errors, proof, subject, 'absence d’attestation du contenu déjà publié', 'published-non-attestation');
    if (review.status !== 'PENDING' || review.reviewerId !== null || proof?.businessAttestation !== false || proof?.publicationAuthorized !== false) {
      errors.push('Le dossier publié non attesté ne doit inventer ni attestation ni autorisation de publication.');
    }
    return errors;
  }
  if (gateMode === 'protected-preview' && review.status === 'PENDING') {
    const proof = readEvidenceJson(dossier, review.evidence, errors, 'report explicite de revue métier');
    validateSubjectEvidence(errors, proof, subject, 'report explicite de revue métier', 'business-review-deferral');
    if (review.reviewerId !== null) errors.push('Une revue métier PENDING ne doit pas inventer de reviewerId.');
    if (proof?.approvedBy !== 'kevin' || proof?.decision !== 'defer-until-publication' || proof?.publicationBlocked !== true) {
      errors.push('Le report de revue métier doit tracer approvedBy=kevin, decision=defer-until-publication et publicationBlocked=true.');
    }
    return errors;
  }
  requireText(errors, review.reviewerId, 'businessReview.reviewerId', 3);
  if ([manifest.author, manifest.reviewer].includes(review.reviewerId)) errors.push('La revue métier doit être portée par une identité distincte de l’auteur et du reviewer éditorial.');
  requireEnum(errors, review.role, 'businessReview.role', ENUMS.role);
  if (review.status !== 'PASS') errors.push('businessReview.status doit valoir PASS avant preview.');
  const proof = readEvidenceJson(dossier, review.evidence, errors, 'preuve de revue métier');
  validateSubjectEvidence(errors, proof, subject, 'preuve de revue métier', 'business-review');
  if (proof?.reviewerId !== review.reviewerId) errors.push('La preuve de revue métier ne nomme pas l’identité exacte du relecteur métier.');
  if (proof?.role !== review.role) errors.push('La preuve de revue métier ne relie pas le rôle exact du relecteur métier.');
  const claimReviews = Array.isArray(proof?.claimReviews) ? proof.claimReviews : [];
  const expectedReviews = (Array.isArray(claims?.claims) ? claims.claims : []).flatMap((claim) => (Array.isArray(claim?.sourceIds) ? claim.sourceIds : []).map((sourceId) => ({ claim, sourceId })));
  if (claimReviews.length !== expectedReviews.length) errors.push(`La preuve de revue métier doit contenir exactement un verdict unitaire par couple claim/source (${expectedReviews.length} attendu(s)).`);
  const reviewKeys = claimReviews.map((item) => `${item?.claimId}\u0000${item?.sourceId}`);
  if (new Set(reviewKeys).size !== reviewKeys.length) errors.push('Les verdicts unitaires du reviewer métier doivent porter des couples claim/source uniques.');
  for (const { claim, sourceId } of expectedReviews) {
    const prefix = `preuve de revue métier.claimReviews.${claim?.id ?? 'sans-id'}/${sourceId}`;
    const item = claimReviews.find((candidate) => candidate?.claimId === claim?.id && candidate?.sourceId === sourceId);
    const verified = verifiedSources.get(sourceId);
    const result = claim?.factCheck?.sourceResults?.find((candidate) => candidate?.sourceId === sourceId);
    if (!item) {
      errors.push(`${prefix} est absent.`);
      continue;
    }
    if (!hasText(item.id, 8)) errors.push(`${prefix}.id doit identifier le verdict unitaire.`);
    if (item.candidateSlug !== subject.slug || item.articleSha256 !== subject.articleHash) errors.push(`${prefix} ne relie pas le slug et le SHA-256 exact du Markdown.`);
    if (item.claimSha256 !== sha256(claim?.claim ?? '')) errors.push(`${prefix}.claimSha256 ne correspond pas au claim exact.`);
    if (item.sourceContentSha256 !== verified?.proof?.contentSha256) errors.push(`${prefix}.sourceContentSha256 ne correspond pas à la copie locale vérifiée.`);
    if (item.citationSha256 !== result?.citation?.sha256) errors.push(`${prefix}.citationSha256 ne correspond pas à la citation exacte reliée au claim.`);
    if (item.reviewerId !== review.reviewerId) errors.push(`${prefix}.reviewerId ne nomme pas le reviewer métier distinct attendu.`);
    if (!BUSINESS_CLAIM_VERDICTS.has(item.verdict)) errors.push(`${prefix}.verdict doit valoir soutient, soutient_partiellement, contredit ou hors_sujet.`);
    else if (item.verdict !== 'soutient') errors.push(`${prefix} : seul le verdict soutient du reviewer métier ouvre le gate ; reçu ${item.verdict}.`);
    if (!isDate(item.checkedAt)) errors.push(`${prefix}.checkedAt doit être une date AAAA-MM-JJ.`);
    if (!hasText(item.reasoning, 20)) errors.push(`${prefix}.reasoning doit motiver le verdict métier unitaire.`);
  }
  return errors;
}

async function validateImage(image, dossier, manifest, root, subject) {
  const errors = [];
  const expected = manifest?.image;
  if (image?.version !== 1) errors.push('image.version doit valoir 1.');
  if (image?.candidateSlug !== subject.slug) errors.push(`image.candidateSlug doit nommer le candidat exact ${subject.slug}.`);
  if (image?.articleSha256 !== subject.articleHash) errors.push('image.articleSha256 doit correspondre au contenu exact du candidat.');
  if (image?.manifestSha256 !== subject.manifestHash) errors.push('image.manifestSha256 doit correspondre au manifeste exact du candidat.');
  if (image?.engine !== 'image_generate') errors.push('La provenance image doit être image_generate.');
  const promptProof = readEvidenceJson(dossier, image?.promptEvidence, errors, 'image.promptEvidence');
  validateSubjectEvidence(errors, promptProof, subject, 'image.promptEvidence', 'image-prompt');
  if (promptProof?.engine !== 'image_generate' || !hasText(promptProof?.prompt, 20)) errors.push('Le prompt exact image_generate doit être archivé dans une preuve structurée.');
  const generationProof = readEvidenceJson(dossier, image?.generationEvidence, errors, 'image.generationEvidence');
  validateSubjectEvidence(errors, generationProof, subject, 'image.generationEvidence', 'image-generation');
  if (generationProof?.engine !== 'image_generate' || !hasText(generationProof?.generationId, 8)) errors.push('La preuve de génération doit porter le moteur et un identifiant de sortie image_generate.');
  const visualProof = readEvidenceJson(dossier, image?.visualReviewEvidence, errors, 'image.visualReviewEvidence');
  validateSubjectEvidence(errors, visualProof, subject, 'image.visualReviewEvidence', 'image-visual-review');
  const visualRows = Array.isArray(visualProof?.criteria) ? visualProof.criteria : [];
  if (visualRows.length !== IMAGE_REVIEW_CRITERIA.length) errors.push(`La grille visuelle doit contenir exactement ${IMAGE_REVIEW_CRITERIA.length} critères observables.`);
  const visualById = new Map(visualRows.map((row) => [row?.id, row]));
  for (const criterion of IMAGE_REVIEW_CRITERIA) {
    const row = visualById.get(criterion);
    if (!row || row.result !== 'PASS' || !Array.isArray(row.observations) || row.observations.length === 0 || row.observations.some((item) => !hasText(item, 12))) {
      errors.push(`Le critère visuel ${criterion} doit être PASS avec au moins une observation substantielle.`);
    }
  }
  const altLength = typeof image?.alt === 'string' ? [...image.alt].length : 0;
  if (altLength < 10 || altLength > 125) errors.push('image.alt doit contenir 10 à 125 caractères.');
  if (isManifestlyNonDescriptiveAlt(image?.alt)) errors.push('image.alt est manifestement non descriptif (placeholder, nom de fichier, libellé générique, répétition ou suite factice évidente).');
  if (expected?.alt !== image?.alt) errors.push('L’alt du manifeste éditorial et celui de image.json doivent être identiques.');
  if (expected?.master !== image?.master?.path) errors.push('Le master du manifeste éditorial et celui de image.json doivent être identiques.');
  if (expected?.og !== image?.og?.path) errors.push('L’OG du manifeste éditorial et celui de image.json doivent être identiques.');
  if (image?.score !== 100) errors.push('Le score image doit être recalculé à 100 uniquement lorsque les six critères observables sont PASS.');
  if (image?.directionArt < 16 || image?.directionArt > 20) errors.push('Le score de direction artistique doit être compris entre 16 et 20.');
  if (image?.semanticRelevance < 20 || image?.semanticRelevance > 25) errors.push('Le score de pertinence sémantique doit être compris entre 20 et 25.');
  if (!Array.isArray(image?.p0) || image.p0.length > 0) errors.push('La revue image doit conclure à zéro P0.');
  if (image?.kevinApproved !== true) errors.push('Le brief et le rendu image doivent être approuvés explicitement par Kevin.');

  const variants = Array.isArray(image?.variants) ? image.variants : [];
  const assets = [image?.master, image?.og, ...variants];
  if (variants.length < 2) errors.push('image.variants doit contenir au moins un dérivé AVIF et un dérivé WebP.');
  const formats = new Set(variants.map((variant) => variant.format));
  if (!formats.has('avif') || !formats.has('webp')) errors.push('Les dérivés image doivent inclure AVIF et WebP.');
  if (image?.master?.width !== 1920 || image?.master?.height !== 1080) errors.push('Le master déclaré doit mesurer exactement 1920 × 1080.');
  if (image?.og?.width !== 1200 || image?.og?.height !== 630 || image?.og?.crop !== '1200x630+0+22') errors.push('L’OG déclaré doit mesurer 1200 × 630 avec le crop 1200x630+0+22.');
  for (const asset of assets) {
    if (!hasText(asset?.path)) continue;
    const path = resolve(dossier, asset.path);
    if (!path.startsWith(`${resolve(dossier)}/`) || !existsSync(path)) {
      errors.push(`Asset image absent ou hors dossier : ${asset.path}.`);
      continue;
    }
    try {
      const metadata = await sharp(path).metadata();
      if (metadata.width !== asset.width || metadata.height !== asset.height) errors.push(`Dimensions image divergentes pour ${asset.path} : ${metadata.width} × ${metadata.height}.`);
      const expectedFormat = asset.format === 'avif' ? 'heif' : asset.format;
      if (expectedFormat && metadata.format !== expectedFormat) errors.push(`Format image divergent pour ${asset.path} : ${metadata.format}.`);
      const stats = await sharp(path).stats();
      const channelVariation = Math.max(...stats.channels.slice(0, 3).map((channel) => channel.stdev));
      if (channelVariation < 6 || stats.entropy < 1) errors.push(`Image uniforme ou quasi uniforme refusée pour ${asset.path} : variation visuelle insuffisante.`);
    } catch (error) {
      errors.push(`Image illisible ${asset.path} : ${error.message}`);
    }
  }
  const masterPath = isSafeRelativePath(dossier, image?.master?.path);
  if (masterPath && existsSync(masterPath) && generationProof?.outputSha256 !== sha256(readFileSync(masterPath))) {
    errors.push('image.generationEvidence.outputSha256 ne correspond pas au master exact généré.');
  }
  const publicOg = join(root, 'public', 'images', `${expected?.heroId}-og.webp`);
  if (!existsSync(publicOg)) errors.push(`L’OG public manque : public/images/${expected?.heroId}-og.webp.`);
  else {
    const metadata = await sharp(publicOg).metadata();
    if (metadata.width !== 1200 || metadata.height !== 630 || metadata.format !== 'webp') errors.push('L’OG public doit être un WebP 1200 × 630.');
    const stats = await sharp(publicOg).stats();
    const variation = Math.max(...stats.channels.slice(0, 3).map((channel) => channel.stdev));
    if (variation < 6 || stats.entropy < 1) errors.push('L’OG public est uniforme ou quasi uniforme : le rendu final manque d’information visuelle.');
  }
  for (const variant of variants) {
    const publicPath = join(root, 'public', 'images', `${expected?.heroId}-${variant.width}.${variant.format}`);
    if (!existsSync(publicPath)) {
      errors.push(`Le dérivé public manque : ${relative(root, publicPath)}.`);
      continue;
    }
    const metadata = await sharp(publicPath).metadata();
    const format = variant.format === 'avif' ? 'heif' : variant.format;
    if (metadata.width !== variant.width || metadata.height !== variant.height || metadata.format !== format) {
      errors.push(`Le dérivé public ${relative(root, publicPath)} ne correspond pas à image.json.`);
    }
    const stats = await sharp(publicPath).stats();
    const variation = Math.max(...stats.channels.slice(0, 3).map((channel) => channel.stdev));
    if (variation < 6 || stats.entropy < 1) errors.push(`Le dérivé public ${relative(root, publicPath)} est uniforme ou quasi uniforme.`);
  }
  const imageManifestPath = join(root, 'src', 'data', 'images.mjs');
  const imageManifest = existsSync(imageManifestPath) ? readFileSync(imageManifestPath, 'utf8') : '';
  if (!imageManifest.includes(`'${expected?.heroId}'`) || !imageManifest.includes(expected?.alt ?? '__ALT_ABSENT__')) {
    errors.push('src/data/images.mjs doit déclarer le hero et le même alt que le dossier éditorial.');
  }
  return errors;
}

function validateArticleContract(markdown, manifest, gateMode = 'production') {
  const errors = [];
  const block = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  let frontmatter = {};
  try {
    frontmatter = parseYaml(block?.[1] ?? '') ?? {};
  } catch (error) {
    return [`Frontmatter YAML invalide : ${error.message}`];
  }
  const productionApproved = (['go-production', 'publie'].includes(manifest.editorialStatus) && manifest.kevin?.productionApproved === true)
    || (gateMode === 'published-audit' && manifest.editorialStatus === 'publie-non-atteste');
  const expected = {
    titre: manifest.title,
    titreOnglet: manifest.tabTitle,
    resume: manifest.summary,
    description: manifest.description,
    datePublication: manifest.publicationDate,
    ...(manifest.updatedAt ? { dateMiseAJour: manifest.updatedAt } : {}),
    auteur: manifest.author,
    sujets: manifest.topics,
    motsCles: manifest.keywords,
    brouillon: !productionApproved,
    image: manifest.image?.heroId,
    pipelineVersion: 1,
    primaryQuery: manifest.primaryQuery,
    secondaryQueries: manifest.secondaryQueries,
    intent: manifest.intent,
    fanOut: manifest.fanOut,
    cluster: manifest.cluster,
    rolePrincipal: manifest.role?.primary,
    rolesSecondaires: manifest.role?.secondary,
    tache: manifest.task,
    preuveRole: {
      niveau: manifest.role?.proof?.level,
      source: manifest.role?.proof?.source,
      date: manifest.role?.proof?.verifiedAt,
    },
    funnel: manifest.funnel,
    contentType: manifest.contentType,
    format: manifest.format,
    rankability: manifest.rankability,
    businessRelevance: manifest.businessRelevance,
    proofStatus: manifest.proofStatus,
    proofRequired: manifest.proofRequired,
    reviewRule: manifest.reviewRule,
    reviewer: manifest.reviewer,
    sourcesVerifieesLe: manifest.sourcesVerifiedAt,
    cta: manifest.cta,
    statutEditorial: manifest.editorialStatus,
    imageOg: `/images/${manifest.image?.heroId}-og.webp`,
    imageAlt: manifest.image?.alt,
    sources: (manifest.sources ?? []).map((source) => ({
      editeur: source.publisher,
      titre: source.title,
      url: source.url,
      consulte: gateMode === 'published-audit' ? source.publishedCheckedAt : source.checkedAt,
    })),
  };
  for (const [field, value] of Object.entries(expected)) {
    const actual = frontmatter[field];
    if (!sameValue(actual, value)) errors.push(`Frontmatter ${field} divergent : attendu ${JSON.stringify(value)}, reçu ${JSON.stringify(actual)}.`);
  }
  if (!manifest.updatedAt && frontmatter.dateMiseAJour !== undefined) {
    errors.push(`Frontmatter dateMiseAJour divergent : attendu absent, reçu ${JSON.stringify(frontmatter.dateMiseAJour)}.`);
  }
  return errors;
}

function markdownBody(markdown) {
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '').trim();
}

function normalizedContent(markdown) {
  return markdownBody(markdown)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('fr')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function shingles(content, size = 5) {
  const words = content.split(/\s+/).filter(Boolean);
  const values = new Set();
  for (let index = 0; index <= words.length - size; index += 1) values.add(words.slice(index, index + size).join(' '));
  return values;
}

function jaccard(left, right) {
  if (left.size === 0 || right.size === 0) return 0;
  let intersection = 0;
  for (const item of left) if (right.has(item)) intersection += 1;
  return intersection / (left.size + right.size - intersection);
}

function validateContentDepthAndDuplication(markdown, root, slug) {
  const errors = [];
  const body = markdownBody(markdown);
  const normalized = normalizedContent(markdown);
  const words = normalized.split(/\s+/).filter(Boolean);
  const substantiveParagraphs = body.split(/\r?\n\s*\r?\n/).filter((part) => !/^#{1,6}\s/.test(part.trim()) && normalizedContent(part).split(/\s+/).filter(Boolean).length >= 12);
  if (words.length < MIN_SAFETY_WORDS || substantiveParagraphs.length < 3) {
    errors.push(`Contenu manifestement mince : le seuil anti-coquille exige au moins ${MIN_SAFETY_WORDS} mots utiles et 3 paragraphes substantiels ; ce seuil de sécurité n’est pas un objectif SEO.`);
  }
  const ownShingles = shingles(normalized);
  const blogDirectory = join(root, 'src/content/blog');
  if (!existsSync(blogDirectory)) return errors;
  for (const filename of readdirSync(blogDirectory).filter((name) => name.endsWith('.md') && name !== `${slug}.md`).sort()) {
    const otherSlug = filename.replace(/\.md$/, '');
    const otherNormalized = normalizedContent(readFileSync(join(blogDirectory, filename), 'utf8'));
    if (!normalized || !otherNormalized) continue;
    if (normalized === otherNormalized) {
      errors.push(`Contenu dupliqué avec ${otherSlug} dans le corpus.`);
      continue;
    }
    const similarity = jaccard(ownShingles, shingles(otherNormalized));
    if (similarity >= 0.82) errors.push(`Near-duplication avec ${otherSlug} dans le corpus (${Math.round(similarity * 100)} % de shingles communs).`);
  }
  return errors;
}

function incomingSourcePath(root, url) {
  if (url === '/') return join(root, 'src/pages/index.astro');
  if (url.startsWith('/blog/')) return join(root, 'src/content/blog', `${url.slice('/blog/'.length)}.md`);
  return join(root, 'src/pages', `${url.replace(/^\//, '')}.astro`);
}

function withoutNonRenderedMarkup(source) {
  return source
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
}

function htmlAttribute(element, name) {
  return element.attrs?.find((attribute) => attribute.name === name)?.value;
}

function findHtmlElements(node, predicate, matches = []) {
  if (node.tagName && predicate(node)) matches.push(node);
  for (const child of node.childNodes ?? []) findHtmlElements(child, predicate, matches);
  return matches;
}

function incomingSourceContainsLink(root, sourceUrl, slug, renderedBlogHtml) {
  const sourcePath = incomingSourcePath(root, sourceUrl);
  if (!existsSync(sourcePath)) return false;
  const expectedLink = `/blog/${slug}`;
  if (sourceUrl === '/blog') {
    if (typeof renderedBlogHtml !== 'string') return false;
    const document = parseHtml(renderedBlogHtml);
    // Une entrée d'article sur /blog est un `li` dans la liste chronologique, ou un `article`
    // dans le bloc de départ qui porte le pilier depuis le 17/09/2026. La balise reste
    // contrainte à ces deux-là, pour qu'un lien caché dans un conteneur quelconque ne passe
    // pas pour une entrée. Le contrôle reste strict : exactement une entrée, un vrai lien dedans.
    const renderedEntries = findHtmlElements(
      document,
      (element) => (element.tagName === 'li' || element.tagName === 'article')
        && htmlAttribute(element, 'data-article') === slug,
    );
    if (renderedEntries.length !== 1) return false;
    return findHtmlElements(
      renderedEntries[0],
      (element) => element.tagName === 'a'
        && htmlAttribute(element, 'href') === expectedLink
        && htmlAttribute(element, 'data-placeholder') === undefined,
    ).length > 0;
  }
  const source = withoutNonRenderedMarkup(readFileSync(sourcePath, 'utf8'));
  return source.includes(expectedLink);
}

function readCorpusIntentEntries(root, currentSlug) {
  const entries = new Map();
  const articlesDirectory = join(root, 'src/content/blog');
  if (existsSync(articlesDirectory)) {
    for (const filename of readdirSync(articlesDirectory).filter((name) => name.endsWith('.md')).sort()) {
      const slug = filename.replace(/\.md$/, '');
      if (slug === currentSlug) continue;
      const markdown = readFileSync(join(articlesDirectory, filename), 'utf8');
      const block = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      try {
        const frontmatter = parseYaml(block?.[1] ?? '') ?? {};
        entries.set(slug, { slug, primaryQuery: frontmatter.primaryQuery, intent: frontmatter.intent });
      } catch {
        entries.set(slug, { slug, primaryQuery: null, intent: null });
      }
    }
  }
  const dossiersDirectory = join(root, 'editorial/articles');
  if (existsSync(dossiersDirectory)) {
    for (const slug of readdirSync(dossiersDirectory).sort()) {
      if (slug === currentSlug) continue;
      const path = join(dossiersDirectory, slug, 'manifest.json');
      if (!existsSync(path)) continue;
      try {
        const manifest = JSON.parse(readFileSync(path, 'utf8'));
        entries.set(slug, { slug, primaryQuery: manifest.primaryQuery, intent: manifest.intent });
      } catch {
        entries.set(slug, { slug, primaryQuery: null, intent: null });
      }
    }
  }
  return [...entries.values()];
}

function validateIntentCannibalization(manifest, dossier, root, subject) {
  const errors = [];
  const query = manifest?.primaryQuery?.trim().toLocaleLowerCase('fr');
  if (!query || !manifest?.intent) return errors;
  const collisions = readCorpusIntentEntries(root, manifest.slug)
    .filter((entry) => entry.primaryQuery?.trim().toLocaleLowerCase('fr') === query && entry.intent === manifest.intent);
  for (const collision of collisions) {
    const expectedUrls = [`/blog/${manifest.slug}`, `/blog/${collision.slug}`].sort();
    const resolution = (manifest.cannibalization?.resolutions ?? []).find((item) => {
      const urls = Array.isArray(item?.urls) ? [...new Set(item.urls)].sort() : [];
      return sameValue(urls, expectedUrls);
    });
    const actualUrls = Array.isArray(resolution?.urls) ? [...new Set(resolution.urls)].sort() : [];
    if (!['differentiate', 'consolidate'].includes(resolution?.action) || !sameValue(actualUrls, expectedUrls)) {
      errors.push(`Cannibalisation : la requête primaire « ${manifest.primaryQuery} » et l’intention « ${manifest.intent} » sont déjà attribuées à ${collision.slug} ; un arbitrage structuré relié aux deux URL est requis.`);
      continue;
    }
    const proof = readEvidenceJson(dossier, resolution.evidence, errors, `preuve de cannibalisation avec ${collision.slug}`);
    validateSubjectEvidence(errors, proof, subject, `preuve de cannibalisation avec ${collision.slug}`, 'cannibalization');
    if (proof?.action !== resolution.action || !sameValue([...(proof?.urls ?? [])].sort(), expectedUrls)) {
      errors.push(`La preuve de cannibalisation avec ${collision.slug} doit relier l’action et les deux URL exactes.`);
    }
  }
  return errors;
}

export async function validateDossier({ root = process.cwd(), slug, renderedBlogHtml, renderedArticleHtml, gateMode = 'production', au }) {
  const absoluteRoot = resolve(root);
  const dossier = join(absoluteRoot, 'editorial/articles', slug);
  const articlePath = join(absoluteRoot, 'src/content/blog', `${slug}.md`);
  const manifestPath = join(dossier, 'manifest.json');
  const errors = [];
  const manifest = readJson(manifestPath, errors, 'manifest.json');
  const skills = readJson(join(dossier, 'skills.json'), errors, 'skills.json');
  const claims = readJson(join(dossier, 'claims.json'), errors, 'claims.json');
  const review = readJson(join(dossier, 'review.json'), errors, 'review.json');
  const image = readJson(join(dossier, 'image.json'), errors, 'image.json');
  if (!existsSync(articlePath)) errors.push(`Article Markdown absent : ${articlePath}.`);
  const markdown = existsSync(articlePath) ? readFileSync(articlePath, 'utf8') : '';
  const subject = {
    slug,
    articleHash: markdown ? sha256(markdown) : null,
    manifestHash: existsSync(manifestPath) ? sha256(readFileSync(manifestPath)) : null,
  };
  const evidenceSubject = {
    ...subject,
    articleHash: markdown ? sha256(retirerPreuvesInline(markdown)) : null,
  };
  const recipeBodyPath = join(absoluteRoot, 'editorial/recettes', slug, 'corps.md');
  const recipePath = join(absoluteRoot, 'editorial/recettes', slug, 'recette.json');
  const independentReviewPath = join(absoluteRoot, 'editorial/recettes', slug, 'revues.json');
  // L'inventaire a déjà identifié un dossier pipeline : retirer sa recette ne peut pas désactiver la liaison des revues.
  if (!existsSync(recipeBodyPath)) errors.push(`corps.md absent : ${recipeBodyPath}.`);
  readJson(recipePath, errors, 'recette.json');
  const independentReview = readJson(independentReviewPath, errors, 'revues.json');
  // L'identité déclarée par la revue indépendante est l'autorité ; les projections ne peuvent la réattribuer.
  if (independentReview?.editorial && Object.hasOwn(independentReview.editorial, 'reviewer')) {
    requireText(errors, independentReview.editorial.reviewer, 'revues.json editorial.reviewer', 2);
    if (manifest?.reviewer !== independentReview.editorial.reviewer || review?.reviewer !== independentReview.editorial.reviewer) {
      errors.push('Identité du reviewer éditorial divergente entre revues.json, manifest.json et review.json.');
    }
  }
  if (existsSync(recipeBodyPath)) {
    const recipeBody = readFileSync(recipeBodyPath, 'utf8').trim();
    const articleBody = retirerPreuvesInline(markdownBody(markdown));
    let bodiesMatch = false;
    try {
      bodiesMatch = reviewSha256(corpsSansTitreDuplique(recipeBody, manifest?.title)) === reviewSha256(articleBody);
    } catch { // Un H1 différent du titre signé ne peut pas être ignoré.
      bodiesMatch = false;
    }
    if (!bodiesMatch) errors.push('Recette et article divergent : empreinte du corps non conforme.');
    const legacyBaselinePath = join(absoluteRoot, 'editorial/legacy-review-baseline.json');
    const legacyBaseline = manifest?.editorialStatus === 'publie' && !independentReview?.subject
      ? readJson(legacyBaselinePath, errors, 'inventaire historique de revue') : null;
    const legacyHashes = legacyBaseline?.version === 1 ? legacyBaseline.articles?.[slug] : null;
    const legacyRecipeMatches = legacyHashes && existsSync(recipePath) && existsSync(independentReviewPath)
      && legacyHashes.recipeSha256 === reviewSha256(readFileSync(recipePath))
      && legacyHashes.reviewSha256 === reviewSha256(readFileSync(independentReviewPath));
    if (manifest?.editorialStatus === 'publie' && !independentReview?.subject && !legacyRecipeMatches) {
      errors.push('recette publiée divergente : une republication exige une nouvelle revue indépendante.');
    }
    const preservedPublished = manifest?.editorialStatus === 'publie' && !independentReview?.subject
      && validatePublicationSeal(dossier, manifest, subject).length === 0 && bodiesMatch && legacyRecipeMatches;
    if (!preservedPublished) {
      errors.push(...reviewBindingErrors(independentReview, slug, recipeBody, existsSync(recipePath) ? readFileSync(recipePath) : '', renderedArticleHtml));
    }
  }
  const sensitiveMatter = detectSensitiveMatter(manifest, claims, markdown);
  if (gateMode === 'published-audit') errors.push(...validatePublishedAdoption(dossier, manifest, subject.articleHash));
  const sealErrors = gateMode === 'publication-scellee' ? validatePublicationSeal(dossier, manifest, subject) : [];
  errors.push(...sealErrors);
  if (manifest) {
    errors.push(...validateCandidate(manifest, { gateMode }));
    const requetes = [manifest.primaryQuery, ...(manifest.secondaryQueries ?? [])];
    const dateMesure = gateMode === 'publication-scellee' && sealErrors.length === 0
      ? manifest.publishedAt : au;
    for (const [surface, titre] of [['H1', manifest.title], ['titre d’onglet', manifest.tabTitle]]) {
      try {
        verifierTitreIntentMesure({ root: absoluteRoot, titre, requetes, surface: `${slug} : ${surface}`, au: dateMesure });
      } catch (error) {
        errors.push(`Intention SEO : ${error.message}`);
      }
    }
  }
  if (skills) errors.push(...validateSkillsManifest(skills));
  if (skills && manifest && claims) errors.push(...validateRequiredSkills(skills, sensitiveMatter));
  const sources = manifest ? validateSources(manifest, dossier, evidenceSubject) : { errors: [], verified: new Map() };
  errors.push(...sources.errors);
  if (claims) errors.push(...validateClaims(claims, markdown, manifest, sources.verified, evidenceSubject, sensitiveMatter));
  if (review && manifest) errors.push(...validateReview(review, dossier, manifest, evidenceSubject));
  if (manifest && claims) errors.push(...validateBusinessReview(manifest, dossier, evidenceSubject, sensitiveMatter, claims, sources.verified, gateMode));
  if (manifest && claims && review && skills) errors.push(...validateSensitiveFreshness(manifest, claims, review, skills, sources.verified, dossier, sensitiveMatter, gateMode));
  if (image && manifest) errors.push(...await validateImage(image, dossier, manifest, absoluteRoot, evidenceSubject));
  if (markdown) errors.push(...validateHeadings(markdown));
  if (markdown && manifest) errors.push(...validateArticleContract(markdown, manifest, gateMode));
  if (markdown) errors.push(...validateContentDepthAndDuplication(markdown, absoluteRoot, slug));
  if (manifest) errors.push(...validateIntentCannibalization(manifest, dossier, absoluteRoot, evidenceSubject));

  if (manifest) {
    const evidence = [
      { reference: manifest.role?.proof?.source, label: 'preuve du rôle', kind: 'role' },
      { reference: manifest.research?.serp?.evidence, label: 'preuve SERP', kind: 'serp' },
      { reference: manifest.research?.gsc?.evidence, label: 'preuve GSC', kind: 'gsc' },
    ];
    for (const item of evidence) {
      const proof = readEvidenceJson(dossier, item.reference, errors, item.label);
      validateSubjectEvidence(errors, proof, evidenceSubject, item.label, item.kind);
      if (item.kind === 'gsc' && manifest.research?.gsc?.status === 'ND') {
        if (!['protected-preview', 'published-audit'].includes(gateMode) || proof?.availability !== 'permission-denied' || proof?.metricsCredited !== false || proof?.previewAuthorizedBy !== 'kevin') {
          errors.push('GSC=ND exige en preview protégée une preuve permission-denied, metricsCredited=false et previewAuthorizedBy=kevin.');
        }
      }
    }
    for (const link of manifest.links?.outgoing ?? []) {
      if (!markdown.includes(`](${link}`) && !markdown.includes(`href="${link}`) && !markdown.includes(`href='${link}`)) {
        errors.push(`Le lien obligatoire ${link} est absent du Markdown.`);
      }
      if (typeof link === 'string' && link.startsWith('/')) {
        const cleanLink = link.split(/[?#]/, 1)[0] || '/';
        const targetPath = incomingSourcePath(absoluteRoot, cleanLink);
        if (!existsSync(targetPath)) errors.push(`La cible du lien obligatoire ${link} est absente du corpus.`);
      }
    }
    for (const sourceUrl of manifest.links?.incoming ?? []) {
      const expectedLink = `/blog/${slug}`;
      if (!incomingSourceContainsLink(absoluteRoot, sourceUrl, slug, renderedBlogHtml)) {
        errors.push(`Le lien entrant depuis ${sourceUrl} vers ${expectedLink} est absent.`);
      }
    }
  }
  if (skills) {
    for (const row of [...(skills.blog ?? []), ...(skills.seo ?? [])]) {
      if (row.status === 'RUN') {
        const label = `preuve du skill ${row.skill}`;
        const proof = readEvidenceJson(dossier, row.evidence, errors, label);
        validateSubjectEvidence(errors, proof, evidenceSubject, label, 'skill');
        if (proof?.skill !== row.skill) errors.push(`${label}.skill n’est pas relié à ${row.skill}.`);
      }
    }
  }
  return { slug, pass: errors.length === 0, errors,
    ...(gateMode === 'published-audit' ? { auditMode: 'published-preservation', publicationAuthorized: false, freshFactCheck: false } : {}),
  };
}
