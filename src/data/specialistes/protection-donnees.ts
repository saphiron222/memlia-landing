import type { Specialiste } from '../specialistes.ts';

/**
 * Prudence · Protection des données (AGENTS-CONTENU.md §12) : carte, démonstration, familles titulaires et
 * logiciels. Sa carte mène à /agents-ia/protection-donnees ; le contenu de la fiche (`fiche`) s'écrit à la tâche 9,
 * et `publie` passe alors à `true` (une fiche publiée sans contenu ne se construit pas).
 */
export const PROTECTION_DONNEES: Specialiste = {
  slug: 'protection-donnees',
  prenom: 'Prudence',
  libelle: 'Protection des données',
  groupe: 'vie-cabinet',
  teinte: 'numerique-it-data',
  publie: false,
  destination: { type: 'fiche' },
  ligne: 'Prépare la mise à jour du registre des traitements et les réponses aux demandes d’accès des personnes concernées ; votre référent décide.',
  frontiereEnBref: [
    'Inventorier traitements, outils et sous-traitants',
    'Chaque réponse à une personne concernée',
    'La décision du responsable de traitement et de la personne qu’il a désignée',
  ],
  familles: [
    'registre-traitements', 'demandes-droits', 'rgpd-secret-securite', 'durees-conservation', 'incidents-donnees',
    'ai-act-conformite',
  ],
  servicesLies: [],
  logiciels: [
    'Modèle de registre des traitements', 'Microsoft Excel', 'Microsoft SharePoint', 'Microsoft OneDrive',
    'Microsoft Outlook', 'Gmail', 'Silae',
  ],
  avatar: null,
  demonstration: {
    tache: 'demande d’accès',
    dossier: 'Dossier fictif : le cabinet Alouette, cabinet inventé, demandes reçues en octobre 2026.',
    regle: 'Une demande d’accès d’une personne concernée, dont l’identité est vérifiée selon la règle du cabinet, déclenche la recherche de ses données dans les outils listés au registre, puis une réponse rédigée qui les présente traitement par traitement. Une identité non vérifiée ou une demande venant d’une personne morale arrête la recherche ; un passage qui concerne aussi un tiers est isolé pour la décision du référent.',
    cas: [
      { cas: 'Salariée d’un client, identité vérifiée ; données dans la paie et la messagerie', sortie: 'Données retrouvées par traitement, réponse rédigée, date limite posée au calendrier', issue: 'Préparé' },
      { cas: 'Courriel de la même salariée qui cite aussi un collègue', sortie: 'Passages qui concernent le tiers isolés, à trancher par le référent', issue: 'À valider' },
      { cas: 'Client particulier écrivant d’une adresse inconnue du dossier', sortie: 'Aucune recherche lancée. Motif : identité non vérifiée ; demande de justificatif préparée', issue: 'Arrêt' },
      { cas: 'Société cliente qui demande « toutes ses données personnelles »', sortie: 'Aucune recherche lancée. Motif : le droit d’accès appartient aux personnes physiques ; note au référent', issue: 'Arrêt' },
    ],
  },
};
