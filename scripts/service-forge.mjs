#!/usr/bin/env node
/**
 * Forge des pages de service. Elle partage uniquement le registre de requêtes avec le blog :
 * aucun article, dossier éditorial ou plafond de cadence n'est lu puis réécrit ici.
 *
 * Commandes :
 *   node scripts/service-forge.mjs preparer <slug>
 *   node scripts/service-forge.mjs sceller <slug>
 *   node scripts/service-forge.mjs publier <slug>
 *   node scripts/service-forge.mjs auditer
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { verifierTitreIntentMesure } from './lib/blog-title-intent.mjs';
import { ajouterAuRegistre, chargerRegistre, sauverRegistre } from './lib/seo-registres.mjs';

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
const todayIso = () => new Date().toISOString().slice(0, 10);
const typographicApostrophe = (text) => String(text ?? '').replace(/'/g, '’');
const normalizedQuery = (value) => String(value ?? '')
  .normalize('NFD')
  .replace(/\p{Diacritic}/gu, '')
  .toLowerCase()
  .replace(/\s+/g, ' ')
  .trim();

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

function verifyIncomingLinks(root, recipe, errors) {
  const links = Array.isArray(recipe.incomingLinks) ? recipe.incomingLinks : [];
  const distinctUrls = new Set(links.map((link) => link?.url));
  const distinctSources = new Set(links.map((link) => link?.sourcePath));
  if (links.length < 3 || distinctUrls.size < 3 || distinctSources.size < 3) errors.push('Trois liens entrants contextuels depuis trois URL indexables distinctes sont requis avant publication.');
  for (const link of links) {
    const prefix = link?.url ?? 'lien sans URL';
    if (!link || typeof link.sourcePath !== 'string' || !link.sourcePath.startsWith('src/')) {
      errors.push(`${prefix} : sourcePath doit désigner une source publique sous src/.`);
      continue;
    }
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
    if (/(?:layouts|components)[/\\]/.test(link.sourcePath)) errors.push(`${prefix} : header, footer, fil d’Ariane et composant global ne comptent pas comme lien entrant.`);
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

export function verifierRecetteService({ root, recipe, body, review, today = todayIso(), requireReview = true }) {
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
  verifyIncomingLinks(root, recipe, errors);
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

function frontmatter(recipe, status) {
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
intent: ${recipe.intent}
family: ${recipe.family}
verifiedAt: ${recipe.verifiedAt}
status: ${status}
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
  return files;
}

function hashesFor(root, slug) {
  const files = subjectFiles(root, slug);
  return Object.fromEntries(Object.entries(files).map(([key, path]) => {
    const bytes = readFileSync(path);
    return [key, { path: relative(root, path), bytes: bytes.length, sha256: sha256(bytes) }];
  }));
}

export function materialiserService({ root = process.cwd(), slug, status = 'a-valider', today = todayIso() }) {
  const { recipe, body, review } = loadRecipe(root, slug);
  const errors = verifierRecetteService({ root, recipe, body, review, today, requireReview: false });
  const dossier = join(root, 'commercial/services', slug);
  const pagePath = join(root, 'src/content/services', `${slug}.md`);
  if (errors.length) return { errors, recipe, manifest: null, dossier, pagePath };
  mkdirSync(dirname(pagePath), { recursive: true });
  mkdirSync(join(dossier, 'preuves'), { recursive: true });
  const page = `${frontmatter(recipe, status)}\n\n${body}\n`;
  writeFileSync(pagePath, page);
  const proofSource = join(root, 'commercial/recettes', slug, recipe.proof.evidencePath);
  if (existsSync(proofSource)) writeFileSync(join(dossier, 'preuves/rejeu.json'), readFileSync(proofSource));
  const manifest = {
    version: 1,
    type: 'service',
    slug,
    path: recipe.path,
    status,
    title: recipe.title,
    tabTitle: recipe.tabTitle,
    ogTitle: recipe.ogTitle,
    headline: recipe.schema.headline,
    description: recipe.description,
    hero: recipe.hero,
    primaryQuery: recipe.primaryQuery,
    secondaryQueries: recipe.secondaryQueries,
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

function writeSeal(root, slug, kind, sealedAt) {
  const dossier = join(root, 'commercial/services', slug);
  writeJson(join(dossier, SEAL_PATH), { version: 1, kind, slug, sealedAt, files: hashesFor(root, slug) });
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

export function publierService({ root = process.cwd(), slug, today = todayIso() }) {
  const before = verifySeal(root, slug);
  if (before.length) return { pass: false, errors: before };
  const result = materialiserService({ root, slug, status: 'publie', today });
  if (result.errors.length) return { pass: false, errors: result.errors };
  registerService(root, result.recipe);
  const registry = chargerRegistre(root);
  sauverRegistre(root, {
    ...registry,
    articles: registry.articles.map((item) => item.slug === slug && item.type === 'service'
      ? { ...item, publieLe: today, source: 'recette-service-publiee' }
      : item),
  });
  const publicationPath = join(result.dossier, 'preuves/publication.json');
  writeJson(publicationPath, {
    version: 1,
    type: 'service',
    slug,
    path: result.recipe.path,
    status: 'publie',
    publishedAt: new Date().toISOString(),
    page: { path: relative(root, result.pagePath), bytes: readFileSync(result.pagePath).length, sha256: sha256(readFileSync(result.pagePath)) },
    manifest: { path: relative(root, join(result.dossier, 'manifest.json')), bytes: readFileSync(join(result.dossier, 'manifest.json')).length, sha256: sha256(readFileSync(join(result.dossier, 'manifest.json'))) },
  });
  writeSeal(root, slug, 'service-publication-scellee', new Date().toISOString());
  return { pass: true, errors: [], dossier: result.dossier };
}

export function auditerServices({ root = process.cwd(), today = todayIso() } = {}) {
  const base = join(root, 'commercial/services');
  if (!existsSync(base)) return { pass: true, services: 0, errors: [] };
  const slugs = readdirSync(base, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  const errors = [];
  for (const slug of slugs) {
    try {
      const { recipe, body, review } = loadRecipe(root, slug);
      errors.push(...verifierRecetteService({ root, recipe, body, review, today, requireReview: true }).map((error) => `${slug} : ${error}`));
      errors.push(...verifySeal(root, slug));
    } catch (error) {
      errors.push(`${slug} : audit impossible (${error.message}).`);
    }
  }
  return { pass: errors.length === 0, services: slugs.length, errors };
}

export async function commande(argv, root = process.cwd()) {
  const [action, slug] = argv;
  let result;
  if (action === 'auditer') result = auditerServices({ root });
  else if (!slug) throw new Error('Usage : service-forge <preparer|sceller|publier> <slug> | auditer');
  else if (action === 'preparer') {
    const prepared = materialiserService({ root, slug, status: 'a-valider' });
    result = { pass: prepared.errors.length === 0, slug, dossier: relative(root, prepared.dossier), errors: prepared.errors, suite: prepared.errors.length ? 'corriger la recette' : 'faire relire puis sceller' };
  } else if (action === 'sceller') result = scellerService({ root, slug });
  else if (action === 'publier') result = publierService({ root, slug });
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
