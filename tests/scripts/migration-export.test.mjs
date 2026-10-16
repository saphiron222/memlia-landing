import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { verifierExportMigration } from '../../scripts/verify-catalogue-migration.mjs';
import { MIGRATION_CATALOGUES, blocRedirections } from '../../src/data/migrations-catalogues.mjs';

function fixture() {
  const dist = mkdtempSync(join(tmpdir(), 'memlia-migration-export-'));
  const write = (path, value) => { const file = join(dist, path); mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, value); };
  const targets = new Map();
  for (const { to } of MIGRATION_CATALOGUES.routes) {
    const [path, hash] = to.split('#');
    targets.set(path, [...(targets.get(path) ?? []), ...(hash ? [hash] : [])]);
  }
  for (const [path, ids] of targets) {
    write(`${path}.html`, `<html><head><meta name="robots" content="index, follow"><link rel="canonical" href="https://memlia.fr${path}"></head><body><main>${[...new Set(ids)].map(id => `<h2 id="${id}">Tâche</h2>`).join('')}</main></body></html>`);
    write(`/markdown${path}.md`, '# Destination active\n');
  }
  write('_redirects', blocRedirections());
  write('llms.txt', '# Memlia\n');
  return { dist, write, mutate(path, change) { write(path, change(readFileSync(join(dist, path), 'utf8'))); } };
}

test('la garde d’export accepte toutes les destinations, fragments et versions Markdown actives', () => {
  const f = fixture();
  try { const result = verifierExportMigration(f.dist); assert.equal(result.pass, true, result.errors.join('\n')); assert.equal(result.routes, 24); }
  finally { rmSync(f.dist, { recursive: true, force: true }); }
});

const mutations = [
  ['page retirée encore présente', f => f.write('/automatisation/paie.html', '<main>Ancienne page</main>'), /Ancienne surface/],
  ['ancien export encore présent', f => f.write('/markdown/automatisation/paie.md', '# Ancienne page'), /Ancienne surface/],
  ['ancre absente', f => f.mutate('/agents-ia/comptabilite.html', s => s.replace('id="tache-saisie-ocr-2"', 'id="autre"')), /Ancre de destination/],
  ['canonical divergent', f => f.mutate('/agents-ia/comptabilite.html', s => s.replace('https:\/\/memlia.fr\/agents-ia\/comptabilite', 'https://example.org/autre')), /non canonique/],
  ['cible noindex', f => f.mutate('/agents-ia/comptabilite.html', s => s.replace('index, follow', 'noindex, follow')), /non indexable/],
  ['export de destination absent', f => rmSync(join(f.dist, '/markdown/agents-ia/paie-social.md')), /Export de destination absent/],
  ['lien interne retiré', f => f.mutate('/agents-ia/comptabilite.html', s => s.replace('</main>', '<a href="/automatisation/paie#regle">Paie</a></main>')), /lien retiré/],
  ['référence JSON-LD retirée', f => f.mutate('/agents-ia/comptabilite.html', s => s.replace('</head>', '<script type="application/ld+json">{"url":"https://memlia.fr/automatisation/paie"}</script></head>')), /référence retirée/],
  ['référence llms retirée', f => f.write('llms.txt', '[Paie](https://memlia.fr/automatisation/paie)'), /référence retirée/],
  ['redirections incomplètes', f => f.write('_redirects', ''), /Redirections absentes/],
];
for (const [name, mutate, expected] of mutations) test(`la garde refuse : ${name}`, () => {
  const f = fixture();
  try { mutate(f); const result = verifierExportMigration(f.dist); assert.equal(result.pass, false); assert.match(result.errors.join('\n'), expected); }
  finally { rmSync(f.dist, { recursive: true, force: true }); }
});
