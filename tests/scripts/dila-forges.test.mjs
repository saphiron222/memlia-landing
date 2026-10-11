import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { verifySource, validateDossier } from '../../scripts/lib/blog-pipeline.mjs';
import { verifierSources, ecrireSceau } from '../../scripts/blog-forge.mjs';
import { validateResourceManifest } from '../../scripts/lib/resource-pipeline.mjs';
import { createResourceFixture } from './resource-fixture.mjs';
import { createCompleteDossier, DEFAULT_BODY } from './blog-fixture.mjs';
import { COPY, TEXT, URL } from './dila-copy-fixture.mjs';

const json = (p, value) => writeFileSync(p, `${JSON.stringify(value)}\n`);
const noNetwork = async () => { throw new Error('Réseau interdit dans ce témoin DILA.'); };

test('forge blog : préparation DILA sans réseau, date originale et réutilisation', async () => {
  const root = mkdtempSync(join(tmpdir(), 'blog-dila-'));
  try {
    const slug = 'source-legi-test';
    const dossier = join(root, 'editorial/articles', slug);
    const dossierRecette = join(root, 'editorial/recettes', slug);
    mkdirSync(join(dossier, 'preuves/sources'), { recursive: true }); mkdirSync(dossierRecette, { recursive: true });
    const copy = structuredClone(COPY); copy.provenance.retrieved_at = new Date().toISOString();
    json(join(dossierRecette, 'legi.json'), copy);
    const source = { id: 'legi', url: URL, publisher: 'Légifrance', title: 'Article L.821-35', level: 'tier-1', official: true,
      classificationReason: 'Article du Code de commerce, copie DILA issue du référentiel A4.', excerpt: TEXT, dilaCopyPath: 'legi.json' };
    const recette = { sources: [source] };
    json(join(dossier, 'manifest.json'), { sources: [{ ...source, dilaCopyPath: 'preuves/sources/legi.dila.json', method: null,
      provenance: 'primary', upstreamUrl: URL, verificationEvidence: 'preuves/sources/legi.json' }] });
    const jour = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
    await verifierSources({ root, slug, recette, dossierRecette, jour, fetcher: noNetwork });
    const p = JSON.parse(readFileSync(join(dossier, 'preuves/sources/legi.json')));
    assert.equal(p.accessMode, 'dila-copy'); assert.equal(p.httpStatus, null); assert.equal(p.retrievedAt, copy.provenance.retrieved_at);
    await verifierSources({ root, slug, recette, dossierRecette, jour, fetcher: noNetwork });
    assert.equal(readFileSync(join(dossier, 'preuves/sources/legi.json'), 'utf8'), `${JSON.stringify(p, null, 2)}\n`);
    for (const mutate of [(c) => { c.provenance.retrieved_at = '2020-01-01T00:00:00Z'; }, (c) => { c.text = 'extrait différent'; }]) {
      const invalid = structuredClone(copy); mutate(invalid); json(join(dossierRecette, 'legi.json'), invalid);
      await assert.rejects(verifierSources({ root, slug, recette, dossierRecette, jour, fetcher: noNetwork }));
    }
    unlinkSync(join(dossierRecette, 'legi.json'));
    await assert.rejects(verifierSources({ root, slug, recette, dossierRecette, jour, fetcher: noNetwork }));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('gate blog : dossier complet LEGI accepté, preuve altérée ou retirée refusée', async () => {
  const root = mkdtempSync(join(tmpdir(), 'blog-dila-gate-'));
  try {
    await createCompleteDossier(root, { manifestMutator: (m) => {
      Object.assign(m.sources[0], { publisher: 'Légifrance', url: URL, upstreamUrl: URL, dilaCopyPath: 'preuves/sources/legi.dila.json' });
    } });
    const dossier = join(root, 'editorial/articles/article-de-test');
    const manifest = JSON.parse(readFileSync(join(dossier, 'manifest.json')));
    const source = manifest.sources[0];
    const proof = JSON.parse(readFileSync(join(dossier, source.verificationEvidence)));
    const snapshot = readFileSync(join(dossier, proof.contentPath), 'utf8');
    const copy = { ...structuredClone(COPY), text: snapshot, chunks: [{ index: 1, text: snapshot }] };
    copy.provenance.retrieved_at = proof.retrievedAt;
    json(join(dossier, source.dilaCopyPath), copy);
    await verifySource({ root, slug: 'article-de-test', sourceId: source.id, excerpt: proof.excerpt, fetcher: noNetwork });
    const gate = () => validateDossier({ root, slug: 'article-de-test', renderedBlogHtml: '<li data-article="article-de-test"><a href="/blog/article-de-test">Article fictif</a></li>' });
    const report = await gate();
    assert.equal(report.pass, true, report.errors.join('\n'));
    const path = join(dossier, source.verificationEvidence);
    const verified = JSON.parse(readFileSync(path)); verified.httpStatus = 200; json(path, verified);
    assert.equal((await gate()).pass, false);
    verified.httpStatus = null; delete verified.dilaCopySha256; json(path, verified);
    assert.equal((await gate()).pass, false);
    unlinkSync(join(dossier, source.dilaCopyPath));
    assert.equal((await gate()).pass, false);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('publication blog scellée : conservation à J+8 sans redater ni ouvrir un candidat neuf', async (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: new Date('2026-10-01T12:00:00Z') });
  const root = mkdtempSync(join(tmpdir(), 'blog-dila-seal-'));
  try {
    const copy = structuredClone(COPY);
    await createCompleteDossier(root, { body: `${DEFAULT_BODY}\n\n## Citation juridique\n\n${TEXT}`,
      sourceCopies: { 'source-urssaf': copy },
      claimSourceForUnit: (m, u) => u.text === TEXT ? m.sources[0] : m.sources[1],
      manifestMutator: (m) => {
        Object.assign(m.sources[0], { publisher: 'Légifrance', url: URL, upstreamUrl: URL, dilaCopyPath: 'preuves/sources/legi.dila.json' });
        m.editorialStatus = 'publie'; m.publishedAt = '2026-10-01'; m.publicationEvidence = 'preuves/publication.json';
        m.kevin.productionApproved = true; m.kevin.previewApproved = true;
      },
    });
    ecrireSceau(root, 'article-de-test', '2026-10-01');
    const gate = (gateMode) => validateDossier({ root, slug: 'article-de-test', gateMode,
      renderedBlogHtml: '<li data-article="article-de-test"><a href="/blog/article-de-test">Article fictif</a></li>' });
    const before = await gate('publication-scellee'); assert.equal(before.pass, true, before.errors.join('\n'));
    t.mock.timers.setTime(new Date('2026-10-09T12:00:00Z').getTime());
    const after = await gate('publication-scellee'); assert.equal(after.pass, true, after.errors.join('\n'));
    const fresh = await gate('production'); assert.equal(fresh.pass, false);
    const dossier = join(root, 'editorial/articles/article-de-test');
    unlinkSync(join(dossier, 'preuves/sources/legi.dila.json'));
    assert.equal((await gate('publication-scellee')).pass, false);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('terme du glossaire : gate complet avec une copie LEGI de 7 jours, mutations refusées', () => {
  const root = mkdtempSync(join(tmpdir(), 'term-dila-'));
  try {
    const manifest = createResourceFixture(root, 'T', 'qa', { dilaCopy: COPY, sensitiveVerdictDay: '2026-10-08' });
    const report = validateResourceManifest(manifest, { root, phase: 'qa' });
    assert.equal(report.pass, true, report.errors.join('\n'));
    for (const day of ['2026-10-09', '2026-09-30']) {
      const invalid = createResourceFixture(root, 'T', 'qa', { dilaCopy: COPY, sensitiveVerdictDay: day });
      assert.equal(validateResourceManifest(invalid, { root, phase: 'qa' }).pass, false);
    }
    const valid = createResourceFixture(root, 'T', 'qa', { dilaCopy: COPY, sensitiveVerdictDay: '2026-10-08' });
    const wrongExcerpt = structuredClone(valid);
    wrongExcerpt.claimsEvidence.citations[0].text = 'Cette citation inexacte ne figure pas dans la copie LEGI.';
    assert.equal(validateResourceManifest(wrongExcerpt, { root, phase: 'qa' }).pass, false);
    const unbound = structuredClone(valid); delete unbound.claimsEvidence.sources[0].dilaCopySha256;
    assert.equal(validateResourceManifest(unbound, { root, phase: 'qa' }).pass, false);
    unlinkSync(join(root, 'fixtures/dila.json'));
    assert.equal(validateResourceManifest(valid, { root, phase: 'qa' }).pass, false);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
