import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { readDilaCopy } from '../../../scripts/lib/dila-source-copy.mjs';
const dir = dirname(fileURLToPath(import.meta.url));
const root = process.cwd();
const recette = JSON.parse(readFileSync(join(dir, 'recette.json'), 'utf8'));
const report = [];
for (const s of recette.sources.slice(0, 2)) {
  const p = `preuves/${s.id}.dila.json`;
  const r = readDilaCopy({ root: dir, path: p, url: s.url, excerpt: s.excerpt });
  report.push({ sourceId: s.id, mode: 'dila-copy', httpStatus: null, ...r });
}
const sourceFile = 'docs/strategy/site-v3/ec/glossaire-reglementaire/sources/legi-mission.md';
const copie = readFileSync(join(root, sourceFile), 'utf8');
const register = JSON.parse(readFileSync(join(root, 'docs/qa/hub-ressources/metier-fix-c-register.json'), 'utf8'));
function trouver(n) {
  if (!n || typeof n !== 'object') return null;
  if (n.id === 'source-ec-legi-mission' && n.snapshotPath) return n;
  for (const value of Object.values(n)) { const hit = trouver(value); if (hit) return hit; }
  return null;
}
const s = trouver(register);
assert.ok(s);
assert.equal(createHash('sha256').update(copie).digest('hex'), s.contentSha256);
assert.ok(copie.includes('contrat écrit définissant leur mission et précisant les droits et obligations de chacune des parties'));
writeFileSync(join(dir, 'preuves/sources/contrat-mission-lecture.md'), copie);
writeFileSync(join(dir, 'preuves/sources/contrat-mission-provenance-heritee.json'), JSON.stringify(s, null, 2) + '\n');
report.push({ id: 'contrat-mission', mode: 'recherche complémentaire hors claims publics, capture officielle du 11/10 conservée', fichier: 'preuves/sources/contrat-mission-lecture.md', sourceFile, checkedAt: s.checkedAt, httpStatus: null, excerptPresent: true, contentSha256: s.contentSha256, limite: 'Capture Markdown officielle conservée hors claims publics ; aucune dépendance de portage et aucun HTTP 200 inventé.' });
writeFileSync(join(dir, 'preuves/qualification-sources.json'), JSON.stringify(report, null, 2) + '\n');
console.log('2 copies DILA validées, collecte du 06/10 conservée ; copie article151 du 11/10 intègre et extrait exact, pas de HTTP inventé.');
