import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { publicationAlerts } from '../../scripts/lib/blog-publication-watch.mjs';

const calendar = `| Date | Article | Famille | Pôle | Format | P | Statut |
|---|---|---|---|---|---|---|
| 2026-09-21 | [Article A](/blog/a) | X | X | how-to-guide | 1 | planned |
| 2026-09-21 | [Article B](/blog/b) | X | X | how-to-guide | 1 | published |
| 2026-09-24 | [Article C](/blog/c) | X | X | how-to-guide | 1 | planned |
| 2026-09-26 | [Cicatrice](/blog/d) | X | X | thought-leadership | 3 | planned |
`;

test('après créneau, le sitemap absent signale sans annoncer une non-publication certaine', () => {
  const result = publicationAlerts({ calendar, date: '2026-09-24', urls: ['https://memlia.fr/blog/b'], previous: [] });
  assert.deepEqual(result.newAlerts.map((x) => x.slug), ['a']);
  assert.match(result.newAlerts[0].message, /manquante du sitemap/i);
  assert.equal(result.newAlerts[0].observation, 'absent-du-sitemap');
  assert.equal('published' in result.newAlerts[0], false);
  assert.deepEqual(result.current.map((x) => x.slug), ['a']);
});

test('pas de double alerte à état inchangé ; résolution et nouveau créneau alertent séparément', () => {
  const first = publicationAlerts({ calendar, date: '2026-09-25', urls: [], previous: [] });
  assert.deepEqual(first.newAlerts.map((x) => x.slug), ['a', 'b', 'c']);
  const repeat = publicationAlerts({ calendar, date: '2026-09-25', urls: [], previous: first.current });
  assert.deepEqual(repeat.newAlerts, []);
  const recovery = publicationAlerts({ calendar, date: '2026-09-27', urls: ['https://memlia.fr/blog/a', 'https://memlia.fr/blog/b'], previous: repeat.current });
  assert.deepEqual(recovery.newAlerts.map((x) => x.slug), ['d']);
  assert.deepEqual(recovery.current.map((x) => x.slug), ['c', 'd']);
});

test('un jour futur ou courant et un calendrier corrompu ne produisent pas de faux vert', () => {
  assert.deepEqual(publicationAlerts({ calendar, date: '2026-09-21', urls: [], previous: [] }).current, []);
  assert.deepEqual(publicationAlerts({ calendar, date: '2026-09-21', urls: [], previous: [], afterSlot: true }).current.map((x) => x.slug), ['a', 'b']);
  assert.throws(() => publicationAlerts({ calendar: '| 2026-09-20 | invalid |', date: '2026-09-24', urls: [], previous: [] }), /calendrier/i);
});

test('le calendrier réel est accepté et les créneaux échus absents restent visibles', () => {
  const source = readFileSync(new URL('../../docs/strategy/site-v3/CONTENT-CALENDAR.md', import.meta.url), 'utf8');
  const result = publicationAlerts({ calendar: source, date: '2026-09-24', urls: [], afterSlot: true });
  assert.ok(result.current.some((x) => x.status === 'planned' && x.date < '2026-09-24'));
  assert.ok(result.current.every((x) => x.date <= '2026-09-24'));
});
