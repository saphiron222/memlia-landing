#!/usr/bin/env node
/** Contrat d'une déclaration de production, distinct du sceau éditorial et de la CI. */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const refuse = (reason) => { throw new Error(`Déclaration de production refusée : ${reason}`); };

export async function verifierPreuveProduction(evidence, { fetchPage = fetch } = {}) {
  const { mergedSha, mainSha, deployment, slug, marker } = evidence ?? {};
  if (!/^[0-9a-f]{40}$/.test(mergedSha ?? '') || mainSha !== mergedSha || deployment?.sourceSha !== mergedSha) refuse('SHA fusionné, main et Source Cloudflare doivent être identiques (40 caractères).');
  if (deployment.environment !== 'production' || deployment.status !== 'success' || !/^[a-zA-Z0-9-]+$/.test(deployment.id ?? '')) refuse('déploiement de production réussi et identifiant immuable requis.');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug ?? '') || typeof marker !== 'string' || marker.trim().length < 12) refuse('slug et marqueur distinctif requis.');
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
