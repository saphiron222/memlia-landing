/**
 * FAQ — copy validée (section 6). Une seule source : l'accordéon visible et le
 * JSON-LD `FAQPage` sont générés depuis ce tableau, donc toujours identiques.
 * `id` sert d'ancre (#faq-<id>) aux cellules de la grille de garanties.
 */
export interface QuestionReponse {
  id: string;
  question: string;
  reponse: string;
}

export const FAQ: readonly QuestionReponse[] = [
  {
    id: 'abonnement',
    question: 'Memlia est-il un logiciel par abonnement ?',
    reponse:
      'Memlia est d’abord un service : nous transformons une règle de votre cabinet en complément Excel livré et éprouvé. Le devis porte sur la complexité du périmètre, pas sur un nombre de sièges.',
  },
  {
    id: 'quitter-excel',
    question: 'Devons-nous quitter Excel ou migrer nos classeurs ?',
    reponse:
      'Non. Le principe est de greffer l’automatisation aux fichiers que le cabinet utilise déjà. Si leur structure doit évoluer, ce point est cadré avant développement.',
  },
  {
    id: 'ia-decide',
    question: 'L’IA décide-t-elle à la place du gestionnaire ou de l’expert-comptable ?',
    reponse:
      'Non. Elle prépare, calcule ou signale. Les actions sensibles restent proposées à un humain, qui valide, modifie ou refuse.',
  },
  {
    id: 'fichier-ambigu',
    question: 'Que se passe-t-il si le fichier est incomplet ou ambigu ?',
    reponse:
      'Le complément s’arrête sur le cas non couvert et l’explique. Il ne complète pas silencieusement une donnée métier.',
  },
  {
    id: 'surveillance',
    question: 'Est-ce un outil de surveillance des équipes ?',
    reponse:
      'Non. Les vues de supervision reposent sur des agrégats de production. Memlia ne classe pas les salariés et ne publie pas d’indicateurs nominatifs de performance.',
  },
  {
    id: 'donnees-reelles',
    question: 'Utilisez-vous des données réelles pour construire ou démontrer le module ?',
    reponse:
      'Non. Les jeux de développement, de test et de démonstration sont fictifs. En exploitation, les flux, accès, traitements et éventuels hébergements sont documentés module par module avant installation ; aucune réponse générique ne doit masquer cette revue.',
  },
  {
    id: 'sujets',
    question: 'Quels sujets pouvez-vous automatiser ?',
    reponse:
      'La priorité est la production sociale : suivi, supervision et contrôles avant DSN. D’autres périmètres sont étudiés selon leur état de disponibilité et la règle à formaliser.',
  },
  {
    id: 'prix',
    question: 'Comment le prix est-il calculé ?',
    reponse:
      'Selon le nombre de sources, la variété des fichiers, les exceptions métier, les contrôles et les surfaces de validation. Deux cabinets avec le même nombre de collaborateurs peuvent donc avoir des devis différents.',
  },
  {
    id: 'compatibilite',
    question: 'Quelles versions d’Excel et quels environnements sont compatibles ?',
    reponse:
      'La réponse dépend du module : Office.js ou COM/.NET, version d’Office, poste Windows et structure du classeur. Le devis liste l’environnement couvert ; aucune compatibilité universelle n’est promise.',
  },
  {
    id: 'evolution',
    question: 'Que se passe-t-il si notre fichier ou notre règle évolue ?',
    reponse:
      'La maintenance, le support et les adaptations hors périmètre initial sont définis dans la proposition commerciale. Une modification de structure ou de règle déclenche une analyse d’impact et, si nécessaire, une nouvelle recette.',
  },
  {
    id: 'recette',
    question: 'Comment se déroule la recette ?',
    reponse:
      'Le cabinet vérifie les cas attendus, les exceptions et les refus sur un jeu fictif représentatif. La livraison ne vaut que pour le périmètre, les fichiers et l’environnement explicitement acceptés.',
  },
] as const;

export const ancreFaq = (id: string) => `#faq-${id}`;
