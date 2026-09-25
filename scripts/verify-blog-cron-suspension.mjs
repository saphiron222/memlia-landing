#!/usr/bin/env node
/** Contrôle manuel du gel décidé le 24/09/2026 ; ne déclenche ni cron ni publication. */
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

export const BLOG_CRONS = Object.freeze({
  'e4eaaf20655f': 'memlia-forge-quotidienne',
  '41c548e093ff': 'memlia-sentinelle-seo',
  '8416f0f0f661': 'memlia-releve-demande',
  '8cc31dbdda05': 'memlia-integrite',
  '338941579226': 'memlia-autorite',
});

export function verifyBlogCronSuspension(config) {
  if (!Array.isArray(config?.jobs)) throw new Error('Configuration cron illisible : jobs absent');
  const errors = [];
  for (const [id, name] of Object.entries(BLOG_CRONS)) {
    const matches = config.jobs.filter((job) => job.id === id || job.name === name);
    if (matches.length !== 1 || matches[0]?.id !== id || matches[0]?.name !== name) {
      errors.push(`${name} (${id}) : identité absente, divergente ou dupliquée`);
    } else if (matches[0].enabled !== false || matches[0].state !== 'paused' || matches[0].fire_claim) {
      errors.push(`${name} (${id}) : exécution encore possible ou revendiquée`);
    }
  }
  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const path = process.argv[2];
  if (!path) throw new Error('Usage : node scripts/verify-blog-cron-suspension.mjs <jobs.json du profil marketing>');
  const errors = verifyBlogCronSuspension(JSON.parse(readFileSync(path, 'utf8')));
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else console.log('PASS : cinq routines éditoriales en pause ; aucune exécution revendiquée.');
}
