import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { parse } from 'parse5';

const html = readFileSync(new URL('../../docs/design/blog-article-proofs/index.html', import.meta.url), 'utf8');
const contract = JSON.parse(readFileSync(new URL('../../docs/design/blog-article-proofs/content-contract.json', import.meta.url)));
const expected = ['cac-inventaire-taches', 'cac-fiche-regle', 'cac-fec-registre-reception', 'cac-fec-constat'];
function find(node, id) {
  if (node.attrs?.some((attr) => attr.name === 'id' && attr.value === id)) return node;
  for (const child of node.childNodes ?? []) { const result = find(child, id); if (result) return result; }
}
function text(node) { return node.value ?? (node.childNodes ?? []).map(text).join(' '); }

test('les quatre écrans CAC réservés sont présents sans publication', () => {
  const dom = parse(html);
  for (const id of expected) {
    const entry = contract.find((entry) => entry.id === id);
    assert.ok(entry, id);
    assert.equal(entry.reservation, 'F4');
    const frame = find(dom, id);
    assert.ok(frame, id);
    assert.match(text(frame), /Jeu d’essai fictif/);
    assert.doesNotMatch(text(frame), /Memlia|conforme|opinion|gain|partenariat|automatisation cabinet audit/i);
  }
  const reception = text(find(dom, 'cac-fec-registre-reception'));
  assert.match(reception, /JSON fictif/);
  for (const status of ['CONSTAT_A_REVOIR', 'REFUS_PERIODE', 'REFUS_ECART']) assert.ok(reception.includes(status));
  const fiche = text(find(dom, 'cac-fiche-regle'));
  assert.match(fiche, /commentaire du senior/);
  assert.match(fiche, /commentaire corrigé/);
  assert.match(fiche, /À présenter/);
  const constat = text(find(dom, 'cac-fec-constat'));
  assert.match(constat, /E-001/); assert.match(constat, /E-002/);
  assert.match(constat, /À examiner/);
  assert.match(constat, /CONSTAT_A_REVOIR/);
});

for (const [label, mutate, message, recipe] of [
  ['paire non mandatée', (pair) => { pair.forEach((entry) => { entry.article = 'autre-article'; }); }, /Paire réservée inconnue/],
  ['identifiant arbitraire', (pair) => { pair[0].id = 'cac-autre'; }, /Paire réservée inconnue/],
  ['réservation arbitraire', (pair) => { pair[0].reservation = 'autre'; }, /Réservation inconnue/],
  ['absence de réservation', (pair) => { pair.forEach((entry) => { delete entry.reservation; }); }, /Recette absente/],
  ['recette existante divergente', () => {}, /Recette et contrat divergent/, { inlineProofs: [{ id: 'autre' }] }],
]) {
  test(`le renderer refuse ${label} avant rendu`, (t) => {
    const root = mkdtempSync(join(tmpdir(), 'cac-assets-'));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    const pair = structuredClone(contract.filter((entry) => entry.id.startsWith('cac-')).slice(0, 2));
    mutate(pair);
    const source = join(root, 'docs/design/blog-article-proofs');
    mkdirSync(source, { recursive: true });
    writeFileSync(join(source, 'content-contract.json'), JSON.stringify(pair));
    if (recipe) {
      const path = join(root, 'editorial/recettes', pair[0].article);
      mkdirSync(path, { recursive: true });
      writeFileSync(join(path, 'recette.json'), JSON.stringify(recipe));
    }
    const result = spawnSync(process.execPath, [new URL('../../scripts/render-blog-article-proofs.mjs', import.meta.url).pathname, '--preview'], {
      cwd: root, encoding: 'utf8', env: { ...process.env, CF_PAGES: '0' },
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, message);
  });
}
