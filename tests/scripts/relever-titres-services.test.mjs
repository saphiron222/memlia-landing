import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { releverTitresServices } from '../../scripts/seo/relever-titres-services.mjs';
import { chargerAutocompletionMesuree } from '../../scripts/lib/blog-title-intent.mjs';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'releve-services-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const recettes = join(root, 'commercial/recettes');
  mkdirSync(recettes, { recursive: true });
  for (const [slug, recipe] of Object.entries({
    nouveau: { primaryQuery: 'nouvelle tâche', secondaryQueries: ['autre tâche', 'commune'] },
    suivant: { primaryQuery: 'commune', secondaryQueries: [] },
  })) {
    mkdirSync(join(recettes, slug));
    writeFileSync(join(recettes, slug, 'recette.json'), JSON.stringify(recipe));
  }
  mkdirSync(join(recettes, 'sans-recette'));
  writeFileSync(join(recettes, 'README.md'), 'Documentation');
  return root;
}
const maintenant = () => new Date('2026-10-05T22:30:00Z');
const cheminMesure = (root) => join(root, 'docs/strategy/site-v3/mesures/titres-intent-2026-10-06.json');

test('découvre toutes les recettes, déduplique et date le relevé en Europe/Paris', async (t) => {
  const root = fixture(t);
  const appels = [];
  const result = await releverTitresServices({ root, maintenant, autocompleter: async (q) => {
    appels.push(q);
    return { ok: true, suggestions: [] };
  } });
  assert.deepEqual(appels, ['nouvelle tâche', 'autre tâche', 'commune']);
  assert.equal(result.chemin, cheminMesure(root));
  const mesure = JSON.parse(readFileSync(result.chemin, 'utf8'));
  assert.deepEqual(Object.keys(mesure.autocompletion), appels);
  assert.equal(mesure.measuredAt, '2026-10-05T22:30:00.000Z');
  assert.equal(mesure.provenance.commune.capturedAt, mesure.measuredAt);
  assert.match(mesure.provenance.commune.url, /q=commune$/);
  assert.deepEqual(chargerAutocompletionMesuree(root, { au: '2026-10-12' }).autocompletion, mesure.autocompletion);
  assert.throws(() => chargerAutocompletionMesuree(root, { au: '2026-10-15' }), /aucun relevé/);
});

test('fusionne un relevé du jour sans détruire les mesures du blog et leurs métadonnées', async (t) => {
  const root = fixture(t);
  const chemin = cheminMesure(root);
  mkdirSync(join(root, 'docs/strategy/site-v3/mesures'), { recursive: true });
  const precedent = { measuredAt: '2026-10-05T22:05:00Z', note: 'blog', autocompletion: { blog: ['résultat'], commune: ['ancien'] }, provenance: { blog: { capturedAt: '2026-10-05T22:05:00Z' } } };
  writeFileSync(chemin, JSON.stringify(precedent));
  await releverTitresServices({ root, maintenant, autocompleter: async () => ({ ok: true, suggestions: [] }) });
  const mesure = JSON.parse(readFileSync(chemin, 'utf8'));
  assert.equal(mesure.measuredAt, precedent.measuredAt);
  assert.equal(mesure.note, 'blog');
  assert.deepEqual(mesure.autocompletion.blog, ['résultat']);
  assert.deepEqual(mesure.provenance.blog, precedent.provenance.blog);
  assert.deepEqual(mesure.autocompletion.commune, []);
});

test('une panne ne produit pas un relevé partiel ni ne modifie le précédent', async (t) => {
  const root = fixture(t);
  const chemin = cheminMesure(root);
  const options = { root, maintenant, autocompleter: async (q) => q === 'commune' ? { ok: false, erreur: 'HTTP 503' } : { ok: true, suggestions: [] } };
  await assert.rejects(releverTitresServices(options), /HTTP 503/);
  assert.equal(existsSync(chemin), false);
  mkdirSync(join(root, 'docs/strategy/site-v3/mesures'), { recursive: true });
  const contenu = '{"autocompletion":{"blog":[]}}\n';
  writeFileSync(chemin, contenu);
  await assert.rejects(releverTitresServices(options), /HTTP 503/);
  assert.equal(readFileSync(chemin, 'utf8'), contenu);
});
