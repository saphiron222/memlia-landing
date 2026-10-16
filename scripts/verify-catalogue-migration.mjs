import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'parse5';
import { MIGRATION_CATALOGUES, blocRedirections } from '../src/data/migrations-catalogues.mjs';

const files = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)]);
const attr = (node, key) => node.attrs?.find(a => a.name === key)?.value;

/** Contrôle de l’artefact final, après les exports Markdown : une suppression de route ne suffit pas. */
export function verifierExportMigration(dist = 'dist') {
  const errors = [];
  const retired = new Set(MIGRATION_CATALOGUES.routes.map(row => row.from));
  const redirects = readFileSync(join(dist, '_redirects'), 'utf8');
  if (!redirects.includes(blocRedirections())) errors.push('Redirections absentes ou différentes de la décision.');
  for (const row of MIGRATION_CATALOGUES.routes) {
    for (const path of [`${row.from}.html`, `${row.from}/index.html`, `/markdown${row.from}.md`]) {
      if (existsSync(join(dist, path))) errors.push(`Ancienne surface encore servie : ${path}`);
    }
    const [path, hash] = row.to.split('#');
    const target = join(dist, `${path}.html`);
    if (!existsSync(target)) { errors.push(`Destination absente : ${row.to}`); continue; }
    const html = readFileSync(target, 'utf8');
    const ids = new Set(); let canonical; let noindex = false;
    function visit(node) {
      if (attr(node, 'id')) ids.add(attr(node, 'id'));
      if (node.tagName === 'link' && attr(node, 'rel') === 'canonical') canonical = attr(node, 'href');
      if (node.tagName === 'meta' && attr(node, 'name') === 'robots' && /\bnoindex\b/.test(attr(node, 'content') ?? '')) noindex = true;
      for (const child of node.childNodes ?? []) visit(child);
    }
    visit(parse(html));
    if (hash && !ids.has(hash)) errors.push(`Ancre de destination absente : ${row.to}`);
    if (canonical !== `https://memlia.fr${path}` || noindex) errors.push(`Destination non canonique ou non indexable : ${row.to}`);
    if (!existsSync(join(dist, `/markdown${path}.md`))) errors.push(`Export de destination absent : ${path}`);
  }
  let documents = 0;
  for (const file of files(dist).filter(path => /\.(?:html|md|xml|txt)$/.test(path) && !path.endsWith('robots.txt'))) {
    const content = readFileSync(file, 'utf8');
    if (file.endsWith('.html')) {
      documents++;
      const document = parse(content);
      function links(node) {
        for (const key of ['href', 'src', 'action']) {
          const value = attr(node, key);
          if (!value) continue;
          const url = new URL(value, 'https://memlia.fr');
          if (url.origin === 'https://memlia.fr' && retired.has(url.pathname.replace(/\/+$/, ''))) errors.push(`${file} : lien retiré ${value}`);
        }
        for (const child of node.childNodes ?? []) links(child);
      }
      links(document);
    }
    // Les anciennes URL ne doivent survivre ni au JSON-LD, ni aux sitemaps, ni aux exports IA.
    for (const match of content.matchAll(/https:\/\/memlia\.fr((?:\/markdown)?\/(?:automatisation|integrations)\/[a-z0-9-]+)(?:\.md)?(?=[#"'<)\s]|$)/g)) {
      if (retired.has(match[1].replace(/^\/markdown/, ''))) errors.push(`${file} : référence retirée ${match[0]}`);
    }
    if (/Guides par environnement|Une tâche prise en charge de bout en bout|Automatisation paie du pôle social/.test(content)) errors.push(`${file} : ancien positionnement commercial encore visible`);
  }
  return { pass: errors.length === 0, routes: MIGRATION_CATALOGUES.routes.length, documents, errors: [...new Set(errors)] };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = verifierExportMigration();
  console.log(JSON.stringify(result, null, 2));
  if (!result.pass) process.exitCode = 1;
}
