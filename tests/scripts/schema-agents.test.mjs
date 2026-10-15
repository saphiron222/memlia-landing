import test from 'node:test';
import assert from 'node:assert/strict';
import * as schema from '../../src/data/schema.mjs';
import { SITE } from '../../src/data/site.mjs';
import { PAGES_V2 } from '../../src/data/pages-v2.mjs';

/*
 * Utilitaires JSON-LD des agents IA (plan 2026-10-15, tâche 3) : gabarits de docs/strategy/site-v3/hub-agents-ia/JSON-LD.md §4,
 * arbitrages de la porte 2 (aucune FAQPage émise, aucun statut d'outil, aucun lien sortant vers un éditeur).
 *
 * Ce que ces tests prouvent, et ce qu'ils ne prouvent pas :
 *  - `assertGraph` : chaque interdit a son témoin (un graphe valide qui passe) ET son mutant (le même graphe avec UN seul
 *    défaut), et le mutant doit lever pour la bonne raison : `violations` ne compte qu'une entrée, qui dit le motif. Un mutant
 *    qui lèverait pour une autre cause ne prouverait rien.
 *  - les constructeurs : le garde se propage s'il est appelé par chacun. Les dates ne sont validées QUE par `assertGraph` : une
 *    date mal formée qui fait lever `hubGraph`, `ficheGraph` ou `outilsGraph` prouve l'appel.
 *  - les neuf fiches n'ont pas encore de contenu (tâches 6 et 9) : `ficheGraph` se joue sur une fiche de fixture qui ne porte
 *    que les champs qu'elle lit. `connecteurs.ts` n'existe pas (tâche 8) : `outilsGraph` se joue sur des connecteurs de fixture.
 *  - le rendu réel (`dist`) relève de `schema-render.test.mjs` et des tâches 4, 6 et 8.
 */

const agents = () => import('../../src/data/schema-agents.mjs');
const donnees = () => import('../../src/data/specialistes.ts');

const KEVIN = `${SITE.url}/a-propos#kevin-kitanga`;
const ORGANIZATION = `${SITE.url}/#organization`;
const WEBSITE = `${SITE.url}/#website`;

const typesDe = (noeud) => [].concat(noeud['@type'] ?? []);
const noeudsDe = (graphe) => graphe['@graph'];
const dePuis = (graphe, type) => noeudsDe(graphe).filter((noeud) => typesDe(noeud).includes(type));
const unique = (graphe, type) => {
  const trouves = dePuis(graphe, type);
  assert.equal(trouves.length, 1, `exactement un ${type} attendu, ${trouves.length} trouvé(s)`);
  return trouves[0];
};
const motEntier = (texte, mot) => new RegExp(`(?<![\\p{L}])${mot}(?![\\p{L}])`, 'iu').test(texte);

/** Lève : une seule violation, et elle dit le motif attendu. */
function leve(graphe, motif, options) {
  let erreur;
  try {
    schema.assertGraph(graphe, options);
  } catch (e) {
    erreur = e;
  }
  assert.ok(erreur, 'assertGraph aurait dû lever');
  assert.equal(erreur.violations?.length, 1, `une seule violation attendue, reçu : ${erreur.message}`);
  assert.match(erreur.violations[0], motif);
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* Fixtures                                                                                                           */
/* ------------------------------------------------------------------------------------------------------------------ */

/** Le hub tel que la tâche 4 le complète : `HUB` ne tient aujourd'hui que route, fil, requête, H1 et définition. */
const hubComplet = (HUB, surcharge = {}) => ({
  ...HUB,
  description: 'Description de test du hub : douze agents IA, un par métier du cabinet.',
  nomListe: 'Les douze agents IA de Memlia',
  datePublication: '2026-10-15',
  dateMiseAJour: '2026-10-16',
  ...surcharge,
});

const QUESTIONS = [
  { question: 'Question de test numéro un ?', reponse: 'Réponse de test numéro un.' },
  { question: 'Question de test numéro deux ?', reponse: 'Réponse de test numéro deux.' },
  { question: 'Question de test numéro trois ?', reponse: 'Réponse de test numéro trois.' },
];

/** Une fiche de fixture : seulement les champs que lit `ficheGraph`. Le H1 ne porte jamais le prénom (D3). */
const ficheDeFixture = (agent, surcharge = {}) => ({
  h1: `Ce que l’agent ${agent.libelle.toLowerCase()} prépare, ce que le cabinet valide`,
  description: `Description de test de la fiche ${agent.libelle}.`,
  serviceType: 'Préparation de tâches répétitives, validée par le cabinet',
  eeat: { auteur: 'kevin', datePublication: '2026-10-15', dateModification: '2026-10-16', sources: [] },
  image: { url: `${SITE.url}/proofs/agents-ia/${agent.slug}.webp`, alt: 'Image de test' },
  faq: { balisage: false, questions: QUESTIONS },
  ...surcharge,
});
const avecFiche = (agent, surcharge) => ({ ...agent, fiche: ficheDeFixture(agent, surcharge) });

const PAGE_OUTILS = {
  chemin: '/integrations',
  h1: 'Les logiciels de votre cabinet, pris en charge',
  description: 'Description de test de la page des logiciels.',
  ariane: 'Logiciels compatibles',
  nomListe: 'Logiciels pris en charge par les agents IA de Memlia',
  datePublication: '2026-09-20',
  dateMiseAJour: '2026-10-15',
};
const CONNECTEURS = [
  { id: 'logiciel-a', nom: 'Logiciel A', editeur: 'Éditeur A', domaine: 'comptabilite', faitAvec: 'Prépare des écritures.', logo: null },
  { id: 'meg-mon-expert-en-gestion', nom: 'MEG (Mon Expert en Gestion)', editeur: 'RCA', domaine: 'gestion', faitAvec: 'Lit les dossiers.', logo: null },
  { id: 'impots-gouv-fr', nom: 'impots.gouv.fr', editeur: 'DGFiP', domaine: 'etat', faitAvec: 'Prépare les pièces.', logo: null, etat: true },
  { id: 'logiciel-d', nom: 'Logiciel D', editeur: 'Éditeur D', domaine: 'paie', faitAvec: 'Contrôle un export.', logo: { src: '/logos/d.svg', alt: 'Logiciel D' }, guides: ['logiciel-d-guide'], agents: ['paie-social'] },
];

/** Un graphe valide, écrit à la main (indépendant des constructeurs) : le témoin de chaque mutant. */
const grapheValide = () => {
  const url = `${SITE.url}/agents-ia/test`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage', '@id': `${url}#page`, url, name: 'Titre', headline: 'Titre', description: 'Description.',
        inLanguage: 'fr-FR', datePublished: '2026-10-15', dateModified: '2026-10-16',
        author: { '@id': KEVIN }, isPartOf: { '@id': WEBSITE },
        mainEntity: { '@id': `${url}#service` }, breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': 'Service', '@id': `${url}#service`, name: 'Titre', alternateName: 'Prénom, agent IA Métier',
        serviceType: 'Type', description: 'Description.', url, image: `${SITE.url}/assets/og-memlia.png`,
        areaServed: 'FR', provider: { '@id': ORGANIZATION },
        audience: { '@type': 'Audience', audienceType: "Cabinets d'expertise comptable" },
        isRelatedTo: [{ '@id': `${SITE.url}/automatisation/paie#service` }],
      },
      schema.organizationNode(),
      {
        '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE.url}/` },
          { '@type': 'ListItem', position: 2, name: 'Agents IA', item: `${SITE.url}/agents-ia` },
          { '@type': 'ListItem', position: 3, name: 'Métier', item: url },
        ],
      },
    ],
  };
};
const noeud = (graphe, type) => noeudsDe(graphe).find((n) => typesDe(n).includes(type));

