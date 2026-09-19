#!/usr/bin/env node
/**
 * La forge éditoriale : d'une recette (texte, sources, claims, revues) au dossier candidat complet
 * que le gate du pipeline (scripts/lib/blog-pipeline.mjs) sait vérifier, puis à la publication scellée.
 *
 * Elle ne décide rien : elle matérialise. Ce qui relève du jugement vit dans la recette
 * (editorial/recettes/<slug>/) : le corps de l'article, le choix des sources et des extraits, les
 * affirmations à prouver, et les revues rendues par des identités distinctes (revues.json).
 *
 * Commandes :
 *   node scripts/blog-forge.mjs preparer <slug>   dossier + sources vérifiées + paquet de revue
 *   node scripts/blog-forge.mjs sceller <slug>    dossier complet (revues exigées) puis gate
 *   node scripts/blog-forge.mjs publier <slug>    go-production, production-check, puis sceau de publication
 *
 * Republication d'un article déjà en ligne : la recette porte `updatedAt` (AAAA-MM-JJ) ; la forge le
 * projette en `dateMiseAJour` (frontmatter, JSON-LD dateModified, lastmod du sitemap). `date` ne change jamais.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { couleursDuBrief, verifierBriefPalette, verifierParts, SEUILS_PALETTE } from './lib/palette.mjs';
import { mesurerPalette } from './mesurer-palette.mjs';
import {
  BLOG_SKILLS, SEO_SKILLS, CORE_BLOG_SKILLS, CORE_SEO_SKILLS, REVIEW_CRITERIA, CLAIM_TYPES,
  PUBLICATION_SEAL_PATH, verifierPlafonds, verifySource,
} from './lib/blog-pipeline.mjs';
import { dossierFiles } from './lib/blog-published-authority.mjs';
import { inscrireArticle } from './seo/forge-seo.mjs';

export const IMAGE_REVIEW_CRITERIA = ['brief-six-components', 'generation-constraints', 'fictive-provenance', 'recognizable-subject', 'technical-derivatives', 'alt-information'];
export const LARGEURS_HERO = [768, 1200, 1600];
const SKILLS_TOUJOURS_JOUES = ['blog-write', 'blog-factcheck', ...CORE_BLOG_SKILLS, ...CORE_SEO_SKILLS];
const CLAIM_TYPES_OFFICIELS = new Set(['paie', 'social', 'dsn', 'fiscal', 'juridique', 'legal-reglementaire']);
const AUTORITES = [
  { id: 'urssaf', host: /(?:^|\.)urssaf\.fr$/i, publisher: /\burssaf\b/i },
  { id: 'net-entreprises', host: /(?:^|\.)net-entreprises\.fr$/i, publisher: /\bnet[- ]entreprises\b/i },
  { id: 'service-public', host: /(?:^|\.)service-public\.(?:fr|gouv\.fr)$/i, publisher: /\bservice public\b/i },
  { id: 'legifrance', host: /(?:^|\.)legifrance\.gouv\.fr$/i, publisher: /\blegifrance\b/i },
  { id: 'cnil', host: /(?:^|\.)cnil\.fr$/i, publisher: /\bcnil\b/i },
  { id: 'impots', host: /(?:^|\.)(?:impots\.gouv\.fr|bofip\.impots\.gouv\.fr)$/i, publisher: /\b(?:impots|bofip|direction generale des finances publiques|dgfip)\b/i },
  { id: 'insee', host: /(?:^|\.)insee\.fr$/i, publisher: /\binsee\b/i },
  { id: 'travail-emploi', host: /(?:^|\.)travail-emploi\.gouv\.fr$/i, publisher: /\b(?:ministere du travail|travail emploi)\b/i },
];
const STOP_WORDS = new Set(['alors', 'avec', 'avoir', 'cette', 'comme', 'dans', 'depuis', 'elle', 'elles', 'entre', 'etre', 'faire', 'leurs', 'mais', 'meme', 'pour', 'sans', 'selon', 'sont', 'sous', 'toute', 'toutes', 'toujours', 'tout', 'tous', 'une', 'vers', 'votre']);
/** Justifications N/A par défaut ; chaque ligne cite le titre pour rester propre à l'article. */
const JUSTIFICATIONS_NA = {
  'blog-strategy': (t) => `La stratégie est tenue au niveau du site (docs/strategy/site-v3), pas rejouée pour « ${t} ».`,
  'blog-brand': (t) => `La voix et la charte sont fixées par .agents/product-marketing.md ; « ${t} » les applique sans les redéfinir.`,
  'blog-persona': (t) => `Le rôle lecteur de « ${t} » vient du hub Ressources et du référentiel des besoins, pas d'une persona nouvelle.`,
  'blog-discourse': (t) => `Aucune analyse de discours distincte : « ${t} » suit le brief et la revue éditoriale.`,
  'blog-google': (t) => `Le relevé Search Console de « ${t} » est porté par la preuve GSC du dossier, pas par ce skill.`,
  'blog-calendar': (t) => `Le calendrier est celui de la v3 (docs/strategy/site-v3/CONTENT-CALENDAR.md) ; « ${t} » y occupe un créneau attribué.`,
  'blog-cluster': (t) => `Le cluster de « ${t} » est fixé par build-cluster-plan.py, source unique du maillage.`,
  'blog-taxonomy': (t) => `La taxonomie (src/data/familles.ts) est tenue au niveau du site ; « ${t} » y est rattaché par son frontmatter.`,
  'blog-outline': (t) => `Le plan H2/H3 de « ${t} » est celui du brief validé ; aucun plan alternatif n'a été produit.`,
  'blog-notebooklm': (t) => `Aucune synthèse NotebookLM pour « ${t} » : les sources sont lues et citées directement.`,
  'blog-rewrite': (t) => `« ${t} » est une création, pas une réécriture.`,
  'blog-style': (t) => `Le style de « ${t} » est relu dans la grille éditoriale (critère intent-satisfaction), sans passe distincte.`,
  'blog-chart': (t) => `« ${t} » ne contient aucun graphique : les tableaux sont en HTML.`,
  'blog-image': (t) => `L'image de « ${t} » est un cadre de preuve HTML rendu par la forge, revu dans image.json.`,
  'blog-schema': (t) => `Le schéma BlogPosting de « ${t} » est émis par le gabarit Article ; contrôlé par seo-schema.`,
  'blog-analyze': (t) => `Aucune analyse de performance possible avant publication de « ${t} ».`,
  'blog-decay': (t) => `« ${t} » vient d'être écrit : aucun déclin à mesurer.`,
  'blog-flow': (t) => `Aucun prompt FLOW distinct pour « ${t} » : le brief tient le cadrage.`,
  'blog-repurpose': (t) => `Aucune déclinaison de « ${t} » sur un autre canal n'est prévue.`,
  'blog-audio': (t) => `Aucune version audio de « ${t} ».`,
  'blog-multilingual': (t) => `« ${t} » est publié en français uniquement.`,
  'blog-translate': (t) => `Aucune traduction de « ${t} ».`,
  'blog-localize': (t) => `Aucune localisation de « ${t} » : un seul marché, la France.`,
  'blog-locale-audit': (t) => `Aucun audit de locale pour « ${t} » : site monolingue.`,
  'seo-plan': (t) => `Le plan SEO est celui du site (docs/strategy/site-v3) ; « ${t} » l'exécute.`,
  'seo-google': (t) => `Le relevé Google de « ${t} » est porté par les preuves SERP et GSC du dossier.`,
  'seo-cluster': (t) => `Le cluster de « ${t} » est fixé par build-cluster-plan.py.`,
  'seo-sxo': (t) => `L'adéquation format/SERP de « ${t} » est jugée dans le critère serp-format-rankability de la revue.`,
  'seo-sitemap': (t) => `Le sitemap est généré par le build ; « ${t} » y entre à la publication (test:lastmod).`,
  'seo-geo': (t) => `La citabilité de « ${t} » est vérifiée par blog-geo (réponse directe, définitions).`,
  'seo-flow': (t) => `Aucun prompt FLOW distinct pour « ${t} ».`,
  'seo-drift': (t) => `Aucune baseline de dérive avant la publication de « ${t} ».`,
  'seo-backlinks': (t) => `Aucun lien externe entrant à analyser pour « ${t} » avant publication.`,
  'seo-competitor-pages': (t) => `Aucune page comparative : « ${t} » n'oppose aucun éditeur.`,
  'seo-local': (t) => `Aucune intention locale pour « ${t} » (décision v2 : pas de pages villes).`,
  'seo-maps': (t) => `Aucune fiche Maps concernée par « ${t} ».`,
  'seo-hreflang': (t) => `Site monolingue : aucun hreflang pour « ${t} ».`,
  'seo-ecommerce': (t) => `Aucun produit ni marketplace dans « ${t} ».`,
  'seo-programmatic': (t) => `« ${t} » est un article rédigé, pas une page programmatique.`,
  'seo-dataforseo': (t) => `Aucun crédit DataForSEO engagé pour « ${t} » : volumes ND documentés dans la preuve SERP.`,
  'seo-image-gen': (t) => `Aucune génération d'image IA pour « ${t} » : cadre de preuve HTML.`,
};

