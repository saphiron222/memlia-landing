import type { CollectionEntry } from 'astro:content';
import summaries from './resource-summaries.json';

export type ResourceRole =
  | 'direction-associes'
  | 'chefs-mission-portefeuille'
  | 'collaborateurs-comptables'
  | 'assistants-comptables'
  | 'paie-responsables-sociaux'
  | 'juridique-fiscal'
  | 'audit-cac'
  | 'administratif-secretariat'
  | 'facturation-recouvrement'
  | 'rh-recrutement-formation'
  | 'numerique-it-data'
  | 'profils-formation';

export type PublicResourceType = 'article' | 'terme';

export interface PublicResource {
  id: string;
  title: string;
  summary: string;
  task: string;
  href: string;
  type: PublicResourceType;
  typeLabel: string;
  role: ResourceRole;
  roleLabel: string;
  date: Date | null;
  path: 'comprendre' | 'faire-verifier' | 'cadrer';
}

export const RESOURCE_ROLE_LABELS: Record<ResourceRole, string> = {
  'direction-associes': 'Direction et associés',
  'chefs-mission-portefeuille': 'Chefs de mission et responsables de portefeuille',
  'collaborateurs-comptables': 'Collaborateurs comptables',
  'assistants-comptables': 'Assistants comptables',
  'paie-responsables-sociaux': 'Paie et responsables sociaux',
  'juridique-fiscal': 'Juridique et fiscal',
  'audit-cac': 'Audit et commissariat aux comptes',
  'administratif-secretariat': 'Administration et secrétariat',
  'facturation-recouvrement': 'Facturation et recouvrement',
  'rh-recrutement-formation': 'RH, recrutement et formation',
  'numerique-it-data': 'Numérique, IT et data',
  'profils-formation': 'Profils en formation',
};

const ARTICLE_DISCOVERY: Record<string, { task: string; role: ResourceRole; path: PublicResource['path'] }> = {
  'controler-les-bulletins-de-paie-avant-la-dsn': {
    task: 'Contrôler les bulletins avant le dépôt de la DSN',
    role: 'paie-responsables-sociaux',
    path: 'faire-verifier',
  },
  'suivre-la-production-sociale-dans-excel': {
    task: 'Suivre les dossiers du pôle social sans classer les personnes',
    role: 'direction-associes',
    path: 'cadrer',
  },
};

export function projectPublicResources(articles: CollectionEntry<'blog'>[]): PublicResource[] {
  const projected: PublicResource[] = articles.map((article) => {
    const pipelineRole = article.data.rolePrincipal === 'autre-role-documente' ? undefined : article.data.rolePrincipal;
    const pipelinePath: PublicResource['path'] = article.data.intent === 'comprendre'
      ? 'comprendre'
      : ['executer', 'diagnostiquer'].includes(article.data.intent ?? '')
        ? 'faire-verifier'
        : 'cadrer';
    const discovery = ARTICLE_DISCOVERY[article.id] ?? (
      article.data.pipelineVersion === 1 && article.data.tache && pipelineRole
        ? { task: article.data.tache, role: pipelineRole, path: pipelinePath }
        : undefined
    );
    if (!discovery) {
      throw new Error(`[ressources] métadonnées de découverte absentes pour l’article publié « ${article.id} »`);
    }
    return {
      id: `article-${article.id}`,
      title: article.data.titre,
      summary: summaries[article.id as keyof typeof summaries]?.join(' ') ?? article.data.resume,
      task: discovery.task,
      href: `/blog/${article.id}`,
      type: 'article' as const,
      typeLabel: 'Article',
      role: discovery.role,
      roleLabel: RESOURCE_ROLE_LABELS[discovery.role],
      // Même date que la liste du blog : celle de publication. Afficher la mise à jour ici
      // et la publication là-bas faisait lire deux dates pour un même article.
      date: article.data.datePublication,
      path: discovery.path,
    };
  });

  projected.push({
    id: 'terme-glossaire',
    title: 'Glossaire des tâches et contrôles du cabinet',
    summary: 'Des définitions directes, leur contexte d’usage et la limite entre préparation automatisable et décision professionnelle.',
    task: 'Clarifier le vocabulaire d’une règle ou d’un contrôle',
    href: '/glossaire',
    type: 'terme',
    typeLabel: 'Glossaire',
    role: 'profils-formation',
    roleLabel: RESOURCE_ROLE_LABELS['profils-formation'],
    date: null,
    path: 'comprendre',
  });

  return projected.sort((left, right) => {
    const leftTime = left.date?.getTime() ?? 0;
    const rightTime = right.date?.getTime() ?? 0;
    return rightTime - leftTime || left.title.localeCompare(right.title, 'fr');
  });
}
