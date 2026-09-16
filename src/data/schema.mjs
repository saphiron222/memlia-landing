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

export const serviceNode = (description) => ({
  '@type': 'Service',
  '@id': SERVICE_ID,
  name: 'Memlia : automatisation IA du cabinet',
  serviceType: "Automatisation IA pour cabinets d'expertise comptable",
  areaServed: 'FR',
  url: `${SITE.url}${PAGES_V2.service.chemin}`,
  image: OG_IMAGE.url,
  description,
  provider: { '@id': `${SITE.url}/#organization` },
  audience: { '@type': 'Audience', audienceType: "Cabinets d'expertise comptable" },
});
