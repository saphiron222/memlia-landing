/**
 * La page de compatibilité `/integrations` (plan du 15/10/2026, tâche 8 ; arbitrages de la porte 2) : les logiciels avec
 * lesquels nos agents IA travaillent, domaine par domaine, chacun avec sa ligne « ce que nos agents font avec ».
 *
 * Source : `docs/strategy/site-v3/hub-agents-ia/CONNECTEURS.md` (§2 à §16), reprise mot pour mot, apostrophes
 * typographiques près (`tests/scripts/connecteurs-source.test.mjs`) ; les concurrents du §18.1 restent dehors.
 * Porte 2 : aucun statut d'outil, aucun total affiché, aucun lien sortant vers un éditeur, aucun partenariat.
 * Un connecteur est `{ id, nom, editeur, domaine, faitAvec, guides?, agents?, logo, etat? }` et rien d'autre
 * (`connecteurs.test.mjs`) ; son `id` est le slug de son nom et sert d'ancre (`/integrations#<id>`).
 *
 * Logos : fichiers des éditeurs téléchargés avec l'accord de Kevin du 15/10/2026, posés sous `public/logos/<id>.svg`
 * (SVG nettoyé de tout ce qui agit hors de l'image) ou `<id>.webp` (raster converti, 80 px de haut), jamais recolorés
 * ni redessinés. Une carte sans fichier, au fichier illisible ou écarté à la relecture garde son nom en texte
 * (`logo: null`) ; les quatre cartes de l'État n'ont jamais de logo (le bloc-marque est réservé à ses services).
 *
 * Feuille : seuls des `import type` (les tests importent ce fichier par le décapage de types de Node).
 */
import type { AgentId } from './specialistes.ts';

/** La mention de la charte (§10), sous la liste des logiciels. */
export const MENTION_MARQUES = 'Marques et logos de leurs titulaires, cités sans partenariat.';

/**
 * R27 : reste `false`. Des cartes sont en nom seul pour de bon (l'État, un fichier absent, illisible ou écarté) ; à la
 * place, tout logo déclaré pointe vers le fichier de sa propre carte, présent et sain (`connecteurs.test.mjs`).
 */
export const LOGOS_REQUIRED = false;

/** Un domaine de la page : son ancre, son libellé (titre de section), une phrase sur ce que nos agents y font, et qui. */
export interface Domaine {
  id: string;
  libelle: string;
  gestes: string;
  /** Les agents qui portent le domaine, dans l'ordre du titre de CONNECTEURS.md. */
  agents: readonly AgentId[];
}

/** Les quinze domaines, dans l'ordre de CONNECTEURS.md. Aucun compte n'y est écrit (porte 2). */
export const DOMAINES = [
  {
    id: 'production-comptable',
    libelle: 'Production comptable',
    gestes: 'Nos agents lisent les pièces et les exports de vos logiciels de production, puis préparent le lot de saisie au format d’import du cabinet, les rapprochements et les lettrages. Chaque écriture proposée attend la validation du collaborateur, qui garde l’intégration.',
    agents: ['comptabilite'],
  },
  {
    id: 'paie-social',
    libelle: 'Paie et social',
    gestes: 'Avant la DSN, nos agents contrôlent les variables reçues, lisent l’export de paie du mois et recensent les écarts. Votre gestionnaire de paie valide le bulletin et dépose la déclaration.',
    agents: ['paie-social'],
  },
  {
    id: 'juridique-formalites',
    libelle: 'Juridique et formalités',
    gestes: 'Nos agents tiennent le calendrier des approbations et des dépôts, et préparent les projets d’actes, les registres et les dossiers de formalité à partir des données du dossier. Les associés décident ; la signature et le dépôt restent au cabinet.',
    agents: ['juridique-fiscal'],
  },
  {
    id: 'commissariat-aux-comptes',
    libelle: 'Commissariat aux comptes',
    gestes: 'Selon la règle écrite du cabinet, nous préparons la sélection des tiers à confirmer (circularisation, NEP 505), la feuille des écarts et les fichiers du client rapprochés de la balance, pour le logiciel de dossier d’audit que vous utilisez déjà. Le commissaire aux comptes apprécie les éléments, documente ses travaux et conclut.',
    agents: ['missions-audit'],
  },
  {
    id: 'facturation-electronique',
    libelle: 'Facturation électronique',
    gestes: 'Vos factures circulent par la plateforme agréée que vous avez choisie ; nous travaillons dans vos outils, jamais à la place de cette plateforme. Nos agents relèvent les factures reçues, contrôlent leurs mentions et préparent leur imputation, ainsi que les factures d’honoraires du cabinet ; nous n’émettons, ne transmettons et ne recevons aucune facture. L’administration fiscale publie la liste des plateformes agréées, et nous vérifions avant le devis que la vôtre y figure.',
    agents: ['comptabilite', 'gestion-cabinet'],
  },
  {
    id: 'banque-paiements',
    libelle: 'Banque et paiements',
    gestes: 'Nos agents lisent les relevés et les transactions, rapprochent chaque mouvement de sa pièce et vous présentent ceux qui restent sans candidat ; les encaissements d’honoraires du cabinet se rapprochent de la même façon. Aucun paiement ni virement n’est initié.',
    agents: ['comptabilite', 'gestion-cabinet'],
  },
  {
    id: 'ged-dossier-permanent',
    libelle: 'GED et dossier permanent',
    gestes: 'Nos agents rangent les pièces déposées dans l’arborescence du cabinet, les nomment selon sa règle et signalent celles qui manquent au dossier permanent. Rien n’est supprimé ni versé dans un coffre d’archivage sans validation.',
    agents: ['comptabilite', 'informatique-outils'],
  },
  {
    id: 'signature-electronique',
    libelle: 'Signature électronique',
    gestes: 'Nos agents préparent, à partir du dossier, la lettre de mission et les documents à signer, puis suivent leur retour. L’envoi pour signature part quand l’associé l’a validé.',
    agents: ['commercial'],
  },
  {
    id: 'messagerie-agenda',
    libelle: 'Messagerie et agenda',
    gestes: 'Nos agents trient la boîte du cabinet par dossier et par priorité, relient chaque message au bon client, puis préparent les réponses types, les rendez-vous et la lettre d’information. Rien ne part sans validation.',
    agents: ['relation-client', 'communication'],
  },
  {
    id: 'bureautique-classeurs',
    libelle: 'Bureautique et classeurs',
    gestes: 'Dans vos classeurs, nos agents écrivent ce que la règle prévoit, à partir des exports que vous déposez. Vos formules et vos saisies ne sont jamais réécrites, et chaque écriture est tracée.',
    agents: ['informatique-outils'],
  },
  {
    id: 'caisse-e-commerce',
    libelle: 'Caisse et e-commerce',
    gestes: 'Nos agents lisent les exports de ventes, de caisse et de versements des plateformes de vos clients, et les mettent en écritures au format que votre logiciel importe déjà. Un écart de caisse vous est présenté, jamais corrigé d’office.',
    agents: ['comptabilite'],
  },
  {
    id: 'gestion-cabinet-crm',
    libelle: 'Gestion interne du cabinet et CRM',
    gestes: 'Nos agents rapprochent les actes et les temps de la facturation, préparent les factures d’honoraires, les relances et le tableau de bord du portefeuille en agrégats, puis les propositions et les lettres de mission. Le tarif, la vigilance LCB-FT et la signature restent au cabinet.',
    agents: ['gestion-cabinet', 'commercial'],
  },
  {
    id: 'donnees-legales',
    libelle: 'Données légales et administrations',
    gestes: 'Nos agents lisent les données légales de vos dossiers et les comptes rendus des administrations, signalent un changement, une annonce ou un rejet, et préparent la pièce attendue. Toute déclaration, formalité ou dépôt part de votre main.',
    agents: ['juridique-fiscal', 'paie-social', 'commercial'],
  },
  {
    id: 'factures-fournisseurs',
    libelle: 'Collecte de factures fournisseurs',
    gestes: 'Avec les accès que votre client a confiés au cabinet, nos agents relèvent les factures dans les espaces clients de ses fournisseurs, les rangent au dossier et préparent la relance quand l’une manque. Les abonnements dont la carte figure dans un autre domaine (Microsoft 365, Google Workspace, Adobe, Dropbox, Zoom, HubSpot, LinkedIn Ads) se relèvent de la même façon.',
    agents: ['comptabilite'],
  },
  {
    id: 'pilotage-tresorerie',
    libelle: 'Pilotage et trésorerie',
    gestes: 'À partir de la comptabilité tenue, nos agents préparent la trésorerie projetée, les situations intermédiaires, les tableaux de bord et les dossiers d’évaluation, chaque hypothèse tracée. Le conseil et la présentation au client restent au cabinet.',
    agents: ['finance'],
  },
] as const satisfies readonly Domaine[];

export type DomaineId = (typeof DOMAINES)[number]['id'];

/** Une carte de logiciel (porte 2, arbitrage 2) : aucun statut, aucun lien vers l'éditeur. */
export interface Connecteur {
  /** Slug du nom : l'ancre de la carte et du `ListItem` du JSON-LD. */
  id: string;
  /** Le texte en gras de la colonne « Logiciel » de CONNECTEURS.md (R14 : `Specialiste.logiciels` le cite tel quel). */
  nom: string;
  editeur: string;
  domaine: DomaineId;
  /** « Ce que nos agents font avec » : une phrase ou deux, sur une ligne. */
  faitAvec: string;
  /** Slugs des guides existants (`INTEGRATIONS`), liés par « En savoir plus » vers leur ancre de la page. */
  guides?: readonly string[];
  agents?: readonly AgentId[];
  /** `/logos/<id>.svg` ou `/logos/<id>.webp` et son `alt` ; `null` : le nom seul. */
  logo: { src: string; alt: string } | null;
  /** Une carte de l'État : jamais de logo. */
  etat?: true;
}

type CarteDuDomaine = Omit<Connecteur, 'domaine'>;
const dans = (domaine: DomaineId, cartes: readonly CarteDuDomaine[]): Connecteur[] => cartes.map((carte) => ({ ...carte, domaine }));

