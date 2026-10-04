import { parse } from 'parse5';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { renderedPages } from './verify-public-source-labels.mjs';

// Sealed article bodies and evidence remain byte-for-byte unchanged. This final rendering
// step removes consultation dates from public text only, never from JSON-LD or attributes.
const CONSULTATION = /,?\s+consult[ée](?:e)?s?\s+le\s+(?:\d{4}-\d{2}-\d{2}|\d{1,2}\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{4})/giu;
const INTERNAL = new Set(['head', 'script', 'style', 'template']);

export function renderPublicSourceText(html) {
  const edits = [];
  function visit(node) {
    if (INTERNAL.has(node.tagName)) return;
    if (node.nodeName === '#text' && node.sourceCodeLocation) {
      const { startOffset, endOffset } = node.sourceCodeLocation;
      const original = html.slice(startOffset, endOffset);
      const replacement = original.replace(CONSULTATION, '');
      if (original !== replacement) edits.push({ startOffset, endOffset, replacement });
    }
    for (const child of node.childNodes ?? []) visit(child);
  }
  visit(parse(html, { sourceCodeLocationInfo: true }));
  let result = html;
  // Source offsets allow surgical edits without serializing/reformatting the document.
  for (const { startOffset, endOffset, replacement } of edits.sort((a, b) => b.startOffset - a.startOffset)) {
    result = result.slice(0, startOffset) + replacement + result.slice(endOffset);
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
