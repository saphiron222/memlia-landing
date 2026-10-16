import { ROBOTS } from '../../src/data/robots.ts';
import { reponseMigration } from '../../src/data/migrations-catalogues-pages.mjs';
import { onRequestGet as secureGet, onRequestHead as secureHead } from '../outils-comptables-gratuits/calculateur-roi-automatisation.js';
const slugs = new Set(ROBOTS.map((robot) => robot.slug));
export const onRequestGet = (context) => reponseMigration(context.request) ?? (slugs.has(context.params.slug) ? secureGet(context) : context.next());
export const onRequestHead = (context) => reponseMigration(context.request) ?? (slugs.has(context.params.slug) ? secureHead(context) : context.next());
