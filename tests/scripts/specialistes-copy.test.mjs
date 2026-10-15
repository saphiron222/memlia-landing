import test from 'node:test';
import assert from 'node:assert/strict';
import { lireInterdits, normaliser, trouverInterdits } from '../helpers/agents-interdits.mjs';

/*
 * I8 : mots interdits par la charte (§9 bis, v7) sur les données des agents IA.
 *
 * `src/data/specialistes.ts` n'existe pas encore (tâche 2) : les contrôles qui lisent les données échouent avec
 * « Cannot find module », les témoins de l'instrument, eux, passent déjà. Les mêmes expressions sont refusées sur
 * les pages construites par tests/proof/test_positioning.py, qui lit le même config/agents-interdits.json.
 */

/** Plancher : la liste de la charte §9 bis. Elle peut grandir, jamais perdre une expression. */
const PLANCHER = [
  'agent autonome', 'collaborateur IA', 'employé IA', 'assistant IA', 'spécialiste IA', 'agent IA CAC',
  'commissaire aux comptes IA', 'DPO IA', 'embaucher', 'recruter', 'votre nouveau collègue',
  'agent administratif', 'agent comptable',
];
/** Charte §9 : « module » et « complément Excel » ne s'écrivent sur aucune surface publique (test_positioning.py). */
const MOTS_DE_PRODUIT = /\bmodules?\b|\bcompléments?\s+(?:Excel|Memlia)\b/iu;

const specialistes = () => import('../../src/data/specialistes.ts');

/** Toutes les chaînes d'une valeur, avec leur chemin, pour dire où est le mot refusé. */
function chaines(valeur, chemin = '$') {
  if (typeof valeur === 'string') return [[chemin, valeur]];
  if (Array.isArray(valeur)) return valeur.flatMap((element, i) => chaines(element, `${chemin}[${i}]`));
  if (valeur && typeof valeur === 'object') return Object.entries(valeur).flatMap(([cle, element]) => chaines(element, `${chemin}.${cle}`));
  return [];
}

const interdits = lireInterdits();

test('config/agents-interdits.json : la liste de la charte §9 bis, sans doublon ni expression vide', () => {
  assert.ok(Array.isArray(interdits));
  assert.ok(interdits.every((expression) => typeof expression === 'string' && expression.trim() === expression && expression !== ''));
  assert.equal(new Set(interdits.map(normaliser)).size, interdits.length, 'doublon dans la liste');
  assert.deepEqual(PLANCHER.filter((expression) => !interdits.includes(expression)), [], 'expression de la charte retirée de la liste');
});

test('témoins : chaque expression interdite est vue, sous toutes les écritures que la page peut lui donner', () => {
  for (const expression of interdits) {
    const variantes = [
      `Découvrez notre ${expression} dès aujourd’hui.`,
      expression.toUpperCase(),
      expression.replace(/ /g, ' '),
      expression.replace(/ /g, ' '),
      expression.replace(/ /g, '  '),
      `${expression.slice(0, 2)}­${expression.slice(2)}`,
    ];
    for (const variante of variantes) assert.deepEqual(trouverInterdits(variante, [expression]), [expression], JSON.stringify(variante));
  }
  // Le pluriel d'une expression refusée est refusé aussi.
  for (const [pluriel, expression] of [
    ['nos agents autonomes', 'agent autonome'], ['des collaborateurs IA', 'collaborateur IA'], ['les employés IA', 'employé IA'],
    ['vos agents comptables', 'agent comptable'], ['des agents administratifs', 'agent administratif'],
  ]) assert.deepEqual(trouverInterdits(pluriel, interdits), [expression], pluriel);
});

