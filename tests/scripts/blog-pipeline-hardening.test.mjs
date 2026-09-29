import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test as nodeTest } from 'node:test';
import sharp from 'sharp';
import {
  BLOG_SKILLS,
  CLAIM_TYPES,
  REVIEW_CRITERIA,
  SEO_SKILLS,
  auditArticleInventory,
  validateDossier as validateDossierRaw,
  verifySource,
} from '../../scripts/lib/blog-pipeline.mjs';
import { DEFAULT_BODY, articleMarkdown, createCompleteDossier } from './blog-fixture.mjs';

// 120 s : l'image de construction de Cloudflare Pages est plusieurs fois plus lente que la machine
// de développement ; à 20 s, « chaque famille sensible visible… » y expirait (déploiement 8e89cc5e, 16/09/2026).
const TEST_TIMEOUT_MS = 120_000;
const test = Object.assign((name, run) => nodeTest(name, { timeout: TEST_TIMEOUT_MS }, run), { afterEach: nodeTest.afterEach });
const roots = [];
const root = (label) => {
  const value = mkdtempSync(join(tmpdir(), `memlia-blog-${label}-`));
  roots.push(value);
  return value;
};
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const writeJson = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
const sha256 = (content) => createHash('sha256').update(content).digest('hex');
const renderedBlogHtml = (slug) => `<li data-article="${slug}"><a href="/blog/${slug}">Article rendu</a></li>`;
const validateDossier = (options) => validateDossierRaw({
  ...options,
  renderedBlogHtml: options.renderedBlogHtml ?? renderedBlogHtml(options.slug),
});
const keyTermsForTest = (value) => [...new Set(value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(/\s+/).filter((token) => token.length >= 4))];
const sourceState = (fixture, sourceId = 'source-urssaf') => {
  const manifest = readJson(fixture.manifestPath);
  const source = manifest.sources.find((item) => item.id === sourceId);
  const proofPath = join(fixture.dossier, source.verificationEvidence);
  const proof = readJson(proofPath);
  return { manifest, source, proof, proofPath, snapshotPath: join(fixture.dossier, proof.contentPath) };
};
const replaceSourceSnapshot = (fixture, content, sourceId = 'source-urssaf') => {
  const state = sourceState(fixture, sourceId);
  writeFileSync(state.snapshotPath, content);
  state.proof.contentSha256 = sha256(content);
  writeJson(state.proofPath, state.proof);
  return { ...state, contentSha256: state.proof.contentSha256 };
};
const claimReview = (fixture, claim, sourceId, citation, sourceContentSha256, verdict = 'soutient') => ({
  id: `review-${claim.id}-${sourceId}`,
  candidateSlug: fixture.slug,
  articleSha256: fixture.articleHash,
  claimId: claim.id,
  claimSha256: sha256(claim.claim),
  sourceId,
  sourceContentSha256,
  citationSha256: sha256(citation),
  reviewerId: fixture.manifest.businessReview.reviewerId,
  verdict,
  checkedAt: fixture.manifest.sourcesVerifiedAt,
  reasoning: 'Le reviewer métier a comparé le sens exact du claim à la citation et à sa portée.',
});
const writeClaimReviews = (fixture, reviews) => {
  const path = join(fixture.dossier, fixture.manifest.businessReview.evidence);
  const proof = readJson(path);
  const replacements = new Map(reviews.map((item) => [`${item.claimId}\u0000${item.sourceId}`, item]));
  proof.claimReviews = (proof.claimReviews ?? []).map((item) => replacements.get(`${item.claimId}\u0000${item.sourceId}`) ?? item);
  writeJson(path, proof);
};
const maskDeclaredSensitivity = (fixture) => {
  const claimsPath = join(fixture.dossier, 'claims.json');
  const claims = readJson(claimsPath);
  claims.claims.forEach((claim) => { claim.type = 'information'; });
  writeJson(claimsPath, claims);

  const skillsPath = join(fixture.dossier, 'skills.json');
  const skills = readJson(skillsPath);
  const factcheck = skills.blog.find((row) => row.skill === 'blog-factcheck');
  Object.assign(factcheck, {
    applicable: false,
    status: 'N/A',
    result: null,
    evidence: null,
    checkedAt: null,
    justification: 'Le candidat est déclaré hors matière sensible par ses métadonnées.',
  });
  writeJson(skillsPath, skills);
};
const DISTINCT_BODY = `## Une autre réponse

Le second dossier décrit un diagnostic commercial sans reprendre la méthode de contrôle du premier. Il commence par qualifier la demande, la décision attendue et la personne qui devra accepter le résultat proposé.

## Préparer la comparaison

Une équipe peut inventorier ses options, noter les dépendances puis conserver une trace lisible de chaque arbitrage. Les exemples restent fictifs, les éléments saisis par le cabinet ne sont jamais remplacés et chaque résultat généré peut être reconstruit.

## Décider sans automatiser

La conclusion rapproche les limites, les coûts de maintenance et les sorties attendues. Elle ne promet aucun classement ni traitement autonome : le module propose, puis une personne choisit, valide ou refuse selon la règle du cabinet.

Voir [la méthode](/#methode) et [l’article frère](/blog/controler-les-bulletins-de-paie-avant-la-dsn).`;

test.afterEach(() => {
  while (roots.length) rmSync(roots.pop(), { recursive: true, force: true });
});

test('un dossier structuré, relié au candidat exact et machine-relisible passe', async () => {
  const fixture = await createCompleteDossier(root('complete'));
  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.deepEqual(result.errors, []);
  assert.equal(result.pass, true);
  const claims = readJson(join(fixture.dossier, 'claims.json'));
  const businessProof = readJson(join(fixture.dossier, fixture.manifest.businessReview.evidence));
  assert.notEqual(fixture.manifest.author, fixture.manifest.businessReview.reviewerId);
  assert.equal(businessProof.claimReviews.length, claims.claims.length);
  assert.ok(businessProof.claimReviews.every((review) => review.verdict === 'soutient'));
  assert.ok(claims.claims.every((claim) => claim.factCheck.sourceResults.every((sourceResult) => sourceResult.citation.coordinates.finalUrl.startsWith('https://www.urssaf.fr/'))));
});

test('les sources T1, T2 et T3 correctement tracées ouvrent le gate', async () => {
  const fixture = await createCompleteDossier(root('source-tiers'), {
    manifestMutator: (manifest) => {
      manifest.sources.forEach((source, index) => Object.assign(source, {
        level: `tier-${index + 1}`,
        provenance: 'primary',
        official: true,
        upstreamUrl: source.url,
        method: null,
      }));
    },
  });

  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.deepEqual(result.errors, []);
  assert.equal(result.pass, true);
});

test('Medium anonyme, Reddit et Substack personnel restent refusés même avec des preuves locales cohérentes', async () => {
  const replacements = [
    { publisher: 'Medium anonyme', url: 'https://medium.com/@anonyme/article', level: 'tier-4' },
    { publisher: 'Reddit', url: 'https://www.reddit.com/r/compta/comments/temoin', level: 'tier-5' },
    { publisher: 'Substack personnel', url: 'https://auteur-personnel.substack.com/p/article', level: 'tier-4' },
  ];
  const fixture = await createCompleteDossier(root('source-echoes'), {
    manifestMutator: (manifest) => {
      manifest.sources.forEach((source, index) => Object.assign(source, {
        ...replacements[index],
        provenance: 'echo',
        official: false,
        upstreamUrl: 'https://www.insee.fr/fr/statistiques/',
        method: null,
      }));
    },
  });

  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.equal(result.pass, false);
  for (const label of ['tier-4', 'tier-5', 'écho']) {
    assert.ok(result.errors.some((error) => error.toLocaleLowerCase('fr').includes(label)), `${label} non refusé :\n${result.errors.join('\n')}`);
  }
});

