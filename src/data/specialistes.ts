/**
 * Les douze agents IA du hub `/agents-ia` : la source unique que lisent le hub, les neuf fiches, la page des outils,
 * le bandeau « Qui prend ce métier » et le contact (plan du 15/10/2026, tâche 2 ; arbitrages de la porte 2).
 *
 * Un agent IA, chez Memlia, est la règle écrite des tâches d'un même métier du cabinet, mise en œuvre dans ses outils
 * (charte v7 §9 bis). Le contenu vient de `docs/strategy/site-v3/hub-agents-ia/AGENTS-CONTENU.md` §1 à §12, qui fait
 * foi ; ses notes internes (§13 à §15) ne sont jamais des données. Apostrophes typographiques, comme toute la copie.
 *
 * Feuille : seuls des `import type` sortent vers `familles.ts` et `page-eeat.ts` (les tests importent ce fichier par
 * le décapage de types de Node, où un import d'exécution sans extension échoue). Les recoupements avec la carte des
 * familles et les pages service vivent dans `specialistes-controle.ts`.
 */
import type { PoleId } from './familles.ts';
import type { PageEeat } from './page-eeat.ts';
import { COMPTABILITE } from './specialistes/comptabilite.ts';
import { JURIDIQUE_FISCAL } from './specialistes/juridique-fiscal.ts';
import { FINANCE } from './specialistes/finance.ts';
import { COMMERCIAL } from './specialistes/commercial.ts';
import { COMMUNICATION } from './specialistes/communication.ts';
import { RELATION_CLIENT } from './specialistes/relation-client.ts';
import { GESTION_CABINET } from './specialistes/gestion-cabinet.ts';
import { RH_CABINET } from './specialistes/rh-cabinet.ts';
import { PROTECTION_DONNEES } from './specialistes/protection-donnees.ts';
import { INFORMATIQUE_OUTILS, MISSIONS_AUDIT, PAIE_SOCIAL } from './specialistes/autres.ts';

/** Issue d'un cas joué : la colonne « Décision » de la démonstration (même fermeture que `IntegrationReplayCase`). */
export const ISSUES = ['Préparé', 'À valider', 'Arrêt'] as const;
export type Issue = (typeof ISSUES)[number];

export type AgentId =
  | 'comptabilite' | 'paie-social' | 'juridique-fiscal' | 'finance' | 'missions-audit' | 'commercial'
  | 'communication' | 'relation-client' | 'gestion-cabinet' | 'rh-cabinet' | 'informatique-outils' | 'protection-donnees';

/** Les filtres de l'annuaire. « Tous » est l'absence de filtre, jamais une donnée. */
export const GROUPES = [
  { id: 'production-conseil', libelle: 'Production et conseil' },
  { id: 'relation-client', libelle: 'Relation client' },
  { id: 'vie-cabinet', libelle: 'Vie du cabinet' },
] as const;
export type GroupeId = (typeof GROUPES)[number]['id'];

/** Les trois pages existantes où mènent les cartes sans fiche (spec §0) : la paie, l'accueil CAC, la page des outils. */
export type CheminPage = '/automatisation/paie' | '/commissaires-aux-comptes' | '/integrations';
export type Destination = { type: 'fiche' } | { type: 'page'; chemin: CheminPage };

/** Un cas joué : ce qui entre, ce qui sort, et la décision de la règle (Arrêt : la sortie dit « Motif : »). */
export interface Cas {
  cas: string;
  sortie: string;
  issue: Issue;
}

/**
 * La démonstration d'un agent, rejouée sur un dossier fictif (spec §2.1, arbitrage 4 de la porte 2) : la règle écrite
 * de sa tâche phare en deux phrases, puis quatre cas dont au moins un Arrêt motivé. Vit sur l'agent, pas sur la fiche :
 * Octavie la montre sur /integrations, Salomé et Aude la portent dans les données seulement.
 */
export interface Demonstration {
  /** La tâche phare dont la règle est rejouée (« lecture et pré-imputation des pièces »). */
  tache: string;
  /** La phrase du dossier, inventé et dit comme tel (« Dossier fictif : … »). */
  dossier: string;
  regle: string;
  cas: readonly [Cas, Cas, Cas, Cas];
}

/** Une ligne de « Tâches prises en charge » : le geste, ce qui est préparé, la famille titulaire qui le porte. */
export interface Tache {
  geste: string;
  prepare: string;
  famille: string;
}