/* ------------------------------------------------------------------------------------------------------------------ */
/* serviceNode : strictement inchangé                                                                                 */
/* ------------------------------------------------------------------------------------------------------------------ */

test('serviceNode : valeur d’avant la tâche 3, octet pour octet, avant et après agentServiceNode', () => {
  const avant = {
    '@type': 'Service',
    '@id': 'https://memlia.fr/#service',
    name: 'Memlia : automatisation IA du cabinet',
    serviceType: "Automatisation IA pour cabinets d'expertise comptable",
    areaServed: 'FR',
    url: `https://memlia.fr${PAGES_V2.service.chemin}`,
    image: 'https://memlia.fr/assets/og-memlia.png',
    description: PAGES_V2.service.description,
    provider: { '@id': 'https://memlia.fr/#organization' },
    audience: { '@type': 'Audience', audienceType: "Cabinets d'expertise comptable" },
  };
  assert.deepEqual(schema.serviceNode(), avant);
  schema.agentServiceNode({
    chemin: '/agents-ia/test', name: 'Titre', serviceType: 'Type', description: 'Description.',
    image: `${SITE.url}/assets/og-memlia.png`, prenom: 'Prénom', libelle: 'Métier',
  });
  assert.deepEqual(schema.serviceNode(), avant);
});

/* ------------------------------------------------------------------------------------------------------------------ */
/* pageId                                                                                                             */
/* ------------------------------------------------------------------------------------------------------------------ */

test('pageId : chemin absolu du site + suffixe', () => {
  assert.equal(schema.pageId('/agents-ia', 'page'), 'https://memlia.fr/agents-ia#page');
  assert.equal(schema.pageId('/', 'breadcrumb'), 'https://memlia.fr/#breadcrumb');
});

test('pageId : lève sur un chemin sans « / » initial, avec « # » ou « ? », ou un suffixe vide', () => {
  for (const chemin of ['agents-ia', '', '/agents-ia#page', '/agents-ia?x=1', 'https://memlia.fr/agents-ia', '/agents ia', undefined]) {
    assert.throws(() => schema.pageId(chemin, 'page'), /chemin/i, `chemin ${JSON.stringify(chemin)}`);
  }
  for (const suffixe of ['', '#page', ' ', undefined]) {
    assert.throws(() => schema.pageId('/agents-ia', suffixe), /suffixe/i, `suffixe ${JSON.stringify(suffixe)}`);
  }
});

/* ------------------------------------------------------------------------------------------------------------------ */
/* breadcrumbNode                                                                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

test('breadcrumbNode : Accueil, parents, page ; positions 1..n, item en https, dernier = canonique', () => {
  const fil = schema.breadcrumbNode({ chemin: '/agents-ia/test', name: 'Métier', parents: [{ name: 'Agents IA', chemin: '/agents-ia' }] });
  assert.equal(fil['@type'], 'BreadcrumbList');
  assert.equal(fil['@id'], `${SITE.url}/agents-ia/test#breadcrumb`);
  assert.deepEqual(fil.itemListElement, [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE.url}/` },
    { '@type': 'ListItem', position: 2, name: 'Agents IA', item: `${SITE.url}/agents-ia` },
    { '@type': 'ListItem', position: 3, name: 'Métier', item: `${SITE.url}/agents-ia/test` },
  ]);
});

test('breadcrumbNode : sans parent, deux niveaux ; les parents d’entrée ne sont pas modifiés', () => {
  assert.equal(schema.breadcrumbNode({ chemin: '/agents-ia', name: 'Agents IA' }).itemListElement.length, 2);
  const parents = Object.freeze([Object.freeze({ name: 'Agents IA', chemin: '/agents-ia' })]);
  assert.equal(schema.breadcrumbNode({ chemin: '/agents-ia/test', name: 'Métier', parents }).itemListElement.length, 3);
});

test('breadcrumbNode : lève sur un nom vide, un chemin relatif, un doublon', () => {
  const parent = { name: 'Agents IA', chemin: '/agents-ia' };
  assert.throws(() => schema.breadcrumbNode({ chemin: '/agents-ia/test', name: '  ', parents: [parent] }), /nom/i);
  assert.throws(() => schema.breadcrumbNode({ chemin: '/agents-ia/test', name: '', parents: [parent] }), /nom/i);
  assert.throws(() => schema.breadcrumbNode({ chemin: '/agents-ia/test', name: 'Métier', parents: [{ name: '', chemin: '/agents-ia' }] }), /nom/i);
  assert.throws(() => schema.breadcrumbNode({ chemin: 'agents-ia/test', name: 'Métier' }), /chemin/i);
  assert.throws(() => schema.breadcrumbNode({ chemin: '/agents-ia/test', name: 'Métier', parents: [{ name: 'Agents IA', chemin: 'agents-ia' }] }), /chemin/i);
  assert.throws(() => schema.breadcrumbNode({ chemin: '/agents-ia', name: 'Agents IA', parents: [parent] }), /doublon/i);
  assert.throws(() => schema.breadcrumbNode({ chemin: '/agents-ia/test', name: 'Métier', parents: [parent, parent] }), /doublon/i);
  assert.throws(() => schema.breadcrumbNode({ chemin: '/', name: 'Accueil' }), /doublon/i);
});

/* ------------------------------------------------------------------------------------------------------------------ */
/* itemListNode                                                                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

const ELEMENTS = [
  { name: 'Un', url: `${SITE.url}/un`, description: 'Premier.' },
  { name: 'Deux', url: `${SITE.url}/deux` },
  { name: 'Trois', url: `${SITE.url}/trois#ancre`, description: 'Troisième.' },
];

test('itemListNode : numberOfItems = nombre d’éléments, positions contiguës, description seulement si donnée', () => {
  const liste = schema.itemListNode({ chemin: '/agents-ia', name: 'Liste', items: ELEMENTS });
  assert.equal(liste['@type'], 'ItemList');
  assert.equal(liste['@id'], `${SITE.url}/agents-ia#items`);
  assert.equal(liste.numberOfItems, 3);
  assert.equal(liste.itemListElement.length, liste.numberOfItems);
  assert.deepEqual(liste.itemListElement.map((e) => e.position), [1, 2, 3]);
  assert.deepEqual(liste.itemListElement.map((e) => e.url), ELEMENTS.map((e) => e.url));
  assert.ok(liste.itemListElement.every((e) => e['@type'] === 'ListItem'));
  assert.equal(liste.itemListElement[0].description, 'Premier.');
  assert.ok(!('description' in liste.itemListElement[1]), 'pas de description donnée, pas de clé');
});

test('itemListNode : @id personnalisable ; la liste d’entrée n’est pas modifiée', () => {
  const entree = Object.freeze(ELEMENTS.map((e) => Object.freeze({ ...e })));
  const liste = schema.itemListNode({ chemin: '/agents-ia', name: 'Liste', items: entree, id: `${SITE.url}/agents-ia#autre` });
  assert.equal(liste['@id'], `${SITE.url}/agents-ia#autre`);
});

test('itemListNode : lève sur une liste vide, une url relative ou en double, un nom vide', () => {
  const liste = (items, name = 'Liste') => () => schema.itemListNode({ chemin: '/agents-ia', name, items });
  assert.throws(liste([]), /vide/i);
  assert.throws(liste(undefined), /vide|liste/i);
  assert.throws(liste([{ name: 'Un', url: '/un' }]), /url/i);
  assert.throws(liste([{ name: 'Un', url: 'http://memlia.fr/un' }]), /url/i);
  assert.throws(liste([{ name: 'Un', url: `${SITE.url}/un` }, { name: 'Bis', url: `${SITE.url}/un` }]), /doublon/i);
  assert.throws(liste([{ name: '', url: `${SITE.url}/un` }]), /nom/i);
  assert.throws(liste(ELEMENTS, ''), /nom/i);
});

/* ------------------------------------------------------------------------------------------------------------------ */
/* collectionPageNode, webPageNode                                                                                    */
/* ------------------------------------------------------------------------------------------------------------------ */

