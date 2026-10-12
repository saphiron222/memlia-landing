import { parse } from 'parse5';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { renderedPages } from './verify-public-source-labels.mjs';

// Sealed article bodies and evidence remain byte-for-byte unchanged. This final rendering
// step removes consultation dates and duplicate bibliographies from public text only.
// It never edits sealed evidence or JSON-LD. Historical references are linked in
// their existing paragraphs below, including the original dated calendar URL.
const CONSULTATION = /,?\s+consult[ée](?:e)?s?\s+le\s+(?:\d{4}-\d{2}-\d{2}|\d{1,2}\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{4})/giu;
const INTERNAL = new Set(['head', 'script', 'style', 'template']);
// These historical paragraphs were reviewed with citations in a separate appendix.
// The presentation bridge links the existing wording; it does not retell the incidents.
const INLINE_REFERENCES = {
  '/automatisation/circularisation-cac': [
    { from: 'e-Circu décrit', to: '<a href="https://www.gestonline.com/blog/circularisation-audit">e-Circu</a> décrit' },
    { from: 'Circit propose', to: '<a href="https://www.circit.io/fr/platform/confirm">Circit</a> propose' },
    { from: 'La NEP 505,', to: 'La <a href="https://h2a-france.org/normes/demandes-de-confirmation-des-tiers/">NEP 505</a>,' },
    { from: 'La NEP 315 révisée définit', to: 'La <a href="https://h2a-france.org/normes/connaissance-de-lentite-et-de-son-environnement-et-evaluation-du-risque-danomalies-significatives-dans-les-comptes/">NEP 315 révisée</a> définit' },
    { from: 'La NEP 530,', to: 'La <a href="https://h2a-france.org/normes/selection-des-elements-a-controler/">NEP 530</a>,' },
    { from: 'NEP 911 § 24', to: '<a href="https://h2a-france.org/normes/mission-du-commissaire-aux-comptes-nomme-pour-trois-exercices-prevue-a-larticle-l-823-12-1-du-code-de-commerce/">NEP 911 § 24</a>' },
    { from: '912 § 23', to: '<a href="https://h2a-france.org/normes/mission-du-commissaire-aux-comptes-nomme-pour-six-exercices-dans-des-petites-entreprises/">912 § 23</a>' },
  ],
  '/blog/automatiser-un-cabinet-comptable-la-carte-des-taches': [
    { from: 'href="https://www.impots.gouv.fr/professionnel/calendrier-fiscal"', to: 'href="https://www.impots.gouv.fr/professionnel/calendrier-fiscal/2026-09"' },
  ],
  '/blog/pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils': [
    { from: 'plateforme d’extension d’une suite bureautique', to: '<a href="https://learn.microsoft.com/fr-fr/office/dev/add-ins/overview/office-add-ins">plateforme d’extension d’une suite bureautique</a>' },
    { from: 'l’analyse de processus', to: 'l’<a href="https://learn.microsoft.com/fr-fr/power-automate/process-mining-overview">analyse de processus</a>' },
    { from: 'un déploiement test à petite échelle', to: 'un <a href="https://support.google.com/chrome/a/answer/9025903?hl=fr">déploiement test à petite échelle</a>' },
  ],
  '/blog/tests-verts-et-regle-des-trois-passes': [
    { from: 'sources Python citées en annexe', to: 'documentations de <a href="https://docs.python.org/fr/3/library/doctest.html">doctest</a>, <a href="https://docs.python.org/fr/3/library/unittest.html">unittest</a> et <a href="https://docs.pytest.org/en/stable/how-to/assert.html">pytest</a>' },
  ],
};

