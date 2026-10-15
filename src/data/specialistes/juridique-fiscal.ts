import type { Specialiste } from '../specialistes.ts';

/**
 * Grégoire · Juridique et fiscal (AGENTS-CONTENU.md §3) : carte, démonstration, familles titulaires et logiciels. Sa
 * carte mène à /agents-ia/juridique-fiscal ; le contenu de la fiche (`fiche`) s'écrit à la tâche 9, et `publie`
 * passe alors à `true` (une fiche publiée sans contenu ne se construit pas).
 */
export const JURIDIQUE_FISCAL: Specialiste = {
  slug: 'juridique-fiscal',
  prenom: 'Grégoire',
  libelle: 'Juridique et fiscal',
  groupe: 'production-conseil',
  teinte: 'juridique-fiscal',
  publie: false,
  destination: { type: 'fiche' },
  ligne: 'Prépare déclarations fiscales, formalités et documents de l’approbation des comptes ; les associés approuvent, votre cabinet signe et dépose.',
  frontiereEnBref: [
    'Calculer échéances et acomptes depuis les données tenues',
    'Chaque déclaration avant télétransmission',
    'La télédéclaration, le dépôt des comptes et des formalités',
  ],
  familles: [
    'tva', 'is-acomptes', 'liasse-fiscale', 'declarations-annexes', 'echeances-fiscales', 'teledeclarations-rejets',
    'secretariat-juridique', 'formalites-creation-modification', 'registres-obligations',
  ],
  servicesLies: ['secretariat-juridique', 'registres-obligations'],
  logiciels: [
    'Lexis PolyActe', 'Registre national des entreprises', 'BODACC', 'Répertoire Sirene', 'Youtrust', 'Docusign',
    'Cegid Loop', 'ACD COMPTA', 'Sage 100 Comptabilité', 'EBP Comptabilité', 'Microsoft Excel',
  ],
  avatar: null,
  demonstration: {
    tache: 'calendrier d’approbation et de dépôt',
    dossier: 'Dossier fictif : un portefeuille de quatre sociétés inventées ; calendrier joué le 14/10/2026.',
    regle: 'Pour chaque dossier, la date limite d’approbation se calcule depuis la clôture confirmée et le délai écrit pour sa forme sociale, puis le dépôt suit dans le mois, ou dans les deux mois par voie électronique. Une clôture non confirmée ou une forme sociale sans délai écrit dans la règle arrête le calcul ; une prolongation annoncée sans décision reçue laisse la date légale en place et le signale.',
    cas: [
      { cas: 'SARL Bouvreuil, clôture au 30/06/2026 confirmée par la balance', sortie: 'Approbation au plus tard le 31/12/2026, sauf prolongation accordée par le juge ; dépôt dans le mois qui suit, ou dans les deux mois en ligne ; rappel au gérant préparé', issue: 'Préparé' },
      { cas: 'SA Grand-Duc, même clôture, prolongation évoquée par le président', sortie: 'Date légale conservée, mention « prolongation annoncée, décision à recevoir »', issue: 'À valider' },
      { cas: 'SARL Hulotte, clôture au 30/06/2026 selon les statuts, au 31/12/2026 selon la balance remise', sortie: 'Aucune date calculée. Motif : date de clôture divergente entre deux sources', issue: 'Arrêt' },
      { cas: 'SARL Ortolan, comptes approuvés le 20/06/2026, aucun dépôt constaté', sortie: 'Dépôt manquant signalé, justificatif réclamé dans un brouillon au gérant', issue: 'À valider' },
    ],
  },
};