const entreePage = {
  chemin: '/agents-ia', h1: 'Titre', description: 'Description.',
  datePublication: '2026-10-15', dateModification: '2026-10-16', auteurId: KEVIN,
};

test('collectionPageNode : CollectionPage, name = headline, renvois par @id vers fil et liste', () => {
  const page = schema.collectionPageNode({ ...entreePage, about: `${SITE.url}/#service` });
  assert.deepEqual(page, {
    '@type': 'CollectionPage', '@id': `${SITE.url}/agents-ia#page`, url: `${SITE.url}/agents-ia`,
    name: 'Titre', headline: 'Titre', description: 'Description.', inLanguage: 'fr-FR',
    datePublished: '2026-10-15', dateModified: '2026-10-16',
    author: { '@id': KEVIN }, isPartOf: { '@id': WEBSITE }, about: { '@id': `${SITE.url}/#service` },
    breadcrumb: { '@id': `${SITE.url}/agents-ia#breadcrumb` }, mainEntity: { '@id': `${SITE.url}/agents-ia#items` },
  });
});

test('collectionPageNode : sans « about », la clé n’existe pas ; champs obligatoires', () => {
  assert.ok(!('about' in schema.collectionPageNode(entreePage)));
  for (const champ of ['chemin', 'h1', 'description', 'datePublication', 'dateModification', 'auteurId']) {
    assert.throws(() => schema.collectionPageNode({ ...entreePage, [champ]: undefined }), new RegExp(champ), champ);
    assert.throws(() => schema.collectionPageNode({ ...entreePage, [champ]: '  ' }), new RegExp(champ), `${champ} vide`);
  }
});

test('webPageNode : WebPage, name = headline = h1, mainEntity et fil par @id', () => {
  const page = schema.webPageNode({ ...entreePage, chemin: '/agents-ia/test', mainEntityId: `${SITE.url}/agents-ia/test#service` });
  assert.deepEqual(page, {
    '@type': 'WebPage', '@id': `${SITE.url}/agents-ia/test#page`, url: `${SITE.url}/agents-ia/test`,
    name: 'Titre', headline: 'Titre', description: 'Description.', inLanguage: 'fr-FR',
    datePublished: '2026-10-15', dateModified: '2026-10-16',
    author: { '@id': KEVIN }, isPartOf: { '@id': WEBSITE },
    mainEntity: { '@id': `${SITE.url}/agents-ia/test#service` }, breadcrumb: { '@id': `${SITE.url}/agents-ia/test#breadcrumb` },
  });
  assert.throws(() => schema.webPageNode({ ...entreePage, chemin: '/agents-ia/test' }), /mainEntityId/);
});

/* ------------------------------------------------------------------------------------------------------------------ */
/* agentServiceNode                                                                                                   */
/* ------------------------------------------------------------------------------------------------------------------ */

const entreeService = {
  chemin: '/agents-ia/comptabilite', name: 'Ce que l’agent prépare', serviceType: 'Type de service', description: 'Description.',
  image: `${SITE.url}/proofs/agents-ia/comptabilite.webp`, prenom: 'Balthazar', libelle: 'Comptabilité',
};

test('agentServiceNode : @id = url#service, fournisseur, zone, public ; le prénom seulement dans alternateName', () => {
  const service = schema.agentServiceNode(entreeService);
  assert.equal(service['@type'], 'Service');
  assert.equal(service['@id'], `${SITE.url}/agents-ia/comptabilite#service`);
  assert.equal(service.url, `${SITE.url}/agents-ia/comptabilite`);
  assert.equal(service.provider['@id'], schema.ORGANIZATION_ID);
  assert.equal(service.areaServed, 'FR');
  assert.deepEqual(service.audience, { '@type': 'Audience', audienceType: schema.DEFAULT_AUDIENCE_TYPE });
  assert.equal(service.image, entreeService.image, 'l’image de la fiche remplace celle du service global');
  assert.equal(service.alternateName, 'Balthazar, agent IA Comptabilité');
  assert.ok(service.alternateName.includes('Balthazar'));
  for (const champ of ['name', 'url', 'serviceType', 'description', '@id']) {
    assert.ok(!service[champ].includes('Balthazar'), `${champ} ne porte pas le prénom`);
  }
  assert.ok(!('isRelatedTo' in service), 'aucun service lié, aucune clé');
});

test('agentServiceNode : isRelatedTo = renvois par @id, absent quand la liste est vide', () => {
  const ids = [`${SITE.url}/automatisation/saisie-comptable#service`, `${SITE.url}/automatisation/notes-de-frais#service`];
  assert.deepEqual(schema.agentServiceNode({ ...entreeService, servicesLiesIds: ids }).isRelatedTo, ids.map((id) => ({ '@id': id })));
  assert.ok(!('isRelatedTo' in schema.agentServiceNode({ ...entreeService, servicesLiesIds: [] })));
});

test('agentServiceNode : lève sur le prénom dans le nom (D3), une image relative, un champ manquant', () => {
  assert.throws(() => schema.agentServiceNode({ ...entreeService, name: 'Balthazar prépare vos écritures' }), /prénom/i);
  assert.throws(() => schema.agentServiceNode({ ...entreeService, name: 'BALTHAZAR prépare vos écritures' }), /prénom/i);
  assert.throws(() => schema.agentServiceNode({ ...entreeService, image: '/proofs/agents-ia/comptabilite.webp' }), /image/i);
  assert.throws(() => schema.agentServiceNode({ ...entreeService, image: undefined }), /image/i);
  for (const champ of ['name', 'serviceType', 'description', 'prenom', 'libelle']) {
    assert.throws(() => schema.agentServiceNode({ ...entreeService, [champ]: '' }), new RegExp(champ), champ);
  }
});

test('agentServiceNode : le prénom se refuse en mot entier, pas à l’intérieur d’un autre mot', () => {
  // Début de mot : « Prudence » n'est pas dans « imprudence » (seul le garde « pas de lettre avant » le sait).
  assert.doesNotThrow(() => schema.agentServiceNode({ ...entreeService, name: 'Une imprudence coûteuse', prenom: 'Prudence' }));
  // Fin de mot : « Florent » n'est pas dans « florentin » (seul le garde « pas de lettre après » le sait).
  assert.doesNotThrow(() => schema.agentServiceNode({ ...entreeService, name: 'Le tableau florentin', prenom: 'Florent' }));
  assert.throws(() => schema.agentServiceNode({ ...entreeService, name: 'Prudence prépare', prenom: 'Prudence' }), /prénom/i);
  assert.throws(() => schema.agentServiceNode({ ...entreeService, name: 'Ce que Florent, prépare', prenom: 'Florent' }), /prénom/i);
  assert.throws(() => schema.agentServiceNode({ ...entreeService, name: 'Émile et le cabinet', prenom: 'Émile' }), /prénom/i, 'lettre accentuée en tête de mot');
});