const CARTES_PRODUCTION_COMPTABLE: readonly CarteDuDomaine[] = [
  { id: 'pennylane', nom: 'Pennylane', editeur: 'Pennylane SAS', faitAvec: 'Reprend, avec leur motif, les pièces non imputées et les doublons sans numéro. L’imputation proposée se valide dans Pennylane.', logo: { src: '/logos/pennylane.webp', alt: 'Logo Pennylane' } },
  { id: 'cegid-loop', nom: 'Cegid Loop', editeur: 'Cegid', faitAvec: 'Prépare dans le format d’import de Loop les lignes qu’il ne reconnaît pas, et explique chaque paire de lettrage. Tout se valide avant intégration.', guides: ['lettrage-cegid'], logo: { src: '/logos/cegid-loop.svg', alt: 'Logo Cegid' } },
  { id: 'cegid-quadra-plus', nom: 'Cegid Quadra Plus', editeur: 'Cegid', faitAvec: 'Prépare, au format d’import que Quadra lit déjà, les exceptions de saisie et de lettrage restées à la main.', logo: { src: '/logos/cegid-quadra-plus.svg', alt: 'Logo Cegid' } },
  { id: 'sage-generation-experts', nom: 'Sage Génération Experts', editeur: 'Sage', faitAvec: 'Prépare le lot de saisie et les points de révision à partir des pièces et des relevés. Le collaborateur valide avant intégration.', logo: { src: '/logos/sage-generation-experts.svg', alt: 'Logo Sage' } },
  { id: 'acd-compta', nom: 'ACD COMPTA', editeur: 'ACD', faitAvec: 'Prépare les écritures et les rapprochements bancaires au format d’import d’ACD. L’intégration reste le geste du collaborateur.', logo: { src: '/logos/acd-compta.webp', alt: 'Logo ACD' } },
  { id: 'isacompta-connect', nom: 'ISACOMPTA CONNECT', editeur: 'AGIRIS', faitAvec: 'Prépare au format d’import d’ISACOMPTA les écritures des dossiers, agricoles compris. Chaque cas hors règle est arrêté et nommé.', logo: { src: '/logos/isacompta-connect.svg', alt: 'Logo AGIRIS' } },
  { id: 'amicompta', nom: 'AMICOMPTA', editeur: 'AGIRIS', faitAvec: 'Reprend, avec leur motif, les pièces que l’assistant ne sait pas proposer. Le collaborateur tranche.', logo: { src: '/logos/amicompta.svg', alt: 'Logo AGIRIS' } },
  { id: 'myu', nom: 'MyU', editeur: 'MyUnisoft', faitAvec: 'Prépare le lot de saisie et la liste des pièces manquantes de chaque dossier, avec le brouillon de relance. La validation se fait dans MyU.', logo: { src: '/logos/myu.svg', alt: 'Logo MyU' } },
  { id: 'tiime', nom: 'Tiime', editeur: 'Tiime Apps', faitAvec: 'Reprend les transactions que Tiime ne rapproche pas. Il prépare la relance qui réclame la pièce manquante en la nommant.', logo: { src: '/logos/tiime.svg', alt: 'Logo Tiime' } },
  { id: 'fulll', nom: 'fulll', editeur: 'fulll SAS', faitAvec: 'Reprend un par un les mouvements qui sortent de ses règles de réconciliation. Chaque appariement est proposé, puis validé.', logo: { src: '/logos/fulll.webp', alt: 'Logo fulll' } },
  { id: 'inqom', nom: 'Inqom', editeur: 'INQOM', faitAvec: 'Reprend, avec leur source, les écritures que la saisie automatique laisse en attente.', logo: { src: '/logos/inqom.svg', alt: 'Logo Inqom' } },
  { id: 'ingeneo', nom: 'Ingeneo', editeur: 'Septeo Group', faitAvec: 'Prépare les écritures et les contrôles au format d’import d’Ingeneo. Chaque écart est présenté avec sa source.', logo: { src: '/logos/ingeneo.svg', alt: 'Logo Ingeneo' } },
  { id: 'netexcom', nom: 'NETexcom', editeur: 'NETexcom', faitAvec: 'Classe les pièces que déposent vos clients et les prépare en écritures pour NETexcom. Le collaborateur valide.', logo: { src: '/logos/netexcom.svg', alt: 'Logo NETexcom' } },
  { id: 'bleez', nom: 'Bleez', editeur: 'BLEEZ SAS', faitAvec: 'Prépare les pièces et les mouvements bancaires en écritures. Le collaborateur valide.', logo: { src: '/logos/bleez.svg', alt: 'Logo Bleez' } },
  { id: 'logaia', nom: 'Logaia', editeur: 'LOGAIA SAS', faitAvec: 'Prépare les écritures au format d’import de Logaia. Une pièce illisible est arrêtée et nommée.', logo: { src: '/logos/logaia.svg', alt: 'Logo Logaia' } },
  { id: 'limpeed', nom: 'Limpeed', editeur: 'Self-Med SAS', faitAvec: 'Rapproche des relevés les recettes et les dépenses des dossiers BNC, et prépare la 2035 pour relecture.', logo: { src: '/logos/limpeed.svg', alt: 'Logo Limpeed' } },
  { id: 'pilotz', nom: 'Pilotz', editeur: 'Pilotz SAS', faitAvec: 'Prépare les dossiers BNC et LMNP à partir des relevés et des pièces. La liasse part après validation.', logo: { src: '/logos/pilotz.webp', alt: 'Logo Pilotz' } },
  { id: 'cegid-conciliator', nom: 'Cegid Conciliator', editeur: 'Cegid', faitAvec: 'Reprend, avec leur motif, les pièces que la saisie automatique écarte, et les prépare pour validation.', logo: { src: '/logos/cegid-conciliator.svg', alt: 'Logo Cegid' } },
  { id: 'dext', nom: 'Dext', editeur: 'Dext France SARL', faitAvec: 'Reprend les factures atypiques et les doublons sans numéro avant l’export vers le logiciel du cabinet.', logo: { src: '/logos/dext.webp', alt: 'Logo Dext' } },
  { id: 'yooz', nom: 'Yooz', editeur: 'Yooz SAS', faitAvec: 'Récupère et dépose les factures reçues hors de Yooz. Les écarts de rapprochement sont présentés avant l’export.', logo: { src: '/logos/yooz.svg', alt: 'Logo Yooz' } },
  { id: 'idocus', nom: 'iDocus', editeur: 'IDOCUS SAS', faitAvec: 'Contrôle les pièces collectées avant leur envoi vers la production, et réclame la pièce manquante en la nommant.', logo: { src: '/logos/idocus.svg', alt: 'Logo iDocus' } },
  { id: 'chaintrust', nom: 'Chaintrust', editeur: 'Chaintrust SAS', faitAvec: 'Reprend, avec leur source, les écritures laissées en suspens, et contrôle le FEC avant la révision.', logo: { src: '/logos/chaintrust.webp', alt: 'Logo Chaintrust' } },
  { id: 'meg-mon-expert-en-gestion', nom: 'MEG (Mon Expert en Gestion)', editeur: 'RCA SAS', faitAvec: 'Lit chaque mois la pré-comptabilité que vos clients tiennent dans MEG, prépare les écritures et liste les pièces manquantes.', logo: { src: '/logos/meg-mon-expert-en-gestion.svg', alt: 'Logo RCA SAS' } },
  { id: 'isarevise-connect', nom: 'ISAREVISE CONNECT', editeur: 'AGIRIS', faitAvec: 'Prépare les feuilles de travail et les points de révision à partir des données du dossier. Le réviseur conclut.', logo: { src: '/logos/isarevise-connect.svg', alt: 'Logo AGIRIS' } },
  { id: 'confero', nom: 'Confero', editeur: 'Confero SAS', faitAvec: 'Rassemble par dossier les pièces et les contrôles de l’examen de conformité fiscale, prêts pour la revue du professionnel.', logo: { src: '/logos/confero.svg', alt: 'Logo Confero' } },
  { id: 'comptasecure', nom: 'ComptaSecure', editeur: 'ComptaSecure SAS', faitAvec: 'Trie par dossier les anomalies relevées sur le FEC et relie chacune à son écriture.', logo: { src: '/logos/comptasecure.webp', alt: 'Logo ComptaSecure' } },
  { id: 'fec-expert', nom: 'FEC Expert', editeur: 'Éditions Francis Lefebvre et DGC', faitAvec: 'Contrôle la forme du FEC avant sa remise à l’administration ou au commissaire aux comptes. Chaque rejet est expliqué.', logo: { src: '/logos/fec-expert.webp', alt: 'Logo FEC Expert' } },
  { id: 'notaqo', nom: 'NotaQo', editeur: 'NotaQo', faitAvec: 'Relie à leurs écritures les alertes de conformité du FEC et les trie pour la révision.', logo: { src: '/logos/notaqo.webp', alt: 'Logo NotaQo' } },
  { id: 'e-clid', nom: 'E-Clid', editeur: 'E-Clid', faitAvec: 'Convertit les contrôles automatiques des données comptables en liste de points à revoir, dossier par dossier.', logo: { src: '/logos/e-clid.webp', alt: 'Logo E-Clid' } },
  { id: 'mydecisio', nom: 'MyDecisio', editeur: 'MyDecisio', faitAvec: 'Reprend par dossier les alertes de pré-révision. Chaque écart est présenté avec sa source avant validation.', logo: { src: '/logos/mydecisio.svg', alt: 'Logo MyDecisio' } },
  { id: 'syndemos', nom: 'Syndemos', editeur: 'Creacte SARL', faitAvec: 'Prépare les questions de révision à partir du dossier, et suit les réponses des clients jusqu’à la pièce.', logo: { src: '/logos/syndemos.svg', alt: 'Logo Syndemos' } },
  { id: 'bee-report', nom: 'Bee Report', editeur: 'BEE REPORT SAS', faitAvec: 'Réunit et contrôle les balances des entités avant la consolidation. Les écarts intragroupe sont présentés.', logo: { src: '/logos/bee-report.svg', alt: 'Logo Bee Report' } },
  { id: 'crypto-accounting', nom: 'Crypto Accounting', editeur: 'Crypto Accounting', faitAvec: 'Prépare en écritures les opérations des portefeuilles et des plateformes d’échange, avec le FEC du dossier.', logo: { src: '/logos/crypto-accounting.webp', alt: 'Logo Crypto Accounting' } },
  { id: 'sogescot', nom: 'Sogescot', editeur: 'Sogescot', faitAvec: 'Prépare en écritures les relevés et les dépenses collectés. Le collaborateur valide.', logo: { src: '/logos/sogescot.webp', alt: 'Logo Sogescot' } },
  { id: 'ebp-comptabilite', nom: 'EBP Comptabilité', editeur: 'EBP SA', faitAvec: 'Prépare et contrôle la demande d’export FEC (destinataire, période, régime), puis le lettrage et la clôture. L’export se fait dans EBP.', guides: ['export-fec-ebp', 'lettrage-ebp', 'cloture-ebp'], logo: { src: '/logos/ebp-comptabilite.svg', alt: 'Logo EBP SA' } },
  { id: 'sage-100-comptabilite', nom: 'Sage 100 Comptabilité', editeur: 'Sage', faitAvec: 'Propose les paires de lettrage et de rapprochement à partir de l’export, sans changer leur statut dans Sage. Il prépare aussi la saisie par lot et la clôture.', guides: ['rapprochement-bancaire-sage', 'lettrage-sage', 'saisie-comptable-sage', 'cloture-sage'], logo: { src: '/logos/sage-100-comptabilite.svg', alt: 'Logo Sage' } },
  { id: 'sage-50-comptabilite', nom: 'Sage 50 Comptabilité', editeur: 'Sage', faitAvec: 'Lit l’export comptable de vos clients et le contrôle avant son intégration dans le logiciel du cabinet.', logo: { src: '/logos/sage-50-comptabilite.svg', alt: 'Logo Sage' } },
  { id: 'odoo-comptabilite', nom: 'Odoo Comptabilité', editeur: 'Odoo S.A.', faitAvec: 'Lit et contrôle le FEC et les exports d’Odoo, puis les rapproche de la comptabilité tenue par le cabinet.', logo: { src: '/logos/odoo-comptabilite.svg', alt: 'Logo Odoo Comptabilité' } },
  { id: 'cogilog-compta', nom: 'Cogilog Compta', editeur: 'Cogilog SAS', faitAvec: 'Lit l’export des écritures de vos clients et le contrôle avant intégration.', logo: { src: '/logos/cogilog-compta.webp', alt: 'Logo Cogilog Compta' } },
  { id: 'n2f', nom: 'N2F', editeur: 'SAS N2JSOFT', faitAvec: 'Rapproche les notes arrivées hors de l’outil, réclame le justificatif manquant en le nommant et contrôle l’export comptable.', logo: { src: '/logos/n2f.svg', alt: 'Logo N2F' } },
  { id: 'expensya', nom: 'Expensya', editeur: 'Medius', faitAvec: 'Contrôle l’export des notes de frais (TVA, comptes, justificatifs) avant intégration.', logo: { src: '/logos/expensya.svg', alt: 'Logo Expensya' } },
  { id: 'jenji', nom: 'Jenji', editeur: 'SILAEXPERT', faitAvec: 'Contrôle l’export des notes de frais (TVA, comptes, justificatifs) avant intégration.', logo: { src: '/logos/jenji.svg', alt: 'Logo Jenji' } },
  { id: 'cegid-notilus', nom: 'Cegid Notilus', editeur: 'Cegid', faitAvec: 'Rapproche des relevés de carte les notes et les déplacements comptabilisés. Un écart est présenté, jamais corrigé d’office.', logo: { src: '/logos/cegid-notilus.svg', alt: 'Logo Cegid' } },
  { id: 'sellsy', nom: 'Sellsy', editeur: 'SELLSY SAS', faitAvec: 'Lit les factures de vente et les encaissements de vos clients, et les prépare en écritures de ventes.', logo: { src: '/logos/sellsy.svg', alt: 'Logo Sellsy' } },
  { id: 'axonaut', nom: 'Axonaut', editeur: 'DIGITICA SAS', faitAvec: 'Lit depuis son portail comptable les factures de vente et les encaissements de vos clients, et les prépare en écritures de ventes.', logo: { src: '/logos/axonaut.webp', alt: 'Logo Axonaut' } },
  { id: 'evoliz', nom: 'Evoliz', editeur: 'Evoliz SAS', faitAvec: 'Lit les factures de vente et les encaissements de vos clients, et les prépare en écritures de ventes.', logo: { src: '/logos/evoliz.svg', alt: 'Logo Evoliz' } },
  { id: 'henrri', nom: 'Henrri', editeur: 'Henrri', faitAvec: 'Lit les factures de vente et les encaissements de vos clients, et les prépare en écritures de ventes.', logo: { src: '/logos/henrri.webp', alt: 'Logo Henrri' } },
  { id: 'my-facturation', nom: 'MY.Facturation', editeur: 'MY.Facturation', faitAvec: 'Lit les factures de vente et les encaissements de vos clients, et les prépare en écritures de ventes.', logo: { src: '/logos/my-facturation.webp', alt: 'Logo MY.Facturation' } },
  { id: 'progbat', nom: 'ProGBat', editeur: 'TSL Business SAS', faitAvec: 'Lit les devis, les situations et les factures des artisans et les prépare en écritures, retenues de garantie comprises.', logo: { src: '/logos/progbat.webp', alt: 'Logo ProGBat' } },
];

const CARTES_PAIE_SOCIAL: readonly CarteDuDomaine[] = [
  { id: 'silae', nom: 'Silae', editeur: 'SILAEXPERT SAS', faitAvec: 'Lit l’export de paie du mois et la liste des salariés, contrôle les variables et recense les écarts avant la DSN. Rien n’est écrit dans Silae.', guides: ['dsn-silae', 'bulletin-de-paie-silae'], logo: { src: '/logos/silae.svg', alt: 'Logo Silae' } },
  { id: 'cegid-quadra-paie', nom: 'Cegid Quadra Paie', editeur: 'Cegid', faitAvec: 'Contrôle les variables arrivées par courriel ou par tableur et les prépare pour la saisie. L’OD de paie est rapprochée de la comptabilité.', logo: { src: '/logos/cegid-quadra-paie.svg', alt: 'Logo Cegid' } },
  { id: 'sage-paie', nom: 'Sage Paie', editeur: 'Sage', faitAvec: 'Contrôle les variables avant le calcul, et recense avant la DSN les contrats et les dates attendus.', logo: { src: '/logos/sage-paie.svg', alt: 'Logo Sage' } },
  { id: 'sage-100-paie-rh', nom: 'Sage 100 Paie & RH', editeur: 'Sage', faitAvec: 'Recense avant le transfert DSN les contrats et les dates attendus, et contrôle les bulletins contre les variables du mois.', guides: ['dsn-sage', 'bulletin-de-paie-sage'], logo: { src: '/logos/sage-100-paie-rh.svg', alt: 'Logo Sage' } },
  { id: 'acd-paie', nom: 'ACD PAIE', editeur: 'ACD', faitAvec: 'Contrôle avant le calcul les variables que vos clients saisissent dans i-PAIE. Les écarts sont présentés au gestionnaire.', logo: { src: '/logos/acd-paie.webp', alt: 'Logo ACD' } },
  { id: 'isapaye-connect', nom: 'ISAPAYE CONNECT', editeur: 'AGIRIS', faitAvec: 'Contrôle les variables et rapproche l’OD de paie d’ISACOMPTA avant validation.', logo: { src: '/logos/isapaye-connect.svg', alt: 'Logo AGIRIS' } },
  { id: 'cot-tns', nom: 'COT’TNS', editeur: 'AGIRIS', faitAvec: 'Contrôle les appels de cotisations des indépendants contre les revenus déclarés. L’écart est présenté.', logo: { src: '/logos/cot-tns.svg', alt: 'Logo AGIRIS' } },
  { id: 'ebp-paie', nom: 'EBP Paie', editeur: 'EBP', faitAvec: 'Lit l’export de paie de vos clients et le rapproche de la comptabilité tenue par le cabinet.', logo: { src: '/logos/ebp-paie.svg', alt: 'Logo EBP' } },
  { id: 'cegid-payroll-ultimate', nom: 'Cegid Payroll Ultimate', editeur: 'Cegid', faitAvec: 'Fait les rapprochements que ses contrôles natifs ne couvrent pas : l’export de paie contre la comptabilité et la DSN.', logo: { src: '/logos/cegid-payroll-ultimate.svg', alt: 'Logo Cegid' } },
  { id: 'openpaye', nom: 'Openpaye', editeur: 'Freshpay France', faitAvec: 'Contrôle les variables avant le calcul et rapproche l’export de paie de la comptabilité.', logo: { src: '/logos/openpaye.webp', alt: 'Logo Openpaye' } },
  { id: 'nibelis', nom: 'Nibelis', editeur: 'Nibelis SA', faitAvec: 'Lit les journaux de paie et les DSN, et les rapproche de la comptabilité du dossier.', logo: { src: '/logos/nibelis.webp', alt: 'Logo Nibelis' } },
  { id: 'linc', nom: 'Linc', editeur: 'Linc SAS', faitAvec: 'Contrôle les variables avant le calcul et rapproche l’export de paie de la comptabilité.', logo: { src: '/logos/linc.svg', alt: 'Logo Linc' } },
  { id: 'alassio', nom: 'Alassio', editeur: 'Peppers SAS', faitAvec: 'Contrôle avant le calcul les variables importées en masse. L’OD de paie est rapprochée de la comptabilité.', logo: { src: '/logos/alassio.webp', alt: 'Logo Alassio' } },
  { id: 'weekera', nom: 'Weekera', editeur: 'WEEKERA SAS', faitAvec: 'Contrôle les variables avant le calcul et rapproche l’export de paie de la comptabilité.', logo: { src: '/logos/weekera.webp', alt: 'Logo Weekera' } },
  { id: 'wagyz', nom: 'Wagyz', editeur: 'CHAPSOFT SNC', faitAvec: 'Contrôle les variables avant le calcul et rapproche l’export de paie de la comptabilité.', logo: { src: '/logos/wagyz.webp', alt: 'Logo Wagyz' } },
  { id: 'hamac', nom: 'Hamac', editeur: 'GHS SAS', faitAvec: 'Contrôle avant le calcul les contrats courts et leurs variables, et rapproche chaque DSN de ses bulletins.', logo: { src: '/logos/hamac.svg', alt: 'Logo Hamac' } },
  { id: 'payfit', nom: 'Payfit', editeur: 'Payfit SAS', faitAvec: 'Rapproche l’export de paie du client de la comptabilité tenue par le cabinet, et prépare l’OD pour validation.', logo: { src: '/logos/payfit.svg', alt: 'Logo Payfit' } },
  { id: 'adp-decidium', nom: 'ADP DECIDIUM', editeur: 'ADP', faitAvec: 'Rapproche l’export de paie du client de la comptabilité tenue par le cabinet, et prépare l’OD pour validation.', logo: { src: '/logos/adp-decidium.svg', alt: 'Logo ADP' } },
  { id: 'lucca', nom: 'Lucca', editeur: 'LUCCA SAS', faitAvec: 'Contrôle contre les variables du mois les absences et les notes de frais exportées vers la paie.', logo: { src: '/logos/lucca.svg', alt: 'Logo Lucca' } },
  { id: 'factorial', nom: 'Factorial', editeur: 'Everyday Software S.L.', faitAvec: 'Contrôle avant le calcul les absences, les heures et les primes exportées pour la paie.', logo: { src: '/logos/factorial.svg', alt: 'Logo Factorial' } },
  { id: 'eurecia', nom: 'Eurécia', editeur: 'Eurécia SAS', faitAvec: 'Contrôle avant le calcul les absences, les heures et les primes exportées pour la paie.', logo: { src: '/logos/eurecia.webp', alt: 'Logo Eurécia' } },
  { id: 'quarksup', nom: 'quarksUp', editeur: 'quarksUp SAS', faitAvec: 'Contrôle avant la paie les éléments variables exportés par le SIRH du client.', logo: { src: '/logos/quarksup.webp', alt: 'Logo quarksUp' } },
  { id: 'kelio', nom: 'Kelio', editeur: 'KELIO SAS', faitAvec: 'Contrôle contre le planning les temps badgés exportés pour la paie, et signale l’heure manquante.', logo: { src: '/logos/kelio.svg', alt: 'Logo Kelio' } },
  { id: 'skello', nom: 'Skello', editeur: 'Skello SAS', faitAvec: 'Contrôle les heures et les absences du planning avant leur transfert vers la paie.', logo: { src: '/logos/skello.svg', alt: 'Logo Skello' } },
  { id: 'combo', nom: 'Combo', editeur: 'COMBO SAS', faitAvec: 'Contrôle les heures et les absences du planning avant leur transfert vers la paie.', logo: { src: '/logos/combo.svg', alt: 'Logo Combo' } },
  { id: 'swile', nom: 'Swile', editeur: 'Swile SAS', faitAvec: 'Rapproche les titres-restaurant et les avantages commandés de la paie et de la comptabilité du mois.', logo: { src: '/logos/swile.svg', alt: 'Logo Swile' } },
  { id: 'bimpli', nom: 'Bimpli', editeur: 'Swile SAS', faitAvec: 'Rapproche les titres-restaurant et les avantages commandés de la paie et de la comptabilité du mois.', logo: { src: '/logos/bimpli.webp', alt: 'Logo Bimpli rejoint Swile' } },
  { id: 'edenred', nom: 'Edenred', editeur: 'Edenred France', faitAvec: 'Rapproche les commandes de titres des retenues en paie et de la facture. L’écart est présenté.', logo: { src: '/logos/edenred.svg', alt: 'Logo Edenred' } },
  { id: 'pluxee', nom: 'Pluxee', editeur: 'Pluxee France', faitAvec: 'Rapproche les commandes de titres des retenues en paie et de la facture. L’écart est présenté.', logo: { src: '/logos/pluxee.webp', alt: 'Logo Pluxee' } },
  { id: 'up-dejeuner', nom: 'Up Déjeuner', editeur: 'Groupe Up', faitAvec: 'Rapproche les commandes de titres des retenues en paie et de la facture. L’écart est présenté.', logo: { src: '/logos/up-dejeuner.svg', alt: 'Logo Déjeuner Upcoop' } },
  { id: 'wiismile', nom: 'WiiSmile', editeur: 'WiiSmile SAS', faitAvec: 'Rapproche de la comptabilité du client les factures et les participations de l’offre d’avantages.', logo: { src: '/logos/wiismile.webp', alt: 'Logo WiiSmile' } },
  { id: 'zendsn', nom: 'ZenDSN', editeur: 'Fiabdata SAS', faitAvec: 'Trie par dossier les anomalies relevées sur les DSN et relie chacune au bulletin à corriger avant la DSN suivante.', logo: { src: '/logos/zendsn.webp', alt: 'Logo ZenDSN' } },
  { id: 'dsn-val', nom: 'DSN-Val', editeur: 'GIP-MDS', faitAvec: 'Contrôle le fichier DSN avant dépôt et explique chaque rejet au gestionnaire. Le dépôt reste son geste.', logo: { src: '/logos/dsn-val.webp', alt: 'Logo GIP-MDS' } },
  { id: 'cobham-solutions', nom: 'Cobham Solutions', editeur: 'Cobham Solutions', faitAvec: 'Lit et contrôle les fichiers DSN, et présente chaque écart avec la rubrique en cause.', logo: { src: '/logos/cobham-solutions.webp', alt: 'Logo Cobham Solutions' } },
  { id: 'gerem', nom: 'Gerem', editeur: 'GEREM SAS', faitAvec: 'Prépare les scénarios de rémunération du dirigeant à partir de la comptabilité tenue. L’arbitrage reste au conseil.', logo: { src: '/logos/gerem.svg', alt: 'Logo Gerem' } },
  { id: 'myfides', nom: 'MyFides', editeur: 'Association MyFides', faitAvec: 'Prépare les calculs sociaux (indemnités de fin de carrière, statut du dirigeant) à partir des données du dossier.', logo: { src: '/logos/myfides.webp', alt: 'Logo MyFides' } },
  { id: 'agrume', nom: 'Agrume', editeur: 'Agrume SAS', faitAvec: 'Applique au dossier les modèles et les procédures de droit social, et prépare le document pour relecture.', logo: { src: '/logos/agrume.webp', alt: 'Logo Agrume' } },
  { id: 'legisocial', nom: 'LégiSocial', editeur: 'NetLEGIS SAS', faitAvec: 'Cite la règle sociale, avec sa source datée, dans la note préparée pour le gestionnaire.', logo: { src: '/logos/legisocial.svg', alt: 'Logo LégiSocial' } },
  { id: 'editions-tissot', nom: 'Éditions Tissot', editeur: 'Éditions Tissot SAS', faitAvec: 'Cite la règle sociale, avec sa source datée, dans la note préparée pour le gestionnaire.', logo: { src: '/logos/editions-tissot.webp', alt: 'Logo Éditions Tissot' } },
  { id: 'dokia', nom: 'Dokia', editeur: 'Dôme Media SAS', faitAvec: 'Applique au dossier les procédures sociales du pôle. Chaque document est préparé pour relecture.', logo: { src: '/logos/dokia.webp', alt: 'Logo Dokia' } },
];

