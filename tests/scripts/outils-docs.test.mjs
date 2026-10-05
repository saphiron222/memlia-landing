import assert from 'node:assert/strict';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const root = resolve(import.meta.dirname, '../..');
const docs = 'docs/strategy/site-v3/outils-ia-vague-3';
function validate(articles) {
  const fixture = mkdtempSync(resolve(tmpdir(), 'outils-docs-'));
  try {
    cpSync(resolve(root, docs), resolve(fixture, docs), { recursive: true });
    mkdirSync(resolve(fixture, 'docs/strategy/site-v3/mesures'), { recursive: true });
    writeFileSync(resolve(fixture, 'docs/strategy/site-v3/mesures/registre-requetes.json'), JSON.stringify({ articles }));
    return spawnSync('python3', [resolve(fixture, docs, 'validate-docs.py')], { encoding: 'utf8' });
  } finally { rmSync(fixture, { recursive: true, force: true }); }
}
const tool = JSON.parse(readFileSync(resolve(root, docs, 'contrat-routes.json'), 'utf8')).tools[0];
test('oracle documentaire : requête déjà enregistrée par sa propre route autorisée', () => {
  const result = validate([{ requete: tool.q.toUpperCase().normalize('NFD'), url: `https://memlia.fr${tool.route}` }]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).documentary_check, 'PASS');
});
test('oracle documentaire : toute route concurrente reste refusée, même avec le propriétaire présent', () => {
  const result = validate([
    { requete: tool.q, url: `https://memlia.fr${tool.route}` },
    { requete: tool.q, url: 'https://memlia.fr/blog/autre-proprietaire' },
  ]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /AssertionError/);
});