test('WordPress, Quora et Hacker News auto-déclarés officiels tier-1 restent refusés', async () => {
  const replacements = [
    { publisher: 'WordPress', url: 'https://cabinet-fictif.wordpress.com/article' },
    { publisher: 'Quora', url: 'https://fr.quora.com/Comment-controler-la-paie' },
    { publisher: 'Hacker News', url: 'https://news.ycombinator.com/item?id=12345' },
  ];
  const fixture = await createCompleteDossier(root('source-auto-declared-official'), {
    manifestMutator: (manifest) => {
      manifest.sources.forEach((source, index) => Object.assign(source, {
        ...replacements[index],
        level: 'tier-1',
        provenance: 'primary',
        official: true,
        upstreamUrl: replacements[index].url,
        classificationReason: 'Source déclarée officielle et primaire dans le même manifeste.',
        method: null,
      }));
    },
  });

  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.equal(result.pass, false, 'pass=true, errorCount=0, errors=[]');
  for (const platform of ['WordPress', 'Quora', 'Hacker News']) {
    assert.ok(result.errors.some((error) => error.toLocaleLowerCase('fr').includes(platform.toLocaleLowerCase('fr'))), `${platform} non refusé :\n${result.errors.join('\n')}`);
  }
});

test('une plateforme UGC demandée reste refusée même si elle redirige vers une autorité officielle', async () => {
  const finalUrl = 'https://www.urssaf.fr/accueil/employeur/declarer-et-payer.html';
  const fixture = await createCompleteDossier(root('source-ugc-redirect'), {
    manifestMutator: (manifest) => {
      Object.assign(manifest.sources[0], {
        publisher: 'Urssaf',
        url: 'https://cabinet-fictif.wordpress.com/article',
        upstreamUrl: finalUrl,
      });
    },
  });
  const source = fixture.manifest.sources[0];
  const verificationPath = join(fixture.dossier, source.verificationEvidence);
  const verification = readJson(verificationPath);
  verification.finalUrl = finalUrl;
  writeJson(verificationPath, verification);
  const classificationPath = join(fixture.dossier, source.classificationEvidence);
  const classification = readJson(classificationPath);
  classification.finalUrl = finalUrl;
  writeJson(classificationPath, classification);
  const claimsPath = join(fixture.dossier, 'claims.json');
  const claims = readJson(claimsPath);
  for (const claim of claims.claims) for (const sourceResult of claim.factCheck.sourceResults) {
    sourceResult.verifiedUrl = finalUrl;
    sourceResult.citation.coordinates.finalUrl = finalUrl;
  }
  writeJson(claimsPath, claims);

  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.equal(result.pass, false);
  assert.ok(result.errors.some((error) => /WordPress.*UGC|plateforme.*WordPress/i.test(error)), result.errors.join('\n'));
});

test('la classification de chaque source est reliée au candidat et relue par une identité distincte', async () => {
  const fixture = await createCompleteDossier(root('source-classification-review'));
  const source = fixture.manifest.sources[0];
  const proofPath = join(fixture.dossier, source.classificationEvidence);
  const proof = readJson(proofPath);
  proof.reviewedBy = proof.classifiedBy;
  writeJson(proofPath, proof);

  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.equal(result.pass, false);
  assert.ok(result.errors.some((error) => /classification.*identité distincte|classifiedBy.*reviewedBy/i.test(error)), result.errors.join('\n'));
});

test('un éditeur officiel déclaré sur le domaine d’une autre autorité est refusé', async () => {
  const fixture = await createCompleteDossier(root('source-publisher-domain-mismatch'), {
    manifestMutator: (manifest) => {
      Object.assign(manifest.sources[0], {
        publisher: 'Urssaf',
        url: 'https://www.net-entreprises.fr/declaration/la-dsn/',
        upstreamUrl: 'https://www.net-entreprises.fr/declaration/la-dsn/',
      });
    },
  });

  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.equal(result.pass, false);
  assert.ok(result.errors.some((error) => /incohérence domaine↔éditeur/i.test(error)), result.errors.join('\n'));
});

const DOCTEST_URL = 'https://docs.python.org/fr/3/library/doctest.html';
const technicalDossier = (label, mutate = () => {}, claimType = 'methode') => createCompleteDossier(root(label), {
  manifestMutator: (manifest) => {
    Object.assign(manifest.sources[1], {
      publisher: 'Python Software Foundation', url: DOCTEST_URL, upstreamUrl: DOCTEST_URL,
      level: 'technical-primary', provenance: 'primary', official: false,
      classificationReason: 'Documentation du projet Python, publiée par la Python Software Foundation, sur la portée des tests doctest.',
      method: null,
    });
    mutate(manifest.sources[1]);
  },
  claimSourceForUnit: (manifest, _unit, index) => index === 1 ? manifest.sources[1] : manifest.sources[0],
  claimTypeForUnit: (_unit, index) => index === 1 ? claimType : 'paie',
});

test('la fixture de documentation primaire technique ouvre un claim methode sans officialité publique et ferme sur copie altérée', async () => {
  const fixture = await technicalDossier('primary-technical');
  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.deepEqual(result.errors, []);
  assert.equal(result.pass, true);

  const { proofPath, proof } = sourceState(fixture, 'source-net-entreprises');
  proof.contentSha256 = sha256('copie inventée');
  writeJson(proofPath, proof);
  const falsified = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.equal(falsified.pass, false);
  assert.ok(falsified.errors.some((error) => /contentSha256.*copie locale/.test(error)), falsified.errors.join('\n'));
});

test('la catégorie technique refuse éditeur et domaine incohérents, UGC, auto-officialité, provenance secondaire et claim sensible', async () => {
  for (const [label, mutate, type, expected] of [
    ['publisher', (source) => { source.publisher = 'Auteur personnel'; }, 'methode', /domaine↔éditeur/],
    ['domain', (source) => { source.url = 'https://example.org/fr/3/library/doctest.html'; source.upstreamUrl = source.url; }, 'methode', /documentation primaire technique/],
    ['path', (source) => { source.url = 'https://docs.python.org/fr/3/library/unittest.html'; source.upstreamUrl = source.url; }, 'methode', /documentation primaire technique/],
    ['ugc', (source) => { source.url = 'https://medium.com/@auteur/doctest'; source.upstreamUrl = source.url; }, 'methode', /Medium|documentation primaire technique/],
    ['official', (source) => { source.official = true; }, 'methode', /official=true|official=false/],
    ['secondary', (source) => { source.provenance = 'secondary'; source.upstreamUrl = 'https://www.python.org/'; }, 'methode', /provenance primary|source primaire technique/],
    ['legal', () => {}, 'juridique', /primaire officielle/],
    ['information', () => {}, 'information', /réservée aux claims methode/],
  ]) {
    const fixture = await technicalDossier(`technical-${label}`, mutate, type);
    const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
    assert.equal(result.pass, false, `${label} accepté`);
    assert.ok(result.errors.some((error) => expected.test(error)), `${label}: ${result.errors.join('\n')}`);
  }
});

