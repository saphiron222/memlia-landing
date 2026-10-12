import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { validateDossier, contexteDeCitation } from '../../../scripts/lib/blog-pipeline.mjs';

// Diagnostic en lecture seule des objets réellement matérialisés : aucun verdict modifié.
const root = process.cwd();
const slugs = ['automatiser-un-cabinet-cac-la-carte-des-taches', 'cac-reception-fec-constat'];
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const results = [];
for (const slug of slugs) {
  const dir = `editorial/articles/${slug}`;
  const manifest = read(`${dir}/manifest.json`);
  const claims = read(`${dir}/claims.json`);
  const recipe = read(`editorial/recettes/${slug}/recette.json`);
  const review = read(`editorial/recettes/${slug}/revues.json`);
  const validation = await validateDossier({ root, slug, gateMode: 'preview' });
  assert.equal(validation.pass, false, 'Le refus réel doit être reproductible avant réparation');
  assert.ok(validation.errors.some((e) => e.startsWith('cluster doit valoir')));
  assert.ok(validation.errors.some((e) => e.includes('identité distincte de l’auteur et du reviewer éditorial')));
  const contexts = claims.claims.flatMap((claim, index) => claim.factCheck.sourceResults.map((source) => {
    const snapshot = fs.readFileSync(path.join(root, dir, `preuves/sources/${source.sourceId}.source.txt`), 'utf8');
    return {
      index, claimId: claim.id, sourceId: source.sourceId,
      excerpt: source.excerpt,
      excerptInVerifiedCopy: snapshot.includes(source.excerpt),
      rawContextContainsExcerpt: source.context.includes(source.excerpt),
      ordinaryExtraction: contexteDeCitation(snapshot, source.excerpt),
      context: source.context,
      rejectedByGate: validation.errors.some((e) => e.startsWith(`claims[${index}].factCheck.sourceResults.${source.sourceId}.context `)),
    };
  })).filter((item) => item.rejectedByGate);
  results.push({ slug, cluster: recipe.cluster, author: manifest.author,
    editorialReviewer: manifest.reviewer, businessReviewer: manifest.businessReview.reviewerId,
    historicalReview: { cardId: review.cardId, reviewedAt: review.reviewedAt, verdict: review.verdict },
    pass: validation.pass, errors: validation.errors, rejectedContexts: contexts });
}
console.log(JSON.stringify({ observedAt: new Date().toISOString(), readOnly: true, sourceNetworkRequests: 0, results }, null, 2));
