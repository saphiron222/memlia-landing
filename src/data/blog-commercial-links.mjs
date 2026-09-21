/**
 * Pont commercial rendu après la valeur éditoriale. Le Markdown publié reste scellé ;
 * cette table relie chaque intention informationnelle à une seule page commerciale.
 */
export const LIENS_COMMERCIAUX_BLOG = Object.freeze({
  'automatiser-la-relance-des-pieces-clients': Object.freeze({
    href: '/automatisation-cabinet-comptable',
    label: 'Voir le service d’automatisation',
  }),
  'automatiser-la-saisie-comptable-ce-qui-reste-a-verifier': Object.freeze({
    href: '/automatisation/saisie-comptable',
    label: 'Voir la prise en charge de la saisie',
  }),
  'automatiser-un-cabinet-comptable-la-carte-des-taches': Object.freeze({
    href: '/automatisation-cabinet-comptable',
    label: 'Voir le service d’automatisation',
  }),
  'cabinet-comptable-surcharge-de-travail-ou-passe-le-temps': Object.freeze({
    href: '/automatisation-cabinet-comptable',
    label: 'Voir le service d’automatisation',
  }),
  'comprendre-les-comptes-rendus-metier-dsn': Object.freeze({
    href: '/automatisation/paie',
    label: 'Voir la prise en charge autour de la paie',
  }),
  'controler-les-bulletins-de-paie-avant-la-dsn': Object.freeze({
    href: '/automatisation/paie',
    label: 'Voir la prise en charge autour de la paie',
  }),
  'intelligence-artificielle-metier-comptable-ce-qu-elle-prepare-ce-qui-reste-humain': Object.freeze({
    href: '/automatisation-cabinet-comptable',
    label: 'Voir le service d’automatisation',
  }),
  'suivre-la-production-sociale-dans-excel': Object.freeze({
    href: '/automatisation/paie',
    label: 'Voir la prise en charge autour de la paie',
  }),
  'pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils': Object.freeze({
    href: '/automatisation-cabinet-comptable',
    label: 'Voir le service d’automatisation',
  }),
});

export function lienCommercialPourArticle(articleId) {
  return LIENS_COMMERCIAUX_BLOG[articleId] ?? {
    href: '/automatisation-cabinet-comptable',
    label: 'Voir le service d’automatisation',
  };
}
