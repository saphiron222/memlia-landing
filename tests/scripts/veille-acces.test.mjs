import assert from 'node:assert/strict';
import { test } from 'node:test';
import { decodeHtml, isRelevantQuestion, isWithinWindow, normalizeQuestion, qualifiesSignal } from '../../scripts/veille/questions.mjs';
import { canonicalText, evaluateClaimSource, normalizedIncludes, sha256 } from '../../scripts/veille/reglementaire.mjs';

test('la veille questions normalise sans conserver une identité', () => {
  assert.equal(normalizeQuestion('Comment gérez-vous les pièces manquantes ?'), 'comment gerez vous les pieces manquantes');
  assert.equal(isRelevantQuestion('Comment gérez-vous les documents manquants de vos clients ?'), true);
  assert.equal(isRelevantQuestion('Statut conjoint collaborateur'), false);
});

test('le seuil refuse un message isolé et un accès déjà couvert', () => {
  assert.equal(qualifiesSignal({ occurrences: 1, distinctContributors: 1, distinctThreads: 1, coveredByC1: false }), false);
  assert.equal(qualifiesSignal({ occurrences: 3, distinctContributors: 3, distinctThreads: 2, coveredByC1: true }), false);
  assert.equal(qualifiesSignal({ occurrences: 3, distinctContributors: 3, distinctThreads: 2, coveredByC1: false }), true);
});

test('la fenêtre de 31 jours exclut le vieux contenu et les dates futures', () => {
  const now = new Date('2026-09-20T12:00:00Z');
  assert.equal(isWithinWindow('2026-08-21', now), true);
  assert.equal(isWithinWindow('2026-08-19', now), false);
  assert.equal(isWithinWindow('2026-09-21', now), false);
});

test('le collecteur respecte le charset historique des forums', () => {
  const bytes = Uint8Array.from(Buffer.from('Comment g\xe9rez-vous les pi\xe8ces ?', 'latin1'));
  assert.equal(decodeHtml(bytes, 'text/html; charset=ISO-8859-1'), 'Comment gérez-vous les pièces ?');
});

test('la veille réglementaire ignore le balisage pour retrouver une citation', () => {
  const excerpt = 'Vérifier chaque facture dès sa réception';
  const body = '<main>Vérifier <strong>chaque facture</strong> dès sa réception</main>';
  assert.equal(normalizedIncludes(body, excerpt), true);
  assert.equal(canonicalText(body), excerpt);
});

test('une source claim-bearing ferme sur panne, citation perdue ou hash strict différent', () => {
  const source = { rawBodySha256: sha256('attendu'), claimExcerpt: 'règle attendue' };
  assert.equal(evaluateClaimSource({ id: 'x', requestedUrl: 'x', finalUrl: 'x', httpStatus: 500, bodySha256: sha256('attendu'), body: 'règle attendue' }, source).critical, true);
  assert.equal(evaluateClaimSource({ id: 'x', requestedUrl: 'x', finalUrl: 'x', httpStatus: 200, bodySha256: sha256('attendu'), body: 'autre règle' }, source).critical, true);
  assert.equal(evaluateClaimSource({ id: 'x', requestedUrl: 'x', finalUrl: 'x', httpStatus: 200, bodySha256: sha256('différent'), body: 'règle attendue' }, source).critical, true);
});

test('une source dynamique exige la citation mais pas le hash du corps', () => {
  const source = { rawBodySha256: sha256('ancien'), rawHashStatus: 'dynamic body includes request-specific values', claimExcerpt: 'règle attendue' };
  const verdict = evaluateClaimSource({ id: 'x', requestedUrl: 'x', finalUrl: 'x', httpStatus: 200, bodySha256: sha256('nouveau'), body: '<p>règle attendue</p>' }, source);
  assert.equal(verdict.hashMatches, false);
  assert.equal(verdict.critical, false);
});
