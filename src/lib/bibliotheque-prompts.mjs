import { assemblePrompt } from './prompt-comptable.mjs';

export const TRANSFER_KEY = 'memlia:prompt-model:v1';
export const GENERATOR_PATH = '/outils-comptables-gratuits/generateur-prompt-expert-comptable';
export const POLES = [{ id: 'production', label: 'Production' }, { id: 'relation-client', label: 'Relation client' }, { id: 'pilotage', label: 'Pilotage' }];
export const MODEL_FORMATS = [{ id: 'mail', label: 'Mail à relire' }, { id: 'tableau', label: 'Tableau' }, { id: 'liste', label: 'Liste' }, { id: 'note', label: 'Note' }];
// Corpus original : sorties attendues rédigées, jamais présentées comme des réponses de modèle.
export const MODELS = [
  { id: 'relance-pieces', title: 'Relance de pièces', pole: 'relation-client', format: 'mail', task: 'pieces',
    context: 'Une liste abstraite distingue les pièces reçues des pièces attendues.',
    description: 'Préparer un brouillon de relance limité aux pièces fictives encore attendues.',
    input: 'Liste fictive des pièces attendues et reçues, ton et canal autorisés par le cabinet.',
    output: 'Objet, brouillon court sans destinataire réel, puis points à vérifier avant envoi.',
    human: 'Le collaborateur vérifie les pièces nécessaires, choisit le destinataire et décide de l’envoi.',
    stop: 'Une pièce a deux statuts ou la liste attendue n’est pas fournie.',
    exampleIn: 'Attendus : relevé fictif et justificatif fictif. Reçu : relevé fictif. Ton : courtois.',
    exampleOut: 'Objet : pièce à compléter. Bonjour, pourriez-vous nous transmettre le justificatif encore attendu ? Merci. À vérifier : la pièce est-elle toujours nécessaire ? Aucun envoi effectué.' },
  { id: 'accuse-reception', title: 'Accusé de réception', pole: 'relation-client', format: 'mail', task: 'pieces',
    context: 'Une liste fictive permet de reconnaître uniquement ce qui a été reçu.',
    description: 'Préparer un accusé de réception sans affirmer que les pièces sont validées.',
    input: 'Liste fictive des éléments reçus et indication explicite des contrôles encore en attente.',
    output: 'Brouillon de réception séparant réception matérielle et contrôle du contenu.',
    human: 'Le collaborateur vérifie la réception effective et décide du message à envoyer.',
    stop: 'La réception est incertaine ou une consigne demande de déclarer les pièces conformes.',
    exampleIn: 'Reçu : document fictif alpha. Contrôle de contenu : en attente.',
    exampleOut: 'Bonjour, nous avons reçu le document alpha. Sa lecture reste à effectuer. À vérifier : réception effective. Aucun avis de conformité ni envoi.' },
  { id: 'liste-pieces', title: 'Liste des pièces attendues', pole: 'relation-client', format: 'mail', task: 'pieces',
    context: 'Le cabinet a déjà défini une liste de pièces pour une tâche abstraite.',
    description: 'Mettre en forme la liste fictive des pièces choisies par le cabinet.',
    input: 'Liste de pièces déjà décidée, objectif abstrait et format de demande autorisé.',
    output: 'Brouillon ordonné reprenant uniquement les pièces explicitement fournies.',
    human: 'Le cabinet choisit la liste nécessaire et confirme les modalités de transmission.',
    stop: 'L’objectif manque ou il faudrait deviner une pièce ou une obligation.',
    exampleIn: 'Objectif fictif : préparer une lecture. Pièces choisies : document alpha et document bêta.',
    exampleOut: 'Pour préparer la lecture, merci de réunir les documents alpha et bêta. À vérifier : modalité de transmission à préciser. Aucune autre pièce ajoutée.' },
  { id: 'tri-exceptions', title: 'Tri des exceptions', pole: 'production', format: 'tableau', task: 'ecarts',
    context: 'Des observations fictives doivent être regroupées sans décider leur résolution.',
    description: 'Classer des exceptions fictives selon les catégories explicites fournies.',
    input: 'Observations fictives et catégories de tri définies par le cabinet.',
    output: 'Tableau observation, catégorie proposée, justification et question ouverte.',
    human: 'Le responsable valide le classement et décide des vérifications nécessaires.',
    stop: 'Une observation ne correspond à aucune catégorie ou relève de plusieurs catégories.',
    exampleIn: 'Catégories : absence, contradiction. Observation alpha : pièce absente.',
    exampleOut: 'Observation alpha | absence proposée | pièce absente | demander si la pièce est requise. Le classement reste à valider.' },
  { id: 'synthese-suivi', title: 'Synthèse du suivi', pole: 'pilotage', format: 'tableau', task: 'synthese',
    context: 'Un suivi agrégé fictif distingue le travail préparé des points encore ouverts.',
    description: 'Résumer un suivi fictif en états factuels et questions pour le responsable.',
    input: 'États agrégés fictifs sans nom de collaborateur, définition de chaque état.',
    output: 'Tableau état, fait disponible, point ouvert et prochaine validation.',
    human: 'Le responsable interprète le suivi et décide des priorités sans classement individuel.',
    stop: 'Un état est non défini, incohérent ou demanderait d’évaluer une personne.',
    exampleIn: 'Groupe fictif alpha : préparation achevée, validation en attente. États définis explicitement.',
    exampleOut: 'Alpha | préparation achevée | validation en attente | demander au responsable la prochaine étape. Aucune performance individuelle déduite.' },
  { id: 'reformulation-note', title: 'Reformulation d’une note', pole: 'production', format: 'note', task: 'synthese',
    context: 'Une note abstraite doit devenir lisible sans changer son contenu ni sa prudence.',
    description: 'Reformuler une note fictive en conservant les incertitudes et questions.',
    input: 'Note fictive, vocabulaire autorisé et faits à conserver sans ajout.',
    output: 'Note courte puis liste des ambiguïtés qui nécessitent une relecture.',
    human: 'L’auteur vérifie que le sens et les réserves de sa note sont conservés.',
    stop: 'Une phrase ambiguë exige de choisir une interprétation ou d’inventer un fait.',
    exampleIn: 'Note fictive : document lisible ; origine à vérifier avant poursuite.',
    exampleOut: 'Le document est lisible. Son origine reste à vérifier avant de poursuivre. Question ouverte : qui confirme cette origine ?' },
  { id: 'ordre-du-jour', title: 'Ordre du jour', pole: 'pilotage', format: 'liste', task: 'synthese',
    context: 'Des sujets abstraits doivent être organisés pour un échange de validation.',
    description: 'Organiser les sujets fictifs en ordre du jour sans fixer les décisions.',
    input: 'Sujets fictifs, objectif de réunion et priorités déjà définies par le cabinet.',
    output: 'Liste de sujets, information requise et question à soumettre à chaque étape.',
    human: 'Le responsable choisit l’ordre final, les participants et les décisions de réunion.',
    stop: 'La priorité n’est pas fournie ou un sujet exige une conclusion métier.',
    exampleIn: 'Objectif : clarifier le suivi. Priorité fournie : pièce manquante puis validation.',
    exampleOut: 'D’abord : pièce manquante, préciser le besoin. Ensuite : validation, désigner la prochaine vérification. Aucune décision de réunion anticipée.' },
  { id: 'compte-rendu', title: 'Compte rendu', pole: 'pilotage', format: 'note', task: 'synthese',
    context: 'Des notes fictives distinguent les décisions rapportées des propositions discutées.',
    description: 'Structurer des notes fictives en compte rendu et points à confirmer.',
    input: 'Notes fictives avec décision explicite, proposition et question non résolue.',
    output: 'Note distinguant fait rapporté, proposition, décision fournie et action à confirmer.',
    human: 'Les participants confirment le compte rendu et l’attribution des actions.',
    stop: 'Une proposition n’a pas de statut explicite ou une décision est contradictoire.',
    exampleIn: 'Notes fictives : relire le suivi proposé ; aucune décision rapportée ; rôle à confirmer.',
    exampleOut: 'Proposition : relire le suivi. Décisions rapportées : aucune. Point ouvert : confirmer le rôle chargé de la relecture.' },
  { id: 'checklist-transmission', title: 'Checklist de transmission', pole: 'production', format: 'liste', task: 'controle',
    context: 'Une procédure abstraite définit les points à préparer avant une transmission.',
    description: 'Décliner une procédure fictive en checklist avant validation de transmission.',
    input: 'Procédure abstraite validée, contrôles attendus et rôle chargé de la validation.',
    output: 'Checklist point à contrôler, élément attendu et statut à renseigner humainement.',
    human: 'Le collaborateur vérifie chaque point et décide si la transmission peut avoir lieu.',
    stop: 'Un contrôle manque de critère ou le rôle de validation n’est pas défini.',
    exampleIn: 'Procédure fictive : vérifier la lisibilité puis faire relire par le collaborateur.',
    exampleOut: 'Lisibilité | document lisible attendu | à vérifier. Relecture | collaborateur attendu | à confirmer. Aucun statut de réussite présumé.' },
  { id: 'tableau-controles', title: 'Tableau de contrôles', pole: 'production', format: 'tableau', task: 'controle',
    context: 'Une règle fournie doit être rendue lisible sans affirmer qu’elle a été appliquée.',
    description: 'Présenter les contrôles d’une procédure fictive dans un tableau à compléter.',
    input: 'Règle abstraite validée, critères explicites et liste des points de contrôle.',
    output: 'Tableau contrôle, critère fourni, résultat à renseigner et limite.',
    human: 'Le cabinet applique la règle, renseigne le constat et décide des suites.',
    stop: 'Un critère est absent ou deux règles prescrivent des lectures incompatibles.',
    exampleIn: 'Contrôle fictif : présence du document alpha. Critère : document disponible.',
    exampleOut: 'Présence alpha | document disponible | résultat à renseigner | arrêt si indisponible. Aucun contrôle déclaré effectué.' },
  { id: 'synthese-ecarts', title: 'Synthèse des écarts fictifs', pole: 'production', format: 'tableau', task: 'ecarts',
    context: 'Des différences abstraites sont décrites pour préparer une lecture humaine.',
    description: 'Résumer des écarts fictifs sans choisir une correction ni une imputation.',
    input: 'Observations fictives avec attendu, constat et limite explicitement fournis.',
    output: 'Tableau attendu, constat, écart descriptif et question de vérification.',
    human: 'Le cabinet interprète l’écart et décide des éventuelles corrections.',
    stop: 'L’attendu ou le constat manque, ou l’origine de l’écart n’est pas expliquée.',
    exampleIn: 'Attendu fictif : référence alpha. Constat fictif : référence bêta. Origine inconnue.',
    exampleOut: 'Alpha attendu | bêta constaté | différence de référence | arrêt : origine à expliquer par le cabinet. Aucune correction proposée comme certaine.' },
  { id: 'fiche-regle', title: 'Fiche de règle', pole: 'pilotage', format: 'note', task: 'controle',
    context: 'Une règle abstraite déjà décidée doit être documentée pour être relue.',
    description: 'Mettre en forme une règle fictive en conditions, préparation et arrêt.',
    input: 'Règle abstraite fournie par le cabinet avec périmètre et validation explicites.',
    output: 'Fiche condition, préparation permise, validation requise et arrêt dans le doute.',
    human: 'Le responsable confirme le périmètre et approuve la règle écrite.',
    stop: 'La règle est incomplète, contradictoire ou sort du périmètre fourni.',
    exampleIn: 'Règle fictive : document lisible permet une synthèse ; absence arrête ; collaborateur relit.',
    exampleOut: 'Condition : lisible. Préparation : synthèse. Validation : collaborateur. Arrêt : document absent. Périmètre et règle à approuver.' },
].map((m) => ({ ...m, seed: {
  task: m.task, input: m.task === 'pieces' ? 'liste' : m.task === 'controle' ? 'procedure' : 'notes',
  format: m.format === 'tableau' ? 'tableau' : m.format === 'liste' ? 'liste' : 'brouillon',
  validator: 'collaborateur', stop: 'absent', description: m.description,
} }));

