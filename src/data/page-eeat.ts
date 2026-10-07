import type { IdAuteur } from './auteurs';

export interface SourcePrimaire {
  editeur: string;
  titre: string;
  url: string;
  consulteLe: string;
  preuve: string;
}

export interface ExperiencePremiereMain {
  titre: string;
  href: string;
  lien: string;
}

export interface PageEeat {
  auteur: IdAuteur;
  datePublication: string;
  dateModification: string;
  sources: SourcePrimaire[];
  experience?: ExperiencePremiereMain;
}

const consulteLe = '2026-09-20';

const sources = {
  dsnVal: {
    editeur: 'Net-entreprises',
    titre: 'Outils d’auto-contrôle Dsn-Val et brique de contrôle',
    url: 'https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/',
    consulteLe,
    preuve: 'Cette source borne le contrôle du fichier avant dépôt. Elle ne transforme ni ce contrôle ni l’automatisation en validation de la paie.',
  },
  mentionsFacture: {
    editeur: 'Service Public Entreprendre',
    titre: 'Quelles sont les mentions obligatoires sur une facture ?',
    url: 'https://entreprendre.service-public.gouv.fr/vosdroits/F31808',
    consulteLe,
    preuve: 'Cette source établit que la présence de champs peut être contrôlée. Elle ne décide ni de l’imputation ni de la validité d’une écriture.',
  },
  facturationElectronique: {
    editeur: 'Service Public Entreprendre',
    titre: 'Comment se mettre en conformité avec l’obligation de facturation électronique ?',
    url: 'https://entreprendre.service-public.gouv.fr/vosdroits/F39785',
    consulteLe,
    preuve: 'Cette source décrit le suivi du cycle de vie et le signalement d’une anomalie. Elle ne prouve aucun traitement automatique par Memlia.',
  },
  fraisTransport: {
    editeur: 'Service Public',
    titre: 'Remboursement des frais de transport domicile-travail d’un salarié du secteur privé',
    url: 'https://www.service-public.fr/particuliers/vosdroits/F19846',
    consulteLe,
    preuve: 'Ce cas officiel montre qu’un remboursement de frais dépend de pièces et de conditions propres. Il ne définit pas à lui seul toutes les notes de frais.',
  },
  planComptable: {
    editeur: 'Autorité des normes comptables',
    titre: 'Plan comptable général',
    url: 'https://www.anc.gouv.fr/plan-comptable-general-0',
    consulteLe,
    preuve: 'Cette source porte le cadre des enregistrements comptables. Elle ne fait pas du rapprochement bancaire une décision automatisable.',
  },
  principesRgpd: {
    editeur: 'CNIL',
    titre: 'Règlement européen sur la protection des données, chapitre 2 : principes',
    url: 'https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2',
    consulteLe,
    preuve: 'Cette source borne la minimisation des données. Elle ne prouve ni une certification ni une conformité générale de Memlia.',
  },
  controleSalaries: {
    editeur: 'CNIL',
    titre: 'Travail, ressources humaines : le contrôle de l’activité des personnes employées',
    url: 'https://www.cnil.fr/fr/controle-de-lactivite-des-personnes-employees',
    consulteLe,
    preuve: 'Cette source étaye la limite anti-surveillance. La garantie Memlia reste plus étroite : des vues agrégées, jamais un classement nominatif.',
  },
} satisfies Record<string, SourcePrimaire>;

const cicatriceCadrage: ExperiencePremiereMain = {
  titre: 'Le questionnaire revenu vide qui a changé notre cadrage',
  href: '/blog/pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils',
  lien: 'Cette expérience datée explique pourquoi le cadrage doit faire remonter les champs manquants au lieu de supposer que la règle est complète.',
};

export const SERVICE_EEAT = {
  'registres-obligations': {
    auteur: 'kevin', datePublication: '2026-10-07', dateModification: '2026-10-07',
    sources: [{ editeur: 'Service Public Entreprendre', titre: 'Déclaration de créances', url: 'https://entreprendre.service-public.gouv.fr/vosdroits/F22359', consulteLe: '2026-10-06', preuve: 'Le délai général et les points de départ particuliers bornent le calcul fictif ; le cabinet vérifie la date applicable et les prorogations avant inscription.' }],
  },
  paie: { auteur: 'kevin', datePublication: '2026-09-20', dateModification: '2026-09-20', sources: [sources.dsnVal] },
  'saisie-comptable': { auteur: 'kevin', datePublication: '2026-09-20', dateModification: '2026-09-20', sources: [sources.mentionsFacture] },
  'rapprochement-bancaire': { auteur: 'kevin', datePublication: '2026-09-20', dateModification: '2026-09-20', sources: [sources.planComptable] },
  'notes-de-frais': { auteur: 'kevin', datePublication: '2026-09-20', dateModification: '2026-09-20', sources: [sources.fraisTransport] },
  'factures-fournisseurs': { auteur: 'kevin', datePublication: '2026-09-20', dateModification: '2026-09-20', sources: [sources.facturationElectronique] },
} satisfies Record<string, PageEeat>;

export const COMMERCIAL_EEAT = {
  '/automatisation-cabinet-comptable': {
    auteur: 'kevin', datePublication: '2026-09-16', dateModification: '2026-10-04', sources: [sources.principesRgpd], experience: cicatriceCadrage,
  },
  '/methode': {
    auteur: 'kevin', datePublication: '2026-09-16', dateModification: '2026-10-04', sources: [], experience: cicatriceCadrage,
  },
  '/garanties': {
    auteur: 'kevin', datePublication: '2026-09-16', dateModification: '2026-10-04', sources: [sources.controleSalaries],
  },
  '/a-propos': {
    auteur: 'kevin', datePublication: '2026-09-16', dateModification: '2026-09-21', sources: [],
  },
} satisfies Record<string, PageEeat>;

export function eeatService(slug: string): PageEeat {
  const config = SERVICE_EEAT[slug as keyof typeof SERVICE_EEAT];
  if (!config) throw new Error(`Attribution E-E-A-T absente pour /automatisation/${slug}`);
  return config;
}

export function eeatCommercial(chemin: string): PageEeat | null {
  return COMMERCIAL_EEAT[chemin as keyof typeof COMMERCIAL_EEAT] ?? null;
}
