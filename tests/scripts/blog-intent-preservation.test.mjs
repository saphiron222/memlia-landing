import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { validateDossier } from '../../scripts/lib/blog-pipeline.mjs';
import { auditerContratBlog } from '../../scripts/verify-blog-contract.mjs';

const root = resolve(import.meta.dirname, '../..');
const slug = 'prompt-chatgpt-expert-comptable';
const dernierReleve = readdirSync(join(root, 'docs/strategy/site-v3/mesures'))
  .filter((nom) => /^(questions|titres-intent)-\d{4}-\d{2}-\d{2}\.json$/.test(nom))
  .map((nom) => nom.match(/\d{4}-\d{2}-\d{2}/)[0])
  .sort().at(-1);
const au = new Date(Date.parse(`${dernierReleve}T00:00:00Z`) + 9 * 86_400_000).toISOString().slice(0, 10);
const renderedBlogHtml = `<li data-article="${slug}"><a href="/blog/${slug}">Article</a></li>`;

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
