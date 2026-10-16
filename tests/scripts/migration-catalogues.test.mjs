import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { ROBOTS } from '../../src/data/robots.ts';
import { INTEGRATIONS_ARCHIVEES, INTEGRATIONS_INDEXABLES } from '../../src/data/integrations.ts';
import {
  MIGRATION_CATALOGUES, ROUTES_RETIREES, verifierDecisionMigration,
  destinationActuelle, estRouteRetiree, blocRedirections, reponseMigration,
} from '../../src/data/migrations-catalogues.mjs';
import { loadBundledModules } from '../helpers/bundled-modules.mjs';

const [
  { onRequestGet: robotGet, onRequestHead: robotHead },
  { onRequestGet: guideGet, onRequestHead: guideHead },
  { MIGRATION_CATALOGUES: decisionAstro },
] = await loadBundledModules([
  '/functions/automatisation/[slug].js',
  '/functions/integrations/[slug].js',
  '/src/data/migrations-catalogues.mjs',
]);

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const decision = MIGRATION_CATALOGUES;
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const sourceJson = name => JSON.parse(readFileSync(resolve(ROOT, name), 'utf8'));
const SERVICE_DESTINATIONS = {
  'saisie-comptable': '/agents-ia/comptabilite#tache-saisie-ocr-2',
  'factures-fournisseurs': '/agents-ia/comptabilite#tache-achats-fournisseurs-4',
  'rapprochement-bancaire': '/agents-ia/comptabilite#tache-banque-rapprochement-5',
  'notes-de-frais': '/agents-ia/comptabilite#taches-titre',
  'facture-electronique': '/agents-ia/comptabilite#tache-facture-electronique-3',
  paie: '/agents-ia/paie-social',
  'bulletins-controle': '/agents-ia/paie-social#tache-bulletins-controle-2',
  'entrees-sorties-salaries': '/agents-ia/paie-social#tache-entrees-sorties-salaries-5',
  'secretariat-juridique': '/agents-ia/juridique-fiscal#tache-secretariat-juridique-7',
  'registres-obligations': '/agents-ia/juridique-fiscal#tache-registres-obligations-10',
  'evaluation-transmission': '/agents-ia/finance#tache-evaluation-transmission-10',
  'circularisation-cac': '/commissaires-aux-comptes#use-certification',
};
const GUIDE_DESTINATIONS = {
  'rapprochement-bancaire-sage': '/integrations#sage-100-comptabilite',
  'lettrage-sage': '/integrations#sage-100-comptabilite',
  'dsn-sage': '/integrations#sage-100-paie-rh',
  'bulletin-de-paie-sage': '/integrations#sage-100-paie-rh',
  'saisie-comptable-sage': '/integrations#sage-100-comptabilite',
  'cloture-sage': '/integrations#sage-100-comptabilite',
  'lettrage-cegid': '/integrations#cegid-loop',
  'dsn-silae': '/integrations#silae',
  'bulletin-de-paie-silae': '/integrations#silae',
  'export-fec-ebp': '/integrations#ebp-comptabilite',
  'lettrage-ebp': '/integrations#ebp-comptabilite',
  'cloture-ebp': '/integrations#ebp-comptabilite',
};
const EXPECTED = Object.fromEntries([
  ...Object.entries(SERVICE_DESTINATIONS).map(([slug, to]) => [`/automatisation/${slug}`, to]),
  ...Object.entries(GUIDE_DESTINATIONS).map(([slug, to]) => [`/integrations/${slug}`, to]),
]);
// Témoins figés du corpus antérieur : changer ensemble la recette et la décision ne les contourne pas.
const ORIGINAL_SERVICE_HASHES = {
  'saisie-comptable': 'b5c258e85361f6c7fbbff3ff220fb6f3890c680ed5f2d39e2522d6eb599be6cc',
  'factures-fournisseurs': 'c1350cb308e6109dd1eb6684cab746c3b4fc2386852c25aaec372e8321bde386',
  'rapprochement-bancaire': '339194141306fddf5e0c140e41859e061de827b69f26ddd1df77a3be490e081d',
  'notes-de-frais': '013df44c006186268aec934950ce6c2f86b5e02e222a0ea6d2e986c66fc1ee76',
  'facture-electronique': '70ac85abb0cc5377e74d88e4a869cf31465002793c0c2f4d9aee972347a9cb70',
  paie: 'c176251e826815307b9e54c649becd4a0a668092f12c730436a672115abacd88',
  'bulletins-controle': '19b596fd2594ecfa0ecdc8e523cd3ffb4951893ef6012530b474a44ed770b0c5',
  'entrees-sorties-salaries': '6392eb7773562c5e0f878f41793e3cffeb1fa1317a97413cc7deedb7689605b4',
  'secretariat-juridique': 'c57631c052c2416469307a9293c05c1ae7155130a17eeaea601f2d261a62584f',
  'registres-obligations': '90ce114257421f36d114e5a5204620bf4cae7ab6057f3ff6e0c442a6ab5901d8',
  'evaluation-transmission': '2ce7588162ffd616ce0e48708acd82e8127d0734c517cb221b90b0f1e1db74d1',
  'circularisation-cac': '4e58aef26f2455ef0982f5bf6ea5bd4b88b0463b30156ed7c5080e3be47d9b6c',
};
const ORIGINAL_GUIDE_HASHES = {
  'rapprochement-bancaire-sage': 'a24559e75279a8e2a8c1f9ed5ce2e8c85f183cbc49ac116522cbe512b8507c07',
  'lettrage-sage': 'c8117d7b238bb197c0f207da5b9de3a124f08ee1e5a4eadb2a7376b54f2aaf3c',
  'dsn-sage': 'd993100d82a0179e99427843f90bad4987ff5cf593f8f3ae2a21ac9c2db488d3',
  'bulletin-de-paie-sage': 'c3c052b06ed838130352e30c2f01390b93877a1703941ae3b87dffedeb58d7e2',
  'saisie-comptable-sage': 'f2814c06f4be2733520f24133c82b46db77fec1f274b8b9e7c12f5a60b412b33',
  'cloture-sage': '8cc6e1db90f819300ba9aa6d5e0b9e5990ab0818b3032283a29de20ee9725ea3',
  'lettrage-cegid': 'd64d80353addfac90f5edc8c36d0b7a95c902918d5885666cabbd022a365264a',
  'dsn-silae': 'f71005f7c2a1de78a205a795fb6a459bd63917aaa169b7744392ed40f41b6832',
  'bulletin-de-paie-silae': '70a90474900418b1d30bf39422dec4b268bb8b5cf1e5cb44218abd7e32a17b43',
  'export-fec-ebp': '2ac783e9da02d16de058833e9d3b6df4d62236188643a54e0ff2138fc6d570ab',
  'lettrage-ebp': '877dc138ff02c5cbfbf23d6acdd2eec6660cfd346d97cce125fc8e8dffe1f0e8',
  'cloture-ebp': '0194e189d4a7fd15bd5ba0f4fef0b1004c7a7c6f1449af4f01f15aa875eed04a',
};

