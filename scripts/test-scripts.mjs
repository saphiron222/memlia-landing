#!/usr/bin/env node
/**
 * Lance les tests Node de tests/scripts, sauf ceux qui exigent un navigateur.
 *
 * La chaîne de build tourne aussi sur l'image de construction de Cloudflare Pages, où aucun
 * Chromium n'est installé : un test qui lance Playwright y échoue avant sa première assertion,
 * et la publication avec lui (mesuré le 16/09/2026, déploiement 8e89cc5e). Ces tests-là gardent
 * leur propre commande, jouée en local et en recette (`npm run test:blog-pipeline:render`).
 *
 * Un filtre qui rétrécit un total doit compter ce qu'il écarte : la liste est écrite ici avec sa
 * raison, et chaque exécution l'imprime. Un fichier écarté qui disparaît du dépôt fait échouer
 * la commande plutôt que de laisser vieillir la liste.
 */
import { readdirSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const DOSSIER = 'tests/scripts';
const SANS_NAVIGATEUR = {
  'blog-candidate-render.test.mjs': 'lance Chromium (Playwright) : joué par npm run test:blog-pipeline:render, hors chaîne de build',
  'blog-title-intent.test.mjs': 'joué explicitement par npm run test:blog-title-intent juste après le rendu Astro',
};

const fichiers = readdirSync(DOSSIER).filter((f) => f.endsWith('.test.mjs')).sort();
const manquants = Object.keys(SANS_NAVIGATEUR).filter((f) => !existsSync(join(DOSSIER, f)));
if (manquants.length > 0) {
  console.error(`test-scripts : fichier(s) écarté(s) introuvable(s), liste à mettre à jour : ${manquants.join(', ')}`);
  process.exit(2);
}
const retenus = fichiers.filter((f) => !(f in SANS_NAVIGATEUR));
console.log(`test-scripts : ${retenus.length} fichier(s) joués, ${fichiers.length - retenus.length} écarté(s) :`);
for (const [fichier, raison] of Object.entries(SANS_NAVIGATEUR)) console.log(`  - ${fichier} — ${raison}`);

const run = spawnSync(process.execPath, ['--test', ...retenus.map((f) => join(DOSSIER, f))], { stdio: 'inherit' });
process.exit(run.status ?? 1);
