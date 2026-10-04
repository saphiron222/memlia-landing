import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BLOG_RUBRIQUES, construireRubriques } from '../../src/data/blog-rubriques.mjs';
import { loadMetierEvidence } from '../../scripts/lib/resource-metier-evidence.mjs';

const source = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

test('une assertion additionnelle suit la date de sa propre source', () => {
  const evidence = loadMetierEvidence(new URL('../..', import.meta.url).pathname, '2026-09-16T20:24:14+01:00');
  const claim = evidence.entries.find(({ id }) => id === 'T-EXTRA-sous-traitant-rgpd-context');
  assert.equal(claim.validAsOf, '2026-10-04');
  assert.equal(claim.checkedAt, evidence.sources[claim.sourceId].checkedAt);
});

test('les rubriques suivent le geste déclaré, même avec des dates inversées', () => {
  const entries = BLOG_RUBRIQUES.flatMap((rubrique) => rubrique.articleIds.map((id, i) => ({ id, data: { datePublication: new Date(2026, 8, i + 1) } })));
  for (const rubrique of construireRubriques(entries.reverse())) {
    assert.deepEqual(rubrique.articles.map(({ id }) => id), rubrique.articleIds);
  }
});

test('garanties : ni comparaison ni délai, politique bornée au site', () => {
  const text = source('src/pages/garanties.astro');
  assert.ok(text.includes('Une donnée absente, une pièce illisible ou un cas hors règle arrête la préparation et présente le motif à votre équipe.'));
  assert.ok(text.includes('Une exception visible se présente avec son contexte et son motif. Votre équipe décide de la suite.'));
  assert.ok(text.includes('Les flux du service sont documentés par mission'));
  assert.doesNotMatch(text, /plus souvent que d’autres|quelques minutes|des mois plus tard/);
});

test('contact : la notice expose les deux finalités réellement transportées', () => {
  const text = source('src/pages/contact.astro');
  assert.ok(text.includes('comprendre la page du site à l’origine de ma demande'));
  assert.ok(text.includes('un cas courant et une exception'));
  assert.doesNotMatch(text, /Elles ne servent à rien d’autre|celle qui agace le plus/);
});

test('les guides sont regroupés par produit exact, sans manifeste SEO public', () => {
  const text = source('src/pages/integrations/index.astro');
  assert.ok(text.includes('integration.product === product'));
  assert.doesNotMatch(text, /contenu maigre|Demande mesurée|signal d’indexation|integration.vendor ===/);
});

test('glossaire : les frontières corrigées restent explicites', () => {
  const text = source('src/data/glossary.ts');
  for (const phrase of ['L’envoi attend une validation humaine', 'sans imputation définitive ni écriture validée', 'finalités, les moyens et les instructions', 'ne garantit pas l’absence de connexions', 'données et un périmètre comparables', 'sans passage obligatoire par un OCR', 'pas nécessairement inédit']) assert.ok(text.includes(phrase), phrase);
  assert.doesNotMatch(text, /Un cabinet, responsable du traitement de ses dossiers clients|Le résultat produit est nouveau à chaque exécution|un reliquat stable indique une règle qui tient/);
});

test('Sources n’est rendu que si des références publiques existent', () => {
  const text = source('src/components/PageEvidence.astro');
  assert.match(text, /eeat.sources.length > 0 && \(\s*<div class="page-evidence-head"/);
});
