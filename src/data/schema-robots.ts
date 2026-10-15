import { ROBOTS, ROBOT_HUB, cheminRobot, type Robot } from './robots.ts';
import { organizationNode } from './schema.mjs';
const origin = 'https://memlia.fr';
const breadcrumb = (chemin: string, nom: string, fiche = false) => ({
  '@type': 'BreadcrumbList', '@id': `${origin}${chemin}#breadcrumb`,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${origin}/` },
    { '@type': 'ListItem', position: 2, name: 'Robots comptables', item: `${origin}${ROBOT_HUB.chemin}` },
    ...(fiche ? [{ '@type': 'ListItem', position: 3, name: nom, item: `${origin}${chemin}` }] : []),
  ],
});
export function verifierGrapheRobots(graphe: Record<string, any>) {
  const ids = new Set();
  const visit = (value: any): void => {
    if (!value || typeof value !== 'object') return;
    if ((Array.isArray(value['@type']) ? value['@type'] : [value['@type']]).some((type: string) => ['Person', 'SoftwareApplication', 'FAQPage', 'Offer', 'AggregateRating', 'Review'].includes(type))) throw new Error('Type interdit pour le catalogue robots');
    for (const key of ['offers', 'aggregateRating', 'review', 'price', 'priceCurrency']) if (key in value) throw new Error(`Propriété interdite : ${key}`);
    if (value['@type'] && value['@id']) { if (ids.has(value['@id'])) throw new Error('Identifiant JSON-LD dupliqué'); ids.add(value['@id']); }
    for (const [key, child] of Object.entries(value)) {
      if (['url', 'item', '@id', 'image'].includes(key) && typeof child === 'string' && !child.startsWith('https://')) throw new Error('URL JSON-LD non absolue');
      if (typeof child === 'object') visit(child);
    }
  };
  visit(graphe);
  if (graphe['@graph'].filter((n: any) => n['@type'] === 'Service').length > 1) throw new Error('Plusieurs services sur une fiche');
  return graphe;
}
export function grapheHubRobots() {
  const url = `${origin}${ROBOT_HUB.chemin}`;
  return verifierGrapheRobots({ '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', '@id': `${url}#page`, url, name: ROBOT_HUB.h1, headline: ROBOT_HUB.h1, description: ROBOT_HUB.description, inLanguage: 'fr-FR', dateModified: ROBOT_HUB.date, isPartOf: { '@id': `${origin}/#website` }, mainEntity: { '@id': `${url}#robots` }, breadcrumb: { '@id': `${url}#breadcrumb` } },
    { '@type': 'ItemList', '@id': `${url}#robots`, name: 'Robots pour cabinets comptables', numberOfItems: ROBOTS.length, itemListElement: ROBOTS.map((robot, i) => ({ '@type': 'ListItem', position: i + 1, name: robot.nom, url: `${origin}${cheminRobot(robot)}`, description: robot.resume })) },
    breadcrumb(ROBOT_HUB.chemin, 'Robots comptables'), organizationNode(),
  ] });
}
export function grapheFicheRobot(robot: Robot) {
  const chemin = cheminRobot(robot), url = `${origin}${chemin}`;
  return verifierGrapheRobots({ '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', '@id': `${url}#page`, url, name: robot.h1, headline: robot.h1, description: robot.seo.description, inLanguage: 'fr-FR', datePublished: ROBOT_HUB.date, dateModified: ROBOT_HUB.date, isPartOf: { '@id': `${origin}/#website` }, mainEntity: { '@id': `${url}#service` }, breadcrumb: { '@id': `${url}#breadcrumb` } },
    { '@type': 'Service', '@id': `${url}#service`, url, name: robot.nom, serviceType: robot.fonction, description: robot.seo.description, provider: { '@id': `${origin}/#organization` }, areaServed: 'FR', audience: { '@type': 'Audience', audienceType: 'Cabinets d’expertise comptable' }, image: `${origin}${robot.image.src}-512.webp` },
    breadcrumb(chemin, robot.nom, true), organizationNode(),
  ] });
}
