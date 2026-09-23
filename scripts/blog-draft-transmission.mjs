#!/usr/bin/env node
/** Private, coverless review lane for the withdrawn transmission draft.
 * Deliberately does not call blog-forge.materialiser: that lane creates public assets,
 * a collection entry and a publication queue item, and requires a real cover.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { verifierRegleEcrite } from './blog-forge.mjs';
import { REVIEW_CRITERIA } from './lib/blog-pipeline.mjs';

export const SLUG = 'fideliser-collaborateurs-cabinet-comptable-ecrire-savoir-faire';
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const hashFile = (root, path) => sha(readFileSync(join(root, path)));
const escape = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const base = `editorial/recettes/${SLUG}`;
const paths = { recipe: `${base}/recette.json`, body: `${base}/corps.md`, replay: 'docs/qa/blog-recrutement-replay.json', fixture: 'docs/design/blog-recrutement-proofs/replay-fixtures.json', queue: 'editorial/queue.json' };

function inline(text) {
  return escape(text).replace(/\[([^\]]+)\]\((https:\/\/[^)]+|\/[^)]+)\)/g, '<a href="$2">$1</a>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}
export function renderDraft(body, recipe) {
  const blocks = body.trim().split(/\n\s*\n/);
  const content = blocks.map((block) => {
    const lines = block.split('\n');
    if (/^## /.test(block)) return `<h2>${inline(block.slice(3))}</h2>`;
    if (/^### /.test(block)) return `<h3>${inline(block.slice(4))}</h3>`;
    if (lines.every((line) => line.startsWith('|'))) {
      const rows = lines.filter((line) => !/^\|[-| :]+\|$/.test(line));
      return `<div class="table-wrap" role="region" aria-label="Tableau défilant horizontalement" tabindex="0"><p class="table-hint">Sur écran étroit, faire défiler le tableau vers la droite pour voir toutes les colonnes.</p><table><thead><tr>${rows[0].split('|').slice(1, -1).map((cell) => `<th>${inline(cell.trim())}</th>`).join('')}</tr></thead><tbody>${rows.slice(1).map((row) => `<tr>${row.split('|').slice(1, -1).map((cell) => `<td>${inline(cell.trim())}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    }
    if (lines.every((line) => /^[-\d]+[.)]? /.test(line))) return `<ul>${lines.map((line) => `<li>${inline(line.replace(/^[-\d]+[.)]? /, ''))}</li>`).join('')}</ul>`;
    return `<p>${inline(block.replace(/\n/g, ' '))}</p>`;
  }).join('\n');
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(recipe.tabTitle)}</title><style>@font-face{font-family:Hanken;src:url('/fonts/hanken-400.woff2') format('woff2')}@font-face{font-family:Fraunces;src:url('/fonts/fraunces-600.woff2') format('woff2')}body{margin:0;background:#fffefb;color:#231f20;font:18px/1.65 Hanken,system-ui,sans-serif}main{max-width:760px;margin:auto;padding:36px 20px 90px}h1,h2,h3{font-family:Fraunces,Georgia,serif;line-height:1.2}h1{font-size:clamp(2rem,5vw,3.4rem)}h2{margin-top:2.2em}a{color:#1c8a41}table{border-collapse:collapse;min-width:620px;font-size:.9em}td,th{padding:10px;border:1px solid #ced9cd;text-align:left;vertical-align:top}.table-wrap{overflow-x:auto}.table-hint{display:none}@media(max-width:640px){.table-hint{display:block;margin:0 0 8px;font-size:.85em;color:#1c8a41}}aside{border:2px solid #27b657;padding:16px;background:#fcfbf7}</style></head><body><main><aside>Brouillon privé hors publication · couverture volontairement absente · aucune image générée</aside><h1>${escape(recipe.title)}</h1><p>${escape(recipe.summary)}</p>${content}</main></body></html>`;
}

export function prepare(root = process.cwd()) {
  const recipe = JSON.parse(readFileSync(join(root, paths.recipe), 'utf8'));
  const body = readFileSync(join(root, paths.body), 'utf8').trim();
  const replay = JSON.parse(readFileSync(join(root, paths.replay), 'utf8'));
  const queue = JSON.parse(readFileSync(join(root, paths.queue), 'utf8'));
  const errors = [];
  if (recipe.slug !== SLUG || recipe.publication?.status !== 'hors-file' || recipe.publication?.materialized !== false || recipe.publication?.sealed !== false) errors.push('La recette ne désigne pas un brouillon hors file, non matérialisé et non scellé.');
  if (recipe.cover?.status !== 'absente-volontairement' || recipe.cover.creditsHiggsfield !== 0 || recipe.image) errors.push('Le brouillon exige une absence volontaire de couverture, sans image ni crédit.');
  if (queue.candidates.some((item) => item.slug === SLUG)) errors.push('Le candidat apparaît dans la file de publication.');
  if (existsSync(join(root, `src/content/blog/${SLUG}.md`)) || existsSync(join(root, `editorial/articles/${SLUG}/manifest.json`))) errors.push('Le brouillon est matérialisé dans la collection ou le pipeline public.');
  errors.push(...verifierRegleEcrite(body, { date: recipe.date }));
  const evidence = replay.articles.find((article) => article.slug === SLUG);
  if (replay.status !== 'PASS' || evidence?.status !== 'PASS' || evidence.cases.length !== 5 || evidence.cases.some((c) => !c.passed) || evidence.bodySha256 !== hashFile(root, paths.body) || replay.fixtureSha256 !== hashFile(root, paths.fixture)) errors.push('Rejeu fictif absent, périmé ou non conforme aux cinq cas.');

  const sections = body.split(/(?=^## )/m).filter((section) => section.startsWith('## '));
  const claims = recipe.claims.map((claim) => {
    const matches = sections.filter((section) => section.startsWith(`## ${claim.unite}\n`));
    const source = recipe.sources.find((entry) => entry.id === claim.sourceId);
    if (matches.length !== 1 || !matches[0].toLowerCase().includes(claim.claim.toLowerCase()) || !source || !claim.excerpt.toLowerCase().includes(claim.claim.toLowerCase())) errors.push(`Claim introuvable ou source incorrecte : ${claim.claim}`);
    if (!matches[0]?.includes(`](${source?.url})`)) errors.push(`Source non liée inline : ${claim.sourceId}`);
    return { id: `claim-${recipe.claims.indexOf(claim) + 1}`, ...claim, url: source?.url ?? null };
  });
  if (claims.length !== 5) errors.push('Cinq claims doivent être soumis à la revue métier.');
  if (!body.includes('](/blog/automatiser-un-cabinet-comptable-la-carte-des-taches)') || recipe.cta.label !== 'Confier cette tâche' || recipe.cta.destination !== '/contact' || !recipe.cta.outcome.includes('Rien à envoyer')) errors.push('Pilier ou CTA canonique absent.');
  const fingerprint = Object.fromEntries(Object.entries(paths).map(([key, path]) => [key, { path, sha256: hashFile(root, path) }]));
  const packet = { version: 2, slug: SLUG, status: 'BROUILLON_HORS_PUBLICATION', cover: { status: 'absente-volontairement', creditsHiggsfield: 0, image: null }, publication: { queue: false, materialized: false }, fingerprint, title: recipe.title, primaryQuery: recipe.primaryQuery, role: recipe.role.primary, body, replay: evidence, sources: recipe.sources, claims, editorialCriteria: REVIEW_CRITERIA, preview: `${base}/preview-privee.html`, errors };
  const packetPath = join(root, base, 'paquet-revue.json');
  if (errors.length) throw new Error(errors.join('\n'));
  writeFileSync(packetPath, `${JSON.stringify(packet, null, 2)}\n`);
  writeFileSync(join(root, base, 'preview-privee.html'), renderDraft(body, recipe));
  return { packetPath, fingerprint, claims: claims.length, cases: evidence.cases.length };
}

export function seal(root = process.cwd()) {
  const packetPath = join(root, base, 'paquet-revue.json');
  const packet = JSON.parse(readFileSync(packetPath, 'utf8'));
  const reviewsPath = join(root, base, 'revues.json');
  const reviews = JSON.parse(readFileSync(reviewsPath, 'utf8'));
  if (packet.status !== 'BROUILLON_HORS_PUBLICATION' || packet.cover.status !== 'absente-volontairement' || packet.claims.length !== 5) throw new Error('Paquet hors contrat.');
  for (const { path, sha256 } of Object.values(packet.fingerprint)) if (hashFile(root, path) !== sha256) throw new Error(`Octets modifiés depuis la revue : ${path}`);
  const reviewed = reviews.subject;
  if (reviewed?.packetSha256 !== hashFile(root, `${base}/paquet-revue.json`) || reviewed?.previewSha256 !== hashFile(root, `${base}/preview-privee.html`)) throw new Error('Revue indépendante sur un paquet ou rendu différent.');
  if (reviews.verdict !== 'PASS' || reviews.editorial?.p0?.length || Object.values(reviews.editorial?.criteria ?? {}).length !== REVIEW_CRITERIA.length || Object.values(reviews.editorial.criteria).some((c) => c.result !== 'PASS') || packet.claims.some((c) => reviews.business?.claims?.[c.id]?.verdict !== 'soutient') || reviews.quality?.score < 90 || reviews.quality?.p0?.length) throw new Error('Revue indépendante FAIL ou incomplète.');
  const recipe = JSON.parse(readFileSync(join(root, paths.recipe), 'utf8'));
  const queue = JSON.parse(readFileSync(join(root, paths.queue), 'utf8'));
  if (recipe.publication.status !== 'hors-file' || queue.candidates.some((c) => c.slug === SLUG) || existsSync(join(root, `src/content/blog/${SLUG}.md`))) throw new Error('Brouillon en file ou matérialisé.');
  const result = { version: 1, status: 'SEALED_DRAFT_NOT_PUBLISHABLE', slug: SLUG, cover: 'absente-volontairement', packetSha256: reviewed.packetSha256, previewSha256: reviewed.previewSha256, reviewsSha256: hashFile(root, `${base}/revues.json`), fingerprint: packet.fingerprint, publication: false };
  writeFileSync(join(root, base, 'sceau-brouillon.json'), `${JSON.stringify(result, null, 2)}\n`);
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { console.log(JSON.stringify(process.argv[2] === 'preparer' ? prepare() : process.argv[2] === 'sceller' ? seal() : (() => { throw new Error('Usage : blog-draft-transmission <preparer|sceller>'); })(), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
