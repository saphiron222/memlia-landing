import type { ProofId } from '@/data/proofs';

export interface ServiceDesign {
  heroProof: ProofId;
  bodyProof: ProofId;
}

/**
 * Les médias des pages service sont des preuves fonctionnelles fictives déjà scellées.
 * Aucun visuel ne simule un produit ni ne contient de donnée client.
 */
export const SERVICE_DESIGN: Record<string, ServiceDesign> = {
  'paie': {
    heroProof: 'v2/14-hero-service',
    bodyProof: '03-controle',
  },
  'saisie-comptable': {
    heroProof: '01-flux',
    bodyProof: '05-cadrer',
  },
  'rapprochement-bancaire': {
    heroProof: '02-repetition',
    bodyProof: '06-eprouver',
  },
  'notes-de-frais': {
    heroProof: '08-integration',
    bodyProof: '07-livrer',
  },
  'factures-fournisseurs': {
    heroProof: 'v2/01-qualification',
    bodyProof: 'v2/07-exception-visible',
  },
};

export function serviceDesignFor(slug: string): ServiceDesign {
  const design = SERVICE_DESIGN[slug];
  if (!design) throw new Error(`Direction artistique absente pour la page service « ${slug} »`);
  return design;
}
