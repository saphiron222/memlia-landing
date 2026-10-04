import type { ProofId } from './proofs';

export const OUTILS_HUB_PATH = '/outils-comptables-gratuits' as const;

export const OUTIL_CATEGORIES = [
  { id: 'calculer', label: 'Calculer' },
  { id: 'verifier', label: 'Vérifier' },
  { id: 'ecrire', label: 'Écrire' },
] as const;

export type OutilCategory = (typeof OUTIL_CATEGORIES)[number]['id'];
export type OutilStatus = 'temoin' | 'disponible' | 'suspendu';
export type OutilServicePage = '/automatisation-cabinet-comptable' | '/automatisation/factures-fournisseurs' | '/automatisation/rapprochement-bancaire' | '/methode';

export interface OutilDefinition {
  slug: string;
  categorie: OutilCategory;
  statut: OutilStatus;
  h1: string;
  title: string;
  description: string;
  promesse: { entree: string; resultat: string };
  limites: readonly string[];
  mentionLocale: string;
  suspension?: { motif: string; date: string };
  proof?: ProofId;
  source: {
    nom: string;
    url: string;
    extrait: string;
    verifieeLe: string;
    complement?: { nom: string; url: string; extrait: string };
  };
  articleExact?: string;
  pageService: OutilServicePage;
  cta: '/contact';
}