/** Oracle indépendant : contrat métier des 24 retraits, pas seulement la syntaxe du validateur. */
function assertCoverage(value) {
  verifierDecisionMigration(value);
  assert.equal(value.routes.length, 24, '24 anciennes surfaces exactement');
  assert.equal(value.routes.filter(row => row.type === 'service').length, 12, '12 services');
  assert.equal(value.routes.filter(row => row.type === 'guide').length, 12, '12 guides');
  assert.deepEqual(Object.fromEntries(value.routes.map(row => [row.from, row.to])), EXPECTED, 'chaque intention garde une destination pertinente');
  for (const robot of ROBOTS) assert.ok(!value.routes.some(row => row.from === `/automatisation/${robot.slug}`), `${robot.slug} : le robot reste actif`);
}

function assertArchives(value) {
  for (const row of value.routes) {
    if (row.type === 'service') {
      const slug = row.from.split('/').at(-1);
      assert.equal(row.archive?.path, `commercial/recettes/${slug}/recette.json`, 'la recette du service exact');
      assert.match(row.archive?.sha256 ?? '', /^[a-f0-9]{64}$/);
      assert.equal(row.archive.sha256, ORIGINAL_SERVICE_HASHES[slug], `${row.from} : empreinte antérieure figée`);
      assert.equal(sha256(readFileSync(resolve(ROOT, row.archive.path))), row.archive.sha256, `${row.from} : octets de recette conservés`);
    } else {
      const guide = INTEGRATIONS_ARCHIVEES.find(entry => `/integrations/${entry.slug}` === row.from);
      assert.ok(guide, `${row.from} : définition historique conservée`);
      assert.equal(row.archive?.definitionSha256, ORIGINAL_GUIDE_HASHES[guide.slug], `${row.from} : empreinte de guide antérieure figée`);
      assert.equal(sha256(JSON.stringify(guide)), row.archive?.definitionSha256, `${row.from} : définition intégrale inchangée`);
    }
  }
}

