/**
 * Système de page, § 2 : dans un titre, un mot composé ne se coupe pas à son trait d'union
 * (« savoir-/faire », « refont-/ils ») et une ponctuation haute ne commence jamais une ligne
 * (« cabinet / : chaque écart ») ; un guillemet ouvrant reste avec le mot qui le suit. Le texte
 * reste identique, caractère pour caractère : seuls ces groupes sont repérés pour être rendus d'un
 * seul tenant.
 */
export interface Segment {
  texte: string;
  insecable: boolean;
}

const MOT = String.raw`[\p{L}\p{N}’']+(?:-[\p{L}\p{N}’']+)*`;
const ESPACE = String.raw`[   ]+`;
const GROUPE_INSECABLE = new RegExp(
  [
    `${MOT}${ESPACE}[:;!?»]`, // le mot et la ponctuation haute qui le suit
    `«${ESPACE}${MOT}`, // le guillemet ouvrant et le mot qui le suit
    String.raw`[\p{L}\p{N}’']+(?:-[\p{L}\p{N}’']+)+`, // le mot composé
  ].join('|'),
  'gu',
);

export function segmentsInsecables(texte: string): Segment[] {
  const segments: Segment[] = [];
  let curseur = 0;
  for (const trouve of texte.matchAll(GROUPE_INSECABLE)) {
    const debut = trouve.index ?? 0;
    if (debut > curseur) segments.push({ texte: texte.slice(curseur, debut), insecable: false });
    segments.push({ texte: trouve[0], insecable: true });
    curseur = debut + trouve[0].length;
  }
  if (curseur < texte.length) segments.push({ texte: texte.slice(curseur), insecable: false });
  return segments;
}
