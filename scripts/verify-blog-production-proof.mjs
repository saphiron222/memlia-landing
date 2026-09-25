#!/usr/bin/env node
/** Contrat d'une déclaration de production, distinct du sceau éditorial et de la CI. */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const refuse = (reason) => { throw new Error(`Déclaration de production refusée : ${reason}`); };

export async function verifierPreuveProduction(evidence, {
  fetchPage = fetch, fetchApi = fetch,
  accountId = process.env.CLOUDFLARE_ACCOUNT_ID, apiToken = process.env.CLOUDFLARE_API_TOKEN,
} = {}) {
  const { mergedSha, mainSha, deployment, slug, marker } = evidence ?? {};
  if (!/^[0-9a-f]{40}$/.test(mergedSha ?? '') || mainSha !== mergedSha || deployment?.sourceSha !== mergedSha) refuse('SHA fusionné, main et Source Cloudflare doivent être identiques (40 caractères).');
  if (deployment.environment !== 'production' || deployment.status !== 'success' || !/^[a-zA-Z0-9-]+$/.test(deployment.id ?? '')) refuse('déploiement de production réussi et identifiant immuable requis.');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug ?? '') || typeof marker !== 'string' || marker.trim().length < 12) refuse('slug et marqueur distinctif requis.');
  if (!/^[a-zA-Z0-9_-]+$/.test(accountId ?? '') || !apiToken) refuse('compte Cloudflare et jeton Pages en lecture requis.');
  let response;
  try {
    response = await fetchApi(`https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/memlia`, {
      headers: { Authorization: `Bearer ${apiToken}` }, redirect: 'error',
    });
  } catch { refuse('lecture du projet Cloudflare impossible.'); }
  if (!response.ok || response.status !== 200) refuse('projet Cloudflare inaccessible.');
  let project;
  try { project = await response.json(); } catch { refuse('réponse Cloudflare illisible.'); }
  const live = project?.result?.canonical_deployment;
  const source = live?.deployment_trigger;
  const stage = live?.latest_stage;
  if (project.success !== true || project.result?.name !== 'memlia' ||
    !project.result?.domains?.includes('memlia.fr') || project.result?.production_branch !== 'main' ||
    project.result?.source?.type !== 'github' || project.result?.source?.config?.owner !== 'saphiron222' ||
    project.result?.source?.config?.repo_name !== 'memlia-landing' ||
    live?.short_id !== deployment.id || live?.url !== `https://${deployment.id}.memlia.pages.dev` ||
    live?.environment !== 'production' || live?.is_skipped !== false ||
    source?.type !== 'github:push' || source?.metadata?.branch !== 'main' ||
    source?.metadata?.commit_dirty !== false || source?.metadata?.commit_hash !== mergedSha ||
    stage?.name !== 'deploy' || stage?.status !== 'success' || !stage?.ended_on) {
    refuse('déploiement canonique Cloudflare, Source, branche ou état final divergent.');
  }
  const url = `https://memlia.fr/blog/${slug}`;
  const immutable = `https://${deployment.id}.memlia.pages.dev/blog/${slug}`;
  const bodies = [];
  for (const target of [immutable, url]) {
    let response;
    try { response = await fetchPage(target, { headers: { 'User-Agent': 'Mozilla/5.0 (production-proof)' }, redirect: 'follow' }); }
    catch { refuse(`lecture HTTPS impossible : ${target}`); }
    if (!response.ok || response.status !== 200 || response.url !== target) refuse(`réponse HTTP non conforme : ${target}`);
    bodies.push(await response.text());
  }
  if (!bodies[0].includes(marker) || bodies[0] !== bodies[1]) refuse('marqueur absent ou HTML de production différent du déploiement immuable.');
  return { ok: true, mergedSha, deploymentId: deployment.id, url, immutable };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const file = process.argv[2];
  if (!file) throw new Error('Usage : node scripts/verify-blog-production-proof.mjs <preuve.json>');
  const evidence = JSON.parse(readFileSync(file, 'utf8'));
  const remoteMain = execFileSync('git', ['ls-remote', '--quiet', 'origin', 'refs/heads/main'], { encoding: 'utf8', timeout: 30_000 }).split(/\s+/)[0];
  if (evidence.mainSha !== remoteMain) refuse('main déclaré divergent de origin/main relu.');
  verifierPreuveProduction(evidence).then((result) => console.log(JSON.stringify(result, null, 2)), (error) => { console.error(error.message); process.exitCode = 1; });
}
