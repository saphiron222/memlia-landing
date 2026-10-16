/** Atelier statique : même protection des illustrations fictives que les fiches robots. */
import {onRequestGet as secureGet,onRequestHead as secureHead} from '../outils-comptables-gratuits/calculateur-roi-automatisation.js';
const slugs=new Set(['direction-figurines','methode-figurines']);
export const onRequestGet=context=>slugs.has(context.params.slug)?secureGet(context):context.next();
export const onRequestHead=context=>slugs.has(context.params.slug)?secureHead(context):context.next();