test('une source non officielle ou secondaire ne soutient pas un claim paie sensible', async () => {
  const fixture = await createCompleteDossier(root('sensitive-source-quality'), {
    manifestMutator: (manifest) => {
      manifest.sources.forEach((source, index) => Object.assign(source, {
        level: `tier-${index + 1}`,
        provenance: 'primary',
        official: true,
        upstreamUrl: source.url,
        method: null,
      }));
      Object.assign(manifest.sources[0], {
        provenance: 'secondary',
        official: false,
        upstreamUrl: 'https://www.legifrance.gouv.fr/',
      });
    },
  });

  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.equal(result.pass, false);
  assert.ok(result.errors.some((error) => /claim.*paie.*primaire.*officielle/i.test(error)), result.errors.join('\n'));
});

test('une méthode originale transparente exige période, population, protocole et limites', async () => {
  const method = {
    period: 'Du 1er au 31 août 2026.',
    population: 'Douze dossiers entièrement fictifs couvrant trois cas limites.',
    protocol: 'Rejeu déterministe du même contrôle sur chaque dossier, puis rapprochement avec un oracle versionné.',
    limitations: 'Corpus fictif restreint ; aucun résultat n’est généralisé à tous les cabinets.',
  };
  const fixture = await createCompleteDossier(root('original-method'), {
    manifestMutator: (manifest) => {
      manifest.sources.forEach((source, index) => Object.assign(source, {
        level: `tier-${index + 1}`,
        provenance: 'primary',
        official: true,
        upstreamUrl: source.url,
        method: null,
      }));
      Object.assign(manifest.sources[1], {
        level: 'original-method',
        official: false,
        method,
      });
    },
  });

  const accepted = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.deepEqual(accepted.errors, []);

  const incomplete = await createCompleteDossier(root('original-method-incomplete'), {
    manifestMutator: (manifest) => {
      manifest.sources.forEach((source, index) => Object.assign(source, {
        level: `tier-${index + 1}`,
        provenance: 'primary',
        official: true,
        upstreamUrl: source.url,
        method: null,
      }));
      Object.assign(manifest.sources[1], {
        level: 'original-method',
        official: false,
        method: { ...method, population: '' },
      });
    },
  });
  const rejected = await validateDossier({ root: incomplete.root, slug: incomplete.slug });
  assert.equal(rejected.pass, false);
  assert.ok(rejected.errors.some((error) => /méthode originale.*population/i.test(error)), rejected.errors.join('\n'));
});

test('les alt manifestement non descriptifs sont refusés sans remplacer la revue humaine', async () => {
  for (const [label, alt] of [
    ['répétition', 'aaaaaaaaaa'],
    ['nom de fichier', 'image.jpg'],
    ['générique', 'Illustration générique'],
    ['placeholder', '__A_RENSEIGNER__'],
    ['suite alphabétique', 'abcdefghij'],
    ['suite clavier', 'qwertyuiop'],
  ]) {
    const fixture = await createCompleteDossier(root(`bad-alt-${label}`), {
      manifestMutator: (manifest) => { manifest.image.alt = alt; },
    });
    const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
    assert.equal(result.pass, false, `${label} accepté`);
    assert.ok(result.errors.some((error) => /alt.*manifestement non descriptif/i.test(error)), result.errors.join('\n'));
  }

  const descriptive = await createCompleteDossier(root('descriptive-alt'));
  const accepted = await validateDossier({ root: descriptive.root, slug: descriptive.slug });
  assert.deepEqual(accepted.errors, []);

  for (const [label, alt] of [
    ['nom descriptif', 'Organigramme'],
    ['description française', 'Un tableau Excel compare les écarts avant la validation humaine'],
  ]) {
    const fixture = await createCompleteDossier(root(`descriptive-alt-${label}`), {
      manifestMutator: (manifest) => { manifest.image.alt = alt; },
    });
    const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
    assert.deepEqual(result.errors, [], `${label} refusé :\n${result.errors.join('\n')}`);
  }
});

test('la grille canonique contient exactement les sept critères approuvés et totalise 100', () => {
  assert.deepEqual(REVIEW_CRITERIA, [
    { id: 'intent-satisfaction', weight: 20 },
    { id: 'serp-format-rankability', weight: 15 },
    { id: 'eeat-sources', weight: 20 },
    { id: 'information-gain-proof', weight: 20 },
    { id: 'technical-onpage-seo', weight: 10 },
    { id: 'ai-citability', weight: 10 },
    { id: 'contextual-conversion', weight: 5 },
  ]);
});

test('une affirmation juridique exacte ajoutée hors inventaire ferme le gate paie', async () => {
  const baseline = await createCompleteDossier(root('claim-baseline'));
  const witness = 'Le Code du travail autorise toujours ce traitement sans consultation du comité social et économique.';
  const fixture = await createCompleteDossier(root('claim-coverage'), {
    body: `${baseline.body}\n\n${witness}`,
    claimsBody: baseline.body,
  });
  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.equal(result.pass, false);
  assert.ok(result.errors.some((error) => /unité.*non enregistrée|inventaire.*exhaustif/i.test(error)), result.errors.join('\n'));
});

test('une assertion juridique fausse reliée à un extrait hors sujet ferme le gate sémantique', async () => {
  const witness = 'Le Code du travail autorise toujours ce traitement sans consultation du comité social et économique.';
  const fixture = await createCompleteDossier(root('semantic-support'), { body: `${DISTINCT_BODY}\n\n${witness}` });
  const claimsPath = join(fixture.dossier, 'claims.json');
  const claims = readJson(claimsPath);
  const claim = claims.claims.find((item) => item.claim === witness);
  const irrelevant = 'les données sont contrôlées avant leur transmission';
  claim.sourceExcerpts['source-urssaf'] = irrelevant;
  Object.assign(claim.factCheck.sourceResults[0], {
    excerpt: irrelevant,
    context: irrelevant,
    contextSha256: sha256(irrelevant),
    explanation: 'Cet extrait générique est déclaré comme soutien sans traiter la règle juridique.',
  });
  writeJson(claimsPath, claims);

  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.equal(result.pass, false);
  assert.ok(result.errors.some((error) => /hors contexte|ne soutient pas|support sémantique/i.test(error)), result.errors.join('\n'));
});

