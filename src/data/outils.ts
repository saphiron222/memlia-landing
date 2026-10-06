import type { ProofId } from './proofs';

export const OUTILS_HUB_PATH = '/outils-comptables-gratuits' as const;

export const OUTIL_CATEGORIES = [
  { id: 'explorer', label: 'Explorer' },
  { id: 'calculer', label: 'Calculer' },
  { id: 'verifier', label: 'Vérifier' },

  { id: 'se-situer', label: 'Se situer' },

  { id: 'preparer', label: 'Préparer' },

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
  zoneLarge?: boolean;
  suspension?: { motif: string; date: string };
  proof?: ProofId;
  source: {
    titre?: string;
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
    slug: 'bareme-heures-cac', categorie: 'calculer', statut: 'disponible',
    h1: 'Barème d’heures du commissaire aux comptes : calcul et limites',
    title: 'Barème heures commissaire aux comptes | Memlia',
    description: 'Calculez la base et la tranche du barème d’heures CAC, vérifiez les exclusions et exportez les hypothèses. Distinguez barème et budget de mission.',
    promesse: { entree: 'Bilan, produits hors TVA, période et champ d’application déclaré', resultat: 'Base décomposée, référence expliquée, budget distinct et dossier reprenable' },
    limites: [
      'Référence d’heures, jamais un tarif ni une appréciation de la suffisance des diligences.',
      'Une exclusion, une réponse inconnue, une dérogation ou une borne commune suspend la fourchette applicable.',
      'Comptes consolidés, audit petite entreprise, durabilité et autres missions non évalués par cet outil.',
      'Montants en euros au centime ; pas de conversion implicite de k€. Le CAC valide le programme, les hypothèses et les démarches.',
    ],
    mentionLocale: 'Saisies et calculs dans cet onglet, sans envoi ni stockage persistant. Téléchargez le JSON pour reprendre votre travail. Aucun enregistrement automatique.',
    proof: 'v2/43-outil-bareme-cac', zoneLarge: true,
    source: { nom: 'Légifrance — Code de commerce, D.821-188 à R.821-194', url: 'https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000005634379/LEGISCTA000048874384/2026-10-06', extrait: 'Base, grille et champ d’application distingués du programme de travail, du budget saisi et de toute rémunération.', verifieeLe: '6 octobre 2026' },
    pageService: '/methode', cta: '/contact',
  },
  {
    slug: 'suivi-circularisation', categorie: 'preparer', statut: 'disponible',
    h1: 'Modèle de suivi de circularisation Excel : lettres et retours',
    title: 'Suivi de circularisation : lettres et retours | Memlia',
    description: 'Préparez vos lettres de confirmation, suivez les retours et rapprochez les écarts localement. Exportez le tableau de suivi pour votre dossier.',
    promesse: { entree: 'Tiers sélectionnés, dates, devises et retours renseignés', resultat: 'Lettres originales, suivi CSV et dossier JSON reprenable' },
    limites: [
      'Aucun envoi, réception ou authentification de réponse. Le CAC maîtrise la sélection, les courriers et les suites.',
      'Écart exact seulement à devise identique et base déclarée comparable. Une absence de réponse n’est jamais un écart zéro.',
      'Refus et désaccord suspendent les propositions de relance ; les procédures alternatives restent à décider par le CAC.',
      'CSV et JSON limités à 20 Mo ; 100 000 tiers maximum. Un doublon, une date incohérente ou une reprise invalide est refusé sans correction silencieuse.',
    ],
    mentionLocale: 'Session uniquement en mémoire, sans envoi ni stockage persistant. Sauvegardez le JSON avant fermeture pour reprendre vos lettres, versions et notes. Aucun enregistrement automatique.',
    proof: 'v2/40-outil-circularisation', zoneLarge: true,
    source: { nom: 'CNCC — NEP-505, demandes de confirmation des tiers', url: 'https://doc.cncc.fr/docs/nep-505-demandes-de-confirmation', extrait: 'Le §9 réserve au commissaire aux comptes la maîtrise de la sélection, de la rédaction, de l’envoi et de la réception. Notre outil prépare et documente ; il n’exécute pas ces échanges.', verifieeLe: '6 octobre 2026' },
    pageService: '/methode', cta: '/contact',
  },
  {
    slug: 'generateur-prompt-ia-gratuit', categorie: 'ecrire', statut: 'disponible',
    h1: 'Générateur de prompt IA gratuit',
    title: 'Générateur de prompt IA gratuit | Memlia',
    description: 'Préparez un prompt texte pour rédiger, résumer ou classer, avec contexte, format de sortie, contraintes et critères de validation.',
    promesse: { entree: 'Objectif abstrait, public, contexte, ton et contraintes', resultat: 'Consigne texte éditable, copiable et exportable en texte ou JSON' },
    limites: [
      'Assemblage local déterministe de blocs écrits : aucun modèle d’IA n’est appelé. Le format décrit la future réponse, pas un résultat déjà obtenu.',
      'Le besoin image ou vidéo n’est pas servi. Le filtre repère quelques signaux explicites et contradictions, pas le sens complet ni tous les noms ; il n’anonymise rien.',
      'La personne relit la consigne, vérifie les réponses et choisit un outil autorisé avant usage. Une édition peut rendre le schéma ou les contraintes incohérents.',
      'Objectif vide, hors bornes ou contradiction explicite avec l’arrêt : refus expliqué, saisies et édition conservées.',
    ],
    mentionLocale: 'Vos choix et votre prompt restent dans ce navigateur, sans envoi ni stockage. Recharger les efface. La copie et les exports sont produits à votre demande et reprennent votre édition.',
    proof: 'v2/01-outil-prompt-ia', zoneLarge: true,
    source: { titre: 'Convention Memlia', nom: 'Méthode Memlia — écrire et éprouver une règle', url: '/methode', extrait: 'Notre convention : préciser le but, les entrées, le résultat, les limites et les cas d’arrêt, puis rejouer des exemples fictifs. Ce n’est pas un benchmark de modèles.', verifieeLe: '5 octobre 2026' },
    pageService: '/methode', cta: '/contact',
  },
  {

    slug: 'bibliotheque-prompts-comptables', categorie: 'explorer', statut: 'disponible',
    h1: 'Bibliothèque de prompts comptables',
    title: 'Bibliothèque de prompts comptables | Memlia',
    description: 'Choisissez un modèle de prompt comptable par tâche, consultez son exemple fictif, puis copiez-le ou adaptez-le sans inscription.',
    promesse: { entree: 'Pôle, tâche, format et recherche locale', resultat: 'Douze modèles complets, exemples fictifs, copie, export et adaptation' },
    limites: [
      'Corpus original de consignes et de sorties attendues rédigées : aucune réponse de modèle d’IA ni validation comptable.',
      'La bibliothèque sélectionne un modèle ; le générateur permet d’adapter ses contraintes. Le cabinet choisit l’outil autorisé et relit chaque résultat.',
      'Aucun envoi, dépôt ni décision fiscale n’est exécuté. Une recherche sans correspondance laisse un état vide explicite et les filtres peuvent être effacés.',
    ],
    mentionLocale: 'Les filtres, la copie et l’export restent dans ce navigateur, sans envoi de contenu. La recherche sert à décrire un geste, jamais un dossier client. Adapter transmet seulement l’identifiant public de la fiche via le stockage temporaire de cet onglet ; il est retiré à l’arrivée dans le générateur. Aucun texte saisi n’est enregistré.',
    proof: 'v2/31-outil-bibliotheque', zoneLarge: true,
    source: { titre: 'Un corpus original de préparation', nom: 'CNOEC — Travaux Data et IA', url: 'https://www.experts-comptables.fr/travaux-data-et-ia', extrait: 'L’Ordre présente des usages de l’IA en cabinet. Nos modèles sont rédigés séparément ; cette ressource ne les valide pas.', verifieeLe: '5 octobre 2026' },
    articleExact: '/blog/prompt-chatgpt-expert-comptable', pageService: '/methode', cta: '/contact',
  },
  {
    slug: 'verificateur-prompt-ia', categorie: 'verifier', statut: 'disponible',
    h1: 'Vérificateur de prompt IA', title: 'Vérificateur de prompt IA | Memlia',
    description: 'Repérez les contraintes absentes d’un prompt IA et préparez des corrections expliquées, sans confondre structure et fiabilité des réponses.',
    promesse: { entree: 'Consigne abstraite existante, 10 000 caractères maximum', resultat: 'Constats expliqués, original conservé, proposition éditable et rapport complet' },
    limites: [
      'Analyse heuristique française locale, sans modèle ni score de fiabilité : une formulation détectée reste à relire.',
      'Les négations et ambiguïtés restent à examiner. La proposition ajoute des pistes ; elle ne résout pas le sens ni les contradictions à votre place.',
      'Une consigne vide, trop longue, non confirmée ou avec une coordonnée explicite est refusée sans effacer vos versions. Le filtre ne détecte pas tous les noms.',
    ],
    mentionLocale: 'La consigne, la proposition, les constats, la copie et le rapport restent dans ce navigateur, sans envoi ni stockage. Recharger efface la page ; les copies et fichiers téléchargés restent sur votre appareil.',
    proof: 'v2/31-outil-verificateur-prompt', zoneLarge: true,
    source: { nom: 'Méthode structurelle Memlia', url: '#verifier-methode', extrait: 'Cinq contraintes et des formulations françaises explicites, avec doute affiché. Aucun test de réponse de modèle ni certification.', verifieeLe: '5 octobre 2026' },
    pageService: '/methode', cta: '/contact',

  },
  {
    slug: 'preparer-pseudonymiser-fichier-csv-fec', categorie: 'preparer', statut: 'disponible',
    h1: 'Préparer et pseudonymiser un fichier comptable avant IA',
    title: 'Préparer et pseudonymiser un fichier comptable avant IA | Memlia',
    description: 'Supprimez ou remplacez des colonnes d’un fichier CSV ou FEC local et examinez les risques restants avant tout partage avec une IA.',
    promesse: { entree: 'Copie CSV, TSV ou FEC texte et choix par colonne', resultat: 'Aperçu, copie CSV, rapport des risques et mapping séparé optionnel' },
    limites: [
      'Les alias ne garantissent pas l’anonymat : champs libres, dates, montants et combinaisons rares peuvent permettre une réidentification.',
      'La copie transformée n’est pas un FEC fiscalement valide. Le cabinet garde la décision de partage ; rien n’est transmis à une IA.',
      'L’import refuse un fichier supérieur à 20 Mo, binaire, illisible, sans en-têtes uniques ou de structure irrégulière ; les autres limites sont affichées au formulaire.',
    ],
    mentionLocale: 'La lecture, l’aperçu et les exports se font dans ce navigateur, sans envoi ni stockage du contenu. L’original n’est jamais modifié. Réinitialiser termine le Worker et retire le contenu et le mapping de la page ; les fichiers que vous avez téléchargés restent sur votre appareil.',
    proof: 'v2/29-outil-pseudonymisation',
    source: {
      nom: 'CNIL — L’anonymisation de données personnelles',
      url: 'https://www.cnil.fr/fr/technologies/lanonymisation-de-donnees-personnelles',
      extrait: 'La CNIL distingue les alias de l’anonymisation irréversible : une pseudonymisation peut être réversible et les données peuvent conserver un caractère personnel.',
      verifieeLe: '4 octobre 2026',
    },
    pageService: '/methode', cta: '/contact',
  },
  {


    slug: 'diagnostic-maturite-ia-cabinet', categorie: 'se-situer', statut: 'disponible',
    h1: 'Diagnostic de maturité IA du cabinet',
    title: 'Diagnostic de maturité IA du cabinet | Memlia',
    description: 'Situez les pratiques IA de votre cabinet et choisissez une prochaine action à partir de vos réponses, sans inscription ni classement des équipes.',
    promesse: { entree: 'Quinze réponses facultatives sur cinq dimensions des pratiques du cabinet', resultat: 'Synthèse complète, inconnues et trois actions justifiées ; rapport Markdown et impression' },
    limites: ['Méthode Memlia déclarative : pas audit normatif, note globale ni classement individuel.', 'Aucun gain déduit des réponses ; les pratiques déclarées ne sont pas vérifiées.', 'Une réponse inconnue reste inconnue : elle demande clarification, pas un jugement défavorable.'],
    mentionLocale: 'Vos réponses et votre rapport restent dans ce navigateur, sans envoi ni stockage persistant. Fermer la page les efface. Copie, impression et export sont volontaires ; aucune adresse e-mail n’est demandée.',
    proof: 'v2/30-outil-maturite',
    source: { nom: 'Méthode Memlia — écrire et éprouver la règle', url: '/methode', extrait: 'Cette rubrique déclarative originale organise les réponses en usages, règles, données, validation et mesure. Elle aide à choisir une prochaine tâche, sans norme ni comparaison à d’autres cabinets.', verifieeLe: '4 octobre 2026' },
    pageService: '/methode', cta: '/contact',
  },
  {



    slug: 'generateur-prompt-expert-comptable',
    categorie: 'ecrire',
    statut: 'disponible',
    h1: 'Générateur de prompt pour expert-comptable',
    title: 'Générateur de prompt pour expert-comptable | Memlia',
    description: 'Décrivez une tâche abstraite du cabinet et préparez un prompt structuré, avec validation humaine, conditions d’arrêt et exemples fictifs.',
    promesse: { entree: 'Tâche abstraite et contraintes choisies', resultat: 'Prompt éditable, frontière et cas fictifs à rejouer' },
    limites: [
      'Cet outil assemble des blocs écrits dans le navigateur ; il n’appelle aucun modèle et ne fournit aucune réponse comptable.',
      'Le contrôle porte sur la structure et quelques signaux explicites. Il ne comprend pas le sens, ne détecte pas tous les noms et ne garantit ni sécurité, ni conformité, ni anonymisation.',
      'Le cabinet choisit un outil autorisé avant de réutiliser un prompt. Aucun fichier ni contenu de pièce ne doit être saisi ici.',
      'Une description hors bornes, un signal sensible ou une demande de décision automatique est refusé. Un prompt édité incomplet reste conservé, mais sa copie et son export sont bloqués.',
    ],
    mentionLocale: 'Vos choix et votre prompt restent dans ce navigateur, sans envoi ni stockage. Recharger la page les efface. La copie et le fichier texte sont produits seulement à votre demande.',
    proof: 'v2/29-outil-prompt',
    zoneLarge: true,
    source: {
      nom: 'CNIL — Questions-réponses sur l’utilisation d’un système d’IA générative',
      url: 'https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative',
      extrait: 'La CNIL recommande de définir les usages autorisés et les données qui peuvent être partagées. Cette source éclaire la précaution de saisie ; elle ne certifie pas ce générateur.',
      verifieeLe: '3 octobre 2026',
    },
    articleExact: '/blog/prompt-chatgpt-expert-comptable',
    pageService: '/methode',
    cta: '/contact',
  },
  {


    slug: 'calculateur-roi-automatisation', categorie: 'calculer', statut: 'disponible',
    h1: 'Calculateur de ROI d’automatisation comptable',
    title: 'Calculateur de ROI d’automatisation comptable | Memlia',
    description: 'Comparez des scénarios d’automatisation avec vos volumes, temps, coûts et hypothèses, en séparant capacité libérée et économies de trésorerie.',
    promesse: { entree: 'Trois scénarios de volumes, temps, adoption, coûts et dépenses évitables', resultat: 'Capacité, trésorerie, ROI cash et récupération ; hypothèses et calculs exportables en CSV ou JSON' },
    limites: [
      'Hypothèses constantes et mois continus : aucun gain garanti, aucune prévision ou tarification Memlia.',
      'La capacité valorisée ne devient jamais automatiquement du cash. E inconnu laisse le ROI et la trésorerie ND.',
      'Une entrée négative, ambiguë ou hors borne bloque le calcul sans effacer vos hypothèses ; un temps net négatif reste affiché.',
    ],
    mentionLocale: 'Vos hypothèses, calculs, copies et exports restent dans ce navigateur, sans envoi ni stockage persistant. Effacer retire les hypothèses et les résultats de la page.',
    proof: 'v2/30-outil-roi',
    zoneLarge: true,
    source: { titre: 'Formules documentées', nom: 'Conventions de calcul détaillées sur cette page', url: '#roi-formules', extrait: 'Le temps, les coûts et les dépenses réellement évitables sont des hypothèses indépendantes. Les formules visibles définissent le calcul, pas un taux de gain attendu.', verifieeLe: '4 octobre 2026' },
    pageService: '/methode', cta: '/contact',
  },
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

    slug: 'verificateur-fec-local', categorie: 'verifier', statut: 'disponible',
    h1: 'Vérificateur FEC gratuit et local',
    title: 'Vérificateur FEC gratuit et local | Memlia',
    description: 'Contrôlez localement la structure d’un FEC et trouvez les lignes en anomalie, avec règles expliquées et rapport exportable non certifiant.',
    promesse: { entree: 'FEC texte commercial, 18 colonnes Débit/Crédit, 20 Mo maximum', resultat: 'Anomalies par ligne, colonne et règle ; rapports complets aux formats CSV et JSON' },
    limites: [
      'Contrôle de structure non certifiant : aucune conclusion comptable ou fiscale, aucun fichier corrigé.',
      'Équilibre, exhaustivité, chronologie, nom du fichier et conformité de l’encodage ne sont pas évalués.',
      'XML, BNC/BA, Montant/Sens et colonnes supplémentaires restent hors périmètre, sans être déclarés invalides ; au-delà de 20 Mo, le fichier n’est pas lu.',
    ],
    mentionLocale: 'Votre fichier et son rapport sont traités dans un Worker de ce navigateur, sans envoi ni stockage persistant. L’original reste inchangé. Effacer retire la sélection et le rapport de la page.',
    proof: 'v2/29-outil-fec',
    source: {
      nom: 'DGFiP — Test Compta Demat',
      url: 'https://www.economie.gouv.fr/dgfip/outil-de-test-des-fichiers-des-ecritures-comptables-fec',
      extrait: 'La DGFiP propose Test Compta Demat pour examiner la structure d’un FEC et localiser les anomalies. Notre contrôle technique borné ne remplace pas cet outil officiel.',
      verifieeLe: '4 octobre 2026',
      complement: { nom: 'BOFiP — Format du fichier des écritures comptables', url: 'https://bofip.impots.gouv.fr/bofip/9028-PGP.html', extrait: 'Les précisions de format distinguent les champs requis et ceux à blanc si non utilisés. Aucun jugement fiscal n’est automatisé ici.' },
    },
    pageService: '/automatisation-cabinet-comptable', cta: '/contact',

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
      complement: {
        nom: 'Bpifrance Création — Taux de marque',
        url: 'https://bpifrance-creation.fr/taux-marque',
        extrait: 'Le taux de marque rapporte la marge au prix de vente HT ; le taux de marge la rapporte au coût. Ici, ce coût est le prix d’achat HT saisi, hors frais et variation de stocks.',
      },
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
      'Ce calcul ne couvre pas les délais sectoriels ou dérogatoires, les marchés publics, les factures périodiques, l’export ni les points de départ particuliers outre-mer. Un délai contractuel plus court reste à appliquer.',
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
    description: 'Calculez un plan d’amortissement linéaire comptable depuis la mise en service ou dégressif fiscal depuis l’acquisition, avec prorata et trace des dotations.',
    promesse: { entree: 'Valeur amortissable, date de mise en service ou d’acquisition, durée et méthode', resultat: 'Plan annuel, prorata, dotations, cumul et valeur nette' },
    limites: [
      'Le linéaire comptable commence au début de consommation des avantages économiques, généralement à la mise en service. Le prorata en jours réels et la clôture au 31 décembre sont les conventions de cette simulation, pas une règle fiscale universelle.',
      'Le dégressif fiscal couvre uniquement les acquisitions ou achèvements depuis le 01/01/2010 et commence au premier jour de ce mois, avec l’option de passage au quotient résiduel. Le cabinet vérifie l’éligibilité au régime général de l’article 39 A du CGI ; les régimes historiques et particuliers sont exclus.',
      'Le calcul ne traite ni valeur résiduelle, ni cession, ni exercice décalé, ni composant séparé ; une entrée vide, incohérente ou hors bornes bloque le plan.',
    ],
    mentionLocale: 'La valeur, la date, la durée et le plan restent dans ce navigateur. Ils ne sont ni envoyés, ni enregistrés, ni réutilisés.',
    proof: 'v2/28-outil-amortissement',
    source: {
      nom: 'Autorité des normes comptables - Plan comptable général, version au 1er janvier 2026',
      url: 'https://www.anc.gouv.fr/plan-comptable-general-0',
      extrait: 'Les articles 214-12 et 214-13 fixent le début de l’amortissement à la consommation des avantages économiques, généralement à la mise en service, et retiennent le linéaire à défaut de mode mieux adapté.',
      verifieeLe: '20 septembre 2026',
      complement: {
        nom: 'DGFiP — BOFiP, modalités de calcul de l’amortissement dégressif',
        url: 'https://bofip.impots.gouv.fr/bofip/4699-PGP.html',
        extrait: 'Les § 120 et 150 donnent les coefficients généraux applicables depuis le 01/01/2010 ; le § 160 distingue le régime majoré de 2008–2009, non calculé ici. Les § 190 à 220 précisent le prorata depuis le mois d’acquisition. Les § 250 et 260 décrivent l’option de passage au quotient résiduel et l’année d’acquisition entière.',
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
    description: 'Modèle de rapprochement bancaire Excel gratuit : téléchargez le .xlsx sans compte, avec exemple fictif, feuille à remplir, formules et écarts visibles.',
    promesse: { entree: 'Période, soldes et éléments de rapprochement', resultat: 'Classeur .xlsx réutilisable et contrôle fictif exportable en CSV' },
    limites: [
      'Le classeur contient un exemple fictif, une feuille à remplir et une notice des signes. Le calcul en ligne et son CSV restent disponibles pour les données fictives.',
      'Ce contrôle de soldes n’apparie pas les lignes, ne passe aucune écriture et ne valide aucun rapprochement à la place du collaborateur.',
      'Une période inversée ou un montant illisible bloque le calcul en ligne. Un écart ou un élément inexpliqué reste visible et exportable avec l’état NON VALIDÉ.',
    ],
    mentionLocale: 'Aucun relevé n’est importé. Le classeur vierge se télécharge sans inscription puis se remplit localement, sans macro ni connexion externe. Les montants fictifs du calcul en ligne restent dans ce navigateur ; son CSV est créé localement.',
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
