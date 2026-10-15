import type { Specialiste } from '../specialistes.ts';

/**
 * Honoré · Gestion du cabinet (AGENTS-CONTENU.md §9) : carte, démonstration, familles titulaires et logiciels. Sa
 * carte mène à /agents-ia/gestion-cabinet ; le contenu de la fiche (`fiche`) s'écrit à la tâche 9, et `publie` passe
 * alors à `true` (une fiche publiée sans contenu ne se construit pas).
 */
export const GESTION_CABINET: Specialiste = {
  slug: 'gestion-cabinet',
  prenom: 'Honoré',
  libelle: 'Gestion du cabinet',
  groupe: 'vie-cabinet',
  teinte: 'facturation-recouvrement',
  publie: false,
  destination: { type: 'fiche' },
  ligne: 'Prépare honoraires, prélèvements, relances d’impayés et plan de charge ; le portefeuille se lit en agrégats, jamais par personne.',
  frontiereEnBref: [
    'Rapprocher actes, relevés et barèmes',
    'Chaque facture',
    'Toute appréciation d’un collaborateur',
  ],
  familles: [
    'honoraires-facturation', 'prelevements-encaissements', 'relances-impayes', 'rentabilite-dossiers',
    'suivi-dossiers-etats', 'tableau-de-bord-production', 'planification-charge',
  ],
  servicesLies: [],
  logiciels: [
    'ACD GI', 'MEG (Mon Expert en Gestion)', 'Microsoft Excel', 'Qonto', 'Pennylane', 'Cegid Loop',
    'Microsoft Outlook', 'Gmail',
  ],
  avatar: null,
  demonstration: {
    tache: 'actes hors forfait',
    dossier: 'Dossier fictif : trois dossiers inventés (Martinet, Rossignol, Sittelle), relevé d’actes d’octobre 2026.',
    regle: 'Un acte hors forfait se facture une fois : il figure au relevé du mois, son tarif est écrit dans la lettre de mission ou le barème, et aucune facture antérieure ne porte sa référence. Un acte sans tarif écrit ou déjà facturé arrête la ligne ; une lettre de mission échue laisse la ligne au tarif en vigueur et le signale.',
    cas: [
      { cas: 'Martinet : trois bulletins au-delà du forfait, tarif unitaire écrit dans la lettre', sortie: 'Ligne préparée avec la référence du relevé d’actes', issue: 'Préparé' },
      { cas: 'Martinet : lettre de mission échue au 30/09/2026', sortie: 'Ligne préparée au tarif de la lettre échue, mention « lettre à renouveler »', issue: 'À valider' },
      { cas: 'Rossignol : attestation demandée par la banque, aucun tarif écrit', sortie: 'Aucune ligne préparée. Motif : acte sans tarif écrit', issue: 'Arrêt' },
      { cas: 'Sittelle : déclaration rectificative déjà facturée en septembre', sortie: 'Aucune ligne préparée. Motif : acte déjà facturé, facture de septembre en lien', issue: 'Arrêt' },
    ],
  },
};
