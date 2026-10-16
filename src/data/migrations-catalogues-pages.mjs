// Le bundler Pages incorpore le JSON ; cette entrée ne se charge pas directement dans Node.
import decision from '../../config/migration-catalogues.json';
import { creerMigrationCatalogues } from './migrations-catalogues-core.mjs';

export const { reponseMigration } = creerMigrationCatalogues(decision);
