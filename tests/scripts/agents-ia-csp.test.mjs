import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { analyserCsp, entetesDe, lireBlocs } from '../helpers/pages-headers.mjs';
import { analyserPage, estExecutable, ROUTES, routesConstruites, scriptsExecutables } from '../helpers/agents-ia-livraison.mjs';

/**
 * La CSP des agents IA (plan du 15/10/2026, tâche 7 ; annexe I11 ; modèle : contact-chrome-csp.test.mjs).
 * `connect-src 'none'` et `script-src 'self'` : le rejeu et la démonstration ne font aucune requête, et aucun script
 * ne s'exécute s'il n'est pas un fichier de l'origine. Ce fichier juge la politique et ce que les pages construites
 * lui demandent ; que la Function la pose, et qu'aucun module ne sache émettre de requête, se juge dans
 * agents-ia-delivery.test.mjs ; le navigateur la fait respecter dans agents-ia-sans-reseau.spec.ts.
 */

const BLOCS = lireBlocs(readFileSync(new URL('../../public/_headers', import.meta.url), 'utf8'));
const cspDe = (route) => entetesDe(BLOCS, route).get('content-security-policy')?.[0];

test('la CSP des agents IA : réseau fermé, scripts de l’origine seulement, aucune ouverture sur un tiers', () => {
  for (const route of ROUTES) {
    const csp = cspDe(route);
    assert.ok(csp, `${route} : une CSP dans _headers`);
    const d = analyserCsp(csp);
    assert.deepEqual(d['default-src'], ["'self'"], `${route} : default-src`);
    assert.deepEqual(d['connect-src'], ["'none'"], `${route} : connect-src 'none' (aucune requête, ni fetch, ni XHR, ni socket, ni balise)`);
    assert.deepEqual(d['script-src'], ["'self'"], `${route} : script-src 'self' seul (ni unsafe-inline, ni unsafe-eval, ni hôte tiers)`);
    assert.deepEqual(d['object-src'], ["'none'"], route);
    assert.deepEqual(d['base-uri'], ["'self'"], route);
    assert.deepEqual(d['frame-ancestors'], ["'none'"], route);
    assert.deepEqual(d['form-action'], ["'self'"], route);
    assert.deepEqual(d['font-src'], ["'self'"], `${route} : polices de /fonts`);
    assert.deepEqual(d['img-src'], ["'self'"], `${route} : images de l'origine ; ni data:, ni blob:, ni tiers`);
    for (const [directive, sources] of Object.entries(d)) {
      assert.ok(!sources.some((s) => /^(?:https?:|wss?:|\*|\/\/)/.test(s) || s.includes('://')), `${route} : ${directive} n'ouvre aucun hôte (${sources.join(' ')})`);
      if (directive !== 'style-src') assert.ok(!sources.includes("'unsafe-inline'"), `${route} : ${directive} sans unsafe-inline`);
      assert.ok(!sources.includes("'unsafe-eval'"), `${route} : ${directive} sans unsafe-eval`);
    }
  }
});

test('la CSP du hub, du joker et des fiches est une seule et même politique', () => {
  const politiques = new Set(ROUTES.map(cspDe));
  assert.ok([...politiques].every((csp) => typeof csp === 'string' && csp !== ''), 'chaque route a une CSP (undefined == undefined ne prouve rien)');
  assert.equal(politiques.size, 1, `une politique par route : ${[...politiques].join(' | ')}`);
  assert.equal(cspDe('/agents-ia/une-fiche-pas-encore-nommee'), [...politiques][0], '/agents-ia/* couvre une fiche que la liste ne nomme pas encore');
});

test('la CSP posée par les Functions est mot pour mot celle de _headers', async () => {
  globalThis.HTMLRewriter = class { on() { return this; } transform(reponse) { return reponse; } };
  try {
    for (const route of ROUTES) {
      const { onRequestGet } = await import(`../../functions${route}.js`);
      const reponse = await onRequestGet({ request: new Request(`https://memlia.fr${route}`), next: async () => new Response('html', { headers: { 'Content-Type': 'text/html' } }) });
      assert.equal(reponse.headers.get('Content-Security-Policy'), cspDe(route), route);
    }
  } finally { delete globalThis.HTMLRewriter; }
});

const PAGES = routesConstruites();
const politique = () => analyserCsp(cspDe('/agents-ia'));