/* ------------------------------------------------------------------------------------------------------------------ */
/* faqPageNode                                                                                                        */
/* ------------------------------------------------------------------------------------------------------------------ */

test('faqPageNode : FAQPage rattachée au service, une Question par entrée', () => {
  const serviceId = `${SITE.url}/agents-ia/comptabilite#service`;
  const faq = schema.faqPageNode({ chemin: '/agents-ia/comptabilite', serviceId, questions: QUESTIONS });
  assert.equal(faq['@type'], 'FAQPage');
  assert.equal(faq['@id'], `${SITE.url}/agents-ia/comptabilite#faq`);
  assert.equal(faq.inLanguage, 'fr-FR');
  assert.deepEqual(faq.about, { '@id': serviceId });
  assert.deepEqual(faq.mainEntity, QUESTIONS.map((q) => ({
    '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: q.reponse },
  })));
});

test('faqPageNode : lève sous trois questions, sur une question ou une réponse vide', () => {
  const serviceId = `${SITE.url}/agents-ia/comptabilite#service`;
  const faq = (questions) => () => schema.faqPageNode({ chemin: '/agents-ia/comptabilite', serviceId, questions });
  assert.throws(faq(QUESTIONS.slice(0, 2)), /trois|3/i);
  assert.throws(faq([]), /trois|3/i);
  assert.throws(faq([...QUESTIONS.slice(0, 2), { question: '', reponse: 'x' }]), /question/i);
  assert.throws(faq([...QUESTIONS.slice(0, 2), { question: 'x ?', reponse: ' ' }]), /réponse/i);
});

/* ------------------------------------------------------------------------------------------------------------------ */
/* assertGraph : témoins                                                                                              */
/* ------------------------------------------------------------------------------------------------------------------ */

test('assertGraph : un graphe de fiche valide passe, et ne rend rien', () => {
  assert.equal(schema.assertGraph(grapheValide()), undefined);
});

test('assertGraph : les renvois par @id ne sont pas des doublons, même vers une définition du graphe', () => {
  const graphe = grapheValide();
  // `mainEntity` et `breadcrumb` renvoient déjà aux @id définis plus bas ; on y ajoute un second renvoi vers le service.
  noeud(graphe, 'WebPage').about = { '@id': noeud(graphe, 'Service')['@id'] };
  assert.doesNotThrow(() => schema.assertGraph(graphe));
});

test('assertGraph : une FAQPage et ses Question/Answer ne sont pas des interdits', () => {
  const graphe = grapheValide();
  const service = noeud(graphe, 'Service');
  noeudsDe(graphe).push(schema.faqPageNode({ chemin: '/agents-ia/test', serviceId: service['@id'], questions: QUESTIONS }));
  assert.doesNotThrow(() => schema.assertGraph(graphe));
});

test('assertGraph : un objet qui se contient lui-même est signalé « circulaire », et le parcours s’arrête', () => {
  const graphe = grapheValide();
  const boucle = { '@type': 'Thing', name: 'Boucle' };
  boucle.partie = boucle;
  noeudsDe(graphe).push(boucle);
  leve(graphe, /circulaire/);
});

test('assertGraph : servicesMax relève la limite sans lever les autres', () => {
  const graphe = grapheValide();
  noeudsDe(graphe).push({ ...noeud(graphe, 'Service'), '@id': `${SITE.url}/agents-ia/test#service-bis` });
  assert.doesNotThrow(() => schema.assertGraph(graphe, { servicesMax: 2 }));
  leve(graphe, /Service/);
});

/* ------------------------------------------------------------------------------------------------------------------ */
/* assertGraph : un mutant par interdit de la tâche 3                                                                 */
/* ------------------------------------------------------------------------------------------------------------------ */

test('assertGraph MUTANT Person : un nœud Person', () => {
  const graphe = grapheValide();
  noeudsDe(graphe).push({ '@type': 'Person', '@id': KEVIN, name: 'Kevin Kitanga' });
  leve(graphe, /Person/);
});

test('assertGraph MUTANT SoftwareApplication : un nœud SoftwareApplication', () => {
  const graphe = grapheValide();
  noeudsDe(graphe).push({ '@type': 'SoftwareApplication', '@id': `${SITE.url}/agents-ia/test#logiciel`, name: 'Agent' });
  leve(graphe, /SoftwareApplication/);
});

test('assertGraph MUTANT offers : une offre complète sur le Service est refusée, offers en tête', () => {
  const graphe = grapheValide();
  noeud(graphe, 'Service').offers = { '@type': 'Offer', price: '0' };
  let erreur;
  try { schema.assertGraph(graphe); } catch (e) { erreur = e; }
  assert.ok(erreur, 'assertGraph aurait dû lever');
  assert.ok(erreur.violations.some((v) => /offers/.test(v)), erreur.message);
});

test('assertGraph MUTANT offers : la seule clé offers, sans type ni prix', () => {
  const graphe = grapheValide();
  noeud(graphe, 'Service').offers = [];
  leve(graphe, /offers/);
});

test('assertGraph MUTANT aggregateRating : une clé aggregateRating sur le Service', () => {
  const graphe = grapheValide();
  noeud(graphe, 'Service').aggregateRating = 5;
  leve(graphe, /aggregateRating/);
});

test('assertGraph MUTANT review : une clé review sur le Service', () => {
  const graphe = grapheValide();
  noeud(graphe, 'Service').review = 'Excellent';
  leve(graphe, /review/);
});

test('assertGraph MUTANT @id dupliqué : deux nœuds définis sous le même @id', () => {
  const graphe = grapheValide();
  noeudsDe(graphe).push({ '@type': 'ItemList', '@id': noeud(graphe, 'Service')['@id'], name: 'Doublon', numberOfItems: 0, itemListElement: [] });
  leve(graphe, /@id.*(double|dupliqu)/i);
});

test('assertGraph MUTANT @id dupliqué : une définition imbriquée reprend l’@id d’un nœud du graphe', () => {
  const graphe = grapheValide();
  noeud(graphe, 'Service').provider = { '@id': ORGANIZATION, '@type': 'Organization', name: 'Memlia bis' };
  leve(graphe, /@id.*(double|dupliqu)/i);
});

test('assertGraph MUTANT URL relative : url d’un nœud', () => {
  const graphe = grapheValide();
  noeud(graphe, 'Service').url = '/agents-ia/test';
  leve(graphe, /url.*(relative|absolu|https)/i);
});

test('assertGraph MUTANT URL relative : item du fil d’Ariane', () => {
  const graphe = grapheValide();
  noeud(graphe, 'BreadcrumbList').itemListElement[1].item = '/agents-ia';
  leve(graphe, /item.*(relative|absolu|https)/i);
});

test('assertGraph MUTANT plus d’un Service : un second nœud Service', () => {
  const graphe = grapheValide();
  noeudsDe(graphe).push({ ...noeud(graphe, 'Service'), '@id': `${SITE.url}/agents-ia/test#service-2` });
  leve(graphe, /Service/);
});

test('assertGraph MUTANT plus d’un Service : un Service imbriqué compte aussi', () => {
  const graphe = grapheValide();
  noeud(graphe, 'WebPage').about = { '@type': 'Service', name: 'Autre', provider: { '@id': ORGANIZATION } };
  leve(graphe, /Service/);
});