test('migration : décision explicite unique, 12 services et 12 guides, les 21 robots restent actifs', () => {
  assert.deepEqual(decision, sourceJson('config/migration-catalogues.json'));
  assert.deepEqual(decisionAstro, decision, 'le chargement SSR Vite/Astro conserve la décision Node');
  assert.equal(verifierDecisionMigration(decision), decision);
  assert.equal(ROBOTS.length, 21);
  assertCoverage(decision);
  assert.deepEqual([...ROUTES_RETIREES].sort(), Object.keys(EXPECTED).sort());
  assert.equal(INTEGRATIONS_ARCHIVEES.length, 12);
  assert.equal(INTEGRATIONS_INDEXABLES.length, 0, 'les définitions historiques ne créent plus de guide public');
});

test('migration : recettes et définitions archivées conservent toutes leurs empreintes', () => {
  assertArchives(decision);
});

test('migration : aucune chaîne, boucle, destination retirée ou joker de routage', () => {
  const from = new Set(decision.routes.map(row => row.from));
  for (const row of decision.routes) {
    const target = new URL(row.to, 'https://memlia.fr');
    assert.equal(target.origin, 'https://memlia.fr');
    assert.ok(!from.has(target.pathname), `${row.from} ne conduit pas à une seconde ancienne route`);
    assert.ok(!/[?*:]/.test(row.from), 'retrait exact, sans joker ni paramètre');
    assert.equal(row.type === 'guide', row.from.startsWith('/integrations/'));
    assert.ok(row.reason.length >= 30);
  }
});

test('migration : résolution contextuelle, inconnus et liens externes préservés', () => {
  for (const row of decision.routes) {
    assert.equal(destinationActuelle(row.from), row.to);
    assert.equal(destinationActuelle(`${row.from}/`), row.to);
    assert.equal(destinationActuelle(`${row.from}?ancien=1#ancien`), row.to, 'seule la destination convenue est conservée');
    assert.equal(estRouteRetiree(row.from), true);
    assert.equal(estRouteRetiree(`${row.from}/`), true);
  }
  for (const value of ['/automatisation/cfe', '/integrations', '/agents-ia/comptabilite', '/automatisation/inconnu', 'https://memlia.fr/automatisation/paie', 'https://exemple.fr/automatisation/paie', '//exemple.fr/automatisation/paie', 'mailto:contact@memlia.fr', '#regle', null]) assert.equal(destinationActuelle(value), value);
  for (const value of ['/automatisation/cfe', '/automatisation/inconnu', '/integrations', '/integrations/bulletin-de-paie-sage-supplement']) assert.equal(estRouteRetiree(value), false);
});

