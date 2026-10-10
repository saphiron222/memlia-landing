import { CONTENU_EC } from './ec';
import { CONTENU_CAC } from './cac';
import type { ContenuAccueil, Profession } from './types';
export type { ContenuAccueil, Profession } from './types';

/** Ne jamais remplacer un public absent par la copie d’un autre métier. */
export function contenuDe(profession: Profession): ContenuAccueil {
  if (profession === 'ec') return CONTENU_EC;
  if (profession === 'cac') return CONTENU_CAC;
  throw new Error(`Contenu d’accueil indisponible pour la profession : ${profession}`);
}
