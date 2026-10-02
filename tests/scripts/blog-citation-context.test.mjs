import assert from 'node:assert/strict';
import { test } from 'node:test';
import { contexteDeCitation } from '../../scripts/lib/blog-pipeline.mjs';

for (const excerpt of ['conservés six ans', 'conservés  six  ans', 'expire après le 1<sup>er</sup> janvier 2027']) {
  test(`citation exacte et réserves conservées : ${excerpt}`, () => {
    const source = `<html><head><title>Autre matière</title></head><body><p>Phrase précédente.</p><p>Pour cette catégorie seulement, ${excerpt}, sauf exception légale. Phrase suivante.</p></body></html>`;
    const context = contexteDeCitation(source, excerpt);
    assert.ok(context.includes(excerpt), 'citation octet-identique');
    assert.ok(context.includes('Pour cette catégorie seulement'), 'périmètre de la phrase');
    assert.ok(context.includes('sauf exception légale'), 'réserve de la phrase');
    assert.ok(source.includes(context), 'contexte présent dans la copie brute');
    assert.doesNotMatch(context, /Phrase précédente|Phrase suivante|Autre matière/);
  });
}

// Régression du défaut établi par revue source : les réserves du contexte
// doivent venir du texte affiché, jamais d'un descendant ou commentaire caché.
for (const hidden of [
  '<script>réserve invisible script</script>',
  '<style>réserve invisible style</style>',
  '<noscript>réserve invisible noscript</noscript>',
  '<template>réserve invisible template</template>',
  '<!-- réserve invisible commentaire -->',
]) {
  test(`contexte brut sans contamination non visible : ${hidden}`, () => {
    const excerpt = 'taux de 7 %';
    const source = `<p>Dans ce cas, ${excerpt}${hidden}, sous réserve du plafond applicable. Phrase suivante.</p>`;
    const context = contexteDeCitation(source, excerpt);
    assert.ok(context.includes(excerpt), 'citation octet-identique');
    assert.ok(context.includes('Dans ce cas'), 'périmètre visible');
    assert.ok(context.includes('sous réserve du plafond applicable'), 'réserve visible');
    assert.doesNotMatch(context, /invisible|script|style|template|<!--|Phrase suivante/);
  });
}

for (const source of [
  '<p>Texte visible.<script>taux de 7 %, réserve inventée.</script></p>',
  '<script>taux de 7 %, réserve inventée.</script>',
  '<!-- taux de 7 %, réserve inventée. -->',
]) {
  test(`une citation uniquement cachée ne fournit aucun contexte attesté : ${source}`, () => {
    assert.equal(contexteDeCitation(source, 'taux de 7 %'), 'taux de 7 %');
  });
}

for (const source of [
  'Dans ce cas, taux de 7 %, sous réserve du plafond applicable. Phrase suivante.',
  '<p>Dans ce cas, taux de 7 %, sous réserve du plafond applicable. Phrase suivante.',
]) {
  test(`citation brute conservée en texte simple ou paragraphe implicite : ${source}`, () => {
    assert.equal(contexteDeCitation(source, 'taux de 7 %'), 'Dans ce cas, taux de 7 %, sous réserve du plafond applicable.');
  });
}
