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
    "Memlia écrit le savoir-faire des cabinets d'expertise comptable et automatise, avec l'IA, la part répétitive de leur travail dans leurs outils existants : la règle est écrite avec le cabinet, l'automatisation est livrée après recette, la décision reste au professionnel.",
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
