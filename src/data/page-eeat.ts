import type { IdAuteur } from './auteurs';

/**
 * Une source publique d'une page. Décision de Kevin du 06/10/2026 : aucune section « Sources » ; la source se cite par
 * un lien posé sur un mot ou un chiffre du texte de la page, `mot`, présent tel quel dans ce texte.
 */
export interface SourcePrimaire {
  editeur: string;
  titre: string;
  url: string;
  consulteLe: string;
  /** Ce que la source établit, et ce qu'elle n'établit pas : la règle de citation, pour la relecture. */
  preuve: string;
  /** Les mots du texte de la page qui portent le lien. */
  mot: string;
}

export interface PageEeat {
  auteur: IdAuteur;
  datePublication: string;
  dateModification: string;
  sources: SourcePrimaire[];
}

const consulteLe = '2026-09-20';

const sources = {
  dsnVal: {
    editeur: 'Net-entreprises',
    titre: 'Outils d’auto-contrôle Dsn-Val et brique de contrôle',
    url: 'https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/',
    consulteLe,
    preuve: 'Cette source borne le contrôle du fichier avant dépôt. Elle ne transforme ni ce contrôle ni l’automatisation en validation de la paie.',
    mot: 'tout dépôt',
  },
  mentionsFacture: {
    editeur: 'Service Public Entreprendre',
    titre: 'Quelles sont les mentions obligatoires sur une facture ?',
    url: 'https://entreprendre.service-public.gouv.fr/vosdroits/F31808',
    consulteLe,
    preuve: 'Cette source établit que la présence de champs peut être contrôlée. Elle ne décide ni de l’imputation ni de la validité d’une écriture.',
    mot: 'les champs',
  },
  fraisTransport: {
    editeur: 'Service Public',
    titre: 'Remboursement des frais de transport domicile-travail d’un salarié du secteur privé',
    url: 'https://www.service-public.fr/particuliers/vosdroits/F19846',
    consulteLe,
    preuve: 'Ce cas officiel montre qu’un remboursement de frais dépend de pièces et de conditions propres. Il ne définit pas à lui seul toutes les notes de frais.',
    mot: 'un justificatif',
  },
  planComptable: {
    editeur: 'Autorité des normes comptables',
    titre: 'Plan comptable général',
    url: 'https://www.anc.gouv.fr/plan-comptable-general-0',
    consulteLe,
    preuve: 'Cette source porte le cadre des enregistrements comptables. Elle ne fait pas du rapprochement bancaire une décision automatisable.',
    mot: 'des écritures',
  },
  principesRgpd: {
    editeur: 'CNIL',
    titre: 'Règlement européen sur la protection des données, chapitre 2 : principes',
    url: 'https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2',
    consulteLe,
    preuve: 'Cette source borne la minimisation des données. Elle ne prouve ni une certification ni une conformité générale de Memlia.',
    mot: 'des données fictives',
  },
  controleSalaries: {
    editeur: 'CNIL',
    titre: 'Travail, ressources humaines : le contrôle de l’activité des personnes employées',
    url: 'https://www.cnil.fr/fr/controle-de-lactivite-des-personnes-employees',
    consulteLe,
    preuve: 'Cette source étaye la limite anti-surveillance. La garantie Memlia reste plus étroite : des vues agrégées, jamais un classement nominatif.',
    mot: 'une mesure individuelle continue',
  },
} satisfies Record<string, SourcePrimaire>;

