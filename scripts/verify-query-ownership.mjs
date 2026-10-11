import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'yaml';

const normalize = (value) => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase('fr').replace(/[’‘]/g, "'").replace(/\s+/g, ' ');
const STOP = new Set(['a', 'au', 'aux', 'de', 'des', 'du', 'en', 'et', 'l', 'la', 'le', 'les', 'd', 'un', 'une', 'pour']);
function tokens(query) {
  return new Set(normalize(query).normalize('NFD').replace(/\p{M}/gu, '').match(/[\p{L}\p{N}]+/gu)?.filter((word) => !STOP.has(word)).map((word) => word.length > 4 ? word.replace(/s$/, '') : word) ?? []);
}
function canonicalUrl(value) {
  if (typeof value !== 'string' || (!value.startsWith('/') && !value.startsWith('https://memlia.fr/'))) throw new Error(`URL locale attendue : ${value}`);
  const url = new URL(value, 'https://memlia.fr');
  if (url.origin !== 'https://memlia.fr' || url.search || url.hash) throw new Error(`URL canonique attendue : ${value}`);
  return url.pathname.replace(/\/+$/, '') || '/';
}
function close(a, b) {
  const left = tokens(a), right = tokens(b);
  const shared = [...left].filter((word) => right.has(word)).length;
  const union = new Set([...left, ...right]).size;
  return union > 0 && shared / union >= 0.8;
}

export function auditQueries(entries, exceptions = []) {
  const errors = [], pages = new Map(), allowed = new Map();
  for (const exception of exceptions) {
    try {
      if (!Array.isArray(exception.urls) || exception.urls.length !== 2 || typeof exception.reason !== 'string' || exception.reason.trim().length < 30) throw new Error('deux URL et une justification de 30 caractères au moins requises');
      const urls = exception.urls.map(canonicalUrl).sort();
      if (urls[0] === urls[1]) throw new Error('les URL doivent être distinctes');
      if (!Array.isArray(exception.queries) || exception.queries.length !== 2 || exception.queries.some((query) => typeof query !== 'string' || !normalize(query))) throw new Error('les deux requêtes justifiées sont requises');
      allowed.set(JSON.stringify(urls), exception.queries.map(normalize).sort());
    } catch (error) { errors.push(`exception invalide : ${error.message}`); }
  }
  for (const entry of entries) {
    try {
      const url = canonicalUrl(entry.url), query = normalize(entry.query);
      if (!query) throw new Error(`requête primaire absente : ${url} (${entry.source})`);
      const previous = pages.get(url);
      if (previous && previous.query !== query) errors.push(`divergence ${url} : « ${previous.query} » (${previous.source}) / « ${query} » (${entry.source})`);
      else pages.set(url, { ...entry, url, query });
    } catch (error) { errors.push(error.message); }
  }
  const corpus = [...pages.values()].sort((a, b) => a.url.localeCompare(b.url));
  const conflicts = [];
  for (let i = 0; i < corpus.length; i++) {
    for (const b of corpus.slice(i + 1)) {
      const a = corpus[i];
      if (a.query === b.query) {
        errors.push(`doublon « ${a.query} » : ${a.url} / ${b.url}`);
        conflicts.push({ kind: 'exact', a, b });
      } else if (close(a.query, b.query) && JSON.stringify(allowed.get(JSON.stringify([a.url, b.url].sort()))) !== JSON.stringify([a.query, b.query].sort())) {
        errors.push(`requêtes proches sans exception : ${a.url} « ${a.query} » / ${b.url} « ${b.query} »`);
        conflicts.push({ kind: 'close', a, b });
      }
    }
  }
  return { pass: errors.length === 0, errors, conflicts, pages: corpus.length, entries: entries.length };
}

export function collectQueries(root = process.cwd()) {
  const json = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
  const entries = [];
  const add = (url, query, source) => entries.push({ url, query, source });
  const contractPath = 'config/page-intent-contract.json';
  const contract = json(contractPath);
  for (const [url, page] of Object.entries(contract.pages)) add(url, page.query, contractPath);
  const registryPath = 'docs/strategy/site-v3/mesures/registre-requetes.json';
  for (const article of json(registryPath).articles) add(article.url, article.requete, registryPath);
  const backlogPath = 'docs/strategy/site-v3/backlog-v3.json';
  for (const article of json(backlogPath)) add(`/blog/${article.slug}`, article.requete, backlogPath);
  function walk(directory, prefix) {
    if (!existsSync(directory)) throw new Error(`collection absente : ${directory}`);
    for (const item of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, item.name);
      if (item.isDirectory()) { walk(path, prefix); continue; }
      if (!item.name.endsWith('.md')) continue;
      const match = readFileSync(path, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!match) throw new Error(`frontmatter absent : ${path}`);
      const data = parse(match[1]);
      const base = join(root, 'src/content', prefix === '/blog' ? 'blog' : 'services');
      const url = `${prefix}/${relative(base, path).replace(/\.md$/, '').replaceAll('\\', '/')}`;
      const query = data.primaryQuery ?? contract.pages[url]?.query;
      if (!normalize(query)) throw new Error(`requête primaire absente : ${path}`);
      add(url, query, relative(root, path));
    }
  }
  walk(join(root, 'src/content/blog'), '/blog');
  walk(join(root, 'src/content/services'), '/automatisation');
  return entries;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const index = process.argv.indexOf('--root');
    const root = index === -1 ? process.cwd() : resolve(process.argv[index + 1]);
    const exceptionPath = join(root, 'config/query-ownership-exceptions.json');
    const exceptions = existsSync(exceptionPath) ? JSON.parse(readFileSync(exceptionPath, 'utf8')).exceptions : [];
    const result = auditQueries(collectQueries(root), exceptions);
    if (!result.pass) { console.error(result.errors.join('\n')); process.exitCode = 1; }
    else console.log(`query-ownership : ${result.pages} URL, ${result.entries} déclarations croisées, aucun conflit non motivé.`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