test('témoins : ce que la charte permet passe, dont l’autonomie niée et le métier de recruter', () => {
  for (const permis of [
    'Un agent IA ne travaille jamais en autonomie : il s’arrête dès qu’un cas sort de la règle.',
    'Il ne promet jamais l’autonomie ni un envoi sans validation.',
    'Agents IA pour cabinet d’expertise comptable : chacun prépare un métier, vos collaborateurs valident.',
    'Balthazar, agent IA comptable, prépare les écritures ; votre collaborateur les valide.',
    'Fiche de poste et annonce rédigées ; la réponse à un candidat est envoyée par la personne qui recrute.',
    'Un accusé de réception prêt pour chaque candidat, que le recruteur envoie. Préparer un recrutement.',
    'Raphaël, agent IA RH du cabinet, prépare les documents ; les décisions sur les personnes restent à vous.',
    'Aude prépare la mécanique de vos missions d’audit ; le jugement reste au commissaire aux comptes.',
    'Le délégué à la protection des données reste la personne que vous avez désignée.',
    'Un assistant virtuel ou une assistante de direction.',
  ]) assert.deepEqual(trouverInterdits(permis, interdits), [], permis);
  // Les apostrophes typographiques et droites se valent.
  assert.deepEqual(trouverInterdits('Les devoirs d’aujourd’hui', ["d'aujourd'hui"]), ["d'aujourd'hui"]);
  // Limite connue et assumée : seules les formes écrites dans la liste sont vues (« embaucher », pas « embauchez »).
  assert.deepEqual(trouverInterdits('Embauchez Balthazar.', interdits), []);
});

test('témoin : les mots de produit « module » et « complément Excel » sont vus', () => {
  for (const vu of ['Retrouvez les modules', 'Un module de paie', 'un complément Excel', 'des Compléments Memlia']) assert.equal(MOTS_DE_PRODUIT.test(vu), true, vu);
  for (const absent of ['Compléments greffés', 'un complément d’information sur les outils existants, dont Excel', 'modulaire', 'Excel']) {
    assert.equal(MOTS_DE_PRODUIT.test(absent), false, absent);
  }
});

test('témoin : le parcours des données atteint les chaînes imbriquées, tableaux compris, et dit où elles sont', () => {
  const agents = [{ slug: 'x', fiche: { arrets: ['Un agent autonome'], tachesDepart: [['a', 'DPO IA']] }, nombre: 3, vide: null }];
  const trouves = chaines(agents, 'AGENTS').flatMap(([chemin, texte]) => trouverInterdits(texte, interdits).map((expression) => `${chemin} : ${expression}`));
  assert.deepEqual(trouves, ['AGENTS[0].fiche.arrets[0] : agent autonome', 'AGENTS[0].fiche.tachesDepart[0][1] : DPO IA']);
});

test('I8 : aucune donnée des douze agents ni du hub n’écrit une expression interdite par la charte', async () => {
  const { AGENTS, HUB } = await specialistes();
  assert.equal(AGENTS.length, 12, 'les douze agents');
  assert.ok(HUB && typeof HUB === 'object', 'HUB est exporté par specialistes.ts');
  const textes = [...chaines(AGENTS, 'AGENTS'), ...chaines(HUB, 'HUB')];
  assert.ok(textes.length > 100, `${textes.length} chaînes lues : les données sont vides`);
  const trouves = textes.flatMap(([chemin, texte]) => trouverInterdits(texte, interdits).map((expression) => `${chemin} : « ${expression} » dans « ${texte} »`));
  assert.deepEqual(trouves, []);
});

test('I8 : aucune donnée des agents n’écrit « module » ni « complément Excel » (charte §9)', async () => {
  const { AGENTS, HUB } = await specialistes();
  const textes = [...chaines(AGENTS, 'AGENTS'), ...chaines(HUB, 'HUB')];
  assert.ok(textes.length > 100, `${textes.length} chaînes lues : les données sont vides`);
  assert.deepEqual(textes.filter(([, texte]) => MOTS_DE_PRODUIT.test(normaliser(texte))).map(([chemin, texte]) => `${chemin} : ${texte}`), []);
});
