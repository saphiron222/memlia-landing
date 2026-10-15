import { ROBOTS_COMPLEMENTS } from './robots/catalogue.ts';
/** Catalogue unique. Les routines sont des offres de service, les cas présentés sont fictifs. */
export const ROBOT_HUB = {
  chemin: '/automatisation-cabinet-comptable',
  titre: 'Robots pour cabinet comptable : tâches prises en charge | Memlia',
  h1: 'Des robots pour les tâches que votre cabinet refait encore à la main.',
  description: 'Robots pour cabinet comptable : avis fiscaux, messageries, attestations et données collectés, classés et suivis dans vos outils. Une tâche prise en charge.',
  introduction: 'Un robot Memlia prend en charge une routine précise : un déclencheur, une règle écrite, un résultat dans vos outils. Nous le construisons et le maintenons. Votre équipe reprend les exceptions et valide les actions qui engagent le cabinet.',
  date: '2026-10-15',
} as const;
export const ROBOT_CATEGORIES = [
  { id: 'fiscal', nom: 'Suivi fiscal' }, { id: 'acces', nom: 'Accès et portefeuille' },
  { id: 'social', nom: 'Social et URSSAF' }, { id: 'juridique', nom: 'Données légales' },
  { id: 'facturation', nom: 'Facturation électronique' }, { id: 'donnees', nom: 'Documents et pilotage' },
] as const;
export type RobotCategory = typeof ROBOT_CATEGORIES[number]['id'];
export type DemoCase = { cas: string; sortie: string; decision: 'Préparé' | 'À valider' | 'Arrêt' };
export interface Robot {
  id: string; slug: string; nom: string; fonction: string; categorie: RobotCategory; resume: string;
  h1: string; introduction: string; besoin: string; declencheur: string; rythme: string; usage: string;
  taches: [string, string][]; livrables: [string, string][]; outils: string[];
  demonstration: { dossier: string; regle: string; cas: DemoCase[] };
  frontiere: { automatique: string[]; validation: string[]; humain: string[]; arrets: string[] };
  comparaison: [string, string][]; faq: [string, string][]; voisins: string[];
  liens: { nom: string; href: string }[]; contact: [string, string, string];
  image: { src: string; alt: string; couleur: string; objet: string };
  seo: { titre: string; description: string; requete: string };
  sources: { nom: string; href: string }[];
  couverture: string[];
}
export const ROBOTS: readonly Robot[] = [
  {
    id: 'cfe', slug: 'cfe', nom: 'Collecte CFE', fonction: 'Avis, montants et paiements à suivre', categorie: 'fiscal',
    resume: 'Vos acomptes et soldes réunis par dossier, avec les montants, les prélèvements et les écarts à reprendre.',
    h1: 'Robot CFE : vos avis classés, votre campagne prête à suivre.',
    introduction: 'En campagne CFE, vos collaborateurs ouvrent les mêmes espaces, téléchargent les avis et vérifient les modes de paiement. Nous prenons cette collecte en charge sur les comptes autorisés. Vous recevez les PDF classés et un récapitulatif pour préparer chaque échange client.',
    besoin: 'Dès la mise à disposition des avis, vous devez savoir quels dossiers ont un acompte ou un solde, et lesquels demandent encore une action.',
    declencheur: 'L’ouverture de votre campagne d’acompte ou de solde, puis l’arrivée des avis manquants.',
    rythme: 'Deux campagnes autour des acomptes de juin et des soldes de décembre, avec des reprises ciblées pendant la campagne.',
    usage: 'Une collecte saisonnière, complétée par un passage ponctuel pour un dossier entré en cours d’année. La date de paiement reste celle de l’avis ; le rythme du robot est convenu avec vous.',
    taches: [
      ['Parcourir les comptes autorisés', 'Nous rattachons les sociétés et leurs établissements aux comptes professionnels du cabinet, puis traitons le lot retenu.'],
      ['Récupérer acomptes et soldes', 'Les avis disponibles sont téléchargés pour la période choisie, nommés et rangés selon votre arborescence.'],
      ['Relever les modalités de paiement', 'Montant, date et indication de prélèvement lisible sont réunis par avis. Une mention absente reste signalée.'],
      ['Comparer la campagne', 'Les variations entre avis comparables sont présentées avec leur base de comparaison et votre seuil d’alerte.'],
      ['Préparer les communications', 'Nous préparons un texte adapté au prélèvement, au télépaiement à prévoir ou au montant nul. Votre collaborateur relit avant l’envoi.'],
      ['Reprendre les manquants', 'Le journal distingue avis absent, accès fermé et fichier déjà classé. La reprise cible les dossiers restants.'],
    ],
    livrables: [['Les avis dans vos dossiers', 'PDF d’acompte et de solde, nommés par société, établissement, période et nature d’avis.'], ['Le récapitulatif de campagne', 'Classeur XLSX ou CSV : montant, modalité de paiement lue, variation et état de collecte, avec un lien vers chaque pièce.'], ['Les cas à reprendre', 'Avis manquants, accès à renouveler et brouillons de communication réunis pour votre revue.']],
    outils: ['impots', 'excel', 'sharepoint'],
    demonstration: { dossier: 'Portefeuille fictif « Les ateliers du canal », campagne de solde CFE.', regle: 'Nous classons un avis seulement si la société, l’établissement et la période correspondent à la liste de campagne. Une variation hors du seuil convenu attend votre revue ; un accès expiré arrête le dossier sans déduire un montant.', cas: [
      { cas: 'Atelier Aulne · avis et prélèvement identifiés', sortie: 'PDF classé ; montant et prélèvement repris dans le récapitulatif.', decision: 'Préparé' },
      { cas: 'Maison Sureau · télépaiement indiqué', sortie: 'Avis classé ; communication sur le règlement préparée pour relecture.', decision: 'À valider' },
      { cas: 'Studio Galet · variation hors du seuil convenu', sortie: 'Deux avis comparables rapprochés ; écart présenté au collaborateur.', decision: 'À valider' },
      { cas: 'Atelier Brume · session expirée', sortie: 'Aucun avis ajouté. Motif : une nouvelle authentification est nécessaire.', decision: 'Arrêt' },
    ] },
    frontiere: { automatique: ['Lire et classer les avis accessibles dans les comptes configurés.', 'Consolider les montants et comparer les périodes prévues.'], validation: ['Les variations signalées et les brouillons destinés aux clients.', 'Tout envoi ou changement de modalité de paiement.'], humain: ['Décider du règlement et apprécier une variation de cotisation.', 'Choisir les destinataires et valider la communication.'], arrets: ['Session expirée ou habilitation manquante.', 'Avis illisible, identité ambiguë ou période différente de la campagne.'] },
    comparaison: [['Ouvrir les comptes et enregistrer chaque avis.', 'Un lot d’avis classés, avec son état de collecte.'], ['Recopier montants et prélèvements dans un tableau.', 'Un récapitulatif relié aux PDF d’origine.'], ['Rechercher les différences avec la dernière campagne.', 'Les variations comparables soumises à votre revue.'], ['Recommencer tout le portefeuille pour quelques absents.', 'Une liste de reprise limitée aux dossiers en attente.']],
    faq: [
      ['Le robot traite-t-il plusieurs comptes professionnels ?', 'Oui. Nous définissons la correspondance entre vos comptes, les sociétés et leurs établissements. Le lot peut couvrir plusieurs comptes autorisés ; les droits manquants ressortent dossier par dossier.'],
      ['À quel moment lancer la collecte CFE ?', 'Nous préparons la campagne avant les acomptes de juin et les soldes de décembre. Les passages suivants récupèrent les avis devenus disponibles. La date portée par chaque avis reste la référence de votre équipe.'],
      ['Un avis absent est-il considéré comme un montant nul ?', 'Non. Le récapitulatif distingue un avis indisponible d’un avis dont le montant est nul. Le premier reste en attente, avec le compte et la période à reprendre.'],
      ['Le robot paie-t-il ou écrit-il aux clients ?', 'Nous préparons les éléments adaptés à la situation de paiement lue. Le règlement, une modification du prélèvement et l’envoi d’un message suivent les validations prévues avec le cabinet.'],
      ['Sur quel poste la campagne tourne-t-elle ?', 'Nous définissons à l’installation l’environnement d’exécution, les plages de collecte, les accès et la destination des fichiers. Si le portail réclame une authentification, le dossier attend l’intervention prévue ; nous ne contournons pas cette étape.'],
      ['Comment démarrer et combien coûte la campagne ?', 'Vous nous montrez une collecte CFE et votre tableau de suivi. Nous écrivons la règle, construisons le robot et faisons vérifier les résultats par votre équipe. Vous payez une tâche prise en charge, pas des sièges ; le devis dépend des comptes, du classement et des exceptions. La maintenance et les changements de portail y sont cadrés.'],
    ],
    voisins: ['habilitations-fiscales', 'taxes-foncieres', 'dette-fiscale'],
    liens: [{ nom: 'Repérer les tâches répétitives du cabinet', href: '/blog/automatiser-un-cabinet-comptable-la-carte-des-taches' }],
    contact: ['Collecter les avis CFE de la prochaine campagne', 'Consolider plusieurs comptes CFE', 'Reprendre les avis CFE manquants'],
    image: { src: '/robots/cfe', alt: 'Robot CFE en argile abricot avec un trieur d’avis et un anneau vert.', couleur: '#cd966c', objet: 'Trieur crème et feuilles à onglets' },
    seo: { titre: 'Robot CFE : collecte des avis pour cabinet comptable | Memlia', description: 'Robot CFE : avis d’acompte et de solde classés, montants et prélèvements consolidés, variations signalées. Votre campagne suivie dans vos outils.', requete: 'robot cfe cabinet comptable' },
    sources: [{ nom: 'DGFiP : consulter les avis de CFE et les payer', href: 'https://www.impots.gouv.fr/professionnel/questions/comment-puis-je-acceder-mon-avis-de-cfe-et-le-payer' }],
    couverture: ['EC02', 'XI01'],
  },
  ...ROBOTS_COMPLEMENTS,
];
export const cheminRobot = (robot: Pick<Robot, 'slug'>) => `/automatisation/${robot.slug}`;
export const robotParId = (id: string) => ROBOTS.find((robot) => robot.id === id);
export const comptesRobots = () => Object.fromEntries(ROBOT_CATEGORIES.map((categorie) => [categorie.id, ROBOTS.filter((robot) => robot.categorie === categorie.id).length]));
export const contactsRobots = () => ROBOTS.flatMap((robot) => robot.contact.map((nom, i) => ({ id: `robot-${robot.id}-${i + 1}`, nom, robot: robot.id })));
