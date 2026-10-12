import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { parse } from 'parse5';
const dir = dirname(fileURLToPath(import.meta.url));
const recette = JSON.parse(readFileSync(join(dir, 'recette.json'), 'utf8'));
mkdirSync(join(dir, 'preuves/sources'), { recursive: true });
function visible(n) {
  if (['script','style','head','noscript','template'].includes(n.tagName)) return '';
  if (n.nodeName === '#text') return n.value;
  return (n.childNodes ?? []).map(visible).join(' ');
}
const preuves = [];
for (const s of recette.sources) {
  const retrievedAt = new Date().toISOString();
  try {
    const r = await fetch(s.url, { headers: { 'User-Agent': 'MemliaBlogSourceVerifier/1.0' }, signal: AbortSignal.timeout(30000) });
    const html = await r.text();
    const text = visible(parse(html)).replace(/\s+/g, ' ').trim();
    writeFileSync(join(dir, `preuves/sources/${s.id}.html`), html);
    writeFileSync(join(dir, `preuves/sources/${s.id}.txt`), text);
    const exact = text.includes(s.excerpt);
    preuves.push({ id: s.id, requestedUrl: s.url, finalUrl: r.url, retrievedAt, httpStatus: r.status, retryAfter: r.headers.get('retry-after'), extraitPresent: exact, sha256Html: createHash('sha256').update(html).digest('hex'), sha256Texte: createHash('sha256').update(text).digest('hex'), copie: `preuves/sources/${s.id}.html`, texte: `preuves/sources/${s.id}.txt`, limite: 'Reçu de recherche directe ; ne remplace pas le reçu natif verifySource de la forge.' });
    if (r.status === 429) break;
  } catch (e) { preuves.push({ id: s.id, requestedUrl: s.url, retrievedAt, httpStatus: null, error: e.message }); }
}
writeFileSync(join(dir, 'preuves/sources-receipts.json'), JSON.stringify(preuves, null, 2) + '\n');
const query = recette.primaryQuery;
try {
  const url = 'https://suggestqueries.google.com/complete/search?client=firefox&hl=fr&q=' + encodeURIComponent(query);
  const r = await fetch(url, { signal: AbortSignal.timeout(20000) });
  const response = await r.text();
  writeFileSync(join(dir, 'preuves/autocompletion.json'), JSON.stringify({ query, url, retrievedAt: new Date().toISOString(), httpStatus: r.status, response: r.ok ? JSON.parse(response) : response }, null, 2) + '\n');
} catch (e) { writeFileSync(join(dir, 'preuves/autocompletion.json'), JSON.stringify({ query, error: e.message, etat: 'indisponible' }, null, 2)); }
console.log(JSON.stringify(preuves.map(p => ({ id: p.id, status: p.httpStatus, extrait: p.extraitPresent, error: p.error })), null, 2));
