// Test-only fixture: exercise the production forge and CSS, never materialise
// an article, review, source receipt, queue or publication seal.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { injecterPreuvesInline } from '../../scripts/blog-forge.mjs';

export const articles = [
  'automatiser-la-saisie-comptable-ce-qui-reste-a-verifier',
  'automatiser-un-cabinet-comptable-la-carte-des-taches',
  'intelligence-artificielle-metier-comptable-ce-qu-elle-prepare-ce-qui-reste-humain',
  'logiciel-ia-comptabilite',
  'prompt-chatgpt-expert-comptable',
];

export function technicalProofFixtures(root) {
  return articles.map(slug => {
    const recipe = JSON.parse(readFileSync(join(root, 'editorial/recettes', slug, 'recette.json'), 'utf8'));
    const headings = [...new Set(recipe.inlineProofs.map(proof => proof.insertBeforeHeading))];
    const body = 'Fixture technique non publiée.\n' + headings.map(heading => `\n## ${heading}\n`).join('');
    return { slug, html: injecterPreuvesInline(body, recipe.inlineProofs, root) };
  });
}

export function requiresRepublicationGate(bodies, { remoteUrl, required } = {}) {
  // Any new portrait in the real target bodies activates the FULL five-page
  // gate. A partially rematerialised set cannot hide behind a technical PR.
  return Boolean(remoteUrl) || required === '1'
    || bodies.some(body => /\/proofs\/blog\/[a-z0-9-]+-mobile\.webp/.test(body));
}
