import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verifierPreuveProduction } from '../../scripts/verify-blog-production-proof.mjs';

const sha = 'a'.repeat(40);
const other = 'b'.repeat(40);
const evidence = {
  mergedSha: sha,
  mainSha: sha,
  deployment: { id: '123abc', sourceSha: sha, environment: 'production', status: 'success' },
  slug: 'article-test',
  marker: 'Titre distinctif de l’article',
};
const url = 'https://memlia.fr/blog/article-test';
const immutable = 'https://123abc.memlia.pages.dev/blog/article-test';
const served = (body) => async (request) => ({ ok: true, status: 200, url: request, text: async () => body });

test('la déclaration de production exige le SHA fusionné déployé et le même contenu servi sur les deux origines', async () => {
  const fetchPage = served('<title>Titre distinctif de l’article</title>');
  assert.deepEqual(await verifierPreuveProduction(evidence, { fetchPage }), { ok: true, mergedSha: sha, deploymentId: '123abc', url, immutable });
  for (const mutation of [
    { mainSha: other },
    { deployment: { ...evidence.deployment, sourceSha: other } },
    { deployment: { ...evidence.deployment, environment: 'preview' } },
    { deployment: { ...evidence.deployment, status: 'building' } },
    { deployment: { ...evidence.deployment, id: '../bad' } },
    { marker: '' },
  ]) {
    await assert.rejects(verifierPreuveProduction({ ...evidence, ...mutation }, { fetchPage }), /refusée/);
  }
  await assert.rejects(verifierPreuveProduction(evidence, { fetchPage: async (request) => ({ ok: true, status: 200, url: request, text: async () => request === url ? 'ancien contenu' : '<title>Titre distinctif de l’article</title>' }) }), /refusée/);
  await assert.rejects(verifierPreuveProduction(evidence, { fetchPage: async (request) => ({ ok: false, status: 404, url: request, text: async () => '' }) }), /refusée/);
});
