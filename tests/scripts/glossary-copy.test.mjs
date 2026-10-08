import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const source = readFileSync('src/data/glossary.ts', 'utf8');
const before = execFileSync('git', ['show', 'origin/main:src/data/glossary.ts'], { encoding: 'utf8' });
const entry = (text, id) => text.split(`...common, id: '${id}'`)[1].split('...common, id:')[0];
const anchors = text => [...text.matchAll(/anchor: '([^']+)'/g)].map(match => match[1]).sort();

test('CONT-10 : proposition, quatre vérifications et validation avant effet bancaire', () => {
  const block = entry(source, 'prelevement-sepa-et-rejet');
  for (const phrase of ['proposition de représentation', 'mandat, le motif, le montant et la date', 'avant toute programmation ou transmission bancaire', 'reste au cabinet']) assert.ok(block.includes(phrase), phrase);
  for (const phrase of ['dix jours plus tard', 'la plupart des rejets', 'programmer une nouvelle présentation selon une règle fixée est automatisable']) assert.ok(!block.includes(phrase), phrase);
});
test('CONT-11 : périodicité distincte du prélèvement et hors forfait distinct du forfait', () => {
  const block = entry(source, 'honoraires-mensualises-et-actes-hors-forfait');
  for (const phrase of ['facturés ou répartis mensuellement', 'mode de règlement possible', 'mandat signé', 'prestation non comprise dans le forfait']) assert.ok(block.includes(phrase), phrase);
  assert.ok(!block.includes('sont prélevés chaque mois'));
});
test('CONT-12 : contexte augmenté, entraînement conservé, exactitude à contrôler', () => {
  const block = entry(source, 'generation-augmentee-par-recuperation');
  for (const phrase of ['ajoute au contexte', 'conserve ses connaissances d’entraînement', 'Le RAG ne garantit pas l’exactitude', 'reste une lecture humaine']) assert.ok(block.includes(phrase), phrase);
  assert.ok(!block.includes('plutôt qu’à partir de ce qu’il a mémorisé'));
});
test('CONT-13 : renvois éditoriaux dédiés et ancres historiques identiques', () => {
  assert.ok(!source.includes('/#'));
  assert.deepEqual(anchors(source), anchors(before));
  const html = readFileSync('dist/glossaire.html', 'utf8');
  for (const anchor of anchors(before)) assert.ok(html.includes(`id="${anchor}"`), anchor);
  for (const path of ['/garanties', '/methode', '/integrations', '/automatisation-cabinet-comptable']) assert.ok(source.includes(`'${path}'`), path);
});
test('Seules les trois définitions ciblées changent', () => {
  const definitions = text => new Map([...text.matchAll(/\.\.\.common, id: '([^']+)'[\s\S]*?definition: '([^']+)'/g)].map(match => [match[1], match[2]]));
  const old = definitions(before);
  assert.deepEqual([...definitions(source)].filter(([id, value]) => old.get(id) !== value).map(([id]) => id).sort(), ['generation-augmentee-par-recuperation', 'honoraires-mensualises-et-actes-hors-forfait', 'prelevement-sepa-et-rejet']);
});
test('Extraits exacts présents dans les sources ouvertes cette livraison', () => {
  const quotes = {
    'banque-france-sepa': ['Un créancier n’a légalement pas le droit d’émettre un prélèvement en l’absence du consentement du débiteur, ce dernier se matérialisant par la signature d’un mandat de prélèvement.', 'La révocation porte sur le moyen de paiement et est indépendante de la créance sous–jacente.'],
    'microsoft-rag': ['La génération augmentée par récupération (RAG) est un modèle qui étend les capacités des LLM en ancrant les réponses dans votre contenu propriétaire.'],
    'cnil-rag': ['Elle permet de produire des réponses enrichies par des données externes, potentiellement plus spécifiques et plus faciles à actualiser que le modèle lui-même.', 'Les modèles génératifs ne sont pas des bases de connaissance'],
  };
  for (const [id, citations] of Object.entries(quotes)) {
    const text = readFileSync(`docs/qa/copy-glossaire/sources/${id}.txt`, 'utf8');
    for (const citation of citations) assert.ok(text.includes(citation), `${id}: ${citation}`);
  }
});