const CARTES_JURIDIQUE_FORMALITES: readonly CarteDuDomaine[] = [
  { id: 'lexis-polyacte', nom: 'Lexis PolyActe', editeur: 'LexisNexis SA', faitAvec: 'Tient l’échéancier des approbations et des dépôts, et prépare les projets d’actes à partir des données du dossier.', logo: { src: '/logos/lexis-polyacte.svg', alt: 'Logo LexisNexis SA' } },
  { id: 'aji-societes', nom: 'AJi Sociétés', editeur: 'Lefebvre Dalloz', faitAvec: 'Prépare les projets de procès-verbaux et les registres à partir des comptes approuvés. La signature reste aux associés.', logo: { src: '/logos/aji-societes.svg', alt: 'Logo Lefebvre Dalloz' } },
  { id: 'juriactes', nom: 'Juriactes', editeur: 'Juriactes SAS', faitAvec: 'Prépare les actes d’approbation et de modification à partir du logiciel de production. Le dépôt reste votre geste.', logo: { src: '/logos/juriactes.webp', alt: 'Logo Juriactes' } },
  { id: 'express-juridique', nom: 'Express Juridique', editeur: 'EXPRESS JURIDIQUE SAS', faitAvec: 'Pré-remplit les actes à partir des données du dossier, pour relecture avant la signature et le dépôt.', logo: { src: '/logos/express-juridique.svg', alt: 'Logo Express Juridique' } },
  { id: 'dexyos', nom: 'Dexyos', editeur: 'DEXYOS SASU', faitAvec: 'Prépare les actes, les formalités et les registres à partir des données comptables. Le dépôt reste le geste du cabinet.', logo: { src: '/logos/dexyos.svg', alt: 'Logo Dexyos' } },
  { id: 'vikta', nom: 'VIKTA', editeur: 'VIKTA SAS', faitAvec: 'Reprend les données comptables dans le projet d’approbation. Chaque date est confirmée avant l’envoi.', logo: { src: '/logos/vikta.webp', alt: 'Logo VIKTA' } },
  { id: 'axiocap', nom: 'Axiocap', editeur: 'SAS AXIOCAP', faitAvec: 'Tient à jour les registres et les assemblées dématérialisés à partir des décisions validées.', logo: { src: '/logos/axiocap.webp', alt: 'Logo Axiocap' } },
  { id: 'izikap', nom: 'Izikap', editeur: 'Xelians Archivage SAS', faitAvec: 'Tient à jour les registres et les assemblées dématérialisés à partir des décisions validées.', logo: { src: '/logos/izikap.webp', alt: 'Logo Izikap' } },
  { id: 'ubikap', nom: 'Ubikap', editeur: 'Ubikap SAS', faitAvec: 'Prépare les convocations et les procès-verbaux d’assemblée. L’envoi part après validation.', logo: { src: '/logos/ubikap.webp', alt: 'Logo Ubikap' } },
  { id: 'impalact', nom: 'ImpalAct', editeur: 'Legascope SAS', faitAvec: 'Pré-remplit les actes à partir des données du dossier, pour relecture avant la signature et le dépôt.', logo: { src: '/logos/impalact.webp', alt: 'Logo ImpalAct' } },
  { id: 'juria', nom: 'JurIA', editeur: 'JurIA SAS', faitAvec: 'Rédige les projets d’actes à partir du dossier. Le juriste les relit avant la signature et le dépôt.', logo: { src: '/logos/juria.svg', alt: 'Logo JurIA' } },
  { id: 'hermineia', nom: 'HermineIA', editeur: 'HERMINEIA SAS', faitAvec: 'Rédige les projets d’actes à partir du dossier. Le juriste les relit avant la signature et le dépôt.', logo: { src: '/logos/hermineia.webp', alt: 'Logo HermineIA' } },
  { id: 'alf', nom: 'Alf', editeur: 'ALF SAS', faitAvec: 'Remplit à partir du dossier les modèles juridiques du cabinet. Chaque document est relu avant l’envoi.', logo: { src: '/logos/alf.svg', alt: 'Logo Alf' } },
  { id: 'legalvision', nom: 'LegalVision', editeur: 'LVPRO', faitAvec: 'Réunit et contrôle le dossier de formalité avant le dépôt. Le dépôt reste votre geste.', logo: { src: '/logos/legalvision.svg', alt: 'Logo LegalVision' } },
  { id: 'legal2digital', nom: 'Legal2digital', editeur: 'GIE de journaux d’annonces légales', faitAvec: 'Prépare les annonces légales à partir de l’acte validé, et range l’attestation de parution au dossier.', logo: { src: '/logos/legal2digital.svg', alt: 'Logo Legal2digital' } },
  { id: 'medialex', nom: 'Medialex', editeur: 'MEDIALEX SAS', faitAvec: 'Prépare les annonces légales à partir de l’acte validé, et range l’attestation de parution au dossier.', logo: { src: '/logos/medialex.svg', alt: 'Logo Medialex' } },
  { id: 'annonces-legales-les-echos-le-parisien', nom: 'Annonces légales Les Echos Le Parisien', editeur: 'Les Echos Le Parisien Services', faitAvec: 'Prépare les annonces légales à partir de l’acte validé, et range l’attestation de parution au dossier.', logo: { src: '/logos/annonces-legales-les-echos-le-parisien.webp', alt: 'Logo Annonces légales Les Echos Le Parisien' } },
  { id: 'prolegales', nom: 'ProLégales', editeur: 'N.R. Communication SAS', faitAvec: 'Prépare les annonces légales à partir de l’acte validé, et range l’attestation de parution au dossier.', logo: { src: '/logos/prolegales.svg', alt: 'Logo ProLégales' } },
  { id: 'gazette-solutions', nom: 'Gazette Solutions', editeur: 'La Gazette Solutions SARL', faitAvec: 'Prépare les annonces légales à partir de l’acte validé, et range l’attestation de parution au dossier.', logo: { src: '/logos/gazette-solutions.webp', alt: 'Logo Gazette Solutions' } },
  { id: 'navis-et-solution-expert-comptable', nom: 'Navis et Solution Expert-comptable', editeur: 'Lefebvre Dalloz', faitAvec: 'Cite la règle fiscale ou juridique, avec sa source datée, dans la note préparée pour le collaborateur.', logo: { src: '/logos/navis-et-solution-expert-comptable.svg', alt: 'Logo Lefebvre Dalloz' } },
  { id: 'genia-l-expert-comptable', nom: 'GenIA-L Expert-comptable', editeur: 'Lefebvre Dalloz', faitAvec: 'Reprend dans la note du dossier les réponses de recherche, avec leur source. Le collaborateur les relit.', logo: { src: '/logos/genia-l-expert-comptable.svg', alt: 'Logo Lefebvre Dalloz' } },
  { id: 'lexis', nom: 'Lexis+', editeur: 'LexisNexis', faitAvec: 'Reprend dans la note du dossier les réponses de recherche, avec leur source. Le collaborateur les relit.', logo: { src: '/logos/lexis.svg', alt: 'Logo LexisNexis' } },
  { id: 'revue-fiduciaire', nom: 'Revue Fiduciaire', editeur: 'Groupe Revue Fiduciaire', faitAvec: 'Cite la règle juridique, fiscale ou sociale, avec sa source datée, dans la note préparée pour le collaborateur.', logo: { src: '/logos/revue-fiduciaire.webp', alt: 'Logo Revue Fiduciaire' } },
  { id: 'lexbase', nom: 'Lexbase', editeur: 'Lexbase SA', faitAvec: 'Reprend dans la note du dossier les réponses de recherche, avec leur source. Le collaborateur les relit.', logo: { src: '/logos/lexbase.webp', alt: 'Logo Lexbase' } },
  { id: 'infodoc-experts', nom: 'Infodoc-experts', editeur: 'Service du Conseil supérieur de l’Ordre', faitAvec: 'Range au dossier la question posée au service et sa réponse, datées et sourcées.', logo: { src: '/logos/infodoc-experts.svg', alt: 'Logo Infodoc-experts' } },
  { id: 'svp', nom: 'SVP', editeur: 'SVP Groupe SAS', faitAvec: 'Range au dossier la question posée au service et sa réponse, datées et sourcées.', logo: { src: '/logos/svp.svg', alt: 'Logo SVP' } },
  { id: 'weblex', nom: 'WebLex', editeur: 'WEBLEX SAS', faitAvec: 'Reprend dans la lettre d’information l’actualité retenue par le cabinet (Colette). Elle est relue avant l’envoi.', logo: { src: '/logos/weblex.webp', alt: 'Logo WebLex' } },
  { id: 'wisetax', nom: 'Wisetax', editeur: 'Avocode SAS', faitAvec: 'Reprend dans la note du dossier les réponses de recherche, avec leur source. Le collaborateur les relit.', logo: { src: '/logos/wisetax.svg', alt: 'Logo Wisetax' } },
  { id: 'justaxx', nom: 'JustaxX', editeur: 'Distribué par RCA', faitAvec: 'Réunit les avis de taxe foncière de vos clients et les prépare pour l’audit. La réclamation reste votre décision.', logo: { src: '/logos/justaxx.svg', alt: 'Logo Distribué par RCA' } },
];

