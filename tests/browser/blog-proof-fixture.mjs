// Test-only fixture: exercise the production forge and CSS, never materialise
// an article, review, source receipt, queue or publication seal.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { injecterPreuvesInline } from '../../scripts/blog-forge.mjs';

// Les sept articles dont les preuves de corps suivent la recette de référence du 03/10/2026 :
// une image 1600 × 900 par figure, la même sur bureau et sur téléphone.
export const articles = [
  'automatiser-la-saisie-comptable-ce-qui-reste-a-verifier',
  'automatiser-un-cabinet-comptable-la-carte-des-taches',
  'cabinet-comptable-surcharge-de-travail-ou-passe-le-temps',
  'intelligence-artificielle-metier-comptable-ce-qu-elle-prepare-ce-qui-reste-humain',
  'logiciel-ia-comptabilite',
  'prompt-chatgpt-expert-comptable',
  'tests-verts-et-regle-des-trois-passes',
];

export function technicalProofFixtures(root) {
  return articles.map(slug => {
    const recipe = JSON.parse(readFileSync(join(root, 'editorial/recettes', slug, 'recette.json'), 'utf8'));
    const headings = [...new Set(recipe.inlineProofs.map(proof => proof.insertBeforeHeading))];
    const body = 'Fixture technique non publiée.\n' + headings.map(heading => `\n## ${heading}\n`).join('');
    return { slug, html: injecterPreuvesInline(body, recipe.inlineProofs) };
  });
}

export function requiresRepublicationGate(bodies, { remoteUrl, required } = {}) {
  // Any body rematerialised with direct proof figures (the reference 1600 × 900
  // image or a legacy portrait) activates the FULL gate on the real pages. A
  // partially rematerialised set cannot hide behind a technical PR.
  const directFigure = /<figure\b[^>]*\bdata-blog-proof="[a-z0-9-]+"[^>]*>\s*<img src="\/proofs\/blog\/[a-z0-9-]+\.webp"/;
  return Boolean(remoteUrl) || required === '1'
    || bodies.some(body => /\/proofs\/blog\/[a-z0-9-]+-mobile\.webp/.test(body) || directFigure.test(body));
}
