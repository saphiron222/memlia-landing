import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { BLOG_SKILLS, REVIEW_CRITERIA, SEO_SKILLS } from '../../scripts/lib/blog-pipeline.mjs';
import { retirerPreuvesInline } from '../../scripts/lib/blog-proof-figures.mjs';

// Le gate compare la fraîcheur au jour de Paris, y compris pendant le décalage UTC à minuit.
const utcToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const sha256 = (content) => createHash('sha256').update(content).digest('hex');
const writeJson = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
const FIXTURE_STOP_WORDS = new Set(['alors', 'avec', 'avoir', 'cette', 'comme', 'dans', 'depuis', 'elle', 'elles', 'entre', 'etre', 'faire', 'leurs', 'mais', 'meme', 'pour', 'sans', 'selon', 'sont', 'sous', 'toute', 'toutes', 'toujours', 'tout', 'tous', 'une', 'vers', 'votre']);
const keyTerms = (value) => [...new Set(value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(/\s+/).filter((token) => token.length >= 4 && !FIXTURE_STOP_WORDS.has(token)))];

export const DEFAULT_BODY = `## Réponse directe

Une revue utile relie chaque règle publiée à une source conservée et à un contrôle humain explicite. Cette phrase est une affirmation vérifiée du candidat.

Le dossier commence par nommer la tâche, le rôle concerné et la décision qui reste au cabinet. Il ne suffit pas d’annoncer qu’un contrôle a été joué : la preuve doit identifier le candidat exact, son contenu et la version du manifeste réellement relue. Cette discipline empêche une ancienne preuve verte d’ouvrir un nouveau brouillon.

## Construire la chaîne de contrôle

La première étape consiste à conserver le contenu vérifié de chaque source avec son adresse finale, sa date de consultation et son empreinte. Le registre des affirmations référence ensuite la source par identifiant et cite un passage réellement présent dans cette copie. Le texte de l’article porte lui-même l’affirmation contrôlée, sans paraphrase introuvable.

La deuxième étape sépare les contrôles déterministes de la revue éditoriale. Les liens, les images, les métadonnées et les champs du manifeste sont recalculés par le pipeline. La qualité éditoriale est relue dans une grille structurée, attachée aux empreintes du candidat. Un nombre saisi seul ne constitue jamais une preuve.

## Garder la décision humaine

Le module applique le motif « proposition vs saisie » : il prépare un résultat, mais la personne responsable conserve la validation. En cas de source absente, de contenu trop mince ou de divergence entre les artefacts, le gate refuse la prévisualisation. Cette fermeture évite qu’un brouillon incomplet devienne publiable par simple déclaration.

Voir [la méthode](/#methode) et [l’article frère](/blog/controler-les-bulletins-de-paie-avant-la-dsn).`;

