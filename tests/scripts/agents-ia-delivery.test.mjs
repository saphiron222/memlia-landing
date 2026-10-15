import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { FICHES } from '../../src/data/specialistes.ts';
import { entetesDe, lireBlocs } from '../helpers/pages-headers.mjs';
import { APIS_RESEAU, fermetureDeLaPage, reseauDans, ROUTES, routesConstruites } from '../helpers/agents-ia-livraison.mjs';

/**
 * Livraison des agents IA sans réseau (plan du 15/10/2026, tâche 7 ; annexe I11 ; modèle :
 * local-surfaces-delivery.test.mjs). Trois choses se prouvent ici :
 *   1. une Function par route, exactement celles des données (jamais un segment dynamique) ;
 *   2. chaque Function retire la balise Insights, pose la CSP et laisse passer ce qu'elle ne doit pas toucher ;
 *   3. aucun module chargé par ces pages ne sait émettre une requête.
 * La CSP elle-même, et ce que les pages exigent d'elle, sont jugées dans agents-ia-csp.test.mjs.
 */

const BLOCS = lireBlocs(readFileSync(new URL('../../public/_headers', import.meta.url), 'utf8'));
const CSP_DE_L_ASSET = (route) => entetesDe(BLOCS, route).get('content-security-policy')?.[0];
const fichierFonction = (route) => `functions${route}.js`;
const importerFonction = (route) => import(`../../${fichierFonction(route)}`);

const BALISES = ['https://static.cloudflareinsights.com/beacon.min.js', 'https://static.cloudflareinsights.com/beacon.min.js/v123'];
const TEMOINS = ['/_astro/Nav.astro_astro_type_script_index_0_lang.D6R3Bitl.js', 'https://example.org/beacon.min.js', 'https://static.cloudflareinsights.com.evil.test/beacon.min.js', '/beacon.min.js', 'https://static.cloudflareinsights.com/not-beacon.min.js'];
const CONDITIONNELS = { 'If-None-Match': 'old', 'If-Modified-Since': 'Mon, 05 Oct 2026 12:00:00 GMT', Range: 'bytes=0-10', 'If-Range': 'old' };

/** Le `HTMLRewriter` de Pages n'existe pas sous Node : un double qui joue l'élément `script[src]` de chaque URL. */
async function avecHtmlRewriter(corps) {
  const avant = globalThis.HTMLRewriter;
  const retirees = [];
  globalThis.HTMLRewriter = class {
    on(selecteur, gestionnaire) {
      assert.equal(selecteur, 'script[src]');
      for (const src of [...BALISES, ...TEMOINS]) gestionnaire.element({ getAttribute: () => src, remove: () => retirees.push(src) });
      return this;
    }
    transform(reponse) { return reponse; }
  };
  try { return await corps(retirees); } finally {
    if (avant === undefined) delete globalThis.HTMLRewriter;
    else globalThis.HTMLRewriter = avant;
  }
}

test('une Function par route : le hub et exactement les fiches des données, un fichier explicite chacune', () => {
  assert.ok(existsSync(fichierFonction('/agents-ia')), 'functions/agents-ia.js (le hub)');
  const slugs = FICHES.map((fiche) => fiche.slug).sort();
  assert.equal(slugs.length, 9, 'neuf fiches dans les données');
  const fichiers = readdirSync('functions/agents-ia', { withFileTypes: true });
  assert.deepEqual(fichiers.filter((f) => !f.isFile()).map((f) => f.name), [], 'aucun sous-dossier');
  assert.deepEqual(fichiers.map((f) => f.name).sort(), slugs.map((slug) => `${slug}.js`), 'les Functions sont exactement les slugs de FICHES : ni manque, ni surplus, ni [slug].js');
  assert.deepEqual(ROUTES.map(fichierFonction).filter((f) => !existsSync(f)), []);
});

