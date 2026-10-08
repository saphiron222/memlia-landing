import { PAGES_V2 } from '../pages-v2.mjs';
import { FAQ } from '../faq';
import { GARANTIES } from '../garanties';
import { METHODE } from '../methode';
import { famillesDeLaProfession } from '../familles';
import type { ContenuAccueil } from './types';

const familles = famillesDeLaProfession('ec');
const nombrePoles = new Set(familles.map(({ pole }) => pole)).size;

/** Copie de l’accueil EC ; les sources partagées restent les mêmes. */
export const CONTENU_EC: ContenuAccueil = {
  hero: {
    etiquette: "Automatisation IA pour cabinets d’expertise comptable",
    titre: "Votre cabinet tourne sur un savoir-faire que personne n’a écrit.",
    texte: "Confiez-nous une tâche répétitive. Nous en écrivons la règle avec vos collaborateurs, puis nous l’automatisons dans leurs outils. Ils gardent la décision. Votre cabinet garde le savoir.",
    poster: "/media/r9/hero-poster-1200.webp",
    video: "/media/r9/explainer-hero-45s.mp4",
    sousTitres: "/media/r9/explainer.vtt",
  },
  orientation: {
    titre: "Par où commencer",
    invitation: "Voir une règle appliquée à une tâche",
    destinations: [
  { texte: 'Toute tâche répétitive de votre cabinet, écrite dans vos mots puis automatisée dans vos outils, de l’observation à la maintenance.', libelle: 'Découvrir le service', href: PAGES_V2.service.chemin },
  { texte: 'Nous observons le geste, écrivons la règle et la testons sur des cas fictifs. Vos équipes vérifient le résultat avant la livraison : c’est la recette.', libelle: 'Comment nous travaillons', href: PAGES_V2.methode.chemin },
  { texte: 'Dans le doute, l’automatisation s’arrête et vous présente le cas. Nos engagements, écrits avant de commencer.', libelle: 'Nos garanties', href: PAGES_V2.garanties.chemin },
  { texte: 'Le vocabulaire du cabinet, terme par terme, avec pour chacun la limite entre ce qui se prépare seul et ce qui se décide.', libelle: 'Consulter le glossaire', href: '/glossaire' },
],
    services: [
  { libelle: 'Paie', href: '/automatisation/paie' },
  { libelle: 'Saisie comptable', href: '/automatisation/saisie-comptable' },
  { libelle: 'Rapprochement bancaire', href: '/automatisation/rapprochement-bancaire' },
  { libelle: 'Notes de frais', href: '/automatisation/notes-de-frais' },
  { libelle: 'Factures fournisseurs', href: '/automatisation/factures-fournisseurs' },
],
  },
  quotidien: {
    titre: "Le savoir-faire est là. Il n’est écrit nulle part.",
    texte: "Quelle pièce réclamer, quel écart vérifier avant le bulletin, quel retour DSN mérite un appel : vos collaborateurs connaissent la règle et la rejouent à la main, chaque mois, entre deux dossiers qui demandent du jugement. Le jour où l’un d’eux part, la règle part avec lui.",
    points: [{"titre": "Répéter", "texte": "Les mêmes contrôles et manipulations à chaque cycle, par les personnes les plus difficiles à recruter."}, {"titre": "Reconstituer", "texte": "L’information dispersée entre logiciels, fichiers et messages, réassemblée de mémoire."}, {"titre": "Sécuriser", "texte": "Les cas particuliers à repérer parmi les traitements courants, sans liste écrite."}],
    note: "Écrire la règle, c’est notre métier. Une règle écrite appartient au cabinet. Nous en automatisons la part répétitive lorsque les formats, les accès et les cas couverts le permettent.",
    image: "02-repetition",
  },
  promesse: {
    titre: "Nous prenons la tâche entière. Vous gardez le jugement.",
    texte: "De l’observation à la maintenance, nous prenons en charge la tâche confiée. Nous écrivons sa règle avec vous et construisons l’automatisation dans vos outils. Vos équipes la testent avant la livraison.",
    image: "01-flux",
    points: [
  {
    titre: 'La mécanique est prise en charge.',
    texte: 'Collecter, comparer, préparer : les gestes répétitifs suivent la règle et le périmètre convenus. Votre équipe valide les propositions et tranche les exceptions.',
  },
  {
    titre: 'Les exceptions remontent, elles ne disparaissent pas.',
    texte: 'Une pièce illisible ou un cas hors règle arrête le traitement concerné. Votre équipe voit ce qui bloque et décide de la suite.',
  },
  {
    titre: 'La décision reste à vos équipes.',
    texte: 'L’IA prépare. Le professionnel valide, modifie ou refuse.',
  },
],
  },
  usages: {
    titre: "Toute tâche répétitive a une règle. Nous l’écrivons.",
    texte: `De la collecte des pièces aux retours DSN, de la saisie au reporting : ${familles.length} familles de tâches, ${nombrePoles} pôles pour l’expertise comptable, et pour chacune la frontière entre ce qui se prépare seul et ce qui se décide. Commencez par celle qui revient le plus.`,
    exemples: [
  { id: 'collect', title: 'Collecter et préparer', text: 'Rassembler les pièces et les informations attendues depuis les sources convenues, et signaler ce qui manque avant le traitement.' },
  { id: 'check', title: 'Contrôler et signaler', text: 'Appliquer les règles du cabinet, isoler les écarts et présenter les cas à revoir, avec la raison du signalement.' },
  { id: 'compare', title: 'Rapprocher et synthétiser', text: 'Comparer deux sources qui devraient concorder et préparer une synthèse où chaque information reste traçable.' },
  { id: 'follow', title: 'Suivre un processus', text: 'Repérer ce qui bloque et préparer les relances utiles. Leur envoi reste soumis à validation humaine.' },
  { id: 'decide', title: 'Préparer une décision', text: 'Réunir données, hypothèses et pièces pour que le professionnel valide, modifie ou refuse en connaissance de cause.' },
],
  },
  integration: {
    titre: "Vos outils restent le point de départ.",
    texte: "Nous partons de votre logiciel métier, de vos fichiers et de vos échanges. Nous prenons en charge les gestes répétitifs qui restent entre ces outils, en conservant ce qui fonctionne déjà.",
    limites: "Avant le devis, nous vérifions ce que votre logiciel fait déjà, les formats disponibles et les accès nécessaires. Le périmètre précise les gestes pris en charge.",
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
    titre: "Nos engagements, écrits avant de développer.",
    invitation: "Lire les réponses",
    image: "09-garanties",
    liens: GARANTIES,
  },
  faq: {
    titre: "Les questions qu’on nous pose avant de commencer.",
    texte: "Faisabilité, données, contrôle humain, prix : les réponses qui délimitent le travail avant de nous le confier.",
    questions: FAQ,
  },
  appelFinal: {
    titre: 'Quelle tâche vos collaborateurs refont-ils encore à la main ?',
    texte: 'Décrivez la tâche en trois phrases. Nous précisons avec vous sa règle, les outils concernés et ce que votre équipe garde à décider. Vous recevez un périmètre et un devis avant tout engagement. La description suffit pour commencer.',
    points: [
    'La règle écrite : les gestes confiés et les décisions qui restent au cabinet.',
    'La prise en charge : construction, essais par vos équipes et maintenance.',
    'Le devis : une tâche prise en charge, à la complexité plutôt qu’au nombre de postes.',
  ],
  },
  methode: { ...METHODE, libelleEtape: 'Étape' },
};
