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
import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const DOSSIER = 'tests/scripts';
const SANS_NAVIGATEUR = {
  'relance-provenance.test.mjs': 'rejoue le wrapper relance dans Chromium : joué explicitement en CI, hors build Cloudflare',
  'proofs-v2-ownership.test.mjs': 'rend les preuves v2 dans Chromium : joué explicitement en CI, hors build Cloudflare',
  'proof-render-ownership.test.mjs': 'rend les neuf preuves dans Chromium : joué explicitement en CI, hors build Cloudflare',
  'accueil-cac-geometry.test.mjs': 'mesure les panneaux CAC dans Chromium : joué explicitement en CI, hors build Cloudflare ; les autres contrôles CAC restent dans accueil-cac-medias.test.mjs',
  'guide-forge.test.mjs': 'rend les preuves dans Chromium : joué par npm run test:guide-forge et en CI, hors build Cloudflare',
  'guide-proof-layout.test.mjs': 'mesure les textes dans Chromium : joué par npm run test:guide-forge et en CI, hors build Cloudflare',
  'guide-forge-render.test.mjs': 'forge une preuve dans Chromium et construit Astro : joué par npm run test:guide-render et en CI, hors build Cloudflare',
  'blog-proof-frame-render.test.mjs': 'lance Chromium : joué par node --test tests/scripts/blog-proof-frame-render.test.mjs, hors chaîne de build',
  'blog-candidate-render.test.mjs': 'lance Chromium (Playwright) : joué par npm run test:blog-pipeline:render, hors chaîne de build',
  'blog-title-intent.test.mjs': 'joué explicitement par npm run test:blog-title-intent juste après le rendu Astro',
  'blog-intent-preservation.test.mjs': 'exige dist : joué par npm run test:blog-contract après le rendu Astro',
};

/**
 * Contrôles du hub des agents IA, écrits avant le code (plan 2026-10-15, tâche 1) : rouges tant que ce qu'ils lisent
 * n'existe pas. Chacun est écarté tant que sa condition manque et joué dès qu'elle tombe : la levée est automatique,
 * aucune ligne à retirer ici (un garde qui ne se propage pas seul reste débranché sans que personne le voie).
 * `npm run test:agents` les joue tous, sans condition, pour lire la liste des échecs attendus.
 * Une condition rend la raison de l'attente, ou null quand le contrôle doit tourner.
 */
const existe = (chemin) => (existsSync(chemin) ? null : `${chemin} n'existe pas encore`);
const exporte = (chemin, motif, nom) => (existsSync(chemin) && motif.test(readFileSync(chemin, 'utf8')) ? null : `${chemin} n'exporte pas encore ${nom}`);
const donneesDesAgents = () => {
  const dossier = 'src/data/specialistes';
  const fichiersDuDossier = existsSync(dossier) ? readdirSync(dossier).filter((f) => f.endsWith('.ts')).map((f) => join(dossier, f)) : [];
  return ['src/data/specialistes.ts', ...fichiersDuDossier].filter((f) => existsSync(f)).map((f) => readFileSync(f, 'utf8')).join('\n');
};
const ROUGES_TANT_QUE = {
  'specialistes-partition.test.mjs': () => existe('src/data/specialistes.ts'),
  'specialistes-copy.test.mjs': () => existe('src/data/specialistes.ts'),
  'connecteurs.test.mjs': () => existe('src/data/connecteurs.ts'),
  'familles-hub.test.mjs': () => exporte('src/data/familles.ts', /export const FAMILLES_HUB\b/, 'FAMILLES_HUB'),
  'agents-rejeu-source.test.mjs': () => (/\bdemonstration\b/.test(donneesDesAgents()) ? null : "aucune démonstration n'est encore écrite dans les données des agents (src/data/specialistes*)"),
};

const fichiers = readdirSync(DOSSIER).filter((f) => f.endsWith('.test.mjs')).sort();
const manquants = [...Object.keys(SANS_NAVIGATEUR), ...Object.keys(ROUGES_TANT_QUE)].filter((f) => !existsSync(join(DOSSIER, f)));
if (manquants.length > 0) {
  console.error(`test-scripts : fichier(s) écarté(s) introuvable(s), liste à mettre à jour : ${manquants.join(', ')}`);
  process.exit(2);
}
const enAttente = Object.entries(ROUGES_TANT_QUE).flatMap(([fichier, condition]) => {
  const raison = condition();
  return raison ? [[fichier, `contrôle écrit avant le code, rouge tant que ${raison} ; joué dès que cela tombe, et par npm run test:agents sans condition`]] : [];
});
const ecartes = { ...SANS_NAVIGATEUR, ...Object.fromEntries(enAttente) };
const retenus = fichiers.filter((f) => !(f in ecartes));
console.log(`test-scripts : ${retenus.length} fichier(s) joués, ${fichiers.length - retenus.length} écarté(s) :`);
for (const [fichier, raison] of Object.entries(ecartes)) console.log(`  - ${fichier} — ${raison}`);

const run = spawnSync(process.execPath, ['--test', ...retenus.map((f) => join(DOSSIER, f))], { stdio: 'inherit' });
process.exit(run.status ?? 1);