test('chaque Function : GET et HEAD complets, balise Insights retirée, CSP posée par la Function elle-même', async () => {
  await avecHtmlRewriter(async (retirees) => {
    for (const route of ROUTES) {
      const attendue = CSP_DE_L_ASSET(route);
      assert.ok(attendue, `${route} : _headers pose une CSP (sinon rien à comparer)`);
      const gestionnaires = await importerFonction(route);
      assert.equal(gestionnaires.onRequestPost, undefined, `${route} : le filtre ne traite pas les saisies POST`);
      // Pages ne rejoue pas `_headers` sur la réponse d'une Function : l'asset arrive nu, ou avec une CSP qui n'est pas la nôtre.
      for (const [asset, entetesAsset] of [['sans CSP', {}], ['avec une CSP plus large', { 'Content-Security-Policy': "default-src *; script-src 'unsafe-inline' https:" }]]) {
        for (const methode of ['GET', 'HEAD']) {
          retirees.length = 0;
          const reponse = await gestionnaires[methode === 'GET' ? 'onRequestGet' : 'onRequestHead']({
            request: new Request(`https://memlia.fr${route}`, { method: methode, headers: CONDITIONNELS }),
            next: async (requeteAsset) => {
              assert.equal(requeteAsset.method, 'GET');
              for (const entete of Object.keys(CONDITIONNELS)) assert.equal(requeteAsset.headers.get(entete), null, `${route} : ${entete} ne doit pas atteindre l'asset`);
              return new Response('full html', { headers: { 'Content-Type': 'text/html', ETag: 'old', 'Last-Modified': 'old', 'Content-Length': '9', ...entetesAsset } });
            },
          });
          const quoi = `${route} ${methode} (asset ${asset})`;
          assert.deepEqual(retirees, BALISES, `${quoi} : exactement les deux balises Insights, aucun script voisin`);
          assert.equal(reponse.status, 200, quoi);
          assert.equal(reponse.headers.get('Content-Security-Policy'), attendue, `${quoi} : la CSP de la Function est celle de _headers`);
          assert.match(reponse.headers.get('Cache-Control'), /no-transform/, quoi);
          for (const entete of ['ETag', 'Last-Modified', 'Content-Length']) assert.equal(reponse.headers.get(entete), null, `${quoi} : ${entete}`);
          assert.equal(await reponse.text(), methode === 'GET' ? 'full html' : '', quoi);
        }
      }
    }
  });
});

test('chaque Function laisse passer sans y toucher ce qui n’est pas sa page : 404 d’une fiche non construite, redirection, asset non HTML', async () => {
  for (const route of ROUTES) {
    const gestionnaires = await importerFonction(route);
    const cas = [
      ['404 (asset non construit)', new Response('<h1>introuvable</h1>', { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } })],
      ['301', new Response(null, { status: 301, headers: { Location: '/agents-ia' } })],
      ['asset non HTML', new Response('asset', { headers: { 'Content-Type': 'text/plain' } })],
    ];
    for (const [nom, reponse] of cas) {
      const corps = await reponse.clone().text();
      const resultat = await gestionnaires.onRequestGet({ request: new Request(`https://memlia.fr${route}`), next: async () => reponse });
      const quoi = `${route} : ${nom}`;
      assert.equal(resultat.status, reponse.status, quoi);
      assert.equal(resultat.headers.get('Content-Type'), reponse.headers.get('Content-Type'), quoi);
      assert.equal(resultat.headers.get('Location'), reponse.headers.get('Location'), quoi);
      assert.equal(resultat.headers.get('Content-Security-Policy'), null, `${quoi} : aucune CSP ajoutée à ce que la Function ne filtre pas`);
      assert.doesNotMatch(resultat.headers.get('Cache-Control') ?? '', /no-transform/, quoi);
      assert.equal(await resultat.text(), corps, quoi);
    }
  }
});

