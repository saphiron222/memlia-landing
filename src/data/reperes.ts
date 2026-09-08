/**
 * Repères vérifiables (spec S6 b) — chiffres métier reproductibles et stables.
 * Règle : aucun chiffre client, aucun compte de tests internes. Chaque repère découle
 * d'un engagement déjà écrit dans la copy validée ou la grille de garanties.
 * ⚠ La liste finale est une décision de Kevin : retirer ou compléter ici uniquement.
 */
export interface Repere {
  chiffre: string;
  libelle: string;
  /** Ancre de la preuve correspondante sur l'accueil. */
  href: string;
  libelleLien: string;
}

export const REPERES: readonly Repere[] = [
  {
    chiffre: '0',
    libelle: 'macro dans le complément : un panneau latéral, rien d’exécuté à votre insu.',
    href: '#module-suivi-social',
    libelleLien: 'Voir le module',
  },
  {
    chiffre: '0',
    libelle: 'migration : votre classeur reste le point de travail.',
    href: '#promesse',
    libelleLien: 'Lire la promesse',
  },
  {
    chiffre: '0',
    libelle: 'donnée client réelle dans les jeux de développement, de test et de démonstration.',
    href: '#faq-donnees-reelles',
    libelleLien: 'Lire la réponse',
  },
  {
    chiffre: '1',
    libelle: 'recette par périmètre livré, sur un jeu fictif représentatif, avant toute installation.',
    href: '#faq-recette',
    libelleLien: 'Comment se déroule la recette',
  },
] as const;
