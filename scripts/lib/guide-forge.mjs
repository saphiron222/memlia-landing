import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import ts from 'typescript';
import { parse } from 'parse5';
import { renderGuideProof } from '../render-guide-proof.mjs';

const sha = (s) => createHash('sha256').update(s).digest('hex');
const read = (root, path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const encode = (data) => JSON.stringify(data, null, 2) + '\n';
const write = (root, path, data) => { mkdirSync(dirname(join(root, path)), { recursive: true }); writeFileSync(join(root, path), encode(data)); };
const norm = (s) => String(s ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim();
const date = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s && s <= new Date().toISOString().slice(0, 10);
const slugOK = (s) => typeof s === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);
const fail = (errors) => ({ pass: false, errors });
const collection = 'src/data/guides.generated.json';
const proofs = 'src/data/guide-proofs.generated.json';
const recipePath = (slug) => `guides/recettes/${slug}/recette.json`;
const statePath = (slug, name) => `guides/etats/${slug}/${name}.json`;
const assetPath = (slug) => `public/proofs/integrations/${slug}.webp`;
const rendererPath = 'scripts/render-guide-proof.mjs';
const rendererHash = () => sha(Buffer.concat(['../render-guide-proof.mjs', '../../public/fonts/hanken-400.woff2', '../../public/fonts/fraunces-600.woff2'].map(path => readFileSync(new URL(path, import.meta.url)))));

// Le corpus TS reste en place. Aucune écriture ni nouvelle définition ne vient
// de ce chargement : les imports de collection sont remplacés par une liste vide.
function historical(root) {
  const source = readFileSync(join(root, 'src/data/integrations.ts'), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  new Function('exports', 'require', compiled)(exports, (id) => {
    if (id === './guides.generated.json') return [];
    throw Error(`Import historique inattendu : ${id}`);
  });
  return exports.INTEGRATIONS_HISTORIQUES ?? exports.INTEGRATIONS;
}
function safeEvidence(slug, name) {
  if (typeof name !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.json$/.test(name)) throw Error('evidencePath doit être un fichier JSON du dossier recette.');
  return `guides/recettes/${slug}/${name}`;
}
function measurement(root, recipe) {
  const evidencePath = safeEvidence(recipe.integration.slug, recipe.demand?.evidencePath);
  const bytes = readFileSync(join(root, evidencePath));
  if (sha(bytes) !== recipe.demand.sha256) throw Error('Empreinte de la preuve d’autocomplétion périmée.');
  const e = JSON.parse(bytes);
  if (e.provider !== 'google-autocomplete' || e.httpStatus !== 200 || e.fictitious === true || !date(e.measuredAt)) throw Error('Mesure Google réelle, datée et HTTP 200 requise (pas fictive).');
  const url = new URL(e.endpoint);
  if (url.origin !== 'https://suggestqueries.google.com' || url.pathname !== '/complete/search' || url.searchParams.get('client') !== 'firefox' || url.searchParams.get('hl') !== 'fr' || url.searchParams.get('gl') !== 'fr' || norm(url.searchParams.get('q')) !== norm(recipe.integration.primaryQuery)) throw Error('Endpoint autocomplétion France non lié à primaryQuery.');
  if (!Array.isArray(e.response) || norm(e.response[0]) !== norm(recipe.integration.primaryQuery) || !Array.isArray(e.response[1]) || e.response[1].some(s => typeof s !== 'string' || !s.trim())) throw Error('Réponse brute autocomplétion absente ou requête différente.');
  const count = new Set(e.response[1].map(norm)).size;
  if (count < 6) throw Error(`Demande insuffisante : ${count} suggestions distinctes ; minimum 6.`);
  if (recipe.integration.suggestions !== count) throw Error('suggestions doit correspondre aux suggestions distinctes réellement relevées.');
  return evidencePath;
}
export function verifierRecetteGuide({ root = process.cwd(), recipe }) {
  const errors = [];
  try {
    if (recipe?.version !== 1 || recipe?.type !== 'guide' || !['historique', 'nouveau'].includes(recipe?.mode) || typeof recipe.author !== 'string' || !recipe.author.trim()) throw Error('Recette guide version 1, mode et auteur requis.');
    const d = recipe.integration;
    if (!d || !slugOK(d.slug)) throw Error('IntegrationDefinition complète et slug ASCII requis.');
    for (const field of ['task','product','primaryQuery','h1','tabTitle','description','intro','officialPath','documentScope','knownTrap','writtenRule']) if (typeof d[field] !== 'string' || !d[field].trim()) errors.push(`${field} requis.`);
    if (typeof d.vendor !== 'string' || !d.vendor.trim() || d.auteur !== 'kevin') errors.push('Éditeur ou auteur hors contrat IntegrationDefinition.');
    if (recipe.reviewKind && !['qa', 'metier'].includes(recipe.reviewKind)) errors.push('reviewKind doit être qa ou metier.');
    for (const field of ['datePublication','dateMiseAJour']) if (!date(d[field])) errors.push(`${field} doit être une date non future.`);
    if (!Array.isArray(d.modifiers) || d.modifiers.some(s => typeof s !== 'string')) errors.push('modifiers requis.');
    const serviceSlug = /^\/automatisation\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(d.service?.href ?? '')?.[1];
    const serviceFile = serviceSlug && join(root, 'src/content/services', `${serviceSlug}.md`);
    const publishedService = serviceFile && existsSync(serviceFile) && /^status:\s*publie\s*$/m.test(readFileSync(serviceFile, 'utf8'));
    if ((!['/automatisation-cabinet-comptable','/automatisation/paie','/automatisation/rapprochement-bancaire','/automatisation/saisie-comptable'].includes(d.service?.href) && !publishedService) || !d.service?.label?.trim()) errors.push('Moyeu de service existant requis.');
    if (!Array.isArray(d.fields) || !d.fields.length || d.fields.some(f => typeof f.label !== 'string' || !f.label.trim() || typeof f.control !== 'string' || !f.control.trim())) errors.push('Champs de contrôle requis.');
    if (['prepared','validation','human'].some(k => typeof d.boundary?.[k] !== 'string' || !d.boundary[k].trim())) errors.push('Frontière en trois colonnes requise.');
    if (!Array.isArray(d.replay) || d.replay.length !== 3 || d.replay.some(c => !['Préparé','À valider','Arrêt'].includes(c.outcome) || ['input','rule','detail'].some(k => typeof c[k] !== 'string' || !c[k].trim())) || new Set(d.replay.map(c => c.outcome)).size !== 3) errors.push('Trois cas illustratifs distincts, dont arrêt, requis.');
    if (['title','fact'].some(k => typeof d.source?.[k] !== 'string' || !d.source[k].trim()) || !date(d.source?.checkedAt) || !/^https:\/\//.test(d.source?.url ?? '')) errors.push('Source HTTPS datée et portée requises.');
    if (d.tool && (!/^\/(?!\/)/.test(d.tool.href ?? '') || !d.tool.label?.trim())) errors.push('Outil local invalide.');
    const old = historical(root);
    const existing = old.find(x => x.slug === d.slug);
    if (recipe.mode === 'historique') {
      if (!existing || JSON.stringify(existing) !== JSON.stringify(d) || recipe.demand?.historicalAt !== '2026-09-20' || recipe.demand?.source !== 'docs/strategy/site-v3/PSEO-INTEGRATIONS.md') errors.push('Exception historique limitée au corpus identique daté du 20 septembre 2026.');
    } else {
      if (existing) errors.push('Écrasement d’un guide historique interdit.');
      measurement(root, recipe);
      const others = existsSync(join(root, collection)) ? read(root, collection) : [];
      if ([...old, ...others].some(x => x.slug !== d.slug && norm(x.primaryQuery) === norm(d.primaryQuery))) errors.push('Requête déjà possédée par un autre guide.');
      const registry = 'docs/strategy/site-v3/mesures/registre-requetes.json';
      if (existsSync(join(root, registry)) && (read(root, registry).articles ?? []).some(x => norm(x.requete) === norm(d.primaryQuery) && x.url !== `https://memlia.fr/integrations/${d.slug}`)) errors.push('Requête déjà possédée dans le registre SEO.');
    }
  } catch (error) { errors.push(error.message); }
  return errors;
}
function load(root, slug) {
  if (!slugOK(slug)) throw Error('Slug invalide.');
  const recipe = read(root, recipePath(slug));
  if (recipe.integration?.slug !== slug) throw Error('Slug du dossier différent de la recette.');
  return recipe;
}
function hashes(root, paths) { return Object.fromEntries(paths.map(path => [path, sha(readFileSync(join(root, path)))])); }
function equal(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function verifyState(root, slug) {
  if (!slugOK(slug)) throw Error('Slug invalide.');
  const manifest = read(root, statePath(slug, 'manifest'));
  const recipe = load(root, slug);
  const errors = verifierRecetteGuide({ root, recipe });
  const expectedPaths = [recipePath(slug), assetPath(slug), ...(recipe.mode === 'nouveau' ? [measurement(root, recipe), `guides/etats/${slug}/preuve.html`] : [])].sort();
  if (!equal(Object.keys(manifest.files ?? {}).sort(), expectedPaths)) errors.push('Inventaire des preuves incomplet ou inattendu.');
  if (manifest.version !== 1 || manifest.mode !== recipe.mode || manifest.slug !== slug || !['prepare','scelle','publie'].includes(manifest.status) || manifest.candidateSha256 !== sha(readFileSync(join(root, recipePath(slug))))) errors.push('Manifest/candidat périmé.');
  for (const [path, hash] of Object.entries(manifest.files ?? {})) {
    if (!resolve(root, path).startsWith(resolve(root) + sep) || sha(readFileSync(join(root, path))) !== hash) errors.push(`Actif ou preuve modifié : ${path}`);
  }
  if (recipe.mode === 'nouveau' && manifest.rendererSha256 !== rendererHash()) errors.push(`${rendererPath} a changé ; preuve périmée.`);
  if (manifest.status !== 'prepare') {
    const sealBytes = readFileSync(join(root, statePath(slug, 'scellement')));
    const seal = JSON.parse(sealBytes);
    if (manifest.sealSha256 !== sha(sealBytes) || seal.slug !== slug || seal.candidateSha256 !== manifest.candidateSha256 || !equal(seal.files, manifest.files) || seal.rendererSha256 !== manifest.rendererSha256 || !equal(seal.proof, manifest.proof)) errors.push('Sceau modifié ou périmé.');
    const review = read(root, `guides/recettes/${slug}/revue.json`);
    errors.push(...reviewErrors(review, recipe, manifest.candidateSha256));
    if (seal.reviewSha256 !== sha(readFileSync(join(root, `guides/recettes/${slug}/revue.json`)))) errors.push('Revue modifiée après scellement.');
    if (recipe.mode === 'nouveau') {
      const entries = read(root, collection);
      const metadata = read(root, proofs);
      for (const [path, data] of [[collection, entries], [proofs, metadata]]) {
        if (readFileSync(join(root, path), 'utf8') !== encode(data)) errors.push(`Collection non canonique ou altérée : ${path}`);
      }
      const entry = entries.find(x => x.slug === slug);
      const proof = metadata[`integrations/${slug}`];
      if (!equal(entry, recipe.integration) || !equal(proof, manifest.proof)) errors.push('Collection ou métadonnées de preuve modifiées.');
    }
    const publicationPath = statePath(slug, 'publication');
    if (manifest.status === 'publie') {
      const receiptBytes = readFileSync(join(root, publicationPath));
      const receipt = JSON.parse(receiptBytes);
      if (sha(receiptBytes) !== seal.publicationSha256 || receipt.candidateSha256 !== manifest.candidateSha256 || receipt.integrationSha256 !== sha(JSON.stringify(recipe.integration)) || receipt.proofSha256 !== manifest.files[assetPath(slug)] || receipt.httpStatus !== 200 || receipt.canonical !== `https://memlia.fr/integrations/${slug}` || receipt.h1 !== recipe.integration.h1 || receipt.indexable !== true || receipt.robotsAllowed !== true || !/^[a-f0-9]{64}$/.test(receipt.robotsSha256 ?? '') || !/^[a-f0-9]{64}$/.test(receipt.htmlSha256 ?? '') || !receipt.observedAt) errors.push('Reçu de publication modifié ou invalide.');
    } else if (existsSync(join(root, publicationPath)) || seal.publicationSha256) errors.push('Publication incohérente avec la transition.');
  }
  return { errors, manifest, recipe };
}
function reviewErrors(review, recipe, candidateHash) {
  return review?.kind === (recipe.reviewKind ?? 'qa') && review.status === 'PASS' && typeof review.reviewer === 'string' && review.reviewer.trim() && review.reviewer !== recipe.author && review.reviewer !== recipe.integration.auteur && date(review.reviewedAt) && review.candidateSha256 === candidateHash && Array.isArray(review.observations) && review.observations.length && review.observations.every(x => typeof x === 'string' && x.trim()) ? [] : ['Une revue indépendante PASS datée, motivée et liée au candidat est requise (reviewKind).'];
}
export function verifierPreuveGuide({ root = process.cwd(), slug }) {
  try {
    const { errors, manifest } = verifyState(root, slug);
    if (!['scelle', 'publie'].includes(manifest.status)) errors.push('Scellement requis pour la provenance publique.');
    return { pass: errors.length === 0, errors, asset: `/${assetPath(slug).slice(7)}`, route: `/integrations/${slug}` };
  } catch (error) { return fail([error.message]); }
}
export async function preparerGuide({ root = process.cwd(), slug }) {
  try {
    const recipe = load(root, slug);
    const errors = verifierRecetteGuide({ root, recipe });
    if (errors.length) return fail(errors);
    if (existsSync(join(root, statePath(slug, 'manifest')))) {
      const checked = verifyState(root, slug);
      return checked.errors.length ? fail(checked.errors) : { pass: true, slug, status: checked.manifest.status, idempotent: true };
    }
    const paths = [recipePath(slug)];
    let proof;
    if (recipe.mode === 'nouveau') {
      paths.push(measurement(root, recipe));
      if (existsSync(join(root, assetPath(slug)))) return fail(['Un actif existe déjà : écrasement silencieux interdit.']);
      const rendered = await renderGuideProof({ root, integration: recipe.integration });
      paths.push(rendered.source, assetPath(slug)); proof = rendered.proof;
    } else paths.push(assetPath(slug));
    const manifest = { version: 1, slug, mode: recipe.mode, status: 'prepare', candidateSha256: sha(readFileSync(join(root, recipePath(slug)))), files: hashes(root, paths), rendererSha256: recipe.mode === 'nouveau' ? rendererHash() : null, proof: proof ?? null };
    write(root, statePath(slug, 'manifest'), manifest);
    return { pass: true, slug, status: 'prepare' };
  } catch (error) { return fail([error.message]); }
}
export async function scellerGuide({ root = process.cwd(), slug }) {
  try {
    const { errors, manifest, recipe } = verifyState(root, slug);
    if (errors.length) return fail(errors);
    if (manifest.status !== 'prepare') return { pass: true, slug, status: manifest.status, idempotent: true };
    const reviewPath = `guides/recettes/${slug}/revue.json`;
    const review = existsSync(join(root, reviewPath)) ? read(root, reviewPath) : null;
    const reviewIssues = reviewErrors(review, recipe, manifest.candidateSha256);
    if (reviewIssues.length) return fail(reviewIssues);
    if (recipe.mode === 'nouveau') {
      const entries = read(root, collection); const metadata = read(root, proofs);
      if (entries.some(x => x.slug === slug) || metadata[`integrations/${slug}`]) return fail(['Collection déjà occupée : écrasement interdit.']);
      write(root, collection, [...entries, recipe.integration]); write(root, proofs, { ...metadata, [`integrations/${slug}`]: manifest.proof });
    }
    const seal = { version: 1, slug, candidateSha256: manifest.candidateSha256, files: manifest.files, rendererSha256: manifest.rendererSha256, proof: manifest.proof, reviewSha256: sha(readFileSync(join(root, reviewPath))) };
    write(root, statePath(slug, 'scellement'), seal);
    write(root, statePath(slug, 'manifest'), { ...manifest, status: 'scelle', sealSha256: sha(readFileSync(join(root, statePath(slug, 'scellement')))) });
    return { pass: true, slug, status: 'scelle' };
  } catch (error) { return fail([error.message]); }
}
function robotsAllow(body, path) {
  const groups = []; let group = { agents: [], rules: [] };
  for (const raw of body.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').trim();
    const m = /^([^:]+):\s*(.*)$/.exec(line); if (!m) continue;
    const key = m[1].toLowerCase(); const value = m[2].trim();
    if (key === 'user-agent') {
      if (group.rules.length) { groups.push(group); group = { agents: [], rules: [] }; }
      group.agents.push(value.toLowerCase());
    } else if (['allow','disallow'].includes(key) && group.agents.length) group.rules.push({ allow: key === 'allow', pattern: value });
  }
  if (group.agents.length) groups.push(group);
  if (!groups.length) return false;
  return ['googlebot','bingbot'].every(agent => {
    const specific = groups.filter(g => g.agents.some(a => a !== '*' && agent.includes(a)));
    const applicable = specific.length ? specific : groups.filter(g => g.agents.includes('*'));
    const matches = applicable.flatMap(g => g.rules).filter(r => {
      if (!r.pattern) return false;
      const pattern = r.pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replaceAll('*', '.*').replace(/\\\$$/, '$');
      return new RegExp('^' + pattern).test(path);
    }).sort((a, b) => b.pattern.length - a.pattern.length || Number(b.allow) - Number(a.allow));
    return !matches.length || matches[0].allow;
  });
}
function nodes(root) { return [root, ...(root.childNodes ?? []).flatMap(nodes), ...(root.content ? nodes(root.content) : [])]; }
function text(node) { return ['script', 'style', 'template'].includes(node.tagName) ? '' : node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join(' '); }
export async function publierGuide({ root = process.cwd(), slug, fetchImpl = fetch }) {
  try {
    const { errors, manifest, recipe } = verifyState(root, slug);
    if (errors.length) return fail(errors);
    if (manifest.status === 'publie') return { pass: true, slug, status: 'publie', idempotent: true };
    if (manifest.status !== 'scelle') return fail(['Scellement requis avant publication.']);
    const url = `https://memlia.fr/integrations/${slug}`;
    const response = await fetchImpl(url, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
    if (response.status !== 200) return fail([`HTTP ${response.status}, 200 requis.`]);
    const html = await response.text(); const all = nodes(parse(html));
    const attr = (node, name) => node.attrs?.find(x => x.name === name)?.value;
    const canonicals = all.filter(n => n.tagName === 'link' && (attr(n, 'rel') ?? '').split(/\s+/).includes('canonical'));
    const h1s = all.filter(n => n.tagName === 'h1');
    const robots = all.filter(n => n.tagName === 'meta' && ['robots','googlebot','bingbot'].includes((attr(n, 'name') ?? '').toLowerCase())).map(n => attr(n, 'content')).join(' ') + ' ' + (response.headers.get('x-robots-tag') ?? '');
    const indexable = !/\b(noindex|none)\b/i.test(robots);
    if (canonicals.length !== 1 || attr(canonicals[0], 'href') !== url || h1s.length !== 1 || text(h1s[0]).trim() !== recipe.integration.h1 || !indexable) return fail(['Canonical, H1 unique ou indexabilité non conformes.']);
    const d = recipe.integration;
    const integrationSha256 = sha(JSON.stringify(d));
    const identities = all.filter(n => attr(n, 'data-guide-sha256') !== undefined);
    if (recipe.mode === 'nouveau' && (identities.length !== 1 || attr(identities[0], 'data-guide-sha256') !== integrationSha256)) return fail(['Identité du guide servi absente ou divergente.']);
    const body = norm(text(all.find(n => n.tagName === 'body') ?? {}));
    const expected = [d.intro, d.documentScope, d.officialPath, d.knownTrap, d.writtenRule, ...d.fields.flatMap(f => [f.label, f.control]), ...Object.values(d.boundary), ...d.replay.flatMap(Object.values), d.source.title, d.source.fact];
    if (expected.some(value => !body.includes(norm(value))) || !all.some(n => n.tagName === 'a' && attr(n, 'href') === d.source.url)) return fail(['Corps du guide servi différent du candidat relu.']);
    const proofUrl = `/proofs/integrations/${slug}.webp`;
    if (!all.some(n => n.tagName === 'img' && [proofUrl, `https://memlia.fr${proofUrl}`].includes(attr(n, 'src')))) return fail(['Preuve attendue absente de la page servie.']);
    const proofResponse = await fetchImpl(`https://memlia.fr${proofUrl}`, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
    const proofSha256 = sha(Buffer.from(await proofResponse.arrayBuffer()));
    if (proofResponse.status !== 200 || proofSha256 !== manifest.files[assetPath(slug)]) return fail(['Preuve servie absente ou altérée.']);
    const robotsResponse = await fetchImpl('https://memlia.fr/robots.txt', { redirect: 'manual', signal: AbortSignal.timeout(20000) });
    const robotsBody = await robotsResponse.text();
    if (robotsResponse.status !== 200 || !robotsAllow(robotsBody, `/integrations/${slug}`)) return fail(['robots.txt absent ou bloquant le guide.']);
    const terminal = verifyState(root, slug);
    if (terminal.errors.length || !equal(terminal.manifest, manifest)) return fail([...terminal.errors, 'Candidat modifié pendant le constat réseau.']);
    const receipt = { version: 1, slug, candidateSha256: manifest.candidateSha256, integrationSha256, proofSha256, observedAt: new Date().toISOString(), url, httpStatus: response.status, canonical: url, h1: text(h1s[0]).trim(), indexable, robotsAllowed: true, robotsSha256: sha(robotsBody), htmlSha256: sha(html) };
    write(root, statePath(slug, 'publication'), receipt);
    const seal = read(root, statePath(slug, 'scellement'));
    seal.publicationSha256 = sha(readFileSync(join(root, statePath(slug, 'publication'))));
    write(root, statePath(slug, 'scellement'), seal);
    write(root, statePath(slug, 'manifest'), { ...manifest, status: 'publie', sealSha256: sha(readFileSync(join(root, statePath(slug, 'scellement')))) });
    return { pass: true, slug, status: 'publie', observation: receipt };
  } catch (error) { return fail([error.message]); }
}
export function auditerGuides({ root = process.cwd() } = {}) {
  const errors = []; const dir = join(root, 'guides/etats');
  const slugs = existsSync(dir) ? readdirSync(dir) : [];
  for (const slug of slugs) { try { errors.push(...verifyState(root, slug).errors.map(e => `${slug} : ${e}`)); } catch (e) { errors.push(`${slug} : ${e.message}`); } }
  try {
    const entries = read(root, collection); const metadata = read(root, proofs);
    for (const [path, data] of [[collection, entries], [proofs, metadata]]) if (readFileSync(join(root, path), 'utf8') !== encode(data)) errors.push(`Collection non canonique ou altérée : ${path}`);
    if (new Set(entries.map(x => x.slug)).size !== entries.length) errors.push('Slugs générés dupliqués.');
    for (const entry of entries) if (!slugs.includes(entry.slug) || !['scelle','publie'].includes(read(root, statePath(entry.slug, 'manifest')).status)) errors.push(`Guide généré sans sceau : ${entry.slug}`);
    if (!equal(Object.keys(metadata).sort(), entries.map(x => `integrations/${x.slug}`).sort())) errors.push('Preuves et collection ne couvrent pas les mêmes guides.');
  } catch (e) { errors.push(e.message); }
  return { pass: errors.length === 0, guides: slugs.length, errors };
}
export async function commandeGuide(argv, root = process.cwd()) {
  const [action, slug] = argv;
  let result;
  if (['audit','auditer'].includes(action)) result = auditerGuides({ root });
  else if (action === 'preparer') result = await preparerGuide({ root, slug });
  else if (action === 'sceller') result = await scellerGuide({ root, slug });
  else if (action === 'publier') result = await publierGuide({ root, slug });
  else throw Error('Usage : service-forge --guide <preparer|sceller|publier> <slug> | audit');
  console.log(JSON.stringify(result, null, 2)); if (!result.pass) process.exitCode = 1;
  return result;
}
