/**
 * Pont commercial rendu après la valeur éditoriale. Le Markdown publié reste scellé ;
 * cette table relie chaque intention informationnelle à une seule page commerciale.
 */
export const LIENS_COMMERCIAUX_BLOG = Object.freeze({
  'automatiser-l-entree-en-relation-d-un-nouveau-client': Object.freeze({
    href: '/agents-ia/commercial',
    label: 'Découvrir Victoire pour l’entrée en relation',
  }),
  'automatiser-un-cabinet-cac-la-carte-des-taches': Object.freeze({
    href: '/commissaires-aux-comptes',
    label: 'Voir comment cadrer une tâche du cabinet CAC',
  }),
  'cac-reception-fec-constat': Object.freeze({
    href: '/commissaires-aux-comptes',
    label: 'Voir la préparation des tâches en cabinet CAC',
  }),
  'automatiser-avec-ia-sans-changer-logiciel': Object.freeze({
    href: '/integrations',
    label: 'Voir les compatibilités de vos outils',
  }),
  'ia-comptabilite-confidentialite-donnees': Object.freeze({
    href: '/agents-ia/protection-donnees',
    label: 'Découvrir Prudence pour la protection des données',
  }),
  'verifier-reponse-ia-comptabilite': Object.freeze({
    href: '/agents-ia',
    label: 'Explorer les agents IA et leurs validations',
  }),
  'utiliser-chatgpt-cabinet-comptable': Object.freeze({
    href: '/agents-ia',
    label: 'Explorer les agents IA du cabinet',
  }),
  'automatiser-la-relance-des-pieces-clients': Object.freeze({
    href: '/agents-ia/comptabilite',
    label: 'Découvrir Balthazar pour les pièces manquantes',
  }),
  'automatiser-la-saisie-comptable-ce-qui-reste-a-verifier': Object.freeze({
    href: '/agents-ia/comptabilite#tache-saisie-ocr-2',
    label: 'Voir la prise en charge de la saisie',
  }),
  'automatiser-un-cabinet-comptable-la-carte-des-taches': Object.freeze({
    href: '/automatisation-cabinet-comptable',
    label: 'Explorer les robots',
  }),
  'cabinet-comptable-surcharge-de-travail-ou-passe-le-temps': Object.freeze({
    href: '/automatisation-cabinet-comptable',
    label: 'Explorer les robots',
  }),
  'comprendre-les-comptes-rendus-metier-dsn': Object.freeze({
    href: '/agents-ia/paie-social',
    label: 'Voir la prise en charge autour de la paie',
  }),
  'controler-les-bulletins-de-paie-avant-la-dsn': Object.freeze({
    href: '/agents-ia/paie-social#tache-bulletins-controle-2',
    label: 'confier les contrôles croisés des bulletins de paie',
  }),
  'intelligence-artificielle-metier-comptable-ce-qu-elle-prepare-ce-qui-reste-humain': Object.freeze({
    href: '/agents-ia',
    label: 'Explorer les agents IA et leurs limites',
  }),
  'suivre-la-production-sociale-dans-excel': Object.freeze({
    href: '/agents-ia/paie-social',
    label: 'Voir la prise en charge autour de la paie',
  }),
  'logiciel-ia-comptabilite': Object.freeze({
    href: '/agents-ia',
    label: 'Explorer les agents IA',
  }),
  'prompt-chatgpt-expert-comptable': Object.freeze({
    href: '/agents-ia',
    label: 'Explorer les agents IA du cabinet',
  }),
  'tests-verts-et-regle-des-trois-passes': Object.freeze({
    href: '/automatisation-cabinet-comptable',
    label: 'Explorer les robots et leur fonctionnement',
  }),
  'pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils': Object.freeze({
    href: '/automatisation-cabinet-comptable',
    label: 'Explorer les robots',
  }),
});

export function estLienCommercialBlog(href) {
  if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//')) return false;
  const url = new URL(href, 'https://memlia.fr');
  return !url.search && /^(?:\/automatisation-cabinet-comptable|\/automatisation\/[a-z0-9-]+|\/agents-ia(?:\/[a-z0-9-]+)?|\/commissaires-aux-comptes|\/integrations)$/.test(url.pathname);
}

export function lienCommercialPourArticle(articleId) {
  return LIENS_COMMERCIAUX_BLOG[articleId] ?? {
    href: '/automatisation-cabinet-comptable',
    label: 'Explorer les robots',
  };
}
