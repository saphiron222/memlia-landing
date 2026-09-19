import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lireBacklinks, lireCitationsIa, detecterAutorite, SEUILS_AUTORITE } from '../../scripts/lib/seo-autorite.mjs';
import { dateParis } from '../../scripts/seo/autorite.mjs';

test('dateParis attribue un relevé après minuit à la date civile de Paris', () => {
  assert.equal(dateParis(new Date('2026-09-19T23:30:00.000Z')), '2026-09-20');
});

test('lireBacklinks sépare une réponse utile de son coût et nomme une tâche refusée', () => {
  const ok = lireBacklinks({ tasks: [{ status_code: 20000, cost: 0.02, result: [{ target: 'memlia.fr', rank: 4, backlinks: 31, referring_domains: 19, referring_main_domains: 17, broken_backlinks: 2 }] }] });
  assert.equal(ok.ok, true);
  assert.equal(ok.cout, 0.02);
  assert.equal(ok.resume.instrument, 'dataforseo-backlinks-summary', 'le rang dit de quel instrument il vient : ce n’est pas le DA de Moz');
  assert.deepEqual(ok.resume, { instrument: 'dataforseo-backlinks-summary', domaine: 'memlia.fr', rang: 4, liens: 31, domainesReferents: 19, domainesPrincipaux: 17, liensCasses: 2 });
  const refus = lireBacklinks({ tasks: [{ status_code: 40201, status_message: 'Unauthorized.', cost: 0, result: null }] });
  assert.equal(refus.ok, false);
  assert.match(refus.erreur, /40201/);
  assert.equal(lireBacklinks({}).ok, false);
});

test('lireCitationsIa lit la vraie forme, et ne conclut à aucune citation que si le modèle a cherché', () => {
  // Relevé le 19/09/2026 : la réponse porte items[].sections[].text, pas items[].message, et
  // `web_search` dit si le modèle est allé chercher. Sans recherche, « aucune citation » ne
  // mesure rien : il n'y avait aucune source à citer. Un premier câblage l'écrivait quand même.
  const avecRecherche = lireCitationsIa({
    web_search: true,
    items: [{ type: 'message', sections: [{ type: 'text', text: 'Plusieurs approches, dont memlia.fr.', annotations: [{ url: 'https://memlia.fr/blog/x' }, { url: 'https://compta-online.com/y' }] }] }],
  }, { domaine: 'memlia.fr' });
  assert.equal(avecRecherche.rechercheWeb, true);
  assert.equal(avecRecherche.cite, true);
  assert.equal(avecRecherche.nomme, true);
  assert.deepEqual(avecRecherche.domainesCites, ['memlia.fr', 'compta-online.com']);

  const sansRecherche = lireCitationsIa({
    web_search: false,
    items: [{ type: 'message', sections: [{ type: 'text', text: 'Un expert-comptable gère les finances.', annotations: null }] }],
  }, { domaine: 'memlia.fr' });
  assert.equal(sansRecherche.rechercheWeb, false);
  assert.equal(sansRecherche.cite, null, 'sans recherche web, la citation n’est pas mesurée — ni vraie ni fausse');
  assert.equal(sansRecherche.nomme, false);
  assert.ok(sansRecherche.extrait.startsWith('Un expert-comptable'));
  assert.deepEqual(lireCitationsIa(null, { domaine: 'memlia.fr' }), { rechercheWeb: false, cite: null, nomme: false, domainesCites: [], extrait: null });
});

test('detecterAutorite : un recul d’autorité, une marque toujours réécrite et zéro citation sont des rouges nommés', () => {
  const precedent = { mois: '2026-08', autorite: { rang: 4, domainesReferents: 19 }, ia: { citations: 1 } };
  const vert = detecterAutorite({
    mois: '2026-09',
    autorite: { rang: 4, domainesReferents: 21, liensCasses: 0 },
    entite: { spell: null, rangMarque: 1, suggestions: 2 },
    ia: { citations: 2, requetes: 6, avecRecherche: 6, nomme: 2 },
    precedent, moisDepuisDepart: 1,
  });
  assert.deepEqual(vert.rouges, []);
  const rouge = detecterAutorite({
    mois: '2026-12',
    autorite: { rang: 3, domainesReferents: 15, liensCasses: 4 },
    entite: { spell: { mot: 'mellia', type: 'did_you_mean' }, rangMarque: 21, suggestions: 0 },
    ia: { citations: 0, requetes: 6, avecRecherche: 6, nomme: 0 },
    precedent, moisDepuisDepart: 3,
  });
  const codes = rouge.rouges.map((r) => r.code).sort();
  assert.deepEqual(codes, ['autorite-en-recul', 'domaines-referents-en-recul', 'marque-toujours-reecrite']);
  assert.ok(rouge.rouges.every((r) => r.mesure && r.motif), 'chaque rouge porte sa mesure et son motif');
  // Zéro citation n'est un rouge qu'à partir du sixième mois : avant, c'est l'âge qui parle.
  assert.ok(!codes.includes('aucune-citation-ia'));
  const six = detecterAutorite({ mois: '2027-03', autorite: { rang: 4, domainesReferents: 19, liensCasses: 0 }, entite: { spell: null, rangMarque: 1, suggestions: 1 }, ia: { citations: 0, requetes: 6, avecRecherche: 6, nomme: 0 }, precedent, moisDepuisDepart: 6 });
  assert.ok(six.rouges.some((r) => r.code === 'aucune-citation-ia'));
  assert.equal(SEUILS_AUTORITE.moisAvantCitationIa, 6);
  assert.equal(SEUILS_AUTORITE.moisAvantEntiteRedressee, 3);

  // Sans recherche web, aucune conclusion sur les citations : c'est un avertissement, pas un rouge.
  const sansRecherche = detecterAutorite({ mois: '2027-03', autorite: { rang: 4, domainesReferents: 19, liensCasses: 0 }, entite: { spell: null, rangMarque: 1, suggestions: 1 }, ia: { citations: 0, requetes: 6, avecRecherche: 0, nomme: 1 }, precedent, moisDepuisDepart: 6 });
  assert.ok(!sansRecherche.rouges.some((r) => r.code === 'aucune-citation-ia'), 'on ne conclut pas sur ce qu’on n’a pas mesuré');
  assert.ok(sansRecherche.avertissements.some((r) => r.code === 'citations-ia-non-mesurees'));
  assert.ok(sansRecherche.infos.some((i) => /nommée dans 1 réponse/.test(i)));
});