function renderedContentUnits(body) {
  return body.replace(/<!--[\s\S]*?-->/g, '').split(/\r?\n\s*\r?\n/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part
      .replace(/^#{1,6}\s+/, '')
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[`*_~]/g, '')
      .replace(/\s+/g, ' ')
      .trim())
    .map((text) => ({ id: `unit-${sha256(text).slice(0, 12)}`, text }));
}

const informativeImage = (width, height) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#fffefb"/>
  <rect x="${width * 0.12}" y="${height * 0.18}" width="${width * 0.34}" height="${height * 0.64}" rx="32" fill="#dff5e6" stroke="#1c8a41" stroke-width="12"/>
  <rect x="${width * 0.54}" y="${height * 0.18}" width="${width * 0.34}" height="${height * 0.64}" rx="32" fill="#f3efe3" stroke="#231f20" stroke-width="12"/>
  <circle cx="${width * 0.5}" cy="${height * 0.5}" r="${height * 0.12}" fill="#27b657"/>
  <path d="M ${width * 0.46} ${height * 0.5} l ${width * 0.025} ${height * 0.04} l ${width * 0.07} ${-height * 0.09}" fill="none" stroke="#fffefb" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);

export function candidateManifest(slug = 'article-de-test', heroId = `img-${slug}`, fixtureDate = utcToday()) {
  return {
    version: 1,
    slug,
    action: 'creation',
    editorialStatus: 'pret-preview',
    title: 'Comment contrôler un processus métier dans Excel ?',
    tabTitle: 'Contrôler un processus métier dans Excel | Memlia',
    summary: 'Une méthode bornée pour contrôler une tâche métier dans Excel sans automatiser la décision humaine.',
    description: 'Contrôle processus métier Excel : documenter les exceptions et laisser la décision finale au cabinet.',
    publicationDate: fixtureDate,
    updatedAt: null,
    topics: ['methode', 'excel'],
    keywords: ['contrôle métier', 'Excel cabinet'],
    primaryQuery: 'contrôle processus métier excel',
    secondaryQueries: ['contrôle excel cabinet'],
    intent: 'executer',
    fanOut: ['quels contrôles jouer'],
    role: {
      primary: 'paie-responsables-sociaux',
      secondary: ['direction-associes'],
      proof: { level: 'observe', source: 'preuves/role.json', verifiedAt: fixtureDate },
    },
    businessReview: {
      required: true,
      reviewerId: 'expert-paie-fictif',
      role: 'paie-responsables-sociaux',
      status: 'PASS',
      evidence: 'preuves/business-review.json',
    },
    funnel: 'MOFU',
    cluster: 'paie-social',
    contentType: 'searchable',
    format: 'how-to-guide',
    task: 'Décider quels contrôles rejouer avant validation.',
    rankability: 'plausible',
    businessRelevance: 'directe',
    proofStatus: 'verifiee',
    proofRequired: 'Cas fictif rejoué avec un cas courant, une limite et un refus.',
    sourcesVerifiedAt: fixtureDate,
    sources: [
      {
        id: 'source-urssaf', publisher: 'Urssaf', title: 'Sécuriser les déclarations sociales',
        url: 'https://www.urssaf.fr/accueil/employeur/declarer-et-payer.html', checkedAt: fixtureDate,
        level: 'tier-1', provenance: 'primary', official: true,
        upstreamUrl: 'https://www.urssaf.fr/accueil/employeur/declarer-et-payer.html',
        classificationReason: 'Source officielle primaire publiée directement par l’organisme compétent.',
        method: null,
        classificationEvidence: 'preuves/sources/source-urssaf.classification.json',
        verificationEvidence: 'preuves/sources/source-urssaf.json',
      },
      {
        id: 'source-net-entreprises', publisher: 'Net-entreprises', title: 'La déclaration sociale nominative',
        url: 'https://www.net-entreprises.fr/declaration/la-dsn/', checkedAt: fixtureDate,
        level: 'tier-2', provenance: 'primary', official: true,
        upstreamUrl: 'https://www.net-entreprises.fr/declaration/la-dsn/',
        classificationReason: 'Source officielle primaire du service déclaratif concerné par la règle contrôlée.',
        method: null,
        classificationEvidence: 'preuves/sources/source-net-entreprises.classification.json',
        verificationEvidence: 'preuves/sources/source-net-entreprises.json',
      },
      {
        id: 'source-service-public', publisher: 'Service Public', title: 'Déclaration sociale nominative',
        url: 'https://entreprendre.service-public.fr/vosdroits/F34059', checkedAt: fixtureDate,
        level: 'tier-3', provenance: 'primary', official: true,
        upstreamUrl: 'https://entreprendre.service-public.fr/vosdroits/F34059',
        classificationReason: 'Source officielle primaire de l’administration décrivant la démarche contrôlée.',
        method: null,
        classificationEvidence: 'preuves/sources/source-service-public.classification.json',
        verificationEvidence: 'preuves/sources/source-service-public.json',
      },
    ],
    author: 'kevin',
    reviewer: 'marketing',
    reviewRule: 'Réviser lors de tout changement de règle ou de source officielle.',
    cta: { label: 'Voir la méthode Memlia', destination: '/#methode', outcome: 'Comprendre comment cadrer une automatisation avec validation humaine.' },
    image: {
      heroId,
      alt: 'Des feuilles anonymes traversent deux contrôles avant une validation humaine',
      master: 'preuves/image/master.png',
      og: 'preuves/image/og.webp',
      engine: 'image_generate',
    },
    research: {
      serp: { status: 'PASS', evidence: 'preuves/research-serp.json', checkedAt: fixtureDate },
      gsc: { status: 'PASS', evidence: 'preuves/research-gsc.json', checkedAt: fixtureDate },
    },
    links: { outgoing: ['/#methode', '/blog/controler-les-bulletins-de-paie-avant-la-dsn'], incoming: ['/', '/blog'] },
    cannibalization: { risk: 'faible', comparedWith: ['/blog/controler-les-bulletins-de-paie-avant-la-dsn'], decision: 'Intentions distinctes après comparaison du corpus.' },
    contradictions: [],
    kevin: { briefApproved: true, previewApproved: false, productionApproved: false },
  };
}

export function articleMarkdown(manifest, body = DEFAULT_BODY) {
  return `---
titre: "${manifest.title}"
titreOnglet: "${manifest.tabTitle}"
resume: "${manifest.summary}"
description: "${manifest.description}"
datePublication: ${manifest.publicationDate}
auteur: ${manifest.author}
sujets: [${manifest.topics.join(', ')}]
motsCles: [${manifest.keywords.map((item) => `"${item}"`).join(', ')}]
brouillon: true
image: ${manifest.image.heroId}
pipelineVersion: 1
primaryQuery: "${manifest.primaryQuery}"
secondaryQueries: [${manifest.secondaryQueries.map((item) => `"${item}"`).join(', ')}]
intent: ${manifest.intent}
fanOut: [${manifest.fanOut.map((item) => `"${item}"`).join(', ')}]
cluster: ${manifest.cluster}
rolePrincipal: ${manifest.role.primary}
rolesSecondaires: [${manifest.role.secondary.join(', ')}]
tache: "${manifest.task}"
preuveRole:
  niveau: ${manifest.role.proof.level}
  source: "${manifest.role.proof.source}"
  date: ${manifest.role.proof.verifiedAt}
funnel: ${manifest.funnel}
contentType: ${manifest.contentType}
format: ${manifest.format}
rankability: ${manifest.rankability}
businessRelevance: ${manifest.businessRelevance}
proofStatus: ${manifest.proofStatus}
proofRequired: "${manifest.proofRequired}"
reviewRule: "${manifest.reviewRule}"
reviewer: ${manifest.reviewer}
sourcesVerifieesLe: ${manifest.sourcesVerifiedAt}
cta:
  label: "${manifest.cta.label}"
  destination: "${manifest.cta.destination}"
  outcome: "${manifest.cta.outcome}"
imageOg: "/images/${manifest.image.heroId}-og.webp"
imageAlt: "${manifest.image.alt}"
statutEditorial: ${manifest.editorialStatus}
sources:
${manifest.sources.map((source) => `  - editeur: "${source.publisher}"
    titre: "${source.title}"
    url: "${source.url}"
    consulte: ${source.checkedAt}`).join('\n')}
---

${body}
`;
}

export async function createCompleteDossier(root, { slug = 'article-de-test', heroId = `img-${slug}`, body = DEFAULT_BODY, claimsBody = body, manifestMutator = () => {}, claimSourceForUnit = (manifest) => manifest.sources[0], claimTypeForUnit = () => 'paie' } = {}) {
  // A single UTC day for every correlated fixture artifact, sampled at creation rather than import.
  const fixtureDate = utcToday();
  const subjectArtifact = ({ slug: candidateSlug, kind, articleHash, manifestHash, extra = {} }) => ({
    version: 1,
    candidateSlug,
    kind,
    status: 'PASS',
    checkedAt: fixtureDate,
    articleSha256: articleHash,
    manifestSha256: manifestHash,
    observations: [`Contrôle ${kind} relu sur le candidat exact.`],
    ...extra,
  });
  const manifest = candidateManifest(slug, heroId, fixtureDate);
  manifestMutator(manifest);
  const dossier = join(root, 'editorial/articles', slug);
  const preuves = join(dossier, 'preuves');
  mkdirSync(join(preuves, 'skills'), { recursive: true });
  mkdirSync(join(preuves, 'sources'), { recursive: true });
  mkdirSync(join(preuves, 'image'), { recursive: true });
  mkdirSync(join(root, 'src/content/blog'), { recursive: true });
  mkdirSync(join(root, 'src/pages'), { recursive: true });
  mkdirSync(join(root, 'src/data'), { recursive: true });
  mkdirSync(join(root, 'public/images'), { recursive: true });
  mkdirSync(join(root, 'editorial'), { recursive: true });
  const mesuresDir = join(root, 'docs/strategy/site-v3/mesures');
  const mesurePath = join(mesuresDir, `questions-${fixtureDate}.json`);
  mkdirSync(mesuresDir, { recursive: true });
  const mesure = existsSync(mesurePath)
    ? JSON.parse(readFileSync(mesurePath, 'utf8'))
    : { jour: fixtureDate, autocompletion: {} };
  for (const requete of [manifest.primaryQuery, ...(manifest.secondaryQueries ?? [])]) mesure.autocompletion[requete] = [];
  writeJson(mesurePath, mesure);

  const markdown = articleMarkdown(manifest, body);
  const articlePath = join(root, 'src/content/blog', `${slug}.md`);
  const manifestPath = join(dossier, 'manifest.json');
  writeFileSync(articlePath, markdown);
  writeJson(manifestPath, manifest);
  const recipeDir = join(root, 'editorial/recettes', slug);
  mkdirSync(recipeDir, { recursive: true });
  const recipeBody = retirerPreuvesInline(body.trim());
  writeFileSync(join(recipeDir, 'corps.md'), `${recipeBody}\n`);
  const recipeBytes = JSON.stringify({ slug, fixture: true });
  writeFileSync(join(recipeDir, 'recette.json'), recipeBytes);
  // Témoin synthétique lié au corps et à la recette de CE fixture, sans verdict publié.
  writeJson(join(recipeDir, 'revues.json'), {
    subject: { slug, bodySha256: sha256(recipeBody), recipeSha256: sha256(recipeBytes), renderedSha256: sha256('fixture-rendered-body') },
  });
  const articleHash = sha256(retirerPreuvesInline(markdown));
  const manifestHash = sha256(readFileSync(manifestPath));

  writeJson(join(preuves, 'role.json'), subjectArtifact({ slug, kind: 'role', articleHash, manifestHash, extra: { level: manifest.role.proof.level } }));
  writeJson(join(preuves, 'business-review.json'), subjectArtifact({
    slug,
    kind: 'business-review',
    articleHash,
    manifestHash,
    extra: { reviewerId: manifest.businessReview.reviewerId, role: manifest.businessReview.role },
  }));
  for (const [index, resolution] of (manifest.cannibalization.resolutions ?? []).entries()) {
    writeJson(join(dossier, resolution.evidence), subjectArtifact({
      slug,
      kind: 'cannibalization',
      articleHash,
      manifestHash,
      extra: { action: resolution.action, urls: resolution.urls, resolutionIndex: index },
    }));
  }
  writeJson(join(preuves, 'research-serp.json'), subjectArtifact({ slug, kind: 'serp', articleHash, manifestHash }));
  writeJson(join(preuves, 'research-gsc.json'), subjectArtifact({ slug, kind: 'gsc', articleHash, manifestHash }));

  const contentUnits = renderedContentUnits(claimsBody);
  const sourceSnapshots = new Map();
  for (const source of manifest.sources) {
    const snapshotPath = join(preuves, 'sources', `${source.id}.txt`);
    const excerpt = `Passage vérifié pour ${source.id} : les données sont contrôlées avant leur transmission.`;
    const citations = contentUnits.map((unit, index) => ({
      text: `La source confirme la règle suivante dans son contexte : « ${unit.text} » Cette citation circonscrit le point contrôlé sans en étendre la portée.`,
      line: index + 3,
    }));
    const snapshot = `${source.title}\n${excerpt}\n${citations.map((citation) => citation.text).join('\n')}\n`;
    writeFileSync(snapshotPath, snapshot);
    const contentSha256 = sha256(snapshot);
    sourceSnapshots.set(source.id, { contentSha256, citations });
    writeJson(join(dossier, source.classificationEvidence), {
      version: 1,
      candidateSlug: slug,
      kind: 'source-classification',
      articleSha256: articleHash,
      manifestSha256: manifestHash,
      sourceId: source.id,
      sourceUrl: source.url,
      finalUrl: source.url,
      publisher: source.publisher,
      level: source.level,
      provenance: source.provenance,
      official: source.official,
      upstreamUrl: source.upstreamUrl,
      classifiedBy: 'chercheur-sources-fictif',
      reviewedBy: 'relecteur-sources-fictif',
      status: 'PASS',
      checkedAt: source.checkedAt,
      observations: ['Le domaine, l’éditeur, la provenance et le niveau ont été relus séparément.'],
    });
    writeJson(join(dossier, source.verificationEvidence), {
      version: 1,
      candidateSlug: slug,
      sourceId: source.id,
      level: source.level,
      provenance: source.provenance,
      official: source.official,
      upstreamUrl: source.upstreamUrl,
      classificationReason: source.classificationReason,
      method: source.method,
      requestedUrl: source.url,
      finalUrl: source.url,
      httpStatus: 200,
      checkedAt: source.checkedAt,
      retrievedAt: new Date().toISOString(),
      contentPath: `preuves/sources/${source.id}.txt`,
      contentSha256,
      excerpt,
    });
  }

  const row = (skill) => ({
    skill, applicable: true, status: 'RUN', result: 'PASS',
    evidence: `preuves/skills/${skill}.json`, checkedAt: fixtureDate, justification: null,
  });
  const skills = { version: 1, blog: BLOG_SKILLS.map(row), seo: SEO_SKILLS.map(row), contradictions: [] };
  for (const skillRow of [...skills.blog, ...skills.seo]) {
    writeJson(join(dossier, skillRow.evidence), subjectArtifact({ slug, kind: 'skill', articleHash, manifestHash, extra: { skill: skillRow.skill } }));
  }
  writeJson(join(dossier, 'skills.json'), skills);

  const claimRows = contentUnits.map((unit, index) => {
    const source = claimSourceForUnit(manifest, unit, index);
    const snapshot = sourceSnapshots.get(source.id);
    const citation = snapshot.citations[index];
    return {
      id: `claim-${unit.id}`,
      unitId: unit.id,
      claim: unit.text,
      type: claimTypeForUnit(unit, index),
      sourceIds: [source.id],
      sourceExcerpts: { [source.id]: citation.text },
      checkedAt: fixtureDate,
      status: 'PASS',
      factCheck: {
        verdict: 'SUPPORTED',
        checkedAt: fixtureDate,
        sourceResults: [{
          sourceId: source.id,
          sourceUrl: source.url,
          verifiedUrl: source.url,
          excerpt: citation.text,
          context: citation.text,
          contextSha256: sha256(citation.text),
          citation: {
            text: citation.text,
            sha256: sha256(citation.text),
            sourceContentSha256: snapshot.contentSha256,
            coordinates: {
              finalUrl: source.url,
              checkedAt: source.checkedAt,
              title: source.title,
              locator: { kind: 'line-range', startLine: citation.line, endLine: citation.line },
            },
          },
          justification: {
            sharedTerms: keyTerms(unit.text).slice(0, 6),
            reasoning: 'La citation reprend les entités et les termes clés du claim sans modifier sa polarité.',
          },
          verdict: 'SUPPORTED',
          supportsClaim: true,
          contradictsClaim: false,
          explanation: 'Le contexte cité reprend directement l’affirmation contrôlée.',
          checkedAt: fixtureDate,
        }],
      },
    };
  });
  writeJson(join(dossier, 'claims.json'), {
    version: 1,
    candidateSlug: slug,
    articleSha256: articleHash,
    contentUnits: contentUnits.map((unit) => ({ ...unit, claimIds: [`claim-${unit.id}`] })),
    claims: claimRows,
  });
  const businessReviewPath = join(preuves, 'business-review.json');
  const businessReview = readFileSync(businessReviewPath, 'utf8');
  const businessReviewProof = JSON.parse(businessReview);
  businessReviewProof.claimReviews = claimRows.flatMap((claim) => claim.sourceIds.map((sourceId) => {
    const result = claim.factCheck.sourceResults.find((item) => item.sourceId === sourceId);
    return {
      id: `review-${claim.id}-${sourceId}`,
      candidateSlug: slug,
      articleSha256: articleHash,
      claimId: claim.id,
      claimSha256: sha256(claim.claim),
      sourceId,
      sourceContentSha256: result.citation.sourceContentSha256,
      citationSha256: result.citation.sha256,
      reviewerId: manifest.businessReview.reviewerId,
      verdict: 'soutient',
      checkedAt: fixtureDate,
      reasoning: 'Le reviewer métier a comparé le claim, la citation exacte et sa portée dans la copie locale.',
    };
  }));
  writeJson(businessReviewPath, businessReviewProof);

  const reviewEvidence = subjectArtifact({
    slug,
    kind: 'editorial-review',
    articleHash,
    manifestHash,
    extra: {
      reviewer: manifest.reviewer,
      criteria: REVIEW_CRITERIA.map(({ id, weight }) => ({ id, result: 'PASS', earned: weight, observations: [`${id} vérifié sur le contenu rendu.`] })),
    },
  });
  writeJson(join(preuves, 'review.json'), reviewEvidence);
  writeJson(join(dossier, 'review.json'), {
    version: 1,
    reviewer: manifest.reviewer,
    checkedAt: fixtureDate,
    subject: { slug, articleSha256: articleHash, manifestSha256: manifestHash },
    rubricEvidence: 'preuves/review.json',
    p0: [], blocking: false, decision: 'pret-preview',
  });

  await sharp(informativeImage(1920, 1080)).png().toFile(join(preuves, 'image/master.png'));
  await sharp(informativeImage(1200, 630)).webp().toFile(join(preuves, 'image/og.webp'));
  for (const format of ['avif', 'webp']) {
    await sharp(informativeImage(768, 432))[format]().toFile(join(preuves, `image/hero-768.${format}`));
    await sharp(informativeImage(768, 432))[format]().toFile(join(root, `public/images/${heroId}-768.${format}`));
  }
  await sharp(join(preuves, 'image/og.webp')).toFile(join(root, `public/images/${heroId}-og.webp`));
  writeJson(join(dossier, 'image.json'), {
    version: 1, candidateSlug: slug, articleSha256: articleHash, manifestSha256: manifestHash,
    engine: 'image_generate', promptEvidence: 'preuves/image/prompt.json', generationEvidence: 'preuves/image/generation.json', visualReviewEvidence: 'preuves/image/visual-review.json',
    master: { path: 'preuves/image/master.png', width: 1920, height: 1080, format: 'png' },
    og: { path: 'preuves/image/og.webp', width: 1200, height: 630, format: 'webp', crop: '1200x630+0+22' },
    variants: [
      { path: 'preuves/image/hero-768.avif', width: 768, height: 432, format: 'avif' },
      { path: 'preuves/image/hero-768.webp', width: 768, height: 432, format: 'webp' },
    ],
    alt: manifest.image.alt, score: 100, directionArt: 20, semanticRelevance: 25, p0: [], kevinApproved: true,
  });
  writeJson(join(preuves, 'image/prompt.json'), subjectArtifact({ slug, kind: 'image-prompt', articleHash, manifestHash, extra: { engine: 'image_generate', prompt: 'Illustration fictive sans donnée client ni texte incrusté.' } }));
  writeJson(join(preuves, 'image/generation.json'), subjectArtifact({
    slug,
    kind: 'image-generation',
    articleHash,
    manifestHash,
    extra: { engine: 'image_generate', generationId: `fixture-${slug}`, outputSha256: sha256(readFileSync(join(preuves, 'image/master.png'))) },
  }));
  writeJson(join(preuves, 'image/visual-review.json'), subjectArtifact({
    slug,
    kind: 'image-visual-review',
    articleHash,
    manifestHash,
    extra: {
      criteria: ['brief-six-components', 'generation-constraints', 'fictive-provenance', 'recognizable-subject', 'technical-derivatives', 'alt-information']
        .map((id) => ({ id, result: 'PASS', observations: [`${id} observé dans le rendu candidat final.`] })),
    },
  }));

  writeFileSync(join(root, 'src/data/images.mjs'), `export const IMAGES = { '${heroId}': { largeurs: [768], ratio: [16, 9], alt: '${manifest.image.alt}' } };\n`);
  writeFileSync(join(root, 'src/data/blog-visibility.mjs'), `export const isBlogEntryVisibleForSlug = (entry, previewSlug) =>
  entry.data.brouillon === false || (previewSlug.length > 0 && entry.id === previewSlug);
export const isBlogEntryVisible = (entry) => isBlogEntryVisibleForSlug(entry, '');\n`);
  writeFileSync(join(root, 'src/pages/index.astro'), `<a href="/blog/${slug}">Article</a>`);
  writeFileSync(join(root, 'src/pages/blog.astro'), `---
import { getCollection } from 'astro:content';
import { BLOG } from '../data/blog.mjs';
import { isBlogEntryVisible } from '../data/blog-visibility.mjs';
const articles = await getCollection('blog', isBlogEntryVisible);
---
<ul>{articles.map((article) => <li><a href={\`\${BLOG.chemin}/\${article.id}\`}>{article.data.titre}</a></li>)}</ul>\n`);
  const siblingSlug = 'controler-les-bulletins-de-paie-avant-la-dsn';
  const sibling = '---\ntitre: "Article historique de test"\nbrouillon: false\n---\n\n## Contrôle historique\n\nContenu distinct conservé par son empreinte.\n';
  writeFileSync(join(root, 'src/content/blog', `${siblingSlug}.md`), sibling);
  writeJson(join(root, 'editorial/legacy-baseline.json'), { version: 1, articles: { [siblingSlug]: sha256(sibling) } });

  return { root, slug, dossier, articlePath, manifestPath, manifest, markdown, body, articleHash, manifestHash };
}
