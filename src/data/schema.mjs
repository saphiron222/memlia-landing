/**
 * Entités partagées du graphe JSON-LD.
 *
 * Le Service global EC est émis à l'identique sur l'accueil et le pilier.
 * Une prestation d'une autre page ou audience peut avoir ses propres données et son
 * propre identifiant : ne jamais réutiliser un identifiant avec deux définitions.
 */
import { SITE, OG_IMAGE } from './site.mjs';
import { PAGES_V2 } from './pages-v2.mjs';

/** `url` du service : la page qui le décrit, pas l'accueil qui l'annonce. */
export const SERVICE_ID = `${SITE.url}/#service`;

/** L'éditeur du site : un seul `@id`, donc une seule définition. */
export const ORGANIZATION_ID = `${SITE.url}/#organization`;

/**
 * L'éditeur, défini ici et nulle part ailleurs. Quatre pages le déclaraient chacune de son
 * côté sous ce même `@id` avec quatre jeux de champs : pour un moteur qui fusionne le
 * graphe, c'est une entité qui change de forme selon la page d'entrée. Même faute que
 * celle décrite plus haut pour le Service, même correctif.
 *
 * L'identité légale et les fiches publiques `sameAs` répondent à une ambiguïté mesurée le
 * 17/09/2026 : sur « memlia », Google réécrit la requête en « mellia » et sert une autre
 * entité, faute de savoir que Memlia en est une. Chaque valeur est reprise des mentions
 * légales du site, et chaque fiche citée a été ouverte et vérifiée au nom et au SIREN.
 */
export const organizationNode = () => ({
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: SITE.nom,
  legalName: 'MEMLIA',
  url: `${SITE.url}/`,
  logo: `${SITE.url}/apple-touch-icon.png`,
  email: SITE.email,
  slogan: SITE.tagline,
  description:
    "Memlia conçoit, adapte, déploie et maintient des robots et agents IA pour les cabinets d’expertise comptable et de commissariat aux comptes. Le catalogue est le point de départ ; une construction sur mesure répond aux besoins particuliers. Le cabinet conserve les décisions professionnelles.",
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Bureau 326, 59 rue de Ponthieu',
    postalCode: '75008',
    addressLocality: 'Paris',
    addressCountry: 'FR',
  },
  identifier: [
    { '@type': 'PropertyValue', propertyID: 'SIREN', value: '108621541' },
    { '@type': 'PropertyValue', propertyID: 'SIRET', value: '10862154100011' },
  ],
  sameAs: [
    'https://annuaire-entreprises.data.gouv.fr/entreprise/memlia-108621541',
    'https://www.pappers.fr/entreprise/memlia-108621541',
    'https://www.societe.com/societe/memlia-108621541.html',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: SITE.email,
    contactType: 'customer support',
    areaServed: 'FR',
    availableLanguage: 'French',
  },
});

/**
 * L'appel sans argument préserve l'entité EC historique. Pour une autre prestation,
 * fournir le chemin, le public et les textes de la page qui la décrit.
 */
export const DEFAULT_AUDIENCE_TYPE = "Cabinets d'expertise comptable";

export const serviceNode = ({
  audienceType = DEFAULT_AUDIENCE_TYPE,
  chemin = PAGES_V2.service.chemin,
  id = chemin === PAGES_V2.service.chemin ? SERVICE_ID : `${SITE.url}${chemin}#service`,
  name = 'Memlia : automatisation IA du cabinet',
  serviceType = "Automatisation IA pour cabinets d'expertise comptable",
  description = PAGES_V2.service.description,
} = {}) => ({
  '@type': 'Service',
  '@id': id,
  name,
  serviceType,
  areaServed: 'FR',
  url: `${SITE.url}${chemin}`,
  image: OG_IMAGE.url,
  description,
  provider: { '@id': ORGANIZATION_ID },
  audience: { '@type': 'Audience', audienceType },
});

