import type { Specialiste } from '../specialistes.ts';

/**
 * Raphaël · RH du cabinet (AGENTS-CONTENU.md §10) : carte, démonstration, familles titulaires et logiciels. Sa carte
 * mène à /agents-ia/rh-cabinet ; le contenu de la fiche (`fiche`) s'écrit à la tâche 9, et `publie` passe alors à
 * `true` (une fiche publiée sans contenu ne se construit pas).
 */
export const RH_CABINET: Specialiste = {
  slug: 'rh-cabinet',
  prenom: 'Raphaël',
  libelle: 'RH du cabinet',
  groupe: 'vie-cabinet',
  teinte: 'rh-formation',
  publie: false,
  destination: { type: 'fiche' },
  ligne: 'Prépare les documents RH de votre équipe, de l’annonce à la synthèse de rémunération ; les décisions sur les personnes restent à vous.',
  frontiereEnBref: [
    'Rassembler depuis la paie tenue et vos modèles',
    'Chaque document remis à un salarié ou à un candidat',
    'Toute appréciation sur une personne',
  ],
  familles: ['rh-interne-cabinet', 'formation-ia-competences', 'synthese-remuneration', 'indicateurs-sociaux-cabinet'],
  servicesLies: [],
  logiciels: ['Silae', 'Microsoft Excel', 'Microsoft Outlook', 'Gmail', 'Microsoft SharePoint', 'Youtrust', 'Docusign'],
  avatar: null,
  demonstration: {
    tache: 'synthèse de rémunération',
    dossier: 'Dossier fictif : le cabinet Alouette, cabinet inventé, synthèse de rémunération 2025 d’une collaboratrice inventée.',
    regle: 'La synthèse reprend, pour l’année, chaque élément de rémunération que la paie tenue enregistre, avec sa rubrique et son mois d’origine, sans rien recalculer ; une rubrique nouvelle reçoit un libellé proposé, à valider. Une rubrique présente dans deux sources aux montants différents, une donnée sensible non prévue par la règle ou une demande d’appréciation de la personne arrête la synthèse.',
    cas: [
      { cas: 'Salaire de base de l’année et prime annuelle versée en décembre', sortie: 'Lignes reprises avec leur rubrique et leur mois', issue: 'Préparé' },
      { cas: 'Rubrique créée cette année pour le forfait mobilités durables', sortie: 'Ligne reprise, libellé proposé pour la synthèse', issue: 'À valider' },
      { cas: 'Avantage en nature véhicule présent dans la paie et dans un tableau annexe, montants différents', sortie: 'Synthèse suspendue. Motif : double source ; les deux montants présentés côte à côte', issue: 'Arrêt' },
      { cas: 'Demande d’ajouter un commentaire sur la performance de l’année', sortie: 'Aucun commentaire rédigé. Motif : appréciation d’une personne, hors de la règle', issue: 'Arrêt' },
    ],
  },
};
