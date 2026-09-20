export const OUTILS_HUB_PATH = '/outils-comptables-gratuits' as const;

export const OUTIL_CATEGORIES = [
  { id: 'calculer', label: 'Calculer' },
  { id: 'verifier', label: 'Vérifier' },
  { id: 'convertir', label: 'Convertir' },
] as const;

export type OutilCategory = (typeof OUTIL_CATEGORIES)[number]['id'];
export type OutilStatus = 'temoin' | 'disponible';
export type OutilServicePage = '/automatisation-cabinet-comptable' | '/methode';

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
  articleExact?: string;
  pageService: OutilServicePage;
  cta: '/contact';
}

export const OUTILS: readonly OutilDefinition[] = [
  {
    slug: 'temoin-calcul-local',
    categorie: 'calculer',
    statut: 'temoin',
    h1: 'Témoin de calcul local',
    title: 'Témoin de calcul local | Memlia',
    description: 'Une addition fictive qui démontre le calcul, la copie et le téléchargement dans le navigateur, sans envoi ni conservation des valeurs.',
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