/* ------------------------------------------------------------------------------------------------------------------ */
/* assertGraph : le reste de la liste de JSON-LD.md §3, un mutant chacun                                              */
/* ------------------------------------------------------------------------------------------------------------------ */

for (const type of ['Person', 'SoftwareApplication', 'WebApplication', 'MobileApplication', 'Offer', 'AggregateOffer', 'Review', 'Rating', 'AggregateRating']) {
  test(`assertGraph MUTANT type interdit ${type} : imbriqué sous author`, () => {
    const graphe = grapheValide();
    noeud(graphe, 'WebPage').author = { '@type': type, name: 'x' };
    leve(graphe, new RegExp(`\\b${type}\\b`));
  });
}

test('assertGraph MUTANT type interdit : dans un @type en tableau', () => {
  const graphe = grapheValide();
  noeud(graphe, 'Service')['@type'] = ['Service', 'SoftwareApplication'];
  leve(graphe, /SoftwareApplication/);
});

for (const propriete of ['offers', 'aggregateRating', 'review', 'price', 'priceCurrency', 'priceSpecification', 'priceRange', 'hasOfferCatalog', 'applicationCategory', 'operatingSystem']) {
  test(`assertGraph MUTANT propriété interdite ${propriete}`, () => {
    const graphe = grapheValide();
    noeud(graphe, 'Service')[propriete] = 'x';
    leve(graphe, new RegExp(propriete));
  });
}

test('assertGraph MUTANT @context : autre que https://schema.org', () => {
  for (const contexte of ['http://schema.org', 'https://schema.org/', undefined]) {
    const graphe = grapheValide();
    graphe['@context'] = contexte;
    leve(graphe, /@context/);
  }
});

test('assertGraph MUTANT forme : pas de @graph en tableau', () => {
  assert.throws(() => schema.assertGraph({ '@context': 'https://schema.org' }), /@graph/);
  assert.throws(() => schema.assertGraph({ '@context': 'https://schema.org', '@graph': {} }), /@graph/);
  assert.throws(() => schema.assertGraph(undefined), /graphe|@graph/i);
});

test('assertGraph MUTANT URL : http:// n’est pas https://, ni @id, image ou logo relatifs', () => {
  const cas = [
    [(g) => { noeud(g, 'Service').url = 'http://memlia.fr/agents-ia/test'; }, /url/],
    [(g) => { noeud(g, 'Service').image = '/assets/og-memlia.png'; }, /image/],
    [(g) => { noeud(g, 'Organization').logo = '/apple-touch-icon.png'; }, /logo/],
    [(g) => { noeud(g, 'WebPage').author = { '@id': '/a-propos#kevin-kitanga' }; }, /@id.*(relative|absolu|https)/i],
    [(g) => { noeud(g, 'Organization').sameAs = ['https://www.pappers.fr/x', '/societe']; }, /sameAs/],
  ];
  for (const [mute, motif] of cas) {
    const graphe = grapheValide();
    mute(graphe);
    leve(graphe, motif);
  }
});

test('assertGraph MUTANT date : hors YYYY-MM-DD, impossible ou inversée', () => {
  const cas = [
    [(p) => { p.datePublished = '14/10/2026'; }, /datePublished/],
    [(p) => { p.dateModified = '2026-10-16T08:00:00Z'; }, /dateModified/],
    [(p) => { p.datePublished = '2026-02-30'; }, /datePublished/],
    [(p) => { p.dateModified = '2026-10-14'; }, /dateModified.*datePublished|antérieure/i],
  ];
  for (const [mute, motif] of cas) {
    const graphe = grapheValide();
    mute(noeud(graphe, 'WebPage'));
    leve(graphe, motif);
  }
});

test('assertGraph MUTANT fil d’Ariane : absent, double, dernier élément ≠ url de la page, positions rompues', () => {
  const sans = grapheValide();
  sans['@graph'] = noeudsDe(sans).filter((n) => !typesDe(n).includes('BreadcrumbList'));
  leve(sans, /BreadcrumbList/);

  const double = grapheValide();
  noeudsDe(double).push({ ...noeud(double, 'BreadcrumbList'), '@id': `${SITE.url}/agents-ia/test#breadcrumb-2` });
  leve(double, /BreadcrumbList/);

  const autre = grapheValide();
  noeud(autre, 'BreadcrumbList').itemListElement[2].item = `${SITE.url}/agents-ia/autre`;
  leve(autre, /dernier|canonique|url de la page/i);

  const positions = grapheValide();
  noeud(positions, 'BreadcrumbList').itemListElement[1].position = 5;
  leve(positions, /position/i);

  const nom = grapheValide();
  noeud(nom, 'BreadcrumbList').itemListElement[1].name = ' ';
  leve(nom, /name|nom/i);
});

test('assertGraph MUTANT page : deux pages, ou aucune page à laquelle comparer le fil', () => {
  const deux = grapheValide();
  noeudsDe(deux).push({ ...noeud(deux, 'WebPage'), '@id': `${SITE.url}/agents-ia/test#page-2` });
  leve(deux, /page/i);

  const aucune = grapheValide();
  aucune['@graph'] = noeudsDe(aucune).filter((n) => !typesDe(n).includes('WebPage'));
  leve(aucune, /page/i);
});

/* ------------------------------------------------------------------------------------------------------------------ */
/* grapheVerifie : les options d'assertGraph passent, le hub et la page des logiciels n'admettent aucun Service         */
/* ------------------------------------------------------------------------------------------------------------------ */

test('grapheVerifie : transmet servicesMax à assertGraph ; sans option, un Service passe, avec 0, il lève', async () => {
  const { grapheVerifie } = await agents();
  const noeuds = grapheValide()['@graph'];
  assert.doesNotThrow(() => grapheVerifie(structuredClone(noeuds)));
  assert.throws(() => grapheVerifie(structuredClone(noeuds), { servicesMax: 0 }), (e) => e.violations?.length === 1 && /Service/.test(e.violations[0]));
});

test('hubGraph et outilsGraph appellent le garde avec servicesMax: 0 ; ficheGraph garde la limite d’un Service', async () => {
  // Un nœud Service ne peut pas entrer dans ces graphes par leurs paramètres : la limite se lit à l'appel du garde.
  const { readFileSync } = await import('node:fs');
  const source = readFileSync(new URL('../../src/data/schema-agents.mjs', import.meta.url), 'utf8');
  const corps = (nom) => source.slice(source.indexOf(`export function ${nom}(`), source.indexOf('\n}\n', source.indexOf(`export function ${nom}(`)));
  assert.match(corps('hubGraph'), /grapheVerifie\(\[[\s\S]*\], \{ servicesMax: 0 \}\)/);
  assert.match(corps('outilsGraph'), /grapheVerifie\(\[[\s\S]*\], \{ servicesMax: 0 \}\)/);
  assert.doesNotMatch(corps('ficheGraph'), /servicesMax/);
});

/* ------------------------------------------------------------------------------------------------------------------ */
/* hubGraph                                                                                                           */
/* ------------------------------------------------------------------------------------------------------------------ */

