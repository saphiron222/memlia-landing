/**
 * Méthode (copy validée, section 5) — les quatre étapes du service, montées dans
 * le parcours défilant. Chaque preuve M4-R1 reste dans le flux, lisible sans JavaScript.
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
      image: '04-observer',
    },
    {
      numero: 2,
      titre: 'Cadrer les limites.',
      texte: 'Sources, exceptions, validations et cas de refus deviennent un contrat testable.',
      image: '05-cadrer',
    },
    {
      numero: 3,
      titre: 'Construire et éprouver.',
      texte:
        'Nous développons l’automatisation et la testons sur des jeux fictifs représentatifs du périmètre convenu.',
      image: '06-eprouver',
    },
    {
      numero: 4,
      titre: 'Faire la recette et livrer.',
      texte:
        'Vos référents vérifient les cas attendus et les refus. Livraison, support et évolutions sont définis pour ce périmètre. Le devis dépend de la complexité, jamais des sièges.',
      image: '07-livrer',
    },
  ] satisfies readonly Etape[],
} as const;
