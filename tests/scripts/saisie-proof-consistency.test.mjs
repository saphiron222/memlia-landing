import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '../..');
const slug = 'automatiser-la-saisie-comptable-ce-qui-reste-a-verifier';
const body = readFileSync(resolve(root, `editorial/recettes/${slug}/corps.md`), 'utf8');
const html = readFileSync(resolve(root, 'docs/design/blog-article-proofs/index.html'), 'utf8');
const contract = JSON.parse(readFileSync(resolve(root, 'docs/design/blog-article-proofs/content-contract.json'), 'utf8'));
const proof = (id) => contract.find((entry) => entry.id === id);
const frame = (id) => html.match(new RegExp(`<section class="frame" id="${id}"[\\s\\S]*?(?=<section class="frame"|</main>)`))?.[0];

test('TEST-050 distingue attentes par type, contrôles et appréciation humaine', () => {
  assert.match(body, /deux tickets coupés.*deux notes de frais sans justificatif lisible/s);
  assert.ok(/L’avoir est orienté vers une décision humaine/.test(body), 'avoir à qualifier humainement');
  assert.ok(/montant inhabituel.*appréciation humaine/s.test(body), 'montant inhabituel non arithmétique');
  assert.match(body, /aucun décompte mesuré/i);
});

test('les deux figures ne donnent ni compteurs inexpliqués ni écart arithmétique inventé', () => {
  for (const id of ['saisie-six-controles', 'saisie-file-anomalies']) {
    assert.ok(frame(id), `Figure absente : ${id}`);
    assert.ok(proof(id), `Contrat absent : ${id}`);
    assert.doesNotMatch(frame(id), /TEST-023|HT \+ TVA ≠ TTC lu|<b>[1-9]<\/b><\/span>/);
    assert.doesNotMatch(proof(id).centralText, /TEST-023|HT \+ TVA ≠ TTC lu/);
  }
  assert.match(frame('saisie-file-anomalies'), /Ticket coupé/);
  assert.match(proof('saisie-file-anomalies').centralText, /Ticket coupé/);
});
