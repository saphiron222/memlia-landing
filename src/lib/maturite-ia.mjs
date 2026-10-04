/** Rubrique déclarative originale Memlia, version 1. Aucun score ni norme. */
export const OPTIONS = [
  { value: 'inconnu', label: 'Je ne sais pas' },
  { value: 'non-commence', label: 'Non commencé' },
  { value: 'en-essai', label: 'En essai' },
  { value: 'formalise', label: 'Formalisé' },
];
/** @type {Record<string, string>} */
export const STATES = { 'incomplet': 'Incomplet', 'a-demarrer': 'À démarrer', 'en-essai': 'En essai', 'formalise': 'Formalisé' };
/** @param {string} id @param {string} label @param {string[]} texts @param {string} action */
const dimension = (id, label, texts, action) => ({ id, label, questions: texts.map((text, i) => ({ id: `${id}_${i + 1}`, text })), action });
export const DIMENSIONS = [
  dimension('usages', 'Usages', [
    'Les tâches pour lesquelles l’IA est essayée sont-elles identifiées ?',
    'Les limites de chaque usage sont-elles décrites ?',
    'Les essais se font-ils sur des situations fictives avant un usage réel ?',
  ], 'Choisir une tâche répétitive et décrire un essai fictif avec ses limites.'),
  dimension('regles', 'Règles', [
    'Les usages autorisés et les usages exclus sont-ils écrits ?',
    'Une personne est-elle désignée pour décider des évolutions de ces règles ?',
    'Les équipes disposent-elles d’une règle commune pour arrêter dans le doute ?',
  ], 'Écrire une règle commune : usage permis, limite et condition d’arrêt.'),
  dimension('donnees', 'Données', [
    'Les données autorisées dans chaque outil IA sont-elles définies ?',
    'Les modalités de traitement des données par les outils choisis sont-elles connues ?',
    'Un contrôle existe-t-il avant de transmettre des informations à un outil IA ?',
  ], 'Définir les données autorisées et vérifier leur traitement avant de poursuivre les usages.'),
  dimension('validation', 'Validation', [
    'Une personne doit-elle relire les résultats avant leur utilisation ?',
    'Les critères de cette relecture sont-ils écrits ?',
    'Les résultats incertains ou inattendus suivent-ils un circuit de décision défini ?',
  ], 'Définir qui relit, selon quels critères et quand arrêter une proposition incertaine.'),
  dimension('mesure', 'Mesure', [
    'Une situation de départ est-elle décrite pour la tâche essayée ?',
    'Les essais suivent-ils le résultat utile et les reprises nécessaires ?',
    'Une décision de poursuivre ou d’arrêter s’appuie-t-elle sur ces observations ?',
  ], 'Mesurer une tâche : situation de départ, résultat utile et reprises, sans suivi individuel.'),
];
export function diagnose(input = {}) {
  const dimensions = DIMENSIONS.map(d => {
    const answers = d.questions.map(q => ({ ...q, value: OPTIONS.some(o => o.value === input[q.id]) ? input[q.id] : 'inconnu' }));
    const state = answers.some(q => q.value === 'inconnu') ? 'incomplet'
      : answers.every(q => q.value === 'formalise') ? 'formalise'
      : answers.every(q => q.value === 'non-commence') ? 'a-demarrer' : 'en-essai';
    return { id: d.id, label: d.label, state, answers };
  });
  // Ordre de travail transparent : données, validation, règle, mesure, usage.
  const order = ['donnees', 'validation', 'regles', 'mesure', 'usages'];
  const priorities = order.map(id => dimensions.find(d => d.id === id)).filter(d => d.state !== 'formalise').slice(0, 3).map(d => {
    const evidence = d.answers.filter(q => q.value !== 'formalise');
    const unknown = evidence.some(q => q.value === 'inconnu');
    return { dimension: d.id, kind: unknown ? 'clarifier' : 'cadrer',
      action: unknown ? `Clarifier les réponses inconnues de la dimension ${d.label.toLowerCase()}, puis décider de la prochaine action.` : DIMENSIONS.find(item => item.id === d.id).action,
      evidence };
  });
  if (!priorities.length) {
    for (const id of ['validation', 'regles', 'mesure']) {
      const d = dimensions.find(item => item.id === id);
      priorities.push({ dimension: id, kind: 'suivi', action: id === 'validation' ? 'Suivre les exceptions et rejouer les cas inattendus.' : id === 'regles' ? 'Relire la règle commune quand un usage ou un outil change.' : 'Comparer les observations de la tâche et décider de la suite.', evidence: d.answers });
    }
  }
  return { version: 1, dimensions, unknowns: dimensions.flatMap(d => d.answers.filter(q => q.value === 'inconnu')), priorities };
}
export const answerLabel = value => OPTIONS.find(o => o.value === value)?.label ?? 'Je ne sais pas';
export function reportMarkdown(result) {
  return [
    '# Diagnostic de maturité IA du cabinet',
    'Méthode Memlia déclarative, version 1. Réponses déclarées, non vérifiées. Pas audit normatif, classement individuel ni estimation de gain.',
    ...result.dimensions.flatMap(d => [`\n## ${d.label} : ${STATES[d.state]}`, ...d.answers.map(q => `- ${q.text} ${answerLabel(q.value)}`)]),
    `\n## Inconnues : ${result.unknowns.length}`, ...result.unknowns.map(q => `- ${q.text}`),
    '\n## Prochaines actions proposées', ...result.priorities.flatMap((p, i) => [`\n${i + 1}. ${p.action}`, ...p.evidence.map(q => `   - Justification : ${q.text} ${answerLabel(q.value)}`)]),
    '\nOrdre de travail Memlia : données, validation, règle, mesure, usage ; retenir les trois premières dimensions non formalisées. Une inconnue demande clarification, pas un jugement défavorable. Si tout est formalisé, suivre les exceptions, relire les règles et comparer les observations.',
    'La décision et la vérification des pratiques restent au cabinet.',
  ].join('\n') + '\n';
}
