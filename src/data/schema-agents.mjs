/**
 * Les graphes JSON-LD des pages « agents IA » : le hub `/agents-ia`, une fiche `/agents-ia/<métier>` et la page des
 * logiciels `/integrations` (plan du 15/10/2026, tâche 3 ; gabarits dans docs/strategy/site-v3/hub-agents-ia/JSON-LD.md §4).
 *
 * Les trois assembleurs prennent leurs données en paramètres (un test les joue sans Astro) et appellent `assertGraph`
 * avant de rendre : une page `.astro` fait `schema={hubGraph(...)}`, elle n'assemble rien à la main.
 *
 * Arbitrages de la porte 2 (15/10/2026) tenus ici :
 *  - aucune FAQPage tant que `fiche.faq.balisage` n'est pas `true` (les données le fixent à `false`) ;
 *  - aucun statut d'outil, aucun lien sortant vers un éditeur : un connecteur devient un ListItem vers son ancre `#id` ;
 *  - l'agent est un Service, jamais une Person ni une SoftwareApplication ; son prénom n'est que dans `alternateName`.
 */
import { SITE } from './site.mjs';
import {
  SERVICE_ID, organizationNode, pageId, breadcrumbNode, itemListNode, collectionPageNode, webPageNode,
  agentServiceNode, faqPageNode, assertGraph,
} from './schema.mjs';
import { auteurPar, identiteAuteur } from './auteurs.ts';
import { HUB, cheminAgent, ficheDe } from './specialistes.ts';

const SCHEMA_CONTEXTE = 'https://schema.org';
/** Le hub et la page des logiciels sont signés de leur fondateur ; une fiche l'est par `eeat.auteur`. */
const AUTEUR_DU_SITE = 'kevin';
/** Le contrat des `id` de connecteurs (`connecteurs.test.mjs`) : ils servent d'ancre dans la page. */
const ID_CONNECTEUR = /^[a-z0-9][a-z0-9-]*$/;

function exigerChamps(objet, champs, appel) {
  for (const champ of champs) {
    if (typeof objet?.[champ] !== 'string' || objet[champ].trim() === '') {
      throw new Error(`${appel} : « ${champ} » manquant ou vide (reçu ${JSON.stringify(objet?.[champ])})`);
    }
  }
}

function auteurIdDe(idAuteur) {
  const auteur = auteurPar(idAuteur);
  if (!auteur) throw new Error(`schema-agents : auteur inconnu « ${idAuteur} »`);
  return `${SITE.url}${identiteAuteur(auteur)}`;
}

/**
 * Assemble un graphe et le passe au garde de build. `options` va tel quel à `assertGraph` : sans elles, sa limite
 * d'un Service ; le hub et la page des logiciels passent `{ servicesMax: 0 }`, ils n'en portent aucun (JSON-LD.md §1).
 */
export function grapheVerifie(noeuds, options = {}) {
  const resultat = { '@context': SCHEMA_CONTEXTE, '@graph': noeuds };
  assertGraph(resultat, options);
  return resultat;
}

/**
 * Le hub : `CollectionPage` + `ItemList`, jamais de Service. L'`ItemList` reprend `agents` tel quel et dans l'ordre : le
 * tableau que la page donne à ses cartes (les douze, publiées ou non : le hub affiche toutes les cartes, R19).
 *
 * `hub` : `HUB` complété par la tâche 4 de `description`, `nomListe`, `datePublication` et `dateMiseAJour` (dates
 * explicites des données, jamais le `lastmod` du sitemap ni la date du build).
 */
export function hubGraph(hub, agents) {
  exigerChamps(hub, ['chemin', 'ariane', 'h1', 'description', 'nomListe', 'datePublication', 'dateMiseAJour'], 'hubGraph');
  if (!Array.isArray(agents) || agents.length === 0) throw new Error('hubGraph : liste d’agents vide');
  return grapheVerifie([
    collectionPageNode({
      chemin: hub.chemin, h1: hub.h1, description: hub.description,
      datePublication: hub.datePublication, dateModification: hub.dateMiseAJour,
      auteurId: auteurIdDe(AUTEUR_DU_SITE), about: SERVICE_ID,
    }),
    itemListNode({
      chemin: hub.chemin,
      name: hub.nomListe,
      items: agents.map((agent) => ({ name: agent.libelle, url: `${SITE.url}${cheminAgent(agent)}`, description: agent.ligne })),
    }),
    organizationNode(),
    breadcrumbNode({ chemin: hub.chemin, name: hub.ariane }),
  ], { servicesMax: 0 });
}

