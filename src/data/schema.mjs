/**
 * Entités partagées du graphe JSON-LD.
 *
 * Le Service est déclaré ici, et nulle part ailleurs. Deux pages l'avaient décrit chacune
 * de son côté, avec deux `@id`, deux noms et deux `serviceType` : pour un moteur, deux
 * services concurrents du même fournisseur. Le contrat de schéma l'interdit nommément.
 * Une seule définition, émise à l'identique partout où elle est utile.
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
    "Memlia est un service d'automatisation IA pour cabinets d'expertise comptable : un processus cadré, une automatisation éprouvée sur jeux fictifs et des décisions sensibles validées par le cabinet.",
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
 * Une entité, une description. Le nœud était émis sur deux pages avec la description de
 * chacune : même `@id`, deux valeurs pour un champ, donc deux réponses à la même question
 * pour qui fusionne le graphe. C'est la page qui décrit le service qui fait foi.
 */
export const serviceNode = () => ({
  '@type': 'Service',
  '@id': SERVICE_ID,
  name: 'Memlia : automatisation IA du cabinet',
  serviceType: "Automatisation IA pour cabinets d'expertise comptable",
  areaServed: 'FR',
  url: `${SITE.url}${PAGES_V2.service.chemin}`,
  image: OG_IMAGE.url,
  description: PAGES_V2.service.description,
  provider: { '@id': ORGANIZATION_ID },
  audience: { '@type': 'Audience', audienceType: "Cabinets d'expertise comptable" },
});