export function modelPrompt(model) {
  const result = assemblePrompt({ ...model.seed, confirmed: true });
  if (!result.ok) throw new Error(result.error);
  // Enrichir les blocs existants avec la tâche, sans dupliquer les rubriques ni affaiblir les gardes.
  return result.text
    .replace('## But\n', `Contexte de la fiche : ${model.context}\n\n## But\n`)
    .replace('## Résultat attendu\n', `Entrées de la fiche : ${model.input}\n\n## Résultat attendu\n`)
    .replace('## Frontière\n', `Format de la fiche : ${model.output}\n\n## Frontière\n`)
    .replace('## Arrêt\n', `Décision réservée : ${model.human}\n\n## Arrêt\n`)
    .replace('## Jeu d’essai fictif\n', `Arrêt de la fiche : ${model.stop}\n\n## Jeu d’essai fictif\n`)
    + `\n\nEntrée fictive propre à la fiche : ${model.exampleIn}\nSortie attendue rédigée (pas une réponse de modèle) : ${model.exampleOut}`;
}
const normalize = (value) => value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
export function filterModels({ pole = '', format = '', task = '', query = '' } = {}) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  return MODELS.filter((m) => (!pole || m.pole === pole) && (!format || m.format === format) && (!task || m.id === task) && words.every((word) => normalize(`${m.title} ${m.context} ${m.description} ${m.input} ${m.output}`).includes(word)));
}
export function parseTransfer(raw) {
  try {
    const value = JSON.parse(raw);
    if (value?.version !== 1 || Object.keys(value).sort().join(',') !== 'id,version') return null;
    return MODELS.find((m) => m.id === value.id) ?? null;
  } catch { return null; }
}
