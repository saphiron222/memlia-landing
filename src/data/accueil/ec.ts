import { PAGES_V2 } from '../pages-v2.mjs';
import { FAQ } from '../faq';
import { GARANTIES } from '../garanties';
import { ROBOTS } from '../robots';
import { famillesDeLaProfession } from '../familles';
import type { ContenuAccueil } from './types';

const familles = famillesDeLaProfession('ec');
const nombrePoles = new Set(familles.map(({ pole }) => pole)).size;

/** Copie de l’accueil EC ; les sources partagées restent les mêmes. */
export const CONTENU_EC: ContenuAccueil = {
  hero: {
    etiquette: "Automatisation IA pour cabinets d’expertise comptable",
    titre: "Robots et agents IA pour votre cabinet comptable.",
    texte: "Avis fiscaux collectés, pièces classées, dossiers préparés : confiez les tâches répétitives à Memlia. Nous déployons nos robots et agents IA dans vos outils, avec vos règles et vos validations. Nous relions aussi le savoir du cabinet et formons une IA à vos façons de travailler.",
    poster: "/media/r9/hero-poster-1200.webp",
    video: "/media/r9/explainer-hero-45s.mp4",
    videoMobile: "/media/r9/explainer-hero-45s-mobile.mp4",
    sousTitres: "/media/r9/explainer.vtt",
  },
  orientation: {
    titre: "Choisissez ce qui fera avancer votre cabinet.",
    invitation: "D’autres tâches à prendre en charge",
    destinations: [
  { texte: `${ROBOTS.length} robots pour vos collectes, vos campagnes fiscales, vos accès et vos documents. Chaque fiche montre le résultat remis.`, libelle: 'Explorer les robots', href: PAGES_V2.service.chemin },
  { texte: 'Du catalogue à la mémoire collective ou au modèle privé : un périmètre écrit, des résultats vérifiés avec vous et une maintenance convenue.', libelle: 'Du choix à la mise en service', href: PAGES_V2.methode.chemin },
  { texte: 'Des accès définis, des exceptions visibles et des validations prévues avant les actions qui engagent le cabinet.', libelle: 'Vos garanties de déploiement', href: PAGES_V2.garanties.chemin },
  { texte: 'Le vocabulaire du cabinet, terme par terme, avec pour chacun la limite entre ce qui se prépare seul et ce qui se décide.', libelle: 'Consulter le glossaire', href: '/glossaire' },
],
    services: [
  { libelle: 'Paie', href: '/agents-ia/paie-social' },
  { libelle: 'Saisie comptable', href: '/agents-ia/comptabilite#tache-saisie-ocr-2' },
  { libelle: 'Rapprochement bancaire', href: '/agents-ia/comptabilite#tache-banque-rapprochement-5' },
  { libelle: 'Notes de frais', href: '/agents-ia/comptabilite#taches-titre' },
  { libelle: 'Factures fournisseurs', href: '/agents-ia/comptabilite#tache-achats-fournisseurs-4' },
],
  },
  quotidien: {
    titre: "Des documents réunis. Des dossiers prêts à reprendre.",
    texte: "Ouvrir les espaces fiscaux, télécharger les avis et retrouver les messages prend du temps sur chaque dossier. Nos robots réalisent les collectes convenues et remettent les documents classés, un récapitulatif et les exceptions à traiter. Nos agents IA organisent la préparation au niveau d’un métier.",
    points: [{"titre": "Collecter", "texte": "Des avis, messages et pièces rassemblés depuis les comptes autorisés, puis classés par dossier."}, {"titre": "Préparer", "texte": "Des informations rapprochées et des tableaux de travail où les écarts restent identifiables."}, {"titre": "Reprendre les exceptions", "texte": "Un document absent, une session expirée ou une donnée ambiguë est signalé avec sa raison."}],
    note: "Nous adaptons chaque robot ou agent aux formats, aux accès et aux cas couverts par votre cabinet. La règle écrite précise le résultat attendu et les validations à conserver.",
    image: "02-repetition",
  },
  promesse: {
    titre: "Nous assurons le déploiement et la suite.",
    texte: "Vous choisissez une première prise en charge. Nous réglons son périmètre, la connectons aux outils convenus et faisons vérifier le résultat par votre équipe. La maintenance accompagne ensuite la prise en charge, selon le devis.",
    image: "01-flux",
    points: [
  {
    titre: 'Un catalogue comme point de départ.',
    texte: 'Nous reprenons un robot ou un agent IA Memlia pour le travail que vous souhaitez confier. Votre équipe voit son périmètre et ses livrables avant le déploiement.',
  },
  {
    titre: 'Une adaptation à votre cabinet.',
    texte: 'Dossiers, comptes, classement, fréquence et validations suivent votre organisation. Le robot prépare ce qui est autorisé ; votre équipe reprend les cas signalés.',
  },
  {
    titre: 'Le sur mesure quand il le faut.',
    texte: 'Une source particulière ou un processus absent du catalogue ? Nous construisons le complément nécessaire ou une nouvelle prise en charge.',
  },
],
  },
  usages: {
    titre: "Des tâches que votre équipe reconnaît tout de suite.",
    texte: `Commencez par une collecte ou un dossier à préparer. Notre offre couvre ${familles.length} familles de tâches dans ${nombrePoles} pôles : nous partons du catalogue, puis adaptons ou construisons ce qui répond à votre besoin.`,
    exemples: [
  { id: 'collect', title: 'Collectes fiscales et sociales', text: 'Avis de CFE et de taxes foncières, attestations, messages fiscaux et URSSAF : des documents nommés, classés et accompagnés d’un récapitulatif.' },
  { id: 'check', title: 'Suivi du portefeuille', text: 'Dettes fiscales, déclarations attendues et accès manquants : une vue par dossier pour retrouver ce qui demande une intervention.' },
  { id: 'compare', title: 'Préparation comptable', text: 'Pièces, écritures proposées et rapprochements : l’agent prépare le travail convenu et présente les écarts à votre collaborateur.' },
  { id: 'follow', title: 'Dossiers sociaux et juridiques', text: 'Informations reçues, pièces manquantes et échéances : une préparation structurée pour vos équipes. Les courriers, formalités et déclarations suivent les validations prévues.' },
  { id: 'decide', title: 'Reporting et conseil', text: 'Des tableaux préparés à partir des données convenues, avec les hypothèses et les points à relire. Votre équipe interprète les résultats et conseille le client.' },
],
  },
  integration: {
    titre: "Déployés dans les outils que vous utilisez.",
    texte: "Votre logiciel comptable, votre messagerie et votre classement restent au centre du travail. Les intégrations relient les services retenus à vos outils, avec les comptes, les droits et les formats convenus.",
    limites: "Nous vérifions les fonctions déjà couvertes par vos logiciels et les accès nécessaires avant le devis. Votre logiciel n’est pas listé ? Nous l’intégrons sur demande.",
    regles: [{"titre": "Conserver ce qui fonctionne.", "texte": "Ne pas remplacer un outil uniquement pour introduire l’automatisation."}, {"titre": "Relier le nécessaire.", "texte": "Définir les sources, droits et traitements avant de développer."}, {"titre": "Prévoir l’évolution.", "texte": "Analyser les changements de règle ou d’outil avant toute adaptation."}],
    image: "08-integration",
  },
  preuves: {
    etiquette: "proposition vs saisie",
    titre: "Automatiser la mécanique. Pas le jugement.",
    texte: "Pour chaque tâche, la règle distingue ce qui se prépare seul, ce qui attend votre validation et ce qui reste humain. Une information ambiguë bloque l’écriture concernée et vous présente le cas à examiner.",
    propriete: "Memlia propose. Le cabinet saisit ou valide. Ce que Memlia génère se régénère ;\n      ce que le cabinet saisit ne se touche jamais. Aucun envoi externe sans validation humaine.",
    image: "03-controle",
    reperes: [
  { title: 'Preuve de méthode', text: 'Sur un dossier fictif, nous rejouons les cas prévus et ceux qui doivent être refusés. Vos équipes vérifient les résultats avant la livraison.' },
  { title: 'Preuve de contrôle', text: 'Vous voyez la proposition et la raison des écarts. Votre équipe valide, corrige ou refuse ; ses saisies restent intactes.' },
  { title: 'Preuve de confidentialité', text: 'Jeux fictifs pour construire, démontrer et tester.' },
],
  },
  garanties: {
    titre: "Un déploiement avec des engagements précis.",
    invitation: "Lire les réponses",
    image: "09-garanties",
    liens: GARANTIES,
  },
  faq: {
    titre: "Avant de choisir votre première prise en charge.",
    texte: "Choix du catalogue, adaptation, logiciels, prix et maintenance : voici comment commencer.",
    questions: FAQ,
  },
  appelFinal: {
    titre: 'Partons de ce que votre équipe veut accomplir.',
    texte: 'Une routine à confier, une mémoire à partager ou un modèle à former : décrivez le résultat attendu et les outils concernés. Nous précisons le service, les adaptations utiles et un devis. Le catalogue reste le premier point de départ pour les robots et agents ; le sur mesure complète ce qui manque.',
    points: [
    'Le service adapté à votre premier besoin.',
    'Un résultat et des validations définis avec vous.',
    'Un devis pour le déploiement et la maintenance.',
  ],
  },
  methode: { titre: 'Du premier besoin à la mise en service.', libelleEtape: 'Étape', etapes: [
    {numero:1,titre:'Choisir la tâche.',texte:'Nous partons du catalogue pour les robots et agents. Pour la mémoire collective ou le modèle privé, nous retenons un premier usage, ses sources et le résultat attendu.',image:'04-observer'},
    {numero:2,titre:'Adapter à vos outils.',texte:'Nous définissons les accès, les formats, le classement et les validations. Si une fonction manque au catalogue, nous construisons l’adaptation nécessaire.',image:'05-cadrer'},
    {numero:3,titre:'Vérifier avec votre équipe.',texte:'Les essais fictifs couvrent les cas courants et les arrêts utiles. Votre équipe vérifie ensuite le résultat dans l’environnement autorisé et accepte la mise en service.',image:'06-eprouver'},
    {numero:4,titre:'Déployer et maintenir.',texte:'Nous mettons en service le périmètre accepté. Le devis précise le support, la maintenance et les évolutions couvertes lorsque vos outils ou vos règles changent.',image:'07-livrer'},
  ] },
};