export const OUTILS: readonly OutilDefinition[] = [
  {
    slug: 'generateur-charte-ia-cabinet',
    categorie: 'ecrire',
    statut: 'disponible',
    h1: 'Générateur de charte IA du cabinet',
    title: 'Générateur de charte IA du cabinet | Memlia',
    description: 'Préparez une trame de charte IA adaptée aux usages du cabinet, avec responsabilités, données autorisées et validation humaine.',
    promesse: { entree: 'Usages, données sans dossiers clients, rôles et contrôles', resultat: 'Trame éditable, arbitrages visibles et export Markdown ou texte' },
    limites: [
      'Cette trame originale est non officielle : elle ne remplace pas les ressources de l’Ordre et ne certifie aucune conformité.',
      'Elle organise uniquement des usages sans données personnelles ni clients. Un dossier réel nécessite un cadrage distinct.',
      'Un rôle non décidé reste à compléter ; le cabinet relit les clauses, vérifie les outils et documente l’adoption.',
      'L’envoi de fichiers clients à une IA publique est contradictoire avec ce périmètre et bloque la génération sans effacer les clauses.',
    ],
    mentionLocale: 'Le questionnaire, les clauses éditées, la copie et les exports sont traités dans votre navigateur. Ils ne sont ni envoyés ni enregistrés par cet outil ; fermez la page pour effacer les saisies ou exportez-les pour les conserver.',
    proof: 'v2/01-outil-charte-ia',
    source: {
      nom: 'CNOEC — Travaux Data et IA',
      url: 'https://www.experts-comptables.fr/travaux-data-et-ia',
      extrait: 'L’Ordre propose un livret avec des cas d’usage, des précautions et une charte d’utilisation de l’IA générative en cabinet. Notre outil compose une trame distincte à partir de vos choix, sans reproduire ce modèle.',
      verifieeLe: '4 octobre 2026',
      complement: {
        nom: 'CNIL — Comment déployer une IA générative ? (18 juillet 2024)',
        url: 'https://cnil.fr/fr/comment-deployer-une-ia-generative-la-cnil-apporte-de-premieres-precisions',
        extrait: 'La CNIL recommande d’identifier les usages, de les encadrer, d’examiner le déploiement et la réutilisation des données, de former les utilisateurs et d’organiser la gouvernance.',
      },
    },
    pageService: '/methode',
    cta: '/contact',
  },
  {
    slug: 'calculateur-marge-commerciale',
    categorie: 'calculer',
    statut: 'disponible',
    h1: 'Calculateur de marge commerciale',
    title: 'Calculateur de marge commerciale | Memlia',
    description: 'Calculez une marge commerciale, un taux de marge et un taux de marque à partir de deux montants HT, avec les formules et les arrondis visibles.',
    promesse: { entree: 'Prix d’achat HT et prix de vente HT', resultat: 'Marge, taux de marge, taux de marque et trace du calcul' },
    limites: [
      'Ce calcul ne remplace pas la marge comptable annuelle, qui tient notamment compte de la variation des stocks.',
      'Il n’intègre ni TVA, ni remise, ni frais et ne conseille aucun prix de vente.',
      'Il refuse un montant négatif, nul ou ambigu ; une marge négative reste acceptée lorsque le prix de vente est inférieur au prix d’achat.',
    ],
    mentionLocale: 'Les deux montants et les résultats restent dans ce navigateur. Ils ne sont ni envoyés, ni enregistrés, ni réutilisés.',
    proof: 'v2/25-outil-marge',
    source: {
      nom: 'Insee — Marge commerciale',
      url: 'https://www.insee.fr/fr/metadonnees/definition/c1774',
      extrait: 'L’Insee définit la marge commerciale comme la différence entre le montant hors taxes des ventes de marchandises et le coût d’achat hors taxes des marchandises vendues.',
      verifieeLe: '20 septembre 2026',
    },
    pageService: '/automatisation-cabinet-comptable',
    cta: '/contact',
  },
  {
    slug: 'calculateur-date-echeance-facture',
    categorie: 'calculer',
    statut: 'disponible',
    h1: 'Calculateur de date d’échéance de facture',
    title: 'Calculateur de date d’échéance de facture | Memlia',
    description: 'Calculez une date d’échéance selon l’un des délais généraux documentés, avec le point de départ, la convention et chaque étape visibles.',
    promesse: { entree: 'Date, délai général et convention choisie', resultat: 'Date d’échéance et trace calendaire' },
    limites: [
      'Ce calcul ne couvre pas les délais sectoriels, les marchés publics, les factures périodiques ni un accord particulier.',
      'Il ne conclut pas à la conformité d’un contrat ou d’une facture et ne remplace pas leur lecture.',
      'Il refuse le calcul lorsque le point de départ manque ou que la convention « 45 jours fin de mois » n’est pas choisie explicitement.',
    ],
    mentionLocale: 'Les dates et le résultat restent dans ce navigateur. Aucune date n’est envoyée ou conservée.',
    proof: 'v2/26-outil-echeance',
    source: {
      nom: 'Légifrance — Code de commerce, article L441-10',
      url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038414392',
      extrait: 'L’article L441-10 fixe le délai supplétif à 30 jours après réception des marchandises ou exécution de la prestation, et borne les délais convenus à 60 jours date de facture ou 45 jours fin de mois.',
      verifieeLe: '20 septembre 2026',
      complement: {
        nom: 'Entreprendre.Service-Public.fr — Délais de paiement entre professionnels',
        url: 'https://entreprendre.service-public.gouv.fr/vosdroits/F23211',
        extrait: 'La fiche officielle détaille les deux méthodes de calcul admises pour 45 jours fin de mois et exige que les parties se mettent d’accord sur la méthode utilisée.',
      },
    },
    pageService: '/automatisation/factures-fournisseurs',
    cta: '/contact',
  },
  {
    slug: 'calculateur-amortissement-comptable',
    categorie: 'calculer',
    statut: 'disponible',
    h1: 'Calculateur d’amortissement comptable',
    title: 'Calculateur d’amortissement comptable | Memlia',
    description: 'Calculez un plan d’amortissement linéaire ou dégressif, avec le prorata, la valeur nette et la trace de chaque dotation.',
    promesse: { entree: 'Valeur, date de mise en service, durée et méthode', resultat: 'Plan annuel, prorata, dotations, cumul et valeur nette' },
    limites: [
      'Le mode linéaire applique la convention affichée : prorata au jour exact et clôture au 31 décembre. Il ne choisit pas la durée à la place du cabinet.',
      'Le mode dégressif reproduit le calcul général de l’article 39 A du CGI sur un exercice civil, mais ne décide ni de l’éligibilité du bien, ni d’un régime particulier.',
      'Le calcul ne traite ni valeur résiduelle, ni cession, ni exercice décalé, ni composant séparé ; une entrée vide, incohérente ou hors bornes bloque le plan.',
    ],
    mentionLocale: 'La valeur, la date, la durée et le plan restent dans ce navigateur. Ils ne sont ni envoyés, ni enregistrés, ni réutilisés.',
    proof: 'v2/28-outil-amortissement',
    source: {
      nom: 'Autorité des normes comptables - Plan comptable général, version au 1er janvier 2026',
      url: 'https://www.anc.gouv.fr/plan-comptable-general-0',
      extrait: 'L’article 214-13 relie le mode d’amortissement au rythme de consommation des avantages économiques attendus et retient le mode linéaire à défaut de mode mieux adapté.',
      verifieeLe: '20 septembre 2026',
      complement: {
        nom: 'Légifrance - Code général des impôts, article 39 A',
        url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037987291',
        extrait: 'L’article 39 A fixe les coefficients du dégressif à 1,25 pour trois ou quatre ans, 1,75 pour cinq ou six ans et 2,25 au-delà de six ans.',
      },
    },
    pageService: '/automatisation-cabinet-comptable',
    cta: '/contact',
  },
  {
    slug: 'modele-rapprochement-bancaire-excel-gratuit',
    categorie: 'verifier',
    statut: 'disponible',
    h1: 'Modèle de rapprochement bancaire Excel gratuit',
    title: 'Modèle de rapprochement bancaire Excel gratuit | Memlia',
    description: 'Modèle de rapprochement bancaire Excel gratuit : préparez un contrôle fictif de soldes et téléchargez un CSV sans importer de relevé.',
    promesse: { entree: 'Période, soldes et éléments de rapprochement fictifs', resultat: 'Contrôle des soldes et modèle CSV ouvrable dans Excel' },
    limites: [
      'Le téléchargement est un fichier CSV UTF-8 séparé par des points-virgules, pas un fichier .xlsx.',
      'Ce modèle ne passe aucune écriture et ne valide aucun rapprochement à la place du collaborateur.',
      'Il refuse une période inversée, un montant illisible, un élément inexpliqué ou des soldes ajustés qui ne concordent pas.',
    ],
    mentionLocale: 'Aucun relevé n’est importé. Les montants fictifs sont calculés dans ce navigateur ; le fichier est créé localement puis son adresse temporaire est révoquée.',
    proof: 'v2/27-outil-rapprochement',
    source: {
      nom: 'Autorité des normes comptables — Plan comptable général, version au 1er janvier 2026',
      url: 'https://www.anc.gouv.fr/plan-comptable-general-0',
      extrait: 'L’article 121-1 définit la comptabilité comme un système d’organisation de l’information financière permettant de saisir, classer et enregistrer les données pour refléter une image fidèle.',
      verifieeLe: '20 septembre 2026',
    },
    pageService: '/automatisation/rapprochement-bancaire',
    cta: '/contact',
  },
  {
    slug: 'temoin-calcul-local',
    categorie: 'calculer',
    statut: 'temoin',
    h1: 'Témoin de calcul local',
    title: 'Témoin de calcul local | Memlia',
    description: 'Témoin de calcul local : une addition fictive démontre le calcul, la copie et le téléchargement sans envoi ni conservation des valeurs.',
    promesse: {
      entree: 'Deux nombres fictifs',
      resultat: 'Leur somme et une trace téléchargeable',
    },
    limites: [
      'Cette démonstration additionne seulement deux nombres.',
      'Elle ne porte aucune règle comptable, fiscale ou sociale.',
      'Elle refuse une valeur vide, illisible ou non finie.',
    ],
    mentionLocale: 'Les valeurs saisies, le résultat, la copie et le téléchargement restent dans ce navigateur : aucune valeur n’est envoyée ni conservée.',
    source: { nom: 'Démonstration technique interne', url: '/methode', extrait: 'Ce témoin ne porte aucune règle comptable.', verifieeLe: '20 septembre 2026' },
    pageService: '/methode',
    cta: '/contact',
  },
];

export const OUTILS_DISPONIBLES = OUTILS.filter((outil) => outil.statut === 'disponible');

export function outilPath(outil: Pick<OutilDefinition, 'slug'>): string {
  return `${OUTILS_HUB_PATH}/${outil.slug}`;
}

export function getOutil(slug: string): OutilDefinition {
  const outil = OUTILS.find((entry) => entry.slug === slug);
  if (!outil) throw new Error(`Outil inconnu : ${slug}`);
  return outil;
}
