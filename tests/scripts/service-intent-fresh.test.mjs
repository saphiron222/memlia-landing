import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chargerAutocompletionMesuree, titrePorteUneRequeteMesuree } from '../../scripts/lib/blog-title-intent.mjs';

const root = resolve(import.meta.dirname, '../..');
const slugs = ['factures-fournisseurs', 'notes-de-frais', 'paie', 'rapprochement-bancaire', 'saisie-comptable'];

test('les quinze requêtes des services sont mesurées fraîchement et les titres portent leur intention', () => {
  const mesure = chargerAutocompletionMesuree(root, { au: '2026-09-29' });
  const releve = JSON.parse(readFileSync(join(root, 'docs/strategy/site-v3/mesures/titres-intent-2026-09-28.json'), 'utf8'));
  for (const slug of slugs) {
    const recette = JSON.parse(readFileSync(join(root, 'commercial/recettes', slug, 'recette.json'), 'utf8'));
    const requetes = [recette.primaryQuery, ...recette.secondaryQueries];
    assert.equal(requetes.length, 3, `${slug} : trois requêtes déclarées`);
    for (const requete of requetes) {
      assert.ok(Object.hasOwn(mesure.autocompletion, requete), `${slug} : requête non mesurée : ${requete}`);
      assert.ok(Array.isArray(mesure.autocompletion[requete]), `${slug} : suggestions invalides : ${requete}`);
      assert.equal(releve.provenance[requete]?.url,
        `https://suggestqueries.google.com/complete/search?client=firefox&hl=fr&gl=fr&q=${encodeURIComponent(requete)}`);
      assert.match(releve.provenance[requete]?.capturedAt ?? '', /^2026-09-28T/);
    }
    for (const titre of [recette.title, recette.tabTitle]) {
      assert.ok(titrePorteUneRequeteMesuree(titre, requetes, mesure.autocompletion), `${slug} : titre sans intention mesurée : ${titre}`);
    }
  }
});
