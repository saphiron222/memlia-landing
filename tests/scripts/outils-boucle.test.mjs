import assert from 'node:assert/strict';
import test from 'node:test';
import {
  deciderEtatSource,
  evaluerVague,
  lireResumeBacklinks,
  normaliserTexte,
  verifierSignatures,
} from '../../scripts/lib/outils-boucle.mjs';
import { verifierOutil } from '../../scripts/veille-outils.mjs';

test('normalise le HTML, les accents et les espaces avant de vérifier les signatures', () => {
  const html = '<main><h1>Marge commerciale</h1><p>Différence entre ventes &amp; coût d’achat.</p></main>';
  assert.equal(normaliserTexte(html), 'marge commerciale difference entre ventes cout d achat');
  assert.deepEqual(verifierSignatures(html, ['marge commerciale', 'cout d achat']), {
    ok: true,
    manquantes: [],
  });
});

test('suspend après trois réponses sans la signature attendue', () => {
  const tentatives = [
    { ok: true, status: 200, texte: 'page sans la règle' },
    { ok: false, status: 503, texte: '' },
    { ok: true, status: 200, texte: 'toujours pas la règle' },
  ];
  assert.deepEqual(deciderEtatSource(tentatives, ['45 jours fin de mois']), {
    etat: 'suspendre',
    motif: 'signature primaire absente après 3 tentatives',
    tentatives: 3,
  });
});

test('garde l’outil disponible dès qu’une tentative vérifie toutes les signatures', () => {
  const tentatives = [
    { ok: false, status: 503, texte: '' },
    { ok: true, status: 200, texte: 'Le délai maximal est de 60 jours. La méthode 45 jours fin de mois reste possible.' },
  ];
  assert.deepEqual(deciderEtatSource(tentatives, ['60 jours', '45 jours fin de mois']), {
    etat: 'disponible',
    motif: null,
    tentatives: 2,
  });
});

test('compte zéro domaine quand DataForSEO répond avec une tâche réussie sans résultat', () => {
  const reponse = { tasks: [{ status_code: 20000, result_count: 0, cost: 0.024036, result: null }] };
  assert.deepEqual(lireResumeBacklinks(reponse), {
    ok: true,
    cout: 0.024036,
    backlinks: 0,
    domainesReferents: 0,
    domainesPrincipaux: 0,
    etat: 'aucun-resultat-dans-index',
    erreur: null,
  });
});

test('refuse d’ouvrir une vague avant le 21 octobre même avec un signal', () => {
  const verdict = evaluerVague({
    date: '2026-09-27',
    outils: [{ domainesNouveaux: 1, impressions: 0, clics: 0, position: null, contacts: 0 }],
  });
  assert.equal(verdict.etat, 'trop-tot');
  assert.equal(verdict.places, 0);
});

test('ouvre une seule place sur un domaine, un contact ou un signal Search Console', () => {
  for (const outil of [
    { domainesNouveaux: 1, impressions: 0, clics: 0, position: null, contacts: 0 },
    { domainesNouveaux: 0, impressions: 0, clics: 0, position: null, contacts: 1 },
    { domainesNouveaux: 0, impressions: 50, clics: 0, position: 20, contacts: 0 },
    { domainesNouveaux: 0, impressions: 0, clics: 3, position: null, contacts: 0 },
  ]) {
    const verdict = evaluerVague({ date: '2026-10-21', outils: [outil] });
    assert.equal(verdict.etat, 'ouvrir-une-place');
    assert.equal(verdict.places, 1);
  }
});

test('gèle l’hypothèse de lien à J+90 quand aucun domaine n’a été gagné', () => {
  const verdict = evaluerVague({
    date: '2026-12-19',
    outils: [{ domainesNouveaux: 0, impressions: 0, clics: 0, position: null, contacts: 0 }],
  });
  assert.equal(verdict.etat, 'hypothese-lien-non-confirmee');
  assert.equal(verdict.places, 0);
});

test('la veille accepte le repli officiel quand la source principale refuse le robot', async () => {
  const reponses = [
    { ok: false, status: 403, urlFinale: 'https://legifrance.example', texte: 'Just a moment' },
    { ok: true, status: 200, urlFinale: 'https://service-public.example', texte: 'Le délai est de 60 jours ou 45 jours fin de mois.' },
  ];
  const resultat = await verifierOutil({
    slug: 'echeance',
    alternatives: [
      { url: 'https://legifrance.example', signatures: ['soixante jours'] },
      { url: 'https://service-public.example', signatures: ['60 jours', '45 jours fin de mois'] },
    ],
  }, { lireSource: async () => reponses.shift(), attendreMs: 0 });
  assert.equal(resultat.etat, 'disponible');
  assert.equal(resultat.tentatives.length, 2);
});

test('la veille demande la suspension après exactement trois lectures infructueuses', async () => {
  const resultat = await verifierOutil({
    slug: 'marge',
    alternatives: [{ url: 'https://insee.example', signatures: ['marge commerciale'] }],
  }, { lireSource: async () => ({ ok: true, status: 200, urlFinale: 'https://insee.example', texte: 'Page vide' }), attendreMs: 0 });
  assert.equal(resultat.etat, 'suspendre');
  assert.equal(resultat.tentatives.length, 3);
});
