/**
 * Instruments des contrôles de livraison des agents IA (plan du 15/10/2026, tâche 7 ; annexe I11).
 *
 * Deux questions, deux instruments : ce que la page charge (`fermetureDeLaPage`, `reseauDans`) et ce que la CSP
 * en permettrait (`analyserPage`). Chacun est éprouvé sur des témoins dans les tests : un instrument qui ne voit rien
 * rendrait « 0 défaut » sur n'importe quelle page.
 */
import { existsSync, readFileSync } from 'node:fs';
import { posix } from 'node:path';
import { parse } from 'parse5';
import { FICHES, HUB } from '../../src/data/specialistes.ts';

/** Le hub, puis une route par fiche des données (publiée ou non : la Function existe avant la page). */
export const ROUTES = [HUB.chemin, ...FICHES.map((fiche) => `/agents-ia/${fiche.slug}`)];

/** Les routes dont la page est dans `dist` (les fiches de la tâche 9 n'y sont pas encore). */
export const routesConstruites = () => ROUTES.filter((route) => existsSync(`dist${route}.html`));

/** Les API qui émettent une requête : une seule suffit à casser `connect-src 'none'`, ou à l'esquiver (balise, socket). */
export const APIS_RESEAU = [
  ['fetch', /\bfetch\b/],
  ['XMLHttpRequest', /\bXMLHttpRequest\b/],
  ['WebSocket', /\bWebSocket\b/],
  ['sendBeacon', /\bsendBeacon\b/],
  ['EventSource', /\bEventSource\b/],
  ['importScripts', /\bimportScripts\b/],
];
export const reseauDans = (code) => APIS_RESEAU.filter(([, motif]) => motif.test(code)).map(([nom]) => nom);

const attributs = (noeud) => Object.fromEntries(noeud.attrs.map(({ name, value }) => [name, value]));
const texte = (noeud) => (noeud.childNodes ?? []).map((enfant) => enfant.value ?? '').join('');

/** Tous les éléments du document, dans l'ordre. */
function elements(html) {
  const trouves = [];
  const visiter = (noeud) => {
    if (noeud.tagName) trouves.push({ balise: noeud.tagName, attrs: attributs(noeud), texte: texte(noeud) });
    for (const enfant of noeud.childNodes ?? []) visiter(enfant);
    if (noeud.content) visiter(noeud.content);
  };
  visiter(parse(html));
  return trouves;
}

/** Un `<script>` est un bloc de données (jamais exécuté, jamais soumis à `script-src`) seulement pour ces types. */
const TYPES_DE_DONNEES = ['application/ld+json', 'application/json'];
export const estExecutable = ({ attrs }) => !TYPES_DE_DONNEES.includes((attrs.type ?? '').trim().toLowerCase());

/** Les scripts exécutables d'une page. */
export const scriptsExecutables = (html) => elements(html).filter((e) => e.balise === 'script' && estExecutable(e));

/**
 * Les modules JavaScript qu'une page charge : ses `<script src>`, puis tout ce que chacun importe (statique,
 * dynamique, Worker), en chemins de `dist`. Un import qui ne se résout pas dans `dist` est une erreur, pas un oubli.
 */
