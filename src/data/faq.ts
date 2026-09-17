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
      'Non. Memlia est un service : nous observons la tâche, nous écrivons sa règle et ses limites, nous construisons l’automatisation dans vos outils, et vos équipes la valident. Vous n’avez rien à paramétrer.',
  },
  {
    id: 'quitter-excel',
    question: 'Faut-il remplacer nos logiciels ou nos fichiers ?',
    reponse:
      'Non. L’automatisation se greffe sur l’environnement existant : logiciel métier, exports, messagerie, dossier partagé, classeur. Si une évolution d’outil est nécessaire, elle est identifiée avant le développement, jamais découverte après.',
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
      'Toute tâche répétitive dont la règle peut s’écrire : des entrées identifiables, des exceptions listables, un résultat vérifiable. Saisie, relances de pièces, rapprochements, contrôles de paie, retours DSN, échéances, dossier permanent, reporting. Ce qui demande un jugement reste à vos équipes ; ce qui se répète nous revient.',
  },
  {
    id: 'prix',
    question: 'Comment le prix est-il calculé ?',
    reponse:
      'Vous payez une tâche prise en charge, pas des sièges. Le devis dépend des sources, des règles, des exceptions et des validations à couvrir ; maintenance, support et évolutions y sont écrits.',
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
