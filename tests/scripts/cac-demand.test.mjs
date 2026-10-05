import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
const register = JSON.parse(readFileSync(join(root, 'docs/strategy/site-v3/mesures/registre-requetes.json'), 'utf8'));
const reference = register.rechercheCac;
const measure = JSON.parse(readFileSync(join(root, reference.mesuresParRequete), 'utf8'));

function validateRows(rows) {
  assert.ok(rows.length >= 150, 'au moins 150 requêtes réellement mesurées');
  assert.equal(new Set(rows.map((r) => r.requete.toLocaleLowerCase('fr').trim())).size, rows.length);
  for (const row of rows) {
    assert.ok(row.requete.trim());
    assert.ok(Number.isFinite(Date.parse(row.mesureLe)), 'mesure datée');
    assert.equal(row.instrument, 'scripts/lib/seo-instruments.mjs#autocompleterGoogle');
    assert.deepEqual(row.marche, { hl: 'fr', gl: 'fr' });
    assert.equal(row.ok, true, 'une panne ne peut pas être comptée comme zéro');
    assert.equal(row.erreur, null);
    assert.ok(Array.isArray(row.suggestions));
    assert.ok(row.suggestions.every((s) => typeof s === 'string' && s.trim()));
    assert.equal(row.nombreSuggestions, row.suggestions.length);
    assert.equal(row.volumeMensuel, null, 'aucun volume mensuel extrapolé');
    assert.ok(row.pageCandidate.startsWith('https://memlia.fr/') || row.pageCandidate.startsWith('hors-cible :'));
    assert.ok(row.decision.trim());
    assert.equal(row.statut, 'candidate-non-publiee');
  }
}

test('CAC : chaque requête a une réponse mesurée, sa date et sa page ou disposition', () => validateRows(measure.requetes));

test('CAC : les compteurs du registre sont ceux des réponses conservées', () => {
  for (const source of [reference, measure]) {
    assert.equal(source.nombreRequetes, measure.requetes.length);
    assert.equal(source.nombreSucces, measure.requetes.filter((r) => r.ok).length);
    assert.equal(source.nombreAvecSuggestions, measure.requetes.filter((r) => r.ok && r.suggestions.length).length);
    assert.equal(source.nombreSansSuggestions, measure.requetes.filter((r) => r.ok && !r.suggestions.length).length);
    assert.equal(source.volumeMensuel, null);
  }
  assert.equal(reference.nombreIntentionsSerp, 30);
  for (const path of [reference.pagesCandidates, reference.lectureSerp, reference.synthese]) assert.ok(existsSync(join(root, path)));
  const serp = readFileSync(join(root, reference.lectureSerp), 'utf8');
  assert.equal(serp.split('\n').filter((line) => /^\| \d+ \|/.test(line)).length, reference.nombreIntentionsSerp);
});

test('CAC : un doublon, une panne ou un volume inventé est refusé', () => {
  const rows = measure.requetes;
  assert.throws(() => validateRows([...rows, rows[0]]));
  assert.throws(() => validateRows([{ ...rows[0], ok: false, erreur: 'HTTP 503' }, ...rows.slice(1)]));
  assert.throws(() => validateRows([{ ...rows[0], volumeMensuel: 100 }, ...rows.slice(1)]));
});

test('CAC : les outils FEC et pseudonymisation existants ne sont pas dupliqués', () => {
  const fec = measure.requetes.find((r) => r.requete === 'analyse fec gratuit');
  const anonymisation = measure.requetes.find((r) => r.requete === 'anonymisation audit ia');
  assert.equal(fec.pageCandidate, 'https://memlia.fr/outils-comptables-gratuits/verificateur-fec-local');
  assert.equal(anonymisation.pageCandidate, 'https://memlia.fr/outils-comptables-gratuits/preparer-pseudonymiser-fichier-csv-fec');
  assert.ok(register.articles.some((a) => a.url === fec.pageCandidate));
  assert.ok(register.articles.some((a) => a.url === anonymisation.pageCandidate));
});
