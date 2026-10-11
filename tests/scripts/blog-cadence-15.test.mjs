import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verifierPlafonds } from '../../scripts/lib/blog-pipeline.mjs';

test('trois articles EC/CAC par jour, quinze par semaine ISO, vendredi inclus', () => {
  const actifs = Array.from({ length: 14 }, (_, i) => ({ slug: `angle-${i}`, profession: i % 2 ? 'ec' : 'cac', date: `2026-10-${12 + Math.floor(i / 3)}` }));
  assert.doesNotThrow(() => verifierPlafonds(actifs, '2026-10-16'));
  assert.throws(() => verifierPlafonds(actifs, '2026-10-12'), /3 candidats/);
  assert.throws(() => verifierPlafonds([...actifs, { date: '2026-10-16' }], '2026-10-16'), /3 candidats/);
  const semaine = Array.from({ length: 15 }, (_, i) => ({ date: `2026-10-${12 + Math.floor(i / 3)}` }));
  assert.throws(() => verifierPlafonds(semaine, '2026-10-17'), /lundi-vendredi/);
  assert.doesNotThrow(() => verifierPlafonds(semaine, '2026-10-17', { serie: 'cicatrices' }));
  assert.doesNotThrow(() => verifierPlafonds(semaine, '2026-10-19'));
});

test('réservation ordinaire du dimanche refusée', () => {
  assert.throws(() => verifierPlafonds([], '2026-10-11'), /lundi-vendredi/);
});
