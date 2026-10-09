import type { ProofId } from '@/data/proofs';

export interface ServiceDesign {
  heroProof: ProofId;
  bodyProof: ProofId;
}

/**
 * Chaque page service possède sa propre preuve fonctionnelle fictive, rendue depuis
 * docs/design/site-v2-proofs. Aucun visuel ne simule un produit ni ne contient de donnée client.
 */
export const SERVICE_DESIGN: Record<string, ServiceDesign> = {
  'evaluation-transmission': {
    heroProof: 'v2/47-service-evaluation-transmission',
    bodyProof: 'v2/47-service-evaluation-transmission',
  },
  'registres-obligations': {
    heroProof: 'v2/44-service-registres-obligations',
    bodyProof: 'v2/44-service-registres-obligations',
  },
  'secretariat-juridique': {
    heroProof: 'v2/46-service-secretariat-juridique',
    bodyProof: 'v2/46-service-secretariat-juridique',
  },
  'entrees-sorties-salaries': {
    heroProof: 'v2/44-service-entrees-sorties-salaries',
    bodyProof: 'v2/44-service-entrees-sorties-salaries',
  },
  'paie': {
    heroProof: 'v2/19-service-paie',
    bodyProof: 'v2/19-service-paie',
  },
  'saisie-comptable': {
    heroProof: 'v2/20-service-saisie-comptable',
    bodyProof: 'v2/20-service-saisie-comptable',
  },
  'rapprochement-bancaire': {
    heroProof: 'v2/21-service-rapprochement-bancaire',
    bodyProof: 'v2/21-service-rapprochement-bancaire',
  },
  'notes-de-frais': {
    heroProof: 'v2/22-service-notes-de-frais',
    bodyProof: 'v2/22-service-notes-de-frais',
  },
  'factures-fournisseurs': {
    heroProof: 'v2/23-service-factures-fournisseurs',
    bodyProof: 'v2/23-service-factures-fournisseurs',
  },
};

export function serviceDesignFor(slug: string): ServiceDesign {
  const design = SERVICE_DESIGN[slug];
  if (!design) throw new Error(`Direction artistique absente pour la page service « ${slug} »`);
  return design;
}