test('hubGraph : CollectionPage + ItemList, 0 Service, 12 éléments, fil à deux niveaux', async () => {
  const { hubGraph } = await agents();
  const { HUB, AGENTS } = await donnees();
  const hub = hubComplet(HUB);
  const graphe = hubGraph(hub, AGENTS);

  assert.equal(graphe['@context'], 'https://schema.org');
  assert.deepEqual(noeudsDe(graphe).map((n) => n['@type']), ['CollectionPage', 'ItemList', 'Organization', 'BreadcrumbList']);
  assert.equal(dePuis(graphe, 'Service').length, 0, 'aucun Service au hub');

  const page = unique(graphe, 'CollectionPage');
  assert.equal(page['@id'], `${SITE.url}/agents-ia#page`);
  assert.equal(page.url, `${SITE.url}/agents-ia`);
  assert.equal(page.name, hub.h1);
  assert.equal(page.headline, hub.h1);
  assert.equal(page.description, hub.description);
  assert.equal(page.datePublished, '2026-10-15');
  assert.equal(page.dateModified, '2026-10-16');
  assert.deepEqual(page.author, { '@id': KEVIN });
  assert.deepEqual(page.about, { '@id': `${SITE.url}/#service` });
  assert.deepEqual(page.mainEntity, { '@id': `${SITE.url}/agents-ia#items` });
  assert.deepEqual(page.breadcrumb, { '@id': `${SITE.url}/agents-ia#breadcrumb` });

  const fil = unique(graphe, 'BreadcrumbList');
  assert.equal(fil['@id'], page.breadcrumb['@id']);
  assert.deepEqual(fil.itemListElement.map((e) => [e.position, e.name, e.item]), [
    [1, 'Accueil', `${SITE.url}/`],
    [2, 'Agents IA', `${SITE.url}/agents-ia`],
  ]);
  assert.equal(fil.itemListElement.at(-1).item, page.url, 'dernier élément = la canonique');
});