const CARTES_COMMISSARIAT_AUX_COMPTES: readonly CarteDuDomaine[] = [
  { id: 'caseware-audit-france', nom: 'Caseware Audit France', editeur: 'CaseWare France', faitAvec: 'Prépare pour le dossier d’audit la sélection des tiers proposée selon la règle du cabinet, la feuille des écarts et les fichiers du client rapprochés de la balance. L’équipe les verse après revue.', logo: { src: '/logos/caseware-audit-france.svg', alt: 'Logo Caseware' } },
  { id: 'caseware-idea', nom: 'Caseware IDEA', editeur: 'Caseware International', faitAvec: 'Prépare les fichiers du client (paie, immobilisations, stocks) et les rapproche de la balance avant les analyses.', logo: { src: '/logos/caseware-idea.svg', alt: 'Logo Caseware' } },
  { id: 'caseware-extractly', nom: 'Caseware Extractly', editeur: 'CaseWare France', faitAvec: 'Relie dans le classeur de travail chaque pièce probante à sa transaction, et signale chaque écart.', logo: { src: '/logos/caseware-extractly.svg', alt: 'Logo Caseware' } },
  { id: 'auditsoft-premier', nom: 'Auditsoft Premier', editeur: 'Lefebvre Dalloz', faitAvec: 'Prépare pour le dossier d’audit la sélection des tiers proposée selon la règle du cabinet, la feuille des écarts et les fichiers du client rapprochés de la balance. L’équipe les verse après revue.', logo: { src: '/logos/auditsoft-premier.svg', alt: 'Logo Lefebvre Dalloz' } },
  { id: 'acropole-expert-cac', nom: 'Acropole Expert CAC', editeur: 'Centre Ouest Informatique', faitAvec: 'Prépare pour le dossier d’audit la sélection des tiers proposée selon la règle du cabinet, la feuille des écarts et les fichiers du client rapprochés de la balance. L’équipe les verse après revue.', logo: { src: '/logos/acropole-expert-cac.svg', alt: 'Logo Acropole Expert CAC' } },
  { id: 'cacao', nom: 'CACAO', editeur: 'Groupe TGS France', faitAvec: 'Prépare pour le dossier d’audit la sélection des tiers proposée selon la règle du cabinet, la feuille des écarts et les fichiers du client rapprochés de la balance. L’équipe les verse après revue.', logo: { src: '/logos/cacao.svg', alt: 'Logo CACAO' } },
  { id: 'myauditpilot', nom: 'MyAuditPilot', editeur: 'MyAuditPilot', faitAvec: 'Prépare pour le dossier d’audit la sélection des tiers proposée selon la règle du cabinet, la feuille des écarts et les fichiers du client rapprochés de la balance. L’équipe les verse après revue.', logo: { src: '/logos/myauditpilot.webp', alt: 'Logo MyAuditPilot' } },
  { id: 'dreamaudit', nom: 'DreamAudit', editeur: 'Gest On Line SAS', faitAvec: 'Prépare pour le dossier d’audit la sélection des tiers proposée selon la règle du cabinet, la feuille des écarts et les fichiers du client rapprochés de la balance. L’équipe les verse après revue.', logo: { src: '/logos/dreamaudit.svg', alt: 'Logo DreamAudit' } },
  { id: 'e-circu', nom: 'e-Circu', editeur: 'Gest On Line SAS', faitAvec: 'Propose les tiers à confirmer selon la règle écrite du cabinet et prépare la feuille des écarts. L’envoi, les relances et la réception des réponses restent sous la maîtrise du commissaire aux comptes.', logo: null },
  { id: 'e-recup', nom: 'e-Recup', editeur: 'Gest On Line SAS', faitAvec: 'Tient à jour la liste des pièces demandées au client audité, et rapproche chaque pièce reçue de sa demande.', logo: null },
  { id: 'packaudit', nom: 'PackAUDIT', editeur: 'CNCC', faitAvec: 'Prépare pour le dossier les fichiers du client rapprochés de la balance, et la feuille des écarts.', logo: { src: '/logos/packaudit.webp', alt: 'Logo PackAUDIT' } },
  { id: 'smartfec', nom: 'SmartFEC+', editeur: 'CNCC', faitAvec: 'Laisse à SmartFEC+ l’analyse du FEC, qu’il fait déjà, et prépare la sélection des éléments à contrôler et la feuille des écarts.', logo: { src: '/logos/smartfec.webp', alt: 'Logo SmartFEC+' } },
  { id: 'circit', nom: 'Circit', editeur: 'Circit Limited', faitAvec: 'Propose selon la règle du cabinet les tiers à confirmer ; l’envoi par la plateforme reste sous la maîtrise du commissaire aux comptes.', logo: { src: '/logos/circit.svg', alt: 'Logo Circit' } },
  { id: 'thomson-reuters-confirmation', nom: 'Thomson Reuters Confirmation', editeur: 'Thomson Reuters', faitAvec: 'Propose selon la règle du cabinet les tiers à confirmer ; l’envoi par la plateforme reste sous la maîtrise du commissaire aux comptes.', logo: { src: '/logos/thomson-reuters-confirmation.webp', alt: 'Logo Thomson Reuters Confirmation' } },
  { id: 'datasnipper', nom: 'DataSnipper', editeur: 'DataSnipper', faitAvec: 'Rassemble les pièces probantes et les relie, dans le classeur de travail, aux lignes à contrôler.', logo: { src: '/logos/datasnipper.webp', alt: 'Logo DataSnipper' } },
];

const CARTES_BANQUE_PAIEMENTS: readonly CarteDuDomaine[] = [
  { id: 'qonto', nom: 'Qonto', editeur: 'Qonto SA', faitAvec: 'Rapproche un par un les mouvements et les pièces que l’outil comptable n’a pas appariés.', logo: { src: '/logos/qonto.svg', alt: 'Logo Qonto' } },
  { id: 'shine', nom: 'Shine', editeur: 'Shine France SAS', faitAvec: 'Rapproche un par un les mouvements et les pièces que l’outil comptable n’a pas appariés.', logo: { src: '/logos/shine.svg', alt: 'Logo Shine' } },
  { id: 'revolut-business', nom: 'Revolut Business', editeur: 'Revolut', faitAvec: 'Lit les relevés multidevises et les rapproche des pièces, change compris. Un mouvement sans pièce est présenté.', logo: { src: '/logos/revolut-business.svg', alt: 'Logo Revolut Business' } },
  { id: 'wise-business', nom: 'Wise Business', editeur: 'Wise', faitAvec: 'Lit les relevés multidevises et les rapproche des pièces, change compris. Un mouvement sans pièce est présenté.', logo: { src: '/logos/wise-business.webp', alt: 'Logo Wise Business' } },
  { id: 'memo-bank', nom: 'Memo Bank', editeur: 'Memo Bank', faitAvec: 'Lit les relevés et les rapproche des pièces. Un mouvement sans candidat est présenté avec sa date et son montant.', logo: { src: '/logos/memo-bank.svg', alt: 'Logo Memo Bank' } },
  { id: 'manager-one', nom: 'Manager.one', editeur: 'SaGa Corp, avec la Banque Wormser Frères', faitAvec: 'Rapproche un par un les mouvements et les pièces que l’outil comptable n’a pas appariés.', logo: { src: '/logos/manager-one.svg', alt: 'Logo Manager.one' } },
  { id: 'bnp-paribas', nom: 'BNP Paribas', editeur: 'BNP Paribas', faitAvec: 'Lit les relevés exportés de l’espace professionnel et les rapproche des pièces. Un mouvement sans candidat est présenté.', logo: { src: '/logos/bnp-paribas.webp', alt: 'Logo BNP Paribas' } },
  { id: 'sg-societe-generale', nom: 'SG (Société Générale)', editeur: 'Société Générale', faitAvec: 'Lit les relevés exportés de l’espace professionnel et les rapproche des pièces. Un mouvement sans candidat est présenté.', logo: { src: '/logos/sg-societe-generale.webp', alt: 'Logo SG (Société Générale)' } },
  { id: 'credit-agricole', nom: 'Crédit Agricole', editeur: 'Crédit Agricole', faitAvec: 'Lit les relevés exportés de l’espace professionnel et les rapproche des pièces. Un mouvement sans candidat est présenté.', logo: { src: '/logos/credit-agricole.svg', alt: 'Logo Crédit Agricole' } },
  { id: 'lcl', nom: 'LCL', editeur: 'Crédit Lyonnais', faitAvec: 'Lit les relevés exportés de l’espace professionnel et les rapproche des pièces. Un mouvement sans candidat est présenté.', logo: { src: '/logos/lcl.webp', alt: 'Logo LCL' } },
  { id: 'banque-populaire', nom: 'Banque Populaire', editeur: 'BPCE', faitAvec: 'Lit les relevés exportés de l’espace professionnel et les rapproche des pièces. Un mouvement sans candidat est présenté.', logo: { src: '/logos/banque-populaire.webp', alt: 'Logo Banque Populaire' } },
  { id: 'caisse-d-epargne', nom: 'Caisse d’Epargne', editeur: 'BPCE', faitAvec: 'Lit les relevés exportés de l’espace professionnel et les rapproche des pièces. Un mouvement sans candidat est présenté.', logo: { src: '/logos/caisse-d-epargne.webp', alt: 'Logo Caisse d’Epargne' } },
  { id: 'credit-mutuel', nom: 'Crédit Mutuel', editeur: 'Crédit Mutuel', faitAvec: 'Lit les relevés exportés de l’espace professionnel et les rapproche des pièces. Un mouvement sans candidat est présenté.', logo: { src: '/logos/credit-mutuel.svg', alt: 'Logo Crédit Mutuel' } },
  { id: 'cic', nom: 'CIC', editeur: 'CIC', faitAvec: 'Lit les relevés exportés de l’espace professionnel et les rapproche des pièces. Un mouvement sans candidat est présenté.', logo: { src: '/logos/cic.svg', alt: 'Logo CIC' } },
  { id: 'la-banque-postale', nom: 'La Banque Postale', editeur: 'La Banque Postale', faitAvec: 'Lit les relevés exportés de l’espace professionnel et les rapproche des pièces. Un mouvement sans candidat est présenté.', logo: { src: '/logos/la-banque-postale.svg', alt: 'Logo La Banque Postale' } },
  { id: 'boursobank', nom: 'BoursoBank', editeur: 'Boursorama', faitAvec: 'Lit les relevés exportés de l’espace professionnel et les rapproche des pièces. Un mouvement sans candidat est présenté.', logo: { src: '/logos/boursobank.webp', alt: 'Logo BoursoBank' } },
  { id: 'american-express', nom: 'American Express', editeur: 'American Express', faitAvec: 'Rapproche les relevés de carte des notes de frais et des factures, et réclame en le nommant le justificatif manquant.', logo: { src: '/logos/american-express.svg', alt: 'Logo American Express' } },
  { id: 'bridge', nom: 'Bridge', editeur: 'Perspecteev SAS', faitAvec: 'Lit les relevés agrégés pour rapprocher les mouvements des pièces, sans aucune opération sur le compte.', logo: { src: '/logos/bridge.svg', alt: 'Logo Bridge' } },
  { id: 'powens', nom: 'Powens', editeur: 'Powens SAS', faitAvec: 'Lit les relevés agrégés pour rapprocher les mouvements des pièces, sans aucune opération sur le compte.', logo: { src: '/logos/powens.webp', alt: 'Logo Powens' } },
  { id: 'gocardless', nom: 'GoCardless', editeur: 'GoCardless', faitAvec: 'Rapproche des factures les encaissements par prélèvement, et relève chaque rejet avec son motif.', logo: { src: '/logos/gocardless.svg', alt: 'Logo GoCardless' } },
  { id: 'stripe', nom: 'Stripe', editeur: 'Stripe', faitAvec: 'Rapproche des ventes les versements et les frais, et ventile la commission en écriture.', logo: { src: '/logos/stripe.svg', alt: 'Logo Stripe' } },
  { id: 'paypal', nom: 'PayPal', editeur: 'PayPal', faitAvec: 'Rapproche des ventes les versements et les frais, et ventile la commission en écriture.', logo: { src: '/logos/paypal.webp', alt: 'Logo PayPal' } },
  { id: 'adyen', nom: 'Adyen', editeur: 'Adyen', faitAvec: 'Rapproche des ventes les versements et les frais, et ventile la commission en écriture.', logo: { src: '/logos/adyen.svg', alt: 'Logo Adyen' } },
  { id: 'mollie', nom: 'Mollie', editeur: 'Mollie B.V.', faitAvec: 'Rapproche des ventes les versements et les frais, et ventile la commission en écriture.', logo: { src: '/logos/mollie.webp', alt: 'Logo Mollie' } },
  { id: 'klarna', nom: 'Klarna', editeur: 'Klarna', faitAvec: 'Rapproche des commandes et des frais les versements du paiement fractionné.', logo: { src: '/logos/klarna.svg', alt: 'Logo Klarna' } },
  { id: 'alma', nom: 'Alma', editeur: 'Alma SAS', faitAvec: 'Rapproche des commandes et des frais les versements du paiement fractionné.', logo: { src: '/logos/alma.svg', alt: 'Logo Alma' } },
  { id: 'payplug', nom: 'Payplug', editeur: 'Payplug Enterprise', faitAvec: 'Rapproche des ventes les versements et les frais, et ventile la commission en écriture.', logo: { src: '/logos/payplug.svg', alt: 'Logo Payplug' } },
  { id: 'libeo', nom: 'Libeo', editeur: 'LIBEO SAS', faitAvec: 'Rapproche les factures fournisseurs payées de leurs règlements et de leurs pièces. Le paiement reste votre geste.', logo: { src: '/logos/libeo.webp', alt: 'Logo Libeo' } },
  { id: 'spendesk', nom: 'Spendesk', editeur: 'Spendesk SAS', faitAvec: 'Rapproche les dépenses par carte de leurs justificatifs, et réclame en le nommant le reçu manquant.', logo: { src: '/logos/spendesk.svg', alt: 'Logo Spendesk' } },
  { id: 'mooncard', nom: 'Mooncard', editeur: 'Moongroup SAS', faitAvec: 'Rapproche les dépenses par carte de leurs justificatifs, et réclame en le nommant le reçu manquant.', logo: { src: '/logos/mooncard.svg', alt: 'Logo Mooncard' } },
];

