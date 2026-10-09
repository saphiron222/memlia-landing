import assert from 'node:assert/strict';
import { parse } from 'parse5';

// Ne neutraliser que les liens ajoutés par la collection scellée au footer.
// Les offsets préservent tous les autres octets (sans resérialiser le DOM).
export function historicalAccueil(html, generatedGuides) {
  const document = parse(html, { sourceCodeLocationInfo: true });
  const links = [];
  const visit = node => {
    if (node.tagName === 'a') links.push(node);
    for (const child of node.childNodes ?? []) visit(child);
  };
  visit(document);
  const removals = [];
  for (const guide of generatedGuides) {
    const matches = links.filter(node => node.attrs.some(a => a.name === 'href' && a.value === `/integrations/${guide.slug}`));
    assert.equal(matches.length, 1, `${guide.slug}: un lien accueil`);
    const link = matches[0];
    assert.ok(link.attrs.some(a => a.name === 'class' && a.value === 'pied-lien'), guide.slug);
    assert.equal(link.childNodes.length, 1, guide.slug);
    assert.equal(link.childNodes[0].value, `${guide.task.charAt(0).toUpperCase()}${guide.task.slice(1)} · ${guide.vendor}`, guide.slug);
    const item = link.parentNode;
    assert.equal(item.tagName, 'li', guide.slug);
    assert.deepEqual(item.childNodes, [link], guide.slug);
    let ancestor = item;
    while (ancestor && ancestor.tagName !== 'footer') ancestor = ancestor.parentNode;
    assert.ok(ancestor, `${guide.slug}: lien dans le footer`);
    // Comparer la source entière : parse5 déduplique les attributs HTML.
    // Le scope est celui du Footer du témoin historique, pas un joker Astro.
    const label = link.childNodes[0].value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    const fragment = html.slice(item.sourceCodeLocation.startOffset, item.sourceCodeLocation.endOffset);
    const expected = scope => `<li${scope}><a class="pied-lien" href="/integrations/${guide.slug}"${scope}>${label}</a></li>`;
    assert.ok([expected(''), expected(' data-astro-cid-jo6i4kqk')].includes(fragment), `${guide.slug}: fragment footer intégral`);
    removals.push(item.sourceCodeLocation);
  }
  for (const { startOffset, endOffset } of removals.sort((a, b) => b.startOffset - a.startOffset)) {
    html = html.slice(0, startOffset) + html.slice(endOffset);
  }
  return html;
}
