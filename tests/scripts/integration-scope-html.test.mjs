import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const slugs = ['rapprochement-bancaire-sage', 'lettrage-sage', 'dsn-sage', 'bulletin-de-paie-sage', 'saisie-comptable-sage', 'cloture-sage', 'lettrage-cegid', 'dsn-silae', 'bulletin-de-paie-silae'];
const base = process.env.QA_URL;
const load = async (path) => {
  if (!base) return readFileSync(`dist/${path}.html`, 'utf8');
  const response = await fetch(new URL(`/${path}`, base));
  assert.equal(response.status, 200, path);
  assert.equal(new URL(response.url).pathname, `/${path}`, 'pas de redirection vers une autre page');
  return response.text();
};
const text = (html) => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

for (const slug of slugs) {
  test(`${slug} : portée et attentes servies dans le HTML`, async () => {
    const html = await load(`integrations/${slug}`);
    const visible = text(html);
    assert.match(html, new RegExp(`<link rel="canonical" href="https://memlia.fr/integrations/${slug}"`));
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
    assert.match(html, new RegExp(`/proofs/integrations/${slug}\\.webp`));
    // Décision de Kevin du 06/10/2026 : pas de section « Source » ; le document de l'éditeur se cite dans le texte.
    assert.doesNotMatch(html, /data-primary-source|id="source"/, 'aucune section Source');
    assert.match(html, /aria-labelledby="repere-editeur"[\s\S]*?<a href="https:\/\/[^"]+" rel="noopener noreferrer"/, 'le document de l’éditeur est cité par un lien dans le paragraphe de portée');
    assert.doesNotMatch(visible, /consultée le|vérifiée le/i);
    assert.match(visible, /Cas illustratifs sur données fictives/);
    assert.match(visible, /aucun essai dans le logiciel éditeur/);
    assert.match(visible, /État attendu/);
    assert.match(visible, /Trace attendue/);
    assert.match(visible, /Reste humain/);
    assert.doesNotMatch(visible, /Champ observé dans le jeu fictif|sortie obtenue par la règle|Rejoué sur le jeu fictif/);
    assert.doesNotMatch(visible, /undefined|\[object Object\]/);
    if (slug.endsWith('silae')) {
      assert.match(visible, /commerciale/);
      assert.match(visible, /grille de cadrage/);
    }
    if (slug === 'lettrage-cegid') {
      assert.match(visible, /JSON/);
      assert.match(visible, /debit.amount/);
      assert.match(visible, /credit.amount/);
      assert.doesNotMatch(visible, /Écritures comptables → filtre/);
    }
    if (slug === 'dsn-sage') {
      assert.match(visible, /contrats sociaux/);
      assert.doesNotMatch(visible, /ARRCO et AGIRC|S21.G00.41/);
    }
    if (slug === 'bulletin-de-paie-sage') assert.match(visible, /repère historique/);
    if (slug === 'cloture-sage') assert.match(visible, /sauvegarde/);
    if (slug === 'rapprochement-bancaire-sage') {
      assert.match(visible, /plus ancien/);
      assert.match(visible, /il ne réalise pas l’appariement des mouvements/);
    }
  });
}

test('renvoi service : soldes et CSV, pas appariement', async () => {
  const html = await load('automatisation/rapprochement-bancaire');
  const aside = html.match(/<aside class="service-outil"[^>]*>([\s\S]*?)<\/aside>/)?.[1];
  assert.ok(aside);
  assert.match(text(aside), /Contrôle de soldes fictifs, pas l’appariement des mouvements/);
  assert.match(text(aside), /exporter le CSV/);
});
