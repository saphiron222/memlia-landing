import { reponseMigration } from '../../src/data/migrations-catalogues.mjs';
export const onRequestGet = context => reponseMigration(context.request) ?? context.next();
export const onRequestHead = onRequestGet;