export function renderPublicSourceText(html) {
  const edits = [];
  const removedIds = new Set();
  const document = parse(html, { sourceCodeLocationInfo: true });
  const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
  const text = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
  function links(node, excluded) {
    if (node === excluded) return [];
    return [...(node.tagName === 'a' ? [attr(node, 'href')] : []), ...(node.childNodes ?? []).flatMap(child => links(child, excluded))];
  }
  function bibliography(node) {
    if (INTERNAL.has(node.tagName)) return;
    const children = node.childNodes ?? [];
    for (let index = 0; index < children.length; index += 1) {
      const heading = children[index];
      if (!/^h[2-6]$/.test(heading.tagName ?? '') || !/^(?:sources?|références)$/iu.test(text(heading).trim())) continue;
      let next = index + 1;
      while (children[next]?.nodeName === '#text' && !children[next].value.trim()) next += 1;
      const list = children[next];
      if (!['ul', 'ol'].includes(list?.tagName)) continue;
      // Only article-body duplicates can be removed; each citation must already be inline.
      let articleBody = node;
      while (articleBody && !attr(articleBody, 'class')?.split(/\s+/).includes('article-corps')) articleBody = articleBody.parentNode;
      if (!articleBody) continue;
      const inline = new Set(links(articleBody, list));
      const missing = links(list).filter(href => !inline.has(href));
      if (missing.length) throw new Error(`Citations à intégrer dans les paragraphes avant publication : ${missing.join(', ')}`);
      edits.push({ startOffset: heading.sourceCodeLocation.startOffset, endOffset: list.sourceCodeLocation.endOffset, replacement: '' });
      if (attr(heading, 'id')) removedIds.add(attr(heading, 'id'));
    }
    for (const child of children) bibliography(child);
  }
  bibliography(document);
  function trimToc(node, inToc = false) {
    if (INTERNAL.has(node.tagName)) return;
    inToc ||= node.tagName === 'nav' && node.attrs?.some(item => item.name === 'data-blog-toc');
    if (inToc && node.tagName === 'li' && links(node).some(href => href?.startsWith('#') && removedIds.has(href.slice(1)))) {
      edits.push({ startOffset: node.sourceCodeLocation.startOffset, endOffset: node.sourceCodeLocation.endOffset, replacement: '' });
      return;
    }
    for (const child of node.childNodes ?? []) trimToc(child, inToc);
  }
  trimToc(document);
  function visit(node) {
    if (INTERNAL.has(node.tagName)) return;
    if (node.nodeName === '#text' && node.sourceCodeLocation) {
      const { startOffset, endOffset } = node.sourceCodeLocation;
      const original = html.slice(startOffset, endOffset);
      const replacement = original.replace(CONSULTATION, '');
      if (original !== replacement && !edits.some(edit => startOffset >= edit.startOffset && endOffset <= edit.endOffset)) edits.push({ startOffset, endOffset, replacement });
    }
    for (const child of node.childNodes ?? []) visit(child);
  }
  visit(document);
  let result = html;
  // Source offsets allow surgical edits without serializing/reformatting the document.
  for (const { startOffset, endOffset, replacement } of edits.sort((a, b) => b.startOffset - a.startOffset)) {
    result = result.slice(0, startOffset) + replacement + result.slice(endOffset);
  }
  function canonicalPath(node) {
    if (node.tagName === 'link' && attr(node, 'rel') === 'canonical') return new URL(attr(node, 'href')).pathname.replace(/\/$/, '');
    for (const child of node.childNodes ?? []) { const path = canonicalPath(child); if (path) return path; }
  }
  const path = canonicalPath(document);
  for (const { from, to } of INLINE_REFERENCES[path] ?? []) {
    const paragraphs = [];
    function paragraphNodes(node) {
      if (INTERNAL.has(node.tagName)) return;
      if (node.tagName === 'p' && node.sourceCodeLocation) paragraphs.push(node.sourceCodeLocation);
      for (const child of node.childNodes ?? []) paragraphNodes(child);
    }
    paragraphNodes(parse(result, { sourceCodeLocationInfo: true }));
    const fragment = location => result.slice(location.startOffset, location.endOffset);
    if (paragraphs.some(location => fragment(location).includes(to))) continue;
    const location = paragraphs.find(location => fragment(location).includes(from));
    if (!location) throw new Error(`Paragraphe historique à réconcilier pour sa citation : ${path} — ${from}`);
    result = result.slice(0, location.startOffset) + fragment(location).replace(from, to) + result.slice(location.endOffset);
  }
  if (path === '/automatisation/circularisation-cac') {
    const references = [];
    function findReferences(node) {
      if (INTERNAL.has(node.tagName)) return;
      if (node.tagName === 'p' && /^Références\s*:/iu.test(text(node).trim())) references.push(node);
      for (const child of node.childNodes ?? []) findReferences(child);
    }
    const rendered = parse(result, { sourceCodeLocationInfo: true });
    findReferences(rendered);
    for (const paragraph of references) {
      const inline = new Set(links(rendered, paragraph));
      if (links(paragraph).some(href => !inline.has(href))) throw new Error('Circularisation : une citation reste à fondre dans le texte.');
      const { startOffset, endOffset } = paragraph.sourceCodeLocation;
      result = result.slice(0, startOffset) + result.slice(endOffset);
    }
  }
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  let changed = 0;
  for (const { file } of renderedPages()) {
    const original = readFileSync(file, 'utf8');
    const rendered = renderPublicSourceText(original);
    if (rendered !== original) {
      writeFileSync(file, rendered);
      changed += 1;
    }
  }
  console.log(`Sources publiques : texte final rendu sur ${changed} pages ; corpus interne conservé.`);
}