test('migration : _redirects versionné correspond au bloc généré, 96 variantes exactes et Markdown sans fragment', () => {
  const redirects = readFileSync(resolve(ROOT, 'public/_redirects'), 'utf8');
  const marker = '# Migration catalogues — décision Kevin du 15 octobre 2026\n';
  assert.equal(redirects.split(marker).length, 2, 'un seul bloc de migration');
  assert.equal(`${marker}${redirects.split(marker)[1]}`, blocRedirections());
  const lines = blocRedirections().split('\n').filter(line => line.startsWith('/'));
  assert.equal(lines.length, 96);
  const rules = new Map(lines.map(line => {
    const [from, to, status, extra] = line.split(/\s+/);
    assert.equal(status, '301'); assert.equal(extra, undefined);
    return [from, to];
  }));
  assert.equal(rules.size, 96, 'aucune source dupliquée');
  for (const row of decision.routes) {
    for (const variant of [row.from, `${row.from}/`, `${row.from}.html`]) assert.equal(rules.get(variant), row.to, variant);
    const markdown = rules.get(`/markdown${row.from}.md`);
    assert.equal(markdown, `/markdown${row.to.split('#')[0]}.md`);
    assert.ok(!markdown.includes('#'), 'le texte possède une destination de page, pas une ancre HTML');
  }
  assert.match(redirects, /^\/automatisation\/ \/automatisation-cabinet-comptable 308$/m, 'alias historique du hub conservé');
  assert.ok(!lines.some(line => /^\/automatisation\/\*/.test(line)), 'aucun joker absorbant le catalogue des robots');
});

const syntaxMutants = [
  ['destination hors catalogue', value => { value.routes[0].to = '/robot-invente'; }],
  ['destination externe', value => { value.routes[0].to = 'https://exemple.fr/agents-ia/comptabilite'; }],
  ['destination protocole relatif', value => { value.routes[0].to = '//exemple.fr/integrations'; }],
  ['source dupliquée', value => { value.routes[1].from = value.routes[0].from; }],
  ['source joker', value => { value.routes[0].from = '/automatisation/*'; }],
  ['source paramétrée', value => { value.routes[0].from = '/automatisation/:slug'; }],
  ['source absente', value => { delete value.routes[0].from; }],
  ['destination absente', value => { delete value.routes[0].to; }],
  ['auto-boucle', value => { value.routes[0].to = value.routes[0].from; }],
  ['chaîne vers un retrait', value => { value.routes[0].to = value.routes[1].from; }],
  ['validation humaine absente', value => { value.authorizedBy = ''; }],
  ['statut temporaire', value => { value.redirectStatus = 302; }],
];
for (const [label, mutate] of syntaxMutants) test(`migration MUTANT syntaxe : ${label}`, () => {
  const value = structuredClone(decision); mutate(value);
  assert.throws(() => verifierDecisionMigration(value), /migration|route|Destination|Chaîne|Justification/i);
  assert.throws(() => blocRedirections(value), /migration|route|Destination|Chaîne|Justification/i);
});

const coverageMutants = [
  ['une ancienne page omise', value => { value.routes.pop(); }],
  ['paie conduite vers une fiche sans rapport', value => { value.routes.find(row => row.from === '/automatisation/paie').to = '/agents-ia/communication'; }],
  ['guide Sage redirigé vers un autre éditeur', value => { value.routes.find(row => row.from === '/integrations/lettrage-sage').to = '/integrations#silae'; }],
  ['nouveau robot retiré à la place d’un service', value => { value.routes[0].from = '/automatisation/cfe'; }],
  ['ancienne définition guide étiquetée service', value => { value.routes.at(-1).type = 'service'; }],
];
for (const [label, mutate] of coverageMutants) test(`migration MUTANT couverture métier : ${label}`, () => {
  const value = structuredClone(decision); mutate(value);
  assert.throws(() => assertCoverage(value));
});

const archiveMutants = [
  ['recette attendue déplacée ou absente', value => { value.routes[0].archive.path = 'commercial/recettes/source-manquante/recette.json'; }],
  ['empreinte de recette changée', value => { value.routes[0].archive.sha256 = '0'.repeat(64); }],
  ['empreinte de guide changée', value => { value.routes.find(row => row.type === 'guide').archive.definitionSha256 = '0'.repeat(64); }],
  ['archive absente', value => { delete value.routes[0].archive; }],
];
for (const [label, mutate] of archiveMutants) test(`migration MUTANT conservation : ${label}`, () => {
  const value = structuredClone(decision); mutate(value);
  assert.throws(() => assertArchives(value));
});

