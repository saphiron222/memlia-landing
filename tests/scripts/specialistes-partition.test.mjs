import test from 'node:test';
import assert from 'node:assert/strict';
import * as familles from '../../src/data/familles.ts';

/*
 * I1 : la partition des familles de tâches entre les douze agents IA, le hub et le bloc « Derrière chaque agent, nous ».
 *
 * Chiffres de docs/strategy/site-v3/hub-agents-ia/AGENTS-CONTENU.md §14 (porte 2, 15/10/2026) :
 *   85 familles existantes = 67 aux agents + 1 au hub + 4 au bloc « nous » + 13 familles CAC inactives sans titulaire ;
 *   21 familles neuves (FAMILLES_HUB) toutes aux agents. Aucun doublon, aucun identifiant inconnu.
 *
 * `src/data/specialistes.ts` et `FAMILLES_HUB` n'existent pas encore (tâche 2) : les contrôles qui les lisent
 * échouent, les témoins de l'instrument (données fictives) passent déjà.
 */

const specialistes = () => import('../../src/data/specialistes.ts');

const SLUGS = [
  'comptabilite', 'paie-social', 'juridique-fiscal', 'finance', 'missions-audit', 'commercial',
  'communication', 'relation-client', 'gestion-cabinet', 'rh-cabinet', 'informatique-outils', 'protection-donnees',
];
/** Le hub garde la famille de l'IA générative en général (ADR 0001). */
const FAMILLES_DU_HUB = ['ia-generative-agents'];
/** Le bloc « Derrière chaque agent, nous » : les quatre familles du pôle `methode-decision-humaine`. */
const FAMILLES_DE_NOUS = ['choisir-cadrer', 'regle-jeu-essai-recette', 'validation-humaine-refus', 'mesure-roi'];
/** Les 21 familles de FAMILLES_HUB et leur agent (AGENTS-CONTENU §14, colonne « Familles neuves proposées »). */
const NEUVES = {
  'paie-social': ['ecritures-de-paie', 'diffusion-documents-paie'],
  'juridique-fiscal': ['liasse-fiscale'],
  finance: ['remuneration-dirigeant'],
  commercial: ['suivi-prospects', 'propositions-mission'],
  communication: ['actualite-a-diffuser', 'lettre-information-clients', 'publications-cabinet'],
  'relation-client': ['suivi-demandes-clients', 'satisfaction-clients'],
  'rh-cabinet': ['indicateurs-sociaux-cabinet'],
  'informatique-outils': ['comptes-acces', 'sauvegardes-mises-a-jour', 'support-outils', 'inventaire-outils', 'migrations-reprises'],
  'protection-donnees': ['registre-traitements', 'demandes-droits', 'durees-conservation', 'incidents-donnees'],
};
/** Titulaires dans les données, jamais affichés ou à écrire avec le cabinet (AGENTS-CONTENU §5 et §11). */
const PARTICULIERS = {
  'audit-legal': 'missions-audit',
  'complements-excel': 'informatique-outils',
  'cac-planification-missions': 'missions-audit',
  'cac-heures-realisees': 'missions-audit',
  'cac-acceptation-mandats': 'missions-audit',
  'cac-attestations-chiffres': 'missions-audit',
};
/** Les 13 familles CAC inactives qu'aucun agent ne porte : comptées et imprimées, jamais perdues en silence. */
const SANS_TITULAIRE = [
  'cac-rapport-apports-fusion', 'cac-rapport-reduction-capital', 'cac-rapport-suppression-dps', 'cac-rapport-transformation',
  'cac-attestation-remunerations', 'cac-procedures-convenues', 'cac-audit-contractuel', 'cac-attestation-depenses-subventionnees',
  'cac-durabilite-indicateurs', 'cac-processus-informations-publiees', 'cac-informations-taxinomie',
  'cac-relance-honoraires', 'cac-declarations-de-la-profession',
];

/**
 * Le contrôle de partition, pur : `toutes` = les familles ({ id, profession, active }), `agents` = { slug, familles }.
 * Rend les erreurs, le titulaire de chaque identifiant et les familles qu'aucun titulaire ne porte.
 */