const CARTES_GED_DOSSIER_PERMANENT: readonly CarteDuDomaine[] = [
  { id: 'microsoft-sharepoint', nom: 'Microsoft SharePoint', editeur: 'Microsoft', faitAvec: 'Lit les pièces déposées, les renomme selon la règle du cabinet et les range dans son arborescence.', logo: { src: '/logos/microsoft-sharepoint.svg', alt: 'Logo Microsoft SharePoint' } },
  { id: 'microsoft-onedrive', nom: 'Microsoft OneDrive', editeur: 'Microsoft', faitAvec: 'Lit les pièces déposées, les renomme selon la règle du cabinet et les range dans son arborescence.', logo: { src: '/logos/microsoft-onedrive.svg', alt: 'Logo Microsoft OneDrive' } },
  { id: 'google-drive', nom: 'Google Drive', editeur: 'Google', faitAvec: 'Lit les pièces déposées, les renomme selon la règle du cabinet et les range dans son arborescence.', logo: { src: '/logos/google-drive.svg', alt: 'Logo Google Drive' } },
  { id: 'dropbox', nom: 'Dropbox', editeur: 'Dropbox, Inc.', faitAvec: 'Lit les pièces déposées, les renomme selon la règle du cabinet et les range dans son arborescence.', logo: { src: '/logos/dropbox.svg', alt: 'Logo Dropbox' } },
  { id: 'zeendoc', nom: 'Zeendoc', editeur: 'SAGES Informatique', faitAvec: 'Reprend dans le dossier du client les documents indexés, et signale la pièce qui manque au dossier permanent.', logo: { src: '/logos/zeendoc.svg', alt: 'Logo Zeendoc' } },
  { id: 'welyb', nom: 'Welyb', editeur: 'Welyb SAS', faitAvec: 'Range dans le bon dossier les pièces que vos clients déposent sur le portail, et réclame en la nommant la pièce manquante.', logo: { src: '/logos/welyb.svg', alt: 'Logo Welyb' } },
  { id: 'mycompanyfiles', nom: 'MyCompanyFiles', editeur: 'MyCompanyFiles SAS', faitAvec: 'Range dans le bon dossier les pièces que vos clients déposent sur le portail, et réclame en la nommant la pièce manquante.', logo: { src: '/logos/mycompanyfiles.webp', alt: 'Logo MyCompanyFiles' } },
  { id: 'portail-collaboratif-cegid', nom: 'Portail collaboratif Cegid', editeur: 'Cegid', faitAvec: 'Range dans le bon dossier les pièces que vos clients déposent sur le portail, et réclame en la nommant la pièce manquante.', logo: { src: '/logos/portail-collaboratif-cegid.svg', alt: 'Logo Cegid' } },
  { id: 'i-suite-expert', nom: 'i-Suite Expert', editeur: 'ACD', faitAvec: 'Range dans le bon dossier les pièces que vos clients déposent sur le portail, et réclame en la nommant la pièce manquante.', logo: { src: '/logos/i-suite-expert.webp', alt: 'Logo ACD' } },
  { id: 'acd-ged', nom: 'ACD GED', editeur: 'ACD', faitAvec: 'Reprend dans le dossier du client les documents indexés, et signale la pièce qui manque au dossier permanent.', logo: { src: '/logos/acd-ged.webp', alt: 'Logo ACD' } },
  { id: 'konnex-one', nom: 'Konnex One', editeur: 'Elips Solution SAS', faitAvec: 'Range dans le bon dossier les pièces que vos clients déposent sur le portail, et réclame en la nommant la pièce manquante.', logo: { src: '/logos/konnex-one.svg', alt: 'Logo Konnex One' } },
  { id: 'visiativ-document-experts-comptables', nom: 'Visiativ Document Experts-Comptables', editeur: 'Visiativ SA', faitAvec: 'Reprend dans le dossier du client les documents indexés, et signale la pièce qui manque au dossier permanent.', logo: { src: '/logos/visiativ-document-experts-comptables.svg', alt: 'Logo Visiativ Document Experts-Comptables' } },
  { id: 'illinks-ged-premium-expert', nom: 'illinks GED Premium Expert', editeur: 'ILLINKS SAS', faitAvec: 'Reprend dans le dossier du client les documents indexés, et signale la pièce qui manque au dossier permanent.', logo: { src: '/logos/illinks-ged-premium-expert.webp', alt: 'Logo illinks GED Premium Expert' } },
  { id: 'docuware', nom: 'DocuWare', editeur: 'DocuWare', faitAvec: 'Reprend dans le dossier du client les documents indexés, et signale la pièce qui manque au dossier permanent.', logo: { src: '/logos/docuware.webp', alt: 'Logo DocuWare' } },
  { id: 'open-bee', nom: 'Open Bee', editeur: 'OPEN BEE', faitAvec: 'Reprend dans le dossier du client les documents indexés, et signale la pièce qui manque au dossier permanent.', logo: { src: '/logos/open-bee.svg', alt: 'Logo Open Bee' } },
  { id: 'everial', nom: 'Everial', editeur: 'Everial', faitAvec: 'Reprend dans le dossier les documents numérisés et archivés, avec leur référence d’archive.', logo: { src: '/logos/everial.svg', alt: 'Logo Everial' } },
  { id: 'arkhineo', nom: 'Arkhineo', editeur: 'Docaposte Arkhineo SAS', faitAvec: 'Prépare et indexe les pièces à archiver. Le versement dans le coffre se fait après validation.', logo: { src: '/logos/arkhineo.webp', alt: 'Logo Arkhineo' } },
  { id: 'cecurity-com', nom: 'Cecurity.com', editeur: 'Cecurity.com SA', faitAvec: 'Prépare et indexe les bulletins et les documents à conserver. Le versement dans le coffre se fait après validation.', logo: { src: '/logos/cecurity-com.webp', alt: 'Logo Cecurity.com' } },
  { id: 'digiposte', nom: 'Digiposte', editeur: 'La Poste', faitAvec: 'Prépare les bulletins pour le coffre-fort des salariés. La distribution part après validation du gestionnaire.', logo: { src: '/logos/digiposte.svg', alt: 'Logo Digiposte' } },
  { id: 'kdrive', nom: 'kDrive', editeur: 'Infomaniak Network SA', faitAvec: 'Lit les pièces déposées, les renomme selon la règle du cabinet et les range dans son arborescence.', logo: { src: '/logos/kdrive.svg', alt: 'Logo kDrive' } },
  { id: 'nextcloud', nom: 'Nextcloud', editeur: 'Nextcloud GmbH', faitAvec: 'Lit les pièces déposées, les renomme selon la règle du cabinet et les range dans son arborescence.', logo: { src: '/logos/nextcloud.svg', alt: 'Logo Nextcloud' } },
];

const CARTES_SIGNATURE_ELECTRONIQUE: readonly CarteDuDomaine[] = [
  { id: 'youtrust', nom: 'Youtrust', editeur: 'Youtrust', faitAvec: 'Prépare la lettre de mission et les documents à signer, puis suit leur retour. L’envoi part quand l’associé l’a validé.', logo: { src: '/logos/youtrust.svg', alt: 'Logo Youtrust' } },
  { id: 'docusign', nom: 'Docusign', editeur: 'Docusign, Inc.', faitAvec: 'Prépare la lettre de mission et les documents à signer, puis suit leur retour. L’envoi part quand l’associé l’a validé.', logo: { src: '/logos/docusign.svg', alt: 'Logo Docusign' } },
  { id: 'jesignexpert-com', nom: 'jesignexpert.com', editeur: 'ECMA', faitAvec: 'Prépare la lettre de mission et les documents à signer, puis suit leur retour. L’envoi part quand l’associé l’a validé.', logo: { src: '/logos/jesignexpert-com.svg', alt: 'Logo ECMA' } },
  { id: 'universign', nom: 'Universign', editeur: 'Signaturit Group', faitAvec: 'Prépare la lettre de mission et les documents à signer, puis suit leur retour. L’envoi part quand l’associé l’a validé.', logo: { src: '/logos/universign.svg', alt: 'Logo Universign' } },
  { id: 'signaturit', nom: 'Signaturit', editeur: 'Signaturit Group', faitAvec: 'Prépare la lettre de mission et les documents à signer, puis suit leur retour. L’envoi part quand l’associé l’a validé.', logo: { src: '/logos/signaturit.svg', alt: 'Logo Signaturit' } },
  { id: 'acrobat-sign', nom: 'Acrobat Sign', editeur: 'Adobe', faitAvec: 'Prépare la lettre de mission et les documents à signer, puis suit leur retour. L’envoi part quand l’associé l’a validé.', logo: { src: '/logos/acrobat-sign.svg', alt: 'Logo Adobe' } },
  { id: 'goodflag', nom: 'Goodflag', editeur: 'Lex Persona SAS', faitAvec: 'Prépare la lettre de mission et les documents à signer, puis suit leur retour. L’envoi part quand l’associé l’a validé.', logo: { src: '/logos/goodflag.svg', alt: 'Logo Goodflag' } },
  { id: 'signature-electronique-docaposte', nom: 'Signature électronique Docaposte', editeur: 'Docaposte', faitAvec: 'Prépare la lettre de mission et les documents à signer, puis suit leur retour. L’envoi part quand l’associé l’a validé.', logo: { src: '/logos/signature-electronique-docaposte.svg', alt: 'Logo Signature électronique Docaposte' } },
  { id: 'oodrive-sign', nom: 'Oodrive Sign', editeur: 'Oodrive SAS', faitAvec: 'Prépare la lettre de mission et les documents à signer, puis suit leur retour. L’envoi part quand l’associé l’a validé.', logo: { src: '/logos/oodrive-sign.svg', alt: 'Logo Oodrive Sign' } },
  { id: 'acd-sign', nom: 'ACD Sign', editeur: 'ACD', faitAvec: 'Prépare la lettre de mission et les documents à signer, puis suit leur retour. L’envoi part quand l’associé l’a validé.', logo: { src: '/logos/acd-sign.webp', alt: 'Logo ACD' } },
];

const CARTES_MESSAGERIE_AGENDA: readonly CarteDuDomaine[] = [
  { id: 'microsoft-outlook', nom: 'Microsoft Outlook', editeur: 'Microsoft', faitAvec: 'Trie la boîte par dossier et par priorité, relie chaque message au bon client et prépare en brouillon les réponses types.', logo: { src: '/logos/microsoft-outlook.svg', alt: 'Logo Microsoft Outlook' } },
  { id: 'microsoft-teams', nom: 'Microsoft Teams', editeur: 'Microsoft', faitAvec: 'Relie au dossier les demandes reçues dans les canaux du cabinet, et prépare la réponse pour le collaborateur.', logo: { src: '/logos/microsoft-teams.svg', alt: 'Logo Microsoft Teams' } },
  { id: 'gmail', nom: 'Gmail', editeur: 'Google', faitAvec: 'Trie la boîte par dossier et par priorité, relie chaque message au bon client et prépare en brouillon les réponses types.', logo: { src: '/logos/gmail.svg', alt: 'Logo Gmail' } },
  { id: 'google-agenda', nom: 'Google Agenda', editeur: 'Google', faitAvec: 'Propose les rendez-vous dans les créneaux libres et prépare l’invitation. Elle part après validation.', logo: { src: '/logos/google-agenda.svg', alt: 'Logo Google Agenda' } },
  { id: 'google-chat', nom: 'Google Chat', editeur: 'Google', faitAvec: 'Relie au dossier les demandes reçues dans les canaux du cabinet, et prépare la réponse pour le collaborateur.', logo: { src: '/logos/google-chat.svg', alt: 'Logo Google Chat' } },
  { id: 'google-meet', nom: 'Google Meet', editeur: 'Google', faitAvec: 'Prépare l’ordre du jour et le compte rendu à partir du dossier. Ils sont relus avant l’envoi.', logo: { src: '/logos/google-meet.svg', alt: 'Logo Google Meet' } },
  { id: 'zoom', nom: 'Zoom', editeur: 'Zoom Communications, Inc.', faitAvec: 'Prépare l’ordre du jour et le compte rendu à partir du dossier. Ils sont relus avant l’envoi.', logo: { src: '/logos/zoom.webp', alt: 'Logo Zoom' } },
  { id: 'slack', nom: 'Slack', editeur: 'Slack', faitAvec: 'Relie au dossier les demandes reçues dans les canaux du cabinet, et prépare la réponse pour le collaborateur.', logo: { src: '/logos/slack.webp', alt: 'Logo Slack' } },
  { id: 'whatsapp-business', nom: 'WhatsApp Business', editeur: 'WhatsApp', faitAvec: 'Relie au dossier les messages de vos clients et prépare les réponses types.', logo: { src: '/logos/whatsapp-business.webp', alt: 'Logo WhatsApp Business' } },
  { id: 'linkedin', nom: 'LinkedIn', editeur: 'LinkedIn', faitAvec: 'Prépare pour relecture les publications du cabinet (Colette), et relève les factures LinkedIn Ads pour la comptabilité.', logo: { src: '/logos/linkedin.webp', alt: 'Logo LinkedIn' } },
  { id: 'ar24', nom: 'AR24', editeur: 'AR24 SAS', faitAvec: 'Prépare la lettre recommandée avec ses pièces et son destinataire. L’envoi part après validation, l’accusé est rangé au dossier.', logo: { src: '/logos/ar24.svg', alt: 'Logo AR24' } },
  { id: 'maileva', nom: 'Maileva', editeur: 'Maileva SAS', faitAvec: 'Prépare la lettre recommandée avec ses pièces et son destinataire. L’envoi part après validation, l’accusé est rangé au dossier.', logo: { src: '/logos/maileva.webp', alt: 'Logo Maileva' } },
  { id: 'merci-facteur', nom: 'Merci Facteur', editeur: 'BOURDET SARL', faitAvec: 'Prépare la lettre recommandée avec ses pièces et son destinataire. L’envoi part après validation, l’accusé est rangé au dossier.', logo: { src: '/logos/merci-facteur.svg', alt: 'Logo Merci Facteur' } },
  { id: 'calendly', nom: 'Calendly', editeur: 'Calendly', faitAvec: 'Relie au dossier du client les rendez-vous pris, et rassemble ce qu’il faut pour les préparer.', logo: { src: '/logos/calendly.svg', alt: 'Logo Calendly' } },
  { id: 'cal-com', nom: 'Cal.com', editeur: 'Cal.com, Inc.', faitAvec: 'Relie au dossier du client les rendez-vous pris, et rassemble ce qu’il faut pour les préparer.', logo: { src: '/logos/cal-com.webp', alt: 'Logo Cal.com' } },
  { id: 'aircall', nom: 'Aircall', editeur: 'Aircall', faitAvec: 'Relie au dossier les appels reçus, et prépare la note d’appel et le rappel pour le collaborateur.', logo: { src: '/logos/aircall.svg', alt: 'Logo Aircall' } },
  { id: 'ringover', nom: 'Ringover', editeur: 'Ringover', faitAvec: 'Relie au dossier les appels reçus, et prépare la note d’appel et le rappel pour le collaborateur.', logo: { src: '/logos/ringover.svg', alt: 'Logo Ringover' } },
  { id: 'brevo', nom: 'Brevo', editeur: 'Sendinblue SAS', faitAvec: 'Rédige la lettre d’information à partir de l’actualité que vous avez retenue, et la prépare dans l’outil pour relecture avant l’envoi.', logo: { src: '/logos/brevo.svg', alt: 'Logo Brevo' } },
  { id: 'mailchimp', nom: 'Mailchimp', editeur: 'Intuit', faitAvec: 'Rédige la lettre d’information à partir de l’actualité que vous avez retenue, et la prépare dans l’outil pour relecture avant l’envoi.', logo: { src: '/logos/mailchimp.webp', alt: 'Logo Mailchimp' } },
];

const CARTES_BUREAUTIQUE_CLASSEURS: readonly CarteDuDomaine[] = [
  { id: 'microsoft-excel', nom: 'Microsoft Excel', editeur: 'Microsoft', faitAvec: 'Lit les exports et écrit dans le classeur ce que la règle prévoit. Les formules et les saisies restent intactes, chaque écriture est tracée.', logo: { src: '/logos/microsoft-excel.svg', alt: 'Logo Microsoft Excel' } },
  { id: 'microsoft-word', nom: 'Microsoft Word', editeur: 'Microsoft', faitAvec: 'Prépare sur vos modèles les lettres de mission, les courriers et les procès-verbaux, relus avant l’envoi.', logo: { src: '/logos/microsoft-word.svg', alt: 'Logo Microsoft Word' } },
  { id: 'microsoft-powerpoint', nom: 'Microsoft PowerPoint', editeur: 'Microsoft', faitAvec: 'Prépare la plaquette ou la présentation des comptes à partir de la comptabilité tenue, relue avant la remise.', logo: { src: '/logos/microsoft-powerpoint.svg', alt: 'Logo Microsoft PowerPoint' } },
  { id: 'google-sheets', nom: 'Google Sheets', editeur: 'Google', faitAvec: 'Lit les exports et écrit dans le classeur ce que la règle prévoit. Les formules et les saisies restent intactes, chaque écriture est tracée.', logo: { src: '/logos/google-sheets.svg', alt: 'Logo Google Sheets' } },
  { id: 'google-docs', nom: 'Google Docs', editeur: 'Google', faitAvec: 'Prépare sur vos modèles les lettres de mission, les courriers et les procès-verbaux, relus avant l’envoi.', logo: { src: '/logos/google-docs.svg', alt: 'Logo Google Docs' } },
  { id: 'libreoffice', nom: 'LibreOffice', editeur: 'The Document Foundation', faitAvec: 'Lit les exports et écrit dans les classeurs .ods, dont le modèle de registre de la CNIL, ce que la règle prévoit ; les formules et les saisies restent intactes. Prépare aussi vos courriers sur vos modèles, relus avant l’envoi.', logo: { src: '/logos/libreoffice.svg', alt: 'Logo LibreOffice' } },
  { id: 'adobe-acrobat', nom: 'Adobe Acrobat', editeur: 'Adobe', faitAvec: 'Lit les PDF reçus, les découpe et les renomme selon la règle du cabinet. Une pièce illisible est arrêtée et nommée.', logo: { src: '/logos/adobe-acrobat.svg', alt: 'Logo Adobe' } },
  { id: 'notion', nom: 'Notion', editeur: 'Notion Labs', faitAvec: 'Écrit et tient à jour la règle de chaque tâche, consultable par toute l’équipe.', logo: { src: '/logos/notion.svg', alt: 'Logo Notion' } },
  { id: 'airtable', nom: 'Airtable', editeur: 'Airtable', faitAvec: 'Met à jour, à partir des exports, les suivis tenus en base. Chaque modification est tracée.', logo: { src: '/logos/airtable.svg', alt: 'Logo Airtable' } },
];

