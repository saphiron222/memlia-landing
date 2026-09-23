import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { test } from 'node:test';
import { renderDraft, seal, SLUG } from '../../scripts/blog-draft-transmission.mjs';

const root = resolve(import.meta.dirname, '../..');
const base = `editorial/recettes/${SLUG}`;

test('le brouillon sans couverture se prépare hors forge publique et reste non scellable sans PASS indépendant', () => {
  const packet = JSON.parse(readFileSync(join(root, base, 'paquet-revue.json'), 'utf8'));
  const recipe = JSON.parse(readFileSync(join(root, base, 'recette.json'), 'utf8'));
  const html = renderDraft(readFileSync(join(root, base, 'corps.md'), 'utf8'), recipe);
  assert.equal(packet.cover.status, 'absente-volontairement');
  assert.equal(packet.claims.length, 5);
  assert.equal(packet.replay.cases.length, 5);
  assert.match(html, /name="robots" content="noindex,nofollow"/);
  assert.doesNotMatch(html, /<img\b|<meta[^>]*property="og:image"/);
  assert.equal(existsSync(join(root, `src/content/blog/${SLUG}.md`)), false);
  assert.equal(existsSync(join(root, `editorial/articles/${SLUG}/manifest.json`)), false);
  assert.equal(JSON.parse(readFileSync(join(root, 'editorial/queue.json'), 'utf8')).candidates.some((item) => item.slug === SLUG), false);
  const reviews = JSON.parse(readFileSync(join(root, base, 'revues.json'), 'utf8'));
  if (reviews.verdict !== 'PASS') assert.throws(() => seal(root), /Revue indépendante sur un paquet ou rendu différent|Revue indépendante FAIL ou incomplète/);
});