/** Une famille titulaire sans ligne propre (« Aussi dans son périmètre ») et ce qu'elle recouvre chez l'agent. */
export interface FamilleAussi {
  famille: string;
  texte: string;
}

/** Une carte de « Ce que <prénom> vous remet ». */
export interface Livrable {
  titre: string;
  texte: string;
}

/** Une ligne de la règle écrite du métier, dans l'ordre des trois colonnes. */
export type LigneFrontiere = readonly [sePrepareSeul: string, attendVotreValidation: string, resteHumain: string];

/** Un envoi de « Ce qui ne part jamais sans vous », et le geste humain qui le fait partir. */
export interface EnvoiValide {
  envoi: string;
  validation: string;
}

/** Une ligne de « Avec ou sans <prénom> » : la colonne « avec » dit qui valide ; aucun chiffre de gain. */
export interface AvecSans {
  sans: string;
  avec: string;
}

export interface Question {
  question: string;
  reponse: string;
}

/** Un agent voisin : il intervient avant, après, ou à côté (`objet` dit sur quoi : « l'entrée en relation »). */
export interface Voisin {
  agent: AgentId;
  role: 'avant' | 'apres' | 'a-cote';
  objet?: string;
}

/**
 * Le contenu d'une fiche `/agents-ia/<slug>` : ses champs suivent les sections d'AGENTS-CONTENU (arbitrage 5 de la
 * porte 2), plus les balises de la page. Écrit à la tâche 6 (Comptabilité) et à la tâche 9 (les huit autres) ; une
 * fiche publiée sans lui ne se construit pas (`ficheDe`, et `specialistes-controle.ts`).
 */
export interface Fiche {
  /** Requête primaire mesurée (spec §6, MOTS-CLES.md) : le H1, le titre d'onglet et la description la portent. */
  requete: string;
  /** Ce que l'agent prend en charge, intention d'abord ; = `og:title` = `headline`. */
  h1: string;
  titreOnglet: string;
  description: string;
  /** Début obligatoire de `description` (contrat d'intention, `config/page-intent-contract.json`). */
  descriptionLead: string;
  /** Le paragraphe du héros : définit l'agent IA à sa première apparition, finit sur la décision du cabinet. */
  chapeau: string;
  /** `Service.serviceType` du JSON-LD. */
  serviceType: string;
  eeat: PageEeat;
  /**
   * Image sociale : le recadrage 1200 × 630 de la démonstration, rendu par le pipeline des preuves
   * (`scripts/render-agents-proofs.mjs`, cadre `data-og-only`). Contrat : `url` est **absolue**, sur `https://memlia.fr/`
   * (`Service.image` du JSON-LD, `og:image`) ; `specialistes-controle.ts` refuse une URL relative, d'un autre hôte ou
   * un `alt` vide, et `render-agents-proofs.mjs` refuse une URL qui n'est pas celle du cadre rendu pour la fiche.
   */
  image: { url: string; alt: string };
  taches: readonly Tache[];
  aussi: readonly FamilleAussi[];
  /** Deux exemples fictifs « En attente de votre validation », puis un troisième « Dès que vos accès sont branchés ». */
  livrables: readonly [Livrable, Livrable, Livrable];
  frontiere: readonly LigneFrontiere[];
  /** Conditions d'arrêt. */
  arrets: readonly string[];
  neJamaisSansVous: readonly EnvoiValide[];
  avecSans: readonly [AvecSans, AvecSans, AvecSans, AvecSans];
  /** Cinq ou six questions en accordéon. `balisage` : `FAQPage` émise ; reste `false` (arbitrage 6 de la porte 2). */
  faq: { balisage: boolean; questions: readonly Question[] };
  /** Trois familles titulaires, présélectionnables sur /contact. */
  tachesDepart: readonly [string, string, string];
  voisins: readonly Voisin[];
  /** Page service publiée où la règle de la démonstration est écrite, liée en pied du rejeu ; absente sinon. */
  pageDeLaRegle?: `/automatisation/${string}`;
}