test('migration : réponse permanente GET et HEAD pour chaque ancienne route et ses variantes', async () => {
  for (const row of decision.routes) for (const method of ['GET', 'HEAD']) for (const suffix of ['', '/', '.html']) {
    const request = new Request(`https://preview-memlia.pages.dev${row.from}${suffix}?ancien=1`, { method });
    const response = reponseMigration(request);
    assert.ok(response instanceof Response, `${method} ${row.from}${suffix}`);
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('Location'), `https://preview-memlia.pages.dev${row.to}`, 'reste sur la prévisualisation consultée');
    assert.equal(await response.text(), '', 'aucun ancien contenu servi');
    assert.match(response.headers.get('Cache-Control'), /max-age=3600/);
  }
  assert.equal(reponseMigration(new Request('https://memlia.fr/automatisation/cfe')), null);
  assert.equal(reponseMigration(new Request('https://memlia.fr/integrations/inconnu')), null);
});

test('migration : les deux Pages Functions redirigent avant de lire un ancien asset', async () => {
  for (const row of decision.routes) for (const method of ['GET', 'HEAD']) {
    const handler = row.type === 'service' ? (method === 'GET' ? robotGet : robotHead) : (method === 'GET' ? guideGet : guideHead);
    let nextCalls = 0;
    const response = await handler({
      request: new Request(`https://memlia.fr${row.from}`, { method }),
      params: { slug: row.from.split('/').at(-1) },
      next: async () => { nextCalls++; return new Response('Ancien contenu à ne plus servir'); },
    });
    assert.equal(response.status, 301, `${method} ${row.from}`);
    assert.equal(response.headers.get('Location'), `https://memlia.fr${row.to}`);
    assert.equal(nextCalls, 0, 'ni ancien HTML ni ancien guide ne sont relus');
    assert.equal(await response.text(), '');
  }
});

test('migration : les 21 robots gardent leur démonstration, CSP sans réseau et comportement HEAD', async () => {
  const previous = globalThis.HTMLRewriter;
  globalThis.HTMLRewriter = class { on() { return this; } transform(response) { return response; } };
  try {
    for (const robot of ROBOTS) for (const method of ['GET', 'HEAD']) {
      let nextCalls = 0;
      const response = await (method === 'GET' ? robotGet : robotHead)({
        request: new Request(`https://preview-memlia.pages.dev/automatisation/${robot.slug}`, { method }),
        params: { slug: robot.slug },
        next: async request => { nextCalls++; assert.equal(request.method, 'GET'); return new Response(`Dossier fictif ${robot.slug}`, { headers: { 'Content-Type': 'text/html', ETag: 'ancien' } }); },
      });
      assert.equal(response.status, 200, `${method} ${robot.slug}`);
      assert.equal(response.headers.get('Location'), null);
      assert.match(response.headers.get('Content-Security-Policy'), /connect-src 'none'/);
      assert.match(response.headers.get('Cache-Control'), /no-transform/);
      assert.equal(response.headers.get('ETag'), null);
      assert.equal(await response.text(), method === 'HEAD' ? '' : `Dossier fictif ${robot.slug}`);
      assert.equal(nextCalls, 1);
    }
  } finally {
    if (previous === undefined) delete globalThis.HTMLRewriter;
    else globalThis.HTMLRewriter = previous;
  }
});

test('migration : une route inconnue reste la vraie réponse 404, sans redirection générique', async () => {
  for (const [base, get, head] of [['/automatisation', robotGet, robotHead], ['/integrations', guideGet, guideHead]]) for (const method of ['GET', 'HEAD']) {
    const original = new Response(method === 'HEAD' ? null : 'Introuvable', { status: 404, headers: { 'Content-Type': 'text/html' } });
    let nextCalls = 0;
    const result = await (method === 'GET' ? get : head)({
      request: new Request(`https://memlia.fr${base}/ancien-inconnu`, { method }),
      params: { slug: 'ancien-inconnu' },
      next: async () => { nextCalls++; return original; },
    });
    assert.equal(result, original);
    assert.equal(result.status, 404);
    assert.equal(result.headers.get('Location'), null);
    assert.equal(nextCalls, 1);
  }
});
