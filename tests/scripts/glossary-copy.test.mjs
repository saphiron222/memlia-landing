import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source = readFileSync('src/data/glossary.ts', 'utf8');
const baseline = readFileSync('docs/qa/copy-glossaire/sources/production-avant.html', 'utf8');
const oldAnchors = [...baseline.matchAll(/class="glossaire-entree"[^>]*id="([^"]+)"/g)].map(match => match[1]);
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
  assert.ok(oldAnchors.length > 0);
  for (const anchor of oldAnchors) assert.ok(anchors(source).includes(anchor), anchor);
  const html = readFileSync('dist/glossaire.html', 'utf8');
  for (const anchor of oldAnchors) assert.ok(html.includes(`id="${anchor}"`), anchor);
  for (const path of ['/garanties', '/methode', '/integrations', '/automatisation-cabinet-comptable']) assert.ok(source.includes(`'${path}'`), path);
});
test('Les trois définitions ciblées restent rendues et leurs sources historiques conservées', () => {
  const html = readFileSync('dist/glossaire.html', 'utf8');
  for (const id of ['generation-augmentee-par-recuperation', 'honoraires-mensualises-et-actes-hors-forfait', 'prelevement-sepa-et-rejet']) {
    const definition = entry(source, id).match(/definition: '([^']+)'/)[1];
    assert.ok(html.includes(definition), id);
  }
  for (const id of ['banque-france-sepa', 'legifrance-deontologie-honoraires', 'microsoft-rag']) assert.ok(source.includes(`'${id}'`));
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
