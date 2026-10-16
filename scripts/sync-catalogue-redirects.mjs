import { readFileSync, writeFileSync } from 'node:fs';
import { blocRedirections } from '../src/data/migrations-catalogues.mjs';
const file = 'public/_redirects';
const marker = '# Migration catalogues — décision Kevin du 15 octobre 2026';
const before = readFileSync(file, 'utf8');
const expected = before.split(marker)[0].trimEnd() + '\n\n' + blocRedirections();
if (process.argv.includes('--check')) {
  if (before !== expected) throw new Error('Redirections périmées : node scripts/sync-catalogue-redirects.mjs');
  console.log('24 migrations exactes, variantes / et .html : redirections synchronisées.');
} else writeFileSync(file, expected);