const CARTES_CAISSE_E_COMMERCE: readonly CarteDuDomaine[] = [
  { id: 'shopify', nom: 'Shopify', editeur: 'Shopify Inc.', faitAvec: 'Lit les ventes, les remboursements et les versements, et les prépare en écritures au format que le cabinet importe.', logo: { src: '/logos/shopify.svg', alt: 'Logo Shopify' } },
  { id: 'woocommerce', nom: 'WooCommerce', editeur: 'Automattic', faitAvec: 'Lit les ventes, les remboursements et les versements, et les prépare en écritures au format que le cabinet importe.', logo: { src: '/logos/woocommerce.svg', alt: 'Logo WooCommerce' } },
  { id: 'prestashop', nom: 'PrestaShop', editeur: 'PrestaShop SA', faitAvec: 'Remet l’export comptable au format d’import du cabinet (caractères, décimales, comptes étrangers).', logo: { src: '/logos/prestashop.svg', alt: 'Logo PrestaShop' } },
  { id: 'adobe-commerce', nom: 'Adobe Commerce', editeur: 'Adobe', faitAvec: 'Lit les ventes, les remboursements et les versements, et les prépare en écritures au format que le cabinet importe.', logo: { src: '/logos/adobe-commerce.svg', alt: 'Logo Adobe' } },
  { id: 'wix-ecommerce', nom: 'Wix eCommerce', editeur: 'Wix.com', faitAvec: 'Lit les ventes, les remboursements et les versements, et les prépare en écritures au format que le cabinet importe.', logo: { src: '/logos/wix-ecommerce.svg', alt: 'Logo Wix eCommerce' } },
  { id: 'wizishop', nom: 'WiziShop', editeur: 'WiziShop SAS', faitAvec: 'Lit les ventes, les remboursements et les versements, et les prépare en écritures au format que le cabinet importe.', logo: { src: '/logos/wizishop.webp', alt: 'Logo WiziShop' } },
  { id: 'ecwid-by-lightspeed', nom: 'Ecwid by Lightspeed', editeur: 'Ecwid', faitAvec: 'Lit les ventes, les remboursements et les versements, et les prépare en écritures au format que le cabinet importe.', logo: { src: '/logos/ecwid-by-lightspeed.webp', alt: 'Logo Ecwid by Lightspeed' } },
  { id: 'amazon-seller-central', nom: 'Amazon Seller Central', editeur: 'Amazon', faitAvec: 'Ventile en écritures les ventes, les commissions et les frais des rapports de versement.', logo: { src: '/logos/amazon-seller-central.webp', alt: 'Logo Amazon' } },
  { id: 'ebay', nom: 'eBay', editeur: 'eBay Inc.', faitAvec: 'Ventile en écritures les ventes, les commissions et les frais des rapports de versement.', logo: { src: '/logos/ebay.svg', alt: 'Logo eBay' } },
  { id: 'etsy', nom: 'Etsy', editeur: 'Etsy, Inc.', faitAvec: 'Ventile en écritures les ventes, les commissions et les frais des rapports de versement.', logo: { src: '/logos/etsy.svg', alt: 'Logo Etsy' } },
  { id: 'cdiscount-marketplace', nom: 'Cdiscount Marketplace', editeur: 'Cdiscount', faitAvec: 'Ventile en écritures les ventes, les commissions et les frais des rapports de versement.', logo: { src: '/logos/cdiscount-marketplace.webp', alt: 'Logo Cdiscount Marketplace' } },
  { id: 'manomano', nom: 'ManoMano', editeur: 'ManoMano', faitAvec: 'Ventile en écritures les ventes, les commissions et les frais des rapports de versement.', logo: { src: '/logos/manomano.svg', alt: 'Logo ManoMano' } },
  { id: 'vinted-pro', nom: 'Vinted Pro', editeur: 'Vinted', faitAvec: 'Ventile en écritures les ventes, les commissions et les frais des rapports de versement.', logo: { src: '/logos/vinted-pro.svg', alt: 'Logo Vinted Pro' } },
  { id: 'sumup', nom: 'SumUp', editeur: 'SumUp', faitAvec: 'Rapproche les encaissements par carte et les versements des ventes du jour, et ventile les commissions.', logo: { src: '/logos/sumup.svg', alt: 'Logo SumUp' } },
  { id: 'square', nom: 'Square', editeur: 'Block, Inc.', faitAvec: 'Rapproche les encaissements par carte et les versements des ventes du jour, et ventile les commissions.', logo: { src: '/logos/square.svg', alt: 'Logo Square' } },
  { id: 'zettle-by-paypal', nom: 'Zettle by PayPal', editeur: 'PayPal', faitAvec: 'Rapproche les encaissements par carte et les versements des ventes du jour, et ventile les commissions.', logo: { src: '/logos/zettle-by-paypal.svg', alt: 'Logo Zettle by PayPal' } },
  { id: 'lightspeed', nom: 'Lightspeed', editeur: 'Lightspeed Commerce', faitAvec: 'Lit les clôtures de caisse et les met en écritures (ventes par taux de TVA, modes de règlement). Un écart de caisse est présenté.', logo: { src: '/logos/lightspeed.svg', alt: 'Logo Lightspeed' } },
  { id: 'sumup-pos-pro', nom: 'SumUp POS Pro', editeur: 'Tiller Systems SAS', faitAvec: 'Lit les clôtures de caisse et les met en écritures (ventes par taux de TVA, modes de règlement). Un écart de caisse est présenté.', logo: { src: '/logos/sumup-pos-pro.webp', alt: 'Logo SumUp POS Pro' } },
  { id: 'zelty', nom: 'Zelty', editeur: 'Zelty', faitAvec: 'Lit les clôtures de caisse et les met en écritures (ventes par taux de TVA, modes de règlement). Un écart de caisse est présenté.', logo: { src: '/logos/zelty.svg', alt: 'Logo Zelty' } },
  { id: 'l-addition', nom: 'L’Addition', editeur: 'ADSTELLAM SAS', faitAvec: 'Lit les clôtures de caisse et les met en écritures (ventes par taux de TVA, modes de règlement). Un écart de caisse est présenté.', logo: { src: '/logos/l-addition.svg', alt: 'Logo L’Addition' } },
  { id: 'popina', nom: 'Popina', editeur: 'JDC SA', faitAvec: 'Lit les clôtures de caisse et les met en écritures (ventes par taux de TVA, modes de règlement). Un écart de caisse est présenté.', logo: { src: '/logos/popina.webp', alt: 'Logo Popina' } },
  { id: 'hiboutik', nom: 'Hiboutik', editeur: 'Hiboutik', faitAvec: 'Lit les clôtures de caisse et les met en écritures (ventes par taux de TVA, modes de règlement). Un écart de caisse est présenté.', logo: { src: '/logos/hiboutik.webp', alt: 'Logo Hiboutik' } },
  { id: 'innovorder', nom: 'Innovorder', editeur: 'Innovorder SAS', faitAvec: 'Lit les clôtures de caisse et les met en écritures (ventes par taux de TVA, modes de règlement). Un écart de caisse est présenté.', logo: { src: '/logos/innovorder.svg', alt: 'Logo Innovorder' } },
  { id: 'cashpad', nom: 'Cashpad', editeur: 'CASHPAD SAS', faitAvec: 'Lit les clôtures de caisse et les met en écritures (ventes par taux de TVA, modes de règlement). Un écart de caisse est présenté.', logo: { src: '/logos/cashpad.svg', alt: 'Logo Cashpad' } },
  { id: 'cashmag', nom: 'CashMag', editeur: 'CASHMAG SAS', faitAvec: 'Lit les clôtures de caisse et les met en écritures (ventes par taux de TVA, modes de règlement). Un écart de caisse est présenté.', logo: { src: '/logos/cashmag.webp', alt: 'Logo CashMag' } },
  { id: 'planity', nom: 'Planity', editeur: 'Planity', faitAvec: 'Met en écritures, au format que le cabinet importe, l’export comptable du mois clôturé (Excel, CSV).', logo: { src: '/logos/planity.svg', alt: 'Logo Planity' } },
  { id: 'treatwell', nom: 'Treatwell', editeur: 'Treatwell', faitAvec: 'Rapproche des encaissements du salon les réservations et les versements de la plateforme.', logo: { src: '/logos/treatwell.svg', alt: 'Logo Treatwell' } },
  { id: 'uber-eats', nom: 'Uber Eats', editeur: 'Uber', faitAvec: 'Ventile en écritures les ventes, les commissions et les frais de livraison des relevés de versement.', logo: { src: '/logos/uber-eats.svg', alt: 'Logo Uber Eats' } },
  { id: 'deliveroo', nom: 'Deliveroo', editeur: 'Deliveroo', faitAvec: 'Ventile en écritures les ventes, les commissions et les frais de livraison des relevés de versement.', logo: { src: '/logos/deliveroo.webp', alt: 'Logo Deliveroo' } },
  { id: 'airbnb', nom: 'Airbnb', editeur: 'Airbnb, Inc.', faitAvec: 'Relève les revenus et les frais des locations meublées pour la comptabilité, et prépare la déclaration LMNP pour relecture.', logo: { src: '/logos/airbnb.svg', alt: 'Logo Airbnb' } },
  { id: 'booking-com', nom: 'Booking.com', editeur: 'Booking.com', faitAvec: 'Relève les revenus et les frais des locations meublées pour la comptabilité, et prépare la déclaration LMNP pour relecture.', logo: { src: '/logos/booking-com.svg', alt: 'Logo Booking.com' } },
  { id: 'atoo-sync', nom: 'Atoo-Sync', editeur: 'ATOO NEXT SARL', faitAvec: 'Contrôle les flux synchronisés entre la boutique et la comptabilité : commande sans facture, paiement sans commande.', logo: { src: '/logos/atoo-sync.webp', alt: 'Logo Atoo-Sync' } },
];

const CARTES_GESTION_CABINET_CRM: readonly CarteDuDomaine[] = [
  { id: 'acd-gi', nom: 'ACD GI', editeur: 'ACD', faitAvec: 'Rapproche les actes et les temps du mois de la facturation, et facture une seule fois chaque acte hors forfait. La facture part après validation.', logo: { src: '/logos/acd-gi.webp', alt: 'Logo ACD' } },
  { id: 'cegid-loop-grm', nom: 'Cegid Loop GRM', editeur: 'Cegid', faitAvec: 'Rapproche les actes, les temps, les missions et le planning de la facturation, et facture une seule fois chaque acte hors forfait. La facture part après validation.', logo: { src: '/logos/cegid-loop-grm.svg', alt: 'Logo Cegid' } },
  { id: 'isagi-connect', nom: 'ISAGI CONNECT', editeur: 'AGIRIS', faitAvec: 'Rapproche les actes et les temps du mois de la facturation, et facture une seule fois chaque acte hors forfait. La facture part après validation.', logo: { src: '/logos/isagi-connect.svg', alt: 'Logo AGIRIS' } },
  { id: 'goproposal-by-sage', nom: 'GoProposal by Sage', editeur: 'Sage', faitAvec: 'Prépare la proposition et la lettre de mission à partir de vos barèmes écrits. Elles sont relues avant l’envoi.', logo: { src: '/logos/goproposal-by-sage.svg', alt: 'Logo Sage' } },
  { id: 'kanta', nom: 'Kanta', editeur: 'Kanta SAS', faitAvec: 'Réunit les pièces d’entrée en relation et prépare la lettre de mission. La vigilance LCB-FT et la décision restent au professionnel.', logo: { src: '/logos/kanta.svg', alt: 'Logo Kanta' } },
  { id: 'vigicab', nom: 'VigiCab', editeur: 'Legapass', faitAvec: 'Réunit par dossier les pièces de vigilance et suit leur échéance. L’appréciation du risque reste au professionnel.', logo: { src: '/logos/vigicab.webp', alt: 'Logo VigiCab' } },
  { id: 'lettre-de-mission', nom: 'Lettre de mission', editeur: 'RCA', faitAvec: 'Prépare la proposition et la lettre de mission à partir de vos barèmes écrits. Elles sont relues avant l’envoi.', logo: { src: '/logos/lettre-de-mission.svg', alt: 'Logo RCA' } },
  { id: 'tempolia', nom: 'Tempolia', editeur: 'Tempolia SAS', faitAvec: 'Rapproche les actes et les temps du mois de la facturation, et facture une seule fois chaque acte hors forfait. La facture part après validation.', logo: { src: '/logos/tempolia.svg', alt: 'Logo Tempolia' } },
  { id: 'devizen', nom: 'Devizen', editeur: 'Plus que pro SAS', faitAvec: 'Prépare la proposition et la lettre de mission à partir de vos barèmes écrits. Elles sont relues avant l’envoi.', logo: { src: '/logos/devizen.svg', alt: 'Logo Devizen' } },
  { id: 'akuiteo', nom: 'Akuiteo', editeur: 'Akuiteo SAS', faitAvec: 'Rapproche les actes et les temps du mois de la facturation, et facture une seule fois chaque acte hors forfait. La facture part après validation.', logo: { src: '/logos/akuiteo.svg', alt: 'Logo Akuiteo' } },
  { id: 'queoval-expert', nom: 'Queoval Expert', editeur: 'SAS Queoval', faitAvec: 'Rapproche les actes et les temps du mois de la facturation, et facture une seule fois chaque acte hors forfait. La facture part après validation.', logo: { src: '/logos/queoval-expert.svg', alt: 'Logo Queoval Expert' } },
  { id: 'icp-dec', nom: 'ICP.dec', editeur: 'ICP Logiciel SAS', faitAvec: 'Rapproche les actes et les temps du mois de la facturation, et facture une seule fois chaque acte hors forfait. La facture part après validation.', logo: { src: '/logos/icp-dec.webp', alt: 'Logo ICP.dec' } },
  { id: 'sofyx', nom: 'Sofyx', editeur: 'Sofyx SAS', faitAvec: 'Rapproche les actes et les temps du mois de la facturation, facture une seule fois chaque acte hors forfait et tient le suivi des prospects. La facture part après validation.', logo: { src: '/logos/sofyx.svg', alt: 'Logo Sofyx' } },
  { id: 'smartisi', nom: 'Smartisi', editeur: 'Smartisi', faitAvec: 'Tient à jour, sans doublon, les fiches clients et prospects à partir des données légales, et prépare la relance commerciale.', logo: { src: '/logos/smartisi.svg', alt: 'Logo Smartisi' } },
  { id: 'octovision', nom: 'OctoVision', editeur: 'Distribué par Sage', faitAvec: 'Tient à jour le suivi de production et les échéances du portefeuille, en agrégats et jamais par personne.', logo: { src: '/logos/octovision.webp', alt: 'Logo OctoVision' } },
  { id: 'followapp', nom: 'FollowApp', editeur: 'FollowApp', faitAvec: 'Tient à jour le suivi de production et les échéances du portefeuille, en agrégats et jamais par personne.', logo: null },
  { id: 'liasse-360', nom: 'Liasse 360', editeur: 'FIDATECH SAS', faitAvec: 'Analyse les liasses pour repérer les missions à proposer, et les présente à l’associé, qui décide.', logo: null },
  { id: 'compozz', nom: 'Compozz', editeur: 'Compozz', faitAvec: 'Tient à jour, à partir des sources du dossier, les données client partagées entre les pôles.', logo: { src: '/logos/compozz.svg', alt: 'Logo Compozz' } },
  { id: 'hubspot', nom: 'HubSpot', editeur: 'HubSpot, Inc.', faitAvec: 'Tient à jour les fiches des prospects et des clients, et prépare les relances. Rien ne part sans validation.', logo: { src: '/logos/hubspot.webp', alt: 'Logo HubSpot' } },
  { id: 'salesforce', nom: 'Salesforce', editeur: 'Salesforce, Inc.', faitAvec: 'Tient à jour les fiches des prospects et des clients, et prépare les relances. Rien ne part sans validation.', logo: { src: '/logos/salesforce.svg', alt: 'Logo Salesforce' } },
  { id: 'pipedrive', nom: 'Pipedrive', editeur: 'Pipedrive', faitAvec: 'Tient à jour les fiches des prospects et des clients, et prépare les relances. Rien ne part sans validation.', logo: { src: '/logos/pipedrive.webp', alt: 'Logo Pipedrive' } },
  { id: 'zoho-crm', nom: 'Zoho CRM', editeur: 'Zoho Corporation', faitAvec: 'Tient à jour les fiches des prospects et des clients, et prépare les relances. Rien ne part sans validation.', logo: { src: '/logos/zoho-crm.svg', alt: 'Logo Zoho CRM' } },
  { id: 'nocrm-io', nom: 'noCRM.io', editeur: 'Positive Group France', faitAvec: 'Tient à jour les fiches des prospects et des clients, et prépare les relances. Rien ne part sans validation.', logo: { src: '/logos/nocrm-io.svg', alt: 'Logo noCRM.io' } },
  { id: 'twenty', nom: 'Twenty', editeur: 'Twenty.com PBC', faitAvec: 'Tient à jour les fiches des prospects et des clients, et prépare les relances. Rien ne part sans validation.', logo: { src: '/logos/twenty.webp', alt: 'Logo Twenty' } },
  { id: 'trello', nom: 'Trello', editeur: 'Atlassian', faitAvec: 'Crée les tâches du portefeuille à partir des échéances, et les met à jour à chaque pièce reçue.', logo: { src: '/logos/trello.svg', alt: 'Logo Trello' } },
  { id: 'asana', nom: 'Asana', editeur: 'Asana, Inc.', faitAvec: 'Crée les tâches du portefeuille à partir des échéances, et les met à jour à chaque pièce reçue.', logo: { src: '/logos/asana.webp', alt: 'Logo Asana' } },
  { id: 'monday-com', nom: 'monday.com', editeur: 'monday.com Ltd.', faitAvec: 'Crée les tâches du portefeuille à partir des échéances, et les met à jour à chaque pièce reçue.', logo: { src: '/logos/monday-com.webp', alt: 'Logo monday.com' } },
  { id: 'clickup', nom: 'ClickUp', editeur: 'ClickUp', faitAvec: 'Crée les tâches du portefeuille à partir des échéances, et les met à jour à chaque pièce reçue.', logo: { src: '/logos/clickup.svg', alt: 'Logo ClickUp' } },
];