test('detecterAutorite sans mois précédent ne conclut à aucun recul : il n’y a rien à comparer', () => {
  const r = detecterAutorite({ mois: '2026-09', autorite: { rang: 4, domainesReferents: 19, liensCasses: 0 }, entite: { spell: null, rangMarque: 1, suggestions: 2 }, ia: { citations: 0, requetes: 6, avecRecherche: 6, nomme: 0 }, precedent: null, moisDepuisDepart: 1 });
  assert.deepEqual(r.rouges, []);
  assert.ok(r.infos.some((i) => /aucun mois précédent/i.test(i)), r.infos.join('\n'));
});

test('lireTacheIa : une tâche refusée par l’interface est une ERREUR, jamais un zéro', async () => {
  const { lireTacheIa } = await import('../../scripts/lib/seo-autorite.mjs');
  // Mesuré le 19/09/2026 : sans model_name, l'interface rend 40501 et coûte 0. Le premier
  // câblage l'enregistrait en « 0 citation sur 6 requêtes » — un zéro creux, arrêté ici.
  const refus = lireTacheIa({ status_code: 40501, status_message: "Invalid Field: 'model_name'.", cost: 0, result: null }, { domaine: 'memlia.fr' });
  assert.equal(refus.ok, false);
  assert.match(refus.erreur, /40501/);
  assert.equal(refus.lecture, null, 'aucune lecture ne sort d’une tâche refusée');
  const vide = lireTacheIa(undefined, { domaine: 'memlia.fr' });
  assert.equal(vide.ok, false);
  const ok = lireTacheIa({ status_code: 20000, cost: 0.000657, result: [{ web_search: true, items: [{ type: 'message', sections: [{ type: 'text', text: 'Voir memlia.fr.', annotations: [{ url: 'https://memlia.fr/' }] }] }] }] }, { domaine: 'memlia.fr' });
  assert.equal(ok.ok, true);
  assert.equal(ok.cout, 0.000657);
  assert.equal(ok.lecture.cite, true);
});

test('lireReferents : sépare les assistants, la navigation interne et les visites directes', async () => {
  const { lireReferents, ASSISTANTS } = await import('../../scripts/lib/seo-autorite.mjs');
  const r = lireReferents({
    data: { viewer: { accounts: [{ rumPageloadEventsAdaptiveGroups: [
      { count: 12, dimensions: { refererHost: 'chatgpt.com' } },
      { count: 1470, dimensions: { refererHost: '' } },
      { count: 420, dimensions: { refererHost: 'memlia.fr' } },
      { count: 10, dimensions: { refererHost: 'bing.com' } },
      { count: 2, dimensions: { refererHost: 'perplexity.ai' } },
    ] }] } },
  }, { hoteSite: 'memlia.fr' });
  assert.equal(r.ok, true);
  assert.equal(r.chargements, 1914, 'le total compte tout ce que la balise a vu');
  assert.equal(r.directes, 1470);
  assert.equal(r.internes, 420, 'une visite venue du site lui-même est de la navigation interne, pas un référent');
  assert.deepEqual(r.externes, [{ hote: 'chatgpt.com', visites: 12 }, { hote: 'bing.com', visites: 10 }, { hote: 'perplexity.ai', visites: 2 }]);
  assert.deepEqual(r.assistants, [{ hote: 'chatgpt.com', visites: 12 }, { hote: 'perplexity.ai', visites: 2 }]);
  assert.equal(r.visitesAssistants, 14);
  assert.ok(ASSISTANTS.includes('chatgpt.com'));

  const erreur = lireReferents({ errors: [{ message: 'Authentication error' }] });
  assert.equal(erreur.ok, false);
  assert.match(erreur.erreur, /Authentication error/);
  assert.equal(erreur.chargements, null, 'une réponse en erreur ne rend aucun compte, surtout pas zéro');
  assert.equal(lireReferents(null).ok, false);
  const vide = lireReferents({ data: { viewer: { accounts: [{ rumPageloadEventsAdaptiveGroups: [] }] } } }, { hoteSite: 'memlia.fr' });
  assert.equal(vide.ok, true);
  assert.equal(vide.chargements, 0, 'une réponse valide sans ligne est un vrai zéro');
});
