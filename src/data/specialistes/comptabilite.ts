import type { Specialiste } from '../specialistes.ts';

/**
 * Balthazar · Comptabilité (AGENTS-CONTENU.md §1) : carte, démonstration, familles titulaires, logiciels et fiche
 * pilote `/agents-ia/comptabilite` (tâche 6). Le contenu de la fiche reprend AGENTS-CONTENU §1 (apostrophes
 * typographiques) ; seules les balises de la page (titre d'onglet, description, type de service, image sociale) sont
 * écrites ici, passées par `marketing-skills:copywriting` puis `copy-editing`.
 *
 * La règle écrite reprend l'ordre d'AGENTS-CONTENU §1 ; la frontière en bref de la carte en est un extrait, chaque
 * cellule dans sa colonne (R25). Un écart assumé avec la lettre d'AGENTS-CONTENU, relu en revue `metier` : le premier
 * livrable ouvre son texte sur « Pour l’Atelier Loriot » (le titre « Le lot de saisie du mois » est séparé de la phrase
 * qui le complétait).
 */
export const COMPTABILITE: Specialiste = {
  slug: 'comptabilite',
  prenom: 'Balthazar',
  libelle: 'Comptabilité',
  groupe: 'production-conseil',
  teinte: 'production-comptable',
  publie: true,
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
  servicesLies: [],
  logiciels: [
    'Pennylane', 'Cegid Loop', 'Cegid Quadra Plus', 'Sage 100 Comptabilité', 'Sage Génération Experts', 'ACD COMPTA',
    'EBP Comptabilité', 'MyU', 'Tiime', 'Inqom', 'fulll', 'AMICOMPTA', 'Dext', 'N2F', 'Qonto', 'Planity',
    'PrestaShop', 'Microsoft Excel',
  ],
  avatar: { src: '/agents/comptabilite-256.webp', alt: 'Figurine Memlia, agent IA comptabilite.' },
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
  fiche: {
    requete: 'ia comptabilité',
    h1: 'IA en comptabilité : de la pièce reçue à la clôture, les tâches préparées pour votre revue.',
    titreOnglet: 'IA en comptabilité : de la pièce reçue à la clôture | Memlia',
    descriptionLead: 'IA en comptabilité',
    description: 'IA en comptabilité : pièces lues, saisie pré-imputée, banque rapprochée, révision préparée. L’agent IA s’arrête dans le doute ; votre collaborateur valide chaque écriture.',
    chapeau: 'Balthazar prépare la tenue comptable dans les outils de votre cabinet : pièces lues, écritures proposées, rapprochements et révision préparés. Nous adaptons cet agent IA à vos dossiers et à vos contrôles. Votre collaborateur valide les écritures et l’expert-comptable garde le jugement de révision.',
    serviceType: 'Préparation de la tenue comptable : saisie, rapprochements, révision et clôture',
    eeat: { auteur: 'kevin', datePublication: '2026-10-15', dateModification: '2026-10-15', sources: [] },
    image: {
      url: 'https://memlia.fr/proofs/v2/og/50-fiche-comptabilite.webp',
      alt: 'Rejoué sur un dossier fictif : quatre pièces de l’Atelier Loriot, une écriture préparée, un choix à valider et deux arrêts motivés.',
    },
    taches: [
      { geste: 'Réclamer les pièces manquantes', prepare: 'Par dossier, la liste des pièces attendues et absentes (mouvement bancaire sans facture, facture sans règlement), avec la relance graduée rédigée dans le ton du cabinet.', famille: 'collecte-pieces' },
      { geste: 'Lire et pré-imputer les pièces', prepare: 'Chaque facture lue, ses champs extraits, le compte, la TVA et le journal proposés d’après les imputations déjà validées du dossier.', famille: 'saisie-ocr' },
      { geste: 'Reprendre les factures électroniques reçues', prepare: 'Les factures arrivées par la plateforme agréée du client et restées hors de votre outil comptable, rapprochées de la comptabilité, l’écart nommé.', famille: 'facture-electronique' },
      { geste: 'Contrôler les factures d’achat', prepare: 'Doublons sans numéro, avoirs non imputés, échéances fournisseurs dépassées : chaque signal présenté avant le règlement ou la clôture.', famille: 'achats-fournisseurs' },
      { geste: 'Rapprocher la banque', prepare: 'Chaque mouvement apparié à son écriture quand un seul candidat existe, les suspens classés par type, l’état de rapprochement assemblé.', famille: 'banque-rapprochement' },
      { geste: 'Lettrer les comptes de tiers', prepare: 'Factures et règlements appariés selon vos règles écrites (montant, référence, tolérance d’écart), les paiements partiels isolés.', famille: 'lettrage' },
      { geste: 'Intégrer ventes, caisse et e-commerce', prepare: 'Tickets Z, exports de boutique en ligne et versements des prestataires de paiement mis au format d’import du dossier, TVA ventilée, commissions séparées.', famille: 'ventes-caisse' },
      { geste: 'Tenir immobilisations et emprunts', prepare: 'La fiche d’immobilisation proposée depuis la facture, les dotations et les échéances d’emprunt calculées, les écritures récurrentes prêtes.', famille: 'immobilisations-emprunts' },
      { geste: 'Réviser par cycle', prepare: 'Comptes d’attente, soldes de sens anormal, TVA non soldée, charges à payer et produits constatés d’avance proposés avec leur pièce.', famille: 'revision-cycles' },
      { geste: 'Préparer la clôture', prepare: 'Balance contrôlée, FEC testé dans sa forme, états et plaquette assemblés pour la revue du chef de mission.', famille: 'cloture-bilan' },
    ],
    aussi: [
      { famille: 'notes-de-frais', texte: 'justificatifs de frais lus et contrôlés, manquants réclamés en les nommant.' },
      { famille: 'ged-dossier-permanent', texte: 'pièces nommées et rangées selon votre plan de classement.' },
    ],
    livrables: [
      { titre: 'Le lot de saisie du mois', texte: 'Pour l’Atelier Loriot : 42 pièces lues, chaque écriture proposée avec son compte, sa TVA et la pièce en lien ; 3 pièces mises de côté, chacune avec son motif.' },
      { titre: 'La relance de pièces prête à envoyer', texte: 'Cinq pièces nommées par date, montant et fournisseur, dans le ton de votre cabinet.' },
      { titre: 'Le rapprochement bancaire du mois', texte: 'Relevé par relevé, chaque suspens typé et daté.' },
    ],
    frontiere: [
      ['Lire les pièces et en extraire les champs', 'Chaque écriture proposée, lot par lot', 'L’imputation d’un cas nouveau ou atypique'],
      ['Proposer l’imputation d’un fournisseur connu', 'Chaque appariement à plusieurs candidats, en banque ou en lettrage', 'L’intégration dans votre logiciel comptable'],
      ['Rapprocher un mouvement de son unique candidat', 'Chaque relance de pièces au client', 'Le jugement de révision'],
      ['Préparer relances, états et contrôle de forme du FEC', 'Chaque régularisation de fin d’exercice', 'La clôture et les comptes remis au client'],
    ],
    arrets: [
      'Pièce illisible, incomplète ou déjà saisie.',
      'Date hors de l’exercice, ou dossier non identifié.',
      'Écart sans règle écrite : plusieurs candidats, montant divergent, compte absent du plan du dossier.',
    ],
    neJamaisSansVous: [
      { envoi: 'La relance de pièces au client', validation: 'votre collaborateur la relit et l’envoie.' },
      { envoi: 'Le lot d’écritures', validation: 'votre collaborateur le valide, puis l’importe dans votre logiciel.' },
      { envoi: 'La plaquette et les comptes annuels', validation: 'l’expert-comptable les revoit et les remet.' },
    ],
    avecSans: [
      { sans: 'Ressaisir chaque facture à la main', avec: 'Un lot d’écritures proposé, que votre collaborateur valide' },
      { sans: 'Chercher la pièce manquante au moment de la clôture', avec: 'Une relance prête chaque mois, que votre collaborateur envoie' },
      { sans: 'Pointer la banque ligne à ligne', avec: 'Seuls les mouvements sans candidat unique présentés, que votre collaborateur tranche' },
      { sans: 'Découvrir un compte d’attente plein en révision', avec: 'Les soldes à justifier listés au fil de l’eau, que le chef de mission revoit' },
    ],
    faq: {
      balisage: false,
      questions: [
        { question: 'Faut-il changer votre logiciel comptable ?', reponse: 'Ce que votre logiciel fait déjà, nous ne le refaisons pas : nous prenons ce qu’il laisse. En comptabilité, ce sont les pièces qu’il ne lit pas, les mouvements qu’il ne rapproche pas et les gestes entre deux outils.' },
        { question: 'Les écritures entrent-elles dans le logiciel sans contrôle ?', reponse: 'Chaque écriture proposée attend la validation de votre collaborateur, lot par lot. L’import dans votre logiciel reste son geste.' },
        { question: 'Que devient une pièce illisible ?', reponse: 'Elle sort du lot avec son motif et la relance qui la réclame. Aucune écriture n’est proposée par ressemblance avec une autre pièce.' },
        { question: 'Balthazar prépare-t-il aussi la révision et la clôture ?', reponse: 'Oui : comptes d’attente, régularisations de fin d’exercice, contrôle de la balance et forme du FEC. Le jugement de révision et la clôture restent au chef de mission et à l’expert-comptable.' },
        { question: 'Qui voit les pièces de vos clients ?', reponse: 'Nous définissons les accès, les données lues et les destinataires avec votre cabinet avant la mise en service. Les conditions de traitement sont écrites pour la mission. Les essais de construction utilisent des dossiers fictifs.' },
        { question: 'Combien coûte une tâche prise en charge ?', reponse: 'Vous payez une tâche prise en charge, pas des sièges. Le devis dépend des sources, des règles et des exceptions ; la maintenance y est écrite.' },
      ],
    },
    tachesDepart: ['collecte-pieces', 'saisie-ocr', 'banque-rapprochement'],
    voisins: [
      { agent: 'commercial', role: 'avant', objet: 'l’entrée en relation' },
      { agent: 'juridique-fiscal', role: 'apres' },
      { agent: 'finance', role: 'apres' },
    ],
  },
};