/** Complète seulement les pages indexables sans fil éditorial explicite. */
export function withBreadcrumb(schema, { chemin, name, noindex = false }) {
  if (noindex) return schema;
  const nodes = schema['@graph'] ?? [schema];
  if (nodes.some(node => node['@type'] === 'BreadcrumbList')) return schema;
  const url = `${SITE.url}${chemin}`;
  const id = `${url}#breadcrumb`;
  const items = [{ '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE.url}/` }];
  if (chemin !== '/') items.push({ '@type': 'ListItem', position: 2, name, item: url });
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...nodes.map(node => {
        const types = [].concat(node['@type'] ?? []);
        return types.some(type => type.endsWith('Page')) && !node.breadcrumb
          ? { ...node, breadcrumb: { '@id': id } } : node;
      }),
      { '@type': 'BreadcrumbList', '@id': id, itemListElement: items },
    ],
  };
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* Graphes des pages « agents IA » : hub, fiches, page des logiciels (plan du 15/10/2026, tâche 3).                    */
/*                                                                                                                    */
/* Génériques et sans import `.ts` : ce fichier est lu hors Astro. Les gabarits sont dans                              */
/* docs/strategy/site-v3/hub-agents-ia/JSON-LD.md §4 ; `schema-agents.mjs` les assemble avec les données injectées.    */
/* Un garde ne se propage pas seul : `assertGraph` est appelé par les trois assembleurs, les pages n'assemblent rien.  */
/* ------------------------------------------------------------------------------------------------------------------ */

const WEBSITE_ID = `${SITE.url}/#website`;

const estTexte = valeur => typeof valeur === 'string' && valeur.trim() !== '';

function exigerTexte(valeur, nom) {
  if (!estTexte(valeur)) throw new Error(`${nom} : texte non vide attendu, reçu ${JSON.stringify(valeur)}`);
  return valeur;
}

/** Une URL absolue en `https://`, sans espace, avec un hôte. */
function estUrlAbsolue(valeur) {
  if (typeof valeur !== 'string' || /\s/.test(valeur)) return false;
  try {
    const url = new URL(valeur);
    return url.protocol === 'https:' && url.hostname !== '';
  } catch {
    return false;
  }
}

function exigerChemin(chemin, appel) {
  if (typeof chemin !== 'string' || !/^\/[^#?\s]*$/.test(chemin)) {
    throw new Error(`${appel} : chemin invalide ${JSON.stringify(chemin)} (« / » initial, ni « # », ni « ? », ni espace)`);
  }
  return chemin;
}

/** `@id` d'un nœud d'une page : `<site><chemin>#<suffixe>` (`#page`, `#items`, `#service`, `#breadcrumb`, `#faq`). */
export function pageId(chemin, suffixe) {
  exigerChemin(chemin, 'pageId');
  if (typeof suffixe !== 'string' || !/^[A-Za-z0-9_-]+$/.test(suffixe)) {
    throw new Error(`pageId : suffixe invalide ${JSON.stringify(suffixe)} (lettres, chiffres, « - » et « _ » seulement)`);
  }
  return `${SITE.url}${chemin}#${suffixe}`;
}

/**
 * Fil d'Ariane : Accueil, les parents, puis la page (dernier maillon = la canonique).
 * `parents` : `[{ name, chemin }]`. Lève sur un nom vide, un chemin relatif, un doublon.
 */
export function breadcrumbNode({ chemin, name, parents = [] }) {
  const items = [{ '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE.url}/` }];
  const vus = new Set([`${SITE.url}/`]);
  for (const maillon of [...parents, { name, chemin }]) {
    exigerTexte(maillon?.name, 'breadcrumbNode : nom');
    exigerChemin(maillon.chemin, 'breadcrumbNode');
    const item = `${SITE.url}${maillon.chemin}`;
    if (vus.has(item)) throw new Error(`breadcrumbNode : doublon ${item}`);
    vus.add(item);
    items.push({ '@type': 'ListItem', position: items.length + 1, name: maillon.name, item });
  }
  return { '@type': 'BreadcrumbList', '@id': pageId(chemin, 'breadcrumb'), itemListElement: items };
}

/**
 * Liste ordonnée : `numberOfItems` est le nombre d'éléments reçus, jamais une constante.
 * `items` : `[{ name, url, description? }]`. Lève sur une liste vide, une url relative ou en double, un nom vide.
 */
export function itemListNode({ chemin, name, items, id = pageId(chemin, 'items') }) {
  exigerTexte(name, 'itemListNode : nom');
  if (!Array.isArray(items) || items.length === 0) throw new Error('itemListNode : liste vide');
  const vus = new Set();
  const elements = items.map((entree, i) => {
    exigerTexte(entree?.name, `itemListNode : nom de l'élément ${i + 1}`);
    if (!estUrlAbsolue(entree.url)) throw new Error(`itemListNode : url non absolue (https:// attendu) à l'élément ${i + 1}, reçu ${JSON.stringify(entree.url)}`);
    if (vus.has(entree.url)) throw new Error(`itemListNode : doublon d'url ${entree.url}`);
    vus.add(entree.url);
    return {
      '@type': 'ListItem', position: i + 1, name: entree.name, url: entree.url,
      ...(estTexte(entree.description) ? { description: entree.description } : {}),
    };
  });
  return { '@type': 'ItemList', '@id': id, name, numberOfItems: elements.length, itemListElement: elements };
}

/** Le tronc commun d'une page : name = headline = H1, dates de l'éditorial, auteur et fil par `@id`. */
function noeudDePage(type, appel, { chemin, h1, description, datePublication, dateModification, auteurId }) {
  exigerChemin(chemin, appel);
  exigerTexte(h1, `${appel} : h1`);
  exigerTexte(description, `${appel} : description`);
  exigerTexte(datePublication, `${appel} : datePublication`);
  exigerTexte(dateModification, `${appel} : dateModification`);
  exigerTexte(auteurId, `${appel} : auteurId`);
  return {
    '@type': type,
    '@id': pageId(chemin, 'page'),
    url: `${SITE.url}${chemin}`,
    name: h1,
    headline: h1,
    description,
    inLanguage: SITE.langue,
    datePublished: datePublication,
    dateModified: dateModification,
    author: { '@id': auteurId },
    isPartOf: { '@id': WEBSITE_ID },
  };
}

/** Page d'annuaire (hub, logiciels) : `mainEntity` = sa liste `#items`. `about` : un `@id`, facultatif. */
export function collectionPageNode({ about, ...page }) {
  const noeud = noeudDePage('CollectionPage', 'collectionPageNode', page);
  if (about !== undefined) exigerTexte(about, 'collectionPageNode : about');
  return {
    ...noeud,
    ...(about === undefined ? {} : { about: { '@id': about } }),
    breadcrumb: { '@id': pageId(page.chemin, 'breadcrumb') },
    mainEntity: { '@id': pageId(page.chemin, 'items') },
  };
}

/** Page ordinaire (fiche) : `mainEntity` = le nœud que la page décrit, par `@id`. */
export function webPageNode({ mainEntityId, ...page }) {
  const noeud = noeudDePage('WebPage', 'webPageNode', page);
  exigerTexte(mainEntityId, 'webPageNode : mainEntityId');
  return {
    ...noeud,
    mainEntity: { '@id': mainEntityId },
    breadcrumb: { '@id': pageId(page.chemin, 'breadcrumb') },
  };
}

const motEntier = (texte, mot) => new RegExp(`(?<![\\p{L}\\p{N}])${mot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}])`, 'iu').test(texte);

/**
 * Le Service d'une fiche d'agent : `serviceNode` (inchangé) + l'image de la fiche, le prénom en `alternateName`
 * (« Balthazar, agent IA Comptabilité ») et les pages service liées. Le prénom ne va jamais dans `name` (D3).
 * `image` : URL absolue. `servicesLiesIds` : `@id` de Service d'autres pages ; sans eux, pas de `isRelatedTo`.
 */
export function agentServiceNode({ chemin, name, serviceType, description, image, prenom, libelle, servicesLiesIds = [] }) {
  exigerChemin(chemin, 'agentServiceNode');
  for (const [valeur, nom] of [[name, 'name'], [serviceType, 'serviceType'], [description, 'description'], [prenom, 'prenom'], [libelle, 'libelle']]) {
    exigerTexte(valeur, `agentServiceNode : ${nom}`);
  }
  if (!estUrlAbsolue(image)) throw new Error(`agentServiceNode : image non absolue (https:// attendu), reçu ${JSON.stringify(image)}`);
  if (motEntier(name, prenom)) throw new Error(`agentServiceNode : le prénom « ${prenom} » ne va jamais dans name (D3), seulement dans alternateName`);
  return {
    ...serviceNode({ chemin, name, serviceType, description }),
    image,
    alternateName: `${prenom}, agent IA ${libelle}`,
    ...(servicesLiesIds.length > 0 ? { isRelatedTo: servicesLiesIds.map(id => ({ '@id': id })) } : {}),
  };
}

const MIN_QUESTIONS_FAQ = 3;

/** FAQPage rattachée au Service. Non émise sur ces pages (porte 2) : disponible, appelée seulement si `faq.balisage === true`. */
export function faqPageNode({ chemin, serviceId, questions }) {
  exigerTexte(serviceId, 'faqPageNode : serviceId');
  if (!Array.isArray(questions) || questions.length < MIN_QUESTIONS_FAQ) throw new Error(`faqPageNode : trois questions au moins, reçu ${Array.isArray(questions) ? questions.length : 'aucune liste'}`);
  return {
    '@type': 'FAQPage',
    '@id': pageId(chemin, 'faq'),
    inLanguage: SITE.langue,
    about: { '@id': serviceId },
    mainEntity: questions.map((entree, i) => ({
      '@type': 'Question',
      name: exigerTexte(entree?.question, `faqPageNode : question ${i + 1}`),
      acceptedAnswer: { '@type': 'Answer', text: exigerTexte(entree?.reponse, `faqPageNode : réponse ${i + 1}`) },
    })),
  };
}

/* ---------------------------------- assertGraph : garde de build, fail-closed ----------------------------------- */

/** Le prix est au devis, l'agent n'est ni une personne ni un logiciel (JSON-LD.md §1, décisions 2 et 4). */
const TYPES_INTERDITS = new Set([
  'Person', 'SoftwareApplication', 'WebApplication', 'MobileApplication',
  'Offer', 'AggregateOffer', 'Review', 'Rating', 'AggregateRating',
]);
const PROPRIETES_INTERDITES = new Set(['offers', 'aggregateRating', 'review', 'hasOfferCatalog', 'applicationCategory', 'operatingSystem']);
const estProprieteInterdite = cle => PROPRIETES_INTERDITES.has(cle) || /^price/.test(cle);
const CLES_URL = ['url', 'item', 'image', 'logo', 'sameAs', '@id'];
const CLES_DATE = ['datePublished', 'dateModified'];
const SCHEMA_CONTEXTE = 'https://schema.org';

const typesDe = noeud => [].concat(noeud?.['@type'] ?? []).filter(type => typeof type === 'string');

function dateValide(valeur) {
  if (typeof valeur !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valeur)) return false;
  const date = new Date(`${valeur}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === valeur;
}

/** Visite chaque objet de l'arbre. Un objet reparu parmi ses propres ancêtres est un cycle, signalé et non suivi. */
function parcourir(valeur, chemin, visiter, signaler, ancetres = new Set()) {
  if (valeur === null || typeof valeur !== 'object') return;
  if (ancetres.has(valeur)) {
    signaler(`${chemin} : référence circulaire`);
    return;
  }
  ancetres.add(valeur);
  if (Array.isArray(valeur)) {
    valeur.forEach((enfant, i) => parcourir(enfant, `${chemin}[${i}]`, visiter, signaler, ancetres));
  } else {
    visiter(valeur, chemin);
    for (const [cle, enfant] of Object.entries(valeur)) parcourir(enfant, `${chemin}.${cle}`, visiter, signaler, ancetres);
  }
  ancetres.delete(valeur);
}

function verifierUrls(noeud, chemin, signaler) {
  for (const cle of CLES_URL.filter(c => c in noeud)) {
    const valeurs = Array.isArray(noeud[cle]) ? noeud[cle] : [noeud[cle]];
    valeurs.forEach((valeur, i) => {
      // Un objet n'est pas une URL : il est visité pour lui-même (son propre `url`, son propre `@id`).
      if (typeof valeur === 'string' && !estUrlAbsolue(valeur)) {
        signaler(`${chemin}.${cle}${Array.isArray(noeud[cle]) ? `[${i}]` : ''} : URL non absolue (https:// attendu), reçu « ${valeur} »`);
      }
    });
  }
}

function verifierDates(noeud, chemin, signaler) {
  for (const cle of CLES_DATE.filter(c => c in noeud)) {
    if (!dateValide(noeud[cle])) signaler(`${chemin}.${cle} : date AAAA-MM-JJ attendue, reçu ${JSON.stringify(noeud[cle])}`);
  }
  const { datePublished, dateModified } = noeud;
  if (dateValide(datePublished) && dateValide(dateModified) && dateModified < datePublished) {
    signaler(`${chemin}.dateModified « ${dateModified} » antérieure à datePublished « ${datePublished} »`);
  }
}

function verifierFil(fils, pages, signaler) {
  if (fils.length !== 1) {
    signaler(`BreadcrumbList : exactement 1 attendu, ${fils.length} trouvé(s)`);
    return;
  }
  const elements = fils[0].itemListElement;
  if (!Array.isArray(elements) || elements.length === 0) {
    signaler('BreadcrumbList : itemListElement vide');
    return;
  }
  elements.forEach((element, i) => {
    if (element?.position !== i + 1) signaler(`BreadcrumbList : position ${JSON.stringify(element?.position)} à l'élément ${i + 1}, ${i + 1} attendue`);
    if (!estTexte(element?.name)) signaler(`BreadcrumbList : name vide à l'élément ${i + 1}`);
  });
  if (pages.length !== 1) {
    signaler(`${pages.length} nœud(s) de page (WebPage, CollectionPage…) portant une url, 1 attendu pour juger le fil`);
    return;
  }
  const dernier = elements.at(-1)?.item;
  if (dernier !== pages[0].url) signaler(`BreadcrumbList : dernier élément « ${dernier} » ≠ url de la page « ${pages[0].url} »`);
}

/**
 * Garde de build des graphes des pages « agents IA ». Lève une `Error` dont `violations` liste chaque défaut :
 * `@context` ≠ https://schema.org ; type interdit (Person, SoftwareApplication, offres, avis, notes…) ; propriété interdite
 * (offers, aggregateRating, review, price*, hasOfferCatalog…) ; `@id` défini deux fois ; `url`, `item`, `image`, `logo`,
 * `sameAs` ou `@id` qui ne sont pas des URL absolues en https:// ; date hors AAAA-MM-JJ ou inversée ; plus de `servicesMax`
 * nœuds Service ; fil d'Ariane absent, double, mal numéroté ou dont le dernier élément n'est pas l'url de la page.
 * Un renvoi (`{ "@id": … }` seul) n'est pas une définition : il ne compte pas comme doublon.
 */
export function assertGraph(graphe, { servicesMax = 1 } = {}) {
  const violations = [];
  const signaler = message => violations.push(message);
  const refuser = () => {
    throw Object.assign(new Error(`assertGraph : ${violations.length} violation(s)\n - ${violations.join('\n - ')}`), { violations });
  };
  if (graphe === null || typeof graphe !== 'object') {
    signaler('graphe : objet JSON-LD attendu avec un @graph');
    refuser();
  }
  if (graphe['@context'] !== SCHEMA_CONTEXTE) signaler(`@context : ${SCHEMA_CONTEXTE} attendu, reçu ${JSON.stringify(graphe['@context'])}`);
  if (!Array.isArray(graphe['@graph'])) {
    signaler('@graph : tableau de nœuds attendu');
    refuser();
  }

  const services = [];
  const fils = [];
  const definitions = new Map();
  parcourir(graphe['@graph'], '@graph', (noeud, chemin) => {
    for (const type of typesDe(noeud)) {
      if (TYPES_INTERDITS.has(type)) signaler(`${chemin} : type interdit « ${type} »`);
      if (type === 'Service') services.push(chemin);
      if (type === 'BreadcrumbList') fils.push(noeud);
    }
    for (const cle of Object.keys(noeud).filter(estProprieteInterdite)) signaler(`${chemin}.${cle} : propriété interdite`);
    verifierUrls(noeud, chemin, signaler);
    verifierDates(noeud, chemin, signaler);
    if (typeof noeud['@id'] === 'string' && Object.keys(noeud).length > 1) definitions.set(noeud['@id'], [...(definitions.get(noeud['@id']) ?? []), chemin]);
  }, signaler);

  for (const [id, chemins] of definitions) if (chemins.length > 1) signaler(`@id en double « ${id} » : ${chemins.join(', ')}`);
  if (services.length > servicesMax) signaler(`${services.length} nœuds Service (${services.join(', ')}), ${servicesMax} au plus`);
  const pages = graphe['@graph'].filter(noeud => typesDe(noeud).some(type => type.endsWith('Page')) && typeof noeud.url === 'string');
  verifierFil(fils, pages, signaler);
  if (violations.length > 0) refuser();
}
