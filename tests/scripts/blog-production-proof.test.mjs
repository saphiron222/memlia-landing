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
const project = (sourceSha = sha, id = '123abc') => ({
  success: true,
  result: {
    name: 'memlia', production_branch: 'main', domains: ['memlia.fr'],
    source: { type: 'github', config: { owner: 'saphiron222', repo_name: 'memlia-landing' } },
    canonical_deployment: {
      id, short_id: id, url: `https://${id}.memlia.pages.dev`, environment: 'production', is_skipped: false,
      deployment_trigger: { type: 'github:push', metadata: { branch: 'main', commit_hash: sourceSha, commit_dirty: false } },
      latest_stage: { name: 'deploy', status: 'success', ended_on: '2026-09-25T12:00:00Z' },
    },
  },
});
const api = (payload) => async (request, options) => {
  assert.equal(request, 'https://api.cloudflare.com/client/v4/accounts/account123/pages/projects/memlia');
  assert.equal(options.headers.Authorization, 'Bearer test-token');
  return { ok: true, status: 200, json: async () => payload };
};
const options = (payload = project()) => ({ fetchPage: served('<title>Titre distinctif de l’article</title>'), fetchApi: api(payload), accountId: 'account123', apiToken: 'test-token' });

test('la déclaration de production exige le SHA fusionné déployé et le même contenu servi sur les deux origines', async () => {
  assert.deepEqual(await verifierPreuveProduction(evidence, options()), { ok: true, mergedSha: sha, deploymentId: '123abc', url, immutable });
  for (const mutation of [
    { mainSha: other },
    { deployment: { ...evidence.deployment, sourceSha: other } },
    { deployment: { ...evidence.deployment, environment: 'preview' } },
    { deployment: { ...evidence.deployment, status: 'building' } },
    { deployment: { ...evidence.deployment, id: '../bad' } },
    { marker: '' },
  ]) {
    await assert.rejects(verifierPreuveProduction({ ...evidence, ...mutation }, options()), /refusée/);
  }
  await assert.rejects(verifierPreuveProduction(evidence, { ...options(), fetchPage: async (request) => ({ ok: true, status: 200, url: request, text: async () => request === url ? 'ancien contenu' : '<title>Titre distinctif de l’article</title>' }) }), /refusée/);
  await assert.rejects(verifierPreuveProduction(evidence, { ...options(), fetchPage: async (request) => ({ ok: false, status: 404, url: request, text: async () => '' }) }), /refusée/);
});

test('refuse un ancien déploiement aux octets identiques mais à Source divergent et un état non final', async () => {
  for (const payload of [project(other), project(sha, 'old123'),
    { ...project(), result: { ...project().result, canonical_deployment: { ...project().result.canonical_deployment, latest_stage: { name: 'deploy', status: 'active' } } } },
    { ...project(), result: { ...project().result, source: { type: 'github', config: { owner: 'unrelated', repo_name: 'memlia-landing' } } } },
    { success: false, result: project().result },
  ]) await assert.rejects(verifierPreuveProduction(evidence, options(payload)), /refusée/);
  await assert.rejects(verifierPreuveProduction(evidence, { ...options(), apiToken: '' }), /refusée/);
});