test('une contradiction à fort recouvrement lexical ferme le gate malgré des attestations de support forcées', async () => {
  const witness = 'Le Code du travail autorise toujours ce traitement sans consultation du comité social et économique.';
  const contradiction = 'Le Code du travail n’autorise jamais ce traitement sans consultation du comité social et économique.';
  const fixture = await createCompleteDossier(root('semantic-contradiction'), { body: `${DISTINCT_BODY}\n\n${witness}` });
  const claimsPath = join(fixture.dossier, 'claims.json');
  const claims = readJson(claimsPath);
  const claim = claims.claims.find((item) => item.claim === witness);
  const state = sourceState(fixture);
  const updated = replaceSourceSnapshot(fixture, `${readFileSync(state.snapshotPath, 'utf8')}${contradiction}\n`);
  const citationLine = readFileSync(updated.snapshotPath, 'utf8').split(/\r?\n/).findIndex((line) => line === contradiction) + 1;
  claim.sourceExcerpts['source-urssaf'] = contradiction;
  Object.assign(claim.factCheck.sourceResults[0], {
    excerpt: contradiction,
    context: contradiction,
    contextSha256: sha256(contradiction),
    verdict: 'SUPPORTED',
    supportsClaim: true,
    contradictsClaim: false,
    explanation: 'Cette attestation est volontairement mensongère malgré la négation explicite.',
    citation: {
      text: contradiction,
      sha256: sha256(contradiction),
      sourceContentSha256: updated.contentSha256,
      coordinates: {
        finalUrl: updated.proof.finalUrl,
        checkedAt: updated.proof.checkedAt,
        title: updated.source.title,
        locator: { kind: 'line-range', startLine: citationLine, endLine: citationLine },
      },
    },
    justification: {
      sharedTerms: ['code', 'travail', 'autorise', 'traitement', 'consultation'],
      reasoning: 'Le faux justificatif revendique le fort recouvrement lexical malgré une polarité opposée.',
    },
  });
  writeJson(claimsPath, claims);
  writeClaimReviews(fixture, [claimReview(fixture, claim, 'source-urssaf', contradiction, updated.contentSha256)]);

  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.equal(result.pass, false);
  assert.ok(result.errors.some((error) => /négation|contradictoire|polarité/i.test(error)), result.errors.join('\n'));
});

test('tout verdict unitaire autre que soutient du reviewer métier ferme le gate', async () => {
  for (const verdict of ['soutient_partiellement', 'hors_sujet', 'contredit']) {
    const fixture = await createCompleteDossier(root(`business-verdict-${verdict}`));
    const claims = readJson(join(fixture.dossier, 'claims.json'));
    const claim = claims.claims[0];
    const source = sourceState(fixture);
    writeClaimReviews(fixture, [claimReview(fixture, claim, 'source-urssaf', claim.sourceExcerpts['source-urssaf'], source.proof.contentSha256, verdict)]);

    const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
    assert.equal(result.pass, false, verdict);
    assert.ok(result.errors.some((error) => /reviewer métier|hors_sujet|contredit|soutient/i.test(error)), `${verdict}:\n${result.errors.join('\n')}`);
  }
});

test('une citation identique recyclée sur deux claims non équivalents ferme le gate', async () => {
  const fixture = await createCompleteDossier(root('recycled-citation'));
  const claimsPath = join(fixture.dossier, 'claims.json');
  const claims = readJson(claimsPath);
  const [first, second] = claims.claims;
  const citation = `${first.claim} ${second.claim}`;
  const state = sourceState(fixture);
  const updated = replaceSourceSnapshot(fixture, `${readFileSync(state.snapshotPath, 'utf8')}${citation}\n`);
  const citationLine = readFileSync(updated.snapshotPath, 'utf8').split(/\r?\n/).findIndex((line) => line === citation) + 1;
  for (const claim of [first, second]) {
    claim.sourceExcerpts['source-urssaf'] = citation;
    Object.assign(claim.factCheck.sourceResults[0], {
      excerpt: citation,
      context: citation,
      contextSha256: sha256(citation),
      citation: {
        text: citation,
        sha256: sha256(citation),
        sourceContentSha256: updated.contentSha256,
        coordinates: {
          finalUrl: updated.proof.finalUrl,
          checkedAt: updated.proof.checkedAt,
          title: updated.source.title,
          locator: { kind: 'line-range', startLine: citationLine, endLine: citationLine },
        },
      },
      justification: {
        sharedTerms: keyTermsForTest(claim.claim).filter((term) => keyTermsForTest(citation).includes(term)).slice(0, 6),
        reasoning: 'La citation contient bien les termes du claim mais elle est recyclée pour une autre affirmation.',
      },
    });
  }
  writeJson(claimsPath, claims);
  writeClaimReviews(fixture, [first, second].map((claim) => claimReview(fixture, claim, 'source-urssaf', citation, updated.contentSha256)));

  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.equal(result.pass, false);
  assert.ok(result.errors.some((error) => /citation.*recyclée|claims non équivalents/i.test(error)), result.errors.join('\n'));
});

test('une citation absente, hors copie ou trop générique ferme le gate déterministe', async () => {
  const mutations = [
    ['absente', (_fixture, claim) => { delete claim.factCheck.sourceResults[0].citation; }],
    ['hors-copie', (_fixture, claim) => {
      const text = 'Cette citation externe ne figure volontairement dans aucune copie locale vérifiée.';
      const result = claim.factCheck.sourceResults[0];
      claim.sourceExcerpts['source-urssaf'] = text;
      Object.assign(result, { excerpt: text, context: text, contextSha256: sha256(text) });
      Object.assign(result.citation, { text, sha256: sha256(text) });
    }],
    ['générique', (fixture, claim) => {
      const text = 'Règle officielle applicable.';
      const state = sourceState(fixture);
      const updated = replaceSourceSnapshot(fixture, `${readFileSync(state.snapshotPath, 'utf8')}${text}\n`);
      const line = readFileSync(updated.snapshotPath, 'utf8').split(/\r?\n/).findIndex((value) => value === text) + 1;
      const result = claim.factCheck.sourceResults[0];
      claim.sourceExcerpts['source-urssaf'] = text;
      Object.assign(result, { excerpt: text, context: text, contextSha256: sha256(text) });
      Object.assign(result.citation, {
        text,
        sha256: sha256(text),
        sourceContentSha256: updated.contentSha256,
        coordinates: {
          finalUrl: updated.proof.finalUrl,
          checkedAt: updated.proof.checkedAt,
          title: updated.source.title,
          locator: { kind: 'line-range', startLine: line, endLine: line },
        },
      });
      result.justification.sharedTerms = [];
    }],
  ];
  for (const [label, mutate] of mutations) {
    const fixture = await createCompleteDossier(root(`citation-${label}`));
    const claimsPath = join(fixture.dossier, 'claims.json');
    const claims = readJson(claimsPath);
    mutate(fixture, claims.claims[0]);
    writeJson(claimsPath, claims);
    const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
    assert.equal(result.pass, false, label);
    assert.ok(result.errors.some((error) => /citation|copie locale|générique|termes clés/i.test(error)), `${label}:\n${result.errors.join('\n')}`);
  }
});

test('le verdict métier est lié aux SHA-256 du Markdown, du claim, de la source et de la citation', async () => {
  for (const field of ['articleSha256', 'claimSha256', 'sourceContentSha256', 'citationSha256']) {
    const fixture = await createCompleteDossier(root(`review-binding-${field}`));
    const path = join(fixture.dossier, fixture.manifest.businessReview.evidence);
    const proof = readJson(path);
    proof.claimReviews[0][field] = '0'.repeat(64);
    writeJson(path, proof);
    const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
    assert.equal(result.pass, false, field);
    assert.ok(result.errors.some((error) => error.includes(field) || /slug.*SHA-256/i.test(error)), `${field}:\n${result.errors.join('\n')}`);
  }
});

test('verifySource transforme un manifest JSON malformé en échec contrôlé', async () => {
  const fixture = await createCompleteDossier(root('malformed-source-manifest'));
  writeFileSync(fixture.manifestPath, '{"sources": [');
  await assert.rejects(
    verifySource({ root: fixture.root, slug: fixture.slug, sourceId: 'source-urssaf', excerpt: 'citation officielle suffisamment longue' }),
    (error) => error.name !== 'SyntaxError' && /manifest\.json invalide/i.test(error.message),
  );
});

