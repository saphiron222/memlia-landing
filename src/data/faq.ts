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
    question: 'Comment déployer un robot ou un agent IA Memlia ?',
    reponse:
      'Vous choisissez une tâche ou un métier à accompagner. Nous partons du catalogue Memlia, adaptons les accès, les règles et les livrables à votre cabinet, puis faisons vérifier le résultat par votre équipe. Nous assurons la mise en service et la maintenance convenue. Vous avez un interlocuteur pour le déploiement.',
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
    question: 'Faut-il tout construire sur mesure ?',
    reponse:
      'Nous commençons par les robots et agents IA du catalogue : collectes fiscales et sociales, préparation comptable, documents, suivi et reporting. Nous les adaptons à vos outils et à vos règles. Si une fonction manque ou si votre processus est particulier, nous construisons le complément ou la prise en charge sur mesure.',
  },
  {
    id: 'prix',
    question: 'Comment le prix est-il calculé ?',
    reponse:
      'Vous payez une tâche prise en charge, pas des sièges. Le devis précise le déploiement, les adaptations et la maintenance. Il dépend des sources, des règles, des exceptions et des validations à couvrir. Une construction sur mesure est détaillée lorsqu’elle est nécessaire.',
  },
  {
    id: 'compatibilite',
    question: 'Et si notre logiciel n’est pas listé ?',
    reponse:
      'Votre logiciel n’est pas listé ? Nous l’intégrons sur demande. Nous vérifions la version, les formats disponibles, les droits et les étapes d’authentification avant de définir la connexion. Votre logiciel métier, un export, une messagerie ou un dossier partagé peuvent être le point d’entrée du traitement.',
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