export function fermetureDeLaPage(html) {
  const vus = new Map();
  const aVisiter = scriptsExecutables(html).filter((s) => s.attrs.src).map((s) => s.attrs.src);
  while (aVisiter.length > 0) {
    const url = aVisiter.pop();
    if (vus.has(url)) continue;
    const fichier = `dist${url}`;
    if (!existsSync(fichier)) throw new Error(`module chargé mais absent de dist : ${url}`);
    const code = readFileSync(fichier, 'utf8');
    vus.set(url, code);
    for (const [, specifieur] of code.matchAll(/["'`]((?:\.{1,2}\/|\/)[^"'`\s]*?\.js)["'`]/g)) {
      aVisiter.push(specifieur.startsWith('/') ? specifieur : posix.join(posix.dirname(url), specifieur));
    }
  }
  return vus;
}

const DOSSIER_RACINE = /^\/(?!\/)/;
const EXTENSION_POLICE = /\.(?:woff2?|ttf|otf)(?:[?#].*)?$/i;
/** `link rel` qui déclenchent une requête ; canonical, alternate, sitemap ne chargent rien. */
const REL_CHARGEES = ['stylesheet', 'preload', 'modulepreload', 'prefetch', 'prerender', 'preconnect', 'dns-prefetch', 'icon', 'apple-touch-icon', 'manifest'];
const DIRECTIVE_DU_PRELOAD = { font: 'font-src', image: 'img-src', style: 'style-src', script: 'script-src', fetch: 'connect-src' };

/** La CSP permet-elle cette URL pour cette directive ? Les directives absentes retombent sur `default-src`. */
function permet(csp, directive, url) {
  const sources = csp[directive] ?? csp['default-src'] ?? ['*'];
  if (sources.includes("'none'")) return false;
  if (url.startsWith('data:')) return sources.includes('data:');
  return DOSSIER_RACINE.test(url) && sources.includes("'self'");
}

/** Les URL que le CSS d'un bloc (`<style>` ou attribut `style`) charge, avec leur directive. */
function urlsDuCss(css) {
  const urls = [...css.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/g)].map(([, , url]) => url).filter((url) => !url.startsWith('#'));
  const importees = [...css.matchAll(/@import\s+(?:url\(\s*)?['"]?([^'")\s;]+)/g)].map(([, url]) => url);
  return [
    ...urls.map((url) => [EXTENSION_POLICE.test(url) ? 'font-src' : 'img-src', url]),
    ...importees.map((url) => ['style-src', url]),
  ];
}

/** Les listes `srcset` : une URL par candidat. */
const candidats = (srcset) => srcset.split(',').map((c) => c.trim().split(/\s+/)[0]).filter(Boolean);

/**
 * Ce que la page chargerait ou exécuterait contre une CSP analysée (`analyserCsp`) : la liste de ses défauts, vide
 * si elle tient. Les attributs `on*`, les `javascript:`, les scripts inline et toute URL hors de l'origine en sont.
 */
export function analyserPage(html, csp) {
  const defauts = [];
  const dit = (defaut) => defauts.push(defaut);
  const charge = (directive, url, quoi) => {
    if (!permet(csp, directive, url)) dit(`${quoi} : ${url} refusé par ${directive}`);
  };
  const lignes = elements(html);
  if (/cloudflareinsights/i.test(html)) dit('la page nomme cloudflareinsights');

  for (const e of lignes) {
    for (const [nom, valeur] of Object.entries(e.attrs)) {
      if (/^on/i.test(nom)) dit(`<${e.balise}> porte le gestionnaire inline ${nom}`);
      if (/^\s*javascript:/i.test(valeur)) dit(`<${e.balise} ${nom}> est une URL javascript:`);
      if (nom === 'style') for (const [directive, url] of urlsDuCss(valeur)) charge(directive, url, 'attribut style');
    }
    if (e.balise === 'script') {
      if (estExecutable(e)) {
        if (!e.attrs.src) dit(`script inline exécutable (${e.texte.length} octets) : script-src 'self' le refuse`);
        else charge('script-src', e.attrs.src, '<script src>');
        if (e.attrs.src && e.texte.trim()) dit('script avec src ET contenu inline');
      } else {
        try { JSON.parse(e.texte); } catch { dit(`bloc ${e.attrs.type} qui n'est pas du JSON`); }
      }
    }
    if (e.balise === 'style') {
      if (!(csp['style-src'] ?? csp['default-src'] ?? []).includes("'unsafe-inline'")) dit('<style> inline sans unsafe-inline dans style-src');
      for (const [directive, url] of urlsDuCss(e.texte)) charge(directive, url, '<style>');
    }
    if (e.balise === 'link' && REL_CHARGEES.some((rel) => (e.attrs.rel ?? '').split(/\s+/).includes(rel))) {
      const directive = e.attrs.rel.includes('stylesheet') ? 'style-src' : e.attrs.rel.includes('preload') ? (DIRECTIVE_DU_PRELOAD[e.attrs.as] ?? 'default-src') : e.attrs.rel.includes('modulepreload') ? 'script-src' : e.attrs.rel.includes('preconnect') || e.attrs.rel.includes('dns-prefetch') ? 'connect-src' : e.attrs.rel.includes('manifest') ? 'manifest-src' : 'img-src';
      for (const url of [e.attrs.href, ...candidats(e.attrs.imagesrcset ?? '')].filter(Boolean)) charge(directive, url, `<link rel=${e.attrs.rel}>`);
    }
    if (['img', 'source'].includes(e.balise)) {
      const directive = e.attrs.type?.startsWith('video/') || e.attrs.type?.startsWith('audio/') ? 'media-src' : 'img-src';
      for (const url of [e.attrs.src, ...candidats(e.attrs.srcset ?? '')].filter(Boolean)) charge(directive, url, `<${e.balise}>`);
    }
    if (['video', 'audio'].includes(e.balise)) for (const url of [e.attrs.src, e.attrs.poster].filter(Boolean)) charge('media-src', url, `<${e.balise}>`);
    if (['iframe', 'frame'].includes(e.balise) && e.attrs.src) charge('frame-src', e.attrs.src, `<${e.balise}>`);
    if (['embed', 'object'].includes(e.balise)) charge('object-src', e.attrs.src ?? e.attrs.data ?? '', `<${e.balise}>`);
    if (e.balise === 'form') charge('form-action', e.attrs.action ?? '/', '<form action>');
  }
  return defauts;
}