test('hubGraph : ItemList à douze éléments, un par agent, dans l’ordre, vers sa destination', async () => {
  const { hubGraph } = await agents();
  const { HUB, AGENTS } = await donnees();
  const graphe = hubGraph(hubComplet(HUB), AGENTS);
  const liste = unique(graphe, 'ItemList');

  assert.equal(liste.numberOfItems, 12);
  assert.equal(liste.itemListElement.length, 12);
  assert.equal(liste.numberOfItems, AGENTS.length);
  assert.equal(liste['@id'], `${SITE.url}/agents-ia#items`);
  assert.equal(liste.name, 'Les douze agents IA de Memlia');
  assert.deepEqual(liste.itemListElement.map((e) => e.position), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  assert.equal(new Set(liste.itemListElement.map((e) => e.url)).size, 12, 'douze URL distinctes');

  AGENTS.forEach((agent, i) => {
    const attendu = agent.destination.type === 'page' ? agent.destination.chemin : `/agents-ia/${agent.slug}`;
    const element = liste.itemListElement[i];
    assert.equal(element['@type'], 'ListItem');
    assert.equal(element.name, agent.libelle);
    assert.equal(element.url, `${SITE.url}${attendu}`);
    assert.equal(element.description, agent.ligne);
  });
  const destinations = liste.itemListElement.map((e) => e.url.replace(SITE.url, ''));
  for (const chemin of ['/automatisation/paie', '/commissaires-aux-comptes', '/integrations']) {
    assert.equal(destinations.filter((d) => d === chemin).length, 1, `${chemin} apparaît une fois`);
  }
  assert.equal(destinations.filter((d) => d.startsWith('/agents-ia/')).length, 9, 'neuf fiches');
});

test('hubGraph : numberOfItems suit le tableau reçu, jamais un 12 en dur', async () => {
  const { hubGraph } = await agents();
  const { HUB, AGENTS } = await donnees();
  const liste = unique(hubGraph(hubComplet(HUB), AGENTS.slice(0, 5)), 'ItemList');
  assert.equal(liste.numberOfItems, 5);
  assert.equal(liste.itemListElement.length, 5);
});

test('hubGraph : ni Person, ni logiciel, ni offre ; aucun prénom dans un nom ou un titre', async () => {
  const { hubGraph } = await agents();
  const { HUB, AGENTS } = await donnees();
  const graphe = hubGraph(hubComplet(HUB), AGENTS);
  const texte = JSON.stringify(graphe);
  for (const interdit of ['"Person"', 'SoftwareApplication', '"offers"', 'aggregateRating', '"review"', '"FAQPage"']) {
    assert.ok(!texte.includes(interdit), `${interdit} absent du hub`);
  }
  assert.ok(!AGENTS.some((a) => motEntier(texte, a.prenom)), 'le hub ne cite aucun prénom dans son JSON-LD');
});

test('hubGraph : n’altère ni le hub ni les agents reçus', async () => {
  const { hubGraph } = await agents();
  const { HUB, AGENTS } = await donnees();
  const hub = structuredClone(hubComplet(HUB));
  const liste = structuredClone(AGENTS);
  hubGraph(hub, liste);
  assert.deepEqual(hub, hubComplet(HUB));
  assert.deepEqual(liste, AGENTS);
});

test('hubGraph : lève quand un champ du hub manque, sur un tableau vide, sur une date mal formée (garde appelé)', async () => {
  const { hubGraph } = await agents();
  const { HUB, AGENTS } = await donnees();
  for (const champ of ['description', 'nomListe', 'datePublication', 'dateMiseAJour', 'h1', 'chemin', 'ariane']) {
    assert.throws(() => hubGraph(hubComplet(HUB, { [champ]: undefined }), AGENTS), new RegExp(champ), champ);
  }
  assert.throws(() => hubGraph(hubComplet(HUB), []), /vide/i);
  // Les dates ne sont validées que par assertGraph : cette levée prouve que hubGraph l'appelle.
  assert.throws(() => hubGraph(hubComplet(HUB, { dateMiseAJour: '15/10/2026' }), AGENTS), /assertGraph.*dateModified|dateModified.*assertGraph/s);
  assert.throws(() => hubGraph(hubComplet(HUB, { dateMiseAJour: '2026-10-14' }), AGENTS), /assertGraph/);
});

/* ------------------------------------------------------------------------------------------------------------------ */
/* ficheGraph                                                                                                         */
/* ------------------------------------------------------------------------------------------------------------------ */

test('ficheGraph : exactement un Service ; le prénom dans alternateName seulement ; fil à trois niveaux', async () => {
  const { ficheGraph } = await agents();
  const { AGENTS, HUB } = await donnees();
  const comptabilite = avecFiche(AGENTS.find((a) => a.slug === 'comptabilite'));
  const graphe = ficheGraph(comptabilite);

  assert.equal(graphe['@context'], 'https://schema.org');
  assert.deepEqual(noeudsDe(graphe).map((n) => n['@type']), ['WebPage', 'Service', 'Organization', 'BreadcrumbList']);

  const url = `${SITE.url}/agents-ia/comptabilite`;
  const service = unique(graphe, 'Service');
  assert.equal(service['@id'], `${url}#service`);
  assert.equal(service.url, url);
  assert.equal(service.alternateName, 'Balthazar, agent IA Comptabilité');
  assert.ok(service.alternateName.includes(comptabilite.prenom));
  assert.ok(!service.name.includes(comptabilite.prenom), 'name sans le prénom');
  assert.equal(service.name, comptabilite.fiche.h1);
  assert.equal(service.serviceType, comptabilite.fiche.serviceType);
  assert.equal(service.description, comptabilite.fiche.description);
  assert.equal(service.image, comptabilite.fiche.image.url);
  assert.equal(service.areaServed, 'FR');
  assert.equal(service.provider['@id'], ORGANIZATION);
  assert.equal(service.audience.audienceType, "Cabinets d'expertise comptable");

  const fil = unique(graphe, 'BreadcrumbList');
  assert.equal(fil.itemListElement.length, 3);
  assert.deepEqual(fil.itemListElement.map((e) => [e.position, e.name, e.item]), [
    [1, 'Accueil', `${SITE.url}/`],
    [2, HUB.ariane, `${SITE.url}${HUB.chemin}`],
    [3, 'Comptabilité', url],
  ]);
  assert.equal(fil.itemListElement[1].item, `${SITE.url}/agents-ia`);
  assert.equal(fil.itemListElement.at(-1).item, url, 'dernier élément = la canonique');
});

test('ficheGraph : WebPage nommée par le H1, datée par l’eeat, signée par Kevin, reliée par @id', async () => {
  const { ficheGraph } = await agents();
  const { AGENTS } = await donnees();
  const agent = avecFiche(AGENTS.find((a) => a.slug === 'finance'));
  const graphe = ficheGraph(agent);
  const url = `${SITE.url}/agents-ia/finance`;
  const page = unique(graphe, 'WebPage');

  assert.equal(page['@id'], `${url}#page`);
  assert.equal(page.url, url);
  assert.equal(page.headline, agent.fiche.h1);
  assert.equal(page.name, agent.fiche.h1);
  assert.equal(page.description, agent.fiche.description);
  assert.equal(page.inLanguage, 'fr-FR');
  assert.match(page.datePublished, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(page.dateModified, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(page.dateModified >= page.datePublished);
  assert.equal(page.datePublished, agent.fiche.eeat.datePublication);
  assert.equal(page.dateModified, agent.fiche.eeat.dateModification);
  assert.deepEqual(page.author, { '@id': KEVIN });
  assert.deepEqual(page.isPartOf, { '@id': WEBSITE });
  assert.deepEqual(page.mainEntity, { '@id': `${url}#service` });
  assert.deepEqual(page.breadcrumb, { '@id': `${url}#breadcrumb` });
  assert.ok(!noeudsDe(graphe).some((n) => typesDe(n).includes('Person')), 'Kevin est référencé par @id, jamais redéfini');
  assert.deepEqual(unique(graphe, 'Organization'), schema.organizationNode());
});

test('ficheGraph : chaque @id référencé par la page est défini dans le graphe', async () => {
  const { ficheGraph } = await agents();
  const { AGENTS } = await donnees();
  const graphe = ficheGraph(avecFiche(AGENTS.find((a) => a.slug === 'commercial')));
  const definis = new Set(noeudsDe(graphe).map((n) => n['@id']));
  const page = unique(graphe, 'WebPage');
  assert.ok(definis.has(page.mainEntity['@id']));
  assert.ok(definis.has(page.breadcrumb['@id']));
  assert.ok(definis.has(unique(graphe, 'Service').provider['@id']));
});

test('ficheGraph : isRelatedTo renvoie aux pages service liées, et manque quand il n’y en a pas', async () => {
  const { ficheGraph } = await agents();
  const { AGENTS } = await donnees();
  const comptabilite = AGENTS.find((a) => a.slug === 'comptabilite');
  assert.ok(comptabilite.servicesLies.length > 0);
  const lies = unique(ficheGraph(avecFiche(comptabilite)), 'Service').isRelatedTo;
  assert.deepEqual(lies, comptabilite.servicesLies.map((slug) => ({ '@id': `${SITE.url}/automatisation/${slug}#service` })));

  // Fixture : un agent sans page service liée, quel que soit l'état des données (revue de la tâche 3).
  const sansService = { ...AGENTS.find((a) => a.slug === 'commercial'), servicesLies: [] };
  assert.ok(!('isRelatedTo' in unique(ficheGraph(avecFiche(sansService)), 'Service')));
});

test('ficheGraph : les neuf fiches, un Service chacune, le prénom une seule fois (alternateName)', async () => {
  const { ficheGraph } = await agents();
  const { FICHES, AGENTS } = await donnees();
  // Ce que FICHES est (les agents dont la carte mène à une fiche), pas combien il y en a aujourd'hui (revue de la tâche 3).
  assert.ok(FICHES.length > 0, 'au moins une fiche à jouer');
  assert.deepEqual(FICHES.map((a) => a.slug), AGENTS.filter((a) => a.destination.type === 'fiche').map((a) => a.slug));
  for (const agent of FICHES) {
    const graphe = ficheGraph(avecFiche(agent));
    assert.equal(dePuis(graphe, 'Service').length, 1, agent.slug);
    assert.equal(unique(graphe, 'BreadcrumbList').itemListElement.length, 3, agent.slug);
    const texte = JSON.stringify(graphe);
    assert.equal(texte.split(agent.prenom).length - 1, 1, `${agent.slug} : le prénom ${agent.prenom} n’apparaît que dans alternateName`);
    for (const noeudDuGraphe of noeudsDe(graphe)) {
      for (const champ of ['name', 'headline', 'url', '@id']) {
        if (typeof noeudDuGraphe[champ] === 'string') {
          assert.ok(!motEntier(noeudDuGraphe[champ], agent.prenom), `${agent.slug} : ${champ} sans le prénom`);
        }
      }
    }
  }
});

test('ficheGraph : aucune FAQPage tant que faq.balisage n’est pas vrai (porte 2), même avec des questions', async () => {
  const { ficheGraph } = await agents();
  const { AGENTS } = await donnees();
  const agent = AGENTS.find((a) => a.slug === 'comptabilite');
  const sans = ficheGraph(avecFiche(agent, { faq: { balisage: false, questions: QUESTIONS } }));
  assert.equal(dePuis(sans, 'FAQPage').length, 0);
  assert.ok(!JSON.stringify(sans).includes('Question'));
});

test('ficheGraph : faq.balisage vrai émet la FAQPage rattachée au service, à parité avec les questions', async () => {
  const { ficheGraph } = await agents();
  const { AGENTS } = await donnees();
  const agent = AGENTS.find((a) => a.slug === 'comptabilite');
  const graphe = ficheGraph(avecFiche(agent, { faq: { balisage: true, questions: QUESTIONS } }));
  const faq = unique(graphe, 'FAQPage');
  assert.equal(faq['@id'], `${SITE.url}/agents-ia/comptabilite#faq`);
  assert.deepEqual(faq.about, { '@id': `${SITE.url}/agents-ia/comptabilite#service` });
  assert.deepEqual(faq.mainEntity.map((q) => [q.name, q.acceptedAnswer.text]), QUESTIONS.map((q) => [q.question, q.reponse]));
  assert.equal(dePuis(graphe, 'Service').length, 1, 'la FAQPage n’ajoute pas de Service');
  assert.throws(() => ficheGraph(avecFiche(agent, { faq: { balisage: true, questions: QUESTIONS.slice(0, 2) } })), /trois|3/i);
});

test('ficheGraph : lève pour un agent sans fiche écrite, pour une carte qui mène à une page, pour un champ manquant', async () => {
  const { ficheGraph } = await agents();
  const { AGENTS } = await donnees();
  const comptabilite = AGENTS.find((a) => a.slug === 'comptabilite');
  assert.throws(() => ficheGraph(comptabilite), /pas encore écrit/);
  assert.throws(() => ficheGraph(avecFiche(AGENTS.find((a) => a.slug === 'paie-social'))), /pas à une fiche/);
  assert.throws(() => ficheGraph(avecFiche(comptabilite, { serviceType: undefined })), /serviceType/);
  assert.throws(() => ficheGraph(avecFiche(comptabilite, { image: { url: '/proofs/x.webp', alt: 'x' } })), /image/i);
  assert.throws(() => ficheGraph(avecFiche(comptabilite, { eeat: { auteur: 'inconnu', datePublication: '2026-10-15', dateModification: '2026-10-15', sources: [] } })), /auteur/i);
});

test('ficheGraph : le prénom dans le H1 est refusé (D3) ; une date mal formée aussi (garde appelé)', async () => {
  const { ficheGraph } = await agents();
  const { AGENTS } = await donnees();
  const comptabilite = AGENTS.find((a) => a.slug === 'comptabilite');
  assert.throws(() => ficheGraph(avecFiche(comptabilite, { h1: 'Balthazar prépare votre comptabilité' })), /prénom/i);
  // Les dates ne sont validées que par assertGraph : ces levées prouvent que ficheGraph l'appelle.
  const eeat = (datePublication, dateModification) => ({ auteur: 'kevin', datePublication, dateModification, sources: [] });
  assert.throws(() => ficheGraph(avecFiche(comptabilite, { eeat: eeat('15/10/2026', '2026-10-16') })), /assertGraph/);
  assert.throws(() => ficheGraph(avecFiche(comptabilite, { eeat: eeat('2026-10-16', '2026-10-15') })), /assertGraph/);
});

test('ficheGraph : n’altère pas l’agent reçu', async () => {
  const { ficheGraph } = await agents();
  const { AGENTS } = await donnees();
  const agent = structuredClone(avecFiche(AGENTS.find((a) => a.slug === 'comptabilite')));
  ficheGraph(agent);
  assert.deepEqual(agent, structuredClone(avecFiche(AGENTS.find((a) => a.slug === 'comptabilite'))));
});

/* ------------------------------------------------------------------------------------------------------------------ */
/* outilsGraph                                                                                                        */
/* ------------------------------------------------------------------------------------------------------------------ */

test('outilsGraph : CollectionPage + ItemList des connecteurs, 0 Service, fil à deux niveaux', async () => {
  const { outilsGraph } = await agents();
  const graphe = outilsGraph(PAGE_OUTILS, CONNECTEURS);
  const url = `${SITE.url}/integrations`;

  assert.deepEqual(noeudsDe(graphe).map((n) => n['@type']), ['CollectionPage', 'ItemList', 'Organization', 'BreadcrumbList']);
  assert.equal(dePuis(graphe, 'Service').length, 0);
  const page = unique(graphe, 'CollectionPage');
  assert.equal(page['@id'], `${url}#page`);
  assert.equal(page.url, url);
  assert.equal(page.headline, PAGE_OUTILS.h1);
  assert.equal(page.datePublished, PAGE_OUTILS.datePublication);
  assert.equal(page.dateModified, PAGE_OUTILS.dateMiseAJour);
  assert.deepEqual(page.author, { '@id': KEVIN });
  assert.ok(!('about' in page), 'la page des logiciels ne porte pas « about »');
  assert.deepEqual(page.mainEntity, { '@id': `${url}#items` });

  const fil = unique(graphe, 'BreadcrumbList');
  assert.deepEqual(fil.itemListElement.map((e) => [e.position, e.name, e.item]), [
    [1, 'Accueil', `${SITE.url}/`],
    [2, PAGE_OUTILS.ariane, url],
  ]);
  assert.equal(fil.itemListElement.at(-1).item, page.url);
});

test('outilsGraph : un ListItem par connecteur, dans l’ordre reçu, vers #id de la page ; aucun lien sortant, aucun statut', async () => {
  const { outilsGraph } = await agents();
  const graphe = outilsGraph(PAGE_OUTILS, CONNECTEURS);
  const liste = unique(graphe, 'ItemList');

  assert.equal(liste.numberOfItems, CONNECTEURS.length);
  assert.equal(liste.itemListElement.length, CONNECTEURS.length);
  assert.equal(liste.name, PAGE_OUTILS.nomListe);
  CONNECTEURS.forEach((connecteur, i) => {
    const element = liste.itemListElement[i];
    assert.equal(element.position, i + 1);
    assert.equal(element.name, connecteur.nom);
    assert.equal(element.url, `${SITE.url}/integrations#${connecteur.id}`);
  });
  assert.ok(liste.itemListElement.every((e) => e.url.startsWith(`${SITE.url}/integrations#`)), 'aucun lien vers un éditeur');
  const texte = JSON.stringify(graphe);
  assert.ok(!/statut/i.test(texte), 'aucun statut d’outil');
  assert.ok(!texte.includes('SoftwareApplication'), 'les logiciels tiers ne sont pas des SoftwareApplication');
  assert.ok(!texte.includes('"Person"'));
  assert.ok(!texte.includes('"offers"'));
});

test('outilsGraph : tient une liste de 365 connecteurs, numberOfItems = leur nombre', async () => {
  const { outilsGraph } = await agents();
  const beaucoup = Array.from({ length: 365 }, (_, i) => ({ ...CONNECTEURS[0], id: `logiciel-${i}`, nom: `Logiciel ${i}` }));
  const liste = unique(outilsGraph(PAGE_OUTILS, beaucoup), 'ItemList');
  assert.equal(liste.numberOfItems, 365);
  assert.equal(liste.itemListElement.length, 365);
});

test('outilsGraph : lève sur une liste vide, un id en double, un id ou un nom manquant, une date mal formée (garde appelé)', async () => {
  const { outilsGraph } = await agents();
  assert.throws(() => outilsGraph(PAGE_OUTILS, []), /vide/i);
  assert.throws(() => outilsGraph(PAGE_OUTILS, [CONNECTEURS[0], { ...CONNECTEURS[1], id: CONNECTEURS[0].id }]), /doublon/i);
  // Le contrat des id (`connecteurs.test.mjs`) : minuscules, chiffres, tirets. `pageId` accepterait « Logiciel_A », pas ce garde.
  for (const id of [undefined, 'a b', 'Logiciel_A', '-logiciel', '']) {
    assert.throws(() => outilsGraph(PAGE_OUTILS, [{ ...CONNECTEURS[0], id }]), /id illisible/, `id ${JSON.stringify(id)}`);
  }
  assert.throws(() => outilsGraph(PAGE_OUTILS, [{ ...CONNECTEURS[0], nom: '' }]), /nom/i);
  for (const champ of ['chemin', 'h1', 'description', 'ariane', 'nomListe', 'datePublication', 'dateMiseAJour']) {
    assert.throws(() => outilsGraph({ ...PAGE_OUTILS, [champ]: undefined }, CONNECTEURS), new RegExp(champ), champ);
  }
  // Les dates ne sont validées que par assertGraph : cette levée prouve qu'outilsGraph l'appelle.
  assert.throws(() => outilsGraph({ ...PAGE_OUTILS, dateMiseAJour: '15/10/2026' }, CONNECTEURS), /assertGraph/);
});

test('outilsGraph : n’altère ni la page ni les connecteurs reçus', async () => {
  const { outilsGraph } = await agents();
  const page = structuredClone(PAGE_OUTILS);
  const connecteurs = structuredClone(CONNECTEURS);
  outilsGraph(page, connecteurs);
  assert.deepEqual(page, PAGE_OUTILS);
  assert.deepEqual(connecteurs, CONNECTEURS);
});
