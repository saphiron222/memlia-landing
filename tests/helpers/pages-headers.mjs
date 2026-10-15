/**
 * Lecture d'un fichier `_headers` de Cloudflare Pages et d'une Content-Security-Policy.
 *
 * Un chemin non indenté ouvre un bloc, les lignes indentées qui suivent en sont les en-têtes. Plusieurs blocs
 * peuvent viser la même URL : Pages les cumule, et une valeur posée deux fois est jointe par « , » (donc deux
 * politiques). Les tests de livraison relisent ce cumul au lieu de supposer un bloc unique, pour qu'une CSP
 * dupliquée par un joker et une route exacte se voie.
 */

/** Les blocs `{ chemin, entetes: [[nom, valeur], …] }` du fichier, commentaires et lignes vides ignorés. */
export function lireBlocs(source) {
  const blocs = [];
  for (const ligne of source.split('\n')) {
    if (ligne.trim() === '' || ligne.trimStart().startsWith('#')) continue;
    if (/^\S/.test(ligne)) {
      blocs.push({ chemin: ligne.trim(), entetes: [] });
      continue;
    }
    const bloc = blocs.at(-1);
    if (!bloc) throw new Error(`_headers : en-tête sans chemin avant « ${ligne.trim()} »`);
    const deuxPoints = ligne.indexOf(':');
    if (deuxPoints < 0) throw new Error(`_headers : ligne sans « : » dans le bloc ${bloc.chemin} : « ${ligne.trim()} »`);
    bloc.entetes.push([ligne.slice(0, deuxPoints).trim(), ligne.slice(deuxPoints + 1).trim()]);
  }
  return blocs;
}

/** Vrai si le chemin du bloc vise la route. `*` couvre tout, `:nom` un segment ; un bloc d'hôte ne vise aucune route. */
export function viseLaRoute(chemin, route) {
  if (!chemin.startsWith('/')) return false;
  const motif = chemin.split(/(\*|:[A-Za-z_]\w*)/).map((morceau) => {
    if (morceau === '*') return '.*';
    if (/^:[A-Za-z_]\w*$/.test(morceau)) return '[^/]+';
    return morceau.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  }).join('');
  return new RegExp(`^${motif}$`).test(route);
}

/** Les valeurs de chaque en-tête (nom en minuscules) que Pages poserait sur la route, une entrée par bloc qui le pose. */
export function entetesDe(blocs, route) {
  const cumul = new Map();
  for (const bloc of blocs.filter(({ chemin }) => viseLaRoute(chemin, route))) {
    for (const [nom, valeur] of bloc.entetes) {
      const cle = nom.toLowerCase();
      cumul.set(cle, [...(cumul.get(cle) ?? []), valeur]);
    }
  }
  return cumul;
}

/** Les directives d'une CSP : `{ 'script-src': ["'self'"], … }`. Une directive répétée est une erreur (le navigateur ignore la seconde). */
export function analyserCsp(csp) {
  const directives = {};
  for (const morceau of csp.split(';').map((m) => m.trim()).filter(Boolean)) {
    const [nom, ...sources] = morceau.split(/\s+/);
    if (nom in directives) throw new Error(`CSP : directive « ${nom} » répétée`);
    directives[nom] = sources;
  }
  return directives;
}