const CARTES_DONNEES_LEGALES: readonly CarteDuDomaine[] = [
  { id: 'impots-gouv-fr-espace-professionnel', nom: 'impots.gouv.fr, espace professionnel', editeur: 'DGFiP', faitAvec: 'Relève et relie au dossier les avis, les accusés de réception et les messages de l’espace professionnel.', logo: null, etat: true },
  { id: 'net-entreprises-fr', nom: 'net-entreprises.fr', editeur: 'GIP-MDS', faitAvec: 'Relève les comptes rendus et les retours DSN, et relie chacun au bulletin à reprendre. Le dépôt reste votre geste.', logo: { src: '/logos/net-entreprises-fr.webp', alt: 'Logo GIP-MDS' } },
  { id: 'urssaf', nom: 'Urssaf', editeur: 'Urssaf', faitAvec: 'Relève les échéanciers et les mises en demeure, les relie au dossier et à la paie, et prépare la réponse.', logo: { src: '/logos/urssaf.svg', alt: 'Logo Urssaf' } },
  { id: 'agirc-arrco', nom: 'Agirc-Arrco', editeur: 'Agirc-Arrco', faitAvec: 'Relève les retours de fiabilisation des DSN et relie chacun au salarié concerné.', logo: { src: '/logos/agirc-arrco.webp', alt: 'Logo Agirc-Arrco' } },
  { id: 'msa', nom: 'MSA', editeur: 'CCMSA', faitAvec: 'Relève les retours de fiabilisation des DSN des dossiers agricoles et relie chacun au salarié concerné.', logo: { src: '/logos/msa.svg', alt: 'Logo MSA' } },
  { id: 'registre-national-des-entreprises', nom: 'Registre national des entreprises', editeur: 'INPI', faitAvec: 'Lit la fiche RNE d’un client pour actualiser son dossier et signaler un changement. Aucune formalité n’est déposée.', logo: null },
  { id: 'guichet-unique-des-formalites-d-entreprises', nom: 'Guichet unique des formalités d’entreprises', editeur: 'INPI', faitAvec: 'Prépare et contrôle le dossier de formalité avant le dépôt. Le dépôt reste votre geste.', logo: null, etat: true },
  { id: 'infogreffe', nom: 'Infogreffe', editeur: 'Greffes des tribunaux de commerce', faitAvec: 'Relit l’extrait Kbis et les actes déposés pour tenir à jour le dossier permanent.', logo: { src: '/logos/infogreffe.webp', alt: 'Logo Infogreffe' } },
  { id: 'repertoire-sirene', nom: 'Répertoire Sirene', editeur: 'INSEE', faitAvec: 'Contrôle contre le répertoire l’identité, l’adresse et l’activité des dossiers, et signale tout écart.', logo: { src: '/logos/repertoire-sirene.svg', alt: 'Logo Répertoire Sirene' } },
  { id: 'bodacc', nom: 'BODACC', editeur: 'DILA', faitAvec: 'Rapproche les annonces du portefeuille, et prépare l’alerte pour l’associé référent.', logo: null },
  { id: 'annuaire-des-entreprises', nom: 'Annuaire des entreprises', editeur: 'DINUM', faitAvec: 'Réunit avant l’entrée en relation les informations publiques d’une entreprise.', logo: null, etat: true },
  { id: 'pappers', nom: 'Pappers', editeur: 'Pappers', faitAvec: 'Réunit avant l’entrée en relation les informations publiques d’une entreprise.', logo: { src: '/logos/pappers.webp', alt: 'Logo Pappers' } },
  { id: 'societe-com', nom: 'Societe.com', editeur: 'SOCIETE SAS', faitAvec: 'Réunit avant l’entrée en relation les informations publiques d’une entreprise.', logo: { src: '/logos/societe-com.webp', alt: 'Logo Societe.com' } },
  { id: 'chorus-pro', nom: 'Chorus Pro', editeur: 'AIFE', faitAvec: 'Suit jusqu’à leur mise en paiement les factures que vos clients adressent au secteur public. Le dépôt reste leur geste.', logo: null },
  { id: 'jedeclare-com', nom: 'jedeclare.com', editeur: 'ECMA', faitAvec: 'Relève les comptes rendus de dépôt EDI et les relie au dossier. Chaque rejet est présenté avec sa cause.', logo: { src: '/logos/jedeclare-com.svg', alt: 'Logo ECMA' } },
  { id: 'aspone-fr', nom: 'ASPOne.fr', editeur: 'TESSI Informatique', faitAvec: 'Relève les comptes rendus de dépôt EDI et les relie au dossier. Chaque rejet est présenté avec sa cause.', logo: { src: '/logos/aspone-fr.webp', alt: 'Logo ASPOne.fr' } },
  { id: 'douane-gouv-fr', nom: 'douane.gouv.fr', editeur: 'DGDDI', faitAvec: 'Prépare à partir de la comptabilité les déclarations d’échanges de biens et de services. Le cabinet les dépose.', logo: null, etat: true },
  { id: 'modele-de-registre-des-traitements', nom: 'Modèle de registre des traitements', editeur: 'CNIL', faitAvec: 'Prépare, dans le modèle de la CNIL, la mise à jour du registre des traitements que tient votre cabinet. Chaque ligne est préparée pour votre référent (Prudence).', logo: null },
];

const CARTES_FACTURES_FOURNISSEURS: readonly CarteDuDomaine[] = [
  { id: 'orange-pro', nom: 'Orange Pro', editeur: 'Orange', faitAvec: 'Relève dans l’espace client les factures des lignes et des abonnements, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/orange-pro.svg', alt: 'Logo Orange Pro' } },
  { id: 'sfr-business', nom: 'SFR Business', editeur: 'Altice France', faitAvec: 'Relève dans l’espace client les factures des lignes et des abonnements, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/sfr-business.svg', alt: 'Logo SFR Business' } },
  { id: 'bouygues-telecom-pro', nom: 'Bouygues Telecom Pro', editeur: 'Bouygues', faitAvec: 'Relève dans l’espace client les factures des lignes et des abonnements, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/bouygues-telecom-pro.webp', alt: 'Logo Bouygues Telecom Pro' } },
  { id: 'free-pro', nom: 'Free Pro', editeur: 'iliad', faitAvec: 'Relève dans l’espace client les factures des lignes et des abonnements, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/free-pro.svg', alt: 'Logo Free Pro' } },
  { id: 'edf-entreprises', nom: 'EDF Entreprises', editeur: 'EDF', faitAvec: 'Relève dans l’espace client les factures d’énergie, duplicatas des trois dernières années compris, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/edf-entreprises.svg', alt: 'Logo EDF Entreprises' } },
  { id: 'engie-pro', nom: 'ENGIE Pro', editeur: 'ENGIE', faitAvec: 'Relève dans l’espace client les factures d’énergie, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/engie-pro.webp', alt: 'Logo ENGIE Pro' } },
  { id: 'totalenergies', nom: 'TotalEnergies', editeur: 'TotalEnergies', faitAvec: 'Relève dans l’espace client les factures d’énergie, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/totalenergies.webp', alt: 'Logo TotalEnergies' } },
  { id: 'mobility-business-de-totalenergies', nom: 'Mobility Business de TotalEnergies', editeur: 'TotalEnergies', faitAvec: 'Relève dans l’espace client les factures de carburant, de recharge et de lavage, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/mobility-business-de-totalenergies.webp', alt: 'Logo Mobility Business de TotalEnergies' } },
  { id: 'shell-fleet-solutions', nom: 'Shell Fleet Solutions', editeur: 'Shell', faitAvec: 'Relève dans l’espace client les factures des cartes carburant, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/shell-fleet-solutions.svg', alt: 'Logo Shell Fleet Solutions' } },
  { id: 'veolia-eau', nom: 'Veolia Eau', editeur: 'Veolia', faitAvec: 'Relève dans l’espace client les factures d’eau, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/veolia-eau.webp', alt: 'Logo Veolia' } },
  { id: 'tout-sur-mon-eau', nom: 'Tout sur mon eau', editeur: 'SUEZ', faitAvec: 'Relève dans l’espace client les factures d’eau, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/tout-sur-mon-eau.svg', alt: 'Logo Tout sur mon eau' } },
  { id: 'saur', nom: 'Saur', editeur: 'Saur', faitAvec: 'Relève dans l’espace client les factures d’eau, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/saur.svg', alt: 'Logo Saur' } },
  { id: 'amazon-business', nom: 'Amazon Business', editeur: 'Amazon', faitAvec: 'Relève dans l’espace client les factures d’achats, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/amazon-business.webp', alt: 'Logo Amazon' } },
  { id: 'manutan', nom: 'Manutan', editeur: 'Manutan Group', faitAvec: 'Relève dans l’espace client les factures de fournitures, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/manutan.webp', alt: 'Logo Manutan' } },
  { id: 'bruneau', nom: 'Bruneau', editeur: 'Groupe Bruneau', faitAvec: 'Relève dans l’espace client les factures de fournitures, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/bruneau.webp', alt: 'Logo Bruneau' } },
  { id: 'lyreco', nom: 'Lyreco', editeur: 'Lyreco', faitAvec: 'Relève dans l’espace client les factures de fournitures, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/lyreco.webp', alt: 'Logo Lyreco' } },
  { id: 'bureau-vallee', nom: 'Bureau Vallée', editeur: 'Bureau Vallée', faitAvec: 'Relève dans l’espace client les factures de fournitures, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/bureau-vallee.svg', alt: 'Logo Bureau Vallée' } },
  { id: 'metro', nom: 'METRO', editeur: 'METRO France', faitAvec: 'Relève dans l’espace client les factures d’achats, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/metro.svg', alt: 'Logo METRO' } },
  { id: 'leroy-merlin-pro', nom: 'Leroy Merlin Pro', editeur: 'ADEO', faitAvec: 'Relève dans l’espace client les factures d’achats, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/leroy-merlin-pro.svg', alt: 'Logo Leroy Merlin' } },
  { id: 'la-poste-pro', nom: 'La Poste Pro', editeur: 'La Poste', faitAvec: 'Relève dans l’espace client les factures de courrier et de colis, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/la-poste-pro.svg', alt: 'Logo La Poste Pro' } },
  { id: 'chronopost', nom: 'Chronopost', editeur: 'La Poste', faitAvec: 'Relève dans l’espace client les factures de colis, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/chronopost.webp', alt: 'Logo Chronopost' } },
  { id: 'ups', nom: 'UPS', editeur: 'UPS', faitAvec: 'Relève dans l’espace client les factures de colis, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/ups.svg', alt: 'Logo UPS' } },
  { id: 'dhl-express', nom: 'DHL Express', editeur: 'DHL Group', faitAvec: 'Relève dans le portail MyBill les factures de colis, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/dhl-express.svg', alt: 'Logo DHL Express' } },
  { id: 'sncf-connect', nom: 'SNCF Connect', editeur: 'SNCF', faitAvec: 'Relève dans l’espace client les factures de déplacement, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/sncf-connect.svg', alt: 'Logo SNCF Connect' } },
  { id: 'air-france', nom: 'Air France', editeur: 'Air France-KLM', faitAvec: 'Relève dans l’espace client les factures de déplacement, les range au dossier et prépare la relance quand l’une manque.', logo: null },
  { id: 'uber-for-business', nom: 'Uber for Business', editeur: 'Uber', faitAvec: 'Relève dans l’espace client les factures de déplacement, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/uber-for-business.svg', alt: 'Logo Uber for Business' } },
  { id: 'booking-com-for-business', nom: 'Booking.com for Business', editeur: 'Booking Holdings', faitAvec: 'Relève dans l’espace client les factures d’hébergement, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/booking-com-for-business.svg', alt: 'Logo Booking.com for Business' } },
  { id: 'ulys', nom: 'Ulys', editeur: 'VINCI Autoroutes', faitAvec: 'Relève dans l’espace client les factures de télépéage, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/ulys.svg', alt: 'Logo Ulys' } },
  { id: 'bip-go', nom: 'Bip&Go', editeur: 'Sanef', faitAvec: 'Relève dans l’espace client les factures de télépéage, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/bip-go.svg', alt: 'Logo Bip&Go' } },
  { id: 'fulli', nom: 'Fulli', editeur: 'APRR', faitAvec: 'Relève dans l’espace client les factures de télépéage, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/fulli.svg', alt: 'Logo Fulli' } },
  { id: 'ayvens', nom: 'Ayvens', editeur: 'Société Générale', faitAvec: 'Relève dans l’espace client les factures de location longue durée, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/ayvens.webp', alt: 'Logo Ayvens' } },
  { id: 'google-ads', nom: 'Google Ads', editeur: 'Google', faitAvec: 'Relève dans l’espace client les factures de publicité, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/google-ads.svg', alt: 'Logo Google Ads' } },
  { id: 'publicites-meta', nom: 'Publicités Meta', editeur: 'Meta', faitAvec: 'Relève dans l’espace client les factures de publicité, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/publicites-meta.webp', alt: 'Logo Meta' } },
  { id: 'aws', nom: 'AWS', editeur: 'Amazon', faitAvec: 'Relève dans l’espace client les factures d’hébergement informatique, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/aws.webp', alt: 'Logo AWS' } },
  { id: 'ovhcloud', nom: 'OVHcloud', editeur: 'OVHcloud', faitAvec: 'Relève dans l’espace client les factures d’hébergement informatique, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/ovhcloud.webp', alt: 'Logo OVHcloud' } },
  { id: 'ionos', nom: 'IONOS', editeur: 'IONOS Group', faitAvec: 'Relève dans l’espace client les factures d’hébergement informatique, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/ionos.svg', alt: 'Logo IONOS' } },
  { id: 'apple', nom: 'Apple', editeur: 'Apple', faitAvec: 'Relève dans l’espace client les factures de matériel, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/apple.webp', alt: 'Logo Apple' } },
  { id: 'canva', nom: 'Canva', editeur: 'Canva', faitAvec: 'Relève dans l’espace client les factures d’abonnement, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/canva.webp', alt: 'Logo Canva' } },
  { id: 'indeed', nom: 'Indeed', editeur: 'Recruit', faitAvec: 'Relève dans l’espace client les factures des annonces d’emploi, les range au dossier et prépare la relance quand l’une manque.', logo: { src: '/logos/indeed.webp', alt: 'Logo Indeed' } },
];

