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
    question: 'Memlia est-il un logiciel à paramétrer seul ?',
    reponse:
      'Non. Memlia est un service d’automatisation IA pour cabinets d’expertise comptable. Nous observons un processus, écrivons ses règles et ses limites, construisons l’automatisation puis la faisons valider par le cabinet.',
  },
  {
    id: 'quitter-excel',
    question: 'Faut-il remplacer nos logiciels ou nos fichiers ?',
    reponse:
      'Pas par principe. Nous cherchons d’abord à intégrer l’automatisation à l’environnement existant. Si une évolution d’outil ou de structure est nécessaire, elle est identifiée avant le développement.',
  },
  {
    id: 'ia-decide',
    question: 'L’IA peut-elle agir sans validation ?',
    reponse:
      'Uniquement pour la mécanique explicitement autorisée dans le périmètre accepté. Les décisions sensibles restent proposées à la personne désignée, qui peut valider, modifier ou refuser. Aucun envoi externe sans validation humaine : mail, déclaration ou facture.',
  },
  {
    id: 'fichier-ambigu',
    question: 'Que se passe-t-il si une information manque ou si le cas est ambigu ?',
    reponse:
      'L’automatisation bloque l’écriture concernée et signale le cas. Elle ne complète pas silencieusement une information métier et n’étend pas seule la règle : c’est le principe fail-closed.',
  },
  {
    id: 'surveillance',
    question: 'Est-ce un outil de surveillance des équipes ?',
    reponse:
      'Non. Les éventuelles vues de pilotage portent sur l’avancement du processus et des agrégats utiles, jamais nominatifs. Memlia ne note pas les salariés et ne publie aucun classement individuel.',
  },
  {
    id: 'donnees-reelles',
    question: 'Utilisez-vous des données client réelles pour développer ou démontrer ?',
    reponse:
      'Non. Les développements, tests et démonstrations utilisent des jeux fictifs. En exploitation, les données, accès, flux, hébergements éventuels, durées de conservation et responsabilités RGPD sont documentés pour chaque automatisation avant installation, dans le respect du secret professionnel. Ce cadrage ne constitue pas une certification de conformité.',
  },
  {
    id: 'sujets',
    question: 'Quels processus pouvez-vous automatiser ?',
    reponse:
      'Nous étudions les tâches répétitives qui reposent sur des entrées identifiables, des règles explicables, des exceptions listables et un résultat vérifiable. La faisabilité dépend des outils, des accès et du niveau de jugement requis. Les exemples d’usages sont non contractuels.',
  },
  {
    id: 'prix',
    question: 'Comment le prix est-il calculé ?',
    reponse:
      'Le devis dépend des sources, des intégrations, des règles, des exceptions, des validations et de la valeur du processus couvert. Il n’est jamais multiplié par le nombre de sièges. Maintenance, support et évolutions sont cadrés dans la proposition commerciale.',
  },
  {
    id: 'compatibilite',
    question: 'Memlia fonctionne-t-il uniquement dans Excel ?',
    reponse:
      'Non. Excel peut faire partie du processus, comme un logiciel métier, un export, une messagerie ou un dossier partagé. Le choix dépend de la tâche et des intégrations techniquement accessibles. Les versions et environnements couverts sont définis avant de développer.',
  },
  {
    id: 'evolution',
    question: 'Que se passe-t-il si notre processus ou nos outils évoluent ?',
    reponse:
      'La maintenance, le support et les évolutions sont définis dans la proposition commerciale. Tout changement susceptible d’affecter la règle, la source ou le résultat déclenche une analyse d’impact et, si nécessaire, une nouvelle recette.',
  },
  {
    id: 'recette',
    question: 'Comment se déroule la recette ?',
    reponse:
      'Vos référents vérifient les cas attendus, les exceptions et les refus sur des jeux fictifs représentatifs. La livraison vaut pour le périmètre et l’environnement explicitement acceptés, pas pour des intégrations non testées.',
  },
] as const;

export const ancreFaq = (id: string) => `#faq-${id}`;
