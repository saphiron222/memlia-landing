/**
 * Méthode (copy validée, section 5) — les quatre étapes du service, montées dans
 * le parcours défilant de la spec (S5). Une illustration d'objets de bureau par étape,
 * série IMG-07 → IMG-12 (voir src/data/images.mjs).
 */
export interface Etape {
  numero: number;
  titre: string;
  texte: string;
  image: string;
}

export const METHODE = {
  titre: 'Nous construisons. Votre cabinet valide.',
  etapes: [
    {
      numero: 1,
      titre: 'Observer le processus.',
      texte:
        'Vous décrivez la tâche, ses entrées, ses outils et les moments où une personne tranche, sans transmettre de donnée client réelle.',
      image: 'img-19-observer-processus',
    },
    {
      numero: 2,
      titre: 'Cadrer les limites.',
      texte: 'Sources, exceptions, validations et cas de refus deviennent un contrat testable.',
      image: 'img-20-cadrer-limites',
    },
    {
      numero: 3,
      titre: 'Construire et éprouver.',
      texte:
        'Nous développons l’automatisation et la testons sur des jeux fictifs représentatifs du périmètre convenu.',
      image: 'img-21-eprouver-processus',
    },
    {
      numero: 4,
      titre: 'Faire la recette et livrer.',
      texte:
        'Vos référents vérifient les cas attendus et les refus. Livraison, support et évolutions sont définis pour ce périmètre. Le devis dépend de la complexité, jamais des sièges.',
      image: 'img-22-recette-cabinet',
    },
  ] satisfies readonly Etape[],
} as const;