test('un fact-check absent, contradictoire ou hors contexte ferme chaque claim concerné', async () => {
  const cases = [
    ['absent', (claim) => { delete claim.factCheck; }],
    ['contradictoire', (claim) => {
      claim.factCheck.verdict = 'CONTRADICTED';
      claim.factCheck.sourceResults[0].verdict = 'CONTRADICTED';
      claim.factCheck.sourceResults[0].supportsClaim = false;
      claim.factCheck.sourceResults[0].contradictsClaim = true;
    }],
    ['hors-contexte', (claim) => {
      claim.factCheck.verdict = 'OUT_OF_CONTEXT';
      claim.factCheck.sourceResults[0].verdict = 'OUT_OF_CONTEXT';
      claim.factCheck.sourceResults[0].supportsClaim = false;
    }],
  ];
  for (const [label, mutate] of cases) {
    const fixture = await createCompleteDossier(root(`factcheck-${label}`));
    const claimsPath = join(fixture.dossier, 'claims.json');
    const claims = readJson(claimsPath);
    mutate(claims.claims[0]);
    writeJson(claimsPath, claims);
    const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
    assert.equal(result.pass, false, label);
    assert.ok(result.errors.some((error) => /factCheck|support absent|contradictoire|hors contexte/i.test(error)), `${label}:\n${result.errors.join('\n')}`);
  }
});

test('une matière sensible exige des sources et fact-checks vérifiés le jour de la revue', async () => {
  const fixture = await createCompleteDossier(root('stale-sensitive'), {
    manifestMutator: (manifest) => {
      manifest.sourcesVerifiedAt = '2000-01-01';
      manifest.sources.forEach((source) => { source.checkedAt = '2000-01-01'; });
    },
  });

  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.equal(result.pass, false);
  assert.ok(result.errors.some((error) => /fraîcheur|jour de la revue|2000-01-01/i.test(error)), result.errors.join('\n'));
});

test('une matière sensible cohérente et vérifiée aujourd’hui conserve le contrôle positif', async () => {
  const fixture = await createCompleteDossier(root('fresh-sensitive'));
  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.deepEqual(result.errors, []);
  assert.equal(result.pass, true);
});

test('une recommandation CNIL sourcée reste information, une obligation RGPD exige un type sensible', async () => {
  const cases = [
    ['conseil-partage', 'La CNIL conseille : les utilisateurs ne devraient soumettre que des informations qu’ils sont autorisés à partager.', false],
    ['conseil-choix', 'La CNIL recommande de partir de besoins concrets pour choisir un outil.', false],
    ['obligation', 'Selon le RGPD, le responsable du traitement doit protéger les données personnelles.', true],
  ];
  for (const [label, witness, requiresSensitiveType] of cases) {
    const fixture = await createCompleteDossier(root(`rgpd-${label}`), {
      body: `${DEFAULT_BODY}\n\n${witness} [Source](https://www.cnil.fr/fr/ia-generative).`,
    });
    const claimsPath = join(fixture.dossier, 'claims.json');
    const claims = readJson(claimsPath);
    const claim = claims.claims.find((item) => item.claim.startsWith(witness));
    claim.type = 'information';
    writeJson(claimsPath, claims);
    const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
    assert.equal(result.errors.some((error) => error.includes(`claims.contentUnits.${claim.unitId} contient une matière sensible visible`) && error.includes('claim.type sensible canonique')), requiresSensitiveType, `${label}: ${result.errors.join('\n')}`);
    if (label === 'conseil-partage') {
      claims.contentUnits.find((unit) => unit.id === claim.unitId).claimIds = [];
      writeJson(claimsPath, claims);
      const missingClaim = await validateDossier({ root: fixture.root, slug: fixture.slug });
      assert.ok(missingClaim.errors.some((error) => error.includes(`claims.contentUnits.${claim.unitId} doit relier au moins une affirmation vérifiée`)), missingClaim.errors.join('\n'));
    }
  }
});

test('le contenu paie fiscal et juridique impose fact-check et revue malgré des métadonnées génériques', async () => {
  const baseline = await createCompleteDossier(root('sensitive-content-baseline'));
  const witness = 'Le Code du travail autorise toujours ce traitement, le prélèvement à la source ne doit jamais être contrôlé et la déclaration sociale nominative peut être transmise sans validation.';
  const fixture = await createCompleteDossier(root('sensitive-content'), {
    body: `${baseline.body}\n\n${witness}`,
    manifestMutator: (manifest) => {
      manifest.cluster = 'production-comptable';
      manifest.role.primary = 'collaborateurs-comptables';
      manifest.role.secondary = ['direction-associes'];
      manifest.topics = ['production', 'excel'];
      manifest.businessReview.required = false;
      manifest.businessReview.status = 'FAIL';
    },
  });
  maskDeclaredSensitivity(fixture);

  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.equal(result.pass, false, 'le texte sensible rendu ne peut pas être neutralisé par cluster et claim.type');
  assert.ok(result.errors.some((error) => /blog-factcheck.*matière|matière.*blog-factcheck/i.test(error)), result.errors.join('\n'));
  assert.ok(result.errors.some((error) => /revue métier/i.test(error)), result.errors.join('\n'));
  assert.ok(result.errors.some((error) => /claim\.type sensible canonique/i.test(error)), result.errors.join('\n'));
});

test('chaque famille sensible visible déclenche seule les gates renforcés', async () => {
  const witnesses = {
    paie: 'Le bulletin de paie doit comporter le montant net versé au salarié.',
    social: 'Les cotisations sociales sont dues par l’employeur selon l’assiette applicable.',
    dsn: 'La DSN mensuelle doit être transmise à son échéance déclarative.',
    fiscal: 'La TVA collectée doit être déclarée selon la période fiscale applicable.',
    juridique: 'Un conseil juridique engage l’interprétation du contrat de travail.',
    reglementaire: 'Cette obligation réglementaire est imposée par le décret applicable.',
    normative: 'L’employeur doit remettre ce document au salarié au plus tard à l’échéance.',
    'normative-scindee': 'L’employeur remet ce document au salarié.\n\nIl doit le transmettre au plus tard à l’échéance.',
  };

  for (const [label, witness] of Object.entries(witnesses)) {
    const baseline = await createCompleteDossier(root(`sensitive-${label}-baseline`));
    const fixture = await createCompleteDossier(root(`sensitive-${label}`), {
      body: `${baseline.body}\n\n${witness}`,
      manifestMutator: (manifest) => {
        manifest.cluster = 'production-comptable';
        manifest.role.primary = 'collaborateurs-comptables';
        manifest.role.secondary = ['direction-associes'];
        manifest.topics = ['production', 'excel'];
        manifest.businessReview.required = false;
        manifest.businessReview.status = 'FAIL';
      },
    });
    maskDeclaredSensitivity(fixture);

    const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
    assert.ok(result.errors.some((error) => /blog-factcheck.*matière|matière.*blog-factcheck/i.test(error)), `${label} n’impose pas le fact-check :\n${result.errors.join('\n')}`);
    assert.ok(result.errors.some((error) => /revue métier/i.test(error)), `${label} n’impose pas la revue métier :\n${result.errors.join('\n')}`);
  }
});

