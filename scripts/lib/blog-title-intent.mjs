const MOTS_FAIBLES = new Set([
  'avant', 'avec', 'cabinet', 'cabinet comptable', 'comment', 'dans', 'des', 'du', 'elle', 'est',
  'les', 'leur', 'leurs', 'mais', 'methode', 'pour', 'pourquoi', 'que', 'quel', 'quelle', 'sans',
  'sur', 'une', 'votre',
]);

export function normaliserJetons(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('fr')
    .replace(/[’']/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((mot) => mot.length >= 3 && !MOTS_FAIBLES.has(mot));
}

function racineCommune(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
  return i;
}

export function jetonsCompatibles(a, b) {
  if (a === b) return true;
  if (Math.min(a.length, b.length) <= 3) return false;
  return racineCommune(a, b) >= Math.min(5, a.length, b.length);
}

export function titrePorteRequete(titre, requete) {
  const titreJetons = normaliserJetons(titre);
  const requeteJetons = [...new Set(normaliserJetons(requete))];
  if (requeteJetons.length === 0) return false;
  const correspondances = requeteJetons.filter((mot) => titreJetons.some((titreMot) => jetonsCompatibles(mot, titreMot)));
  const minimum = requeteJetons.length === 1 ? 1 : 2;
  return correspondances.length >= minimum && correspondances.length / requeteJetons.length >= 0.5;
}

export function titrePorteUneRequeteMesuree(titre, requetes, autocompletion) {
  return requetes
    .filter((requete) => Object.hasOwn(autocompletion, requete))
    .some((requete) => titrePorteRequete(titre, requete));
}
