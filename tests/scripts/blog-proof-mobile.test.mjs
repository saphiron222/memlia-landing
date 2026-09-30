import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { injecterPreuvesInline } from '../../scripts/blog-forge.mjs';

const root = new URL('../../', import.meta.url).pathname;
const proof = (id) => ({ id, insertBeforeHeading: 'Suite', alt: 'Preuve fictive', source: 'Jeu fictif', capturedAt: '2026-09-29' });

// A fluid desktop canvas alone shrinks 12px labels to roughly 3px on a phone.
test('inline proofs offer a portrait mobile asset without a scrolling wrapper', () => {
  for (const id of ['saisie-six-controles', 'saisie-file-anomalies', 'carte-douze-poles', 'carte-test-regle', 'competences-frontiere', 'competences-refus', 'w39-prompt-brouillon', 'w39-prompt-arret', 'w39-logiciel-parcours', 'w39-logiciel-exceptions']) {
    assert.ok(existsSync(`${root}/public/proofs/blog/${id}-mobile.webp`), `Portrait manquant : ${id}`);
    const rendered = injecterPreuvesInline('Intro\n\n## Suite\n', [proof(id)], root);
    assert.match(rendered, new RegExp(`srcset="/proofs/blog/${id}-mobile\\.webp 1200w, /proofs/blog/${id}\\.webp 1600w"`));
    assert.match(rendered, /sizes="\(max-width: 600px\) 375px, 1600px"/);
    assert.match(rendered, /<figure data-blog-proof=[^>]+>\s*<img/);
    assert.doesNotMatch(rendered, /figcaption|preuve-defilante/);
  }
});