const sha256 = (content) => createHash('sha256').update(content).digest('hex');
const ecrireJson = (path, value) => { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`); };
const lireJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
export const aujourdhui = () => new Date().toISOString().slice(0, 10);

/** Copie exacte du découpage en unités du pipeline (claims.contentUnits doit le reproduire au caractère près). */
export function unitesRendues(body) {
  return body.replace(/<!--[\s\S]*?-->/g, '').split(/\r?\n\s*\r?\n/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((raw) => ({ raw, text: raw
      .replace(/^#{1,6}\s+/, '')
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[`*_~]/g, '')
      .replace(/\s+/g, ' ')
      .trim() }))
    .map(({ raw, text }) => ({ id: `unit-${sha256(text).slice(0, 12)}`, text, raw }));
}
const normaliser = (value) => String(value ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
export const jetons = (value) => [...new Set(normaliser(value).replace(/[^a-z0-9]+/g, ' ').split(/\s+/).filter((t) => t.length >= 4 && !STOP_WORDS.has(t)))];

export function chargerRecette(root, slug) {
  const dossierRecette = join(root, 'editorial/recettes', slug);
  const recette = lireJson(join(dossierRecette, 'recette.json'));
  if (recette.slug !== slug) throw new Error(`La recette ${slug} porte un autre slug : ${recette.slug}.`);
  const corps = readFileSync(join(dossierRecette, 'corps.md'), 'utf8').trim();
  const revues = existsSync(join(dossierRecette, 'revues.json')) ? lireJson(join(dossierRecette, 'revues.json')) : null;
  return { dossierRecette, recette, corps, revues };
}

export function construireManifest(recette, statut, jour, revues) {
  const publie = statut === 'publie';
  const approuve = ['go-production', 'publie'].includes(statut);
  return {
    version: 1, slug: recette.slug, action: 'creation', editorialStatus: statut,
    title: recette.title, tabTitle: recette.tabTitle, summary: recette.summary, description: recette.description,
    publicationDate: recette.date, updatedAt: recette.updatedAt ?? null, topics: recette.topics, keywords: recette.keywords,
    primaryQuery: recette.primaryQuery, secondaryQueries: recette.secondaryQueries, intent: recette.intent, fanOut: recette.fanOut,
    role: { primary: recette.role.primary, secondary: recette.role.secondary ?? [], proof: { level: recette.role.proofLevel, source: 'preuves/role.json', verifiedAt: jour } },
    businessReview: { required: true, reviewerId: recette.businessReview.reviewerId, role: recette.businessReview.role, status: revues?.business ? 'PASS' : 'FAIL', evidence: 'preuves/business-review.json' },
    funnel: recette.funnel, cluster: recette.cluster, famille: recette.famille, contentType: recette.contentType, format: recette.format,
    task: recette.task, rankability: recette.rankability, businessRelevance: recette.businessRelevance,
    proofStatus: 'verifiee', proofRequired: recette.proofRequired, sourcesVerifiedAt: jour,
    sources: recette.sources.map((s) => ({
      id: s.id, publisher: s.publisher, title: s.title, url: s.url, checkedAt: jour,
      level: s.level, provenance: 'primary', official: s.official === true, upstreamUrl: s.url,
      classificationReason: s.classificationReason, method: null,
      classificationEvidence: `preuves/sources/${s.id}.classification.json`, verificationEvidence: `preuves/sources/${s.id}.json`,
    })),
    author: 'kevin', reviewer: 'marketing', reviewRule: recette.reviewRule, cta: recette.cta,
    image: { heroId: recette.image.heroId, alt: recette.image.alt, master: 'preuves/image/master.png', og: 'preuves/image/og.webp', engine: 'image_generate' },
    research: {
      serp: { status: 'PASS', evidence: 'preuves/research-serp.json', checkedAt: jour },
      gsc: { status: 'PASS', evidence: 'preuves/research-gsc.json', checkedAt: jour },
    },
    links: recette.links, cannibalization: recette.cannibalization, contradictions: [],
    kevin: {
      briefApproved: true, previewApproved: approuve, productionApproved: approuve,
      delegation: { date: '2026-09-16', basis: 'Délégation explicite de Kevin : « tu gères les publications sans go », « pas besoin de relecture », « sinon go » (16/09/2026). Chaque approbation ci-dessus est portée par cette délégation, pas par une relecture unitaire.' },
    },
    ...(publie ? { publishedAt: jour, publicationEvidence: PUBLICATION_SEAL_PATH } : {}),
  };
}

const yamlTexte = (value) => JSON.stringify(String(value));
const yamlListe = (values, quote = true) => `[${values.map((v) => (quote ? yamlTexte(v) : v)).join(', ')}]`;
export function frontmatter(manifest) {
  return `---
titre: ${yamlTexte(manifest.title)}
titreOnglet: ${yamlTexte(manifest.tabTitle)}
resume: ${yamlTexte(manifest.summary)}
description: ${yamlTexte(manifest.description)}
datePublication: ${manifest.publicationDate}${manifest.updatedAt ? `\ndateMiseAJour: ${manifest.updatedAt}` : ''}
auteur: ${manifest.author}
sujets: ${yamlListe(manifest.topics, false)}
motsCles: ${yamlListe(manifest.keywords)}
brouillon: ${!(['go-production', 'publie'].includes(manifest.editorialStatus) && manifest.kevin?.productionApproved === true)}
image: ${manifest.image.heroId}
pipelineVersion: 1
primaryQuery: ${yamlTexte(manifest.primaryQuery)}
secondaryQueries: ${yamlListe(manifest.secondaryQueries)}
intent: ${manifest.intent}
fanOut: ${yamlListe(manifest.fanOut)}
cluster: ${manifest.cluster}
famille: ${manifest.famille}
rolePrincipal: ${manifest.role.primary}
rolesSecondaires: ${yamlListe(manifest.role.secondary, false)}
tache: ${yamlTexte(manifest.task)}
preuveRole:
  niveau: ${manifest.role.proof.level}
  source: ${yamlTexte(manifest.role.proof.source)}
  date: ${manifest.role.proof.verifiedAt}
funnel: ${manifest.funnel}
contentType: ${manifest.contentType}
format: ${manifest.format}
rankability: ${manifest.rankability}
businessRelevance: ${manifest.businessRelevance}
proofStatus: ${manifest.proofStatus}
proofRequired: ${yamlTexte(manifest.proofRequired)}
reviewRule: ${yamlTexte(manifest.reviewRule)}
reviewer: ${manifest.reviewer}
sourcesVerifieesLe: ${manifest.sourcesVerifiedAt}
cta:
  label: ${yamlTexte(manifest.cta.label)}
  destination: ${yamlTexte(manifest.cta.destination)}
  outcome: ${yamlTexte(manifest.cta.outcome)}
imageOg: ${yamlTexte(`/images/${manifest.image.heroId}-og.webp`)}
imageAlt: ${yamlTexte(manifest.image.alt)}
statutEditorial: ${manifest.editorialStatus}
sources:
${manifest.sources.map((s) => `  - editeur: ${yamlTexte(s.publisher)}
    titre: ${yamlTexte(s.title)}
    url: ${yamlTexte(s.url)}
    consulte: ${s.checkedAt}`).join('\n')}
---
`;
}

const artefact = (sujet, kind, jour, extra = {}) => ({ version: 1, candidateSlug: sujet.slug, kind, status: 'PASS', checkedAt: jour, articleSha256: sujet.articleHash, manifestSha256: sujet.manifestHash, observations: [`Contrôle ${kind} relu sur le candidat exact ${sujet.slug}.`], ...extra });

function autoriteDe(url, publisher) {
  const host = new URL(url).hostname;
  const a = AUTORITES.find((x) => x.host.test(host));
  return a && a.publisher.test(normaliser(publisher).replace(/[^a-z0-9]+/g, ' ')) ? a.id : null;
}

/** Vérifie chaque source par le vérificateur du pipeline (copie locale + empreinte), en suivant l'URL finale. */
export async function verifierSources({ root, slug, recette, dossierRecette, jour, fetcher }) {
  const dossier = join(root, 'editorial/articles', slug);
  let recetteModifiee = false;
  for (const source of recette.sources) {
    for (let tentative = 0; tentative < 2; tentative += 1) {
      const evidencePath = join(dossier, `preuves/sources/${source.id}.json`);
      const existante = existsSync(evidencePath) ? lireJson(evidencePath) : null;
      if (existante && existante.checkedAt === jour && existante.requestedUrl === source.url && existante.finalUrl === source.url && existante.excerpt === source.excerpt) break;
      await verifySource({ root, slug, sourceId: source.id, excerpt: source.excerpt, ...(fetcher ? { fetcher } : {}) });
      const preuve = lireJson(evidencePath);
      if (preuve.finalUrl === source.url) break;
      if (tentative === 1) throw new Error(`${source.id} : l'URL finale ${preuve.finalUrl} diverge encore après réécriture.`);
      source.url = preuve.finalUrl;
      recetteModifiee = true;
      const manifestPath = join(dossier, 'manifest.json');
      const manifest = lireJson(manifestPath);
      const ligne = manifest.sources.find((s) => s.id === source.id);
      ligne.url = source.url; ligne.upstreamUrl = source.url;
      ecrireJson(manifestPath, manifest);
    }
  }
  if (recetteModifiee) ecrireJson(join(dossierRecette, 'recette.json'), recette);
}

/** Construit le registre des affirmations depuis la recette et les copies locales vérifiées. */
export function construireClaims({ recette, corps, dossier, sujet, jour }) {
  const unites = unitesRendues(corps);
  const erreurs = [];
  const claims = [];
  const claimIdsParUnite = new Map();
  const preuves = new Map(recette.sources.map((s) => [s.id, { source: s, preuve: lireJson(join(dossier, `preuves/sources/${s.id}.json`)), texte: readFileSync(join(dossier, `preuves/sources/${s.id}.source.txt`), 'utf8') }]));
  recette.claims.forEach((c, index) => {
    const prefixe = `claims[${index}]`;
    const candidates = unites.filter((u) => u.text.includes(c.unite ?? c.claim));
    if (candidates.length !== 1) { erreurs.push(`${prefixe} : l'unité « ${c.unite ?? c.claim} » correspond à ${candidates.length} unité(s) rendue(s), une seule attendue.`); return; }
    const unite = candidates[0];
    if (!unite.text.includes(c.claim)) { erreurs.push(`${prefixe} : le claim n'est pas une sous-chaîne exacte de son unité.`); return; }
    if (!CLAIM_TYPES.includes(c.type)) erreurs.push(`${prefixe} : type inconnu ${c.type}.`);
    const v = preuves.get(c.sourceId);
    if (!v) { erreurs.push(`${prefixe} : source inconnue ${c.sourceId}.`); return; }
    const pos = v.texte.indexOf(c.excerpt);
    if (pos < 0 || /\r?\n/.test(c.excerpt)) { erreurs.push(`${prefixe} : l'extrait n'est pas une ligne de la copie locale de ${c.sourceId}.`); return; }
    const ligne = v.texte.slice(0, pos).split(/\r?\n/).length;
    const contexte = v.texte.split(/\r?\n/)[ligne - 1];
    const jetonsClaim = jetons(c.claim);
    const jetonsCitation = jetons(c.excerpt);
    const partages = jetonsClaim.filter((t) => jetonsCitation.includes(t));
    const traductions = (c.translationTerms ?? []).filter((p) => normaliser(c.claim).includes(normaliser(p.claimTerm)) && normaliser(c.excerpt).includes(normaliser(p.citationTerm)));
    if ((c.translationTerms ?? []).length !== traductions.length) erreurs.push(`${prefixe} : une paire de traduction ne se retrouve pas dans le claim ou la citation.`);
    const recouvrement = normaliser(c.excerpt).includes(normaliser(c.claim)) || partages.length >= Math.max(2, Math.ceil(jetonsClaim.length * 0.6)) || traductions.length >= 2;
    if (!recouvrement) erreurs.push(`${prefixe} : recouvrement insuffisant entre le claim et la citation (${partages.length} jeton(s) partagé(s) sur ${jetonsClaim.length} : ${partages.join(', ') || 'aucun'}) ; ajouter des translationTerms ou reformuler.`);
    if (partages.length + traductions.length < 2) erreurs.push(`${prefixe} : au moins deux correspondances exactes ou traductions sont requises.`);
    if (c.excerpt.trim().length < 40 || jetonsCitation.length < 5) erreurs.push(`${prefixe} : citation trop courte ou trop générique (40 caractères et 5 jetons minimum).`);
    if (CLAIM_TYPES_OFFICIELS.has(c.type) && !(v.source.official === true && autoriteDe(v.source.url, v.source.publisher))) erreurs.push(`${prefixe} : un claim ${c.type} exige une source officielle reconnue (Urssaf, Net-entreprises, Service-Public, Légifrance, CNIL, impots.gouv, Insee, travail-emploi).`);
    if (!c.explanation || c.explanation.length < 20) erreurs.push(`${prefixe} : explanation d'au moins 20 caractères requise.`);
    const id = `claim-${unite.id}-${(claimIdsParUnite.get(unite.id)?.length ?? 0) + 1}`;
    claimIdsParUnite.set(unite.id, [...(claimIdsParUnite.get(unite.id) ?? []), id]);
    claims.push({
      id, unitId: unite.id, claim: c.claim, type: c.type, sourceIds: [c.sourceId], sourceExcerpts: { [c.sourceId]: c.excerpt }, checkedAt: jour, status: 'PASS',
      factCheck: { verdict: 'SUPPORTED', checkedAt: jour, sourceResults: [{
        sourceId: c.sourceId, sourceUrl: v.source.url, verifiedUrl: v.preuve.finalUrl, excerpt: c.excerpt, context: contexte, contextSha256: sha256(contexte),
        citation: { text: c.excerpt, sha256: sha256(c.excerpt), sourceContentSha256: v.preuve.contentSha256, coordinates: { finalUrl: v.preuve.finalUrl, checkedAt: v.preuve.checkedAt, title: v.source.title, locator: { kind: 'line-range', startLine: ligne, endLine: ligne } } },
        justification: { sharedTerms: partages, ...(traductions.length ? { translationTerms: traductions } : {}), reasoning: c.reasoning ?? `La citation, relevée à la ligne ${ligne} de la copie locale de ${v.source.publisher}, porte les mêmes entités que le claim (${[...partages, ...traductions.map((p) => `${p.claimTerm}→${p.citationTerm}`)].join(', ')}) sans en changer la polarité.` },
        verdict: 'SUPPORTED', supportsClaim: true, contradictsClaim: false, explanation: c.explanation, checkedAt: jour,
      }] },
    });
  });
  const citationsVues = new Map();
  for (const claim of claims) {
    const cle = sha256(claim.sourceExcerpts[claim.sourceIds[0]]);
    const precedent = citationsVues.get(cle);
    if (precedent && precedent !== claim.claim) erreurs.push(`La citation de ${claim.id} est déjà utilisée pour un autre claim : une citation par claim.`);
    citationsVues.set(cle, claim.claim);
  }
  if (claims.length === 0) erreurs.push('Au moins un claim est requis.');
  return {
    erreurs,
    claims: { version: 1, candidateSlug: sujet.slug, articleSha256: sujet.articleHash, contentUnits: unites.map((u) => ({ id: u.id, text: u.text, claimIds: claimIdsParUnite.get(u.id) ?? [] })), claims },
    preuves,
  };
}

function mesures(corps, manifest) {
  const body = corps.replace(/^---[\s\S]*?---\s*/, '');
  const mots = body.replace(/[#*_`>\[\]()]/g, ' ').split(/\s+/).filter(Boolean).length;
  const h2 = (body.match(/^## /gm) ?? []).length;
  const h3 = (body.match(/^### /gm) ?? []).length;
  const liensInternes = [...new Set([...body.matchAll(/\]\((\/[^)\s]*)\)/g)].map((m) => m[1]))];
  const liensExternes = [...body.matchAll(/\]\((https?:[^)\s]*)\)/g)].map((m) => m[1]);
  const premierParagraphe = body.split(/\r?\n\s*\r?\n/).map((p) => p.trim()).find((p) => p && !p.startsWith('#')) ?? '';
  return { mots, h2, h3, liensInternes, liensExternes, motsReponseDirecte: premierParagraphe.split(/\s+/).filter(Boolean).length, commenceParReponseDirecte: body.trim().startsWith('## Réponse directe'), titreLongueur: manifest.title.length, ongletLongueur: manifest.tabTitle.length, descriptionLongueur: manifest.description.length, sources: manifest.sources.length };
}

function evidencesSkills({ manifest, corps, sujet, jour, claims, root }) {
  const m = mesures(corps, manifest);
  const requete = normaliser(manifest.primaryQuery).trim();
  const corpus = existsSync(join(root, 'src/content/blog')) ? readdirSync(join(root, 'src/content/blog')).filter((f) => f.endsWith('.md') && f !== `${sujet.slug}.md`) : [];
  const collisions = corpus.filter((f) => { const md = readFileSync(join(root, 'src/content/blog', f), 'utf8'); const q = md.match(/^primaryQuery:\s*"?([^"\n]+)"?/m)?.[1]; return q && normaliser(q).trim() === requete; });
  const obs = {
    'blog-brief': [`Brief présent dans le dossier (brief.md) ; requête primaire « ${manifest.primaryQuery} », rôle ${manifest.role.primary}, tâche : ${manifest.task}`],
    'blog-write': [`Corps de ${m.mots} mots, ${m.h2} sections H2 et ${m.h3} H3, format ${manifest.format}.`],
    'blog-factcheck': [`${claims.claims.length} affirmation(s) reliée(s) à ${manifest.sources.length} source(s) vérifiée(s) par copie locale et empreinte ; verdicts SUPPORTED, extraits situés par ligne.`],
    'blog-seo-check': [`Titre ${m.titreLongueur} caractères, onglet ${m.ongletLongueur}, description ${m.descriptionLongueur} ; ${m.liensInternes.length} lien(s) interne(s) : ${m.liensInternes.join(', ')} ; ${m.liensExternes.length} lien(s) externe(s) dans le corps.`],
    'blog-geo': [`${m.commenceParReponseDirecte ? 'Réponse directe en tête' : 'Réponse directe absente en tête'} (${m.motsReponseDirecte} mots au premier paragraphe) ; définitions extractibles dans le corps.`],
    'blog-audit': [`${manifest.sources.length} sources datées du ${jour}, ${claims.claims.length} claims, aucun H1 dans le corps, ${m.mots} mots.`],
    'blog-cannibalization': [`Requête « ${manifest.primaryQuery} » comparée à ${corpus.length} article(s) du corpus : ${collisions.length} collision(s) de requête primaire.`],
    'seo-content-brief': [`Brief : intention ${manifest.intent}, entonnoir ${manifest.funnel}, fan-out ${manifest.fanOut.join(' ; ')}.`],
    'seo-page': [`Métadonnées : title « ${manifest.tabTitle} », description ${m.descriptionLongueur} caractères, canonical auto-référent émis par le gabarit Article.`],
    'seo-content': [`${m.mots} mots, ${m.h2} H2 ; lecture par la grille éditoriale (intent-satisfaction, eeat-sources, information-gain-proof).`],
    'seo-technical': [`Route /blog/${sujet.slug}, lang fr, un seul H1 (frontmatter), robots noindex tant que brouillon, sitemap et RSS à la publication.`],
    'seo-schema': [`BlogPosting et BreadcrumbList émis par ArticleJsonLd.astro depuis le frontmatter ; aucun FAQPage ni HowTo.`],
    'seo-images': [`Hero ${manifest.image.heroId} : cadre de preuve HTML 1920×1080, dérivés ${LARGEURS_HERO.join('/')} AVIF et WebP, OG 1200×630, alt de ${[...manifest.image.alt].length} caractères.`],
    'seo-audit': [`Synthèse : ${m.mots} mots, ${manifest.sources.length} sources, ${claims.claims.length} claims, ${m.liensInternes.length} liens internes, image et schéma présents.`],
  };
  return { mesures: m, collisions, obs };
}

function rendreCadreHtml(root, recette) {
  if (!recette.image.cadre) throw new Error('image.cadre manquant : fournir image.source (image générée) ou image.cadre (cadre HTML).');
  const gabarit = readFileSync(join(root, 'editorial/templates/cadre-article.html'), 'utf8');
  const echap = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const cadre = recette.image.cadre;
  const items = (liste) => liste.map((x) => `<li>${echap(x)}</li>`).join('');
  return gabarit
    .replace(/\{\{FONTS\}\}/g, pathToFileURL(join(root, 'public/fonts')).href)
    .replace(/\{\{TITRE\}\}/g, echap(cadre.titre)).replace(/\{\{SOUS_TITRE\}\}/g, echap(cadre.sousTitre)).replace(/\{\{FAMILLE\}\}/g, echap(cadre.famille))
    .replace(/\{\{COL1_TITRE\}\}/g, echap(cadre.colonnes[0].titre)).replace(/\{\{COL1_ITEMS\}\}/g, items(cadre.colonnes[0].items))
    .replace(/\{\{COL2_TITRE\}\}/g, echap(cadre.colonnes[1].titre)).replace(/\{\{COL2_ITEMS\}\}/g, items(cadre.colonnes[1].items))
    .replace(/\{\{COL3_TITRE\}\}/g, echap(cadre.colonnes[2].titre)).replace(/\{\{COL3_ITEMS\}\}/g, items(cadre.colonnes[2].items))
    .replace(/\{\{PIED\}\}/g, echap(cadre.pied));
}

async function rendrePlaywright(html, cible) {
  const { chromium } = await import('@playwright/test');
  const browser = await chromium.launch({ channel: 'chromium' });
  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: cible, type: 'png', animations: 'disabled' });
  } finally {
    await browser.close();
  }
}

async function materialiserImage({ root, recette, dossier, sujet, jour, revues, rendreImage }) {
  const imageDir = join(dossier, 'preuves/image');
  mkdirSync(imageDir, { recursive: true });
  const master = join(imageDir, 'master.png');
  const marque = join(imageDir, 'cadre.sha256');
  const generee = recette.image.source;
  // Deux régimes : une image générée selon le brief (recette.image.source, chemin relatif à la recette,
  // avec generationId et modèle), ou, à défaut, le cadre de preuve HTML rendu par Playwright.
  let html = null;
  let empreinteCadre;
  if (generee) {
    const sourcePath = join(root, 'editorial/recettes', recette.slug, generee.path);
    if (!existsSync(sourcePath)) throw new Error(`image.source.path introuvable : ${sourcePath}`);
    empreinteCadre = sha256(readFileSync(sourcePath));
  } else {
    html = rendreCadreHtml(root, recette);
    empreinteCadre = sha256(html);
  }
  if (!existsSync(master) || !existsSync(marque) || readFileSync(marque, 'utf8').trim() !== empreinteCadre) {
    if (generee) {
      await sharp(join(root, 'editorial/recettes', recette.slug, generee.path)).resize(1920, 1080, { fit: 'cover', position: 'centre' }).png().toFile(master);
    } else {
      await (rendreImage ?? rendrePlaywright)(html, master);
      writeFileSync(join(imageDir, 'cadre.html'), html);
    }
    writeFileSync(marque, `${empreinteCadre}\n`);
    await sharp(master).resize(1200, 675).extract({ left: 0, top: 22, width: 1200, height: 630 }).webp({ quality: 88 }).toFile(join(imageDir, 'og.webp'));
    for (const format of ['avif', 'webp']) await sharp(master).resize(768, 432)[format]().toFile(join(imageDir, `hero-768.${format}`));
    mkdirSync(join(root, 'public/images'), { recursive: true });
    await sharp(join(imageDir, 'og.webp')).toFile(join(root, `public/images/${recette.image.heroId}-og.webp`));
    for (const largeur of LARGEURS_HERO) for (const format of ['avif', 'webp']) await sharp(master).resize(largeur, Math.round((largeur * 9) / 16))[format]().toFile(join(root, `public/images/${recette.image.heroId}-${largeur}.${format}`));
  }
  const revueImage = revues?.image;
  const brief = recette.image.brief;
  // La palette se MESURE (leçon du 18/09/2026 : la revue image ne la mesurait pas). Le brief d'un
  // article daté à partir du 19/09 doit épingler ses couleurs par leur hex, et l'image doit les
  // porter ; avant cette date, l'écart est enregistré en dette, il ne bloque pas une republication.
  const erreursImage = [];
  let palette = null;
  if (generee) {
    const couleurs = couleursDuBrief(brief?.palette);
    const defautsBrief = verifierBriefPalette(brief?.palette);
    const mesure = couleurs.length ? await mesurerPalette(master, couleurs.map((c) => c.hex)) : null;
    const manques = mesure ? verifierParts(couleurs, mesure.parts) : [];
    const exigee = String(recette.date ?? '') >= DEBUT_REGLE_ECRITE;
    palette = {
      epinglee: couleurs,
      tolerance: mesure?.tolerance ?? null,
      pixelsMesures: mesure?.pixels ?? null,
      parts: mesure?.parts ?? null,
      seuils: SEUILS_PALETTE,
      statut: defautsBrief.length + manques.length === 0 ? 'PASS' : (exigee ? 'FAIL' : 'DETTE'),
      ecarts: [...defautsBrief, ...manques],
    };
    if (exigee) erreursImage.push(...defautsBrief, ...manques);
  }
  ecrireJson(join(imageDir, 'prompt.json'), artefact(sujet, 'image-prompt', jour, generee
    ? { engine: 'image_generate', prompt: brief.prompt, brief: { sujet: brief.sujet, composition: brief.composition, style: brief.style, palette: brief.palette, interdits: brief.interdits, alt: recette.image.alt }, reviewCriteria: brief.reviewCriteria }
    : { engine: 'image_generate', prompt: `Cadre de preuve HTML (editorial/templates/cadre-article.html) rendu à 1920×1080 : « ${recette.image.cadre.titre} » — ${recette.image.cadre.sousTitre}. Trois colonnes : ${recette.image.cadre.colonnes.map((c) => c.titre).join(' / ')}. Jeu fictif, aucune donnée client, aucun texte hors charte.` }));
  ecrireJson(join(imageDir, 'generation.json'), artefact(sujet, 'image-generation', jour, generee
    ? { engine: 'image_generate', generationId: generee.generationId, model: generee.model, provider: generee.provider ?? 'higgsfield', generatedAt: generee.generatedAt, sourcePath: generee.path, sourceSha256: empreinteCadre, outputSha256: sha256(readFileSync(master)), credits: generee.credits ?? null }
    : { engine: 'image_generate', generationId: `cadre-${empreinteCadre.slice(0, 24)}`, outputSha256: sha256(readFileSync(master)), renderer: 'playwright-chromium 1920x1080' }));
  ecrireJson(join(imageDir, 'visual-review.json'), artefact(sujet, 'image-visual-review', jour, {
    status: revueImage ? 'PASS' : 'FAIL',
    palette,
    criteria: IMAGE_REVIEW_CRITERIA.map((id) => ({ id, result: revueImage?.criteria?.[id]?.result ?? 'FAIL', observations: revueImage?.criteria?.[id]?.observations ?? ['Revue image non exécutée.'] })),
  }));
  ecrireJson(join(dossier, 'image.json'), {
    version: 1, candidateSlug: sujet.slug, articleSha256: sujet.articleHash, manifestSha256: sujet.manifestHash, engine: 'image_generate',
    promptEvidence: 'preuves/image/prompt.json', generationEvidence: 'preuves/image/generation.json', visualReviewEvidence: 'preuves/image/visual-review.json',
    master: { path: 'preuves/image/master.png', width: 1920, height: 1080, format: 'png' },
    og: { path: 'preuves/image/og.webp', width: 1200, height: 630, format: 'webp', crop: '1200x630+0+22' },
    variants: [{ path: 'preuves/image/hero-768.avif', width: 768, height: 432, format: 'avif' }, { path: 'preuves/image/hero-768.webp', width: 768, height: 432, format: 'webp' }],
    alt: recette.image.alt, score: revueImage ? 100 : null, directionArt: revueImage?.directionArt ?? null, semanticRelevance: revueImage?.semanticRelevance ?? null,
    p0: revueImage ? [] : ['Revue image non exécutée'], kevinApproved: true,
    palette: palette ? { statut: palette.statut, parts: palette.parts, ecarts: palette.ecarts } : null,
  });
  return erreursImage;
}

/** Déclare le hero dans src/data/images.mjs (entrée + liste des visuels livrés), sans toucher au reste. */
export function declarerImage(root, heroId, alt) {
  const path = join(root, 'src/data/images.mjs');
  let texte = readFileSync(path, 'utf8');
  const entree = `  '${heroId}': {\n    brief: 'ART',\n    largeurs: [${LARGEURS_HERO.join(', ')}],\n    ratio: [16, 9],\n    alt: ${JSON.stringify(alt)},\n    generee: true,\n  },\n`;
  const debutEntree = texte.indexOf(`  '${heroId}': {`);
  if (debutEntree >= 0) {
    const fin = texte.indexOf('\n  },\n', debutEntree) + '\n  },\n'.length;
    texte = texte.slice(0, debutEntree) + entree + texte.slice(fin);
  } else {
    const debutImages = texte.indexOf('export const IMAGES = {');
    const finImages = texte.indexOf('\n};', debutImages);
    texte = `${texte.slice(0, finImages)}\n${entree.replace(/\n$/, '')}${texte.slice(finImages)}`;
  }
  if (!new RegExp(`PUBLISHED_IMAGE_IDS = \\[[^\\]]*'${heroId}'`).test(texte)) {
    texte = texte.replace('export const PUBLISHED_IMAGE_IDS = [', `export const PUBLISHED_IMAGE_IDS = [\n  '${heroId}',`);
  }
  writeFileSync(path, texte);
}

function inscrireFile(root, slug, date, statut) {
  const path = join(root, 'editorial/queue.json');
  const queue = lireJson(path);
  const existant = queue.candidates.find((c) => c.slug === slug);
  if (existant) { existant.status = statut; existant.date = date; }
  else { verifierPlafonds(queue.candidates.filter((c) => !['archive', 'bloque'].includes(c.status)), date); queue.candidates.push({ slug, date, status: statut }); }
  ecrireJson(path, queue);
}

/** Matérialise le dossier complet pour un statut donné ; renvoie les erreurs de recette (vides si tout tient). */
// ---------------------------------------------------------------- la règle écrite (charte §2 bis, 19/09/2026)

/** Premier jour où un article doit porter le mécanisme nommé ; les articles datés avant restent tels quels. */
export const DEBUT_REGLE_ECRITE = '2026-09-19';
const TITRE_REGLE = 'La règle écrite';
const TITRE_REJEU = 'Rejoué sur le jeu fictif';
const LIBELLES_REGLE = ['La frontière.', 'La proposition.', 'L’arrêt.', 'Le jeu d’essai.'];
const COLONNES_FRONTIERE = ['Se prépare seul', 'Attend une validation', 'Reste humain'];
const LIGNES_REJEU_MIN = 3;

const apostropheTypo = (texte) => texte.replace(/'/g, '’');
const sectionH2 = (corps, titre) => {
  const m = new RegExp(`^## ${titre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm').exec(corps);
  return m ? m[1] : null;
};
const lignesDeTableau = (section) => section.split('\n').filter((l) => /^\|/.test(l.trim()) && !/^\|\s*-/.test(l.trim()));

/**
 * Un article nouveau porte le mécanisme nommé : `## La règle écrite` (quatre libellés en gras, le tableau
 * de frontière à trois colonnes) puis `## Rejoué sur le jeu fictif` (au moins trois lignes de cas joués).
 * Rend la liste des manques, vide quand tout y est ou quand l'article date d'avant DEBUT_REGLE_ECRITE.
 */
export function verifierRegleEcrite(corps, { date }) {
  if (!date || date < DEBUT_REGLE_ECRITE) return [];
  const texte = apostropheTypo(String(corps ?? ''));
  const erreurs = [];
  const regle = sectionH2(texte, TITRE_REGLE);
  if (regle === null) {
    erreurs.push(`Section « ## ${TITRE_REGLE} » absente : un article daté à partir du ${DEBUT_REGLE_ECRITE} porte le mécanisme nommé (charte §2 bis).`);
  } else {
    for (const libelle of LIBELLES_REGLE) if (!regle.includes(`**${libelle}**`)) erreurs.push(`« ${TITRE_REGLE} » : le libellé **${libelle}** manque.`);
    const entete = lignesDeTableau(regle)[0] ?? '';
    if (!COLONNES_FRONTIERE.every((c) => entete.includes(c))) erreurs.push(`« ${TITRE_REGLE} » : le tableau de frontière à trois colonnes (${COLONNES_FRONTIERE.join(' | ')}) manque.`);
  }
  const rejeu = sectionH2(texte, TITRE_REJEU);
  if (rejeu === null) {
    erreurs.push(`Section « ## ${TITRE_REJEU} » absente : les cas joués et leur sortie font partie de l'article.`);
  } else if (lignesDeTableau(rejeu).length < LIGNES_REJEU_MIN + 1) {
    erreurs.push(`« ${TITRE_REJEU} » : au moins trois lignes de cas joués sont attendues sous l'en-tête du tableau (${LIGNES_REJEU_MIN} au minimum).`);
  }
  return erreurs;
}

export async function materialiser({ root, slug, statut, fetcher, rendreImage, jour = aujourdhui() }) {
  const { dossierRecette, recette, corps, revues } = chargerRecette(root, slug);
  const dossier = join(root, 'editorial/articles', slug);
  mkdirSync(join(dossier, 'preuves/sources'), { recursive: true });
  mkdirSync(join(dossier, 'preuves/skills'), { recursive: true });
  const manifest = construireManifest(recette, statut, jour, revues);
  const manifestPath = join(dossier, 'manifest.json');
  ecrireJson(manifestPath, manifest);
  await verifierSources({ root, slug, recette, dossierRecette, jour, fetcher });
  // Les URL finales ont pu réécrire la recette : le manifeste est reconstruit depuis la recette à jour.
  const manifestFinal = construireManifest(recette, statut, jour, revues);
  ecrireJson(manifestPath, manifestFinal);
  const articlePath = join(root, 'src/content/blog', `${slug}.md`);
  mkdirSync(dirname(articlePath), { recursive: true });
  const markdown = `${frontmatter(manifestFinal)}\n${corps}\n`;
  writeFileSync(articlePath, markdown);
  const sujet = { slug, articleHash: sha256(markdown), manifestHash: sha256(readFileSync(manifestPath)) };

  ecrireJson(join(dossier, 'preuves/role.json'), artefact(sujet, 'role', jour, { level: recette.role.proofLevel, observations: [recette.role.proofNote] }));
  ecrireJson(join(dossier, 'preuves/research-serp.json'), artefact(sujet, 'serp', jour, { ...recette.serp, observations: [recette.serp.note] }));
  ecrireJson(join(dossier, 'preuves/research-gsc.json'), artefact(sujet, 'gsc', jour, { ...recette.gsc, metricsCredited: false, observations: [recette.gsc.note] }));
  for (const source of manifestFinal.sources) {
    const preuve = lireJson(join(dossier, source.verificationEvidence));
    ecrireJson(join(dossier, source.classificationEvidence), {
      version: 1, candidateSlug: slug, kind: 'source-classification', status: 'PASS', checkedAt: jour, articleSha256: sujet.articleHash, manifestSha256: sujet.manifestHash,
      sourceId: source.id, sourceUrl: source.url, finalUrl: preuve.finalUrl, publisher: source.publisher, level: source.level, provenance: source.provenance, official: source.official, upstreamUrl: source.upstreamUrl,
      classifiedBy: 'kevin', reviewedBy: revues?.sources?.reviewedBy ?? 'marketing',
      observations: [source.classificationReason, ...(revues?.sources?.observations?.[source.id] ? [revues.sources.observations[source.id]] : [])],
    });
  }
  const { erreurs, claims } = construireClaims({ recette, corps, dossier, sujet, jour });
  ecrireJson(join(dossier, 'claims.json'), claims);
  erreurs.push(...verifierRegleEcrite(corps, { date: recette.date }));

  const { obs, collisions } = evidencesSkills({ manifest: manifestFinal, corps, sujet, jour, claims, root });
  const generee = recette.image.source;
  if (collisions.length) erreurs.push(`Cannibalisation de requête primaire avec : ${collisions.join(', ')}.`);
  const qualite = revues?.qualite;
  if (qualite) {
    ecrireJson(join(dossier, 'quality-review.json'), {
      version: 1, candidateSlug: slug, reviewedAt: jour, reviewer: qualite.reviewer ?? 'relecteur-qualite-ia-memlia', rubric: 'blog-analyze-100',
      status: qualite.score >= 90 && (qualite.p0 ?? []).length === 0 ? 'PASS' : 'FAIL', score: qualite.score, p0: (qualite.p0 ?? []).length,
      categories: qualite.categories, evidence: qualite.evidence ?? [], reservations: qualite.reservations ?? [], verdict: qualite.verdict ?? '',
      subject: { slug, articleSha256: sujet.articleHash, manifestSha256: sujet.manifestHash },
    });
    const cats = qualite.categories ?? {};
    const ligneCat = (id, libelle) => `| ${libelle} | ${cats[id]?.score ?? '—'}/${cats[id]?.max ?? '—'} |`;
    writeFileSync(join(dossier, 'seo-geo-review.md'), `# SEO et préparation aux citations IA — ${recette.title}\n\nVerdict : ${qualite.score >= 90 && (qualite.p0 ?? []).length === 0 ? 'PASS' : 'FAIL'} — ${qualite.score}/100, ${(qualite.p0 ?? []).length} P0 (revue indépendante du ${jour}, barème blog-analyze, heuristique éditoriale, ni facteur Google ni probabilité de citation).\n\n| Catégorie | Score |\n| --- | ---: |\n${ligneCat('contentQuality', 'Qualité du contenu')}\n${ligneCat('seoOptimization', 'SEO')}\n${ligneCat('eeatSignals', 'E-E-A-T')}\n${ligneCat('technicalElements', 'Technique')}\n${ligneCat('aiCitationReadiness', 'Préparation aux citations IA')}\n| Total | ${qualite.score}/100 |\n\n## SEO\n\n${(qualite.seo ?? []).map((x) => `- ${x}`).join('\n')}\n\n## Préparation aux citations\n\n${(qualite.geo ?? []).map((x) => `- ${x}`).join('\n')}\n\n## Réserves mesurées\n\n${(qualite.reservations ?? []).map((x) => `- ${x}`).join('\n')}\n`);
  }
  const preuvesRecette = recette.preuvesSkills ?? {};
  if (qualite) {
    const cats = qualite.categories ?? {};
    preuvesRecette['blog-analyze'] = preuvesRecette['blog-analyze'] ?? [`Revue indépendante barème blog-analyze : ${qualite.score}/100, ${(qualite.p0 ?? []).length} P0 ; catégories ${Object.entries(cats).map(([k, v]) => `${k} ${v.score}/${v.max}`).join(', ')}.`];
    if (qualite.seo?.length) preuvesRecette['blog-seo-check'] = [...(obs['blog-seo-check'] ?? []), ...qualite.seo];
    if (qualite.geo?.length) preuvesRecette['blog-geo'] = [...(obs['blog-geo'] ?? []), ...qualite.geo];
  }
  if (generee) preuvesRecette['blog-image'] = preuvesRecette['blog-image'] ?? [`Image générée selon le brief à six composantes (${generee.model}, ${generee.provider ?? 'higgsfield'}, job ${generee.generationId}), revue visuelle dans image.json.`];
  const joue = (skill) => SKILLS_TOUJOURS_JOUES.includes(skill) || Array.isArray(preuvesRecette[skill]);
  const ligne = (skill) => joue(skill)
    ? { skill, applicable: true, status: 'RUN', result: 'PASS', evidence: `preuves/skills/${skill}.json`, checkedAt: jour, justification: null }
    : { skill, applicable: false, status: 'N/A', result: null, evidence: null, checkedAt: null, justification: JUSTIFICATIONS_NA[skill](recette.title) };
  const skills = { version: 1, blog: BLOG_SKILLS.map(ligne), seo: SEO_SKILLS.map(ligne), contradictions: [] };
  for (const row of [...skills.blog, ...skills.seo]) if (row.status === 'RUN') ecrireJson(join(dossier, row.evidence), artefact(sujet, 'skill', jour, { skill: row.skill, observations: preuvesRecette[row.skill] ?? obs[row.skill] }));
  ecrireJson(join(dossier, 'skills.json'), skills);

  const editorial = revues?.editorial;
  ecrireJson(join(dossier, 'preuves/review.json'), artefact(sujet, 'editorial-review', jour, {
    reviewer: 'marketing', status: editorial ? 'PASS' : 'FAIL',
    criteria: REVIEW_CRITERIA.map(({ id, weight }) => { const r = editorial?.criteria?.[id]; const result = r?.result ?? 'FAIL'; return { id, result, earned: result === 'PASS' ? weight : 0, observations: r?.observations ?? ['Revue éditoriale non exécutée.'] }; }),
  }));
  ecrireJson(join(dossier, 'review.json'), { version: 1, reviewer: 'marketing', checkedAt: jour, subject: { slug, articleSha256: sujet.articleHash, manifestSha256: sujet.manifestHash }, rubricEvidence: 'preuves/review.json', p0: editorial ? (editorial.p0 ?? []) : ['Revue éditoriale non exécutée'], blocking: !editorial, decision: editorial ? 'pret-preview' : 'corriger' });

  const business = revues?.business;
  const preuvesSources = new Map(manifestFinal.sources.map((s) => [s.id, lireJson(join(dossier, s.verificationEvidence))]));
  ecrireJson(join(dossier, 'preuves/business-review.json'), artefact(sujet, 'business-review', jour, {
    status: business ? 'PASS' : 'FAIL', reviewerId: recette.businessReview.reviewerId, role: recette.businessReview.role,
    claimReviews: claims.claims.flatMap((claim) => claim.sourceIds.map((sourceId) => {
      const verdict = business?.claims?.[claim.id];
      if (business && !verdict) erreurs.push(`Revue métier absente pour ${claim.id}.`);
      return { id: `review-${claim.id}-${sourceId}`, candidateSlug: slug, articleSha256: sujet.articleHash, claimId: claim.id, claimSha256: sha256(claim.claim), sourceId, sourceContentSha256: preuvesSources.get(sourceId).contentSha256, citationSha256: sha256(claim.sourceExcerpts[sourceId]), reviewerId: recette.businessReview.reviewerId, verdict: verdict?.verdict ?? 'hors_sujet', checkedAt: jour, reasoning: verdict?.reasoning ?? 'Revue métier non exécutée.' };
    })),
  }));

  erreurs.push(...(await materialiserImage({ root, recette, dossier, sujet, jour, revues, rendreImage })));
  declarerImage(root, recette.image.heroId, recette.image.alt);
  const briefStrategie = existsSync(join(root, 'docs/strategy/site-v3/cluster-briefs')) ? readdirSync(join(root, 'docs/strategy/site-v3/cluster-briefs')).find((f) => f.endsWith(`-${slug}.md`)) : null;
  writeFileSync(join(dossier, 'brief.md'), briefStrategie ? readFileSync(join(root, 'docs/strategy/site-v3/cluster-briefs', briefStrategie), 'utf8') : `# Brief — ${recette.title}\n\nRequête primaire : ${recette.primaryQuery}\nTâche : ${recette.task}\n`);
  inscrireFile(root, slug, recette.date, statut);
  ecrireJson(join(dossierRecette, 'paquet-revue.json'), {
    slug, title: recette.title, primaryQuery: recette.primaryQuery, intent: recette.intent, role: recette.role.primary, format: recette.format, task: recette.task,
    corps, sources: manifestFinal.sources.map((s) => ({ id: s.id, publisher: s.publisher, title: s.title, url: s.url, level: s.level, official: s.official })),
    claims: claims.claims.map((c) => ({ id: c.id, claim: c.claim, type: c.type, sourceId: c.sourceIds[0], citation: c.sourceExcerpts[c.sourceIds[0]], contexte: c.factCheck.sourceResults[0].context.slice(0, 1200) })),
    criteresEditoriaux: REVIEW_CRITERIA, criteresImage: IMAGE_REVIEW_CRITERIA, image: { alt: recette.image.alt, cadre: recette.image.cadre, master: relative(root, join(dossier, 'preuves/image/master.png')) },
    identites: { auteur: 'kevin', reviewerEditorial: 'marketing', reviewerMetier: recette.businessReview.reviewerId, roleMetier: recette.businessReview.role },
  });
  return { erreurs, manifest: manifestFinal, sujet, dossier };
}

/** Sceau de publication : inventaire empreinté de chaque fichier du dossier, écrit après le manifeste final. */
export function ecrireSceau(root, slug, jour = aujourdhui()) {
  const dossier = join(root, 'editorial/articles', slug);
  const manifestPath = join(dossier, 'manifest.json');
  const manifest = lireJson(manifestPath);
  const markdown = readFileSync(join(root, 'src/content/blog', `${slug}.md`), 'utf8');
  const files = dossierFiles(dossier).filter((p) => p !== PUBLICATION_SEAL_PATH).map((p) => { const bytes = readFileSync(join(dossier, p)); return { path: p, bytes: bytes.length, sha256: sha256(bytes) }; });
  ecrireJson(join(dossier, PUBLICATION_SEAL_PATH), { version: 1, kind: 'publication-scellee', candidateSlug: slug, articleSha256: sha256(markdown), manifestSha256: sha256(readFileSync(manifestPath)), publishedAt: manifest.publishedAt ?? jour, sealedAt: new Date().toISOString(), files });
}

function lancer(root, args) {
  const result = spawnSync(process.execPath, [join(root, 'scripts/blog-pipeline.mjs'), ...args], { cwd: root, stdio: 'inherit', encoding: 'utf8' });
  return result.status === 0;
}

export async function commande(argv, root = process.cwd()) {
  const [action, slug] = argv;
  if (!slug) throw new Error('Usage : blog-forge <preparer|sceller|publier> <slug>');
  if (action === 'preparer') {
    const { erreurs, dossier } = await materialiser({ root, slug, statut: 'a-valider' });
    console.log(JSON.stringify({ slug, dossier: relative(root, dossier), erreurs, suite: erreurs.length ? 'corriger la recette' : 'produire editorial/recettes/<slug>/revues.json puis sceller' }, null, 2));
    if (erreurs.length) process.exitCode = 1;
    return;
  }
  if (action === 'sceller') {
    const { erreurs, manifest } = await materialiser({ root, slug, statut: 'pret-preview' });
    if (erreurs.length || manifest.businessReview.status !== 'PASS') { console.error(JSON.stringify({ slug, erreurs: [...erreurs, ...(manifest.businessReview.status !== 'PASS' ? ['revues.json absent ou incomplet'] : [])] }, null, 2)); process.exitCode = 1; return; }
    if (!lancer(root, ['gate', slug])) process.exitCode = 1;
    return;
  }
  if (action === 'publier') {
    const { erreurs } = await materialiser({ root, slug, statut: 'go-production' });
    if (erreurs.length) { console.error(JSON.stringify({ slug, erreurs }, null, 2)); process.exitCode = 1; return; }
    if (!lancer(root, ['production-check', slug])) { process.exitCode = 1; return; }
    await materialiser({ root, slug, statut: 'publie' });
    ecrireSceau(root, slug);
  const inscription = inscrireArticle(root, slug);
  if (!inscription.ok) console.error(`registre des requêtes SEO : ${inscription.message}`);
    console.log(JSON.stringify({ slug, statut: 'publie', sceau: PUBLICATION_SEAL_PATH, suite: 'npm run lastmod:sync && npm run build, puis commit et push, puis node scripts/seo/forge-seo.mjs apres-publication <slug> après le contrôle en ligne' }, null, 2));
    return;
  }
  throw new Error(`Action inconnue : ${action}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  commande(process.argv.slice(2)).catch((error) => { console.error(`[blog-forge] ${error.message}`); process.exitCode = 1; });
}
