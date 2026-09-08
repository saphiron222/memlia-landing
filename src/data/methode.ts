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
  titre: 'Nous faisons le travail. Vous gardez les décisions.',
  etapes: [
    {
      numero: 1,
      titre: 'Montrez la règle.',
      texte:
        'Nous partons d’un contrôle, d’un classeur et du résultat attendu — pas d’une démonstration générique.',
      image: 'img-07-enveloppes-pieces',
    },
    {
      numero: 2,
      titre: 'Fixons les limites.',
      texte: 'Sources, exceptions, validations et cas de refus deviennent un contrat testable.',
      image: 'img-09-tampon-dateur',
    },
    {
      numero: 3,
      titre: 'Nous codons et éprouvons.',
      texte:
        'Le complément est développé sur la structure de vos fichiers, avec un jeu de données fictif.',
      image: 'img-08-calculatrice-bulletin',
    },
    {
      numero: 4,
      titre: 'Vous validez la recette.',
      texte:
        'Nous livrons quand le comportement attendu et les refus sont visibles. Le devis dépend de cette complexité, jamais du nombre d’utilisateurs.',
      image: 'img-11-chemise-recette',
    },
  ] satisfies readonly Etape[],
} as const;
