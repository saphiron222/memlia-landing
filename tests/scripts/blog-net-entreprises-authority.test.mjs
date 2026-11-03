import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { construireClaims } from '../../scripts/blog-forge.mjs';
import { validateDossier, jourRecuperationParis } from '../../scripts/lib/blog-pipeline.mjs';
import { createCompleteDossier } from './blog-fixture.mjs';

const officialCases = [
  ['www.net-entreprises.fr', 'Net-entreprises'],
  ['net-entreprises.custhelp.com', 'Net-entreprises'],
];
const rejectedCases = [
  ['net-entreprises.custhelp.com.evil.example', 'Net-entreprises'],
  ['fake-net-entreprises.custhelp.com', 'Net-entreprises'],
  ['autre.custhelp.com', 'Net-entreprises'],
  ['custhelp.com', 'Net-entreprises'],
  ['sous.net-entreprises.custhelp.com', 'Net-entreprises'],
  ['net-entreprises.custhelp.com', 'Urssaf'],
  ['net-entreprises.custhelp.com', 'Cabinet fictif'],
  ['evil.example', 'Net-entreprises'],
];
const citation = 'Le déclarant consulte la mandathèque pour visualiser le mandat dans le compte rendu métier.';

for (const [host, publisher] of [...officialCases, ...rejectedCases]) {
  const accepted = officialCases.some(([h, p]) => h === host && p === publisher);
  test(`Net-entreprises domaine/éditeur : ${host}, ${publisher}, ${accepted ? 'accepté' : 'refusé'} dans les deux chemins`, async () => {
    const root = mkdtempSync(join(tmpdir(), 'memlia-ne-authority-'));
    try {
      const fixture = await createCompleteDossier(root, {
        manifestMutator: (manifest) => Object.assign(manifest.sources[0], {
          publisher, url: `https://${host}/aide`, upstreamUrl: `https://${host}/aide`,
        }),
        claimTypeForUnit: () => 'legal-reglementaire',
      });
      const result = await validateDossier({ root, slug: fixture.slug,
        renderedBlogHtml: `<li data-article="${fixture.slug}"><a href="/blog/${fixture.slug}">Article rendu</a></li>` });
      assert.equal(result.pass, accepted, result.errors.join('\n'));
      if (!accepted) assert.match(result.errors.join('\n'), /domaine↔éditeur|autorité officielle bornée/);

      const slug = 'probe-ne';
      const dossier = join(root, 'editorial/articles', slug);
      mkdirSync(join(dossier, 'preuves/sources'), { recursive: true });
      const source = { ...fixture.manifest.sources[0], id: 'source-ne',
        verificationEvidence: 'preuves/sources/source-ne.json' };
      writeFileSync(join(dossier, 'manifest.json'), JSON.stringify({ sources: [source] }));
      // Copie fictive locale : tester l’autorité, pas résoudre les domaines usurpés.
      writeFileSync(join(dossier, 'preuves/sources/source-ne.source.txt'), citation);
      writeFileSync(join(dossier, source.verificationEvidence), JSON.stringify({
        finalUrl: source.url, checkedAt: source.checkedAt, contentSha256: 'fixture',
      }));
      const build = (overrides = {}, sourceOverrides = {}) => construireClaims({
        recette: { sources: [{ ...source, ...sourceOverrides }], claims: [{
          unite: citation, claim: citation, excerpt: citation, type: 'legal-reglementaire',
          sourceId: source.id, explanation: 'Reprise exacte de la citation du jeu fictif de test.', ...overrides,
        }] }, corps: citation, dossier, sujet: { slug, articleHash: 'probe' },
        jour: jourRecuperationParis(new Date().toISOString()),
      });
      const claims = build();
      assert.equal(claims.erreurs.length === 0, accepted, claims.erreurs.join('\n'));
      if (!accepted) assert.match(claims.erreurs.join('\n'), /source officielle reconnue/);
      else {
        assert.equal(claims.claims.claims[0].type, 'legal-reglementaire');
        assert.match(build({}, { official: false }).erreurs.join('\n'), /source officielle reconnue/);
        assert.match(build({ excerpt: 'Un extrait absent de la copie locale vérifiée.' }).erreurs.join('\n'), /copie locale/);
      }
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
}
