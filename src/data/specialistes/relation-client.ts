import type { Specialiste } from '../specialistes.ts';

/**
 * Émile · Relation client (AGENTS-CONTENU.md §8) : carte, démonstration, familles titulaires et logiciels. Sa carte
 * mène à /agents-ia/relation-client ; le contenu de la fiche (`fiche`) s'écrit à la tâche 9, et `publie` passe alors
 * à `true` (une fiche publiée sans contenu ne se construit pas).
 */
export const RELATION_CLIENT: Specialiste = {
  slug: 'relation-client',
  prenom: 'Émile',
  libelle: 'Relation client',
  groupe: 'relation-client',
  teinte: 'administratif-secretariat',
  publie: false,
  destination: { type: 'fiche' },
  ligne: 'Trie chaque demande de vos clients, la relie à son dossier et prépare la réponse ; votre collaborateur valide avant envoi.',
  frontiereEnBref: [
    'Trier, relier au dossier et prioriser',
    'Chaque réponse avant envoi',
    'Toute réponse qui engage le cabinet ou donne un conseil',
  ],
  familles: [
    'boite-mail-courriers', 'suivi-demandes-clients', 'envois-plaquettes-documents', 'rendez-vous-agenda',
    'offboarding-transfert', 'satisfaction-clients',
  ],
  servicesLies: [],
  logiciels: ['Microsoft Outlook', 'Gmail', 'Microsoft SharePoint', 'Microsoft OneDrive', 'Google Drive', 'Microsoft Excel'],
  avatar: null,
  demonstration: {
    tache: 'tri et réponse',
    dossier: 'Dossier fictif : la boîte partagée d’un cabinet inventé, messages du 12/10/2026 sur le dossier Fauvette (SARL de fleuristerie inventée).',
    regle: 'Un message reçoit une réponse préparée quand son expéditeur est relié à un dossier et que sa demande correspond à l’une des réponses types écrites par le cabinet, remplie avec les données du dossier ; un expéditeur inconnu est rapproché du dossier probable, à confirmer. Une demande hors des réponses types, dont toute demande de conseil, ou une pièce jointe illisible arrête la réponse et place le message devant le collaborateur du dossier.',
    cas: [
      { cas: 'La gérante de Fauvette demande la date de sa prochaine déclaration de TVA', sortie: 'Réponse rédigée avec la date du calendrier du dossier', issue: 'Préparé' },
      { cas: 'La gérante demande la plaquette de l’exercice 2025', sortie: 'Plaquette retrouvée dans le dossier, envoi préparé', issue: 'Préparé' },
      { cas: 'Message d’une adresse inconnue, facture en pièce jointe', sortie: 'Pièce mise de côté, dossier probable proposé', issue: 'À valider' },
      { cas: 'La gérante demande s’il vaut mieux acheter ou louer sa camionnette', sortie: 'Aucune réponse rédigée. Motif : demande de conseil, hors des réponses types ; message placé devant l’expert-comptable', issue: 'Arrêt' },
    ],
  },
};
