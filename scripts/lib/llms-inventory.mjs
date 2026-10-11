import { parse } from 'parse5';

const MARKER = '\n## Inventaire des pages publiées\n';
const origin = 'https://memlia.fr';
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
const text = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
const label = value => value.replace(/[\[\]\r\n]/g, ' ').trim();

/** Lit la sortie des inventaires D3, jamais un second référentiel ni le crawl historique. */
export function renderLlmsInventory(template, pages) {
  let source = template.split(MARKER)[0].trimEnd();
  const routes = new Map(pages.map(page => [new URL(page.url).pathname, page]));
  for (const [, href] of source.matchAll(/\]\((https:\/\/memlia\.fr[^)]*)\)/g)) {
    const url = new URL(href);
    if (!routes.has(url.pathname)) throw new Error(`Lien llms absent du sitemap publié : ${href}`);
  }
  const records = pages.map(page => {
    const document = parse(page.html);
    const nodes = [];
    let title = '';
    let description = '';
    function visit(node) {
      if (node.tagName === 'h1') title = text(node);
      if (node.tagName === 'meta' && attr(node, 'name') === 'description') description = attr(node, 'content');
      if (node.tagName === 'script' && attr(node, 'type') === 'application/ld+json') {
        const data = JSON.parse(text(node));
        nodes.push(...(Array.isArray(data) ? data : data['@graph'] ?? [data]));
      }
      for (const child of node.childNodes ?? []) visit(child);
    }
    visit(document);
    return { ...page, path: new URL(page.url).pathname, title, description, nodes };
  });
  const glossary = records.find(page => page.path === '/glossaire');
  const terms = glossary?.nodes.find(node => node['@type'] === 'DefinedTermSet')?.hasDefinedTerm;
  if (!Array.isArray(terms) || !terms.length) throw new Error('DefinedTermSet publié absent ou vide.');
  source = source.replace(/(\[Glossaire\]\(https:\/\/memlia\.fr\/glossaire\) : )(?:\d+ )?définitions/, `$1${terms.length} définitions`);
  const guides = records.filter(page => page.path.startsWith('/integrations/'));
  const articles = records.filter(page => page.nodes.some(node => node['@type'] === 'BlogPosting'));
  const tools = records.filter(page => page.path.startsWith('/outils-comptables-gratuits/'));
  const services = records.filter(page => page.path.startsWith('/automatisation/'));
  const hubs = ['/integrations', '/outils-comptables-gratuits', '/blog'];
  const listed = [...hubs.map(path => {
    const page = records.find(page => page.path === path);
    if (!page) throw new Error(`Hub publié absent : ${path}`);
    return page;
  }), ...services];
  for (const page of listed) if (!page.title || !page.description) throw new Error(`Métadonnées publiées absentes : ${page.url}`);
  return `${source}${MARKER}\n${guides.length} guides, ${articles.length} articles, ${tools.length} outils et ${services.length} services publiés.\n\n${listed.map(page => `- [${label(page.title)}](${page.url}) : ${label(page.description)}`).join('\n')}\n`;
}
