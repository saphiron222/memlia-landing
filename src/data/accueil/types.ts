import type { QuestionReponse } from '../faq';
import type { Garantie } from '../garanties';
import type { Etape } from '../methode';
import type { ProofId } from '../proofs';

export type Profession = 'ec' | 'cac';
type Lien = { libelle: string; href: string };
type Texte = { titre: string; texte: string };

/** Données de page uniquement : les composants conservent le DOM, les styles et les interactions. */
export interface ContenuAccueil {
  hero: { etiquette: string; titre: string; texte: string; poster: string; video: string; sousTitres: string };
  orientation: { titre: string; destinations: (Lien & { texte: string })[]; services: Lien[]; invitation: string };
  quotidien: { titre: string; texte: string; points: Texte[]; note: string; image: ProofId };
  promesse: { titre: string; texte: string; points: Texte[]; image: ProofId };
  usages: { titre: string; texte: string; exemples: { id: string; title: string; text: string }[] };
  methode: { titre: string; etapes: readonly Etape[]; libelleEtape: string };
  integration: { titre: string; texte: string; limites: string; regles: Texte[]; image: ProofId };
  preuves: { etiquette: string; titre: string; texte: string; propriete: string; reperes: { title: string; text: string }[]; image: ProofId };
  garanties: { titre: string; invitation: string; liens: readonly Garantie[]; image: ProofId };
  faq: { titre: string; texte: string; questions: readonly QuestionReponse[] };
  appelFinal: { titre: string; texte: string; points: string[] };
}