test('claim.type refuse toute valeur hors taxonomie canonique', async () => {
  assert.deepEqual(CLAIM_TYPES, [
    'produit', 'methode', 'information', 'paie', 'social', 'dsn', 'fiscal', 'juridique',
    'legal-reglementaire', 'statistique-chiffre',
  ]);
  const fixture = await createCompleteDossier(root('claim-type'));
  const claimsPath = join(fixture.dossier, 'claims.json');
  const claims = readJson(claimsPath);
  claims.claims[0].type = 'type-invente-hors-taxonomie';
  writeJson(claimsPath, claims);

  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.equal(result.pass, false);
  assert.ok(result.errors.some((error) => /claims\[0\]\.type.*doit valoir/i.test(error)), result.errors.join('\n'));
});

test('le langage normatif général et les homonymes paie social ne déclenchent pas un faux positif métier', async () => {
  const baseline = await createCompleteDossier(root('non-sensitive-baseline'));
  const fixture = await createCompleteDossier(root('non-sensitive-content'), {
    body: `${baseline.body}\n\nLe bouton doit rester visible pendant la démonstration. L’équipe paie ses licences chaque mois et présente son travail sur le réseau social interne ; cette consigne est obligatoire uniquement pour organiser l’atelier fictif. Le code du candidat reste un identifiant technique sans rapport avec une règle métier.`,
    manifestMutator: (manifest) => {
      manifest.cluster = 'production-comptable';
      manifest.role.primary = 'collaborateurs-comptables';
      manifest.role.secondary = ['direction-associes'];
      manifest.topics = ['production', 'excel'];
      manifest.businessReview.required = false;
      manifest.businessReview.status = 'FAIL';
    },
  });
  maskDeclaredSensitivity(fixture);

  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.deepEqual(result.errors, []);
  assert.equal(result.pass, true);
});

test('une source factice, non reliée ou sans copie vérifiée ferme le gate', async () => {
  const fixture = await createCompleteDossier(root('source'));
  const manifest = readJson(fixture.manifestPath);
  manifest.sources[0].url = 'https://example.test/source-factice';
  writeJson(fixture.manifestPath, manifest);

  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.equal(result.pass, false);
  assert.ok(result.errors.some((error) => /réservé|factice/i.test(error)), result.errors.join('\n'));
  assert.ok(result.errors.some((error) => /requestedUrl|source.*reli/i.test(error)), result.errors.join('\n'));
});

test('verifySource ouvre la source et écrit une preuve reliée à sa copie exacte', async () => {
  const fixture = await createCompleteDossier(root('verify-source'));
  const excerpt = 'les données sont contrôlées avant leur transmission';
  const existingSnapshot = readFileSync(join(fixture.dossier, 'preuves/sources/source-urssaf.txt'), 'utf8');
  const sourceBody = `<main>Source officielle : ${excerpt}.\n${existingSnapshot}</main>`;
  const encodedSource = new TextEncoder().encode(sourceBody);
  let calledUrl = null;
  let fetchOptions = null;
  const result = await verifySource({
    root: fixture.root,
    slug: fixture.slug,
    sourceId: 'source-urssaf',
    excerpt,
    fetcher: async (url, options) => {
      calledUrl = url;
      fetchOptions = options;
      return {
        ok: true,
        status: 200,
        url: 'https://www.urssaf.fr/accueil/employeur/declarer-et-payer.html',
        headers: { get: (name) => name === 'content-length' ? String(Buffer.byteLength(sourceBody)) : 'text/html; charset=utf-8' },
        body: new ReadableStream({ start(controller) { controller.enqueue(encodedSource); controller.close(); } }),
      };
    },
    resolver: async () => [{ address: '93.184.216.34', family: 4 }],
  });
  assert.equal(calledUrl, fixture.manifest.sources[0].url);
  assert.equal(fetchOptions.redirect, 'manual');
  assert.ok(fetchOptions.dispatcher, 'la connexion doit recevoir le dispatcher à DNS prévalidé');
  assert.ok(fetchOptions.signal instanceof AbortSignal, 'chaque requête doit porter un timeout');
  const proof = readJson(join(fixture.root, result.evidence));
  const snapshot = readFileSync(join(fixture.root, result.content), 'utf8');
  assert.equal(proof.sourceId, 'source-urssaf');
  assert.equal(proof.requestedUrl, calledUrl);
  assert.equal(snapshot.includes(excerpt), true);
  const gate = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.equal(gate.pass, false, 'une nouvelle copie source doit invalider les citations et verdicts métier antérieurs');
  assert.ok(gate.errors.some((error) => /citation\.sourceContentSha256|revue métier.*sourceContentSha256/i.test(error)), gate.errors.join('\n'));
});

test('verifySource décode une source selon le charset déclaré', async () => {
  const fixture = await createCompleteDossier(root('verify-source-iso-8859-15'));
  const excerpt = 'Les écritures contrôlées sont prêtes pour la révision au coût de 15 €.';
  const sourceBody = `<main><p>${excerpt}</p></main>`;
  const encodedSource = Buffer.from(sourceBody.replace('€', '¤'), 'latin1');

  const result = await verifySource({
    root: fixture.root,
    slug: fixture.slug,
    sourceId: 'source-urssaf',
    excerpt,
    fetcher: async () => ({
      ok: true,
      status: 200,
      url: fixture.manifest.sources[0].url,
      headers: {
        get: (name) => {
          if (name === 'content-length') return String(encodedSource.byteLength);
          if (name === 'content-type') return 'text/html; charset=iso-8859-15';
          return null;
        },
      },
      body: new ReadableStream({ start(controller) { controller.enqueue(encodedSource); controller.close(); } }),
    }),
    resolver: async () => [{ address: '93.184.216.34', family: 4 }],
  });

  const snapshot = readFileSync(join(fixture.root, result.content), 'utf8');
  assert.equal(snapshot, sourceBody);
  assert.ok(snapshot.includes(excerpt));
});

test('verifySource rejette le loopback avant tout appel au fetcher', async () => {
  const fixture = await createCompleteDossier(root('ssrf-loopback'));
  const manifest = readJson(fixture.manifestPath);
  manifest.sources[0].url = 'https://127.0.0.1/private-source';
  writeJson(fixture.manifestPath, manifest);
  let fetchCount = 0;
  await assert.rejects(() => verifySource({
    root: fixture.root,
    slug: fixture.slug,
    sourceId: manifest.sources[0].id,
    excerpt: 'un extrait suffisamment long',
    fetcher: async () => { fetchCount += 1; throw new Error('fetch interdit'); },
    resolver: async () => [{ address: '127.0.0.1', family: 4 }],
  }), /privée|loopback|réservée/i);
  assert.equal(fetchCount, 0);
});

test('verifySource rejette les plages spéciales IPv4 et IPv6 avant tout fetch', async () => {
  const addresses = ['192.88.99.1', '192.0.2.1', '198.18.0.1', '2001:db8::1', '2002::1', '64:ff9b:1::1', '100:0:0:1::1', '2001:1::3'];
  for (const [index, address] of addresses.entries()) {
    const fixture = await createCompleteDossier(root(`ssrf-special-${index}`));
    const manifest = readJson(fixture.manifestPath);
    manifest.sources[0].url = `https://${address.includes(':') ? `[${address}]` : address}/source`;
    writeJson(fixture.manifestPath, manifest);
    let fetchCount = 0;
    await assert.rejects(() => verifySource({
      root: fixture.root,
      slug: fixture.slug,
      sourceId: manifest.sources[0].id,
      excerpt: 'un extrait suffisamment long',
      fetcher: async () => { fetchCount += 1; throw new Error('fetch interdit'); },
    }), /privée|loopback|réservée/i, address);
    assert.equal(fetchCount, 0, `${address} a atteint le fetcher`);
  }
});

