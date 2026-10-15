import type { Specialiste } from '../specialistes.ts';

/**
 * Balthazar · Comptabilité (AGENTS-CONTENU.md §1) : carte, démonstration, familles titulaires et logiciels. Sa carte
 * mène à /agents-ia/comptabilite ; le contenu de la fiche (`fiche`) s'écrit à la tâche 6, fiche pilote, et `publie`
 * passe alors à `true` (une fiche publiée sans contenu ne se construit pas).
 */
export const COMPTABILITE: Specialiste = {
  slug: 'comptabilite',
  prenom: 'Balthazar',
  libelle: 'Comptabilité',
  groupe: 'production-conseil',
  teinte: 'production-comptable',
  publie: false,
  destination: { type: 'fiche' },
  ligne: 'Prépare chaque geste de la tenue, de la pièce reçue à la clôture ; vos collaborateurs valident chaque écriture.',
  frontiereEnBref: [
    'Lire les pièces et en extraire les champs',
    'Chaque écriture proposée, lot par lot',
    'Le jugement de révision',
  ],
  familles: [
    'collecte-pieces', 'saisie-ocr', 'facture-electronique', 'achats-fournisseurs', 'banque-rapprochement',
    'lettrage', 'ventes-caisse', 'immobilisations-emprunts', 'revision-cycles', 'cloture-bilan', 'notes-de-frais',
    'ged-dossier-permanent',
  ],
  servicesLies: ['saisie-comptable', 'factures-fournisseurs', 'rapprochement-bancaire', 'notes-de-frais', 'facture-electronique'],
  logiciels: [
    'Pennylane', 'Cegid Loop', 'Cegid Quadra Plus', 'Sage 100 Comptabilité', 'Sage Génération Experts', 'ACD COMPTA',
    'EBP Comptabilité', 'MyU', 'Tiime', 'Inqom', 'fulll', 'AMICOMPTA', 'Dext', 'N2F', 'Qonto', 'Planity',
    'PrestaShop', 'Microsoft Excel',
  ],
  avatar: null,
  demonstration: {
    tache: 'lecture et pré-imputation des pièces',
    dossier: 'Dossier fictif : l’Atelier Loriot, SARL de menuiserie inventée, exercice au 31/12/2026, pièces de septembre.',
    regle: 'Une pièce lisible d’un fournisseur connu reçoit l’imputation déjà validée pour lui, avec la TVA calculée sur le taux lu ; un fournisseur nouveau reçoit les imputations possibles, à choisir par le collaborateur. Une pièce illisible, datée hors de l’exercice ou identique à une pièce déjà saisie arrête la proposition et nomme son motif.',
    cas: [
      { cas: 'Facture d’électricité d’un fournisseur déjà imputé en 6061, TVA à 20 % lue', sortie: 'Écriture proposée 6061 / 44566 / 401, pièce en lien', issue: 'Préparé' },
      { cas: 'Première facture d’un fournisseur de quincaillerie', sortie: 'Champs extraits ; deux imputations présentées : achats de matières ou petit équipement', issue: 'À valider' },
      { cas: 'Facture de même numéro et de même montant qu’une pièce saisie en août', sortie: 'Aucune écriture proposée. Motif : doublon probable, pièce d’août en lien', issue: 'Arrêt' },
      { cas: 'Photo de ticket floue, montant TTC illisible', sortie: 'Aucune écriture proposée. Motif : montant illisible ; relance de la pièce préparée', issue: 'Arrêt' },
    ],
  },
};
