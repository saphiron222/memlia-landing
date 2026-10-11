import { parseFragment } from 'parse5';

const texte = (node) => node.nodeName === '#text'
  ? node.value : (node.childNodes ?? []).map(texte).join('');
const echapper = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;').replaceAll('>', '&gt;');

/** Add native keyboard scroll regions at render time, leaving sealed content untouched. */
export function rendreTableauxAccessibles(html) {
  const fragment = parseFragment(html, { sourceCodeLocationInfo: true });
  const insertions = [];
  let titre = 'données';
  let numero = 0;
  function visiter(node) {
    if (/^h[1-6]$/.test(node.tagName ?? '')) titre = texte(node).trim();
    if (node.tagName === 'table' && node.sourceCodeLocation) {
      const caption = node.childNodes.find((child) => child.tagName === 'caption');
      const label = `Tableau ${++numero} : ${texte(caption ?? { childNodes: [] }).trim() || titre}`;
      const { startOffset, endOffset } = node.sourceCodeLocation;
      insertions.push([startOffset, `<div data-table-scroll role="region" tabindex="0" aria-label="${echapper(label)}">`]);
      insertions.push([endOffset, '</div>']);
    }
    for (const child of node.childNodes ?? []) visiter(child);
  }
  visiter(fragment);
  // Insert backwards using source offsets, never serialize or alter the table/other markup.
  for (const [offset, markup] of insertions.sort((a, b) => b[0] - a[0])) {
    html = html.slice(0, offset) + markup + html.slice(offset);
  }
  return html;
}
