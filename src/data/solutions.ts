/** Les deux prestations dédiées, distinctes du catalogue robots/agents. */
export interface BlocSolution { titre: string; texte: string }
export interface Solution {
  id: 'os' | 'modele'; chemin: string; nom: string; surtitre: string; h1: string; intro: string;
  title: string; description: string; query: string; audience: string; image: string;
  probleme: { titre: string; texte: string; cartes: BlocSolution[] };
  livrables: BlocSolution[]; etapes: BlocSolution[]; faq: { question: string; reponse: string }[];
  final: string;
}
export const SOLUTIONS: Record<Solution['id'], Solution> = {
  os: {
    id:'os', chemin:'/memoire-collective-cabinet-comptable', nom:'Memlia OS', surtitre:'La mémoire collective du cabinet',
    h1:'Le savoir du cabinet. Au travail avec vous.',
    intro:'Vos procédures, vos dossiers et vos décisions sont dispersés entre vos outils. Nous les relions à une mémoire partagée, que vos équipes et vos agents IA peuvent utiliser avec les bons accès.',
    title:'Mémoire collective du cabinet comptable · Memlia OS',
    description:'Mémoire collective du cabinet comptable : reliez vos connaissances, vos outils et vos agents IA dans un environnement dédié, avec accès et validations définis.',
    query:'mémoire collective cabinet comptable', audience:'Cabinets d’expertise comptable', image:'/assets/solutions/og-os.webp',
    probleme:{ titre:'Le bon savoir, au moment de faire.', texte:'Une réponse dans un courriel. Une procédure dans un dossier partagé. Une décision connue d’une seule personne. Memlia OS remet ce contexte à disposition du travail autorisé.', cartes:[
      {titre:'Retrouver une réponse',texte:'Votre équipe interroge les sources du cabinet et retrouve les documents qui étayent la réponse.'},
      {titre:'Transmettre une façon de faire',texte:'Vos procédures validées deviennent des consignes réutilisables, avec leur version et leur responsable.'},
      {titre:'Faire avancer une tâche',texte:'Un agent prépare le travail avec ce contexte. Les validations et les exceptions restent visibles.'},
    ]},
    livrables:[
      {titre:'Une mémoire avec ses sources',texte:'Les espaces autorisés sont indexés. Chaque document conserve son origine, sa version et ses droits d’accès.'},
      {titre:'Un espace pour votre équipe',texte:'Questions, documents retrouvés, tâches en cours et reprises sont réunis dans un espace de travail commun.'},
      {titre:'Des agents reliés au contexte',texte:'Les agents du catalogue ou construits sur mesure utilisent les connaissances et les outils prévus pour leur tâche.'},
      {titre:'Une installation maintenue',texte:'Configuration, tests d’accès, sauvegarde et reprise sont documentés. Nous maintenons les connexions et les règles convenues.'},
    ],
    etapes:[
      {titre:'Choisir un premier usage',texte:'Nous partons d’une équipe, d’un ensemble de sources et d’un résultat : retrouver une procédure ou préparer une réponse, par exemple.'},
      {titre:'Relier et organiser',texte:'Nous définissons les droits, les espaces, les règles de conservation et les outils. Nous préparons la mémoire et les consignes.'},
      {titre:'Éprouver avec votre équipe',texte:'Sources contradictoires, accès retiré, document absent : nous vérifions les réponses et les arrêts avant la mise en service.'},
      {titre:'Déployer et maintenir',texte:'Nous installons dans l’environnement convenu, puis suivons les changements de sources, d’accès et de procédures.'},
    ],
    faq:[
      {question:'Est-ce un nouvel outil comptable ?',reponse:'Memlia OS est la couche de travail qui relie la mémoire du cabinet à ses équipes et à ses agents. Vos logiciels restent les outils de production. Nous définissons ce que le système peut lire et préparer dans chacun d’eux.'},
      {question:'Chaque collaborateur voit-il tous les dossiers ?',reponse:'Nous séparons les espaces et reprenons les autorisations des sources connectées. La recherche filtre les documents selon l’utilisateur avant de les transmettre au modèle. Un accès absent ou incertain arrête la recherche concernée. Le retrait d’un droit fait partie des tests de recette.'},
      {question:'Tout fonctionne-t-il dans le cabinet ?',reponse:'Nous pouvons installer la mémoire et un modèle local sur un boîtier dédié. Une infrastructure privée ou une architecture hybride est aussi possible. Le périmètre précise tous les flux, y compris lecture de documents, modèle, sauvegardes, maintenance et services externes autorisés.'},
      {question:'Mac mini ou matériel NVIDIA ?',reponse:'Nous dimensionnons à partir de vos documents, des modèles nécessaires et des usages simultanés. Un Mac mini peut accueillir un premier périmètre local ; une configuration NVIDIA répond à d’autres besoins de calcul. Le choix et ses limites sont vérifiés avant l’achat. L’installation est choisie pour votre périmètre.'},
      {question:'Les agents peuvent-ils envoyer ou modifier seuls ?',reponse:'Les lectures et préparations suivent les règles configurées. Un envoi, une modification engageante ou une autre action sensible suit la validation prévue. Une consigne trouvée dans un document ne peut pas élargir les permissions d’un agent. Le jugement professionnel reste au cabinet.'},
      {question:'Comment commencer et quel budget prévoir ?',reponse:'Décrivez un usage et les outils concernés, sans transmettre de données client. Nous établissons le périmètre, les critères de recette et le devis. Matériel ou hébergement, installation, connexions, usages IA et maintenance sont identifiés. Le tarif dépend de cette configuration ; aucun nombre de postes ou de dossiers n’est promis sans mesure.'},
    ], final:'Un premier usage. La mémoire qui lui manque.',
  },
  modele:{
    id:'modele', chemin:'/modele-ia-prive-entreprise', nom:'Modèle IA privé', surtitre:'Votre entreprise. Votre intelligence métier.',
    h1:'Une IA formée à votre façon de travailler.',
    intro:'Votre vocabulaire, vos processus et vos exemples validés deviennent la matière d’un modèle adapté à votre entreprise. Nous préparons les données, entraînons, évaluons et déployons une version dont vous maîtrisez l’usage.',
    title:'Modèle IA privé pour entreprise · Entraînement Memlia',
    description:'Modèle IA privé pour entreprise : préparation des données, entraînement spécialisé, évaluation métier et déploiement dédié. Budget et droits définis avant chaque essai.',
    query:'modèle IA privé entreprise', audience:'Entreprises', image:'/assets/solutions/og-modele.webp',
    probleme:{titre:'Votre métier mérite plus qu’une consigne à recopier.',texte:'Les mêmes corrections reviennent : un terme interne, une règle de traitement, un format à respecter. Nous transformons vos bons exemples en apprentissage, puis vérifions ce que le modèle a réellement appris.',cartes:[
      {titre:'Votre vocabulaire',texte:'Vos termes, vos catégories et vos formats de restitution sont travaillés sur des exemples représentatifs.'},
      {titre:'Vos règles de travail',texte:'Le modèle s’exerce à préparer les tâches choisies, à reconnaître les exceptions et à demander une validation.'},
      {titre:'Vos critères de qualité',texte:'Chaque version est comparée au modèle de départ sur des cas métier conservés hors de l’entraînement.'},
    ]},
    livrables:[
      {titre:'Un jeu de données documenté',texte:'Origines, droits d’utilisation, versions et exclusions sont consignés. Les exemples d’entraînement et d’évaluation sont séparés.'},
      {titre:'Une recette reproductible',texte:'Modèle de départ, préparation, paramètres et budget sont enregistrés pour comprendre et rejouer un essai.'},
      {titre:'Un modèle évalué sur votre métier',texte:'Vous recevez les comparaisons, les erreurs et les limites observées. Votre équipe décide de la version à publier.'},
      {titre:'Une version exploitable',texte:'Poids adaptés ou adaptateur, documentation et point d’accès sont remis selon la licence retenue et le périmètre contractuel.'},
    ],
    etapes:[
      {titre:'Préparer les données',texte:'Nous sélectionnons les exemples autorisés, retirons les doublons et les contenus à exclure, puis documentons leur provenance.'},
      {titre:'Qualifier et budgéter',texte:'Nous figeons les cas d’évaluation, comparons les premières approches et fixons une enveloppe que les essais ne peuvent pas relever seuls.'},
      {titre:'Entraîner et comparer',texte:'Nous adaptons un modèle à poids accessibles et mesurons la qualité, les refus, les coûts et les délais face au modèle de départ.'},
      {titre:'Publier et suivre',texte:'Après votre acceptation, nous déployons la version retenue avec un retour à la précédente. Un nouvel apprentissage suit une nouvelle recette.'},
    ],
    faq:[
      {question:'Comment choisissez-vous le modèle de départ ?',reponse:'Nous comparons des bases à poids accessibles, comme Llama, Mistral, Qwen, DeepSeek, Gemma ou gpt-oss, sur votre tâche. Qualité en français, formats attendus, ressources nécessaires et licence de la version retenue guident le choix. Nous vérifions les droits d’adaptation et de déploiement avant l’entraînement.'},
      {question:'Une base documentaire suffit-elle parfois ?',reponse:'Oui. Une recherche documentaire fournit des informations à jour avec leurs sources. L’entraînement travaille surtout le comportement, le vocabulaire et les formats. Nous comparons ces approches et les combinons si utile. Les documents qui changent régulièrement restent dans une mémoire consultable avec contrôle des accès.'},
      {question:'À qui appartient le modèle ?',reponse:'Vous conservez les droits sur vos données et recevez les éléments adaptés prévus au contrat : poids ou adaptateur, recette et documentation. La licence du modèle de départ continue de s’appliquer. Le devis précise les droits d’exploitation, l’export, les éventuelles restrictions et les conditions de réversibilité.'},
      {question:'Quelles données faut-il préparer ?',reponse:'Des exemples de travail autorisés, leurs bonnes réponses et les règles qui les expliquent. Nous vérifions provenance, droits d’utilisation et informations à exclure avant l’entraînement. Les données personnelles et confidentielles demandent un traitement défini : minimisation, accès, conservation et demandes de suppression.'},
      {question:'Où tournent l’entraînement et le modèle ?',reponse:'L’entraînement et l’utilisation peuvent demander des moyens différents. Nous précisons les environnements, les prestataires, la localisation et les flux avant tout traitement. Une installation locale ou une infrastructure dédiée est choisie selon les besoins. Une API généraliste existante ne suffit pas à héberger des poids adaptés.'},
      {question:'Quel prix et que se passe-t-il si l’essai ne progresse pas ?',reponse:'Le devis distingue préparation, essais plafonnés, déploiement, utilisation et maintenance. Nous définissons les critères de réussite avant l’essai. Une version qui n’atteint pas ces critères reste hors production ; nous remettons le bilan et proposons la suite avec votre accord. Aucun gain de qualité n’est garanti avant l’évaluation.'},
    ], final:'Une tâche métier pour entraîner votre première version.',
  },
};
export const COUCHES_OS: BlocSolution[] = [
 {titre:'Vos sources',texte:'Procédures, documents et décisions validées, dans les espaces que vous autorisez.'},
 {titre:'Les accès',texte:'Un utilisateur, ses dossiers et ses permissions. Les contenus interdits restent hors de sa recherche.'},
 {titre:'La mémoire',texte:'Des connaissances retrouvables, avec leur origine et leur date de mise à jour.'},
 {titre:'Les règles',texte:'Vos consignes écrites, leur responsable et les validations attendues.'},
 {titre:'Les savoir-faire',texte:'Des procédures réutilisables par les agents, avec des outils et un périmètre définis.'},
 {titre:'Les agents',texte:'Les agents Memlia préparent leurs tâches avec le contexte autorisé du cabinet.'},
 {titre:'Les sessions',texte:'Un travail reprend avec son contexte utile. Historique et conservation suivent les règles convenues.'},
 {titre:'Les décisions',texte:'Résultat, sources, exceptions et actions à valider : votre équipe garde la main.'},
];
