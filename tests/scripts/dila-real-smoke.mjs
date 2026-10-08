import { readFileSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { createCompleteDossier, DEFAULT_BODY } from './blog-fixture.mjs';
import { createResourceFixture } from './resource-fixture.mjs';
import { validateDossier } from '../../scripts/lib/blog-pipeline.mjs';
import { validateResourceManifest } from '../../scripts/lib/resource-pipeline.mjs';
import { dilaDay } from '../../scripts/lib/dila-source-copy.mjs';

if (!process.argv[2] || !process.argv[3]) throw new Error('Usage : node tests/scripts/dila-real-smoke.mjs <copie-A4.json> <rapport.json>');
const root = mkdtempSync(join(tmpdir(), 'dila-real-smoke-'));
try {
  const copy = JSON.parse(readFileSync(resolve(process.argv[2])));
  const quote = copy.text.split('\n')[0];
  const slug = 'article-legi-reception-technique';
  const sourceId = 'source-urssaf';
  await createCompleteDossier(root, {
    slug, body: `${DEFAULT_BODY}\n\n## Citation du Code de commerce\n\n${quote}`,
    sourceCopies: { [sourceId]: copy },
    manifestMutator: (m) => {
      Object.assign(m.sources[0], {
        publisher: 'Légifrance', title: 'Code de commerce — L.821-35', url: copy.url,
        upstreamUrl: copy.url, checkedAt: dilaDay(copy.provenance.retrieved_at), dilaCopyPath: 'preuves/sources/legi.dila.json',
      });
    },
    claimSourceForUnit: (m, unit) => unit.text === quote ? m.sources[0] : m.sources[1],
    claimTypeForUnit: (unit) => unit.text === quote ? 'legal-reglementaire' : 'information',
  });
  const article = await validateDossier({ root, slug, renderedBlogHtml: `<li data-article="${slug}"><a href="/blog/${slug}">Recette technique non publiée</a></li>` });
  const term = createResourceFixture(root, 'T', 'qa', { dilaCopy: copy, sensitiveVerdictAt: new Date().toISOString() });
  const glossaire = validateResourceManifest(term, { root, phase: 'qa' });
  const report = {
    kind: 'technical-reception-not-publication', copiedId: copy.id, collectionDate: copy.provenance.retrieved_at,
    legalVersionDate: copy.valid_from, publicUrl: copy.url,
    article: { pass: article.pass, errors: article.errors }, term: { pass: glossaire.pass, errors: glossaire.errors },
    warning: 'Fixtures techniques ; avis métier synthétiques des tests, jamais une revue réelle ni une publication. Copie LEGI A4 réelle, texte et provenance non fabriqués.',
  };
  writeFileSync(resolve(process.argv[3]), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  if (!article.pass || !glossaire.pass) process.exitCode = 1;
} finally { rmSync(root, { recursive: true, force: true }); }