test('verifySource conserve les adresses publiques IPv4 et IPv6', async () => {
  for (const address of ['8.8.8.8', '2606:4700:4700::1111']) {
    const fixture = await createCompleteDossier(root(`ssrf-public-${address.includes(':') ? 'v6' : 'v4'}`));
    const manifest = readJson(fixture.manifestPath);
    const excerpt = 'contenu public vérifié sans donnée client';
    manifest.sources[0].url = `https://${address.includes(':') ? `[${address}]` : address}/source`;
    writeJson(fixture.manifestPath, manifest);
    let fetchCount = 0;
    await verifySource({
      root: fixture.root,
      slug: fixture.slug,
      sourceId: manifest.sources[0].id,
      excerpt,
      fetcher: async (url) => {
        fetchCount += 1;
        const encoded = new TextEncoder().encode(excerpt);
        return {
          ok: true,
          status: 200,
          url,
          headers: { get: () => null },
          body: new ReadableStream({ start(controller) { controller.enqueue(encoded); controller.close(); } }),
        };
      },
    });
    assert.equal(fetchCount, 1, `${address} doit rester fetchable`);
  }
});

test('verifySource revalide et rejette une destination privée de redirect', async () => {
  const fixture = await createCompleteDossier(root('ssrf-redirect'));
  let fetchCount = 0;
  await assert.rejects(() => verifySource({
    root: fixture.root,
    slug: fixture.slug,
    sourceId: fixture.manifest.sources[0].id,
    excerpt: 'un extrait suffisamment long',
    resolver: async (hostname) => [{ address: hostname === 'www.urssaf.fr' ? '93.184.216.34' : '127.0.0.1', family: 4 }],
    fetcher: async () => {
      fetchCount += 1;
      return {
        ok: false,
        status: 302,
        url: fixture.manifest.sources[0].url,
        headers: { get: (name) => name === 'location' ? 'https://127.0.0.1/private' : null },
      };
    },
  }), /privée|loopback|réservée/i);
  assert.equal(fetchCount, 1);
});

test('verifySource refuse un corps annoncé au-delà du plafond avant de le lire', async () => {
  const fixture = await createCompleteDossier(root('source-size'));
  let bodyRead = false;
  await assert.rejects(() => verifySource({
    root: fixture.root,
    slug: fixture.slug,
    sourceId: fixture.manifest.sources[0].id,
    excerpt: 'un extrait suffisamment long',
    resolver: async () => [{ address: '93.184.216.34', family: 4 }],
    fetcher: async (url) => ({
      ok: true,
      status: 200,
      url,
      headers: { get: (name) => name === 'content-length' ? String(3 * 1024 * 1024) : 'text/html' },
      text: async () => { bodyRead = true; return 'corps'; },
    }),
  }), /taille maximale/i);
  assert.equal(bodyRead, false);
});

test('verifySource interrompt aussi un flux sans taille annoncée au-delà du plafond', async () => {
  const fixture = await createCompleteDossier(root('source-stream-size'));
  let cancelled = false;
  const oversized = new Uint8Array((2 * 1024 * 1024) + 1);
  await assert.rejects(() => verifySource({
    root: fixture.root,
    slug: fixture.slug,
    sourceId: fixture.manifest.sources[0].id,
    excerpt: 'un extrait suffisamment long',
    resolver: async () => [{ address: '93.184.216.34', family: 4 }],
    fetcher: async (url) => ({
      ok: true,
      status: 200,
      url,
      headers: { get: () => null },
      body: new ReadableStream({
        start(controller) { controller.enqueue(oversized); },
        cancel() { cancelled = true; },
      }),
    }),
  }), /taille maximale/i);
  assert.equal(cancelled, true);
});

test('le fact-check paie ne peut pas être marqué N/A et les skills cœur sont obligatoires', async () => {
  const fixture = await createCompleteDossier(root('factcheck'));
  const skillsPath = join(fixture.dossier, 'skills.json');
  const skills = readJson(skillsPath);
  for (const row of [...skills.blog, ...skills.seo]) {
    row.applicable = false;
    row.status = 'N/A';
    row.result = null;
    row.evidence = null;
    row.checkedAt = null;
    row.justification = 'Déclaré non applicable sans exécution du contrôle.';
  }
  writeJson(skillsPath, skills);

  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.equal(result.pass, false);
  assert.ok(result.errors.some((error) => error.includes('blog-factcheck') && /matière|paie/i.test(error)), result.errors.join('\n'));
  assert.ok(result.errors.some((error) => /skill cœur/i.test(error)), result.errors.join('\n'));
});

test('les preuves de skills relisent le slug et les empreintes du candidat exact', async () => {
  const fixture = await createCompleteDossier(root('skill-subject'));
  const skillEvidence = join(fixture.dossier, 'preuves/skills/blog-audit.json');
  const evidence = readJson(skillEvidence);
  evidence.candidateSlug = 'autre-candidat';
  writeJson(skillEvidence, evidence);

  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.equal(result.pass, false);
  assert.ok(result.errors.some((error) => error.includes('blog-audit') && /candidat exact|candidateSlug/i.test(error)), result.errors.join('\n'));
});

test('un score saisi et une preuve texte auto-déclarée ne remplacent pas la grille recalculée', async () => {
  const fixture = await createCompleteDossier(root('review'));
  const reviewPath = join(fixture.dossier, 'review.json');
  writeFileSync(join(fixture.dossier, 'preuves/revue.md'), '# Revue\nTout est bon.\n');
  writeJson(reviewPath, {
    version: 1,
    reviewer: 'marketing',
    checkedAt: '2026-09-13',
    score: 100,
    p0: [],
    blocking: false,
    decision: 'pret-preview',
    evidence: ['preuves/revue.md'],
  });

  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.equal(result.pass, false);
  assert.ok(result.errors.some((error) => /score saisi|recalcul/i.test(error)), result.errors.join('\n'));
  assert.ok(result.errors.some((error) => /rubricEvidence|grille structurée/i.test(error)), result.errors.join('\n'));
});

test('la grille éditoriale est complète et son score est recalculé depuis les critères', async () => {
  const fixture = await createCompleteDossier(root('review-score'));
  const proofPath = join(fixture.dossier, 'preuves/review.json');
  const proof = readJson(proofPath);
  proof.criteria[0].result = 'FAIL';
  proof.criteria[0].earned = proof.criteria[0].earned;
  writeJson(proofPath, proof);

  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.equal(result.pass, false);
  assert.ok(result.errors.some((error) => /score recalculé|earned.*divergent|90/i.test(error)), result.errors.join('\n'));
});

test('un contenu manifestement mince est refusé sans transformer le seuil en objectif SEO', async () => {
  const fixture = await createCompleteDossier(root('thin'), { body: '## Réponse directe\n\nCopie.' });
  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.equal(result.pass, false);
  assert.ok(result.errors.some((error) => /coquille|manifestement mince/i.test(error)), result.errors.join('\n'));
});

