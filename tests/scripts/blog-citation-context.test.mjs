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
