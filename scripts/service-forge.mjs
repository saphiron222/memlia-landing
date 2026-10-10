#!/usr/bin/env node
/**
 * Forge des pages de service. Elle partage uniquement le registre de requêtes avec le blog :
 * aucun article, dossier éditorial ou plafond de cadence n'est lu puis réécrit ici.
 *
 * Commandes :
 *   node scripts/service-forge.mjs preparer <slug>
 *   node scripts/service-forge.mjs sceller <slug>
 *   node scripts/service-forge.mjs publier <slug>
 *   node scripts/service-forge.mjs depublier <slug> <declaration.json>
 *   node scripts/service-forge.mjs auditer
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'parse5';

import { verifierTitreIntentMesure } from './lib/blog-title-intent.mjs';
import { ajouterAuRegistre, chargerRegistre, sauverRegistre } from './lib/seo-registres.mjs';
import { readDilaCopy } from './lib/dila-source-copy.mjs';

const REQUIRED_SCHEMA_TYPES = ['WebPage', 'Service', 'BreadcrumbList', 'Organization', 'WebSite'];
const FORBIDDEN_SCHEMA_TYPES = ['BlogPosting', 'Product', 'SoftwareApplication', 'Offer', 'Review'];
const REQUIRED_SECTIONS = [
  'La tâche dans les mots du cabinet',
  'La règle écrite',
  'Rejoué sur le jeu fictif',
  'Ce que nous prenons en charge',
  'Ce que le cabinet garde',
  'Dans vos outils',
  'La preuve',
  'Le prix',
  'Questions de décision',
];
const RULE_LABELS = ['La frontière.', 'La proposition.', 'L’arrêt.', 'Le jeu d’essai.'];
const FRONTIER_COLUMNS = ['Se prépare seul', 'Attend une validation', 'Reste humain'];
const QUERY_REGISTER = 'docs/strategy/site-v3/mesures/registre-requetes.json';
const SEAL_PATH = 'preuves/scellement.json';
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const sha256 = (content) => createHash('sha256').update(content).digest('hex');
const wordCount = (content) => String(content ?? '').trim().split(/\s+/).filter(Boolean).length;
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const writeJson = (path, value) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
};
export const dateServiceParis = (date = new Date()) => date.toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
const todayIso = () => dateServiceParis();
const typographicApostrophe = (text) => String(text ?? '').replace(/'/g, '’');
const normalizedQuery = (value) => String(value ?? '')
  .normalize('NFD')
  .replace(/\p{Diacritic}/gu, '')
  .toLowerCase()
  .replace(/\s+/g, ' ')
  .trim();

function verifyCommercialAudience(recipe, errors) {
  const audience = recipe?.audience;
  if (!audience || !['qualified', 'exception'].includes(audience.mode)) {
    errors.push('Clause audience : audience.mode doit valoir qualified ou exception pour une page commerciale.');
    return;
  }
  const reason = String(audience.reason ?? '').trim();
  if (audience.mode === 'exception') {
    if (reason.length < 80) errors.push('Clause audience : une requête commerciale non qualifiée exige une décision d’exception motivée (80 caractères minimum).');
    return;
  }
  const qualifier = normalizedQuery(audience.qualifier);
  if (qualifier.length < 3) {
    errors.push('Clause audience : le qualificatif métier doit être écrit pour une page commerciale qualifiée.');
    return;
  }
  if (reason.length < 40) errors.push('Clause audience : la raison du qualificatif métier doit contenir au moins 40 caractères.');
  for (const [surface, value] of [['requête primaire', recipe.primaryQuery], ['H1', recipe.title], ['titre d’onglet', recipe.tabTitle]]) {
    if (!normalizedQuery(value).includes(qualifier)) {
      errors.push(`Clause audience : ${surface} non qualifié par « ${audience.qualifier} » (${recipe.path ?? recipe.slug ?? 'page commerciale'}).`);
    }
  }
}

function section(body, title) {
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^## ${escaped}\\s*$([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm').exec(body)?.[1] ?? null;
}

function tableRows(value) {
  return String(value ?? '').split(/\r?\n/).filter((line) => /^\|/.test(line.trim()) && !/^\|\s*-/.test(line.trim()));
}

function registryCollision(root, recipe) {
  const path = join(root, QUERY_REGISTER);
  if (!existsSync(path)) return null;
  const registry = readJson(path);
  const query = normalizedQuery(recipe.primaryQuery);
  return (registry.articles ?? []).find((entry) =>
    entry.url !== `https://memlia.fr${recipe.path}`
    && normalizedQuery(entry.requete) === query) ?? null;
}

function verifyTitleMeasurement(root, recipe, today, errors) {
  const queries = [recipe.primaryQuery, ...(recipe.secondaryQueries ?? [])];
  for (const [surface, title] of [['H1', recipe.title], ['titre d’onglet', recipe.tabTitle]]) {
    try {
      verifierTitreIntentMesure({ root, titre: title, requetes: queries, au: today, surface: `${recipe.slug} : ${surface}` });
    } catch (error) {
      errors.push(error.message);
    }
  }
}

function sourceIsIndexable(source) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  if (/^brouillon:\s*true\s*$/m.test(frontmatter)) return false;
  if (/^noindex:\s*true\s*$/m.test(frontmatter)) return false;
  return true;
}

function publicRouteForSource(sourcePath) {
  const path = String(sourcePath ?? '').replace(/\\/g, '/');
  const blog = path.match(/^src\/content\/blog\/(.+)\.md$/);
  if (blog) return `/blog/${blog[1]}`;
  const page = path.match(/^src\/pages\/(.+)\.astro$/);
  if (!page || /\[[^\]]+]/.test(page[1])) return null;
  const route = page[1] === 'index' ? '' : page[1].replace(/\/index$/, '');
  return `/${route}`;
}

function verifyIncomingLinkDeclarations(recipe, errors) {
  const links = Array.isArray(recipe.incomingLinks) ? recipe.incomingLinks : [];
  const distinctUrls = new Set(links.map((link) => link?.url));
  const distinctSources = new Set(links.map((link) => link?.sourcePath));
  if (links.length < 3 || distinctUrls.size < 3 || distinctSources.size < 3) errors.push('Trois liens entrants contextuels depuis trois URL indexables distinctes sont requis avant publication.');
  for (const link of links) {
    const prefix = link?.url ?? 'lien sans URL';
    if (!link || typeof link.url !== 'string' || !link.url.startsWith('/') || typeof link.anchor !== 'string' || !link.anchor.trim()) {
      errors.push(`${prefix} : chaque lien planifié exige une URL publique et une ancre non vide.`);
    }
    if (!link || typeof link.sourcePath !== 'string' || !link.sourcePath.startsWith('src/')) {
      errors.push(`${prefix} : sourcePath doit désigner une source publique sous src/.`);
      continue;
    }
    if (/(?:layouts|components)[/\\]/.test(link.sourcePath)) errors.push(`${prefix} : header, footer, fil d’Ariane et composant global ne comptent pas comme lien entrant.`);
  }
}

function verifyIncomingLinks(root, recipe, errors) {
  verifyIncomingLinkDeclarations(recipe, errors);
  const links = Array.isArray(recipe.incomingLinks) ? recipe.incomingLinks : [];
  for (const link of links) {
    const prefix = link?.url ?? 'lien sans URL';
    if (!link || typeof link.sourcePath !== 'string' || !link.sourcePath.startsWith('src/')) continue;
    const absolute = resolve(root, link.sourcePath);
    const rootPrefix = `${resolve(root)}${process.platform === 'win32' ? '\\' : '/'}`;
    if (!absolute.startsWith(rootPrefix) || !existsSync(absolute)) {
      errors.push(`${prefix} : source de lien absente (${link.sourcePath}).`);
      continue;
    }
    const source = readFileSync(absolute, 'utf8');
    if (!sourceIsIndexable(source)) errors.push(`${prefix} : la source ${link.sourcePath} n’est pas indexable.`);
    const publicRoute = publicRouteForSource(link.sourcePath);
    if (publicRoute === null || link.url !== publicRoute) errors.push(`${prefix} : ne correspond pas à la route publique de ${link.sourcePath} (${publicRoute ?? 'route dynamique ou non publique'}).`);
    const markdownLink = `[${link.anchor}](${recipe.path})`;
    const astroLink = `href="${recipe.path}"`;
    if (!(source.includes(markdownLink) || (source.includes(astroLink) && source.includes(`>${link.anchor}<`)))) {
      errors.push(`${prefix} : aucun lien contextuel avec l’ancre « ${link.anchor} » vers ${recipe.path} dans ${link.sourcePath}.`);
    }
  }
}

function verifyReplayEvidence(root, recipe, body, errors) {
  const path = recipe.proof?.evidencePath;
  if (typeof path !== 'string' || !path.startsWith('preuves/')) {
    errors.push('La preuve de rejeu doit référencer un fichier local sous preuves/.');
    return;
  }
  const absolute = join(root, 'commercial/recettes', recipe.slug, path);
  if (!existsSync(absolute)) {
    errors.push(`La preuve de rejeu est absente : commercial/recettes/${recipe.slug}/${path}.`);
    return;
  }
  try {
    const proof = readJson(absolute);
    if (proof.status !== 'PASS' || proof.fictitious !== true || proof.replayedAt !== recipe.proof.replayedAt || !Array.isArray(proof.cases) || proof.cases.length < 3) {
      errors.push('La preuve de rejeu doit être PASS, fictive, datée comme la recette et porter au moins trois cas.');
    }
    if (!body.includes(path) || !body.includes(recipe.proof.replayedAt)) errors.push('La section de rejeu doit rendre le chemin et la date de sa preuve locale.');
  } catch (error) {
    errors.push(`La preuve de rejeu est illisible : ${error.message}.`);
  }
}

export function verifierRecetteService({ root, recipe, body, review, today = todayIso(), requireReview = true, sourceAsOf = null }) {
  const errors = [];
  if (recipe?.version !== 1) errors.push('version doit valoir 1.');
  if (recipe?.type !== 'service') errors.push('Le type de recette doit valoir service.');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(recipe?.slug ?? '')) errors.push('Le slug service doit être en minuscules ASCII séparées par des tirets.');
  if (recipe?.path !== `/automatisation/${recipe?.slug}` || !/^\/automatisation\/[^/]+$/.test(recipe?.path ?? '')) errors.push('La route doit vivre sous /automatisation/<tache>, à un seul niveau.');
  for (const [field, min] of [['title', 10], ['tabTitle', 10], ['ogTitle', 10], ['description', 50], ['primaryQuery', 3]]) {
    if (typeof recipe?.[field] !== 'string' || recipe[field].trim().length < min) errors.push(`${field} est requis.`);
  }
  if (recipe?.title !== recipe?.ogTitle || recipe?.title !== recipe?.schema?.headline) errors.push('Les quatre surfaces doivent s’accorder : H1, og:title et headline identiques ; le titre d’onglet vise la même requête.');
  if (typeof recipe?.description === 'string' && recipe.description.length > 160) errors.push('description doit contenir au plus 160 caractères.');
  const heroWords = wordCount(recipe?.hero);
  if (heroWords < 40 || heroWords > 80) errors.push('La réponse commerciale du héros doit contenir 40 à 80 mots.');
  if (!Array.isArray(recipe?.secondaryQueries)) errors.push('secondaryQueries doit être une liste.');
  if (recipe?.intent !== 'evaluer-service') errors.push('intent doit valoir evaluer-service pour une page de service.');
  if (!DATE_RE.test(recipe?.verifiedAt ?? '') || recipe.verifiedAt > today) errors.push('verifiedAt doit être une date non future au format AAAA-MM-JJ.');
  verifyTitleMeasurement(root, recipe, today, errors);
  verifyCommercialAudience(recipe, errors);
  if (recipe.audienceType !== undefined && (typeof recipe.audienceType !== 'string' || recipe.audienceType.trim().length < 3)) {
    errors.push('audienceType doit décrire le public avec au moins trois caractères.');
  }
  for (const source of recipe?.sources ?? []) {
    try {
      const host = new URL(source.url).hostname.replace(/\.$/, '');
      const requiresDila = host === 'legifrance.gouv.fr' || host.endsWith('.legifrance.gouv.fr')
        || source.dilaCopyPath !== undefined || source.dilaCopySha256 !== undefined;
      if (requiresDila) {
        if (!source.dilaCopyPath || !/^[a-f0-9]{64}$/.test(source.dilaCopySha256 ?? '')) throw new Error('Copie DILA et empreinte requises pour cette source.');
        readDilaCopy({ root: join(root, 'commercial/recettes', recipe.slug), path: source.dilaCopyPath, url: source.url,
          excerpt: source.excerpt, expectedSha256: source.dilaCopySha256,
          asOf: sourceAsOf ?? (today === todayIso() ? new Date().toISOString() : `${today}T12:00:00Z`) });
      }
      if (!body.includes(source.url)) throw new Error('Le lien public de la source doit apparaître dans le corps.');
    } catch (error) { errors.push(`Source ${source.id ?? '(sans identifiant)'} : ${error.message}`); }
  }

  const normalizedBody = typographicApostrophe(body);
  let previous = -1;
  for (const title of REQUIRED_SECTIONS) {
    const index = normalizedBody.indexOf(`## ${title}`);
    if (index < 0) errors.push(`Section « ## ${title} » absente.`);
    else if (index < previous) errors.push(`Section « ## ${title} » hors de l’ordre du gabarit service.`);
    previous = Math.max(previous, index);
  }
  const writtenRule = section(normalizedBody, 'La règle écrite');
  if (writtenRule !== null) {
    for (const label of RULE_LABELS) if (!writtenRule.includes(`**${label}**`)) errors.push(`« La règle écrite » : le libellé **${label}** manque.`);
    const header = tableRows(writtenRule)[0] ?? '';
    if (!FRONTIER_COLUMNS.every((column) => header.includes(column))) errors.push(`« La règle écrite » : le tableau ${FRONTIER_COLUMNS.join(' | ')} manque.`);
  }
  const replay = section(normalizedBody, 'Rejoué sur le jeu fictif');
  if (replay !== null && tableRows(replay).length < 4) errors.push('« Rejoué sur le jeu fictif » exige au moins trois cas joués sous son en-tête.');
  verifyReplayEvidence(root, recipe, body, errors);

  if (recipe?.cta?.label !== 'Confier une première tâche' || recipe?.cta?.destination !== '/contact') errors.push('Le CTA unique doit être « Confier une première tâche » vers /contact.');
  const otherCtas = [...String(body).matchAll(/\[([^\]]+)]\((\/[^)]+)\)/g)]
    .filter(([, label, destination]) => /confier|réserver|contacter|parler/i.test(label) && (label !== recipe?.cta?.label || destination !== recipe?.cta?.destination));
  if (otherCtas.length) errors.push('Le corps porte un second appel à l’action distinct du CTA unique de la recette.');

  const types = recipe?.schema?.types;
  if (!Array.isArray(types) || types.length !== REQUIRED_SCHEMA_TYPES.length || new Set(types).size !== REQUIRED_SCHEMA_TYPES.length || REQUIRED_SCHEMA_TYPES.some((type) => !types.includes(type))) errors.push(`Le schéma doit contenir exactement le socle ${REQUIRED_SCHEMA_TYPES.join(', ')}.`);
  for (const forbidden of FORBIDDEN_SCHEMA_TYPES) if (types?.includes(forbidden)) errors.push(`Le schéma interdit ${forbidden} pour une page de service.`);
  if (Array.isArray(types) && types.some((type) => !REQUIRED_SCHEMA_TYPES.includes(type))) errors.push('Le schéma service contient un type non autorisé.');

  const publicText = `${recipe?.title ?? ''}\n${recipe?.tabTitle ?? ''}\n${recipe?.description ?? ''}\n${body}`;
  const vocabularyRules = [
    [/\bmodules?\b/i, 'module'],
    [/\bcompléments?\s+(?:Excel|Memlia)\b/i, 'complément Excel/Memlia'],
    [/\b(?:notre|Memlia est un|le service est un)\s+logiciel\b/i, 'logiciel'],
    [/\b(?:revue métier|fact-check|non attesté)\b/i, 'mot de processus interne'],
  ];
  for (const [pattern, label] of vocabularyRules) if (pattern.test(publicText)) errors.push(`Vocabulaire public interdit : ${label}.`);

  if (requireReview && (!review || review.status !== 'PASS' || review.reviewer === recipe?.author || !DATE_RE.test(review.reviewedAt ?? '') || !Array.isArray(review.observations) || review.observations.length === 0)) {
    errors.push('Une revue indépendante PASS, datée et motivée est requise avant scellement.');
  }
  const collision = registryCollision(root, recipe);
  if (collision) errors.push(`La requête primaire « ${recipe.primaryQuery} » appartient déjà à ${collision.url} (${collision.type ?? 'blog'}).`);
  verifyIncomingLinkDeclarations(recipe, errors);
  return [...new Set(errors)];
}

function loadRecipe(root, slug) {
  const recipeDir = join(root, 'commercial/recettes', slug);
  const recipe = readJson(join(recipeDir, 'recette.json'));
  if (recipe.slug !== slug) throw new Error(`La recette ${slug} porte le slug ${recipe.slug}.`);
  const body = readFileSync(join(recipeDir, 'corps.md'), 'utf8').trim();
  const reviewPath = join(recipeDir, 'revues.json');
  const review = existsSync(reviewPath) ? readJson(reviewPath) : null;
  return { recipe, body, review };
}

function candidateFingerprint({ recipe, body, review }) {
  return sha256(JSON.stringify({ recipe, body, review }));
}

function frontmatter(recipe, status, fingerprint) {
  const value = (input) => JSON.stringify(String(input));
  const list = (items) => `[${items.map(value).join(', ')}]`;
  return `---
title: ${value(recipe.title)}
tabTitle: ${value(recipe.tabTitle)}
ogTitle: ${value(recipe.ogTitle)}
description: ${value(recipe.description)}
hero: ${value(recipe.hero)}
primaryQuery: ${value(recipe.primaryQuery)}
secondaryQueries: ${list(recipe.secondaryQueries)}
${recipe.audienceType === undefined ? '' : `audienceType: ${value(recipe.audienceType.trim())}\n`}audience:
  mode: ${value(recipe.audience.mode)}
  qualifier: ${recipe.audience.qualifier === null ? 'null' : value(recipe.audience.qualifier)}
  reason: ${value(recipe.audience.reason)}
intent: ${recipe.intent}
family: ${recipe.family}
verifiedAt: ${recipe.verifiedAt}
status: ${status}
candidateFingerprint: ${value(fingerprint)}
cta:
  label: ${value(recipe.cta.label)}
  destination: ${value(recipe.cta.destination)}
schemaTypes: ${list(recipe.schema.types)}
headline: ${value(recipe.schema.headline)}
proof:
  replayedAt: ${recipe.proof.replayedAt}
  evidencePath: ${value(recipe.proof.evidencePath)}
---`;
}

function subjectFiles(root, slug) {
  const dossier = join(root, 'commercial/services', slug);
  const recipeDir = join(root, 'commercial/recettes', slug);
  const files = {
    page: join(root, 'src/content/services', `${slug}.md`),
    manifest: join(dossier, 'manifest.json'),
    recipe: join(recipeDir, 'recette.json'),
    body: join(recipeDir, 'corps.md'),
    review: join(recipeDir, 'revues.json'),
  };
  const publication = join(dossier, 'preuves/publication.json');
  if (existsSync(publication)) files.publication = publication;
  const depublication = join(dossier, 'preuves/depublication.json');
  if (existsSync(depublication)) files.depublication = depublication;
  const recipe = readJson(files.recipe);
  for (const [index, source] of (recipe.sources ?? []).entries()) {
    if (source.dilaCopyPath) files[`dilaSource${index}`] = join(recipeDir, source.dilaCopyPath);
  }
  return files;
}

function hashesFor(root, slug) {
  const files = subjectFiles(root, slug);
  return Object.fromEntries(Object.entries(files).map(([key, path]) => {
    const bytes = readFileSync(path);
    return [key, { path: relative(root, path), bytes: bytes.length, sha256: sha256(bytes) }];
  }));
}

function serviceEstPublie(root, slug) {
  const dossier = join(root, 'commercial/services', slug);
  if (existsSync(join(dossier, 'preuves/publication.json'))) return true;
  const manifestPath = join(dossier, 'manifest.json');
  if (existsSync(manifestPath) && readJson(manifestPath).status === 'publie') return true;
  const pagePath = join(root, 'src/content/services', `${slug}.md`);
  return existsSync(pagePath) && /^status:\s*publie\s*$/m.test(readFileSync(pagePath, 'utf8'));
}

export function materialiserService({ root = process.cwd(), slug, status = 'a-valider', today = todayIso(), snapshot = null, allowDepublish = false }) {
  const { recipe, body, review } = snapshot ?? loadRecipe(root, slug);
  const errors = verifierRecetteService({ root, recipe, body, review, today, requireReview: false });
  const dossier = join(root, 'commercial/services', slug);
  const pagePath = join(root, 'src/content/services', `${slug}.md`);
  if (status !== 'publie' && !allowDepublish && serviceEstPublie(root, slug)) {
    errors.unshift(`${slug} est déjà publié : préparer ou sceller ne peut pas le rétrograder ; une dépublication explicite et autorisée est requise.`);
  }
  if (errors.length) return { errors, recipe, manifest: null, dossier, pagePath };
  mkdirSync(dirname(pagePath), { recursive: true });
  mkdirSync(join(dossier, 'preuves'), { recursive: true });
  const fingerprint = candidateFingerprint({ recipe, body, review });
  const page = `${frontmatter(recipe, status, fingerprint)}\n\n${body}\n`;
  writeFileSync(pagePath, page);
  const proofSource = join(root, 'commercial/recettes', slug, recipe.proof.evidencePath);
  if (existsSync(proofSource)) writeFileSync(join(dossier, 'preuves/rejeu.json'), readFileSync(proofSource));
  const manifest = {
    version: 1,
    type: 'service',
    slug,
    path: recipe.path,
    status,
    candidateFingerprint: fingerprint,
    title: recipe.title,
    tabTitle: recipe.tabTitle,
    ogTitle: recipe.ogTitle,
    headline: recipe.schema.headline,
    description: recipe.description,
    hero: recipe.hero,
    primaryQuery: recipe.primaryQuery,
    secondaryQueries: recipe.secondaryQueries,
    audience: recipe.audience,
    ...(recipe.audienceType === undefined ? {} : { audienceType: recipe.audienceType.trim() }),
    family: recipe.family,
    verifiedAt: recipe.verifiedAt,
    cta: recipe.cta,
    schemaTypes: recipe.schema.types,
    incomingLinks: recipe.incomingLinks,
    review: review ? { reviewer: review.reviewer, reviewedAt: review.reviewedAt, status: review.status } : null,
    pageSha256: sha256(page),
    seal: SEAL_PATH,
  };
  writeJson(join(dossier, 'manifest.json'), manifest);
  return { errors, recipe, manifest, dossier, pagePath };
}

function writeSeal(root, slug, kind, sealedAt, inheritedFiles = null) {
  const dossier = join(root, 'commercial/services', slug);
  const files = hashesFor(root, slug);
  for (const key of ['recipe', 'body', 'review']) {
    if (inheritedFiles?.[key]) files[key] = inheritedFiles[key];
  }
  writeJson(join(dossier, SEAL_PATH), { version: 1, kind, slug, sealedAt, files });
}

function verifySeal(root, slug) {
  const dossier = join(root, 'commercial/services', slug);
  const errors = [];
  try {
    const seal = readJson(join(dossier, SEAL_PATH));
    const current = hashesFor(root, slug);
    for (const key of Object.keys(seal.files ?? {})) {
      if (!Object.hasOwn(current, key)) errors.push(`${slug} : fichier scellé absent (${key}).`);
    }
    for (const key of Object.keys(current)) {
      if (!Object.hasOwn(seal.files ?? {}, key)) errors.push(`${slug} : fichier non scellé ajouté (${key}).`);
    }
    for (const [key, file] of Object.entries(current)) {
      const sealed = seal.files?.[key];
      if (!sealed || sealed.path !== file.path || sealed.bytes !== file.bytes || sealed.sha256 !== file.sha256) errors.push(`${slug} : empreinte divergente (${key === 'page' ? 'page' : key}).`);
    }
  } catch (error) {
    errors.push(`${slug} : scellement absent ou illisible (${error.message}).`);
  }
  return errors;
}

function registerService(root, recipe) {
  const registry = chargerRegistre(root);
  const next = ajouterAuRegistre(registry, {
    slug: recipe.slug,
    type: 'service',
    url: `https://memlia.fr${recipe.path}`,
    requete: recipe.primaryQuery,
    secondaires: recipe.secondaryQueries,
    famille: recipe.family,
    publieLe: null,
    source: 'recette-service-scellee',
  });
  sauverRegistre(root, next);
}

export function scellerService({ root = process.cwd(), slug, today = todayIso() }) {
  const { recipe, body, review } = loadRecipe(root, slug);
  const errors = verifierRecetteService({ root, recipe, body, review, today, requireReview: true });
  if (errors.length) return { pass: false, errors };
  const result = materialiserService({ root, slug, status: 'pret-preview', today });
  if (result.errors.length) return { pass: false, errors: result.errors };
  rmSync(join(result.dossier, 'preuves/publication.json'), { force: true });
  registerService(root, result.recipe);
  writeSeal(root, slug, 'service-candidat-scelle', new Date().toISOString());
  return { pass: true, errors: [], dossier: result.dossier };
}

function elementsByName(node, name, found = []) {
  if (node?.nodeName === name) found.push(node);
  for (const child of node?.childNodes ?? []) elementsByName(child, name, found);
  return found;
}

function attribute(node, name) {
  return node?.attrs?.find((item) => item.name === name)?.value ?? null;
}

function nodeText(node) {
  if (node?.nodeName === '#text') return node.value ?? '';
  return (node?.childNodes ?? []).map(nodeText).join('');
}

async function observerArtefactServi({ servedUrl }) {
  const response = await fetch(servedUrl, {
    headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache', Accept: 'text/html' },
    redirect: 'manual',
  });
  const html = await response.text();
  const document = parse(html);
  const canonicals = elementsByName(document, 'link')
    .filter((node) => (attribute(node, 'rel') ?? '').split(/\s+/).includes('canonical'))
    .map((node) => attribute(node, 'href'));
  const h1s = elementsByName(document, 'h1').map((node) => nodeText(node).replace(/\s+/g, ' ').trim());
  const robots = elementsByName(document, 'meta')
    .filter((node) => attribute(node, 'name')?.toLowerCase() === 'robots')
    .map((node) => attribute(node, 'content'));
  const fingerprints = elementsByName(document, 'meta')
    .filter((node) => attribute(node, 'name') === 'memlia-candidate')
    .map((node) => attribute(node, 'content'));
  const xRobotsTag = response.headers.get('x-robots-tag');
  return {
    url: response.url,
    status: response.status,
    canonical: canonicals.length === 1 ? canonicals[0] : null,
    canonicalCount: canonicals.length,
    h1: h1s.length === 1 ? h1s[0] : null,
    h1Count: h1s.length,
    candidateFingerprint: fingerprints.length === 1 ? fingerprints[0] : null,
    candidateFingerprintCount: fingerprints.length,
    bodySha256: sha256(html),
    observedAt: new Date().toISOString(),
    cacheControl: response.headers.get('cache-control'),
    cfCacheStatus: response.headers.get('cf-cache-status'),
    age: response.headers.get('age'),
    xRobotsTag,
    metaRobots: robots,
    indexable: !/\bnoindex\b/i.test(xRobotsTag ?? '') && !robots.some((value) => /\bnoindex\b/i.test(value ?? '')),
  };
}

function verifyServedObservation(observation, recipe, expectedFingerprint, expectedServedUrl) {
  const errors = [];
  const expectedUrl = `https://memlia.fr${recipe.path}`;
  if (!observation || typeof observation !== 'object') return ['Une observation HTTP de l’artefact servi est requise avant publication.'];
  if (observation.status !== 200) errors.push(`L’artefact servi doit répondre HTTP 200, reçu : ${observation.status ?? 'aucun statut'}.`);
  if (observation.url !== expectedServedUrl) errors.push(`L’URL servie diverge : attendu ${expectedServedUrl}, reçu ${observation.url ?? 'aucune URL'}.`);
  if (observation.canonical !== expectedUrl) errors.push(`Le canonical servi diverge : attendu ${expectedUrl}, reçu ${observation.canonical ?? 'aucun canonical unique'}.`);
  if (observation.h1 !== recipe.title) errors.push(`Le H1 servi « ${observation.h1 ?? 'absent ou multiple'} » diverge du candidat « ${recipe.title} ».`);
  if (observation.candidateFingerprint !== expectedFingerprint) errors.push(`L’empreinte du candidat servi diverge : attendu ${expectedFingerprint}, reçu ${observation.candidateFingerprint ?? 'aucune empreinte unique'}.`);
  if (!/^[a-f0-9]{64}$/.test(observation.bodySha256 ?? '')) errors.push('L’observation servie doit porter l’empreinte SHA-256 du HTML reçu.');
  return errors;
}

export async function publierService({ root = process.cwd(), slug, today = todayIso(), observeServed = observerArtefactServi, beforeCommit = null, servedOrigin = process.env.MEMLIA_SERVICE_CANDIDATE_ORIGIN ?? 'https://memlia.fr' }) {
  const snapshot = loadRecipe(root, slug);
  const expectedFingerprint = candidateFingerprint(snapshot);
  let servedUrl;
  try {
    const origin = new URL(servedOrigin);
    if (origin.protocol !== 'https:' || origin.search || origin.hash || origin.pathname !== '/') throw new Error('origine HTTPS seule attendue');
    servedUrl = new URL(snapshot.recipe.path, origin).href;
  } catch {
    return { pass: false, errors: ['L’origine du candidat servi doit être une origine HTTPS exacte, sans chemin, query string ni fragment.'] };
  }
  const sealPath = join(root, 'commercial/services', slug, SEAL_PATH);
  const before = verifierRecetteService({ root, ...snapshot, today, requireReview: true });
  verifyIncomingLinks(root, snapshot.recipe, before);
  before.push(...verifySeal(root, slug));
  if (before.length) return { pass: false, errors: [...new Set(before)] };
  const candidateSealBytes = readFileSync(sealPath);
  const candidateSeal = JSON.parse(candidateSealBytes.toString('utf8'));

  let servedObservation;
  try {
    servedObservation = await observeServed({ root, slug, recipe: snapshot.recipe, expectedFingerprint, servedUrl });
  } catch (error) {
    return { pass: false, errors: [`Observation de l’artefact servi impossible : ${error.message}.`] };
  }
  const observationErrors = verifyServedObservation(servedObservation, snapshot.recipe, expectedFingerprint, servedUrl);
  if (observationErrors.length) return { pass: false, errors: observationErrors };

  if (beforeCommit !== null) beforeCommit({ root, slug });
  const terminalErrors = verifySeal(root, slug);
  if (!existsSync(sealPath) || sha256(readFileSync(sealPath)) !== sha256(candidateSealBytes)) terminalErrors.push(`${slug} : le sceau candidat a changé pendant l’observation servie.`);
  verifyIncomingLinks(root, snapshot.recipe, terminalErrors);
  if (terminalErrors.length) return { pass: false, errors: [...new Set(terminalErrors)] };

  let nextRegistry;
  try {
    nextRegistry = ajouterAuRegistre(chargerRegistre(root), {
      slug: snapshot.recipe.slug,
      type: 'service',
      url: `https://memlia.fr${snapshot.recipe.path}`,
      requete: snapshot.recipe.primaryQuery,
      secondaires: snapshot.recipe.secondaryQueries,
      famille: snapshot.recipe.family,
      publieLe: today,
      source: 'recette-service-publiee',
    });
  } catch (error) {
    return { pass: false, errors: [error.message] };
  }

  const result = materialiserService({ root, slug, status: 'publie', today, snapshot });
  if (result.errors.length) return { pass: false, errors: result.errors };
  sauverRegistre(root, nextRegistry);
  const publicationPath = join(result.dossier, 'preuves/publication.json');
  writeJson(publicationPath, {
    version: 1,
    type: 'service',
    slug,
    path: result.recipe.path,
    status: 'publie',
    publishedOn: today,
    publishedAt: new Date().toISOString(),
    servedObservation,
    page: { path: relative(root, result.pagePath), bytes: readFileSync(result.pagePath).length, sha256: sha256(readFileSync(result.pagePath)) },
    manifest: { path: relative(root, join(result.dossier, 'manifest.json')), bytes: readFileSync(join(result.dossier, 'manifest.json')).length, sha256: sha256(readFileSync(join(result.dossier, 'manifest.json'))) },
  });
  writeSeal(root, slug, 'service-publication-scellee', new Date().toISOString(), candidateSeal.files);
  return { pass: true, errors: [], dossier: result.dossier };
}

export function depublierService({ root = process.cwd(), slug, declaration, today = todayIso() }) {
  const errors = [];
  const route = `/automatisation/${slug}`;
  const destinations = [declaration?.replacement, declaration?.redirect]
    .filter((value) => typeof value === 'string' && value.startsWith('/') && value !== route);
  if (declaration?.slug !== slug || declaration?.route !== route) errors.push('La déclaration doit nommer exactement le slug et la route du service.');
  if (declaration?.authorizedBy !== 'Kevin Kitanga') errors.push('La dépublication exige l’autorisation explicite de Kevin Kitanga.');
  if (!DATE_RE.test(declaration?.depublishedOn ?? '') || declaration.depublishedOn > today) errors.push('La date de dépublication doit être une date ISO non future.');
  if (String(declaration?.reason ?? '').trim().length < 60) errors.push('La raison durable de dépublication doit contenir au moins 60 caractères.');
  if (destinations.length !== 1) errors.push('La dépublication exige exactement un remplacement ou une redirection interne distincte.');

  const receiptPath = join(root, 'commercial/services', slug, 'preuves/publication.json');
  if (!serviceEstPublie(root, slug) || !existsSync(receiptPath)) errors.push('Seul un service publié avec sa preuve peut être dépublié.');
  const ledgerPath = join(root, 'config/service-publication-ledger.json');
  let ledger;
  try {
    ledger = readJson(ledgerPath);
    const authority = ledger.services?.find((service) => service.slug === slug && service.route === route);
    if (!authority || authority.status !== 'publie') errors.push('Le registre durable ne reconnaît pas ce service comme publié.');
  } catch (error) {
    errors.push(`Le registre durable des services publics est absent ou illisible : ${error.message}.`);
  }
  if (errors.length) return { pass: false, errors: [...new Set(errors)] };

  const snapshot = loadRecipe(root, slug);
  const result = materialiserService({ root, slug, status: 'a-valider', today, snapshot, allowDepublish: true });
  if (result.errors.length) return { pass: false, errors: result.errors };
  const depubPath = join(result.dossier, 'preuves/depublication.json');
  writeJson(depubPath, declaration);
  rmSync(receiptPath);
  const authority = ledger.services.find((service) => service.slug === slug && service.route === route);
  authority.status = 'depublie';
  authority.depublicationPath = relative(root, depubPath);
  writeJson(ledgerPath, ledger);
  const registry = chargerRegistre(root);
  const entry = (registry.articles ?? []).find((item) => item.type === 'service' && item.slug === slug);
  if (entry) {
    entry.publieLe = null;
    entry.source = 'recette-service-depubliee';
  }
  sauverRegistre(root, registry);
  writeSeal(root, slug, 'service-depublication-scellee', new Date().toISOString());
  return { pass: true, errors: [], dossier: result.dossier, depubPath };
}

export function auditerServices({ root = process.cwd(), today = todayIso() } = {}) {
  const base = join(root, 'commercial/services');
  const slugs = existsSync(base)
    ? readdirSync(base, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort()
    : [];
  const errors = [];
  const registryServices = (chargerRegistre(root).articles ?? []).filter((entry) => entry.type === 'service');
  const folders = new Set(slugs);
  const registeredSlugs = new Set(registryServices.map((entry) => entry.slug));
  const ledgerPath = join(root, 'config/service-publication-ledger.json');
  let publicationAuthority = new Map();
  const ledgerEnabled = existsSync(ledgerPath);
  if (ledgerEnabled) {
    try {
      const ledger = readJson(ledgerPath);
      if (ledger.version !== 1 || !Array.isArray(ledger.services)) errors.push('Registre durable des services publics invalide.');
      else publicationAuthority = new Map(ledger.services.map((service) => [service.slug, service]));
    } catch (error) {
      errors.push(`Registre durable des services publics illisible (${error.message}).`);
    }
  }
  for (const entry of registryServices) {
    if (!folders.has(entry.slug)) errors.push(`Registre service sans dossier commercial/services/${entry.slug}.`);
  }
  for (const slug of slugs) {
    if (!registeredSlugs.has(slug)) errors.push(`Dossier service sans entrée du registre : ${slug}.`);
  }
  for (const slug of slugs) {
    try {
      const snapshot = loadRecipe(root, slug);
      const { recipe, body, review } = snapshot;
      const manifest = readJson(join(base, slug, 'manifest.json'));
      const receiptPath = join(base, slug, 'preuves/publication.json');
      const sourceAsOf = manifest.status === 'publie' && existsSync(receiptPath) ? readJson(receiptPath).publishedAt : null;
      // Une copie scellée reste historique après publication ; une nouvelle préparation exige une collecte récente.
      errors.push(...verifierRecetteService({ root, recipe, body, review, today, requireReview: true, sourceAsOf }).map((error) => `${slug} : ${error}`));
      const expectedFingerprint = candidateFingerprint(snapshot);
      const entries = registryServices.filter((entry) => entry.slug === slug);
      if (entries.length !== 1) errors.push(`${slug} : le registre doit contenir exactement une entrée service, reçu ${entries.length}.`);
      const entry = entries[0];
      if (entry && (entry.url !== `https://memlia.fr${manifest.path}` || normalizedQuery(entry.requete) !== normalizedQuery(manifest.primaryQuery))) {
        errors.push(`${slug} : divergence URL ou requête entre registre et manifeste.`);
      }
      if (manifest.slug !== slug || manifest.type !== 'service') errors.push(`${slug} : divergence de slug ou type dans le manifeste.`);
      const authority = publicationAuthority.get(slug);
      if (ledgerEnabled && manifest.status === 'publie' && authority?.status !== 'publie') errors.push(`${slug} : service publié absent de l’autorité durable.`);
      if (authority?.status === 'publie' && manifest.status !== 'publie') errors.push(`${slug} : l’autorité durable exige le statut publié ; une dépublication explicite est requise.`);
      if (manifest.candidateFingerprint !== expectedFingerprint) errors.push(`${slug} : l’empreinte du candidat diverge entre recette et manifeste.`);
      const publicationPath = join(base, slug, 'preuves/publication.json');
      if (manifest.status === 'publie') {
        verifyIncomingLinks(root, recipe, errors);
        if (!entry?.publieLe || entry.source !== 'recette-service-publiee') errors.push(`${slug} : le registre ne porte pas l’état de publication daté.`);
        if (!existsSync(publicationPath)) {
          errors.push(`${slug} : preuve de publication servie absente.`);
        } else {
          const publication = readJson(publicationPath);
          if (publication.status !== 'publie' || publication.slug !== slug || publication.path !== recipe.path) errors.push(`${slug} : preuve de publication incohérente avec la recette.`);
          errors.push(...verifyServedObservation(publication.servedObservation, recipe, expectedFingerprint, publication.servedObservation?.url).map((error) => `${slug} : ${error}`));
          if (!DATE_RE.test(publication.publishedOn ?? '') || Number.isNaN(Date.parse(publication.publishedAt))) errors.push(`${slug} : dates de publication absentes ou invalides.`);
          if (entry?.publieLe !== publication.publishedOn) errors.push(`${slug} : publieLe diverge du constat de publication.`);
        }
      } else {
        if (entry?.publieLe !== null) errors.push(`${slug} : un candidat non publié ne doit pas porter publieLe.`);
        if (existsSync(publicationPath)) errors.push(`${slug} : un candidat non publié ne doit pas conserver une preuve de publication.`);
      }
      errors.push(...verifySeal(root, slug));
    } catch (error) {
      errors.push(`${slug} : audit impossible (${error.message}).`);
    }
  }
  return { pass: errors.length === 0, services: slugs.length, errors };
}

export async function commande(argv, root = process.cwd()) {
  if (argv[0] === '--guide') {
    const { commandeGuide } = await import('./lib/guide-forge.mjs');
    return commandeGuide(argv.slice(1), root);
  }
  const [action, slug, declarationPath] = argv;
  let result;
  if (action === 'auditer') result = auditerServices({ root });
  else if (!slug) throw new Error('Usage : service-forge <preparer|sceller|publier> <slug> | depublier <slug> <declaration.json> | auditer');
  else if (action === 'preparer') {
    const prepared = materialiserService({ root, slug, status: 'a-valider' });
    result = { pass: prepared.errors.length === 0, slug, dossier: relative(root, prepared.dossier), errors: prepared.errors, suite: prepared.errors.length ? 'corriger la recette' : 'faire relire puis sceller' };
  } else if (action === 'sceller') result = scellerService({ root, slug });
  else if (action === 'publier') result = await publierService({ root, slug });
  else if (action === 'depublier') {
    if (!declarationPath) throw new Error('Usage : service-forge depublier <slug> <declaration.json>');
    result = depublierService({ root, slug, declaration: readJson(resolve(root, declarationPath)) });
  }
  else throw new Error(`Action inconnue : ${action}`);
  console.log(JSON.stringify(result, null, 2));
  if (!result.pass) process.exitCode = 1;
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  commande(process.argv.slice(2)).catch((error) => {
    console.error(`[service-forge] ${error.message}`);
    process.exitCode = 1;
  });
}
