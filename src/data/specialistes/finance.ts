import type { Specialiste } from '../specialistes.ts';

/**
 * Florent · Finance (AGENTS-CONTENU.md §4) : carte, démonstration, familles titulaires et logiciels. Sa carte mène à
 * /agents-ia/finance ; le contenu de la fiche (`fiche`) s'écrit à la tâche 9, et `publie` passe alors à `true` (une
 * fiche publiée sans contenu ne se construit pas).
 */
export const FINANCE: Specialiste = {
  slug: 'finance',
  prenom: 'Florent',
  libelle: 'Finance',
  groupe: 'production-conseil',
  teinte: 'conseil-missions',
  publie: false,
  destination: { type: 'fiche' },
  ligne: 'Prépare situations, trésorerie et prévisionnels de vos clients depuis la comptabilité tenue ; chaque hypothèse est tracée pour votre revue.',
  frontiereEnBref: [
    'Projeter les flux datés et chiffrés',
    'Chaque hypothèse et chaque retraitement',
    'Le conseil au client',
  ],
  familles: [
    'situations-reporting-client', 'tresorerie-previsionnelle', 'previsionnel-business-plan', 'financement-aides',
    'remuneration-dirigeant', 'evaluation-transmission',
  ],
  servicesLies: ['evaluation-transmission'],
  logiciels: [
    'Microsoft Excel', 'RCA Évaluation', 'Qonto', 'Pennylane', 'Cegid Loop', 'ACD COMPTA', 'Sage 100 Comptabilité',
    'EBP Comptabilité', 'MyU',
  ],
  avatar: null,
  demonstration: {
    tache: 'trésorerie prévisionnelle',
    dossier: 'Dossier fictif : la Menuiserie Pinson, SAS inventée, solde bancaire rapproché au 30/09/2026, projection jusqu’au 31/12/2026.',
    regle: 'La projection part du solde bancaire rapproché et n’ajoute que des flux datés et chiffrés : échéances connues (emprunts, salaires, TVA, cotisations) et factures émises ou reçues à leur date d’échéance. Un flux sans date ni montant écrit, un solde non rapproché ou une hypothèse sans source reste hors de la projection et se présente au collaborateur.',
    cas: [
      { cas: 'Solde rapproché au 30/09 ; échéance d’emprunt, salaires et TVA datés', sortie: 'Projection semaine par semaine jusqu’à fin décembre, chaque flux avec sa source', issue: 'Préparé' },
      { cas: 'Facture client de 18 000 € échue depuis soixante jours', sortie: 'Encaissement laissé à son échéance avec la mention « retard constaté » ; scénario sans cet encaissement présenté à côté', issue: 'À valider' },
      { cas: 'Semaine du 23/11, solde projeté sous le seuil d’alerte écrit du dossier', sortie: 'Tension signalée, les trois flux qui la causent listés', issue: 'À valider' },
      { cas: 'Grosse commande annoncée par le dirigeant, sans date ni montant écrit', sortie: 'Flux non intégré. Motif : hypothèse sans source', issue: 'Arrêt' },
    ],
  },
};