export interface Specialiste {
  slug: AgentId;
  prenom: string;
  /** Le métier, en casse de phrase : « Comptabilité », « Missions d’audit ». */
  libelle: string;
  groupe: GroupeId;
  /** Le pôle dont l'accent teinte la carte. */
  teinte: PoleId;
  /**
   * La page de destination est construite (R19). Vrai pour les trois cartes vers une page existante ; pour une fiche,
   * passe à `true` quand sa page est construite (tâche 6 pour Comptabilité, tâche 9 pour les huit autres).
   */
  publie: boolean;
  destination: Destination;
  /** La mission d'une phrase, sur la carte (« Mission (carte) »). */
  ligne: string;
  /**
   * La règle écrite du métier en une cellule par colonne, pour le tableau des métiers du hub. Chaque cellule figure dans
   * sa colonne de `fiche.frontiere` quand la fiche est écrite, sur n'importe quelle ligne (R25).
   */
  frontiereEnBref: LigneFrontiere;
  /** Familles titulaires (familles.ts ou FAMILLES_HUB) : chacune a un seul titulaire (partition, I1). */
  familles: readonly string[];
  /** Slugs des pages service publiées dont la famille est titulaire chez l'agent (ou est son pôle). */
  servicesLies: readonly string[];
  /** Noms exacts des cartes de CONNECTEURS.md (texte en gras), résolus par égalité stricte à la tâche 8. */
  logiciels: readonly string[];
  /** `/agents/<slug>-256.webp` et son `alt` ; `null` tant que la tâche 12 n'a pas livré : un monogramme le remplace. */
  avatar: { src: string; alt: string } | null;
  demonstration: Demonstration;
  /** Présente ssi la destination est une fiche, obligatoire dès que l'agent est publié. */
  fiche?: Fiche;
}

/** La famille que garde le hub lui-même : l'IA générative en général (ADR 0001). Aucun agent ne la porte. */
export const FAMILLES_DU_HUB: readonly string[] = ['ia-generative-agents'];
/** Les familles du bloc « Derrière chaque agent, nous » : le pôle « Méthode et décision humaine ». Aucun agent ne les porte. */
export const FAMILLES_DE_NOUS: readonly string[] = ['choisir-cadrer', 'regle-jeu-essai-recette', 'validation-humaine-refus', 'mesure-roi'];

/** Les familles titulaires que les données portent sans jamais les afficher, avec leur raison. */
export const FAMILLES_TENUES_HORS_PAGE: Readonly<Record<string, string>> = {
  'complements-excel': 'Octavie : son libellé « Compléments greffés sur Excel » ne sort sur aucune page (charte §9).',
  'audit-legal': 'Aude : identifiant historique de la carte EC, détaillé par les familles CAC (AGENTS-CONTENU §5).',
};

/** Un terme et son explication : une ligne du système de page (`.lignes`). */
export interface LigneHub {
  terme: string;
  texte: string;
}

/** Un lien d'action du hub (système de page § 6) : libellé et destination interne. */
export interface ActionHub {
  libelle: string;
  href: '/methode' | '/contact';
}

/**
 * Le hub `/agents-ia` : balises, héros et copie de chaque section (spec §1 et §6, annexe E12), passée par
 * `marketing-skills:copywriting` puis `copy-editing` à la tâche 4. Aucun effectif n'y est écrit : le compteur et le
 * compte des filtres se dérivent d'`AGENTS` et de `comptesParGroupe()` (`data-driven-counts.test.mjs`).
 */
export interface Hub {
  chemin: '/agents-ia';
  ariane: string;
  /** Requête primaire mesurée le 15/10/2026 (spec §6) ; le H1, le titre d'onglet et la description la portent. */
  requete: string;
  /** Titre d'onglet : même requête que le H1, plus court. */
  titreOnglet: string;
  description: string;
  /** Début obligatoire de `description` (contrat d'intention, `config/page-intent-contract.json`). */
  descriptionLead: string;
  surtitre: string;
  /** Le H1 de la charte (v7 §7) et de la spec §1 ; = `og:title` = `headline`. */
  h1: string;
  /** Le chapeau du héros : la définition de l'agent IA à sa première apparition (spec §1, charte §9 bis). */
  definition: string;
  /** L'ancre secondaire du héros, vers `#annuaire`. */
  ancreAnnuaire: string;
  /** Les trois agents du média du héros, en médaillons (cadre `49-hero-agents-ia`, `scripts/render-agents-proofs.mjs`). */
  trio: readonly [AgentId, AgentId, AgentId];
  /** `ItemList.name` du JSON-LD. */
  nomListe: string;
  /** Dates explicites, AAAA-MM-JJ : jamais le `lastmod` du sitemap ni la date du build. */
  datePublication: string;
  dateMiseAJour: string;
  /** « Derrière chaque agent, nous » : le lockup à la place d'une figurine, les cinq gestes de la charte, dans l'ordre. */
  derriere: { titre: string; texte: string; gestes: readonly [LigneHub, LigneHub, LigneHub, LigneHub, LigneHub]; action: ActionHub & { href: '/methode' } };
  annuaire: { titre: string; texte: string; legende: string; tous: string; microLabel: string; action: string };
  /** La définition détaillée, sous l'annuaire (annexe E12) : ce que fait un agent IA, ce qu'il coûte. */
  definitionDetaillee: { titre: string; lignes: readonly LigneHub[] };
  /** Le tableau des métiers : une ligne par agent, ses trois cellules depuis `frontiereEnBref` (un extrait de sa règle, R25). */
  metiers: { titre: string; texte: string; legende: string; colonnes: readonly [string, string, string, string] };
  construit: { titre: string; texte: string; etapes: readonly [LigneHub, LigneHub, LigneHub] };
  sansAgent: { question: string; texte: string; action: ActionHub & { href: '/contact' } };
  appel: { titre: string; texte: string };
}