function analyserPartition({ toutes, agents, hub = FAMILLES_DU_HUB, nous = FAMILLES_DE_NOUS }) {
  const erreurs = [];
  const connues = new Set(toutes.map(({ id }) => id));
  const titulaires = new Map();
  const poser = (id, qui) => {
    if (!connues.has(id)) erreurs.push(`identifiant inconnu « ${id} » (${qui})`);
    else if (titulaires.has(id)) erreurs.push(`doublon « ${id} » : ${titulaires.get(id)} et ${qui}`);
    else titulaires.set(id, qui);
  };
  for (const agent of agents) for (const id of agent.familles) poser(id, agent.slug);
  for (const id of hub) poser(id, 'hub');
  for (const id of nous) poser(id, 'nous');
  const sansTitulaire = toutes.filter(({ id }) => !titulaires.has(id));
  // Seules les familles CAC inactives peuvent rester sans titulaire : une famille active ne se perd pas.
  for (const { id, profession, active } of sansTitulaire) {
    if (!(profession === 'cac' && !active)) erreurs.push(`famille sans titulaire « ${id} » (${profession}, ${active ? 'active' : 'inactive'})`);
  }
  return { erreurs, titulaires, sansTitulaire };
}

/** Une partition valide sur les familles réelles, avec deux agents fictifs : le point de départ des témoins. */
function partitionFictive() {
  const toutes = familles.FAMILLES;
  const retenues = toutes.filter(({ id, profession, active }) => !FAMILLES_DU_HUB.includes(id) && !FAMILLES_DE_NOUS.includes(id) && (profession !== 'cac' || active));
  const milieu = Math.ceil(retenues.length / 2);
  const agents = [
    { slug: 'a', familles: retenues.slice(0, milieu).map(({ id }) => id) },
    { slug: 'b', familles: retenues.slice(milieu).map(({ id }) => id) },
  ];
  return { toutes, agents };
}
const sansElle = (agents, id) => agents.map((agent) => ({ ...agent, familles: agent.familles.filter((autre) => autre !== id) }));

test('témoin : une partition complète des 85 familles existantes ne rend aucune erreur, et laisse seules les CAC inactives', () => {
  const { toutes, agents } = partitionFictive();
  assert.equal(toutes.length, 85);
  const { erreurs, sansTitulaire } = analyserPartition({ toutes, agents });
  assert.deepEqual(erreurs, []);
  assert.equal(sansTitulaire.length, 17, 'les 17 CAC inactives, avant que les agents en prennent quatre');
  assert.ok(sansTitulaire.every(({ profession, active }) => profession === 'cac' && !active));
});

test('témoins : une famille retirée, une famille en double, un identifiant inconnu et un hub dupliqué rougissent', () => {
  const { toutes, agents } = partitionFictive();
  const premiere = agents[0].familles[0];

  // Retirer une famille active : elle n'a plus de titulaire.
  assert.deepEqual(analyserPartition({ toutes, agents: sansElle(agents, premiere) }).erreurs, [`famille sans titulaire « ${premiere} » (ec, active)`]);
  // Retirer une famille CAC active (donc portée) : elle non plus ne peut pas se perdre.
  assert.match(analyserPartition({ toutes, agents: sansElle(agents, 'cac-fec-reception') }).erreurs[0], /cac-fec-reception.*cac, active/u);
  // En dupliquer une chez l'autre agent.
  const doublee = [agents[0], { ...agents[1], familles: [...agents[1].familles, premiere] }];
  assert.deepEqual(analyserPartition({ toutes, agents: doublee }).erreurs, [`doublon « ${premiere} » : a et b`]);
  // Une famille deux fois dans la liste d'un seul agent.
  assert.deepEqual(analyserPartition({ toutes, agents: [{ ...agents[0], familles: [...agents[0].familles, premiere] }, agents[1]] }).erreurs, [`doublon « ${premiere} » : a et a`]);
  // Un identifiant inconnu.
  const inconnue = [agents[0], { ...agents[1], familles: [...agents[1].familles, 'famille-inventee'] }];
  assert.deepEqual(analyserPartition({ toutes, agents: inconnue }).erreurs, ['identifiant inconnu « famille-inventee » (b)']);
  // Un agent qui prend la famille du hub, ou celle du bloc « nous ».
  assert.deepEqual(analyserPartition({ toutes, agents: [{ ...agents[0], familles: [...agents[0].familles, 'ia-generative-agents'] }, agents[1]] }).erreurs, ['doublon « ia-generative-agents » : a et hub']);
  assert.deepEqual(analyserPartition({ toutes, agents: [{ ...agents[0], familles: [...agents[0].familles, 'mesure-roi'] }, agents[1]] }).erreurs, ['doublon « mesure-roi » : a et nous']);
  // Un agent qui prend une CAC inactive : permis, elle sort simplement des familles sans titulaire.
  const prise = analyserPartition({ toutes, agents: [{ ...agents[0], familles: [...agents[0].familles, 'cac-planification-missions'] }, agents[1]] });
  assert.deepEqual(prise.erreurs, []);
  assert.equal(prise.sansTitulaire.length, 16);
});