test('les pages construites tiennent sous cette CSP : aucun script inline exécutable, aucun gestionnaire inline, aucune URL hors origine', () => {
  assert.ok(PAGES.includes('/agents-ia') && PAGES.includes('/agents-ia/comptabilite'), `pages lues : ${PAGES.join(', ')} (npm run build:site d'abord)`);
  for (const route of PAGES) {
    const html = readFileSync(`dist${route}.html`, 'utf8');
    assert.deepEqual(analyserPage(html, politique()), [], route);
    const executables = scriptsExecutables(html);
    assert.ok(executables.length >= 3, `${route} : navigation, pied et script de base présents (${executables.length})`);
    for (const script of executables) assert.match(script.attrs.src ?? '', /^\/_astro\/.+\.js$/, `${route} : chaque script exécutable est un fichier de /_astro`);
  }
});

test('le 404 que sert /agents-ia/* pour une fiche pas encore construite tient lui aussi sous la CSP du joker', () => {
  // Pages rejoue `_headers` sur la réponse d'un asset, 404.html compris (mesuré sous wrangler pages dev) : le hub
  // lie des fiches que la tâche 9 n'a pas encore construites, leur visiteur lit cette page sous cette politique.
  assert.deepEqual(analyserPage(readFileSync('dist/404.html', 'utf8'), analyserCsp(cspDe('/agents-ia/finance'))), []);
});

test('les pages construites n’ont pour seul bloc inline que leurs données JSON-LD, et il ne s’exécute pas', () => {
  for (const route of PAGES) {
    const html = readFileSync(`dist${route}.html`, 'utf8');
    const blocs = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].filter(([balise, contenu]) => !/\bsrc=/.test(balise) && contenu.trim());
    assert.ok(blocs.length >= 1, `${route} : au moins le JSON-LD`);
    for (const [balise, contenu] of blocs) {
      assert.match(balise, /type="application\/ld\+json"/, `${route} : tout bloc inline est du JSON-LD`);
      assert.ok(!estExecutable({ attrs: { type: 'application/ld+json' } }));
      JSON.parse(contenu);
    }
  }
});

test('le contrôleur de pages voit chaque défaut qu’une CSP sans réseau doit refuser, et laisse passer une page propre', () => {
  const entete = '<!doctype html><html lang="fr"><head><title>t</title></head><body>';
  const propre = `${entete}<img src="/agents/a.webp" alt=""><script type="module" src="/_astro/a.js"></script><script type="application/ld+json">{"a":1}</script></body></html>`;
  assert.deepEqual(analyserPage(propre, politique()), []);
  const POLITIQUE = politique();
  const MUTANTS = {
    'script inline': `${entete}<script>fetch('/x')</script></body></html>`,
    'script inline de type module': `${entete}<script type="module">fetch('/x')</script></body></html>`,
    'script chargé hors origine': `${entete}<script src="https://cdn.example/x.js"></script></body></html>`,
    'script protocole-relatif': `${entete}<script src="//cdn.example/x.js"></script></body></html>`,
    'gestionnaire inline': `${entete}<button onclick="go()">x</button></body></html>`,
    'URL javascript:': `${entete}<a href="javascript:go()">x</a></body></html>`,
    'balise Insights': `${entete}<script defer src="https://static.cloudflareinsights.com/beacon.min.js"></script></body></html>`,
    'image hors origine': `${entete}<img src="https://tiers.example/p.png" alt=""></body></html>`,
    'image data:': `${entete}<img src="data:image/gif;base64,R0lGOD" alt=""></body></html>`,
    'srcset hors origine': `${entete}<picture><source srcset="/a.webp 1x, https://tiers.example/b.webp 2x"></picture></body></html>`,
    'police hors origine': `${entete}<style>@font-face{font-family:x;src:url(https://fonts.example/x.woff2)}</style></body></html>`,
    'image de fond hors origine': `${entete}<div style="background:url(https://tiers.example/p.png)"></div></body></html>`,
    '@import': `${entete}<style>@import "https://fonts.example/x.css";</style></body></html>`,
    'feuille de style tierce': `${entete}<link rel="stylesheet" href="https://fonts.example/x.css"></body></html>`,
    'préconnexion': `${entete}<link rel="preconnect" href="https://tiers.example"></body></html>`,
    'iframe': `${entete}<iframe src="https://tiers.example"></iframe></body></html>`,
    'formulaire vers un tiers': `${entete}<form action="https://tiers.example/post"></form></body></html>`,
    'JSON-LD cassé': `${entete}<script type="application/ld+json">{oops</script></body></html>`,
  };
  for (const [nom, html] of Object.entries(MUTANTS)) assert.notDeepEqual(analyserPage(html, POLITIQUE), [], `mutant non vu : ${nom}`);
  // Les `<style>` inline exigent unsafe-inline dans style-src : sans lui, le contrôleur le dit.
  assert.notDeepEqual(analyserPage(`${entete}<style>a{color:red}</style></body></html>`, { ...POLITIQUE, 'style-src': ["'self'"] }), []);
});