export const HUB: Hub = {
  chemin: '/agents-ia',
  ariane: 'Agents IA',
  requete: 'agent ia comptable',
  titreOnglet: 'Agent IA comptable, métier par métier | Memlia',
  description: 'Agent IA comptable, métier par métier : saisie, paie, juridique, RGPD. Chaque agent prépare et s’arrête dans le doute ; votre collaborateur valide ce qui part.',
  descriptionLead: 'Agent IA comptable, métier par métier',
  surtitre: 'Agents IA par métier',
  h1: 'Agents IA pour cabinet d’expertise comptable : chacun prépare un métier, vos collaborateurs valident.',
  definition: 'Un agent IA, chez nous, c’est la règle écrite d’un métier de votre cabinet, mise en œuvre dans vos outils. Il prépare, il s’arrête dès qu’un cas sort de la règle, et votre collaborateur valide ce qui part.',
  ancreAnnuaire: 'Trouver votre premier agent',
  trio: ['comptabilite', 'paie-social', 'juridique-fiscal'],
  nomListe: 'Les agents IA de Memlia, métier par métier',
  datePublication: '2026-10-15',
  dateMiseAJour: '2026-10-15',
  derriere: {
    titre: 'Derrière chaque agent, nous.',
    texte: 'Le prénom sert à reconnaître l’agent ; la règle qu’il applique, nous l’écrivons avec vous et nous la maintenons.',
    gestes: [
      { terme: 'Observer', texte: 'La tâche telle qu’elle se fait chez vous, pièce par pièce.' },
      { terme: 'Écrire', texte: 'Sa règle dans vos mots, en trois colonnes.' },
      { terme: 'Éprouver', texte: 'Sur un dossier fictif, cas courants et arrêts compris.' },
      { terme: 'Faire recetter', texte: 'Par vos collaborateurs, sur leurs cas, avant la mise en service.' },
      { terme: 'Maintenir', texte: 'Une règle qui change est réécrite, rejouée et recettée.' },
    ],
    action: { libelle: 'Voir notre méthode', href: '/methode' },
  },
  annuaire: {
    titre: 'Qui prend quel métier ?',
    texte: 'Chaque agent tient un métier du cabinet et s’arrête là où votre collaborateur reprend la main.',
    legende: 'Filtrer les agents IA par groupe de métiers',
    tous: 'Tous',
    microLabel: 'Agent IA',
    action: 'Rencontrer',
  },
  definitionDetaillee: {
    titre: 'Ce qu’un agent IA fait dans un cabinet comptable',
    lignes: [
      { terme: 'Ce qu’il prépare', texte: 'Il lit les pièces, les exports et les messages que sa règle lui désigne. Il prépare une écriture, un contrôle de bulletin, une réponse ou une déclaration à relire ; ce qu’il produit reste une proposition.' },
      { terme: 'Où il s’arrête', texte: 'Une pièce illisible, un cas hors règle ou un écart inexpliqué l’arrête. Il nomme le motif et vous présente le cas au lieu de deviner.' },
      { terme: 'Qui valide', texte: 'Votre collaborateur valide chaque proposition. Courriel, relance, déclaration, facture ou publication : l’agent prépare l’envoi, une personne du cabinet le fait partir.' },
      { terme: 'Qui garde le jugement', texte: 'Nous prenons toute la mécanique. Vous gardez tout le jugement : la révision, le conseil, la signature. La règle est écrite dans vos mots et appartient au cabinet.' },
      { terme: 'Ce qu’il coûte', texte: 'Vous payez une tâche prise en charge, pas des sièges. Le devis dépend des sources, des règles, des exceptions et des validations ; la maintenance y est écrite.' },
    ],
  },
  metiers: {
    titre: 'La frontière de chaque métier, en trois colonnes',
    texte: 'Chaque agent suit la règle écrite de son métier : ce qui se prépare seul, ce qui attend votre validation, ce qui reste humain. Le tableau en donne un geste par colonne, métier par métier.',
    legende: 'La frontière de la règle écrite, métier par métier',
    colonnes: ['Agent IA', 'Se prépare seul', 'Attend votre validation', 'Reste humain'],
  },
  construit: {
    titre: 'Construit sur votre cabinet, tel qu’il travaille.',
    texte: 'Un agent se construit à partir de trois choses qui sont déjà chez vous.',
    etapes: [
      { terme: 'Votre règle écrite', texte: 'La frontière en trois colonnes, écrite avec vous avant la première ligne de code.' },
      { terme: 'Vos outils', texte: 'Classeur, export, logiciel métier, messagerie : l’agent travaille là où vos équipes travaillent déjà. Ce que votre logiciel fait déjà, nous ne le refaisons pas.' },
      { terme: 'Vos échéances', texte: 'L’agent prépare au rythme de vos échéances de DSN, de TVA et de clôture, et s’arrête dans le doute.' },
    ],
  },
  sansAgent: {
    question: 'Votre tâche n’a pas d’agent ?',
    texte: 'Toute tâche répétitive dont la règle peut s’écrire se confie. Décrivez-la en trois phrases.',
    action: { libelle: 'Décrire votre tâche', href: '/contact' },
  },
  appel: {
    titre: 'Confiez une première tâche.',
    texte: 'Décrivez le geste que vos collaborateurs refont chaque semaine. Nous écrivons sa règle avec vous, construisons l’agent dans vos outils et faisons recetter le résultat par votre équipe. La description suffit pour commencer.',
  },
};

