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
 * Tâche 4 : un cadre, `49-hero-agents-ia`, le trio du héros (`HUB.trio`). Tâche 6 : un cadre social par fiche publiée,
 * `<NN>-fiche-<slug>` (le rejeu de sa démonstration), marqué `data-og-only` : il ne publie que son recadrage
 * `public/proofs/v2/og/<NN>-fiche-<slug>.webp`, jamais de maître (une fiche n'a pas de média propre : annexe E4). Son URL
 * absolue est celle de `fiche.image.url` : le script refuse des données qui nommeraient un autre fichier. La tâche 12
 * livre les figurines : un avatar renseigné change le HTML, donc le cadre, et `--check` refuse alors un actif qui n'a
 * pas été rendu de nouveau.
 *
 * Sur l'image de construction de Cloudflare (`CF_PAGES=1`), aucun Chromium : `--check` y compare les empreintes du
 * manifeste aux sources et aux actifs, comme `render-charte-ia-proof.mjs`. Le rendu complet se rejoue partout ailleurs.
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { AGENTS, FICHES, HUB, ficheDe } from '../src/data/specialistes.ts';
import { POLES } from '../src/data/familles.ts';
import { SITE } from '../src/data/site.mjs';
import { decouperArret, texteDuRejeu, gabaritDe } from '../src/data/specialistes/gabarit.ts';

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
  return `<section class="frame hatch" id="hero-agents-ia" data-og aria-label="${echapper(`Trois agents IA : ${trio.map((a) => `${a.prenom}, ${a.libelle}`).join(' ; ')}`)}">`
    + `<div class="trio">${trio.map(medaillon).join('')}</div>`
    + '</section>';
}

/** Les fiches publiées, dans l'ordre des agents : leur rang fixe leur numéro de cadre, après celui du hub. */
const fichesPubliees = () => FICHES.filter((agent) => agent.publie === true);
const idDeFiche = (agent) => `fiche-${agent.slug}`;

/** L'URL absolue de l'image sociale d'une fiche, telle que le rendu la publie : `fiche.image.url` doit la nommer. */
function numeroDuCadre(agent) {
  const url = ficheDe(agent).image.url;
  const match = url.match(/\/og\/(\d+)-fiche-([a-z0-9-]+)\.webp$/);
  assert.ok(match && match[2] === agent.slug, `${agent.slug} : URL de cadre stable requise`);
  return Number(match[1]);
}
function urlSociale(agent) {
  return `${SITE.url}/proofs/v2/og/${String(numeroDuCadre(agent)).padStart(2, '0')}-${idDeFiche(agent)}.webp`;
}

/** Une ligne de cas : l'Arrêt barre le cas et ce qui n'a pas été proposé, son motif reste plein (comme sur la page). */
function ligneDeCas(unCas) {
  let sortie = echapper(unCas.sortie);
  let cas = echapper(unCas.cas);
  if (unCas.issue === 'Arrêt') {
    const { barre, motif } = decouperArret(unCas.sortie);
    cas = `<span class="barre">${cas}</span>`;
    sortie = `<span class="barre">${echapper(barre)}</span> <span class="motif">${echapper(motif)}</span>`;
  }
  return `<li data-issue="${echapper(unCas.issue)}"><span class="fiche-cas-titre">${cas}</span>`
    + `<span class="fiche-cas-sortie">${sortie}</span><span class="fiche-issue">${echapper(unCas.issue)}</span></li>`;
}

/** Le cadre social d'une fiche : l'agent, l'en-tête du rejeu, le dossier fictif, puis les quatre cas et leur issue. */
function cadreDeFiche(agent) {
  ficheDe(agent);
  const teinte = POLES[agent.teinte]?.couleur;
  assert.match(teinte ?? '', /^#[0-9a-f]{6}$/i, `${agent.slug} : teinte de pôle illisible`);
  const tuile = agent.avatar
    ? `<img src="${VERS_PUBLIC}${echapper(agent.avatar.src)}" alt="${echapper(agent.avatar.alt)}">`
    : `<span class="initiale">${echapper(agent.prenom.charAt(0))}</span>`;
  const { etiquette } = gabaritDe(agent);
  const { entete } = texteDuRejeu(agent.demonstration);
  return `<section class="frame hatch fiche" id="${idDeFiche(agent)}" data-og-only style="--teinte: ${teinte}" aria-label="${echapper(`${entete} : ${etiquette}`)}">`
    + `<div class="fiche-copie"><div class="fiche-agent"><span class="fiche-tuile">${tuile}</span><span class="fiche-etiquette">${echapper(etiquette)}</span></div>`
    + `<h1 class="fiche-titre">${echapper(entete)}</h1><p class="fiche-dossier">${echapper(agent.demonstration.dossier)}</p></div>`
    + `<ol class="fiche-cas">${agent.demonstration.cas.map(ligneDeCas).join('')}</ol>`
    + '</section>';
}

/** Les cadres de la série, dans l'ordre de leur numéro : le hub (49), puis une fiche publiée par cadre (50 et suivants). */
function pageDeLaSerie() {
  const fiches = fichesPubliees();
  fiches.forEach((agent, i) => {
    const attendue = urlSociale(agent);
    assert.equal(ficheDe(agent).image.url, attendue, `${agent.slug} : fiche.image.url doit nommer le cadre rendu (${attendue})`);
  });
  return [
    '<!doctype html>',
    '<html lang="fr"><head><meta charset="utf-8"><link rel="stylesheet" href="styles.css"><title>Agents IA : le trio du hub et les rejeux des fiches</title></head>',
    `<body><main>${[{numero:49,html:cadreDuHub()}, ...fiches.map(agent=>({numero:numeroDuCadre(agent),html:cadreDeFiche(agent)})), {numero:59,html:`<section class="frame hatch compatibilites" id="compatibilites" data-og-only aria-label="Robots et agents IA Memlia dans les logiciels de votre cabinet"><div><p class="micro">Les compatibilités Memlia</p><h1>Vos outils.<br>Nos robots et agents IA.</h1><p>Production, paie, juridique, banque et messagerie.</p></div><div class="compatibilites-figurine"><img src="../../../public/agents/informatique-outils-512.webp" alt="Octavie, informatique et outils"><div class="compatibilites-logos"><img src="../../../public/logos/pennylane.webp" alt="Pennylane"><img src="../../../public/logos/microsoft-excel.svg" alt="Microsoft Excel"><img src="../../../public/logos/slack.webp" alt="Slack"></div></div></section>`}].sort((a,b)=>a.numero-b.numero).map(frame=>frame.html).join('\n')}</main></body></html>`,
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

const html = pageDeLaSerie();
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
  '--series=agents-ia',
  `--source=${SOURCE}`,
  `--manifest=${MANIFESTE}`,
  `--start=${DEPART}`,
], { stdio: 'inherit' });
if (rendu.status !== 0) process.exit(rendu.status ?? 1);
if (mode === 'check') console.log(`Agents IA : cadre identique aux données, ${verifierEmpreintes()} actif(s) conformes au manifeste.`);
