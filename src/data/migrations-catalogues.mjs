import decision from '../../config/migration-catalogues.json' with { type: 'json' };
import { creerMigrationCatalogues } from './migrations-catalogues-core.mjs';

export { verifierDecisionMigration } from './migrations-catalogues-core.mjs';
export const {
  MIGRATION_CATALOGUES, ROUTES_RETIREES, estRouteRetiree,
  destinationActuelle, blocRedirections, reponseMigration,
} = creerMigrationCatalogues(decision);
