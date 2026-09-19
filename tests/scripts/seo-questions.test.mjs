import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recalerBacklog, intentionDesDomaines, DOMAINES_LOGICIEL } from '../../scripts/lib/seo-questions.mjs';

const backlog = () => ([
  { slug: 'pilier', titre: 'Le pilier', requete: 'automatisation cabinet comptable', secondaires: [], famille: 'choisir-cadrer', format: 'pillar-page', priorite: 1 },
  { slug: 'a', titre: 'A', requete: 'rapprochement bancaire automatisé', secondaires: ['logiciel rapprochement bancaire cabinet'], famille: 'banque-rapprochement', format: 'how-to-guide', priorite: 3 },
  { slug: 'b', titre: 'B', requete: 'relance pièces manquantes cabinet comptable', secondaires: ['checklist pièces comptables à réclamer'], famille: 'collecte-pieces', format: 'how-to-guide', priorite: 1 },
  { slug: 'c', titre: 'C', requete: 'suivi production sociale', secondaires: ['tableau de suivi cabinet comptable'], famille: 'suivi-production-sociale', format: 'how-to-guide', priorite: 1 },
  { slug: 'd', titre: 'D', requete: 'amorce jamais mesurée', secondaires: [], famille: 'lettrage', format: 'how-to-guide', priorite: 2 },
]);

const mesures = () => ({
  jour: '2026-09-19',
  autocompletion: {
    'rapprochement bancaire automatisé': ['rapprochement bancaire automatisé excel', 'rapprochement bancaire automatisé logiciel'],
    'logiciel rapprochement bancaire cabinet': ['logiciel rapprochement bancaire cabinet comptable'],
    'relance pièces manquantes cabinet comptable': [],
    'checklist pièces comptables à réclamer': ['checklist pièces comptables à réclamer au client'],
    'suivi production sociale': [],
    'tableau de suivi cabinet comptable': [],
  },
  serp: {
    'rapprochement bancaire automatisé': { famille: 'banque-rapprochement', questions: ['Comment automatiser un rapprochement bancaire ?'], associees: [], domaines: ['pennylane.com', 'agicap.com', 'sage.com', 'compta-online.com'], apercuIa: true },
  },
});

test('recalerBacklog : la priorité suit la demande mesurée, le pilier ne bouge pas, rien n’est muté', () => {
  const avant = backlog();
  const copie = JSON.parse(JSON.stringify(avant));
  const apres = recalerBacklog(avant, mesures());
  assert.deepEqual(avant, copie, 'le backlog d’entrée n’est pas muté');
  const par = Object.fromEntries(apres.map((e) => [e.slug, e]));
  assert.equal(par.pilier.priorite, 1);
  assert.equal(par.pilier.demande, undefined, 'le pilier n’est pas recalé');
  assert.equal(par.a.priorite, 1, 'la requête a des suggestions : priorité 1');
  assert.equal(par.b.priorite, 2, 'seule une secondaire a des suggestions : priorité 2');
  assert.equal(par.c.priorite, 3, 'aucune demande mesurée : priorité 3');
  assert.deepEqual(par.a.demande, { mesureeLe: '2026-09-19', requete: 2, secondaires: 1, questions: ['Comment automatiser un rapprochement bancaire ?'], intention: 'logiciel', apercuIa: true });
  assert.deepEqual(par.c.demande, { mesureeLe: '2026-09-19', requete: 0, secondaires: 0, questions: [], intention: null, apercuIa: null });
  assert.equal(par.d.priorite, 2, 'une amorce non mesurée (instrument en panne) ne vaut pas zéro : la priorité ne bouge pas');
  assert.equal(par.d.demande.requete, null);
});

test('intentionDesDomaines nomme « logiciel » quand les éditeurs dominent le haut de page, sinon null', () => {
  assert.equal(intentionDesDomaines(['pennylane.com', 'agicap.com', 'sage.com', 'compta-online.com']), 'logiciel');
  assert.equal(intentionDesDomaines(['service-public.fr', 'urssaf.fr', 'compta-online.com']), null);
  assert.equal(intentionDesDomaines([]), null);
  assert.ok(DOMAINES_LOGICIEL.includes('pennylane.com'));
});

test('fusionnerReleve garde la SERP et son coût d’un relevé précédent du même jour quand le nouveau n’en a pas', async () => {
  const { fusionnerReleve } = await import('../../scripts/lib/seo-questions.mjs');
  const precedent = { jour: '2026-09-19', autocompletion: { a: ['a1'] }, serp: { a: { famille: 'x', questions: ['q'] } }, cout: 0.21, exclusions: [] };
  const nouveau = { jour: '2026-09-19', autocompletion: { a: ['a1'], b: [] }, serp: {}, cout: 0, exclusions: ['SERP non relevée : désactivée par option'] };
  const fusion = fusionnerReleve(precedent, nouveau);
  assert.deepEqual(fusion.serp, precedent.serp);
  assert.equal(fusion.cout, 0.21);
  assert.deepEqual(fusion.autocompletion, { a: ['a1'], b: [] });
  assert.deepEqual(fusion.exclusions, ['SERP reprise du relevé précédent du 2026-09-19 (option --sans-serp)']);
  assert.deepEqual(nouveau.serp, {}, 'rien n’est muté');
  const autreJour = fusionnerReleve({ ...precedent, jour: '2026-09-18' }, nouveau);
  assert.deepEqual(autreJour.serp, {}, 'un relevé d’un autre jour n’est pas repris');
  assert.deepEqual(fusionnerReleve(null, nouveau), nouveau);
});
