import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { contexteDeCitation, validateCandidate, validateDossier } from '../../scripts/lib/blog-pipeline.mjs';
import { candidateManifest, createCompleteDossier } from './blog-fixture.mjs';

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const writeJson = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
const sha256 = (text) => createHash('sha256').update(text).digest('hex');
const validate = (fixture) => validateDossier({ root: fixture.root, slug: fixture.slug,
  renderedBlogHtml: `<li data-article="${fixture.slug}"><a href="/blog/${fixture.slug}">Article rendu</a></li>` });

test('la forge accepte les cinq pôles CAC du contrat de contenu existant', () => {
  for (const cluster of ['certification', 'interventions-legales', 'sacc', 'durabilite', 'administration']) {
    assert.deepEqual(validateCandidate({ ...candidateManifest(), cluster }), [], cluster);
  }
  assert.ok(validateCandidate({ ...candidateManifest(), cluster: 'pole-invente' }).some((error) => error.startsWith('cluster doit valoir')));
});

test('une revue unique couvre les deux grilles en conservant verdicts unitaires et indépendance', async () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-cac-review-'));
  try {
    const fixture = await createCompleteDossier(root, {
      manifestMutator: (manifest) => { manifest.businessReview.reviewerId = manifest.reviewer; },
    });
    assert.deepEqual((await validate(fixture)).errors, []);
    const proofPath = join(fixture.dossier, fixture.manifest.businessReview.evidence);
    const proof = readJson(proofPath);
    proof.claimReviews[0].verdict = 'hors_sujet';
    writeJson(proofPath, proof);
    assert.ok((await validate(fixture)).errors.some((error) => error.includes('seul le verdict soutient')));
    const authorFixture = await createCompleteDossier(root, {
      manifestMutator: (manifest) => { manifest.businessReview.reviewerId = manifest.author; },
    });
    assert.ok((await validate(authorFixture)).errors.some((error) => error.includes('identité distincte de l’auteur')));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('le contexte brut conserve la réserve et la fermeture réelle du paragraphe officiel', () => {
  const excerpt = 'd) Les éléments d’appréciation des outils et techniques automatisés visés au paragraphe 46.</p>';
  const reserve = 'Dans les seules conditions prévues par cette norme. ';
  assert.equal(contexteDeCitation(`<p>${reserve}${excerpt}`, excerpt, { bloc: true }), `${reserve}${excerpt}`);
  for (const attribute of ['hidden', 'style="display:none"']) {
    assert.equal(contexteDeCitation(`<p ${attribute}>${reserve}${excerpt}`, excerpt, { bloc: true, visibleOnly: true }), excerpt);
    assert.equal(contexteDeCitation(`<p><span ${attribute}>${reserve}${excerpt.slice(0, -4)}</span></p>`, excerpt, { bloc: true, visibleOnly: true }), excerpt);
  }
});

test('le gate qualifie la frontière HTML sans accepter un contexte fabriqué ou ignoré', async () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-cac-boundary-'));
  try {
    const fixture = await createCompleteDossier(root);
    const source = fixture.manifest.sources[0];
    const proofPath = join(fixture.dossier, source.verificationEvidence);
    const proof = readJson(proofPath);
    const snapshotPath = join(fixture.dossier, proof.contentPath);
    const original = readFileSync(snapshotPath, 'utf8').trim();
    const claimsPath = join(fixture.dossier, 'claims.json');
    const claims = readJson(claimsPath);
    const businessPath = join(fixture.dossier, fixture.manifest.businessReview.evidence);
    const business = readJson(businessPath);
    const update = (snapshot, context) => {
      writeFileSync(snapshotPath, snapshot);
      proof.contentSha256 = sha256(snapshot);
      writeJson(proofPath, proof);
      for (const claim of claims.claims) {
        const result = claim.factCheck.sourceResults.find((item) => item.sourceId === source.id);
        result.context = context;
        result.contextSha256 = sha256(context);
        result.citation.sourceContentSha256 = proof.contentSha256;
      }
      for (const item of business.claimReviews.filter((item) => item.sourceId === source.id)) item.sourceContentSha256 = proof.contentSha256;
      writeJson(claimsPath, claims);
      writeJson(businessPath, business);
    };
    update(`<p>${original}</p>`, `${original}</p>`);
    assert.deepEqual((await validate(fixture)).errors, []);
    for (const suffix of ['</div>', '</p>Texte absent']) {
      update(`<p>${original}</p>`, `${original}${suffix}`);
      assert.ok((await validate(fixture)).errors.some((error) => error.includes('.context est absent, hors de la copie vérifiée')));
    }
    for (const snapshot of [`<script>${original}</script>`, `<!-- <p>${original}</p> -->`, `<p><template>${original}</template></p>`]) {
      update(snapshot, `${original}</p>`);
      assert.ok((await validate(fixture)).errors.some((error) => error.includes('.context est absent, hors de la copie vérifiée')));
    }
  } finally { rmSync(root, { recursive: true, force: true }); }
});
