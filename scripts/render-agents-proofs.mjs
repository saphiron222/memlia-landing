#!/usr/bin/env node
/**
 * Série de preuves « agents-ia » (hub du 15/10/2026, annexe §5) : des cadres rendus depuis les données des agents IA,
 * jamais recopiés à la main. Ce script écrit `docs/design/agents-ia-proof/index.html` depuis `src/data/specialistes.ts`,
 * puis confie le rendu au moteur des preuves v2 (`scripts/render-proofs-v2.mjs` : 1600 × 900, polices chargées, aucun
 * texte tronqué ni masqué, texte figé dans `content-contract.json`, WebP < 150 Ko, recadrage social `og/` par `data-og`).
 *
 *   node scripts/render-agents-proofs.mjs            régénère le HTML et rend (texte comparé au contrat figé)
 *   node scripts/render-agents-proofs.mjs --adopt    régénère, rend, et fige le texte après revue visuelle
 *   node scripts/render-agents-proofs.mjs --check    n'écrit rien : HTML identique aux données, actifs au manifeste
 *
 * Tâche 4 : un cadre, `49-hero-agents-ia`, le trio du héros (`HUB.trio`). Les tâches 6 et 9 y ajoutent les cadres
 * sociaux des fiches. La tâche 12 livre les figurines : un avatar renseigné change le HTML, donc le cadre, et `--check`
 * refuse alors un actif qui n'a pas été rendu de nouveau.
 *
 * Sur l'image de construction de Cloudflare (`CF_PAGES=1`), aucun Chromium : `--check` y compare les empreintes du
 * manifeste aux sources et aux actifs, comme `render-charte-ia-proof.mjs`. Le rendu complet se rejoue partout ailleurs.
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { AGENTS, HUB } from '../src/data/specialistes.ts';
import { POLES } from '../src/data/familles.ts';

const SOURCE = 'docs/design/agents-ia-proof';
const CHEMIN_HTML = `${SOURCE}/index.html`;
const MANIFESTE = 'docs/qa/agents-ia/proofs-manifest.json';
/** Le numéro du premier cadre de la série : `49-hero-agents-ia`, après les quarante-huit cadres v2 existants. */
const DEPART = 49;
/** Les médias des agents se lisent depuis `public/`, relatif au HTML du cadre. */
const VERS_PUBLIC = '../../../public';

const mode = process.argv.includes('--check') ? 'check' : process.argv.includes('--adopt') ? 'adopt' : 'render';
const empreinte = (octets) => createHash('sha256').update(octets).digest('hex');
const echapper = (texte) => String(texte).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function agentDe(slug) {
  const agent = AGENTS.find((candidat) => candidat.slug === slug);
  assert.ok(agent, `HUB.trio : agent inconnu « ${slug} »`);
  return agent;
}

function medaillon(agent) {
  const teinte = POLES[agent.teinte]?.couleur;
  assert.match(teinte ?? '', /^#[0-9a-f]{6}$/i, `${agent.slug} : teinte de pôle illisible`);
  const tuile = agent.avatar
    ? `<img src="${VERS_PUBLIC}${echapper(agent.avatar.src)}" alt="${echapper(agent.avatar.alt)}">`
    : `<span class="initiale">${echapper(agent.prenom.charAt(0))}</span>`;
  return `<figure class="medaillon" style="--teinte: ${teinte}"><div class="voile"><span class="tuile">${tuile}</span></div>`
    + `<figcaption><span class="micro">${echapper(HUB.annuaire.microLabel)}</span><span class="prenom">${echapper(agent.prenom)}</span>`
    + `<span class="metier">${echapper(agent.libelle)}</span></figcaption></figure>`;
}

function cadreDuHub() {
  const trio = HUB.trio.map(agentDe);
  assert.equal(new Set(trio.map((agent) => agent.slug)).size, 3, 'HUB.trio : trois agents distincts');
  return [
    '<!doctype html>',
    '<html lang="fr"><head><meta charset="utf-8"><link rel="stylesheet" href="styles.css"><title>Trois agents IA en médaillons</title></head>',
    `<body><main><section class="frame hatch" id="hero-agents-ia" data-og aria-label="${echapper(`Trois agents IA : ${trio.map((a) => `${a.prenom}, ${a.libelle}`).join(' ; ')}`)}">`,
    `<div class="trio">${trio.map(medaillon).join('')}</div>`,
    '</section></main></body></html>',
    '',
  ].join('\n');
}

function verifierEmpreintes() {
  assert.ok(existsSync(MANIFESTE), `Manifeste absent : ${MANIFESTE}`);
  const manifeste = JSON.parse(readFileSync(MANIFESTE, 'utf8'));
  for (const entree of [...manifeste.sources, ...manifeste.entries]) {
    const chemin = entree.path ?? entree.target;
    assert.equal(empreinte(readFileSync(chemin)), entree.sha256, `Source ou actif périmé : ${chemin} (node scripts/render-agents-proofs.mjs --adopt)`);
  }
  return manifeste.entries.length;
}

const html = cadreDuHub();
if (mode === 'check') {
  assert.ok(existsSync(CHEMIN_HTML), `${CHEMIN_HTML} absent : node scripts/render-agents-proofs.mjs --adopt`);
  assert.equal(readFileSync(CHEMIN_HTML, 'utf8'), html, `${CHEMIN_HTML} diverge des données des agents : node scripts/render-agents-proofs.mjs --adopt`);
  if (process.env.CF_PAGES === '1') {
    console.log(`Agents IA : cadre identique aux données, ${verifierEmpreintes()} actif(s) conformes au manifeste.`);
    process.exit(0);
  }
} else {
  writeFileSync(CHEMIN_HTML, html);
}

const rendu = spawnSync(process.execPath, [
  'scripts/render-proofs-v2.mjs',
  ...(mode === 'render' ? [] : [`--${mode}`]),
  `--source=${SOURCE}`,
  `--manifest=${MANIFESTE}`,
  `--start=${DEPART}`,
], { stdio: 'inherit' });
if (rendu.status !== 0) process.exit(rendu.status ?? 1);
if (mode === 'check') console.log(`Agents IA : cadre identique aux données, ${verifierEmpreintes()} actif(s) conformes au manifeste.`);
