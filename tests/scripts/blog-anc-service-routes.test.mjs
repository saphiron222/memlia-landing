import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { validateDossier } from '../../scripts/lib/blog-pipeline.mjs';
import { articleMarkdown, candidateManifest, createCompleteDossier } from './blog-fixture.mjs';

async function check(t, { publisher = 'ANC', url = 'https://www.anc.gouv.fr/plan-comptable-general', link, route = true, content = true } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'memlia-blog-anc-service-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const body = articleMarkdown(candidateManifest()).split('---\n').slice(2).join('---\n').trim();
  const fixture = await createCompleteDossier(root, {
    body: `${body}${link ? `\n\nVoir [le service](${link}).` : ''}`,
    manifestMutator(manifest) {
      Object.assign(manifest.sources[0], { publisher, url, upstreamUrl: url });
      if (link) manifest.links.outgoing.push(link);
    },
  });
  if (link) {
    mkdirSync(join(root, 'src/pages/automatisation'), { recursive: true });
    mkdirSync(join(root, 'src/content/services'), { recursive: true });
    if (route) writeFileSync(join(root, 'src/pages/automatisation/[slug].astro'), '---\n// Route de collection services\n---\n');
    if (content) writeFileSync(join(root, 'src/content/services/rapprochement-bancaire.md'), '---\nstatus: publie\n---\nService bancaire.');
  }
  return validateDossier({ root, slug: fixture.slug, renderedBlogHtml: `<li data-article="${fixture.slug}"><a href="/blog/${fixture.slug}">Article</a></li>` });
}

for (const publisher of ['ANC', 'Autorité des normes comptables']) {
  test(`ANC : domaine officiel et éditeur ${publisher} reconnus sans remplacer les preuves`, async (t) => {
    assert.deepEqual((await check(t, { publisher })).errors, []);
  });
}

for (const [publisher, url] of [
  ['ANC', 'https://anc.gouv.fr.evil.example/pcg'],
  ['ANC', 'https://fakeanc.gouv.fr/pcg'],
  ['ANC', 'https://www.urssaf.fr/pcg'],
  ['Urssaf', 'https://www.anc.gouv.fr/pcg'],
  ['ANC privée', 'https://www.anc.gouv.fr/pcg'],
]) {
  test(`ANC : refus du couple ${publisher} / ${url}`, async (t) => {
    const result = await check(t, { publisher, url });
    assert.equal(result.pass, false);
    assert.ok(result.errors.some((error) => /autorité officielle bornée|incohérence domaine↔éditeur/.test(error)), result.errors.join('\n'));
  });
}

for (const link of ['/automatisation/rapprochement-bancaire', '/automatisation/rapprochement-bancaire?origine=blog#preuve']) {
  test(`service : cible de collection existante ${link}`, async (t) => {
    assert.deepEqual((await check(t, { link })).errors, []);
  });
}

for (const options of [
  { link: '/automatisation/service-inexistant' },
  { link: '/automatisation/rapprochement-bancaire', route: false },
  { link: '/automatisation/rapprochement-bancaire', content: false },
  { link: '/automatisation/../rapprochement-bancaire' },
]) {
  test(`service : refus sans cible réelle ${JSON.stringify(options)}`, async (t) => {
    const result = await check(t, options);
    assert.equal(result.pass, false);
    assert.ok(result.errors.some((error) => /cible du lien obligatoire.*absente du corpus/.test(error)), result.errors.join('\n'));
  });
}
