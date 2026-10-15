import type { Specialiste } from '../specialistes.ts';

/**
 * Colette · Communication (AGENTS-CONTENU.md §7) : carte, démonstration, familles titulaires et logiciels. Sa carte
 * mène à /agents-ia/communication ; le contenu de la fiche (`fiche`) s'écrit à la tâche 9, et `publie` passe alors à
 * `true` (une fiche publiée sans contenu ne se construit pas).
 */
export const COMMUNICATION: Specialiste = {
  slug: 'communication',
  prenom: 'Colette',
  libelle: 'Communication',
  groupe: 'relation-client',
  teinte: 'developpement-cabinet',
  publie: false,
  destination: { type: 'fiche' },
  ligne: 'Rédige la lettre d’information et l’actualité de vos clients depuis les sources officielles ; vous relisez avant tout envoi.',
  frontiereEnBref: [
    'Lire les sources officielles et repérer les changements',
    'Chaque texte avant envoi ou publication',
    'Le choix des sujets et la parole du cabinet',
  ],
  familles: ['actualite-a-diffuser', 'lettre-information-clients', 'publications-cabinet'],
  servicesLies: [],
  logiciels: ['Microsoft Outlook', 'Gmail', 'Microsoft SharePoint', 'Google Drive', 'Brevo', 'Mailchimp'],
  avatar: null,
  demonstration: {
    tache: 'lettre d’information',
    dossier: 'Dossier fictif : le cabinet Alouette, cabinet inventé, lettre d’information d’octobre 2026.',
    regle: 'Un sujet entre dans la lettre s’il a été retenu par le cabinet et que chaque règle citée renvoie à une source officielle datée ; le texte suit le ton et les formules écrites pour le cabinet. Une source absente ou non officielle, une date d’application incertaine ou un destinataire hors de la liste autorisée arrête le sujet, ou l’envoi.',
    cas: [
      { cas: 'Sujet retenu : réception des factures électroniques, source officielle lue', sortie: 'Paragraphe rédigé autour de la phrase « Depuis le 1er septembre 2026, toute entreprise doit pouvoir recevoir ses factures au format électronique. », lien vers la source', issue: 'Préparé' },
      { cas: 'Sujet proposé par la veille, pas encore retenu par l’associé', sortie: 'Sujet placé en attente au calendrier, résumé joint', issue: 'À valider' },
      { cas: 'Liste de diffusion qui contient trois clients sortis du portefeuille', sortie: 'Destinataires en cause listés, envoi suspendu jusqu’à la décision de l’associé', issue: 'À valider' },
      { cas: 'Barème repris d’un article de presse, sans texte officiel', sortie: 'Aucun paragraphe rédigé. Motif : source non officielle', issue: 'Arrêt' },
    ],
  },
};