/** Les douze, dans l'ordre du cadrage (spec §0). */
export const AGENTS: readonly Specialiste[] = [
  COMPTABILITE, PAIE_SOCIAL, JURIDIQUE_FISCAL, FINANCE, MISSIONS_AUDIT, COMMERCIAL,
  COMMUNICATION, RELATION_CLIENT, GESTION_CABINET, RH_CABINET, INFORMATIQUE_OUTILS, PROTECTION_DONNEES,
];

export type SpecialisteAFiche = Specialiste & { destination: { type: 'fiche' } };

/**
 * Les neuf agents dont la carte mène à une fiche, publiée ou non. Le gabarit ne construit que les fiches publiées,
 * et en lit le contenu par `ficheDe`.
 */
export const FICHES: readonly SpecialisteAFiche[] = AGENTS.filter((agent): agent is SpecialisteAFiche => agent.destination.type === 'fiche');

export const cheminAgent = (agent: Specialiste): string =>
  agent.destination.type === 'page' ? agent.destination.chemin : `/agents-ia/${agent.slug}`;

/** Le contenu de la fiche d'un agent ; refuse de construire une page qui n'en a pas (fail-closed). */
export function ficheDe(agent: Specialiste): Fiche {
  if (agent.destination.type !== 'fiche') throw new Error(`${agent.slug} : sa carte mène à ${agent.destination.chemin}, pas à une fiche`);
  if (!agent.fiche) throw new Error(`${agent.slug} : fiche demandée alors que son contenu n’est pas encore écrit (tâches 6 et 9)`);
  return agent.fiche;
}

/** Le titulaire d'une famille ; `undefined` pour le hub, le bloc « Derrière chaque agent, nous » et les orphelines. */
export const titulaireDe = (familleId: string): Specialiste | undefined => AGENTS.find((agent) => agent.familles.includes(familleId));

/**
 * Le compte de chaque filtre de l'annuaire, écrit dans le libellé du filtre au build. Toutes les cartes du groupe
 * comptent, publiées ou non : le hub affiche les douze cartes (R19).
 */
export const comptesParGroupe = (): Record<GroupeId, number> => {
  const comptes = Object.fromEntries(GROUPES.map(({ id }) => [id, AGENTS.filter((agent) => agent.groupe === id).length]));
  return comptes as Record<GroupeId, number>;
};
