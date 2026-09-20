import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const source = readFileSync(join(root, 'src/data/integrations.ts'), 'utf8');
const dist = join(root, 'dist');

const slugs = [
  'rapprochement-bancaire-sage',
  'lettrage-sage',
  'dsn-sage',
  'bulletin-de-paie-sage',
  'saisie-comptable-sage',
  'cloture-sage',
  'lettrage-cegid',
  'dsn-silae',
  'bulletin-de-paie-silae',
];

const primaryQueries = new Map([
  ['rapprochement-bancaire-sage', 'rapprochement bancaire sage'],
  ['lettrage-sage', 'lettrage sage'],
  ['dsn-sage', 'dsn sage'],
  ['bulletin-de-paie-sage', 'bulletin de paie sage'],
  ['saisie-comptable-sage', 'saisie comptable sage'],
  ['cloture-sage', 'clôture sage'],
  ['lettrage-cegid', 'lettrage cegid'],
  ['dsn-silae', 'dsn silae'],
  ['bulletin-de-paie-silae', 'bulletin de paie silae'],
]);

function decodeEntities(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function textContent(html) {
  return decodeEntities(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

test('la grille ferme les 10 variations moyennes et les 16 refusées', () => {
  const statuses = [...source.matchAll(/status: '(forte|moyenne|refusee)'/g)].map((match) => match[1]);
  assert.equal(statuses.filter((status) => status === 'forte').length, 9);
  assert.equal(statuses.filter((status) => status === 'moyenne').length, 10);
  assert.equal(statuses.filter((status) => status === 'refusee').length, 16);
  assert.equal(statuses.length, 35);
});

test('seules les neuf variations fortes produisent une page', () => {
  const rendered = readdirSync(join(dist, 'integrations'))
    .filter((name) => name.endsWith('.html'))
    .map((name) => name.replace(/\.html$/, ''))
    .sort();
  assert.deepEqual(rendered, [...slugs].sort());
});

test('chaque page porte une intention, une source, un auteur et une preuve propres', () => {
  const mediaIds = new Set();
  const sourceUrls = new Set();

  for (const slug of slugs) {
    const html = readFileSync(join(dist, 'integrations', `${slug}.html`), 'utf8');
    const h1 = decodeEntities(html.match(/<h1\b[^>]*>(.*?)<\/h1>/s)?.[1] ?? '').replace(/<[^>]+>/g, '').trim();
    const ogTitle = decodeEntities(html.match(/<meta property="og:title" content="([^"]+)"/)?.[1] ?? '');
    const primaryQuery = primaryQueries.get(slug);
    assert.ok(primaryQuery, slug);
    assert.ok(h1.toLocaleLowerCase('fr').startsWith(primaryQuery), `${slug}: H1 intent-first`);
    assert.equal(ogTitle, h1, `${slug}: H1 = og:title`);
    assert.match(html, /"headline":"[^"]+"/, `${slug}: headline JSON-LD`);
    assert.match(html, /Kevin Kitanga/, `${slug}: auteur`);
    assert.match(html, /id="regle-ecrite"/, `${slug}: règle écrite`);
    assert.match(html, /id="jeu-fictif"/, `${slug}: jeu fictif`);
    assert.match(html, /non recettée dans l’outil éditeur/, `${slug}: non-attestation`);
    assert.match(html, /Memlia est indépendante de/, `${slug}: indépendance`);

    const mediaId = html.match(/data-media="([^"]+)"/)?.[1];
    assert.equal(mediaId, slug, `${slug}: média HTML propre`);
    assert.ok(!mediaIds.has(mediaId), `${slug}: média unique`);
    mediaIds.add(mediaId);

    const sourceUrl = html.match(/class="source-lien" href="([^"]+)"/)?.[1];
    assert.ok(sourceUrl?.startsWith('https://'), `${slug}: source éditeur`);
    assert.ok(!sourceUrls.has(sourceUrl), `${slug}: source propre`);
    sourceUrls.add(sourceUrl);

    const words = textContent(html).split(/\s+/).filter(Boolean).length;
    assert.ok(words >= 650, `${slug}: ${words} mots, contenu trop mince`);
  }
});

test('les moyeux listent tous leurs rayons et le footer expose le hub', () => {
  const mappings = new Map([
    ['automatisation/rapprochement-bancaire.html', ['rapprochement-bancaire-sage']],
    ['automatisation/saisie-comptable.html', ['lettrage-sage', 'saisie-comptable-sage', 'lettrage-cegid']],
    ['automatisation/paie.html', ['dsn-sage', 'bulletin-de-paie-sage', 'dsn-silae', 'bulletin-de-paie-silae']],
    ['automatisation-cabinet-comptable.html', ['cloture-sage']],
  ]);
  for (const [file, expected] of mappings) {
    const html = readFileSync(join(dist, file), 'utf8');
    for (const slug of expected) assert.match(html, new RegExp(`href="/integrations/${slug}"`), `${file} → ${slug}`);
  }
  const home = readFileSync(join(dist, 'index.html'), 'utf8');
  assert.match(home, /href="\/integrations"[^>]*>Guides par environnement<\/a>/);
});
