import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, mkdtempSync, cpSync, writeFileSync, rmSync } from 'node:fs';
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
for (const path of ['editorial', 'src', 'docs', 'public', 'dist', 'scripts/lib/blog-ia-catchup.mjs']) {
  cpSync(join(sourceRoot, path), join(root, path), { recursive: true });
}
test.after(() => rmSync(root, { recursive: true, force: true }));

// La fixture éprouve la conservation d'un article scellé, pas la fraîcheur des relevés du dépôt : celle-ci revient au
// relevé de demande du lundi. Elle reçoit donc, au jour de sa matérialisation, la dernière mesure réelle des requêtes
// de l'article, recopiée et signalée comme telle. Sans cela, ce test expirait huit jours après chaque relevé (07/10/2026).
const historique = (jour) => chargerAutocompletionMesuree(root, { au: jour, ageMaxJours: Number.MAX_SAFE_INTEGER });
const jourParis = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const recette = JSON.parse(readFileSync(join(root, 'editorial/recettes', slug, 'recette.json'), 'utf8'));
const connues = historique(jourParis).autocompletion;
const mesurees = [recette.primaryQuery, ...(recette.secondaryQueries ?? [])].filter((requete) => Object.hasOwn(connues, requete));
assert.ok(mesurees.length > 0, `${slug} : aucune requête jamais mesurée, la fixture n'a pas de mesure réelle à recopier`);
const releveDuJour = join(root, 'docs/strategy/site-v3/mesures', `titres-intent-${jourParis}.json`);
const existant = existsSync(releveDuJour) ? JSON.parse(readFileSync(releveDuJour, 'utf8')) : {};
writeFileSync(releveDuJour, `${JSON.stringify({
  ...existant,
  instrument: existant.instrument ?? 'fixture de test : dernière mesure réelle recopiée',
  autocompletion: { ...existant.autocompletion, ...Object.fromEntries(mesurees.map((requete) => [requete, connues[requete]])) },
}, null, 2)}\n`);

const fixture = await materialiser({ root, slug, statut: 'publie' });
assert.deepEqual(fixture.erreurs, [], 'La fixture doit être réellement matérialisée.');
ecrireSceau(root, slug);
// Le relevé le plus récent, toutes sources confondues : neuf jours plus tard, plus aucun n'est frais.
const dernierReleve = Object.values(historique(jourParis).mesureParRequete).map(({ date }) => date).sort().at(-1);
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