const CARTES_PILOTAGE_TRESORERIE: readonly CarteDuDomaine[] = [
  { id: 'agicap', nom: 'Agicap', editeur: 'Agicap SAS', faitAvec: 'Rapproche de la comptabilité tenue les catégories de trésorerie, et explique les écarts entre le prévu et le réalisé.', logo: { src: '/logos/agicap.webp', alt: 'Logo Agicap' } },
  { id: 'okimia', nom: 'Okimia', editeur: 'Fygr SAS', faitAvec: 'Rapproche de la comptabilité tenue les catégories de trésorerie, et explique les écarts entre le prévu et le réalisé.', logo: { src: '/logos/okimia.svg', alt: 'Logo Okimia' } },
  { id: 'rca-previsionnel', nom: 'RCA Prévisionnel', editeur: 'RCA', faitAvec: 'Prépare le prévisionnel à partir de la comptabilité tenue et des hypothèses écrites. Chaque hypothèse est tracée.', logo: { src: '/logos/rca-previsionnel.svg', alt: 'Logo RCA' } },
  { id: 'rca-evaluation', nom: 'RCA Évaluation', editeur: 'RCA', faitAvec: 'Réunit les pièces et les versions avant le tableau d’évaluation. La valeur reste au cabinet.', logo: { src: '/logos/rca-evaluation.svg', alt: 'Logo RCA' } },
  { id: 'rca-tableau-de-bord', nom: 'RCA Tableau de bord', editeur: 'RCA', faitAvec: 'Alimente le tableau de bord du client à partir de la comptabilité tenue. Il est relu avant la remise.', logo: { src: '/logos/rca-tableau-de-bord.svg', alt: 'Logo RCA' } },
  { id: 'sage-tableau-de-bord-experts', nom: 'Sage Tableau de Bord Experts', editeur: 'Sage', faitAvec: 'Alimente le tableau de bord du client à partir de la comptabilité tenue. Il est relu avant la remise.', logo: { src: '/logos/sage-tableau-de-bord-experts.svg', alt: 'Logo Sage' } },
  { id: 'waibi', nom: 'Waibi', editeur: 'Waibi SAS', faitAvec: 'Alimente le tableau de bord du client à partir de la comptabilité tenue. Il est relu avant la remise.', logo: { src: '/logos/waibi.webp', alt: 'Logo Waibi' } },
  { id: 'forekasts', nom: 'Forekasts', editeur: 'Kerys Business Solutions SAS', faitAvec: 'Prépare le prévisionnel à partir de la comptabilité tenue et des hypothèses écrites. Chaque hypothèse est tracée.', logo: { src: '/logos/forekasts.webp', alt: 'Logo Forekasts' } },
  { id: 'finthesis', nom: 'Finthesis', editeur: 'FINTHESIS SAS', faitAvec: 'Alimente le tableau de bord du client à partir de la comptabilité tenue. Il est relu avant la remise.', logo: { src: '/logos/finthesis.webp', alt: 'Logo Finthesis' } },
  { id: 'amelkis', nom: 'Amelkis', editeur: 'Amelkis Solutions', faitAvec: 'Réunit et contrôle les liasses de consolidation avant le reporting du groupe.', logo: { src: '/logos/amelkis.svg', alt: 'Logo Amelkis' } },
  { id: 'swotia', nom: 'Swotia', editeur: 'SWOTIA SAS', faitAvec: 'Compare les données du dossier à son secteur, et prépare l’analyse pour l’entretien de conseil.', logo: { src: '/logos/swotia.svg', alt: 'Logo Swotia' } },
  { id: 'valutico', nom: 'Valutico', editeur: 'Web Value GmbH', faitAvec: 'Réunit les pièces et les versions avant le tableau d’évaluation. La valeur reste au cabinet.', logo: { src: '/logos/valutico.webp', alt: 'Logo Valutico' } },
  { id: 'avalor', nom: 'Avalor', editeur: 'AVALOR SAS', faitAvec: 'Réunit les pièces et les versions avant le tableau d’évaluation. La valeur reste au cabinet.', logo: { src: '/logos/avalor.webp', alt: 'Logo Avalor' } },
  { id: 'caudia', nom: 'CAUDIA', editeur: 'CAUDIA SAS', faitAvec: 'Réunit pour le dossier d’évaluation les données de marché (multiples, coût du capital).', logo: { src: '/logos/caudia.svg', alt: 'Logo CAUDIA' } },
  { id: 'deal-makr', nom: 'Deal Makr', editeur: 'DEAL MAKR SAS', faitAvec: 'Prépare le dossier de cession à partir de la comptabilité tenue. Il est relu avant la remise.', logo: { src: '/logos/deal-makr.svg', alt: 'Logo Deal Makr' } },
  { id: 'kwote', nom: 'Kwote', editeur: 'kwote SAS', faitAvec: 'Suit le poste client et prépare les relances. Chaque relance part après validation.', logo: { src: '/logos/kwote.svg', alt: 'Logo Kwote' } },
  { id: 'recovr', nom: 'Recovr', editeur: 'MGD SRL', faitAvec: 'Suit le poste client et prépare les relances. Chaque relance part après validation.', logo: { src: '/logos/recovr.webp', alt: 'Logo Recovr' } },
  { id: 'upflow', nom: 'Upflow', editeur: 'Upflow', faitAvec: 'Suit le poste client et prépare les relances. Chaque relance part après validation.', logo: { src: '/logos/upflow.webp', alt: 'Logo Upflow' } },
  { id: 'payt', nom: 'Payt', editeur: 'Payt', faitAvec: 'Suit le poste client et prépare les relances. Chaque relance part après validation.', logo: { src: '/logos/payt.svg', alt: 'Logo Payt' } },
  { id: 'impulse-data', nom: 'Impulse Data', editeur: 'IMPULSE DATA SAS', faitAvec: 'Applique au dossier les références sectorielles, en agrégats anonymisés.', logo: { src: '/logos/impulse-data.webp', alt: 'Logo Impulse Data' } },
  { id: 'enso-rse', nom: 'ensō rse', editeur: 'HELTECH ENSO', faitAvec: 'Réunit à partir de la comptabilité et de la paie les données extra-financières du reporting RSE, relu avant la remise.', logo: { src: '/logos/enso-rse.svg', alt: 'Logo ensō rse' } },
  { id: 'la-societe-nouvelle', nom: 'La Société Nouvelle', editeur: 'La Société Nouvelle SAS', faitAvec: 'Réunit à partir de la comptabilité et de la paie les données extra-financières du reporting RSE, relu avant la remise.', logo: { src: '/logos/la-societe-nouvelle.webp', alt: 'Logo La Société Nouvelle' } },
  { id: 'microsoft-power-bi', nom: 'Microsoft Power BI', editeur: 'Microsoft', faitAvec: 'Alimente à partir de vos exports les tableaux de bord du portefeuille, en agrégats et jamais par personne.', logo: { src: '/logos/microsoft-power-bi.svg', alt: 'Logo Microsoft Power BI' } },
  { id: 'data-studio', nom: 'Data Studio', editeur: 'Google', faitAvec: 'Alimente à partir de vos exports les tableaux de bord du portefeuille, en agrégats et jamais par personne.', logo: { src: '/logos/data-studio.svg', alt: 'Logo Data Studio' } },
  { id: 'qlik-sense', nom: 'Qlik Sense', editeur: 'Qlik', faitAvec: 'Alimente à partir de vos exports les tableaux de bord du portefeuille, en agrégats et jamais par personne.', logo: { src: '/logos/qlik-sense.svg', alt: 'Logo Qlik Sense' } },
  { id: 'tableau', nom: 'Tableau', editeur: 'Salesforce', faitAvec: 'Alimente à partir de vos exports les tableaux de bord du portefeuille, en agrégats et jamais par personne.', logo: { src: '/logos/tableau.svg', alt: 'Logo Tableau' } },
];

/** Les cartes, domaine par domaine, dans l'ordre de CONNECTEURS.md. */
export const CONNECTEURS: readonly Connecteur[] = [
  ...dans('production-comptable', CARTES_PRODUCTION_COMPTABLE),
  ...dans('paie-social', CARTES_PAIE_SOCIAL),
  ...dans('juridique-formalites', CARTES_JURIDIQUE_FORMALITES),
  ...dans('commissariat-aux-comptes', CARTES_COMMISSARIAT_AUX_COMPTES),
  ...dans('banque-paiements', CARTES_BANQUE_PAIEMENTS),
  ...dans('ged-dossier-permanent', CARTES_GED_DOSSIER_PERMANENT),
  ...dans('signature-electronique', CARTES_SIGNATURE_ELECTRONIQUE),
  ...dans('messagerie-agenda', CARTES_MESSAGERIE_AGENDA),
  ...dans('bureautique-classeurs', CARTES_BUREAUTIQUE_CLASSEURS),
  ...dans('caisse-e-commerce', CARTES_CAISSE_E_COMMERCE),
  ...dans('gestion-cabinet-crm', CARTES_GESTION_CABINET_CRM),
  ...dans('donnees-legales', CARTES_DONNEES_LEGALES),
  ...dans('factures-fournisseurs', CARTES_FACTURES_FOURNISSEURS),
  ...dans('pilotage-tresorerie', CARTES_PILOTAGE_TRESORERIE),
];

/**
 * Logos à poser sur une tuile encre : variantes blanches, ou texte blanc qui disparaîtrait sur la carte blanche
 * (règle R17 du 15/10/2026). Le fichier reste celui de l'éditeur, jamais recoloré.
 */
export const LOGOS_SUR_ENCRE: ReadonlySet<string> = new Set([
  'agrume', 'aircall', 'akuiteo', 'amelkis', 'aspone-fr', 'bimpli', 'bleez', 'cashmag', 'comptasecure', 'crypto-accounting', 'datasnipper', 'dsn-val', 'fulll', 'henrri', 'illinks-ged-premium-expert', 'impulse-data', 'inqom', 'ionos', 'juria', 'konnex-one', 'l-addition', 'legalvision', 'lexbase', 'limpeed', 'lyreco', 'manutan', 'my-facturation', 'myauditpilot', 'net-entreprises-fr', 'netexcom', 'nocrm-io', 'octovision', 'oodrive-sign', 'openpaye', 'pluxee', 'revue-fiduciaire', 'sofyx', 'uber-eats', 'uber-for-business', 'upflow', 'waibi', 'weblex', 'weekera',
]);

/** Les cartes d'un domaine, dans l'ordre de la page. */
export const connecteursDu = (domaine: string): readonly Connecteur[] => CONNECTEURS.filter((connecteur) => connecteur.domaine === domaine);

/** La carte dont le nom est exactement `nom` (R14) ; `undefined` sinon. */
export const connecteurNomme = (nom: string): Connecteur | undefined => CONNECTEURS.find((connecteur) => connecteur.nom === nom);

/** Une étape de « Comment nous branchons un logiciel ». */
export interface EtapeBranchement {
  terme: string;
  texte: string;
}

/**
 * La page `/integrations` : balises, héros et copie de chaque bloc ajouté par la tâche 8, passée par
 * `marketing-skills:copywriting` puis `copy-editing`. Requête mesurée le 15/10/2026 (spec §6, MOTS-CLES.md) : aucun
 * volume, Google la lit comme « choisir ses logiciels » ; la page dit ce que nous reprenons dans les outils déjà choisis.
 * Aucun compte de logiciels n'y est écrit (porte 2) ; les dates sont explicites, jamais celles du build.
 */
export const PAGE_OUTILS = {
  chemin: '/integrations',
  requete: 'intégration logiciels cabinet comptable',
  ariane: 'Intégration des logiciels',
  titreOnglet: 'Intégration des logiciels de cabinet comptable | Memlia',
  descriptionLead: 'Intégration des logiciels de votre cabinet comptable',
  description: 'Intégration des logiciels de votre cabinet comptable : production, paie, banque, GED, juridique. Robots et agents IA préparent dans vos outils ; votre équipe valide.',
  surtitre: 'Dans vos outils',
  h1: 'Intégration des logiciels de votre cabinet comptable.',
  /** La définition de l'agent IA à sa première apparition sur la page (charte §9 bis). */
  chapeau: 'Vos logiciels restent au cœur du travail. Nous y déployons les robots Memlia pour vos routines et les agents IA pour vos métiers, avec les accès, les règles et les validations de votre cabinet.',
  complement: 'Production comptable, paie, juridique, banque, messagerie : retrouvez vos logiciels par domaine. Chaque carte décrit le travail que nous prenons en charge. Nous définissons les échanges, les accès et les formats pour votre tâche.',
  /** `ItemList.name` du JSON-LD. */
  nomListe: 'Logiciels de cabinet comptable pour les robots et agents IA Memlia',
  datePublication: '2026-09-20',
  dateMiseAJour: '2026-10-15',
  domaines: {
    legende: 'Aller au domaine',
    retour: 'Tous les domaines',
    quiSenCharge: 'Qui s’en charge :',
    enSavoirPlus: 'En savoir plus',
  },
  surDemande: {
    question: 'Votre logiciel n’est pas listé ?',
    reponse: 'Nous l’intégrons sur demande.',
    texte: 'Décrivez la tâche et l’outil. Nous regardons ce qu’il exporte et ce qu’il accepte, avant tout devis.',
    action: { libelle: 'Décrire votre tâche', href: '/contact' },
  },
  branchement: {
    titre: 'Comment nous branchons un logiciel',
    texte: 'De l’export que votre logiciel produit déjà au fichier que votre collaborateur importe.',
    etapes: [
      { terme: 'Nous lisons ce que votre logiciel exporte', texte: 'Un collaborateur nous montre la tâche. Nous relevons l’export, le format d’import et les accès dont la règle a besoin, avant tout devis.' },
      { terme: 'Nous écrivons la règle du passage', texte: 'Ce qui entre, ce qui sort et le cas qui arrête la préparation, dans vos mots. Nous la rejouons sur un dossier fictif avant qu’elle touche un vrai dossier.' },
      { terme: 'L’agent prépare, votre collaborateur importe', texte: 'Le fichier arrive contrôlé et attend la validation. Si l’éditeur change son format, la préparation s’arrête jusqu’à ce que la règle soit mise à jour et rejouée.' },
    ],
  },
  guides: {
    titre: 'Quelle tâche voulez-vous préparer ?',
    texte: 'Pour une tâche précise dans votre logiciel, un guide indique les champs à lire, les contrôles à préparer et les décisions qui restent au cabinet. Une version, un export ou un accès peut changer le parcours : chaque guide précise son périmètre.',
  },
} as const;
