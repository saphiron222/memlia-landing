import type { Specialiste } from '../specialistes.ts';

/**
 * Victoire · Commercial (AGENTS-CONTENU.md §6) : carte, démonstration, familles titulaires et logiciels. Sa carte
 * mène à /agents-ia/commercial ; le contenu de la fiche (`fiche`) s'écrit à la tâche 9, et `publie` passe alors à
 * `true` (une fiche publiée sans contenu ne se construit pas).
 */
export const COMMERCIAL: Specialiste = {
  slug: 'commercial',
  prenom: 'Victoire',
  libelle: 'Commercial',
  groupe: 'relation-client',
  teinte: 'developpement-cabinet',
  publie: false,
  destination: { type: 'fiche' },
  ligne: 'Prépare propositions, entrée en relation et lettres de mission ; l’acceptation du client et la vigilance restent à votre cabinet.',
  frontiereEnBref: [
    'Chiffrer depuis votre barème écrit',
    'Chaque proposition et son prix',
    'L’appréciation du risque et la vigilance LCB-FT',
  ],
  familles: ['suivi-prospects', 'propositions-mission', 'onboarding-client', 'lettre-de-mission-lcbft'],
  servicesLies: [],
  logiciels: [
    'Youtrust', 'Docusign', 'jesignexpert.com', 'Kanta', 'Répertoire Sirene', 'Registre national des entreprises',
    'Microsoft Outlook', 'Gmail', 'Microsoft Excel',
  ],
  avatar: null,
  demonstration: {
    tache: 'entrée en relation',
    dossier: 'Dossier fictif : le Studio Rouge-Gorge, SAS de design graphique inventée, entrée en relation ouverte le 01/10/2026.',
    regle: 'Une entrée en relation avance d’un jalon quand chaque pièce que votre règle de vigilance demande pour ce jalon est reçue, lisible et en cours de validité ; une pièce expirée déclenche une nouvelle demande. Une pièce illisible, un bénéficiaire effectif non identifié ou un jalon franchi sans l’accord écrit de l’associé arrête le dossier et le présente à l’associé.',
    cas: [
      { cas: 'Statuts, extrait d’immatriculation et pièce d’identité de la présidente reçus et lisibles', sortie: 'Jalon « identification de la société » complet, pièces classées dans le dossier', issue: 'Préparé' },
      { cas: 'Pièce d’identité du second associé expirée depuis mars', sortie: 'Pièce signalée, nouvelle demande rédigée pour le dirigeant', issue: 'À valider' },
      { cas: 'Société détenue à 60 % par une holding dont les associés ne sont pas connus', sortie: 'Dossier bloqué. Motif : bénéficiaire effectif non identifié', issue: 'Arrêt' },
      { cas: 'Proposition acceptée, toutes les pièces du jalon reçues', sortie: 'Projet de lettre de mission prêt à relire, honoraires repris de la proposition', issue: 'À valider' },
    ],
  },
};