/**
 * Une fiche : `WebPage` + un seul `Service` + fil à trois niveaux (Accueil, Agents IA, le métier).
 *
 * `isRelatedTo` renvoie aux pages service de `agent.servicesLies`. Ces slugs sont ceux de pages publiées : c'est
 * `specialistes-controle.ts` (`exigerAgents`) qui le garantit au build, ce fichier ne lit pas le registre des services.
 * Lève pour une carte qui mène à une page, ou pour une fiche pas encore écrite (`ficheDe`).
 */
export function ficheGraph(agent) {
  const fiche = ficheDe(agent);
  exigerChamps(fiche, ['h1', 'description', 'serviceType'], 'ficheGraph');
  if (!fiche.eeat) throw new Error(`ficheGraph : « eeat » manquant à la fiche de ${agent.slug}`);
  const chemin = cheminAgent(agent);
  const serviceId = pageId(chemin, 'service');
  return grapheVerifie([
    webPageNode({
      chemin, h1: fiche.h1, description: fiche.description,
      datePublication: fiche.eeat.datePublication, dateModification: fiche.eeat.dateModification,
      auteurId: auteurIdDe(fiche.eeat.auteur), mainEntityId: serviceId,
    }),
    agentServiceNode({
      chemin, name: fiche.h1, serviceType: fiche.serviceType, description: fiche.description,
      image: fiche.image?.url, prenom: agent.prenom, libelle: agent.libelle,
      servicesLiesIds: agent.servicesLies.map((slug) => pageId(`/automatisation/${slug}`, 'service')),
    }),
    // Porte 2 : jamais de FAQPage tant que les données ne l'ont pas demandée, `=== true` et rien d'autre.
    ...(fiche.faq?.balisage === true ? [faqPageNode({ chemin, serviceId, questions: fiche.faq.questions })] : []),
    organizationNode(),
    breadcrumbNode({ chemin, name: agent.libelle, parents: [{ name: HUB.ariane, chemin: HUB.chemin }] }),
  ]);
}

/**
 * La page des logiciels : `CollectionPage` + `ItemList` plate, dans l'ordre reçu (celui du DOM). Un connecteur est un
 * ListItem vers son ancre `<page>#<id>` : ni statut, ni lien vers l'éditeur, jamais une SoftwareApplication (nous ne
 * vendons pas ces logiciels, aucun partenariat).
 *
 * `page` : `PAGE_OUTILS` de la tâche 8, avec `chemin`, `h1`, `description`, `ariane`, `nomListe`, `datePublication`
 * et `dateMiseAJour`.
 */
export function outilsGraph(page, connecteurs) {
  exigerChamps(page, ['chemin', 'h1', 'description', 'ariane', 'nomListe', 'datePublication', 'dateMiseAJour'], 'outilsGraph');
  if (!Array.isArray(connecteurs) || connecteurs.length === 0) throw new Error('outilsGraph : liste de connecteurs vide');
  const items = connecteurs.map((connecteur, i) => {
    if (typeof connecteur?.id !== 'string' || !ID_CONNECTEUR.test(connecteur.id)) {
      throw new Error(`outilsGraph : id illisible au connecteur ${i + 1} (${JSON.stringify(connecteur?.id)}) : ${ID_CONNECTEUR}`);
    }
    exigerChamps(connecteur, ['nom'], `outilsGraph : connecteur « ${connecteur.id} »`);
    return { name: connecteur.nom, url: pageId(page.chemin, connecteur.id) };
  });
  return grapheVerifie([
    collectionPageNode({
      chemin: page.chemin, h1: page.h1, description: page.description,
      datePublication: page.datePublication, dateModification: page.dateMiseAJour,
      auteurId: auteurIdDe(AUTEUR_DU_SITE),
    }),
    itemListNode({ chemin: page.chemin, name: page.nomListe, items }),
    organizationNode(),
    breadcrumbNode({ chemin: page.chemin, name: page.ariane }),
  ], { servicesMax: 0 });
}
