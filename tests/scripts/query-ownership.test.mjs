import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { auditQueries, collectQueries } from '../../scripts/verify-query-ownership.mjs';

const entry = (url, query, source = 'fixture') => ({ url, query, source });
const pair = [entry('/a', 'contrôle bulletin paie'), entry('/b', 'contrôle bulletins de paie')];

test('refuse un doublon fabriqué même avec une exception', () => {
  const entries = [entry('/a', 'CRM DSN'), entry('https://memlia.fr/b/', ' crm  dsn ')];
  assert.match(auditQueries(entries, [{ urls: ['/a', '/b'], queries: entries.map((e) => e.query), reason: 'Intentions différentes documentées.' }]).errors.join('\n'), /doublon/);
});
test('une URL canonique peut apparaître dans plusieurs sources, pas avec deux requêtes', () => {
  assert.equal(auditQueries([entry('/a', 'CRM DSN'), entry('https://memlia.fr/a/', 'crm dsn')]).pass, true);
  assert.match(auditQueries([entry('/a', 'CRM DSN'), entry('/a', 'dsn sage')]).errors.join('\n'), /divergence/);
});
test('refuse les requêtes proches sans justification, accepte une exception liée aux deux URL', () => {
  assert.equal(auditQueries(pair).pass, false);
  const exception = { urls: ['/a', '/b'], queries: pair.map((e) => e.query), reason: 'Le premier définit le contrôle, le second exécute une procédure distincte.' };
  assert.equal(auditQueries(pair, [exception]).pass, true);
  assert.equal(auditQueries(pair.map((e) => ({ ...e, query: `${e.query} gratuit` })), [exception]).pass, false);
  assert.equal(auditQueries(pair, [{ urls: ['/a', '/b'], reason: ' ' }]).pass, false);
});
test('les mots de liaison et accents ne masquent pas une proximité, les produits restent distincts', () => {
  assert.equal(auditQueries([entry('/a', 'clôture sage'), entry('/b', 'cloture Sage')]).pass, false);
  assert.equal(auditQueries([entry('/a', 'lettrage sage'), entry('/b', 'lettrage cegid')]).pass, true);
});
test('refuse une entrée vide et une URL externe', () => {
  assert.equal(auditQueries([entry('/a', '')]).pass, false);
  assert.equal(auditQueries([entry('https://example.com/a', 'crm dsn')]).pass, false);
});
test('croise registre, contrat, backlog et collections récursives, y compris candidats', () => {
  const root = mkdtempSync(join(tmpdir(), 'query-ownership-'));
  const put = (path, data) => { mkdirSync(join(root, path, '..'), { recursive: true }); writeFileSync(join(root, path), data); };
  try {
    put('config/page-intent-contract.json', JSON.stringify({ pages: { '/outil': { query: 'test cabinet' } } }));
    put('docs/strategy/site-v3/mesures/registre-requetes.json', JSON.stringify({ articles: [{ url: 'https://memlia.fr/outil', requete: 'test cabinet' }] }));
    put('docs/strategy/site-v3/backlog-v3.json', JSON.stringify([{ slug: 'avenir', requete: 'test cabinet' }]));
    put('src/content/blog/nested/article.md', '---\nprimaryQuery: test cabinet\nbrouillon: true\n---\nTexte');
    put('src/content/services/service.md', '---\nprimaryQuery: test cabinet\nstatus: pret-preview\n---\nTexte');
    const entries = collectQueries(root);
    assert.equal(entries.length, 5);
    assert.equal(auditQueries(entries).pass, false);
    const cli = spawnSync(process.execPath, [join(process.cwd(), 'scripts/verify-query-ownership.mjs'), '--root', root], { encoding: 'utf8' });
    assert.equal(cli.status, 1);
    assert.match(cli.stderr, /doublon/);
    put('src/content/services/service.md', '---\ntitle: Pas de requête\n---\nTexte');
    assert.throws(() => collectQueries(root), /requête primaire/);
    rmSync(join(root, 'src/content/services'), { recursive: true });
    assert.throws(() => collectQueries(root), /collection absente/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
test('le corpus courant et ses exceptions motivées passent', () => {
  const result = spawnSync(process.execPath, ['scripts/verify-query-ownership.mjs'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
});
