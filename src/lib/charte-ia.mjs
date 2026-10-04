export const CHARTER_NOTICE = 'Trame non officielle — proposition à relire et à faire adopter par le cabinet. Elle ne remplace pas les ressources de l’Ordre et ne certifie aucune conformité. Aucun usage sur dossier réel n’est autorisé par ce document.';
export const CHARTER_USAGES = {
  relance: 'Relance de pièces : préparer un brouillon sur un dossier fictif ; vérifier les pièces demandées et le destinataire avant tout envoi humain.',
  synthese: 'Synthèse de documents fictifs : préparer une synthèse ; comparer chaque point aux documents sources et signaler toute incertitude.',
  reformulation: 'Reformulation de texte : proposer une rédaction ; vérifier le sens, les chiffres et les engagements avant de la retenir.',
};
const DATA = {
  fictives: 'Uniquement des données fictives créées pour les essais ; aucune copie d’un dossier réel.',
  publiques: 'Uniquement des informations publiques sans donnée personnelle ni information client ; leur présence en ligne ne dispense pas de cette vérification.',
  internes: 'Uniquement des descriptions internes de processus sans donnée personnelle ni information client ; aucun dossier réel, identifiant ou secret d’accès.',
};
const VALIDATION = {
  'chaque-resultat': 'Chaque résultat est relu par le rôle de validation avant utilisation, y compris en interne.',
  'avant-diffusion': 'Avant toute diffusion ou intégration à un travail, le rôle de validation relit le résultat. Une exploration interne non relue reste un brouillon identifié et ne sert pas de base à une décision.',
};
/** @returns {{ok: false, field: string, error: string} | {ok: true, body: string, checklist: string[]}} */
export function generateCharter(input) {
  /** @returns {{ok: false, field: string, error: string}} */
  const fail = (field, error) => ({ ok: false, field, error });
  if (!Array.isArray(input.usages) || !input.usages.length || input.usages.some((id) => !Object.hasOwn(CHARTER_USAGES, id))) return fail('usages', 'Choisissez au moins un usage proposé.');
  if (!Object.hasOwn(DATA, input.donnees)) return fail('donnees', 'Choisissez une famille de données.');
  if (!Object.hasOwn(VALIDATION, input.validation)) return fail('validation', 'Choisissez le moment de validation humaine.');
  if (!['mensuelle', 'trimestrielle', 'avant chaque nouvel usage'].includes(input.frequence)) return fail('frequence', 'Choisissez une fréquence de relecture.');
  if (input.publicFiles !== false) return fail('publicFiles', 'Choix contradictoire : l’envoi de fichiers clients à une IA publique sort du périmètre sans données clients. Décochez ce choix ; ne transmettez aucun dossier réel.');
  for (const field of ['responsable', 'validateur', 'outils', 'formation', 'revision']) {
    if (typeof input[field] !== 'string' || input[field].length > (field === 'outils' || field === 'formation' ? 400 : 160) || /[\u0000-\u0008\u000b-\u001f]/.test(input[field])) return fail(field, 'Saisissez un texte court sans caractères de contrôle.');
  }
  if (input.revision && (!/^\d{4}-\d{2}-\d{2}$/.test(input.revision) || !Number.isFinite(Date.parse(input.revision)) || new Date(input.revision).toISOString().slice(0, 10) !== input.revision)) return fail('revision', 'Indiquez une date de relecture existante.');
  const value = (field) => input[field].trim().replace(/\s+/g, ' ') || 'à compléter';
  const checklist = [];
  for (const [field, item] of Object.entries({ responsable: 'Désigner le rôle responsable des usages.', validateur: 'Désigner le rôle de validation.', outils: 'Décrire les outils retenus et faire vérifier leurs paramètres et conditions.', formation: 'Préparer la formation et le jeu d’essai fictif.', revision: 'Fixer une date de relecture.' })) {
    if (!input[field].trim()) checklist.push(item);
  }
  const body = [
    '## Objet et périmètre',
    'Cette proposition organise une préparation de travail. L’IA prépare ; le cabinet vérifie, saisit et décide. Décision d’adoption : à documenter avant mise en pratique.',
    '## Usages retenus',
    ...[...new Set(input.usages)].map((id) => `- ${CHARTER_USAGES[id]}`),
    'Tout autre usage reste hors périmètre jusqu’à une nouvelle décision documentée du cabinet.',
    '## Données et outils', DATA[input.donnees],
    'Les données clients, personnelles, confidentielles et les fichiers de dossiers réels sont exclus. Les dossiers réels nécessitent un cadrage distinct ; cette trame ne les autorise pas.',
    `Outils retenus (description générique) : ${value('outils')}.`,
    'Avant de retenir un outil, vérifier les accès, les conditions de traitement, la réutilisation des entrées, la conservation et les paramètres. Un point non vérifié suspend son usage.',
    '## Responsabilités et validation',
    `Responsable des usages : ${value('responsable')}.`,
    `Rôle de validation : ${value('validateur')}.`, VALIDATION[input.validation],
    'Comparer les sorties aux sources, relever les erreurs et ne jamais présenter une réponse générée comme une référence vérifiée. Aucune écriture, correction, décision ou transmission automatique n’est prévue.',
    '## Incident et arrêt',
    'Arrêter l’usage si une donnée hors périmètre est détectée, si une réponse paraît incertaine ou si une règle se contredit. Alerter le responsable des usages sans recopier de données sensibles dans le signalement ; faire décider les mesures et la reprise par le cabinet.',
    '## Formation et essais', `Formation prévue : ${value('formation')}.`,
    'Faire pratiquer les usages retenus sur des cas fictifs, y compris un cas qui doit être arrêté. Documenter le contrôle attendu et le rôle chargé de la relecture.',
    '## Révision et arbitrages', `Fréquence de relecture : ${input.frequence}.`, `Prochaine relecture : ${value('revision')}.`,
    'Revoir le périmètre après un nouvel outil, un incident ou un changement de pratique. Documenter les décisions et informer l’équipe avant reprise.',
    'Points restant à décider :', ...(checklist.length ? checklist.map((item) => `- [ ] ${item}`) : ['- [ ] Faire relire les clauses, valider les outils et documenter l’adoption par le cabinet.']),
  ].join('\n\n');
  return { ok: true, body, checklist };
}
export function charterDocument(body) {
  return `# Charte IA du cabinet\n\n${CHARTER_NOTICE}\n\n${body}\n`;
}