// Factures fournisseurs : la page dit elle-même ne supposer aucune obligation réglementaire ; la fiche sur la
// facturation électronique n'y étayait aucun mot du texte, elle n'est plus citée (revue de #166, 07/10/2026).
export const SERVICE_EEAT = {
  'secretariat-juridique': {
    auteur: 'kevin', datePublication: '2026-10-08', dateModification: '2026-10-08',
    sources: [{ editeur: 'Service Public Entreprendre', titre: 'Dépôt des comptes annuels d’une société', url: 'https://entreprendre.service-public.gouv.fr/vosdroits/F31214', consulteLe: '2026-10-06', preuve: 'La sanction concerne le non-dépôt, sans conséquence automatique du suivi fictif ni garantie d’évitement.', mot: 'une amende pénale de 1 500 euros' }],
  },
  'entrees-sorties-salaries': {
    auteur: 'kevin', datePublication: '2026-10-07', dateModification: '2026-10-07',
    sources: [{ editeur: 'Silae', titre: 'Gérer les salariés de A à Z', url: 'https://www.silae.fr/solution-rh-paie/gestion-des-salaries/', consulteLe: '2026-10-06', preuve: 'Le circuit du portail garde la création du salarié et la transmission de la DPAE. La préparation hors portail ne double pas ces gestes.', mot: 'mySilae' }],
  },
  paie: { auteur: 'kevin', datePublication: '2026-09-20', dateModification: '2026-10-06', sources: [sources.dsnVal] },
  'saisie-comptable': { auteur: 'kevin', datePublication: '2026-09-20', dateModification: '2026-10-06', sources: [sources.mentionsFacture] },
  'rapprochement-bancaire': { auteur: 'kevin', datePublication: '2026-09-20', dateModification: '2026-10-06', sources: [sources.planComptable] },
  'notes-de-frais': { auteur: 'kevin', datePublication: '2026-09-20', dateModification: '2026-10-06', sources: [sources.fraisTransport] },
  'factures-fournisseurs': { auteur: 'kevin', datePublication: '2026-09-20', dateModification: '2026-10-06', sources: [] },
} satisfies Record<string, PageEeat>;

export const COMMERCIAL_EEAT = {
  '/automatisation-cabinet-comptable': {
    auteur: 'kevin', datePublication: '2026-09-16', dateModification: '2026-10-08',
    sources: [
      { ...sources.principesRgpd, consulteLe: '2026-10-08' },
      {
        editeur: 'H2A',
        titre: 'NEP 200 — Principes applicables à l’audit des comptes',
        url: 'https://h2a-france.org/normes/audit-des-comptes-mis-en-oeuvre-dans-le-cadre-de-la-certification-des-comptes/',
        consulteLe: '2026-10-08',
        preuve: 'Les paragraphes 01, 06 et 07 réservent l’opinion, l’appréciation des éléments et le choix des procédures au commissaire aux comptes. Ils ne valident pas une automatisation Memlia.',
        mot: 'la sélection des travaux, leur appréciation et l’opinion',
      },
    ],
  },
  '/methode': {
    auteur: 'kevin', datePublication: '2026-09-16', dateModification: '2026-10-04', sources: [],
  },
  '/garanties': {
    auteur: 'kevin', datePublication: '2026-09-16', dateModification: '2026-10-06', sources: [sources.controleSalaries],
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

const echapper = (texte: string): string =>
  texte.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const motif = (texte: string) => texte.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Le texte porte déjà un lien vers la source, posé sur son `mot`. */
const dejaLiee = (html: string, source: SourcePrimaire) =>
  new RegExp(`<a\\s[^>]*href="${motif(echapper(source.url))}"[^>]*>${motif(source.mot)}</a>`).test(html);

/**
 * Le HTML rendu d'une page, avec le lien de chacune de ses sources posé sur la première occurrence de son `mot` :
 * dans le texte, jamais dans une balise ni dans un lien existant. Un mot introuvable arrête la construction plutôt
 * que de laisser une source sans lien. Une source que le texte lie déjà sur son mot reste telle quelle, comme les
 * sources d'article déjà citées dans le corps (Article.astro).
 */
export function lierSources(html: string, liste: readonly SourcePrimaire[]): string {
  return liste.reduce((courant, source) => {
    if (dejaLiee(courant, source)) return courant;
    const morceaux = courant.split(/(<[^>]*>)/);
    let dansUnLien = false;
    let rang = -1;
    for (let i = 0; i < morceaux.length && rang === -1; i += 1) {
      const morceau = morceaux[i] ?? '';
      if (morceau.startsWith('<')) {
        if (/^<a[\s>]/i.test(morceau)) dansUnLien = true;
        else if (/^<\/a\s*>/i.test(morceau)) dansUnLien = false;
      } else if (!dansUnLien && morceau.includes(source.mot)) {
        rang = i;
      }
    }
    if (rang === -1) throw new Error(`Source ${source.editeur} : « ${source.mot} » est introuvable dans le texte de la page.`);
    const lien = `<a href="${echapper(source.url)}" rel="noopener noreferrer" title="${echapper(`${source.editeur} — ${source.titre}`)}">${source.mot}</a>`;
    return morceaux.map((morceau, i) => (i === rang ? morceau.replace(source.mot, () => lien) : morceau)).join('');
  }, html);
}