test('_headers : no-transform sur chaque route exacte, jamais sur le joker ; une seule CSP par route', () => {
  for (const route of ROUTES) {
    const exact = BLOCS.find(({ chemin }) => chemin === route);
    assert.ok(exact?.entetes.some(([nom, valeur]) => nom === 'Cache-Control' && /no-transform/.test(valeur)), `${route} : Cache-Control no-transform sur la route exacte`);
    assert.equal(entetesDe(BLOCS, route).get('content-security-policy')?.length, 1, `${route} : exactement une CSP cumulée (deux se joignent en deux politiques)`);
  }
  const joker = BLOCS.find(({ chemin }) => chemin === '/agents-ia/*');
  assert.ok(joker, '/agents-ia/* porte la CSP des fiches pas encore nommées');
  assert.ok(!joker.entetes.some(([, valeur]) => valeur.includes('no-transform')), '/agents-ia/* : aucune extension globale de no-transform');
});

/** Les pages dont les modules sont lus : toutes celles de `dist`, plancher compris (le hub et la fiche pilote). */
const PAGES = routesConstruites();

test('les pages construites : le hub et la fiche pilote y sont (sinon les contrôles suivants ne lisent rien)', () => {
  assert.ok(PAGES.includes('/agents-ia'), 'dist/agents-ia.html : lancer npm run build:site');
  assert.ok(PAGES.includes('/agents-ia/comptabilite'), 'dist/agents-ia/comptabilite.html');
});

test('aucun module chargé par /agents-ia/* ne contient fetch, XMLHttpRequest, WebSocket, sendBeacon, EventSource ni importScripts', () => {
  for (const route of PAGES) {
    const modules = fermetureDeLaPage(readFileSync(`dist${route}.html`, 'utf8'));
    // Un scanner qui ne lit rien rendrait « 0 » : la page charge au moins la navigation, le pied et le script de base.
    for (const prefixe of ['Nav.astro_astro_type_script', 'Footer.astro_astro_type_script', 'Base.astro_astro_type_script']) {
      assert.ok([...modules.keys()].some((url) => url.includes(prefixe)), `${route} : le module ${prefixe} est lu`);
    }
    const trouves = [...modules].flatMap(([url, code]) => reseauDans(code).map((api) => `${url} : ${api}`));
    assert.deepEqual(trouves, [], `${route} : un module sait émettre une requête`);
  }
});

test('le scanner voit chaque API réseau, sous ses formes minifiées, et laisse passer le code de la page', () => {
  const MUTANTS = {
    fetch: ['fetch("/x")', 'window.fetch(u)', 'let f=fetch;f(u)', 'globalThis["fetch"](u)'],
    XMLHttpRequest: ['new XMLHttpRequest'],
    WebSocket: ['new WebSocket("wss://x")'],
    sendBeacon: ['navigator.sendBeacon(u,d)'],
    EventSource: ['new EventSource(u)'],
    importScripts: ['importScripts("/x.js")'],
  };
  assert.deepEqual(Object.keys(MUTANTS).sort(), APIS_RESEAU.map(([nom]) => nom).sort(), 'chaque API de la liste a son mutant');
  // Le mutant « fetch ajouté à un composant » : chaque extrait collé au bout d'un module neutre, que l'instrument doit désigner seul.
  const neutre = 'document.querySelectorAll(`[data-faq] details`).forEach(e=>{e.open=!1});';
  assert.deepEqual(reseauDans(neutre), []);
  for (const [api, extraits] of Object.entries(MUTANTS)) {
    for (const extrait of extraits) assert.deepEqual(reseauDans(`${neutre};${extrait}`), [api], `${api} : ${extrait}`);
  }
  for (const innocent of ['link.rel="prefetch"', 'img.fetchPriority="high"', 'el.setAttribute("fetchpriority","low")', 'const refetched=1', 'new IntersectionObserver(cb)']) {
    assert.deepEqual(reseauDans(innocent), [], innocent);
  }
});
