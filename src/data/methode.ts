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
      titre: 'Observer le geste réel.',
      texte:
        'Vous décrivez la tâche, ses entrées, ses outils et les moments où quelqu’un tranche. Vous n’avez aucun fichier à nous envoyer.',
      image: '04-observer',
    },
    {
      numero: 2,
      titre: 'Écrire la règle dans vos mots.',
      texte: 'Ce qui doit se produire, ce qui fait exception, ce qui doit s’arrêter : la règle devient un document que vos équipes relisent.',
      image: '05-cadrer',
    },
    {
      numero: 3,
      titre: 'Construire et éprouver.',
      texte:
        'Nous développons l’automatisation et la testons sur un jeu d’essai fictif : les cas qui doivent aboutir, et ceux qui doivent échouer.',
      image: '06-eprouver',
    },
    {
      numero: 4,
      titre: 'Faire la recette et livrer.',
      texte:
        'Vos référents vérifient les cas attendus et les refus, sur vos fichiers. Livraison, maintenance et évolutions sont écrites pour ce périmètre ; le devis dépend de la complexité, jamais des sièges.',
      image: '07-livrer',
    },
  ] satisfies readonly Etape[],
} as const;
