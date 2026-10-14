import type { OutilCategory, OutilDefinition } from '@/data/outils';

/*
 * Textes propres au gabarit des outils (épure du 14/10/2026, OUTILS-EPURE-PLAN.md). Le rendu de la
 * FAQ et son JSON-LD `FAQPage` lisent le même tableau : la question affichée et la question
 * déclarée ne peuvent pas diverger.
 */

export const OUTIL_GRATUIT = 'Gratuit, sans compte.';
export const HUB_GRATUIT = 'Gratuit, sans inscription.';

const TITRES_SOURCE: Record<OutilCategory, string> = {
  calculer: 'Comment c’est calculé',
  verifier: 'Comment c’est vérifié',
  preparer: 'Comment c’est préparé',
  'se-situer': 'Comment le diagnostic est établi',
  ecrire: 'Comment c’est assemblé',
  explorer: 'Comment c’est assemblé',
};

const TITRES_APPEL: Record<OutilCategory, string> = {
  calculer: 'La règle de votre cabinet ne tient pas dans un calculateur.',
  verifier: 'Ce contrôle revient dans tous vos dossiers ?',
  preparer: 'Cette préparation revient dans tous vos dossiers ?',
  'se-situer': 'Du diagnostic à une première tâche prise en charge.',
  ecrire: 'Une consigne écrite est le départ, pas la tâche entière.',
  explorer: 'Une consigne écrite est le départ, pas la tâche entière.',
};

export function titreSource(categorie: OutilCategory): string {
  return TITRES_SOURCE[categorie];
}

// Quand le titre de la catégorie ne dit pas le geste de l'outil : le portefeuille d'un CAC se dit
// en mandats (charte §5), et vérifier une consigne n'est pas un contrôle de dossier.
const TITRES_APPEL_OUTIL: Readonly<Record<string, string>> = {
  'suivi-circularisation': 'Cette préparation revient sur tous vos mandats ?',
  'verificateur-prompt-ia': TITRES_APPEL.ecrire,
};

export function titreAppel(outil: Pick<OutilDefinition, 'slug' | 'categorie'>): string {
  return TITRES_APPEL_OUTIL[outil.slug] ?? TITRES_APPEL[outil.categorie];
}

export interface QuestionOutil {
  id: string;
  question: string;
  reponse: string;
}

// La réponse sur les données ne recopie pas la mention locale, rendue une fois près de l'outil :
// elle dit ce que la page bloque et ce qui ne part qu'avec un consentement (#consentement_origine
// de /contact, lu seulement à l'envoi).
const QUESTIONS_OUTIL: readonly QuestionOutil[] = [
  {
    id: 'outil-faq-gratuit',
    question: 'Cet outil est-il vraiment gratuit ?',
    reponse: 'Oui. Vous pouvez l’utiliser sans compte, sans adresse e-mail et sans transmettre de moyen de paiement.',
  },
  {
    id: 'outil-faq-local',
    question: 'Mes données quittent-elles le navigateur ?',
    reponse: 'Non. La politique de sécurité de cette page bloque les connexions sortantes pendant que vous utilisez l’outil. Si vous ouvrez ensuite le formulaire de contact, le chemin de cette page n’est associé à votre message qu’avec votre accord, et seulement si vous l’envoyez.',
  },
];

export function questionsOutil(): readonly QuestionOutil[] {
  return QUESTIONS_OUTIL;
}

export function faqPageNode(url: string, langue: string, questions: readonly QuestionOutil[]) {
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    url,
    inLanguage: langue,
    mainEntity: questions.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.reponse },
    })),
  };
}