test('I1 : douze agents, aux identifiants attendus et dans l’ordre du cadrage', async () => {
  const { AGENTS } = await specialistes();
  assert.deepEqual(AGENTS.map(({ slug }) => slug), SLUGS);
  assert.ok(AGENTS.every((agent) => Array.isArray(agent.familles) && agent.familles.length > 0), 'chaque agent a des familles titulaires');
});

test('I1 : 85 familles = 67 aux agents + 1 au hub + 4 au bloc « nous » + 13 CAC inactives sans titulaire, aucun doublon ni identifiant inconnu', async (t) => {
  const { AGENTS } = await specialistes();
  assert.ok(Array.isArray(familles.FAMILLES_HUB), 'FAMILLES_HUB n’est pas exporté par src/data/familles.ts (tâche 2)');
  const toutes = [...familles.FAMILLES, ...familles.FAMILLES_HUB];
  const { erreurs, titulaires, sansTitulaire } = analyserPartition({ toutes, agents: AGENTS });
  assert.deepEqual(erreurs, []);

  const existantes = familles.FAMILLES.map(({ id }) => id);
  assert.equal(existantes.length, 85);
  const qui = (id) => titulaires.get(id);
  const aux = (ce) => existantes.filter((id) => ce(qui(id)));
  assert.equal(aux((q) => q !== undefined && q !== 'hub' && q !== 'nous').length, 67, 'portées par un agent');
  assert.equal(aux((q) => q === 'hub').length, 1, 'portée par le hub');
  assert.equal(aux((q) => q === 'nous').length, 4, 'portées par le bloc « nous »');
  assert.equal(aux((q) => q === undefined).length, 13, 'CAC inactives sans titulaire');
  // Le bloc « nous » est bien le pôle méthode, et le hub la famille de l'IA générative.
  assert.deepEqual(familles.FAMILLES.filter(({ pole }) => pole === 'methode-decision-humaine').map(({ id }) => id).sort(), [...FAMILLES_DE_NOUS].sort());

  // Les treize familles sans titulaire sont celles du récapitulatif, et elles sont imprimées.
  const orphelines = sansTitulaire.map(({ id }) => id);
  assert.deepEqual([...orphelines].sort(), [...SANS_TITULAIRE].sort());
  t.diagnostic(`${orphelines.length} familles CAC inactives sans titulaire : ${orphelines.join(', ')}`);
  t.diagnostic(`partition : ${aux((q) => q && q !== 'hub' && q !== 'nous').length} aux agents, 1 au hub, 4 au bloc nous, ${orphelines.length} sans titulaire, sur ${existantes.length} ; 21 neuves aux agents`);
});

test('I1 : les 21 familles neuves sont toutes assignées, chacune à l’agent du récapitulatif', async () => {
  const { AGENTS } = await specialistes();
  for (const [slug, ids] of Object.entries(NEUVES)) {
    const agent = AGENTS.find((autre) => autre.slug === slug);
    assert.ok(agent, slug);
    for (const id of ids) assert.ok(agent.familles.includes(id), `${slug} ne porte pas ${id}`);
  }
  const portees = new Set(AGENTS.flatMap(({ familles: ids }) => ids));
  assert.deepEqual(Object.values(NEUVES).flat().filter((id) => !portees.has(id)), []);
});

test('I1 : audit-legal et complements-excel ont un titulaire dans les données, comme les quatre CAC inactives d’Aude', async () => {
  const { AGENTS } = await specialistes();
  for (const [id, slug] of Object.entries(PARTICULIERS)) {
    assert.deepEqual(AGENTS.filter((agent) => agent.familles.includes(id)).map((agent) => agent.slug), [slug], id);
  }
});

test('I1 : titulaireDe rend l’agent de chaque famille, et rien pour le hub, le bloc « nous » et les orphelines', async () => {
  const { AGENTS, titulaireDe } = await specialistes();
  assert.equal(typeof titulaireDe, 'function');
  for (const agent of AGENTS) for (const id of agent.familles) assert.equal(titulaireDe(id)?.slug, agent.slug, id);
  for (const id of [...FAMILLES_DU_HUB, ...FAMILLES_DE_NOUS, ...SANS_TITULAIRE, 'famille-inventee']) assert.equal(titulaireDe(id), undefined, id);
});
