import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '../..');
const slug = 'automatiser-la-saisie-comptable-ce-qui-reste-a-verifier';
const body = readFileSync(resolve(root, `editorial/recettes/${slug}/corps.md`), 'utf8');
const html = readFileSync(resolve(root, 'docs/design/blog-article-proofs/index.html'), 'utf8');
const contract = JSON.parse(readFileSync(resolve(root, 'docs/design/blog-article-proofs/content-contract.json'), 'utf8'));
const recipe = JSON.parse(readFileSync(resolve(root, `editorial/recettes/${slug}/recette.json`), 'utf8'));
const article = readFileSync(resolve(root, `src/content/blog/${slug}.md`), 'utf8');
const proof = (id) => contract.find((entry) => entry.id === id);
const frame = (id) => html.match(new RegExp(`<section class="frame" id="${id}"[\\s\\S]*?(?=<section class="frame"|</main>)`))?.[0];

test('la période exige une qualification humaine, jamais la seule date de facture', () => {
  for (const text of [body, article]) {
    assert.doesNotMatch(text, /La date de la pièce tombe dans la période traitée|restent affectées à leur période|fausse deux périodes|ni reçue ni absente/);
    assert.match(text, /dates d’émission et de réception, l’opération, les règles applicables et une éventuelle clôture/);
    assert.match(text, /reste reçue.*à qualifier/s);
  }
  for (const text of [frame('saisie-six-controles'), proof('saisie-six-controles').centralText]) {
    assert.match(text, /Période à qualifier/);
    assert.match(text, /Décision humaine documentée/);
    assert.doesNotMatch(text, /reste affectée à sa période/);
  }
});

test('les cas dates discordantes et période close attendent une décision sans écriture', () => {
  for (const id of ['PERIODE-DATES', 'PERIODE-CLOSE']) {
    const row = body.split('\n').find((line) => line.startsWith(`| ${id} |`));
    assert.ok(row, `Cas fictif absent : ${id}`);
    assert.match(row, /reçue/);
    assert.match(row, /aucune écriture/i);
    assert.match(row, /décision humaine documentée/i);
  }
  assert.match(body, /opération le 30 avril.*émission le 5 mai.*réception le 6 mai/);
  assert.match(body, /période déjà close/);
});

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

test('la republication date la mise à jour réelle et décrit les preuves actuelles', () => {
  assert.equal(recipe.updatedAt, '2026-10-03');
  assert.match(article, /^dateMiseAJour: 2026-10-03$/m);
  assert.match(proof('saisie-six-controles').alt, /période à qualifier/i);
  assert.match(proof('saisie-file-anomalies').alt, /ticket coupé/i);
  for (const id of ['saisie-six-controles', 'saisie-file-anomalies']) {
    assert.doesNotMatch(proof(id).alt, /écart de montants/i);
  }
});
