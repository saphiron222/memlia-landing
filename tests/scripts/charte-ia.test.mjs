import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateCharter, charterDocument } from '../../src/lib/charte-ia.mjs';

const fixture = { usages: ['relance', 'synthese'], donnees: 'fictives', validation: 'chaque-resultat', responsable: '', validateur: 'Responsable de pôle', outils: 'Environnement de démonstration', frequence: 'mensuelle', formation: 'Atelier sur cas fictif', revision: '2026-12-01', publicFiles: false };
test('seuls les usages choisis sont écrits ; rôles manquants explicites', () => {
  const result = generateCharter(fixture);
  assert.equal(result.ok, true);
  assert.match(result.body, /Relance de pièces/);
  assert.match(result.body, /Synthèse de documents fictifs/);
  assert.doesNotMatch(result.body, /Reformulation/);
  assert.match(result.body, /Responsable des usages : à compléter/);
  assert.match(result.body, /mensuelle/);
  assert.ok(result.checklist.includes('Désigner le rôle responsable des usages.'));
});
test('fichier client vers IA publique bloqué, même si données fictives choisies', () => {
  for (const donnees of ['fictives', 'publiques', 'internes']) {
    const result = generateCharter({ ...fixture, donnees, publicFiles: true });
    assert.equal(result.ok, false);
    assert.equal(result.field, 'publicFiles');
    assert.match(result.error, /contradictoire/);
  }
});
test('refus des absences, valeurs étrangères, dates impossibles et texte trop long', () => {
  for (const change of [{ usages: [] }, { usages: ['inconnu'] }, { donnees: '' }, { validation: '' }, { frequence: '' }, { revision: '2026-02-30' }, { responsable: 'x'.repeat(161) }]) {
    assert.equal(generateCharter({ ...fixture, ...change }).ok, false);
  }
});
test('checklist complète et aucune approbation inventée', () => {
  const result = generateCharter({ ...fixture, responsable: '', validateur: '', outils: '', formation: '', revision: '' });
  assert.equal(result.checklist.length, 5);
  assert.match(result.body, /Arrêter/);
  assert.match(result.body, /Décision d’adoption : à documenter/);
  assert.doesNotMatch(result.body, /certifié|conforme au RGPD/);
});
test('document exporté reprend les éditions et le statut non officiel sans HTML', () => {
  const edited = generateCharter(fixture).body + '\nClause du cabinet : relire à deux.';
  const output = charterDocument(edited);
  assert.ok(output.endsWith(edited + '\n'));
  assert.match(output, /Trame non officielle/);
  assert.match(output, /ne certifie aucune conformité/);
});
test('données internes ne valent jamais autorisation de dossier réel', () => {
  const result = generateCharter({ ...fixture, donnees: 'internes', validation: 'avant-diffusion' });
  assert.match(result.body, /sans donnée personnelle ni information client/);
  assert.match(result.body, /Avant toute diffusion/);
  assert.match(result.body, /Tout autre usage reste hors périmètre/);
});
