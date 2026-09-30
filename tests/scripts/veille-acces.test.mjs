import assert from 'node:assert/strict';
import { test } from 'node:test';
import { decodeHtml, isRelevantQuestion, isWithinWindow, normalizeQuestion, qualifiesSignal } from '../../scripts/veille/questions.mjs';
import {
  canonicalText,
  evaluateClaimSource,
  evaluateDiscoverySource,
  metaDescription,
  normalizedIncludes,
  sha256,
} from '../../scripts/veille/reglementaire.mjs';

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

test('la veille peut borner une preuve à la description officielle du document', () => {
  const claim = "L'annuaire permet de rechercher une structure";
  const body = `<html><head><meta content="${claim}" name="description"></head><body></body></html>`;
  const source = {
    rawBodySha256: sha256(body),
    evidenceScope: 'document-source-including-meta-description',
    claimFragments: [claim],
    evidenceSha256: sha256(claim),
  };
  const verdict = evaluateClaimSource({
    id: 'aife',
    requestedUrl: 'https://example.test',
    finalUrl: 'https://example.test',
    httpStatus: 200,
    bodySha256: sha256(body),
    body,
  }, source);

  assert.equal(metaDescription(body), claim);
  assert.equal(verdict.excerptPresent, true);
  assert.equal(verdict.evidenceHashMatches, true);
  assert.equal(verdict.critical, false);
});

test('une preuve fragmentée ferme si son manifeste ou un fragment dérive', () => {
  const fragments = ['vérifier à réception', 'valider si conforme'];
  const snapshot = {
    id: 'service-public',
    requestedUrl: 'https://example.test',
    finalUrl: 'https://example.test',
    httpStatus: 200,
    bodySha256: sha256('vérifier à réception seulement'),
    body: '<main>vérifier à réception seulement</main>',
  };

  const missingFragment = evaluateClaimSource(snapshot, {
    rawHashStatus: 'dynamic body includes request-specific values',
    claimFragments: fragments,
    evidenceSha256: sha256(fragments.join('\n')),
  });
  assert.equal(missingFragment.excerptPresent, false);
  assert.equal(missingFragment.critical, true);

  const staleManifest = evaluateClaimSource({ ...snapshot, body: fragments.join(' ') }, {
    rawHashStatus: 'dynamic body includes request-specific values',
    claimFragments: fragments,
    evidenceSha256: sha256('ancienne preuve'),
  });
  assert.equal(staleManifest.excerptPresent, true);
  assert.equal(staleManifest.evidenceHashMatches, false);
  assert.equal(staleManifest.critical, true);
});

test('index DILA : maintenance HTTP 200 ou texte non lié est indisponible', () => {
  const source = { id: 'legifrance-dila-index' };
  for (const body of ['<title>Page de maintenance</title>', '<p>LEGI_20260929-100000.tar.gz</p>', '']) {
    const verdict = evaluateDiscoverySource({ id: source.id, httpStatus: 200, body, error: null }, source);
    assert.equal(verdict.latestDilaPackage, null);
    assert.equal(verdict.critical, true);
    assert.equal(verdict.error, 'DilaIndexUnavailable');
  }
});

test('index DILA : panne réseau conserve TypeError et ferme la porte', () => {
  const verdict = evaluateDiscoverySource({ id: 'legifrance-dila-index', httpStatus: 0, body: '', error: 'TypeError' }, { id: 'legifrance-dila-index' });
  assert.equal(verdict.latestDilaPackage, null);
  assert.equal(verdict.critical, true);
  assert.equal(verdict.error, 'TypeError');
});

test('index DILA : seul un lien d’archive sur HTTP 200 établit une disponibilité', () => {
  const source = { id: 'legifrance-dila-index' };
  const verdict = evaluateDiscoverySource({ id: source.id, httpStatus: 200, body: '<a href="LEGI_20260927-204937.tar.gz">ancien</a><a href="/OPENDATA/LEGI/LEGI_20260929-204937.tar.gz">nouveau</a>', error: null }, source);
  assert.equal(verdict.latestDilaPackage, '20260929-204937');
  assert.equal(verdict.critical, false);
  assert.equal(evaluateDiscoverySource({ id: source.id, httpStatus: 503, body: '<a href="LEGI_20260929-204937.tar.gz">archive</a>', error: null }, source).critical, true);
});
