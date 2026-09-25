import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const fixturePath = 'docs/design/blog-recrutement-proofs/replay-fixtures.json';
const outputPath = 'docs/qa/blog-recrutement-replay.json';
const check = process.argv.includes('--check');
const fixtureBytes = readFileSync(fixturePath);
const fixture = JSON.parse(fixtureBytes);

function evaluateFlux(input) {
  if (input.missingField) {
    return {
      status: 'ATTENTE',
      message: `Entrée manquante : ${input.missingField}`,
      decision: 'Afficher le motif et suspendre la suite',
    };
  }
  if (input.contradictory) {
    return {
      status: 'EXCEPTION',
      message: 'Conditions contradictoires',
      decision: 'Sortir du circuit et présenter le cas',
    };
  }
  if (input.requiresJudgment) {
    return {
      status: 'DECISION_HUMAINE',
      message: 'Préparation disponible',
      decision: 'Présenter les éléments pour arbitrage',
    };
  }
  if (input.repeated && input.stable) {
    return {
      status: 'REPETITION',
      message: 'Règle candidate RC-01',
      decision: 'Faire relire la règle avant de la tester',
    };
  }
  return {
    status: 'REFUS_HORS_REGLE',
    message: 'Aucun état écrit ne couvre ce cas',
    decision: 'Retour au cabinet pour écrire la règle',
  };
}

function evaluateIa(input) {
  if (!input.ruleExists) {
    return {
      status: 'REFUS_REGLE_ABSENTE',
      message: 'Aucune règle écrite pour ce cas',
      decision: 'Retour au cabinet pour écrire la règle',
    };
  }
  if (input.interpretations !== 1) {
    const count = input.interpretations === 2 ? 'Deux' : String(input.interpretations);
    return {
      status: 'REFUS_AMBIGUITE',
      message: `${count} interprétations possibles`,
      decision: 'Présenter l’ambiguïté au collaborateur',
    };
  }
  if (!input.complete || !input.periodRecognized) {
    return {
      status: 'REFUS_ENTREE_INCOMPLETE',
      message: 'Entrée ou période incomplète',
      decision: 'Demander l’information manquante',
    };
  }
  return {
    status: 'PROPOSITION',
    message: 'Proposition PR-001 préparée ; source et période jointes',
    decision: 'Attendre la validation du collaborateur',
  };
}

function evaluateTransmission(input) {
  if (!input.ruleExists) {
    return {
      status: 'REFUS_REGLE_ABSENTE',
      message: 'Aucune règle écrite pour ce cas',
      decision: 'Retour au cabinet pour écrire la règle',
    };
  }
  if (!input.period || !Number.isFinite(input.journal?.amount) || !Number.isFinite(input.export?.amount) || !input.validator) {
    const missing = !input.period ? 'période' : !Number.isFinite(input.journal?.amount) ? 'montant du journal des ventes' : !Number.isFinite(input.export?.amount) ? 'montant de l’export de contrôle' : 'responsable de mission';
    return {
      status: 'ATTENTE',
      message: `Entrée manquante : ${missing}`,
      decision: 'Demander l’information manquante avant toute préparation',
    };
  }
  // Fictional rule: compare the two supplied amounts, never authorize an accounting entry.
  if (input.journal.amount !== input.export.amount) {
    return {
      status: 'REFUS_CONTRADICTION',
      message: `Écart ${input.period} : journal des ventes ${input.journal.amount} € / export de contrôle ${input.export.amount} €`,
      decision: `Présenter les deux sources à ${input.validator} pour arbitrage humain`,
    };
  }
  return {
    status: 'PROPOSITION',
    message: `Contrôle ${input.period} préparé : journal des ventes et export de contrôle concordent à ${input.journal.amount} €`,
    decision: `Soumettre la proposition à ${input.validator} pour validation`,
  };
}

const evaluators = new Map([
  ['cabinet-comptable-surcharge-de-travail-ou-passe-le-temps', evaluateFlux],
  ['intelligence-artificielle-metier-comptable-ce-qu-elle-prepare-ce-qui-reste-humain', evaluateIa],
  ['fideliser-collaborateurs-cabinet-comptable-ecrire-savoir-faire', evaluateTransmission],
]);

assert.equal(fixture.schemaVersion, 1);
assert.equal(fixture.fictitious, true);
assert.match(fixture.replayedAt, /^\d{4}-\d{2}-\d{2}$/);
assert.equal(fixture.articles.length, 3);

const articles = fixture.articles.map((article) => {
  const evaluate = evaluators.get(article.slug);
  assert.ok(evaluate, `Aucun oracle déclaré pour ${article.slug}`);
  const bodyPath = `editorial/recettes/${article.slug}/corps.md`;
  const bodyBytes = readFileSync(bodyPath);
  const body = bodyBytes.toString('utf8');
  const cases = article.cases.map((testCase) => {
    const actual = evaluate(testCase.input);
    assert.deepEqual(actual, testCase.expected, `${article.slug}/${testCase.id}`);
    for (const value of [testCase.id, actual.status, actual.message, actual.decision]) {
      assert.ok(body.includes(value), `${article.slug}/${testCase.id} : sortie absente du corps (${value})`);
    }
    return { id: testCase.id, input: testCase.input, ...actual, passed: true };
  });
  assert.ok(cases.length >= 3, `${article.slug} doit rejouer au moins trois cas`);
  return {
    slug: article.slug,
    status: 'PASS',
    bodyPath,
    bodySha256: createHash('sha256').update(bodyBytes).digest('hex'),
    cases,
  };
});

const report = {
  schemaVersion: 1,
  status: 'PASS',
  fictitious: true,
  replayedAt: fixture.replayedAt,
  fixturePath,
  fixtureSha256: createHash('sha256').update(fixtureBytes).digest('hex'),
  articles,
};
const serialized = `${JSON.stringify(report, null, 2)}\n`;

if (check) {
  assert.ok(existsSync(outputPath), `Oracle absent : ${outputPath}`);
  assert.equal(readFileSync(outputPath, 'utf8'), serialized, 'Oracle de rejeu périmé');
  console.log(`check : ${articles.length} articles et ${articles.reduce((sum, article) => sum + article.cases.length, 0)} cas fictifs rejoués.`);
} else {
  writeFileSync(outputPath, serialized);
  console.log(`rejeu : ${articles.length} articles et ${articles.reduce((sum, article) => sum + article.cases.length, 0)} cas fictifs PASS.`);
}
