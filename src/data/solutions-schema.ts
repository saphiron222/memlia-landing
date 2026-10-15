import type { Solution } from './solutions';
import { SITE } from './site.mjs';
import { organizationNode, serviceNode } from './schema.mjs';
export function schemaSolution(s:Solution) {
 const url=SITE.url+s.chemin;
 return {'@context':'https://schema.org','@graph':[
  organizationNode(),
  {'@type':'WebPage','@id':url+'#page',url,name:s.title,headline:s.h1,description:s.description,inLanguage:SITE.langue,mainEntity:{'@id':url+'#service'}},
  {...serviceNode({chemin:s.chemin,name:s.nom,serviceType:s.id==='os'?'Mémoire collective et orchestration IA du cabinet':'Adaptation et entraînement de modèle IA privé',description:s.description,audienceType:s.audience}),image:SITE.url+s.image},
 ]};
}
