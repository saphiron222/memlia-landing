/**
 * Auteurs du blog — une seule source pour la signature visible, le bloc « À propos »
 * et le nœud `Person` du JSON-LD. Aucune photo ni profil social tant qu'ils ne sont
 * pas validés par Kevin ; le bloc reste factuel (rôle, périmètre de travail).
 */
export const IDS_AUTEURS = ['kevin'] as const;
export type IdAuteur = (typeof IDS_AUTEURS)[number];

export interface Auteur {
  id: IdAuteur;
  nom: string;
  role: string;
  /** Deux phrases factuelles ; aucun chiffre client, aucune promesse. */
  bio: string;
  /** Ancre de la fiche auteur sur la page du blog (`/blog#auteur-<id>`). */
  ancre: string;
}

export const AUTEURS: Record<IdAuteur, Auteur> = {
  kevin: {
    id: 'kevin',
    nom: 'Kevin Kitanga',
    role: 'Fondateur de Memlia',
    bio:
      'Kevin Kitanga conçoit et livre les automatisations Memlia pour les cabinets d’expertise comptable : cadrage des règles avec le cabinet, construction sur jeux d’essai fictifs, recette avec les équipes. Il écrit ici sur ce qui se vérifie, ce qui s’automatise et ce qui reste une décision humaine.',
    ancre: '#auteur-kevin',
  },
};

export const auteurPar = (id: IdAuteur): Auteur => AUTEURS[id];
