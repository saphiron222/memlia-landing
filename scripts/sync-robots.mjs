/** Les registres des contrôles sont des projections, le catalogue typé reste la source. */
import { readFileSync, writeFileSync } from 'node:fs';
import { ROBOTS, ROBOT_HUB, cheminRobot } from '../src/data/robots.ts';
const lire = (p) => JSON.parse(readFileSync(p, 'utf8'));
const ecrire = (p, d) => writeFileSync(p, `${JSON.stringify(d, null, 2)}\n`);
const ip = 'config/page-intent-contract.json', intent = lire(ip);
for (const r of [{chemin:ROBOT_HUB.chemin,requete:'robot cabinet comptable',description:ROBOT_HUB.description}, ...ROBOTS.map(r=>({chemin:cheminRobot(r),requete:r.seo.requete,description:r.seo.description}))]) intent.pages[r.chemin] = { query:r.requete, descriptionLead:r.description.split(':')[0], measuredAt:ROBOT_HUB.date, source:'Chantier hub robots : DataForSEO Google FR et décisions d’intention du 15/10/2026. Aucun volume supposé ; voir docs/strategy/site-v3/hub-robots/SEO.md.' };
ecrire(ip,intent);
const ep='config/page-contract-exemptions.json', exemptions=lire(ep);
for(const route of [ROBOT_HUB.chemin,...ROBOTS.map(cheminRobot)]) {
  exemptions.exemptions=exemptions.exemptions.filter(e=>e.route!==route);
  exemptions.exemptions.push({route,clauses:[2],date:ROBOT_HUB.date,reason:route===ROBOT_HUB.chemin?'Le catalogue compose les figurines de ses fiches en HTML. Ces images partagées identifient les destinations ; aucun média fonctionnel supplémentaire ne prouverait la routine.':'La démonstration propre à cette fiche est une table HTML accessible de quatre cas fictifs, rendue sans JavaScript. Une capture figée doublerait les sorties et les motifs d’arrêt lisibles.'});
}
ecrire(ep,exemptions);
const rp='config/page-route-contracts.json', routes=lire(rp);
routes.routes[ROBOT_HUB.chemin]={indexing:'index',role:'collection',mediaRequired:false,measuredIntentRequired:true,schemaTypes:['CollectionPage','ItemList','BreadcrumbList'],incomingLinkRequired:true,assetDecision:{kind:'no-functional-media',reason:'Le catalogue est lui-même la restitution : figurines, cartes et filtres dérivés des données, avec une image sociale de son trio.'}};
ecrire(rp,routes);
const hp='public/_headers';let headers=readFileSync(hp,'utf8').split('\n# Hub robots — projection du catalogue')[0].trimEnd();
headers+='\n\n# Hub robots — projection du catalogue\n';
for(const route of [ROBOT_HUB.chemin,...ROBOTS.map(cheminRobot)]) headers+=`\n${route}\n  Content-Security-Policy: default-src 'self'; base-uri 'self'; connect-src 'none'; font-src 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data:; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'\n  Cache-Control: public, max-age=0, must-revalidate, no-transform\n`;
writeFileSync(hp,headers);
console.log(`${ROBOTS.length} fiches et un hub : registres d’intention, contrat et sécurité synchronisés.`);
