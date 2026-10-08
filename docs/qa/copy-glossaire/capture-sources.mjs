import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { parse } from 'parse5';
const directory = new URL('./sources/', import.meta.url);
mkdirSync(directory, { recursive: true });
const rows = [
  ['banque-france-sepa', 'https://www.banque-france.fr/fr/foire-aux-questions-le-prelevement-sepa'],
  ['microsoft-rag', 'https://learn.microsoft.com/fr-fr/azure/search/retrieval-augmented-generation-overview'],
  ['cnil-rag', 'https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative'],
  ['production-avant', 'https://memlia.fr/glossaire'],
];
function text(node) {
  if (['script', 'style', 'noscript'].includes(node.tagName)) return '';
  if (node.nodeName === '#text') return node.value;
  return (node.childNodes ?? []).map(text).join(' ');
}
const captures = [];
for (const [id, url] of rows) {
  // Copies obtenues par curl --fail --location, après timeout du fetch Node.
  const html = readFileSync(new URL(`${id}.html`, directory), 'utf8');
  const checkedAt = statSync(new URL(`${id}.html`, directory)).mtime.toISOString();
  const content = text(parse(html)).replace(/\s+/g, ' ').trim();

  writeFileSync(new URL(`${id}.txt`, directory), content + '\n');
  captures.push({ id, url, checkedAt, method: 'curl --fail --location --max-time 30', bytes: Buffer.byteLength(html) });
}
writeFileSync(new URL('./sources/captures.json', import.meta.url), JSON.stringify(captures, null, 2) + '\n');
console.log(JSON.stringify(captures, null, 2));