test('une duplication exacte et une near-duplication du corpus sont refusées', async () => {
  const corpusRoot = root('duplicate');
  const first = await createCompleteDossier(corpusRoot, { slug: 'premier-candidat', heroId: 'img-premier-candidat' });
  const second = await createCompleteDossier(corpusRoot, { slug: 'second-candidat', heroId: 'img-second-candidat', body: first.body });
  writeFileSync(join(corpusRoot, 'src/pages/index.astro'), '<a href="/blog/premier-candidat">A</a><a href="/blog/second-candidat">B</a>');
  writeFileSync(join(corpusRoot, 'src/pages/methode.astro'), '<a href="/blog/premier-candidat">A</a><a href="/blog/second-candidat">B</a>');

  const exact = await validateDossier({ root: corpusRoot, slug: second.slug });
  assert.ok(exact.errors.some((error) => /dupliqué.*premier-candidat/i.test(error)), exact.errors.join('\n'));

  const nearBody = first.body.replace('Cette fermeture évite', 'Cette protection empêche');
  const updatedMarkdown = articleMarkdown(second.manifest, nearBody);
  writeFileSync(second.articlePath, updatedMarkdown);
  const near = await validateDossier({ root: corpusRoot, slug: second.slug });
  assert.ok(near.errors.some((error) => /near-duplication.*premier-candidat/i.test(error)), near.errors.join('\n'));
});

test('même requête primaire et même intention bloquent deux candidats malgré des corps distincts', async () => {
  const corpusRoot = root('query-collision');
  await createCompleteDossier(corpusRoot, { slug: 'premier-candidat', heroId: 'img-premier-query' });
  const second = await createCompleteDossier(corpusRoot, { slug: 'second-candidat', heroId: 'img-second-query', body: DISTINCT_BODY });
  writeFileSync(join(corpusRoot, 'src/pages/index.astro'), '<a href="/blog/premier-candidat">A</a><a href="/blog/second-candidat">B</a>');
  const result = await validateDossier({ root: corpusRoot, slug: second.slug });
  assert.equal(result.pass, false);
  assert.ok(result.errors.some((error) => /requête primaire.*intention.*premier-candidat|cannibalisation.*premier-candidat/i.test(error)), result.errors.join('\n'));
});

test('un arbitrage structuré relié aux deux URL autorise la différenciation explicitement vérifiée', async (t) => {
  // This assertion tests cannibalization, not freshness: keep its gate on the fixture's UTC day.
  t.mock.timers.enable({ apis: ['Date'], now: Date.now() });
  try {
    const corpusRoot = root('query-resolution');
    await createCompleteDossier(corpusRoot, { slug: 'premier-candidat', heroId: 'img-premier-resolution' });
    const second = await createCompleteDossier(corpusRoot, {
      slug: 'second-candidat',
      heroId: 'img-second-resolution',
      body: DISTINCT_BODY,
      manifestMutator: (manifest) => {
        manifest.cannibalization.resolutions = [{
          action: 'differentiate',
          urls: ['/blog/premier-candidat', '/blog/second-candidat'],
          evidence: 'preuves/cannibalization-premier.json',
        }];
      },
    });
    writeFileSync(join(corpusRoot, 'src/pages/index.astro'), '<a href="/blog/premier-candidat">A</a><a href="/blog/second-candidat">B</a>');
    const result = await validateDossier({ root: corpusRoot, slug: second.slug });
    assert.deepEqual(result.errors, []);
  } finally {
    t.mock.timers.reset();
  }
});

test('une image uniforme auto-déclarée est refusée', async () => {
  const fixture = await createCompleteDossier(root('uniform-image'));
  const image = readJson(join(fixture.dossier, 'image.json'));
  await sharp({ create: { width: 1920, height: 1080, channels: 3, background: '#fffefb' } }).png().toFile(join(fixture.dossier, image.master.path));
  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.equal(result.pass, false);
  assert.ok(result.errors.some((error) => /uniforme|quasi uniforme|variation visuelle/i.test(error)), result.errors.join('\n'));
});

test('les rôles secondaires hors taxonomie et l’absence de revue métier ferment le gate', async () => {
  const fixture = await createCompleteDossier(root('business-review'));
  const manifest = readJson(fixture.manifestPath);
  manifest.role.secondary = ['role-invente-hors-taxonomie'];
  delete manifest.businessReview;
  writeJson(fixture.manifestPath, manifest);
  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  assert.equal(result.pass, false);
  assert.ok(result.errors.some((error) => /role\.secondary.*doit valoir/i.test(error)), result.errors.join('\n'));
  assert.ok(result.errors.some((error) => /revue métier/i.test(error)), result.errors.join('\n'));
});

test('tous les champs du frontmatter divergent sont comparés au manifeste', async () => {
  const fixture = await createCompleteDossier(root('frontmatter'));
  const markdown = readFileSync(fixture.articlePath, 'utf8')
    .replace(fixture.manifest.summary, 'Résumé divergent assez long pour rester valide dans le schéma Astro du candidat.')
    .replace('secondaryQueries: ["contrôle excel cabinet"]', 'secondaryQueries: ["requête divergente"]')
    .replace('fanOut: ["quels contrôles jouer"]', 'fanOut: ["fan-out divergent"]')
    .replace('rolesSecondaires: [direction-associes]', 'rolesSecondaires: [assistants-comptables]')
    .replace(fixture.manifest.task, 'Une autre tâche suffisamment détaillée pour passer le schéma.')
    .replace('niveau: observe', 'niveau: hypothese')
    .replace(fixture.manifest.reviewRule, 'Une autre règle de révision suffisamment longue.')
    .replace(fixture.manifest.cta.label, 'CTA divergent')
    .replace(`datePublication: ${fixture.manifest.publicationDate}`, `datePublication: ${fixture.manifest.publicationDate}\ndateMiseAJour: ${fixture.manifest.publicationDate}`);
  writeFileSync(fixture.articlePath, markdown);

  const result = await validateDossier({ root: fixture.root, slug: fixture.slug });
  for (const field of ['resume', 'dateMiseAJour', 'secondaryQueries', 'fanOut', 'rolesSecondaires', 'tache', 'preuveRole', 'reviewRule', 'cta']) {
    assert.ok(result.errors.some((error) => error.includes(field)), `${field} non détecté :\n${result.errors.join('\n')}`);
  }
});

test('l’inventaire et chaque dossier refusent les articles pipeline minces ou dupliqués', async () => {
  const corpusRoot = root('audit-corpus');
  await createCompleteDossier(corpusRoot, { slug: 'candidat-mince', heroId: 'img-candidat-mince', body: '## Réponse directe\n\nCopie.' });
  const inventory = auditArticleInventory({ root: corpusRoot });
  assert.equal(inventory.articles.find((item) => item.slug === 'candidat-mince')?.status, 'pipeline');
  const result = await validateDossier({ root: corpusRoot, slug: 'candidat-mince' });
  assert.ok(result.errors.some((error) => /manifestement mince/i.test(error)));
});

test('le registre canonique conserve bien les 31 skills Blog et 24 SEO', () => {
  assert.equal(BLOG_SKILLS.length, 31);
  assert.equal(SEO_SKILLS.length, 24);
});
