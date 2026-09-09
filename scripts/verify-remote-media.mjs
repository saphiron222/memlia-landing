/** Vérifie chaque média réellement servi, sans accepter un hash simplement recopié du manifeste. */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const base = process.env.QA_URL;
if (!base?.startsWith('https://')) throw new Error('QA_URL HTTPS obligatoire');
const manifest = JSON.parse(readFileSync('docs/qa/m4-r4/media-manifest.json', 'utf8'));
const entries = manifest.entries.filter(entry => entry.target.startsWith('public/'));
const excluded = manifest.entries.length - entries.length;
const report = [];
for (const entry of entries) {
  const url = new URL(entry.target.slice('public'.length), base).href;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} : ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  if (sha256 !== entry.sha256 || bytes.length !== entry.bytes) throw new Error(`Média distant divergent : ${url}`);
  if (!entry.derivative) {
    const sourceHash = createHash('sha256').update(readFileSync(entry.source)).digest('hex');
    if (sourceHash !== sha256) throw new Error(`Source approuvée divergente : ${entry.target}`);
  }
  report.push({ url, bytes: bytes.length, sha256, sourceVerified: !entry.derivative });
}
if (entries.length !== 25 || excluded !== 1) throw new Error('Périmètre incomplet');
const result = { base, checked: report.length, excluded, exclusion: 'script Markdown documentaire, non public', report };
writeFileSync('docs/qa/m4-r4/remote-media.json', JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
