import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, cpSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { validateDossier } from '../../scripts/lib/blog-pipeline.mjs';
import { auditerContratBlog } from '../../scripts/verify-blog-contract.mjs';
import { materialiser, ecrireSceau } from '../../scripts/blog-forge.mjs';
import { chargerAutocompletionMesuree } from '../../scripts/lib/blog-title-intent.mjs';

const sourceRoot = resolve(import.meta.dirname, '../..');
// Fixture scellée isolée : le vrai candidat peut être en republication go-production.
const root = mkdtempSync(join(process.env.TMPDIR || tmpdir(), 'blog-intent-fixture-'));
const slug = 'prompt-chatgpt-expert-comptable';
// Ce contrat porte sur l'intention et le sceau historiques, pas sur les créneaux
// actuels : copier les preuves documentaires, sans embarquer le planificateur live.
for (const path of ['editorial', 'src', 'docs/strategy/site-v3/mesures',
  'docs/strategy/site-v3/cluster-briefs', 'docs/strategy/site-v3/w39-cadrage-operateur.json',
  'docs/strategy/site-v3/rattrapage-ia-2026-10-05.json', 'public', 'dist', 'scripts/lib/blog-ia-catchup.mjs']) {
  cpSync(join(sourceRoot, path), join(root, path), { recursive: true });

}
// Date historique de cette fixture, cohérente avec ses preuves et son relevé.
// Ne pas utiliser le jour d'exécution pour reconstruire une publication passée.
const jourFixture = '2026-10-03';
test.before(async () => {
  const fixture = await materialiser({ root, slug, statut: 'publie', jour: jourFixture });
  assert.deepEqual(fixture.erreurs, [], 'La fixture doit être réellement matérialisée.');
  ecrireSceau(root, slug);
});
test.after(() => rmSync(root, { recursive: true, force: true }));
// Le dernier relevé, toutes sources confondues (forge et relevé de demande du lundi) : neuf jours plus tard,
// plus aucun n'est frais, quel que soit le fichier qui l'a apporté.
const toutesMesures = chargerAutocompletionMesuree(root, { au: '9999-12-31', ageMaxJours: Number.MAX_SAFE_INTEGER });
const dernierReleve = Object.values(toutesMesures.mesureParRequete).map(({ date }) => date).sort().at(-1);
const au = new Date(Date.parse(`${dernierReleve}T00:00:00Z`) + 9 * 86_400_000).toISOString().slice(0, 10);
const renderedBlogHtml = `<li data-article="${slug}"><a href="/blog/${slug}">Article</a></li>`;

test('la fixture historique se matérialise même après expiration des relevés', async (t) => {
  for (const jourReel of [au, '2030-01-01']) {
    await t.test(jourReel, async (t) => {
      const isolated = mkdtempSync(join(process.env.TMPDIR || tmpdir(), 'blog-intent-expired-'));
      t.after(() => rmSync(isolated, { recursive: true, force: true }));
      cpSync(root, isolated, { recursive: true });
      t.mock.timers.enable({ apis: ['Date'], now: Date.parse(`${jourReel}T12:00:00Z`) });
      const fixtureExpiree = await materialiser({ root: isolated, slug, statut: 'publie', jour: jourFixture });
      assert.deepEqual(fixtureExpiree.erreurs, [], 'La reconstruction historique reste indépendante du jour réel.');
      ecrireSceau(isolated, slug);
      t.mock.timers.reset();
      const historique = await validateDossier({ root: isolated, slug, gateMode: 'publication-scellee', renderedBlogHtml, au });
      assert.equal(historique.pass, true, historique.errors.join('\n'));
      const candidat = await validateDossier({ root: isolated, slug, gateMode: 'protected-preview', renderedBlogHtml, au });
      assert.ok(candidat.errors.some((erreur) => erreur.includes('aucun relevé d’autocomplétion frais')), candidat.errors.join('\n'));
    });
  }
});

// Le build:site exerce le contrat HTML ; blog:audit exerce également le dossier scellé.
test('la vieillesse du relevé seule ne refuse pas un article public scellé', async () => {
  const dossier = await validateDossier({ root, slug, gateMode: 'publication-scellee', renderedBlogHtml, au });
  assert.equal(dossier.pass, true, dossier.errors.join('\n'));
  const contrat = auditerContratBlog({ root, slugs: [slug], au });
  assert.equal(contrat.pass, true, contrat.erreurs.join('\n'));
});

test('un candidat non scellé conserve le refus sur un relevé vieilli', async () => {
  const dossier = await validateDossier({ root, slug, gateMode: 'protected-preview', renderedBlogHtml, au });
  assert.ok(dossier.errors.some((erreur) => erreur.includes('aucun relevé d’autocomplétion frais')), dossier.errors.join('\n'));
});

test('un sceau rompu ne peut bénéficier de la conservation historique', async () => {
  const manifest = JSON.parse(readFileSync(join(root, 'editorial/articles', slug, 'manifest.json'), 'utf8'));
  assert.equal(manifest.editorialStatus, 'publie');
  // Témoin d'intégrité via une copie du dossier, sans modifier les fichiers publics.
  const { mkdtempSync, cpSync, writeFileSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const isolated = mkdtempSync(join(tmpdir(), 'blog-seal-intent-'));
  try {
    cpSync(join(root, 'editorial/articles', slug), join(isolated, 'editorial/articles', slug), { recursive: true });
    cpSync(join(root, 'editorial/recettes', slug), join(isolated, 'editorial/recettes', slug), { recursive: true });
    cpSync(join(root, 'src/content/blog', `${slug}.md`), join(isolated, 'src/content/blog', `${slug}.md`), { recursive: true });
    cpSync(join(root, 'docs/strategy/site-v3/mesures'), join(isolated, 'docs/strategy/site-v3/mesures'), { recursive: true });
    writeFileSync(join(isolated, 'src/content/blog', `${slug}.md`), `${readFileSync(join(isolated, 'src/content/blog', `${slug}.md`), 'utf8')}\nchangement de titre ou contenu\n`);
    const dossier = await validateDossier({ root: isolated, slug, gateMode: 'publication-scellee', renderedBlogHtml, au });
    assert.ok(dossier.errors.some((erreur) => erreur.includes('Publication scellée')), dossier.errors.join('\n'));
    assert.ok(dossier.errors.some((erreur) => erreur.includes('aucun relevé d’autocomplétion frais')), dossier.errors.join('\n'));
    const contrat = auditerContratBlog({ root: isolated, dist: join(root, 'dist'), slugs: [slug], au });
    assert.ok(contrat.erreurs.some((erreur) => erreur.includes('aucun relevé d’autocomplétion frais')), contrat.erreurs.join('\n'));
  } finally {
    rmSync(isolated, { recursive: true, force: true });
  }
});
